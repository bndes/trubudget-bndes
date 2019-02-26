/******************************************************************************************************/
/* Auxiliar function to upload tbItems on Trubudget
/******************************************************************************************************/

module.exports = {

    uploadTBItem: function uploadTBItem(tbJSONitems) {

        logger.debug("uploadTBItem")

        stringAutorizacao   = ""
        opcoesHeader        = ""
        itemsSaved   = 0  
    
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
                        
                        module.exports.saveOnLocalStorage(response);

                        logger.debug(itemsSaved)
                        logger.debug(tbJSONitems[itemsSaved])
    
                        projectId    = tbJSONitems[itemsSaved].data.projectId
                        subprojectId = tbJSONitems[itemsSaved].data.subprojectId
                        description  = tbJSONitems[itemsSaved].data.description
    
                        logger.debug(projectId)
                        logger.debug(subprojectId)
    
                        itemsSaved++;
                    }
                    else {
                        saptb_config.logWithError(urltb, response, body, error, false)
                    }
                }
            )
        }
    },


    saveOnLocalStorage: function saveOnLocalStorage(response) {

        logger.debug("saveOnLocalStorage")        
        var jsonBody  = JSON.parse(response.request.body)                    
        logger.debug( jsonBody )
        var PKInfo    = JSON.stringify(jsonBody.data['PK-INFO'])
        
        if ( PKInfo != undefined ) { //It is necessary to save only when there is PKInfo
            PKInfo =  PKInfo + ""
            PKInfo        = Str(PKInfo).replaceAll('"','')
            PKInfo        = Str(PKInfo).replaceAll('\\','')
            var hoje      = moment().format("YYYYMMDD")
            logger.debug( PKInfo )
            var jSONlinha = {}
            jSONlinha[PKInfo] = hoje;
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
    }

};    