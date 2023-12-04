## WalletFactory Contract

Now, as the names suggest, the WalletFactory will be used to create and deploy new smart accounts for the user. However, one thing that may be surprising to you if you've never done upgradeable contracts before is that the Wallet contract will also only ever be deployed once to the blockchain.

The WalletFactory will be deploying new instances of a Proxy, instead of new instances of Wallet, every time a new account needs to be created. The deployed Proxy's will point towards the Wallet as their implementation contract - using [delegatecall](https://solidity-by-example.org/delegatecall/) to access the functionality within them. This means the Wallet contract will be generic and allow all users to share the same implementation for their individual proxies.

In the future, if an upgrade is required - let's say Wallet2 - we deploy the new Wallet2 contract to the network once, and have users upgrade their proxy to now point to Wallet2 as the implementation instead of Wallet.

## Wallet Contract

### Creating the BaseAccount

We can start by creating a constructor:
```
import {IEntryPoint} from "account-abstraction/interfaces/IEntryPoint.sol";

contract Wallet {
    address public immutable walletFactory;
    IEntryPoint private immutable _entryPoint;

    constructor(IEntryPoint anEntryPoint, address ourWalletFactory) {
        _entryPoint = anEntryPoint;
        walletFactory = ourWalletFactory;
    }
}
```

- two immutable variables **( walletFactory and _entryPoint)** to keep track of the EntryPoint and the **WalletFactory** addresses

Next, we will extend **Wallet.sol** to inherit from **BaseAccount.sol**, which is the basic account implementation provided by the account-abstraction SDK. We will also implement two necessary functions:

1)  **_validateSignature**: As you might guess, this function will be used to validate the signatures of all the owners of a given smart contract wallet.

2)  **entryPoint**: This function will return the _entryPoint that we have saved in the _entryPoint state variable.

Next, import a few contracts:

```
import {BaseAccount} from "account-abstraction/core/BaseAccount.sol";
import {UserOperation} from "account-abstraction/interfaces/UserOperation.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
```

- **BaseAccount**: This represents the basic account implementation for a smart contract wallet
- **UserOperation**:  This is a struct for representing a UserOperation
- **ECDSA**: This is used to validate signatures through the ECDSA library

Now, let's inherit the BaseAccount contract into Wallet:

```
contract Wallet is BaseAccount {
    ...
    using ECDSA for bytes32;
    address[] public owners;

    ....
    function entryPoint() public view override returns (IEntryPoint) {
        return _entryPoint;

    function _validateSignature(
        UserOperation calldata userOp, // UserOperation data structure passed as input
        bytes32 userOpHash // Hash of the UserOperation without the signatures
    ) internal view override returns (uint256) {
        // Convert the userOpHash to an Ethereum Signed Message Hash
        bytes32 hash = userOpHash.toEthSignedMessageHash();

        // Decode the signatures from the userOp and store them in a bytes array in memory
        bytes[] memory signatures = abi.decode(userOp.signature, (bytes[]));

        // Loop through all the owners of the wallet
        for (uint256 i = 0; i < owners.length; i++) {
            // Recover the signer's address from each signature
            // If the recovered address doesn't match the owner's address, return SIG_VALIDATION_FAILED
            if (owners[i] != hash.recover(signatures[i])) {
                return SIG_VALIDATION_FAILED;
            }
        }
        // If all signatures are valid (i.e., they all belong to the owners), return 0
        return 0;
        }
    }
}
```

- ECDSA is bytes32 allow all bytes32 variables to use the functions in ECDSA - which we can then use to validate signatures as they're passed in as bytes32 values.

This function:

1. Takes in two arguments - **UserOperation** and **userOpHash**. The **userOpHash** is the hash of the **UserOperation** without the signatures.

2. Calls **toEthSignedMessageHash** on the **userOpHash** to return an Ethereum Signed Message.

3. Decodes the signatures from the **userOp**.

4. Uses the recover function from **ECDSA** to get the signer's address from an Ethereum Signed Message and the Signature.

5. Verifies if the recovered address belongs to the correct owners. If not, it returns **SIG_VALIDATION_FAILED**, which is the failure code that the EntryPoint contract expects when signatures fail. This variable is declared in **BaseAccount**.

### Initializing the Proxy Contract

Since our Wallet is going to serve as the implementation contract for individual Proxy instances deployed through the WalletFactory, we need to add an initializer to set the owners (signers) of this wallet.

To achieve this, we will inherit another contract, Initializable. This contract provides us with modifiers like initializer that ensure certain initialization functions only run once.

```
function initialize(address[] memory initialOwners) public initializer {
    _initialize(initialOwners);
}

function _initialize(address[] memory initialOwners) internal {
    require(initialOwners.length > 0, "no owners");
    owners = initialOwners;
    emit WalletInitialized(_entryPoint, initialOwners);
}
```

- **initialize**: This public function has a modifier **initializer**. This modifier ensures that the initialize function can only be called once.

