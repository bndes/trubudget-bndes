/******************************************************************************************************/
/* IT CHECKS WHETHER THERE IS A GLOBAL ERROR AND THROWS IT TO ANALYSIS
/******************************************************************************************************/

var saptb_config = require('./TRUW001A_000_config.js');

saptb_config.inicioLibVar(__filename)

checkError()

function checkError() {

    var globalError = saptb_config.getValueInExecutionData("globalError");   
    if ( globalError ) {
        logger.error('THERE IS A GLOBAL ERROR ON EXECUTION. CHECK THE LOGS.');
        process.exitCode = 1
    }
    else {
        logger.info('ALL SCRIPTS ENDED CORRECTLY!');
        process.exitCode = 0
    }

}
