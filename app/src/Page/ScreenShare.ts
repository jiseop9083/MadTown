import { Scene } from 'phaser';
import { TagManager } from '../util/TagManager';
import { Player } from '../characters/Player';

const tagManager = TagManager.getInstance();

export const shareScreen = async (scene: Scene, player: Player, mainDiv: HTMLDivElement) => {
  let screenContainer: HTMLDivElement;
    
  const handleIceScreen = (data) => {
    console.log('sent screen candidate');
    scene.room.send("screen_ice", { candidate: data.candidate});
  }

  const handleAddStreamScreen = (data) => {
    
    console.log('Data stream:', data.stream);
  
    const peersStream =  tagManager.createVideo({
        parent: screenContainer,
        width: 50,
        height: 40,
        srcObject: data.stream,
        autoplay: true,
        playsInline: true,
        styles: {
          'border-radius': '30px',
          'margin-top': '20px',
        }
      })

      console.log('peersStream:', peersStream);

  };  

    navigator.mediaDevices.getDisplayMedia({ video: { displaySurface: 'monitor' } })
    .then(async (stream) => {
    console.log('my', stream);
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
        'flex-direction': 'column',
        'margin': '16px',
      }
    });

    const myScreen = tagManager.createVideo({
      parent: screenContainer,
      srcObject: stream,
      width: 50,
      height: 40,
      playsInline: true,
      autoplay: true,
      styles: {
        'margin-top': '20px',
        'border-radius': '30px',
      }
    });

    const stopSharingButton = tagManager.createButton({
      parent: mainContainer,
      text: 'Stop Sharing',
      onClick: async () => {
        stream.getTracks().forEach((track: { stop: () => any; }) => track.stop());
        peerConnection.close();
        removeVideoElement(screenContainer);
        tagManager.setVisible(mainContainer, false);
      }
    });

    const peerConnection = new RTCPeerConnection();
    peerConnection.addEventListener("icecandidate", handleIceScreen);
    peerConnection.addEventListener("addstream", handleAddStreamScreen);

    stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    scene.room.send("offer_screen", { offer: offer });

    scene.room.onMessage("offer_screen", async (messageData) => {
        console.log("received the screen offer");
        if (messageData.playerId === scene.currentPlayer.playerId) return;
      
        console.log(peerConnection.signalingState);
        await peerConnection.setRemoteDescription(messageData.offer);
      
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
      
        console.log("sent the screen answer");
        scene.room.send("answer_screen", { answer: answer });
    });
      
    scene.room.onMessage("answer_screen", (messageData) => {
        console.log("receive the screen answer");
        if (messageData.playerId === scene.currentPlayer.playerId) return;
      
        peerConnection.setRemoteDescription(messageData.answer);
    });
      

    scene.room.onMessage("screen_ice", async (messageData) => {
        if(messageData.playerId == scene.currentPlayer.playerId)
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
  }) 
  .catch((error) => {
    console.error("Error accessing display media:", error);
  })
}

function removeVideoElement(container: HTMLDivElement) {
    const videoElements = container.querySelectorAll('video');
    videoElements.forEach((videoElement) => {
      // Stop the tracks before removing the video element
      const tracks = videoElement.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoElement.remove();
    });
  }  