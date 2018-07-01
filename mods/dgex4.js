/**
 * Copyright DGE
 */



const timeTravel = function (time) {
    return new Promise((resolve, reject) => {
        web3.currentProvider.sendAsync({
            jsonrpc: "2.0",
            method: "evm_increaseTime",
            params: [time], // 86400 is num seconds in day
            id: new Date().getTime()
        }, (err, result) => {
            if(err){ return reject(err) }
            return resolve(result)
        });
    })
};

module.exports = {
    core: {

        _engine: null,
        _artifact: null,

        init: function(engine) {
            this._engine = engine;
        },
        components: function(artifact) {
            this._artifact = artifact;
        },
        run: function() {
            var self = this;

            contract (self._engine.core.contract_name(),  function(accounts) {
                const logger = self._engine.core.logger();
                const BigNumber = web3.BigNumber;

                require('chai')
                    .use(require('chai-as-promised'))
                    .use(require('chai-bignumber')(BigNumber))
                    .should();

                let tmtgFinal;

                const [
                    owner,
                    superInvestor,
                    investor,
                    anonymous,
                    superInvestor2,
                    investor2,
                    anonymous2,
                    cex1,
                    cex2,
                    newOwner
                ] = accounts;

                before('setup contract ', async function() {
                    tmtgFinal = await self._artifact.new({from: owner});
                })
        

               
            describe('4. tokenLock test', () => {
                it('4-1', async function(){
                    let monthInSeconds = 2.678e+6;
                    let amt = new BigNumber(1e+25);
                    let amt2 = new BigNumber(5e+24);
                    let amt3 = new BigNumber(5e+23);
                    let rest = new BigNumber(9e+18);

                    logger.debug("0. transfer : " + await amt.should.be.bignumber.equal(amt, await new BigNumber(1e+24)));
                    logger.debug("1. check time : " + await tmtgFinal.checkTime());
                    logger.debug("2. get limit period : " + await tmtgFinal.getLimitPeriod());

                    logger.debug("3. Owner transfers to superInvestor 10M TMTG : " + await tmtgFinal.transfer(superInvestor, amt, {from: owner}));
                    logger.debug("Owner sets superinvestor : " + await tmtgFinal.setSuperInvestor(superInvestor, {from: owner}));
                    logger.debug("superInvestor transfers to investor 5M TMTG : " + await tmtgFinal.transfer(investor, amt2, {from: superInvestor}));
                    logger.debug("superInvestor transfers to investor2 5M TMTG : " + await tmtgFinal.transfer(investor2, amt2, {from: superInvestor}));
                    logger.debug("investor transfers to anyone 9 TMTG right away : " + await tmtgFinal.transfer(investor2, rest, {from: investor}).should.be.fulfilled);
                    logger.debug("investor approves to anyone 9 TMTG right away : " + await tmtgFinal.approve(investor2, rest, {from: investor}).should.be.rejected);
                    logger.debug("investor2 approves to anyone 9 TMTG right away : " + await tmtgFinal.approve(investor, rest, {from: investor2}).should.be.fulfilled);
                    logger.debug("investor2 transfers to anyone 9 TMTG right away : " + await tmtgFinal.transfer(investor, rest, {from: investor2}).should.be.rejected);


                    timeTravel(monthInSeconds); // Aug
                    timeTravel(monthInSeconds); // Sep
                    timeTravel(monthInSeconds); // Oct
                    timeTravel(monthInSeconds); // Nov
                    timeTravel(monthInSeconds); // Dec
                    timeTravel(monthInSeconds); // Jan
                    timeTravel(monthInSeconds); // Feb
                    timeTravel(monthInSeconds); // Mar
                    timeTravel(monthInSeconds); // Apr
                    timeTravel(monthInSeconds); // May

                    logger.debug("get limit period : " + await tmtgFinal.getLimitPeriod());
                    logger.debug("investor transfer to anyone .100M TMTG right away : " + await tmtgFinal.transfer(investor2, amt3 * 10, {from: investor}).should.be.rejected);
                    logger.debug("investor transfer to anyone 105M TMTG right away : " + await tmtgFinal.transfer(investor2, amt3 * 11, {from: investor}).should.be.rejected);
                    logger.debug("investor2 approves to anyone .100M TMTG right away : " + await tmtgFinal.approve(investor, amt3 * 10, {from: investor2}).should.be.fulfilled);
                    logger.debug("investor2 approves to anyone 110M TMTG right away : " + await tmtgFinal.approve(investor, amt3 * 11, {from: investor2}).should.be.rejected);
                    logger.debug("investor2 approves to anyone .100M TMTG right away : " + await tmtgFinal.approve(investor, amt3 * 10, {from: investor2}).should.be.rejected);
                    
                    logger.debug("investor transfer to anyone .100M TMTG right away : " + await tmtgFinal.transfer(investor2, amt3 * 10 - rest, {from: investor}).should.be.fulfilled);

                    //logger.debug("superInvestor transfer to investor 5M TMTG : " + await tmtgFinal.transfer(investor, amt2, {from: superInvestor}));
                    logger.debug("superInvestor : " + await tmtgFinal.balanceOf(superInvestor)/(10**18));
                    logger.debug("owner : " + await tmtgFinal.balanceOf(owner)/(10**18));
                    logger.debug("owner : " + await tmtgFinal.balanceOf(owner));
                    logger.debug("superInvestor2 : " + await tmtgFinal.balanceOf(superInvestor2)/(10**18));
                    logger.debug("investor : " + await tmtgFinal.balanceOf(investor)/(10**18));
                    logger.debug("investor2 : " + await tmtgFinal.balanceOf(investor2)/(10**18));
                    logger.debug("anony : " + await tmtgFinal.balanceOf(anonymous)/(10**18));
                    logger.debug("anjony2 : " + await tmtgFinal.balanceOf(anonymous2)/(10**18));
                    logger.debug("cex1 : " + await tmtgFinal.balanceOf(cex1)/(10**18));
                    logger.debug("cex2 : " + await tmtgFinal.balanceOf(cex2)/(10**18));
                    logger.debug("newOwner : " + await tmtgFinal.balanceOf(newOwner)/(10**18));
                })
            })

            })
        }
    }
}