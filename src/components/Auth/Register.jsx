import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Check password strength
    if (name === "password") {
      let strength = 0;
      if (value.length >= 8) strength += 25;
      if (/[A-Z]/.test(value)) strength += 25;
      if (/[0-9]/.test(value)) strength += 25;
      if (/[^A-Za-z0-9]/.test(value)) strength += 25;
      setPasswordStrength(strength);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 50) return "#e74c3c";
    if (passwordStrength < 75) return "#f39c12";
    return "#2ecc71";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, email, password, confirmPassword } = formData;

    if (!username || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          username,
          email,
          password,
        }
      );

      toast.success("Registration successful! Please login.");

      // Redirect to login after successful registration
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <ToastContainer position="top-right" />

      <div className="register-container animate-scale-in">
        <div className="register-header">
          <div className="register-logo">
            <i className="fas fa-utensils"></i>
            <h2>Join Cook.io</h2>
          </div>
          <p className="register-subtitle">
            Create your account to start cooking
          </p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="input-group">
            <label htmlFor="username">
              <i className="fas fa-user"></i>
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className="input-field"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="email">
              <i className="fas fa-envelope"></i>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="input-field"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">
              <i className="fas fa-lock"></i>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              className="input-field"
              required
            />

            {formData.password && (
              <div className="password-strength">
                <div className="strength-bar">
                  <div
                    className="strength-fill"
                    style={{
                      width: `${passwordStrength}%`,
                      backgroundColor: getPasswordStrengthColor(),
                    }}
                  ></div>
                </div>
                <div className="strength-text">
                  Password strength:
                  <span
                    style={{
                      color: getPasswordStrengthColor(),
                      marginLeft: "0.5rem",
                    }}
                  >
                    {passwordStrength < 50
                      ? "Weak"
                      : passwordStrength < 75
                      ? "Good"
                      : "Strong"}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword">
              <i className="fas fa-lock"></i>
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className="input-field"
              required
            />
            {formData.password && formData.confirmPassword && (
              <div className="password-match">
                {formData.password === formData.confirmPassword ? (
                  <span className="match-success">
                    <i className="fas fa-check-circle"></i> Passwords match
                  </span>
                ) : (
                  <span className="match-error">
                    <i className="fas fa-times-circle"></i> Passwords do not
                    match
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="form-check">
            <label className="checkbox">
              <input type="checkbox" required />
              <span>
                I agree to the{" "}
                <a href="#" className="terms-link">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="terms-link">
                  Privacy Policy
                </a>
              </span>
            </label>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (
              <>
                <div className="spinner"></div>
                Creating Account...
              </>
            ) : (
              <>
                <i className="fas fa-user-plus"></i>
                Create Account
              </>
            )}
          </button>
        </form>

        <div className="register-footer">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="login-link">
              Sign in here
            </Link>
          </p>
        </div>
      </div>

      {/* Background animation */}
      <div className="register-bg">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="floating-shape"
            style={{
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Register;
