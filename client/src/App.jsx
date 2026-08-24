import { useEffect, useState } from "react";
import api from "./api/axios";

function App() {
  const [status, setStatus] = useState("checking...");

  useEffect(() => {
    api.get("/health")
      .then((res) => setStatus(res.data.message))
      .catch(() => setStatus("Backend not reachable"));
  }, []);

  return <h1 className="text-2xl font-bold p-8">{status}</h1>;
}

export default App;
