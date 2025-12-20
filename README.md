# 🍳 FoodGPT – Gợi ý món ăn từ nguyên liệu có sẵn

## 🧠 Giới thiệu

FoodGPT là một ứng dụng web sử dụng **GPT API** và **RAG (Retrieval-Augmented Generation)**  
nhằm **gợi ý tên món ăn** phù hợp với **các nguyên liệu mà người dùng đang có**.

Người dùng chỉ cần nhập các nguyên liệu (ví dụ: “trứng, mì, hành lá”)  
👉 Hệ thống sẽ đề xuất các món ăn khả thi, kèm mô tả và hướng dẫn nấu.

---

## 🏗️ Công nghệ sử dụng

### ⚙️ Backend:

- **Node.js + Express** → Xây dựng API server
- **OpenAI GPT API** → Xử lý ngôn ngữ tự nhiên (gợi ý món ăn)
- **MongoDB ** → Lưu dữ liệu món ăn
- **LangChain** → Quản lý quy trình truy xuất và sinh câu trả lời từ GPT

### 💻 Frontend:

- **React.js (Vite)** → Giao diện web hiện đại
- **TailwindCSS** → Thiết kế nhanh, responsive
- **Axios** → Gửi request đến API backend
