// API
// Contains all the Endpoints the user account makes to the back-end server

let token = null;

// Set User Web Token
export function set_token(val) {
    if (typeof val === 'string') {
        token = val;
    } else {
        return null;
    }
}

// Check Organization
export function check_organization(organization) {
    return fetch('/api/check_organization/', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Pragma': 'no-cache',
            'organization': organization,
        },
    });
}

export function check_email(email_address) {
    return fetch('/api/check_email/', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Pragma': 'no-cache',
            'email': email_address,
        },
    });
}


// Account Login
export function login(email, password, organizationName) {
    return fetch('/api/login/', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Pragma': 'no-cache',
        },
        body: JSON.stringify({
            'email': email,
            'password': password,
            'organization': organizationName
        })
    });
}

// Account Registration
export function register(fullName, email, password, organizationName) {
    return fetch('/api/register/', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Pragma': 'no-cache',
        },
        body: JSON.stringify({
            'fullName': fullName,
            'email': email,
            'password': password,
            'organization': organizationName
        })
    });
}

// Account Creation
export function create_account(fullName, email, password) {
    return fetch('/api/create_account/', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Pragma': 'no-cache',
            'Authorization': token,
        },
        body: JSON.stringify({
            'fullName': fullName,
            'email': email,
            'password': password,
        })
    });
}

// Fetch Logged In User Data
export function fetchUserData() {
    return fetch('/api/fetch_user/', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Pragma': 'no-cache',
            'Authorization': token,
        },
    });
}

//Fetch Logged In User's Post Data
export function fetchPosts(user, page, pageItems) {
    return fetch('/api/fetch_posts/', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Pragma': 'no-cache',
            'Authorization': token,
            'page': page,
            'pageItems': pageItems
        },
    });
}

//Fetches a Single User Post
export function fetch_single_post(id) {
    return fetch('/api/fetch_single_post/', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Pragma': 'no-cache',
			'Authorization': token,
			'postid': id
        },
    });
}

export function edit_post(properties) {
    return fetch('/api/edit_post/', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Pragma': 'no-cache',
			'Authorization': token
        },
		body: JSON.stringify(properties)
    });
}

//Deletes a Logged In User's Post
export function delete_post(id) {
    return fetch('/api/delete_post/', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Pragma': 'no-cache',
			'Authorization': token
        },
		body: JSON.stringify({
            'id': id
        })
    });
}

//Publish a User's Individual Post
export function publish_post(properties) {
    return fetch('/api/publish_post/', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Pragma': 'no-cache',
			'Authorization': token,
        },
        body: JSON.stringify(properties),
    });
}

// Fetch list of user posts for the records page
export function fetch_records(page, pageItems) {
    return fetch('/api/fetch_records/', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Pragma': 'no-cache',
            'Authorization': token,
            'page': page,
            'pageItems': pageItems
        },
    });
}

export function search_records(page, pageItems, search) {
    return fetch('/api/fetch_records/', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Pragma': 'no-cache',
            'Authorization': token,
            'page': page,
            'pageItems': pageItems,
			'search': search
        },
    });
}

// Add Activity
export function add_activity(title, description, color) {
    return fetch('/api/add_activity/', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Pragma': 'no-cache',
            'Authorization': token,
        },
        body: JSON.stringify({
            'title': title,
            'description': description,
            'color': color
        })
    });
}

// Edit Activity
export function edit_activity(id, title, description, color) {
    return fetch('/api/edit_activity/', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Pragma': 'no-cache',
            'Authorization': token,
        },
        body: JSON.stringify({
            'id': id,
            'title': title,
            'description': description,
            'color': color
        })
    });
}

// Fetch list of activities
export function fetch_activities(page, pageItems) {
    return fetch('/api/fetch_activities/', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Pragma': 'no-cache',
            'Authorization': token,
            'page': page,
            'pageItems': pageItems
        },
    });
}



// Fetch single activity
export function fetch_activity(id) {
    return fetch('/api/fetch_activity/', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Pragma': 'no-cache',
            'Authorization': token,
            'activityId': id,
        },
    });
}


// Fetch single user
export function fetch_single_user(id) {
    return fetch('/api/fetch_single_user/', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Pragma': 'no-cache',
            'Authorization': token,
            'userId' : id,
        },
    });
}

// Delete Activity
export function delete_activity(id) {
    return fetch('/api/delete_activity/', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Pragma': 'no-cache',
            'Authorization': token,
        },
        body: JSON.stringify({
            'id': id
        })
    });
}

// Fetch list of user
export function fetch_users(page, pageItems) {
    return fetch('/api/fetch_users/', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Pragma': 'no-cache',
            'Authorization': token,
            'page': page,
            'pageItems': pageItems
        },
    });
}


export function check_password_reset_token(org, resetToken) {
    return fetch('/api/v2/check_reset_token/', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Pragma': 'no-cache',
            'org': org,
            'reset_token': resetToken
        },
    });
}


// Edit User
export function edit_user(id, fullName, email) {
    return fetch('/api/edit_user/', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Pragma': 'no-cache',
            'Authorization': token,
        },
        body: JSON.stringify({
            'id': id,
            'fullName': fullName,
            'email': email
        })
    });
}


// Reset password
export function reset_password(id, password) {
    return fetch('/api/reset_password/', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Pragma': 'no-cache',
            'Authorization': token
        },
        body: JSON.stringify({
            'id': id,
            'password': password
        })
    });
}


// Forgot password
export function forgot_password(email, organization) {
    return fetch('/api/forgot/', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Pragma': 'no-cache',
            'Authorization': token
        },
        body: JSON.stringify({
            'email': email, 
            'organization': organization
        })
    })
}


// Reset usertype
export function reset_usertype(id, userType) {
    return fetch('/api/reset_usertype/', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Pragma': 'no-cache',
            'Authorization': token,
        },
        body: JSON.stringify({
            'id': id,
            'userType': userType
        })
    });
}


// Delete User
export function delete_user(emailAddress) {
    return fetch('/api/delete_user/', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Pragma': 'no-cache',
            'Authorization': token,
        },
        body: JSON.stringify({
            'email': emailAddress
        })
    });
}


