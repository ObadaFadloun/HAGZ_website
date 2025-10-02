import { useState, useEffect } from "react";

export default function Typewriter({ text, speed = 40 }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      const char = text.charAt(i) === "\n" ? "\n" : text.charAt(i);
      setDisplayed((prev) => prev + char);
      i++;
      if (i >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span>
      {displayed.split("\n").map((line, idx) => (
        <span key={idx}>
          {line}
          <br />
        </span>
      ))}
    </span>
  );
}
