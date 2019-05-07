from flask import Flask, jsonify, request, abort, json
import os
app = Flask(__name__)
# a fajlba  iras olvasás csak szimuláció
# a portok letiltogatása a megoldás arra, hogy ha offot nyomunk ne jöjjön kamerakép
@app.route("/status", methods=['GET'])
def readstatus():
    return jsonify(getCameraStatus())

def getCameraStatus():
    status = {}
    try:
        f = open("camerastatus", "r")
        value = int(f.read())
        f.close()
        print(value)
        if value == 0:
            status["status"] = "off"
        elif value == 1:
            status["status"] = "on"
    except Exception as e:
        status["status"] = "unknown"
        print("An exception occurred: " + str(e))
    finally:
        return status

@app.route("/camera", methods=['POST'])
def cameraonoff():
    operation= request.get_json()
    print(operation)
    validoperation = True
    if operation != None and "value" in operation:
        if operation["value"] == "off":
            turnoffcamera()
        elif operation["value"] == "on":
            turnoncamera()
        else:
            validoperation = False
    else:
        validoperation = False

    if validoperation:
        return jsonify(getCameraStatus())
    else:
        message = {}
        message["errormessage"] = "operation %s not valid" % json.dumps(operation)
        print(message["errormessage"])
        return app.response_class(response=json.dumps(message), status=400, mimetype='application/json')



def turnoncamera():
    try:
        f = open("camerastatus", "w")
        f.write("1")
        f.close()
        os.system("sudo ufw allow 8081")
    except Exception as e:
        print("An exception occurred: " + str(e))

def turnoffcamera():
    try:
        f = open("camerastatus", "w")
        f.write("0")
        f.close()
        os.system("sudo ufw deny 8081")
    except Exception as e:
        print("An exception occurred: " + str(e))

if __name__ == '__main__':
    abspath = os.path.abspath(__file__)
    dname = os.path.dirname(abspath)
    os.chdir(dname)
    print("Starting with working directory " + str(os.getcwd()))
    app.run(host='0.0.0.0', port=5001)
    print("Finnished")
