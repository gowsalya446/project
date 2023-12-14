import React from "react";
import {
	FaFacebookF,
	FaInstagram,
	FaTwitter,
	FaLinkedin,
} from "react-icons/fa";

import "./Footer.css";

const Footer = () => {
	return (
		<footer className="footer">
			<div
				className="footer-wrapper"
				style={{
					width: "100%",
					maxWidth: "1200px",
					margin: "0 auto",
					padding: "0 20px",
				}}
			>
				<ul className="menuItems">
					<li className="menuItem text-danger font-weight-bold">
						Terms Of Use
					</li>
					<li className="menuItem text-white font-weight-bold">
						Privacy-Policy
					</li>
					<li className="menuItem text-danger font-weight-bold">About</li>
					<li className="menuItem text-white font-weight-bold">Blog</li>
					<li className="menuItem text-danger font-weight-bold">FAQ</li>
				</ul>
				<div className="infoText text-white font-weight-bold">
					In our online movie ticket booking app is a digital platform that
					allows users to browse, select, and
					<span className="text-danger">
						 &nbsp; purchase tickets for movies showing in various cinemas.
					</span> &nbsp;
					These apps have become increasingly popular due to the convenience
					they offer in terms of selecting
					<span className="text-danger">
						 &nbsp; show times, seats, and making payments.
					</span>
				</div>
				<div className="socialIcons">
					<span className="icon">
						<FaFacebookF />
					</span>
					<span className="icon">
						<FaInstagram />
					</span>
					<span className="icon">
						<FaTwitter />
					</span>
					<span className="icon">
						<FaLinkedin />
					</span>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
