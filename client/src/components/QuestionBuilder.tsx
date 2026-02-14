import { useState } from "react";
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  GripVertical,
  Info,
  Copy,
  ArrowUp,
  ArrowDown,
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
  [QuestionType.MULTIPLE_ANSWER]: "Choose the correct answers.",
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
    "Which paragraph contains the following information? Write the correct letter, A\u2013F.",
  [QuestionType.MATCHING_FEATURES]:
    "Match each statement with the correct feature, A, B or C.",
  [QuestionType.MATCHING_SENTENCE_ENDINGS]:
    "Complete each sentence with the correct ending, A\u2013F, below.",
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
  QuestionType.MULTIPLE_ANSWER,
];

const TYPES_WITH_HEADING_OPTIONS: QuestionType[] = [
  QuestionType.MATCHING_HEADINGS,
];

const TYPES_WITH_TABLE_DATA: QuestionType[] = [QuestionType.TABLE_COMPLETION];

// Correct answer presets per type
const CORRECT_ANSWER_PRESETS: Partial<Record<QuestionType, string[]>> = {
  [QuestionType.TRUE_FALSE_NOT_GIVEN]: ["TRUE", "FALSE", "NOT GIVEN"],
  [QuestionType.YES_NO_NOT_GIVEN]: ["YES", "NO", "NOT GIVEN"],
};

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
  [QuestionType.MULTIPLE_ANSWER]: "Option key (e.g. A, B, C)",
  [QuestionType.NOTE_COMPLETION]: "Text from the passage",
  [QuestionType.SENTENCE_COMPLETION]: "Text from the passage",
  [QuestionType.SUMMARY_COMPLETION]: "Text from the passage",
  [QuestionType.SHORT_ANSWER]: "Short text answer",
  [QuestionType.TABLE_COMPLETION]: "Text from the passage",
  [QuestionType.FLOW_CHART_COMPLETION]: "Text from the passage",
  [QuestionType.DIAGRAM_LABELLING]: "Text from the passage",
};

// Types where correctAnswer is selected from options
const TYPES_WITH_OPTION_BASED_ANSWER: QuestionType[] = [
  QuestionType.MATCHING_FEATURES,
  QuestionType.MATCHING_SENTENCE_ENDINGS,
  QuestionType.SUMMARY_COMPLETION_DRAG_DROP,
  QuestionType.PLAN_MAP_LABELLING,
  QuestionType.MULTIPLE_ANSWER,
];

// Type category labels for visual grouping in the type selector
const TYPE_CATEGORIES: { label: string; types: QuestionType[] }[] = [
  {
    label: "True/False & Yes/No",
    types: [QuestionType.TRUE_FALSE_NOT_GIVEN, QuestionType.YES_NO_NOT_GIVEN],
  },
  {
    label: "Multiple Choice",
    types: [QuestionType.MULTIPLE_CHOICE, QuestionType.MULTIPLE_ANSWER],
  },
  {
    label: "Completion (Text Input)",
    types: [
      QuestionType.NOTE_COMPLETION,
      QuestionType.SENTENCE_COMPLETION,
      QuestionType.SUMMARY_COMPLETION,
      QuestionType.SHORT_ANSWER,
      QuestionType.TABLE_COMPLETION,
      QuestionType.FLOW_CHART_COMPLETION,
    ],
  },
  {
    label: "Matching",
    types: [
      QuestionType.MATCHING_HEADINGS,
      QuestionType.MATCHING_INFORMATION,
      QuestionType.MATCHING_FEATURES,
      QuestionType.MATCHING_SENTENCE_ENDINGS,
    ],
  },
  {
    label: "Diagram & Map",
    types: [QuestionType.DIAGRAM_LABELLING, QuestionType.PLAN_MAP_LABELLING],
  },
  {
    label: "Drag & Drop",
    types: [QuestionType.SUMMARY_COMPLETION_DRAG_DROP],
  },
];

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
    TYPES_WITH_OPTIONS_ONLY.includes(type) || TYPES_WITH_BOTH.includes(type)
  );
}

function needsHeadingOptions(type?: QuestionType): boolean {
  return !!type && TYPES_WITH_HEADING_OPTIONS.includes(type);
}

function needsTableData(type?: QuestionType): boolean {
  return !!type && TYPES_WITH_TABLE_DATA.includes(type);
}

function hasPresetAnswers(type?: QuestionType): boolean {
  return !!type && !!CORRECT_ANSWER_PRESETS[type];
}

function hasOptionBasedAnswer(type?: QuestionType): boolean {
  return !!type && TYPES_WITH_OPTION_BASED_ANSWER.includes(type);
}

function hasHeadingBasedAnswer(type?: QuestionType): boolean {
  return type === QuestionType.MATCHING_HEADINGS;
}

// ==================== Heading Options Editor ====================

