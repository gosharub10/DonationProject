import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import HomePage from "../pages/HomePage.tsx";
import ProtectedRoute from "../components/protected/ProtectedRoute";
import UsersPage from "../pages/UsersPage.tsx";
import ProjectsPage from "../pages/ProjectsPage.tsx";
import UserPageProfile from "../pages/UserPageProfile.tsx";
import AdminProjectsPage from "../pages/AdminProjectsPage.tsx";
import ProjectDetailPage from "../pages/ProjectDetailPage.tsx";
import FinanceDashboard from "../pages/FinanceDashboard.tsx";
import FinanceProjectsPage from "../pages/FinanceProjectsPage.tsx";
import ProjectFinancialSettings from "../pages/ProjectFinancialSettings.tsx";
import PublicDonations from "../pages/PublicDonations.tsx";

const AppRouter = () => {
    return (
        <BrowserRouter>
            <MainLayout>
                <Routes>
                    <Route
                        path="/"
                        element={<HomePage/>}
                    />
                    
                    <Route
                        path="/login"
                        element={<LoginPage />}
                    />

                    <Route
                        path="/register"
                        element={<RegisterPage />}
                    />
                    
                    <Route 
                        path="/projects"
                        element={<ProjectsPage/>}
                    />

                    <Route 
                        path="/projects/:id"
                        element={<ProjectDetailPage/>}
                    />

                    <Route
                        path="/public/donations"
                        element={<PublicDonations />}
                    />

                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute roles={["User"]}>
                                <UserPageProfile/>
                            </ProtectedRoute>
                        }
                    />

                    {/* ADMIN */}
                    {/*<Route*/}
                    {/*    path="/admin"*/}
                    {/*    element={*/}
                    {/*        <ProtectedRoute adminOnly>*/}
                    {/*            <AdminDashboard />*/}
                    {/*        </ProtectedRoute>*/}
                    {/*    }*/}
                    {/*/>*/}
                    
                    <Route
                        path="/admin/users"
                        element={
                            <ProtectedRoute roles={["Admin"]}>
                                <UsersPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/projects"
                        element={
                            <ProtectedRoute roles={["Admin"]}>
                                <AdminProjectsPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/finance"
                        element={
                            <ProtectedRoute roles={["FinanceManager"]}>
                                <Navigate to="/finance/dashboard" replace />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/finance/dashboard"
                        element={
                            <ProtectedRoute roles={["FinanceManager"]}>
                                <FinanceDashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/finance/projects"
                        element={
                            <ProtectedRoute roles={["FinanceManager"]}>
                                <FinanceProjectsPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/finance/projects/:id"
                        element={
                            <ProtectedRoute roles={["FinanceManager"]}>
                                <ProjectFinancialSettings />
                            </ProtectedRoute>
                        }
                    />

                </Routes>
            </MainLayout>
        </BrowserRouter>
    );
};

export default AppRouter;