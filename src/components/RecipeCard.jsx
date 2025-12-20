// import React from "react";

// export default function RecipeCard({ recipe, saved, onToggleSave }) {
//   if (!recipe) return null;

//   // Ưu tiên ảnh AI → fallback Unsplash
//   const imageSrc =
//     recipe.imageUrl ||
//     recipe.image ||
//     `https://source.unsplash.com/900x900/?food,${encodeURIComponent(
//       recipe.title
//     )}`;

//   return (
//     <div id="result" className="result-container" style={{ display: "block" }}>
//       <div className="recipe-card">
//         {/* IMAGE */}
//         <div
//           className="recipe-img"
//           style={{
//             backgroundImage: `url('${imageSrc}')`,
//           }}
//         >
//           {!recipe.imageUrl && (
//             <span className="img-badge">AI đang tải ảnh...</span>
//           )}
//         </div>

//         {/* DETAILS */}
//         <div className="recipe-details">
//           {/* HEADER */}
//           <div className="recipe-header">
//             <div>
//               <h2 className="recipe-title">{recipe.title}</h2>

//               <div className="recipe-meta">
//                 <div className="meta-item">
//                   <i className="far fa-clock"></i> {recipe.time || "15 mins"}
//                 </div>
//                 <div className="meta-item">
//                   <i className="fas fa-fire"></i>{" "}
//                   {recipe.calories || "300 kcal"}
//                 </div>
//               </div>
//             </div>

//             {/* SAVE BUTTON */}
//             <button
//               className={`save-btn ${saved ? "saved" : ""}`}
//               onClick={() => onToggleSave(recipe)}
//               title={saved ? "Đã lưu" : "Lưu món này"}
//             >
//               <i className={saved ? "fas fa-heart" : "far fa-heart"}></i>
//             </button>
//           </div>

//           {/* BODY */}
//           <div className="recipe-body">
//             <h4>🧂 Ingredients</h4>
//             <ul className="ingredients-list">
//               {Array.isArray(recipe.ingredients) &&
//                 recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
//             </ul>

//             <h4>🍳 Instructions</h4>
//             <ol className="instructions-list">
//               {Array.isArray(recipe.instructions) &&
//                 recipe.instructions.map((step, i) => <li key={i}>{step}</li>)}
//             </ol>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
