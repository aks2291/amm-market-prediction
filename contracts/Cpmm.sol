// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// import "hardhat/console.sol";

contract CPMM {
    uint256 private initialFund;
    uint256 private invariant;
    
    // 0 index = Alpha token
    // 1 index = Beta tokens
    uint256 private numberOfTokens = 2;
    uint256[2] public tokensInventory;

    // usersTokens mapping
    mapping(address => uint256[2]) private userTokens;
    // users Fund mapping
    mapping(address => uint256) private userFunds;

    // _initialFund value in not terms of 10**18
    constructor(uint256 _initialFund) {
        initialFund = _initialFund;
        invariant = initialFund**2;
        for (uint8 i = 0; i < numberOfTokens; i++) {
            tokensInventory[i] = initialFund;
        }
    }

    // Generate both the alpha and beta tokens in terms of 10**18 before buy
    function generateTokens(uint256 fund) internal {
        for (uint8 i = 0; i < numberOfTokens; i++) {
            tokensInventory[i] = tokensInventory[i] + fund;
        }
    }

    // Remove both the alpha and beta tokens in terms of 10**18 after sell
    function substractTokens(uint256 fund) internal {
        for (uint8 i = 0; i < numberOfTokens; i++) {
            tokensInventory[i] = tokensInventory[i] - fund;
        }
    }

    // Returns total inventory sum to all the tokens
    function totalInventory() internal view returns(uint256 total){
        total = 0;
        for (uint8 i = 0; i < numberOfTokens; i++) {
            total = total + tokensInventory[i];
        }
    }

    // Buy function calculation baseed on the CPMM(constant product market maker) algorithm
    // fund should be in with 10**18
    function buy(uint256 fund, uint8 tokenType) public {
        require(tokenType < numberOfTokens, "TOKEN_NOT_FOUND");
        require(fund <= userFunds[msg.sender], "NOT_SUFFICIENT_BALANCE");
        userFunds[msg.sender] = userFunds[msg.sender] - fund;
        uint256 product = 1;
        generateTokens(fund);
        for (uint256 i = 0; i < numberOfTokens; i++) {
            if (i != tokenType) {
                product = product * tokensInventory[i];
            }
        }

        uint256 delta = invariant / product;
        require(tokensInventory[tokenType] > delta, "BUY_NOT_POSSIBLE");
        uint256 userShare = tokensInventory[tokenType] - delta;
        tokensInventory[tokenType] = tokensInventory[tokenType] - userShare;
        userTokens[msg.sender][tokenType] = userTokens[msg.sender][tokenType] + userShare;
    }

    // Sell function calculation baseed on the CPMM(constant product market maker) algorithm
    // tokenamout should be in with 10**18
    function sell(uint256 tokenAmount, uint8 tokenType) public {
        require(tokenType < numberOfTokens, "TOKEN_NOT_FOUND");
        require(userTokens[msg.sender][tokenType] >= tokenAmount, "TOKEN_VALUE_IS_LESS_THAN_THE_PROVIDED_VALUE");

        // using Sridharacharya Method ax^2 + bx + a = 0
        // roots are (-b +/-(sqrt(b^2 - 4ac)))/2a
        uint256 b = totalInventory() + tokenAmount;

        //4ac
        uint8 inverseTokenType = (tokenType + 1)% 2;
        uint256 fourAC = 4*tokenAmount*tokensInventory[inverseTokenType];

        //b^2
        uint256 bSquare = b**2;
        require(bSquare >= fourAC, "NOT_VALID_SELL_CALCULATION");
        uint256 determintant = sqrt(bSquare - fourAC);

        require(b > determintant, "NOT_VALID_SELL_CALCULATION");
        uint256 x = (b-determintant)/2;
        tokensInventory[tokenType] = tokensInventory[tokenType] + tokenAmount;
        userTokens[msg.sender][tokenType] = userTokens[msg.sender][tokenType] - tokenAmount;
        substractTokens(x);
        userFunds[msg.sender] = userFunds[msg.sender] + x;
    }

    //add funds to the user account in userFunds in map
    function addFunds(uint256 fund) public {
        userFunds[msg.sender] = userFunds[msg.sender] + fund;
    }

    //get funds of the user account from userFunds in map
    function getFunds() public view returns(uint256) {
        return userFunds[msg.sender];
    }
    // Get the user tokens
    function getUserTokens(uint8 tokenType) public view returns (uint256) {
        return userTokens[msg.sender][tokenType];
    }

    //Square root calculation
    function sqrt(uint256 x) internal pure returns (uint256 y) {
        uint256 z = (x + 1) / 2;
        y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
    }
}
