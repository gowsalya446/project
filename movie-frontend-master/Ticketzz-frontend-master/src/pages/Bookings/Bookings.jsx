import "./Bookings.css";

import React, { useEffect, useState } from "react";

import { FaRegAddressBook } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import { fetchWithToken } from "../../helper/Interceptor/Interceptor";
import { useNavigate } from "react-router-dom";

const Booking = () => {
	const [bookingSummaries, setBookingSummaries] = useState([]);
	const [currentUser, setCurrentUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const nav = useNavigate();

	useEffect(() => {
		fetchBookingSummary();
		fetchCurrentUser();
	}, []);

	const fetchCurrentUser = async () => {
		try {
			const response = await fetchWithToken(
				"http://127.0.0.1:8000/api/users/get/"
			);
			const data = await response.json();
			setCurrentUser(data);
		} catch (error) {
			console.error("Error fetching current user:", error);
		}
	};

	const fetchBookingSummary = async () => {
		try {
			const response = await fetchWithToken(
				"http://127.0.0.1:8000/api/bookings/"
			);
			const data = await response.json();
			console.log(data);
			setBookingSummaries(data);
		} catch (error) {
			console.error("Error fetching booking summary:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleRemoveBooking = async (bookingId) => {
		try {
			// Send a DELETE request to the API to remove the booking
			await fetchWithToken(`http://127.0.0.1:8000/api/bookings/${bookingId}/delete/`, {
				method: "DELETE",
			});

			// Fetch the updated booking summary after deletion
			await fetchBookingSummary();
		} catch (error) {
			console.error("Error deleting booking:", error);
		} finally {
			// Set loading to false in the finally block
			setLoading(false);
		}
	};

	const handleMouseOver = (event) => {
		event.target.style.color = "tomato";
	};

	const handleMouseOut = (event) => {
		event.target.style.color = "white";
	};

	let content;

	if (loading) {
		content = (
			<div className="col-12">
				<div
					className="d-flex flex-column align-items-center justify-content-center no-booking"
					style={{ background: "linear-gradient(to top, #000000, #333333)" }}
				>
					<FaRegAddressBook className="mb-3 text-danger mt-3" size={64} />
					<h4 className="text-center font-weight-bolder text-danger">
						Loading...
					</h4>
				</div>
			</div>
		);
	} else if (bookingSummaries.length > 0) {
		content = bookingSummaries.map((booking, index) => (
			<div key={index} className="col-lg-6 col-md-6 col-sm-12 mb-4">
				<div className="card text-white rounded">
					<div
						className="card-body text-center"
						style={{
							background: "linear-gradient(to left, #000000, #333333)",
							position: "relative",
						}}
					>
						<div
							id="remove"
							onClick={() => handleRemoveBooking(booking.id)}
							onMouseOver={handleMouseOver}
							onMouseOut={handleMouseOut}
						>
							<RiDeleteBin5Line className="text-white" size={30} />
						</div>
						<h4 className="card-title text-left font-weight-bold">
							<span className="text-danger">Booking ID :</span> &nbsp;
							{booking.id}
						</h4>
						<p className="card-text text-left font-weight-bold">
							<span className="text-danger">User :</span>&nbsp;{" "}
							{currentUser.username}
						</p>
						<p className="card-text text-left font-weight-bold">
							<span className="text-danger">Movie :</span> &nbsp;{" "}
							{booking.seats[0].movie.title}
						</p>
						<p className="card-text text-left font-weight-bold">
							<span className="text-danger ">Total Cost :</span> &nbsp; &#x20B9;
							{booking.total_cost}
						</p>
						<p className="card-text text-left font-weight-bold">
							<span className="text-danger ">Seats :</span>
						</p>
						<ul className="card-text text-left">
							{booking.seats.map((seat) => (
								<li key={seat.id} style={{ listStyle: "none" }}>
									Seat {seat.seat_number} - &#x20B9;{seat.price}
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		));
	} else {
		content = (
			<div className="col-12">
				<div
					className="d-flex flex-column align-items-center justify-content-center no-booking"
					style={{ background: "linear-gradient(to top, #000000, #333333)" }}
				>
					<FaRegAddressBook className="mb-3 text-danger mt-3" size={64} />
					<h4 className="text-center font-weight-bolder">
						No <span className="text-danger">Booking Summaries</span> Available.
					</h4>
					<button
						className="btn btn-outline-danger m-3"
						onClick={() => nav("/", true)}
					>
						Go Back
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="booking-page">
			<div
				className="container mt-3 mb-3"
				style={{ background: "linear-gradient(to right, #000000, #333333)" }}
			>
				<h2 className="text-center text-white font-weight-bolder m-5">
					Booking &nbsp; <span className="text-danger">Summary</span>{" "}
				</h2>
				<div className="row">{content}</div>
			</div>
		</div>
	);
};

export default Booking;
