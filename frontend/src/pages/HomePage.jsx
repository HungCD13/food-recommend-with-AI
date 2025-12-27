import React from "react";
import Hero from "../components/Hero/Hero";
import RecipeGenerator from "../components/RecipeGenerator/RecipeGenerator";
import SavedRecipes from "../components/SavedRecipes";
import "./HomePage.css";

const HomePage = () => {
  return (
    <div className="homepage">
      <Hero />
      <RecipeGenerator />
      {/* <SavedRecipes /> */}
    </div>
  );
};

export default HomePage;
