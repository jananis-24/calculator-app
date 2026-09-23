import { useReducer, useCallback } from "react";
import { isOperator, safeEvaluate, formatNumber } from "../utils/evaluate";

// ── Reducer ───────────────────────────────────
const initialState = {
  expression: "",
  justEvaluated: false,
};

function calcReducer(state, action) {
  const { expression } = state;
  const lastChar = expression[expression.length - 1] || "";

  switch (action.type) {
    case "NUMBER": {
      const newExpr = state.justEvaluated ? action.value : expression + action.value;
      return { expression: newExpr, justEvaluated: false };
    }

    case "OPERATOR": {
      const op = action.value;
      let newExpr = expression;

      // Replace trailing operator
      if (isOperator(lastChar)) {
        newExpr = newExpr.slice(0, -1);
      }

      if (newExpr === "") {
        if (op === "−") return { expression: "−", justEvaluated: false };
        return state;
      }

      return { expression: newExpr + op, justEvaluated: false };
    }

    case "DECIMAL": {
      if (state.justEvaluated) {
        return { expression: "0.", justEvaluated: false };
      }
      // Check if last number segment already has a decimal
      const parts = expression.split(/[÷×+−()]/);
      const lastPart = parts[parts.length - 1];
      if (lastPart.includes(".")) return state;

      if (expression === "" || isOperator(lastChar) || lastChar === "(") {
        return { expression: expression + "0.", justEvaluated: false };
      }
      return { expression: expression + ".", justEvaluated: false };
    }

    case "PARENS": {
      const openCount = (expression.match(/\(/g) || []).length;
      const closeCount = (expression.match(/\)/g) || []).length;

      if (!expression || isOperator(lastChar) || lastChar === "(") {
        return { expression: expression + "(", justEvaluated: false };
      }
      if (openCount > closeCount && (/\d/.test(lastChar) || lastChar === ")")) {
        return { expression: expression + ")", justEvaluated: false };
      }
      return { expression: expression + "(", justEvaluated: false };
    }

    case "PERCENT": {
      if (expression && /\d/.test(lastChar)) {
        return { expression: expression + "%", justEvaluated: false };
      }
      return state;
    }

    case "NEGATE": {
      if (!expression) return state;

      if (state.justEvaluated) {
        const result = safeEvaluate(expression);
        if (result !== null) {
          return {
            expression: formatNumber(-result).replace(/,/g, ""),
            justEvaluated: false,
          };
        }
        return state;
      }

      const match = expression.match(/(−?\d+\.?\d*)$/);
      if (match) {
        const num = match[1];
        const start = expression.length - num.length;
        const negated = num.startsWith("−")
          ? expression.slice(0, start) + num.slice(1)
          : expression.slice(0, start) + "−" + num;
        return { expression: negated, justEvaluated: false };
      }
      return state;
    }

    case "CLEAR":
      return { expression: "", justEvaluated: false };

    case "BACKSPACE": {
      return {
        expression: expression.slice(0, -1),
        justEvaluated: false,
      };
    }

    case "EQUALS": {
      if (!expression) return state;
      const result = safeEvaluate(expression);
      if (result !== null) {
        return {
          expression: formatNumber(result).replace(/,/g, ""),
          justEvaluated: true,
        };
      }
      return state;
    }

    default:
      return state;
  }
}

// ── Hook ──────────────────────────────────────
export function useCalculator() {
  const [state, dispatch] = useReducer(calcReducer, initialState);

  const preview = !state.justEvaluated && state.expression
    ? safeEvaluate(state.expression)
    : null;

  const handleButton = useCallback((action, value) => {
    dispatch({ type: action, value });
  }, []);

  return {
    expression: state.expression,
    preview: preview !== null ? formatNumber(preview) : "",
    justEvaluated: state.justEvaluated,
    dispatch: handleButton,
  };
}
