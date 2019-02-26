/******************************************************************************************************/
/* ACCESS TRUBUDGET AND GRANT THE PERMISSIONS TO THE PROJECT, SUBPROJECTS AND WORKFLOWITEMS
/******************************************************************************************************/

var saptb_config = require('./TRUW001A_000_config.js');

saptb_config.inicioLibVar(__filename)

//FIXME ALL BELOW
//identity       = "josej@bndes.gov.br"
//projectId      = "f7757856f422392a33fc8ba118c63d91"
//subprojectId   = "d773999ba22f5b594e5a3952165a6a01",
//workflowitemId = "b25cbfe3a180697b2daf18bb333e40d7"
//FIXME ALL ABOVE

stringAutorizacao = ""
opcoesHeader      = ""

arqTBUploadDateJSONlist = []
arqTBitemJSONlist = []

loadArqToken()
loadArqTBUploadDate() 
loadArqTBitem()
iterateTheItemToGrant()

process.exitCode = 0

function loadArqToken() {
    var tokenAuth       = fs.readFileSync(arqToken, 'utf8'); 
    stringAutorizacao   = "Bearer " + tokenAuth
    opcoesHeader        = { "content-type": "application/json", "accept": "application/json", "Authorization": stringAutorizacao };

    logger.debug(stringAutorizacao)
}

function loadArqTBUploadDate() {
    var linhas = fs.readFileSync(arqTBUploadDate, 'utf8')
                    .split( CRLF )
                    .filter(Boolean)

    for (var i = 0; i < linhas.length; i++) {
        arqTBUploadDateJSONlist[i] = JSON.parse(linhas[i])
        logger.debug(arqTBUploadDateJSONlist[i])        
    }
}

function loadArqTBitem() {    
    var linhas = fs.readFileSync(arqTBitem, 'utf8')
                    .split( CRLF )
                    .filter(Boolean)

    for (var i = 0; i < linhas.length; i++) {
        arqTBitemJSONlist[i] = JSON.parse(linhas[i])
        logger.debug(arqTBitemJSONlist[i])        
    }
}

function iterateTheItemToGrant() {
    for (var i = 0; i < arqTBitemJSONlist.length; i++) {             
        var pkinfo         = arqTBitemJSONlist[i].data['PK-INFO']
        var projectId      = arqTBitemJSONlist[i].data.projectId
        var subprojectId   = arqTBitemJSONlist[i].data.subprojectId
        console.log(pkinfo)
        console.log(arqTBUploadDateJSONlist)
        var workflowitemId = arqTBUploadDateJSONlist[pkinfo]
        var identity       = urlSapUser

        logger.debug( pkinfo         )
        logger.debug( projectId      )
        logger.debug( subprojectId   )
        logger.debug( workflowitemId )
        logger.debug( identity       ) 

        acessaTrubudgetAtribuiPermissoesProjeto     (identity, projectId)
        acessaTrubudgetAtribuiPermissoesSubProjeto  (identity, projectId, subprojectId)
        acessaTrubudgetAtribuiPermissoesWorkflowItem(identity, projectId, subprojectId, workflowitemId)
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
                    saptb_config.logWithError(urltb, response, body, error, true)
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
                    saptb_config.logWithError(urltb, response, body, error)
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
                    saptb_config.logWithError(urltb, response, body, error)
                }
            }
        )
    } )
}