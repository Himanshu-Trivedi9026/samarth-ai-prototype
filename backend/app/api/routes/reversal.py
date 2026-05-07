from fastapi import APIRouter

from app.db.database import (
    add_merge_history,
    get_merge_history,
)

router = APIRouter()


@router.post("/unmerge")
def unmerge_entities(data: dict):

    source_ubid = data.get(
        "source_ubid"
    )

    target_ubid = data.get(
        "target_ubid"
    )

    add_merge_history(

        source_ubid,

        target_ubid,

        "UNMERGE"
    )

    return {

        "success": True,

        "message":
            "Entities successfully unmerged.",

        "source_ubid":
            source_ubid,

        "target_ubid":
            target_ubid,
    }


@router.get("/history")
def merge_history():

    history = get_merge_history()

    return {

        "total_actions":
            len(history),

        "history":
            history,
    }