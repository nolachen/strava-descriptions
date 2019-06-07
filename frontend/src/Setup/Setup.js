import React, { Component, Fragment } from 'react';
import Cookies from 'js-cookie';
import ReactTooltip from 'react-tooltip';
import CheckboxItem from './CheckboxItem';
import BallLoader from '../BallLoader/BallLoader';
import history from '../history';
import './Setup.css';
import { API_URL, SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI } from '../config';

class Setup extends Component {
  constructor() {
    super();

    this.state = {
      isWeatherSelected: true,
      isSpotifySelected: true,
      athlete: null,
      isLoading: true,
      isUpdatingSettings: false,
      imagesLoaded: 0,
      images: [null, null],
    };

    this.handleSelect = this.handleSelect.bind(this);
    this.handleImageLoad = this.handleImageLoad.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  handleImageLoad() {
    console.log('loaded')
    this.setState(state => ({
      imagesLoaded: state.imagesLoaded + 1
    }))
  }

  componentDidMount() {
    const athlete = JSON.parse(localStorage.getItem('athlete'));
    this.setState({
      athlete,
      isLoading: false,
    })

    const darksky = new Image();
    darksky.onload = this.handleImageLoad;
    darksky.src = require('./darksky.png');

    const spotify = new Image();
    spotify.onload = this.handleImageLoad;
    spotify.src = require('./Spotify.png');


    this.setState({
      images: [darksky, spotify]
    })
  }

  handleSelect(event) {
    if (event.target.id === 'weather') {
      this.setState(state => ({
        isWeatherSelected: !state.isWeatherSelected
      }))
    } else if (event.target.id === 'spotify') {
      this.setState(state => ({
        isSpotifySelected: !state.isSpotifySelected
      }))
    }
  }

  async onSubmit(event) {
    event.preventDefault();
    const { athlete, isWeatherSelected, isSpotifySelected } = this.state;
    const stravaAthleteID = athlete.id;
    const stateParam = this.generateStateParam();
    sessionStorage.setItem('stateParam', stateParam);
    Cookies.remove('stateParam');
    Cookies.set('stateParam', stateParam);
    const scope = 'user-read-recently-played';

    // Talk to Tiempo database
    this.setState({ isUpdatingSettings: true });
    const response = await fetch(`${API_URL}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        athleteID: stravaAthleteID,
        wantsWeather: isWeatherSelected,
        wantsMusic: isSpotifySelected,
      })
    });
    console.log(response);
    // this.setState({ isUpdatingSettings: false });


    if (isSpotifySelected) {
      window.location.assign(`https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${SPOTIFY_REDIRECT_URI}&scope=${scope}&state=${stateParam}`);
    } else {
      history.push('/dashboard');
    }
  }

  generateStateParam() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  render() {
    const infoMessage = 'Whenever you upload an activity to Strava, Tiempo will collect weather data and recently played Spotify history. It will then automatically update the description with no action required on your end.';
    const { isLoading, isUpdatingSettings, athlete, images, imagesLoaded } = this.state;
    const waiting = isLoading  || isUpdatingSettings || imagesLoaded < images.length;

    return(
      <div className='setup-page'>
      { waiting ?
        <div className='loading-box'>
          <BallLoader id='black' />
          { isUpdatingSettings && <h1 className="authorizing">Updating your settings</h1> }
        </div>
          :
        (<Fragment>
          <header>
            <h1 className='title'>TIEMPO</h1>
          </header>
          <div className='welcome-box fade-in'>
            <p className='welcome-message'>{`Welcome, ${athlete.firstname}!`}</p>
          </div>
          <div className='prompt-box fade-in'>
            <p className='prompt'>What information should Tiempo put in your activity descriptions?</p>
            <span className='more-info' data-tip={infoMessage}>How does this work?</span>
            <ReactTooltip className='tooltip' place='top' effect='solid' event='click' globalEventOff='click'/>
          </div>
          <div className='box fade-in'>
            <form className='tiempo-options'>
              <CheckboxItem id='weather' text='Weather conditions' onChange={this.handleSelect} />
              <CheckboxItem id='spotify' text='Music you listened to' onChange={this.handleSelect} />
            </form>
          </div>
          <p className='hesitant fade-in'>(You can change this at any time)</p>
          <button className='submit-button fade-in' onClick={this.onSubmit}>Let's Go!</button>
          <div className='branding fade-in'>
            <a href='https://darksky.net/poweredby/' target="_blank" rel='noreferrer noopener'>
              <img id='darksky' src={images[0].src} alt='Powered by DarkSky' />
            </a>
            <a href='https://www.spotify.com' id='spotify-link' target='_blank' rel='noreferrer noopener'>
              <div className='spotify-block'>
                <span className='provider'>Powered by</span>
                <img id='spotify' src={images[1].src} alt='Powered by Spotify' />
              </div>
            </a>
          </div>
        </Fragment>) }
      </div>
    );
  }
}

export default Setup;
