import axios from "axios";
import express from "express";

const app = express();
const port = 3000;

// Tell Express to use EJS for our webpages.
app.set("view engine", "ejs");

// Tell Express where our static files are.
app.use(express.static("public"));

// Show the home page.

app.get("/", async (req, res) => {
  try {
    const response = await axios.get(
      "https://www.thecocktaildb.com/api/json/v1/1/random.php"
    );

    const result = response.data.drinks[0];

    console.log(result);
 
const ingredients = [];

for (let i = 1; i <= 15; i++) {
  const name = result[`strIngredient${i}`];
  const measure = result[`strMeasure${i}`];

  if (name) {
    ingredients.push({
      name: name,
      measure: measure
    });
  }
}

    res.render("index.ejs", {
  cocktail: result,
  ingredients: ingredients,
  error: null
});
  } catch (error) {
    console.error("Failed to fetch cocktail:", error.message);
    res.status(500).send("Sorry, we couldn't fetch a cocktail right now.");
  }
});

app.get("/search", async (req, res) => {
  try {
    // 1. Get the cocktail name from the search form
    const searchTerm = req.query.cocktail;

    // 2. Ask the API to search for that cocktail
    const response = await axios.get(
      `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${encodeURIComponent(searchTerm)}`
    );

    // 3. Get the list of matching cocktails
    const drinks = response.data.drinks;

    // 4. Check whether any cocktails were found
   if (!drinks || drinks.length === 0) {
  return res.render("index.ejs", {
    cocktail: null,
    ingredients: [],
    error: "Sorry, no cocktail found. Try another name!"
  });
}

    // 5. Get the first matching cocktail
    const result = drinks[0];

    // 6. Create an array to store ingredients
    const ingredients = [];

    // 7. Extract ingredients and measurements
    for (let i = 1; i <= 15; i++) {
      const name = result[`strIngredient${i}`];
      const measure = result[`strMeasure${i}`];

      if (name) {
        ingredients.push({
          name: name,
          measure: measure
        });
      }
    }

    // 8. Display the cocktail on the EJS page
    res.render("index.ejs", {
      cocktail: result,
      ingredients: ingredients,
      error: null
       
    });

  } catch (error) {
    console.error("Failed to fetch cocktail:", error.message);
    res.status(500).send(
      "Sorry, we couldn't fetch the cocktail right now."
    );
  }
});


// Start the server.
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
