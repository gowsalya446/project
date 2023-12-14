import "./Navbar.css";

import { NavLink, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

const Navbar = () => {
	const [loggedIn, setLoggedIn] = useState(false);
	const nav = useNavigate();
	let refresh = localStorage.getItem("refresh");
	let access = localStorage.getItem("access")
	// console.log(refresh,access)
	useEffect(() => {
		if (refresh && access) {
			setLoggedIn(true);
		} else {
			setLoggedIn(false);
		}
	}, [refresh, access]);
	
// console.log(loggedIn)
	
	const logoutHandler = () => {
		localStorage.removeItem("refresh");
		localStorage.removeItem("access")
		setLoggedIn(false);
		nav("/login", true);
	};
	return (
		<nav
			className="navbar navbar-expand-lg navbar-dark"
			style={{ background: "linear-gradient(to right, #000000, #333333)" }}
		>
			<NavLink className="navbar-brand" id="logo" to="/">
				BOLE<span>TO</span>
			</NavLink>
			<button
				className="navbar-toggler"
				type="button"
				data-toggle="collapse"
				data-target="#navbarSupportedContent"
				aria-controls="navbarSupportedContent"
				aria-expanded="false"
				aria-label="Toggle navigation"
			>
				<span className="navbar-toggler-icon"></span>
			</button>

			<div className="collapse navbar-collapse" id="navbarSupportedContent">
				<ul className="navbar-nav mr-auto">
					<li className="nav-item ">
						<NavLink className="nav-link active  " to="/">
							Home <span className="sr-only">(current)</span>
						</NavLink>
					</li>
					<li className="nav-item  ">
						<NavLink className="nav-link active" to="/profile">
							Profile <span className="sr-only">(current)</span>
						</NavLink>
					</li>
					<li className="nav-item ">
						<NavLink className="nav-link active" to="/bookings">
							Bookings <span className="sr-only">(current)</span>
						</NavLink>
					</li>
				</ul>
				<form className="form-inline my-2 my-lg-0">
					{loggedIn ? (
						<button
							className="btn btn-outline-danger btn-block my-2 my-sm-0"
							onClick={logoutHandler}
						>
							Logout
						</button>
					) : (
						<NavLink
							className="btn btn-outline-danger btn-block my-2 my-sm-0"
							to="/login"
						>
							LogIn
						</NavLink>
					)}
				</form>
			</div>
		</nav>
	);
};

export default Navbar;
