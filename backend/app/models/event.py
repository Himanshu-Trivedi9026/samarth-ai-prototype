from pydantic import BaseModel


class Event(BaseModel):
    type: str
    timestamp: str
    ubid: str