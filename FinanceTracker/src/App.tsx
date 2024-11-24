import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./api/AuthContext";
import BasicRouter from "./routes/BasicRouter";
import NotificationProvider from "./components/notification/NotificationProvider";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <BasicRouter />
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;
