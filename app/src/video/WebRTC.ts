import { Player } from "../characters/Player";
import { Scene } from "phaser";
import { TagManager } from "../util/TagManager";
import Color from "../types/Color";

const tagManager = TagManager.getInstance();

export const startVideoConference = (scene: Scene, player: Player, mainDiv: HTMLDivElement) => {
  // get caller's video stream and connet video tag 
  // TODO: move to react component
  let videoContainer : HTMLDivElement;


  const handleIce = (data) => {
    console.log('sent candiate');
    scene.room.send("ice", {ice: data.candiate, roomName: player.roomName});
  };

  const handleAddStream = (data) => {
    const peersStream =  tagManager.createVideo({
      parent: videoContainer,
      width: 350,
      height: 280,
      srcObject: data.stream,
      autoplay: true,
      playsInline: true,
      styles: {
        'border-radius': '30px',
        'margin-top': '20px',
      }
    })
  };
  

  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then((stream) => {

      const mainContainer = tagManager.createDiv({
        parent: mainDiv,
        styles: {
          'position': 'absolute',
          'width': '50%',
          'height': '50%',
          'background-color': 'rgba(0, 0, 0, 0.4)',
          'z-index': '1000',
          'border-radius': '10px', 
        }
      });

      videoContainer = tagManager.createDiv({
        parent: mainContainer,
        styles: {
          'display': 'flex',
          'flex-direction': 'row',
          'margin': '16px',
        }
      });
      const myVideo = tagManager.createVideo({
        parent: videoContainer,
        srcObject: stream,
        width: 350,
        height: 280, 
        playsInline: true,
        autoplay: true,
        styles: {
          'margin-top': '20px',
          'border-radius': '30px',
        }
      })

      const inputContainer = tagManager.createDiv({
        parent: mainContainer,
        styles: {
          'display': 'flex',
          'flex-direction': 'row',
          'margin': '20px',
        }
      });

      const idInput = tagManager.createInput({
        parent: inputContainer,
        width: 200,
        height: 40,
        placeholder: "room name",
        styles: {
          'display': 'flex',
          'border-radius': '10px',
          'font-size': '20px',
        }
      });

      const idButton = tagManager.createButton({
        parent: inputContainer,
        text: "입장",
        width: 60,
        height: 45,
        onClick: (event) => {
          event.preventDefault();
          const roomName = idInput.value;
          player.roomName = roomName;
          scene.room.send("join_room", {roomName});
          idInput.value = "";
        },
        styles: {
          'border-radius': '5px',
          'margin-left': '10px',
          'font-size': '20px',
        }
      });

      const closeButton = tagManager.createButton({
          parent: mainContainer,
          text: 'X',
          width: 40,
          styles: {
            'position': 'absolute',
            'right': '30px',
            'bottom': '30px',
            'border-radius': '20px',
            'background-color': Color.red,
            'color': Color.white,
            'font-size': '24px',
            'fontWeight': '580',
            'margin-bottom': '10px'
          },
          hoverStyles: {
              'cursor': 'pointer',
              'background-color': Color.white,
              'color': Color.red,
              'border': `1px solid ${Color.red}`,
          },
          onClick: () => {
              tagManager.setVisible(mainContainer, false);
          },
      });


      /// RTC code
      // TODO: create makeConnection function and move it
      const peerConnection = new RTCPeerConnection();
      peerConnection.addEventListener("icecandidate", handleIce);

      // 아마 addIceCandidate 호출 전에 이벤트가 넘어가서 그러지 않을ㄲ?
      peerConnection.addEventListener("addstream", handleAddStream);
      stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));

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
  })
  .catch((error) => {
    console.error('Error accessing webcam and/or microphone:', error);
  })

  
}

