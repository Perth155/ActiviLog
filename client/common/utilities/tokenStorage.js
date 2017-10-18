// Save Token
export function saveToken(token) {
    localStorage.setItem("token", JSON.stringify(token));
	if (JSON.parse(localStorage.getItem("token")) == token) {
		return true;
	} else {
		return false;
	}
}

// Get Token
export function getToken() {
	return JSON.parse(localStorage.getItem("token"));
}

// Clear Token
export function clearToken() {
    if (JSON.parse(localStorage.getItem("token")) !== null) {
		localStorage.removeItem("token");
		localStorage.clear();
		sessionStorage.clear();
	}
	if (JSON.parse(localStorage.getItem("token")) !== null) {
		return false;
	} else {
		return true;
	}
}