from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.repo.models import QuestionModel
from uuid import UUID, uuid4
from app.utils.enums.auth_enums import AuthEums
from app.repo.schemas.subject_schemas.all_questions_schemas import GetQuestionSchemas

class AllQuestionQueries:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def add_question(self, subject_id: UUID, data):
        try:
            questions = [
                QuestionModel(
                    id=uuid4(),
                    question=row["Questions"],
                    a_=row["a"],
                    b_=row["b"],
                    c_=row["c"],
                    d_=row["d"],
                    answer=row["answers"],
                    subject_id=subject_id,
                )
                for _, row in data.iterrows()
            ]

         
            self.session.add_all(questions)
            await self.session.commit()
            return AuthEums.OK

        except Exception as e:
            await self.session.rollback()
            print("❌ add_question error:", e)
            return AuthEums.ERROR
        
    
    async def get_questions(self, subject_id: UUID):
            stmt = await self.session.execute(select(QuestionModel).where(QuestionModel.subject_id == subject_id))
            rows = stmt.scalars().all()
            return [
                GetQuestionSchemas(
                    id=row.id,
                    question=row.question,
                    a=row.a_,
                    b=row.b_,
                    c=row.c_,
                    d=row.d_)
                  
                for row in rows
            ]
            
    async def clear_old_question(self, subject_id: UUID):
        stmt = await self.session.execute(select(QuestionModel).where(QuestionModel.subject_id == subject_id))
        self.session.delete(
            
        )