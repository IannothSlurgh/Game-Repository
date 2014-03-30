# makefile

all: change_permissions run_script

change_permissions: 
	chmod u+x run_server.sh

run_script:
	./run_server.sh
