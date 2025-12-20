"use strict";

/**
 * Gửi request đến backend của bạn để lấy gợi ý món ăn từ GPT
 * @param {Array} ingredients - Danh sách nguyên liệu
 * @param {String} prompt - Prompt yêu cầu của người dùng
 * @param {Function} successCallback - Hàm callback khi thành công
 */
export const fetchData = async function (ingredients, prompt, successCallback) {
    try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:5000/api/recipes/recommend", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token ? `Bearer ${token}` : ""
            },
            body: JSON.stringify({
                ingredients,
                prompt
            })
        });

        const data = await response.json();
        successCallback(data);
    } catch (error) {
        console.error("❌ Lỗi gọi API GPT:", error);
    }
};
