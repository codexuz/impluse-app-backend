import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Save, Trash2, Edit2, Volume2 } from "lucide-react";
import toast from "react-hot-toast";
import { listeningApi, listeningPartsApi } from "../services/api";
import { ListeningPart, DifficultyLevel } from "../types";
import type {
  IeltsListening,
  IeltsListeningPart,
  CreateListeningPartDto,
  CreateListeningPartQuestionDto,
} from "../types";
import QuestionBuilder from "../components/QuestionBuilder";

export default function ListeningBuilderPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [listening, setListening] = useState<IeltsListening | null>(null);
  const [parts, setParts] = useState<IeltsListeningPart[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPartId, setEditingPartId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const emptyPartForm = (): CreateListeningPartDto => ({
    listening_id: id!,
    part: ListeningPart.PART_1,
    title: "",
    timeLimitMinutes: 10,
    difficulty: DifficultyLevel.MEDIUM,
    isActive: true,
    totalQuestions: 0,
    questions: [],
  });

  const [partForm, setPartForm] =
    useState<CreateListeningPartDto>(emptyPartForm());

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [listeningData, partsData] = await Promise.all([
        listeningApi.getById(id!),
        listeningPartsApi.getAll({ listeningId: id }),
      ]);
      setListening(listeningData);
      setParts(partsData.data || []);
    } catch {
      toast.error("Failed to load listening data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePart = async () => {
    setSaving(true);
    try {
      await listeningPartsApi.create(partForm);
      toast.success("Part created successfully");
      setShowForm(false);
      setPartForm(emptyPartForm());
      fetchData();
    } catch {
      toast.error("Failed to create part");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePart = async () => {
    if (!editingPartId) return;
    setSaving(true);
    try {
      await listeningPartsApi.update(editingPartId, partForm);
      toast.success("Part updated");
      setEditingPartId(null);
      setShowForm(false);
      setPartForm(emptyPartForm());
      fetchData();
    } catch {
      toast.error("Failed to update part");
    } finally {
      setSaving(false);
    }
  };

  const startEditPart = async (partId: string) => {
    try {
      const part = await listeningPartsApi.getById(partId);
      setPartForm({
        listening_id: id!,
        part: part.part,
        title: part.title || "",
        audio_id: part.audio_id || undefined,
        timeLimitMinutes: part.timeLimitMinutes,
        difficulty: part.difficulty,
        isActive: part.isActive,
        totalQuestions: part.totalQuestions,
        questions: (part.questions || []).map((q) => ({
          questionNumber: q.questionNumber,
          type: q.type,
          questionText: q.questionText || "",
          instruction: q.instruction || "",
          context: q.context || "",
          headingOptions: q.headingOptions,
          tableData: q.tableData,
          points: q.points,
          isActive: q.isActive,
          explanation: q.explanation || "",
          fromPassage: q.fromPassage || "",
          questions: (q.subQuestions || []).map((sq) => ({
            questionNumber: sq.questionNumber,
            questionText: sq.questionText || "",
            points: sq.points,
            correctAnswer: sq.correctAnswer || "",
            explanation: sq.explanation || "",
            fromPassage: sq.fromPassage || "",
            order: sq.order,
          })),
          options: (q.options || []).map((o) => ({
            optionKey: o.optionKey || "",
            optionText: o.optionText || "",
            isCorrect: o.isCorrect,
            orderIndex: o.orderIndex,
            explanation: o.explanation || "",
            fromPassage: o.fromPassage || "",
          })),
        })),
      });
      setEditingPartId(partId);
      setShowForm(true);
    } catch {
      toast.error("Failed to load part details");
    }
  };

  const handleDeletePart = async (partId: string) => {
    if (!confirm("Delete this part and all its questions?")) return;
    try {
      await listeningPartsApi.delete(partId);
      toast.success("Part deleted");
      fetchData();
    } catch {
      toast.error("Failed to delete part");
    }
  };

  const usedParts = parts.map((p) => p.part);
  const availableParts = Object.values(ListeningPart).filter(
    (p) =>
      !usedParts.includes(p) ||
      (editingPartId &&
        parts.find((pp) => pp.id === editingPartId)?.part === p),
  );

  if (loading)
    return (
      <div className="page">
        <div className="loading">Loading...</div>
      </div>
    );
  if (!listening)
    return (
      <div className="page">
        <div className="empty-state">Listening not found</div>
      </div>
    );

  return (
    <div className="page">
      <div className="page-header">
        <button className="btn btn-ghost" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Back
        </button>
        <h2>Listening: {listening.title}</h2>
      </div>

      {/* Existing parts */}
      <div className="parts-list">
        {parts.map((part) => (
          <div key={part.id} className="part-card">
            <div className="part-card-header">
              <div>
                <span className="badge badge-part">
                  {part.part.replace("_", " ")}
                </span>
                <strong>{part.title || "Untitled"}</strong>
                {part.difficulty && (
                  <span
                    className={`badge badge-${part.difficulty.toLowerCase()}`}
                  >
                    {part.difficulty}
                  </span>
                )}
              </div>
              <div className="part-card-stats">
                {part.audio && (
                  <span className="audio-info">
                    <Volume2 size={14} />{" "}
                    {part.audio.file_name || "Audio attached"}
                  </span>
                )}
                <span>{part.totalQuestions || 0} questions</span>
                {part.timeLimitMinutes && (
                  <span>{part.timeLimitMinutes} min</span>
                )}
                <button
                  className="icon-btn"
                  onClick={() => startEditPart(part.id)}
                >
                  <Edit2 size={14} />
                </button>
                <button
                  className="icon-btn danger"
                  onClick={() => handleDeletePart(part.id)}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Part Form */}
      {!showForm && (
        <button
          className="btn btn-primary"
          onClick={() => {
            setPartForm(emptyPartForm());
            setEditingPartId(null);
            setShowForm(true);
          }}
          disabled={availableParts.length === 0}
        >
          <Plus size={16} /> Add Part
        </button>
      )}

      {showForm && (
        <div className="form-card part-form">
          <h3>{editingPartId ? "Edit Part" : "Create New Part"}</h3>

          <div className="form-row">
            <div className="form-group" style={{ flex: "0 0 150px" }}>
              <label>Part *</label>
              <select
                value={partForm.part}
                onChange={(e) =>
                  setPartForm({
                    ...partForm,
                    part: e.target.value as ListeningPart,
                  })
                }
              >
                {availableParts.map((p) => (
                  <option key={p} value={p}>
                    {p.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Title</label>
              <input
                value={partForm.title || ""}
                onChange={(e) =>
                  setPartForm({ ...partForm, title: e.target.value })
                }
                placeholder="Part title"
              />
            </div>
            <div className="form-group" style={{ flex: "0 0 120px" }}>
              <label>Time (min)</label>
              <input
                type="number"
                value={partForm.timeLimitMinutes || ""}
                onChange={(e) =>
                  setPartForm({
                    ...partForm,
                    timeLimitMinutes: parseInt(e.target.value) || undefined,
                  })
                }
              />
            </div>
            <div className="form-group" style={{ flex: "0 0 120px" }}>
              <label>Difficulty</label>
              <select
                value={partForm.difficulty || ""}
                onChange={(e) =>
                  setPartForm({
                    ...partForm,
                    difficulty:
                      (e.target.value as DifficultyLevel) || undefined,
                  })
                }
              >
                <option value="">None</option>
                <option value={DifficultyLevel.EASY}>Easy</option>
                <option value={DifficultyLevel.MEDIUM}>Medium</option>
                <option value={DifficultyLevel.HARD}>Hard</option>
              </select>
            </div>
          </div>

          {/* Audio */}
          <div className="form-card-inner">
            <h4>Audio</h4>
            <div className="form-row">
              <div className="form-group" style={{ flex: 1 }}>
                <label>Audio URL</label>
                <input
                  value={partForm.audio?.url || ""}
                  onChange={(e) =>
                    setPartForm({
                      ...partForm,
                      audio: {
                        ...partForm.audio,
                        url: e.target.value,
                        file_name: partForm.audio?.file_name,
                      },
                    })
                  }
                  placeholder="https://example.com/audio.mp3"
                />
              </div>
              <div className="form-group" style={{ flex: "0 0 200px" }}>
                <label>File Name</label>
                <input
                  value={partForm.audio?.file_name || ""}
                  onChange={(e) =>
                    setPartForm({
                      ...partForm,
                      audio: {
                        ...partForm.audio,
                        url: partForm.audio?.url || "",
                        file_name: e.target.value,
                      },
                    })
                  }
                  placeholder="audio.mp3"
                />
              </div>
              <div className="form-group" style={{ flex: "0 0 120px" }}>
                <label>Duration (sec)</label>
                <input
                  type="number"
                  value={partForm.audio?.duration || ""}
                  onChange={(e) =>
                    setPartForm({
                      ...partForm,
                      audio: {
                        ...partForm.audio,
                        url: partForm.audio?.url || "",
                        duration: parseInt(e.target.value) || undefined,
                      },
                    })
                  }
                />
              </div>
            </div>
          </div>

          <QuestionBuilder
            questions={partForm.questions || []}
            onChange={(questions: CreateListeningPartQuestionDto[]) =>
              setPartForm({
                ...partForm,
                questions,
                totalQuestions: questions.length,
              })
            }
          />

          <div className="form-actions">
            <button
              className="btn btn-secondary"
              onClick={() => {
                setShowForm(false);
                setEditingPartId(null);
                setPartForm(emptyPartForm());
              }}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={editingPartId ? handleUpdatePart : handleCreatePart}
              disabled={saving}
            >
              <Save size={14} />{" "}
              {saving
                ? "Saving..."
                : editingPartId
                  ? "Update Part"
                  : "Create Part"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
