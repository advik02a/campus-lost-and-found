import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Browse from "./pages/Browse";
import ReportItem from "./pages/ReportItem";
import PostDetail from "./pages/PostDetail";

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
      </Routes>
    </>
  );
}

export default App;