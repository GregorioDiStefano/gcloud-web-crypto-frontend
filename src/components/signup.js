import React, { Component } from 'react'
import request from 'superagent'
import { browserHistory } from 'react-router'
import Recaptcha from 'react-recaptcha'

let recaptchaInstance;

class Signup extends Component {
  constructor(props) {
    super(props)

    this.state = {password1: "", password2: "", captcha_response: "", disabledSubmit: true, signupError: "", username: "", mustBeAdmin: false}
  }

  componentWillMount = () => {
    var self = this
    request
      .get('/account/initial')
      .end(function(error, response) {
         if (response.statusCode == 404) {
           self.setState({ "mustBeAdmin": true, "username": "admin" })
         }
      })
    }


  handleUserChange = (event) => {
    this.setState({ username: event.target.value});
  }

  onSubmit = (e) => {
    e.preventDefault()

    var self = this;
    request
      .post('/account/signup')
      .set('Content-Type', 'application/json')
      .set("google-captcha", this.state.captcha_response)
      .send({ "password": self.state.password1, "username": self.state.username })
      .end(function(error, response){
        if (response.statusCode != 201) {
          if ("status" in response.body) {
            self.setState({signupError: response.body["status"]})
          }
          recaptchaInstance.reset()
        } else {
            // hack: redirect to login after 800ms since account creation takes some time
            setTimeout(function(){
               browserHistory.push(`/login`)
            }, 800);
          }
        })
      }

  verifyCallback = (e) => {
    this.setState({ captcha_response: e })
  }

  verifyPassword = (e) => {
    self = this
    this.setState({[e.target.id]:  e.target.value}, function(){
      if (this.state.password1 == this.state.password2 && this.state.password1 != "") {
        if (this.state.password1.match(/[@]|[#]|[$]|[%]|[!]|[?]|[\*]|[0-9]/) == null ) {
          self.setState({signupError: "add a special character or number to your password"})
          return
        } else if (this.state.password1.length < 8) {
          self.setState({signupError: "password must be at least 8 characters"})
          return
        }
        self.setState({signupError: "", disabledSubmit: false})
      } else {
        self.setState({disabledSubmit: true})
      }
    })
  }

  render () {
    const mustBeAdmin = this.state.mustBeAdmin;

    return (
       <form className="form-horizontal"  onSubmit={this.onSubmit}>
         <fieldset>
           <legend>Signup</legend>
           <div className="form-group">
             <label className="col-md-4 control-label" htmlFor="login">Username</label>
             <div className="col-md-4">
             { mustBeAdmin ? (
                 <input id="login" name="username" className="form-control input-md" value={this.state.username} readOnly/>
             ) : (
                 <input id="login" name="username" className="form-control input-md" onChange={this.handleUserChange} value={this.state.username} />
             )}
             </div>
           </div>
           <div className="form-group">
             <label className="col-md-4 control-label" htmlFor="password">Password</label>
             <div className="col-md-4">
               <input id="password1" name="password" type="password" className="form-control input-md" onChange={this.verifyPassword} required />
             </div>
           </div>
           <div className="form-group">
             <label className="col-md-4 control-label" htmlFor="password">Password (repeat)</label>
             <div className="col-md-4">
               <input id="password2" name="password" type="password" className="form-control input-md" onChange={this.verifyPassword} required />
             </div>
           </div>
           <div className="form-group" id="captcha" >
             <div className="col-md-4">
               <Recaptcha ref={e => recaptchaInstance = e} verifyCallback={this.verifyCallback} sitekey="6LfuVyMUAAAAALe_5VDR6PFbCi9lTjE1pVWHMJpW"/>
             </div>
		       </div>
           <div className="form-group">
             <label className="col-md-4 control-label" htmlFor="singlebutton" />
             <div className="col-md-4">
             <p className="center"> {this.state.signupError}</p>
             <input type="submit" id="singlebutton" name="singlebutton" className="center btn btn-primary" value="Signup" disabled={this.state.disabledSubmit}/>
           </div>
           </div>
         </fieldset>
       </form>
     );
   }
}

export default Signup
