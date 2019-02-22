/******************************************************************************************************/
/* AUTHENTICATE ON TRUBUDGET AND SAVE THE TOKEN AT A TEMPORARY FILE 
/******************************************************************************************************/

var saptb_config = require('./TRUW001A_000_config.js');

saptb_config.inicioLibVar(__filename)

acessaTrubudgetAutenticacao()

process.exitCode = 0

function acessaTrubudgetAutenticacao() {
    var urltb        = urlbasetb + '/user.authenticate'
    var opcoesHeader = { "content-type": "application/json", "accept": "application/json" };
    var entradaJSON  = '{ "apiVersion":"1.0", "data":{ "user":{ "id": \"' + urlTbUser + '\" , "password": \"' + urlTbPass + '\" } } }'

    entradaJSON = JSON.parse(entradaJSON)

    logger.debug(entradaJSON)

    var requestTb = {   url : urltb,
                        method:'POST',
                        body: entradaJSON,
                        headers: opcoesHeader,
                        json: true
                    }

    logger.debug(requestTb)

    request(
        requestTb
        ,
        function (error, response) {
            if (!error && response.statusCode == 200) {
                tokenAuth = response.body.data.user.token

                fs.writeFile( arqToken, tokenAuth, function(err, result) { //Cria arquivo novo (apaga se existir)
					if(err) logger.error('error', err);
				});


                logger.info("Trubudget Authentication Token is now ready")

            }
            else {
                saptb_config.logWithError(urltb, response, body, error, true)

            }
        }
    )

}
