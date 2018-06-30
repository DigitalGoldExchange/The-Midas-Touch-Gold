

module.exports = {
    methods: [
        // {
        //     //0. tokenName check
        //     msg: '0. name check'                           // 로그 메세지
        //     ,name: 'name'                                  // 테스트 할 함수 명                   
        //     ,exptResult : 'success'                        // 예상 여부
        //     ,returns: 'The Midas Touch Gold'               // 예상 리턴값
        //     ,phase : 0                                     // 분기 
        // },
        // {   //0-1. owner check
        //     msg: '0-1. owner check'
        //     ,name : 'owner'
        //     ,inputs: null
        //     ,exptResult : 'success'
        //     ,returns :'0x7c231d6267904ca586f2dbc3ac26e8dda23317f7'
        //     ,phase : 0
        // },
        {   //1. superInvestor check exptResult : fail
            msg: '1. superInvestor check [who] '
            ,name: 'superInvestor'
            ,who: '0x51fe98c33dcf2fddbd4b84ba93c1840fb7f80a8'
            ,exptResult : 'fail'
            ,returns:0
            ,phase : 1
        },
        // {   //1-1. setSuperInvestorCheck[from:Owner - to: anonymousA]
        //     msg: '1-1. setSuperInvestor check [from - to]'
        //     ,name : 'setSuperInvestor'
        //     ,from: '0x7c231d6267904ca586f2dbc3ac26e8dda23317f7'
        //     ,to: '0x51fe98c33dcf2fddbd4b84ba93c1840fb7f80a8'
        //     ,exptResult : 'success'
        //     ,returns: null
        //     ,phase:2
        // },
        
        // {   //1-2. superInvestor check [to : anonymousA] exptResult : success
        //     msg: '1-2. superInvestor check [who]'
        //     ,name : 'superInvestor'
        //     ,who: '0x51fe98c33dcf2fddbd4b84ba93c1840fb7f80a8'
        //     ,returns : 2
        //     ,exptResult : 'success'
        //     , phase : 1
        // },
       
        // {   //1-3. superInvestor check [to : anonymousB] exptResult : fail 
        //     msg: '1-2. superInvestor check [who]'
        //     ,name : 'superInvestor'
        //     ,inputs : [1]
        //     ,who: '0xcfc78b14b51c7d6609263d71838e5ac183c9d9ae'
        //     ,returns : 2
        //     ,exptResult : 'fail'
        //     , phase : 1
        // },

        // {
        //     msg: '1-1. setSuperInvestor check[from Owner - to anonymous]'
        //     ,name: 'setSuperInvestor'
        //     ,inputs: ['0x51FE498C33DcF2FDdBD4b84Ba93C1840Fb7f80A8']
        //     ,returns: 2
        // },
        // {
        //     msg: '2. totalSupply check'
        //     , name :'totalSupply'
        //     , inputs: null
        //     , returns : 1e+28
           
        // },
        // {
        //     msg: '3. balanceOf check'
        //     ,name : 'balanceOf'
        //     ,inputs: ['0x51FE498C33DcF2FDdBD4b84Ba93C1840Fb7f80A8']
        //     ,returns: 0
        // },
        // {
        //     msg: '3-1. balanceOf check'
        //     ,name : 'balanceOf'
        //     ,inputs: ['0x7C231D6267904cA586f2DbC3AC26E8DDa23317f7']
        //     ,returns: 1e+28
        // },
        // {
        //     msg: '4. approve check',
        //     name: 'approve',
        //     inputs: [
        //         '0x252bd1baed2c4694c6b9288e52ffa61c2cd7f74c',
        //         10
        //     ],
        //     returns: true
        // },
        // {
        //     msg: '4-1 allowance check'
        //     , name: 'allowance'
        //     , inputs : [
        //         '0x7C231D6267904cA586f2DbC3AC26E8DDa23317f7'
        //         , '0x252bd1baed2c4694c6b9288e52ffa61c2cd7f74c'
        //     ],
        //     returns : 10
        // },
        // {
        //     msg: '5. INITIAL_SUPPLY check',
        //     name: 'INITIAL_SUPPLY',
           
        // },
        // {
        //     msg: '6. decimals check'
        // },
        // {
        //     msg: '7. investorList check'
        // },
        // {
        //     msg: '8. unpause check'
        // },
        // {
        //     msg: '9. blackList check'
        // },
        // {
        //     msg: '10. CEx check'
        // },
        // {
        //     msg: '11. paused check'
        // },
        // {
        //     msg: '12. balanceOf check'
        // },
        // {
        //     msg: '13. searchInvestor check'
        // },
        // {
        //     msg: '14. pause check'
        // },
        // {
        //     msg: '15. blacklisting check'
        // },
        // {
        //     msg: '16. owner check'
        // },
        // {
        //     msg: '17. deleteFromBlacklist check'
        // },
        // {
        //     msg: '18. symbol check'
        // },
        // {
        //     msg: '19. openingTime check'
        // },
        // {
        //     msg: '20. allowance check'
        // },
        // {
        //     msg: '21. transferOwnership check'
        // },
        // {
        //     msg: '22. setCEx check'
        // },
        // {
        //     msg: '23. delCEx check'
        // },
        // {
        //     msg: '24. setSuperInvestor check'
        // },
        // {
        //     msg: '25. delSuperInvestor check'
        // },
        // {
        //     msg: '26. setOpeningTime check'
        // },
        // {
        //     msg: '27. burn check'
        // },
        // {
        //     msg: '28. burnFrom check'
        // },
        // {
        //     msg: '29. Destruct check'
        // },
        // {
        //     msg: '30. checkTime check'
        // },
        // {
        //     msg: '31. approve check'
        // },
        // {
        //     msg: '32. transfer check'
        // },
        // {
        //     msg: '33. transferFrom check'
        // },
        // {
        //     msg: '34. getLimitPeriod check'
        // }
    ]
}