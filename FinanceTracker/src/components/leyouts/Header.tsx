import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AuthService from "../../api/services/AuthService";
import "../../css/Header.css";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getHeaderTitle = () => {
    switch (location.pathname) {
      case "/transaction":
        return "Your Transaction";
      case "/bank":
        return "Your Banks";
      case "/statistic":
        return "Your Statistic";
      case "/category":
        return "Statistic by Category";
      default:
        return "Welcome to FinanceTracker";
    }
  };

  const handleLogout = () => {
    AuthService.logout();
    navigate("/login");
  };

  return (
    <>
      <nav>
        <div className="container">
          <h1 id="logo">FinanceTracker</h1>
          <ul className="nav-items">
            {AuthService.isAuthenticated() && (
              <>
                <li>
                  <Link to="/transaction">Your Transaction</Link>
                </li>
                <li>
                  <Link to="/bank">Your Banks</Link>
                </li>
                <li>
                  <Link to="/category">Category</Link>
                </li>
                <li>
                  <Link to="/statistic">Statistic</Link>
                </li>
              </>
            )}
          </ul>
          <ul className="auth-links">
            {AuthService.isAuthenticated() ? (
              <li>
                <Link to="/login" onClick={handleLogout}>
                  Logout
                </Link>
              </li>
            ) : (
              <>
                <li>
                  <Link to="/login">Login</Link>
                </li>
                <li>
                  <Link to="/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
      <header>
        <div>
          <h1>{getHeaderTitle()}</h1>
        </div>
      </header>
      <div id="nav-bg"></div>
    </>
  );
};

export default Header;
