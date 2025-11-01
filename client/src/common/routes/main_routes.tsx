
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NavigationSync } from "../component/navigation_sync";
import { AppUrl } from "./app_urls";
import Login from "../../features/auth/view/pages/Login";
import NavbarLayout from "../component/NavBarLayout";
import ExamSelection from "../../features/dashboard/students/view/pages/ExamSelection";
import ProtectedRoute from "../component/ProtectedRoutes";
import ExamPreParation from "../../features/dashboard/students/view/pages/ExamPreparation";

export default function MainRoute() {
    return <>

        <BrowserRouter>
            <NavigationSync />
            <Routes >
                <Route path={AppUrl.login} element={<Login />} />

                <Route element={<ProtectedRoute />}>
                    <Route element={<NavbarLayout />}>
                        <Route path={AppUrl.examSelectionUrl} element={<ExamSelection />} />
                         <Route path={AppUrl.examPreparation} element={<ExamPreParation />} />

                    </Route>
                </Route>
            </Routes>


        </BrowserRouter>
    </>
}