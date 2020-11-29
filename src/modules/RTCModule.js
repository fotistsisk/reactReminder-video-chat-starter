const mergeAudioStreams = (desktopStream, voiceStream) => {
  const context = new AudioContext();
    
  // Create a couple of sources
  const source1 = context.createMediaStreamSource(desktopStream);
  const source2 = context.createMediaStreamSource(voiceStream);
  const destination = context.createMediaStreamDestination();
  
  const desktopGain = context.createGain();
  const voiceGain = context.createGain();
    
  desktopGain.gain.value = 0.7;
  voiceGain.gain.value = 0.7;
   
  source1.connect(desktopGain).connect(destination);
  // Connect source2
  source2.connect(voiceGain).connect(destination);
    
  return destination.stream.getAudioTracks();
};


export const createOffer = async (connection, localStream, userToCall, doOffer, database, username) => {
  try {
    connection.addStream(localStream)

    const offer = await connection.createOffer()
    await connection.setLocalDescription(offer)

    doOffer(userToCall,offer,database,username)

  } catch (exception) {
    console.error(exception)
  }
}

export const initiateLocalStream = async () => {
  try {
    // const videoStream = navigator.mediaDevices.getDisplayMedia(
    //   {video: true}
    //   )

    const stream = await navigator.mediaDevices.getDisplayMedia({video: true})
    const audio = await navigator.mediaDevices.getUserMedia({audio: true})
    var streams = [stream,audio]
    return streams
    
  } catch (exception) {
    console.error(exception)
  }
}
export const initiateConnection = async () => {
  try {
    // create a connection
    // using Google public stun server for ICE Candidate exchange
    const configuration = {
      //iceServer: [{ urls:'stun:stun2.1.google.com:19302'}]
      iceServers: [{'urls': 'stun:stun.services.mozilla.com'}, {'urls': 'stun:stun.l.google.com:19302'}, {'urls': 'turn:numb.viagenie.ca','credential': 'webrtc','username': 'websitebeaver@mail.com'}]

    }

    const connection = new RTCPeerConnection(configuration)
    return connection

  } catch (exception) {
    console.error(exception)
  }
}

export const listenToConnectionEvents = (conn, username, remoteUsername, database, remoteVideoRef, doCandidate) => {
  // listen for ice candidates
  conn.onicecandidate=function(event){
    if(event.candidate){
      doCandidate(remoteUsername,event.candidate,database,username)
    }
  }
  // when a remote user adds stream to the peer connection, we display it
  conn.ontrack=function (e){
    if(remoteVideoRef.srcObject !== e.streams[0]){
      remoteVideoRef.srcObject=e.streams[0]
      console.log(e.streams[0])
    }
  }
}

export const sendAnswer = async (conn, localStream, notif, doAnswer, database, username) => {
  try {
    // add the localstream to the connection
    conn.addStream(localStream)
    // set the remote and local descriptions and create an answer
    const offer=JSON.parse(notif.offer)
    conn.setRemoteDescription(offer)

    // create an answer to an offer
    const answer = await conn.createAnswer()
    conn.setLocalDescription(answer)

    

    // send answer to the other peer

    doAnswer(notif.from,answer,database,username)
  } catch (exception) {
    console.error(exception)
  }
}

export const startCall = (conn, notif) => {
  // it should be called when we
  // received an answer from other peer to start the call
  // and set remote the description

  const answer = JSON.parse(notif.answer)
  conn.setRemoteDescription(answer)

}

export const addCandidate = (conn, notif) => {
  // apply the new received candidate to the connection
  const candidate = JSON.parse(notif.candidate)
  conn.addIceCandidate(new RTCIceCandidate(candidate))
}