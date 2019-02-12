/******************************************************************************************************/
/* SCRIPT 01 - ACESSA O SAP E FAZ DOWNLOAD DAS LIBERACOES DE ACORDO COM O FILTRO PREDEFINIDO          */
/******************************************************************************************************/

var saptb_config = require('./TRUW001A_000_config.js');

saptb_config.inicioLibVar(__filename)

acessasSAP()

process.exitCode = 0

function acessasSAP() {

    var hoje     = moment().format("YYYYMMDD")
    var agora    = moment().format("YYYYMMDDHHmm")
    var nomeDoArquivo   = agora + "_" + arqSAP
    var copiaDoArquivo  = arqSAP
    var datapassada = moment().subtract(intervaloDias, 'days').format("YYYYMMDD")

    logger.info("Disbursements on SAP Amazon Fund from " + intervaloDias + " days until today (" + datapassada + " - " + hoje + ") ... " )

    //VARIAVEIS DE CONEXAO SAP
    //var urlsap = 'api-sap-d.bndes.net//sap/opu/odata/SAP/ZFI_GW_LIB_SAP_TBG_SRV/LiberacaoOperacaoSet?$format=json&$filter=empresa%20eq%20%27FA%27%20and%20tipoDocumento%20eq%20%27LC%27%20and%20(%20dataLc%20ge%20%2720190102%27%20and%20dataLc%20le%20%2720190103%27)';

    var urlsap = urlbasesap + '/LiberacaoOperacaoSet?$format=json&$filter=empresa%20eq%20%27FA%27%20and%20tipoDocumento%20eq%20%27LC%27%20and%20(%20dataLc%20ge%20%27'+datapassada+'%27%20and%20dataLc%20le%20%27'+hoje+'%27)'
    urlCompleta = "http://" + urlSapUser + ":" + urlSapPass + '@' + urlsap

	fs.writeFile(nomeDoArquivo, "", function(err, result) { //Cria arquivo novo (apaga se existir)
		if(err) logger.error('error', err);
	});

	fs.writeFile(copiaDoArquivo, "", function(err, result) { //Cria arquivo novo (apaga se existir)
		if(err) logger.error('error', err);
	});

    if ( MOCK == true ) {
        objeto = {"d":{"results":[{"__metadata":{"id":"http://api-sap-d.bndes.net:80/sap/opu/odata/SAP/ZFI_GW_LIB_SAP_TBG_SRV/LiberacaoOperacaoSet('9010000000')","uri":"http://api-sap-d.bndes.net:80/sap/opu/odata/SAP/ZFI_GW_LIB_SAP_TBG_SRV/LiberacaoOperacaoSet('9010000000')","type":"ZFI_GW_LIB_SAP_TBG_SRV.LiberacaoOperacao"},"contrato":"00000123456","dataDocumento":"02/01/2019","dataLc":"","empresa":"","dataPagamento":"02/01/2019","tipoDocumento":"","valor":"5000.00000","referencia":"9010000000"},{"__metadata":{"id":"http://api-sap-d.bndes.net:80/sap/opu/odata/SAP/ZFI_GW_LIB_SAP_TBG_SRV/LiberacaoOperacaoSet('9010000002')","uri":"http://api-sap-d.bndes.net:80/sap/opu/odata/SAP/ZFI_GW_LIB_SAP_TBG_SRV/LiberacaoOperacaoSet('9010000002')","type":"ZFI_GW_LIB_SAP_TBG_SRV.LiberacaoOperacao"},"contrato":"00123454500","dataDocumento":"02/01/2019","dataLc":"","empresa":"","dataPagamento":"02/01/2019","tipoDocumento":"","valor":"1111.11000","referencia":"9010000002"},{"__metadata":{"id":"http://api-sap-d.bndes.net:80/sap/opu/odata/SAP/ZFI_GW_LIB_SAP_TBG_SRV/LiberacaoOperacaoSet('9010000003')","uri":"http://api-sap-d.bndes.net:80/sap/opu/odata/SAP/ZFI_GW_LIB_SAP_TBG_SRV/LiberacaoOperacaoSet('9010000003')","type":"ZFI_GW_LIB_SAP_TBG_SRV.LiberacaoOperacao"},"contrato":"00123456852","dataDocumento":"10/01/2019","dataLc":"","empresa":"","dataPagamento":"10/01/2019","tipoDocumento":"","valor":"1234.00000","referencia":"9010000003"},{"__metadata":{"id":"http://api-sap-d.bndes.net:80/sap/opu/odata/SAP/ZFI_GW_LIB_SAP_TBG_SRV/LiberacaoOperacaoSet('9010000004')","uri":"http://api-sap-d.bndes.net:80/sap/opu/odata/SAP/ZFI_GW_LIB_SAP_TBG_SRV/LiberacaoOperacaoSet('9010000004')","type":"ZFI_GW_LIB_SAP_TBG_SRV.LiberacaoOperacao"},"contrato":"00020190110","dataDocumento":"10/01/2019","dataLc":"","empresa":"","dataPagamento":"10/01/2019","tipoDocumento":"","valor":"5678.00000","referencia":"9010000004"}]}}
        gravaEmArquivo(objeto, nomeDoArquivo, copiaDoArquivo)
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
                    process.exitCode = 1
                    logger.error( "Could not access: " + urlsap )
                    logger.error( "response: "         + response )
                    logger.error( "body: "             + body )
                    logger.error( "error: "            + error )
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
                process.exitCode = 1
                return logger.error(err);
            }
            logger.info("SAP data locally stored");
        });
        fs.appendFile( copiaDoArquivo, linhaDeDado, function(err) {
            if(err) {
                process.exitCode = 1
                return logger.error(err);
            }
            logger.info("SAP data copy stored");
        });
    }

}