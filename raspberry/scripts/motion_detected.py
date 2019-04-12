import requests


r= requests.put('http://80.211.171.119:3000/motion')

print(r.status_code)