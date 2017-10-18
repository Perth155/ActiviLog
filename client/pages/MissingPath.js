import React from "react";
import PropTypes from "prop-types";

class MissingPath extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return <div className="pageNotFound">
			Error 404. Page could not be found.
		</div>;
	};
};

MissingPath.propTypes = {
	user: PropTypes.object,
};

export default MissingPath;
