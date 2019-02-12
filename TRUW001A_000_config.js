module.exports = {

  inicioLibVar: function (nomeScript) {
    //variaveis globais
    moment    = require('moment');
    request   = require('request');
    moment    = require('moment');
    path      = require('path');
    fs        = require('fs');
    var log4js= require('log4js');
    logger    = log4js.getLogger();
    
    config          = require('./config.json');
    logger.level    = config.logLevel; //trace, debug, info, warn, error, fatal
    CRLF            = "\r\n"
    MOCK            = config.MOCK
    intervaloDias   = config.intervaloDias
    urlbasetb       = config.urlbasetb
    arqToken        = config.arqToken
    arqProjectID    = config.arqProjectID
    arqSAP          = config.arqSAP
    arqTBitem       = config.arqTBitem
	  arqUsers        = config.arqUsers
    tbNomeProjeto   = config.tb_nome_projeto
    urlbasesap      = config.urlbasesap

    urlSapUser      = process.env.TRUW001A_SAP_USER
    urlSapPass      = process.env.TRUW001A_SAP_PASS
    urlTbUser       = process.env.TRUW001A_TRU_USER
    urlTbPass       = process.env.TRUW001A_TRU_PASS


    mailHost        = config.mailHost
    mailPort        = config.mailPort

    logger.info("Starting " + nomeScript )
    logger.info("---------------------------------------------------------------------------------")
  },

  eraseAllFilesFromPreviousRun: function () {
    logger.info( "Erase all files from previous run ... ")
    this.eraseFile( config.arqToken     )
    this.eraseFile( config.arqProjectID )
    this.eraseFile( config.arqSAP       )
    this.eraseFile( config.arqTBitem    )
    this.eraseFile( config.arqUsers     )
  },

  eraseFile: function (fileName) {
        fs.exists(fileName, function(exists) {
            if(exists) {
                logger.info('File ' + fileName + '. Deleting now ...')
                fs.unlink(fileName)
            } else {
                logger.info('File ' + fileName + ' not found, so not deleting.')
            }
        })
  },

  logWithError: function (urltb, response, body, error) {
    logger.error( "Could not access: " + urltb )
    logger.error( "response.statusCode: " + response.statusCode )
    logger.error( "body: "             + body )
    logger.error( "error: "            + error )
    process.exitCode = 1
  }

};