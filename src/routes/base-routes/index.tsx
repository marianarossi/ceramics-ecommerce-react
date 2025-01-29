import { Route, Routes } from "react-router-dom";
import { HomePage } from "@/pages/home";
import { UserSignupPage } from "@/pages/user-signup";


export function BaseRoutes(){
    return(
        <>
            <Routes>
                <Route path="/signup" element={<UserSignupPage />} />

                <Route path="/home" element={<HomePage></HomePage>}></Route>
                <Route path="/" element={<HomePage></HomePage>}></Route>
            </Routes>
        </>
    );
}