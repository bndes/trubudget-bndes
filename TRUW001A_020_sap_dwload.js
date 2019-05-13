/******************************************************************************************************/
/* DOWNLOADS DATA FROM ERP SYSTEM (SAP)
/******************************************************************************************************/

var saptb_config = require('./TRUW001A_000_config.js');

saptb_config.inicioLibVar(__filename)

acessasSAP()

process.exitCode = 0

function acessasSAP() {

    var agora    = moment().format("YYYYMMDDHHmm")
    var nomeDoArquivo   = arqSAP + "_" +  agora + ".json"
    var copiaDoArquivo  = arqSAP + ".json"

    var dataInicial = saptb_config.getValueInExecutionData("initialDateToCollectData");   
    var dataFinal   = saptb_config.getValueInExecutionData("finalDateToCollectData");

    logger.info("Disbursements on SAP Amazon Fund from " + dataInicial + " until " + dataFinal + " ... " )

    var paramPesquisa = "dataPagamento"
    var urlsap = urlbasesap + '/LiberacaoOperacaoSet?$format=json&$filter=empresa%20eq%20%27FA%27%20and%20tipoDocumento%20eq%20%27LC%27%20and%20(%20' + paramPesquisa + '%20ge%20%27'+dataInicial+'%27%20and%20' + paramPesquisa + '%20le%20%27'+dataFinal+'%27)'
    urlCompleta = "http://" + urlSapUser + ":" + urlSapPass + '@' + urlsap

	fs.writeFileSync(nomeDoArquivo, ""); //Cria arquivo novo (apaga se existir)

	fs.writeFileSync(copiaDoArquivo, ""); //Cria arquivo novo (apaga se existir)

    if ( MOCK == true ) {
        logger.debug("MOCK is true")
        logger.debug("MOCKurl : " + MOCKurl)
        if ( MOCKurl.length > 0 ) {   
             logger.debug("MOCK is not empty")         
             request(
                {
                    url : MOCKurl
                },
                function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        objeto = JSON.parse(body)       
                        logger.debug(body)
                        objeto = objeto["sapdata"]                        
                        logger.info("Mock loaded from the url : " + MOCKurl)                 
                        logger.debug(objeto) 
                        if ( objeto != undefined)
                            gravaEmArquivo(objeto, nomeDoArquivo, copiaDoArquivo)
                        else
                           saptb_config.logWithErrorConnection(MOCKurl, response, error, true) 
                    }
                    else {
                        saptb_config.logWithErrorConnection(urltb, response, error, true)
                    }
                }
            )
        }            
        else {
            objeto = MOCKJSON.sapdata
            gravaEmArquivo(objeto, nomeDoArquivo, copiaDoArquivo)
        }
            
        
    }
    else {
        request(
            {
                url : urlCompleta
            },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var objeto = JSON.parse(body)
                    gravaEmArquivo(objeto, nomeDoArquivo, copiaDoArquivo)
                }
                else {
                    saptb_config.logWithErrorConnection(urltb, response, error, true)
                }
            }
        )
    }
}

function gravaEmArquivo(objeto, nomeDoArquivo, copiaDoArquivo) {

    for (i in objeto.d.results) {

        logger.debug(objeto.d.results[i].contrato)
        logger.debug(objeto.d.results[i].dataLc)
        logger.debug(objeto.d.results[i].empresa)
        logger.debug(objeto.d.results[i].dataPagamento)
        logger.debug(objeto.d.results[i].tipoDocumento)
        logger.debug(objeto.d.results[i].valor)
        logger.debug(objeto.d.results[i].referencia)

        var linhaDeDado = JSON.stringify(objeto.d.results[i]) + CRLF
        fs.appendFile( nomeDoArquivo, linhaDeDado, function(err) {
            if(err) {
                saptb_config.logWithError ("Could not save " + nomeDoArquivo, err, true);
            }
            logger.info("SAP data locally stored");
        });
        fs.appendFile( copiaDoArquivo, linhaDeDado, function(err) {
            if(err) {
                saptb_config.logWithError ("Could not save " + copiaDoArquivo, err, true);                
            }
            logger.info("SAP data copy stored");
        });
    }

}
