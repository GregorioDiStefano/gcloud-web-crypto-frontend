import React, { Component } from 'react'
import request from 'superagent'

class FileInfo extends Component {
  constructor(props) {
    super(props)
    this.setState({ filedata: this.props.fi})
}

removeFile = () => {
  var uuid = this.props.fileid
  request
    .del('/file/' + uuid)
    .end(function(err, res){
      console.log(err, res)
    })
}

hideInfo = () => {
  this.props.hideFileInfoHandler()
}

render() {
  return (
    <div id="fileInfo">
    <form>
      <fieldset>
        <legend><span onClick={this.hideInfo}> &#10761; </span> File detail</legend>
          <table>
            <tr>
              <th>Filename</th>
              <td>{this.props.fileName}</td>
            </tr>

            { this.props.fileDescription ?
              <tr>
                <th>Description</th>
                <td>{this.props.fileDescription}</td>
              </tr> : null }

            { this.props.fileTags ?
              <tr>
                <th>Tags</th>
                <td>{this.props.fileTags.join(", ")}</td>
              </tr> : null }

            <tr>
              <th>Type</th>
              <td>{this.props.fileType}</td>
            </tr>
            <tr>
              <th>Size</th>
              <td>{this.props.fileSize}</td>
            </tr>
            <tr>
              <th>SHA2</th>
              <td>{this.props.fileHash}</td>
            </tr>
            <tr>
              <th>Uploaded</th>
              <td>{this.props.fileUploadDate}</td>
            </tr>
          </table>
      </fieldset>
    </form>
    </div>
  );
}
}

export default FileInfo
