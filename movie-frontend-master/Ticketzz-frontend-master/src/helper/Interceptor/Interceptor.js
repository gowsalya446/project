// Replace with your actual API base URL

async function fetchWithToken(url, options = {}) {
	const token = localStorage.getItem("access"); // Get token from local storage

	// If token is available, add it to the request headers
	if (token) {
		options.headers = {
			...options.headers,
			Authorization: `Bearer ${token}`,
		};
	}

	const response = await fetch(`${url}`, options);
	// Check if token expired
	if (response.status === 401) {
		const refreshToken = localStorage.getItem("refresh"); // Get refresh token from local storage
		if (refreshToken) {
			// Fetch new access token using refresh token
			const refreshResponse = await fetch(
				`http://127.0.0.1:8000/api/refresh/`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ refresh_token: refreshToken }),
				}
			);

			if (refreshResponse.ok) {
				const data = await refreshResponse.json();
				localStorage.setItem("access", data.access_token);
				return fetchWithToken(url, options);
			} else {
				localStorage.removeItem("access");
				localStorage.removeItem("refresh");
			}
		}
	}

	return response;
}

export { fetchWithToken };
