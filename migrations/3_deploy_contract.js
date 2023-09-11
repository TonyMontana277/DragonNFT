const DragonNFT = artifacts.require("DragonNFT");

module.exports = function (deployer, network) {
  if (network === "polygon") {
    deployer.deploy(DragonNFT);
  }
};
