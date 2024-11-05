import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import BasicRouter from "./routes/BasicRouter";

const App: React.FC = () => {
  return (
    <Router>
      <BasicRouter />
    </Router>
  );
};

export default App;
