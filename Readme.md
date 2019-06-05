Do you want to know how to install or execute these scripts? See Instalation-Execution-Guide.md


## Generated Files

This integration script uses or generates the following files during its execution:

* config/config.json - It contains parameters to be used as input of this integration script. Examples include: SAP URL, email configurations and name of other files. This file must exist, otherwise the program will stop with error in the beginning.
* control/arqTBUploadDate.json - It contains all disburments already read from arqSAP.json and the respective workflow item id of Trubuget. The key of each line is the concatenation of empresa + numdoc + dataExercicio + type (1-disbursement, 2-attestation). Each line also contains the disbursement reference.
* control/executionData.json - It contains parameters necessary to the current execution. For example, dates of which SAP data must be collected, last step executed without error and if errors occurred in the last execution. 
* filter/pilotProjectsFilter.txt - It contains a list of projects (OPE 7 first digits) that are participating in the pilot of Trubudget. The list is separeted by \r\n. If the file is not found by the integration script or if the file is empty, all projects are going to be considered. 
* data/arqToken.txt - It stores JWT token to access Trubudget in the last execution.
* data/arqSAP.json - It contains the data extracted from SAP in the last execution - disbursements (LC to Amazon Fund). The only filters are the initial and final date. The integration script also stores a copy of each execution of this file by creating a file called arqSAPYYYYMMDDHHmm.json.
* data/arqProjectID.txt - It contains the identifier of the Trubudget project in the last execution of the  integration script - the id associated with the project name defined at config file.
* data/arqTBitem.json - It contains the items to be saved on Trubudget recovered in the last execution of the integration script. It is filtered by the projects listed on control. Each disbursement creates two items. This file will be used when upload, grant and closing items.
* data/arqUsers.json - It stores information of groups and users recovered in the last execution of the integration script.
* log/executionOutput.log - It stores the log of all executions of the integration script. 
