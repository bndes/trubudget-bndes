/******************************************************************************************************/
/* SCRIPT 04 - ACESSA O TRUBUDGET E LISTA TODOS OS SUBPROJETOS DO PROJETO DESEJADO E MONTA A LISTA DE */
/*             WORKFLOW ITEMS A SEREM GRAVADOS NUM PROXIMO PASSO.                                     */
/******************************************************************************************************/
var saptb_config = require('./TRUW001A_000_config.js');

saptb_config.inicioLibVar(__filename)

leCadaDadoSAPparaGravarRespectivaLiberacao()

process.exitCode = 0

function leCadaDadoSAPparaGravarRespectivaLiberacao() {
    var linhas = fs.readFileSync(arqSAP, 'utf8', function(err, result) {
		if(err) logger.error('error', err);
	}).split( CRLF )
      .filter(Boolean)

    var objetoSAP = []

    var empresa       = "emp" //TODO: vem do arqSAP objetoSAP[i].empresa
    var numdoc        = "num" //TODO: vem do arqSAP objetoSAP[i].numdoc
    var dataExercicio = "exe" //TODO: vem do arqSAP objetoSAP[i].exercicio

/*
//TODO: fazer filtro do arqSAP para conter apenas os registros que ainda nao foram gravados no Trubudget, consultando o arquivo 
// arqTbUploadDate.json
    {
        "empresa-numdoc-exercicio" : "yyyymmdd",
        "empresa-numdoc-exercicio" : "yyyymmdd",
        "empresa-numdoc-exercicio" : "yyyymmdd"
    }
*/

    for (var i = 0; i < linhas.length; i++) {
        objetoSAP[i] = JSON.parse(linhas[i])
        logger.debug(objetoSAP[i])
        if ( objetoSAP[i].contrato != undefined ) {
            var projetoOPE = objetoSAP[i].contrato.substr(0,7)

            acessaTrubudgetListaDeSubProjetos( projetoOPE, 
                objetoSAP[i].referencia, 
                objetoSAP[i].valor, 
                objetoSAP[i].dataPagamento,
                empresa, 
                numdoc,
                dataExercicio )

            logger.debug ("projetoOPE: " + projetoOPE)
        }
    }
}

