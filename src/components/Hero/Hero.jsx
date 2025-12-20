import React from "react";
import "./Hero.css";

const Hero = () => {
  return (
    <div className="hero">
      <div className="hero-content">
        <h1 className="hero-title">Biến Nguyên Liệu Thành Món Ngon</h1>

        <p className="hero-subtitle">
          Khám phá công thức nấu ăn thông minh từ những nguyên liệu bạn đang có.
          Chỉ cần nhập nguyên liệu, AI sẽ gợi ý những món ăn sáng tạo cho bạn!
        </p>

        <div className="hero-features">
          <div className="feature">
            <div className="feature-icon">🍳</div>
            <h3>Dễ Dàng Sử Dụng</h3>
            <p>Nhập nguyên liệu đơn giản, nhận gợi ý ngay lập tức</p>
          </div>

          <div className="feature">
            <div className="feature-icon">🤖</div>
            <h3>AI Thông Minh</h3>
            <p>GPT-4 phân tích và đề xuất công thức phù hợp</p>
          </div>

          <div className="feature">
            <div className="feature-icon">⏱️</div>
            <h3>Tiết Kiệm Thời Gian</h3>
            <p>Không cần tìm kiếm công thức phức tạp</p>
          </div>

          <div className="feature">
            <div className="feature-icon">🌱</div>
            <h3>Giảm Lãng Phí</h3>
            <p>Tận dụng tối đa nguyên liệu có sẵn</p>
          </div>
        </div>

        <div className="hero-cta">
          <div className="hero-scroll">
            <span>Cuộn xuống để bắt đầu</span>
            <div className="scroll-arrow">↓</div>
          </div>
        </div>
      </div>

      <div className="hero-background">
        <div className="floating-ingredient">🍅</div>
        <div className="floating-ingredient">🥚</div>
        <div className="floating-ingredient">🥦</div>
        <div className="floating-ingredient">🍄</div>
        <div className="floating-ingredient">🥕</div>
        <div className="floating-ingredient">🧅</div>
        <div className="floating-ingredient">🌶️</div>
        <div className="floating-ingredient">🧄</div>
      </div>
    </div>
  );
};

export default Hero;
