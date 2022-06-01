const hre = require("hardhat");
const BigNumber = require('bignumber.js');
const fs = require('fs');
const chalk = require("chalk");

async function main() {
    let fund = new BigNumber('10000000000000000000');
    let accountIndex = 0
    const Cpmm = await hre.ethers.getContractFactory("CPMM");
    const byteData = fs.readFileSync('contract_address.txt');
    const contractAddress = byteData.toString();
    const cpmm = await Cpmm.attach(contractAddress);
    const signer1 = await hre.ethers.getSigners();
    const contract = await cpmm.connect(signer1[accountIndex])
  
    await contract.addFunds(fund.toString())
    console.log(chalk.green.bold("Fund add to user's account"))
  } 
  

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
