import "bootstrap/dist/css/bootstrap.min.css";
import "./Profile.css";

import React, { useEffect, useState } from "react";

import { fetchWithToken } from "../../helper/Interceptor/Interceptor";
import { useNavigate } from "react-router-dom";

const Profile = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [showModal, setShowModal] = useState(false);
	const [showPasswordModal, setShowPasswordModal] = useState(false);
	const [oldPassword, setOldPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [showSuccessAlert, setShowSuccessAlert] = useState(false);
	const [showErrorAlert, setShowErrorAlert] = useState(false);
	const [alertMessage, setAlertMessage] = useState("");

	const nav = useNavigate();

	useEffect(() => {
		fetchUserProfile();
	}, []);

	const fetchUserProfile = async () => {
		try {
			const response = await fetchWithToken(
				"http://127.0.0.1:8000/api/users/get/"
			);
			if (response.ok) {
				const results = await response.json();
				setName(results.name);
				setEmail(results.email);
				setUsername(results.username);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const updateProfile = async () => {
		try {
			const response = await fetchWithToken(
				"http://127.0.0.1:8000/api/users/update/",
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ name, email, username }),
				}
			);
			if (response.ok) {
				console.log("Profile updated successfully");
				showSuccessMessage("Profile updated successfully");
				const updatedData = await response.json();
				setName(updatedData.name);
				setEmail(updatedData.email);
				setUsername(updatedData.username);
				// Close the modal
				setShowModal(false);
			} else {
				console.error("Failed to update profile");
				showErrorMessage("Failed to update profile");
			}
		} catch (error) {
			console.log(error);
			showErrorMessage("An error occurred while updating profile");
		}
	};

	const deleteProfile = async () => {
		try {
			const response = await fetchWithToken(
				"http://127.0.0.1:8000/api/users/delete/",
				{
					method: "DELETE",
				}
			);

			if (response.ok) {
				console.log("Profile deleted successfully");
				showSuccessMessage("Profile deleted successfully");
				setName("");
				setEmail("");
				setUsername("");
				setTimeout(() => {
					nav("/", true);
					localStorage.removeItem("refresh");
					localStorage.removeItem("access");
				}, 5000);
			} else {
				console.error("Failed to delete profile");
				showErrorMessage("Failed to delete profile");
			}
		} catch (error) {
			console.error("Error deleting profile:", error);
			showErrorMessage("An error occurred while deleting profile");
		}
	};

	const openPasswordModal = () => {
		setShowPasswordModal(true);
	};

	const closePasswordModal = () => {
		setShowPasswordModal(false);
		setOldPassword("");
		setNewPassword("");
	};

	const savePasswordChanges = async () => {
		try {
			const response = await fetchWithToken(
				"http://127.0.0.1:8000/api/users/update_password/",
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						old_password: oldPassword,
						new_password: newPassword,
					}),
				}
			);

			if (response.ok) {
				console.log("Password updated successfully");
				showSuccessMessage("Password updated successfully");
				closePasswordModal(); // Close the modal
			} else {
				console.error("Failed to update password");
				showErrorMessage("Failed to update password");
			}
		} catch (error) {
			console.error(error);
			showErrorMessage("An error occurred while updating password");
		}
	};

	// Function to show success alert
	const showSuccessMessage = (message) => {
		setAlertMessage(message);
		setShowSuccessAlert(true);
		setTimeout(() => {
			setShowSuccessAlert(false);
			setAlertMessage("");
		}, 3000); // Hide the alert after 3 seconds
	};

	// Function to show error alert
	const showErrorMessage = (message) => {
		setAlertMessage(message);
		setShowErrorAlert(true);
		setTimeout(() => {
			setShowErrorAlert(false);
			setAlertMessage("");
		}, 3000); // Hide the alert after 3 seconds
	};

	return (
		<div className="profile-page">
			{/* Success Alert */}
			{showSuccessAlert && (
				<div
					className="alert alert-success alert-dismissible fade show"
					role="alert"
				>
					{alertMessage}
					<button
						type="button"
						className="close"
						data-dismiss="alert"
						aria-label="Close"
						onClick={() => setShowSuccessAlert(false)}
					>
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
			)}

			{/* Error Alert */}
			{showErrorAlert && (
				<div
					className="alert alert-danger alert-dismissible fade show"
					role="alert"
				>
					{alertMessage}
					<button
						type="button"
						className="close"
						data-dismiss="alert"
						aria-label="Close"
						onClick={() => setShowErrorAlert(false)}
					>
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
			)}

			<div className="container mt-5">
				<div className="row justify-content-center">
					<div className="col-md-6">
						<div className="card">
							<div className="card-header">
								<h4 className="text-center font-weight-bold text-white">
									Profile <span className="text-danger"> Information</span>
								</h4>
							</div>
							<div className="card-body">
								<div className="form-group">
									<label htmlFor="name" className="text-left">
										Na<span className="text-danger">me</span>
									</label>
									<input
										type="text"
										className="form-control"
										id="name"
										readOnly
										value={name}
										onChange={(e) => setName(e.target.value)}
									/>
								</div>
								<div className="form-group">
									<label htmlFor="email" className="text-left">
										Em<span className="text-danger">ail</span>
									</label>
									<input
										type="email"
										className="form-control"
										id="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										readOnly
									/>
								</div>
								<div className="form-group">
									<label htmlFor="username" className="text-left">
										User<span className="text-danger">name</span>
									</label>
									<input
										type="text"
										className="form-control"
										id="username"
										value={username}
										onChange={(e) => setUsername(e.target.value)}
										readOnly
									/>
								</div>
								<div className="d-flex justify-content-between align-items-center flex-wrap">
									<button
										className="btn btn-outline-primary btn-block mb-2 p-2"
										onClick={() => setShowModal(true)}
									>
										Update Profile
									</button>
									<button
										className="btn btn-outline-success btn-block mb-2 p-2"
										onClick={openPasswordModal}
									>
										Update Password
									</button>
									<button
										className="btn btn-outline-danger mt-0 btn-block mb-2 p-2"
										onClick={deleteProfile}
									>
										Delete Profile
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			{showModal && (
				<div className="modal-container">
					<div className="modal-content">
						<h5 className="text-center text-white font-weight-bold">
							Edit <span className="text-danger"> Profile</span>
						</h5>
						<div className="form-group">
							<label htmlFor="modalName" className="text-left">
								Na<span className="text-danger">me</span>
							</label>
							<input
								type="text"
								className="form-control"
								id="modalName"
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
						</div>
						<div className="form-group">
							<label htmlFor="modalEmail" className="text-left">
								Em<span className="text-danger">ail</span>
							</label>
							<input
								type="email"
								className="form-control"
								id="modalEmail"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>
						<div className="form-group">
							<label htmlFor="modalUsername" className="text-left">
								User<span className="text-danger">name</span>
							</label>
							<input
								type="text"
								className="form-control"
								id="modalUsername"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
							/>
						</div>

						<button
							className="btn btn-outline-success btn-block mb-2 p-2"
							onClick={updateProfile}
						>
							Save Changes
						</button>
						<button
							className="btn btn-outline-danger btn-block mb-2 p-2"
							onClick={() => setShowModal(false)}
						>
							Close
						</button>
					</div>
				</div>
			)}
			{showPasswordModal && (
				<div className="modal-container">
					<div className="modal-content">
						<h5 className="text-center text-white font-weight-bold">
							Update <span className="text-danger">Password</span>
						</h5>
						<div className="form-group">
							<label htmlFor="modalOldPassword" className="text-left">
								Old &nbsp;<span className="text-danger">Password</span>
							</label>
							<input
								type="password"
								className="form-control"
								id="modalOldPassword"
								value={oldPassword}
								onChange={(e) => setOldPassword(e.target.value)}
							/>
						</div>
						<div className="form-group">
							<label htmlFor="modalNewPassword" className="text-left">
								New &nbsp;<span className="text-danger">Password</span>
							</label>
							<input
								type="password"
								className="form-control"
								id="modalNewPassword"
								value={newPassword}
								onChange={(e) => setNewPassword(e.target.value)}
							/>
						</div>
						<button
							className="btn btn-outline-success btn-block mb-2 p-2"
							onClick={savePasswordChanges}
						>
							Save Changes
						</button>
						<button
							className="btn btn-outline-danger btn-block mb-2 p-2"
							onClick={closePasswordModal}
						>
							Close
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default Profile;
