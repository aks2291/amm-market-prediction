const { expect } = require("chai");
const { ethers } = require("hardhat");
const BigNumber = require('bignumber.js');


describe("CPMM AMM contract", function () {

  let Cpmm;
  let cpmm;
  let owner;
  let addr1;
  let addr2;
  let addrs;
  let initialFund = new BigNumber('10000000000000000000');

  beforeEach(async function () {
    Cpmm = await ethers.getContractFactory("CPMM");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    cpmm = await Cpmm.deploy(initialFund.toString());
  });

  describe("Deployment", function () {

    it("Should return initial number of alpha & beta tokens inventory", async function () {

      // Checking the number of alhpa tokens 
      expect(await cpmm.tokensInventory(0)).to.equal(initialFund.toString());

      // Checking the number of beta tokens 
      expect(await cpmm.tokensInventory(1)).to.equal(initialFund.toString());

    });

  });

  describe("Adding funds to user account", function () {
    it("Should return user fund after adding 10$", async function () {

      await cpmm.addFunds(initialFund.toString())
      // Checking the user funds equal to the add amount
      expect((await cpmm.getFunds())).to.equal(initialFund.toString());

    });
  });

  describe("Buying alpha token", async function () {
    let alphaTokens = '15000000000000000000';
    let remainingAlphaTokens = '5000000000000000000';
    let remainingBetaTokens = '20000000000000000000';

    beforeEach(async function () {
      await cpmm.addFunds(initialFund.toString())
      await cpmm.buy(initialFund.toString(), '0')
    })

    it("Should update the user funds to zero", async function () {

      // Checking the user funds balance is update after the buying tokens
      expect((await cpmm.getFunds())).to.equal("0");

    });

    it("Should update the user tokens", async function () {

      // Checking the user tokens is update according to AMM algorithm
      expect((await cpmm.getUserTokens('0'))).to.equal(alphaTokens);

      expect((await cpmm.getUserTokens('1'))).to.equal('0');

    });

    it("Should update the tokens Inventory", async function () {

      // Checking the tokens inventory is update according to AMM algorithm
      // Checking token inventory of alpha tokens
      expect((await cpmm.tokensInventory(0))).to.equal(remainingAlphaTokens);

      // Checking token inventory of beta tokens
      expect((await cpmm.tokensInventory(1))).to.equal(remainingBetaTokens);

    });

    it("Should return error if the current user fund is less than the buy amount", async function(){
      await expect(
        cpmm.buy(initialFund.toString(), '0')
      ).to.be.revertedWith("NOT_SUFFICIENT_BALANCE");
    });
  });

  describe("Buying beta token", async function () {
    let betaTokens           = '15000000000000000000';
    let remainingAlphaTokens = '20000000000000000000';
    let remainingBetaTokens  = '5000000000000000000';

    beforeEach(async function () {
      await cpmm.addFunds(initialFund.toString())
      await cpmm.buy(initialFund.toString(), '1')
    })

    it("Should update the user funds to zero", async function () {

      // Checking the user funds balance is update after the buying tokens
      expect((await cpmm.getFunds())).to.equal("0");

    });

    it("Should update the user tokens", async function () {

      // Checking the user tokens is update according to AMM algorithm
      expect((await cpmm.getUserTokens('0'))).to.equal('0');

      expect((await cpmm.getUserTokens('1'))).to.equal(betaTokens);

    });

    it("Should update the tokens Inventory", async function () {

      // Checking the tokens inventory is update according to AMM algorithm
      // Checking token inventory of alpha tokens
      expect((await cpmm.tokensInventory(0))).to.equal(remainingAlphaTokens);

      // Checking token inventory of beta tokens
      expect((await cpmm.tokensInventory(1))).to.equal(remainingBetaTokens);

    });

    it("Should return error if the current user fund is less than the buy amount", async function(){
      await expect(
        cpmm.buy(initialFund.toString(), '1')
      ).to.be.revertedWith("NOT_SUFFICIENT_BALANCE");
    });
  });

  describe("Selling alpha token", async function () {
    let alphaTokens          = '15000000000000000000';

    beforeEach(async function () {
      await cpmm.addFunds(initialFund.toString())
      await cpmm.buy(initialFund.toString(), '0')
      await cpmm.sell(alphaTokens, '0');
    })

    it("Should update the user funds to 10$", async function () {
      
      // Checking the user funds balance is update after the buying tokens
      expect((await cpmm.getFunds())).to.equal(initialFund.toString());
    });

    it("Should update the user tokens", async function () {

      // Checking the user tokens is update according to AMM algorithm
      expect((await cpmm.getUserTokens('0'))).to.equal('0');

      expect((await cpmm.getUserTokens('1'))).to.equal('0');

    });

    it("Should update the tokens Inventory", async function () {

      // Checking the tokens inventory is update according to AMM algorithm
      // Checking token inventory of alpha tokens
      expect((await cpmm.tokensInventory(0))).to.equal(initialFund.toString());

      // Checking token inventory of beta tokens
      expect((await cpmm.tokensInventory(1))).to.equal(initialFund.toString());

    });

    it("Should return error if the current user token is more than the selling tokens", async function(){
      await expect(
        cpmm.sell(alphaTokens, '0')
      ).to.be.revertedWith("TOKEN_VALUE_IS_LESS_THAN_THE_PROVIDED_VALUE");
    });
  });

  describe("Selling beta token", async function () {
    let betaTokens          = '15000000000000000000';

    beforeEach(async function () {
      await cpmm.addFunds(initialFund.toString())
      await cpmm.buy(initialFund.toString(), '1')
      await cpmm.sell(betaTokens, '1');
    })

    it("Should update the user funds to 10$", async function () {
      
      // Checking the user funds balance is update after the buying tokens
      expect((await cpmm.getFunds())).to.equal(initialFund.toString());
    });

    it("Should update the user tokens", async function () {

      // Checking the user tokens is update according to AMM algorithm
      expect((await cpmm.getUserTokens('0'))).to.equal('0');

      expect((await cpmm.getUserTokens('1'))).to.equal('0');

    });

    it("Should update the tokens Inventory", async function () {

      // Checking the tokens inventory is update according to AMM algorithm
      // Checking token inventory of alpha tokens
      expect((await cpmm.tokensInventory(0))).to.equal(initialFund.toString());

      // Checking token inventory of beta tokens
      expect((await cpmm.tokensInventory(1))).to.equal(initialFund.toString());

    });

    it("Should return error if the current user token is more than the selling tokens", async function(){
      await expect(
        cpmm.sell(betaTokens, '1')
      ).to.be.revertedWith("TOKEN_VALUE_IS_LESS_THAN_THE_PROVIDED_VALUE");
    });
  });
});
