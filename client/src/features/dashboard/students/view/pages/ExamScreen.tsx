import { useState } from "react";
import "../styles/exam_style.css"
import TimerCard from "../components/TimerCard";

export default function ExamScreen() {
    const questions = [
        { id: 1, text: "What is 2 + 2?" },
        { id: 2, text: "Define photosynthesis." },
        { id: 3, text: "Who discovered gravity?" },
        { id: 4, text: "Explain Newton’s second law." },
        { id: 5, text: "What is the capital of France?" },
        { id: 6, text: "Name a prime number between 10 and 20." },
                { id: 1, text: "What is 2 + 2?" },
        { id: 2, text: "Define photosynthesis." },
        { id: 3, text: "Who discovered gravity?" },
        { id: 4, text: "Explain Newton’s second law." },
        { id: 5, text: "What is the capital of France?" },
        { id: 6, text: "Name a prime number between 10 and 20." },
                { id: 1, text: "What is 2 + 2?" },
        { id: 2, text: "Define photosynthesis." },
        { id: 3, text: "Who discovered gravity?" },
        { id: 4, text: "Explain Newton’s second law." },
        { id: 5, text: "What is the capital of France?" },
        { id: 6, text: "Name a prime number between 10 and 20." },
                { id: 1, text: "What is 2 + 2?" },
        { id: 2, text: "Define photosynthesis." },
        { id: 3, text: "Who discovered gravity?" },
        { id: 4, text: "Explain Newton’s second law." },
        { id: 5, text: "What is the capital of France?" },
        { id: 6, text: "Name a prime number between 10 and 20." },
                { id: 1, text: "What is 2 + 2?" },
        { id: 2, text: "Define photosynthesis." },
        { id: 3, text: "Who discovered gravity?" },
        { id: 4, text: "Explain Newton’s second law." },
        { id: 5, text: "What is the capital of France?" },
        { id: 6, text: "Name a prime number between 10 and 20." },
                { id: 1, text: "What is 2 + 2?" },
        { id: 2, text: "Define photosynthesis." },
        { id: 3, text: "Who discovered gravity?" },
        { id: 4, text: "Explain Newton’s second law." },
        { id: 5, text: "What is the capital of France?" },
        { id: 6, text: "Name a prime number between 10 and 20." },
                { id: 1, text: "What is 2 + 2?" },
        { id: 2, text: "Define photosynthesis." },
        { id: 3, text: "Who discovered gravity?" },
        { id: 4, text: "Explain Newton’s second law." },
        { id: 5, text: "What is the capital of France?" },
        { id: 6, text: "Name a prime number between 10 and 20." },
                { id: 1, text: "What is 2 + 2?" },
        { id: 2, text: "Define photosynthesis." },
        { id: 3, text: "Who discovered gravity?" },
        { id: 4, text: "Explain Newton’s second law." },
        { id: 5, text: "What is the capital of France?" },
        { id: 6, text: "Name a prime number between 10 and 20." },
                { id: 1, text: "What is 2 + 2?" },
        { id: 2, text: "Define photosynthesis." },
        { id: 3, text: "Who discovered gravity?" },
        { id: 4, text: "Explain Newton’s second law." },
        { id: 5, text: "What is the capital of France?" },
        { id: 6, text: "Name a prime number between 10 and 20." },
                { id: 1, text: "What is 2 + 2?" },
        { id: 2, text: "Define photosynthesis." },
        { id: 3, text: "Who discovered gravity?" },
        { id: 4, text: "Explain Newton’s second law." },
        { id: 5, text: "What is the capital of France?" },
        { id: 6, text: "Name a prime number between 10 and 20." },
                { id: 1, text: "What is 2 + 2?" },
        { id: 2, text: "Define photosynthesis." },
        { id: 3, text: "Who discovered gravity?" },
        { id: 4, text: "Explain Newton’s second law." },
        { id: 5, text: "What is the capital of France?" },
        { id: 6, text: "Name a prime number between 10 and 20." },        { id: 1, text: "What is 2 + 2?" },
        { id: 2, text: "Define photosynthesis." },
        { id: 3, text: "Who discovered gravity?" },
        { id: 4, text: "Explain Newton’s second law." },
        { id: 5, text: "What is the capital of France?" },
        { id: 6, text: "Name a prime number between 10 and 20." },        { id: 1, text: "What is 2 + 2?" },
        { id: 2, text: "Define photosynthesis." },
        { id: 3, text: "Who discovered gravity?" },
        { id: 4, text: "Explain Newton’s second law." },
        { id: 5, text: "What is the capital of France?" },
        { id: 6, text: "Name a prime number between 10 and 20." },        { id: 1, text: "What is 2 + 2?" },
        { id: 2, text: "Define photosynthesis." },
        { id: 3, text: "Who discovered gravity?" },
        { id: 4, text: "Explain Newton’s second law." },
        { id: 5, text: "What is the capital of France?" },
        { id: 6, text: "Name a prime number between 10 and 20." },        { id: 1, text: "What is 2 + 2?" },
        { id: 2, text: "Define photosynthesis." },
        { id: 3, text: "Who discovered gravity?" },
        { id: 4, text: "Explain Newton’s second law." },
        { id: 5, text: "What is the capital of France?" },
        { id: 6, text: "Name a prime number between 10 and 20." },        { id: 1, text: "What is 2 + 2?" },
        { id: 2, text: "Define photosynthesis." },
        { id: 3, text: "Who discovered gravity?" },
        { id: 4, text: "Explain Newton’s second law." },
        { id: 5, text: "What is the capital of France?" },
        { id: 6, text: "Name a prime number between 10 and 20." },        { id: 1, text: "What is 2 + 2?" },
        { id: 2, text: "Define photosynthesis." },
        { id: 3, text: "Who discovered gravity?" },
        { id: 4, text: "Explain Newton’s second law." },
        { id: 5, text: "What is the capital of France?" },
        { id: 6, text: "Name a prime number between 10 and 20." },        { id: 1, text: "What is 2 + 2?" },
        { id: 2, text: "Define photosynthesis." },
        { id: 3, text: "Who discovered gravity?" },
        { id: 4, text: "Explain Newton’s second law." },
        { id: 5, text: "What is the capital of France?" },
        { id: 6, text: "Name a prime number between 10 and 20." },        { id: 1, text: "What is 2 + 2?" },
        { id: 2, text: "Define photosynthesis." },
        { id: 3, text: "Who discovered gravity?" },
        { id: 4, text: "Explain Newton’s second law." },
        { id: 5, text: "What is the capital of France?" },
        { id: 6, text: "Name a prime number between 10 and 20." },        { id: 1, text: "What is 2 + 2?" },
        { id: 2, text: "Define photosynthesis." },
        { id: 3, text: "Who discovered gravity?" },
        { id: 4, text: "Explain Newton’s second law." },
        { id: 5, text: "What is the capital of France?" },
        { id: 6, text: "Name a prime number between 10 and 20." },        { id: 1, text: "What is 2 + 2?" },
        { id: 2, text: "Define photosynthesis." },
        { id: 3, text: "Who discovered gravity?" },
        { id: 4, text: "Explain Newton’s second law." },
        { id: 5, text: "What is the capital of France?" },
        { id: 6, text: "Name a prime number between 10 and 20." },        { id: 1, text: "What is 2 + 2?" },
        { id: 2, text: "Define photosynthesis." },
        { id: 3, text: "Who discovered gravity?" },
        { id: 4, text: "Explain Newton’s second law." },
        { id: 5, text: "What is the capital of France?" },
        { id: 6, text: "Name a prime number between 10 and 20." },        { id: 1, text: "What is 2 + 2?" },
        { id: 2, text: "Define photosynthesis." },
        { id: 3, text: "Who discovered gravity?" },
        { id: 4, text: "Explain Newton’s second law." },
        { id: 5, text: "What is the capital of France?" },
        { id: 6, text: "Name a prime number between 10 and 20." },        { id: 1, text: "What is 2 + 2?" },
        { id: 2, text: "Define photosynthesis." },
        { id: 3, text: "Who discovered gravity?" },
        { id: 4, text: "Explain Newton’s second law." },
        { id: 5, text: "What is the capital of France?" },
        { id: 6, text: "Name a prime number between 10 and 20." },
        // add more questions as needed
    ];

    const [currentQuestion, setCurrentQuestion] = useState(1);

    const nextQuestion = () => {
        setCurrentQuestion(prev => (prev < questions.length ? prev + 1 : prev));
    };

    const prevQuestion = () => {
        setCurrentQuestion(prev => (prev > 1 ? prev - 1 : prev));
    };

    return (
        <div className="container mt-4 exam-container">
            {/* Timer Row */}
            <div className="row">
                <TimerCard/>
            </div>

            {/* Main Content Row */}
            <div className="row">
                {/* Q&A Column */}
                <div className="col-md-8">
                    <div className="exam-qa card shadow-sm p-4 w-100 mb-3">
                        <h5 className="mb-3 text-uppercase">
                            Question {currentQuestion} of {questions.length}
                        </h5>
                        <p className="lead">{questions[currentQuestion - 1].text}</p>

                        <div className="mt-3">
                            <div className="form-check">
                                <input type="radio" className="form-check-input" name="q" id="a1" />
                                <label htmlFor="a1" className="form-check-label">Option A</label>
                            </div>
                            <div className="form-check">
                                <input type="radio" className="form-check-input" name="q" id="a2" />
                                <label htmlFor="a2" className="form-check-label">Option B</label>
                            </div>
                            <div className="form-check">
                                <input type="radio" className="form-check-input" name="q" id="a3" />
                                <label htmlFor="a3" className="form-check-label">Option C</label>
                            </div>
                            <div className="form-check">
                                <input type="radio" className="form-check-input" name="q" id="a4" />
                                <label htmlFor="a4" className="form-check-label">Option D</label>
                            </div>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="d-flex justify-content-between mt-4">
                            <button
                                className="btn btn-outline-secondary"
                                onClick={prevQuestion}
                                disabled={currentQuestion === 1}
                            >
                                ← Previous
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={nextQuestion}
                                disabled={currentQuestion === questions.length}
                            >
                                Next →
                            </button>
                        </div>
                    </div>
                </div>

                {/* All Questions Column */}
                <div className="col-md-4">
                    <div className="all-questions-container  gap-2">
                        {questions.map((q, index) => (
                            <div
                                key={index}
                                className={`question-card ${currentQuestion === q.id ? "active" : ""}`}
                                onClick={() => setCurrentQuestion(q.id)}
                            >
                                Q{q.id}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
