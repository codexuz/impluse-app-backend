import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PenTool, Eye } from "lucide-react";
import toast from "react-hot-toast";
import { writingApi } from "../services/api";
import type { IeltsWriting, WritingQuery } from "../types";

export default function WritingListPage() {
  const navigate = useNavigate();
  const [writings, setWritings] = useState<IeltsWriting[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState<WritingQuery>({ page: 1, limit: 20 });

  useEffect(() => {
    fetchData();
  }, [query.page]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await writingApi.getAll(query);
      setWritings(res.data || []);
    } catch {
      toast.error("Failed to fetch writings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>
          <PenTool size={22} /> Writing Sections
        </h2>
      </div>

      <div className="filters-bar">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchData();
          }}
          className="search-form"
        >
          <input
            type="text"
            placeholder="Search writings..."
            value={query.search || ""}
            onChange={(e) => setQuery({ ...query, search: e.target.value })}
          />
          <button type="submit" className="btn btn-secondary">
            Search
          </button>
        </form>
      </div>

      <div className="table-container">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : writings.length === 0 ? (
          <div className="empty-state">
            <p>No writings found. Create one from a test detail page.</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Active</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {writings.map((w, idx) => (
                <tr key={w.id}>
                  <td>{idx + 1}</td>
                  <td className="td-title">{w.title || "Writing Section"}</td>
                  <td>
                    <span
                      className={`badge ${w.is_active ? "badge-published" : "badge-draft"}`}
                    >
                      {w.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>{new Date(w.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="icon-btn"
                      onClick={() => navigate(`/writing/${w.id}`)}
                    >
                      <Eye size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
