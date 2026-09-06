import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Browse from "./pages/Browse";
import ReportItem from "./pages/ReportItem";
import PostDetail from "./pages/PostDetail";
import MyPosts from "./pages/MyPosts";
import EditPost from "./pages/EditPost";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "./components/AdminRoute";
import Profile from "./pages/Profile";


function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/report" element={<ReportItem />} />
        <Route path="/posts/:id" element={<PostDetail />} />
        <Route path="/my-posts" element={<MyPosts />} />
        <Route path="/posts/:id/edit" element={<EditPost />} />
        <Route path="/admin" element={
    <AdminRoute>
    <AdminDashboard />
    </AdminRoute>}/>
    <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
}

export default App;