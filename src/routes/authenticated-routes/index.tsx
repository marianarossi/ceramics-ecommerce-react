import  NavBar from "@/components/navbar";
import AuthService from "@/service/auth-service";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import 'mdb-react-ui-kit/dist/css/mdb.min.css';


export function AuthenticatedRoutes() {
    const isAuthenticated = AuthService.isAuthenticated();
    const location = useLocation();
    return (
        isAuthenticated ? (
            <>

                <Outlet />
            </>
        ) : (
            <Navigate to="/login" state={{from: location}} replace/>
        )
    );
}