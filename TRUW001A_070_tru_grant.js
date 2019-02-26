/******************************************************************************************************/
/* ACCESS TRUBUDGET AND GRANT THE PERMISSIONS TO THE PROJECT, SUBPROJECTS AND WORKFLOWITEMS
/******************************************************************************************************/

var saptb_config = require('./TRUW001A_000_config.js');

saptb_config.inicioLibVar(__filename)

var dataTypeInfoTwo = 2
opcoesHeader            = saptb_config.loadArqToken()
arqTBUploadDateJSONlist = saptb_config.loadArqTBUploadDate() 
arqTBitemJSONlist       = saptb_config.loadArqTBitem(dataTypeInfoTwo)
iterateTheItemToGrant()


function iterateTheItemToGrant() {
    for (var i = 0; i < arqTBitemJSONlist.length; i++) {       
        if ( arqTBitemJSONlist[i] != undefined )       {
            var pkinfo         = arqTBitemJSONlist[i].data['PK-INFO']
            var projectId      = arqTBitemJSONlist[i].data.projectId
            var subprojectId   = arqTBitemJSONlist[i].data.subprojectId
            var identity       = arqTBitemJSONlist[i].data['approvers-groupid'] //urlSapUser
            var workflowitemId = saptb_config.findTheValueOfKey(arqTBUploadDateJSONlist, pkinfo)  //arqTBUploadDateJSONlist[pkinfo]

            acessaTrubudgetAtribuiPermissoesProjeto     (identity, projectId)
            acessaTrubudgetAtribuiPermissoesSubProjeto  (identity, projectId, subprojectId)
            acessaTrubudgetAtribuiPermissoesWorkflowItem(identity, projectId, subprojectId, workflowitemId)
            logger.debug(pkinfo, identity, projectId, subprojectId, workflowitemId)
        }        
    }
}

function acessaTrubudgetAtribuiPermissoesProjeto(identity, projectId) {

    var urltb      = urlbasetb + '/project.intent.grantPermission'
    var actionList = [ "project.viewDetails" , "project.viewSummary"]

    actionList.forEach( function(actionElement) {

        var entradaJSON =  {  "apiVersion": "1.0",
                              "data":
                               {
                                "identity"      : identity ,
                                "intent"        : actionElement ,
                                "projectId"     : projectId
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
                    logger.info( "Success on project permission grant ... " + body.data)
                }
                else {
                    saptb_config.logWithErrorConnection(urltb, response, body, error, true)
                }
            }
        )
    } )
}

function acessaTrubudgetAtribuiPermissoesSubProjeto(identity, projectId, subprojectId) {

    var urltb      = urlbasetb + '/subproject.intent.grantPermission'
    var actionList = [ "subproject.viewDetails" , "subproject.viewSummary" ]

    actionList.forEach( function(actionElement) {

        var entradaJSON =  {  "apiVersion": "1.0",
                              "data":
                               {
                                "identity"      : identity ,
                                "intent"        : actionElement ,
                                "projectId"     : projectId,
                                "subprojectId"  : subprojectId
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
                    logger.info( "Success on subproject permission grant ... " + body.data)
                }
                else {
                    saptb_config.logWithErrorConnection(urltb, response, body, error)
                }
            }
        )
    } )
}

function acessaTrubudgetAtribuiPermissoesWorkflowItem(identity, projectId, subprojectId, workflowitemId) {
    var urltb      = urlbasetb + '/workflowitem.intent.grantPermission'
    var actionList = [ "workflowitem.update" , "workflowitem.close" , "workflowitem.view" ]


    actionList.forEach( function(actionElement) {

        var entradaJSON =  {  "apiVersion": "1.0",
                              "data":
                               {
                                "identity"      : identity ,
                                "intent"        : actionElement ,
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
                    logger.info( "Success on workflow permission grant ... " + body.data)
                }
                else {
                    saptb_config.logWithErrorConnection(urltb, response, body, error)
                }
            }
        )
    } )
}