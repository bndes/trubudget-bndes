/******************************************************************************************************/
/* ACCESS TRUBUDGET, ITERATE ON SAP DISBURSEMENTS FILTERING THE ONES NOT YET INCLUDED.
THEN, SAVE THE WORKFLOWITEMS IN A TEMPORARY FILE (arqTbItem).
/******************************************************************************************************/
var saptb_config = require('./TRUW001A_000_config.js');
var CreatorDisbursement = require('./Disbursement');

saptb_config.inicioLibVar(__filename)

var arqTBUploadDateJSONlist = saptb_config.loadArqTBUploadDate();

leCadaDadoSAPparaGravarRespectivaLiberacao(arqTBUploadDateJSONlist)

process.exitCode = 0


function leCadaDadoSAPparaGravarRespectivaLiberacao(arqTBUploadDateJSONlist) {
    var linhas = fs.readFileSync(arqSAP + ".json", 'utf8').split( newLineSeparator ).filter(Boolean)

    logger.debug(" linhas.length: " + linhas.length)
    if ( linhas.length == 0) {
        logger.info("There is no lines in SAP file to process " + arqSAP)
        logger.info("Setting TRUE to the Skip Steps - It will terminate normally")
        saptb_config.changeValueInExecutionData("globalSkipSteps", true)
    }

    var objetoSAP = []

    for (var i = 0; i < linhas.length; i++) {
        objetoSAP[i] = JSON.parse(linhas[i])
        logger.debug(objetoSAP[i])
        if ( objetoSAP[i].contrato != undefined ) {
            var contratoSCC = objetoSAP[i].contrato.substr(0,8) //os primeiros digitos do contrato SCC
            
            contratoSCC = contratoSCC.trim()

            logger.debug(objetoSAP[i].empresa)            
            logger.debug(objetoSAP[i].referencia) //SAP Rest has changed var name from faturaSAP to referencia
            logger.debug(objetoSAP[i].exercicio)

            var empresa       = objetoSAP[i].empresa            
            var numdoc        = objetoSAP[i].referencia
            var dataExercicio = objetoSAP[i].exercicio

            logger.debug("empresa + numdoc + dataExercicio = " + empresa + numdoc + dataExercicio )

            //Eh suficiente testar o primeiro item, por isso cria com "1"
            var pkInfoSap = CreatorDisbursement.Disbursement(empresa, numdoc, dataExercicio, "1").getPkInfo(); 
            
            logger.debug(pkInfoSap)
            logger.debug(arqTBUploadDateJSONlist)
            
            //Cria arquivo novo para gravar os workflowitems do trubudget
            fs.writeFileSync( arqTBitem, "");

            /**
             * TBUploadFile contains the data already uploaded to TruBudget
             * If the current SAP data key is not in TBUploadFile, then it must be processed
             * If the current SAP data key is in TBUploadFile, it was previously uploaded
             */
            if ( !findPKinTBUploadFile(pkInfoSap) ) {

                logger.info("Contract - check if should process: " + contratoSCC)

                if (checkPilotFilter(contratoSCC)) {
                    createOneWorkflowItemOnLocalStorage( contratoSCC, 
                        objetoSAP[i].referencia, 
                        objetoSAP[i].valor, 
                        objetoSAP[i].dataPagamento,
                        empresa, 
                        numdoc,
                        dataExercicio )    
                    
                } else {
                    logger.info("Contract was ignored/filtered: " + contratoSCC)
                }
            } else {
                logger.info("The following SAP data key was previously processed: " + pkInfoSap)
            }
        } else {
            logger.info("There is nothing to create the file " + arqTBitem)
        }
    }
}

