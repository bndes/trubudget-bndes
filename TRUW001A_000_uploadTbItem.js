/******************************************************************************************************/
/* Auxiliar function to upload tbItems on Trubudget
/******************************************************************************************************/

module.exports = {

    uploadTBItem: function uploadTBItem(tbJSONitems, saptb_config) {

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
                        logger.debug("response.body.data['workflowitem']['id']")
                        var workflowitem_id = response.body.data['workflowitem']['id']                        
                        logger.debug(workflowitem_id)
                        var PKInfo = jsonBody.data['PK-INFO'];
                        var trItemId      = workflowitem_id;

                        module.exports.saveOnLocalStorage(PKInfo, trItemId);

                    }
                    else {
                        saptb_config.logWithErrorConnection(urltb, response, error, false)
                    }
                }
            )
        }
    },


    saveOnLocalStorage: function saveOnLocalStorage(PKInfo, trItemId) {

        logger.debug("saveOnLocalStorage")        

        var jSONlinha = {}
        jSONlinha[PKInfo] = trItemId;
        logger.debug( jSONlinha )                    
    
        fs.appendFile( arqTBUploadDate, JSON.stringify(jSONlinha) + newLineSeparator , function(err, result) {
            if(err) {
                var msg = "It was not possible to write on arqTBUploadDate\nIt is necessary to sync file in order to avoid duplication in Trubudget\n";
                msg += JSON.stringify(jSONlinha);

                saptb_config.logWithError(msg, error, true)
            }
            logger.info("WorkflowItem was logged on disk (File: " + arqTBUploadDate + " ) ");
        });

    }

};    