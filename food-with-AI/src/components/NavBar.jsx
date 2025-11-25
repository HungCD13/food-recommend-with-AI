import "../index.css";

export default function NavBar() {
  return (
    <nav id="navbar">
      <div className="container nav-content">
        <a href="#" className="logo">
          <i className="fas fa-utensils" /> Cook.io
        </a>
        <div className="nav-links">
          <a href="#generator">Generate</a>
          <a href="#saved">Saved</a>
        </div>
      </div>
    </nav>
  );
}
