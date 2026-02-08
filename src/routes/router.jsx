import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Tuitions from "../pages/Tuitions";
import Home from "../pages/Home";
import Tutors from "../pages/Tutors";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Notfound from "../components/shared/errors/Notfound";
import Loader from "../components/shared/Loader";
import AuthLayout from "../layouts/AuthLayout";
import PrivateRoutes from "../api/PrivateRoutes";
// import DashboardLayout from "../layouts/DashboardLayout";
import Profile from "../pages/dashboard/Profile";

import Dashboard from "../pages/dashboard/Dashboard"
import PostTuitions from "../pages/dashboard/PostTuitions";
import MyPosts from "../pages/dashboard/MyPosts";
import Manageusers from "../pages/dashboard/Manageusers";
import AppliedTutors from "../pages/dashboard/AppiedTutors";
import Payment from "../pages/dashboard/Payment";
import ManageTuitions from "../pages/dashboard/ManageTuitions";
import AdminAnalytics from "../pages/dashboard/AdminAnalytics";
import MyApplications from "../pages/dashboard/MyApplications";
import OngoingTuitions from "../pages/dashboard/OngoingTuitions";
import RevenueHistory from "../pages/dashboard/RevenueHistory";
import TuitionsDetails from "../components/shared/TuitionsDetails";
import TutorsDetails from "../components/shared/TutorsDetails";
import HiringRequests from "../pages/dashboard/HiringRequests";

export const router = createBrowserRouter([
    {
        path: "/",
        hydrateFallbackElement: <Loader fullPage={true} />, 
        Component: RootLayout, 
        ErrorBoundary: Notfound,
        children: [
            { index: true, Component: Home },
            { path: "tuitions", Component: Tuitions },
            { path: "tutors", Component: Tutors },
            { path: "about", Component: About },
            { path: "contact", Component: Contact },
            {path: "tuition/:id", // :id যোগ করা হয়েছে যাতে ডাইনামিক ইউআরএল কাজ করে
                Component: TuitionsDetails},
            {path: "/tutor-details/:id", // এখানে :id হলো ডায়নামিক প্যারামিটার
                element: <TutorsDetails />}
        ]
    },
    {
        // লগইন ও রেজিস্ট্রেশনের জন্য আলাদা লেআউট
        path: "/", 
        Component: AuthLayout,
        children: [
            { path: "login", Component: Login },
            { path: "register", Component: Register },
        ]
    },
{
    path: "dashboard",
    element: <PrivateRoutes><Dashboard /></PrivateRoutes>,
    children: [
        { index: true, element: <Profile /> },
        { path: "profile", element: <Profile /> },

        // Student Routes
        { path: "post-tuition", element: <PrivateRoutes allowedRoles={["student"]}><PostTuitions /></PrivateRoutes> },
        { path: "my-posts", element: <PrivateRoutes allowedRoles={["student"]}><MyPosts /></PrivateRoutes> },
        { path: "applied-tutors", element: <PrivateRoutes allowedRoles={["student"]}><AppliedTutors /></PrivateRoutes> },

        // Payment Route
        { path: "payment/:id", element: <PrivateRoutes allowedRoles={["student"]}><Payment /></PrivateRoutes> },

        // Admin Routes
        { path: "manage-users", element: <PrivateRoutes allowedRoles={["admin"]}><Manageusers /></PrivateRoutes> },
        { path: "manage-tuitions", element: <PrivateRoutes allowedRoles={["admin"]}><ManageTuitions /></PrivateRoutes> },
        { path: "analytics", element: <PrivateRoutes allowedRoles={["admin"]}><AdminAnalytics /></PrivateRoutes> },

        // Tutor Routes
        { path: "my-applications", element: <PrivateRoutes allowedRoles={["tutor"]}><MyApplications /></PrivateRoutes> },
        { path: "ongoing-tuitions", element: <PrivateRoutes allowedRoles={["tutor"]}><OngoingTuitions /></PrivateRoutes> },
        { path: "revenue", element: <PrivateRoutes allowedRoles={["tutor"]}><RevenueHistory /></PrivateRoutes> },
        { path: "hiringrequest", element: <PrivateRoutes allowedRoles={["tutor"]}><HiringRequests /></PrivateRoutes> }
    ]
}
]);