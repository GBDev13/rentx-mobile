import React, { ReactNode } from "react";
import { ThemeProvider } from "styled-components/native";
import theme from "../styles/theme";
import { AuthProvider } from "./auth";

interface AppProviderProps {
  children: ReactNode;
}

function AppProvider({ children }: AppProviderProps) {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </AuthProvider>
  )
};

export { AppProvider };