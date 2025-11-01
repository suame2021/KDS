from pydantic import UUID4, BaseModel




class GetQuestionSchemas(BaseModel):
    id:UUID4
    question:str
    a:str
    b:str
    c:str
    d:str