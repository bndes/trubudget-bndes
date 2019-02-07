/******************************************************************************************************/
/* SCRIPT 06 - ACESSA O TRUBUDGET PARA ATRIBUIR AS PERMISSOES DOS WORKFLOWITEMS RECEM-CRIADOS.        */
/******************************************************************************************************/

var saptb_config = require('./SAPTB_config.js');

saptb_config.inicioLibVar(__filename)

//FIXME ALL BELOW
identity       = "josej@bndes.gov.br"
projectId      = "f7757856f422392a33fc8ba118c63d91"
subprojectId   = "d773999ba22f5b594e5a3952165a6a01",
workflowitemId = "9dfa87e2ab72578322b48b57e0279027"
stringAutorizacao = ""
opcoesHeader      = ""
//FIXME ALL ABOVE

//DEBUGN
loadsTokenAuth( acessaTrubudgetAtribuiPermissoesWorkflowItem )
return
/*
main(1)

function main(step) {
    if (step == 1) {
        loadsTokenAuth(main)
        return
    }

    if (step == 2) {
        acessaTrubudgetAtribuiPermissoesProjeto(main)
        return
    }
    if (step == 3) {
        acessaTrubudgetAtribuiPermissoesSubProjeto(main)
        return
    }
    if (step == 4) {
        acessaTrubudgetAtribuiPermissoesWorkflowItem()
        return
    }
}
*/

saptb_config.fimLibVar(__filename)
process.exitCode = 0

function loadsTokenAuth(callback) {
    var tokenAuth       = fs.readFileSync(arqToken, 'utf8'); //Leitura do Arquivo produzido em script anterior
    stringAutorizacao   = "Bearer " + tokenAuth
    opcoesHeader        = { "content-type": "application/json", "accept": "application/json", "Authorization": stringAutorizacao };

    if ( DEBUG == true )
        console.log(stringAutorizacao)

    callback(2)
}


function acessaTrubudgetAtribuiPermissoesProjeto(callback) {

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

    if ( DEBUG == true )
        console.log(entradaJSON)

        request(
            {
                url : urltb,
                method:'POST',
                body: entradaJSON,
                headers: opcoesHeader,
                json: true
            },
            function (error, response, body) {
                if ( DEBUG == true )
                    console.log ("status = " + response.statusCode )
                if (!error && response.statusCode == 200) {
                    console.log(body.data)
                    callback(3)
                }
                else {
                    console.log( "Could not access: " + urltb )
                    console.log( "response.statusCode: " + response.statusCode )
                    console.log( "body: "             + body )
                    console.log( "error: "            + error )
                    process.exitCode = 1
                }
            }
        )
    } )
}

function acessaTrubudgetAtribuiPermissoesSubProjeto(callback) {

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

    if ( DEBUG == true )
        console.log(entradaJSON)

        request(
            {
                url : urltb,
                method:'POST',
                body: entradaJSON,
                headers: opcoesHeader,
                json: true
            },
            function (error, response, body) {
                if ( DEBUG == true )
                    console.log ("status = " + response.statusCode )
                if (!error && response.statusCode == 200) {
                    console.log(body.data)
                    callback(4)
                }
                else {
                    console.log( "Could not access: " + urltb )
                    console.log( "response.statusCode: " + response.statusCode )
                    console.log( "body: "             + body )
                    console.log( "error: "            + error )
                    process.exitCode = 1
                }
            }
        )
    } )
}

function acessaTrubudgetAtribuiPermissoesWorkflowItem(x) {
    var urltb      = urlbasetb + '/workflowitem.intent.grantPermission'
    var urltb      = urlbasetb + '/subproject.intent.grantPermission' //DEBUGN
    var actionList = [ "workflowitem.update" ] //, "workflowitem.close" , "workflowitem.view" ] //DEBUGN



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

    if ( DEBUG == true )
        console.log(entradaJSON)

        request(
            {
                url : urltb,
                method:'POST',
                body: entradaJSON,
                headers: opcoesHeader,
                json: true
            },
            function (error, response, body) {
                if ( DEBUG == true )
                    console.log ("status = " + response.statusCode )
                if (!error && response.statusCode == 200) {
                    console.log(body.data)
                }
                else {
                    console.log( "Could not access: " + urltb )
                    console.log( "response.statusCode: " + response.statusCode )
                    console.log( "body: "             + body )
                    console.log( "error: "            + error )
                    process.exitCode = 1
                }
            }
        )
    } )
}



function terminateScript(urltb, response, body, error) {
    console.log( "Could not access: " + urltb )
    console.log( "response.statusCode: " + response.statusCode )
    console.log( "body: "             + body )
    console.log( "error: "            + error )
    process.exitCode = 1
}

//TODO: Este script deverá setar as permissões do 2o workflow item

/*
function acessaTrubudgetListaWorkflowItems(chaveDoProjeto) {

    var urltb               = urlbasetb + '/workflowitem.list?projectId=' + projectID + '&subprojectId=' + subprojectId
    var tokenAuth           = fs.readFileSync(arqToken, 'utf8'); //Leitura do Arquivo produzido em script anterior
    var stringAutorizacao   = "Bearer " + tokenAuth
    var opcoesHeader        = { "content-type": "application/json", "accept": "application/json", "Authorization": stringAutorizacao };

    if ( DEBUG == true )
        console.log(stringAutorizacao)

    request(
        {
            url : urltb,
            method:'GET',
            headers: opcoesHeader,
            json: true
        },
        function (error, response, body) {
            if ( DEBUG == true )
                console.log ("status = " + response.statusCode )
            if (!error && response.statusCode == 200) {
                console.log(body.data)
                /*
                var objeto = body.data.items
                for (i in objeto) {
                    for (j in objeto[i].log) {
                        if ( objeto[i].log[j].data.project != undefined ) {
                            if ( DEBUG == true )
                                console.log(objeto[i].log[j].data.project)

                            if ( objeto[i].log[j].data.project.displayName === chaveDoProjeto ) {
                                fs.writeFile( arqProjectID, objeto[i].log[j].data.project.id);
                                console.log("ProjectID of " + tbNomeProjeto + " was selected.")
                            }
                        }
                    }
                }
                * /
            }
            else {
                console.log("Could not access: " + urltb )
                process.exitCode = 1
            }
        }
    )
}
*/