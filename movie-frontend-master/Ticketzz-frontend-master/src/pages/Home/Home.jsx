import React, { useEffect, useState } from "react";

import HeroSection from "../../components/HeroSection/HeroSection";
import MovieCard from "../../components/MovieCard/MovieCard";
import SearchSection from "../../components/SearchSection/SearchSection";
import { fetchWithToken } from "../../helper/Interceptor/Interceptor";

const Home = () => {
	const [movieData, setMovieData] = useState([]);
	const [error, setError] = useState();
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(0);
	const [userLoggedIn, setUserLoggedIn] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	let refresh = localStorage.getItem("refresh");
	let access = localStorage.getItem("access");

	useEffect(() => {
		if (refresh && access) {
			setUserLoggedIn(true);
		} else {
			setUserLoggedIn(false);
		}
	}, [refresh, access]);

	const fetchMovies = async (page) => {
		setIsLoading(true);
		try {
			const response = await fetchWithToken(
				`http://127.0.0.1:8000/api/movies/?page=${page}`
			);

			if (response.ok) {
				const data = await response.json();
				setMovieData(data.data);
				setTotalPages(data.total_pages);
				setUserLoggedIn(true);
				setError(null);
			}
		} catch (error) {
			setError(error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSearch = async (searchCriteria) => {
		setIsLoading(true);
		try {
			const { searchText, selectedGenre, selectedLanguage, selectedRating } =
				searchCriteria;
			const page = 1;
			const apiUrl = `http://127.0.0.1:8000/api/movies/search/?page=${page}&search_text=${searchText}&genre=${selectedGenre}&language=${selectedLanguage}&rating=${selectedRating}`;

			const response = await fetchWithToken(apiUrl);

			if (response.ok) {
				const data = await response.json();
				setMovieData(data.data);
				setTotalPages(data.total_pages);
				setCurrentPage(page);
				setUserLoggedIn(true);
				setError(null);
			}
		} catch (error) {
			setError(error);
		} finally {
			setIsLoading(false);
		}
	};

	const handlePageChange = (newPage) => {
		setIsLoading(true);
		// Update the current page when pagination is changed
		setCurrentPage(newPage);
	};

	useEffect(() => {
		fetchMovies(currentPage);
		setIsLoading(true);
	}, [currentPage]);

	let content;

	if (userLoggedIn) {
		if (isLoading) {
			content = (
				<div className="row mb-3">
					<div className="d-flex mt-4 justify-content-center align-items-center vw-100">
						<div
							className="spinner-border text-danger text-center"
							role="status"
						>
							<span className="visually-hidden"></span>
						</div>
						<p className="text-danger text-center font-weight-bold m-0 ml-2">
							Loading...
						</p>
					</div>
				</div>
			);
		} else if (movieData.length === 0) {
			content = (
				<div className="col-md-12 mt-3 d-flex justify-content-center align-items-center">
					<h4 className="font-weight-bolder text-white text-center">
						No Movies &nbsp;<span className="text-danger">Available</span>
					</h4>
				</div>
			);
		} else {
			content = (
				<div className="row">
					{movieData.map((movie, index) => (
						<div className="col-md-4 mb-4" key={index}>
							<MovieCard data={movie} />
						</div>
					))}
				</div>
			);
		}
	} else {
		content = (
			<div className="col-md-12 mt-3 d-flex justify-content-center align-items-center">
				<h4 className="font-weight-bolder text-white text-center">
					Please Login to see&nbsp;
					<span className="text-danger">All Movies</span>
				</h4>
			</div>
		);
	}

	return (
		<div>
			<HeroSection />
			<SearchSection onSearch={handleSearch} />
			<div className="container mt-3">
				{error && (
					<h2 className="mt-3 text-center font-weight-bold text-danger">
						No Movies To Show
					</h2>
				)}
				{content}

				<div className="row">
					<div className="col-md-12 d-flex justify-content-center mt-3 mb-3">
						{Array.from({ length: totalPages }, (_, index) => (
							<button
								key={index}
								className={`btn btn-outline-danger mx-2 ${
									currentPage === index + 1 ? "active" : ""
								}`}
								onClick={() => handlePageChange(index + 1)}
							>
								{index + 1}
							</button>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Home;
