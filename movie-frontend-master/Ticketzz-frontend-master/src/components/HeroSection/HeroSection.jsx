import "./HeroSection.css";

import React from "react";

const HeroSection = () => {
	return (
		<div
			id="carouselExampleIndicators"
			className="carousel slide"
			data-ride="carousel"
		>
			<ol className="carousel-indicators">
				<li
					data-target="#carouselExampleIndicators"
					data-slide-to="0"
					className="active"
				></li>
				<li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
				<li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
			</ol>
			<div className="carousel-inner">
				<div className="carousel-item active">
					<img
						src="https://i.pinimg.com/736x/0a/f8/0f/0af80f673880248c3c19845b58431c8c.jpg"
						className="d-block w-100"
						alt="banner-1"
					/>
				</div>
				<div className="carousel-item">
					<img
						src="https://previews.123rf.com/images/qualitdesign/qualitdesign1907/qualitdesign190700021/131429813-movie-tickets-online-sale-banner-poster-template-vector-3d-isometric-design-elements-for-web.jpg"
						className="d-block w-100"
						alt="banner-2"
					/>
				</div>
				<div className="carousel-item">
					<img
						src="https://static.vecteezy.com/system/resources/previews/021/677/393/non_2x/3d-movie-booking-service-ads-banner-concept-poster-card-vector.jpg"
						className="d-block w-100"
						alt="banner-3"
					/>
				</div>
			</div>
			<button
				className="carousel-control-prev"
				type="button"
				data-target="#carouselExampleIndicators"
				data-slide="prev"
			>
				<span className="carousel-control-prev-icon" aria-hidden="true"></span>
				<span className="sr-only">Previous</span>
			</button>
			<button
				className="carousel-control-next"
				type="button"
				data-target="#carouselExampleIndicators"
				data-slide="next"
			>
				<span className="carousel-control-next-icon" aria-hidden="true"></span>
				<span className="sr-only">Next</span>
			</button>
		</div>
	);
};

export default HeroSection;
