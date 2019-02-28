/******************************************************************************************************/
/* ACCESS TRUBUDGET, ITERATE ON SAP DISBURSEMENTS FILTERING THE ONES NOT YET INCLUDED.
THEN, SAVE THE WORKFLOWITEMS IN A TEMPORARY FILE (arqTbItem).
/******************************************************************************************************/
var saptb_config = require('./TRUW001A_000_config.js');

saptb_config.inicioLibVar(__filename)

leDadosDoArquivoNoUltimoUploadTrubudget();

leCadaDadoSAPparaGravarRespectivaLiberacao(uploadTrubudgetJSON)

process.exitCode = 0

function leDadosDoArquivoNoUltimoUploadTrubudget() {

    var fileExists = fs.existsSync(arqTBUploadDate);
    uploadTrubudgetJSON = {}

    if(fileExists)  {
        var linhas = fs.readFileSync(arqTBUploadDate, 'utf8').split( CRLF ).filter(Boolean)       
        
        for (var i = 0; i < linhas.length; i++) {
            var linhaStr = JSON.stringify(linhas[i])
                    
            linhaStr     = Str(linhaStr).replaceAll( '\"' , ''  )
            linhaStr     = Str(linhaStr).replaceAll( '\\' , ''  )
            linhaStr     = Str(linhaStr).replaceAll( '{'  , ''  )
            linhaStr     = Str(linhaStr).replaceAll( '}'  , '' )

            var resp     = linhaStr.split( ':' , 2 );                
            
            uploadTrubudgetJSON[resp[0]] = resp[1]
        } 

        logger.debug(linhas)
        logger.debug(uploadTrubudgetJSON)
    }    
}

function leCadaDadoSAPparaGravarRespectivaLiberacao(uploadTrubudgetJSON) {
    var linhas = fs.readFileSync(arqSAP + ".json", 'utf8').split( CRLF ).filter(Boolean)

    var objetoSAP = []

    for (var i = 0; i < linhas.length; i++) {
        objetoSAP[i] = JSON.parse(linhas[i])
        logger.debug(objetoSAP[i])
        if ( objetoSAP[i].contrato != undefined ) {
            var projetoOPE = objetoSAP[i].contrato.substr(0,7)

            logger.debug(objetoSAP[i].empresa)
            logger.debug(objetoSAP[i].referencia)
            logger.debug(objetoSAP[i].exercicio)

            var empresa       = objetoSAP[i].empresa
            var numdoc        = objetoSAP[i].referencia
            var dataExercicio = objetoSAP[i].exercicio
            var pksap         = empresa + numdoc + dataExercicio + "1" //Eh suficiente testar o primeiro item
            logger.debug(pksap)
            logger.debug(uploadTrubudgetJSON[pksap])
            
            //Cria arquivo novo para gravar os workflowitems do trubudget
            fs.writeFileSync( arqTBitem, "");

            /* se a chave do sap nao subiu (upload) para o trubudget, significa que a chave precisa ser gravada agora */
            if ( uploadTrubudgetJSON[pksap] === undefined || uploadTrubudgetJSON[pksap] == "" ) {

                if (checkPilotFilter(projetoOPE)) {

                    createOneWorkflowItemOnLocalStorage( projetoOPE, 
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
    }
}

function createOneWorkflowItemOnLocalStorage(projetoOpe, referencia, valor, paymentDate, empresa, numdoc, dataExercicio) {

    var tokenAuth           = fs.readFileSync(arqToken, 'utf8');
    var projectID           = fs.readFileSync(arqProjectID, 'utf8');

    var urltb               = urlbasetb + '/subproject.list?projectId=' + projectID
    var stringAutorizacao   = "Bearer " + tokenAuth
    var opcoesHeader        = { "content-type": "application/json", "accept": "application/json", "Authorization": stringAutorizacao };
    var datahora            = moment().format("DD/MM/YYYY - HH:mm")
    var datahoraseg         = moment().format("YYYYMMDDHHmmss")
    var dataUser            = moment().format("DD/MM/YYYY")

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
                
                var projectMatched = false;
                for (i in objeto) {
                    logger.debug(objeto[i].data.description)
                    
                    //var nomeDoSubProjeto = objeto[i].data.displayName

                    //TODO: REVER QUANDO TIVER OS NOVOS CAMPOS
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
                    var approvalGroup = jsonCamposAdicionais["approvers-groupid"];
                    //FIM TODO


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
                        var type = 1

                        var entradaJSONOne  =     {
                          "apiVersion": "1.0",
                          "data": {                            
                            "datatype-INFO": type,
                            "PK-INFO" : empresa + numdoc + dataExercicio + type,
                            "projectId": projectID,
                            "subprojectId": subProjectID,
                            "subprojectName": subProjectName,
                            "status": "open",
                            "displayName": "Desembolso registrado em " + datahora,
                            "description": "Criado automaticamente (" + referencia + ")",
                            "currency": "BRL",
                            "amount": valor,
                            "amountType": "disbursed",
                            "project-number"  : projetoOpe,
                            "approvers-groupid" : approvalGroup,
							"payment-date"   : paymentDate
                          }
                        }
                        logger.debug("entradaJSONOne")
                        logger.debug(entradaJSONOne)

                        var linhaDeDado =  JSON.stringify(entradaJSONOne) + CRLF
                        fs.appendFileSync( arqTBitem, linhaDeDado, 'utf8');
                        logger.info("Part ONE - is now ready to be submitted to Trubudget");                        

                        type = 2;

                        var entradaJSONTwo  =     {
                          "apiVersion": "1.0",
                          "data": {
                            "datatype-INFO": type,
                            "PK-INFO" : empresa + numdoc + dataExercicio + type,
                            "projectId": projectID,
                            "subprojectId": subProjectID,
                            "subprojectName": subProjectName,
                            "status": "open",
                            "displayName": "Recebimento do desembolso de R$ " + valor,
                            "description": "Atestamos o recebimento de R$ " + valor + " em " + dataUser + " (" + datahoraseg + ")",
                            "currency-INFO": "BRL",
                            "amount-INFO": valor,
                            "amountType": "N/A",
                            "project-number"    : projetoOpe,
                            "approvers-groupid" : approvalGroup,
							"payment-date"      : paymentDate
                          }
                        }
                        logger.debug("entradaJSONTwo")
                        logger.debug(entradaJSONTwo)

                        var linhaDeDado =  JSON.stringify(entradaJSONTwo) + CRLF
                        fs.appendFileSync( arqTBitem, linhaDeDado, 'utf8');

                        projectMatched = true;
                        break;
                    }

                } //fecha for 


                if (!projectMatched) {                     
                    var msg = "Could not match SAP project " + projetoOpe + " with Trubudget projects"
                    saptb_config.logWithError (msg, error, false);                    
                }


            }
            else {
                saptb_config.logWithErrorConnection(urltb, response, error, false)
            }
        })
}


function checkPilotFilter(projectNumber) {
    
    var fileExists = fs.existsSync(fsPilotProjectsFilter);
    if(fileExists)  {
        var originalFsLines = fs.readFileSync(fsPilotProjectsFilter, 'utf8').split( CRLF ).filter(Boolean)
        
        if (originalFsLines.length==0) {
            return true; //empty file -> no filter to do
        }

        var filteredLines = originalFsLines.filter(function (projectFsLine) {
            return projectFsLine==projectNumber;
        });

        return filteredLines.length > 0;
    }
    
    //If there is no file, there is no filter
    return true;
}


