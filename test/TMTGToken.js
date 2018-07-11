
/**
 * @note This code only works under Truffle env.
 * 1. Init engine and its components
 */
// 
const Engine = require('../mods/dgex.engine')
Engine.core.init(require('../mods/dgex.config'))

Engine.core.components(
    require('winston'),
    require('fs')
)
Engine.core.build()

/**
 * 2. Create dgex object
 * dgex.js 기본 단위 & 기능 테스트 
 * dgex2.js 타임락 테스트 매달 10%씩 제한 해제
 * dgex3.js 3달이 지난뒤 30% 이후 매달 10%
 * dgex4.js 1달이 지나지 않았지만 9TMTG 전송 및 approve 이후, 10달이 지난후 100% - 9 TMTG 한번에 전송
 */
//---------------------------------------------- 테스트 -------------------------------
const dgex = require('../mods/dgex.js')

//const dgex = require('../mods/dgex2.js')

//const dgex = require('../mods/dgex3.js')

//const dgex = require('../mods/dgex4.js')

//const dgex = require('../mods/dgex_final.js');

//------------------------------------------------ -------------------------------

dgex.core.init(Engine)
dgex.core.components(
    artifacts.require('../contracts/TMTG.sol')
)
/**
 * 3. Choose any file from the sub folder
 */
dgex.core.run();
