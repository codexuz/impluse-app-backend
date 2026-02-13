import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import { testsApi } from "../services/api";
import { TestMode, TestStatus, TestCategory } from "../types";
import type { CreateTestDto } from "../types";

export default function TestCreatePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<CreateTestDto>({
    title: "",
    mode: TestMode.PRACTICE,
    status: TestStatus.DRAFT,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    setLoading(true);
    try {
      const test = await testsApi.create(form);
      toast.success("Test created successfully");
      navigate(`/tests/${test.id}`);
    } catch {
      toast.error("Failed to create test");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <button className="btn btn-ghost" onClick={() => navigate("/tests")}>
          <ArrowLeft size={16} /> Back
        </button>
        <h2>Create New Test</h2>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Enter test title"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="mode">Mode *</label>
              <select
                id="mode"
                value={form.mode}
                onChange={(e) =>
                  setForm({ ...form, mode: e.target.value as TestMode })
                }
              >
                <option value={TestMode.PRACTICE}>Practice</option>
                <option value={TestMode.MOCK}>Mock</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                value={form.status || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    status: (e.target.value as TestStatus) || undefined,
                  })
                }
              >
                <option value={TestStatus.DRAFT}>Draft</option>
                <option value={TestStatus.PUBLISHED}>Published</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={form.category || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
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
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/tests")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Test"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
