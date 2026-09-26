import pytest

def test_fefo_sale_deduction_and_idempotency(client):
    prod_payload = {
        "product_code": "PRD-SALE-001",
        "name": "FEFO Test Biscuits",
        "barcode": "8901234567920",
        "selling_price": 25.0,
        "purchase_price": 18.0,
        "initial_batch_number": "BATCH-EARLIER",
        "initial_expiry_date": "2026-10-01",
        "initial_quantity": 10
    }
    p_res = client.post("/api/products", json=prod_payload)
    assert p_res.status_code == 201
    product_id = p_res.json()["id"]

    # Add second batch with later expiry
    client.put(f"/api/inventory/{product_id}", json={
        "transaction_type": "STOCK_IN",
        "batch_number": "BATCH-LATER",
        "quantity": 20,
        "reason": "Restock",
        "expiry_date": "2026-12-01"
    })

    sale_payload = {
        "items": [
            {"product_id": product_id, "quantity": 15}
        ],
        "payment_method": "UPI / QR",
        "idempotency_key": "INV-TEST-KEY-001"
    }

    res = client.post("/api/sales", json=sale_payload)
    assert res.status_code == 201
    sale_data = res.json()
    assert sale_data["invoice_number"] == "INV-TEST-KEY-001"
    assert sale_data["total_amount"] == 375.0 # 15 * 25.0

    # Test idempotency: re-submitting with same key returns identical sale without duplicate stock deduction
    res_dup = client.post("/api/sales", json=sale_payload)
    assert res_dup.status_code == 201
    assert res_dup.json()["id"] == sale_data["id"]

    # Verify remaining stock is 15 (30 - 15)
    prod_updated = client.get(f"/api/products/{product_id}").json()
    assert prod_updated["current_quantity"] == 15

def test_reject_expired_batch_sale(client):
    prod_payload = {
        "product_code": "PRD-SALE-EXPIRED",
        "name": "Expired Yoghurt",
        "barcode": "8901234567937",
        "selling_price": 30.0,
        "purchase_price": 20.0,
        "initial_batch_number": "BATCH-EXP",
        "initial_expiry_date": "2020-01-01",
        "initial_quantity": 10
    }
    p_res = client.post("/api/products", json=prod_payload)
    assert p_res.status_code == 201
    product_id = p_res.json()["id"]

    sale_payload = {
        "items": [
            {"product_id": product_id, "quantity": 2}
        ]
    }
    res = client.post("/api/sales", json=sale_payload)
    assert res.status_code == 400
    assert "Insufficient valid stock" in res.json()["detail"]
