import { useEffect, useState } from "react";

export default function SavedRecipes() {
  const [saved, setSaved] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cookio_saved")) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cookio_saved", JSON.stringify(saved));
  }, [saved]);

  return (
    <section id="saved" className="saved-section">
      <div className="container">
        <h2 style={{ textAlign: "center", marginBottom: 10 }}>
          Your Recipe Book
        </h2>
        <p style={{ textAlign: "center", color: "#888" }}>
          Recipes you've saved for later.
        </p>

        <div className="saved-grid">
          {saved.length === 0 && (
            <p
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                color: "#ccc",
              }}
            >
              No saved recipes yet.
            </p>
          )}

          {saved.map((recipe) => (
            <div key={recipe.id} className="mini-card">
              <h4 style={{ marginBottom: 5 }}>{recipe.title}</h4>
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "#888",
                  marginBottom: 10,
                }}
              >
                {recipe.time} • {recipe.calories}
              </p>
              <div
                style={{
                  height: 120,
                  background: `url(${recipe.image}) center/cover`,
                  borderRadius: 10,
                }}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
