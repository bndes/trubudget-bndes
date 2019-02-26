/******************************************************************************************************/
/* MAIN SCRIPT
/*
/* THIS SCRIPT CALLS THE OTHER SUBSCRIPTS SYNCHRONOUSLY
/* PARAMETERS (IN ORDER):
/*  1) X (NUMBER)      - STARTS FROM THE SUBSCRIPT/STEP NUMBER (FROM 0 TO 100). DEFAULT: 0
/*  2) YYYYMMDD (DATE) - THE INITIAL DATE OF PROCESSING DATA. DEFAULT: TODAY - INTERVAL(DEFINED IN CONFIG FILE)
/*  3) YYYYMMDD (DATE) - THE FINAL DATE OF PROCESSING DATA.   DEFAULT: TOMORROW
*/
/******************************************************************************************************/

const execSync = require('child_process').execSync
var saptb_config = require('./TRUW001A_000_config.js');

saptb_config.inicioLibVar(__filename)

var argParamStep = process.argv[2];
var step = 0;

if (argParamStep) {
    step = parseInt(argParamStep);  
}

saveReceivedOrDefaultDates();

switch (step) {

    case 0:
 
    case 10:
        runNow("TRUW001A_010_init.js")

    case 20:    
        runNow("TRUW001A_020_sap_dwload.js")
    
    case 30:    
        runNow("TRUW001A_030_tru_auth.js")
    
    case 40:    
        runNow("TRUW001A_040_tru_prjlist.js")

    case 50:    
        runNow("TRUW001A_050_tru_mkitem.js")

    case 60:    
        runNow("TRUW001A_060_tru_upload_first.js")

    case 65:    
        runNow("TRUW001A_060_tru_upload_second.js")
        
    case 70:    
        runNow("TRUW001A_070_tru_grant.js")
    
    case 80:    
        runNow("TRUW001A_080_tru_closeitem.js")
    
    case 90:    
        runNow("TRUW001A_090_tru_grplist.js")
    
    case 100:    
        runNow("TRUW001A_100_tru_mail.js")

    case 110:    
        runNow("TRUW001A_110_tru_checkerror.js")        
        
}


setTimeout(function() {
    logger.info('ALL SCRIPTS SUBMITED!');
}, 1);

function runNow(scriptName) {
    var log = execSync('node ' + scriptName)
    logger.info(" " + log)
    saptb_config.changeValueInExecutionData("lastCommandExecutedTime", moment().format("DD/MM/YYYY - HH:mm") )
    saptb_config.changeValueInExecutionData("lastCommandExecutedOK", scriptName)
}


function saveReceivedOrDefaultDates() {

    var argParamInicialDate = process.argv[3];
    var initialDate = moment().subtract(intervaloDias, 'days'); //default value

    if (argParamInicialDate)  {
        initialDate = moment(argParamInicialDate, "YYYYMMDD");

        if (!initialDate.isValid()) {
            var msg = "initialDate was present but is invalid. The expect format is YYYYMMDD. The received was=" + argParamInicialDate; 
            saptb_config.logWithError (msg, null, true);
        }
    }

    var argParamFinalDate = process.argv[4];
    var finalDate = moment().add(1, 'days') //default value

    if (argParamFinalDate)  {
        finalDate = moment(argParamFinalDate, "YYYYMMDD");

        if (!finalDate.isValid()) { 
            var msg = "finalDate was present but is invalid. The expect format is YYYYMMDD. The received was=" + argParamFinalDate;
            saptb_config.logWithError (msg, null, true);    
        }
    }

    logger.info("Initial date = " + initialDate.format("YYYYMMDD") + " and Final date= " + finalDate.format("YYYYMMDD"));
    saptb_config.changeValueInExecutionData("initialDateToCollectData", initialDate.format("YYYYMMDD"))
    saptb_config.changeValueInExecutionData("finalDateToCollectData", finalDate.format("YYYYMMDD"))    

}