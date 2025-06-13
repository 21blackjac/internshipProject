import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Register from "./components/Register";
// import Login from "./components/Login"; // à décommenter après création

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/register" />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/login" element={<Login />} /> */}
        {/* Tu peux ajouter d'autres routes ici plus tard */}
      </Routes>
    </Router>
  );
};

export default App;
