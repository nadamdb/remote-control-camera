#!/usr/bin/env bash
SERVERDIR=$(realpath $1)
cd $SERVERDIR
SERVERDIRESCAPED="${SERVERDIR//\//\\/}"
sed "s/__SERVERDIR__/$SERVERDIRESCAPED/g" cameraapi.service.template >  cameraapi.service 
cat cameraapi.service
sudo cp  cameraapi.service /etc/systemd/system/
sudo cp  cameraapi /etc/nginx/sites-available/
sudo systemctl daemon-reload
sudo ln -sf /etc/nginx/sites-available/cameraapi /etc/nginx/sites-enabled
sudo touch /var/run/cameraapi.sock
sudo systemctl enable cameraapi
sudo systemctl start cameraapi
sudo ufw allow 'Nginx Full'
sudo systemctl restart nginx
echo "started server"
sudo systemctl status cameraapi&

