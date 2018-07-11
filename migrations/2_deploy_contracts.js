const TMTGToken = artifacts.require('../contracts/TMTG.sol')



module.exports = function(deployer) {
    deployer.deploy(TMTGToken);
}