import React from "react";
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter
import BasicRouter from "./routes/BasicRouter";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <BasicRouter />
    </BrowserRouter>
  );
};

export default App;
