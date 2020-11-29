import React from 'react'
import './App.css'
import VideoChatContainer from './VideoChatContainer'
import adapter from 'webrtc-adapter';

function App () {
  return (
    <div className='app'>
      <h1>WebRTC screen sharing App</h1>
      <h2>Made by Tsiskakis Fotios p3170162</h2>
      <VideoChatContainer/>
    </div>
  )
}

export default App
