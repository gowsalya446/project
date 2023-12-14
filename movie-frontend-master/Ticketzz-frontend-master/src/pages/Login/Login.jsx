import * as Yup from "yup";

import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";

import axios from "axios";
import { useFormik } from "formik";

const Login = () => {
	const [responseData, setResponseData] = useState({
		responseText: "",
		responseClass: "",
	});

	const nav = useNavigate();

	const initialValues = {
		username: "",
		password: "",
	};
	const onSubmit = (values) => {
		axios
			.post("http://127.0.0.1:8000/api/auth/", values)
			.then(
				(response) => {
					localStorage.setItem("access", response.data.access_token);
					localStorage.setItem("refresh", response.data.refresh_token);
					console.log("response", response);
					setResponseData({
						responseText: "Login Successful",
						responseClass: "alert alert-success",
					});
					setTimeout(() => nav("/"), 1000);
				},
				(error) => {
					console.log("error", error);
					setResponseData({
						responseText: "Login Failed, Please provide valid credentials",
						responseClass: "alert alert-danger",
					});
					nav("/login", true);
				}
			)
			.catch((error) => console.log(error));
	};

	const validationSchema = Yup.object({
		username: Yup.string().required("Username is required"),
		password: Yup.string()
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
					"linear-gradient(to right, rgba(0, 0, 0, 0.8), rgba(51, 51, 51, 0.8))",
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
								"linear-gradient(to bottom, rgba(28, 30, 33, 0.3), rgba(28, 30, 33, 0.8))",
							boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
						}}
					>
						<div className={responseData.responseClass}>
							{responseData.responseText}
						</div>
						<h2 className="text-center text-white">
							Welcome Back to &nbsp;
							<span className="text-danger font-weight-bold">BOLETO</span>
						</h2>
						<hr />
						<form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
							<div className="mb-3 form-group">
								<label
									htmlFor="username"
									className="text-white font-weight-bold"
								>
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
									placeholder="Enter Your Username"
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
									htmlFor="password"
									className="text-white font-weight-bold"
								>
									Pass<span className="text-danger">word</span>
								</label>
								<input
									type="password"
									className={
										formik.touched.password && formik.errors.password
											? "form-control is-invalid"
											: "form-control"
									}
									id="password"
									name="password"
									placeholder="Enter Your Password"
									value={formik.values.password}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
								/>
								{formik.touched.password && formik.errors.password ? (
									<small className="text-danger">
										{formik.errors.password}
									</small>
								) : null}
							</div>
							<input
								type="submit"
								className="btn btn-outline-success btn-block text-center font-weight-bold text-white"
								value="Login"
								disabled={!formik.isValid}
							/>
						</form>
						<br />
						<p className="text-center font-weight-bold text-white">
							New <span className="text-danger">User</span> ?{" "}
							<Link to="/register">Click Here</Link>
						</p>
						<p className="text-center font-weight-bold text-white">
							Forgot <span className="text-danger">Password</span> ?{" "}
							<Link to="/forgotPassword">Reset Here</Link>
						</p>
					</div>
				</div>
				<div className="col-md-3"></div>
			</div>
		</div>
	);
};

export default Login;
