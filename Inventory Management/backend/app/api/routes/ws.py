import logging
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.realtime.connection_manager import manager

router = APIRouter(tags=["WebSocket"])
logger = logging.getLogger(__name__)

@router.websocket("/ws/inventory")
async def websocket_inventory_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Keep socket alive and receive client messages/pings if any
            data = await websocket.receive_text()
            logger.debug(f"Received WS text: {data}")
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        manager.disconnect(websocket)
