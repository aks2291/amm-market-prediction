# Automated Market Makers for Prediction Markets

This project demonstrates a Automated Market Makers for Prediction Markets. It provides high liquidity for buy and sell of tokens.

### CLI(`amm`) tool Features

- Support contract interaction from cli tool.
- Support get, buy, sell features directly executed via CLI tool.
- Support get for fetch `fund` and `token` of a user and total token `inventory`
  
Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/sample-script.js
npx hardhat help
npx hardhat console
```
## Deploy and test 
#### Install dependencies

```sh
npm install
```

#### Compile the CPMM smart contract

```sh
npx hardhat compile
```

## 1. Ethereum testnet Ropsten
#### Prerequisite
>1. Get Infura API Key for Ropsten network [link](https://infura.io/)   
>2. Set `INFURA_API_KEY=<your_infura_key>` as environment variable.  
>3. Get dummy ether from Ropsten [faucet](https://faucet.egorfine.com/).  
>4. Set atleast one private key as env `ACCOUNTS="<Private key 1> <Private key2>"`

#### Deploy to Ropsten testnet
```sh
npx hardhat run scripts/deploy.js --network ropsten
```

#### Interact contract using CLI tool `amm`
We are going to run the following to install our package `amm` globally on our machine:
```sh
npm i -g
```
Verify CLI tool install successfully. It returns the all the command available in `amm` CLI
```sh
amm --help
```
Query contract to fetch the current token inventory
```sh
❯ amm get inventory
Contract address: 0x9edF5c6227a2ADCab846210dcb32cF33309C8F06
User account: 0x296b6626db7Ef0C5C3dab75a40844A7E3F872A9C
Tokens in inventory
Total alpha tokens: 10
Total beta tokens: 10
```

Add funds to user's account address. Syntax: 
>`amm addfund <amount> <user_account_index (env variable private key position)>`
```sh
❯ amm addfund 10 0
Contract address: 0x9edF5c6227a2ADCab846210dcb32cF33309C8F06
User account: 0x296b6626db7Ef0C5C3dab75a40844A7E3F872A9C
Adding fund to above mentioned user amount: 10000000000000000000
Transaction submitted to network txnID: 0xbccde036d547aa6771ffbaca6deecae5013d36f7d5719c60d05efd639b081d6f
Transaction Status: 1, BlockNumber: 12320016
```

Verify the recently added fund. Syntax:
>`amm get fund <user_account_index>`
```sh
❯ amm get fund 0
Contract address: 0x9edF5c6227a2ADCab846210dcb32cF33309C8F06
User account: 0x296b6626db7Ef0C5C3dab75a40844A7E3F872A9C
Total fund for above user address
Funds: 10
```

Get the number of tokens in user account(Before buying)
>`amm get token <user account index>`
```sh
❯ amm get token 0
Contract address: 0x9edF5c6227a2ADCab846210dcb32cF33309C8F06
User account: 0x296b6626db7Ef0C5C3dab75a40844A7E3F872A9C
Tokens in above user address
Total alpha tokens: 0
Total beta tokens: 0
```

Buy token with already add fund to user's account
>`amm buy <fund> <tokenType(0/1)> <user_account_index>`
```sh
❯ amm buy 10 0 0
Contract address: 0x9edF5c6227a2ADCab846210dcb32cF33309C8F06
User account: 0x296b6626db7Ef0C5C3dab75a40844A7E3F872A9C
Buying token of type 0 for amount: 10000000000000000000
Transaction submitted to network txnID: 0x04538906c0ccdd97e749722532f685a8b0cb6d0d7fa9a48611566102b1cbdcaf
Transaction Status: 1, BlockNumber: 12320043
```
Get the number of tokens in user account(After buying)
```sh
❯ amm get token 0
Contract address: 0x9edF5c6227a2ADCab846210dcb32cF33309C8F06
User account: 0x296b6626db7Ef0C5C3dab75a40844A7E3F872A9C
Tokens in above user address
Total alpha tokens: 15
Total beta tokens: 0
```
Sell token with already bought tokens to user's account
>`amm sell <tokens> <tokenType(0/1)> <user_account_index>`
```sh
❯ amm sell 15 0 0
Contract address: 0x9edF5c6227a2ADCab846210dcb32cF33309C8F06
User account: 0x296b6626db7Ef0C5C3dab75a40844A7E3F872A9C
Selling tokens 15000000000000000000 of type 0
Transaction submitted to network txnID: 0xd791d14da919e746f4b37d126722cf8e3060a1b6fecc7685a2cbce5e5819c8d4
Transaction Status: 1, BlockNumber: 12320054
```
## 2. Hardhat runtime environment

#### 1. Install dependencies

```sh
npm install
```

#### 2. Compile the CPMM smart contract

```sh
npx hardhat compile
```

#### 3. Deploy the CPMM smart contract to local hardhat environment
```sh
npx hardhat --network localhost run scripts/deploy.js
```

#### 4. Add fund to account
```sh
npx hardhat --network localhost run scripts/addfund.js 
```

#### 5. Buy tokens
```sh
npx hardhat --network localhost run scripts/buy.js 
```

#### 6. Sell tokens
```sh
npx hardhat --network localhost run scripts/sell.js 
```
