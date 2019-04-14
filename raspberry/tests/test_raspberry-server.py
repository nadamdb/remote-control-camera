import pytest
import json

from server import cameraapi


@pytest.fixture
def test_client():
    client = cameraapi.app.test_client()
    return client

def poston(test_client):
    return test_client.post("/camera", 
                    data=json.dumps(dict(value='on')),
                    content_type='application/json')

        
def postoff(test_client):
    return test_client.post("/camera", 
                    data=json.dumps(dict(value='off')),
                    content_type='application/json')


def test_camera_invalid_command(test_client):
    resp = test_client.post("/camera", 
                    data=json.dumps(dict(value='offasdasd')),
                    content_type='application/json')
    assert resp != None
    assert resp.status_code == 400

def test_camera_invalid_command(test_client):
    resp = test_client.post("/camera", 
                    data=json.dumps(dict(value_notvalue='off')),
                    content_type='application/json')
    assert resp != None
    assert resp.status_code == 400

def test_camera_notjson(test_client):
    resp = test_client.post("/camera", 
                    data="alma",
                    content_type='application/json')
    assert resp != None
    assert resp.status_code == 400

def test_camera_turnon(test_client):
    resp = poston(test_client)
    assert resp != None
    assert resp.status_code == 200
    resp_data = json.loads(resp.data)
    assert resp_data["status"] == "on"

    
def test_camera_turnoff(test_client):
    resp = postoff(test_client)
    assert resp != None
    assert resp.status_code == 200
    resp_data = json.loads(resp.data)
    assert resp_data["status"] == "off"


def test_camera_stdatus(test_client):
    resp = poston(test_client)
    resp = test_client.get("/status")
#    print(json.loads(resp.data))
    resp_data = json.loads(resp.data)
    assert resp.status_code == 200
    assert resp_data["status"] == "on"

    resp = postoff(test_client)
    resp = test_client.get("/status")
#    print(json.loads(resp.data))
    resp_data = json.loads(resp.data)
    assert resp.status_code == 200
    assert resp_data["status"] == "off"


