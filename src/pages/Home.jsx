import React, { useState, useRef, useEffect } from 'react'
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
    // let width;
    // let height;

    // if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
    //   document.write("mobile");
    //   width =  414  
    //   height = 238
    // }else{
    //   width =  238  
    //   height = 414
    // }
    navigator.mediaDevices
      .getUserMedia({ video:{width: 481, height:320}}).then( stream =>{
        let video =  videoRef.current;
        video.srcObject = stream;
        video.play();
      })
      .catch( err =>  {
        console.error(err)
      })
  }
  const start = () =>{
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
    drawing.src = "https://assets-private.eventfinity.co/materials/2677991/original/mean-girls_png-1.png"; // can also be a remote URL e.g. http://
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
    const myTimeout = setTimeout(takePhoto,2500);
    restart()
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

    //Perform the POST request
      fetch("https://api2.eventfinity.co/api/v1/public/events/107551/photostreams/64731/photos", requestOptions)
          .then(response => response.text())
          .then(result => {
              //console.log(result);
              //let res = result
              //setData(res.data)
              //event.sender.send('form-submission-successful', result);
          })
          .catch(error => {
              //console.log('error', error);
              //event.sender.send('form-submission-failed', error);
          });
  }
  const restart  = () =>{
    const myTimeout = setTimeout(() => {
      const canvas  = document.querySelector('canvas')
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height); 
      setStep(0)
      setHasPhoto(false)
      let body = document.querySelector('body')
      if(body.classList.contains('v2')){
        body.classList.remove("v2");
      }else{
        body.classList.add("v2");
      }
    }, 8000);
  }
  useEffect(() => {
      getVideo()
  }, [])
  
  return (
    <div  className='App'>
      <div className={'startScreen' + (step === 0 ? '' : ' hidden')} onClick={start} >
        <img src={press} className='pressStart'/>
        <img src={touchIcon} className='touch'/>
      </div>
      <div className={"camera"  + (step === 1 ? '' : ' hidden')}>
        <video ref={videoRef}></video>
        <div className="btnPhoto" onClick={photoCountdown}></div>
      </div>
      <div className={'countdown' + (step === 2 ? '' : ' hidden')}>
        <img src={countdown}/>
      </div>
      <div className={'result' + (hasPhoto ? ' hasPhoto' : ' hidden')}>
        <canvas ref={photoRef}></canvas>
        <a id="link">download</a>
        <button className='restart hidden'  onClick={restart}>RESTART</button>
      </div>
    </div>
  )
}

export default Home