function createOneWorkflowItemOnLocalStorage(contratoSCC, referencia, valor, paymentDate, empresa, numdoc, dataExercicio) {

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
            logger.debug ("response = " + response )
            if (!error && response != undefined && response.statusCode == 200) {
                var objeto = body.data.items
                
                var projectMatched = false;
                for (i in objeto) {
                    logger.debug("objeto[i].data")
                    logger.debug(objeto[i].data)
                    logger.debug(objeto[i].data.additionalData)
                    logger.debug(objeto[i].data.additionalData['contract'])
                    
                    var approvalGroup   = objeto[i].data.additionalData["approvers-groupid"];
                    var chaveIntegracao = objeto[i].data.additionalData['contract']

                    if ( chaveIntegracao != undefined && chaveIntegracao.includes( contratoSCC ) ) {
						logger.debug(objeto[i])
						subProjectID = objeto[i].data.id
						subProjectName = objeto[i].data.displayName
						logger.debug("subprojeto=" + objeto[i].data.displayName)

                        logger.debug( "Saving             " )
                        logger.debug( "-------------------" )
                        logger.debug( "Projeto ID       : " + projectID )
                        logger.debug( "SubProjeto ID    : " + subProjectID )
                        logger.debug( "Projeto OPE      : " + contratoSCC )
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
                            "PK-INFO" : CreatorDisbursement.Disbursement(empresa, numdoc, dataExercicio, type).getPkInfo(),
                            "projectId": projectID,
                            "subprojectId": subProjectID,
                            "subprojectName": subProjectName,
                            "status": "open",
                            "displayName": "Desembolso realizado em " + paymentDate,
                            "description": "Criado automaticamente (" + referencia + ")",
                            "currency": "BRL",
                            "amount": valor,
                            "exchangeRate": "1.0",
                            "amountType": "disbursed",
                            "project-number"  : contratoSCC,
                            "approvers-groupid" : approvalGroup,
							"payment-date"   : paymentDate
                          }
                        }
                        logger.debug("entradaJSONOne")
                        logger.debug(entradaJSONOne)

                        var linhaDeDado =  JSON.stringify(entradaJSONOne) + newLineSeparator
                        fs.appendFileSync( arqTBitem, linhaDeDado, 'utf8');
                        logger.info("Part ONE - is now ready to be submitted to Trubudget");                        

                        type = 2;

                        let valorFormatado = numeral(parseFloat(valor)).format('0,0.00')

                        var entradaJSONTwo  =     {
                          "apiVersion": "1.0",
                          "data": {
                            "datatype-INFO": type,
                            "PK-INFO" :  CreatorDisbursement.Disbursement(empresa, numdoc, dataExercicio, type).getPkInfo(),
                            "projectId": projectID,
                            "subprojectId": subProjectID,
                            "subprojectName": subProjectName,
                            "status": "open",
                            "displayName": "Recebimento do desembolso de R$ " + valorFormatado,
                            "description": "Atestamos o recebimento de R$ " + valorFormatado + " em " + paymentDate + ".",
                            "currency-INFO": "BRL",
                            "amount-INFO": valor,
                            "amountType": "N/A",
                            "project-number"    : contratoSCC,
                            "approvers-groupid" : approvalGroup,
							"payment-date"      : paymentDate
                          }
                        }
                        logger.debug("entradaJSONTwo")
                        logger.debug(entradaJSONTwo)

                        var linhaDeDado =  JSON.stringify(entradaJSONTwo) + newLineSeparator
                        fs.appendFileSync( arqTBitem, linhaDeDado, 'utf8');
                        logger.info("Part TWO - is now ready to be submitted to Trubudget");                                               

                        projectMatched = true;
                        break;
                    }

                } //fecha for 


                if (!projectMatched) {                     
                    var msg = "Could not match SAP project " + contratoSCC + " with Trubudget projects"
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
        logger.info("Filter file : " + fsPilotProjectsFilter)
        var originalFsLines = fs.readFileSync(fsPilotProjectsFilter, 'utf8').split( newLineSeparator ).filter(Boolean)
        logger.info("Filter list : " + originalFsLines)

        if (originalFsLines.length==0) {
            return true; //empty file -> no filter to do
        }

        var filteredLines = originalFsLines.filter(function (projectFsLine) {
            return projectFsLine.trim()==projectNumber;
        });

        return filteredLines.length > 0;
    }
    
    //If there is no file, there is no filter
    return true;
}


function findPKinTBUploadFile(pkInfoSap) {
    var pkFound = false

    //Look for pk
    for (i=0; i<arqTBUploadDateJSONlist.length;i++) {        
        let objeto = arqTBUploadDateJSONlist[i]
        logger.debug(objeto)        
        if ( objeto === undefined || objeto == "")
            continue;
        let elemento = objeto[pkInfoSap]
        if ( elemento === undefined || elemento == "")
            continue;
        else {
            pkFound = true;
            break;
        }
    }

    logger.debug("findPKinTBUploadFile result: " + pkFound)
    
    return pkFound;
}


