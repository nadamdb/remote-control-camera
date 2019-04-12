import requests
import glob
import os

list_of_files = glob.glob('/home/pi/MotionImages/*') 
latest_file = max(list_of_files, key=os.path.getctime)

with open(latest_file, 'rb') as f:
	r = requests.post('http://80.211.171.119:3000/upload',files={'sampleFile':f})
print(r.status_code)

if(r.status_code == requests.codes.ok):
	os.remove(latest_file)
	

