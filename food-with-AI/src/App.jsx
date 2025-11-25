import React from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Hero from "./components/Hero";
import Generator from "./components/Generator";
import Footer from "./components/Footer";
import "./index.css";
import SavedRecipes from "./components/SavedRecipes";

export default function App() {
  return (
    <div>
      <NavBar />
      <Hero />
      <Generator />
      <SavedRecipes />
      <Footer />
    </div>
  );
}
