import { useParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { Search } from "lucide-react";
import { useNotificationStore } from "../../../../../utils/hooks/use_notification_store";
import { useFullSubjectStore } from "../../../../../utils/hooks/use_subject_full_info";
import AddTimerPopUp from "../components/AddTimerPopUp";
import UploadStudentQuestion from "../components/UploadStudentQuestion";
import { usePopupStore } from "../../../../../utils/hooks/use_pop_up_menu";
import { AllAdminOperation } from "../../viewModel/allAdminOperations";

export default function ViewParticularSubject() {
  const { subjectId, subjectTitle } = useParams<{
    subjectId: string;
    subjectTitle: string;
  }>();

  const { showNotification } = useNotificationStore();
  const { subjectData, getSubjectFullInfo, isLoading } = useFullSubjectStore();

  const [showTimerPopup, setShowTimerPopup] = useState(false);
  const [showAddQuestionPopup, setShowAddQuestionPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { openPopup, closePopup } = usePopupStore.getState()

  useEffect(() => {
    if (subjectId && subjectTitle) {
      getSubjectFullInfo(subjectId, subjectTitle).catch(() => {
        showNotification("Failed to load subject info", "error");
      });
    }
  }, [subjectId, subjectTitle]);

  const filteredStudents = useMemo(() => {
    if (!subjectData?.students) return [];
    return subjectData.students.filter(
      (s) =>
        s.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.identifier.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [subjectData, searchTerm]);

  if (isLoading || !subjectData) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3 text-muted">Loading subject details...</p>
      </div>
    );
  }

  const { timer, question, students } = subjectData;

  return (
    <>
      <div className="admin-container mt-5">
        <div className="container">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              {/* Header Section */}
              <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                  <h3 className="mb-1 text-primary">{subjectTitle}</h3>
                  <p className="text-muted mb-0">
                    Students: <strong>{students?.length || 0}</strong> • Timer:{" "}
                    {timer ? (
                      <span className="badge bg-info text-dark">
                        {timer.hr.toString().padStart(2, "0")}h{" "}
                        {timer.mins.toString().padStart(2, "0")}m{" "}
                        {timer.sec.toString().padStart(2, "0")}s
                      </span>
                    ) : (
                      <span className="badge bg-secondary">Not set</span>
                    )}
                    • Questions:{" "}
                    <strong>{question ? "Added" : "Not added"}</strong>
                  </p>
                </div>

                {/* Buttons Section */}
                <div className="d-flex flex-column align-items-end">
                  <button
                    className="btn btn-outline-primary btn-sm mb-2"
                    onClick={() => setShowTimerPopup(true)}
                  >
                    ⏱{!timer ? " Add Timer" : " Update Timer"}
                  </button>

                  {!question && (
                    <button
                      className="btn btn-primary btn-sm mb-2"
                      onClick={() => setShowAddQuestionPopup(true)}
                    >
                      ➕ Add Questions
                    </button>
                  )}
                  {
                    students.length !== 0 && (
                      <button
                        className="btn btn-outline-success btn-sm mb-2"
                        onClick={() => {
                          openPopup({
                            title: "Generate excel record",
                            message: "Do you wish to carry out with this operation!!!",
                            onContinue: async () => { },
                            onCancel: () => closePopup(),
                          })
                        }}
                      >
                        📄 {"Generate Excel Record"}
                      </button>
                    )
                  }

                  {
                    question && (
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => {
                          openPopup({
                            title: "Delete uploaded question",
                            message: "Do you want to delete the current current question!!",
                            onContinue: async () => { 
                              var res = await AllAdminOperation.deleteQuestions({subjectId:subjectId!})
                              if(res){
                                await getSubjectFullInfo(subjectId!, subjectTitle!)
                              }
                            },
                            onCancel: () => closePopup(),
                          })
                        }}
                      >
                        ❌ {"Drop Question"}
                      </button>
                    )
                  }
                </div>
              </div>

              {/* Search */}
              <div className="mb-3 position-relative d-flex align-items-center">
                <div className="position-relative" style={{ flexGrow: 1 }}>
                  <input
                    type="text"
                    className="form-control form-control-sm ps-4"
                    placeholder="Search student by name or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ maxWidth: "300px" }}
                  />
                  <Search
                    size={16}
                    className="text-secondary position-absolute"
                    style={{
                      left: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}
                  />
                </div>
              </div>

              {/* Student Table */}
              <div
                className="table-responsive"
                style={{
                  maxHeight: "400px",
                  overflowY: "auto",
                  scrollbarColor: "rgba(108,117,125,0.6) transparent",
                }}
              >
                <table className="table table-hover align-middle">
                  <thead className="table-light sticky-top">
                    <tr>
                      <th>#</th>
                      <th>Student Name</th>
                      <th>Identifier</th>
                      <th>Subject</th>
                      <th>Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((student, index) => (
                        <tr key={`${student.identifier}-${index}`}>
                          <td>{index + 1}</td>
                          <td>{student.studentName}</td>
                          <td>
                            <span className="badge bg-secondary">
                              {student.identifier}
                            </span>
                          </td>
                          <td>{subjectTitle}</td>
                          <td>
                            {student.score !== undefined
                              ? `${student.score}%`
                              : "—"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center text-muted py-4">
                          No matching students found 😕
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popups */}
      {showTimerPopup && (
        <AddTimerPopUp
          subjectTitle={subjectTitle!}
          subjectId={subjectId!}
          onClose={() => setShowTimerPopup(false)}
          onSave={() => {
            setShowTimerPopup(false);
            getSubjectFullInfo(subjectId!, subjectTitle!);
          }}
        />
      )}

      {showAddQuestionPopup && (
        <UploadStudentQuestion
          subject_id={subjectId!}
          onSave={() =>
            getSubjectFullInfo(subjectId!, subjectTitle!).catch(() =>
              showNotification("Failed to load subject info", "error")
            )
          }
          onClose={() => setShowAddQuestionPopup(false)}
          onUploadExcel={() =>
            getSubjectFullInfo(subjectId!, subjectTitle!).catch(() =>
              showNotification("Failed to load subject info", "error")
            )
          }
        />
      )}
    </>
  );
}
