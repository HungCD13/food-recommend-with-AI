import React, { useEffect, useState } from "react";

export default function SavedRecipes() {
  const [savedRecipes, setSavedRecipes] = useState([]);

  // Load saved list when component mounts
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("cookio_saved")) || [];
    setSavedRecipes(data);
  }, []);

  // Listen for changes in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const updated = JSON.parse(localStorage.getItem("cookio_saved")) || [];
      setSavedRecipes(updated);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Remove a recipe
  const removeSaved = (id) => {
    const updated = savedRecipes.filter((r) => r.id !== id);
    setSavedRecipes(updated);
    localStorage.setItem("cookio_saved", JSON.stringify(updated));
  };

  return (
    <section id="saved" className="saved-section">
      <div className="container">
        <h2 style={{ textAlign: "center", marginBottom: "10px" }}>
          Your Recipe Book
        </h2>
        <p style={{ textAlign: "center", color: "#888" }}>
          Recipes you've saved for later.
        </p>

        <div id="saved-grid" className="saved-grid">
          {savedRecipes.length === 0 && (
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

          {savedRecipes.map((recipe) => (
            <div className="mini-card" key={recipe.id}>
              {/* DELETE BTN */}
              <div
                className="delete-btn"
                onClick={() => removeSaved(recipe.id)}
              >
                🗑
              </div>

              {/* TITLE */}
              <h3 style={{ marginBottom: "10px" }}>{recipe.title}</h3>

              {/* IMAGE (nếu có) */}
              {recipe.image && (
                <div
                  style={{
                    height: "140px",
                    background: `url('${recipe.image}') center/cover`,
                    borderRadius: "10px",
                    marginBottom: "15px",
                  }}
                ></div>
              )}

              {/* INGREDIENTS */}
              <p>
                <strong>Ingredients:</strong>
              </p>
              <ul style={{ marginBottom: "10px" }}>
                {Array.isArray(recipe.ingredients) &&
                  recipe.ingredients.map((item, i) => <li key={i}>{item}</li>)}
              </ul>

              {/* INSTRUCTIONS */}
              <p>
                <strong>Instructions:</strong>
              </p>
              <p style={{ whiteSpace: "pre-line" }}>{recipe.instructions}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
