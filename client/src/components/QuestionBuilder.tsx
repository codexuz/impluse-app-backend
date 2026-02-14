import { useState } from "react";
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  GripVertical,
  Info,
} from "lucide-react";
import { QuestionType, QUESTION_TYPE_LABELS } from "../types";
import type {
  CreateReadingPartQuestionDto,
  CreateSubQuestionDto,
  CreateQuestionOptionDto,
} from "../types";

// Default instructions per question type (IELTS standard)
const DEFAULT_INSTRUCTIONS: Partial<Record<QuestionType, string>> = {
  [QuestionType.TRUE_FALSE_NOT_GIVEN]:
    "Do the following statements agree with the information given in the passage? Write TRUE if the statement agrees with the information, FALSE if the statement contradicts the information, NOT GIVEN if there is no information on this.",
  [QuestionType.YES_NO_NOT_GIVEN]:
    "Do the following statements agree with the views of the writer? Write YES if the statement agrees with the views of the writer, NO if the statement contradicts the views of the writer, NOT GIVEN if it is impossible to say what the writer thinks about this.",
  [QuestionType.MULTIPLE_CHOICE]: "Choose the correct letter, A, B, C or D.",
  [QuestionType.NOTE_COMPLETION]:
    "Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.",
  [QuestionType.SENTENCE_COMPLETION]:
    "Complete the sentences below. Write NO MORE THAN TWO WORDS from the passage for each answer.",
  [QuestionType.SUMMARY_COMPLETION]:
    "Complete the summary below. Choose NO MORE THAN TWO WORDS from the passage for each answer.",
  [QuestionType.SUMMARY_COMPLETION_DRAG_DROP]:
    "Complete the summary using the list of words below.",
  [QuestionType.SHORT_ANSWER]:
    "Answer the questions below. Write NO MORE THAN THREE WORDS AND/OR A NUMBER for each answer.",
  [QuestionType.TABLE_COMPLETION]:
    "Complete the table below. Write NO MORE THAN ONE WORD AND/OR A NUMBER for each answer.",
  [QuestionType.FLOW_CHART_COMPLETION]:
    "Complete the flow chart below. Write NO MORE THAN TWO WORDS for each answer.",
  [QuestionType.MATCHING_HEADINGS]:
    "Choose the correct heading for each paragraph from the list of headings below.",
  [QuestionType.MATCHING_INFORMATION]:
    "Which paragraph contains the following information? Write the correct letter, A–F.",
  [QuestionType.MATCHING_FEATURES]:
    "Match each statement with the correct feature, A, B or C.",
  [QuestionType.MATCHING_SENTENCE_ENDINGS]:
    "Complete each sentence with the correct ending, A–F, below.",
  [QuestionType.DIAGRAM_LABELLING]:
    "Label the diagram below. Write NO MORE THAN TWO WORDS from the passage for each answer.",
  [QuestionType.PLAN_MAP_LABELLING]:
    "Label the map below. Choose your answers from the box and write the correct letter next to the questions.",
};

// Which types use sub-questions, options, or both
const TYPES_WITH_SUBS_ONLY: QuestionType[] = [
  QuestionType.TRUE_FALSE_NOT_GIVEN,
  QuestionType.YES_NO_NOT_GIVEN,
  QuestionType.NOTE_COMPLETION,
  QuestionType.SENTENCE_COMPLETION,
  QuestionType.SUMMARY_COMPLETION,
  QuestionType.SHORT_ANSWER,
  QuestionType.FLOW_CHART_COMPLETION,
  QuestionType.DIAGRAM_LABELLING,
  QuestionType.MATCHING_INFORMATION,
];

const TYPES_WITH_OPTIONS_ONLY: QuestionType[] = [QuestionType.MULTIPLE_CHOICE];

const TYPES_WITH_BOTH: QuestionType[] = [
  QuestionType.SUMMARY_COMPLETION_DRAG_DROP,
  QuestionType.MATCHING_FEATURES,
  QuestionType.MATCHING_SENTENCE_ENDINGS,
  QuestionType.PLAN_MAP_LABELLING,
];

const TYPES_WITH_HEADING_OPTIONS: QuestionType[] = [
  QuestionType.MATCHING_HEADINGS,
];

const TYPES_WITH_TABLE_DATA: QuestionType[] = [QuestionType.TABLE_COMPLETION];

// Correct answer hints per type
const CORRECT_ANSWER_HINTS: Partial<Record<QuestionType, string>> = {
  [QuestionType.TRUE_FALSE_NOT_GIVEN]: "TRUE, FALSE, or NOT GIVEN",
  [QuestionType.YES_NO_NOT_GIVEN]: "YES, NO, or NOT GIVEN",
  [QuestionType.MATCHING_HEADINGS]: "Heading key (e.g. i, ii, iii)",
  [QuestionType.MATCHING_INFORMATION]: "Paragraph letter (e.g. A, B, C)",
  [QuestionType.MATCHING_FEATURES]: "Option key (e.g. A, B, C)",
  [QuestionType.MATCHING_SENTENCE_ENDINGS]: "Option key (e.g. A, B, C)",
  [QuestionType.SUMMARY_COMPLETION_DRAG_DROP]: "Option key (e.g. A, B, C)",
  [QuestionType.PLAN_MAP_LABELLING]: "Option key (e.g. A, B, C)",
};

