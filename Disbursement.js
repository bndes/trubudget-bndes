module.exports.Disbursement = function (empresa, numdoc, dataExercicio, type) {
        
        var _empresa = empresa;
        var _numdoc = numdoc;  
        var _dataExercicio = dataExercicio;
        var _type = type;      
        
        function getPkInfo() {
            return _empresa + "_" + _numdoc + "_" +  _dataExercicio + "_" + _type;
        }
        
        function print() { 
            console.log(getPkInfo()); 
        }
        
        return {
            getPkInfo: getPkInfo,
            print: print
        }; 
    } 

