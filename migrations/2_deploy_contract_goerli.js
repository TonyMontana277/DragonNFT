// migrations/2_deploy_contract_goerli.js
const DragonNFT = artifacts.require("DragonNFT");

module.exports = function (deployer, network) {
  if (network === "goerli") {
    deployer.deploy(DragonNFT);
  }
};
