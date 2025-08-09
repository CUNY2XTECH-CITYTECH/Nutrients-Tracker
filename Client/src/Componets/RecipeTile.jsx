import "../../src/App.css";
import React from "react";

export default function RecipeTile({recipe}) {
    return (

       recipe["recipe"]["image"].match(/\.(jpeg|jpg|gif|png)$/)  // Only show the recipe if the image link ends with jpeg, jpg, gif, or png
       != null && ( <div className="recipeTile">

          {/* Recipe image */}
            <img className="recipe_img" 
                    src={recipe["recipe"]["image"]}
                    alt={recipe["recipe"]["label"]} />
            <p className="recipe_name">{recipe["recipe"]["label"]}</p>   {/* Recipe name */}

        </div>
    )

    );
}

