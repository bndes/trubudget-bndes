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
console.log("urlSapUser       = " + config.urlSapUser)
console.log("urlSapPass       = " + "******************")
console.log("---------------------------------------------------------------------------------")


console.log( "Erase all files from previous run ... ")
saptb_config.eraseFile( config.arqToken     )
saptb_config.eraseFile( config.arqProjectID )
saptb_config.eraseFile( config.arqSAP       )
saptb_config.eraseFile( config.arqTBitem    )
saptb_config.eraseFile( config.arqUsers     )
    

process.exitCode = 0
