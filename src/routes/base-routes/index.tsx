import { Route, Routes } from "react-router-dom";
import { LoginPage } from "@/pages/login";
import { UserSignupPage } from "@/pages/signup";
import { AuthenticatedRoutes } from "../authenticated-routes";
import { HomePage } from "@/pages/home";

export function BaseRoutes() {
  return (
    <>
    
      <Routes>
        
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<UserSignupPage />} />
        <Route path="/" element={<HomePage />} />

        {/* Protected Routes */}
        <Route element={<AuthenticatedRoutes />}>
            <Route path="/home" element={<HomePage />} />
        </Route>
      </Routes>
    </>
  );
}