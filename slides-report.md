# Slide Báo Cáo Thực Tập Tốt Nghiệp

## Đề Tài: Gợi Ý Món Ăn Từ Nguyên Liệu Có Sẵn Sử Dụng GPT API

---

## Slide 1: Trang Bìa
- **Tiêu đề:** Gợi Ý Món Ăn Từ Nguyên Liệu Có Sẵn Sử Dụng GPT API
- **Tên sinh viên:** [Tên của bạn]
- **Mã sinh viên:** [Mã SV]
- **Giảng viên hướng dẫn:** [Tên GV]
- **Thời gian thực tập:** [Tháng/Năm]
- **Logo trường/Đại học**

---

## Slide 2: Mục Lục
1. Giới thiệu đề tài
2. Mục tiêu và phạm vi
3. Công nghệ sử dụng
4. Phân tích yêu cầu
5. Thiết kế hệ thống
6. Triển khai
7. Kết quả và demo
8. Thách thức và giải pháp
9. Kết luận
10. Tài liệu tham khảo

---

## Slide 3: Giới Thiệu Đề Tài
- **Bối cảnh:** Trong cuộc sống hàng ngày, nhiều người gặp khó khăn trong việc quyết định món ăn từ nguyên liệu sẵn có, dẫn đến lãng phí thực phẩm.
- **Giải pháp:** Xây dựng ứng dụng web sử dụng AI (GPT API) để gợi ý món ăn phù hợp.
- **Ý nghĩa:** Giảm lãng phí, tiết kiệm thời gian, hỗ trợ nấu ăn sáng tạo.

---

## Slide 4: Mục Tiêu và Phạm Vi
- **Mục tiêu:**
  - Phát triển ứng dụng web gợi ý món ăn từ nguyên liệu nhập vào.
  - Tích hợp GPT API để xử lý ngôn ngữ tự nhiên.
  - Lưu trữ lịch sử gợi ý cho người dùng.
- **Phạm vi:**
  - Frontend: React.js
  - Backend: Node.js + Express
  - Database: MongoDB
  - AI: OpenAI GPT API

---

## Slide 5: Công Nghệ Sử Dụng
- **Backend:**
  - Node.js + Express: Xây dựng API server
  - OpenAI GPT API: Xử lý gợi ý món ăn
  - MongoDB: Lưu dữ liệu người dùng và lịch sử
  - JWT: Xác thực người dùng
- **Frontend:**
  - React.js (Vite): Giao diện người dùng
  - TailwindCSS: Thiết kế responsive
  - Axios: Gọi API
- **Công cụ khác:** Git, VS Code, Postman

---

## Slide 6: Phân Tích Yêu Cầu
- **Yêu cầu chức năng:**
  - Nhập nguyên liệu (dạng text, phân cách bằng dấu phẩy)
  - Gửi đến backend để xử lý với GPT
  - Hiển thị kết quả: Tên món, nguyên liệu, cách làm
  - Lưu lịch sử cho người dùng đăng nhập
- **Yêu cầu phi chức năng:**
  - Giao diện thân thiện, responsive
  - Thời gian phản hồi nhanh (< 5s)
  - Bảo mật thông tin người dùng

---

## Slide 7: Thiết Kế Hệ Thống
- **Kiến trúc tổng quan:**
  - [Sơ đồ: Frontend ↔ Backend API ↔ GPT API ↔ Database]
- **Cơ sở dữ liệu:**
  - Collection Users: id, username, email, password
  - Collection History: userId, ingredients, prompt, result, timestamp
- **API Endpoints:**
  - POST /api/recipes/generate: Gợi ý món ăn
  - GET /api/recipes/history/:id: Lấy lịch sử

---

## Slide 8: Triển Khai (Backend)
- **Server.js:** Khởi tạo Express, kết nối MongoDB, định tuyến
- **RecipeController.js:** Xử lý logic gợi ý, gọi GPT API
  - Parse nguyên liệu từ string sang array
  - Tạo prompt cho GPT
  - Lưu log và lịch sử
- **Models:** Định nghĩa schema cho User và History

---

## Slide 9: Triển Khai (Frontend)
- **App.jsx:** Cấu trúc chính với các component
- **Generator.jsx:** Component nhập nguyên liệu, gọi API
  - State management cho loading, error, recipe
  - Xử lý sự kiện: Generate, Surprise Me, Clear
- **Services/api.jsx:** Hàm generateRecipe gọi backend
- **Các component khác:** NavBar, Hero, Footer, SavedRecipes

---

## Slide 10: Kết Quả và Demo
- **Chức năng chính:**
  - Nhập "trứng, mì, hành lá" → Gợi ý "Mì xào trứng"
- **Demo screenshots:**
  - Giao diện nhập nguyên liệu
  - Kết quả gợi ý
  - Lịch sử người dùng
- **Thống kê:** [Số lượng món gợi ý, thời gian phản hồi trung bình]

---

## Slide 11: Thách Thức và Giải Pháp
- **Thách thức:**
  - Xử lý prompt cho GPT để trả lời chính xác, không lan man
  - Quản lý lỗi API (rate limit, network)
  - Bảo mật API key
- **Giải pháp:**
  - Tạo prompt cụ thể, yêu cầu format JSON
  - Try-catch, retry logic
  - Sử dụng .env cho API key

---

## Slide 12: Kết Luận
- **Đạt được:** Ứng dụng hoạt động ổn định, gợi ý chính xác
- **Học được:** Kiến thức về AI integration, full-stack development
- **Hướng phát triển:** Thêm hình ảnh món ăn, tích hợp camera nhận diện nguyên liệu, đa ngôn ngữ

---

## Slide 13: Tài Liệu Tham Khảo
- OpenAI GPT API Documentation
- React.js Official Docs
- Node.js Express Guide
- MongoDB Manual
- [Các nguồn khác nếu có]

---

*Lưu ý: Thay thế [ ] bằng thông tin cụ thể của bạn. Sử dụng hình ảnh, biểu đồ để làm slide sinh động hơn.*