#!/usr/bin/env bash

sudo apt-get update
sudo apt install python3-pip python3-dev python3-venv build-essential libssl-dev libffi-dev python3-setuptools nginx -y
sudo cp -r /raspberry/server /home/vagrant
cd /home/vagrant/server
sudo cp cameraapi.service /etc/systemd/system/ 
sudo cp cameraapi /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/cameraapi /etc/nginx/sites-enabled

python3 -m venv /home/vagrant/server/cameraapiserver
source /home/vagrant/server/cameraapiserver/bin/activate
pip3 install wheel
pip3 install uwsgi flask 


sudo apt-get remove -y python3-pip # only needed to install packages

sudo systemctl daemon-reload
sudo systemctl start cameraapi
sudo ufw allow 'Nginx Full'
sudo systemctl restart nginx
