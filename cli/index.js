#! /usr/bin/env node
const {program} = require('commander')
const {get, addfund, buy, sell} = require('./command')
// commands
program
    .command('get <type> [value]')
    .description('Get result based on type(fund, inventory, token) and value(accountIndex)')
    .action(get)

program
    .command('addfund <amount> <account_index>')
    .description('Add fund to the user account syntax : amm addfund <fund amount> <account index 0 to no of private keys>')
    .action(addfund)

program // amount, tokenType, account_index
    .command('buy <amount> <tokenType> <account_index>')
    .description('Buy token of type(tokenType 0/1) for amount with user <account index 0 to no of private keys>')
    .action(buy)

program // token, tokenType, account_index)
    .command('sell <token> <tokenType> <account_index>')
    .description('Sell token of type(tokenType 0/1) with user <account index 0 to no of private keys>')
    .action(sell)
program.parse()