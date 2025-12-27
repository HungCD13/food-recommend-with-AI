import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./Navbar.css";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/auth/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(response.data.user);
      } catch (error) {
        localStorage.removeItem("token");
        setUser(null);
      }
    }
  };

  const handleNavigation = (path, sectionId = null) => {
    setMobileMenuOpen(false);
    setShowDropdown(false);

    if (sectionId && location.pathname === "/") {
      // Nếu đang ở trang chủ, scroll đến section
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          const offset = 80; // Offset cho navbar fixed
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      }, 100);
    } else if (sectionId) {
      // Nếu không ở trang chủ, điều hướng về trang chủ với hash
      navigate("/", { state: { scrollTo: sectionId } });
    } else {
      navigate(path);
    }
  };

  // Xử lý scroll khi có state từ navigation
  useEffect(() => {
    if (location.state?.scrollTo && location.pathname === "/") {
      setTimeout(() => {
        const element = document.getElementById(location.state.scrollTo);
        if (element) {
          const offset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
        // Xóa state sau khi scroll
        navigate(location.pathname, { replace: true, state: {} });
      }, 300);
    }
  }, [location, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setShowDropdown(false);
    navigate("/");
    window.location.reload();
  };

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  const isSectionActive = (sectionId) => {
    if (location.pathname !== "/") return "";

    // Kiểm tra nếu section có trong viewport
    const element = document.getElementById(sectionId);
    if (element) {
      const rect = element.getBoundingClientRect();
      const isInViewport =
        rect.top <= window.innerHeight / 2 &&
        rect.bottom >= window.innerHeight / 2;
      return isInViewport ? "active" : "";
    }
    return "";
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-container">
        <div
          className="logo"
          onClick={() => handleNavigation("/", "hero")}
          style={{ cursor: "pointer" }}
        >
          <i className="fas fa-utensils"></i>
          <span className="logo-text">
            Cook<span className="logo-highlight">.io</span>
          </span>
          <div className="logo-sparkle">
            <i className="fas fa-sparkle"></i>
          </div>
        </div>

        <div className={`nav-links ${mobileMenuOpen ? "open" : ""}`}>
          {/* Generate Button */}
          <button
            className={`nav-btn primary ${isSectionActive(
              "generator-section"
            )}`}
            onClick={() => handleNavigation("/", "generator-section")}
          >
            <i className="fas fa-magic"></i>
            Generate
          </button>

          {/* Saved Button - chỉ hiển thị khi user đã đăng nhập */}
          {user ? (
            <button
              // Kiểm tra nếu đang ở trang /history thì thêm class active (tuỳ chọn)
              className={`nav-btn primary ${
                location.pathname === "/history" ? "active" : ""
              }`}
              // Chuyển hướng trực tiếp sang /history
              onClick={() => navigate("/history")}
            >
              <i className="fas fa-heart"></i>
              Saved
            </button>
          ) : (
            <button
              className="nav-btn primary"
              onClick={() => {
                setMobileMenuOpen(false);
                navigate("/login");
              }}
            >
              <i className="fas fa-heart"></i>
              Saved
            </button>
          )}

          {user ? (
            <div className="user-menu">
              <button
                className="user-btn"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <div className="user-avatar">
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.username}
                      className="avatar-img"
                    />
                  ) : (
                    <i className="fas fa-user"></i>
                  )}
                </div>
                <span className="user-name">{user.username}</span>
                <i
                  className={`fas fa-chevron-down ${
                    showDropdown ? "rotate" : ""
                  }`}
                ></i>
              </button>

              {showDropdown && (
                <>
                  <div
                    className="dropdown-overlay"
                    onClick={() => setShowDropdown(false)}
                  />
                  <div className="dropdown-menu">
                    <Link
                      to="/profile"
                      className="dropdown-item"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setShowDropdown(false);
                      }}
                    >
                      <i className="fas fa-user-circle"></i>
                      Profile
                    </Link>
                    <Link
                      to="/"
                      className="dropdown-item"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setShowDropdown(false);
                        handleNavigation("/", "saved-section");
                      }}
                    >
                      <i className="fas fa-bookmark"></i>
                      Saved Recipes
                    </Link>
                    <button
                      className="dropdown-item logout"
                      onClick={handleLogout}
                    >
                      <i className="fas fa-sign-out-alt"></i>
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <button
                className="login-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate("/login");
                }}
              >
                <span>Login</span>
              </button>
            </div>
          )}
        </div>

        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <div className={`hamburger ${mobileMenuOpen ? "open" : ""}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </div>

      {/* Floating particles behind navbar */}
      <div className="nav-particles">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="nav-particle"
            style={{
              left: `${20 + i * 15}%`,
              animationDelay: `${i * 0.3}s`,
            }}
          ></div>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
