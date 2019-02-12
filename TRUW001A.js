/******************************************************************************************************/
/* SCRIPT 00 - ORQUESTRADOR DOS DEMAIS SCRIPTS, I.E., INVOCA CADA UM DOS SCRIPTS DE MANEIRA SINCRONA  */
/******************************************************************************************************/

const execSync = require('child_process').execSync

var log00 = execSync('node TRUW001A_010_init.js')
console.log(" " + log00)

var log01 = execSync('node TRUW001A_020_sap_dwload.js')
console.log(" " + log01)

var log02 = execSync('node TRUW001A_030_tru_auth.js')
console.log(" " + log02)

var log03 = execSync('node TRUW001A_040_tru_prjlist.js')
console.log(" " + log03)

var log04 = execSync('node TRUW001A_050_tru_mkitem.js')
console.log(" " + log04)

var log05 = execSync('node TRUW001A_060_tru_upload.js')
console.log(" " + log05)

var log06 = execSync('node TRUW001A_070_tru_grant.js')
console.log(" " + log06)

var log07 = execSync('node TRUW001A_080_tru_closeitem.js')
console.log(" " + log07)

var log08 = execSync('node TRUW001A_090_tru_grplist.js')
console.log(" " + log08)

var log09 = execSync('node TRUW001A_100_tru_mail.js')
console.log(" " + log09)

setTimeout(function() {
    console.log('ALL DONE!');
    console.log('');
    console.log('');
    console.log('');
}, 1);