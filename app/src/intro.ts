import { TagManager } from './util/TagManager';


const tagManager = TagManager.getInstance();


export const createIntro = () => {
    const maindiv = tagManager.createDiv({parent: document.body,
        styles: {'background-color': 'lightblue',
                'display': 'flex', 
                'justify-content': 'center',
                'align-items': 'center',
                }
        });
    const imageContainer = tagManager.createDiv({parent: maindiv,

        });
    const CharacterImg = tagManager.createImage({parent: imageContainer,
        width: 100, 
        height: 100, 
        src: 'd',
        alt: 'character1',
    });
    const button = tagManager.createButton({parent: maindiv,
        width: 100, 
        height: 100, 
        text: 'Click me to load index.ts',
        styles: {'background-color': 'red',
                'border-radius': '10px'},
        hoverStyles: {'cursor': 'pointer', 'background-color': 'blue'},
        onClick: () => {
            // 버튼이 클릭되면 index.ts를 동적으로 로드
            import('./game').then((indexModule) => {
                tagManager.setVisible(maindiv, false);
                indexModule.createGame();
            }).catch((error) => {
                console.error('Failed to load index.ts:', error);
            });
       }
    });
};
