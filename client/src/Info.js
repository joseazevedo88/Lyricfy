import React, { Component } from 'react';
import Spotify from 'spotify-web-api-js';
import './Info.css';
 
const spotifyWebApi = new Spotify();

class Info extends Component {
  constructor(props){
    super(props);
    this.state = {
      userData: {
        name: '',
        photo: ''
      }
    }
  }

  componentDidMount() {
    this.getPersonalInfo();
  }

  getPersonalInfo() {
    spotifyWebApi.getMe()
      .then(res => {
        console.log(res);
        this.setState({
            userData: {
              name: res.display_name,
              photo: res.images[0].url
            }
        })
      })
  }

  render(){
    return(
      <div id="info">
      <h2>Hi, { this.state.userData.name }</h2>
        <div>
          <img className="img-fluid" alt="my cover" src={ this.state.userData.photo }/>
        </div>
      </div>
    );
  }
}

export default Info;