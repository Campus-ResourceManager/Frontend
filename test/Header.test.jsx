import React from "react";
import { render, screen } from "@testing-library/react";
import { AuthProvider } from "../src/context/AuthContext";
import Header from "../src/components/Header";

// Simple helper to render Header with a mocked user via context
const renderWithUser = (user) => {
  const Wrapper = ({ children }) => (
    <AuthProvider>
      {React.cloneElement(children, { __testUser: user })}
    </AuthProvider>
  );

  // We can’t easily override context value without refactoring, so for now
  // just verify component renders the static parts correctly.
  return render(<Header />, { wrapper: Wrapper });
};

describe("Header component", () => {
  it("renders portal title", () => {
    render(<Header />, { wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider> });
    expect(screen.getByText(/AMRITA PORTAL/i)).toBeInTheDocument();
  });
});