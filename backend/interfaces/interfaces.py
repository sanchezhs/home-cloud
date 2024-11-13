from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class File(BaseModel):
    id: Optional[int] = None
    file_name: str
    last_modified: datetime
    uploaded_at: datetime
    size: int
    mimeType: Optional[str] = None
    path: Optional[str] = None
    content: bytes
