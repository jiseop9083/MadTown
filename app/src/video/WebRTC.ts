import { Player } from "../characters/Player";
import { Scene } from "phaser";


export const startVideoConference = (scene: Scene, player: Player) => {
  // get caller's video stream and connet video tag 
  // TODO: move to react component
  const handleIce = (data) => {
    console.log('sent candiate');
    scene.room.send("ice", {ice: data.candiate, roomName: player.roomName});
  };

  const handleAddStream = (data) => {
    console.log(data.stream);
    const peersStream = document.createElement('video');
    
    peersStream.srcObject = data.stream;
    peersStream.autoplay = true;
    peersStream.playsInline = true;

    const centerX = scene.cameras.main.centerX;
    const centerY = scene.cameras.main.centerY;
    const videoWidth = 250;
    const videoHeight = 200;

    peersStream.style.position = 'absolute';
    peersStream.style.left = `${centerX + videoWidth * 3 / 2 }px`;
    peersStream.style.top = `${centerY}px`;
    peersStream.style.width = `${videoWidth}px`;
    peersStream.style.height = `${videoHeight}px`;

    document.body.appendChild(peersStream);
  };
  

  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then((stream) => {
      const videoElement = document.createElement('video');
      videoElement.srcObject = stream;
      videoElement.playsInline = true;
      videoElement.autoplay = true;

      
      // test
      const videoDiv= document.createElement('div');
      videoDiv.id = "videoDiv";
      document.body.appendChild(videoDiv);
      videoDiv.appendChild(videoElement);


      const idInput= document.createElement('input');
      idInput.placeholder = "room name"
      document.body.appendChild(idInput);
      const idButton= document.createElement('button');
      idButton.textContent = "클릭";
      document.body.appendChild(idButton);

      idButton.addEventListener("click", (event) => {
        event.preventDefault();
        const roomName = idInput.value;
        player.roomName = roomName;
        scene.room.send("join_room", {roomName});
        idInput.value = "";
      });

      /// RTC code
      // TODO: create makeConnection function and move it
      const peerConnection = new RTCPeerConnection();
      peerConnection.addEventListener("icecandidate", handleIce);

      // 아마 addIceCandidate 호출 전에 이벤트가 넘어가서 그러지 않을ㄲ?
      peerConnection.addEventListener("addstream", handleAddStream);
      stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));
      

      const centerX = scene.cameras.main.centerX;
      const centerY = scene.cameras.main.centerY;
      const videoWidth = 250;
      const videoHeight = 200;

      videoElement.style.position = 'absolute';
      videoElement.style.left = `${centerX + videoWidth * 3 / 2 }px`;
      videoElement.style.top = `${centerY - videoHeight}px`;
      videoElement.style.width = `${videoWidth}px`;
      videoElement.style.height = `${videoHeight}px`;

      

      scene.room.onMessage("join_room", async (messageData) => {
        if(scene.currentPlayer.roomName == messageData.roomName){ // do not needed
          if(scene.currentPlayer.playerId == messageData.playerId){
            console.log("its me!!"); 

          } else{
            console.log(`join ${messageData.playerId}!!`); 
            const offer = await peerConnection.createOffer();
            peerConnection.setLocalDescription(offer);
            console.log("sent the offer");
            scene.room.send("offer", {offer: offer, roomName: messageData.roomName});
          }
        }
        return;
      });

      scene.room.onMessage("offer", async (messageData) => {
        if(scene.currentPlayer.playerId == messageData.playerId)
          return;
        console.log("received the offer");
        await peerConnection.setRemoteDescription(messageData.offer);
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        console.log("sent the answer");
        scene.room.send("answer", {answer: answer, roomName: messageData.roomName});
      });
      
      scene.room.onMessage("answer", async (messageData) => {
        
        if(scene.currentPlayer.playerId == messageData.playerId)
          return;
        console.log("receive the answer");
        await peerConnection.setRemoteDescription(messageData.answer);

      });

      scene.room.onMessage("ice", async (messageData) => {
        if(scene.currentPlayer.playerId == messageData.playerId)
          return;
        console.log("receive candidate");
        await peerConnection.addIceCandidate(messageData.ice);

      });

      // // temp
      // const callerName = " ";
      // const calleeId =  "cal";
      
      // const callerPeer = new Peer({
      //   initiator: true, //요청자 이므로 true!
      //   stream: stream,
      // });

      
      // callerPeer.on('signal', callerSignal => {
      //   callerSocket.emit('joinCaller', { signal: callerSignal, name: callerName, callee: calleeId });
      // });

  })
  .catch((error) => {
    console.error('Error accessing webcam and/or microphone:', error);
  })

  
}

