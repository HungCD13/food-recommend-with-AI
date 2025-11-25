import "../index.css";
export default function Footer() {
  return (
    <footer>
      <div className="container footer-content">
        <div
          className="logo"
          style={{ justifyContent: "center", marginBottom: 20 }}
        >
          <i className="fas fa-utensils" /> Cook.io
        </div>
        <p>Powered by Hung and Huy</p>
        <div class="footer-links">
          <a href="#">
            <i class="fab fa-instagram"></i>
          </a>
          <a href="#">
            <i class="fab fa-twitter"></i>
          </a>
          <a href="#">
            <i class="fab fa-facebook"></i>
          </a>
        </div>
        <p>&copy; 2025 Cook.io All Rights Reserved.</p>
      </div>
    </footer>
  );
}
