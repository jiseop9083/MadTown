import { TagManager } from './util/TagManager';
import Color from './types/Color';
import { createBlackBoard } from './Page/BlackBoard';
import { GameScene } from './Page/Game';
import { startVideoConference } from './video/WebRTC';

import { ChatComponent } from './Components/Chat';
import { shareScreen } from './Page/ScreenShare';
import { Coffee } from './Page/Coffee';


const tagManager = TagManager.getInstance();

const characters = [
    { name: 'character1', src: require("../assets/characters/character1.png") },
    { name: 'character2', src: require("../assets/characters/character2.png") },
    { name: 'character3', src: require("../assets/characters/character3.png") }
];

const clouds = [
    { name: 'cloud1', src: require('../assets/clouds/cloud1.png') },
    { name: 'cloud2', src: require('../assets/clouds/cloud2.png') },
    { name: 'cloud3', src: require('../assets/clouds/cloud3.png') },
    { name: 'cloud4', src: require('../assets/clouds/cloud4.png') },
    { name: 'cloud5', src: require('../assets/clouds/cloud5.png') },
    { name: 'cloud6', src: require('../assets/clouds/cloud6.png') },
    { name: 'cloud7', src: require('../assets/clouds/cloud7.png') },
    { name: 'cloud8', src: require('../assets/clouds/cloud8.png') },
    { name: 'cloud9', src: require('../assets/clouds/cloud9.png') },
    { name: 'cloud10', src: require('../assets/clouds/cloud10.png') }
];

let currentIndex = 0;
let cloudImages = [];
let playerName = '';

