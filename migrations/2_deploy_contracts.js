var PTokenSales = artifacts.require("./PTokenSales.sol");

module.exports = function(deployer) {
  deployer.deploy(PTokenSales);
};
