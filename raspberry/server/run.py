from cameraapi import app
import os
if __name__ == '__main__':
    abspath = os.path.abspath(__file__)
    dname = os.path.dirname(abspath)
    os.chdir(dname)
    print("Starting with working directory " + str(os.getcwd()))
    app.run(host='0.0.0.0', port=5000)
    print("Finnished")