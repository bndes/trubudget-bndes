/******************************************************************************************************/
/* Auxiliar function to upload tbItems on Trubudget
/******************************************************************************************************/

module.exports = {

    uploadTBItem: function uploadTBItem(tbJSONitems) {

        logger.debug("uploadTBItem")

        stringAutorizacao   = ""
        opcoesHeader        = ""
    
        var urltb               = urlbasetb + '/subproject.createWorkflowitem'
        var tokenAuth           = fs.readFileSync(arqToken, 'utf8');
        stringAutorizacao   = "Bearer " + tokenAuth
        opcoesHeader        = { "content-type": "application/json", "accept": "application/json", "Authorization": stringAutorizacao };
        var self = this
    
        for (i = 0; i < tbJSONitems.length; i++) {
            
            var entradaJSON = tbJSONitems[i]
            request(
                {
                    url : urltb,
                    method:'POST',
                    body: entradaJSON,
                    headers: opcoesHeader,
                    json: true
                },
                function (error, response, body) {
                    
                    logger.debug ("status = " + response )
                    if (!error && ( response.statusCode == 200 || response.statusCode == 201 ) ) {
                        logger.info("WorkflowItem was saved Trubudget!")                    
                        var jsonBody  = JSON.parse(response.request.body)
                        module.exports.saveOnLocalStorage(jsonBody);

                    }
                    else {
                        saptb_config.logWithError(urltb, response, body, error, false)
                    }
                }
            )
        }
    },


    //TODO: fazer receber JSON.parse(response.request.body) 
    saveOnLocalStorage: function saveOnLocalStorage(jsonBody) {

        logger.debug("saveOnLocalStorage")        
        var PKInfo    = JSON.stringify(jsonBody.data['PK-INFO'])
        
        PKInfo =  PKInfo + ""
        PKInfo        = Str(PKInfo).replaceAll('"','')
        PKInfo        = Str(PKInfo).replaceAll('\\','')
        logger.debug( PKInfo )


        //TODO: RECUPERAR ID DO TRUBUDGET 
        var trItemId      = "1234567890";

        var jSONlinha = {}
        jSONlinha[PKInfo] = trItemId;
        logger.debug( jSONlinha )                    
    
        fs.appendFile( arqTBUploadDate, JSON.stringify(jSONlinha) + CRLF , function(err, result) {
            if(err) {
                logger.error(err);
                logger.error("It was not possible to write on arqTBUploadDate");
                logger.error("It is necessary to sync file in order to avoid duplication in Trubudget");
                logger.error(JSON.stringify(jSONlinha));                    

                //TODO:  problema NAO É UM PROBLEMA DE CONEXAO!! rever prints
                saptb_config.logWithError(urltb, response, response.body, error, true)
            }
            logger.info("WorkflowItem was logged on disk (File: " + arqTBUploadDate + " ) ");
        });

    }

};    