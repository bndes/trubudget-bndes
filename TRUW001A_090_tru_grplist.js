/******************************************************************************************************/
/* ACCESS TRUBUDGET AND SAVE THE USER GROUPS IN A TEMPORARY FILE 
/******************************************************************************************************/

var saptb_config = require('./TRUW001A_000_config.js');

saptb_config.inicioLibVar(__filename)

saveUserGroupsInFile();




function saveUserGroupsInFile(){
    var tokenAuth           = fs.readFileSync(arqToken, 'utf8'); //Leitura do Arquivo produzido em script anterior
    var stringAutorizacao   = "Bearer " + tokenAuth
    var opcoesHeader        = { "content-type": "application/json", "accept": "application/json", "Authorization": stringAutorizacao };
    var urltb               = urlbasetb + '/group.list'

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
				var userGroups = body.data.groups

                fs.writeFile( arqUsers, JSON.stringify(userGroups), function(err, result) { //Cria arquivo novo (apaga se existir)
					if(err) logger.error('error', err);
				});

                logger.info("User groups are saved")
            }
            else {
                logger.error( "Could not access: " + urltb )
                logger.error( "response.statusCode: " + response.statusCode )
                logger.error( "body: "             + body )
                logger.error( "error: "            + error )
                process.exitCode = 1
            }
        }
    )


}

