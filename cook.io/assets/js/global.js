"use strict";

/* =============================
        FETCH GPT (nếu cần)
   ============================= */
import { fetchRecommend } from "./api.js";

/* =============================
        AddEvent Helper
   ============================= */
window.addEventOnElements = ($elements, eventType, callback) => {
  for (const $element of $elements) {
    $element.addEventListener(eventType, callback);
  }
};

/* =============================
        Skeleton Card
   ============================= */
export const $skeletonCard = `
  <div class="card skeleton-card">
    <div class="skeleton card-banner"></div>
    <div class="card-body">
        <div class="skeleton card-title"></div>
        <div class="skeleton card-text"></div>
    </div>
  </div>
`;

/* =============================
        SAVE RECIPE
   ============================= */
window.saveRecipe = function (element, recipeId, data) {
  const key = `cookio-recipe-${recipeId}`;
  const isSaved = localStorage.getItem(key);

  if (!isSaved) {
    localStorage.setItem(key, JSON.stringify(data));
    element.classList.add("saved");
    element.classList.remove("removed");
    showNotification("Đã lưu món ăn!");
  } else {
    localStorage.removeItem(key);
    element.classList.remove("saved");
    element.classList.add("removed");
    showNotification("Đã xoá khỏi danh sách!");
  }
};

/* =============================
        FIX SNACKBAR SYSTEM
   ============================= */

/**
 * Vấn đề cũ:
 * Cook.io template dùng animationend để tự xoá snackbar.
 * Điều này gây bug: GPT Result cũng bị xoá theo do trùng animation.
 * 
 * Giải pháp:
 * - Giữ lại snackbar nhưng dùng setTimeout auto-remove.
 * - Không dùng animationend.
 * - Không đụng vào GPT result.
 */

const $snackbarContainer = document.createElement("div");
$snackbarContainer.classList.add("snackbar-container");
document.body.appendChild($snackbarContainer);

/**
 * Hiện thông báo nhỏ gọn
 * @param {string} message
 * @param {number} duration
 */
function showNotification(message, duration = 2500) {
  const $snackbar = document.createElement("div");
  $snackbar.classList.add("snackbar");
  $snackbar.innerHTML = `<p class="body-medium">${message}</p>`;

  $snackbarContainer.appendChild($snackbar);

  // Không dùng animationend nữa → tránh xóa nhầm GPT box
  setTimeout(() => {
    if ($snackbarContainer.contains($snackbar)) {
      $snackbar.remove();
    }
  }, duration);
}

window.showNotification = showNotification;

export { showNotification };