export const createIntro = (mainDiv : HTMLDivElement) => { 
    const mainContainer = tagManager.createDiv({
        parent: mainDiv,
        styles: {
            'justify-content': 'center',
            'align-items': 'center',
        },
    });

    const popupContainer = tagManager.createDiv({
        parent: mainContainer,
        styles: {
            'position': 'absolute',
            'top': '50%',
            'left': '50%',
            'transform': 'translate(-50%, -50%)',
            'width': '50%',
            'height': '50%',
            'background-color': 'rgba(0, 0, 0, 0.4)',
            'display': 'flex',
            'flexDirection': 'column',
            'justify-content': 'center',
            'align-items': 'center',
            'z-index': '1000',
            'border-radius': '10px', 
        },
        id: 'popupContainer'
    });
    const title = tagManager.createDiv({
        parent: popupContainer,
        text: 'Mad Town',
        styles: {
            'font-size': '64px',
            'font-weight': 600,
            'color': Color.white,
        },
        id: 'title'
    });

    const buttonContainer = tagManager.createDiv({
        parent: popupContainer,
        id: 'selectors',
        styles: {
            'display': 'flex',
            'justify-content': 'center',
            'align-items': 'center',
        }
    })

    const leftButton = tagManager.createButton({
        parent: buttonContainer,
        width: 50,
        height: 30,
        text: '<',
        styles: {
            'background-color': Color.secondary,
            'color': Color.white,
            'border-radius': '10px',
            'margin-top': '20px',
            'font-weight': '600',
            'font-size': '20px',
        },
        hoverStyles: { 
            'cursor': 'pointer', 
            'color': Color.black,
            'background-color': Color.yellow,
            'font-size': '22px',
        },
        onClick: () => {
            currentIndex = (currentIndex - 1 + characters.length) % characters.length;
            characterImg.src = characters[currentIndex].src;
            characterImg.alt = characters[currentIndex].name;
        }
    });

    const imageContainer = tagManager.createDiv({
        parent: buttonContainer,
        id: 'avatars',
        styles: {
            position: 'relative',
        },
    });

    const characterImg = tagManager.createImage({
        parent: imageContainer,
        width: 200,
        height: 200,
        id: 'avatar',
        src: characters[currentIndex].src,
        alt: characters[currentIndex].name,
    });

    const rightButton = tagManager.createButton({
        parent: buttonContainer,
        width: 50,
        height: 30,
        text: '>',
        styles: {
            'background-color': Color.secondary,
            'color': Color.white,
            'border-radius': '10px',
            'margin-top': '20px',
            'font-weight': '600',
            'font-size': '20px',
        },
        hoverStyles: { 
            'cursor': 'pointer', 
            'color': Color.black,
            'background-color': Color.yellow,
            'font-size': '22px',
        },
        onClick: () => {
            currentIndex = (currentIndex + 1) % characters.length;
            characterImg.src = characters[currentIndex].src;
            characterImg.alt = characters[currentIndex].name;
        }
    });

    const nameInput = tagManager.createInput({
        parent: popupContainer,
        placeholder: "Enter name",
        styles: {
            'display': 'flex',
            'border-radius': '10px',
            'font-size': '20px',
        }
    });

    const startButton = tagManager.createButton({
        parent: popupContainer,
        width: 130,
        height: 60,
        text: 'Welcome!',
        styles: {
            'background-color': Color.primary,
            'color': Color.white,
            'border-radius': '10px',
            'margin-top': '20px',
            'font-weight': '600',
            'font-size': '20px',
        },
        hoverStyles: { 
            'cursor': 'pointer', 
            'color': Color.black,
            'background-color': Color.yellow,
            'font-size': '22px',
        },
        onClick: () => {
            playerName = nameInput.value;

            if(playerName) {
                createGameScreen();
            } else {
                alert('Please enter your name');
            }
        }
    });

    const styles = document.createElement('style');
    // 함수를 사용하여 구름 이미지 생성
    function createCloudImage(index, animationDuration) {
        const cloudImg = tagManager.createImage({
            parent: mainContainer,
            width: 100,
            height: 70,
            src: clouds[index].src,
            alt: clouds[index].name,
            styles: {
                position: 'absolute',
                top: `${5 + 10 * index}%`, // Adjusted top position
                left: '0',
            },
        });

        cloudImg.classList.add(`floating-animation${index + 1}`);

        // CSS for the floating animation
        const styles = document.createElement('style');
        styles.innerHTML = `
            @keyframes floatAnimation${index + 1} {
                0% { transform: translateX(${index % 2 === 0 ? 'calc(100vw - 100px)' : '0'}); }
                50% { transform: translateX(${index % 2 === 0 ? '0' : 'calc(100vw - 100px)'}); }
                100% { transform: translateX(${index % 2 === 0 ? 'calc(100vw - 100px)' : '0'}); }
            }

            .floating-animation${index + 1} {
                animation: floatAnimation${index + 1} ${animationDuration}s linear infinite;
            }
        `;

        document.head.appendChild(styles);
        cloudImages.push(cloudImg);

        return cloudImg;
    }

    createCloudImage(0, 20);
    createCloudImage(1, 35);
    createCloudImage(2, 25);
    createCloudImage(3, 30);
    createCloudImage(4, 45);
    createCloudImage(5, 50);
    createCloudImage(6, 10);
    createCloudImage(7, 15);
    createCloudImage(8, 25);

    document.head.appendChild(styles);


    const createGameScreen = () => {
        const gameContainer = tagManager.createDiv({
            parent: mainDiv,
            id: 'gameContainer',
            styles: {
                'display': 'flex',
                'flex-direction': 'column',
            }
        });

        const gameAndChat = tagManager.createDiv({
            parent: gameContainer,
            styles: {
                'display': 'flex',
                'flex-direction': 'row-reverse',
                'margin-top': '50px', 
            } 
        });
        
        ChatComponent(gameAndChat);

        const gameDiv = tagManager.createDiv({
            parent: gameAndChat,
            id: 'gameDiv',
        });

        const buttonDiv = tagManager.createDiv({
            parent: gameContainer,
            styles: {
                'display': 'flex',
                'flex-direction': 'row',
                'margin-top': '50px',
                'margin-left': '50px',
                'justify-content': 'space-around',
            }
        });

        const miniGameButton = tagManager.createButton({
            parent: buttonDiv,
            id: 'miniGameButton',
            text: 'mini Game',
            width: 140,
            height: 60,
            styles: {
                'background-color': Color.primary,
                'color': Color.white,
                'border-radius': '10px',
                'margin-top': '20px',
                'font-weight': '600',
                'font-size': '20px',
                'border': 'none',
            },
            hoverStyles: { 
                'cursor': 'pointer', 
                'color': Color.black,
                'background-color': Color.yellow,
                'font-size': '22px',
            },
            onClick: () => {
                
                tagManager.setVisible(miniGameButton, false);
                tagManager.setVisible(videoButton, false);
                tagManager.setVisible(boardButton, false);
                tagManager.setVisible(shareButton, false);
                RPSButtonDiv(buttonDiv);
                const game = window.game.scene.keys.GameScene as GameScene;
                game.backgroundSND.pause();
                game.scene.start('Coffee');
            } 
        });

        const videoButton = tagManager.createButton({
            parent: buttonDiv,
            id: 'videoButton',
            text: 'Video',
            width: 140,
            height: 60,
            styles: {
                'background-color': Color.primary,
                'color': Color.white,
                'border-radius': '10px',
                'margin-top': '20px',
                'font-weight': '600',
                'font-size': '20px',
                'border': 'none',
            },
            hoverStyles: { 
                'cursor': 'pointer', 
                'color': Color.black,
                'background-color': Color.yellow,
                'font-size': '22px',
            },
            onClick: () => {
                const game = window.game.scene.keys.GameScene as GameScene;
                game.addInputListener();
                startVideoConference(game, game.currentPlayer, mainDiv);
            }
        });

        const boardButton = tagManager.createButton({
            parent: buttonDiv,
            id: 'boardButton',
            text: 'Black Board',
            width: 140,
            height: 60,
            styles: {
                'background-color': Color.primary,
                'color': Color.white,
                'border-radius': '10px',
                'margin-top': '20px',
                'font-weight': '600',
                'font-size': '20px',
                'border': 'none',
            },
            hoverStyles: { 
                'cursor': 'pointer', 
                'color': Color.black,
                'background-color': Color.yellow,
                'font-size': '22px',
            },
            onClick: () => {
                const game = window.game.scene.keys.GameScene as GameScene;
                createBlackBoard(game, mainDiv);
            } 
        });

        const shareButton = tagManager.createButton({
            parent: buttonDiv,
            id: 'shareButton',
            text: 'Screen Share',
            width: 140,
            height: 60,
            styles: {
                'background-color': Color.primary,
                'color': Color.white,
                'border-radius': '10px',
                'margin-top': '20px',
                'font-weight': '600',
                'font-size': '20px',
                'border': 'none',
            },
            hoverStyles: { 
                'cursor': 'pointer', 
                'color': Color.black,
                'background-color': Color.yellow,
                'font-size': '22px',
            },
            onClick: () => {
                const game = window.game.scene.keys.GameScene as GameScene;
                game.addInputListener();
                shareScreen(game, game.currentPlayer, mainDiv);
            } 
        });


        

        import('./PhaserGame').then((indexModule) => {
            tagManager.setVisible(mainContainer, false);
            window['currentIndex'] = currentIndex;
            window['playerName'] = playerName;
            indexModule.createGame();

        }).catch((error) => {
            console.error('Failed to load index.ts:', error);
        });
    }

    const RPSButtonDiv = (buttonDiv: HTMLDivElement) => {
        const gameStartButton = tagManager.createButton({
            parent: buttonDiv,
            id: 'gameStartButton',
            text: 'Start',
            width: 140,
            height: 60,
            styles: {
                'background-color': Color.primary,
                'color': Color.white,
                'border-radius': '10px',
                'margin-top': '20px',
                'font-weight': '600',
                'font-size': '20px',
                'border': 'none',
            },
            hoverStyles: { 
                'cursor': 'pointer', 
                'color': Color.black,
                'background-color': Color.yellow,
                'font-size': '22px',
            },
            onClick: () => {
                const game = window.game.scene.keys.Coffee as Coffee;
                if(game.gameTimer == 0){
                    game.room.send("gameStart", {
                        "gameStart": 60 * 3,
                      });
                }
                
            } 
        });

        const rockButton = tagManager.createButton({
            parent: buttonDiv,
            id: 'rock',
            text: 'Rock',
            width: 140,
            height: 60,
            styles: {
                'background-color': Color.primary,
                'color': Color.white,
                'border-radius': '10px',
                'margin-top': '20px',
                'font-weight': '600',
                'font-size': '20px',
                'border': 'none',
            },
            hoverStyles: { 
                'cursor': 'pointer', 
                'color': Color.black,
                'background-color': Color.yellow,
                'font-size': '22px',
            },
            onClick: () => {
                const game = window.game.scene.keys.Coffee as Coffee;
                game.room.send("setState", {
                    "state": 1,
                });
            }
        });

        const scissorButton = tagManager.createButton({
            parent: buttonDiv,
            id: 'scissors',
            text: 'Scissors',
            width: 140,
            height: 60,
            styles: {
                'background-color': Color.primary,
                'color': Color.white,
                'border-radius': '10px',
                'margin-top': '20px',
                'font-weight': '600',
                'font-size': '20px',
                'border': 'none',
            },
            hoverStyles: { 
                'cursor': 'pointer', 
                'color': Color.black,
                'background-color': Color.yellow,
                'font-size': '22px',
            },
            onClick: () => {
                const game = window.game.scene.keys.Coffee as Coffee;
                game.room.send("setState", {
                    "state": 2,
                });
            } 
        });

        const paperButton = tagManager.createButton({
            parent: buttonDiv,
            id: 'paper',
            text: 'Paper',
            width: 140,
            height: 60,
            styles: {
                'background-color': Color.primary,
                'color': Color.white,
                'border-radius': '10px',
                'margin-top': '20px',
                'font-weight': '600',
                'font-size': '20px',
                'border': 'none',
            },
            hoverStyles: { 
                'cursor': 'pointer', 
                'color': Color.black,
                'background-color': Color.yellow,
                'font-size': '22px',
            },
            onClick: () => {
                const game = window.game.scene.keys.Coffee as Coffee;
                game.room.send("setState", {
                    "state": 3,
                });
            } 
        });
    }
};