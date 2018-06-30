module.exports = {
    methods: [
        {
            msg: '총 발급량을 확인한다',         // 로그 메세지
            name: 'totalSupply',               // 테스트할 함수명. 
            inputs: null,                      // 파라미터 값
            onlyOwner: false,
            expected: 10000000000              // 예상 리턴 값
        },
        {
            msg: '오프닝 시간을 정한다. 오너가 아니므로 함수는 실패 해야 함',
            name: 'setOpeningTime',
            inputs: null,
            onlyOwner: true,
            expected: 'Fail',
        },
        {
            msg: '오프닝 시간을 정한다. 오너이므로 함수는 성공 해야 함',
            name: 'setOpeningTime',
            inputs:null,
            onlyOwner: true,
            expected: 'OK',
        },
        {
            msg: '주소를 블랙 리스트에 추가한다',
            name: 'blacklisting',
            inputs: [
                '0x252bd1baed2c4694c6b9288e52ffa61c2cd7f74c'
            ],
            onlyOwner: true,
            expected: 'None',
        }
    ]
}