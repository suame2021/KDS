from ...dependecy import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import UUID, String, ForeignKey
import uuid

class QuestionModel(Base):
    __tablename__ = "questions"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    question: Mapped[str] = mapped_column(String(255), index=True, unique=True)
    a_: Mapped[str] = mapped_column(String(100))
    b_: Mapped[str] = mapped_column(String(100))
    c_: Mapped[str] = mapped_column(String(100))
    d_: Mapped[str] = mapped_column(String(100))
    answer: Mapped[str] = mapped_column(String(100))

    # Foreign key to SubjectModel (one-to-one)
    subject_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("subjects.id", ondelete="CASCADE"),    
        nullable=False
    )

    subject: Mapped["SubJectModel"] = relationship(
        "SubJectModel",
        back_populates="question",
        uselist=False      
    )
