#!/bin/sh
echo '*------------------------------------------------------------------*'
echo '*                                                                  *'
echo '* SISTEMA     = PRODUCAO TWS                                       *'
echo '*                                                                  *'
echo '* USUARIO     = ATI/DEOPI/GPRO                                     *'
echo '*                                                                  *'
echo '* FUNCAO      = BLOCKCHAIN - TRUBUDGET - INTEGRACAO (ETL) COM SAP  *'
echo '*                                                                  *'
echo '* FREQUENCIA  = DIARIA                                             *'
echo '*                                                                  *'
echo '* DEPENDENCIA = NENHUMA                                            *'
echo '*                                                                  *'
echo '* PARAMETROS  = NENHUM                                             *'
echo '*                                                                  *'
echo '* REPROCESS.  = NORMAL                                             *'
echo '*                                                                  *'
echo '* RESTART     = NENHUM                                             *'
echo '*                                                                  *'
echo '* RESPONSAVEL = ATI/DESIS2/GFIN2                                   *'
echo '*                                                                  *'
echo '* OBSERVACAO  = NENHUMA                                            *'
echo '*                                                                  *'
echo '*------------------------------------------------------------------*'
echo '*           PARAMETROS PARA SOLICITACAO ONLINE - T999H5'
echo '* $$SCP-SOLICITACAO ONLINE'
echo '* $$SOLICITANTE'
echo '* $$APLICACAO A#TRU#001'
echo '*------------------------------------------------------------------*'
# ====================== Termino da Aplicacao com Erro =====================
function ERRO() {
        echo '*'
        echo $(date '+%d/%m/%Y %H:%M:%S') $0 '- ROTINA TERMINADA COM ERRO RC:'$1
        echo '* MSG:'$MSG
                echo '*'
                exit $1
}
# ============== Comandos de Controle ============
#TWSdir=/opt/PRD/tws
TWStmp=$TWSDir/tmp
# ============== Inicio da aplicacao =============
MSG='Listar parametros recebidos'
echo $(date '+%d/%m/%Y %H:%M:%S') $0 - $MSG ...
echo $*;RC=$?
if [ $RC -ne 0 ]; then ERRO $RC; fi
#
MSG='Listar as variaveis de ambiente'
echo $(date '+%d/%m/%Y %H:%M:%S') $0 - $MSG ...
set;RC=$?
if [ $RC -ne 0 ]; then ERRO $RC; fi
#
MSG='Quem sou eu'
echo $(date '+%d/%m/%Y %H:%M:%S') $0 - $MSG ...
whoami;RC=$?
if [ $RC -ne 0 ]; then ERRO $RC; fi
#
MSG='Executando rundeck blockchain ETL SAP-TRUBUDGET PRD a02e2112-1b0d-4908-9f90-f9a2aecf4a58'
numeroJob=`$TWSScr/rundeckUtils.sh execute --jobId a02e2112-1b0d-4908-9f90-f9a2aecf4a58 --token zzzzzzzzzzzzzzzzzzzzzzzz`
echo $numeroJob
sleep 300
$TWSScr/rundeckUtils.sh output --executionId $numeroJob --token zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz | grep "ALL SCRIPTS SUBMITED"
RC=$?
echo $RC
if [ $RC -ne 0 ]; then ERRO $RC; fi
#
# ====================== Termino da Aplicacao com Sucesso ==================
echo '*' $(date '+%d/%m/%Y %H:%M:%S') $0 '- ROTINA TERMINADA COM SUCESSO RC:0'
echo '*'
exit 0