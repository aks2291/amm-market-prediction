const chalk = require('chalk')
const BigNumber = require('bignumber.js');
const { getContract, getInventoryTokens, getUserTokens } = require('./helper');
const {ethers} = require('ethers');


async function get(type, value) {
    let cpmm
    switch (type) {
        case "inventory":
            try {
                cpmm = await getContract(value)
            } catch (error) {
                console.log(chalk.red.bold("Fail to create signerContract", error.toString()))
            }
            let invTokens = await getInventoryTokens(cpmm)
            console.log(chalk.green.bold("Tokens in inventory"))
            console.log(chalk.cyan(`Total alpha tokens: ${new BigNumber(invTokens[0]).shiftedBy(-18).toString()}`))
            console.log(chalk.cyan(`Total beta tokens: ${new BigNumber(invTokens[1]).shiftedBy(-18).toString()}`))
            break;
        case "fund":
            try {
                cpmm = await getContract(value)
            } catch (error) {
                console.log(chalk.red.bold("Fail to create signerContract", error.toString()))
            }
            let fund = await cpmm.getFunds()
            console.log(chalk.green.bold("Total fund for above user address"))
            console.log(chalk.cyan(`Funds: ${new BigNumber(fund.toString()).shiftedBy(-18).toString()}`))
            break;
        case "token": 
        try {
            cpmm = await getContract(value)
        } catch (error) {
            console.log(chalk.red.bold("Fail to create signerContract", error.toString()))
        }
            let tokens = await getUserTokens(cpmm)
            console.log(chalk.green.bold("Tokens in above user address"))
            console.log(chalk.cyan(`Total alpha tokens: ${new BigNumber(tokens[0]).shiftedBy(-18).toString()}`))
            console.log(chalk.cyan(`Total beta tokens: ${new BigNumber(tokens[1]).shiftedBy(-18).toString()}`))
        default:
        // code block
    }
}

async function addfund(amount, account_index) {
    try {
        cpmm = await getContract(account_index)
    } catch (error) {
        console.log(chalk.red.bold("Fail to create signerContract", error.toString()))
    }
    let amountWithPrecision = new BigNumber(amount.toString()).shiftedBy(18).toString()
    
    console.log(chalk.green(`Adding fund to above mentioned user amount: ${amountWithPrecision.toString()}`))
    let txn = await cpmm.addFunds(amountWithPrecision.toString())
    console.log(chalk.yellow(`Transaction submitted to network txnID: ${txn.hash}`))
    let response = await txn.wait()
    console.log(chalk.cyan.bold(`Transaction Status: ${response.status}, BlockNumber: ${response.blockNumber}`))
}

async function buy(amount, tokenType, account_index) {
    try {
        cpmm = await getContract(account_index)
    } catch (error) {
        console.log(chalk.red.bold("Fail to create signerContract", error.toString()))
    }
    let amountWithPrecision = new BigNumber(amount.toString()).shiftedBy(18).toString()
    
    console.log(chalk.green(`Buying token of type ${tokenType.toString()} for amount: ${amountWithPrecision.toString()}`))
    let txn = await cpmm.buy(amountWithPrecision.toString(), tokenType.toString())
    console.log(chalk.yellow(`Transaction submitted to network txnID: ${txn.hash}`))
    let response = await txn.wait()
    console.log(chalk.cyan.bold(`Transaction Status: ${response.status}, BlockNumber: ${response.blockNumber}`))
}

async function sell(token, tokenType, account_index) {
    try {
        cpmm = await getContract(account_index)
    } catch (error) {
        console.log(chalk.red.bold("Fail to create signerContract", error.toString()))
    }
    let tokenWithPrecision = new BigNumber(token.toString()).shiftedBy(18).toString()
    
    console.log(chalk.green(`Selling tokens ${tokenWithPrecision.toString()} of type ${tokenType.toString()}`))
    let txn = await cpmm.sell(tokenWithPrecision.toString(), tokenType.toString())
    console.log(chalk.yellow(`Transaction submitted to network txnID: ${txn.hash}`))
    let response = await txn.wait()
    console.log(chalk.cyan.bold(`Transaction Status: ${response.status}, BlockNumber: ${response.blockNumber}`))
}

module.exports = {
    get,
    addfund,
    buy,
    sell
}
