import examIcon from "../../../../../assets/images/exams.svg"
import type { SubjectModel } from "../../../../../common/model/classModels/subject_model"
import { useSelectedExam } from "../../../../../utils/hooks/use_selected_exam"

type examCardProps = {
    subject: SubjectModel
}

export default function ExamCard({
    subject
}: examCardProps) {
    const { setSelectedExam, getExamStats } = useSelectedExam()
    return <div className="exam-card" onClick={async () => {
        setSelectedExam(subject)
        
        await getExamStats()

    }}>
        <div className="image-container">
            <img src={examIcon} alt="" />
        </div>
        <div className="description">
            <h3>
                {subject.title}
            </h3>
            <small>
                {subject.author}
            </small>
        </div>
    </div>
}