function acessaTrubudgetListaDeSubProjetos(projetoOpe, referencia, valor, paymentDate) {

    var tokenAuth           = fs.readFileSync(arqToken, 'utf8', function(err, result) {
		if(err) logger.error('error', err);
	}); //Leitura do Arquivo produzido em script anterior

    var projectID           = fs.readFileSync(arqProjectID, 'utf8', function(err, result) {
		if(err) logger.error('error', err);
	}); //Leitura do Arquivo produzido em script anterior

    var urltb               = urlbasetb + '/subproject.list?projectId=' + projectID
    var stringAutorizacao   = "Bearer " + tokenAuth
    var opcoesHeader        = { "content-type": "application/json", "accept": "application/json", "Authorization": stringAutorizacao };
    var datahora            = moment().format("DD/MM/YYYY - HH:mm")
    var datahoraseg         = moment().format("YYYYMMDDHHmmss")
    var dataUser            = moment().format("DD/MM/YYYY")

    logger.debug(stringAutorizacao)

    //Cria arquivo novo
    fs.writeFile( arqTBitem, "", function(err, result) {
		if(err) logger.error('error', err);
	});

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
                    logger.debug(objeto[i].data.description)
                    
                    //var nomeDoSubProjeto = objeto[i].data.displayName
                    var chaveIntegracao = objeto[i].data.description
                    var jsonCamposAdicionais
                    try {
                        jsonCamposAdicionais = JSON.parse(objeto[i].data.description)
                    } catch (error) {
                        logger.error("The Sub-project comment is not a JSON object (" + projetoOpe + ")");
                        logger.error(error)
                        process.exitCode = 1
                        return
                    }

                    if ( chaveIntegracao != undefined && chaveIntegracao.includes( projetoOpe ) ) {
						logger.debug(objeto[i])
						subProjectID = objeto[i].data.id
						subProjectName = objeto[i].data.displayName
						logger.debug("subprojeto=" + objeto[i].data.displayName)

                        logger.debug( "Saving             " )
                        logger.debug( "-------------------" )
                        logger.debug( "Projeto ID       : " + projectID )
                        logger.debug( "SubProjeto ID    : " + subProjectID )
                        logger.debug( "Projeto OPE      : " + projetoOpe )
                        logger.debug( "Referencia       : " + referencia )
                        logger.debug( "Valor            : " + valor )
                        logger.debug( "Empresa          : " + empresa )
                        logger.debug( "Numdoc           : " + numdoc )
                        logger.debug( "DataExercicio    : " + dataExercicio )

                        var entradaJSONOne  =     {
                          "apiVersion": "1.0",
                          "data": {
                            "PK-INFO" : empresa + numdoc + exercicio,
                            "datatype-INFO": "1",
                            "projectId": projectID,
                            "subprojectId": subProjectID,
                            "subprojectName": subProjectName,
                            "status": "open",
                            "displayName": "Desembolso registrado em " + datahora,
                            "description": "Criado automaticamente (" + datahoraseg + ")",
                            "currency": "BRL",
                            "amount": valor,
                            "amountType": "disbursed",
                            "documents": [
                              {
                                "id": "classroom-contract",
                                "base64": "dGVzdCBiYXNlNjRTdHJpbmc="
                              }
                            ] ,
                            "project-number"  : projetoOpe,
                            "approvers-groupid" : jsonCamposAdicionais["approvers-groupid"],
                            "notified-groupid"  : jsonCamposAdicionais["notified-groupid"],
							"payment-date"   : paymentDate
                          }
                        }
                        logger.debug("entradaJSONOne")
                        logger.debug(entradaJSONOne)

                        var linhaDeDado =  JSON.stringify(entradaJSONOne) + CRLF
                        fs.appendFile( arqTBitem, linhaDeDado, function(err, result) {
                            if(err) {
                                process.exitCode = 1
                                return logger.error(err);
                            }
                            logger.info("Data" + i + " - Part ONE - is now ready to be submitted to Trubudget");
                        });

                        var entradaJSONTwo  =     {
                          "apiVersion": "1.0",
                          "data": {
                            "datatype-INFO": "2",
                            "projectId": projectID,
                            "subprojectId": subProjectID,
                            "subprojectName": subProjectName,
                            "status": "open",
                            "displayName": "Recebimento do desembolso ",
                            "description": "Atestamos o recebimento de R$ " + valor + " em " + dataUser + " (" + datahoraseg + ")",
                            "currency-INFO": "BRL",
                            "amount-INFO": valor,
                            "amountType": "N/A",
                            "documents": [
                              {
                                "id": "classroom-contract",
                                "base64": "dGVzdCBiYXNlNjRTdHJpbmc="
                              }
                            ] ,
                            "project-number"    : projetoOpe,
                            "approvers-groupid" : jsonCamposAdicionais["approvers-groupid"],
                            "notified-groupid"  : jsonCamposAdicionais["notified-groupid"],
							"payment-date"      : paymentDate
                          }
                        }
                        logger.debug("entradaJSONTwo")
                        logger.debug(entradaJSONTwo)

                        var linhaDeDado =  JSON.stringify(entradaJSONTwo) + CRLF
                        fs.appendFile( arqTBitem, linhaDeDado, function(err, result) {
                            if(err) {
                                process.exitCode = 1
                                return logger.error(err);
                            }
                            logger.info("Data" + i + " - Part TWO - is now ready to be submitted to Trubudget");
                        });

                        //acessaTrubudgetParaGravarWorkflowItem(projectID, subProjectID, referencia, valor)
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


