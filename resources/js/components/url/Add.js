import React, { Component } from 'react';
import axios from 'axios';
import SuccessMessage from '../SuccessMessage';
import ErrorMessage from '../ErrorMessage';
import Home from '../Home';

export default class Add extends Component {

	constructor()
	{
		super();

		this.onChangeUrl = this.onChangeUrl.bind(this);
		this.onChangeStatus = this.onChangeStatus.bind(this);
		this.onSubmit = this.onSubmit.bind(this);

		//initialize states
		this.state = {
			url : '',
			status : '',
			message : '',
			errors : ''
		}
	}

	onChangeUrl(e)
	{
		this.setState({
			url: e.target.value
		});

	}

	onChangeStatus(e)
	{
		this.setState({
			status: e.target.value
		});

	}

	onSubmit(e)
	{
		if(localStorage.getItem('token') !== null)
		{
			e.preventDefault();
			const url_data = {
				url : this.state.url,
				status : this.state.status
			}

			var accessToken = localStorage.getItem('token');
			//send post request to add new url
			return axios({
					 method: 'post', url: 'http://localhost/icons_task/public/api/v1/urls',
					 params: url_data,
					 headers: { 'Authorization': 'Bearer ' + accessToken }
					}).then(response => {
						  	this.setState({message: 'success'});
					}).catch(error=>{
							var errors_string='Error(s) Occured';
							//get validation errors
							if(error.response.data.error !=='undefined')
							{
								var error_object = error.response.data.error;
								for (var key in error_object) {
								    if (error_object.hasOwnProperty(key)) {           
								        for (var key2 in error_object[key]) {
								        	if (error_object[key].hasOwnProperty(key2)) {  
									        	//console.log(key, error_object[key][key2]);
									        	errors_string += ' | ' + error_object[key][key2] ;
									        }
								        }
								    }
								}
							}
							//update states
							this.setState({message: 'error'});
							this.setState({errors: errors_string});
					});
		}

	}

    render() {
        return (
        	    localStorage.getItem('token')!==null?
        		(
		            <div>
		            	{this.state.message=="success"?<SuccessMessage message="Url Added Successfully"/>:null}
		            	{this.state.message=="error"?<ErrorMessage errors={this.state.errors}/>:null}
		                <form onSubmit={this.onSubmit}>
						  <div className="form-group">
						    <label htmlFor="url">URL</label>
						    <input type="text" className="form-control" id="url" 
						    	value={this.state.url} onChange={this.onChangeUrl}  placeholder="Enter url"/>
						    <label htmlFor="status">Status</label>
						    <select className="form-control" id="status" value={this.state.status} onChange={this.onChangeStatus}>
						      <option>Select Status</option>
						      <option value="online">Online</option>
						      <option value="offline">Offline</option>
						    </select>
						  </div>
						  <button type="submit" className="btn btn-primary">Submit</button>
						</form>
		            </div>
		        )
		        :<Home/>
        );
    }
}