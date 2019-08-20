/******************************************************************************************************/
/* ACCESS TRUBUDGET AND UPLOAD THE WORKFLOWITEMS THAT WERE IN THE TEMPORARY FILE
/* ONLY SAVES WHEN datatype-INFO==2
/******************************************************************************************************/

var saptb_config = require('./TRUW001A_000_config.js');
var tbItem_upload = require('./TRUW001A_000_uploadTbItem.js');

saptb_config.inicioLibVar(__filename)

tbJSONitems = leCadaDadoTBparaGravarWorkflowItem()
tbItem_upload.uploadTBItem(tbJSONitems, saptb_config);

function leCadaDadoTBparaGravarWorkflowItem() {
    
    var tbJSONitems = []

    var linhas = fs.readFileSync(arqTBitem, 'utf8')
                    .split( newLineSeparator )
                    .filter(Boolean)

    var filteredLines = linhas.filter(function (strTbItem) {
        var tbItem = JSON.parse(strTbItem);
        return tbItem.data["datatype-INFO"]==2;
    });


    for (var i = 0; i < filteredLines.length; i++) {
        tbJSONitems[i] = JSON.parse(filteredLines[i])
        logger.debug(tbJSONitems[i].data['PK-INFO'])      
    }

    return tbJSONitems
}
