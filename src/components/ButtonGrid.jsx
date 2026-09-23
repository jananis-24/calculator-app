import { useCallback } from "react";
import Button from "./Button";
import "./ButtonGrid.css";

/**
 * The button layout definition.
 * Each entry: [label, variant, actionType, actionValue?]
 */
const BUTTONS = [
  ["C", "clear", "CLEAR"],
  ["( )", "func", "PARENS"],
  ["%", "func", "PERCENT"],
  ["÷", "func", "OPERATOR", "÷"],

  ["7", "num", "NUMBER", "7"],
  ["8", "num", "NUMBER", "8"],
  ["9", "num", "NUMBER", "9"],
  ["×", "func", "OPERATOR", "×"],

  ["4", "num", "NUMBER", "4"],
  ["5", "num", "NUMBER", "5"],
  ["6", "num", "NUMBER", "6"],
  ["−", "func", "OPERATOR", "−"],

  ["1", "num", "NUMBER", "1"],
  ["2", "num", "NUMBER", "2"],
  ["3", "num", "NUMBER", "3"],
  ["+", "func", "OPERATOR", "+"],

  ["+/−", "num", "NEGATE"],
  ["0", "num", "NUMBER", "0"],
  [".", "num", "DECIMAL"],
  ["=", "equals", "EQUALS"],
];

/**
 * 4×5 grid of calculator buttons.
 */
export default function ButtonGrid({ dispatch }) {
  const handleClick = useCallback(
    (actionType, actionValue) => () => {
      dispatch(actionType, actionValue);
    },
    [dispatch]
  );

  return (
    <div className="buttons">
      {BUTTONS.map(([label, variant, actionType, actionValue]) => (
        <Button
          key={label}
          label={label}
          variant={variant}
          onClick={handleClick(actionType, actionValue)}
        />
      ))}
    </div>
  );
}
