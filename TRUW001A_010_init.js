/******************************************************************************************************/
/* INIT                                                                                               */
/******************************************************************************************************/

var saptb_config = require('./TRUW001A_000_config.js');

saptb_config.inicioLibVar(__filename)

    logger.info("Configuration:")
    logger.info("---------------------------------------------------------------------------------")
    logger.info("arqProjectID     = " + config.arqProjectID)
    logger.info("arqTBitem        = " + config.arqTBitem)
    logger.info("arqToken         = " + config.arqToken)
    logger.info("arqSAP           = " + config.arqSAP)
    logger.info("MOCK             = " + config.MOCK)
    logger.info("logLevel         = " + config.logLevel)
    logger.info("intervaloDias    = " + config.intervaloDias)
    logger.info("tbNomeProjeto    = " + config.tb_nome_projeto)
    logger.info("urlbasesap       = " + config.urlbasesap)
    logger.info("urlbasetb        = " + config.urlbasetb)
    logger.info("urlSapUser       = " + config.url_sap_user)
    logger.info("urlSapPass       = " + "******************")
    logger.info("---------------------------------------------------------------------------------")    

saptb_config.eraseAllFilesFromPreviousRun()

process.exitCode = 0
