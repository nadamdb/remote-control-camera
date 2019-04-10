# remote-control-camera
Working repository of the "Agilis Sárgák" team for the 2019 BME-VIK "Agile Network Service Development" course.

## Main goal
The goal of the project is to implement a remotely controllable Raspberry Pi camera with automatic alert on motion detection and a web interface to control the camera.

## Vagrant dev environment
Install
- vagrant https://www.vagrantup.com/downloads.html
- virtualbox

Go the github repo go to vagrant folder
run> **vagrant up** 
-   this will start 2 vm-s web(ip 192.168.66.2) and raspberry(ip 192.168.66.3)
-   it will start the nodejs server on the web vm the website can be accessed on 192.168.66.2:3000
-   it will also start the python server on the raspberry vm on port 80

run> **vagrant ssh web|raspberry** to connect to the machines
-   the two machines can see each other 
-   you can test it 
-   from the raspberry machine with: wget 192.168.66.2:3000
-   from the web machine with: wget 192.168.66.2/status


###### Troubleshootin vagrant
On windows:
If you get an error like: *"vargant: symlinks: EPROTO: protocol error, symlink ../../../browserslist/cli.js" here is the solution*
-   Navigate to: Local Policies > User Rights Assignment
-   Double click: Create Symbolic Links
-   Add your username to the list, click OK
-   Log off *(from:https://github.com/yarnpkg/yarn/issues/4908)*
