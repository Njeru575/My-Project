const routes = {
    Home: renderHome,
    Recipe: renderRecipe,
    About: renderAbout,
    RecipeDetail: renderRecipeDetail, 
  };
  function navigateToRecipeDetail(recipeId) {
    window.history.pushState({}, "", `/Recipe/${recipeId}`);
    renderRecipeDetail(recipeId);
  }
  
  function navigate(e) {
    e.preventDefault();
    const route = e.target.getAttribute("data-route");
    if (routes && routes[route]) {
      window.history.pushState({}, "", route);
      routes[route]();
    } else if (window.location.pathname.startsWith("/Recipe/")) {
      const recipeId = window.location.pathname.split("/")[2];
      renderRecipeDetail(recipeId);
    }
  }

function handlePopState() {
    const path = window.location.pathname;
    if (path.startsWith("/Recipe/")) {
      const recipeId = path.split("/")[2];
      renderRecipeDetail(recipeId);
    } else {
      const route = path.replace("/", "") || "Home";
      if (routes[route]) {
        routes[route]();
      }
    }
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("a[data-route]").forEach((link) => {
      link.addEventListener("click", navigate);
    });
    handlePopState();
  });
  
  window.addEventListener("popstate", navigate);
  
  function renderHome() {
    const app = document.getElementById("app");
    app.innerHTML = `
      <h1>Welcome to My Recipe App!</h1>
      <p>Discover delicious recipes and learn more about our app!</p>
      <div class="cta-buttons">
        <button id="explore-recipes">Explore Recipes</button>
        <button id="learn-more">Learn More</button>
      </div>
    `;
  
    // Add event listeners to buttons
    document.getElementById("explore-recipes").addEventListener("click", () => {
      window.history.pushState({}, "", "/Recipe");
      renderRecipe();
    });
  
    document.getElementById("learn-more").addEventListener("click", () => {
      window.history.pushState({}, "", "/About");
      renderAbout();
    });
  }
  
  
  async function renderRecipeDetail(recipeId) {
    const app = document.getElementById("app");
    app.innerHTML = `
    <p>Loading recipe details...</p>
    `;
    try {
      const response = await fetch(`https://dummyjson.com/recipes/${recipeId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const recipe = await response.json();
  
      app.innerHTML = `
      <h1>${recipe.name}</h1>
      <img src="${recipe.image}" alt="${recipe.name}">
      <p><strong>Cuisine:</strong> ${recipe.cuisine}</p>
      <p><strong>Difficulty:</strong> ${recipe.difficulty}</p>
      <p><strong>Prep Time:</strong> ${recipe.prepTimeMinutes} minutes</p>
      <p><strong>Cook Time:</strong> ${recipe.cookTimeMinutes} minutes</p>
      <p><strong>Servings:</strong> ${recipe.servings}</p>
      <p><strong>Calories Per Serving:</strong> ${
        recipe.caloriesPerServing
      } kcal</p>
      <p><strong>Rating:</strong> ${recipe.rating} (${
        recipe.reviewCount
      } reviews)</p>
      <h2>Ingredients</h2>
      <ul>
        ${recipe.ingredients
          .map((ingredient) => `<li>${ingredient}</li>`)
          .join("")}
      </ul>
      <h2>Instructions</h2>
      <ol>
        ${recipe.instructions
          .map((instruction) => `<li>${instruction}</li>`)
          .join("")}
      </ol>
      <p><strong>Tags:</strong> ${recipe.tags.join(", ")}</p>
      <p><strong>Meal Type:</strong> ${recipe.mealType.join(", ")}</p>
      <button id="back-button">Back to Recipes</button>
      `;
  
      // Add event listener for back button
      document.getElementById("back-button").addEventListener("click", () => {
        window.history.pushState({}, "", "/Recipe");
        renderRecipe();
      });
    } catch (error) {
      app.innerHTML = `
      <h1>Error loading recipe details</h1>
      <p>${error.message}</p>
      `;
    }
  }
  
  async function renderRecipe() {
    const app = document.getElementById("app");
    app.innerHTML = `
    <p>Loading recipes...</p>
    `;
    try {
      const response = await fetch("https://dummyjson.com/recipes");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      const recipes = data.recipes;
  
      app.innerHTML = `
      <h1>Our Recipes</h1>
      <div id="recipes" class="recipes-container">
      </div>
      `;
  
      const recipeContainer = document.getElementById("recipes");
  
      recipes.forEach((recipe) => {
        const recipeElement = document.createElement("div");
        recipeElement.classList.add("recipe");
        recipeElement.setAttribute("data-id", recipe.id);
        recipeElement.innerHTML = `
        <img src="${recipe.image}" alt="${recipe.name}">
        <h2>${recipe.name}</h2>
        <p>${recipe.cuisine}</p>
        `;
        recipeContainer.appendChild(recipeElement);
  
        // Add click event listener
        recipeElement.addEventListener("click", () => {
          navigateToRecipeDetail(recipe.id);
        });
      });
    } catch (error) {
      app.innerHTML = `
      <h1>Error loading recipes</h1>
      <p>${error.message}</p>
      `;
    }
  }
  
  function renderAbout() {
    const app = document.getElementById("app");
    app.innerHTML = `
    <h1>About My Recipe App</h1>
    <p>This app was built using HTML, CSS, and JavaScript to display delicious recipes.</p>
    `;
  }
  