#!/usr/bin/env bash

if [ "$#" -ne 1 ]; then
    SERVERDIR=$(pwd)
else
    SERVERDIR=$(realpath $1)
fi
echo "python server directory: $SERVERDIR"
sudo apt-get update
sudo apt install python3-pip python3-dev python3-venv \
 build-essential libssl-dev libffi-dev python3-setuptools nginx ufw -y

cd $SERVERDIR 
mkdir -p cameraapiserver
python3 -m venv cameraapiserver
source cameraapiserver/bin/activate
pip3 install wheel
pip3 install uwsgi flask 


