import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Headphones,
  PenTool,
  Edit2,
  Plus,
  Save,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  testsApi,
  readingApi,
  listeningApi,
  writingApi,
} from "../services/api";
import { TestMode, TestStatus, TestCategory } from "../types";
import type {
  IeltsTest,
  IeltsReading,
  IeltsListening,
  IeltsWriting,
  UpdateTestDto,
} from "../types";

export default function TestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [test, setTest] = useState<IeltsTest | null>(null);
  const [readings, setReadings] = useState<IeltsReading[]>([]);
  const [listenings, setListenings] = useState<IeltsListening[]>([]);
  const [writings, setWritings] = useState<IeltsWriting[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<UpdateTestDto>({});
  const [creatingSection, setCreatingSection] = useState<string | null>(null);
  const [sectionTitle, setSectionTitle] = useState("");

  useEffect(() => {
    if (id) fetchAll();
  }, [id]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [testData, readingData, listeningData, writingData] =
        await Promise.all([
          testsApi.getById(id!),
          readingApi.getAll({ testId: id }),
          listeningApi.getAll({ testId: id }),
          writingApi.getAll({ testId: id }),
        ]);
      setTest(testData);
      setReadings(readingData.data || []);
      setListenings(listeningData.data || []);
      setWritings(writingData.data || []);
      setEditForm({
        title: testData.title,
        mode: testData.mode,
        status: testData.status,
        category: testData.category,
      });
    } catch {
      toast.error("Failed to load test");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTest = async () => {
    try {
      await testsApi.update(id!, editForm);
      toast.success("Test updated");
      setEditing(false);
      fetchAll();
    } catch {
      toast.error("Failed to update test");
    }
  };

  const handleCreateSection = async (type: string) => {
    if (!sectionTitle.trim() && type !== "writing") {
      toast.error("Title is required");
      return;
    }
    try {
      if (type === "reading") {
        await readingApi.create({ title: sectionTitle, test_id: id! });
      } else if (type === "listening") {
        await listeningApi.create({ title: sectionTitle, test_id: id! });
      } else if (type === "writing") {
        await writingApi.create({
          title: sectionTitle || undefined,
          test_id: id!,
        });
      }
      toast.success(`${type} section created`);
      setCreatingSection(null);
      setSectionTitle("");
      fetchAll();
    } catch {
      toast.error(`Failed to create ${type} section`);
    }
  };

  if (loading)
    return (
      <div className="page">
        <div className="loading">Loading...</div>
      </div>
    );
  if (!test)
    return (
      <div className="page">
        <div className="empty-state">Test not found</div>
      </div>
    );

  return (
    <div className="page">
      <div className="page-header">
        <button className="btn btn-ghost" onClick={() => navigate("/tests")}>
          <ArrowLeft size={16} /> Back
        </button>
        <h2>{test.title}</h2>
        <div className="header-badges">
          <span className={`badge badge-${test.mode}`}>{test.mode}</span>
          <span className={`badge badge-${test.status}`}>{test.status}</span>
        </div>
      </div>

      {/* Test Info / Edit */}
      <div className="form-card">
        <div className="card-header">
          <h3>Test Information</h3>
          {!editing && (
            <button className="btn btn-ghost" onClick={() => setEditing(true)}>
              <Edit2 size={14} /> Edit
            </button>
          )}
        </div>
        {editing ? (
          <div className="edit-form">
            <div className="form-group">
              <label>Title</label>
              <input
                value={editForm.title || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, title: e.target.value })
                }
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Mode</label>
                <select
                  value={editForm.mode || ""}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      mode: e.target.value as TestMode,
                    })
                  }
                >
                  <option value={TestMode.PRACTICE}>Practice</option>
                  <option value={TestMode.MOCK}>Mock</option>
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={editForm.status || ""}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      status: e.target.value as TestStatus,
                    })
                  }
                >
                  <option value={TestStatus.DRAFT}>Draft</option>
                  <option value={TestStatus.PUBLISHED}>Published</option>
                </select>
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  value={editForm.category || ""}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      category: (e.target.value as TestCategory) || undefined,
                    })
                  }
                >
                  <option value="">None</option>
                  <option value={TestCategory.AUTHENTIC}>Authentic</option>
                  <option value={TestCategory.PRE_TEST}>Pre-test</option>
                  <option value={TestCategory.CAMBRIDGE_BOOKS}>
                    Cambridge Books
                  </option>
                </select>
              </div>
            </div>
            <div className="form-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleUpdateTest}>
                <Save size={14} /> Save
              </button>
            </div>
          </div>
        ) : (
          <div className="info-grid">
            <div>
              <strong>Category:</strong> {test.category || "—"}
            </div>
            <div>
              <strong>Created:</strong>{" "}
              {new Date(test.createdAt).toLocaleString()}
            </div>
          </div>
        )}
      </div>

      {/* Sections */}
      <div className="sections-grid">
        {/* Reading */}
        <div className="section-card">
          <div className="section-card-header reading-header">
            <BookOpen size={20} />
            <h3>Reading ({readings.length})</h3>
            <button
              className="btn btn-sm btn-outline"
              onClick={() =>
                setCreatingSection(
                  creatingSection === "reading" ? null : "reading",
                )
              }
            >
              <Plus size={14} /> Add
            </button>
          </div>
          {creatingSection === "reading" && (
            <div className="section-create-form">
              <input
                placeholder="Section title"
                value={sectionTitle}
                onChange={(e) => setSectionTitle(e.target.value)}
              />
              <button
                className="btn btn-primary btn-sm"
                onClick={() => handleCreateSection("reading")}
              >
                Create
              </button>
            </div>
          )}
          <div className="section-list">
            {readings.map((r) => (
              <Link key={r.id} to={`/reading/${r.id}`} className="section-item">
                <span>{r.title}</span>
                <span className="section-item-arrow">→</span>
              </Link>
            ))}
            {readings.length === 0 && (
              <p className="muted">No reading sections yet</p>
            )}
          </div>
        </div>

        {/* Listening */}
        <div className="section-card">
          <div className="section-card-header listening-header">
            <Headphones size={20} />
            <h3>Listening ({listenings.length})</h3>
            <button
              className="btn btn-sm btn-outline"
              onClick={() =>
                setCreatingSection(
                  creatingSection === "listening" ? null : "listening",
                )
              }
            >
              <Plus size={14} /> Add
            </button>
          </div>
          {creatingSection === "listening" && (
            <div className="section-create-form">
              <input
                placeholder="Section title"
                value={sectionTitle}
                onChange={(e) => setSectionTitle(e.target.value)}
              />
              <button
                className="btn btn-primary btn-sm"
                onClick={() => handleCreateSection("listening")}
              >
                Create
              </button>
            </div>
          )}
          <div className="section-list">
            {listenings.map((l) => (
              <Link
                key={l.id}
                to={`/listening/${l.id}`}
                className="section-item"
              >
                <span>{l.title}</span>
                <span className="section-item-arrow">→</span>
              </Link>
            ))}
            {listenings.length === 0 && (
              <p className="muted">No listening sections yet</p>
            )}
          </div>
        </div>

        {/* Writing */}
        <div className="section-card">
          <div className="section-card-header writing-header">
            <PenTool size={20} />
            <h3>Writing ({writings.length})</h3>
            <button
              className="btn btn-sm btn-outline"
              onClick={() =>
                setCreatingSection(
                  creatingSection === "writing" ? null : "writing",
                )
              }
            >
              <Plus size={14} /> Add
            </button>
          </div>
          {creatingSection === "writing" && (
            <div className="section-create-form">
              <input
                placeholder="Section title (optional)"
                value={sectionTitle}
                onChange={(e) => setSectionTitle(e.target.value)}
              />
              <button
                className="btn btn-primary btn-sm"
                onClick={() => handleCreateSection("writing")}
              >
                Create
              </button>
            </div>
          )}
          <div className="section-list">
            {writings.map((w) => (
              <Link key={w.id} to={`/writing/${w.id}`} className="section-item">
                <span>{w.title || "Writing Section"}</span>
                <span className="section-item-arrow">→</span>
              </Link>
            ))}
            {writings.length === 0 && (
              <p className="muted">No writing sections yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
