// TODO: page management
import { createBlackBoard } from './Page/BlackBoard';
import { createIntro } from './intro';
import { TagManager } from './util/TagManager';
import { pauseGame } from './PhaserGame';
import { stopBlackBoard } from './Page/BlackBoard';

const tagManager = TagManager.getInstance();

let mainDiv : HTMLDivElement;

document.addEventListener('DOMContentLoaded', () => {
    const background = new Image();
    background.src = require('../assets/clouds/background.jpg');
    background.onload = () => {
        document.body.style.height = '97vh';
        document.body.style.width = '95vw';
        document.body.style.backgroundImage = `url(${background.src})`;

        document.body.style.backgroundSize = 'cover';
        document.body.style.justifyContent = 'center';
    };

    mainDiv = tagManager.createDiv({
        parent: document.body,
        id: 'main',
        styles: {
            'display': 'flex',
            'justify-content': 'center',
        }
    }); 


    //createBlackBoard();
    createIntro(mainDiv);
});

const openBoard = () => {
    pauseGame();
    stopBlackBoard();
};


