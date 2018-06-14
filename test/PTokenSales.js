var PTokenSales = artifacts.require("./PTokenSales.sol");

contract('PTokenSales', function(accounts){
    var tokenInstance;
    //var contractAddr = "0xC1CB296A45b606d28086b576F6073232a527F5B9";
    var contractAddr = "0x09d4ef11245e220abbbeb3db24fdccea69fc433a";
    var creator = "0xD1E7FEBDE08075a61a259Ec059a79e6559B707b3";// accounts[0]
    var admin = "0x309Ac76512679A9E82e2Cf8Cb5987E2FD5A0e5c0";// accounts[1]
    var user01 = "0xaF5D7d63417E233E602072A7dA3fd91148139114";// accounts[2]
    var user02 = "0x97803364CB428568470332272Faa4860Ed559395";// accounts[3]
    var user03 = "0x49c973B374d1B57718514d5F804090C71817cd58";// accounts[4]
    var user04 = "0xED03c74Edece23815b7c5e84A50c6520e1D82e28";// accounts[5]
    var user05 = "0xcf7191a2797AA1bbeAa320cF22d117823d9D1Ae3";// accounts[6]
 

    it("Initialized the Token.", function(){
        return PTokenSales.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.address;
        }).then(function(address){
            //console.log("Contract Address", address);
            assert.notEqual(address, 0x0, 'Has Contract Address');
            return tokenInstance.name();
        }).then(function(name){
            assert.equal(name, "PaCoin", "Name is correct");
            return tokenInstance.totalSupply();
        }).then(function(totalSupply){
            assert.equal(totalSupply, 100000, "Total Supply is correct");
            return tokenInstance.difficulty();
        }).then(function(difficulty){
            // DIFFICULTY CHECK HERE
            return tokenInstance.sellPrice();
        }).then(function(sellprice){
            assert.equal(sellprice, 0, "Sell Price is correct");
            return tokenInstance.buyPrice();
        }).then(function(buyprice){
            assert.equal(buyprice, 0, "Buy Price is correct");
            return tokenInstance.standard();
        }).then(function(standard){
            assert.equal(standard, "PaCoin", "Standard is correct");
            return tokenInstance.decimals();
        }).then(function(decimals){
            assert.equal(decimals.toNumber(), 2, "Decimals is correct");
            return tokenInstance.balanceOf(admin);
        }).then(function(balance){
            assert.equal(balance.toNumber(), 100000, "Admin balance is correct");
            return tokenInstance.balanceOf(creator);
        }).then(function(balance){
            assert.equal(balance.toNumber(), 0, "Creator balance is correct");
            //return tokenInstance.balanceOf(admin);
        })
    });

    it("Token transfer - 250 PACO", function(){
        
        return PTokenSales.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.admin();
        }).then(function(adminAddr){
            // Check is admin account
            assert.equal(adminAddr, accounts[1], "Correct Admin Account Address.");
            return tokenInstance.balanceOf(accounts[1]);
        }).then(function(balance){
            // Check balance of admin account
            assert.equal(balance.toNumber(), 100000, "Admin balance is correct which is 100000");
            return tokenInstance.balanceOf(accounts[0]);
        }).then(function(balance){
            // Check balance of the creator account
            assert.equal(balance.toNumber(), 0, "User balance has zero correct");
            return tokenInstance.frozenAccount(accounts[1]);
        }).then(function(reply){
            // Check admin account folzen or not.
            assert.equal(reply, false, 'Admin Account is not frozen.');
            return tokenInstance.transfer.call(accounts[0], 100001, {from : accounts[1]});
        }).then(assert.fail).catch(function(error) {
            // Sending exist / over amount.
            assert(error.message.indexOf('revert') >= 0, 'error message must contain revert');
            return tokenInstance.transfer.call(accounts[0], 250, { from: accounts[1] });
        }).then(function(success) {
            // SENDING EXIST AMOUNT
            return tokenInstance.transfer(accounts[0], 100001, {from : accounts[1]});
        }).then(assert.fail).catch(function(error) {
            // Sending exist / over amount.
            assert(error.message.indexOf('revert') >= 0, 'error message must contain revert');
            return tokenInstance.transfer(accounts[0], 250, { from: accounts[1] });
        }).then(function(receipt) {
            // Verifying the receipt after transfer
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event');
            assert.equal(receipt.logs[0].args.from, accounts[1], 'logs the account that purchased the tokens');
            assert.equal(receipt.logs[0].args.to, accounts[0], 'logs the number of tokens purchased');
            assert.equal(receipt.logs[0].args.value.toNumber(), 250, 'value of the transfer');
            return tokenInstance.balanceOf(accounts[1]);
        }).then(function(balance){
            assert.equal(balance.toNumber(), 99750, "Admin balance is correct which is 99750");
            return tokenInstance.balanceOf(accounts[0]);
        }).then(function(balance){
            assert.equal(balance.toNumber(), 250, "Creator balance is correct which is 250");
        })
    });

})

//.then(function(){})