function HeadingOptionsEditor({
  headingOptions,
  onChange,
}: {
  headingOptions: Record<string, string>;
  onChange: (opts: Record<string, string>) => void;
}) {
  const entries = Object.entries(headingOptions || {});

  const addHeading = () => {
    const romanNumerals = [
      "i",
      "ii",
      "iii",
      "iv",
      "v",
      "vi",
      "vii",
      "viii",
      "ix",
      "x",
      "xi",
      "xii",
    ];
    const usedKeys = Object.keys(headingOptions || {});
    const nextKey =
      romanNumerals.find((r) => !usedKeys.includes(r)) ||
      `h${usedKeys.length + 1}`;
    onChange({ ...headingOptions, [nextKey]: "" });
  };

  const updateKey = (oldKey: string, newKey: string) => {
    if (newKey === oldKey || !newKey.trim()) return;
    const newOpts: Record<string, string> = {};
    for (const [k, v] of Object.entries(headingOptions)) {
      if (k === oldKey) {
        newOpts[newKey.trim()] = v;
      } else {
        newOpts[k] = v;
      }
    }
    onChange(newOpts);
  };

  const updateValue = (key: string, value: string) => {
    onChange({ ...headingOptions, [key]: value });
  };

  const removeHeading = (key: string) => {
    const newOpts = { ...headingOptions };
    delete newOpts[key];
    onChange(newOpts);
  };

  return (
    <div className="sub-section heading-options-editor">
      <div className="sub-section-header">
        <h5>Heading Options ({entries.length})</h5>
        <button
          type="button"
          className="btn btn-xs btn-outline"
          onClick={addHeading}
        >
          <Plus size={12} /> Add Heading
        </button>
      </div>
      <p className="hint-text">
        Add heading options that paragraphs will be matched to. Use Roman
        numerals (i, ii, iii...) as keys. Include extra headings as distractors.
      </p>
      {entries.map(([key, value]) => (
        <div key={key} className="heading-option-row">
          <div className="form-row">
            <div className="form-group" style={{ flex: "0 0 70px" }}>
              <label>Key</label>
              <input
                value={key}
                onChange={(e) => updateKey(key, e.target.value)}
                placeholder="i"
                className="heading-key-input"
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Heading Text</label>
              <input
                value={value}
                onChange={(e) => updateValue(key, e.target.value)}
                placeholder="Enter heading text..."
              />
            </div>
            <button
              type="button"
              className="icon-btn danger self-end"
              onClick={() => removeHeading(key)}
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}
      {entries.length === 0 && (
        <p className="muted" style={{ textAlign: "center", padding: "12px" }}>
          No headings added yet. Click "Add Heading" to start.
        </p>
      )}
    </div>
  );
}

// ==================== Table Data Editor ====================

interface TableData {
  headers: string[];
  rows: string[][];
}

function TableDataEditor({
  tableData,
  onChange,
}: {
  tableData: TableData;
  onChange: (data: TableData) => void;
}) {
  const headers = tableData?.headers || [];
  const rows = tableData?.rows || [];

  const addColumn = () => {
    onChange({
      headers: [...headers, `Column ${headers.length + 1}`],
      rows: rows.map((row) => [...row, ""]),
    });
  };

  const removeColumn = (colIdx: number) => {
    if (headers.length <= 1) return;
    onChange({
      headers: headers.filter((_, i) => i !== colIdx),
      rows: rows.map((row) => row.filter((_, i) => i !== colIdx)),
    });
  };

  const addRow = () => {
    onChange({
      headers,
      rows: [...rows, headers.map(() => "")],
    });
  };

  const removeRow = (rowIdx: number) => {
    onChange({
      headers,
      rows: rows.filter((_, i) => i !== rowIdx),
    });
  };

  const updateHeader = (colIdx: number, value: string) => {
    const newHeaders = [...headers];
    newHeaders[colIdx] = value;
    onChange({ headers: newHeaders, rows });
  };

  const updateCell = (rowIdx: number, colIdx: number, value: string) => {
    const newRows = rows.map((row) => [...row]);
    newRows[rowIdx][colIdx] = value;
    onChange({ headers, rows: newRows });
  };

  const insertBlank = (rowIdx: number, colIdx: number) => {
    updateCell(rowIdx, colIdx, "____");
  };

  return (
    <div className="sub-section table-data-editor">
      <div className="sub-section-header">
        <h5>Table Data</h5>
        <div style={{ display: "flex", gap: 4 }}>
          <button
            type="button"
            className="btn btn-xs btn-outline"
            onClick={addColumn}
          >
            <Plus size={12} /> Column
          </button>
          <button
            type="button"
            className="btn btn-xs btn-outline"
            onClick={addRow}
          >
            <Plus size={12} /> Row
          </button>
        </div>
      </div>
      <p className="hint-text">
        Use <code>____</code> in cells to mark blanks that students fill in.
        Each blank corresponds to a sub-question below. Click a cell's "blank"
        button to insert.
      </p>
      {headers.length > 0 && (
        <div className="table-editor-wrapper">
          <table className="table-editor">
            <thead>
              <tr>
                {headers.map((h, colIdx) => (
                  <th key={colIdx}>
                    <div className="table-header-cell">
                      <input
                        value={h}
                        onChange={(e) => updateHeader(colIdx, e.target.value)}
                        placeholder="Header"
                        className="table-cell-input header-input"
                      />
                      {headers.length > 1 && (
                        <button
                          type="button"
                          className="icon-btn-mini danger"
                          onClick={() => removeColumn(colIdx)}
                          title="Remove column"
                        >
                          <Trash2 size={11} />
                        </button>
                      )}
                    </div>
                  </th>
                ))}
                <th style={{ width: 32 }}></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIdx) => (
                <tr key={rowIdx}>
                  {row.map((cell, colIdx) => (
                    <td key={colIdx}>
                      <div className="table-cell-wrapper">
                        <input
                          value={cell}
                          onChange={(e) =>
                            updateCell(rowIdx, colIdx, e.target.value)
                          }
                          placeholder="value"
                          className={`table-cell-input ${cell === "____" ? "blank-cell" : ""}`}
                        />
                        {cell !== "____" && (
                          <button
                            type="button"
                            className="blank-btn"
                            onClick={() => insertBlank(rowIdx, colIdx)}
                            title="Set as blank"
                          >
                            ____
                          </button>
                        )}
                      </div>
                    </td>
                  ))}
                  <td>
                    <button
                      type="button"
                      className="icon-btn-mini danger"
                      onClick={() => removeRow(rowIdx)}
                      title="Remove row"
                    >
                      <Trash2 size={11} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ==================== Correct Answer Input ====================

function CorrectAnswerInput({
  type,
  value,
  onChange,
  options,
  headingOptions,
}: {
  type?: QuestionType;
  value: string;
  onChange: (val: string) => void;
  options?: CreateQuestionOptionDto[];
  headingOptions?: Record<string, string>;
}) {
  // Preset dropdown (TRUE/FALSE/NOT GIVEN, YES/NO/NOT GIVEN)
  if (type && hasPresetAnswers(type)) {
    const presets = CORRECT_ANSWER_PRESETS[type] || [];
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="correct-answer-select"
      >
        <option value="">Select...</option>
        {presets.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
    );
  }

  // Heading-based dropdown (MATCHING_HEADINGS)
  if (type && hasHeadingBasedAnswer(type) && headingOptions) {
    const entries = Object.entries(headingOptions);
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="correct-answer-select"
      >
        <option value="">Select heading...</option>
        {entries.map(([key, text]) => (
          <option key={key} value={key}>
            {key} &mdash; {text.substring(0, 40)}
            {text.length > 40 ? "..." : ""}
          </option>
        ))}
      </select>
    );
  }

  // Option-based dropdown (matching types, drag-drop, multiple answer)
  if (type && hasOptionBasedAnswer(type) && options && options.length > 0) {
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="correct-answer-select"
      >
        <option value="">Select option...</option>
        {options.map((opt) => (
          <option key={opt.optionKey} value={opt.optionKey}>
            {opt.optionKey} &mdash; {(opt.optionText || "").substring(0, 40)}
            {(opt.optionText || "").length > 40 ? "..." : ""}
          </option>
        ))}
      </select>
    );
  }

  // Matching Information paragraph letter
  if (type === QuestionType.MATCHING_INFORMATION) {
    return (
      <input
        value={value}
        onChange={(e) => onChange(e.target.value.toUpperCase())}
        placeholder="A, B, C..."
        maxLength={2}
        style={{ textAlign: "center", fontWeight: 700 }}
      />
    );
  }

  // Default: free text input
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={CORRECT_ANSWER_HINTS[type!] || "Answer"}
    />
  );
}

// ==================== Question Type Info Banner ====================

function TypeInfoBanner({ type }: { type: QuestionType }) {
  const info: Record<string, { uses: string; answer: string; ui: string }> = {
    [QuestionType.TRUE_FALSE_NOT_GIVEN]: {
      uses: "Sub-questions only",
      answer: "TRUE / FALSE / NOT GIVEN",
      ui: "3 radio buttons per statement",
    },
    [QuestionType.YES_NO_NOT_GIVEN]: {
      uses: "Sub-questions only",
      answer: "YES / NO / NOT GIVEN",
      ui: "3 radio buttons per statement",
    },
    [QuestionType.MULTIPLE_CHOICE]: {
      uses: "Options only (A/B/C/D)",
      answer: "One option marked correct",
      ui: "Radio buttons",
    },
    [QuestionType.MULTIPLE_ANSWER]: {
      uses: "Sub-questions + Options",
      answer: "Multiple options marked correct",
      ui: "Checkboxes",
    },
    [QuestionType.NOTE_COMPLETION]: {
      uses: "Sub-questions only",
      answer: "Text from passage",
      ui: "Text input fields in notes",
    },
    [QuestionType.SENTENCE_COMPLETION]: {
      uses: "Sub-questions only",
      answer: "Text from passage",
      ui: "Text input per sentence",
    },
    [QuestionType.SUMMARY_COMPLETION]: {
      uses: "Sub-questions only",
      answer: "Text from passage",
      ui: "Text input blanks in paragraph",
    },
    [QuestionType.SUMMARY_COMPLETION_DRAG_DROP]: {
      uses: "Sub-questions + Options (word bank)",
      answer: "Option key (A, B, C...)",
      ui: "Drag words from bank into blanks",
    },
    [QuestionType.SHORT_ANSWER]: {
      uses: "Sub-questions only",
      answer: "Free text",
      ui: "Text input per question",
    },
    [QuestionType.TABLE_COMPLETION]: {
      uses: "Sub-questions + tableData JSON",
      answer: "Text from passage",
      ui: "Table with blank cells as inputs",
    },
    [QuestionType.FLOW_CHART_COMPLETION]: {
      uses: "Sub-questions only",
      answer: "Text from passage",
      ui: "Flowchart steps with blanks",
    },
    [QuestionType.MATCHING_HEADINGS]: {
      uses: "Sub-questions + headingOptions",
      answer: "Heading key (i, ii, iii...)",
      ui: "Dropdown per paragraph",
    },
    [QuestionType.MATCHING_INFORMATION]: {
      uses: "Sub-questions only",
      answer: "Paragraph letter (A, B, C...)",
      ui: "Dropdown per statement",
    },
    [QuestionType.MATCHING_FEATURES]: {
      uses: "Sub-questions + Options (features)",
      answer: "Option key (A, B, C...)",
      ui: "Dropdown per statement",
    },
    [QuestionType.MATCHING_SENTENCE_ENDINGS]: {
      uses: "Sub-questions + Options (endings)",
      answer: "Option key (A, B, C...)",
      ui: "Select ending per beginning",
    },
    [QuestionType.DIAGRAM_LABELLING]: {
      uses: "Sub-questions only",
      answer: "Text from passage",
      ui: "Text input per label",
    },
    [QuestionType.PLAN_MAP_LABELLING]: {
      uses: "Sub-questions + Options (locations)",
      answer: "Option key (A, B, C...)",
      ui: "Dropdown per label on map",
    },
  };

  const typeInfo = info[type];
  if (!typeInfo) return null;

  return (
    <div className="type-info-banner">
      <Info size={14} />
      <div className="type-info-content">
        <span>
          <strong>Data:</strong> {typeInfo.uses}
        </span>
        <span className="type-info-sep">&bull;</span>
        <span>
          <strong>Answer:</strong> {typeInfo.answer}
        </span>
        <span className="type-info-sep">&bull;</span>
        <span>
          <strong>UI:</strong> {typeInfo.ui}
        </span>
      </div>
    </div>
  );
}

// ==================== Main QuestionBuilder ====================

interface QuestionBuilderProps {
  questions: CreateReadingPartQuestionDto[];
  onChange: (questions: CreateReadingPartQuestionDto[]) => void;
}

export default function QuestionBuilder({
  questions,
  onChange,
}: QuestionBuilderProps) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [showAdvanced, setShowAdvanced] = useState<Record<number, boolean>>({});

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
        options: [
          { optionKey: "A", optionText: "", isCorrect: false, orderIndex: 0 },
          { optionKey: "B", optionText: "", isCorrect: false, orderIndex: 1 },
          { optionKey: "C", optionText: "", isCorrect: false, orderIndex: 2 },
          { optionKey: "D", optionText: "", isCorrect: false, orderIndex: 3 },
        ],
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

    // Initialize headingOptions when switching to MATCHING_HEADINGS
    if (needsHeadingOptions(newType)) {
      updates.headingOptions = questions[idx].headingOptions || {};
    }

    // Initialize tableData when switching to TABLE_COMPLETION
    if (needsTableData(newType)) {
      updates.tableData = questions[idx].tableData || {
        headers: ["Column 1", "Column 2"],
        rows: [["", "____"]],
      };
    }

    // Initialize default options for MULTIPLE_CHOICE
    if (
      newType === QuestionType.MULTIPLE_CHOICE &&
      !(questions[idx].options && questions[idx].options!.length > 0)
    ) {
      updates.options = [
        { optionKey: "A", optionText: "", isCorrect: false, orderIndex: 0 },
        { optionKey: "B", optionText: "", isCorrect: false, orderIndex: 1 },
        { optionKey: "C", optionText: "", isCorrect: false, orderIndex: 2 },
        { optionKey: "D", optionText: "", isCorrect: false, orderIndex: 3 },
      ];
    }

    // Initialize empty sub-questions array if switching to a type that needs them
    if (
      needsSubQuestions(newType) &&
      !TYPES_WITH_OPTIONS_ONLY.includes(newType) &&
      !(questions[idx].questions && questions[idx].questions!.length > 0)
    ) {
      updates.questions = [];
    }

    updateQuestion(idx, updates);
  };

  const removeQuestion = (idx: number) => {
    onChange(questions.filter((_, i) => i !== idx));
    if (expandedIdx === idx) setExpandedIdx(null);
  };

  const duplicateQuestion = (idx: number) => {
    const q = questions[idx];
    const copy: CreateReadingPartQuestionDto = {
      ...q,
      questionNumber: (q.questionNumber || 0) + 1,
      questions: q.questions?.map((sq) => ({ ...sq })),
      options: q.options?.map((o) => ({ ...o })),
    };
    const updated = [...questions];
    updated.splice(idx + 1, 0, copy);
    onChange(updated);
    setExpandedIdx(idx + 1);
  };

  const moveQuestion = (idx: number, direction: "up" | "down") => {
    const newIdx = direction === "up" ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= questions.length) return;
    const updated = [...questions];
    [updated[idx], updated[newIdx]] = [updated[newIdx], updated[idx]];
    onChange(updated);
    if (expandedIdx === idx) setExpandedIdx(newIdx);
  };

  // Sub-question helpers
  const addSubQuestion = (qIdx: number) => {
    const q = questions[qIdx];
    const subs = q.questions || [];
    const lastNumber =
      subs.length > 0
        ? subs[subs.length - 1].questionNumber || subs.length
        : q.questionNumber || 0;
    updateQuestion(qIdx, {
      questions: [
        ...subs,
        {
          questionNumber: lastNumber + 1,
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

  const moveSubQuestion = (
    qIdx: number,
    sIdx: number,
    direction: "up" | "down",
  ) => {
    const q = questions[qIdx];
    const subs = [...(q.questions || [])];
    const newIdx = direction === "up" ? sIdx - 1 : sIdx + 1;
    if (newIdx < 0 || newIdx >= subs.length) return;
    [subs[sIdx], subs[newIdx]] = [subs[newIdx], subs[sIdx]];
    subs.forEach((s, i) => {
      s.order = i + 1;
    });
    updateQuestion(qIdx, { questions: subs });
  };

  // Option helpers
  const addOption = (qIdx: number) => {
    const q = questions[qIdx];
    const opts = q.options || [];
    const nextKey = String.fromCharCode(65 + opts.length);
    updateQuestion(qIdx, {
      options: [
        ...opts,
        {
          optionKey: nextKey,
          optionText: "",
          isCorrect: false,
          orderIndex: opts.length,
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

    // For MULTIPLE_CHOICE, enforce single correct (radio behavior)
    if (q.type === QuestionType.MULTIPLE_CHOICE && updates.isCorrect === true) {
      opts.forEach((o, i) => {
        opts[i] = { ...o, isCorrect: i === oIdx };
      });
      opts[oIdx] = { ...opts[oIdx], ...updates };
    } else {
      opts[oIdx] = { ...opts[oIdx], ...updates };
    }

    updateQuestion(qIdx, { options: opts });
  };

  const removeOption = (qIdx: number, oIdx: number) => {
    const q = questions[qIdx];
    const opts = (q.options || []).filter((_, i) => i !== oIdx);
    opts.forEach((o, i) => {
      o.optionKey = String.fromCharCode(65 + i);
      o.orderIndex = i;
    });
    updateQuestion(qIdx, { options: opts });
  };

  const toggleAdvanced = (qIdx: number) => {
    setShowAdvanced((prev) => ({ ...prev, [qIdx]: !prev[qIdx] }));
  };

  // Count total sub-questions across all question groups
  const totalSubCount = questions.reduce(
    (sum, q) => sum + (q.questions?.length || 0),
    0,
  );

  return (
    <div className="question-builder">
      <div className="question-builder-header">
        <h4>
          Questions ({questions.length} group
          {questions.length !== 1 ? "s" : ""}
          {totalSubCount > 0 &&
            `, ${totalSubCount} sub-question${totalSubCount !== 1 ? "s" : ""}`}
          )
        </h4>
        <button
          type="button"
          className="btn btn-sm btn-primary"
          onClick={addQuestion}
        >
          <Plus size={14} /> Add Question Group
        </button>
      </div>

      {questions.map((q, qIdx) => {
        const subCount = q.questions?.length || 0;
        const optCount = q.options?.length || 0;
        const isExpanded = expandedIdx === qIdx;

        return (
          <div
            key={qIdx}
            className={`question-card ${isExpanded ? "expanded" : ""}`}
          >
            <div
              className="question-card-header"
              onClick={() => setExpandedIdx(isExpanded ? null : qIdx)}
            >
              <div className="question-card-title">
                <GripVertical size={14} className="grip-icon" />
                <span className="question-number">
                  Q{q.questionNumber || qIdx + 1}
                </span>
                <span className="question-type-badge">
                  {q.type ? QUESTION_TYPE_LABELS[q.type] : "No type"}
                </span>
                {subCount > 0 && (
                  <span className="question-count-badge">{subCount} sub-Q</span>
                )}
                {optCount > 0 && (
                  <span className="question-count-badge opt">
                    {optCount} opt
                  </span>
                )}
                <span className="question-preview">
                  {q.questionText
                    ? q.questionText.replace(/<[^>]*>/g, "").substring(0, 50) +
                      (q.questionText.length > 50 ? "..." : "")
                    : q.instruction
                      ? q.instruction.substring(0, 50) + "..."
                      : "Empty question"}
                </span>
              </div>
              <div className="question-card-actions">
                <button
                  type="button"
                  className="icon-btn"
                  title="Move up"
                  onClick={(e) => {
                    e.stopPropagation();
                    moveQuestion(qIdx, "up");
                  }}
                  disabled={qIdx === 0}
                >
                  <ArrowUp size={13} />
                </button>
                <button
                  type="button"
                  className="icon-btn"
                  title="Move down"
                  onClick={(e) => {
                    e.stopPropagation();
                    moveQuestion(qIdx, "down");
                  }}
                  disabled={qIdx === questions.length - 1}
                >
                  <ArrowDown size={13} />
                </button>
                <button
                  type="button"
                  className="icon-btn"
                  title="Duplicate"
                  onClick={(e) => {
                    e.stopPropagation();
                    duplicateQuestion(qIdx);
                  }}
                >
                  <Copy size={13} />
                </button>
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
                {isExpanded ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </div>
            </div>

            {isExpanded && (
              <div className="question-card-body">
                {/* Row 1: Number, Type, Points */}
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
                      {TYPE_CATEGORIES.map((cat) => (
                        <optgroup key={cat.label} label={cat.label}>
                          {cat.types.map((t) => (
                            <option key={t} value={t}>
                              {QUESTION_TYPE_LABELS[t]}
                            </option>
                          ))}
                        </optgroup>
                      ))}
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

                {/* Type info banner */}
                {q.type && <TypeInfoBanner type={q.type} />}

                {/* Instruction */}
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

                {/* Question Text */}
                <div className="form-group">
                  <label>
                    Question Text{" "}
                    <span className="label-hint">(supports HTML)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={q.questionText || ""}
                    onChange={(e) =>
                      updateQuestion(qIdx, { questionText: e.target.value })
                    }
                    placeholder={
                      q.type === QuestionType.NOTE_COMPLETION
                        ? "Enter formatted notes with ____ for blanks (HTML supported)..."
                        : q.type === QuestionType.SUMMARY_COMPLETION ||
                            q.type === QuestionType.SUMMARY_COMPLETION_DRAG_DROP
                          ? "Enter summary paragraph with ____ for blanks (HTML supported)..."
                          : q.type === QuestionType.FLOW_CHART_COMPLETION
                            ? "Enter flowchart steps with ____ for blanks (HTML supported)..."
                            : q.type === QuestionType.DIAGRAM_LABELLING ||
                                q.type === QuestionType.PLAN_MAP_LABELLING
                              ? 'Enter <img src="..."> tag or diagram description (HTML supported)...'
                              : "Enter the question group text or leave empty..."
                    }
                  />
                </div>

                {/* Advanced fields toggle */}
                <button
                  type="button"
                  className="btn btn-xs btn-ghost toggle-advanced"
                  onClick={() => toggleAdvanced(qIdx)}
                >
                  {showAdvanced[qIdx] ? "\u25BC" : "\u25B6"} Advanced fields
                  (context, explanation, passage ref)
                </button>

                {showAdvanced[qIdx] && (
                  <div className="advanced-fields-panel">
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
                        placeholder="Explanation for the question group..."
                      />
                    </div>
                    <div className="form-group">
                      <label>From Passage</label>
                      <input
                        value={q.fromPassage || ""}
                        onChange={(e) =>
                          updateQuestion(qIdx, { fromPassage: e.target.value })
                        }
                        placeholder="e.g., Paragraph 3"
                      />
                    </div>
                  </div>
                )}

                {/* Heading Options \u2014 for MATCHING_HEADINGS */}
                {needsHeadingOptions(q.type) && (
                  <HeadingOptionsEditor
                    headingOptions={
                      (q.headingOptions as Record<string, string>) || {}
                    }
                    onChange={(opts) =>
                      updateQuestion(qIdx, { headingOptions: opts })
                    }
                  />
                )}

                {/* Table Data \u2014 for TABLE_COMPLETION */}
                {needsTableData(q.type) && (
                  <TableDataEditor
                    tableData={
                      (q.tableData as TableData) || {
                        headers: [],
                        rows: [],
                      }
                    }
                    onChange={(data) =>
                      updateQuestion(qIdx, { tableData: data })
                    }
                  />
                )}

                {/* Options \u2014 shown BEFORE sub-questions for types that use both */}
                {needsOptions(q.type) && (
                  <div className="sub-section">
                    <div className="sub-section-header">
                      <h5>
                        Options ({optCount})
                        {q.type === QuestionType.MULTIPLE_CHOICE && (
                          <span className="label-hint">
                            {" "}
                            \u2014 select ONE correct
                          </span>
                        )}
                        {q.type === QuestionType.MULTIPLE_ANSWER && (
                          <span className="label-hint">
                            {" "}
                            \u2014 select MULTIPLE correct
                          </span>
                        )}
                        {TYPES_WITH_BOTH.includes(q.type!) &&
                          q.type !== QuestionType.MULTIPLE_ANSWER && (
                            <span className="label-hint">
                              {" "}
                              \u2014 answer choices for sub-questions
                            </span>
                          )}
                      </h5>
                      <button
                        type="button"
                        className="btn btn-xs btn-outline"
                        onClick={() => addOption(qIdx)}
                      >
                        <Plus size={12} /> Add
                      </button>
                    </div>

                    {(q.options || []).map((opt, oIdx) => (
                      <div
                        key={oIdx}
                        className={`option-row ${opt.isCorrect ? "option-correct" : ""}`}
                      >
                        <div className="form-row">
                          <div
                            className="form-group"
                            style={{ flex: "0 0 55px" }}
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
                              style={{
                                textAlign: "center",
                                fontWeight: 700,
                              }}
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
                              placeholder={
                                q.type ===
                                QuestionType.SUMMARY_COMPLETION_DRAG_DROP
                                  ? "Word/phrase for the word bank..."
                                  : q.type ===
                                      QuestionType.MATCHING_SENTENCE_ENDINGS
                                    ? "Sentence ending..."
                                    : q.type === QuestionType.MATCHING_FEATURES
                                      ? "Feature/person/category name..."
                                      : q.type ===
                                          QuestionType.PLAN_MAP_LABELLING
                                        ? "Location/building name..."
                                        : "Option text"
                              }
                            />
                          </div>
                          {/* Show correct toggle for MULTIPLE_CHOICE and MULTIPLE_ANSWER */}
                          {(q.type === QuestionType.MULTIPLE_CHOICE ||
                            q.type === QuestionType.MULTIPLE_ANSWER) && (
                            <div
                              className="form-group"
                              style={{ flex: "0 0 75px" }}
                            >
                              <label>
                                {q.type === QuestionType.MULTIPLE_CHOICE
                                  ? "Correct"
                                  : "\u2713"}
                              </label>
                              <label className="checkbox-label">
                                <input
                                  type={
                                    q.type === QuestionType.MULTIPLE_CHOICE
                                      ? "radio"
                                      : "checkbox"
                                  }
                                  name={`correct-option-${qIdx}`}
                                  checked={opt.isCorrect || false}
                                  onChange={(e) =>
                                    updateOption(qIdx, oIdx, {
                                      isCorrect: e.target.checked,
                                    })
                                  }
                                />
                                <span>{opt.isCorrect ? "Yes" : "No"}</span>
                              </label>
                            </div>
                          )}
                          <button
                            type="button"
                            className="icon-btn danger self-end"
                            onClick={() => removeOption(qIdx, oIdx)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        {/* Expandable option explanation */}
                        <details className="option-details">
                          <summary>Explanation &amp; passage ref</summary>
                          <div className="form-row" style={{ marginTop: 6 }}>
                            <div className="form-group" style={{ flex: 1 }}>
                              <label>Explanation</label>
                              <input
                                value={opt.explanation || ""}
                                onChange={(e) =>
                                  updateOption(qIdx, oIdx, {
                                    explanation: e.target.value,
                                  })
                                }
                                placeholder="Why this option is correct/incorrect..."
                              />
                            </div>
                            <div
                              className="form-group"
                              style={{ flex: "0 0 180px" }}
                            >
                              <label>From Passage</label>
                              <input
                                value={opt.fromPassage || ""}
                                onChange={(e) =>
                                  updateOption(qIdx, oIdx, {
                                    fromPassage: e.target.value,
                                  })
                                }
                                placeholder="e.g., Paragraph 5"
                              />
                            </div>
                          </div>
                        </details>
                      </div>
                    ))}

                    {optCount === 0 && (
                      <p
                        className="muted"
                        style={{ textAlign: "center", padding: "12px" }}
                      >
                        No options yet. Click "Add" to create one.
                      </p>
                    )}

                    {/* Validation hints */}
                    {q.type === QuestionType.MULTIPLE_CHOICE &&
                      optCount > 0 &&
                      !(q.options || []).some((o) => o.isCorrect) && (
                        <div className="validation-warning">
                          \u26A0 No correct answer selected. Mark one option as
                          correct.
                        </div>
                      )}
                    {q.type === QuestionType.MULTIPLE_ANSWER &&
                      optCount > 0 && (
                        <div className="validation-info">
                          {(q.options || []).filter((o) => o.isCorrect).length}{" "}
                          of {optCount} options marked correct
                        </div>
                      )}
                  </div>
                )}

                {/* Sub-Questions */}
                {needsSubQuestions(q.type) && (
                  <div className="sub-section">
                    <div className="sub-section-header">
                      <h5>Sub-Questions ({subCount})</h5>
                      <button
                        type="button"
                        className="btn btn-xs btn-outline"
                        onClick={() => addSubQuestion(qIdx)}
                      >
                        <Plus size={12} /> Add
                      </button>
                    </div>

                    {q.type &&
                      (hasPresetAnswers(q.type) ||
                        hasOptionBasedAnswer(q.type) ||
                        hasHeadingBasedAnswer(q.type)) && (
                        <p className="hint-text">
                          Correct answer:{" "}
                          <strong>
                            {CORRECT_ANSWER_HINTS[q.type] || "Text"}
                          </strong>
                        </p>
                      )}

                    {(q.questions || []).map((sq, sIdx) => (
                      <div key={sIdx} className="sub-question-row">
                        <div className="form-row">
                          <div
                            className="form-group"
                            style={{ flex: "0 0 65px" }}
                          >
                            <label>Q#</label>
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
                            <label>Question Text</label>
                            <input
                              value={sq.questionText || ""}
                              onChange={(e) =>
                                updateSubQuestion(qIdx, sIdx, {
                                  questionText: e.target.value,
                                })
                              }
                              placeholder={
                                q.type === QuestionType.TRUE_FALSE_NOT_GIVEN ||
                                q.type === QuestionType.YES_NO_NOT_GIVEN
                                  ? "Statement to evaluate..."
                                  : q.type === QuestionType.MATCHING_HEADINGS
                                    ? "e.g., Paragraph A"
                                    : q.type ===
                                        QuestionType.MATCHING_INFORMATION
                                      ? "Description of information to find..."
                                      : q.type ===
                                          QuestionType.MATCHING_FEATURES
                                        ? "Statement to match..."
                                        : q.type ===
                                            QuestionType.MATCHING_SENTENCE_ENDINGS
                                          ? "Sentence beginning..."
                                          : q.type ===
                                              QuestionType.MULTIPLE_ANSWER
                                            ? "Answer slot (use ---- for placeholder)"
                                            : "Sub-question text or blank context..."
                              }
                            />
                          </div>
                          <div
                            className="form-group"
                            style={{
                              flex:
                                hasPresetAnswers(q.type) ||
                                hasOptionBasedAnswer(q.type) ||
                                hasHeadingBasedAnswer(q.type)
                                  ? "0 0 180px"
                                  : "0 0 140px",
                            }}
                          >
                            <label>Correct Answer</label>
                            <CorrectAnswerInput
                              type={q.type}
                              value={sq.correctAnswer || ""}
                              onChange={(val) =>
                                updateSubQuestion(qIdx, sIdx, {
                                  correctAnswer: val,
                                })
                              }
                              options={q.options}
                              headingOptions={
                                q.headingOptions as Record<string, string>
                              }
                            />
                          </div>
                          <div
                            className="form-group"
                            style={{ flex: "0 0 55px" }}
                          >
                            <label>Pts</label>
                            <input
                              type="number"
                              value={sq.points ?? ""}
                              onChange={(e) =>
                                updateSubQuestion(qIdx, sIdx, {
                                  points:
                                    parseFloat(e.target.value) || undefined,
                                })
                              }
                            />
                          </div>
                          <div className="sub-question-actions">
                            <button
                              type="button"
                              className="icon-btn"
                              title="Move up"
                              onClick={() => moveSubQuestion(qIdx, sIdx, "up")}
                              disabled={sIdx === 0}
                            >
                              <ArrowUp size={12} />
                            </button>
                            <button
                              type="button"
                              className="icon-btn"
                              title="Move down"
                              onClick={() =>
                                moveSubQuestion(qIdx, sIdx, "down")
                              }
                              disabled={sIdx === (q.questions?.length || 0) - 1}
                            >
                              <ArrowDown size={12} />
                            </button>
                            <button
                              type="button"
                              className="icon-btn danger"
                              onClick={() => removeSubQuestion(qIdx, sIdx)}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        {/* Expandable explanation/fromPassage row */}
                        <details className="sub-question-details">
                          <summary>Explanation &amp; passage ref</summary>
                          <div className="form-row" style={{ marginTop: 6 }}>
                            <div className="form-group" style={{ flex: 1 }}>
                              <label>Explanation</label>
                              <input
                                value={sq.explanation || ""}
                                onChange={(e) =>
                                  updateSubQuestion(qIdx, sIdx, {
                                    explanation: e.target.value,
                                  })
                                }
                                placeholder="Why this is the correct answer..."
                              />
                            </div>
                            <div
                              className="form-group"
                              style={{ flex: "0 0 180px" }}
                            >
                              <label>From Passage</label>
                              <input
                                value={sq.fromPassage || ""}
                                onChange={(e) =>
                                  updateSubQuestion(qIdx, sIdx, {
                                    fromPassage: e.target.value,
                                  })
                                }
                                placeholder="e.g., Paragraph 2"
                              />
                            </div>
                          </div>
                        </details>
                      </div>
                    ))}

                    {subCount === 0 && (
                      <p
                        className="muted"
                        style={{ textAlign: "center", padding: "12px" }}
                      >
                        No sub-questions yet. Click "Add" to create one.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {questions.length === 0 && (
        <div className="empty-state small">
          <p>No questions yet. Click "Add Question Group" to start building.</p>
        </div>
      )}
    </div>
  );
}
