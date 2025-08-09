import "../../src/App.css";
import React from "react";

export default function RecipeTile({recipe}) {
    return (
       recipe["recipe"]["image"].match(/\.(jpeg|jpg|gif|png)$/)
       != null && ( <div className="recipeTile">
            <img className="recipe_img" src={recipe["recipe"]["image"]} />
            <p className="recipe_name">{recipe["recipe"]["label"]}</p>

        </div>
    )

    );
}

