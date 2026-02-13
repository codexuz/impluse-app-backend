import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Eye } from "lucide-react";
import toast from "react-hot-toast";
import { readingApi } from "../services/api";
import type { IeltsReading, ReadingQuery } from "../types";

export default function ReadingListPage() {
  const navigate = useNavigate();
  const [readings, setReadings] = useState<IeltsReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState<ReadingQuery>({ page: 1, limit: 20 });

  useEffect(() => {
    fetchData();
  }, [query.page]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await readingApi.getAll(query);
      setReadings(res.data || []);
    } catch {
      toast.error("Failed to fetch readings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>
          <BookOpen size={22} /> Reading Sections
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
            placeholder="Search readings..."
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
        ) : readings.length === 0 ? (
          <div className="empty-state">
            <p>No readings found. Create one from a test detail page.</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {readings.map((r, idx) => (
                <tr key={r.id}>
                  <td>{idx + 1}</td>
                  <td className="td-title">{r.title}</td>
                  <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="icon-btn"
                      onClick={() => navigate(`/reading/${r.id}`)}
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
