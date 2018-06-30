
/**
 * @note This code only works under Truffle env.
 * 1. Init engine and its components
 */
// 
const Engine = require('../mods/hane.engine')
Engine.core.init(require('../mods/hane.config'))
Engine.core.components(
    require('winston'),
    require('fs')
)
Engine.core.build()

/**
 * 2. Create Hane object
 * Hane = Han Sang Il
 */
const Hane = require('../mods/hane.js')
Hane.core.init(Engine)
Hane.core.components(
    artifacts.require('../contracts/TMTGToken.sol')
)

/**
 * 3. Choose any file from the sub folder
 */
Hane.core.run();
