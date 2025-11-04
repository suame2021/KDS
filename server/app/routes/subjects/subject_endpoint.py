from uuid import UUID
from fastapi import APIRouter, Depends, Query
from fastapi.responses import JSONResponse
from app.repo.schemas.default_server_res import DefaultServerApiRes
from app.repo import db_injection
from app.repo.queries.subject_queries.all_subject_queries import AllSubjectQueries
from app.repo.schemas.subject_schemas.add_new_subject import AddNewSubjectSchemas, SubjectById, SubjectFullInfo, SubjectInfoSchemas, ParticularSubjectSchemas
from typing import Annotated, List

from app.utils.enums.auth_enums import AuthEums
from app.security.token_generator import verify_token


subject_endpoint = APIRouter(
    tags=["subjects"],
    prefix="/subjects",
    responses={
        404:{
            "message":"not found"
        }
    }
)




@subject_endpoint.get("/get_all_subject", response_model=DefaultServerApiRes[SubjectInfoSchemas[ParticularSubjectSchemas]])
async def get_all_subject(
    db: db_injection,
    current_user: Annotated[dict, Depends(verify_token)],
    classId: UUID = Query(..., description="Class ID for filtering subjects"),
    
):
    sub_query = AllSubjectQueries(db)
    all_sub = await sub_query.get_all_subjects(classId)
    return DefaultServerApiRes(
        statusCode=200,
        message="All subjects available",
        data=all_sub
    )


@subject_endpoint.post("/add_subject", response_model=DefaultServerApiRes[str])
async def add_subject(db: db_injection, add: AddNewSubjectSchemas):
    sub_query = AllSubjectQueries(db)
    result = await sub_query.add_new_subject(add)

    if result == AuthEums.CREATED:
        return DefaultServerApiRes(
            statusCode=201,
            message="Subject created successfully",
            data="Subject created successfully",
        )

    elif result == AuthEums.EXISTS:
        return DefaultServerApiRes(
            statusCode=409,
            message="Subject already exists",
            data="Subject already exists",
        )

    else:
        return DefaultServerApiRes(
            statusCode=500,
            message="An unexpected error occurred while creating the subject",
            data=None,
        )



@subject_endpoint.get("/{subject_id}/{subject_title}", response_model=DefaultServerApiRes[SubjectFullInfo])
async def get_full_subject_info(
    subject_id: UUID,
    subject_title: str,
    db: db_injection
):
    repo = AllSubjectQueries(db)
    subject_info = await repo.get_subject_full_info(subject_id=subject_id, subject_title=subject_title)

    if not subject_info:
        return JSONResponse(
            status_code=404,
            content={"message": "Subject not found or title mismatch"}
        )
        

    return DefaultServerApiRes(
        statusCode=200,
        message="subject full info",
        data=subject_info
    )