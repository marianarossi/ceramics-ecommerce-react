import "./App.css";
import { BaseRoutes } from "./routes/base-routes";
import { ChakraProvider } from "@chakra-ui/react";

export function App() {
  return (
    <>
      <ChakraProvider>
        <BaseRoutes />
      </ChakraProvider>
    </>
  );
}