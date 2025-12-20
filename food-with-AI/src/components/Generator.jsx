import { useState } from "react";
import Loader from "./Loader";
import RecipeCard from "./SavedRecipes";
import { generateRecipe } from "../services/api";
import "../index.css";

export default function Generator() {
  const [ingredients, setIngredients] = useState("");
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    const trimmed = ingredients.trim();
    if (!trimmed) {
      setError("Please enter at least one ingredient.");
      return;
    }
    setError("");
    setLoading(true);
    setRecipe(null);

    try {
      const data = await generateRecipe(trimmed);
      setRecipe(data);
      setTimeout(() => {
        document
          .getElementById("result-scroll-anchor")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err) {
      console.error(err);
      setError("Chef AI is busy, please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSurprise = () => {
    setIngredients("something spicy, chicken, garlic");
    handleGenerate();
  };

  const handleClear = () => {
    setIngredients("");
    setRecipe(null);
    setError("");
  };

  return (
    <>
      <div className="input-wrapper">
        <h2>What's in your kitchen?</h2>
        <p style={{ color: "#888", marginBottom: 20 }}>
          Enter ingredients separated by commas (e.g., chicken, lemon, garlic)
        </p>

        <div className="input-group">
          <input
            type="text"
            className="ingredient-input"
            placeholder="Type ingredients here..."
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
          />
        </div>

        <div className="actions">
          <button
            className="btn btn-primary"
            onClick={handleGenerate}
            disabled={loading}
          >
            <i className="fas fa-magic" /> Generate Recipe
          </button>
          <button
            className="btn btn-outline"
            type="button"
            onClick={handleSurprise}
            disabled={loading}
          >
            <i className="fas fa-random" /> Surprise Me
          </button>
          <button
            className="btn"
            type="button"
            style={{ color: "#999" }}
            onClick={handleClear}
            disabled={loading}
          >
            Clear
          </button>
        </div>

        {error && (
          <div
            style={{
              color: "var(--primary)",
              textAlign: "center",
              marginTop: 20,
            }}
          >
            <i className="fas fa-exclamation-circle" /> {error}
          </div>
        )}

        {loading && <Loader />}
      </div>

      {/* anchor để scroll tới khi có recipe */}
      <div id="result-scroll-anchor" />

      {recipe && <RecipeCard recipe={recipe} />}
    </>
  );
}
