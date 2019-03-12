# trubudget-bndes
This repository contains the software developed in BNDES related to the KfW Trubudget system.

## Requirements

| Component        |    Minimum version     |
| ---------------- | ---------------------  |
| NODE             |      6.10.1 or greater |
| NPM              |     3.10.10 or greater |


## Installation Guide - PRD

Assure that config/config.json.PRD is correctly filled. 

Create a dockerfile with node and npm and follow the steps below.

1. Rename the file "config/config.json.PRD" to "config/config.json"

2. Create the volume "control", "data" e "log" to be linked to an external volume (outside container).

3. Execute npm install

4. Configure the running of the docker image to fire "npm start".

----

Execute the following steps to prepare the env (if not prepared):

1. Create the directories and assign permissions 
* mkdir -p /opt/docker/volumes/trubudget/
* mkdir -p /opt/docker/volumes/trubudget/control 
* mkdir -p /opt/docker/volumes/trubudget/log 
* mkdir -p /opt/docker/volumes/trubudget/data 


2. Create a file .env defining 

TRUW001A_SAP_USER=xx
TRUW001A_SAP_PASS=xx
TRUW001A_TRU_USER=xx
TRUW001A_TRU_PASS=xx

3. Assign the necessary permissions.

------

Execute the following steps using docker-compose.yml:

1. Reference the following env variables:

    TRUW001A_SAP_USER – SAP service user <br>
    TRUW001A_SAP_PASS – Password of SAP service user <br>
    TRUW001A_TRU_USER - Trubudget service user <br>
    TRUW001A_TRU_PASS – Password of Trubudget service user

2. Link the volumes to folders located outside the container. 
The volume "control" needs to be linked to a folder with daily backup. The volumes "data" and "log" do not need daily backup.

3. If you are running in DSV, you need to execute a command to replace config.json with config.json.DEV. Similar comments to other envs. 

4. Execute npm start



## Execution Guide

In DSV:
* cd /opt/docker/composers/trubudget
* Check if it is necessary to change docker-compose.yml. Analyze mainly the image name.
* docker pull image-name
* docker-compose up

In PRD:

The docker needs to be called by TWS daily. It should run at the begining of the night production. The easiest way is to create a Rundeck script to be the mediator. So, TWS will call Rundeck and Rundeck will call the container. The container will fire npm start, as described in the installation guide.

If it is not the first time the integration script is installed (in other words, it is an update of the integration script), it may be necessary to recover the files control/arqTBUploadDate.json, control/pilotProjectsFilter.txt and log/executionOutput.log of the previous executions.


## Generated Files

This integration script uses or generates the following files during its execution:

* config/config.json - It contains parameters to be used as input of this integration script. Examples include: SAP URL, email configurations and name of other files. This file must exist, otherwise the program will stop with error in the beginning.
* control/arqTBUploadDate.json - It contains all disburments already read from arqSAP.json and the respective workflow item id of Trubuget. The key of each line is the concatenation of empresa + numdoc + dataExercicio + type (1-disbursement, 2-attestation). Each line also contains the disbursement reference.
* control/executionData.json - It contains parameters necessary to the current execution. For example, dates of which SAP data must be collected, last step executed without error and if errors occurred in the last execution. 
* control/pilotProjectsFilter.txt - It contains a list of projects (OPE 7 first digits) that are participating in the pilot of Trubudget. The list is separeted by \r\n. If the file is not found by the integration script or if the file is empty, all projects are going to be considered. 
* data/arqToken.txt - It stores JWT token to access Trubudget in the last execution.
* data/arqSAP.json - It contains the data extracted from SAP in the last execution - disbursements (LC to Amazon Fund). The only filters are the initial and final date. The integration script also stores a copy of each execution of this file by creating a file called arqSAPYYYYMMDDHHmm.json.
* data/arqProjectID.txt - It contains the identifier of the Trubudget project in the last execution of the  integration script - the id associated with the project name defined at config file.
* data/arqTBitem.json - It contains the items to be saved on Trubudget recovered in the last execution of the integration script. It is filtered by the projects listed on control. Each disbursement creates two items. This file will be used when upload, grant and closing items.
* data/arqUsers.json - It stores information of groups and users recovered in the last execution of the integration script.
* log/executionOutput.log - It stores the log of all executions of the integration script. 



