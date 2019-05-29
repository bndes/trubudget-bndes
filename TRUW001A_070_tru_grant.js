/******************************************************************************************************/
/* ACCESS TRUBUDGET AND GRANT THE PERMISSIONS TO THE PROJECT, SUBPROJECTS AND WORKFLOWITEMS
/******************************************************************************************************/

var saptb_config = require('./TRUW001A_000_config.js');

saptb_config.inicioLibVar(__filename)

var dataTypeInfoTwo = 2
opcoesHeader            = saptb_config.loadArqToken()
arqTBUploadDateJSONlist = saptb_config.loadArqTBUploadDate() 
arqTBitemJSONlist       = saptb_config.loadArqTBitem(dataTypeInfoTwo)

logger.debug( " arqTBitemJSONlist.length: " + arqTBitemJSONlist.length )
if ( arqTBitemJSONlist.length > 0) {
    logger.info ("Proccess grant [list]")
    iterateTheItemToGrant()
}
else
    logger.info ("Nothing to grant [list]")

arqTBitemJSONlistAll    = saptb_config.loadArqTBitem()
logger.debug( " arqTBitemJSONlistAll.length: " + arqTBitemJSONlistAll.length )
if ( arqTBitemJSONlistAll.length > 0) {
    logger.info ("Proccess grant [list all]")
    iterateTheItemToGrantAll()
}
    
else
    logger.info ("Nothing to grant [list all]")

process.exitCode = 0

function iterateTheItemToGrant() {    
    for (var i = 0; i < arqTBitemJSONlist.length; i++) {       
        if ( arqTBitemJSONlist[i] != undefined )       {
            var pkinfo         = arqTBitemJSONlist[i].data['PK-INFO']
            var projectId      = arqTBitemJSONlist[i].data.projectId
            var subprojectId   = arqTBitemJSONlist[i].data.subprojectId
            var identity       = arqTBitemJSONlist[i].data['approvers-groupid'] //urlSapUser
            var workflowitemId = saptb_config.findTheValueOfKey(arqTBUploadDateJSONlist, pkinfo)  //arqTBUploadDateJSONlist[pkinfo]
            changeItems(pkinfo, identity, projectId, subprojectId, workflowitemId)
        }        
    }       
}

function iterateTheItemToGrantAll() {
    
    for (var i = 0; i < arqTBitemJSONlistAll.length; i++) {       
        if ( arqTBitemJSONlistAll[i] != undefined )       {
            var pkinfo         = arqTBitemJSONlistAll[i].data['PK-INFO']
            var projectId      = arqTBitemJSONlistAll[i].data.projectId
            var subprojectId   = arqTBitemJSONlistAll[i].data.subprojectId
            var workflowitemId = saptb_config.findTheValueOfKey(arqTBUploadDateJSONlist, pkinfo)  //arqTBUploadDateJSONlist[pkinfo]
            acessaTrubudgetAtribuiPermissoesViewWorkflowItem(identity_all_users, projectId, subprojectId, workflowitemId)
        }        
    }
        
}

function changeItems(pkinfo, identity, projectId, subprojectId, workflowitemId) {
    acessaTrubudgetAtribuiPermissoesProjeto     (identity, projectId)
    acessaTrubudgetAtribuiPermissoesSubProjeto  (identity, projectId, subprojectId)
    acessaTrubudgetAtribuiPermissoesAllWorkflowItem(identity, projectId, subprojectId, workflowitemId)    
    acessaTrubudgetAtribuiAprovadorWorkflowItem (identity, projectId, subprojectId, workflowitemId)
    logger.info(pkinfo, identity, projectId, subprojectId, workflowitemId)
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
                if (!error && response != null && response != undefined && response.statusCode == 200) {
                    logger.info( "Success on project permission grant ... " + body.data)
                }
                else {
                    saptb_config.logWithErrorConnection(urltb, response, error, true)
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
                if (!error && response != null && response != undefined && response.statusCode == 200) {
                    logger.info( "Success on subproject permission grant ... " + body.data)
                }
                else {
                    saptb_config.logWithErrorConnection(urltb, response, error, true)
                }
            }
        )
    } )
}

function acessaTrubudgetAtribuiPermissoesAllWorkflowItem(identity, projectId, subprojectId, workflowitemId) {
    var actionList = [ "workflowitem.update" , "workflowitem.close" , "workflowitem.view" ]
    acessaTrubudgetAtribuiPermissoesWorkflowItem(identity, projectId, subprojectId, workflowitemId, actionList)
}

function acessaTrubudgetAtribuiPermissoesViewWorkflowItem(identity, projectId, subprojectId, workflowitemId) {
    var actionList = [ "workflowitem.view" ]
    acessaTrubudgetAtribuiPermissoesWorkflowItem(identity, projectId, subprojectId, workflowitemId, actionList)
}

function acessaTrubudgetAtribuiPermissoesWorkflowItem(identity, projectId, subprojectId, workflowitemId, actionList) {
    var urltb      = urlbasetb + '/workflowitem.intent.grantPermission'    

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
                if (!error && response != null && response != undefined && response.statusCode == 200) {
                    logger.info( "Success on workflow permission grant ... " + body.data)
                }
                else {
                    saptb_config.logWithErrorConnection(urltb, response, error, true)
                }
            }
        )
    } )
}

function acessaTrubudgetAtribuiAprovadorWorkflowItem(identity, projectId, subprojectId, workflowitemId) {
    var urltb      = urlbasetb + '/workflowitem.assign'
    
    var entradaJSON =  {  "apiVersion": "1.0",
                            "data":
                            {
                            "identity"      : identity ,
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
            if (!error && response != null && response != undefined && response.statusCode == 200) {
                logger.info( "Success on workflow assignment  ... " + body.data)
            }
            else {
                saptb_config.logWithErrorConnection(urltb, response, error, true)
            }
        }
    )
    
}