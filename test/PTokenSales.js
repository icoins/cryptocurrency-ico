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


    it("Mint Token by 200,000.", function(){
        let contractAddr;
        return PTokenSales.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.address;
        }).then(function(addr){
            contractAddr = addr;
            return tokenInstance.balanceOf(contractAddr);
        }).then(function(balance){
            assert.equal(balance.toNumber(), 0, "Correct contract balance");
            return tokenInstance.totalSupply()
        }).then(function(totalSupply) {
            assert.equal(totalSupply.toNumber(), 100000, "Correct total supply check.");
            return tokenInstance.mintToken(contractAddr, 200000, {from: accounts[1]})
        }).then(function(receipt){
            assert.equal(receipt.logs.length, 2, 'triggers two event');
            assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event');
            assert.equal(receipt.logs[1].event, 'Transfer', 'should be the "Transfer" event');
            return tokenInstance.address;
        }).then(function(addr){
            assert.equal(addr, contractAddr, 'Still in the same contract');
            return tokenInstance.balanceOf(contractAddr);
        }).then(function(balance){
            assert.equal(balance.toNumber(), 200000, "Correct contract balance");
            return tokenInstance.totalSupply()
        }).then(function(totalSupply) {
            assert.equal(totalSupply.toNumber(), 300000, "Correct total supply check.");
        })

    });

    it("Set Sell & Buy Price.", function(){
        return PTokenSales.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.sellPrice();
        }).then(function(sellPrice){
            assert.equal(sellPrice.toNumber(), 0, "Sell Price Before Checked.");
            return tokenInstance.buyPrice();
        }).then(function(buyPrice){
            assert.equal(buyPrice.toNumber(), 0, "Buy Price Before Checked.");
            tokenInstance.setPrices(1, 2, {from: accounts[1]});
            return tokenInstance.sellPrice();
        }).then(function(sellPrice){
            assert.equal(sellPrice.toNumber(), 1, "Sell Price After Checked.");
            return tokenInstance.buyPrice();
        }).then(function(buyPrice){
            assert.equal(buyPrice.toNumber(), 2, "Buy Price After Checked.");
            //tokenInstance.setPrices(1, 2, {from: accounts[1]});
        })

    });


    it("Approve to spend.", function(){
        return PTokenSales.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.balanceOf(accounts[0]);
        }).then(function(balance){
            assert.equal(balance.toNumber(), 250, "Creator/Account[0] has 250 tokens.");
            tokenInstance.approve(accounts[2], 100, {from: accounts[0]});
            return tokenInstance.allowance(accounts[0], accounts[2]);
        }).then(function(reply){
            assert.equal(reply.toNumber(), 100, "Creator has approved account[2] to spend 100 tokens on his behalf.");
            return tokenInstance.balanceOf(accounts[2]);
        }).then(function(balance){
            assert.equal(balance.toNumber(), 0, "Account[2] has Zero balance");
            return tokenInstance.transfer(accounts[3], 100, { from: accounts[2] });
        }).then(function(receipt){
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event');
            assert.equal(receipt.logs[0].args.from, accounts[2], 'logs the account that purchased the tokens');
            assert.equal(receipt.logs[0].args.to, accounts[3], 'logs the number of tokens purchased');
            assert.equal(receipt.logs[0].args.value.toNumber(), 100, 'value of the transfer');
            return tokenInstance.balanceOf(accounts[0]);
        }).then(function(balance){
            assert.equal(balance.toNumber(), 150, "Creator/Account[0] has 150 tokens.");
            return tokenInstance.balanceOf(accounts[3]);
        }).then(function(balance){
            assert.equal(balance.toNumber(), 100, "Account[3] has 100 tokens.");
            return tokenInstance.transfer(accounts[3], 100, { from: accounts[2] });
        }).then(assert.fail).catch(function(error) {
            assert(error.message.indexOf('revert') >= 0, 'error when Account[2] tring to transfer more then alloted.');
        })
    });



    it("Sell & Buy ether.", function(){

        let contractAddr;
        const buyAccount = accounts[3];

        return PTokenSales.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.address;
        }).then(function(addr){
            contractAddr = addr;
            return tokenInstance.balanceOf(accounts[0]);
        }).then(function(balance){
            assert.equal(balance.toNumber(), 250, "Creator Account has 250 tokens.");
            return tokenInstance.balanceOf(buyAccount);
        }).then(function(balance){
            assert.equal(balance.toNumber(), 0, "buyAccount has 0 tokens.");
            return tokenInstance.transfer(buyAccount, 100, {from:accounts[0]});
        }).then(function(receipt){
            return tokenInstance.balanceOf(buyAccount);
        }).then(function(balance){
            assert.equal(balance.toNumber(), 100, "buyAccount has 100 tokens.");
            return tokenInstance.buy({ from: buyAccount, value: 10 });
        }).then(function(receipt){
            
            //console.log(receipt.logs[0].args.value.toNumber());
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event');
            assert.equal(receipt.logs[0].args.from, contractAddr, 'logs the account that purchased the tokens');
            assert.equal(receipt.logs[0].args.to, buyAccount, 'logs the number of tokens purchased');
            //assert.equal(receipt.logs[0].args.value.toNumber(), 100, 'value of the transfer');
            return tokenInstance.balanceOf(buyAccount);
        }).then(function(balance){
            assert.equal(balance.toNumber(), 100, "buyAccount has 100 tokens.");
            return tokenInstance.balanceOf(contractAddr);
        }).then(function(balance){
            assert.equal(balance.toNumber(), 200000, "Contract Account has 200,000 tokens.");
            return tokenInstance.sell(1, { from: buyAccount });
        }).then(function(receipt){
            
            //console.log(receipt);
            //assert.equal(receipt.status, '0x01', 'triggers one event');
            //assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event');
            //assert.equal(receipt.logs[0].args.from, contractAddr, 'logs the account that purchased the tokens');
            //assert.equal(receipt.logs[0].args.to, buyAccount, 'logs the number of tokens purchased');
            //assert.equal(receipt.logs[0].args.value.toNumber(), 100, 'value of the transfer');
            return tokenInstance.balanceOf(buyAccount);
        }).then(function(balance){
            assert.equal(balance.toNumber(), 99, "buyAccount has 99 tokens.");
            return tokenInstance.balanceOf(contractAddr);
        }).then(function(balance){
            assert.equal(balance.toNumber(), 200001, "Contract Account has 200,001 tokens.");
        })
    });


    it("Freeze Account.", function(){

        return PTokenSales.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.freezeAccount(accounts[3], true, {from:accounts[2]});
        }).then(assert.fail).catch(function(error) {
            return tokenInstance.freezeAccount(accounts[3], true, {from:accounts[1]});
        }).then(function(receipt){
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'FrozenFund', 'should be the "FrozenFund" event');
            assert.equal(receipt.logs[0].args.target, accounts[3], 'account froozen');
            assert.equal(receipt.logs[0].args.frozen, true, 'account froozen status');

            return tokenInstance.frozenAccount(accounts[3]);
            
        }).then(function(status){
            assert.equal(status, true, 'account froozen status is true');
        }).then(function(){
            return tokenInstance.freezeAccount(accounts[3], false, {from:accounts[1]});
        }).then(function(receipt){
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'FrozenFund', 'should be the "FrozenFund" event');
            assert.equal(receipt.logs[0].args.target, accounts[3], 'account froozen');
            assert.equal(receipt.logs[0].args.frozen, false, 'account froozen status');

            return tokenInstance.frozenAccount(accounts[3]);
            
        }).then(function(status){
            assert.equal(status, false, 'account froozen status is false');
        })

    });


})

//.then(function(){})
//.then(assert.fail).catch(function(error) {})