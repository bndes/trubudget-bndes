/******************************************************************************************************/
/* ACCESS TRUBUDGET AND CLOSE THE SECOND WORKFLOWITEM
/******************************************************************************************************/

var saptb_config = require('./TRUW001A_000_config.js');

saptb_config.inicioLibVar(__filename)

/*FIXME ALL BELOW
identity       = "josej@bndes.gov.br"
projectId      = "f7757856f422392a33fc8ba118c63d91"
subprojectId   = "d773999ba22f5b594e5a3952165a6a01",
workflowitemId = "b25cbfe3a180697b2daf18bb333e40d7"
stringAutorizacao = ""
opcoesHeader      = ""
//FIXME ALL ABOVE */

var dataTypeInfoOne     = 1
opcoesHeader            = saptb_config.loadArqToken()
arqTBUploadDateJSONlist = saptb_config.loadArqTBUploadDate() 
arqTBitemJSONlist       = saptb_config.loadArqTBitem(dataTypeInfoOne)
iterateTheItemToGrant()

function iterateTheItemToGrant() {
    logger.debug( " arqTBitemJSONlist.length: " + arqTBitemJSONlist.length )
    for (var i = 0; i < arqTBitemJSONlist.length; i++) {       
        if ( arqTBitemJSONlist[i] != undefined )       {
            var pkinfo         = arqTBitemJSONlist[i].data['PK-INFO']
            var projectId      = arqTBitemJSONlist[i].data.projectId
            var subprojectId   = arqTBitemJSONlist[i].data.subprojectId
            var workflowitemId = saptb_config.findTheValueOfKey(arqTBUploadDateJSONlist, pkinfo)  //arqTBUploadDateJSONlist[pkinfo]

            acessaTrubudgetFechaPrimeiroWorkflowItem(projectId, subprojectId, workflowitemId)
            logger.debug(pkinfo, projectId, subprojectId, workflowitemId)
        }        
    }
}

function acessaTrubudgetFechaPrimeiroWorkflowItem(projectId, subprojectId, workflowitemId) {
    var urltb      = urlbasetb + '/workflowitem.close'

    var entradaJSON =  {  "apiVersion" : "1.0",
                          "data" :
                           {
                            "projectId"     : projectId,
                            "subprojectId"  : subprojectId,
                            "workflowitemId": workflowitemId
                           }
                        }

    logger.debug(entradaJSON)

    request(
        {
            url : urltb,
            method:'POST',
            body: entradaJSON,
            headers: opcoesHeader,
            json: true
        },
        function (error, response, body) {
            logger.debug ("status = " + response.statusCode )
            if (!error && response.statusCode == 200) {
                logger.info( "Success on closing the workflowitem ... " + body.data)
            }
            else {
                saptb_config.logWithErrorConnection(urltb, response, error, false)
            }
        }
    )
}