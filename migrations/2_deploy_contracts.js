const TMTGToken = artifacts.require('../contracts/TMTGToken.sol')

module.exports = function(deployer) {
    deployer.deploy(TMTGToken);
}