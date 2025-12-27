import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./RecipeResult.css";

/* =======================
   IMPORT ẢNH LOCAL (ASSETS)
======================= */
import khoaiTayImg from "../../assets/images/khoaitay.png";
import chuoiImg from "../../assets/images/chuoi.png";
import comImg from "../../assets/images/com.png";
import miImg from "../../assets/images/mi.png";
import phoImg from "../../assets/images/pho.png";
import gaImg from "../../assets/images/ga.png";
import heoImg from "../../assets/images/heo.png";
import boImg from "../../assets/images/bo.png";
import trungImg from "../../assets/images/trung.png";

/* =======================
   MAP KEYWORD → IMAGE
======================= */
const foodImageMap = [
  { keywords: ["khoai", "potato"], image: khoaiTayImg },
  { keywords: ["chuối", "banana"], image: chuoiImg },
  { keywords: ["cơm", "rice"], image: comImg },
  { keywords: ["mì", "pasta", "noodle"], image: miImg },
  { keywords: ["phở"], image: phoImg },
  { keywords: ["gà", "chicken"], image: gaImg },
  { keywords: ["heo", "pork"], image: heoImg },
  { keywords: ["bò", "beef"], image: boImg },
  { keywords: ["trứng", "egg"], image: trungImg },
];

/* =======================
   HÀM LẤY ẢNH LOCAL
======================= */
const getLocalImage = (title = "") => {
  const lowerTitle = title.toLowerCase();

  for (const item of foodImageMap) {
    if (item.keywords.some((kw) => lowerTitle.includes(kw))) {
      return item.image;
    }
  }
  return null;
};

const RecipeResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { recipe } = location.state || {};

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!recipe) {
    return (
      <div className="recipe-not-found">
        <h2>😢 Không tìm thấy công thức</h2>
        <button onClick={() => navigate("/")}>Quay về tạo món</button>
      </div>
    );
  }

  const localImage = getLocalImage(recipe.title);

  /* =======================
     SAVE RECIPE
  ======================= */
  const handleSaveRecipe = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Bạn cần đăng nhập để lưu công thức");
      navigate("/login");
      return;
    }

    try {
      setSaving(true);
      await axios.post("http://localhost:5000/api/recipes/save", recipe, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSaved(true);
      alert("✅ Đã lưu công thức!");
    } catch (err) {
      alert("❌ Lưu thất bại");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="recipe-result">
      <div className="recipe-container">
        {/* BACK */}
        <button className="back-home-btn" onClick={() => navigate("/")}>
          ← Back to Generator
        </button>

        {/* HEADER */}
        <div className="recipe-header">
          <h1 className="recipe-title">{recipe.title}</h1>

          <div className="recipe-meta">
            <span>⏱ {recipe.time}</span>
            <span>🔥 {recipe.calories}</span>
            <span>🤖 AI Generated</span>
          </div>

          <div className="recipe-actions">
            <button
              className={`save-btn ${saved ? "saved" : ""}`}
              disabled={saving || saved}
              onClick={handleSaveRecipe}
            >
              {saved ? "❤️ Saved" : "🤍 Save"}
            </button>
          </div>
        </div>

        {/* IMAGE */}
        <div className="recipe-image-container">
          <img
            className="recipe-image"
            src={localImage || recipe.image}
            alt={recipe.title}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = localImage;
            }}
          />
        </div>

        {/* CONTENT */}
        <div className="recipe-content">
          {/* INGREDIENTS */}
          <section>
            <h3>🧄 Ingredients</h3>
            <ul>
              {recipe.ingredients.map((item, index) => (
                <li key={index}>✔ {item}</li>
              ))}
            </ul>
          </section>

          {/* INSTRUCTIONS */}
          <section>
            <h3>👨‍🍳 Instructions</h3>
            <ol>
              {recipe.instructions.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </section>
        </div>

        {/* FOOTER */}
        <div className="recipe-footer">
          <p>✨ Công thức được tạo bởi AI</p>
          <button onClick={() => navigate("/")}>
            🔁 Generate Another Recipe
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeResult;
