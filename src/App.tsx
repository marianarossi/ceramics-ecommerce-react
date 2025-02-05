import FooterComponent from "./components/footer";
import NavBar from "./components/navbar";
import { BaseRoutes } from "./routes/base-routes";
import { ChakraProvider } from "@chakra-ui/react";
import 'mdb-react-ui-kit/dist/css/mdb.min.css';

export function App() {
  return (
    <>
      <ChakraProvider>
        <NavBar/>
        <BaseRoutes />
        <FooterComponent/>
      </ChakraProvider>
    </>
  );
}