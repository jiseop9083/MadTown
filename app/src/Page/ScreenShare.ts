// import { Scene } from 'phaser';
// import { TagManager } from '../util/TagManager';
// import { Player } from '../characters/Player';

// const tagManager = TagManager.getInstance();

// export const shareScreen = async (scene: Scene, player: Player, mainDiv: HTMLDivElement) => {
//     let screenContainer : HTMLDivElement;

//     const handleIce = (data) => {
//         console.log('sent candiate');
//         scene.room.send("ice", {ice: data.candiate, roomName: player.roomName});
//     }

//     const handleAddStream = (data) => {
//         const peersStream =  tagManager.createVideo({
//           parent: screenContainer,
//           width: 250,
//           height: 200,
//           srcObject: data.stream,
//           autoplay: true,
//           playsInline: true,
//         })
//       };

//     navigator.mediaDevices.getDisplayMedia({ video: { displaySurface: 'monitor' } })
//         .then((stream) => {
//             const mainContainer = tagManager.createDiv({
//                 parent: mainDiv,
//                 styles: {
//                   'display': 'flex',
//                   'flex-direction': 'row',
//                 }
//               });
//         }

//     )


//     const peerConnection = new RTCPeerConnection();
//     peerConnection.addEventListener("icecandidate", handleAddStream);
//     stream.getTracks().forEach(track) => {
//       peerConnection.addTrack(track, await displayStream);
//     });

//     const offer = await peerConnection.createOffer();
//     await peerConnection.setLocalDescription(offer);

//     peerConnection.onicecandidate = (event) => {
//       if (event.candidate) {
//         sendIceCandidateToRemote(event.candidate);
//       }
//     };

//     const stopSharingButton = document.createElement('button');
//     stopSharingButton.innerText = 'Stop Sharing';
//     stopSharingButton.addEventListener('click', async () => {
//       (await displayStream).getTracks().forEach((track) => track.stop());
//       peerConnection.close();
//       mainDiv.removeChild(stopSharingButton);
//       removeVideoElement();
//     });

//     mainDiv.appendChild(stopSharingButton); // 화면 공유 중지

//     peerConnection.oniceconnectionstatechange = async () => {
//       if (peerConnection.iceConnectionState === 'closed' || peerConnection.iceConnectionState === 'failed') {
//         (await displayStream).getTracks().forEach((track) => track.stop());
//         mainDiv.removeChild(stopSharingButton);
//         removeVideoElement();
//       }
//     };

//     // 화면을 표시하기 위한 비디오 요소 생성 및 연결
//     const videoElement = document.createElement('video');
//     videoElement.srcObject = displayStream;
//     videoElement.autoplay = true;
//     videoElement.style.width = '100%';
//     videoElement.style.height = 'auto';
//     mainDiv.appendChild(videoElement);
// }

// function removeVideoElement() {
//   const videoElement = document.querySelector('video');
//   if (videoElement) {
//     videoElement.remove();
//   }
// }

// function sendIceCandidateToRemote(candidate: RTCIceCandidate) {
//   const signalingChannel = new WebSocket('ws://143.248.225.156:2567');

//   signalingChannel.addEventListener('open', () => {
//     // Candidate 메시지를 상대방에게 전송
//     signalingChannel.send(JSON.stringify({ type: 'ice-candidate', candidate }));
//   });

//   // 연결이 닫힐 때 WebSocket 리소스 해제
//   signalingChannel.addEventListener('close', () => {
//     signalingChannel.close();
//   });

//   // 에러 처리
//   signalingChannel.addEventListener('error', (error) => {
//     console.error('WebSocket error:', error);
//   });
// }