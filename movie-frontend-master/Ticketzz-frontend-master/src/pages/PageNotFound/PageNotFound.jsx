import "./PageNotFound.css";

import { Link } from "react-router-dom";
import React from "react";

const PageNotFound = () => {
	return (
		<div className="not-found-container container-fluid">
			<div className="not-found-content">
				<h1>404</h1>
				<p>Oops! The page you're looking for doesn't exist.</p>
				<Link to="/" className="btn btn-primary btn-block">
					Go Home
				</Link>
			</div>
		</div>
	);
};

export default PageNotFound;
