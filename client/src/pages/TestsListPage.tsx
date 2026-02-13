import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Search, Edit2, Trash2, Eye } from "lucide-react";
import toast from "react-hot-toast";
import { testsApi } from "../services/api";
import type { IeltsTest, TestQuery } from "../types";
import { TestMode, TestStatus, TestCategory } from "../types";

export default function TestsListPage() {
  const navigate = useNavigate();
  const [tests, setTests] = useState<IeltsTest[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState<TestQuery>({
    page: 1,
    limit: 10,
    search: "",
  });

  const fetchTests = async () => {
    setLoading(true);
    try {
      const res = await testsApi.getAll(query);
      setTests(res.data || []);
      setTotal(res.total || 0);
    } catch {
      toast.error("Failed to fetch tests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, [query.page, query.limit, query.mode, query.status, query.category]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery({ ...query, page: 1 });
    fetchTests();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this test?")) return;
    try {
      await testsApi.delete(id);
      toast.success("Test deleted");
      fetchTests();
    } catch {
      toast.error("Failed to delete test");
    }
  };

  const totalPages = Math.ceil(total / (query.limit || 10));

  return (
    <div className="page">
      <div className="page-header">
        <h2>IELTS Tests</h2>
        <Link to="/tests/create" className="btn btn-primary">
          <Plus size={16} /> Create Test
        </Link>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-wrapper">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search tests..."
              value={query.search || ""}
              onChange={(e) => setQuery({ ...query, search: e.target.value })}
            />
          </div>
          <button type="submit" className="btn btn-secondary">
            Search
          </button>
        </form>
        <div className="filter-selects">
          <select
            value={query.mode || ""}
            onChange={(e) =>
              setQuery({
                ...query,
                mode: (e.target.value as TestMode) || undefined,
                page: 1,
              })
            }
          >
            <option value="">All Modes</option>
            <option value={TestMode.PRACTICE}>Practice</option>
            <option value={TestMode.MOCK}>Mock</option>
          </select>
          <select
            value={query.status || ""}
            onChange={(e) =>
              setQuery({
                ...query,
                status: (e.target.value as TestStatus) || undefined,
                page: 1,
              })
            }
          >
            <option value="">All Statuses</option>
            <option value={TestStatus.DRAFT}>Draft</option>
            <option value={TestStatus.PUBLISHED}>Published</option>
          </select>
          <select
            value={query.category || ""}
            onChange={(e) =>
              setQuery({
                ...query,
                category: (e.target.value as TestCategory) || undefined,
                page: 1,
              })
            }
          >
            <option value="">All Categories</option>
            <option value={TestCategory.AUTHENTIC}>Authentic</option>
            <option value={TestCategory.PRE_TEST}>Pre-test</option>
            <option value={TestCategory.CAMBRIDGE_BOOKS}>
              Cambridge Books
            </option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : tests.length === 0 ? (
          <div className="empty-state">
            <p>No tests found. Create your first test!</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Mode</th>
                <th>Status</th>
                <th>Category</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tests.map((test, idx) => (
                <tr key={test.id}>
                  <td>
                    {((query.page || 1) - 1) * (query.limit || 10) + idx + 1}
                  </td>
                  <td className="td-title">{test.title}</td>
                  <td>
                    <span className={`badge badge-${test.mode}`}>
                      {test.mode}
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge-${test.status}`}>
                      {test.status}
                    </span>
                  </td>
                  <td>{test.category || "—"}</td>
                  <td>{new Date(test.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="action-btns">
                      <button
                        className="icon-btn"
                        title="View"
                        onClick={() => navigate(`/tests/${test.id}`)}
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        className="icon-btn"
                        title="Edit"
                        onClick={() => navigate(`/tests/${test.id}/edit`)}
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        className="icon-btn danger"
                        title="Delete"
                        onClick={() => handleDelete(test.id)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="btn btn-secondary"
            disabled={query.page === 1}
            onClick={() => setQuery({ ...query, page: (query.page || 1) - 1 })}
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {query.page} of {totalPages}
          </span>
          <button
            className="btn btn-secondary"
            disabled={query.page === totalPages}
            onClick={() => setQuery({ ...query, page: (query.page || 1) + 1 })}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
