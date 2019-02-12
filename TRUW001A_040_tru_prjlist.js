/******************************************************************************************************/
/* SCRIPT 03 - ACESSA O TRUBUDGET E LISTA TODOS OS PROJETOS EXISTENTES. O PROJETO DESEJADO EH GRAVADO */
/*             EM ARQUIVO NO DISCO.                                                                   */
/******************************************************************************************************/
var saptb_config = require('./TRUW001A_000_config.js');

saptb_config.inicioLibVar(__filename)

acessaTrubudgetListaProjetos( tbNomeProjeto )

process.exitCode = 0

function acessaTrubudgetListaProjetos(chaveDoProjeto) {

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
                            if ( objeto[i].log[j].data.project.displayName === chaveDoProjeto ) {
                                fs.writeFile( arqProjectID, objeto[i].log[j].data.project.id, function(err, result) {
									if(err) logger.error('error', err);
								});
                                logger.info("ProjectID of " + tbNomeProjeto + " was selected.")
                            }
                        }
                    }
                }
            }
            else {
                logger.error("Could not access: " + urltb )
                process.exitCode = 1
            }
        }
    )
}