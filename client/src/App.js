import React, { Component } from 'react';
import './App.css';
import Spotify from 'spotify-web-api-js';
import {Button, Navbar, NavbarBrand, Nav, NavItem, NavLink, } from 'reactstrap';
import Info from './Info';
import Lyrics from './Lyrics';

const spotifyWebApi = new Spotify();

class App extends Component {
  constructor(props){
    super(props);
    const params = this.getHashParams();
    if(params.access_token){
      spotifyWebApi.setAccessToken(params.access_token)
    }
    this.state = {
      isLoggedIn: params.access_token ? true : false,
      nowPlaying: {
        name: 'Undefined',
        albumArt: ''
      }
    }
  }

  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while ( e = r.exec(q) ) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }


  render() {
    return (
    <div className="App">
      <Navbar color="light" expand="md">
        <NavbarBrand href="/">Lyricfy</NavbarBrand>
        <Nav className="ml-auto" navbar>
        { !this.state.isLoggedIn &&  
          <NavItem>
            <NavLink href="/">José Azevedo</NavLink>
          </NavItem>
        }
        { this.state.isLoggedIn &&
          <NavItem>
            <NavLink href="https://accounts.spotify.com/en/logout">Logout</NavLink>
          </NavItem>
        }
        </Nav>
      </Navbar>
      { !this.state.isLoggedIn &&
      <div className="maindiv">
        <img className="img-fluid" id="spotifyicon" src="https://image.flaticon.com/icons/svg/226/226773.svg"/> 
        <Button width="100%" color="info" id="signin" href="http://localhost:8888/login">Sign In</Button>
      </div>
      }
      { this.state.isLoggedIn &&
      <div className="main">
        <Info/>
        <Lyrics/>
      </div>
      }
      </div>
    );
  }
}

export default App;
