/******************************************************************************************************/
/* SCRIPT 00 - ORQUESTRADOR DOS DEMAIS SCRIPTS, I.E., INVOCA CADA UM DOS SCRIPTS DE MANEIRA SINCRONA  */
/******************************************************************************************************/

const execSync = require('child_process').execSync

var argParam = process.argv[2];
var step = 1;

if (argParam) {
    step = parseInt(argParam);  
}

switch (step) {

    case 0:

    case 10:
    var log = execSync('node TRUW001A_010_init.js')
    console.log(" " + log)

    case 20:    
    log = execSync('node TRUW001A_020_sap_dwload.js')
    console.log(" " + log)

    case 30:    
    log = execSync('node TRUW001A_030_tru_auth.js')
    console.log(" " + log)

    case 40:    
    log = execSync('node TRUW001A_040_tru_prjlist.js')
    console.log(" " + log)

    case 50:    
    log = execSync('node TRUW001A_050_tru_mkitem.js')
    console.log(" " + log)

    case 60:    
    log = execSync('node TRUW001A_060_tru_upload.js')
    console.log(" " + log)

    case 70:    
    log = execSync('node TRUW001A_070_tru_grant.js')
    console.log(" " + log)

    case 80:    
    log = execSync('node TRUW001A_080_tru_closeitem.js')
    console.log(" " + log)

    case 90:    
    log = execSync('node TRUW001A_090_tru_grplist.js')
    console.log(" " + log)

    case 100:    
    log = execSync('node TRUW001A_100_tru_mail.js')
    console.log(" " + log)
}


setTimeout(function() {
    console.log('ALL DONE!');
    console.log('');
    console.log('');
    console.log('');
}, 1);