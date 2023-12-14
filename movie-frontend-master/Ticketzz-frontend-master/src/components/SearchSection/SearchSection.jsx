import "./SearchSection.css";

import React, { useState } from "react";

const SearchSection = ({ onSearch }) => {
	const [searchText, setSearchText] = useState("");
	const [selectedGenre, setSelectedGenre] = useState("");
	const [selectedLanguage, setSelectedLanguage] = useState("");
	const [selectedRating, setSelectedRating] = useState("");

	const handleSearch = () => {
		// Perform search logic here using the state values
		onSearch({
			searchText,
			selectedGenre,
			selectedLanguage,
			selectedRating,
		});

		// Reset search criteria in the child component
		setSearchText("");
		setSelectedGenre("");
		setSelectedLanguage("");
		setSelectedRating("");
	};

	return (
		<div
			className="container-fluid mt-4 mb-4 p-4 rounded h-auto"
			style={{
				background: "linear-gradient(to right, #000000, #333333)",
			}}
		>
			<div className="row">
				<div className="col-md-3 mb-2 p-2">
					<input
						type="text"
						className="form-control custom-input"
						placeholder="Search Movie..."
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
					/>
				</div>
				<div className="col-md-3 mb-2 p-2">
					<select
						className="form-control custom-select"
						value={selectedGenre}
						onChange={(e) => setSelectedGenre(e.target.value)}
					>
						<option value="">Select Genre</option>
						<option value="Drama">Drama</option>
						<option value="Action">Action</option>
						<option value="Comedy">Comedy</option>
						<option value="Adventure">Adventure</option>
						<option value="Family">Family</option>
						<option value="Musical">Musical</option>
						<option value="Biography">Biography</option>
						<option value="Romance">Romance</option>
						<option value="Science Fiction">Science Fiction</option>
						<option value="Crime">Crime</option>
					</select>
				</div>
				<div className="col-md-3 mb-2 p-2">
					<select
						className="form-control custom-select"
						value={selectedLanguage}
						onChange={(e) => setSelectedLanguage(e.target.value)}
					>
						<option value="">Select Language</option>
						<option value="English">English</option>
						<option value="Hindi">Hindi</option>
					</select>
				</div>
				<div className="col-md-2 mb-2 p-2">
					<select
						className="form-control custom-select"
						value={selectedRating}
						onChange={(e) => setSelectedRating(e.target.value)}
					>
						<option value="">Select Rating</option>
						<option value="7.5">7.5</option>
						<option value="8">8</option>
						<option value="8.5">8.5</option>
						<option value="9">9</option>
						<option value="9.5">9.5</option>
					</select>
				</div>
				<div className="col-md-1 mb-2 p-2">
					<button
						className="btn btn-outline-danger btn-block text-center"
						onClick={handleSearch}
					>
						Search
					</button>
				</div>
			</div>
		</div>
	);
};

export default SearchSection;
