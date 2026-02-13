import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import TestsListPage from "./pages/TestsListPage";
import TestCreatePage from "./pages/TestCreatePage";
import TestDetailPage from "./pages/TestDetailPage";
import ReadingListPage from "./pages/ReadingListPage";
import ReadingBuilderPage from "./pages/ReadingBuilderPage";
import ListeningListPage from "./pages/ListeningListPage";
import ListeningBuilderPage from "./pages/ListeningBuilderPage";
import WritingListPage from "./pages/WritingListPage";
import WritingBuilderPage from "./pages/WritingBuilderPage";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/tests" replace />} />
          <Route path="tests" element={<TestsListPage />} />
          <Route path="tests/create" element={<TestCreatePage />} />
          <Route path="tests/:id" element={<TestDetailPage />} />
          <Route path="tests/:id/edit" element={<TestDetailPage />} />
          <Route path="reading" element={<ReadingListPage />} />
          <Route path="reading/:id" element={<ReadingBuilderPage />} />
          <Route path="listening" element={<ListeningListPage />} />
          <Route path="listening/:id" element={<ListeningBuilderPage />} />
          <Route path="writing" element={<WritingListPage />} />
          <Route path="writing/:id" element={<WritingBuilderPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
