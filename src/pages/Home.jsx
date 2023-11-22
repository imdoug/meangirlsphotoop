import React, { useState, useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { base64StringToBlob } from 'blob-util';
import touchIcon from "../assets/touch_icon.png"
import press from"../assets/press-to-start.png"
import takePhotoIcon from"../assets/button.png"
import countdown from '../assets/giphy_countdown.gif'


function Home() {
  const videoRef  =  useRef(null) 
  const photoRef  =  useRef(null) 

  const [hasPhoto, setHasPhoto]  =  useState(false)
  const [step, setStep]  =  useState(0)
  const [data, setData]  =  useState(false)

  const getVideo = () =>{
    navigator.mediaDevices
      .getUserMedia({ video:{width: 414, height:238}}).then( stream =>{
        let video =  videoRef.current;
        video.srcObject = stream;
        video.play();
      })
      .catch( err =>  {
        console.error(err)
      })
      setStep(1)

  }
  const takePhoto =  ()  =>{

    // DESKTOP
     const height = 1366;
     const width  = 1024;

    let video = videoRef.current;
    let photo = photoRef.current;

    photo.width = width
    photo.height = height

    let ctx = photo.getContext('2d')
    let drawing = new Image();
    ctx.drawImage(video, 230, 163 , 600, 1025)
    drawing.src = "https://assets-private.eventfinity.co/materials/2677251/original/Frame_1.png"; // can also be a remote URL e.g. http://
    drawing.crossOrigin="anonymous"
    drawing.onload = function(){
      ctx.drawImage(drawing,0, 0,  width,  height)
      postPicture(photo.toDataURL().slice(22))
    }
    setHasPhoto(true)
    setStep(3)
  }

  function photoCountdown() {
    setStep(2)
    const myTimeout = setTimeout(takePhoto,2700);
  }

  const generateDownloadLink = (b) =>{
    let file = URL.createObjectURL(b)
    let a  = document.getElementById('link')
    a.download =  'Mean_Girls_2024.png'
    a.href = file;
    const canvas = document.querySelector('canvas');
     const pngUrl = canvas
       .toDataURL("image/png")
       .replace("image/png", "image/octet-stream");
    //console.log(pngUrl)

    //setblobDown(pngUrl)
  }

  const postPicture =  (b64) =>{
    // PUBLIC_READ_ONLY_TOKEN = 's2tbYsgFUTyOz4NluIu8OupD9leOqZMWvP31Veat'
    // PUBLIC_EVENT_ID        = '107551'
    // PUBLIC_PHOTOSTREAM_ID  = '64731' Mean Girls  
    // PUBLIC_FULL_URL        = 'https://2b424657.goodburger-attendee.pages.dev'
    // PUBLIC_API_BASE_URL    = 'https://api2.eventfinity.co'

    // #READ_WRITE_GOODBURGER CpaFZ2lS6HmSHoBbkmxJIg2kT6s01w3R2Mcsu03u
    // #READ_ONLY_GOODBURGER s2tbYsgFUTyOz4NluIu8OupD9leOqZMWvP31Veat

     // Convert the image data to a Blob object
     const contentType = 'image/png';
     const blob = base64StringToBlob(b64, contentType);
    
     generateDownloadLink(blob)

     //const filename = path.basename(imagePath);

     //console.log("SENDING PHOTO TO STREAM: " + filename);

     // Create a new FormData instance
     const formData = new FormData();

     // Append the necessary data to the FormData
     formData.append('event_attendee_id', '371552957');
     formData.append('photo_caption', 'image sent from app');
     
     const date = new Date()
     const fileName = `Mean_Girls_2024${date}.png`
     fileName.replace(/\s/g, '')

     // Append the image file to the FormData
     formData.append('photo', blob, fileName); // TODO - SET THIS TO LOCAL SAVED PHOTO

     // Specify the request options
     const requestOptions = {
         method: 'POST',
         headers: {
             'Authorization': 'Bearer CpaFZ2lS6HmSHoBbkmxJIg2kT6s01w3R2Mcsu03u'
         },
         body: formData
     };

    // Perform the POST request
      fetch("https://api2.eventfinity.co/api/v1/public/events/107551/photostreams/64731/photos", requestOptions)
          .then(response => response.text())
          .then(result => {
              console.log(result);
              let res = result
              setData(res.data)
              //event.sender.send('form-submission-successful', result);
          })
          .catch(error => {
              console.log('error', error);
              //event.sender.send('form-submission-failed', error);
          });
  }
  return (
    <div  className='App'>
      <div className={'startScreen' + (step === 0 ? '' : ' hidden')} onClick={getVideo} >
        <img src={press} className='pressStart'/>
        <img src={touchIcon} className='touch'/>
      </div>
      <div className={"camera"  + (step === 1 ? '' : ' hidden')}>
        <p className='texst'>Let's Take a Photo!</p>
        <video ref={videoRef}></video>
        <img src={takePhotoIcon} onClick={photoCountdown} className='button'/>
      </div>
      <div className={'countdown' + (step === 2 ? '' : ' hidden')}>
        <img src={countdown}/>
      </div>
      <div className={'result' + (hasPhoto ? ' hasPhoto' : '')}>
        <canvas ref={photoRef}></canvas>
        <a id="link">download</a>
        <p className='down-text'>Download your Picture!</p>
        <QRCodeSVG value={'https://www.google.com/'}  size={188}/>
      </div>
    </div>
  )
}

export default Home