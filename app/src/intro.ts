import { TagManager } from './util/TagManager';


const tagManager = TagManager.getInstance();

const characters = [
    { name: 'character1', src: require("../assets/characters/character1.png") },
    { name: 'character2', src: require("../assets/characters/character2.png") }
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

export const createIntro = () => {
    const background = new Image();
    background.src = require('../assets/clouds/background.jpg');
    background.onload = function () {
        document.body.style.backgroundImage = `url(${background.src})`;
        document.body.style.backgroundSize = 'cover';
    };

    const maindiv = tagManager.createDiv({
        parent: document.body,
        styles: {
            'display': 'flex',
            'justify-content': 'center',
            'align-items': 'center',
        },
    });

    const popupContainer = tagManager.createDiv({
        parent: maindiv,
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
    });
    

    const imageContainer = tagManager.createDiv({
        parent: popupContainer,
        styles: {
            position: 'relative',
        },
    });

    const buttonContainer = tagManager.createDiv({
        parent: popupContainer
    })

    const characterImg = tagManager.createImage({
        parent: imageContainer,
        width: 100,
        height: 100,
        src: characters[currentIndex].src,
        alt: characters[currentIndex].name,
    });

    const leftButton = tagManager.createButton({
        parent: buttonContainer,
        width: 50,
        height: 30,
        text: '<',
        onClick: () => {
            currentIndex = (currentIndex - 1 + characters.length) % characters.length;
            characterImg.src = characters[currentIndex].src;
            characterImg.alt = characters[currentIndex].name;
        }
    });

    const rightButton = tagManager.createButton({
        parent: buttonContainer,
        width: 50,
        height: 30,
        text: '>',
        onClick: () => {
            currentIndex = (currentIndex + 1) % characters.length;
            characterImg.src = characters[currentIndex].src;
            characterImg.alt = characters[currentIndex].name;
        }
    });

    const button = tagManager.createButton({
        parent: popupContainer,
        width: 100,
        height: 50,
        text: 'Welcome!',
        styles: {
            'background-color': '#A8397F',
            'color': '#ffffff',
            'border-radius': '10px',
            'margin-top': '20px',
        },
        hoverStyles: { 
            'cursor': 'pointer', 
            'color': '#000000',
            'background-color': '#F9F871'
        },
        onClick: () => {
            import('./game').then((indexModule) => {
                tagManager.setVisible(popupContainer, false);
                window['currentIndex'] = currentIndex;

                indexModule.createGame();
                tagManager.removeTag(button);
            }).catch((error) => {
                console.error('Failed to load index.ts:', error);
            });
        }
    });

    const styles = document.createElement('style');
    // 함수를 사용하여 구름 이미지 생성
    function createCloudImage(index, animationDuration) {
        const cloudImg = tagManager.createImage({
            parent: maindiv,
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
};