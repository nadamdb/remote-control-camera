import pytest

from server import cameraapi


@pytest.fixture
def app():
    app = cameraapi.api
    return app

def test_example(client):
    resp = client.get("/status")
    assert resp.status_code == 200
