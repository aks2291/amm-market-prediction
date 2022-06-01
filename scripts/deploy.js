const hre = require("hardhat");
const BigNumber = require('bignumber.js');
const fs = require('fs')

let initialFund = new BigNumber('10000000000000000000');

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Cpmm = await ethers.getContractFactory("CPMM");
  const cpmm = await Cpmm.deploy(initialFund.toString());
  await cpmm.deployed();
  console.log("CPMM deployed address:", cpmm.address);
  fs.writeFileSync('contract_address.txt', cpmm.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
