import * as Yup from "yup";

import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";

import axios from "axios";
import { useFormik } from "formik";

const Register = () => {
	const [responseData, setResponseData] = useState({
		responseText: "",
		responseClass: "",
	});

	const nav = useNavigate();

	const initialValues = {
		name: "",
		username: "",
		email: "",
		password: "",
	};
	const onSubmit = (values) => {
		axios
			.post("http://127.0.0.1:8000/api/users/create/", values)
			.then(
				(response) => {
					console.log(response);
					setResponseData({
						responseText: "Registration successful",
						responseClass: "alert alert-success",
					});
					setTimeout(() => nav("/login"), 1000);
				},
				(error) => {
					console.log(error);
					setResponseData({
						responseText: "Registration Failed, Please Try Again",
						responseClass: "alert alert-danger",
					});
				}
			)
			.catch((error) => console.log(error));
	};

	const validationSchema = Yup.object({
		name: Yup.string().required("Name is required"),
		username: Yup.string().required("username is required"),
		email: Yup.string()
			.required("Email is required")
			.email("Please enter a valid email"),
		password: Yup.string()
			.required("Password is required")
			.min(6, "password should have at least 6 character")
			.max(20, "password should not more than 20 character"),
	});

	const formik = useFormik({
		initialValues,
		onSubmit,
		validationSchema,
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
							Welcome To &nbsp;
							<span className="text-danger font-weight-bold">BOLETO</span>
						</h2>
						<hr />
						<form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
							<div className="mb-3 form-group">
								<label
									htmlFor="name"
									className="text-left text-white font-weight-bold"
								>
									Na<span className="text-danger">me</span>
								</label>
								<input
									type="text"
									className={
										formik.touched.name && formik.errors.name
											? "form-control is-invalid"
											: "form-control"
									}
									id="name"
									name="name"
									placeholder="Enter Your Name"
									value={formik.values.name}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
								/>
								{formik.touched.name && formik.errors.name ? (
									<small className="text-danger">{formik.errors.name}</small>
								) : null}
							</div>
							<div className="mb-3 form-group">
								<label
									htmlFor="username"
									className="text-left text-white font-weight-bold"
								>
									User<span className="text-danger">name</span>
								</label>
								<input
									type="text"
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
								<label htmlFor="email" className="text-white font-weight-bold">
									Em<span className="text-danger">ail</span>
								</label>
								<input
									type="text"
									className={
										formik.touched.email && formik.errors.email
											? "form-control is-invalid"
											: "form-control"
									}
									id="email"
									name="email"
									placeholder="Enter Your Email"
									value={formik.values.email}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
								/>
								{formik.touched.email && formik.errors.email ? (
									<small className="text-danger">{formik.errors.email}</small>
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
								className="btn btn-outline-primary btn-block text-center font-weight-bold text-white"
								value="Register"
								disabled={!formik.isValid}
							/>
						</form>
						<br />
						<p className="text-center text-white font-weight-bold">
							Already have an <span className="text-danger ">account</span> ?
							<Link to="/login"> Login Here</Link>
						</p>
					</div>
				</div>
				<div className="col-md-3"></div>
			</div>
		</div>
	);
};

export default Register;
