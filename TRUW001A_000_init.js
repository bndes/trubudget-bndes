/******************************************************************************************************/
/* INITIALIZE - LOADS ALL THE CONFIGURATION     
/******************************************************************************************************/

var saptb_config = require( './TRUW001A_000_config.js' );

saptb_config.inicioLibVar(__filename)

logEnv()

process.exitCode = 0

function logEnv() {
    logger.info("")
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
    logger.info("step             = " +  argStep)
    logger.info("initialDate      = " +  argInitial_date)
    logger.info("finalDate        = " +  argFinal_date)    
    logger.info("---------------------------------------------------------------------------------")
}