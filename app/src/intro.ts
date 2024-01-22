import { TagManager } from './util/TagManager';


const tagManager = TagManager.getInstance();

const characters = [
    { name: 'character1', src: require("../assets/characters/character1.png") },
    { name: 'character2', src: require("../assets/characters/character2.png") }
];

const clouds = [
    { name: 'cloud1', src: require('../assets/clouds/cloud1.png') },
    { name: 'cloud7', src: require('../assets/clouds/cloud7.png') }
];

let currentIndex = 0;


export const createIntro = () => {
    const maindiv = tagManager.createDiv({
        parent: document.body,
        styles: {
            'background-color': 'lightblue',
            'display': 'flex',
            'justify-content': 'center',
            'align-items': 'center',
            'height': '100vh'
        },
    });

    const imageContainer = tagManager.createDiv({
        parent: maindiv,
        styles: {
            position: 'relative',
        },
    });

    const cloudImages = clouds.map(cloud => {
        const cloudImage = new Image();
        cloudImage.src = cloud.src;
        cloudImage.onload = function () {
            const originalWidth = cloudImage.width;
            const originalHeight = cloudImage.height;

            const targetWidth = 100; // 원하는 가로 크기
            const targetHeight = (targetWidth * originalHeight) / originalWidth; // 비율을 유지하여 계산된 세로 크기

            const cloudImageElement = tagManager.createImage({
                parent: imageContainer,
                width: targetWidth,
                height: targetHeight,
                src: cloudImage.src,
                alt: cloud.name,
            });

            const floatLeftRightAnimation = () => {
                let position = 0;
                let direction = 1; // 1 for left, -1 for right

                const moveCloud = () => {
                    position -= direction;

                    if (position < -targetWidth) {
                        direction = 1; // Change direction to move from right to left
                    } else if (position > 0) {
                        position = 0;
                        direction = -1; // Change direction to move from left to right
                    }

                    cloudImageElement.style.transform = `translateX(${position}px)`;
                    requestAnimationFrame(moveCloud);
                };

                moveCloud();
            };

            floatLeftRightAnimation();
        };

        return cloudImage;
    });

    const characterImg = tagManager.createImage({
        parent: imageContainer,
        width: 100,
        height: 100,
        src: characters[currentIndex].src,
        alt: characters[currentIndex].name,
    });

    const leftButton = tagManager.createButton({
        parent: maindiv,
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
        parent: maindiv,
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
        parent: maindiv,
        width: 100,
        height: 100,
        text: 'Click me to load index.ts',
        styles: {
            'background-color': 'red',
            'border-radius': '10px'
        },
        hoverStyles: { 'cursor': 'pointer', 'background-color': 'blue' },
        onClick: () => {
            import('./game').then((indexModule) => {
                tagManager.setVisible(maindiv, false);
                window['currentIndex'] = currentIndex;

                indexModule.createGame();
            }).catch((error) => {
                console.error('Failed to load index.ts:', error);
            });
        }
    });
};