- **_initialize**: This internal function is called from **initialize**. It sets the **owners** and emits the **WalletInitialized** event.

### Executing Transactions

Now, to get started with executing transactions through our smart account - we need to implement **execute** and **executeBatch**. **execute** will be used for executing a single call, whereas **executeBatch** can execute multiple together in a single transaction - to help with things like doing **approve** and *transferFrom* in a single transaction for swapping on a DEX.

Before we write these functions, we need a helper function to make arbitrary function calls through our smart account. We can use the low-level .call(...) method in Solidity for this. Let's create a helper function that also handles errors properly:

```
function _call(address target, uint256 value, bytes memory data) internal {
        (bool success, bytes memory result) = target.call{value: value}(data);
        if (!success) {
            assembly {
                // The assembly code here skips the first 32 bytes of the result, which contains the length of data.
                // It then loads the actual error message using mload and calls revert with this error message.
                revert(add(result, 32), mload(result))
            }
        }
    }
```

In this function, we call the built-in **call** function within the EVM. This function is called with the address of the contract that needs to be called, the amount of ether (**value**), and the **data** which contains the function signatures and any associated arguments.

Next, we need to create a modifier to ensure that **execute** and **executeBatch** are only called from either the **EntryPoint** contract or the **WalletFactory** (which is used to deploy the wallet). 

By ensuring that **EntryPoint** is the middleman for all transactions, we ensure that signature validation has taken place since the **EntryPoint** will validate signatures first before proceeding with the transaction. This is the case is 99% of the cases - except for one - the first ever transaction.

The first ever transaction is also the one where the contract itself will be deployed for the first time through the **initCode** value passed by the **EntryPoint** to the **WalletFactory**. Therefore, it will be the **WalletFactory** which will be calling the functions - so we need to allow that as well.

```
modifier _requireFromEntryPointOrFactory() {
    require(
        msg.sender == address(_entryPoint) || msg.sender == walletFactory,
        "only entry point or wallet factory can call"
    );
    _;
}
```

Now, let's finally write the execute and executeBatch functions:
```
function execute(
    address dest,
    uint256 value,
    bytes calldata func
) external _requireFromEntryPointOrFactory {
    _call(dest, value, func);
}

function executeBatch(
    address[] calldata dests,
    uint256[] calldata values,
    bytes[] calldata funcs
) external _requireFromEntryPointOrFactory {
    require(dests.length == funcs.length, "wrong dests lengths");
    require(values.length == funcs.length, "wrong values lengths");
    for (uint256 i = 0; i < dests.length; i++) {
        _call(dests[i], values[i], funcs[i]);
    }
}
```

Upgradeability and Token Types

Since **Wallet** is the implementation contract for an upgradeable **Proxy**, it should be aware of this and have a function to authorize upgrades to a future improved implementation contract. Additionally, our account should be able to handle tokens other than the native token ETH, such as ERC20s, ERC721s, ERC1155s, and so on.

To accommodate these functionalities, we need to import **UUPSUpgradeable** and **TokenCallbackHandler**. The Z** contract allows for upgradeability, while **TokenCallbackHandler** enables handling of various token types.

Here's how to do it:

```
import {UUPSUpgradeable} from "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import {TokenCallbackHandler} from "account-abstraction/samples/callback/TokenCallbackHandler.sol";

```

For **UUPSUpgradeable**, we also need to override the **_authorizeUpgrade** function so that the upgrade can only happen through **WalletFactory** or **EntryPoint**.

```
function _authorizeUpgrade(
        address
    ) internal view override _requireFromEntryPointOrFactory {}
```

### Helper Functions

```
function encodeSignatures(

    bytes[] memory signatures

) public pure returns (bytes memory) {

    return abi.encode(signatures);

}

function getDeposit() public view returns (uint256) {
    return entryPoint().balanceOf(address(this));
}

function addDeposit() public payable {
    entryPoint().depositTo{value: msg.value}(address(this));
}

receive() external payable {}
```


Here's what each function does:

- encodeSignatures: This function encodes the signatures into a bytes array, which can be used to pass as data when making calls to the contract.

- getDeposit: This function checks the balance of the Wallet within EntryPoint.

- addDeposit: This function adds a deposit for Wallet in EntryPoint.

- receive: This function allows the contract to accept Native Coin.

## WalletFactory

WeThe final contract we need to write is **WalletFactory**, which will be used to deploy and create a new **Wallet.sol**.

```
import {IEntryPoint} from "account-abstraction/interfaces/IEntryPoint.sol";
import {Wallet} from "./Wallet.sol";

contract WalletFactory {
    Wallet public immutable walletImplementation;

    constructor(IEntryPoint entryPoint) {
        walletImplementation = new Wallet(entryPoint, address(this));
    }
}
```

In this contract, we've created a constructor that accepts the **EntryPoint** contract as an argument and initializes **walletImplementation**, which is of type **Wallet**.

