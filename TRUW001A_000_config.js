module.exports = {

  inicioLibVar: function (nomeScript) {
    //variaveis globais
    moment    = require('moment');
    request   = require('request');
    moment    = require('moment');
    path      = require('path');
    fs        = require('fs');
    Str       = require('string');
    var log4js= require('log4js');
   
    config            = require('./config/config.json');
    CRLF              = "\r\n"
    MOCK              = config.MOCK
    intervaloDias     = config.intervaloDias
    urlbasetb         = config.urlbasetb
    arqToken          = config.arqToken
    arqProjectID      = config.arqProjectID 
    arqTBUploadDate   = config.arqTBUploadDate
    arqSAP            = config.arqSAP
    arqTBitem         = config.arqTBitem
    arqUsers          = config.arqUsers
    fsExecutionData   = config.fsExecutionData
    fsExecutionOutput = config.fsExecutionOutput
    tbNomeProjeto     = config.tb_nome_projeto
    urlbasesap        = config.urlbasesap

    urlSapUser      = process.env.TRUW001A_SAP_USER
    urlSapPass      = process.env.TRUW001A_SAP_PASS
    urlTbUser       = process.env.TRUW001A_TRU_USER
    urlTbPass       = process.env.TRUW001A_TRU_PASS

    mailHost        = config.mailHost
    mailPort        = config.mailPort

    log4js.configure({
      appenders: { executionOutput: { type: 'file', filename: fsExecutionOutput } },
      categories: { default: { appenders: ['executionOutput'], level: config.logLevel } }
    }) //trace, debug, info, warn, error, fatal

    logger    = log4js.getLogger('executionOutput');

    logger.info("Starting " + nomeScript )
    logger.info("---------------------------------------------------------------------------------")
  },


  changeValueInExecutionData: function (tag, value) {
    console.log("execution");    

    fs.exists(fsExecutionData, function(exists) {
      console.log("inside exist");    
        if(exists) {
          var data = fs.readFileSync(fsExecutionData, 'utf8');
          executionData = JSON.parse(data); 
        } else {
          executionData = {};
        }
        executionData[tag] = value; //add some data      
        jsonData = JSON.stringify(executionData); //convert it back to json
        fs.writeFileSync(fsExecutionData, jsonData)
    })  

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
                      logger.error('Could not delete file  ' + fileName + '.')
                      process.exitCode = 1
                      process.exit();                      
                  }
                })
            } else {
                logger.info('File ' + fileName + ' not found, so not deleting.')
            }
        })
  },

  logWithError: function (urltb, response, body, error, exitScript) {
    logger.error( "Could not access: " + urltb );
    logger.error( "response.statusCode: " + response.statusCode );
    logger.error( "body: "             + body );
    logger.error( "error: "            + error );
    process.exitCode = 1;
    if (exitScript) {
      process.exit();
    }
  }

};