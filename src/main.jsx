import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./log.css";
import "./work.css";
import "./work2.css";
import "./admin.css";

import App from "./App.jsx";
import Work from "./work.jsx"; 
import Work2 from "./work2.jsx"; 
import Admin from "./admin.jsx";
import Index from "./Index.jsx";
// import WorkersDashboard from "./worker/WorkersDashboard.jsx";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/App" element={<App />} />
        <Route path="/work" element={<Work />} />  
        <Route path="/work2" element={<Work2 />} />
        <Route path="/admin" element={<Admin />} />
        {/* <Route path="/workers-dashboard" element={<WorkersDashboard />} /> */}
        <Route path="/" element={<Index/>}/>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
