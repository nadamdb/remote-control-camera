import requests


r= requests.put('http://192.168.1.111:3000/motion')

print(r.status_code)