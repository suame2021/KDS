import { useState, useEffect } from "react";
import { X, Check } from "lucide-react";
import { useNotificationStore } from "../../../../../utils/hooks/use_notification_store";
import { AllAdminOperation } from "../../viewModel/allAdminOperations";
import { useFullSubjectStore } from "../../../../../utils/hooks/use_subject_full_info";

interface FormatQuestionPopupProps {
  subjectId: string;
  subjectTitle: string;
  onClose: () => void;
  onSave: () => Promise<void>;
  existingFormat?: {
    num_of_qa: number;
    score_per_qa: number;
  } | null;
}

export default function FormatQuestionPopup({
  subjectId,
  subjectTitle,
  onClose,
  onSave,
  existingFormat,
}: FormatQuestionPopupProps) {
  const { showNotification } = useNotificationStore();
  const [loading, setLoading] = useState(false);
  const { subjectData } = useFullSubjectStore();
  
  // Get total questions from store - Try different property names
  const questionData = subjectData?.question;
  let totalQuestions = 0;
  
  // Debug: Log the question data to see its structure
  useEffect(() => {
    console.log("Question data structure:", questionData);
  }, [questionData]);
  
  if (questionData) {
    // Try different possible property names
    totalQuestions = 
      questionData.totalQuestions || 
      0;
  }
  
  console.log("Total questions calculated:", totalQuestions);
  
  // Form state
  const [format, setFormat] = useState({
    num_of_qa: existingFormat?.num_of_qa || Math.min(totalQuestions, 1),
    score_per_qa: existingFormat?.score_per_qa || 1,
  });

  // Update num_of_qa when totalQuestions changes
  useEffect(() => {
    if (totalQuestions > 0 && format.num_of_qa > totalQuestions) {
      setFormat(prev => ({
        ...prev,
        num_of_qa: totalQuestions
      }));
    }
  }, [totalQuestions, format.num_of_qa]);

  // Initialize format when component mounts or existingFormat changes
  useEffect(() => {
    if (existingFormat) {
      setFormat({
        num_of_qa: existingFormat.num_of_qa,
        score_per_qa: existingFormat.score_per_qa,
      });
    } else {
      const initialNum = totalQuestions > 0 ? 1 : 0;
      setFormat({
        num_of_qa: initialNum,
        score_per_qa: 1,
      });
    }
  }, [existingFormat, totalQuestions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value) || 0;
    
    // Ensure values are positive
    if (numValue < 0) return;
    
    // Set max limits based on totalQuestions
    if (name === "num_of_qa" && numValue > totalQuestions) {
      showNotification(
        `Cannot exceed total questions (${totalQuestions})`, 
        "error"
      );
      return;
    }
    
    if (name === "score_per_qa" && numValue > 1000) return;
    
    setFormat(prev => ({
      ...prev,
      [name]: numValue
    }));
  };

  const handleNumberChange = (field: "num_of_qa" | "score_per_qa", increment: boolean) => {
    setFormat(prev => {
      let newValue = prev[field];
      
      if (increment) {
        newValue += 1;
        // Apply max limits
        if (field === "num_of_qa" && newValue > totalQuestions) {
          showNotification(`Cannot exceed ${totalQuestions} questions`, "error");
          return prev;
        }
        if (field === "score_per_qa" && newValue > 1000) return prev;
      } else {
        newValue = Math.max(1, newValue - 1); // Minimum 1
      }
      
      return {
        ...prev,
        [field]: newValue
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (format.num_of_qa === 0) {
      showNotification("Number of questions cannot be 0", "error");
      return;
    }
    
    if (format.score_per_qa === 0) {
      showNotification("Score per question cannot be 0", "error");
      return;
    }
    
    if (format.num_of_qa > totalQuestions) {
      showNotification(
        `Cannot set more questions (${format.num_of_qa}) than available (${totalQuestions})`,
        "error"
      );
      return;
    }

    setLoading(true);
    try {
      const response = await AllAdminOperation.saveQuestionFormat({
        subjectId,
        ...format
      });
      
      if (response) {
        showNotification(
          existingFormat 
            ? "Question format updated successfully!" 
            : "Question format saved successfully!", 
          "success"
        );
        await onSave();
        onClose();
      } else {
        showNotification("Failed to save question format", "error");
      }
    } catch (error) {
      console.error("Error saving question format:", error);
      showNotification("An error occurred while saving format", "error");
    } finally {
      setLoading(false);
    }
  };

  const totalScore = format.num_of_qa * format.score_per_qa;

  return (
    <div className="modal-backdrop fade show" style={{ display: "block" }}>
      <div className="modal fade show" style={{ display: "block" }}>
        <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "500px" }}>
          <div className="modal-content border-0 shadow-lg">
            {/* Header */}
            <div className="modal-header border-bottom bg-white">
              <div className="w-100">
                <h5 className="modal-title text-dark fw-bold mb-1">
                  {existingFormat ? "Update Question Format" : "Set Question Format"}
                </h5>
                <p className="text-muted small mb-0">
                  {subjectTitle} • {totalQuestions} total questions available
                </p>
                {totalQuestions === 0 && (
                  <div className="alert alert-warning alert-sm mt-2 py-1" role="alert">
                    No questions uploaded yet. Please add questions first.
                  </div>
                )}
              </div>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                disabled={loading}
              />
            </div>

            {/* Body */}
            <div className="modal-body p-4">
              {totalQuestions === 0 ? (
                <div className="text-center py-4">
                  <div className="mb-3">
                    <span className="display-1">📝</span>
                  </div>
                  <h5 className="text-muted">No Questions Available</h5>
                  <p className="text-muted small">
                    You need to upload questions first before setting the format.
                  </p>
                  <button
                    type="button"
                    className="btn btn-secondary mt-3"
                    onClick={onClose}
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {/* Number of Questions */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold text-dark mb-3">
                      Number of Questions
                    </label>
                    <div className="d-flex align-items-center gap-3">
                      <button
                        type="button"
                        className="btn btn-outline-secondary rounded-circle p-0"
                        style={{ width: "36px", height: "36px" }}
                        onClick={() => handleNumberChange("num_of_qa", false)}
                        disabled={loading || format.num_of_qa <= 1}
                      >
                        <span className="fs-5">−</span>
                      </button>
                      
                      <div className="flex-grow-1 text-center">
                        <input
                          type="number"
                          className="form-control form-control-lg text-center fw-bold"
                          name="num_of_qa"
                          value={format.num_of_qa}
                          onChange={handleInputChange}
                          min="1"
                          max={totalQuestions}
                          required
                          disabled={loading}
                          style={{ fontSize: "1.25rem" }}
                        />
                        <div className="text-muted small mt-1">
                          of {totalQuestions} available
                        </div>
                      </div>
                      
                      <button
                        type="button"
                        className="btn btn-outline-primary rounded-circle p-0"
                        style={{ width: "36px", height: "36px" }}
                        onClick={() => handleNumberChange("num_of_qa", true)}
                        disabled={loading || format.num_of_qa >= totalQuestions}
                      >
                        <span className="fs-5">+</span>
                      </button>
                    </div>
                  </div>

                  {/* Score per Question */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold text-dark mb-3">
                      Points per Question
                    </label>
                    <div className="d-flex align-items-center gap-3">
                      <button
                        type="button"
                        className="btn btn-outline-secondary rounded-circle p-0"
                        style={{ width: "36px", height: "36px" }}
                        onClick={() => handleNumberChange("score_per_qa", false)}
                        disabled={loading || format.score_per_qa <= 1}
                      >
                        <span className="fs-5">−</span>
                      </button>
                      
                      <div className="flex-grow-1 text-center">
                        <input
                          type="number"
                          className="form-control form-control-lg text-center fw-bold"
                          name="score_per_qa"
                          value={format.score_per_qa}
                          onChange={handleInputChange}
                          min="1"
                          max="1000"
                          required
                          disabled={loading}
                          style={{ fontSize: "1.25rem" }}
                        />
                        <div className="text-muted small mt-1">
                          points each
                        </div>
                      </div>
                      
                      <button
                        type="button"
                        className="btn btn-outline-primary rounded-circle p-0"
                        style={{ width: "36px", height: "36px" }}
                        onClick={() => handleNumberChange("score_per_qa", true)}
                        disabled={loading || format.score_per_qa >= 1000}
                      >
                        <span className="fs-5">+</span>
                      </button>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="bg-light rounded p-4 mb-4">
                    <div className="row text-center">
                      <div className="col">
                        <div className="text-muted small">Questions</div>
                        <div className="fs-4 fw-bold text-primary">
                          {format.num_of_qa}
                        </div>
                      </div>
                      <div className="col border-start border-end">
                        <div className="text-muted small">Points Each</div>
                        <div className="fs-4 fw-bold text-success">
                          {format.score_per_qa}
                        </div>
                      </div>
                      <div className="col">
                        <div className="text-muted small">Total Score</div>
                        <div className="fs-4 fw-bold text-dark">
                          {totalScore}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="d-flex gap-3">
                    <button
                      type="button"
                      className="btn btn-light flex-fill py-2"
                      onClick={onClose}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary flex-fill py-2 d-flex align-items-center justify-content-center gap-2"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm" />
                          {existingFormat ? "Updating..." : "Saving..."}
                        </>
                      ) : (
                        <>
                          <Check size={18} />
                          {existingFormat ? "Update" : "Save"}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}