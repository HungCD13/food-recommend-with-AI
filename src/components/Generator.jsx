// import React, { useState } from "react";
// import RecipeCard from "./RecipeCard";
// import SavedRecipes from "./SavedRecipes";

// export default function Generator() {
//   const [ingredients, setIngredients] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(false);
//   const [recipe, setRecipe] = useState(null);
//   const [saved, setSaved] = useState(false);

//   // ==========================
//   //   CALL API CREATE RECIPE
//   // ==========================
//   const handleSave = () => {
//     setSaved((prev) => !prev);
//   };

//   const handleGenerate = async (isRandom = false) => {
//     if (!ingredients.trim() && !isRandom) {
//       setError(true);
//       shakeInput();
//       return;
//     }

//     setError(false);
//     setLoading(true);
//     setRecipe(null);

//     try {
//       const bodyData = isRandom ? { random: true } : { ingredients };

//       const res = await fetch("http://localhost:5000/api/recipes/recommend", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(bodyData),
//       });

//       const data = await res.json();
//       setRecipe(data);
//       setSaved(false); // reset nút save

//       scrollToResult();
//     } catch (err) {
//       console.error("API error:", err);
//       setError(true);
//     }

//     setLoading(false);
//   };

//   const shakeInput = () => {
//     const el = document.getElementById("ingredients");
//     if (!el) return;
//     el.style.animation = "shake .5s";
//     setTimeout(() => (el.style.animation = ""), 500);
//   };

//   const scrollToResult = () => {
//     setTimeout(() => {
//       const el = document.getElementById("result");
//       if (el) el.scrollIntoView({ behavior: "smooth" });
//     }, 100);
//   };

//   // ==========================
//   //   SAVE BUTTON HANDLER
//   // ==========================
//   const handleToggleSave = () => {
//     if (!recipe) return;

//     // Lấy danh sách cũ
//     let savedList = JSON.parse(localStorage.getItem("cookio_saved")) || [];

//     // Kiểm tra đã tồn tại chưa
//     const exists = savedList.some((r) => r.id === recipe.id);

//     if (!exists) {
//       savedList.push({
//         id: recipe.id,
//         title: recipe.title,
//         time: recipe.time,
//         calories: recipe.calories,
//         image: recipe.image,
//       });

//       localStorage.setItem("cookio_saved", JSON.stringify(savedList));
//     }

//     // Đổi trạng thái icon ❤️
//     setSaved(!saved);
//   };

//   return (
//     <main id="generator" className="generator-section">
//       <div className="container">
//         {/* INPUT */}
//         <div className="input-wrapper">
//           <h2>What's in your kitchen?</h2>
//           <p style={{ color: "#888", marginBottom: 20 }}>
//             Enter ingredients separated by commas (e.g., chicken, garlic, lemon)
//           </p>

//           <div className="input-group">
//             <input
//               id="ingredients"
//               type="text"
//               className="ingredient-input"
//               placeholder="Type ingredients here..."
//               value={ingredients}
//               onChange={(e) => setIngredients(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
//             />
//           </div>

//           <div className="actions">
//             <button
//               className="btn btn-primary"
//               onClick={() => handleGenerate()}
//             >
//               <i className="fas fa-magic"></i> Generate Recipe
//             </button>

//             <button
//               className="btn btn-outline"
//               onClick={() => {
//                 setIngredients("Surprise Me!");
//                 handleGenerate(true);
//               }}
//             >
//               <i className="fas fa-random"></i> Surprise Me
//             </button>

//             <button
//               className="btn"
//               style={{ color: "#999" }}
//               onClick={() => {
//                 setIngredients("");
//                 setRecipe(null);
//                 setError(false);
//               }}
//             >
//               Clear
//             </button>
//           </div>
//         </div>

//         {/* LOADING */}
//         {loading && (
//           <div className="loader-container" style={{ display: "flex" }}>
//             <div className="pan-loader">
//               <div className="loader">
//                 <div className="pan"></div>
//                 <div className="handle"></div>
//                 <div className="food-particle"></div>
//               </div>
//             </div>
//             <h3>Chef AI is thinking...</h3>
//           </div>
//         )}

//         {/* ERROR */}
//         {error && (
//           <div
//             style={{
//               color: "var(--primary)",
//               textAlign: "center",
//               marginTop: "20px",
//             }}
//           >
//             <i className="fas fa-exclamation-circle"></i> Something went wrong.
//           </div>
//         )}

//         {/* RESULT */}
//         <RecipeCard
//           recipe={recipe}
//           saved={saved}
//           onToggleSave={() => handleSave(recipe)}
//         />
//       </div>
//     </main>
//   );
// }
