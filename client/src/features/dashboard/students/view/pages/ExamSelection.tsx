
import Spinner from "../../../../../common/component/Spinner";
import { useAllSubjects } from "../../../../../utils/hooks/use_all_subjects";
import ExamCard from "../components/ExamCards";
import ExamHeading from "../components/ExamHeading";
import "../styles/exam_select_style.css"


export default function ExamSelection() {
    const { subjects } = useAllSubjects()
    console.log(subjects?.className)
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12 h-100">
                    <div className="row">
                        <div className="col-12">
                            <ExamHeading className={subjects?.className} teacherName={subjects?.teacherName} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <div className="exam-container">
                                {
                                    subjects?.subjects.length === 0 ? <Spinner /> : subjects?.subjects.map(
                                        (sub, key) => <ExamCard subject={sub} key={key} />
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
