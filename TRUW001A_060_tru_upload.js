/******************************************************************************************************/
/* SCRIPT 05 - ACESSA O TRUBUDGET E GRAVAR TODOS OS WORKFLOWS ITEMS MONTADOS NO PASSO ANTERIOR.       */
/******************************************************************************************************/

var saptb_config = require('./TRUW001A_config.js');

saptb_config.inicioLibVar(__filename)

tbJSONitems         = []
itemsSaved          = 0
stringAutorizacao   = ""
opcoesHeader        = ""

tbJSONitems = leCadaDadoTBparaGravarWorkflowItem()
acessaTrubudgetParaGravarWorkflowItem(  )



process.exitCode = 0

function leCadaDadoTBparaGravarWorkflowItem() {
    var tbJSONitems = []

    var linhas = fs.readFileSync(arqTBitem, 'utf8')
                    .split( CRLF )
                    .filter(Boolean)

    for (var i = 0; i < linhas.length; i++) {
        tbJSONitems[i] = JSON.parse(linhas[i])
        //tbJSONitems[i].data.documents = [{"id": "classroom-contract","base64": "dGVzdCBiYXNlNjRTdHJpbmc="}]
        if (DEBUG == true || true) {
            console.log(tbJSONitems[i])
            console.log(tbJSONitems[i].data.documents)
        }
    }

    return tbJSONitems
}

function acessaTrubudgetParaGravarWorkflowItem() {
    var urltb               = urlbasetb + '/subproject.createWorkflowitem'
    var tokenAuth           = fs.readFileSync(arqToken, 'utf8'); //Leitura do Arquivo produzido em script anterior
    stringAutorizacao   = "Bearer " + tokenAuth
    opcoesHeader        = { "content-type": "application/json", "accept": "application/json", "Authorization": stringAutorizacao };
    var self = this

    for (i = 0; i < tbJSONitems.length; i++) {
        var entradaJSON = tbJSONitems[i]
        request(
            {
                url : urltb,
                method:'POST',
                body: entradaJSON,
                headers: opcoesHeader,
                json: true
            },
            function (error, response, body) {
                if (DEBUG == true)
                    console.log ("status = " + response.statusCode )
                if (!error && ( response.statusCode == 200 || response.statusCode == 201 ) ) {
                    console.log("WorkflowItem was saved Trubudget!" )
                    if (DEBUG == true) {
                        console.log(self.itemsSaved)
                        console.log(self.tbJSONitems[self.itemsSaved])
                    }
                    projectId    = self.tbJSONitems[self.itemsSaved].data.projectId
                    subprojectId = self.tbJSONitems[self.itemsSaved].data.subprojectId
                    //description  = self.tbJSONitems[self.itemsSaved].data.description

                    if (DEBUG == true ) {
                        console.log(projectId)
                        console.log(subprojectId)
                    }

                    //acessaTrubudgetListaWorkflowItems(stringAutorizacao, opcoesHeader, projectId, subprojectId)

                    self.itemsSaved++;
                }
                else {
                    saptb_config.logWithError(urltb, response, body, error)
                }
            }
        )
    }
}

function acessaTrubudgetListaWorkflowItems(stringAutorizacao, opcoesHeader, projectID, subprojectId) {

    var urltb               = urlbasetb + '/workflowitem.list?projectId=' + projectID + '&subprojectId=' + subprojectId

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
                console.log(body.data.workflowitems)
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
                */
            }
            else {
                saptb_config.logWithError(urltb, response, body, error)
            }
        }
    )
}