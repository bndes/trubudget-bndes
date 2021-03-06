module.exports = {

  inicioLibVar: function (nomeScript) {
    //variaveis globais
    moment    = require('moment');
    request   = require('request');
    moment    = require('moment');
    numeral   = require('numeral');    
    path      = require('path');
    fs        = require('fs');
    Str       = require('string');
    var log4js= require('log4js');
   
    config            = require('./config/config.json');
    newLineSeparator  =  ( process.platform === "win32" ? "\r\n" : "\n" )    
    MOCK              = config.MOCK
    MOCKJSON          = require('./config/mock.json');
    MOCKurl           = config.MOCKurl
    intervaloDias     = config.intervaloDias
    urlbasetb         = config.urlbasetb
    arqToken          = config.arqToken
    arqProjectID      = config.arqProjectID 
    arqTBUploadDate   = config.arqTBUploadDate
    arqSAP            = config.arqSAP
    protocolSAP       = config.protocolSAP
    arqTBitem         = config.arqTBitem
    arqUsers          = config.arqUsers
    fsExecutionData   = config.fsExecutionData
    fsExecutionOutput = config.fsExecutionOutput
    fsPilotProjectsFilter = config.fsPilotProjectsFilter
    tbNomeProjeto     = config.tb_nome_projeto
    urlbasesap        = config.urlbasesap

    urlSapUser      = process.env.TRUW001A_SAP_USER
    urlSapPass      = process.env.TRUW001A_SAP_PASS
    urlTbUser       = process.env.TRUW001A_TRU_USER
    urlTbPass       = process.env.TRUW001A_TRU_PASS

    mailHost        = config.mailHost
    mailPort        = config.mailPort

    identity_all_users = "BNDES-TODOS"

    //creates the brazilian locale format
    numeral.register('locale', 'br', {
        delimiters: {
            thousands: '.',
            decimal: ','
        },
        abbreviations: {
            thousand: 'k',
            million: 'm',
            billion: 'b',
            trillion: 't'
        },
        ordinal : function (number) {
            return number === 1 ? 'o' : 'a';
        },
        currency: {
            symbol: 'R$ '
        }
    });

    //sets the brazilian format
    numeral.locale('br');

    let executionOutputStr = 'executionOutput'  
    log4js.configure({
      appenders: { executionOutput: { type: 'file', filename: fsExecutionOutput + ".log" } },
      categories: { default: { appenders: [ executionOutputStr ], level: config.logLevel } }
    }) //trace, debug, info, warn, error, fatal
    
    logger    = log4js.getLogger( executionOutputStr );

    logger.info("")    
    logger.info("Starting " + nomeScript )
    logger.info("---------------------------------------------------------------------------------")
    logger.info("")   
    
    argStep         = process.env.TRUW001A_STEP
    argInitial_date = process.env.TRUW001A_INITIAL_DATE
    argFinal_date   = process.env.TRUW001A_FINAL_DATE

    urlSapUser      = process.env.TRUW001A_SAP_USER
    urlSapPass      = process.env.TRUW001A_SAP_PASS
    urlTbUser       = process.env.TRUW001A_TRU_USER
    urlTbPass       = process.env.TRUW001A_TRU_PASS
   
  },


  loadArqToken: function() {
      var tokenAuth       = fs.readFileSync(arqToken, 'utf8'); 
      var stringAutorizacao   = "Bearer " + tokenAuth
      var opcoesHeader        = { "content-type": "application/json", "accept": "application/json", "Authorization": stringAutorizacao };

      logger.debug(stringAutorizacao)

      return opcoesHeader
  },  

  findTheValueOfKey: function(keyValueJSONlist, key) {
    
    for( var i=0; i < keyValueJSONlist.length; i++ ) {
          logger.debug( keyValueJSONlist[i] )
          logger.debug( keyValueJSONlist[i][key] )
          if ( keyValueJSONlist[i][key] != undefined )
              return keyValueJSONlist[i][key]
      }    
  },

  loadArqTBUploadDate: function()  {
      var arqTBUploadDateJSONlist = []
      if (fs.existsSync(arqTBUploadDate)) {
        var linhas = fs.readFileSync(arqTBUploadDate, 'utf8')
                        .split( newLineSeparator )
                        .filter(Boolean)

        for (var i = 0; i < linhas.length; i++) {
            arqTBUploadDateJSONlist[i] = JSON.parse(linhas[i])        
            logger.debug(arqTBUploadDateJSONlist[i])        
        }
      } else {
            logger.info("There is no file: " + arqTBUploadDate)        
      }

      return arqTBUploadDateJSONlist
  },

  loadArqTBitem: function(datatype) {    
      var arqTBitemJSONlist = []
      var linhas = fs.readFileSync(arqTBitem, 'utf8')
                      .split( newLineSeparator )  
                      .filter(Boolean)

      for (var i = 0; i < linhas.length; i++) {
          arqTBitemJSONlist[i] = JSON.parse(linhas[i])
          if ( arqTBitemJSONlist[i].data["datatype-INFO"] == datatype || datatype == undefined ) {             
              logger.debug( " TRUW001A_000_config :: arqTBitemJSONlist[i] : " + arqTBitemJSONlist[i] )
          } else {
              arqTBitemJSONlist[i] = undefined
          }
      }

      return arqTBitemJSONlist
  },

  changeValueInExecutionData: function (tag, value) {
    
    var executionData;
    if (fs.existsSync(fsExecutionData)) {
      var data = fs.readFileSync(fsExecutionData, 'utf8');
      executionData = JSON.parse(data); 
    }
    else {
      executionData = {};
    }
    executionData[tag] = value; //add some data      
    jsonData = JSON.stringify(executionData); //convert it back to json
    fs.writeFileSync(fsExecutionData, jsonData);
  },


  getValueInExecutionData: function (tag) {

    var data = fs.readFileSync(fsExecutionData, 'utf8');

    executionData = JSON.parse(data); //now, it is an object
    return executionData[tag];
  },  

  eraseFile: function (fileName) {
        fs.exists(fileName, function(exists) {
            if(exists) {
                logger.info('File ' + fileName + '. Deleting now ...')
                fs.unlink(fileName, function(err) {
                  if(err) {
                      var msg = 'Could not delete file  ' + fileName + '.';
                      module.exports.logWithError(msg, err, true)                     
                  }
                })
            } else {
                logger.info('File ' + fileName + ' not found, so not deleting.')
            }
        })
  },

  logWithErrorConnection: function (urltb, response, error, exitScript) {
    logger.error( "Could not access: " + urltb + " " + error);

    if ( response != null && response != undefined ) {
      logger.error( "response.statusCode: " + response.statusCode );
      logger.error( "body: "             + response.body );
    }    
    
    if (exitScript) {
      process.exitCode = 1;
      process.exit();
    }
    else {
      module.exports.changeValueInExecutionData("globalError",true)
    }
  },

  logWithError: function (msg, error, exitScript) {
    logger.error( "message: "            + msg );    
    logger.error( "error: "            + error );        

    if (exitScript) {
      process.exitCode = 1;
      process.exit();
    }
    else {
      module.exports.changeValueInExecutionData("globalError",true)
    }
  },

  sleep: function (ms){
    return new Promise(resolve=>{
        logger.info("Sleeping (miliseconds) : " + ms)
        setTimeout(resolve,ms)
    })
  }

  


};