/******************************************************************************************************/
/* INIT                                                                                               */
/******************************************************************************************************/

var saptb_config = require('./TRUW001A_config.js');

saptb_config.inicioLibVar(__filename)

    console.log("Configuration:")
    console.log("---------------------------------------------------------------------------------")
    console.log("arqProjectID     = " + config.arqProjectID)
    console.log("arqTBitem        = " + config.arqTBitem)
    console.log("arqToken         = " + config.arqToken)
    console.log("arqSAP           = " + config.arqSAP)
    console.log("DEBUG            = " + config.DEBUG)
    console.log("intervaloDias    = " + config.intervaloDias)
    console.log("tbNomeProjeto    = " + config.tb_nome_projeto)
    console.log("urlbasesap       = " + config.urlbasesap)
    console.log("urlbasetb        = " + config.urlbasetb)
    console.log("urlSapUser       = " + config.url_sap_user)
    console.log("urlSapPass       = " + "******************")
    console.log("---------------------------------------------------------------------------------")

saptb_config.eraseAllFilesFromPreviousRun()

process.exitCode = 0
