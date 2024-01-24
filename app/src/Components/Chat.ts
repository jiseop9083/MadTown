import { TagManager } from "../util/TagManager";
import Color from "../types/Color";
import { GameScene } from "../Page/Game";

const tagManager = TagManager.getInstance();

export const ChatComponent = (gameContainer: HTMLElement) => {
    
    
    const chatContainer = tagManager.createDiv({
        parent: gameContainer,
        width: 330,
        styles: {
            'background-color': Color.transparent,
            'color': Color.white,
            'height': '80%',
            'border-radius': '10px',
            'margin': 'auto 0',
            'margin-left': '20px',
            'font-weight': '600',
            'font-size': '20px',
            'position': 'relative',
        },
    });

    const messageContainer = tagManager.createDiv({
        parent: chatContainer,
        width: 270,
        id: 'messageContainer',
        styles: {
            'display':'flex',
            'flex-direction': 'column',
            'height': '410px',
            'overflow-y':'auto',
            'word-wrap': 'break-word',
        },
    });

    const chatInputContainer = tagManager.createDiv({
        parent: chatContainer,
        height: 30,
        id: 'chatInputContainer',
        styles: {
            'position': 'absolute',
            'bottom': '5px',
            'display': 'flex',
            'flex-direction': 'row',
            'width': '90%',
            'margin': '10px',
        },
    });

    const chatInput = tagManager.createInput({
        parent: chatInputContainer,
        height: 30,
        placeholder: ' send message to nearby people ➤',
        styles: {
            'flex': '1',
            'border-radius': '10px',
        },
    });

    chatInput.addEventListener('keyup', (event) => {
        if(event.key == 'Enter') {
            sendMessage();
        }
    })

    const sendMessage = () => {
        const game = window.game.scene.keys.GameScene as GameScene;
        game.room.send("chat", {
            "chat": {
                message: chatInput.value,
                position: { x: game.currentPlayer.x, y: game.currentPlayer.y }
            }
        });
        chatInput.value = '';
    }

    const chatButton = tagManager.createButton({
        parent: chatInputContainer,
        height: 30,
        width: 50,
        text: 'send',
        onClick: () => {
            sendMessage();
        },
        styles: {
            'background-color': Color.primary,
            'border-radius': '10px',
            'margin-left': '5px',
            'color': Color.white,
            'border': 'none',
            'font-size': '16px',
        },
        hoverStyles: {
            'cursor': 'pointer',
            'background-color': Color.yellow,
            'color': Color.black,
            'font-size': '18px',
        }
    });    
}