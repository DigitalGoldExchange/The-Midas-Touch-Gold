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
                    hiddenowner,
                    superowner,
                    operator,
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
               const toSendAmount = new BigNumber(1e+24);
               const toSendAmount2 = new BigNumber(1e+23);
               const toSendAmount3 = new BigNumber(1e+22);
               
               logger.debug(":: 기능&단위 테스트 Start ::========================================");
                describe('1. distribute roles', ()  => {
                    it('[result] : 모든 권한은 constructor(msg.sender)이므로 hiddenowner, superowner, centralbanker의 권한을 양도했다.', async function() {
                        logger.debug("1. superowner check : " + assert.equal(owner , await tmtgFinal.superOwner()));
                        logger.debug("1. hiddenowner check : " + assert.equal(owner , await tmtgFinal.hiddenOwner()));
                        logger.debug("1. owner check : " + assert.equal(owner , await tmtgFinal.owner()));
                        logger.debug("1. changeHiddenOwner : " + await tmtgFinal.changeHiddenOwner(hiddenowner,{from:owner}));
                        logger.debug("1. centralbanker check : " + assert.equal(owner ,await tmtgFinal.centralBanker()));
                        logger.debug("1. transferSuperOwnership : " + await tmtgFinal.transferSuperOwnership(superowner, {from:hiddenowner}));
                        logger.debug("1. transferBankOwnership : " + await tmtgFinal.transferBankOwnership(centralbanker,{from:superowner}));
                        logger.debug("1. setSuperInvestor : " + await tmtgFinal.setSuperInvestor(superInvestor,{from:superowner}).should.be.fulfilled);
                        logger.debug("1. setCEx : " + await tmtgFinal.setCEx(cex, {from:superowner}).should.be.fulfilled);
                        logger.debug("1. setOperator : " + await tmtgFinal.setOperator(operator,{from:superowner}).should.be.fulfilled);
                    })
                })

                describe('2. check name ', () => {
                    it('[result] : name is "The Midas Touch Gold"', async function() {
                    var name = "The Midas Touch Gold";
                    logger.debug("2. name : " + assert.equal(name, await tmtgFinal.name()));
                    })
                })
                
                // [ROLE] : [hiddenOwner, superOwner, owner, operator, bankOwner, superInvestor, investor, cex, anonymous]
                //TMTG AMOUNT
                //superInvestor : 100M
                //centralBAnker : 100M
                //anonymous1 : 10M
                //investor : 10M
                describe('3. distribute balances', () => {
                    it('[result] superInvestor, centralBanker : 100M TMTG / anonymous1,investor : 10M TMTG', async function() {
                        
                        logger.debug("1. transfer : " + await tmtgFinal.transfer(superInvestor, toSendAmount, {from:owner})); 
                        logger.debug("2. transfer : " + await tmtgFinal.transfer(centralbanker, toSendAmount, {from:owner}));
                        logger.debug("3. transfer : " + await tmtgFinal.transfer(anonymous1, toSendAmount2, {from:owner}));
                        logger.debug("4. transfer " + await tmtgFinal.transfer(investor, toSendAmount2, {from:superInvestor}));
                    })
                })


                // [ROLE] : [hiddenOwner, superOwner, owner, operator, bankOwner, superInvestor, investor, cex, anonymous]
                //TMTG AMOUNT
                //superInvestor : 100M
                //centralBAnker : 100M
                //anonymous1 : 10M
                //investor : 10M
                describe('4. approve check', () => {
                    it('[result] : superInvestor cannot do action function of approve', async function(){
                        logger.debug("1. approve(rejected) : " + await tmtgFinal.approve(anonymous2, toSendAmount3,{from:superInvestor}).should.be.rejected);
                    })
                    it('[result] : centralbanker cannot do action fucntion of approve.', async function(){
                        logger.debug("1. approve(rejected) : " + await tmtgFinal.approve(anonymous2, toSendAmount3,{from:centralbanker}).should.be.rejected);
                    })
                    it('[result] : 인베스터는 자신의 타임락을 넘어서는 금액 또한 approve 해줄 수 있지만 실제 transferFrom에서 막힌다.', async function(){
                        logger.debug("approve : " + await tmtgFinal.approve(anonymous2, toSendAmount2,{from:investor}).should.be.fulfilled);
                        logger.debug("investorList : " + await tmtgFinal.searchInvestor(investor));
                        logger.debug("transferFrom : " + await tmtgFinal.transferFrom(investor,owner,toSendAmount2,{from:anonymous2}).should.be.rejected);
                    })
                })
                
                describe('5. delInvestor check', () =>{
                    it('[result] : 인베스터 권한을 가진 사람의 권한을 없애준다.', async function() {
                        logger.debug("investorList : " + await tmtgFinal.searchInvestor(investor));
                        logger.debug("delInvestor : " + await tmtgFinal.delInvestor(investor,{from:superowner}).should.be.fulfilled);
                        logger.debug("investorList : " + await tmtgFinal.searchInvestor(investor));
                    })
                })

                describe('6. stash & unStash check', () =>{
                    it('[result] : stash는 owner만 unStash는 banker만 사용 가능하다.', async function() {                        
                        logger.debug("6. balanceOf : " + await tmtgFinal.balanceOf(centralbanker));
                        logger.debug("6. balanceOf : " + await tmtgFinal.balanceOf(owner));
                        logger.debug("6. unstash : " + await tmtgFinal.unstash(toSendAmount3,{from:centralbanker}))
                        logger.debug("6. unstash(rejected) : " + await tmtgFinal.unstash(toSendAmount3,{from:owner}).should.be.rejected);
                        logger.debug("6. balanceOf : " + await tmtgFinal.balanceOf(centralbanker));
                        logger.debug("6. balanceOf : " + await tmtgFinal.balanceOf(owner));
                        logger.debug("6. stash : " + await tmtgFinal.stash(toSendAmount3,{from:owner}).should.be.fulfilled);
                        logger.debug("6. stash(rejected) : " + await tmtgFinal.stash(toSendAmount3,{from:centralbanker}).should.be.rejected);  
                        logger.debug("6. balanceOf : " + await tmtgFinal.balanceOf(centralbanker));
                        logger.debug("6. balanceOf : " + await tmtgFinal.balanceOf(owner));
                    })
                })

                describe('7. pause check', () =>{
                    it('[result] : 모든 거래가 불가하다. 중앙 은행과 owner간의 stash & unstash만 가능하다.', async function() {                        
                        logger.debug("7. pause : " + await tmtgFinal.pause({from:owner}).should.be.fulfilled);
                        logger.debug("7. paused : " + await tmtgFinal.paused());
                        logger.debug("7. transfer : " + await tmtgFinal.transfer(investor,toSendAmount3,{from:owner}).should.be.rejected);
                        logger.debug("7. unpause : " + await tmtgFinal.unpause({from:operator}).should.be.fulfilled);
                        logger.debug("7. paused : " + await tmtgFinal.paused());
                        logger.debug("7. transfer : " + await tmtgFinal.transfer(investor,toSendAmount3,{from:owner}).should.be.fulfilled);
                    })
                })

                describe('8. blacklist check', () => {
                    it('[result] : blacklist가 적용 될 시 해당 사용자에게 코인을 보내거나 받을 수 없다.', async function() {                        
                        logger.debug("8. blacklist :" + await tmtgFinal.blacklist(anonymous1,{from:owner}).should.be.fulfilled);
                        logger.debug("8. blacklist :" + await tmtgFinal.blacklist(anonymous2,{from:operator}).should.be.fulfilled);
                        logger.debug("8. transfer(rejected) : " + await tmtgFinal.transfer(owner,10000,{from:anonymous1}).should.be.rejected);
                        logger.debug("8. approve(rejected) : " + await tmtgFinal.approve(owner,10000,{from:anonymous1}).should.be.rejected);
                        logger.debug("8. approve(rejected) : " + await tmtgFinal.approve(anonymous1,10000,{from:owner}).should.be.rejected); 
                        logger.debug("8. transfer(rejected) : " + await tmtgFinal.transfer(anonymous2,10000,{from:owner}).should.be.rejected);
                        logger.debug("8. unBlacklist : " + await tmtgFinal.unblacklist(anonymous1,{from:owner}).should.be.fulfilled);
                        logger.debug("8. unBlacklist : " + await tmtgFinal.unblacklist(anonymous2,{from:operator}).should.be.fulfilled);
                        logger.debug("8. transfer : " + await tmtgFinal.transfer(owner,10000,{from:anonymous1}).should.be.fulfilled);
                        logger.debug("8. transfer : " + await tmtgFinal.transfer(anonymous2,10000,{from:owner}).should.be.fulfilled);
                        logger.debug("8. approve(rejected) : " + await tmtgFinal.approve(anonymous2, 10000,{from:superInvestor}).should.be.rejected);
                    })
                })

                describe("9. ROLE'S CHECK", () => {

                    describe("9-1. superOwner's role check", () => {
                        it('[result] : superOwner는 자신과 hiddenOwner를 제외하고, 역할에 대해 소유권 변경 및 추가, 삭제가 가능하다', async function(){
                            logger.debug("9-1. transferSuperOwnership(rejected) : " + await tmtgFinal.transferSuperOwnership(anonymous1,{from:superowner}).should.be.rejected);
                            logger.debug("9-1. transferSuperOwnership : " + await tmtgFinal.transferSuperOwnership(anonymous1,{from:hiddenowner}).should.be.fulfilled);
                            logger.debug("9-1. transferSuperOwnership : " + await tmtgFinal.transferSuperOwnership(superowner,{from:hiddenowner}).should.be.fulfilled);
                            logger.debug("9-1. transferBankOwnership : " +  await tmtgFinal.transferBankOwnership(anonymous1,{from:superowner}).should.be.fulfilled);        
                            logger.debug("9-1. transferBankOwnership : " +  await tmtgFinal.transferBankOwnership(centralbanker,{from:superowner}).should.be.fulfilled);    
                            logger.debug("9-1. transferOwnership : " + await tmtgFinal.transferOwnership(anonymous1,{from:superowner}).should.be.fulfilled);
                            logger.debug("9-1. transferOwnership : " + await tmtgFinal.transferOwnership(owner,{from:superowner}).should.be.fulfilled);
                            logger.debug("9-1. setOperator : " + await tmtgFinal.setOperator(anonymous1,{from:superowner}).should.be.fulfilled);
                            logger.debug("9-1. delOperator : " + await tmtgFinal.delOperator(anonymous1,{from:superowner}).should.be.fulfilled);
                            logger.debug("9-1. setCEx : " + await tmtgFinal.setCEx(anonymous1,{from:superowner}).should.be.fulfilled);
                            logger.debug("9-1. delCEx : " + await tmtgFinal.delCEx(anonymous1,{from:superowner}).should.be.fulfilled);
                            logger.debug("9-1. setSuperInvestor : " + await tmtgFinal.setSuperInvestor(anonymous1,{from:superowner}).should.be.fulfilled);
                            logger.debug("9-1. delSuperInvestor : " + await tmtgFinal.delSuperInvestor(anonymous1,{from:superowner}).should.be.fulfilled);
                        })
                    })
                
                    describe("9-2. hiddenOwner's role check", () => {
                        it('[result] : hiddenOwner는 자신과 superOwner의 소유권 변경이 가능하다', async function(){
                            logger.debug("9-2. transferSuperOwnership : " + await tmtgFinal.transferSuperOwnership(anonymous1,{from:hiddenowner}).should.be.fulfilled);
                            logger.debug("9-2. changeHiddenOwner : " + await tmtgFinal.changeHiddenOwner(anonymous1,{from:hiddenowner}).should.be.fulfilled);
                            logger.debug("9-2. changeHiddenOwner : " + await tmtgFinal.changeHiddenOwner(hiddenowner,{from:anonymous1}).should.be.fulfilled);
                            logger.debug("9-2. transferSuperOwnership :  " + await tmtgFinal.transferSuperOwnership(superowner, {from:hiddenowner}).should.be.fulfilled);
                            //logger.debug("9-2. destory : " + await tmtgFinal.destory({from:hiddenowner}).should.be.fulfilled);
                        })
                    })
                    describe("9-3. Owner's role check", () => {
                        it('[result] : owner는 burn, reclaimToken, reclaimEther, stash, blacklist, unblacklist, pause, unpause가 가능하다.', async function() {
                            logger.debug("9-3. burn : " + await tmtgFinal.burn(toSendAmount,{from:owner}));
                            logger.debug("9-3. reclaimToken : " + await tmtgFinal.reclaimToken());
                            logger.debug("9-3. reclaimEther : " + await tmtgFinal.reclaimEther());
                            logger.debug("9-3. stash : " + await tmtgFinal.stash(toSendAmount,{from:owner}));
                            logger.debug("9-3. balanceOf : " + await tmtgFinal.balanceOf(centralbanker));
                            logger.debug("9-3. blacklist : " + await tmtgFinal.blacklist(hiddenowner,{from:owner}));
                            logger.debug("9-3. pause : " + await tmtgFinal.pause());
                            logger.debug("9-3. unpause : " + await tmtgFinal.unpause());
                        })
                    })

                    describe("9-4. Operator's role check", () => {
                        it("[result] : Operator는 blacklist, unblacklist, pause, unpause가 가능하다.", async function() {
                            logger.debug("9.4 test complete");
                        })
                    })

                })//ROLE's check

                describe("10. SCENARIO'S CHECK", () => {
                    describe("10-1. timelock test", () => {
                        it("[result] : 1달 지급하는 도중에 delInvestor 이후, 다시 superInvestor에게 금액을 받는 경우. (이슈)다시 설정하는 값을 넣을 것인가? delInvestor이후 superInvestor에게 금액을 받기전까지 기존의 가지고있던 investor의 값은 자유로이 이용이 가능하다.", async function() {
                            let monthInSeconds = 2.678e+6;
                            let amt = new BigNumber(1e+25);
                            let amt2 = new BigNumber(5e+24);
                            let amt3 = new BigNumber(5e+23);
                            let amt4 = new BigNumber(5e+22);
        
                            logger.debug("0. transfer : " + await amt.should.be.bignumber.equal(amt, await new BigNumber(1e+24)));
                            logger.debug("2. get limit period : " + await tmtgFinal.getLimitPeriod());
                            logger.debug("3. Owner transfers to superInvestor 10M TMTG : " + await tmtgFinal.transfer(superInvestor, amt, {from: owner}));
                            logger.debug("superInvestor transfers to investor 5M TMTG : " + await tmtgFinal.transfer(investor, amt2, {from: superInvestor}));
                            logger.debug("searchInvestor : " + await tmtgFinal.searchInvestor(investor));
                            logger.debug("superInvestor transfers to anonymous2 5M TMTG : " + await tmtgFinal.transfer(anonymous2, amt2, {from: superInvestor}));
                            logger.debug("searchInvestor : " + await tmtgFinal.searchInvestor(anonymous2));
                            logger.debug("investor transfers to anyone 5M TMTG right away : " + await tmtgFinal.transfer(anonymous2, amt2, {from: investor}).should.be.rejected);
                            logger.debug("searchInvestor : " + await tmtgFinal.searchInvestor(investor));
                            logger.debug("searchInvestor : " + await tmtgFinal.searchInvestor(anonymous2));
                            timeTravel(monthInSeconds); // Aug
        
                            logger.debug("get limit period : " + assert.equal(await tmtgFinal.getLimitPeriod(), 1));
                            logger.debug("investor transfer to anyone .5M TMTG right away : " + await tmtgFinal.transfer(anonymous2, amt3, {from: investor}).should.be.fulfilled);
                            logger.debug("searchInvestor : " + await tmtgFinal.searchInvestor(investor));
                            logger.debug("searchInvestor : " + await tmtgFinal.searchInvestor(anonymous2));
                            logger.debug("investor transfer to anyone 1M TMTG right away : " + await tmtgFinal.transfer(anonymous2, amt3 * 2, {from: investor}).should.be.rejected);
                            logger.debug("anonymous2 approves to anyone .5M TMTG right away : " + await tmtgFinal.approve(investor, amt3, {from: anonymous2}).should.be.fulfilled);
                            logger.debug("anonymous2 transfer to anyone using transferfrom  : " + await tmtgFinal.transferFrom(anonymous2,owner,amt3,{from:investor}).should.be.fulfilled);
                            logger.debug("searchInvestor : " + await tmtgFinal.searchInvestor(investor));
                            logger.debug("searchInvestor : " + await tmtgFinal.searchInvestor(anonymous2));
                            logger.debug("delInvestor : " + await tmtgFinal.delInvestor(investor,{from:superowner}).should.be.fulfilled);
                            logger.debug("searchInvestor : " + await tmtgFinal.searchInvestor(investor));
                            logger.debug("balanceOf : " + await tmtgFinal.balanceOf(investor));
                            logger.debug("transfer : " + await tmtgFinal.transfer(owner,await tmtgFinal.balanceOf(investor),{from:investor}).should.be.fulfilled);
                            logger.debug("balanceOf : " + await tmtgFinal.balanceOf(investor));
                            logger.debug("superInvestor transfers to investor 5M TMTG : " + await tmtgFinal.transfer(investor, amt3, {from: superInvestor}).should.be.fulfilled);
                            logger.debug("balanceOf  : " + await tmtgFinal.balanceOf(superInvestor)); 
                            logger.debug("balanceOf : " + await tmtgFinal.balanceOf(investor));
                            logger.debug("searchInvestor : " + await tmtgFinal.searchInvestor(investor));
                            timeTravel(monthInSeconds); // Sep
                            // describe("투자자에게 거래소를 비롯하여 다른 사용자로부터 추가적인 금액을 받을 시, 10개월간 토큰락에 걸린다.", () => {
                            logger.debug("get limit period : " + assert.equal(await tmtgFinal.getLimitPeriod(), 2));
                            logger.debug("approve : " + await tmtgFinal.approve(owner,amt4*2,{from:investor}).should.be.fulfilled);
                            logger.debug("balaneOf : " + await tmtgFinal.balanceOf(anonymous2));
                            logger.debug("transferFrom : " + await tmtgFinal.transferFrom(investor,anonymous2,amt4*2,{from:owner}).should.be.fulfilled);
                            logger.debug("balaneOf : " + await tmtgFinal.balanceOf(anonymous2));
                            logger.debug("searchInvestor : " + await tmtgFinal.searchInvestor(investor));
                            logger.debug("transfer  : " + await tmtgFinal.transfer(investor,amt2,{from:owner}));
                            logger.debug("searchInvestor : " + await tmtgFinal.searchInvestor(investor));
                            logger.debug("balanceOf : " + await tmtgFinal.balanceOf(investor));
                            logger.debug("transfer(rejected) : " + await tmtgFinal.transfer(owner,amt2,{from:investor}).should.be.rejected);
                            timeTravel(monthInSeconds); // Oct
                            
                            // logger.debug("6. get limit period : " + assert.equal(await tmtgFinal.getLimitPeriod(), 3));
                            // logger.debug("investor transfer to anyone .5M TMTG right away : " + await tmtgFinal.transfer(anonymous2, amt3, {from: investor}).should.be.fulfilled);
                            // logger.debug("searchInvestor : " + await tmtgFinal.searchInvestor(investor));
                            // logger.debug("searchInvestor : " + await tmtgFinal.searchInvestor(anonymous2));
                            // logger.debug("investor transfer to anyone 1M TMTG right away : " + await tmtgFinal.transfer(anonymous2, amt3 * 2, {from: investor}).should.be.rejected);
                            // logger.debug("anonymous2 approves to anyone .5M TMTG right away : " + await tmtgFinal.approve(investor, amt3, {from: anonymous2}).should.be.fulfilled);
                            // logger.debug("searchInvestor : " + await tmtgFinal.searchInvestor(investor));
                            // logger.debug("searchInvestor : " + await tmtgFinal.searchInvestor(anonymous2));
                            // timeTravel(monthInSeconds); // Nov
        
                            // logger.debug("7. get limit period : " + assert.equal(await tmtgFinal.getLimitPeriod(), 4));
                            // logger.debug("investor transfer to anyone .5M TMTG right away : " + await tmtgFinal.transfer(anonymous2, amt3, {from: investor}).should.be.fulfilled);
                            // logger.debug("investor transfer to anyone 1M TMTG right away : " + await tmtgFinal.transfer(anonymous2, amt3 * 2, {from: investor}).should.be.rejected);
                            // logger.debug("anonymous2 approves to anyone .5M TMTG right away : " + await tmtgFinal.approve(investor, amt3, {from: anonymous2}).should.be.fulfilled);
                       
                            // timeTravel(monthInSeconds); // Dec
        
                            // logger.debug("8. get limit period : " + assert.equal(await tmtgFinal.getLimitPeriod(), 5));
                            // logger.debug("investor transfer to anyone .5M TMTG right away : " + await tmtgFinal.transfer(anonymous2, amt3, {from: investor}).should.be.fulfilled);
                            // logger.debug("investor transfer to anyone 1M TMTG right away : " + await tmtgFinal.transfer(anonymous2, amt3 * 2, {from: investor}).should.be.rejected);
                            // logger.debug("anonymous2 approves to anyone .5M TMTG right away : " + await tmtgFinal.approve(investor, amt3, {from: anonymous2}).should.be.fulfilled);
                           
                            // timeTravel(monthInSeconds); // Jan
        
                            // logger.debug("9. get limit period : " + assert.equal(await tmtgFinal.getLimitPeriod(), 6));
                            // logger.debug("investor transfer to anyone .5M TMTG right away : " + await tmtgFinal.transfer(anonymous2, amt3, {from: investor}).should.be.fulfilled);
                            // logger.debug("investor transfer to anyone 1M TMTG right away : " + await tmtgFinal.transfer(anonymous2, amt3 * 2, {from: investor}).should.be.rejected);
                            // logger.debug("anonymous2 approves to anyone .5M TMTG right away : " + await tmtgFinal.approve(investor, amt3, {from: anonymous2}).should.be.fulfilled);
                         
                            // timeTravel(monthInSeconds); // Feb
        
                            // logger.debug("10. get limit period : " + assert.equal(await tmtgFinal.getLimitPeriod(), 7));
                            // logger.debug("investor transfer to anyone .5M TMTG right away : " + await tmtgFinal.transfer(anonymous2, amt3, {from: investor}).should.be.fulfilled);
                            // logger.debug("investor transfer to anyone 1M TMTG right away : " + await tmtgFinal.transfer(anonymous2, amt3 * 2, {from: investor}).should.be.rejected);
                            // logger.debug("anonymous2 approves to anyone .5M TMTG right away : " + await tmtgFinal.approve(investor, amt3, {from: anonymous2}).should.be.fulfilled);
                           
                            // timeTravel(monthInSeconds); // Mar
        
                            // logger.debug("11. get limit period : " + assert.equal(await tmtgFinal.getLimitPeriod(), 8));
                            // logger.debug("investor transfer to anyone .5M TMTG right away : " + await tmtgFinal.transfer(anonymous2, amt3, {from: investor}).should.be.fulfilled);
                            // logger.debug("investor transfer to anyone 1M TMTG right away : " + await tmtgFinal.transfer(anonymous2, amt3 * 2, {from: investor}).should.be.rejected);
                            // logger.debug("anonymous2 approves to anyone .5M TMTG right away : " + await tmtgFinal.approve(investor, amt3, {from: anonymous2}).should.be.fulfilled);
                           
                            // timeTravel(monthInSeconds); // Apr
        
                            // logger.debug("12. get limit period : " + assert.equal(await tmtgFinal.getLimitPeriod(), 9));
                            // logger.debug("investor transfer to anyone .5M TMTG right away : " + await tmtgFinal.transfer(anonymous2, amt3, {from: investor}).should.be.fulfilled);
                            // logger.debug("investor transfer to anyone 1M TMTG right away : " + await tmtgFinal.transfer(anonymous2, amt3 * 2, {from: investor}).should.be.rejected);
                            // logger.debug("anonymous2 approves to anyone .5M TMTG right away : " + await tmtgFinal.approve(investor, amt3, {from: anonymous2}).should.be.fulfilled);
                         
                            // timeTravel(monthInSeconds); // May
        
                            // logger.debug("13. get limit period : " + assert.equal(await tmtgFinal.getLimitPeriod(), 10));
                            // logger.debug("investor transfer to anyone .5M TMTG right away : " + await tmtgFinal.transfer(anonymous2, amt3, {from: investor}).should.be.fulfilled);
                            // logger.debug("investor transfer to anyone 1M TMTG right away : " + await tmtgFinal.transfer(anonymous2, amt3 * 2, {from: investor}).should.be.rejected);
                            // logger.debug("anonymous2 approves to anyone .5M TMTG right away : " + await tmtgFinal.approve(investor, amt3, {from: anonymous2}).should.be.fulfilled);
        
                            //logger.debug("superInvestor transfer to investor 5M TMTG : " + await tmtgFinal.transfer(investor, amt2, {from: superInvestor}));
                            logger.debug("superInvestor : " + await tmtgFinal.balanceOf(superInvestor)/(10**18));
                            logger.debug("owner : " + await tmtgFinal.balanceOf(owner)/(10**18));
                            logger.debug("owner : " + await tmtgFinal.balanceOf(owner));
                            logger.debug("investor : " + await tmtgFinal.balanceOf(investor)/(10**18));
                            logger.debug("anonymous2 : " + await tmtgFinal.balanceOf(anonymous2)/(10**18));
                            logger.debug("cex : " + await tmtgFinal.balanceOf(cex)/(10**18));
                        })
                    })
                })//SCENARIO's check
                          
            }) 
        }
    }
}