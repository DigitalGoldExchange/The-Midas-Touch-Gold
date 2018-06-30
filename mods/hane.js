/**
 * Copyright DGE
 */
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

                let tmtgFinal
                const [
                    owner,
                    superInvestor,
                    investor,
                    anonymous,
                    superInvestor2,
                    investor2,
                    anonymous2,
                    cex1,
                    cex2
                ] = accounts;
                
                before('setup contract ', async function() {
                    tmtgFinal = await self._artifact.new({from: owner});
                })
                logger.debug(":: Start ::========================================")
                
                it('0--1. owner fail', async function(){
                    logger.debug("0--1. owner fail " + "S : " + superInvestor);
                    assert.equal(await tmtgFinal.owner(), superInvestor)
                })
                it('0--2. tokenName fail', async function(){
                    logger.debug("0--2. tokenName fail " + "S : " + "The Midas Touch Silver");
                    assert.equal(await tmtgFinal.name(), "The Midas Touch Silver");
                })
                it('0--3. decimals check Fail', async function(){
                    logger.debug("0--3. decimals check Fail " + "S :" + 19);
                    assert.equal(await tmtgFinal.decimals(), 19);
                })
                it('0--4. totalSupply check Fail', async function(){
                    var num = new BigNumber(1e+28);
                    logger.debug("0--4. totalSupply check Fail :" + num+1);
                    assert.equal(await tmtgFinal.totalSupply(), num+1);
                })
                it('0--5. Pause fail', async function(){
                    logger.debug("0-5. pause check Fail");
                    await tmtgFinal.pause({from: anonymous}).should.be.fulfilled;
                    
                })
                it('0--6. setting superInvestor fail', async function(){
                    logger.debug("0-6. setSuperInvestor fail");
                    await tmtgFinal.setSuperInvestor(superInvestor);
                    await tmtgFinal.setSuperInvestor(superInvestor2,{from:anonymous});
                })
                it('0--7. unpause fail', async function(){
                    logger.debug('0-7. unpause fail');
                    await tmtgFinal.unpause({from:superInvestor});
                })
                it('0--8. pause', async function(){
                    logger.debug('0-8. pause fail');
                    await tmtgFinal.pause({from:investor});
                })
                it('0--9. INITIAL_SUPPLY fail', async function(){
                    const initialSupply = await tmtgFinal.INITIAL_SUPPLY();
                    logger.debug('0-9. INITIAL_SUPPLY fail' + new BigNumber(initialSupply));
                    (await initialSupply).should.be.bignumber.equal(1e+27);
                    
                })
                it('0--10. blacklisting', async function(){
                    logger.debug('0-10. blacklisting fail');
                    await tmtgFinal.blacklisting(anonymous2,{from:superInvestor});
                    
                })
                it('0--11. symbol', async function(){
                    assert.equal(tmtgFinal.symbol(), "MDG");
                })
                it('0--12. transferOwnership', async function(){
                    assert.equal(await tmtgFinal.owner(), investor);
                    await tmtgFinal.transferOwnership(owner,{from:investor});
                })
                //-----------------------------------------------------------------------------
                it('0-1. owner check', async function(){
                    logger.debug("0-1. tokenName check : " + tmtgFinal.owner() + "S : " + owner);
                    assert.equal(await tmtgFinal.owner(), owner)
                })
                it('0-2. tokenName check', async function(){
                    logger.debug("0-2. tokenName check : " + tmtgFinal.name() + "S : " + "The Midas Touch Gold");
                    assert.equal(await tmtgFinal.name(), "The Midas Touch Gold");
                }) 
                it('0-3. decimals check Success', async function(){
                    logger.debug("0-3. tokenName check : " + tmtgFinal.name() + "S : " + 18);
                    assert.equal(await tmtgFinal.decimals(), 18);
                })
                it('0-4. totalSupply check', async function(){
                    
                    const totalSupply = await tmtgFinal.totalSupply();
                    logger.debug("0-4. totalSupply check : " + tmtgFinal.balanceOf(owner) + "S :" + new BigNumber(totalSupply));
                    (await tmtgFinal.balanceOf(owner)).should.be.bignumber.equal(totalSupply);
                    //assert.equal((await tmtgFinal.balanceOf(owner)), new BigNumber(totalSupply));
                })
                it('0-5. Pause', async function(){
                    logger.debug("0-5. pause check");
                    await tmtgFinal.pause({from: owner}).should.be.fulfilled;
                })

                it('0-6. setting superInvestor', async function(){
                    logger.debug("0-6. setSuperInvestor");
                    await tmtgFinal.setSuperInvestor(superInvestor);
                })
                
                it('0-7. unpause', async function(){
                    logger.debug('0-7. unpause');
                    await tmtgFinal.unpause({from:owner});
                })

                it('0-8. pause', async function(){
                    logger.debug('0-8. pause');
                    await tmtgFinal.pause({from:owner});
                })

                it('0-9. INITIAL_SUPPLY', async function(){
                    const initialSupply = await tmtgFinal.INITIAL_SUPPLY();
                    logger.debug('0-9. INITIAL_SUPPLY' + new BigNumber(initialSupply));
                    (await initialSupply).should.be.bignumber.equal(1e+28);
                    
                })

                it('0-10. blacklisting', async function(){
                    
                    await tmtgFinal.blacklisting(investor2,{from:owner});
                    await tmtgFinal.transfer(owner,{from:investor2}).should.be.rejected;
                })

                it('0-11. symbol', async function(){
                    assert.equal(await tmtgFinal.symbol(), "TMTG");
                })

                it('0-12. transferOwnership', async function(){
                    assert.equal(await tmtgFinal.owner(), owner);
                    await tmtgFinal.transferOwnership(investor,{from:owner});
                    assert.equal(await tmtgFinal.owner(), investor);
                })

                it('0-13. setCEx', async function(){
                    await tmtgFinal.setCEx(cex1, {from:owner}).should.be.fulfilled;   
                })

                it('0-14. delCEx', async function(){
                    await tmtgFinal.delCEx(cex1, {from:owner}).should.be.fulfilled;
                })

                it('', async function(){})
                
                
                        
            
            
            }) // end owner
        }
    }
}