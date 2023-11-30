MAX_RETRIES=60
CURRENT_RETRY=0
DELAY=1

throw_error() {
  MESSAGE=$1
  RED="\e[31m"

  printf "\n${RED}ERR!: ${MESSAGE}\n\n" 1>&2
  exit 1;
}

if [ -z $1 ]; then
 throw_error "Missing required parameter. \n\n health-check.sh [service_name]" 
fi;


while [ $CURRENT_RETRY -lt $MAX_RETRIES ]
do
  CURRENT_RETRY=$((CURRENT_RETRY+1))
  echo "[Attempt ${CURRENT_RETRY}/${MAX_RETRIES}]: waiting for $1 to be healthy"

  COMMAND="$(docker compose ps $1)"
  echo "$COMMAND"

  if grep -q '(healthy)' <<< "$COMMAND"; then
    printf "\n $1 is start and is healthy \n"
    exit;
  else
    sleep $DELAY
  fi;
done

throw_error "$1 timeout waiting for health check"















