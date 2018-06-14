var PTokenSales = artifacts.require("./PTokenSales.sol");

module.exports = function(deployer) {
  deployer.deploy(PTokenSales, 100000, "PaCoin", "PACO", 2, "0x309Ac76512679A9E82e2Cf8Cb5987E2FD5A0e5c0");
};
