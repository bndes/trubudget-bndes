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
            logger.debug ("status = " + response.statusCode )
            if (!error && response.statusCode == 200) {
                var objeto = body.data.items
                for (i in objeto) {
                    for (j in objeto[i].log) {
                        if ( objeto[i].log[j].data.project != undefined ) {
                            logger.debug(objeto[i].log[j].data.project)
                            if ( objeto[i].log[j].data.project.displayName === projectNameDefinedInconfigFile ) {
                                fs.writeFileSync( arqProjectID, objeto[i].log[j].data.project.id);
                                logger.info("ProjectID of " + tbNomeProjeto + " was selected.")
                            }
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