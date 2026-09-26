from fastapi import HTTPException, status

class ItemNotFoundException(HTTPException):
    def __init__(self, detail: str = "Requested item not found"):
        super().__init__(status_code=status.HTTP_404_NOT_FOUND, detail=detail)

class DuplicateEntryException(HTTPException):
    def __init__(self, detail: str = "Item already exists"):
        super().__init__(status_code=status.HTTP_409_CONFLICT, detail=detail)

class InsufficientStockException(HTTPException):
    def __init__(self, detail: str = "Insufficient stock available for this operation"):
        super().__init__(status_code=status.HTTP_400_BAD_REQUEST, detail=detail)

class ExpiredBatchException(HTTPException):
    def __init__(self, detail: str = "Product batch has expired and cannot be sold"):
        super().__init__(status_code=status.HTTP_400_BAD_REQUEST, detail=detail)

class InvalidBarcodeException(HTTPException):
    def __init__(self, detail: str = "Invalid barcode format or check digit"):
        super().__init__(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=detail)
