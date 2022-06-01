const chalk = require('chalk')
const ethers = require("ethers");
const BigNumber = require('bignumber.js');
const fs = require('fs')

async function getPrivateKey(index) {
    const accounts = process.env.ACCOUNTS.split(' ');
    if (accounts.length <= index) {
        throw new Error("no private keys at this index")
    } else {
        return accounts[index]
    }
}

async function getContract(user) {
    try {
        if (user == undefined || (user < 0 || user >= 2)) {
            user = 0
        }
        const byteData = fs.readFileSync('contract_address.txt');
        const contractAddress = byteData.toString();
        const provider = new ethers.providers.InfuraProvider('ropsten', process.env.INFURA_API_KEY)

        const { abi } = require('../artifacts/contracts/Cpmm.sol/CPMM.json')
        let privateKey = await getPrivateKey(user)
        let wallet = new ethers.Wallet(privateKey, provider);

        let contract = new ethers.Contract(contractAddress, abi, provider);
        let contractWithSigner = contract.connect(wallet);
        console.log(chalk.cyan.bold(`Contract address: ${contractAddress}`))
        console.log(chalk.blue.bold(`User account: ${contractWithSigner.signer.address}`))

        return contractWithSigner
        
    } catch (error) {
        throw new Error("Unable to create contract connection" + error.toString())
    }

}

async function getInventoryTokens(cpmm) {
    if (cpmm == undefined) {
        throw new Error("undefined contract handler");
    }
    let alpha = await cpmm.tokensInventory(0);
    let beta = await cpmm.tokensInventory(1);
    return [alpha.toString(), beta.toString()]
}

async function getUserTokens(cpmm) {
    if (cpmm == undefined) {
        throw new Error("undefined contract handler");
    }
    let alpha = await cpmm.getUserTokens(0);
    let beta = await cpmm.getUserTokens(1);
    return [alpha.toString(), beta.toString()]
}

module.exports = {
    getContract,
    getInventoryTokens,
    getUserTokens
}