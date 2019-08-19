/******************************************************************************************************/
/* ACCESS TRUBUDGET, ITERATE IN ALL THE PROJECTS AND SAVE THE CONFIGURED ONE IN A TEMPORARY FILE
/******************************************************************************************************/
var saptb_config = require('./TRUW001A_000_config.js');

saptb_config.inicioLibVar(__filename)

acessaTrubudgetListaProjetos( config.tb_nome_projeto )

process.exitCode = 0

function acessaTrubudgetListaProjetos(projectNameDefinedInconfigFile) {

    var urltb               = urlbasetb + '/project.list'
    var tokenAuth           = fs.readFileSync(arqToken, 'utf8'); //Leitura do Arquivo produzido em script anterior
    var stringAutorizacao   = "Bearer " + tokenAuth
    var opcoesHeader        = { "content-type": "application/json", "accept": "application/json", "Authorization": stringAutorizacao };

    logger.debug(stringAutorizacao)

    request(
        {
            url : urltb,
            method:'GET',
            headers: opcoesHeader,
            json: true
        },
        function (error, response, body) {
            logger.debug ("response = " + response )
            if (!error && response != undefined && response.statusCode == 200) {
                var objeto = body.data.items
                for (i in objeto) {
                    for (j in objeto[i].log) {
                        //percorre o array ate chegar no ultimo elemento    
                    }
                    logger.debug("objeto[i].log[j].entityId")
                    logger.debug(objeto[i].log[j].entityId)                        
                    for (k in objeto[i].log[j].snapshot) {                            
                        //percorre o array ate chegar no ultimo elemento    
                    }   
                    logger.debug("objeto[i].log[j].snapshot[k]")
                    logger.debug(objeto[i].log[j].snapshot[k])
                    if ( objeto[i].log[j].snapshot[k] != undefined ) {
                        if ( objeto[i].log[j].snapshot[k] === projectNameDefinedInconfigFile ) {
                            fs.writeFileSync( arqProjectID, objeto[i].log[j].entityId);
                            logger.info("ProjectID of " + tbNomeProjeto + " was selected.")
                        }
                    }                     
                    
                }
            }
            else {
                saptb_config.logWithErrorConnection(urltb, response, error, true)
            }
        }
    )
}