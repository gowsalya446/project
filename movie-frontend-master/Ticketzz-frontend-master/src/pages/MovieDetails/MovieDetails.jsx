import "./MovieDetails.css";

import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { fetchWithToken } from "../../helper/Interceptor/Interceptor";

const MovieDetailsPage = () => {
	const location = useLocation();
	const movie = location.state;
	const nav = useNavigate();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const fetchTheaterDetails = async (movieId) => {
		setLoading(true);
		setError(null);

		try {
			const API_URL = `http://127.0.0.1:8000/api/theaters/${movieId}/`;
			const response = await fetchWithToken(API_URL);
			console.log("Response status:", response.status);

			if (response.ok) {
				const data = await response.json();
				console.log(data);
				nav(`/theaters/${movie.id}`, { state: data });
			} else {
				setError(`Error fetching theater details: ${response.status}`);
			}
		} catch (error) {
			console.error("Error fetching theater details:", error);
			setError("Error fetching theater details. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="container movie-detail-container mt-5">
			<div
				className="row justify-content-center m-5 overflow-hidden rounded"
				style={{
					background:
						"linear-gradient(to right, rgba(0, 0, 0, 0.3), rgba(51, 51, 51, 0.8))",
				}}
			>
				<div className="col-md-6 col-sm-12 p-2">
					<img
						src={movie.image}
						alt={movie.title}
						className="img-fluid custom-image movie-image"
					/>
				</div>
				<div className="col-md-6 col-sm-12 pt-2 d-flex flex-column justify-content-center pl-4">
					<h2 className="text-white text-left p-2">
						<span className="text-danger font-weight-bold">Title:</span> &nbsp;
						{movie.title}
					</h2>
					<p className="text-white text-left p-2">
						<span className="text-danger font-weight-bold">Director:</span>{" "}
						&nbsp; {movie.director}
					</p>
					<p className="text-white text-left p-2">
						<span className="text-danger font-weight-bold">Genre:</span> &nbsp;
						{movie.genre}
					</p>
					<p className="text-white text-left p-2">
						<span className="text-danger font-weight-bold">Language:</span>{" "}
						&nbsp;{movie.language}
					</p>
					<p className="text-white text-left p-2">
						<span className="text-danger font-weight-bold">Rating:</span> &nbsp;
						{movie.rating}
					</p>
					<button
						className="btn btn-outline-danger btn-block font-weight-bold text-white mb-3 "
						onClick={() => fetchTheaterDetails(movie.id)}
						disabled={loading}
					>
						{loading ? "Fetching Theaters..." : "Show Theaters"}
					</button>
					{error && <p className="text-danger text-center">{error}</p>}
				</div>
			</div>
		</div>
	);
};

export default MovieDetailsPage;
