// migrations/1_deploy_contract.js
const DragonNFT = artifacts.require("DragonNFT");

module.exports = function (deployer) {
  deployer.deploy(DragonNFT);
};
