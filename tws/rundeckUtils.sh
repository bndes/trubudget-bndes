#!/bin/bash

set -eo pipefail

THIS_SCRIPT="$(readlink -f "${BASH_SOURCE[0]}")"
THIS_SCRIPT_DIR="$(dirname "${THIS_SCRIPT}")"

RUNDECK_BASE_URL="https://rundeck.bndes.net"

function checkEmpty()
{
  [[ ! $2 ]] && echo "$1 cannot be empty!" && exit 1 || :
}

function printHelp()
{
  echo "Handle the Rundeck API complexity, making bash integration simple."
  echo ""
  echo "  Usage: $THIS_SCRIPT COMMAND [args...]"
  echo ""
  echo "Choose one of the following commands:"
  echo "  execute       Execute a job."
  echo "  status        Check job status"
  echo "  output        Get the job execution's output."
  echo "  info          Get the job input info."
  echo ""
  echo "  help          Show the command's info."
}

function handleInput()
{
  [[ $# == 0 ]] && printHelp && exit 0

  local COMMAND=$1
  shift

  case $COMMAND in
    execute)
      handleExecute "$@"
    ;;

    status)
      handleStatus "$@"
    ;;

    output)
      handleOutput "$@"
    ;;

    info)
      handleInfo "$@"
    ;;

    help|--help|-h)
      printHelp
    ;;

    *)
      echo "Invalid command: $COMMAND"
      exit 1
  esac
}

###########
# Execute #
###########

function printHelpForExecute()
{
  echo "Help for command: execute"
  echo ""
  echo "  Usage: $THIS_SCRIPT execute [options]"
  echo ""
  echo "Options:"
  echo "  --jobId         Job Id."
  echo "  --token         Rundeck' API web token."
  echo "  --              After that, input the job's arguments, in format: '-<parameter1> value1 -<parameter2> value2 ...'."
  echo ""
  echo "  --help          Show the command's info."
}

function handleExecute()
{
  [[ $# == 0 ]] && printHelpForExecute && exit 0

  while [[ $# > 0 ]]
   do
    case $1 in
      --jobId)
          JOB_ID=$2
          checkEmpty "--jobId" $JOB_ID
          shift
          shift
        ;;

      --token)
          TOKEN=$2
          checkEmpty "--token" $TOKEN
          shift
          shift
        ;;

      --)
          shift
          ARGUMENTS="$@"
          while [[ $# > 0 ]]; do shift; done
        ;;

      --help)
          printHelpForExecute
          exit 0
        ;;

      *)
          echo "Invalid input: $1"
          printHelpForExecute
          exit 1
    esac
  done

  checkExecuteJobInput
  executeJob
}

function checkExecuteJobInput()
{
  checkEmpty "--jobId" $JOB_ID
  checkEmpty "--token" $TOKEN
}

function executeJob()
{
  curl --silent --insecure -H "X-RunDeck-Auth-Token: $TOKEN" -X POST --data-urlencode "argString=$ARGUMENTS" \
    "$RUNDECK_BASE_URL/api/1/job/$JOB_ID/run" | grep -oP "(?<=<execution id=\')[0-9]+(?=\')"
}

##########
# Status #
##########

function printHelpForStatus()
{
  echo "Help for command: status"
  echo ""
  echo "  Usage: $THIS_SCRIPT status [options]"
  echo ""
  echo "Options:"
  echo "  --executionId     Job execution Id."
  echo "  --token           Rundeck' API web token."
  echo ""
  echo "  --help            Show the command's info."
}

function handleStatus()
{
  [[ $# == 0 ]] && printHelpForStatus && exit 0

  while [[ $# > 0 ]]
   do
    case $1 in
      --executionId)
          EXECUTION_ID=$2
          checkEmpty "--executionId" $EXECUTION_ID
          shift
          shift
        ;;

      --token)
          TOKEN=$2
          checkEmpty "--token" $TOKEN
          shift
          shift
        ;;

      --help)
          printHelpForStatus
          exit 0
        ;;

      *)
          echo "Invalid input: $1"
          printHelpForStatus
          exit 1
    esac
  done

  checkJobStatusInput
  checkJobStatus
}

function checkJobStatusInput()
{
  checkEmpty "--executionId" $EXECUTION_ID
  checkEmpty "--token" $TOKEN
}

function checkJobStatus()
{
  curl --silent --insecure -H "X-RunDeck-Auth-Token: $TOKEN" $RUNDECK_BASE_URL/api/5/execution/$EXECUTION_ID |
    grep -oP "(?<=status=\')[^\']*(?=\')"
}

##########
# Output #
##########

function printHelpForOutput()
{
  echo "Help for command: output"
  echo ""
  echo "  Usage: $THIS_SCRIPT output [options]"
  echo ""
  echo "Options:"
  echo "  --executionId     Job execution Id."
  echo "  --token           Rundeck' API web token."
  echo ""
  echo "  --help            Show the command's info."
}

function handleOutput()
{
  [[ $# == 0 ]] && printHelpForOutput && exit 0

  while [[ $# > 0 ]]
   do
    case $1 in
      --executionId)
          EXECUTION_ID=$2
          checkEmpty "--executionId" $EXECUTION_ID
          shift
          shift
        ;;

      --token)
          TOKEN=$2
          checkEmpty "--token" $TOKEN
          shift
          shift
        ;;

      --help)
          printHelpForOutput
          exit 0
        ;;

      *)
          echo "Invalid input: $1"
          printHelpForOutput
          exit 1
    esac
  done

  checkJobOutputInput
  getJobOutput
}

function checkJobOutputInput()
{
  checkEmpty "--executionId" $EXECUTION_ID
  checkEmpty "--token" $TOKEN
}

function getJobOutput()
{
  curl --silent --insecure -H "X-RunDeck-Auth-Token: $TOKEN" $RUNDECK_BASE_URL/api/5/execution/$EXECUTION_ID/output?format=txt |
    grep '<entry' | sed 's,.*<entry [^>]*>,,g' | sed 's,</entry>.*,,g'
}

########
# Info #
########

function printHelpForInfo()
{
  echo "Help for command: info"
  echo ""
  echo "  Usage: $THIS_SCRIPT info [options]"
  echo ""
  echo "Options:"
  echo "  --jobId         Job Id."
  echo "  --token         Rundeck' API web token."
  echo ""
  echo "  --help          Show the command's info."
}

function handleInfo()
{
  [[ $# == 0 ]] && printHelpForInfo && exit 0

  while [[ $# > 0 ]]
   do
    case $1 in
      --jobId)
          JOB_ID=$2
          checkEmpty "--jobId" $JOB_ID
          shift
          shift
        ;;

      --token)
          TOKEN=$2
          checkEmpty "--token" $TOKEN
          shift
          shift
        ;;

      --help)
          printHelpForInfo
          exit 0
        ;;

      *)
          echo "Invalid input: $1"
          printHelpForInfo
          exit 1
    esac
  done

  checkGetJobInfoInput
  getJobInfo
}

function checkGetJobInfoInput()
{
  checkEmpty "--jobId" $JOB_ID
  checkEmpty "--token" $TOKEN
}

function getJobInfo()
{
  echo "Job options:"
  curl --silent --insecure -H "X-RunDeck-Auth-Token: $TOKEN" "$RUNDECK_BASE_URL/api/1/job/$JOB_ID" |
    grep 'option ' | sed -e 's/\s*<option //g' -e 's,/>,,g' -e 's,>,,g'
}

handleInput "$@"
