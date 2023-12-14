import "./SeatSelection.css";

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { fetchWithToken } from "../../helper/Interceptor/Interceptor";

const SeatSelection = () => {
	const [seats, setSeats] = useState([]);
	const [selectedSeats, setSelectedSeats] = useState([]);
	const [reservedSeats, setReservedSeats] = useState([]);
	const [totalPrice, setTotalPrice] = useState(0);
	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [showUpdateForm, setShowUpdateForm] = useState(false);
	const [selectedSeatIdForUpdate, setSelectedSeatIdForUpdate] = useState(null);
	const [updatedCategory, setUpdatedCategory] = useState("");
	const [updatedPrice, setUpdatedPrice] = useState(0);
	const location = useLocation();
	const theater = location.state;
	const nav = useNavigate();

	useEffect(() => {
		const fetchSeatData = async () => {
			try {
				const availableSeatsResponse = await fetchWithToken(
					`http://127.0.0.1:8000/api/theaters/${theater.id}/seats/`
				);
				const availableSeatsData = await availableSeatsResponse.json();

				// Fetch reserved seats data
				const reservedSeatsResponse = await fetchWithToken(
					`http://127.0.0.1:8000/api/seats/reserve/`
				);
				const reservedSeatsData = await reservedSeatsResponse.json();
				console.log(reservedSeatsData);

				// Extract the seat IDs of reserved seats
				const reservedSeatIds = reservedSeatsData.map(
					(reservedSeat) => reservedSeat.id
				);

				// Update reserved seats state
				setReservedSeats(reservedSeatIds);

				// Create a mapping of reserved seats for quick lookup
				const reservedSeatsMap = {};
				reservedSeatIds.forEach((reservedSeatId) => {
					reservedSeatsMap[reservedSeatId] = true;
				});

				// Combine available and reserved seats
				const allSeatsData = availableSeatsData.map((seat) => ({
					...seat,
					reserved: reservedSeatsMap[seat.id] || false,
				}));

				setSeats(allSeatsData);
			} catch (error) {
				console.error("Error fetching seat data:", error);
			}
		};

		fetchSeatData();
	}, [theater.id]);

	const handleSeatClick = (seatId) => {
		if (selectedSeats.includes(seatId)) {
			setSelectedSeats(selectedSeats.filter((id) => id !== seatId));
		} else {
			setSelectedSeats([...selectedSeats, seatId]);
		}
		// Set the selected seat ID for update
		setSelectedSeatIdForUpdate(seatId);
	};

	const handleReserveSeats = async () => {
		const reservationData = {
			seats: selectedSeats,
		};
		console.log(reservationData);
		try {
			const response = await fetchWithToken(
				"http://127.0.0.1:8000/api/seats/reserve/create/",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(reservationData),
				}
			);

			if (response.ok) {
				const responseData = await response.json();
				console.log("Seats reserved:", responseData);
				setReservedSeats([...reservedSeats, ...selectedSeats]);
				setSuccessMessage(responseData.message);
				setErrorMessage("");
				setSelectedSeats([]);
			} else {
				console.error("Error reserving seats:", response);
				const responseText = await response.text();
				console.error("Response content:", responseText);
				setErrorMessage(
					"An error occurred while reserving seats. Please try again later."
				);
				setSuccessMessage("");
			}
		} catch (error) {
			console.error("Error reserving seats:", error);
			setErrorMessage(
				"An error occurred while reserving seats. Please try again later."
			);
			setSuccessMessage("");
		}
	};

	const handleUpdateReservation = async (e) => {
		e.preventDefault();

		if (!selectedSeatIdForUpdate) {
			return;
		}

		try {
			const reservationData = {
				category: updatedCategory,
				price: updatedPrice,
			};
			console.log(updatedCategory);
			console.log(updatedPrice);
			const response = await fetchWithToken(
				`http://127.0.0.1:8000/api/seats/${selectedSeatIdForUpdate}/update_reservation/`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(reservationData),
				}
			);

			if (response.ok) {
				// Handle success case...
				console.log(response);
				// Update seat reservation status in the state
				const updatedSeats = seats.map((seat) => {
					if (seat.id === selectedSeatIdForUpdate) {
						return {
							...seat,
							reserved: true,
						};
					}
					return seat;
				});

				// Calculate updated total price
				let updatedTotalPrice = 0;
				const seat = updatedSeats.find(
					(seat) => seat.id === selectedSeatIdForUpdate
				);
				if (seat) {
					updatedTotalPrice = totalPrice - seat.price + updatedPrice;
				}

				// Update state variables
				setSeats(updatedSeats);
				setTotalPrice(updatedTotalPrice);
				setUpdatedCategory("");
				setUpdatedPrice(0);
				setSuccessMessage("Seats reservation updated successfully!");
				setErrorMessage("");
			} else {
				// Handle error case...
				console.error("Error updating reservation:", response);
				setErrorMessage(
					"An error occurred while updating reservation. Please try again later."
				);
				setSuccessMessage("");
			}
		} catch (error) {
			// Handle error case...
			console.error("Error updating reservation:", error);
			setErrorMessage(
				"An error occurred while updating reservation. Please try again later."
			);
			setSuccessMessage("");
		}

		// Close the update form
		closeUpdateForm();
	};

	useEffect(() => {
		let totalPrice = 0;
		for (const seatId of selectedSeats) {
			const seat = seats.find((seat) => seat.id === seatId);
			if (seat) {
				totalPrice += seat.price;
			}
		}
		setTotalPrice(totalPrice);
	}, [selectedSeats, seats]);

	const toggleUpdateForm = () => {
		setShowUpdateForm(!showUpdateForm);
	};

	const closeUpdateForm = () => {
		setShowUpdateForm(false);
		setUpdatedCategory("");
		setUpdatedPrice(0);
	};

	const handleBookTicket = async () => {
		if (selectedSeats.length === 0) {
			return;
		}

		const ticketData = {
			seats: selectedSeats,
			movie: theater.movie,
		};

		try {
			const response = await fetchWithToken(
				"http://127.0.0.1:8000/api/tickets/create/",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(ticketData),
				}
			);

			if (response.ok) {
				const responseData = await response.json();
				console.log("Ticket created:", responseData);
				setSuccessMessage("Ticket booked successfully!");
				setErrorMessage("");
				setSelectedSeats([]);
				setTimeout(() => {
					nav("/bookings", true);
				});
			} else {
				console.error("Error creating ticket:", response);
				setErrorMessage(
					"An error occurred while booking the ticket. Please try again later."
				);
				setSuccessMessage("");
			}
		} catch (error) {
			console.error("Error creating ticket:", error);
			setErrorMessage(
				"An error occurred while booking the ticket. Please try again later."
			);
			setSuccessMessage("");
		}
	};

	return (
		<div className="container-fluid seat-selection-page">
			<h2 className="text-center font-weight-bold text-white">
				Seat &nbsp;<span className="text-danger">Selection</span>
			</h2>
			<div className="seat-grid">
				{seats.length === 0 ? (
					<div className="row mb-3 ml-5">
						<div className="d-flex justify-content-start align-items-center vw-100">
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
				) : (
					seats?.map((seat) => {
						const isSeatSelected = selectedSeats.includes(seat.id);
						const isSeatReserved = reservedSeats.includes(seat.id);

						const seatClasses = ["seat"];
						if (isSeatSelected) {
							seatClasses.push("selected");
						} else if (isSeatReserved) {
							seatClasses.push("reserved");
						}

						return (
							<div
								key={seat.id}
								className={seatClasses.join(" ")}
								onClick={() => handleSeatClick(seat.id)}
							>
								{seat.seat_number}
							</div>
						);
					})
				)}
			</div>
			<div className="seat-status">
				<div className="seat-status-box">
					<div className="seat-status-color available"></div>
					<span className="text-white">Available</span>
				</div>
				<div className="seat-status-box">
					<div className="seat-status-color reserved"></div>
					<span className="text-white">Reserved</span>
				</div>
				<div className="seat-status-box">
					<div className="seat-status-color selected"></div>
					<span className="text-white">Selected</span>
				</div>
			</div>
			<div className="controls justify-content-around">
				<button
					className="btn btn-outline-success d-sm-block mt-3 btn-equal-height mb-2 font-weight-bolder"
					onClick={handleReserveSeats}
				>
					Reserve Seats
				</button>
				<button
					className="btn btn-outline-primary d-sm-block mt-3 btn-equal-height mb-2 font-weight-bolder"
					onClick={() => {
						setSelectedSeatIdForUpdate(selectedSeats[0]);
						toggleUpdateForm();
					}}
				>
					Update Reservation
				</button>
			</div>

			<div className="container mt-5 " style={{ margin: "0 auto" }}>
				<div className="row justify-content-center">
					<div className="col-12">
						<div className="total-price text-white font-weight-bolder bg-dark p-3">
							Total &nbsp;<span className="text-danger">Price:</span> &#x20B9;{" "}
							<span id="totalPrice">{totalPrice}</span>
						</div>
						<button
							className="btn btn-outline-danger btn-block mb-3 mt-3"
							id="bookButton"
							style={{ margin: "0 auto" }}
							onClick={handleBookTicket}
						>
							Book Ticket
						</button>
					</div>
				</div>
			</div>

			{/* update reservation Modal */}
			{showUpdateForm && (
				<div className="container update-reservation-form mb-3 p-5">
					<h4 className="text-center font-weight-bolder text-white">
						Update &nbsp; <span className="text-danger">Reservation</span>
					</h4>
					<form onSubmit={handleUpdateReservation}>
						<div className="form-group text-left">
							<label htmlFor="category" className="text-white font-weight-bold">
								New &nbsp; <span className="text-danger">Category</span>
							</label>
							<input
								type="text"
								id="category"
								className="form-control"
								value={updatedCategory}
								onChange={(e) => setUpdatedCategory(e.target.value)}
							/>
						</div>
						<div className="form-group text-left">
							<label htmlFor="price" className="text-white font-weight-bold">
								New &nbsp; <span className="text-danger">Price</span>
							</label>
							<input
								type="number"
								id="price"
								className="form-control"
								value={updatedPrice}
								onChange={(e) => setUpdatedPrice(parseFloat(e.target.value))}
							/>
						</div>
						<div className="d-flex justify-content-around">
							<button
								type="submit"
								className="btn btn-outline-success btn-block mt-2  btn-equal-height"
							>
								Update
							</button>
							<button
								type="button"
								className="btn btn-outline-danger btn-block mt-2  btn-equal-height"
								onClick={closeUpdateForm}
							>
								Close
							</button>
						</div>
					</form>
				</div>
			)}

			{successMessage && (
				<div
					className="alert alert-success alert-dismissible fade show"
					role="alert"
				>
					{successMessage}
					<button
						type="button"
						className="close"
						data-dismiss="alert"
						aria-label="Close"
						onClick={() => setSuccessMessage("")}
					>
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
			)}
			{errorMessage && (
				<div
					className="alert alert-danger alert-dismissible fade show"
					role="alert"
				>
					{errorMessage}
					<button
						type="button"
						className="close"
						data-dismiss="alert"
						aria-label="Close"
						onClick={() => setErrorMessage("")}
					>
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
			)}
		</div>
	);
};

export default SeatSelection;
