/******************************************************************************************************/
/* SCRIPT 02 - ACESSA O TRUBUDGET E REALIZA A AUTENTICACAO DO USUARIO DE SERVICO. O TOKEN EH GRAVADO  */
/*             EM ARQUIVO NO DISCO. O NOME DO PROJETO DESEJADO ESTA CONFIGURADO NO CONFIG.JSON        */
/******************************************************************************************************/

var saptb_config = require('./TRUW001A_config.js');

saptb_config.inicioLibVar(__filename)

acessaTrubudgetAutenticacao()



process.exitCode = 0

function acessaTrubudgetAutenticacao() {
    var urltb        = urlbasetb + '/user.authenticate'
    var opcoesHeader = { "content-type": "application/json", "accept": "application/json" };
    var entradaJSON  = '{ "apiVersion":"1.0", "data":{ "user":{ "id": \"' + urlTbUser + '\" , "password": \"' + urlTbPass + '\" } } }'

    entradaJSON = JSON.parse(entradaJSON)

    if (DEBUG == true)
        console.log(entradaJSON)



    var requestTb = {   url : urltb,
                        method:'POST',
                        body: entradaJSON,
                        headers: opcoesHeader,
                        json: true
                    }

    if (DEBUG == true)
        console.log(requestTb)

    request(
        requestTb
        ,
        function (error, response) {
            //console.log ("status = " + response.statusCode )
            if (!error && response.statusCode == 200) {
                tokenAuth = response.body.data.user.token

                fs.writeFile( arqToken, tokenAuth, function(err, result) { //Cria arquivo novo (apaga se existir)
					if(err) console.log('error', err);
				});


                console.log("Trubudget Authentication Token is now ready")

            }
            else {
                console.log("Could not access: " + urltb )
                console.log("Status code: " + response.statusCode)
                console.log(error)
                process.exitCode = 1
            }
        }
    )

}
