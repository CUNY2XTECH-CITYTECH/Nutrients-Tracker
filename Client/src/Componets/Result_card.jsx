import "../../src/App.css";

export function Result_card ({onClick}) { 
    return (
        <div className="result-card" onClick={onClick}>
          <h3>Result</h3>
          <p>This recipe uses your ingredients to make potato dumplings.</p>
        </div>
    )
};