from flask import Flask, jsonify, request, abort, json
app = Flask(__name__)
# a fajlba  iras olvasás csak szimuláció
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
    if operation["value"] == "off":
        turnoffcamera()
    elif operation["value"] == "on":
        turnoncamera()
    else:
        print("invalid operation")
        message = {}
        message["errormessage"] = "operation %s not valid" % operation["value"]
        return app.response_class(response=json.dumps(message), status=400, mimetype='application/json')
    return jsonify(getCameraStatus())


def turnoncamera():
    try:
        f = open("camerastatus", "w")
        f.write("1")
        f.close()
    except Exception as e:
        print("An exception occurred: " + str(e))

def turnoffcamera():
    try:
        f = open("camerastatus", "w")
        f.write("0")
        f.close()
    except Exception as e:
        print("An exception occurred: " + str(e))

if __name__ == '__main__':
    abspath = os.path.abspath(__file__)
    dname = os.path.dirname(abspath)
    os.chdir(dname)
    print("Starting with working directory " + str(os.getcwd()))
    app.run(host='0.0.0.0', port=5000)
    print("Finnished")
