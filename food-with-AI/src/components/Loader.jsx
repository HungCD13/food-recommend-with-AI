import "../index.css";

export default function Loader() {
  return (
    <div className="loader-container">
      <div className="pan-loader">
        <div className="loader">
          <div className="pan"></div>
          <div className="handle"></div>
          <div className="food-particle"></div>
          <div
            className="food-particle"
            style={{ animationDelay: "0.5s", left: "60%" }}
          ></div>
          <div
            className="food-particle"
            style={{ animationDelay: "1s", left: "40%" }}
          ></div>
        </div>
      </div>
      <h3>Chef AI is thinking...</h3>
    </div>
  );
}
