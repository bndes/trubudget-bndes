module.exports = {

  inicioLibVar: function (nomeScript) {
    //variaveis globais
    moment    = require('moment');
    request   = require('request');
    moment    = require('moment');
    path      = require('path');
    fs        = require('fs');
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
    fsExecutionData = config.fsExecutionData
    tbNomeProjeto   = config.tb_nome_projeto
    urlbasesap      = config.urlbasesap

    urlSapUser      = process.env.TRUW001A_SAP_USER
    urlSapPass      = process.env.TRUW001A_SAP_PASS
    urlTbUser       = process.env.TRUW001A_TRU_USER
    urlTbPass       = process.env.TRUW001A_TRU_PASS

    mailHost        = config.mailHost
    mailPort        = config.mailPort

    var executionTime = moment().format("DD/MM/YYYY - HH:mm");
    this.changeValueInExecutionData("lastStepTime", executionTime);
    this.changeValueInExecutionData("lastScriptToBeExecuted", nomeScript);    

    console.log(" ")
    console.log(" ")
    console.log(" ")
    console.log("Script is starting at " + executionTime + ": " + nomeScript )
    console.log("---------------------------------------------------------------------------------")
  },



  changeValueInExecutionData: function changeValueInExecutionData(tag, value) {

    var data = fs.readFileSync(fsExecutionData, 'utf8');

    executionData = JSON.parse(data); //now it an object
    executionData[tag] = value; //add some data

    jsonData = JSON.stringify(executionData); //convert it back to json
    fs.writeFileSync(fsExecutionData, jsonData) 

  },


  eraseFile: function (fileName) {
        fs.exists(fileName, function(exists) {
            if(exists) {
                console.log('File ' + fileName + '. Deleting now ...')
                fs.unlink(fileName, function(err) {
                  if(err) {
                      console.log('Could not delete file  ' + fileName + '.')
                      process.exitCode = 1
                      process.exit();                      
                  }
                })
            } else {
                console.log('File ' + fileName + ' not found, so not deleting.')
            }
        })
  },

  logWithError: function (urltb, response, body, error) {
    console.log( "Could not access: " + urltb )
    console.log( "response.statusCode: " + response.statusCode )
    console.log( "body: "             + body )
    console.log( "error: "            + error )
    process.exitCode = 1
  }

};