import { Navigate } from "react-router-dom";
import React from "react";

function tokenExist() {
	let token = localStorage.getItem("access");
	if (token) {
		return true;
	} else {
		return false;
	}
}
export const ProtectedRoute = (props) => {
	const Component = props.component;
	const authorize = tokenExist();

	return authorize ? <Component /> : <Navigate to="/login" />;
};
