# trubudget-bndes
This repository contains the software developed in BNDES related to the KfW Trubudget system.

## Requirements

| Component        |    Minimum Requirement |
| ---------------- | ---------------------: |
| CPU              |           2 x x86 2GHz |
| RAM              |                   8 GB |
| Disk space       |                  50 GB |
| Operating system | Ubuntu 16.04 and above |   
NODE
NPM

## Installation Guide

1. To create the following env variables:
TRUW001A_SAP_USER – SAP service user
TRUW001A_SAP_PASS – Password of SAP service user
TRUW001A_TRU_USER - Trubudget service user
TRUW001A_TRU_PASS – Password of Trubudget service user

2. To rename the file "config/config.json.PRD" to "config/config.json"

3. To rename the file "control/executionData.json.INSTALL" to "control/executionData.json"

4. Link the folder "control" to an external volume (outside container) with daily backup. Move the file "control/executionData.json" to this external volume.

5. Link the folder "data" to an external volume (outside container)

6. Link the folder "log" to an external volume (outside container)

7. Execute npm install

8. Execute npm start



## Execution Guide

To be written...
