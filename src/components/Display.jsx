import "./Display.css";

/**
 * Calculator display showing the current expression and live result preview.
 */
export default function Display({ expression, preview }) {
  const displayText = expression || "0";

  // Colorize operators and parens
  const formatted = displayText
    .replace(/[÷×+−]/g, (m) => `<span class="op">${m}</span>`)
    .replace(/[()]/g, (m) => `<span class="op">${m}</span>`);

  return (
    <div className="display">
      <div
        className={`expression${displayText.length > 10 ? " shrink" : ""}`}
        dangerouslySetInnerHTML={{
          __html: formatted + '<span class="cursor"></span>',
        }}
      />
      <div className="preview">{preview}</div>
    </div>
  );
}
