import React, { Component } from 'react'
import { Router, Route, Link, browserHistory } from 'react-router'
import { WithContext as ReactTags } from 'react-tag-input';

class Search extends Component {
  constructor(props) {
    super(props)
    this.state = { showInputField: false, tags: [] }
  }

  hideInputWhenTagsEmpty = () => {
    if (this.state.tags.length == 0) {
        this.setState({ showInputField: false })
    }
  }

  onClick = () => {
    this.setState({ showInputField: true })
  }

  onBlur = (e) => {
    this.hideInputWhenTagsEmpty()
  }

  handleDelete = (i) => {
      let tags = this.state.tags;
      tags.splice(i, 1);
      this.setState({tags: tags});
      this.hideInputWhenTagsEmpty()
      this.handleTagChange(tags)
  }

  handleAddition = (tag) => {
      let tags = this.state.tags;

      // don't add duplicate tags
      for (const existingTag of tags) {
        if (tag == existingTag.text) {
          return
        }
      }

      tags.push({
          text: tag
      });

      this.setState({tags: tags});
      this.handleTagChange(tags)
  }

  handleTagChange = (tags) =>  {
    this.props.handle(tags)
  }

  render() {
    if (this.state.showInputField) {
      let tags = this.state.tags;
      let suggestions = ["Banana", "Mango", "Pear", "Apricot"]

      return (
        <div onBlur={this.onBlur}>
        <ReactTags onBlur={this.onBlur}
                   tags={tags}
                   suggestions={suggestions}
                   handleDelete={this.handleDelete}
                   handleAddition={this.handleAddition}
        />
        </div>
      );
    } else {
      return (
        <div onClick={this.onClick}>
          <button type="button" className="btn btn-default">
            <span className="glyphicon glyphicon-search"></span>
          </button>
        </div>
      )
    }
  }
}
export default Search
