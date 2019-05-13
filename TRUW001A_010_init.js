/******************************************************************************************************/
/* INITIALIZE - LOADS ALL THE CONFIGURATION     
/******************************************************************************************************/

var saptb_config = require( './TRUW001A_000_config.js' );

saptb_config.inicioLibVar(__filename)

logger.info("Configuration:")
logger.info("---------------------------------------------------------------------------------")
logger.info("arqProjectID     = " + config.arqProjectID)
logger.info("arqTBitem        = " + config.arqTBitem)
logger.info("arqToken         = " + config.arqToken)
logger.info("arqSAP           = " + config.arqSAP)
logger.info("arqTBUploadDate  = " + config.arqTBUploadDate)
logger.info("MOCK             = " + config.MOCK)
logger.info("MOCKurl          = " + config.MOCKurl)
logger.info("intervaloDias    = " + config.intervaloDias)
logger.info("tbNomeProjeto    = " + config.tb_nome_projeto)
logger.info("urlbasesap       = " + config.urlbasesap)
logger.info("urlbasetb        = " + config.urlbasetb)
logger.info("urlSapUser       = " + urlSapUser)
logger.info("urlTbUser        = " + urlTbUser)
logger.info("---------------------------------------------------------------------------------")


logger.info( "Erase all files from previous run ... ")
saptb_config.eraseFile( config.arqToken     )
saptb_config.eraseFile( config.arqProjectID )
saptb_config.eraseFile( config.arqSAP       )
saptb_config.eraseFile( config.arqTBitem    )
saptb_config.eraseFile( config.arqUsers     )

saptb_config.changeValueInExecutionData("globalError", false)
saptb_config.changeValueInExecutionData("globalSkipSteps", false)
    process.exitCode = 0
