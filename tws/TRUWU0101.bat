//tem wget naessa maquina windows?

//wget https://rundeck.bndes.net/project/Apoio_Desenvolvimento_ATI/job/show/d4254316-836b-4683-a235-38ab9b03620e

RUNDECK_BASE_URL=https://rundeck.bndes.net
curl --silent --insecure -H "X-RunDeck-Auth-Token: $TOKEN" -X POST --data-urlencode "argString=$ARGUMENTS" "$RUNDECK_BASE_URL/api/1/job/$JOB_ID/run"