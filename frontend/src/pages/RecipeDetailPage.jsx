import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Clock, Flame, ArrowLeft, Calendar } from "lucide-react";
import "./RecipeDetailPage.css";

import khoaiTayImg from "../assets/images/khoaitay.png";
import chuoiImg from "../assets/images/chuoi.png";
import comImg from "../assets/images/com.png";
import miImg from "../assets/images/mi.png";
import phoImg from "../assets/images/pho.png";
import gaImg from "../assets/images/ga.png";
import heoImg from "../assets/images/heo.png";
import boImg from "../assets/images/bo.png";
import trungImg from "../assets/images/trung.png";

const RecipeDetailPage = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(state?.recipe || null);
  const [loading, setLoading] = useState(!state?.recipe);

  useEffect(() => {
    if (!recipe) {
      fetchRecipeById();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchRecipeById = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.get(`http://localhost:5000/api/history/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRecipe(res.data.data || res.data);
    } catch (err) {
      console.error("Fetch recipe error:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "Không rõ";
    return new Date(date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="recipe-loading">
        <div className="spinner" />
        <p>Đang tải công thức...</p>
      </div>
    );
  }

  if (!recipe) {
    return <p className="recipe-error">Không tìm thấy công thức 😢</p>;
  }

  const getLocalImage = (recipe) => {
    if (!recipe?.title) return null;

    const title = recipe.title.toLowerCase();

    for (const item of foodImageMap) {
      if (item.keywords.some((kw) => title.includes(kw))) {
        return item.image;
      }
    }

    return null;
  };

  const foodImageMap = [
    { keywords: ["khoai tây", "potato"], image: khoaiTayImg },
    { keywords: ["chuối", "banana"], image: chuoiImg },
    { keywords: ["cơm", "rice"], image: comImg },
    { keywords: ["mì", "mì ống", "pasta", "noodle"], image: miImg },
    { keywords: ["phở"], image: phoImg },
    { keywords: ["gà", "chicken"], image: gaImg },
    { keywords: ["heo", "thịt heo", "pork"], image: heoImg },
    { keywords: ["bò", "beef"], image: boImg },
    { keywords: ["trứng", "egg"], image: trungImg },
    // { keywords: ["rau", "vegetable", "chay"], image: rauImg },
  ];

  return (
    <div className="recipe-detail-page">
      {/* Header */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} /> Quay lại
      </button>

      <div className="recipe-card">
        {/* Image */}
        <div className="recipe-image">
          <img
            src={getLocalImage(recipe) || recipe.image}
            alt={recipe.title}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = getLocalImage(recipe);
            }}
          />
        </div>

        {/* Content */}
        <div className="recipe-content">
          <h1 className="recipe-title">{recipe.title}</h1>

          <div className="recipe-meta">
            <span>
              <Clock size={16} /> {recipe.time}
            </span>
            <span>
              <Flame size={16} /> {recipe.calories}
            </span>
            <span>
              <Calendar size={16} /> {formatDate(recipe.createdAt)}
            </span>
          </div>

          {/* Ingredients */}
          <section className="recipe-section">
            <h2>🧄 Nguyên liệu</h2>
            <ul>
              {recipe.ingredients?.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          {/* Instructions */}
          <section className="recipe-section">
            <h2>👨‍🍳 Cách làm</h2>
            <ol>
              {recipe.instructions?.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </section>

          {recipe.generatedByAI && (
            <div className="ai-badge">✨ Công thức do AI tạo</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailPage;
