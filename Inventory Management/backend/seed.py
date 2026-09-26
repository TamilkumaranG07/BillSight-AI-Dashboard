import os
import sys
from datetime import datetime, date, timedelta, timezone
import random

# Ensure app package is importable
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.db.session import engine, SessionLocal
from app.db.base import Base
from app.models.user import User
from app.models.category import Category
from app.models.supplier import Supplier
from app.models.product import Product
from app.models.batch import ProductBatch
from app.models.transaction import InventoryTransaction
from app.models.sale import Sale, SaleItem
from app.core.security import get_password_hash

def seed_database():
    print("Initializing DB tables...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # 1. Users
        if db.query(User).count() == 0:
            print("Seeding Users...")
            users = [
                User(name="Store Admin", email="admin@billsight.ai", password_hash=get_password_hash("admin123"), role="admin"),
                User(name="Store Manager", email="manager@billsight.ai", password_hash=get_password_hash("manager123"), role="manager"),
                User(name="Cashier 01", email="cashier@billsight.ai", password_hash=get_password_hash("cashier123"), role="cashier")
            ]
            db.add_all(users)
            db.commit()

        # 2. Categories
        if db.query(Category).count() == 0:
            print("Seeding Categories...")
            categories = [
                Category(name="Dairy", description="Milk, Butter, Cheese, Yogurt"),
                Category(name="Bakery", description="Fresh Breads, Buns, Cakes"),
                Category(name="Snacks & Confectionery", description="Biscuits, Chocolates, Chips"),
                Category(name="Beverages", description="Juices, Soft Drinks, Water, Tea"),
                Category(name="Personal Care", description="Soaps, Shampoos, Powders, Skincare")
            ]
            db.add_all(categories)
            db.commit()

        # 3. Suppliers
        if db.query(Supplier).count() == 0:
            print("Seeding Suppliers...")
            suppliers = [
                Supplier(name="Amul Wholesale Dist", contact_person="Ramesh Kumar", phone="+91 9876543210", email="ramesh@amuldist.com", address="Plot 42, Industrial Area, Chennai"),
                Supplier(name="Britannia FMCG Logistics", contact_person="Priya Sharma", phone="+91 9812345678", email="priya@britannialogistics.com", address="Bldg 7, Logistics Park, Bengaluru"),
                Supplier(name="Hindustan Unilever Depot", contact_person="Suresh Patel", phone="+91 9988776655", email="orders@huldepot.com", address="Sector 12, Tech Zone, Hyderabad"),
                Supplier(name="Nestle India Supply", contact_person="Anita Roy", phone="+91 9765432109", email="anita.roy@nestle.in", address="Unit 5, Cargo City, Mumbai")
            ]
            db.add_all(suppliers)
            db.commit()

        cat_dairy = db.query(Category).filter_by(name="Dairy").first()
        cat_bakery = db.query(Category).filter_by(name="Bakery").first()
        cat_snacks = db.query(Category).filter_by(name="Snacks & Confectionery").first()
        cat_beverages = db.query(Category).filter_by(name="Beverages").first()
        cat_personal = db.query(Category).filter_by(name="Personal Care").first()

        sup_amul = db.query(Supplier).filter_by(name="Amul Wholesale Dist").first()
        sup_brit = db.query(Supplier).filter_by(name="Britannia FMCG Logistics").first()
        sup_hul = db.query(Supplier).filter_by(name="Hindustan Unilever Depot").first()
        sup_nestle = db.query(Supplier).filter_by(name="Nestle India Supply").first()

        # 4. Products & Batches
        if db.query(Product).count() == 0:
            print("Seeding ~25 Products & Batches...")
            today = date.today()

            products_data = [
                # Dairy
                ("PRD-000101", "Amul Pasteurised Toned Milk 500ml", cat_dairy.id, "8901234567890", sup_amul.id, 30.0, 24.0, 20, [
                    ("B-MILK-001", today + timedelta(days=2), 40, "manual"),
                    ("B-MILK-002", today - timedelta(days=1), 10, "manual") # Expired
                ]),
                ("PRD-000102", "Amul Butter 100g", cat_dairy.id, "8901234567891", sup_amul.id, 58.0, 48.0, 15, [
                    ("B-BUT-001", today + timedelta(days=45), 80, "manual")
                ]),
                ("PRD-000103", "Amul Cheese Slices 200g", cat_dairy.id, "8901234567892", sup_amul.id, 140.0, 115.0, 10, [
                    ("B-CHS-001", today + timedelta(days=60), 30, "manual")
                ]),
                ("PRD-000104", "Amul Fresh Dahi 400g", cat_dairy.id, "8901234567893", sup_amul.id, 45.0, 36.0, 15, [
                    ("B-DAHI-001", today + timedelta(days=4), 18, "manual") # Near Expiry
                ]),
                ("PRD-000105", "Amul Ice Cream Vanilla 500ml", cat_dairy.id, "8901234567894", sup_amul.id, 120.0, 95.0, 10, [
                    ("B-IC-001", today + timedelta(days=120), 25, "manual")
                ]),

                # Bakery
                ("PRD-000201", "Britannia Brown Bread 400g", cat_bakery.id, "8901234567895", sup_brit.id, 45.0, 35.0, 15, [
                    ("B-BRD-001", today + timedelta(days=3), 12, "manual") # Near Expiry & Low Stock
                ]),
                ("PRD-000202", "Britannia Milk Bread 400g", cat_bakery.id, "8901234567896", sup_brit.id, 40.0, 30.0, 20, [
                    ("B-BRD-002", today + timedelta(days=5), 25, "manual")
                ]),
                ("PRD-000203", "Fruit Cake 250g Pack", cat_bakery.id, "8901234567897", sup_brit.id, 65.0, 50.0, 10, [
                    ("B-CAKE-001", today - timedelta(days=3), 5, "manual") # Expired
                ]),
                ("PRD-000204", "Burger Buns Pack of 4", cat_bakery.id, "8901234567898", sup_brit.id, 35.0, 26.0, 15, [
                    ("B-BUN-001", today + timedelta(days=4), 8, "manual") # Low Stock & Near Expiry
                ]),
                ("PRD-000205", "Garlic Toast Bread 150g", cat_bakery.id, "8901234567899", sup_brit.id, 50.0, 38.0, 10, [
                    ("B-TOAST-001", today + timedelta(days=90), 0, "manual") # Out of Stock
                ]),

                # Snacks & Confectionery
                ("PRD-000301", "Britannia Good Day Cookies 150g", cat_snacks.id, "8901396151005", sup_brit.id, 30.0, 22.0, 25, [
                    ("B-GD-001", today + timedelta(days=180), 120, "manual")
                ]),
                ("PRD-000302", "Cadbury Dairy Milk 100g", cat_snacks.id, "8901234567900", sup_nestle.id, 85.0, 68.0, 30, [
                    ("B-DM-001", today + timedelta(days=200), 150, "manual")
                ]),
                ("PRD-000303", "KitKat Chocolate 4 Finger", cat_snacks.id, "8901234567901", sup_nestle.id, 40.0, 30.0, 20, [
                    ("B-KIT-001", today + timedelta(days=150), 90, "manual")
                ]),
                ("PRD-000304", "Lays Potato Chips Cream & Onion 50g", cat_snacks.id, "8901234567902", sup_brit.id, 20.0, 14.0, 40, [
                    ("B-LAY-001", today + timedelta(days=90), 180, "manual")
                ]),
                ("PRD-000305", "Kurkure Masala Munch 90g", cat_snacks.id, "8901234567903", sup_brit.id, 20.0, 14.0, 35, [
                    ("B-KUR-001", today + timedelta(days=100), 140, "manual")
                ]),

                # Beverages
                ("PRD-000401", "Tropicana Apple Juice 1L", cat_beverages.id, "8901234567904", sup_nestle.id, 110.0, 85.0, 15, [
                    ("B-JUICE-001", today + timedelta(days=60), 45, "manual")
                ]),
                ("PRD-000402", "Coca-Cola 750ml Bottle", cat_beverages.id, "8901234567905", sup_nestle.id, 45.0, 35.0, 25, [
                    ("B-COKE-001", today + timedelta(days=120), 80, "manual")
                ]),
                ("PRD-000403", "Bisleri Mineral Water 1L", cat_beverages.id, "8901234567906", sup_amul.id, 20.0, 12.0, 50, [
                    ("B-H2O-001", today + timedelta(days=365), 300, "manual")
                ]),
                ("PRD-000404", "Red Bull Energy Drink 250ml", cat_beverages.id, "8901234567907", sup_nestle.id, 125.0, 100.0, 15, [
                    ("B-RB-001", today + timedelta(days=240), 60, "manual")
                ]),
                ("PRD-000405", "Nestea Iced Tea Lemon 500ml", cat_beverages.id, "8901234567908", sup_nestle.id, 60.0, 45.0, 15, [
                    ("B-TEA-001", today + timedelta(days=6), 14, "manual") # Near Expiry & Low Stock
                ]),

                # Personal Care
                ("PRD-000501", "Nycil Prickly Heat Powder 150g", cat_personal.id, "8901542001253", sup_hul.id, 155.0, 120.0, 15, [
                    ("B-NYC-001", today + timedelta(days=300), 75, "manual")
                ]),
                ("PRD-000502", "Loreal White Perfect Foam 100ml", cat_personal.id, "8994993016549", sup_hul.id, 229.0, 180.0, 10, [
                    ("B-LOR-001", today + timedelta(days=400), 50, "manual")
                ]),
                ("PRD-000503", "Harpic Power Plus Cleaner 500ml", cat_personal.id, "8901234567911", sup_hul.id, 110.0, 85.0, 20, [
                    ("B-HARP-001", today + timedelta(days=500), 90, "manual")
                ]),
                ("PRD-000504", "Dove Cream Beauty Bathing Bar 100g", cat_personal.id, "8901234567909", sup_hul.id, 65.0, 48.0, 20, [
                    ("B-DOVE-001", today + timedelta(days=600), 110, "manual")
                ]),
                ("PRD-000505", "Sunsilk Black Shine Shampoo 180ml", cat_personal.id, "8901234567910", sup_hul.id, 140.0, 105.0, 15, [
                    ("B-SUN-001", today + timedelta(days=450), 65, "manual")
                ])
            ]

            for code, name, cat_id, barcode, sup_id, s_price, p_price, min_stk, batches in products_data:
                p = Product(
                    product_code=code,
                    name=name,
                    category_id=cat_id,
                    barcode=barcode,
                    supplier_id=sup_id,
                    selling_price=s_price,
                    purchase_price=p_price,
                    minimum_stock_level=min_stk,
                    status="active"
                )
                db.add(p)
                db.flush()

                for b_num, exp_dt, qty, src in batches:
                    b = ProductBatch(
                        product_id=p.id,
                        batch_number=b_num,
                        expiry_date=exp_dt,
                        quantity=qty,
                        expiry_source=src
                    )
                    db.add(b)
                    db.flush()

                    if qty > 0:
                        tx = InventoryTransaction(
                            product_id=p.id,
                            batch_id=b.id,
                            transaction_type="STOCK_IN",
                            quantity_changed=qty,
                            previous_quantity=0,
                            new_quantity=qty,
                            reason="Initial warehouse stock-in",
                            created_at=datetime.now(timezone.utc) - timedelta(days=30)
                        )
                        db.add(tx)

            db.commit()

        # 5. Historical Sales for Charts
        if db.query(Sale).count() == 0:
            print("Seeding Historical Sales...")
            products = db.query(Product).all()
            payment_methods = ["UPI / QR", "Credit Card", "Cash", "Smart Wallet"]
            
            for i in range(1, 40):
                days_ago = random.randint(1, 28)
                sale_time = datetime.now(timezone.utc) - timedelta(days=days_ago, hours=random.randint(0, 12))
                date_num_str = sale_time.strftime("%Y%m%d")
                inv_num = f"INV-{date_num_str}-{1000 + i}"
                
                chosen_products = random.sample(products, k=random.randint(1, 3))
                total_amt = 0.0
                sale_items = []
                
                for p in chosen_products:
                    if not p.batches:
                        continue
                    b = p.batches[0]
                    qty = random.randint(1, 3)
                    unit_p = p.selling_price
                    line_t = round(qty * unit_p, 2)
                    total_amt += line_t
                    
                    sale_items.append(SaleItem(
                        product_id=p.id,
                        batch_id=b.id,
                        quantity=qty,
                        unit_price=unit_p,
                        line_total=line_t
                    ))

                sale = Sale(
                    invoice_number=inv_num,
                    total_amount=round(total_amt, 2),
                    tax_amount=round(total_amt * 0.05, 2),
                    discount_amount=0.0,
                    payment_method=random.choice(payment_methods),
                    payment_status="paid",
                    created_at=sale_time
                )
                db.add(sale)
                db.flush()

                for si in sale_items:
                    si.sale_id = sale.id
                    db.add(si)

            db.commit()

        print("Database Seeding Completed Successfully!")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
