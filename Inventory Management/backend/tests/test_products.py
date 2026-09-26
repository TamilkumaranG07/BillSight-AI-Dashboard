import pytest

def test_create_and_lookup_product(client):
    payload = {
        "product_code": "PRD-TST-001",
        "name": "Test Organic Milk 1L",
        "barcode": "8901234567890",
        "selling_price": 50.0,
        "purchase_price": 40.0,
        "minimum_stock_level": 10,
        "initial_batch_number": "BATCH-TEST-01",
        "initial_expiry_date": "2026-12-31",
        "initial_quantity": 50
    }
    response = client.post("/api/products", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Test Organic Milk 1L"
    assert data["current_quantity"] == 50

    # Lookup by barcode
    lookup_res = client.get("/api/products/barcode/8901234567890")
    assert lookup_res.status_code == 200
    lookup_data = lookup_res.json()
    assert lookup_data["found"] is True
    assert lookup_data["product"]["product_code"] == "PRD-TST-001"

def test_lookup_nonexistent_barcode(client):
    res = client.get("/api/products/barcode/0000000000000")
    assert res.status_code == 200
    data = res.json()
    assert data["found"] is False
    assert data["message"] == "Product Not Found"
    assert data["product"] is None

def test_invalid_barcode_check_digit(client):
    payload = {
        "product_code": "PRD-TST-002",
        "name": "Invalid Barcode Item",
        "barcode": "8901234567899", # Invalid check digit for 13-digit EAN
        "selling_price": 10.0,
        "purchase_price": 5.0
    }
    res = client.post("/api/products", json=payload)
    assert res.status_code == 422 # Unprocessable Entity validation error
