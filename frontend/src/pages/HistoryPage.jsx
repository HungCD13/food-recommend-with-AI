import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  Flame,
  ChefHat,
  Calendar,
  Search,
  ArrowUpDown,
  Trash2,
  BookOpen,
  Share2,
  Download,
} from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import "./HistoryPage.css";
import khoaiTayImg from "../assets/images/khoaitay.png";
import chuoiImg from "../assets/images/chuoi.png";
import comImg from "../assets/images/com.png";
import miImg from "../assets/images/mi.png";
import phoImg from "../assets/images/pho.png";
import gaImg from "../assets/images/ga.png";
import heoImg from "../assets/images/heo.png";
import boImg from "../assets/images/bo.png";
import trungImg from "../assets/images/trung.png";

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const navigate = useNavigate();

  // Categories for filtering
  const categories = [
    { id: "all", name: "Tất cả", icon: "🍽️" },
    { id: "breakfast", name: "Bữa sáng", icon: "☕" },
    { id: "lunch", name: "Bữa trưa", icon: "🍱" },
    { id: "dinner", name: "Bữa tối", icon: "🍛" },
    { id: "snack", name: "Ăn nhẹ", icon: "🍪" },
    { id: "dessert", name: "Tráng miệng", icon: "🍰" },
    { id: "vegetarian", name: "Chay", icon: "🥦" },
  ];

  // Fetch history data
  useEffect(() => {
    fetchHistory();
  }, []);

  // Filter and sort history
  useEffect(() => {
    let result = [...history];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.ingredients &&
            Array.isArray(item.ingredients) &&
            item.ingredients.some((ing) =>
              ing.toLowerCase().includes(searchTerm.toLowerCase())
            )) ||
          (item.rawIngredients &&
            item.rawIngredients
              .toLowerCase()
              .includes(searchTerm.toLowerCase()))
      );
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      const categoryKeywords = {
        breakfast: ["sáng", "breakfast", "bữa sáng"],
        lunch: ["trưa", "lunch", "bữa trưa"],
        dinner: ["tối", "dinner", "bữa tối"],
        snack: ["nhẹ", "snack", "ăn nhẹ", "snack"],
        dessert: ["tráng miệng", "dessert", "ngọt", "bánh", "kem"],
        vegetarian: ["chay", "vegetarian", "rau", "đậu"],
      };

      if (categoryKeywords[selectedCategory]) {
        const keywords = categoryKeywords[selectedCategory];
        result = result.filter((item) =>
          keywords.some(
            (keyword) =>
              item.title.toLowerCase().includes(keyword) ||
              (item.ingredients &&
                Array.isArray(item.ingredients) &&
                item.ingredients.some((ing) =>
                  ing.toLowerCase().includes(keyword)
                ))
          )
        );
      }
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "calories-low":
          return (a.calories || 0) - (b.calories || 0);
        case "calories-high":
          return (b.calories || 0) - (a.calories || 0);
        case "time-low":
          return (a.time || 0) - (b.time || 0);
        case "time-high":
          return (b.time || 0) - (a.time || 0);
        default:
          return 0;
      }
    });

    setFilteredHistory(result);
  }, [history, searchTerm, selectedCategory, sortBy]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Vui lòng đăng nhập để xem lịch sử");
        navigate("/login");
        return;
      }

      // Gọi API mới
      const response = await axios.get("http://localhost:5000/api/history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Kiểm tra cấu trúc response
      if (response.data.success && response.data.data) {
        setHistory(response.data.data);
      } else if (Array.isArray(response.data)) {
        setHistory(response.data);
      } else {
        setHistory([]);
      }

      toast.success("Đã tải lịch sử thành công!");
    } catch (error) {
      console.error("Error fetching history:", error);

      if (error.response?.status === 401) {
        toast.error("Phiên đăng nhập đã hết hạn");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        toast.error("Không thể tải lịch sử");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Không xác định";

      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        return "Hôm nay";
      } else if (diffDays === 1) {
        return "Hôm qua";
      } else if (diffDays < 7) {
        return `${diffDays} ngày trước`;
      } else {
        return date.toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      }
    } catch {
      return "Không xác định";
    }
  };

  const handleRecipeClick = (recipe) => {
    navigate(`/recipe/${recipe._id}`, { state: { recipe } });
  };

  const handleShareRecipe = async (recipe) => {
    try {
      const shareData = {
        title: recipe.title,
        text: `🍳 ${recipe.title}\n⏱️ ${recipe.time || 0} phút\n🔥 ${
          recipe.calories || 0
        } calories\n\n${
          Array.isArray(recipe.instructions)
            ? recipe.instructions.join("\n").substring(0, 200)
            : recipe.instructions?.substring(0, 200) || ""
        }...`,
        url: window.location.href,
      };

      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.text);
        toast.success("Đã sao chép công thức vào clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
      toast.error("Không thể chia sẻ công thức");
    }
  };

  const handleDeleteRecipe = async (recipeId, e) => {
    e.stopPropagation();
    if (window.confirm("Bạn có chắc muốn xóa công thức này?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/history/${recipeId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setHistory(history.filter((item) => item._id !== recipeId));
        toast.success("Đã xóa công thức!");
      } catch (error) {
        console.error("Error deleting recipe:", error);
        toast.error("Không thể xóa công thức");
      }
    }
  };

  const handleExportHistory = () => {
    if (filteredHistory.length === 0) {
      toast.warning("Không có dữ liệu để xuất");
      return;
    }

    const exportData = filteredHistory.map((item) => ({
      "Tên món": item.title,
      "Nguyên liệu": Array.isArray(item.ingredients)
        ? item.ingredients.join(", ")
        : item.ingredients || "",
      "Hướng dẫn": Array.isArray(item.instructions)
        ? item.instructions.join("\n")
        : item.instructions || "",
      "Thời gian (phút)": item.time || 0,
      Calories: item.calories || 0,
      "Ngày tạo": item.createdAt ? formatDate(item.createdAt) : "",
      "Nguyên liệu gốc": item.rawIngredients || "",
    }));

    const csvContent = [
      Object.keys(exportData[0]).join(","),
      ...exportData.map((row) =>
        Object.values(row)
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `lich-su-cong-thuc-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Đã xuất lịch sử thành file CSV!");
  };

  const handleClearHistory = async () => {
    if (window.confirm("Bạn có chắc muốn xóa toàn bộ lịch sử?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete("http://localhost:5000/api/history", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setHistory([]);
        toast.success("Đã xóa toàn bộ lịch sử!");
      } catch (error) {
        console.error("Error clearing history:", error);
        toast.error("Không thể xóa lịch sử");
      }
    }
  };

  const toggleSelectRecipe = (recipeId) => {
    setSelectedRecipes((prev) =>
      prev.includes(recipeId)
        ? prev.filter((id) => id !== recipeId)
        : [...prev, recipeId]
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedRecipes.length === 0) return;

    if (
      window.confirm(
        `Bạn có chắc muốn xóa ${selectedRecipes.length} công thức đã chọn?`
      )
    ) {
      try {
        const token = localStorage.getItem("token");

        // Xóa từng cái một để đảm bảo không lỗi
        for (const id of selectedRecipes) {
          try {
            await axios.delete(`http://localhost:5000/api/history/${id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
          } catch {
            // Thử endpoint cũ
            await axios.delete(`http://localhost:5000/api/ai/history/${id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
          }
        }

        setHistory(
          history.filter((item) => !selectedRecipes.includes(item._id))
        );
        setSelectedRecipes([]);
        toast.success(`Đã xóa ${selectedRecipes.length} công thức!`);
      } catch (error) {
        console.error("Error deleting selected recipes:", error);
        toast.error("Không thể xóa công thức đã chọn");
      }
    }
  };

  // Hàm format ingredients để hiển thị
  const formatIngredients = (ingredients) => {
    if (!ingredients) return "Không có";
    if (Array.isArray(ingredients)) {
      return ingredients.join(", ");
    }
    return ingredients;
  };

  // Hàm format instructions để hiển thị
  const formatInstructions = (instructions) => {
    if (!instructions) return "Không có hướng dẫn";
    if (Array.isArray(instructions)) {
      return instructions.join(" ");
    }
    return instructions;
  };

  if (loading) {
    return (
      <div className="history-loading">
        <div className="loading-spinner"></div>
        <p>Đang tải lịch sử...</p>
      </div>
    );
  }

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

  const getLocalFoodImage = (title = "") => {
    const lowerTitle = title.toLowerCase();

    for (const item of foodImageMap) {
      if (item.keywords.some((kw) => lowerTitle.includes(kw))) {
        return item.image;
      }
    }
    return null;
  };

  return (
    <div className="history-page">
      {/* Header */}
      <header className="history-header">
        <div className="header-main">
          <div className="header-left">
            <h1 className="history-title">
              <BookOpen className="title-icon" />
              Lịch Sử Công Thức
            </h1>
            <p className="history-subtitle">
              Tổng hợp các công thức AI đã tạo cho bạn
            </p>
          </div>
          <div className="header-right">
            <div className="stat-card">
              <div className="stat-content">
                <span className="stat-number">{history.length}</span>
                <span className="stat-label">Công thức</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="history-main">
        {/* Filter Controls */}
        <div className="filter-section">
          <div className="search-container">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm công thức hoặc nguyên liệu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-controls">
            <div className="category-scroll-container">
              <div className="category-tags">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    className={`category-tag ${
                      selectedCategory === category.id ? "active" : ""
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <span className="tag-emoji">{category.icon}</span>
                    <span className="tag-name">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="action-controls">
              <div className="sort-control">
                <ArrowUpDown className="sort-icon" size={16} />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="oldest">Cũ nhất</option>
                  <option value="calories-low">Calories thấp nhất</option>
                  <option value="calories-high">Calories cao nhất</option>
                  <option value="time-low">Thời gian ngắn nhất</option>
                  <option value="time-high">Thời gian dài nhất</option>
                </select>
              </div>

              <div className="control-buttons">
                <button
                  className="control-btn export-btn"
                  onClick={handleExportHistory}
                  disabled={filteredHistory.length === 0}
                >
                  <Download className="btn-icon" size={16} />
                  <span>Xuất CSV</span>
                </button>

                <button
                  className="control-btn delete-btn"
                  onClick={handleClearHistory}
                  disabled={history.length === 0}
                >
                  <Trash2 className="btn-icon" size={16} />
                  <span>Xóa tất cả</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Recipes Actions */}
        {selectedRecipes.length > 0 && (
          <div className="bulk-actions-bar">
            <div className="bulk-info">
              <span className="selected-count">
                Đã chọn {selectedRecipes.length} công thức
              </span>
            </div>
            <div className="bulk-buttons">
              <button
                className="bulk-delete-btn"
                onClick={handleDeleteSelected}
              >
                <Trash2 size={16} />
                <span>Xóa đã chọn</span>
              </button>
              <button
                className="bulk-cancel-btn"
                onClick={() => setSelectedRecipes([])}
              >
                Hủy chọn
              </button>
            </div>
          </div>
        )}

        {/* Recipes Grid */}
        <div className="history-content">
          {filteredHistory.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <h3 className="empty-title">
                {searchTerm || selectedCategory !== "all"
                  ? "Không tìm thấy công thức phù hợp"
                  : "Chưa có công thức nào"}
              </h3>
              <p className="empty-description">
                {searchTerm || selectedCategory !== "all"
                  ? "Hãy thử từ khóa khác hoặc đổi bộ lọc"
                  : "Bắt đầu tạo công thức AI đầu tiên của bạn!"}
              </p>
              <button
                className="create-recipe-btn"
                onClick={() => navigate("/")}
              >
                <ChefHat size={18} />
                <span>Tạo công thức ngay</span>
              </button>
            </div>
          ) : (
            <div className="recipes-grid">
              {filteredHistory.map((item) => {
                const localImage = getLocalFoodImage(item.title);

                return (
                  <div
                    key={item._id}
                    className={`recipe-card ${
                      selectedRecipes.includes(item._id) ? "selected" : ""
                    }`}
                    onClick={() => handleRecipeClick(item)}
                  >
                    {/* Selection Checkbox */}
                    <div
                      className="card-checkbox"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelectRecipe(item._id);
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedRecipes.includes(item._id)}
                        onChange={() => {}}
                        className="checkbox-input"
                      />
                    </div>

                    {/* Recipe Image - 3/5 height */}
                    <div className="card-image-container">
                      <div className="card-image">
                        <img
                          src={localImage || item.image}
                          alt={item.title}
                          className="recipe-img"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = localImage || "/fallback-food.png";
                          }}
                        />
                        {/* <div className="image-overlay">
                          <span className="recipe-date">
                            <Calendar size={14} />
                            {formatDate(item.createdAt)}
                          </span>
                        </div> */}
                      </div>
                    </div>

                    {/* Recipe Content - 2/5 height */}
                    <div className="card-content-container">
                      <div className="card-content">
                        <h3 className="recipe-title">{item.title}</h3>

                        <div className="recipe-meta">
                          <div className="meta-row">
                            <div className="meta-item">
                              <Clock size={16} />
                              <div className="meta-info">
                                <span className="meta-label">Thời gian</span>
                                <span className="meta-value">
                                  {item.time || "--"} phút
                                </span>
                              </div>
                            </div>

                            <div className="meta-item">
                              <Flame size={16} />
                              <div className="meta-info">
                                <span className="meta-label">Calories</span>
                                <span className="meta-value">
                                  {item.calories || "--"} cal
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="recipe-actions">
                          <button
                            className="action-btn view-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRecipeClick(item);
                            }}
                          >
                            Xem chi tiết
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default HistoryPage;
