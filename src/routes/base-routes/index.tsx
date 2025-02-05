import { Route, Routes } from "react-router-dom";
import { LoginPage } from "@/pages/login";
import { UserSignupPage } from "@/pages/signup";
import { AuthenticatedRoutes } from "../authenticated-routes";
import HomePage from "@/pages/home";
import ProductPage from "@/pages/product";

export function BaseRoutes() {
  return (
    <>
    
      <Routes>
        
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<UserSignupPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductPage />} />


        {/* Protected Routes */}
        <Route element={<AuthenticatedRoutes />}>
            <Route path="/home" element={<HomePage />} />
        </Route>
      </Routes>
    </>
  );
}