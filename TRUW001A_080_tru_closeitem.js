/******************************************************************************************************/
/* ACCESS TRUBUDGET AND CLOSE THE SECOND WORKFLOWITEM
/******************************************************************************************************/

var saptb_config = require('./TRUW001A_000_config.js');

saptb_config.inicioLibVar(__filename)

var dataTypeInfoOne     = 1
opcoesHeader            = saptb_config.loadArqToken()
arqTBUploadDateJSONlist = saptb_config.loadArqTBUploadDate() 
arqTBitemJSONlist       = saptb_config.loadArqTBitem(dataTypeInfoOne)
iterateTheItemToGrant()

async function iterateTheItemToGrant() {
    logger.debug( " arqTBitemJSONlist.length: " + arqTBitemJSONlist.length )

    for (var i = 0; i < arqTBitemJSONlist.length; i++) {       
        if ( arqTBitemJSONlist[i] != undefined )       {
            var pkinfo         = arqTBitemJSONlist[i].data['PK-INFO']
            var projectId      = arqTBitemJSONlist[i].data.projectId
            var subprojectId   = arqTBitemJSONlist[i].data.subprojectId
            var workflowitemId = saptb_config.findTheValueOfKey(arqTBUploadDateJSONlist, pkinfo)  //arqTBUploadDateJSONlist[pkinfo]

            acessaTrubudgetFechaPrimeiroWorkflowItem(projectId, subprojectId, workflowitemId)
            await saptb_config.sleep(150)
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
            logger.debug ("reponse = " + response )
            if (!error && response != undefined && response.statusCode == 200) {
                logger.info( "Success on closing the workflowitem ... " + body.data)
            }
            else {
                saptb_config.logWithErrorConnection(urltb, response, error, false)
            }
        }
    )
}