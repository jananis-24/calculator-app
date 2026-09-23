/**
 * Calculator evaluation logic — pure functions, no side effects.
 */

const OPERATORS = "÷×+−";

export function isOperator(ch) {
  return OPERATORS.includes(ch);
}

/**
 * Safely evaluate a display expression string and return a number or null.
 */
export function safeEvaluate(expr) {
  if (!expr) return null;
  try {
    let jsExpr = expr
      .replace(/×/g, "*")
      .replace(/÷/g, "/")
      .replace(/−/g, "-")
      .replace(/%/g, "/100");

    // Implicit multiplication: 2(3) → 2*(3), (3)2 → (3)*2
    jsExpr = jsExpr.replace(/(\d)\(/g, "$1*(");
    jsExpr = jsExpr.replace(/\)(\d)/g, ")*$1");

    // Only allow safe characters
    if (/[^0-9+\-*/().% ]/.test(jsExpr)) return null;

    // Auto-close unbalanced parens
    const open = (jsExpr.match(/\(/g) || []).length;
    const close = (jsExpr.match(/\)/g) || []).length;
    jsExpr += ")".repeat(open - close);

    const result = Function(`"use strict"; return (${jsExpr})`)();
    return typeof result === "number" ? result : null;
  } catch {
    return null;
  }
}

/**
 * Format a number for display (with commas, limited decimals).
 */
export function formatNumber(n) {
  if (!isFinite(n)) return "Error";
  const rounded = parseFloat(n.toPrecision(12));
  return rounded.toLocaleString("en-US", { maximumFractionDigits: 10 });
}
