# trubudget-bndes
This repository contains the software developed in BNDES related to the KfW Trubudget system.

## Requirements

| Component        |    Minimum version     |
| ---------------- | ---------------------  |
| NODE             |      6.10.1 or greater |
| NPM              |     3.10.10 or greater |


## Installation Guide

Create a dockerfile with node and npm and follow the steps below.

1. Rename the file "config/config.json.PRD" to "config/config.json"

2. Rename the file "control/executionData.json.INSTALL" to "control/executionData.json"

3. Create the volume "control", "data" e "log" to be linked to an external volume (outside container).

4. Execute npm install

5. Configure the running of the docker image to fire "npm start".

----

Execute the following steps:

1. Create the following env variables:

    TRUW001A_SAP_USER – SAP service user <br>
    TRUW001A_SAP_PASS – Password of SAP service user <br>
    TRUW001A_TRU_USER - Trubudget service user <br>
    TRUW001A_TRU_PASS – Password of Trubudget service user

2. Link the volumes to folders located outside the container. 
The volume "control" needs to be linked to a folder with daily backup. Move the file "control/executionData.json" to this external folder. The volumes "data" and "log" do not need daily backup.



## Execution Guide

The docker needs to be called by TWS daily. It should run at the begining of the night production. The easiest way is to create a Rundeck script to be the mediator. So, TWS will call Rundeck and Rundeck will call the container. The container will fire npm start, as described in the installation guide.
