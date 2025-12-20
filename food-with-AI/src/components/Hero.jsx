import { useState } from "react";
import "../index.css";

export default function Hero() {
  const images = [
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
  ];

  const randomImage = images[Math.floor(Math.random() * images.length)];

  return (
    <header
      className="hero"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)),
        url(${randomImage})`,
      }}
    >
      <div className="hero-content">
        <h1>Turn Ingredients into Art</h1>
        <p>
          Don't know what to cook? Enter your available ingredients and let AI
          create a recipe.
        </p>
        <a href="#generator" className="btn btn-primary">
          Start Cooking
        </a>
      </div>
    </header>
  );
}
