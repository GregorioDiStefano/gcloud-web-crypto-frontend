import React, { Component } from 'react'
import { Link } from 'react-router'

class Header extends Component {
  render() {
    return (
      <div id="header">
        <div id="mainMenu">
          <Link to={`/dir`}>NAVIGATE</Link>
          <Link to={`/upload`}>UPLOAD</Link>
        </div>

        <div id="userMenu">
          <Link to={`/user`}>{localStorage.getItem("user").toUpperCase()}</Link>
          <Link to={`/logout`}>LOGOUT</Link>
        </div>
      </div>
    );
  }
}
export default Header
