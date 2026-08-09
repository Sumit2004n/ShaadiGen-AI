"""HTTP smoke tests for vendor categories (no DB required)."""

from fastapi.testclient import TestClient

from shaadigen.main import create_app


def test_vendor_categories_endpoint() -> None:
    app = create_app()
    with TestClient(app) as client:
        response = client.get("/api/v1/vendors/categories")
    assert response.status_code == 200
    body = response.json()
    assert len(body) == 4
    keys = {row["key"] for row in body}
    assert "Photographer" in keys
    assert "Caterer" in keys
    photographer = next(row for row in body if row["key"] == "Photographer")
    assert photographer["budgetShare"] == 0.1
