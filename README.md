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

Execute the following steps:

1. Create the following env variables:

    TRUW001A_SAP_USER – SAP service user <br>
    TRUW001A_SAP_PASS – Password of SAP service user <br>
    TRUW001A_TRU_USER - Trubudget service user <br>
    TRUW001A_TRU_PASS – Password of Trubudget service user

2. Link the volumes to folders located outside the container. 
The volume "control" needs to be linked to a folder with daily backup. The volumes "data" and "log" do not need daily backup.



## Execution Guide

The docker needs to be called by TWS daily. It should run at the begining of the night production. The easiest way is to create a Rundeck script to be the mediator. So, TWS will call Rundeck and Rundeck will call the container. The container will fire npm start, as described in the installation guide.


## Generated Files

This integration script uses or generates the following files during its execution:

* config.json - It contains parameters to be used as input of this integration script. Examples include: SAP URL, email configurations and name of other files. This file must exist, otherwise the program will stop with error in the beginning.
* executionData.json - It contains parameters necessary to the current execution. For example, dates of which SAP data must be collected and last step executed without error.
* arqSAP.json - It contains the data extracted from SAP - disbursements (LC to Amazon Fund). The only filters are the initial and final date. The integration script also stores a copy of each execution of this file by creating a file called arqSAPYYYYMMDDHHmm.json.
* arqProjectID.txt - It contains the identifier of the Trubudget project in this integration - the id associated with the project name defined at config file.
* arqTBitem.json - It contains the items to be saved on Trubudget. Each disbursement creates two items. This file will be used when upload, grant and closing items.
* arqTBUploadDate.json - It contains all disburments already read from arqSAP.json and the date the main workflow item of this disbursement was included in Trubuget.


