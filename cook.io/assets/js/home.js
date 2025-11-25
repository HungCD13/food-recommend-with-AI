"use strict";

import { fetchRecommend } from "./api.js";

// Show result box
const resultBox = document.getElementById("gptResult");
resultBox.style.display = "block";
resultBox.innerText = data.result;
const searchBtn = document.querySelector("[data-search-btn]");
const searchInput = document.querySelector("[data-search-field]");
const gptResultBox = document.getElementById("gptResult");

document.addEventListener("DOMContentLoaded", () => {

  // Thanh search trên banner
  const searchInput = document.querySelector("[data-search-field]");
  const searchBtn = document.querySelector("[data-search-btn]");

  searchBtn.addEventListener("click", async () => {
    const query = searchInput.value.trim();

    if (!query) {
      alert("⚠️ Vui lòng nhập món muốn tìm!");
      return;
    }

    // Query được xem như "prompt"
    const ingredients = [query];     // tạm xem từ khóa như nguyên liệu / món
    const prompt = `Hãy mô tả món ăn "${query}" gồm: 
    - Tên món 
    - Nguyên liệu 
    - Cách nấu 
    - Mô tả ngắn gọn
    - Nếu có thể hãy gợi ý 1 hình ảnh phù hợp (link Unsplash hoặc mô tả ảnh)`;

    // Tạo popup loading
    showPopup("⏳ Đang tìm món ăn...");

    const res = await fetchRecommend(ingredients, prompt);

    hidePopup();

    if (!res.result) {
      alert("❌ Không tìm thấy món ăn phù hợp!");
      return;
    }

    // Lưu kết quả vào localStorage để trang recipes.html đọc
    localStorage.setItem("gptSearchResult", res.result);

    // Chuyển đến trang kết quả
    window.location.href = "./recipes.html?search=" + encodeURIComponent(query);
  });
});


// Popup UI
function showPopup(text) {
  let p = document.createElement("div");
  p.id = "gptPopup";
  p.style.position = "fixed";
  p.style.top = "0";
  p.style.left = "0";
  p.style.width = "100%";
  p.style.height = "100%";
  p.style.background = "rgba(0,0,0,0.6)";
  p.style.display = "flex";
  p.style.alignItems = "center";
  p.style.justifyContent = "center";
  p.style.color = "#fff";
  p.style.fontSize = "22px";
  p.style.zIndex = "999999";
  p.innerText = text;
  document.body.appendChild(p);
}

function hidePopup() {
  const p = document.querySelector("#gptPopup");
  if (p) p.remove();
}
