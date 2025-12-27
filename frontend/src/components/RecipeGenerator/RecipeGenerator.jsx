import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./RecipeGenerator.css";

const RecipeGenerator = () => {
  const [ingredients, setIngredients] = useState("");
  const [ingredientList, setIngredientList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [animationActive, setAnimationActive] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  const commonIngredients = [
    "gà",
    "bò",
    "heo",
    "cá",
    "tôm",
    "trứng",
    "sữa",
    "phô mai",
    "bơ",
    "sữa chua",
    "cơm",
    "mì ống",
    "bánh mì",
    "bột mì",
    "khoai tây",
    "cà chua",
    "hành tây",
    "tỏi",
    "cà rốt",
    "bông cải xanh",
    "rau chân vịt",
    "rau xà lách",
    "dưa chuột",
    "ớt chuông",
    "nấm",
    "chanh",
    "cam",
    "táo",
    "chuối",
    "bơ",
    "dầu ô liu",
    "nước tương",
    "muối",
    "tiêu",
    "đường",
    "mật ong",
    "giấm",
    "húng quế",
  ];

  useEffect(() => {
    if (ingredients.length > 1) {
      const filtered = commonIngredients.filter((ing) =>
        ing.toLowerCase().includes(ingredients.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [ingredients]);

  const handleInputChange = (e) => {
    setIngredients(e.target.value);
    setError("");
  };

  const handleAddIngredient = () => {
    const trimmed = ingredients.trim();
    if (trimmed && !ingredientList.includes(trimmed.toLowerCase())) {
      setIngredientList([...ingredientList, trimmed.toLowerCase()]);
      setIngredients("");
      setAnimationActive(true);
      setTimeout(() => setAnimationActive(false), 300);
    }
  };

  const handleRemoveIngredient = (index) => {
    setIngredientList(ingredientList.filter((_, i) => i !== index));
  };

  const handleSuggestionClick = (suggestion) => {
    if (!ingredientList.includes(suggestion.toLowerCase())) {
      setIngredientList([...ingredientList, suggestion.toLowerCase()]);
      setIngredients("");
      setShowSuggestions(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddIngredient();
    }
  };

  const handleGenerateRecipe = async () => {
    if (ingredientList.length === 0) {
      setError("Please add at least one ingredient");
      return;
    }

    setLoading(true);
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please login to generate recipes");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/recipes/recommend",
        { ingredients: ingredientList },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.error) {
        setError(response.data.error);
      } else {
        // Navigate to recipe result page
        navigate("/recipe", { state: { recipe: response.data } });
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Failed to generate recipe. Please try again."
      );
      console.error("Recipe generation error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSurpriseMe = () => {
    const randomIngredients = [];
    while (randomIngredients.length < 3) {
      const randomIng =
        commonIngredients[Math.floor(Math.random() * commonIngredients.length)];
      if (!randomIngredients.includes(randomIng)) {
        randomIngredients.push(randomIng);
      }
    }
    setIngredientList(randomIngredients);
  };

  const handleClearAll = () => {
    setIngredientList([]);
    setIngredients("");
    setError("");
  };

  return (
    <section id="generator" className="recipe-generator">
      <div className="generator-container">
        <div className="generator-header">
          <h2 className="section-title">
            <span className="title-highlight">What's in Your Kitchen?</span>
          </h2>
          <p className="section-subtitle">
            Nhập các nguyên liệu của bạn và để AI tạo ra một công thức món ăn
            ngon cho bạn.
          </p>
        </div>

        <div className="input-section">
          <div className="input-wrapper">
            <div className="input-icon">
              <i className="fas fa-search"></i>
            </div>
            <input
              type="text"
              value={ingredients}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Type an ingredient (e.g., chicken, tomato, garlic)..."
              className="ingredient-input"
              autoComplete="off"
            />
            <button
              onClick={handleAddIngredient}
              className={`add-btn ${animationActive ? "pulse" : ""}`}
              disabled={!ingredients.trim()}
            >
              <i className="fas fa-plus"></i>
              Add
            </button>
          </div>

          {showSuggestions && suggestions.length > 0 && (
            <div className="suggestions-dropdown">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="suggestion-item"
                >
                  <i className="fas fa-utensils"></i>
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="error-message animate-shake">
            <i className="fas fa-exclamation-circle"></i>
            {error}
          </div>
        )}

        {ingredientList.length > 0 && (
          <div className="ingredients-display">
            <div className="ingredients-header">
              <h3>Your Ingredients ({ingredientList.length})</h3>
              <button onClick={handleClearAll} className="clear-btn">
                <i className="fas fa-trash"></i>
                Clear All
              </button>
            </div>

            <div className="ingredients-grid">
              {ingredientList.map((ingredient, index) => (
                <div
                  key={index}
                  className="ingredient-tag"
                  onClick={() => handleRemoveIngredient(index)}
                >
                  <span className="ingredient-name">{ingredient}</span>
                  <button className="remove-btn">
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="quick-actions">
          <button
            onClick={handleSurpriseMe}
            className="action-btn surprise-btn"
          >
            <i className="fas fa-random"></i>
            Surprise Me
          </button>
          <button className="action-btn common-btn">
            <i className="fas fa-list"></i>
            Common Ingredients
          </button>
        </div>

        <div className="generate-section">
          <button
            onClick={handleGenerateRecipe}
            disabled={loading || ingredientList.length === 0}
            className={`generate-btn ${loading ? "loading" : ""}`}
          >
            {loading ? (
              <>
                <div className="spinner">
                  <div className="spinner-circle"></div>
                  <div className="spinner-circle"></div>
                  <div className="spinner-circle"></div>
                </div>
                <span>Cooking up your recipe...</span>
              </>
            ) : (
              <>
                <i className="fas fa-magic"></i>
                <span>Generate Recipe</span>
                <div className="sparkle">
                  <i className="fas fa-sparkle"></i>
                </div>
              </>
            )}
          </button>

          <div className="ai-badge">
            <i className="fas fa-robot"></i>
            Powered by AI Chef
          </div>
        </div>

        <div className="common-ingredients-section">
          <h4>Common Ingredients</h4>
          <div className="common-grid">
            {commonIngredients.slice(0, 12).map((ingredient, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!ingredientList.includes(ingredient.toLowerCase())) {
                    setIngredientList([
                      ...ingredientList,
                      ingredient.toLowerCase(),
                    ]);
                  }
                }}
                className={`common-item ${
                  ingredientList.includes(ingredient.toLowerCase())
                    ? "added"
                    : ""
                }`}
              >
                <i className="fas fa-leaf"></i>
                {ingredient}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Background Effects */}
      <div className="bg-effects">
        <div className="floating-ingredient floating-1">
          <i className="fas fa-carrot"></i>
        </div>
        <div className="floating-ingredient floating-2">
          <i className="fas fa-drumstick-bite"></i>
        </div>
        <div className="floating-ingredient floating-3">
          <i className="fas fa-cheese"></i>
        </div>
        <div className="floating-ingredient floating-4">
          <i className="fas fa-fish"></i>
        </div>
      </div>
    </section>
  );
};

export default RecipeGenerator;
