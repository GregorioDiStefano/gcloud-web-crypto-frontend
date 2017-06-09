import React, { Component } from 'react'
import request from 'superagent'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Router, Route, Redirect, Link, browserHistory } from 'react-router'
import Recaptcha from 'react-recaptcha'

let recaptchaInstance;

class Login extends Component {
  constructor(props) {
    super(props)

    this.state = {
	    needCaptcha: false,
      wrongPassword: false,
      username: "",
      password: ""
    }
  }

  componentDidMount = () => {
    request
      .get('/account/initial')
      .end(function(error, response) {
         if (response.statusCode == 404) {
            browserHistory.push(`/signup`)
         }
      })
  }

  handleUserChange = (event) => {
    this.setState({ username: event.target.value});
  }

  handlePasswordChange = (event) => {
    this.setState({ password: event.target.value});
  }

  verifyCallback = (e) => {
    this.setState({ captcha_response: e })
  }

  onSubmit = (e) => {
    e.preventDefault()
    var self = this;
    request
      .post('/account/login')
      .set('Content-Type', 'application/json')
      .set("google-captcha", this.state.captcha_response)
      .send({ "username": this.state.username, "password": this.state.password })
      .end(function(error, response){
        if(error) {
          if (response.statusCode == 401) {
            self.setState({"wrongPassword": true})
          } else if (response.statusCode == 400) {
            self.setState({"needCaptcha": true})
          }
          recaptchaInstance.reset()
        } else {
          self.setState({"wrongPassword": false})

          var token = JSON.parse(response.text)["token"]
          document.cookie = "jwt=" + token;

          localStorage.setItem("user", self.state.username)

          if (self.props.location.state != null) {
            browserHistory.push(self.props.location.state.nextPathname)
          } else {
            // hack: should learn how to use flux
            browserHistory.push(`/dir`)
          }
        }
      });
  }

  render () {
    return (
       <form className="form-horizontal"  onSubmit={this.onSubmit}>
         <fieldset>
           <legend>Login</legend>
           <div className="form-group">

             <label className="col-md-4 control-label" htmlFor="username">Username</label>
             <div className="col-md-4">
               <input id="username" name="username" type="input" value={this.state.username} onChange={this.handleUserChange}  className="form-control input-md" required />
             </div>
          </div>

          <div className="form-group">
             <label className="col-md-4 control-label" htmlFor="password">Password</label>
             <div className="col-md-4">
               <input id="password" name="password" type="password" value={this.state.password} onChange={this.handlePasswordChange}  className="form-control input-md" required />
             </div>
           </div>

		   { this.state.needCaptcha &&
           <div className="form-group" id="captcha" >
             <div className="col-md-4">
             <Recaptcha sitekey="6LfuVyMUAAAAALe_5VDR6PFbCi9lTjE1pVWHMJpW" ref={e => recaptchaInstance = e}  verifyCallback={this.verifyCallback}  />
             </div>
		   </div>
		   }
           <div className="form-group">
             <label className="col-md-4 control-label" htmlFor="singlebutton" />
             <div className="col-md-4">
               { this.state.wrongPassword &&
                 <p className="center"> Incorrect password or account not verified yet </p>
               }
               <input type="submit" id="singlebutton" name="singlebutton" className="center btn btn-primary" value="Login"/>
           </div>
           </div>
         </fieldset>
       </form>
     );
   }
}

export default Login
