
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
 * dgex 
 */
const dgex = require('../mods/dgex.js')
dgex.core.init(Engine)
dgex.core.components(
    artifacts.require('../contracts/TMTGToken.sol')
)

/**
 * 3. Choose any file from the sub folder
 */
dgex.core.run();
