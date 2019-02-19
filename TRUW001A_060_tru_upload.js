/******************************************************************************************************/
/* ACCESS TRUBUDGET AND UPLOAD THE WORKFLOWITEMS MADE
/******************************************************************************************************/

var saptb_config = require('./TRUW001A_000_config.js');

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
        logger.debug(tbJSONitems[i])
        logger.debug(tbJSONitems[i].data.documents)
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
                logger.debug ("status = " + response )
                if (!error && ( response.statusCode == 200 || response.statusCode == 201 ) ) {
                    logger.info("WorkflowItem was saved Trubudget!")                    
                    var jsonBody  = JSON.parse(response.request.body)                    
                    logger.debug( jsonBody )
                    var PKInfo    = JSON.stringify(jsonBody.data['PK-INFO'])
                    if ( PKInfo != undefined ) {
                        PKInfo =  PKInfo + ""
                        PKInfo        = Str(PKInfo).replaceAll('"','')
                        PKInfo        = Str(PKInfo).replaceAll('\\','')
                        var hoje      = moment().format("YYYYMMDD")
                        logger.debug( PKInfo )
                        var jSONlinha = {}
                        jSONlinha[PKInfo] = hoje;
                        logger.debug( jSONlinha )                    
                    
                        fs.appendFile( arqTBUploadDate, JSON.stringify(jSONlinha) + CRLF , function(err, result) {
                            if(err) {
                                process.exitCode = 1
                                return logger.error(err);
                            }
                            logger.info("WorkflowItem was logged on disk (File: " + arqTBUploadDate + " ) ");
                        });
                    }                    

                    logger.debug(self.itemsSaved)
                    logger.debug(self.tbJSONitems[self.itemsSaved])

                    projectId    = self.tbJSONitems[self.itemsSaved].data.projectId
                    subprojectId = self.tbJSONitems[self.itemsSaved].data.subprojectId
                    //description  = self.tbJSONitems[self.itemsSaved].data.description

                    logger.debug(projectId)
                    logger.debug(subprojectId)

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

    logger.debug(stringAutorizacao)

    request(
        {
            url : urltb,
            method:'GET',
            headers: opcoesHeader,
            json: true
        },
        function (error, response, body) {
            logger.debug ("status = " + response.statusCode )
            if (!error && response.statusCode == 200) {
                logger.debug(body.data.workflowitems)
            }
            else {
                saptb_config.logWithError(urltb, response, body, error)
            }
        }
    )
}