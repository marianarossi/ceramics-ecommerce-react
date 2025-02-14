import { Route, Routes } from "react-router-dom";
import { LoginPage } from "@/pages/login";
import { UserSignupPage } from "@/pages/signup";
import { AuthenticatedRoutes } from "../authenticated-routes";
import HomePage from "@/pages/home";
import ProductPage from "@/pages/product";
import { UserPage } from "@/pages/user";
import CartPage from "@/pages/cart";
import ProductCategoryPage from "@/pages/product-list";

export function BaseRoutes() {
  return (
    <>

      <Routes>

        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<UserSignupPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/products/category/:id" element={<ProductCategoryPage />} />


        {/* Protected Routes */}
        <Route element={<AuthenticatedRoutes />}>
          <Route path="/user" element={<UserPage/>} />
        </Route>

      </Routes>
    </>
  );
}