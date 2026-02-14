import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Save, Trash2, Edit3, X } from "lucide-react";
import toast from "react-hot-toast";
import { writingApi, writingTasksApi } from "../services/api";
import { WritingTask } from "../types";
import type {
  IeltsWriting,
  IeltsWritingTask,
  CreateWritingTaskDto,
  UpdateWritingTaskDto,
} from "../types";

export default function WritingBuilderPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [writing, setWriting] = useState<IeltsWriting | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTaskForm, setEditTaskForm] = useState<UpdateWritingTaskDto>({});

  const emptyTaskForm = (): CreateWritingTaskDto => ({
    writing_id: id!,
    task: WritingTask.TASK_1,
    prompt: "",
    image_url: "",
    min_words: 150,
    suggested_time: 20,
  });

  const [taskForm, setTaskForm] =
    useState<CreateWritingTaskDto>(emptyTaskForm());

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await writingApi.getById(id!);
      setWriting(data);
    } catch {
      toast.error("Failed to load writing data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async () => {
    setSaving(true);
    try {
      await writingTasksApi.create(taskForm);
      toast.success("Task created successfully");
      setShowForm(false);
      setTaskForm(emptyTaskForm());
      fetchData();
    } catch {
      toast.error("Failed to create task");
    } finally {
      setSaving(false);
    }
  };

  const handleEditTask = (task: IeltsWritingTask) => {
    setEditingTaskId(task.id);
    setEditTaskForm({
      prompt: task.prompt,
      image_url: task.image_url,
      min_words: task.min_words,
      suggested_time: task.suggested_time,
    });
  };

  const handleUpdateTask = async () => {
    if (!editingTaskId) return;
    setSaving(true);
    try {
      await writingTasksApi.update(editingTaskId, editTaskForm);
      toast.success("Task updated");
      setEditingTaskId(null);
      fetchData();
    } catch {
      toast.error("Failed to update task");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Delete this writing task?")) return;
    try {
      await writingTasksApi.delete(taskId);
      toast.success("Task deleted");
      fetchData();
    } catch {
      toast.error("Failed to delete task");
    }
  };

  const handleDeleteWriting = async () => {
    if (!confirm("Delete this entire writing section and all its tasks?"))
      return;
    try {
      await writingApi.delete(id!);
      toast.success("Writing section deleted");
      navigate(-1);
    } catch {
      toast.error("Failed to delete writing");
    }
  };

  const usedTasks = (writing?.tasks || []).map((t: IeltsWritingTask) => t.task);
  const availableTasks = Object.values(WritingTask).filter(
    (t) => !usedTasks.includes(t),
  );

  if (loading)
    return (
      <div className="page">
        <div className="loading">Loading...</div>
      </div>
    );
  if (!writing)
    return (
      <div className="page">
        <div className="empty-state">Writing not found</div>
      </div>
    );

  return (
    <div className="page">
      <div className="page-header">
        <button className="btn btn-ghost" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Back
        </button>
        <h2>Writing: {writing.title || "Writing Section"}</h2>
        <button
          className="btn btn-danger btn-sm"
          onClick={handleDeleteWriting}
          style={{ marginLeft: "auto" }}
        >
          <Trash2 size={14} /> Delete Writing
        </button>
      </div>

      {/* Existing tasks */}
      <div className="parts-list">
        {(writing.tasks || []).map((task: IeltsWritingTask) => (
          <div key={task.id} className="part-card">
            <div className="part-card-header">
              <div>
                <span className="badge badge-part">
                  {task.task.replace("_", " ")}
                </span>
                {task.min_words && (
                  <span className="muted">Min {task.min_words} words</span>
                )}
                {task.suggested_time && (
                  <span className="muted">{task.suggested_time} min</span>
                )}
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {editingTaskId !== task.id && (
                  <>
                    <button
                      className="icon-btn"
                      title="Edit"
                      onClick={() => handleEditTask(task)}
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      className="icon-btn danger"
                      title="Delete"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </>
                )}
              </div>
            </div>

            {editingTaskId === task.id ? (
              <div className="part-card-body" style={{ padding: "12px 16px" }}>
                <div className="form-row">
                  <div className="form-group" style={{ flex: "0 0 120px" }}>
                    <label>Min Words</label>
                    <input
                      type="number"
                      value={editTaskForm.min_words ?? ""}
                      onChange={(e) =>
                        setEditTaskForm({
                          ...editTaskForm,
                          min_words: parseInt(e.target.value) || undefined,
                        })
                      }
                    />
                  </div>
                  <div className="form-group" style={{ flex: "0 0 120px" }}>
                    <label>Time (min)</label>
                    <input
                      type="number"
                      value={editTaskForm.suggested_time ?? ""}
                      onChange={(e) =>
                        setEditTaskForm({
                          ...editTaskForm,
                          suggested_time: parseInt(e.target.value) || undefined,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Prompt</label>
                  <textarea
                    rows={6}
                    value={editTaskForm.prompt ?? ""}
                    onChange={(e) =>
                      setEditTaskForm({
                        ...editTaskForm,
                        prompt: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Image URL</label>
                  <input
                    value={editTaskForm.image_url ?? ""}
                    onChange={(e) =>
                      setEditTaskForm({
                        ...editTaskForm,
                        image_url: e.target.value,
                      })
                    }
                    placeholder="https://example.com/image.png"
                  />
                </div>
                <div className="form-actions">
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setEditingTaskId(null)}
                  >
                    <X size={14} /> Cancel
                  </button>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={handleUpdateTask}
                    disabled={saving}
                  >
                    <Save size={14} /> {saving ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="part-card-passage">
                  {task.prompt ? (
                    <p>
                      {task.prompt.substring(0, 300)}
                      {task.prompt.length > 300 ? "..." : ""}
                    </p>
                  ) : (
                    <p className="muted">No prompt set</p>
                  )}
                </div>
                {task.image_url && (
                  <div className="task-image">
                    <img
                      src={task.image_url}
                      alt="Task visual"
                      style={{
                        maxWidth: "100%",
                        maxHeight: 200,
                        borderRadius: 8,
                      }}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {/* Add Task Form */}
      {!showForm && availableTasks.length > 0 && (
        <button
          className="btn btn-primary"
          onClick={() => {
            setTaskForm({ ...emptyTaskForm(), task: availableTasks[0] });
            setShowForm(true);
          }}
        >
          <Plus size={16} /> Add Task
        </button>
      )}

      {showForm && (
        <div className="form-card part-form">
          <h3>Create Writing Task</h3>

          <div className="form-row">
            <div className="form-group" style={{ flex: "0 0 150px" }}>
              <label>Task *</label>
              <select
                value={taskForm.task}
                onChange={(e) =>
                  setTaskForm({
                    ...taskForm,
                    task: e.target.value as WritingTask,
                  })
                }
              >
                {availableTasks.map((t) => (
                  <option key={t} value={t}>
                    {t.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group" style={{ flex: "0 0 120px" }}>
              <label>Min Words</label>
              <input
                type="number"
                value={taskForm.min_words || ""}
                onChange={(e) =>
                  setTaskForm({
                    ...taskForm,
                    min_words: parseInt(e.target.value) || undefined,
                  })
                }
              />
            </div>
            <div className="form-group" style={{ flex: "0 0 120px" }}>
              <label>Time (min)</label>
              <input
                type="number"
                value={taskForm.suggested_time || ""}
                onChange={(e) =>
                  setTaskForm({
                    ...taskForm,
                    suggested_time: parseInt(e.target.value) || undefined,
                  })
                }
              />
            </div>
          </div>

          <div className="form-group">
            <label>Prompt</label>
            <textarea
              rows={6}
              value={taskForm.prompt || ""}
              onChange={(e) =>
                setTaskForm({ ...taskForm, prompt: e.target.value })
              }
              placeholder="Enter the writing task prompt..."
            />
          </div>

          <div className="form-group">
            <label>Image URL</label>
            <input
              value={taskForm.image_url || ""}
              onChange={(e) =>
                setTaskForm({ ...taskForm, image_url: e.target.value })
              }
              placeholder="https://example.com/image.png"
            />
            {taskForm.image_url && (
              <div className="image-preview">
                <img
                  src={taskForm.image_url}
                  alt="Preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: 200,
                    borderRadius: 8,
                    marginTop: 8,
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          <div className="form-actions">
            <button
              className="btn btn-secondary"
              onClick={() => {
                setShowForm(false);
                setTaskForm(emptyTaskForm());
              }}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleCreateTask}
              disabled={saving}
            >
              <Save size={14} /> {saving ? "Saving..." : "Create Task"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
