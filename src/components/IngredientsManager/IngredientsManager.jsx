import React, { useState, useEffect } from "react";
import axios from "axios";
import "./IngredientsManager.css";

const IngredientsManager = () => {
  const [ingredients, setIngredients] = useState([]);
  const [newIngredient, setNewIngredient] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch ingredients từ API
  useEffect(() => {
    fetchIngredients();
  }, []);

  const fetchIngredients = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/ingredients");
      setIngredients(response.data);
      setError("");
    } catch (error) {
      setError("Không thể tải danh sách nguyên liệu");
      console.error("Error fetching ingredients:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddIngredient = async (e) => {
    e.preventDefault();

    if (!newIngredient.trim()) {
      setError("Vui lòng nhập tên nguyên liệu");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Vui lòng đăng nhập để thêm nguyên liệu");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/api/ingredients",
        { name: newIngredient },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSuccess("Thêm nguyên liệu thành công!");
      setNewIngredient("");
      fetchIngredients();

      // Tự động xóa thông báo sau 3 giây
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      const message =
        error.response?.data?.message || "Lỗi khi thêm nguyên liệu";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteIngredient = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa nguyên liệu này?")) {
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Vui lòng đăng nhập để xóa nguyên liệu");
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`http://localhost:5000/api/ingredients/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess("Xóa nguyên liệu thành công!");
      fetchIngredients();

      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      const message =
        error.response?.data?.message || "Lỗi khi xóa nguyên liệu";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdd = (ingredient) => {
    setNewIngredient(ingredient);
  };

  // Common ingredients for quick add
  const commonIngredients = [
    "Chicken",
    "Beef",
    "Pork",
    "Fish",
    "Shrimp",
    "Egg",
    "Milk",
    "Cheese",
    "Butter",
    "Yogurt",
    "Rice",
    "Pasta",
    "Bread",
    "Flour",
    "Potato",
    "Tomato",
    "Onion",
    "Garlic",
    "Carrot",
    "Broccoli",
    "Spinach",
    "Lettuce",
    "Cucumber",
    "Bell Pepper",
    "Mushroom",
    "Lemon",
    "Lime",
    "Orange",
    "Apple",
    "Banana",
    "Avocado",
    "Olive Oil",
    "Soy Sauce",
    "Salt",
    "Pepper",
    "Sugar",
    "Honey",
    "Vinegar",
    "Basil",
    "Thyme",
  ];

  return (
    <div className="ingredients-manager">
      <div className="container">
        {/* Header */}
        <div className="header-section">
          <h1>
            <i className="fas fa-carrot"></i>
            Quản Lý Nguyên Liệu
          </h1>
          <p className="subtitle">
            Thêm, xem và quản lý các nguyên liệu trong hệ thống
          </p>
        </div>

        {/* Add Ingredient Form */}
        <div className="form-section">
          <div className="form-card">
            <h3>
              <i className="fas fa-plus-circle"></i>
              Thêm Nguyên Liệu Mới
            </h3>

            {error && (
              <div className="error-message">
                <i className="fas fa-exclamation-circle"></i>
                {error}
              </div>
            )}

            {success && (
              <div className="success-message">
                <i className="fas fa-check-circle"></i>
                {success}
              </div>
            )}

            <form onSubmit={handleAddIngredient} className="add-form">
              <div className="input-group">
                <input
                  type="text"
                  value={newIngredient}
                  onChange={(e) => setNewIngredient(e.target.value)}
                  placeholder="Nhập tên nguyên liệu (ví dụ: thịt gà, cà chua, tỏi...)"
                  className="ingredient-input"
                  disabled={loading}
                />
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={loading || !newIngredient.trim()}
                >
                  {loading ? (
                    <div className="spinner"></div>
                  ) : (
                    <>
                      <i className="fas fa-plus"></i>
                      Thêm
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Quick Add Suggestions */}
            <div className="quick-add">
              <p className="quick-add-title">Thêm nhanh:</p>
              <div className="quick-buttons">
                {commonIngredients.slice(0, 8).map((ing, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleQuickAdd(ing)}
                    className="quick-btn"
                  >
                    {ing}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Ingredients List */}
        <div className="list-section">
          <div className="list-header">
            <h3>
              <i className="fas fa-list"></i>
              Danh Sách Nguyên Liệu ({ingredients.length})
            </h3>
            <button
              onClick={fetchIngredients}
              className="refresh-btn"
              disabled={loading}
            >
              <i className="fas fa-sync-alt"></i>
              Làm mới
            </button>
          </div>

          {loading && ingredients.length === 0 ? (
            <div className="loading-state">
              <div className="spinner-large"></div>
              <p>Đang tải danh sách nguyên liệu...</p>
            </div>
          ) : ingredients.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-inbox"></i>
              <h4>Chưa có nguyên liệu nào</h4>
              <p>Hãy thêm nguyên liệu đầu tiên của bạn!</p>
            </div>
          ) : (
            <div className="ingredients-grid">
              {ingredients.map((ingredient) => (
                <div key={ingredient._id} className="ingredient-card">
                  <div className="ingredient-content">
                    <div className="ingredient-icon">
                      <i className="fas fa-leaf"></i>
                    </div>
                    <div className="ingredient-info">
                      <h4 className="ingredient-name">{ingredient.name}</h4>
                      <span className="ingredient-date">
                        Thêm:{" "}
                        {new Date(ingredient.createdAt).toLocaleDateString(
                          "vi-VN"
                        )}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteIngredient(ingredient._id)}
                    className="delete-btn"
                    disabled={loading}
                    title="Xóa nguyên liệu"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tips Section */}
        <div className="tips-section">
          <div className="tip-card">
            <i className="fas fa-lightbulb"></i>
            <h5>Mẹo sử dụng</h5>
            <ul>
              <li>Sử dụng tên nguyên liệu rõ ràng, dễ hiểu</li>
              <li>Thêm đầy đủ các loại gia vị và thảo mộc</li>
              <li>Kiểm tra trước khi thêm để tránh trùng lặp</li>
              <li>Xóa các nguyên liệu không còn sử dụng</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IngredientsManager;
