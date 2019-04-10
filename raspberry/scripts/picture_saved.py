import socket
UDP_IP = "192.168.1.105"
UDP_PORT = 10000
def senddata(message='{"endPoint":"camera_device_raspi", "messageType":"measurement", "address":"192.168.1.125", "model":"3302","resource":"5500", "instanceNumber":"0", "value":"false"}'):
	global UDP_IP
	global UDP_PORT
	print("UDP target IP:", UDP_IP)
	print("UDP target port:", UDP_PORT)
	print("message:", message)
	sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM) # UDP
	sock.sendto(bytes(message), (UDP_IP, UDP_PORT))
senddata()
