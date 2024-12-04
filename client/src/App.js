import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Contact from "./pages/Contact";
import BlogNews from "./pages/BlogNews";
import BlogNewsItem from "./pages/BlogNewsItem"
import Support from "./pages/Support";
import About from "./pages/About";
import ConnectDevice from "./pages/ConnectDevice";
import ClientChat from "./pages/ClientChat";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import DashboardMain from "./pages/Dashboard";
import Profile from "./pages/Profile";
import DeleteAccount from "./pages/DeleteAccount";
import History from "./pages/History";
import SessionDetails from "./pages/SessionDetails";
import CurrentSession from "./pages/CurrentSession";
import Chat from "./pages/Chat";
import Navbar from "./components/Navbar";
import DashboardNavbar from "./components/DashboardNavbar";
import Footer from "./components/Footer";
import DashboardFooter from "./components/DashboardFooter";
import { AuthContext } from "./context/authContext";

const Layout = () => {

  // Handle Navbars and Footers
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");

  // Handle Protected Routes
  const Dashboard = ({ children }) => {
    const { currentUser } = useContext(AuthContext);
    return currentUser ? children : < Navigate to="/empty" />;
  };

  return (
    <>
      {isDashboard ? <DashboardNavbar /> : <Navbar />}
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog-news" element={<BlogNews />} />
        <Route path="/blog-news/blog-news-item/:id" element={<BlogNewsItem />} />
        <Route path="/support" element={<Support />} />
        <Route path="/connect-device" element={<ConnectDevice />} />
        <Route path="/client-chat" element={<ClientChat />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard/*"
          element={
            <Dashboard>
              <Routes>
                <Route path="/" element={<DashboardMain />} />
                <Route path="profile" element={<Profile />} />
                <Route path="profile/delete-account" element={<DeleteAccount />} />
                <Route path="history" element={<History />} />
                <Route path="history/session/:sessionId" element={<SessionDetails />} />
                <Route path="current-session" element={<CurrentSession />} />
                <Route path="chat" element={<Chat />} />
              </Routes>
            </Dashboard>
          }
        />
      </Routes>
      {isDashboard ? <DashboardFooter /> : <Footer />}
    </>
  );
};

const App = () => {
  const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);
    return null;
  };

  return (
    <div className="app">
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="*" element={<Layout />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
