/******************************************************************************************************/
/* SCRIPT 00 - ORQUESTRADOR DOS DEMAIS SCRIPTS, I.E., INVOCA CADA UM DOS SCRIPTS DE MANEIRA SINCRONA  */
/******************************************************************************************************/

const execSync = require('child_process').execSync

var log01 = execSync('node SAPTB_01.js')
console.log(" " + log01)

var log02 = execSync('node SAPTB_02.js')
console.log(" " + log02)

var log03 = execSync('node SAPTB_03.js')
console.log(" " + log03)

var log04 = execSync('node SAPTB_04.js')
console.log(" " + log04)

var log05 = execSync('node SAPTB_05.js')
console.log(" " + log05)

var log06 = execSync('node SAPTB_06.js')
console.log(" " + log06)

var log07 = execSync('node SAPTB_07.js')
console.log(" " + log07)

var log08 = execSync('node SAPTB_08.js')
console.log(" " + log08)


setTimeout(function() {
    console.log('ALL DONE!');
    console.log('');
    console.log('');
    console.log('');
}, 1);