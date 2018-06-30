module.exports = {
    core: {
        _config: null,
        _logger: null,
        _fs: null,
        _abi: null,
        _contractName: null,

        init: function(config) {
            this._config = config;

        },
        components: function(winston, fs) {
            this._logger = this._initLogger(this._config, winston);
            this._fs = fs;
        },

        build: function() {
            this.logClassStatsIfNeeded(this._config, this._fs, this._logger);

            var data = JSON.parse(this._fs.readFileSync(
                this._config.abipath,
                'utf-8'
            ));
            this._contractName = data.contractName;
            this._abi = data.abi;
        },
        // Logging
        logClassStatsIfNeeded: function(config, fs, logger) {
            console.log("abi dir: " + config.abidir);

            if(config.classStats) {
                var files = fs.readdirSync(config.abidir);
                
                for(var iter in files) {
                    logger.debug('::콘트렉트 클라스, 함수 갯수 정보 ============================\n')
                    var data = JSON.parse(fs.readFileSync(config.abidir + files[iter]), 'utf-8');
                    var funcNames = this.extractMethodNames(data.abi);
                    console.log('funcNames count: ' + funcNames.length);
                    
                    logger.debug('컨트렉트 이름: ' + data.contractName );
                    logger.debug('함수 리스트 --------')
                    for(var k in funcNames) {
                        logger.debug(k + '. ' + funcNames[k]);
                    }
                    logger.debug('\n\n')
                }
            }
        },
        extractMethodNames: function(data) {
            var holder = [];
            for(var iter in data) {
                if('function' === data[iter].type) {
                    console.log(data[iter].name);
                    holder.push(data[iter].name);
                }
            }
            return holder;
        },

        // accessors & mutators
        config: function() {
            return this._config;
        },
        logger: function() {
            return this._logger;
        },
        // accessors & mutators
        contract_name: function() {
            return this._contractName;
        },

        // helper
        _initLogger: function(config, winston) {
            console.log("config: " + config);

            return winston.createLogger({
                format: winston.format.json(),
                transports: [
                    new winston.transports.Console({
                        colorize: true,
                        timestamp: true,
                        level: 'info'
                    }),
                    new winston.transports.File({
                        filename: config.logfile,
                        timestamp: () => new Date().toLocaleDateString(),
                        level: 'debug',
                        prettyPrint: true
                    })     
                ],
                exitOnError: false
            });
        }
    }
}