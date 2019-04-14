## Python webserver for rasbperry pi camera status , turn on/off

#### Setting up the environment 
go to the raspberry/server directory

- run> **./setup_raspberry_python.sh**  this will install everything needed(nginx, uwsgi, python, pytohn packages)

#### starting the server
go to the **raspberry/server** directory

- run> **./start_server.sh**   
this will create/update and start the service **cameraapi**. After the first run the service will automaticcally start on startup (the port is **5000** set in file raspberry/server/cameraapi)
- run> **systemctl status cameraapi**  to check the status of the service
- run> **sudo systemctl restart cameraapi**  to restart the service after changes were made to the python code

Also you can just run the python webserver on its own when making changes
- run> **python cameraapi.py**
The configuration for this is at the end of the cameraapi.py file.(the default port is **5001**)



#### configuration files
The service configuration files are:
- **raspberry/server/cameraapi.service.template** 
- **raspberry/server/cameraapi.ini**

The configuration for nginx is in
- **raspberry/server/cameraapi** //here you can set the listening port(currently 5000)