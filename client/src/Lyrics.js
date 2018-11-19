import React, { Component } from 'react';
import Spotify from 'spotify-web-api-js';
import './Lyrics.css';
import apikey from './keys';

const spotifyWebApi = new Spotify();
const musixmatchApi = 'http://api.musixmatch.com/ws/1.1/';

class Lyrics extends Component {
  constructor(props){
    super(props);
    this.state = {
      nowPlaying: {
        name: '',
        artist: '',
        albumArt: ''
      },
      lyrics: {
        lyrics: '',
        track_id: '',
        isFound: false
      }
    }
  }

  async componentDidMount() {
    await this.getNowPlaying();
    await this.getTrackId();
    await this.getSongLyrics();
  }

  async getNowPlaying() {
    const response = await spotifyWebApi.getMyCurrentPlaybackState();
        console.log(response)
        if(response){
          this.setState({
            nowPlaying: {
              name: response.item.name,
              artist: response.item.artists[0].name,
              albumArt: response.item.album.images[0].url,
            }
          })
        } else {
          this.setState({
            nowPlaying: {
              name: 'Nothing is playing',
              albumArt: 'https://getthedrift.com/wp-content/uploads/2018/09/Nothing1.jpg',
              lyrics: 'Bummer!'
            }
          })
        }
  }

  async getTrackId() {
    //tem de se por o cors-anywhere antes para não dar erro :/
    const response = await fetch(`https://cors-anywhere.herokuapp.com/${musixmatchApi}track.search?q_artist=${this.state.nowPlaying.artist}&q_track=${this.state.nowPlaying.name}&apikey=${apikey.apikey}`);
    const data = await response.json();

    console.log(data)
    let trackListIndex = 0;
    for(let i = 0; i < data.message.body.track_list.length; i++){
      if(data.message.body.track_list[i].track.has_lyrics) {
        console.log("ENTREI")
        trackListIndex = i;
        this.setState({
          lyrics: {
            isFound: true
          }
        })
      }
    }
    console.log(trackListIndex, this.state.lyrics.isFound)
    if(this.state.lyrics.isFound){
      this.setState({
        lyrics: {
          track_id: data.message.body.track_list[trackListIndex].track.track_id
        }
      })
    } else {
      console.log("not found")
      this.setState({
        lyrics:{
          lyrics: 'Oops, no lyrics found',
          track_id: 'Not found'
        }
      })
    }
  }

  async getSongLyrics() {
    console.log(this.state.lyrics.track_id)
    if(this.state.lyrics.track_id !== 'Not found'){
      const url = `https://cors-anywhere.herokuapp.com/${musixmatchApi}track.lyrics.get?track_id=${this.state.lyrics.track_id}&apikey=${apikey.apikey}`;
      console.log("TRACK ID", this.state.lyrics.track_id)
      const response = await fetch(url)
      const data = await response.json()

      console.log(data)
      this.setState({
        lyrics:{
          lyrics: data.message.body.lyrics.lyrics_body
        }
      })
    }
  }

  render() {
    return(
      <div id="lyrics">
        {/* <Button color="danger" onClick={() => this.getNowPlaying()}>
          Check Now Playing
        </Button> */}
        <div id="header">
          <div id="header-left">
            <b>{ this.state.nowPlaying.name }</b>
            <br/>
            { this.state.nowPlaying.artist }
          </div>
          <div id="header-right">
            <img className="img-fluid" alt="album cover" src={ this.state.nowPlaying.albumArt }/>
          </div>
          <div id="lyric">
            <pre>
              <p>{ this.state.lyrics.lyrics }</p>
            </pre>
          </div>
        </div>
        
      </div>
    )
  }
}

export default Lyrics;