import pytest

def test_stock_in_and_transaction_logging(client):
    prod_payload = {
        "product_code": "PRD-INV-001",
        "name": "Inventory Test Juice",
        "barcode": "8901234567906",
        "selling_price": 60.0,
        "purchase_price": 45.0,
        "initial_batch_number": "BATCH-01",
        "initial_quantity": 20
    }
    p_res = client.post("/api/products", json=prod_payload)
    assert p_res.status_code == 201
    product_id = p_res.json()["id"]

    # Manual Stock-In
    action_payload = {
        "transaction_type": "STOCK_IN",
        "batch_number": "BATCH-02",
        "quantity": 30,
        "reason": "Shipment received from wholesale distributor",
        "expiry_date": "2026-11-30"
    }
    action_res = client.put(f"/api/inventory/{product_id}", json=action_payload)
    assert action_res.status_code == 200
    tx_data = action_res.json()
    assert tx_data["quantity_changed"] == 30
    assert tx_data["new_quantity"] == 50

    # Verify transactions list
    tx_list_res = client.get(f"/api/inventory/transactions?product_id={product_id}")
    assert tx_list_res.status_code == 200
    tx_list = tx_list_res.json()
    assert len(tx_list) >= 2

def test_negative_stock_prevention(client):
    prod_payload = {
        "product_code": "PRD-INV-002",
        "name": "Low Quantity Item",
        "barcode": "8901234567913",
        "selling_price": 100.0,
        "purchase_price": 80.0,
        "initial_batch_number": "BATCH-01",
        "initial_quantity": 5
    }
    p_res = client.post("/api/products", json=prod_payload)
    assert p_res.status_code == 201
    product_id = p_res.json()["id"]

    # Try to write off 10 items (only 5 available)
    action_payload = {
        "transaction_type": "DAMAGED",
        "batch_number": "BATCH-01",
        "quantity": 10,
        "reason": "Water damage"
    }
    action_res = client.put(f"/api/inventory/{product_id}", json=action_payload)
    assert action_res.status_code == 400
    assert "Cannot reduce" in action_res.json()["detail"]
