import { useLocation, useNavigate } from "react-router-dom";

import React from "react";

const Theaters = () => {
	const location = useLocation();
	const theaterData = location.state;
	const nav = useNavigate();

	console.log("theaterData", theaterData);
	if (!theaterData) {
		return (
			<div className="container m-5 text-center">
				<h2 className="font-weight-bold text-danger">Loading...</h2>
			</div>
		);
	}
	return (
		<div
			className="container mt-5 p-2"
			style={{
				background:
					"linear-gradient(to right, rgba(0, 0, 0, 0.3), rgba(51, 51, 51, 0.8))",
			}}
		>
			<h2 className="text-center font-weight-bolder mt-2 mb-5 text-white">
				Available <span className="text-danger">&nbsp; Theaters</span>
			</h2>
			{theaterData.map((theater) => (
				<div
					key={theater.id}
					className="card mb-3"
					style={{
						background:
							"linear-gradient(to left, rgba(0, 0, 0, 0.3), rgba(51, 51, 51, 0.8))",
					}}
				>
					<div className="card-body d-flex justify-content-between align-items-center">
						<div>
							<h5 className="card-title font-weight-bold text-white">
								{theater.name}
							</h5>
							<p className="text-white">{theater.city}</p>
						</div>
						{console.log(theater.id)}
						<button
							className="btn btn-outline-danger"
							onClick={() => nav(`/seats/${theater.id}`, { state: theater })}
						>
							Select the seat
						</button>
					</div>
				</div>
			))}
		</div>
	);
};

export default Theaters;
