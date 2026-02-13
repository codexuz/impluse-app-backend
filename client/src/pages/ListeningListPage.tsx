import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Headphones, Eye } from "lucide-react";
import toast from "react-hot-toast";
import { listeningApi } from "../services/api";
import type { IeltsListening, ListeningQuery } from "../types";

export default function ListeningListPage() {
  const navigate = useNavigate();
  const [listenings, setListenings] = useState<IeltsListening[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState<ListeningQuery>({ page: 1, limit: 20 });

  useEffect(() => {
    fetchData();
  }, [query.page]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await listeningApi.getAll(query);
      setListenings(res.data || []);
    } catch {
      toast.error("Failed to fetch listenings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>
          <Headphones size={22} /> Listening Sections
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
            placeholder="Search listenings..."
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
        ) : listenings.length === 0 ? (
          <div className="empty-state">
            <p>No listenings found. Create one from a test detail page.</p>
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
              {listenings.map((l, idx) => (
                <tr key={l.id}>
                  <td>{idx + 1}</td>
                  <td className="td-title">{l.title}</td>
                  <td>
                    <span
                      className={`badge ${l.is_active ? "badge-published" : "badge-draft"}`}
                    >
                      {l.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>{new Date(l.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="icon-btn"
                      onClick={() => navigate(`/listening/${l.id}`)}
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
