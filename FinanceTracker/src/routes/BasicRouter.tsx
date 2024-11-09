import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "../components/Header";
import Login from "../components/Login";
import Register from "../components/Register";
import BankList from "../components/BankList";
import ProtectedRoute from "./ProtectedRoute";
import { AuthProvider } from "../components/AuthContext";
import TransactionComponent from "../components/transaction/TransactionComponent";

const BasicRouter: React.FC = () => {
  return (
    <AuthProvider>
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/bank" element={<BankList />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/transaction" element={<TransactionComponent />} />
        </Route>
        <Route path="/" element={<Login />} />
      </Routes>
    </AuthProvider>
  );
};

export default BasicRouter;
