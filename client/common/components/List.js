import React from "react";
import Collapsible from "react-collapsible"; 
import _ from 'lodash';

class List extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			loading: false,
			error: false,
			posts: [],
		}
		
		this.sortPosts = this.sortPosts.bind(this);
	}
	
	//sort by date and save the posts in sorted.
	sortPosts() {	
		this.setState({loading: true});
		
		var data = this.props.posts;
		var sorted = _.groupBy(data, function(item) {
			return (item.date).toDateString();
		});
		
		this.setState({loading: false, posts: sorted});
	}
	
	componentDidMount() {
		this.sortPosts();		
	}
	
	render() {
		const {
			loading,
			error,
			posts,
		} = this.state;

		return <div>
			{Object.keys(this.state.posts).map((e) => {
				return <Collapsible trigger={e}>
					<table>
						<thead>
							<tr>
								<th>Time</th>
								<th>Description</th> 
							</tr>
						</thead>
						<tbody>
							{this.state.posts[e] != null && this.state.posts[e].map((item, i) => {
								return <tr key={i}>
									<th>{item.startTime.toTimeString().substring(0, 5)}</th>
									<th>
										<h1>{item.title}</h1>
										<p1>{item.desc}</p1>
									</th>
								</tr>
							})}
						</tbody>
					</table>
				</Collapsible>
			})}
		</div>
	};
};

export default List;
