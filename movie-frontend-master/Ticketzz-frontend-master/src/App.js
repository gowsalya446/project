import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import Bookings from "./pages/Bookings/Bookings";
import Footer from "./pages/Footer/Footer";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import MovieDetails from "./pages/MovieDetails/MovieDetails";
import Navbar from "./components/Navbar/Navbar";
import PageNotFound from "./pages/PageNotFound/PageNotFound";
import Profile from "./pages/Profile/Profile";
import { ProtectedRoute } from "./helper/ProtectedRouting/ProtectedRouting";
import Register from "./pages/Register/Register";
import SeatSelection from "./pages/SeatSelection/SeatSelection";
import Theaters from "./pages/Theaters/Theaters";

function App() {
	return (
		<BrowserRouter>
			<Navbar />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route
					path="/profile"
					element={<ProtectedRoute component={Profile} />}
				/>
				<Route
					path="/bookings"
					element={<ProtectedRoute component={Bookings} />}
				/>
				<Route
					path="/movie/:id"
					element={<ProtectedRoute component={MovieDetails} />}
				/>
				<Route path="/register" element={<Register />} />
				<Route path="/login" element={<Login />} />
				<Route path="/forgotPassword" element={<ForgotPassword />} />
				<Route
					path="/theaters/:movieId"
					element={<ProtectedRoute component={Theaters} />}
				/>
				<Route
					path="/seats/:theaterId"
					element={<ProtectedRoute component={SeatSelection} />}
				/>
				<Route path="/*" element={<PageNotFound />} />
			</Routes>
			<Footer />
		</BrowserRouter>
	);
}

export default App;
