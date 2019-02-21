/******************************************************************************************************/
/* ACCESS TRUBUDGET AND CLOSE THE SECOND WORKFLOWITEM
/******************************************************************************************************/

var saptb_config = require('./TRUW001A_000_config.js');

saptb_config.inicioLibVar(__filename)

//FIXME ALL BELOW
identity       = "josej@bndes.gov.br"
projectId      = "f7757856f422392a33fc8ba118c63d91"
subprojectId   = "d773999ba22f5b594e5a3952165a6a01",
workflowitemId = "b25cbfe3a180697b2daf18bb333e40d7"
stringAutorizacao = ""
opcoesHeader      = ""
//FIXME ALL ABOVE

loadsTokenAuth( acessaTrubudgetFechaPrimeiroWorkflowItem )


process.exitCode = 0

function loadsTokenAuth( functionToCall ) {
    var tokenAuth       = fs.readFileSync(arqToken, 'utf8'); //Leitura do Arquivo produzido em script anterior
    stringAutorizacao   = "Bearer " + tokenAuth
    opcoesHeader        = { "content-type": "application/json", "accept": "application/json", "Authorization": stringAutorizacao };

    logger.debug(stringAutorizacao)

    functionToCall()
}

function acessaTrubudgetFechaPrimeiroWorkflowItem() {
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
                saptb_config.logWithError(urltb, response, body, error, false)
            }
        }
    )
}