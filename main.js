const routes = {
    Home: renderHome,
    Recipe: renderRecipe,
    About: renderAbout,
    RecipeDetail: renderRecipeDetail, // New route
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