import pytest
import json

from server import cameraapi


@pytest.fixture
def test_client():
    client = cameraapi.app.test_client()
    return client

def test_camera_on(test_client):
    resp = test_client.get("/off")
    resp = test_client.get("/on")
#    print(json.loads(resp.data))
    resp_data = json.loads(resp.data)
    assert resp.status_code == 200
    assert resp_data["status"] == "on"

def test_camera_status(test_client):
    resp = test_client.get("/on")
    resp = test_client.get("/status")
#    print(json.loads(resp.data))
    resp_data = json.loads(resp.data)
    assert resp.status_code == 200
    assert resp_data["status"] == "on"

    resp = test_client.get("/off")
    resp = test_client.get("/status")
#    print(json.loads(resp.data))
    resp_data = json.loads(resp.data)
    assert resp.status_code == 200
    assert resp_data["status"] == "off"


