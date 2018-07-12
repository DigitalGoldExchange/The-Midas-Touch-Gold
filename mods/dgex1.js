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
                    hiddenowner,
                    superowner,
                    admin,
                    superInvestor,
                    investor,
                    cex,
                    anonymous1,
                    anonymous2,
                    centralbanker
                ] = accounts;
                
                before('setup contract ', async function() {
                    tmtgFinal = await self._artifact.new({from: owner});
                })
                ///**
                /**
                * TMTG_ROLE
                * hiddenowner : superowner 의 소유권 변경 & hiddenowner 의 소유권 변경 가능하다.
                * superowner : bank, owner, cex, admin, superinvestor, investor 역할 추가 및 제거가 가능하다.
                * owner : pause&unpause, blacklist&whitelist, reclaimEther, reclaimToken, setOpeningTime, burn, stash가 가능하다.
                * admin : pause&unpause, blacklist&whitelist 가능하다.
                * superinvestor : 일반 사용자에게 전달시 해당 금액만큼 10개월간 토큰 락이 걸린다.
                * investor : superinvestor로부터 최초 받은 금액의 10%씩이 제한이 풀린다.
                * centralbanker : unstash(오너로 해당 금액을 전달)이 가능하며, 일반 거래는 못한다.
                * cex : 거래소 계정
                * anonymous : 일반 계정
                */    
                 
               // -------------------------------------------기능&단위 테스트-----------------------------------------------------------------------

               logger.debug(":: 기능&단위 테스트 Start ::========================================");
                describe('basic function & unit test', ()  => {
                    
                     
                    it('1. distribute roles check', async function(){
                        logger.debug("1. hiddenowner check : " + assert.equal(owner ,await tmtgFinal.hiddenowner()));
                        logger.debug("1. superowner check : " + assert.equal(owner ,await tmtgFinal.superowner()));
                        logger.debug("1. owner check : " + assert.equal(owner ,await tmtgFinal.owner()));
                        logger.debug("1. centralbanker check : " + assert.equal(owner ,await tmtgFinal.centralbanker()));
                        //in first time, owner는 hiddenowner, superowner, centralbanker, owner에 해당하는 권한을 모두 가지고 있다. 
                        logger.debug("1. transferHiddenOwnership : " + await tmtgFinal.transferHiddenOwnership(hiddenowner,{from:owner}));
                        logger.debug("1. transferSuperOwnership : " + await tmtgFinal.transferSuperOwnership(superowner, {from:hiddenowner}));
                        logger.debug("1. transferBankOwnership : " + await tmtgFinal.transferBankOwnership(centralbanker,{from:superowner}));
                        logger.debug("1. result : 모든 권한은 constructor(msg.sender)이므로 hiddenowner, superowner, centralbanker의 권한을 양도했다.");
                        logger.debug("1. setSuperInvestor : " + await tmtgFinal.setSuperInvestor(superInvestor,{from:superowner}).should.be.fulfilled);
                        logger.debug("1. setCEx : " + await tmtgFinal.setCEx(cex, {from:superowner}).should.be.fulfilled);
                        logger.debug("1. setAdmin : " + await tmtgFinal.setAdmin(admin,{from:superowner}).should.be.fulfilled);
                    })

                    it('1-1. role( hiddenowner & superowner & owner & centralbanker) check', async function() {
                        logger.debug("1-1. hiddenowner : " + assert.equal(hiddenowner, await tmtgFinal.hiddenowner()));
                        logger.debug("1-1. superowner : " + assert.equal(superowner, await tmtgFinal.superowner()));
                        logger.debug("1-1. centralbanker : " + assert.equal(centralbanker, await tmtgFinal.centralbanker()));
                        logger.debug("1-1. superInvestor : " + await tmtgFinal.superInvestor(superInvestor));
                        logger.debug("1-1. cex : " + await tmtgFinal.CEx(cex));
                        logger.debug("1-1. result : 양도한 권한에 대한 체크");
                    })
                    
                    it('2. name check', async function(){
                        var name = "The Midas Touch Gold";
                        logger.debug("2. name : " + assert.equal(name, await tmtgFinal.name()));  
                    })
                    
                    it('2-1. balance distribution : superInvestor, centralbanker 100m TMTG && investor : 10m TMTG', async function(){
                        const toSendAmount = new BigNumber(1e+24);
                        const toSendAmount2 = new BigNumber(1e+23);
                        logger.debug("2-1. transfer : " + await tmtgFinal.transfer(superInvestor, toSendAmount,{from:owner}));
                        logger.debug("2-1. transfer : " + await tmtgFinal.transfer(anonymous1, toSendAmount,{from:owner}));
                        logger.debug("2-1. transfer : " + await tmtgFinal.transfer(anonymous2, toSendAmount,{from:owner}));
                        logger.debug("2-1. balanceOf : " + await tmtgFinal.balanceOf(superInvestor));
                        logger.debug("2-1. transfer : " + await tmtgFinal.transfer(centralbanker, toSendAmount,{from:owner}));
                        logger.debug("2-1. balanceOf : " + await tmtgFinal.balanceOf(centralbanker));
                        logger.debug("2-1. transfer : " + await tmtgFinal.transfer(investor, toSendAmount2, {from:superInvestor}));
                        logger.debug("2-1. investorList : " + await tmtgFinal.investorList(investor)); 
                        logger.debug("2-1. balanceOf : " + await tmtgFinal.balanceOf(investor));
                        logger.debug("2-1. result : superInvestor, centralbanker : 100m TMTG / investor : 10m TMTG");
                    })
                    
                    //히든오너(금고) / 수퍼오너(인적관리) / 오너 / 어드민 / 뱅크오너 / 수퍼투자자 / 투자자 / 거래소 / anony
                    it('3. approve check : 수퍼투자자와 중앙은행은 approve를 줄 수 없다.', async function(){
                        const toSendAmount = new BigNumber(1e+23);
                        logger.debug("3. approve(rejected) : " + await tmtgFinal.approve(investor,toSendAmount,{from:superInvestor}).should.be.rejected);
                        logger.debug("3. approve(rejected) : " + await tmtgFinal.approve(investor,toSendAmount,{from:centralbanker}).should.be.rejected);
                        logger.debug("3. approve : " + await tmtgFinal.approve(investor, toSendAmount,{from:owner}).should.be.fulfilled);
                        logger.debug("3. result : 수퍼투자자와 중앙은행은 approve를 줄 수 없다.");
                    })
                    it('4. setInvestor & delInvestor : superOwner만이 이 기능을 수행 할 수 있다.', async function(){
                        logger.debug("4. delInvestor : " + await tmtgFinal.delInvestor(investor,{from:superowner}).should.be.fulfilled);
                        logger.debug("4. setInvestor : " + await tmtgFinal.setInvestor(investor, {from:superowner}).should.be.fulfilled);
                        logger.debug("4. setInvestor(rejected) : " + await tmtgFinal.setInvestor(anonymous1, {from:owner}).should.be.rejected);
                    })
                    it('5. unstash : centralbanker만이 해당 기능을 수행 할 수 있다.', async function(){
                        const unstashValue = new BigNumber(1e+22);
                        logger.debug("5. balanceOf : " + await tmtgFinal.balanceOf(centralbanker));
                        logger.debug("5. balanceOf : " + await tmtgFinal.balanceOf(owner));
                        logger.debug("5. unstash : " + await tmtgFinal.unstash(unstashValue,{from:centralbanker}))
                        logger.debug("5. unstash(rejected) : " + await tmtgFinal.unstash(unstashValue,{from:owner}).should.be.rejected);
                        logger.debug("5. balanceOf : " + await tmtgFinal.balanceOf(centralbanker));
                        logger.debug("5. balanceOf : " + await tmtgFinal.balanceOf(owner));
                    })

                    it('6. stash : owner만이 해당 기능을 수행 할 수 있다.', async function(){
                        const stashValue = new BigNumber(1e+25);
                        logger.debug("6. balanceOf : " + await tmtgFinal.balanceOf(centralbanker));
                        logger.debug("6. stash : " + await tmtgFinal.stash(stashValue,{from:owner}).should.be.fulfilled);
                        logger.debug("6. stash(rejected) : " + await tmtgFinal.stash(stashValue,{from:centralbanker}).should.be.rejected);  
                        logger.debug("6. balanceOf : " + await tmtgFinal.balanceOf(centralbanker));
                    })
                    it('7. pause : 모든 거래가 불가하다. 중앙 은행과 owner간의 stash & unstash만 가능하다.', async function(){
                        logger.debug("7. pause : " + await tmtgFinal.pause({from:owner}).should.be.fulfilled);
                        logger.debug("7. paused : " + await tmtgFinal.paused());
                        logger.debug("7. transfer : " + await tmtgFinal.transfer(investor,10000,{from:owner}).should.be.rejected);
                        logger.debug("7. unpause : " + await tmtgFinal.unpause({from:admin}).should.be.fulfilled);
                        logger.debug("7. paused : " + await tmtgFinal.paused());
                        logger.debug("7. transfer : " + await tmtgFinal.transfer(investor,10000,{from:owner}).should.be.fulfilled);
                    })

                    it('8. blacklist가 적용 될 시 해당 사용자에게 코인을 보내거나 받을 수 없다', async function(){
                        logger.debug("8. blacklist :" + await tmtgFinal.blacklist(anonymous1,{from:owner}).should.be.fulfilled);
                        logger.debug("8. blacklist :" + await tmtgFinal.blacklist(anonymous2,{from:admin}).should.be.fulfilled);
                        logger.debug("8. transfer(rejected) : " + await tmtgFinal.transfer(owner,10000,{from:anonymous1}).should.be.rejected);
                        logger.debug("8. transfer(rejected) : " + await tmtgFinal.transfer(anonymous2,10000,{from:owner}).should.be.rejected);
                        logger.debug("8. unBlacklist " + await tmtgFinal.unblacklist(anonymous1,{from:owner}).should.be.fulfilled);
                        logger.debug("8. unBlacklist " + await tmtgFinal.unblacklist(anonymous2,{from:admin}).should.be.fulfilled);
                        logger.debug("8. transfer : " + await tmtgFinal.transfer(owner,10000,{from:anonymous1}).should.be.fulfilled);
                        logger.debug("8. transfer : " + await tmtgFinal.transfer(anonymous2,10000,{from:owner}).should.be.fulfilled);
                    })

                    it('9. superOwner는 자신과 hiddenOwner를 제외하고, 역할에 대해 소유권 변경 및 추가, 삭제가 가능하다',async function(){
                        logger.debug("9. transferSuperOwnership(rejected) : " + await tmtgFinal.transferSuperOwnership(anonymous1,{from:superowner}).should.be.rejected);
                        logger.debug("9. transferSuperOwnership : " + await tmtgFinal.transferSuperOwnership(anonymous1,{from:hiddenowner}).should.be.fulfilled);
                        logger.debug("9. transferSuperOwnership : " + await tmtgFinal.transferSuperOwnership(superowner,{from:hiddenowner}).should.be.fulfilled);
                        logger.debug("9. transferBankOwnership : " +  await tmtgFinal.transferBankOwnership(anonymous1,{from:superowner}).should.be.fulfilled);        
                        logger.debug("9. transferBankOwnership : " +  await tmtgFinal.transferBankOwnership(centralbanker,{from:superowner}).should.be.fulfilled);    
                        logger.debug("9.transferOwnership : " + await tmtgFinal.transferOwnership(anonymous1,{from:superowner}).should.be.fulfilled);
                        logger.debug("9.transferOwnership : " + await tmtgFinal.transferOwnership(owner,{from:superowner}).should.be.fulfilled);
                        logger.debug("9.setAdmin : " + await tmtgFinal.setAdmin(anonymous1,{from:superowner}).should.be.fulfilled);
                        logger.debug("9.delAdmin : " + await tmtgFinal.delAdmin(anonymous1,{from:superowner}).should.be.fulfilled);
                        logger.debug("9.setCEx : " + await tmtgFinal.setCEx(anonymous1,{from:superowner}).should.be.fulfilled);
                        logger.debug("9.delCEx : " + await tmtgFinal.delCEx(anonymous1,{from:superowner}).should.be.fulfilled);
                        logger.debug("9.setSuperInvestor : " + await tmtgFinal.setSuperInvestor(anonymous1,{from:superowner}).should.be.fulfilled);
                        logger.debug("9.delSuperInvestor : " + await tmtgFinal.delSuperInvestor(anonymous1,{from:superowner}).should.be.fulfilled);
                        logger.debug("9.setInvestor : " + await tmtgFinal.setInvestor(anonymous1,{from:superowner}).should.be.fulfilled);
                        logger.debug("9.delInvestor : " + await tmtgFinal.delInvestor(anonymous1,{from:superowner}).should.be.fulfilled);
                    })   
                    it('10. admin은 pause&unpause blacklist&unblacklist가 가능하다.', async function(){
                        logger.debug("10. pause : " + await tmtgFinal.pause({from:admin}).should.be.fulfilled);
                        logger.debug("10. paused : " + await tmtgFinal.paused());
                        logger.debug("10. unpause : " + await tmtgFinal.unpause({from:admin}).should.be.fulfilled);
                        logger.debug("10. paused : " + await tmtgFinal.paused());
                        logger.debug("8. blacklist :" + await tmtgFinal.blacklist(anonymous2,{from:admin}).should.be.fulfilled);
                        logger.debug("8. unBlacklist " + await tmtgFinal.unblacklist(anonymous2,{from:admin}).should.be.fulfilled);
                    })
                })

            }) 
        }
    }
}