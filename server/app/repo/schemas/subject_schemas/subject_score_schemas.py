from typing import Literal, Optional
from pydantic import UUID4, BaseModel



class AddScoreSchemas(BaseModel):
    score:int
    total_questions:int
    correct_answers:int
    attempt_number:int
    exam_status:Literal["timedout", "submitted"]
    student_id:UUID4
    subject_id:UUID4
    
    


class ScoreIdInfo(BaseModel):
    subjectId:UUID4
    studentId:UUID4
    

class StudentScoreInfo(BaseModel):
    studentName:str
    identifier:str
    score:float
    


class StudentScoreRecord(BaseModel):
    className:str
    subject:str
    students:Optional[list[StudentScoreInfo]]