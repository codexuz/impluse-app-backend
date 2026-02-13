import { useState } from "react";
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  GripVertical,
} from "lucide-react";
import { QuestionType, QUESTION_TYPE_LABELS } from "../types";
import type {
  CreateReadingPartQuestionDto,
  CreateSubQuestionDto,
  CreateQuestionOptionDto,
} from "../types";

interface QuestionBuilderProps {
  questions: CreateReadingPartQuestionDto[];
  onChange: (questions: CreateReadingPartQuestionDto[]) => void;
}

export default function QuestionBuilder({
  questions,
  onChange,
}: QuestionBuilderProps) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const addQuestion = () => {
    onChange([
      ...questions,
      {
        questionNumber: questions.length + 1,
        type: QuestionType.MULTIPLE_CHOICE,
        questionText: "",
        instruction: "",
        points: 1,
        isActive: true,
        questions: [],
        options: [],
      },
    ]);
    setExpandedIdx(questions.length);
  };

  const updateQuestion = (
    idx: number,
    updates: Partial<CreateReadingPartQuestionDto>,
  ) => {
    const updated = [...questions];
    updated[idx] = { ...updated[idx], ...updates };
    onChange(updated);
  };

  const removeQuestion = (idx: number) => {
    onChange(questions.filter((_, i) => i !== idx));
    if (expandedIdx === idx) setExpandedIdx(null);
  };

  const addSubQuestion = (qIdx: number) => {
    const q = questions[qIdx];
    const subs = q.questions || [];
    updateQuestion(qIdx, {
      questions: [
        ...subs,
        {
          questionNumber: subs.length + 1,
          questionText: "",
          points: 1,
          correctAnswer: "",
          order: subs.length + 1,
        },
      ],
    });
  };

  const updateSubQuestion = (
    qIdx: number,
    sIdx: number,
    updates: Partial<CreateSubQuestionDto>,
  ) => {
    const q = questions[qIdx];
    const subs = [...(q.questions || [])];
    subs[sIdx] = { ...subs[sIdx], ...updates };
    updateQuestion(qIdx, { questions: subs });
  };

  const removeSubQuestion = (qIdx: number, sIdx: number) => {
    const q = questions[qIdx];
    updateQuestion(qIdx, {
      questions: (q.questions || []).filter((_, i) => i !== sIdx),
    });
  };

  const addOption = (qIdx: number) => {
    const q = questions[qIdx];
    const opts = q.options || [];
    const nextKey = String.fromCharCode(65 + opts.length); // A, B, C...
    updateQuestion(qIdx, {
      options: [
        ...opts,
        {
          optionKey: nextKey,
          optionText: "",
          isCorrect: false,
          orderIndex: opts.length + 1,
        },
      ],
    });
  };

  const updateOption = (
    qIdx: number,
    oIdx: number,
    updates: Partial<CreateQuestionOptionDto>,
  ) => {
    const q = questions[qIdx];
    const opts = [...(q.options || [])];
    opts[oIdx] = { ...opts[oIdx], ...updates };
    updateQuestion(qIdx, { options: opts });
  };

  const removeOption = (qIdx: number, oIdx: number) => {
    const q = questions[qIdx];
    updateQuestion(qIdx, {
      options: (q.options || []).filter((_, i) => i !== oIdx),
    });
  };

  return (
    <div className="question-builder">
      <div className="question-builder-header">
        <h4>Questions ({questions.length})</h4>
        <button
          type="button"
          className="btn btn-sm btn-primary"
          onClick={addQuestion}
        >
          <Plus size={14} /> Add Question Group
        </button>
      </div>

      {questions.map((q, qIdx) => (
        <div key={qIdx} className="question-card">
          <div
            className="question-card-header"
            onClick={() => setExpandedIdx(expandedIdx === qIdx ? null : qIdx)}
          >
            <div className="question-card-title">
              <GripVertical size={14} className="grip-icon" />
              <span className="question-number">
                Q{q.questionNumber || qIdx + 1}
              </span>
              <span className="question-type-badge">
                {q.type ? QUESTION_TYPE_LABELS[q.type] : "No type"}
              </span>
              <span className="question-preview">
                {q.questionText
                  ? q.questionText.substring(0, 60) +
                    (q.questionText.length > 60 ? "..." : "")
                  : "Empty question"}
              </span>
            </div>
            <div className="question-card-actions">
              <button
                type="button"
                className="icon-btn danger"
                onClick={(e) => {
                  e.stopPropagation();
                  removeQuestion(qIdx);
                }}
              >
                <Trash2 size={14} />
              </button>
              {expandedIdx === qIdx ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </div>
          </div>

          {expandedIdx === qIdx && (
            <div className="question-card-body">
              <div className="form-row">
                <div className="form-group" style={{ flex: "0 0 100px" }}>
                  <label>Q Number</label>
                  <input
                    type="number"
                    value={q.questionNumber || ""}
                    onChange={(e) =>
                      updateQuestion(qIdx, {
                        questionNumber: parseInt(e.target.value) || undefined,
                      })
                    }
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Type</label>
                  <select
                    value={q.type || ""}
                    onChange={(e) =>
                      updateQuestion(qIdx, {
                        type: e.target.value as QuestionType,
                      })
                    }
                  >
                    <option value="">Select type</option>
                    {Object.entries(QUESTION_TYPE_LABELS).map(
                      ([val, label]) => (
                        <option key={val} value={val}>
                          {label}
                        </option>
                      ),
                    )}
                  </select>
                </div>
                <div className="form-group" style={{ flex: "0 0 100px" }}>
                  <label>Points</label>
                  <input
                    type="number"
                    value={q.points || ""}
                    onChange={(e) =>
                      updateQuestion(qIdx, {
                        points: parseInt(e.target.value) || undefined,
                      })
                    }
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Instruction</label>
                <textarea
                  rows={2}
                  value={q.instruction || ""}
                  onChange={(e) =>
                    updateQuestion(qIdx, { instruction: e.target.value })
                  }
                  placeholder="e.g., Choose TRUE, FALSE, or NOT GIVEN..."
                />
              </div>

              <div className="form-group">
                <label>Question Text</label>
                <textarea
                  rows={3}
                  value={q.questionText || ""}
                  onChange={(e) =>
                    updateQuestion(qIdx, { questionText: e.target.value })
                  }
                  placeholder="Enter the question group text..."
                />
              </div>

              <div className="form-group">
                <label>Context</label>
                <textarea
                  rows={2}
                  value={q.context || ""}
                  onChange={(e) =>
                    updateQuestion(qIdx, { context: e.target.value })
                  }
                  placeholder="Additional context or passage reference..."
                />
              </div>

              <div className="form-group">
                <label>Explanation</label>
                <textarea
                  rows={2}
                  value={q.explanation || ""}
                  onChange={(e) =>
                    updateQuestion(qIdx, { explanation: e.target.value })
                  }
                  placeholder="Explanation for the correct answer..."
                />
              </div>

              {/* Sub-Questions */}
              <div className="sub-section">
                <div className="sub-section-header">
                  <h5>Sub-Questions ({(q.questions || []).length})</h5>
                  <button
                    type="button"
                    className="btn btn-xs btn-outline"
                    onClick={() => addSubQuestion(qIdx)}
                  >
                    <Plus size={12} /> Add
                  </button>
                </div>
                {(q.questions || []).map((sq, sIdx) => (
                  <div key={sIdx} className="sub-question-row">
                    <div className="form-row">
                      <div className="form-group" style={{ flex: "0 0 70px" }}>
                        <label>#{sIdx + 1}</label>
                        <input
                          type="number"
                          value={sq.questionNumber || ""}
                          onChange={(e) =>
                            updateSubQuestion(qIdx, sIdx, {
                              questionNumber:
                                parseInt(e.target.value) || undefined,
                            })
                          }
                          placeholder="No."
                        />
                      </div>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label>Question</label>
                        <input
                          value={sq.questionText || ""}
                          onChange={(e) =>
                            updateSubQuestion(qIdx, sIdx, {
                              questionText: e.target.value,
                            })
                          }
                          placeholder="Sub-question text"
                        />
                      </div>
                      <div className="form-group" style={{ flex: "0 0 120px" }}>
                        <label>Correct Answer</label>
                        <input
                          value={sq.correctAnswer || ""}
                          onChange={(e) =>
                            updateSubQuestion(qIdx, sIdx, {
                              correctAnswer: e.target.value,
                            })
                          }
                          placeholder="Answer"
                        />
                      </div>
                      <div className="form-group" style={{ flex: "0 0 70px" }}>
                        <label>Points</label>
                        <input
                          type="number"
                          value={sq.points ?? ""}
                          onChange={(e) =>
                            updateSubQuestion(qIdx, sIdx, {
                              points: parseFloat(e.target.value) || undefined,
                            })
                          }
                        />
                      </div>
                      <button
                        type="button"
                        className="icon-btn danger self-end"
                        onClick={() => removeSubQuestion(qIdx, sIdx)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="form-row">
                      <div className="form-group" style={{ flex: 1 }}>
                        <label>Explanation</label>
                        <input
                          value={sq.explanation || ""}
                          onChange={(e) =>
                            updateSubQuestion(qIdx, sIdx, {
                              explanation: e.target.value,
                            })
                          }
                          placeholder="Explanation"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Options */}
              <div className="sub-section">
                <div className="sub-section-header">
                  <h5>Options ({(q.options || []).length})</h5>
                  <button
                    type="button"
                    className="btn btn-xs btn-outline"
                    onClick={() => addOption(qIdx)}
                  >
                    <Plus size={12} /> Add
                  </button>
                </div>
                {(q.options || []).map((opt, oIdx) => (
                  <div key={oIdx} className="option-row">
                    <div className="form-row">
                      <div className="form-group" style={{ flex: "0 0 60px" }}>
                        <label>Key</label>
                        <input
                          value={opt.optionKey || ""}
                          onChange={(e) =>
                            updateOption(qIdx, oIdx, {
                              optionKey: e.target.value,
                            })
                          }
                          placeholder="A"
                        />
                      </div>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label>Text</label>
                        <input
                          value={opt.optionText || ""}
                          onChange={(e) =>
                            updateOption(qIdx, oIdx, {
                              optionText: e.target.value,
                            })
                          }
                          placeholder="Option text"
                        />
                      </div>
                      <div className="form-group" style={{ flex: "0 0 80px" }}>
                        <label>Correct</label>
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={opt.isCorrect || false}
                            onChange={(e) =>
                              updateOption(qIdx, oIdx, {
                                isCorrect: e.target.checked,
                              })
                            }
                          />
                          <span>Yes</span>
                        </label>
                      </div>
                      <button
                        type="button"
                        className="icon-btn danger self-end"
                        onClick={() => removeOption(qIdx, oIdx)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      {questions.length === 0 && (
        <div className="empty-state small">
          <p>No questions yet. Click "Add Question Group" to start building.</p>
        </div>
      )}
    </div>
  );
}
