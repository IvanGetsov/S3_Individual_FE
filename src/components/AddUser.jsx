import React, { useState } from "react";
import UserService from "../services/UserService";
import ErrorModal from "../components/ErrorModal";
import { Navigate, useNavigate } from "react-router-dom";

const AddUser = ({ email, password, name, age, role }) => {
  const initialUserState = {
    id: null,
    email: email || "",
    password: password || "",
    name: name || "",
    age: age || 18,
    role: role || "",
  };

  const [user, setUser] = useState(initialUserState);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    return emailRegex.test(email);
  };

  const saveUser = (e) => {
    e.preventDefault();

    const validationErrors = [];

    if (!user.email) {
      validationErrors.push("Email is required.");
    }

    if (!user.password) {
      validationErrors.push("Password is required.");
    }

    if (!user.name) {
      validationErrors.push("Name is required.");
    }

    if (!user.role) {
      validationErrors.push("Role is required.");
    }

    if (user.age < 18) {
      validationErrors.push("Age must be 18 or older.");
    }

    if (validationErrors.length > 0) {
      if (
        validationErrors.length === 1 &&
        validationErrors[0] === "Email is required."
      ) {
        setErrorMessage("Please provide a valid email.");
      } else {
        setErrorMessage(validationErrors.join(" "));
      }
      setShowErrorModal(true);
    } else if (!validateEmail(user.email)) {
      setErrorMessage("Please provide a valid email.");
      setShowErrorModal(true);
    } else {
      const userData = {
        email: user.email,
        password: user.password,
        name: user.name,
        age: user.age,
        role: user.role,
      };

      UserService.create(userData)
        .then((response) => {
          const createdUser = response.data;
          setUser({
            id: createdUser.id,
            password: createdUser.password,
            email: createdUser.email,
            name: createdUser.name,
            age: createdUser.age,
            role: createdUser.role,
            published: createdUser.published,
          });
          setSubmitted(true);
          navigate("/Login", {
            state: {
              successMessage: "Your account has been created successfully!",
            },
          });
        })
        .catch((error) => {
          if (error.response && error.response.status === 409) {
            setErrorMessage(
              "Email is already in use. Please use a different email."
            );
          } else {
            setErrorMessage("Error creating user: " + error.message);
          }
          setShowErrorModal(true);
          console.error("Error creating user:", error);
        });
    }
  };

  const closeErrorModal = () => {
    setShowErrorModal(false);
  };

  return (
    <div className="register-page">
      <div className="register-form">
        <h2>Register</h2>
        <form>
          <div className="form-group">
            <div className="form-row">
              <div className="col">
                <label>Email:</label>
                <input
                  type="text"
                  name="email"
                  value={user.email || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col">
                <label>Age:</label>
                <input
                  type="number"
                  name="age"
                  value={user.age || 18}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={user.password || ""}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={user.name || ""}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Role:</label>
            <div className="role-radio">
              <label>
                <input
                  type="radio"
                  value="CAR_RENTER"
                  name="role"
                  checked={user.role === "CAR_RENTER"}
                  onChange={handleInputChange}
                />
                Car Renter
              </label>
              <label>
                <input
                  type="radio"
                  value="CAR_OWNER"
                  name="role"
                  checked={user.role === "CAR_OWNER"}
                  onChange={handleInputChange}
                />
                Car Owner
              </label>
            </div>
          </div>
          <button onClick={saveUser}>Register</button>
        </form>
      </div>
      {showErrorModal && (
        <ErrorModal message={errorMessage} onClose={closeErrorModal} />
      )}
    </div>
  );
};

export default AddUser;
