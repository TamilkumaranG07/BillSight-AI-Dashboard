from app.services.expiry_detection.base import ExpiryDetectionResult

class NullExpiryDetector:
    """Stub expiry detector used when CV / OCR module is disabled or not installed."""

    async def detect(self, image_bytes: bytes) -> ExpiryDetectionResult:
        return ExpiryDetectionResult(
            expiry_date=None,
            manufacturing_date=None,
            batch_number=None,
            confidence=0.0,
            raw_text="AI Expiry OCR Detector is not currently active.",
            source="manual",
            is_available=False
        )
