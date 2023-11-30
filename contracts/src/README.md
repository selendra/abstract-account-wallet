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