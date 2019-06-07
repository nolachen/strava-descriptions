import React, { Component } from 'react';
import Sidebar from 'react-sidebar';
import BallLoader from '../BallLoader/BallLoader';
import UserSelectedSettings from './UserSelectedSettings';
import Dropdown from './Dropdown';
import Hamburger from '../widgets/Hamburger';
import './Dashboard.css';
import { API_URL } from '../config';

class Dashboard extends Component {
  constructor() {
    super();

    this.state = {
      athlete: null,
      stateParam: null,
      sidebarOpen: false,
      wantsWeather: null,
      wantsMusic: null,
      isLoading: true,
    };

    this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
  }

  componentDidMount() {
    const athlete = JSON.parse(localStorage.getItem('athlete'));
    const stateParam = this.generateStateParam();
    sessionStorage.setItem('stateParam', stateParam);

    this.setState({ athlete, stateParam });

    // Fetch settings from backend
    const athleteID = athlete.id;
    fetch(`${API_URL}/settings/${athleteID}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(res => {
        const { wantsWeather, wantsMusic } = res;
        this.setState({
          wantsWeather,
          wantsMusic,
          isLoading: false,
        });
      })
      .catch(error => console.log(error));
  }

  generateStateParam() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  onSetSidebarOpen(open) {
    this.setState({ sidebarOpen: open });
  }

  render() {
    const { athlete, isLoading, wantsWeather, wantsMusic } = this.state;

    const name = athlete ? athlete.firstname : '';

    const sidebarContent = (
      <div className='sidebar-content'>
        <div className='sidebar-top'>
          <Hamburger
            animation={'hamburger--spin'}
            isActive={this.state.sidebarOpen}
            onClick={() => this.onSetSidebarOpen(false)}
          />
          <h3 className='username no-mobile-highlight'>{name}</h3>
        </div>
        <nav className='sidebar-nav'>
          <ul>
              <li><a href="/settings" className='no-mobile-highlight'>Settings</a></li>
              <li><a href="/logout" className='no-mobile-highlight'>Log out</a></li>
          </ul>
        </nav>
      </div>
    );

    const mobileHeader = (
      <header className='top-bar-mobile'>
        <div className='sidebar-top-nav'>
          <div className='filler'></div>
          <h1 className='title'>TIEMPO</h1>
          <Hamburger
            animation={'hamburger--spin'}
            onClick={() => this.onSetSidebarOpen(true)}
          />
        </div>
      </header>
    );

    const desktopHeader = (
      <header className='top-bar-desktop'>
        <h1 className='title'>TIEMPO</h1>
        <Dropdown
          name={name}
          links={['/settings', '/logout']}
          titles={['Settings', 'Log out']}
        />
      </header>
    );

    const bodyContent = isLoading
      ? <div className='loading-box'>
          <BallLoader id='black'/>
        </div>
      : <UserSelectedSettings wantsWeather={wantsWeather} wantsMusic={wantsMusic}/>
      ;

    return (
      <div className='dashboard'>
          <div className='desktop-stuff'>
            {desktopHeader}
            {bodyContent}
          </div>
          <Sidebar
            sidebar={sidebarContent}
            open={this.state.sidebarOpen}
            onSetOpen={this.onSetSidebarOpen}
            styles={{ sidebar: { background: "white" } }}
            defaultSidebarWidth={0}
            pullRight={false}
            sidebarId='mySidebar'
          >
            {mobileHeader}
            {bodyContent}
          </Sidebar>
      </div>
    );
  }
}

export default Dashboard;
