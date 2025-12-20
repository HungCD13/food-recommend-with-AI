// import React, { useEffect } from "react";

// export default function Hero() {
//   useEffect(() => {
//     // Parallax background effect
//     const hero = document.querySelector(".hero");

//     function handleScroll() {
//       const offset = window.scrollY * 0.3;
//       hero.style.backgroundPosition = `center calc(50% + ${offset}px)`;
//     }

//     window.addEventListener("scroll", handleScroll);

//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const images = [
//     "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
//     "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
//     "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
//   ];

//   const randomImage = images[Math.floor(Math.random() * images.length)];

//   return (
//     <header
//       className="hero"
//       style={{
//         backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)),
//         url(${randomImage})`,
//       }}
//     >
//       <div className="hero-content">
//         <h1>Turn Ingredients into Art</h1>

//         <p>
//           Don't know what to cook? Enter your leftovers or available
//           ingredients, and let our AI Chef craft the perfect recipe for you.
//         </p>

//         <a href="#generator" className="btn btn-primary">
//           Start Cooking
//         </a>
//       </div>
//     </header>
//   );
// }
