from fastapi import APIRouter



auth = APIRouter(
    tags=['auth'],
    prefix="/auth",
    responses={
        404:{
            "message": "not found"
        }
    }
)



@auth.get("/working")
async def test_api():
    return "working"