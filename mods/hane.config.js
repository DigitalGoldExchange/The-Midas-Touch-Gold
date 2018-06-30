module.exports = {
    logfile: 'log/tmtg.utest.log',
    abidir: 'build/contracts/',
    abipath: 'build/contracts/TMTGToken.json',

    /**
     * @note Logs class stats if set to 1.
     */
    classStats: 1,

    // enable/disable unit for testing
    units: [
        { ctor: 1 },                // constructor test
        { totalSupply: 1}           // 총 발행양 테스트
    ]   
}