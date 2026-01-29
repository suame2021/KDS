from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.repo.models import QuestionModel
from uuid import UUID, uuid4
from app.utils.enums.auth_enums import AuthEums
from app.repo.schemas.subject_schemas.all_questions_schemas import GetQuestionSchemas, SubmittedQ
from random import shuffle
from sqlalchemy import delete

from app.repo.models.subject.student_scores_model import StudentScoreModel


class FilterQuestionQueries():
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_filtered_questions(self, subject_id: UUID):
        try:
            stmt = await self.session.execute(
                select(QuestionModel).where(QuestionModel.subject_id == subject_id)
            )
            rows = stmt.scalars().all()
            if len(rows) < num_of_qa:
                num_of_qa = len(rows)
            selected_questions = rows[:num_of_qa]
            shuffle(selected_questions)
            return [
                GetQuestionSchemas(
                    id=row.id,
                    question=row.question,
                    a_=row.a_,
                    b_=row.b_,
                    c_=row.c_,
                    d_=row.d_,
                )
                for row in selected_questions
            ]
        except Exception as e:
            print("get_filtered_questions error:", e)
            return []