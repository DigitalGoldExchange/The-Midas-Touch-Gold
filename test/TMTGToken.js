
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
 * dgex3.js 
 */
//---------------------------------------------- 테스트 -------------------------------
//const dgex = require('../mods/dgex.js')

const dgex = require('../mods/dgex2.js')
//------------------------------------------------ -------------------------------

dgex.core.init(Engine)
dgex.core.components(
    artifacts.require('../contracts/TMTGToken.sol')
)
/**
 * 3. Choose any file from the sub folder
 */
dgex.core.run();
