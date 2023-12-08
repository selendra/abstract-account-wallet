# abstract-account-wallet

## download selendra
wget https://github.com/selendra/selendra/releases/download/v1.0.0/selendra

## allow execute
chmod +x selendra

## move selendra to user/bin
sudo mv selendra /usr/bin

## create systemd file 
sudo nano /etc/systemd/system/selendra-validator.service

```
    [Unit]
    Description=Selendra Validator

    [Service]
    ExecStart=selendra --validator --name <Name-of-validator> --base-path <path-to-save-selendra-db> --port 30333 --rpc-port 9933
    Restart=always
    RestartSec=120

    [Install]
    WantedBy=multi-user.target
```

### start selendra validator
sudo systemctl enable selendra-validator.service
sudo systemctl start selendra-validator.service

### check selendra-validaor status
sudo systemctl status selendra-validator.service

### check Selendra-validtor live
sudo journalctl -f -u selendra-validator

### check on telemerty
https://telemetry.polkadot.io/#/0x9ac2f3be66445ad9c6fb765555d4cccdd2bcb8bbb5e2626a1efdaeb6f3bd3267


## if every work property

### Get Validator key
curl -H "Content-Type: application/json" -d '{"id":1, "jsonrpc":"2.0", "method": "author_rotateKeys", "params":[]}' http://localhost:9933