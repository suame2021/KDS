import "../styles/exam_style.css";
import TimerCard from "../components/TimerCard";
import { useSelectedExam } from "../../../../../utils/hooks/use_selected_exam";
import { useStudentAnswers } from "../../../../../utils/hooks/use_student_answers";

export default function ExamScreen() {
  const {
    allAvaliableQuestions: questions,
    currentQuestionIndex,
    nextQuestion,
    prevQuestion,
    setCurrentQuestionIndex,
  } = useSelectedExam();

  const {setAnswer, getAnswer, checkAnswered } = useStudentAnswers();

  if (!questions || questions.length === 0) {
    return <div className="text-center mt-5">No questions available.</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const questionId = currentQuestion.id;
  const selectedAnswer = getAnswer(questionId);

  const handleSelect = (option: string) => {
    setAnswer(questionId, option);
  };

  return (
    <div className="container mt-4 exam-container">
      {/* Timer */}
      <div className="row">
        <TimerCard />
      </div>

      {/* Main Content */}
      <div className="row">
        {/* Q&A Column */}
        <div className="col-md-8">
          <div className="exam-qa card shadow-sm p-4 w-100 mb-3">
            <h5 className="mb-3 text-uppercase">
              Question {currentQuestionIndex + 1} of {questions.length}
            </h5>
            <p className="lead">{currentQuestion.question}</p>

            <form className="mt-3">
              {/* ✅ Option A */}
              <div className="form-check">
                <input
                  type="radio"
                  className="form-check-input"
                  name={`question-${questionId}`}
                  id={`optionA-${questionId}`}
                  checked={selectedAnswer === "A"}
                  onChange={() => handleSelect("A")}
                />
                <label htmlFor={`optionA-${questionId}`} className="form-check-label">
                  <strong>A.</strong> {currentQuestion.a}
                </label>
              </div>

              {/* ✅ Option B */}
              <div className="form-check">
                <input
                  type="radio"
                  className="form-check-input"
                  name={`question-${questionId}`}
                  id={`optionB-${questionId}`}
                  checked={selectedAnswer === "B"}
                  onChange={() => handleSelect("B")}
                />
                <label htmlFor={`optionB-${questionId}`} className="form-check-label">
                  <strong>B.</strong> {currentQuestion.b}
                </label>
              </div>

              {/* ✅ Option C */}
              <div className="form-check">
                <input
                  type="radio"
                  className="form-check-input"
                  name={`question-${questionId}`}
                  id={`optionC-${questionId}`}
                  checked={selectedAnswer === "C"}
                  onChange={() => handleSelect("C")}
                />
                <label htmlFor={`optionC-${questionId}`} className="form-check-label">
                  <strong>C.</strong> {currentQuestion.c}
                </label>
              </div>

              {/* ✅ Option D */}
              <div className="form-check">
                <input
                  type="radio"
                  className="form-check-input"
                  name={`question-${questionId}`}
                  id={`optionD-${questionId}`}
                  checked={selectedAnswer === "D"}
                  onChange={() => handleSelect("D")}
                />
                <label htmlFor={`optionD-${questionId}`} className="form-check-label">
                  <strong>D.</strong> {currentQuestion.d}
                </label>
              </div>
            </form>

            {/* Navigation Buttons */}
            <div className="d-flex justify-content-between mt-4">
              <button
                className="btn btn-outline-secondary"
                onClick={prevQuestion}
                disabled={currentQuestionIndex === 0}
              >
                ← Previous
              </button>
              <button
                className="btn btn-primary"
                onClick={nextQuestion}
                disabled={currentQuestionIndex === questions.length - 1}
              >
                Next →
              </button>
            </div>
          </div>
        </div>

        {/* All Questions */}
        <div className="col-md-4">
          <div className="all-questions-container gap-2">
            {questions.map((q, index) => {
              const isActive = currentQuestionIndex === index;
              const isAnswered = checkAnswered(q.id);

              return (
                <div
                  key={q.id}
                  className={`question-card ${isActive ? "active" : ""} ${
                    isAnswered ? "answered" : ""
                  }`}
                  onClick={() => setCurrentQuestionIndex(index)}
                >
                  Q{index + 1}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
