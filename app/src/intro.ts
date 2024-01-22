import { TagManager } from './util/TagManager';

const tagManager = TagManager.getInstance();
document.addEventListener('DOMContentLoaded', () => {
    createIntro();
});

const characters = [
    { name: 'character1', src: require("../assets/characters/character1.png") },
    { name: 'character2', src: require("../assets/characters/character2.png") }
];

let currentIndex = 0;

const createIntro = () => {
    const maindiv = tagManager.createDiv({parent: document.body,
        styles: {'background-color': 'lightblue',
                'display': 'flex', 
                'justify-content': 'center',
                'align-items': 'center',
                }
        });
    const imageContainer = tagManager.createDiv({parent: maindiv,

        });
    const characterImg = tagManager.createImage({parent: imageContainer,
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

    const button = tagManager.createButton({parent: maindiv,
        width: 100, 
        height: 100, 
        text: 'Click me to load index.ts',
        styles: {'background-color': 'red',
                'border-radius': '10px'},
        hoverStyles: {'cursor': 'pointer', 'background-color': 'blue'},
        onClick: () => {
            import('./game').then((indexModule) => {
                window['currentIndex'] = currentIndex;

                maindiv.style.display = 'none';
                indexModule.createGame();
            }).catch((error) => {
                console.error('Failed to load index.ts:', error);
            });
       }
    });
};