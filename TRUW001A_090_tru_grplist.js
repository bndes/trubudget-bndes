/******************************************************************************************************/
/* ACCESS TRUBUDGET AND SAVE THE USER GROUPS IN A TEMPORARY FILE 
/******************************************************************************************************/

var saptb_config = require('./TRUW001A_000_config.js');

saptb_config.inicioLibVar(__filename)

saveUserGroupsInFile();




function saveUserGroupsInFile(){
    var tokenAuth           = fs.readFileSync(arqToken, 'utf8');
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

                fs.writeFileSync( arqUsers, JSON.stringify(userGroups) );

                logger.info("User groups are saved")
            }
            else {
                saptb_config.logWithErrorConnection(urltb, response, response.body, error, true)
            }
        }
    )


}

