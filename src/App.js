import { useState } from 'react';
import './App.css';
//const multer = require('multer');
//const path = require('path');
//const uuid=require('uuid');

function App() {
  const[image,setImage]=useState('');
  const[uploadResultMessage,setuploadResultMessage]=useState('Please upload an image to authenticate.');
  const[vistiorName,setvisitorName]= useState('dummy.jpg');
  const[auth,setAuth]=useState(false);

  function sendImage(e){
    e.preventDefault();
    setvisitorName(image.name);
    
   // const visitorImageName=uuid.v4();
    const visitorImageName=image.name;
    fetch(`https://qyxzhf5pcg.execute-api.us-east-1.amazonaws.com/dev/visitors646/${visitorImageName}`,{
      method: 'PUT',
      headers:{
        'Content-Type':'image/jpg'
      },
      body:image
    }).then(async()=>{
      const response=await authenticate(visitorImageName);
      if(response.Message==='Success')
      {
        setAuth(true);
        setuploadResultMessage(`Hi ${response['firstName']} ${response['lastName']}, welcome to work. Hope you have a productive day today!!!`)
      }
      else{
        setAuth(false);
        setuploadResultMessage('Authentication Failed: This person is not an Employee')
      }
    }).catch(error=>{
      setAuth(false);
      setuploadResultMessage('This while Authentication Process. Try again.')
      console.error(error);
    })

  }

  async function authenticate(visitorImageName){
    const requestUrl='https://qyxzhf5pcg.execute-api.us-east-1.amazonaws.com/dev/employee?'+new URLSearchParams({
      objectKey:`${visitorImageName}`
    });
    return await fetch(requestUrl,{
      method:'GET',
      headers:{
        'Accept':'application/json',
        'Content-Type':'application/json'
      }  
    }).then(response=>response.json())
    .then((data)=>{
      return data;
    }).catch(error=>console.error(error));
  }

  return (
    <div className="App">
      <h2> Facial Recogniton System</h2>
      <form onSubmit={sendImage}>
        <input type='file' name='image' onChange={e=> setImage(e.target.files[0])}/>
        <button type='submit'>Authenticate</button>
      </form>

      <div className={auth?'Success':'failure'}>{uploadResultMessage}</div>
      <img src={require(`./visitors/${vistiorName}`)} alt="Visitor" height={250} width={250}/>
    </div>
  );
}

export default App;