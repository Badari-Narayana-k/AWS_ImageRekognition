import React from 'react';
import AWS from 'aws-sdk';

class S3Uploader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      uploadInProgress: false,
      modalVisible: false,
      modalContent: '',
    };
    this.s3 = new AWS.S3({
      accessKeyId: '',
      secretAccessKey: '',
      region: 'us-east-1',
    });
  }

  handleFileChange = (event) => {
    this.setState({
      selectedFile: event.target.files[0]
    });
  }

  handleUpload = () => {
    const { selectedFile } = this.state;
    if (!selectedFile) return;

    this.setState({ uploadInProgress: true });

    const params = {
      Bucket: 'employees646',
      Key: selectedFile.name,
      Body: selectedFile,
      ACL: 'public-read' // adjust access control as per your requirement
    };

    this.s3.upload(params, (err, data) => {
      if (err) {
        this.setState({ 
          uploadInProgress: false,
          modalVisible: true,
          modalContent: `Error uploading file: ${err}`
        });
      } else {
        this.setState({ 
          uploadInProgress: false,
          modalVisible: true,
          modalContent: `File uploaded successfully. Object URL: ${data.Location}`
        });
        // You can perform any necessary actions after successful upload, e.g., updating state or notifying users
      }
    });
  }

  closeModal = () => {
    this.setState({ modalVisible: false });
  }

  render() {
    const { uploadInProgress, modalVisible, modalContent } = this.state;

    return (
      <div>
        <input type="file" onChange={this.handleFileChange} />
        <button onClick={this.handleUpload} disabled={uploadInProgress}>
          Upload
        </button>
        {uploadInProgress && <p>Uploading...</p>}
        {modalVisible && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={this.closeModal}>&times;</span>
              <p>{modalContent}</p>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default S3Uploader;
