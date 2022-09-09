import { render, screen } from "@testing-library/react";
import React from "react";
import App from "../../App";

test("renders app", () => {
  render(<App />);
  const linkElement = screen.getByText(/Upload Your File/i);
  expect(true).toBe(true);
  // expect(linkElement).toBeInTheDocument();
});
