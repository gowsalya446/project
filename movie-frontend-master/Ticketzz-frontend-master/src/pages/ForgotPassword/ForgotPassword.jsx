import * as Yup from "yup";

import React, { useState } from "react";

import axios from "axios";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";

// import { fetchWithToken } from "../../helper/Interceptor/Interceptor";

const ForgotPassword = () => {
	const [responseData, setResponseData] = useState({
		responseText: "",
		responseClass: "",
	});

	const nav = useNavigate();

	const initialValues = {
		username: "",
		newPassword: "",
	};
	const onSubmit = (values) => {
		axios
			.post("http://127.0.0.1:8000/api/users/forgot_password/", values)
			.then(
				(response) => {
					console.log("response", response);
					setResponseData({
						responseText: "Password updated successfully.",
						responseClass: "alert alert-success",
					});
					setTimeout(() => nav("/login"), 1000);
				},
				(error) => {
					console.log("error", error);
					setResponseData({
						responseText:
							"Password Reset Failed, Please provide valid credentials",
						responseClass: "alert alert-danger",
					});
					nav("/forgotPassword", true);
				}
			)
			.catch((error) => console.log(error));
	};

	// const onSubmit = async (values) => {
	// 	try {
	// 		const response = await fetchWithToken(
	// 			"http://127.0.0.1:8000/api/users/forgot_password/",
	// 			{
	// 				method: "POST",
	// 				headers: {
	// 					"Content-Type": "application/json",
	// 				},
	// 				body: JSON.stringify(values),
	// 			}
	// 		);

	// 		if (response.ok) {
	// 			const data = await response.json();
	// 			console.log("response", data);

	// 			setResponseData({
	// 				responseText: "Password updated successfully.",
	// 				responseClass: "alert alert-success",
	// 			});
	// 			setTimeout(() => nav("/login"), 1000);
	// 		} else {
	// 			console.log("error", response);
	// 			setResponseData({
	// 				responseText:
	// 					"Password Reset Failed, Please provide valid credentials",
	// 				responseClass: "alert alert-danger",
	// 			});
	// 			nav("/forgotPassword", true);
	// 		}
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
	// };

	const validationSchema = Yup.object({
		username: Yup.string().required("Username is required"),
		newPassword: Yup.string()
			.required("Password is required")
			.min(6, "password should have at least 6 character")
			.max(20, "password should not more than 20 character"),
	});
	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit,
		validateOnMount: true,
	});
	return (
		<div
			className="container-fluid"
			style={{
				background:
					"linear-gradient(to right, rgba(0, 0, 0, 0.8), rgba(51, 51, 51, 0.8)),center/cover no-repeat",
			}}
		>
			<div className="row">
				<div className="col-md-3"></div>
				<div className="col-md-6">
					<div
						style={{
							padding: "30px 40px",
							marginTop: "80px",
							borderRadius: "10px",
							background:
								"linear-gradient(to bottom, rgba(28, 30, 33, 0.3), rgba(28, 30, 33, 0.8)),center/cover no-repeat",
							boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
						}}
					>
						<div className={responseData.responseClass}>
							{responseData.responseText}
						</div>
						<h2 className="text-center text-white font-weight-bold">
							Reset &nbsp;
							<span className="text-danger "> Password</span>
						</h2>
						<hr />
						<form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
							<div className="mb-3 form-group">
								<label htmlFor="email" className="text-white font-weight-bold">
									User<span className="text-danger">name</span>
								</label>
								<input
									type="username"
									className={
										formik.touched.username && formik.errors.username
											? "form-control is-invalid"
											: "form-control"
									}
									id="username"
									name="username"
									placeholder="Enter Your username"
									value={formik.values.username}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
								/>
								{formik.touched.username && formik.errors.username ? (
									<small className="text-danger">
										{formik.errors.username}
									</small>
								) : null}
							</div>
							<div className="mb-3 form-group">
								<label
									htmlFor="newPassword"
									className="text-white font-weight-bold"
								>
									New <span className="text-danger">Password</span>
								</label>
								<input
									type="password"
									className={
										formik.touched.newPassword && formik.errors.newPassword
											? "form-control is-invalid"
											: "form-control"
									}
									id="newPassword"
									name="newPassword"
									placeholder="Enter Your New Password"
									value={formik.values.newPassword}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
								/>
								{formik.touched.newPassword && formik.errors.newPassword ? (
									<small className="text-danger">
										{formik.errors.newPassword}
									</small>
								) : null}
							</div>
							<input
								type="submit"
								className="btn btn-outline-primary btn-block text-center font-weight-bold text-white"
								value="Reset"
								disabled={!formik.isValid}
							/>
						</form>
					</div>
				</div>
				<div className="col-md-3"></div>
			</div>
		</div>
	);
};

export default ForgotPassword;
