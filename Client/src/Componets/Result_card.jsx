import "../../src/App.css";

// export function Result_card ({onClick}) {
//     return (
//         <div className="result-card" onClick={onClick}>
//           <h3>Result</h3>
//           <p>This recipe uses your ingredients to make potato dumplings.</p>
//         </div>
//     )
// };

// export function Result_card({ title, image, usedCount, missedCount, onClick }) {
//   return (
//     <div className="result-card" onClick={onClick}>
//       <img src={image} alt={title} />
//       <h3>{title}</h3>
//       <p>✅ {usedCount} used · ❌ {missedCount} missing</p>
//     </div>
//   );
// }

// // Result_card.jsx
// export function Result_card({ title, ingredients, onClick }) {
//   return (
//     <div className="result-card" onClick={onClick}>
//       <h3>{title}</h3>
//       <p>{ingredients.slice(0, 50)}...</p> {/* Optional preview */}
//     </div>
//   );
// }

// export function Result_card({ title, ingredients, instructions, onClick }) {
//   return (
//     <div className="result-card" onClick={onClick}>
//       <h3>{title}</h3>
//       <p><strong>Ingredients:</strong> {ingredients}</p>

//       <div>
//         <strong>Instructions:</strong>
//         <ul>
//           {Array.isArray(instructions) ? (
//             instructions.map((step, i) => <li key={i}>{step}</li>)
//           ) : (
//             <li>{instructions}</li>
//           )}
//         </ul>
//       </div>
//     </div>
//   );
// }

export function Result_card({ title, ingredients, onClick }) {
  return (
    <div className="result-card" onClick={onClick}>
      <h3>{title}</h3>
      <p>
        <strong>Ingredients:</strong> {ingredients}
      </p>
    </div>
  );
}
