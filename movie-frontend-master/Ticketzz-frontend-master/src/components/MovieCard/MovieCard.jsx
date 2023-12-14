import "./MovieCard.css";

import CircleRating from "../CircleRating/CircleRating";
import PosterFallback from "../../assets/no-poster.png";
import React from "react";
import { useNavigate } from "react-router-dom";

const MovieCard = ({ data }) => {
	const posterUrl = data.image || PosterFallback;

	const nav = useNavigate();
	const handleClick = (data) => {
		nav(`/movie/${data.id}`, { state: data });
	};
	return (
		<div
			className="movieCard"
			onClick={(e) => {
				e.preventDefault();
				handleClick(data);
			}}
		>
			<div className="posterBlock">
				<img className="posterImg" src={posterUrl} alt={data.title} />
				<CircleRating rating={Number(data.rating).toFixed(1)} />
			</div>
			<div className="textBlock">
				<span className="title text-left">{data.title}</span>
			</div>
		</div>
	);
};

export default MovieCard;