function needsSubQuestions(type?: QuestionType): boolean {
  if (!type) return true;
  return (
    TYPES_WITH_SUBS_ONLY.includes(type) ||
    TYPES_WITH_BOTH.includes(type) ||
    TYPES_WITH_HEADING_OPTIONS.includes(type) ||
    TYPES_WITH_TABLE_DATA.includes(type)
  );
}

function needsOptions(type?: QuestionType): boolean {
  if (!type) return true;
  return (
    TYPES_WITH_OPTIONS_ONLY.includes(type) ||
    TYPES_WITH_BOTH.includes(type) ||
    TYPES_WITH_HEADING_OPTIONS.includes(type) // can also have options
  );
}

function needsHeadingOptions(type?: QuestionType): boolean {
  return !!type && TYPES_WITH_HEADING_OPTIONS.includes(type);
}

function needsTableData(type?: QuestionType): boolean {
  return !!type && TYPES_WITH_TABLE_DATA.includes(type);
}

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
    const defaultType = QuestionType.MULTIPLE_CHOICE;
    onChange([
      ...questions,
      {
        questionNumber: questions.length + 1,
        type: defaultType,
        questionText: "",
        instruction: DEFAULT_INSTRUCTIONS[defaultType] || "",
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

  const handleTypeChange = (idx: number, newType: QuestionType) => {
    const updates: Partial<CreateReadingPartQuestionDto> = {
      type: newType,
      instruction:
        DEFAULT_INSTRUCTIONS[newType] || questions[idx].instruction || "",
    };
    // Initialize headingOptions/tableData when switching to relevant type
    if (needsHeadingOptions(newType) && !questions[idx].headingOptions) {
      updates.headingOptions = {};
    }
    if (needsTableData(newType) && !questions[idx].tableData) {
      updates.tableData = {
        headers: ["Column 1", "Column 2"],
        rows: [["", ""]],
      };
    }
    updateQuestion(idx, updates);
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
                      handleTypeChange(qIdx, e.target.value as QuestionType)
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

              {/* Type-specific hint */}
              {q.type && CORRECT_ANSWER_HINTS[q.type] && (
                <div
                  className="info-banner"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    background: "#e8f4fd",
                    padding: "8px 12px",
                    borderRadius: 6,
                    fontSize: 13,
                    color: "#1a5276",
                    marginBottom: 12,
                  }}
                >
                  <Info size={14} />
                  <span>
                    Correct answer format:{" "}
                    <strong>{CORRECT_ANSWER_HINTS[q.type]}</strong>
                  </span>
                </div>
              )}

              {/* Heading Options — for MATCHING_HEADINGS */}
              {needsHeadingOptions(q.type) && (
                <div className="sub-section">
                  <div className="sub-section-header">
                    <h5>Heading Options (JSON)</h5>
                  </div>
                  <div className="form-group">
                    <label>
                      headingOptions — e.g.{" "}
                      {'{ "i": "Heading A", "ii": "Heading B" }'}
                    </label>
                    <textarea
                      rows={4}
                      value={
                        q.headingOptions
                          ? JSON.stringify(q.headingOptions, null, 2)
                          : "{}"
                      }
                      onChange={(e) => {
                        try {
                          const parsed = JSON.parse(e.target.value);
                          updateQuestion(qIdx, { headingOptions: parsed });
                        } catch {
                          /* ignore parse errors while typing */
                        }
                      }}
                      placeholder='{"i": "Heading text", "ii": "Another heading"}'
                      style={{ fontFamily: "monospace", fontSize: 13 }}
                    />
                  </div>
                </div>
              )}

              {/* Table Data — for TABLE_COMPLETION */}
              {needsTableData(q.type) && (
                <div className="sub-section">
                  <div className="sub-section-header">
                    <h5>Table Data (JSON)</h5>
                  </div>
                  <div className="form-group">
                    <label>
                      tableData — {"{ headers: [...], rows: [[...], [...]] }"}
                    </label>
                    <textarea
                      rows={5}
                      value={
                        q.tableData
                          ? JSON.stringify(q.tableData, null, 2)
                          : '{"headers": [], "rows": []}'
                      }
                      onChange={(e) => {
                        try {
                          const parsed = JSON.parse(e.target.value);
                          updateQuestion(qIdx, { tableData: parsed });
                        } catch {
                          /* ignore parse errors while typing */
                        }
                      }}
                      placeholder='{"headers": ["Column 1", "Column 2"], "rows": [["value", ""], ["value", ""]]}'
                      style={{ fontFamily: "monospace", fontSize: 13 }}
                    />
                  </div>
                </div>
              )}

              {/* Sub-Questions */}
              {needsSubQuestions(q.type) && (
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
                        <div
                          className="form-group"
                          style={{ flex: "0 0 70px" }}
                        >
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
                        <div
                          className="form-group"
                          style={{ flex: "0 0 120px" }}
                        >
                          <label>Correct Answer</label>
                          <input
                            value={sq.correctAnswer || ""}
                            onChange={(e) =>
                              updateSubQuestion(qIdx, sIdx, {
                                correctAnswer: e.target.value,
                              })
                            }
                            placeholder={
                              CORRECT_ANSWER_HINTS[q.type!] || "Answer"
                            }
                          />
                        </div>
                        <div
                          className="form-group"
                          style={{ flex: "0 0 70px" }}
                        >
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
              )}

              {/* Options */}
              {needsOptions(q.type) && (
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
                        <div
                          className="form-group"
                          style={{ flex: "0 0 60px" }}
                        >
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
                        <div
                          className="form-group"
                          style={{ flex: "0 0 80px" }}
                        >
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
              )}
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
