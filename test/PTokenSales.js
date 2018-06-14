var PTokenSales = artifacts.require("./PTokenSales.sol");

contract('PTokenSales', function(accounts){

    it("Initialized the Token.", function(){
        return PTokenSales.deployed().then(function(instance){
            tokenInstance = instance;
            console.log(tokenInstance);
        })
    });

})