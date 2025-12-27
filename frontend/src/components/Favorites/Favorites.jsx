import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Favorites.css";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Vui lòng đăng nhập để xem món yêu thích");
        setLoading(false);
        return;
      }

      const response = await axios.get("http://localhost:5000/api/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFavorites(response.data);
      setError("");
    } catch (error) {
      console.error("Error fetching favorites:", error);
      if (error.response?.status === 401) {
        setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      } else {
        setError("Không thể tải danh sách món yêu thích");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (recipe) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Vui lòng đăng nhập để thao tác");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/favorites/toggle",
        { recipe },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refresh list
      fetchFavorites();
    } catch (error) {
      console.error("Error toggling favorite:", error);
      setError("Không thể cập nhật món yêu thích");
    }
  };

  const handleRemoveFavorite = async (id) => {
    if (
      !window.confirm(
        "Bạn có chắc chắn muốn xóa món ăn khỏi danh sách yêu thích?"
      )
    ) {
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Vui lòng đăng nhập để thao tác");
      return;
    }

    try {
      setRemovingId(id);
      await axios.delete(`http://localhost:5000/api/favorites/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update UI immediately
      setFavorites(favorites.filter((fav) => fav._id !== id));
    } catch (error) {
      console.error("Error removing favorite:", error);
      setError("Không thể xóa món yêu thích");
    } finally {
      setRemovingId(null);
    }
  };

  const handleShareRecipe = (recipe) => {
    const recipeUrl = `${
      window.location.origin
    }/recipe?title=${encodeURIComponent(recipe.title)}`;
    if (navigator.share) {
      navigator.share({
        title: recipe.title,
        text: `Món ngon: ${recipe.title}`,
        url: recipeUrl,
      });
    } else {
      navigator.clipboard.writeText(recipeUrl);
      alert("Đã sao chép liên kết món ăn!");
    }
  };

  if (loading) {
    return (
      <div className="favorites-page">
        <div className="loading-container">
          <div className="heart-loader">
            <div className="heart"></div>
            <div className="heart-pulse"></div>
          </div>
          <p>Đang tải món yêu thích...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <div className="favorites-container">
        {/* Header */}
        <div className="favorites-header">
          <h1 className="title">
            <i className="fas fa-heart"></i>
            Món Ăn Yêu Thích
          </h1>
          <p className="subtitle">
            {favorites.length > 0
              ? `Bạn có ${favorites.length} món ăn yêu thích`
              : "Thêm món ăn vào danh sách yêu thích của bạn"}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-section">
            <div className="error-card">
              <i className="fas fa-exclamation-circle"></i>
              <p>{error}</p>
              {error.includes("đăng nhập") && (
                <Link to="/login" className="login-link">
                  Đăng nhập ngay
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!error && favorites.length === 0 ? (
          <div className="empty-favorites">
            <div className="empty-content">
              <i className="fas fa-heart-broken"></i>
              <h3>Chưa có món yêu thích</h3>
              <p>Hãy tìm kiếm và lưu những món ăn bạn yêu thích!</p>
              <Link to="/" className="find-recipes-btn">
                <i className="fas fa-search"></i>
                Tìm món ăn ngay
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="favorites-stats">
              <div className="stat-card">
                <i className="fas fa-heart"></i>
                <div className="stat-content">
                  <span className="stat-number">{favorites.length}</span>
                  <span className="stat-label">Món yêu thích</span>
                </div>
              </div>
              <div className="stat-card">
                <i className="fas fa-clock"></i>
                <div className="stat-content">
                  <span className="stat-number">
                    {favorites.length > 0
                      ? Math.round(
                          favorites.reduce((acc, fav) => {
                            const time = parseInt(fav.recipe.time) || 0;
                            return acc + time;
                          }, 0) / favorites.length
                        )
                      : 0}
                  </span>
                  <span className="stat-label">Phút trung bình</span>
                </div>
              </div>
              <div className="stat-card">
                <i className="fas fa-fire"></i>
                <div className="stat-content">
                  <span className="stat-number">
                    {favorites.length > 0
                      ? Math.round(
                          favorites.reduce((acc, fav) => {
                            const calories = parseInt(fav.recipe.calories) || 0;
                            return acc + calories;
                          }, 0) / favorites.length
                        )
                      : 0}
                  </span>
                  <span className="stat-label">Calories TB</span>
                </div>
              </div>
            </div>

            {/* Favorites Grid */}
            <div className="favorites-grid">
              {favorites.map((favorite) => (
                <div key={favorite._id} className="favorite-card">
                  {/* Recipe Image */}
                  <div className="recipe-image">
                    <img
                      src={
                        favorite.recipe.image ||
                        "https://source.unsplash.com/900x900/?food"
                      }
                      alt={favorite.recipe.title}
                      loading="lazy"
                    />
                    <div className="image-overlay"></div>
                    <button
                      className="favorite-btn active"
                      onClick={() => handleToggleFavorite(favorite.recipe)}
                      title="Bỏ yêu thích"
                    >
                      <i className="fas fa-heart"></i>
                    </button>
                  </div>

                  {/* Recipe Content */}
                  <div className="recipe-content">
                    <div className="recipe-header">
                      <h3 className="recipe-title">{favorite.recipe.title}</h3>
                      <span className="recipe-date">
                        {new Date(favorite.createdAt).toLocaleDateString(
                          "vi-VN"
                        )}
                      </span>
                    </div>

                    {/* Recipe Meta */}
                    <div className="recipe-meta">
                      <span className="meta-item">
                        <i className="fas fa-clock"></i>
                        {favorite.recipe.time || "30 phút"}
                      </span>
                      <span className="meta-item">
                        <i className="fas fa-fire"></i>
                        {favorite.recipe.calories || "300 kcal"}
                      </span>
                    </div>

                    {/* Ingredients Preview */}
                    <div className="ingredients-preview">
                      <h4>Nguyên liệu chính:</h4>
                      <div className="ingredient-tags">
                        {favorite.recipe.ingredients
                          ?.slice(0, 3)
                          .map((ing, idx) => (
                            <span key={idx} className="ingredient-tag">
                              {ing}
                            </span>
                          ))}
                        {favorite.recipe.ingredients?.length > 3 && (
                          <span className="more-ingredients">
                            +{favorite.recipe.ingredients.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="action-buttons">
                      <Link
                        to="/recipe"
                        state={{ recipe: favorite.recipe }}
                        className="view-recipe-btn"
                      >
                        <i className="fas fa-book-open"></i>
                        Xem công thức
                      </Link>
                      <button
                        className="action-btn share-btn"
                        onClick={() => handleShareRecipe(favorite.recipe)}
                      >
                        <i className="fas fa-share-alt"></i>
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleRemoveFavorite(favorite._id)}
                        disabled={removingId === favorite._id}
                      >
                        {removingId === favorite._id ? (
                          <div className="mini-spinner"></div>
                        ) : (
                          <i className="fas fa-trash"></i>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tips */}
            <div className="favorites-tips">
              <div className="tips-card">
                <i className="fas fa-lightbulb"></i>
                <div className="tips-content">
                  <h4>Mẹo sử dụng danh sách yêu thích</h4>
                  <ul>
                    <li>Lưu lại những công thức bạn muốn nấu lại</li>
                    <li>Sắp xếp món ăn theo ngày thêm vào</li>
                    <li>Chia sẻ công thức với bạn bè</li>
                    <li>Xóa những món không còn phù hợp</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Favorites;
