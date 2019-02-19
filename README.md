# trubudget-bndes
This repository contains the software developed in BNDES related to the KfW Trubudget system.

## Requirements

| Component        |    Minimum version     |
| ---------------- | ---------------------  |
| NODE             |      6.10.1 or greater |
| NPM              |     3.10.10 or greater |


## Installation Guide

Create a dockerfile with node and npm and follow the steps below.

1. Create the following env variables:
TRUW001A_SAP_USER – SAP service user
TRUW001A_SAP_PASS – Password of SAP service user
TRUW001A_TRU_USER - Trubudget service user
TRUW001A_TRU_PASS – Password of Trubudget service user

2. Rename the file "config/config.json.PRD" to "config/config.json"

3. Rename the file "control/executionData.json.INSTALL" to "control/executionData.json"

4. Link the folder "control" to an external volume (outside container) with daily backup. Move the file "control/executionData.json" to this external volume.

5. Link the folder "data" to an external volume (outside container)

6. Link the folder "log" to an external volume (outside container)

7. Execute npm install

8. Configure the running of the docker image to fire npm start execution.


## Execution Guide

The docker need to be called by TWS (Daily routine). The easiest way is to create a Rundeck script to be the mediator. So, TWS will call Rundeck and Rundeck will call the container. The container will fire npm start, as described in the installation guide.