Next, we'll write a function to deploy a new **Wallet** proxy. The reason we deploy a proxy instead of the **Wallet** contract itself is to separate the implementation from the contract that actually stores the data. This way, if we want to change the implementation **(Wallet)** in the future, we can do so without affecting the stored data. The final contract address that the EntryPoint address has to call will also remain the same (which would be the proxy).

First, let's import ERC1967Proxy, an implementation of a proxy that can take in an upgradeable implementation contract. This is provided by OpenZeppelin:

```
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
```

To generate the counterfactual address, we use the CREATE2 EVM opcode. OpenZeppelin provides us with a helper contract to use CREATE2, so let's import that as well

```
import {Create2} from "@openzeppelin/contracts/utils/Create2.sol";

```

Now, let's write the getAddress function, which will return the counterfactual address for a to-be-deployed contract:

```
function getAddress(
    address[] memory owners,
    uint256 salt
) public view returns (address) {
    // Encode the initialize function in our wallet with the owners array as an argument into a bytes array
    bytes memory walletInit = abi.encodeCall(Wallet.initialize, owners);
    // Encode the proxyContract's constructor arguments which include the address walletImplementation and the walletInit
    bytes memory proxyConstructor = abi.encode(
        address(walletImplementation),
        walletInit
    );
    // Encode the creation code for ERC1967Proxy along with the encoded proxyConstructor data
    bytes memory bytecode = abi.encodePacked(
        type(ERC1967Proxy).creationCode,
        proxyConstructor
    );
    // Compute the keccak256 hash of the bytecode generated
    bytes32 bytecodeHash = keccak256(bytecode);
    // Use the hash and the salt to compute the counterfactual address of the proxy
    return Create2.computeAddress(bytes32(salt), bytecodeHash);
}
```

Our function takes in a **salt** and the list of the owners of this **Wallet**. It then calculates **walletInit**   which is the calldata for the initialize function in our Wallet contract. Then, it calculates **proxyConstructor** which is the calldata for the constructor for the proxy we will deploy. Then, we calculate bytecode which is the deployment bytecode for the proxy - i.e. contains the code + the constructor calldata. Finally, we calculate the **bytecodeHash** and then use that hash with the salt to compute the counterfactual address.

create a function to actually create a new account

```
function createAccount(
    address[] memory owners,
    uint256 salt
) external returns (Wallet) {
    // Get the counterfactual address
    address addr = getAddress(owners, salt);
    // Check if the code at the counterfactual address is non-empty
    uint256 codeSize = addr.code.length;
    if (codeSize > 0) {
        // If the code is non-empty, i.e. account already deployed, return the Wallet at the counterfactual address
        return Wallet(payable(addr));
    }

    // If the code is empty, deploy a new Wallet
    bytes memory walletInit = abi.encodeCall(Wallet.initialize, owners);
    ERC1967Proxy proxy = new ERC1967Proxy{salt: bytes32(salt)}(
        address(walletImplementation),
        walletInit
    );

    // Return the newly deployed Wallet
    return Wallet(payable(address(proxy)));
}
```

Now here we first call **getAddress** to get the counterfactual address. Then we verify if the contract already exists by checking the code size and if that's the case, we just return the proxy contract at that address. If that is not the case, we deploy a new proxy contract.

First, we create the **walletInit**  which encodes the initialize function within the **Wallet** implementation with the owners. Then we use salt which is used to ensure a predictable and unique address for the proxy contract and send in the arguments for the proxy's constructor which include the address of the wallet implementation along with **walletInit**

# Deploying the Contracts

Let's begin by deploying the WalletFactory. To do this, you'll need to make the following modifications to your **foundry.toml** file

```
[profile.default]
src = "src"
out = "out"
libs = ["lib"]

[rpc_endpoints]
testnet = "${RPC_URL}"
```

Create a .env file within our contracts folder and add the following variables:

```
RPC_URL=YOUR_RPC_URL
PRIVATE_KEY=0x...
```

Now, we need to write a Foundry script to deploy the contract. In your contracts/script folder, create a new file named WalletFactory.s.sol and add the following code:

```
// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.12;

import "forge-std/Script.sol";
import "../src/WalletFactory.sol";
import {IEntryPoint} from "account-abstraction/interfaces/IEntryPoint.sol";

contract WalletFactoryScript is Script {
    // Address of the EntryPoint contract on Goerli
    IEntryPoint constant ENTRYPOINT =
        IEntryPoint(0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789);

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY"); // Fetch the private key from environment variables
        vm.startBroadcast(deployerPrivateKey); // Start broadcasting transactions

        WalletFactory walletFactory = new WalletFactory(ENTRYPOINT); // Initialize the WalletFactory contract

        vm.stopBroadcast(); // Stop broadcasting transactions
    }
}
```

Execute the following commands to deploy contract

```
source .env
forge script script/WalletFactory.s.sol --rpc-url testnet
```

See your **WalletFactory** address in the **contracts/broadcast** folder under WalletFactory.s.sol/run-latest.json.
