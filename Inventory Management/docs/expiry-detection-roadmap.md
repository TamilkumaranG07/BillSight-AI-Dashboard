# BillSight AI - Expiry Date Detection Roadmap (OCR & Computer Vision)

## Overview

This document outlines the architecture, integration points, and future deployment strategy for adding **AI-based Expiry Date Detection** to the BillSight AI Inventory Management module using computer vision and OCR.

---

## 1. Extension Points Implemented in Phase 1

The system is already pre-configured for zero-refactor plugin integration:

### A. Database Schema
* `product_batches.expiry_source`: Enum (`manual` | `ocr` | `import`).
* `product_batches.expiry_confidence`: Nullable float (`0.0` to `1.0`).

### B. Python Protocol Interface
Located in `app/services/expiry_detection/base.py`:
```python
class ExpiryDetectionResult(BaseModel):
    expiry_date: Optional[date] = None
    manufacturing_date: Optional[date] = None
    batch_number: Optional[str] = None
    confidence: float          # 0..1
    raw_text: Optional[str] = None
    source: Literal["ocr", "manual"]
    is_available: bool

class ExpiryDetector(Protocol):
    async def detect(self, image_bytes: bytes) -> ExpiryDetectionResult: ...
```

### C. Active Stub Implementation
`NullExpiryDetector` (`app/services/expiry_detection/null_detector.py`) is injected via settings (`EXPIRY_DETECTOR_TYPE=null`).

### D. Endpoint Reservation
`POST /api/expiry/detect` returns `501 Not Implemented` with detailed instructions until the CV plugin is enabled.

---

## 2. Planned AI Pipeline (Phase 2 Upgrade)

```
[Camera Feed / Frame Capture]
          ↓
[POST /api/expiry/detect]
          ↓
[OpenCV Preprocessing]
  • Adaptive Thresholding / Binarization
  • Orientation & Perspective Correction (FSRCNN)
          ↓
[Text Extraction (PaddleOCR / Tesseract)]
  • Region Proposal for Expiry/MFG date blocks
          ↓
[Date Parser (python-dateutil)]
  • Parses formats: DD/MM/YYYY, MM/YY, EXP MM-YYYY, BEST BEFORE DD MMM YYYY
          ↓
[Confidence Scoring & Validation]
  • High Confidence (>0.85): Pre-fill Stock-In form
  • Low Confidence (<0.85): Highlight for Human Verification
          ↓
[Human Confirmation Step] → Saved to DB
```

---

## 3. Required Python Packages for Enablement
```bash
pip install opencv-python-headless pillow paddleocr python-dateutil
```

---

## 4. Operational Workflow
1. Cashier or Inventory Manager scans barcode on Stock-In / Add Product screen.
2. Camera captures expiry area on packaging.
3. System extracts `EXP 12/2026` with 0.94 confidence.
4. UI pre-fills `Expiry Date: 2026-12-31` and marks `expiry_source="ocr"`.
5. User confirms or adjusts date before committing stock.
