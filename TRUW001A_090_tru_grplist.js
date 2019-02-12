/******************************************************************************************************/
/* SCRIPT 07 - ACESSA O TRUBUDGET PARA SALVAR GRUPOS DE USUARIOS EM ARQUIVO                           */
/******************************************************************************************************/

var saptb_config = require('./TRUW001A_config.js');

saptb_config.inicioLibVar(__filename)

saveUserGroupsInFile();




function saveUserGroupsInFile(){
    var tokenAuth           = fs.readFileSync(arqToken, 'utf8'); //Leitura do Arquivo produzido em script anterior
    var stringAutorizacao   = "Bearer " + tokenAuth
    var opcoesHeader        = { "content-type": "application/json", "accept": "application/json", "Authorization": stringAutorizacao };
    var urltb               = urlbasetb + '/group.list'

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
				var userGroups = body.data.groups

                fs.writeFile( arqUsers, JSON.stringify(userGroups), function(err, result) { //Cria arquivo novo (apaga se existir)
					if(err) console.log('error', err);
				});


                console.log("User groups are saved")



            }
            else {
                console.log( "Could not access: " + urltb )
                console.log( "response.statusCode: " + response.statusCode )
                console.log( "body: "             + body )
                console.log( "error: "            + error )
                process.exitCode = 1
            }
        }
    )


}

