/******************************************************************************************************/
/* INITIALIZE - ERASE ALL THE DATA FROM PREVIOUS RUN     
/******************************************************************************************************/

var saptb_config = require( './TRUW001A_000_config.js' );

saptb_config.inicioLibVar(__filename)

eraseThings()

process.exitCode = 0

function eraseThings() {
    logger.info( "Erase all files from previous run ... ")
    saptb_config.eraseFile( config.arqToken     )
    saptb_config.eraseFile( config.arqProjectID )
    saptb_config.eraseFile( config.arqSAP       )
    saptb_config.eraseFile( config.arqTBitem    )
    saptb_config.eraseFile( config.arqUsers     )

    saptb_config.changeValueInExecutionData("globalError", false)
    saptb_config.changeValueInExecutionData("globalSkipSteps", false)

}

