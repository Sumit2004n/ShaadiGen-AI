"""HTTP-level smoke tests (no DB required)."""

from fastapi.testclient import TestClient

from shaadigen.main import create_app


def test_health_endpoint() -> None:
    app = create_app()
    with TestClient(app) as client:
        response = client.get("/api/v1/health")
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "ok"
    assert body["version"]
    assert "api" in body["checks"]


def test_auth_status_endpoint() -> None:
    app = create_app()
    with TestClient(app) as client:
        response = client.get("/api/v1/auth/status")
    assert response.status_code == 200
    body = response.json()
    assert body["authenticated"] is False
    assert "message" in body


def test_root() -> None:
    app = create_app()
    with TestClient(app) as client:
        response = client.get("/")
    assert response.status_code == 200
    assert response.json()["app"]
