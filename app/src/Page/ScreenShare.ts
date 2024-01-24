import { Scene } from 'phaser';
import { TagManager } from '../util/TagManager';
import { Player } from '../Objects/Player';

const tagManager = TagManager.getInstance();

export const shareScreen = async (scene: Scene, player: Player, mainDiv: HTMLDivElement) => {
  let screenContainer: HTMLDivElement;
  let firstStreamAdded = false;

  const handleIceScreen = (data) => {
    console.log('sent screen candidate');
    scene.room.send("screen_ice", { candidate: data.candidate, roomName: player.roomName});
  }

  const handleAddStreamScreen = (data) => {
    const peersStream = tagManager.createVideo({
      parent: screenContainer,
      width: 400,
      height: 320,
      srcObject: data.stream,
      autoplay: true,
      playsInline: true,
      styles: {
        'border-radius': '30px',
        'margin-top': '20px',
      }
    });
  }

  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({ video: { displaySurface: 'monitor' } });

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

    screenContainer = tagManager.createDiv({
      parent: mainContainer,
      styles: {
        'display': 'flex',
        'flex-direction': 'row',
        'margin': '16px',
      }
    });

    const screen = tagManager.createVideo({
      parent: screenContainer,
      srcObject: stream,
      width: 400,
      height: 320,
      playsInline: true,
      autoplay: true,
      styles: {
        'margin-top': '20px',
        'border-radius': '30px',
        'marin-right' : '20px',
      }
    });

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
        text: "Enter",
        width: 60,
        height: 45,
        onClick: (event) => {
          event.preventDefault();
          const roomName = idInput.value;
          player.roomName = roomName;
          scene.room.send("join_room_screen", {roomName});
          idInput.value = "";
        },
        styles: {
          'border-radius': '5px',
          'margin-left': '10px',
          'font-size': '20px',
        }
      });
 
    const stopSharingButton = tagManager.createButton({
      parent: mainContainer,
      text: 'Exit',
      width: 60,
      height: 45,
      onClick: async () => {
        stream.getTracks().forEach((track: { stop: () => any; }) => track.stop());
        peerConnection.close();
        removeVideoElement(screenContainer);
        tagManager.setVisible(mainContainer, false);
      },
      styles: {
        'position': 'absolute',
        'right': '30px',
        'bottom': '30px',
        'border-radius': '5px',
        'margin-left': '10px',
        'font-size': '20px',
      },
    });

    const peerConnection = new RTCPeerConnection();
    peerConnection.addEventListener("icecandidate", handleIceScreen);
    peerConnection.addEventListener("addstream", handleAddStreamScreen);

    stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    scene.room.onMessage("join_room_screen", async (messageData) => {
        if(scene.currentPlayer.roomName == messageData.roomName){ // do not needed
          if(scene.currentPlayer.playerId == messageData.playerId){
            console.log("its me!!"); 
          } else{
            console.log(`join ${messageData.playerId}!!`); 
            const offer = await peerConnection.createOffer();
            peerConnection.setLocalDescription(offer);
            console.log("sent the offer");
            scene.room.send("offer_screen", {offer: offer, roomName: messageData.roomName});
          }
        }
        return;
      });

    scene.room.onMessage("offer_screen", async (messageData) => {
        if(scene.currentPlayer.playerId == messageData.playerId)
          return;
        
        console.log("received the screen offer");
        await peerConnection.setRemoteDescription(messageData.offer);
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        console.log("sent the screen answer");
        scene.room.send("answer_screen", { answer: answer, roomName: messageData.roomName });
    });

    scene.room.onMessage("answer_screen", async (messageData) => {
        if(scene.currentPlayer.playerId == messageData.playerId)
          return;
        
        console.log("receive the screen answer");
        await peerConnection.setRemoteDescription(messageData.answer);
    });

    scene.room.onMessage("screen_ice", async (messageData) => {
        if(scene.currentPlayer.playerId == messageData.playerId)
          return;  
        
        console.log("receive screen candidate");
        await peerConnection.addIceCandidate(messageData.ice);
    });

    peerConnection.oniceconnectionstatechange = async () => {
      if (peerConnection.iceConnectionState === 'closed' || peerConnection.iceConnectionState === 'failed') {
        stream.getTracks().forEach((track) => track.stop());
        mainDiv.removeChild(stopSharingButton);
        removeVideoElement(screenContainer); // Pass the container to remove
      }
    };
  } catch (error) {
    console.error("Error accessing display media:", error);
  }
};

function removeVideoElement(container: HTMLDivElement) {
  const videoElements = container.querySelectorAll('video');
  videoElements.forEach((videoElement) => {
    // Stop the tracks before removing the video element
    const tracks = videoElement.srcObject.getTracks();
    tracks.forEach((track) => track.stop());
    videoElement.remove();
  });
}