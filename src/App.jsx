import { useEffect } from "react";
import Display from "./components/Display";
import Toolbar from "./components/Toolbar";
import ButtonGrid from "./components/ButtonGrid";
import { useCalculator } from "./hooks/useCalculator";
import "./App.css";

export default function App() {
  const { expression, preview, dispatch } = useCalculator();

  // ── Keyboard support ──────────────────────────
  useEffect(() => {
    function handleKeyDown(e) {
      const key = e.key;

      if (/^[0-9]$/.test(key)) dispatch("NUMBER", key);
      else if (key === ".") dispatch("DECIMAL");
      else if (key === "+") dispatch("OPERATOR", "+");
      else if (key === "-") dispatch("OPERATOR", "−");
      else if (key === "*") dispatch("OPERATOR", "×");
      else if (key === "/") {
        e.preventDefault();
        dispatch("OPERATOR", "÷");
      }
      else if (key === "%") dispatch("PERCENT");
      else if (key === "(" || key === ")") dispatch("PARENS");
      else if (key === "Enter" || key === "=") dispatch("EQUALS");
      else if (key === "Backspace") dispatch("BACKSPACE");
      else if (key === "Escape") dispatch("CLEAR");
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dispatch]);

  return (
    <div className="calculator">
      <Display expression={expression} preview={preview} />
      <Toolbar />
      <ButtonGrid dispatch={dispatch} />
    </div>
  );
}
