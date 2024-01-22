import { callbackify } from "util";
import { TagParams } from "../types/TagParams";

export class TagManager {
    private static instance: TagManager | null = null;
  
    private constructor() {
      // 생성자를 private로 선언하여 외부에서 직접 인스턴스를 생성하는 것을 방지
    }
  
    public static getInstance(): TagManager {
      if (!TagManager.instance) {
        TagManager.instance = new TagManager();
      }
  
      return TagManager.instance;
    }
  
    createDiv({parent, width, height, styles, id, text, hoverStyles, className}: TagParams): HTMLDivElement {
        const newDiv = document.createElement('div');
        newDiv.style.width = width + 'px';
        newDiv.style.height = height + 'px';
        id ? newDiv.id = id : null;
        className? newDiv.className = className : null;
        text ? newDiv.textContent = text : null;
        Object.assign(newDiv.style, styles);
        newDiv.addEventListener('mouseover', () => {
          Object.assign(newDiv.style, hoverStyles);
        });
        newDiv.addEventListener('mouseout', () => {
          Object.assign(newDiv.style, styles);
        });
        parent.appendChild(newDiv);
        
        return newDiv;
    }

    createButton({parent, width, height, styles, id, className, hoverStyles, text, onClick}: TagParams): HTMLButtonElement {
      const newButton = document.createElement('button');
      newButton.style.width = width + 'px';
      newButton.style.height = height + 'px';
      id ? newButton.id = id : null;
      className? newButton.className = className : null;
      newButton.textContent = text;
      Object.assign(newButton.style, styles);
      newButton.addEventListener('click', onClick);
      newButton.addEventListener('mouseover', () => {
        Object.assign(newButton.style, hoverStyles);
      });
      newButton.addEventListener('mouseout', () => {
        Object.assign(newButton.style, styles);
      });
      parent.appendChild(newButton);
      return newButton;
    }

    createImage({parent, width, height, styles, id, src, alt, hoverStyles, className, onClick}: TagParams): HTMLImageElement {
      const newImage = document.createElement('img');
      newImage.style.width = width + 'px';
      newImage.style.height = height + 'px';
      id ? newImage.id = id : null;
      className? newImage.className = className : null;
      Object.assign(newImage.style, styles);
      newImage.src = src;
      newImage.alt = alt;
      newImage.addEventListener('mouseover', () => {
        Object.assign(newImage.style, hoverStyles);
      });
      newImage.addEventListener('mouseout', () => {
        Object.assign(newImage.style, styles);
      });
      parent.appendChild(newImage); 
      return newImage;
    }
}
  