#!/usr/bin/env bash

sudo apt-get update
sudo apt install python3-pip python3-dev python3-venv build-essential libssl-dev libffi-dev python3-setuptools nginx -y

cd /raspberry/server
python3 -m venv /raspberry/server/cameraapiserver
source /raspberry/server/cameraapiserver/bin/activate
pip3 install wheel
pip3 install uwsgi flask 
sudo apt-get remove -y python3-pip # only needed to install packages


