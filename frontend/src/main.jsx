import { createRoot } from 'react-dom/client'
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";


import './index.css'


/// Pages are imported here 
import App from './App.jsx';
import EMICalculator from "./Pages/User/EMICalculator.jsx"
 
// user pages

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/loan-apply" element={<EMICalculator />} />
    </Routes>
  </BrowserRouter>
);
