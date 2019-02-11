module.exports = {

  inicioLibVar: function (nomeScript) {
    //variaveis globais
    moment    = require('moment');
    request   = require('request');
    moment    = require('moment');
    path      = require('path');
    fs        = require('fs');
    gutil     = require('gulp-util')
    config          = require('./config.json');
    CRLF            = "\r\n"
    DEBUG           = config.DEBUG
    intervaloDias   = config.intervaloDias
    urlbasetb       = config.urlbasetb
    arqToken        = config.arqToken
    arqProjectID    = config.arqProjectID
    arqSAP          = config.arqSAP
    arqTBitem       = config.arqTBitem
	arqUsers        = config.arqUsers
    tbNomeProjeto   = config.tb_nome_projeto
    urlbasesap      = config.urlbasesap
    urlSapUser      = config.url_sap_user
    urlSapPass      = config.url_sap_pass
    urlTbUser       = config.url_tb_user
    urlTbPass       = config.url_tb_pass
    mailHost        = config.mailHost
    mailPort        = config.mailPort

    console.log(" ")
    console.log(" ")
    console.log(" ")
    console.log("Script is starting at " + moment().format("DD/MM/YYYY - HH:mm") + ": " + nomeScript )
    console.log("---------------------------------------------------------------------------------")
  },

  eraseAllFilesFromPreviousRun: function () {
    console.log( "Erase all files from previous run ... ")
    this.eraseFile( config.arqToken     )
    this.eraseFile( config.arqProjectID )
    this.eraseFile( config.arqSAP       )
    this.eraseFile( config.arqTBitem    )
    this.eraseFile( config.arqUsers     )
  },

  eraseFile: function (fileName) {
        fs.exists(fileName, function(exists) {
            if(exists) {
                console.log(gutil.colors.green('File ' + fileName + '. Deleting now ...'));
                fs.unlink(fileName);
            } else {
                console.log(gutil.colors.red('File ' + fileName + 'not found, so not deleting.'));
            }
        })
  },

  logWithError: function (urltb, response, body, error) {
    console.log( "Could not access: " + urltb )
    console.log( "response.statusCode: " + response.statusCode )
    console.log( "body: "             + body )
    console.log( "error: "            + error )
    process.exitCode = 1
  },

  fimLibVar: function (nomeScript) {
  }
};