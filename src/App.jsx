import React from "react";
import { Routes, Route } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import HistoryPage from "./pages/HistoryPage";
import HomePage from "./pages/HomePage";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Favorites from "./components/Favorites/Favorites";
import RecipeResult from "./components/RecipeResult/RecipeResult";
import RecipeDetailPage from "./pages/RecipeDetailPage";
import IngredientsManager from "./components/IngredientsManager/IngredientsManager";

import "./App.css";

function App() {
  return (
    <div className="app">
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/recipe" element={<RecipeResult />} />
          <Route path="/recipe/:id" element={<RecipeDetailPage />} />
          <Route path="/ingredients" element={<IngredientsManager />} />
          <Route path="/history/:id?" element={<HistoryPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
