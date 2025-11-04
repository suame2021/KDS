import { useParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { Search, Plus } from "lucide-react";
import { useNavigationStore } from "../../../../../utils/hooks/use_navigation_store";
import { useNotificationStore } from "../../../../../utils/hooks/use_notification_store";
import { AppUrl } from "../../../../../common/routes/app_urls";
import { useFullSubjectStore } from "../../../../../utils/hooks/use_subject_full_info";
import AddTimerPopUp from "../components/AddTimerPopUp";

export default function ViewParticularSubject() {
  const { subjectId, subjectTitle } = useParams<{
    subjectId: string;
    subjectTitle: string;
  }>();

  const { navigate } = useNavigationStore();
  const { showNotification } = useNotificationStore();
  const { subjectData, getSubjectFullInfo, isLoading } = useFullSubjectStore();
  const [showTimerPopup, setShowTimerPopup] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  // Fetch subject info from backend
  useEffect(() => {
    if (subjectId && subjectTitle) {
      getSubjectFullInfo(subjectId, subjectTitle).catch(() => {
        showNotification("Failed to load subject info", "error");
      });
    }
  }, [subjectId, subjectTitle]);

  // Derived students (filtered)
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
                    Students:{" "}
                    <strong>{students?.length || 0}</strong> • Timer:{" "}
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
                  {/* Conditional Add Timer */}
                  {(
                    <button
                      className="btn btn-outline-primary btn-sm mb-2"
                      onClick={() => setShowTimerPopup(true)}
                    >
                      
                      ⏱{!timer?" Add Timer": " Update Timer" } 
                    </button>
                  )}

                  {/* Conditional Add Questions */}
                  {!question && (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() =>
                        navigate(
                          `/admin/${AppUrl.build(AppUrl.addQuestions, {
                            subjectId: subjectId!,
                          })}`
                        )
                      }
                    >
                      ➕ Add Questions
                    </button>
                  )}
                </div>
              </div>

              {/* Search + Add Student */}
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

                {/* Add Student Button */}
                <button
                  className="btn btn-success btn-sm ms-3 d-flex align-items-center"
                  onClick={() =>
                    navigate(
                      `/admin/${AppUrl.build(AppUrl.addStudentToSubject, {
                        subjectId: subjectId!,
                      })}`
                    )
                  }
                >
                  <Plus size={16} className="me-1" />
                  Add Student
                </button>
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
                      <th style={{ width: "5%" }}>#</th>
                      <th style={{ width: "45%" }}>Student Name</th>
                      <th style={{ width: "50%" }}>Identifier</th>
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
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="text-center text-muted py-4">
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

      {showTimerPopup && (
        <AddTimerPopUp
          subjectTitle={subjectTitle!}
          subjectId={subjectId!}
          onClose={() => setShowTimerPopup(false)}
          onSave={(data) => {
            setShowTimerPopup(false);
          }}
        />
      )}

    </>
  );
}
