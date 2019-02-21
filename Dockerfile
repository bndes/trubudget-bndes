FROM  node:10.15.1-jessie

ADD . /trubudget

WORKDIR /trubudget

RUN cp config/config.json.PRD config/config.json && \
    cp control/executionData.json.INSTALL control/executionData.json 

RUN npm install

VOLUME [ "/trubudget/data" , "/trubudget/log" , "/trubudget/control" ]


CMD [ "npm" , "start" ]


