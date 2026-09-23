import { memo } from "react";
import "./Button.css";

const variantClass = {
  num: "btn-num",
  func: "btn-func",
  clear: "btn-clear",
  equals: "btn-equals",
};

/**
 * A single calculator button.
 */
function Button({ label, variant = "num", onClick }) {
  return (
    <button
      className={`btn ${variantClass[variant] || "btn-num"}`}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}

export default memo(Button);
