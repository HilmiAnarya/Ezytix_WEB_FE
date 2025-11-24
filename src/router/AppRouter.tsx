// src/router/AppRouter.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LandingPage } from "../pages/LandingPage";

export const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>

                {/* DEFAULT ROUTE = LANDING PAGE */}
                <Route path="/" element={<LandingPage />} />

                {/* Example future routes */}
                {/* <Route path="/login" element={<LoginPage />} /> */}
                {/* <Route path="/pesan-tiket" element={<TicketPage />} /> */}

                {/* 404 */}
                <Route path="*" element={<LandingPage />} />

            </Routes>
        </BrowserRouter>
    );
};
