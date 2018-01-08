import React, { Component } from 'react'
import { Redirect } from 'react-router'

export default class ContactForm extends Component {
  constructor () {
    super();
    this.state = {
      fireRedirect: false
    }
  }

  submitForm = (e) => {
    e.preventDefault()
    this.setState({ fireRedirect: true })
  }

  render () {
    const { from } = this.props.location.state || '/'
    const { fireRedirect } = this.state

    return (
      <div>
        <form onSubmit={this.submitForm}>
          <button type="submit">Submit</button>
        </form>
        {fireRedirect && (
          <Redirect to={from || '/thank-you'}/>
        )}
      </div>
    )

  }
}