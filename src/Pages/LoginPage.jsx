import React, { useEffect, useState } from 'react';
import '../styles/LoginPage.css';
import { NavLink, useLocation } from 'react-router-dom';
import SuccessModal from '../components/SuccessModal';
import LoginService from '../services/LoginService';
import { Navigate, useNavigate } from 'react-router-dom';
import ErrorModal from "../components/ErrorModal";

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    const message = location.state && location.state.successMessage;
    if (message) {
      setSuccessMessage(message);
      setShowSuccessModal(true);
    } else {
      setShowSuccessModal(false);
    }
  }, [location.state]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please fill in both email and password.');
      setShowErrorModal(true);
      return;
    }

    try {
      const response = await LoginService.login(email, password);

      const accessToken = response.data.accessToken;
      localStorage.setItem('access_token', accessToken);
      console.log('Received Access Token:', accessToken);
      navigate('/', { state: { successMessage: 'You have logged in successfully!' } });
    } catch (error) {
      console.error('Login failed:', error.message);
      setErrorMessage('Login failed. Please check your credentials.');
      setShowErrorModal(true);
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const closeErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage('');
  };

  return (
    <div className="login-page">
      <div className="login-form">
        <h2>Login</h2>
        {showSuccessModal ? (
          <SuccessModal message={successMessage} onClose={closeSuccessModal} />
        ) : null}
        {showErrorModal ? (
          <ErrorModal message={errorMessage} onClose={closeErrorModal} />
        ) : null}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="text"
              value={email}
              onChange={handleEmailChange}
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          <button type="submit">Login</button>
        </form>
        <p>
          Don't have an account? <NavLink to="/Register">Register</NavLink>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
