import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./api/AuthContext";
import BasicRouter from "./routes/BasicRouter";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <BasicRouter />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
