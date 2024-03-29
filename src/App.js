import { useState,useRef } from 'react';
import './App.css';
import S3Uploader from './S3Uploader';
import Webcam from 'react-webcam';

function App() {
  const [image, setImage] = useState('');
  const [uploadResultMessage, setUploadResultMessage] = useState('Please upload an image to authenticate.');
  const [visitorName, setVisitorName] = useState('dummy.jpg');
  const [auth, setAuth] = useState(false);
  const [state, setState] = useState(false);
  const [type,setType]=useState(false);
  const [registerClicked, setRegisterClicked] = useState(false); // State variable to track if "Register" button is clicked


  
    const webcamRef = useRef(null);
    const [capturedImage, setCapturedImage] = useState(null);
  
    const captureImage = () => {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
    };  

  function sendImage(e) {
    e.preventDefault();
    setVisitorName(image.name);
    const visitorImageName = image.name;
    fetch(`https://qyxzhf5pcg.execute-api.us-east-1.amazonaws.com/dev/visitors646/${visitorImageName}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'image/jpg',
      },
      body: image
    }).then(async () => {
      const response = await authenticate(visitorImageName);
      if (response.Message === 'Success') {
        setAuth(true);
        setUploadResultMessage(`Hi ${response['firstName']} ${response['lastName']}, welcome to work. Hope you have a productive day today!!!`)
      } else {
        setAuth(false);
        setUploadResultMessage('Authentication Failed: This person is not an Employee')
        // Set visitorName to an empty string when authentication fails
        setVisitorName('');
      }
    }).catch(error => {
      setAuth(false);
      setUploadResultMessage('Error occurred while Authentication Process. Try again.')
      console.error(error);
    })
  }

  async function authenticate(visitorImageName) {
    const requestUrl = 'https://qyxzhf5pcg.execute-api.us-east-1.amazonaws.com/dev/employee?' + new URLSearchParams({
      objectKey: `${visitorImageName}`
    });
    return await fetch(requestUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    }).then(response => response.json())
      .then((data) => {
        return data;
      }).catch(error => console.error(error));
  }

  // Function to handle rendering of S3Uploader component when "Register" button is clicked
  const handleRegisterClick = () => {
    setState(true);
    setRegisterClicked(true);
  }
  const HyperState = () =>{
    setState(false);
    setRegisterClicked(false);
  }

  return (
    <div className="App" >
      {state || registerClicked ? ( // Render S3Uploader if "state" or "registerClicked" is true
        <div>
          <S3Uploader />
        <button type='button' onClick={HyperState}>Authenticate!!</button>
        </div>
      ) : (
        <div >
          <h2>Facial Recognition System</h2>
          {type?(<div>
            <form onSubmit={sendImage}>
          <div>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpg"
      />
      <button onClick={captureImage} onChange={e => setImage(e.target.files[0])} >Capture</button>
      {capturedImage && <img src={capturedImage} alt="Captured" />}
    </div></form>
    
    
    <div className={auth ? 'Success' : 'failure'}>{uploadResultMessage}</div>
          {/* Render image if visitorName is truthy, otherwise render a placeholder */}
          {visitorName ? (
            <img src={`https://visitors646.s3.amazonaws.com/${visitorName}`} alt="Visitor" height={250} width={250} />
          ) : (
            <div>No image found</div>
          )}
          <br />
          <button type='button' onClick={handleRegisterClick}>Register!!</button>
          <br/>
          <br/>
          <button type='button' onClick={()=>{setType(false)}} >Switch to file upload</button>

    
    
    </div>):(<div>
      <form onSubmit={sendImage}>
      <input type='file' name='image' onChange={e => setImage(e.target.files[0])} />
            <button type='submit'>Authenticate</button>
          </form>
          
          <div className={auth ? 'Success' : 'failure'}>{uploadResultMessage}</div>
          {/* Render image if visitorName is truthy, otherwise render a placeholder */}
          {visitorName ? (
            <img src={`https://visitors646.s3.amazonaws.com/${visitorName}`} alt="Visitor" height={250} width={250} />
          ) : (
            <div>No image found</div>
          )}
          <br />
          <button type='button' onClick={handleRegisterClick}>Register!!</button>
            <br/>
            <br/>
          <button type='button' onClick={()=>{setType(true)}} >Switch to camera</button>
    </div>)}
            

        </div>
      )}

    </div>
  );
}

export default App;
