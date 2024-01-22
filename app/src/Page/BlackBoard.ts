import { Scene } from 'phaser';
import { TagManager } from '../util/TagManager';

const tagManager = TagManager.getInstance();


export const createBlackBoard = (scene: Scene) => {
    // instance
    const CANVAS_WIDTH = 700;
    const CANVAS_HEIGHT = 500;
    let isDrawing = false;

    const maindiv = tagManager.createDiv({parent: document.body,
        styles: {'background-color': 'lightblue',
                'display': 'flex', 
                'align-items': 'center',
                'justify-content': 'space-around'
            }
    });

    const boardContainer = tagManager.createDiv({parent: maindiv,
        styles: {
                'position': 'relative', 
                }
        }); 

    
    const mainBoard = tagManager.createCanvas({
        parent: boardContainer,
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        styles: {
        }
    });

    const selectorDiv = tagManager.createDiv({
        parent: maindiv,
        styles: {
            'display': 'flex',
            'flex-direction': 'column',
            'margin': '10px',
        }
    });

    const whiteButton = tagManager.createButton({
        parent: selectorDiv,
        text: '흰색 분필',
        styles: {
            'border-radius': '10px',
            'background-color': 'lightgreen',
            'font-size': '24px',
            'fontWeight': '580',
            'margin-bottom': '10px'
        },
        hoverStyles: {
            'cursor': 'pointer',
            'background-color': 'green',
        },
        onClick: () => ctx.strokeStyle = "white",
    });

    const yellowButton = tagManager.createButton({
        parent: selectorDiv,
        text: '노랑 분필',
        styles: {
            'border-radius': '10px',
            'background-color': 'lightgreen',
            'font-size': '24px',
            'fontWeight': '580',
            'margin-bottom': '10px'
        },
        hoverStyles: {
            'cursor': 'pointer',
            'background-color': 'green',
        },
        onClick: () => ctx.strokeStyle = "yellow",
    });

    const redButton = tagManager.createButton({
        parent: selectorDiv,
        text: '빨강 분필',
        styles: {
            'border-radius': '10px',
            'background-color': 'lightgreen',
            'font-size': '24px',
            'fontWeight': '580',
            'margin-bottom': '10px'
        },
        hoverStyles: {
            'cursor': 'pointer',
            'background-color': 'green',
        },
        onClick: () => ctx.strokeStyle = "red",
    });

    const clearButton = tagManager.createButton({
        parent: selectorDiv,
        text: '칠판 정리',
        styles: {
            'border-radius': '10px',
            'background-color': 'lightgreen',
            'font-size': '24px',
            'fontWeight': '580',
            'margin-bottom': '10px'
        },
        hoverStyles: {
            'cursor': 'pointer',
            'background-color': 'green',
        },
        onClick: () => clearBoard(),
    });

    // main board logic
    // 이미지 base64로 가져오기
    mainBoard.style.cursor = `url('data:image/png;base64,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'),auto`;
    const ctx = mainBoard.getContext("2d");
    const backgroundImage = new Image();
    backgroundImage.src = require('../../assets/blackboard.png');
    ctx.lineWidth = 1;
    ctx.fillStyle = "green";
    ctx.strokeStyle = "white";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    backgroundImage.onload = () =>  {
        ctx.drawImage(backgroundImage, -CANVAS_WIDTH *0.016, -CANVAS_HEIGHT *0.016, CANVAS_WIDTH * 1.032, CANVAS_HEIGHT  * 1.032);
    };

    const onMouseMove = (event) => {
        const x = event.offsetX;
        const y = event.offsetY;
        if(x < CANVAS_WIDTH * 0.05 || x > CANVAS_WIDTH * 0.95 || 
            y < CANVAS_HEIGHT * 0.07 || y > CANVAS_HEIGHT * 0.87){
                stopDrawing();
                return;
            }
        if (!isDrawing) {
            ctx.beginPath();
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
            ctx.stroke();
        }
    };
    
    const startDrawing = () => {
        isDrawing = true;
    };
    
    const stopDrawing = () => {
        isDrawing = false;
        saveBoard();
    };
    
    const clearBoard = () => {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.fillStyle = "green";
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.drawImage(backgroundImage, -CANVAS_WIDTH *0.016, -CANVAS_HEIGHT *0.016, CANVAS_WIDTH * 1.032, CANVAS_HEIGHT  * 1.032);
        saveBoard();
    };



    const saveBoard = () => {
        const doodle = mainBoard.toDataURL("image/png");
        scene.room.send("blackboard", {doodle: doodle});
    };

    scene.room.onMessage("blackboard", (messageData) => {
        const img = new Image();
            img.onload =  () => {
                mainBoard.getContext("2d").drawImage(img, 0, 0);
            };
            img.src = messageData.doodle;
    });

    if (mainBoard) {
        mainBoard.addEventListener("mousemove", onMouseMove);
        mainBoard.addEventListener("mousedown", startDrawing);
        mainBoard.addEventListener("mouseup", stopDrawing);
        mainBoard.addEventListener("mouseleave", stopDrawing);
        //mainBoard.addEventListener("contextmenu", handleContextMenu);
    }

};