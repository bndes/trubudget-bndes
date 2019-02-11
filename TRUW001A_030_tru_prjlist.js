/******************************************************************************************************/
/* SCRIPT 03 - ACESSA O TRUBUDGET E LISTA TODOS OS PROJETOS EXISTENTES. O PROJETO DESEJADO EH GRAVADO */
/*             EM ARQUIVO NO DISCO.                                                                   */
/******************************************************************************************************/
var saptb_config = require('./TRUW001A_config.js');

saptb_config.inicioLibVar(__filename)

acessaTrubudgetListaProjetos( tbNomeProjeto )

saptb_config.fimLibVar(__filename)

process.exitCode = 0

function acessaTrubudgetListaProjetos(chaveDoProjeto) {

    var urltb               = urlbasetb + '/project.list'
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
                var objeto = body.data.items
                for (i in objeto) {
                    for (j in objeto[i].log) {
                        if ( objeto[i].log[j].data.project != undefined ) {
                            if ( DEBUG == true )
                                console.log(objeto[i].log[j].data.project)
                            if ( objeto[i].log[j].data.project.displayName === chaveDoProjeto ) {
                                fs.writeFile( arqProjectID, objeto[i].log[j].data.project.id, function(err, result) {
									if(err) console.log('error', err);
								});
                                console.log("ProjectID of " + tbNomeProjeto + " was selected.")
                            }
                        }
                    }
                }
            }
            else {
                console.log("Could not access: " + urltb )
                process.exitCode = 1
            }
        }
    )
}