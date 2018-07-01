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
                ///**
                  
                 
               // -------------------------------------------기능&단위 테스트-----------------------------------------------------------------------
                logger.debug(":: 기능&단위 테스트 Start ::========================================");
                describe('basic function & unit test', ()=>{

                
                    it('0. name check', async function(){
                        var name = "The Midas Touch Gold";
                        logger.debug("0. name : " + assert.equal(name, await tmtgFinal.name()));  
                    })
                    it('1. superInvestor check', async function(){
                        assert.equal(owner, await tmtgFinal.owner());
                        logger.debug("1. setSuperInvestor : " + await tmtgFinal.setSuperInvestor(superInvestor, {from:owner}));
                        logger.debug("1. superInvestor : " + await tmtgFinal.superInvestor(superInvestor));
                        logger.debug("1. delSuperInvestor : " + await tmtgFinal.delSuperInvestor(superInvestor,{from:owner}).should.be.fulfilled);
                        logger.debug("1. superInvestor : " + await tmtgFinal.setSuperInvestor(superInvestor, {from:owner}));
                        logger.debug("1. setSuperInvestor : " + await tmtgFinal.setSuperInvestor(superInvestor, {from:owner}).should.be.fulfilled);
                        logger.debug("1. superInvestor(rejected) : " + await tmtgFinal.setSuperInvestor(superInvestor2,{from:anonymous}).should.be.rejected);
                        logger.debug("1. superInvesto(rejected) : " + await tmtgFinal.delSuperInvestor(superInvestor,{from:anonymous}).should.be.rejected);
                    })
                
                    it('2. totalSupply check', async function(){    
                        const totalSupply = new BigNumber(1e+28);
                        logger.debug("2. totalSupply : " + (await tmtgFinal.balanceOf(owner)).should.be.bignumber.equal(await tmtgFinal.totalSupply()));
                        logger.debug("2. totalSupply : " + (await tmtgFinal.balanceOf(owner)).should.be.bignumber.equal(totalSupply));
                    })
                    it('3. regiInvestor check', async function(){
                        logger.debug("3. regiInvestor : " + (await tmtgFinal.regiInvestor(investor,{from:owner}).should.be.fulfilled));
                        logger.debug("3. regiInvestor(rejected) : " + (await tmtgFinal.regiInvestor(investor, {from:superInvestor}).should.be.rejected));
                        logger.debug("3. investorList : " + (await tmtgFinal.investorList(investor).should.be.fulfilled));
                        logger.debug("3. investorList : " + (await tmtgFinal.investorList(anonymous).should.be.fulfilled));
                        
                    })
                    it('4. delInvestor check', async function(){
                        logger.debug("4. delInvestor : " + (await tmtgFinal.delInvestor(investor,{from:owner}).should.be.fulfilled));
                        logger.debug("4. investorList : " + (await tmtgFinal.investorList(investor).should.be.fulfilled));
                        logger.debug("4. regiInvestor : " + (await tmtgFinal.regiInvestor(investor,{from:owner}).should.be.fulfilled));
                        logger.debug("4. investorList : " + (await tmtgFinal.investorList(investor).should.be.fulfilled));
                    })
                    it('5. INITIAL_SUPPLY check', async function(){
                        const totalSupply = new BigNumber(1e+28);
                        logger.debug("5. INITIAL_SUPPLY : " + (await tmtgFinal.balanceOf(owner)).should.be.bignumber.equal(await tmtgFinal.INITIAL_SUPPLY()));
                    })
                    it('6. decimals check', async function(){
                        logger.debug("6. decimals : " + assert.equal(await tmtgFinal.decimals(), 18));
                    })
                    //investor == investor 권한 O (index[2] 계정)
                    it('7. investorList check' ,async function(){
                        logger.debug("7. investorList : " + (await tmtgFinal.investorList(investor).should.be.fulfilled));
                        logger.debug("7. regiInvestor : " + (await tmtgFinal.regiInvestor(investor2,{from:owner}).should.be.fulfilled));
                        logger.debug("7. delInvestor : " + (await tmtgFinal.delInvestor(investor2,{from:owner}).should.be.fulfilled));
                        logger.debug("7. investorList : " + (await tmtgFinal.investorList(investor).should.be.fulfilled));
                        logger.debug("7. investorList : " + (await tmtgFinal.investorList(investor2).should.be.fulfilled));
                        logger.debug("7. investorList : " + (await tmtgFinal.investorList(anonymous).should.be.fulfilled));
                    })

                    it('8. unpause check', async function(){
                        logger.debug("8. pause(rejected) : " + (await tmtgFinal.pause({from:superInvestor}).should.be.rejected));
                        logger.debug("8. pause : " + (await tmtgFinal.pause({from:owner}).should.be.fulfilled));
                        logger.debug("8. paused : " + await tmtgFinal.paused());
                        logger.debug("8. unpause(rejected) : " + (await tmtgFinal.unpause({from:superInvestor}).should.be.rejected));
                        logger.debug("8. paused : " + await tmtgFinal.paused());
                        logger.debug("8. unpause : " + (await tmtgFinal.unpause({from:owner}).should.be.fulfilled));
                        logger.debug("8. paused : " + (await tmtgFinal.paused()));
                    })

                    it('9. blackList check', async function(){
                        logger.debug("9. blackList : " + (await tmtgFinal.blackList(investor)));
                        logger.debug("9. blacklisting(rejected) : " + (await tmtgFinal.blacklisting(investor,{from:superInvestor}).should.be.rejected));
                        logger.debug("9. blackList : " + (await tmtgFinal.blackList(investor)));
                        logger.debug("9. blacklisting : " + (await tmtgFinal.blacklisting(investor,{from:owner}).should.be.fulfilled));
                        logger.debug("9. blackList : " + (await tmtgFinal.blackList(investor)));
                        logger.debug("9. deleteFromBlacklist(rejected)" + (await tmtgFinal.deleteFromBlacklist(investor,{from:superInvestor}).should.be.rejected));
                        logger.debug("9. deleteFromBlacklist" + (await tmtgFinal.deleteFromBlacklist(investor,{from:owner}).should.be.fulfilled));
                        logger.debug("9. blackList : " + (await tmtgFinal.blackList(investor)));
                    })

                    it('10. CEx check', async function(){
                        logger.debug("10. CEx : " + (await tmtgFinal.CEx(cex1)));
                        logger.debug("10. setCEx : " + (await tmtgFinal.setCEx(cex1, {from:owner}).should.be.fulfilled));
                        logger.debug("10. CEx : " + (await tmtgFinal.CEx(cex1)));
                        logger.debug("10. delCEx : " + (await tmtgFinal.delCEx(cex1,{from:owner}).should.be.fulfilled));
                        logger.debug("10. CEx : " + (await tmtgFinal.CEx(cex1)));

                        logger.debug("10. setCEx(rejected) : " + (await tmtgFinal.setCEx(cex1, {from:superInvestor2}).should.be.rejected));
                        logger.debug("10. delCEx(rejected) : " + (await tmtgFinal.delCEx(cex1,{from:superInvestor2}).should.be.rejected));
                    })
                    
                    it('11. paused check', async function(){
                        logger.debug("11. pause(rejected) : " + (await tmtgFinal.pause({from:superInvestor}).should.be.rejected));
                        logger.debug("11. pause : " + (await tmtgFinal.pause({from:owner}).should.be.fulfilled));
                        logger.debug("11. paused : " + await tmtgFinal.paused());
                        logger.debug("11. unpause(rejected) : " + (await tmtgFinal.unpause({from:superInvestor}).should.be.rejected));
                        logger.debug("11. paused : " + await tmtgFinal.paused());
                        logger.debug("11. unpause : " + (await tmtgFinal.unpause({from:owner}).should.be.fulfilled));
                        logger.debug("11. paused : " + (await tmtgFinal.paused()));
                    })
                    
                    it('12. balanceOf check', async function(){
                        logger.debug("12. balanceOf : " + await tmtgFinal.balanceOf(owner));
                    })

                    it('13. searchInvestor check', async function(){
                        logger.debug("13. searchInvestor : " + await tmtgFinal.searchInvestor(investor));
                        logger.debug("13. searchInvestor : " + await tmtgFinal.searchInvestor(investor2));
                        logger.debug("13. investorList : " + await tmtgFinal.investorList(investor));
                        logger.debug("13. investorList : " + await tmtgFinal.investorList(investor2));
                        logger.debug("13. searchInvestor : " + await tmtgFinal.searchInvestor(superInvestor));
                        logger.debug("13. transfer : " + await tmtgFinal.transfer(superInvestor,1000000000000000000,{from:owner}));
                        logger.debug("13. transfer : " + await tmtgFinal.transfer(investor2,100000000000000000, {from:superInvestor}));
                        logger.debug("13. investorList : " + await tmtgFinal.investorList(investor2));
                        logger.debug("13. searchInvestor : " + await tmtgFinal.searchInvestor(investor2));
                        logger.debug("13. searchInvestor : " + await tmtgFinal.searchInvestor(investor));
                    })
                    
                    it('14. pause check', async function(){
                        logger.debug("14. pause(rejected) : " + (await tmtgFinal.pause({from:superInvestor}).should.be.rejected));
                        logger.debug("14. pause : " + (await tmtgFinal.pause({from:owner}).should.be.fulfilled));
                        logger.debug("14. paused : " + await tmtgFinal.paused());
                        logger.debug("14. unpause(rejected) : " + (await tmtgFinal.unpause({from:superInvestor}).should.be.rejected));
                        logger.debug("14. paused : " + await tmtgFinal.paused());
                        logger.debug("14. unpause : " + (await tmtgFinal.unpause({from:owner}).should.be.fulfilled));
                        logger.debug("14. paused : " + (await tmtgFinal.paused()));
                    })

                    it('15. blacklisting check', async function(){
                        logger.debug("15. blackList : " + (await tmtgFinal.blackList(investor)));
                        logger.debug("15. blacklisting(rejected) : " + (await tmtgFinal.blacklisting(investor,{from:superInvestor}).should.be.rejected));
                        logger.debug("15. blackList : " + (await tmtgFinal.blackList(investor)));
                        logger.debug("15. blacklisting : " + (await tmtgFinal.blacklisting(investor,{from:owner}).should.be.fulfilled));
                        logger.debug("15. blackList : " + (await tmtgFinal.blackList(investor)));
                        logger.debug("15. deleteFromBlacklist(rejected)" + (await tmtgFinal.deleteFromBlacklist(investor,{from:superInvestor}).should.be.rejected));
                        logger.debug("15. deleteFromBlacklist" + (await tmtgFinal.deleteFromBlacklist(investor,{from:owner}).should.be.fulfilled));
                        logger.debug("15. blackList : " + (await tmtgFinal.blackList(investor)));
                    })

                    it('16. owner check', async function(){
                        logger.debug("16. owner : " + (await tmtgFinal.owner()));
                        logger.debug("16. owner : " + assert.equal(await tmtgFinal.owner(), owner)); 
                    })

                    it('17. deleteFromBlacklist', async function(){
                        logger.debug("17. blackList : " + (await tmtgFinal.blackList(investor)));
                        logger.debug("17. blacklisting(rejected) : " + (await tmtgFinal.blacklisting(investor,{from:superInvestor}).should.be.rejected));
                        logger.debug("17. blackList : " + (await tmtgFinal.blackList(investor)));
                        logger.debug("17. blacklisting : " + (await tmtgFinal.blacklisting(investor,{from:owner}).should.be.fulfilled));
                        logger.debug("17. blackList : " + (await tmtgFinal.blackList(investor)));
                        logger.debug("17. deleteFromBlacklist(rejected)" + (await tmtgFinal.deleteFromBlacklist(investor,{from:superInvestor}).should.be.rejected));
                        logger.debug("17. deleteFromBlacklist" + (await tmtgFinal.deleteFromBlacklist(investor,{from:owner}).should.be.fulfilled));
                        logger.debug("17. blackList : " + (await tmtgFinal.blackList(investor)));
                    })

                    it('18. symbol', async function(){
                        logger.debug("18. symbol : " + await tmtgFinal.symbol());
                        logger.debug("18. symbol : " + assert.equal(await tmtgFinal.symbol(), "TMTG"));
                    })

                    it('19. openingTime', async function(){
                        logger.debug("19. openingTime : " + await tmtgFinal.openingTime());
                    })

                    it('20. allowance', async function(){
                        logger.debug("20. superInvestor : " + await tmtgFinal.superInvestor(superInvestor).should.be.fulfilled);
                        logger.debug("20. balanceOf : " + await tmtgFinal.balanceOf(superInvestor));
                        logger.debug("20. approve : " + await tmtgFinal.approve(superInvestor, 1000000000,{from:owner}));
                        logger.debug("20. approve(rejected) : " + await tmtgFinal.approve(owner,100000,{from:superInvestor}).should.be.rejected);
                        logger.debug("20. approve(rejected) : " + await tmtgFinal.approve(investor,100000,{from:superInvestor}).should.be.rejected);
                        logger.debug("20. approve(rejected) : " + await tmtgFinal.approve(cex1,100000,{from:superInvestor}).should.be.rejected);
                        logger.debug("20. approve(rejected) : " + await tmtgFinal.approve(anonymous,100000,{from:superInvestor}).should.be.rejected);
                        logger.debug("20. allowance : " + await tmtgFinal.allowance(owner,superInvestor));
                        logger.debug("20. allowance : " + await tmtgFinal.allowance(superInvestor,owner));
                    })

                    it('21. transferOwnership', async function(){
                        logger.debug("21. owner : " + assert.equal(await tmtgFinal.owner(), owner));
                        logger.debug("21. transferOwnership : " + await tmtgFinal.transferOwnership(newOwner,{from:owner}));
                        logger.debug("21. transferOwnership : " + await tmtgFinal.transferOwnership(owner,{from:newOwner}));
                        logger.debug("21. transferOwnership(rejected) : " + await tmtgFinal.transferOwnership(newOwner,{from:anonymous}).should.be.rejected);
                        logger.debug("21. transferOwnership(rejected) : " + await tmtgFinal.transferOwnership(newOwner,{from:superInvestor}).should.be.rejected);
                        logger.debug("21. transferOwnership(rejected) : " + await tmtgFinal.transferOwnership(newOwner,{from:cex1}).should.be.rejected);
                    })
                    
                    it('22. setCEx', async function(){
                        logger.debug("22. CEx : " + (await tmtgFinal.CEx(cex1)));
                        logger.debug("22. setCEx : " + (await tmtgFinal.setCEx(cex1, {from:owner}).should.be.fulfilled));
                        logger.debug("22. CEx : " + (await tmtgFinal.CEx(cex1)));
                        logger.debug("22. delCEx : " + (await tmtgFinal.delCEx(cex1,{from:owner}).should.be.fulfilled));
                        logger.debug("22. CEx : " + (await tmtgFinal.CEx(cex1)));

                        logger.debug("22. setCEx(rejected) : " + (await tmtgFinal.setCEx(cex1, {from:superInvestor}).should.be.rejected));
                        logger.debug("22. delCEx(rejected) : " + (await tmtgFinal.delCEx(cex1,{from:superInvestor2}).should.be.rejected));
                    })

                    it('23. delCEx', async function(){
                        logger.debug("23. CEx : " + (await tmtgFinal.CEx(cex1)));
                        logger.debug("23. setCEx : " + (await tmtgFinal.setCEx(cex1, {from:owner}).should.be.fulfilled));
                        logger.debug("23. CEx : " + (await tmtgFinal.CEx(cex1)));
                        logger.debug("23. delCEx : " + (await tmtgFinal.delCEx(cex1,{from:owner}).should.be.fulfilled));
                        logger.debug("23. CEx : " + (await tmtgFinal.CEx(cex1)));

                        logger.debug("23. setCEx(rejected) : " + (await tmtgFinal.setCEx(cex1, {from:superInvestor}).should.be.rejected));
                        logger.debug("23. delCEx(rejected) : " + (await tmtgFinal.delCEx(cex1,{from:superInvestor2}).should.be.rejected));
                    })

                    it('24. setSuperInvestor', async function(){
                        logger.debug("24. superInvestor : " + await tmtgFinal.superInvestor(superInvestor));
                        logger.debug("24. setSuperInvestor : " + await tmtgFinal.setSuperInvestor(superInvestor2,{from:owner}).should.be.fulfilled);
                        logger.debug("24. superInvestor : " + await tmtgFinal.superInvestor(superInvestor2));

                        logger.debug("24. setSuperInvestor(rejected) : " + await tmtgFinal.setSuperInvestor(superInvestor2,{from:superInvestor}).should.be.rejected);
                    })
                    
                    it('25. delSuperInvestor', async function(){
                        logger.debug("25. superInvestor : " + await tmtgFinal.superInvestor(superInvestor2));
                        logger.debug("25. delSuperInvestor : " + await tmtgFinal.delSuperInvestor(superInvestor2,{from:owner}).should.be.fulfilled);
                        logger.debug("25. superInvestor : " + await tmtgFinal.superInvestor(superInvestor2));
                        
                        logger.debug("25. delSuperInvestor(rejected) : " + await tmtgFinal.delSuperInvestor(superInvestor2,{from:superInvestor}).should.be.rejected);
                    })
                    
                    it('26. setOpeningTime', async function(){
                        logger.debug("26. openingTime : " + await tmtgFinal.openingTime());
                        logger.debug("26. setOpeningTime : " + await tmtgFinal.setOpeningTime());
                        logger.debug("26. openingTime : " + await tmtgFinal.openingTime());
                        logger.debug("26. checkTime : " + await tmtgFinal.checkTime());
                        
                    })

                    it('27. burn', async function(){
                        logger.debug("27. burn : " + await tmtgFinal.burn(400,{from:owner}).should.be.fulfilled);
                        logger.debug("27. burn(rejected) : " + await tmtgFinal.burn(300, {from:anonymous}).should.be.rejected);
                        logger.debug("27. burn(rejected) : " + await tmtgFinal.burn(200, {from:superInvestor}).should.be.rejected);

                    })

                    it('28. burnFrom', async function(){
                        logger.debug("28. approve : " +  await tmtgFinal.approve(cex2,10000000000000,{from:owner}));
                        logger.debug("28. allowance : " + await tmtgFinal.allowance(owner, cex2));
                        logger.debug("28. burnFrom(rejected) : " + await tmtgFinal.burnFrom(owner,10000000000000,{from:cex2}).should.be.rejected);
                        logger.debug("28. transfer : " + await tmtgFinal.transfer(cex1,1000000000000000000,{from:owner}));
                        logger.debug("28. balanceOf : " + await tmtgFinal.balanceOf(cex1));
                        logger.debug("28. approve : " + await tmtgFinal.approve(owner,1000000000000,{from:cex1}));
                        logger.debug("28. allowance : " + await tmtgFinal.allowance(cex1, owner));
                        logger.debug("28. burnFrom : " + await tmtgFinal.burnFrom(cex1, 1000000000000,{from:owner}).should.be.fulfilled);
                        logger.debug("28. balanceOf : " + await tmtgFinal.balanceOf(cex1));
                    })
                    
                    it('29. checkTime', async function(){
                        logger.debug("29. checkTime : " + await tmtgFinal.checkTime());
                    })
                    
                    it('30. approve', async function(){
                        logger.debug("30. setSuperInvestor : " + await tmtgFinal.setSuperInvestor(superInvestor2,{from:owner}).should.be.fulfilled);
                        logger.debug("30. superInvestor : " + await tmtgFinal.superInvestor(superInvestor2));
                        logger.debug("30. transfer : " + await tmtgFinal.transfer(superInvestor2, 100000, {from:owner}));
                        logger.debug("30. transfer : " + await tmtgFinal.transfer(anonymous2, 100000, {from:owner}));
                        logger.debug("30. balanceOf : "+ await tmtgFinal.balanceOf(superInvestor2,{from:owner}));
                        logger.debug("30. balanceOf : "+ await tmtgFinal.balanceOf(anonymous2,{from:owner}));
                        logger.debug("30. approve(rejected) : " +  await tmtgFinal.approve(cex1,10000,{from:superInvestor2}).should.be.rejected);
                        logger.debug("30. approve : " +  await tmtgFinal.approve(cex1,10000,{from:anonymous2}).should.be.fulfilled);
                    })
                    it('31. transfer', async function(){
                        logger.debug("31. balanceOf : " + await tmtgFinal.balanceOf(anonymous2));
                        logger.debug("31. transfer(rejected) : " + await tmtgFinal.transfer(100001).should.be.rejected);
                        logger.debug("31. transfer : " + await tmtgFinal.transfer(10000).should.be.rejected);
                        logger.debug("31. balanceOf : " + await tmtgFinal.balanceOf(anonymous2));
                    }) 
                    
                    it('32. transferFrom', async function(){
                        logger.debug("32. transfer : " + await tmtgFinal.transfer(anonymous, 100000000,{from:owner}));
                        logger.debug("32. transfer : " + await tmtgFinal.transfer(superInvestor2, 100000000,{from:owner}));
                        logger.debug("32. balanceOf : " + await tmtgFinal.balanceOf(anonymous));
                        logger.debug("32. balanceOf : " + await tmtgFinal.balanceOf(superInvestor2));
                        logger.debug("32. balanceOf : " + await tmtgFinal.balanceOf(anonymous2));
                        logger.debug("32. approve : " + await tmtgFinal.approve(anonymous2, 100000000,{from:anonymous}).should.be.fulfilled);
                        logger.debug("32. approve : " + await tmtgFinal.approve(anonymous2, 100100000,{from:superInvestor2}).should.be.rejected);
                        logger.debug("32. tranferFrom : " + await tmtgFinal.transferFrom(anonymous,superInvestor2,100000000,{from:anonymous2}).should.be.fulfilled);
                        logger.debug("32. tranferFrom : " + await tmtgFinal.transferFrom(superInvestor2,anonymous,100100000,{from:superInvestor2}).should.be.rejected);
                    })   
                    
                    it('33. getLimitPeriod',async function(){
                        logger.debug("33.checkTime : " + await tmtgFinal.checkTime());
                        logger.debug("33. getLimitPeriod : " + await tmtgFinal.getLimitPeriod());
                    })
                    it("end" ,async function(){
                        logger.debug("End : ========================================");
                    })
                })
               // */
                // 기능 테스트 완료------------------------------------------------------------------------------------------------------------------------
                
            // 권한 : owner / superInvestor / CEx(거래소) / investor / anonymous
            // 0. approve 
            // 1. transfer 
            // 2. tranferFrom
            // 3. 토큰락 테스트
                
            describe('0. Approve test', ()=> {
                it("0-1. 서킷브레이커 작동시, Approve는 작동하지 않는다. " , async function() {
                    logger.debug(":: 0-1.함수 테스트) Approve START : ========================================");
                    logger.debug(":: 0-1. pause : " + (await tmtgFinal.pause({from:owner}).should.be.fulfilled));
                    logger.debug(":: 0-1. paused : " + await tmtgFinal.paused());
                    logger.debug(":: 0-1  approve : " +  await tmtgFinal.approve(anonymous,10000,{from:owner}).should.be.rejected);
                    logger.debug(":: 0-1. unpaused : " + await tmtgFinal.unpause());
                    logger.debug(":: 0-1. paused : " + await tmtgFinal.paused());
                    
                })
                
                it("0-2. 보내는 사람, 받는사람이 블랙리스트일 경우, Approve는 작동하지 않는다. " ,async function() {
                    logger.debug(":: 0-2. ownerCheck : " + assert.equal(await tmtgFinal.owner(), owner));
                    logger.debug(":: 0-2. transfer : " + await tmtgFinal.transfer(anonymous,100000,{from:owner}));
                    logger.debug(":: 0-2. balanceOf : " + await tmtgFinal.balanceOf(anonymous));
                    logger.debug(":: 0-2. blackList : " + await tmtgFinal.blackList(anonymous,{from:owner}));
                    logger.debug(":: 0-2. blacklisting : " + await tmtgFinal.blacklisting(anonymous,{from:owner}).should.be.fulfilled);
                    logger.debug(":: 0-2. blackList : " + await tmtgFinal.blackList(anonymous,{from:owner}));
                    //보내는사람이 블랙리스트인 경우
                    logger.debug(":: 0-2. approve(rejected) : " + await tmtgFinal.approve(owner,100000,{from:anonymous}).should.be.rejected);
                    //받는사람이 블랙리스트인 경우
                    logger.debug(":: 0-2. approve(rejected) : " + await tmtgFinal.approve(anonymous, 100000,{from: owner}).should.be.rejected);
                    logger.debug(":: 0-2. deleteFromBlacklist : " + await tmtgFinal.deleteFromBlacklist(anonymous,{from:owner}).should.be.fulfilled);
                    logger.debug(":: 0-2. approve : " + await tmtgFinal.approve(owner,100000,{from:anonymous}).should.be.fulfilled);
                    logger.debug(":: 0-2. approve : " + await tmtgFinal.approve(anonymous, 100000,{from: owner}).should.be.fulfilled);
                })

                it("0-3. 보내는 사람이 investor 일 경우, Approve는 해당 limit만큼 보낼 수 있다. " ,async function() {
                    const superInvestorAmount = new BigNumber(1e+23);
                    const investorAmount = new BigNumber(1e+22);
                    
                    logger.debug(":: 0-3. transfer : " + await tmtgFinal.transfer(superInvestor,superInvestorAmount,{from:owner}));
                    logger.debug(":: 0-3. setSuperInvestor : " + await tmtgFinal.setSuperInvestor(superInvestor,{from:owner}).should.be.fulfilled);
                    logger.debug(":: 0-3. superInvestor : " + await tmtgFinal.superInvestor(superInvestor)); 
                    logger.debug(":: 0-3. balanceOf : " + await tmtgFinal.balanceOf(superInvestor));
                    logger.debug(":: 0-3. investorList : " + await tmtgFinal.investorList(anonymous2));
                    logger.debug(":: 0-3. searchInvestor : " + await tmtgFinal.searchInvestor(anonymous2));
                    logger.debug(":: 0-3. transfer : " + await tmtgFinal.transfer(anonymous2,investorAmount,{from:superInvestor}));
                    logger.debug(":: 0-3. investorList : " + await tmtgFinal.investorList(anonymous2));
                    logger.debug(":: 0-3. searchInvestor : " + await tmtgFinal.searchInvestor(anonymous2));
                    logger.debug(":: 0-3. approve(rejected) : " + await tmtgFinal.approve(owner,1000,{from:anonymous2}).should.be.rejected);
                    //단 _newLimit.add(9)이므로 9에 해당하는 만큼은 보낼 수 있다. initial이 999일 경우 10% 씩 제한이 풀릴 시 마지막에 990이므로 +9 설정
                    logger.debug(":: 0-3. approve : " + await tmtgFinal.approve(owner,9,{from:anonymous2}).should.be.fulfilled);
                    logger.debug(":: 0-3. searchInvestor : " + await tmtgFinal.searchInvestor(anonymous2));

                })

                it("0-4. 보내는 사람이 superInvestor 일 경우, Approve는 작동하지 않는다. " ,async function() {
                    logger.debug("::. Approve START : ========================================");
                })
                it("0-5. msg.sender의 balance의 초과 금액을 보낼 경우, Approve는 작동하지 않는다. " ,async function() {
                    logger.debug("::. Approve START : ========================================");
                })
                it("END" ,async function() {
                    logger.debug("::. Approve End : ========================================");
                })
            })

            // describe('1. transfer test', () => {
            //     it("START" ,async function() {
            //         logger.debug("::. Transfer START : ========================================");
            //     })
            //     it("1-1. 서킷브레이커 작동시, transfer는 작동하지 않는다. " ,async function() {
            //         logger.debug(":: . Approve START : ========================================");
            //     })
            //     it("1-2. 보내는 사람, 받는사람이 블랙리스트일 경우, transfer는 작동하지 않는다. " ,async function() {
            //         logger.debug("::. Approve START : ========================================");
            //     })
            //     it("1-3. 보내는 사람이 investor 일 경우, transfer는 해당 _newLimit만큼 보낼 수 있다. " ,async function() {
            //         logger.debug("::. Approve START : ========================================");
            //     })
            //     it("1-4. 받는 사람이 0x0 일 경우, transfer는 작동하지 않는다. " ,async function() {
            //         logger.debug("::. Approve START : ========================================");
            //     })
            //     it("1-5. msg.sender's balance의 초과 금액을 보낼 경우, transfer는 작동하지 않는다. " ,async function() {
            //         logger.debug("::. Approve START : ========================================");
            //     })
            //     it("1-6. msg.sender가 superInvestor이고, _to가 anonymous인 경우, _to는 investor로 권한이 변경되며, 토큰 락이 걸려 10%씩 차등 제한이 풀리게 된다. " ,async function() {
            //         logger.debug("::. Approve START : ========================================");
            //     })
            //     it("1-7. msg.sender가 superInvestor이고, _to가 investor인 경우, _to의 limit은 변함이 없으며, 추가 금액은 10개월간 토큰 락이 걸린다. " ,async function() {
            //         logger.debug("::. Approve START : ========================================");
            //     })
            //     it("1-8. msg.sender가 superInvestor인 경우, _to가 거래소,owner,superInvestor인 경우 transfer는 작동하지 않는다. " ,async function() {
            //         logger.debug("::. Approve START : ========================================");
            //     })
            //     it("1-9. msg.sender. " ,async function() {
            //         logger.debug("::. Approve START : ========================================");
            //     })
            //     it("END" , async function() {
            //         logger.debug("::. Transfer END : ========================================");
            //     })
            // })

            // describe('2. transferFrom test', () => {
            //     it("START" , async function() {
            //         logger.debug("::. TransferFrom START : ========================================");
            //     })

            //     it("2-1. 서킷브레이커 작동시, transferFrom는 작동하지 않는다. " ,async function() {
            //         //logger.debug("::2-1. pause : " + (await tmtgFinal.pause({from:owner}).should.be.fulfilled));
            //         //logger.debug("::2-1. paused : " + await tmtgFinal.paused());
                    
            //     })

            //     it("2-2. investor인 경우, transferFrom은 해당 _newLimit만큼(approve된 만큼)  보낼 수 있다. " ,async function() {
            //         logger.debug(":: . Approve START : ========================================");
            //     })
            //     it("2-3. anonymous인 상태에서 approve한 금액은 investor가 된 이후에도 newLimit에 관계없이 transferFrom을 통해 보낼 수 있다. " ,async function() {
            //         logger.debug(":: . Approve START : ========================================");
            //     })
            //     it("2-4. superInvestor인 경우, transferFrom(address _from, address _to)의 _from으로 설정 할 수 없다.", async function(){

            //     })
            //     it("2-5.  _from의 balance 초과된 금액을 보낼 수 없다." , async function(){

            //     })
            //     it("2-6.  _from의 allowed 초과된 금액을 보낼 수 없다." , async function(){

            //     })
            //     it("END" ,async function() {
            //         logger.debug("::. TransferFrom END : ========================================");
            //     })
            // })

            // describe('3. getLimitPeriod test', () => {
            
            // })

            // describe('4. tokenLock test', () => {
            
            // })

            }) 
        }
    }
}