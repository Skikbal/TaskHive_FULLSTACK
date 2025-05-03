import React from "react";
import Login from "./pages/auth/Login.jsx";
import Signup from "./pages/auth/Signup.jsx";
import { BrowserRouter, Routes, Route } from "react-router";
import "./App.css"
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" index  element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
