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
  
    createDiv({parent, width, height, styles, id, text, hoverStyles, isVisible, className}: TagParams): HTMLDivElement {
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

    createButton({parent, width, height, styles, id, className, isVisible, hoverStyles, text, onClick}: TagParams): HTMLButtonElement {
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

    createImage({parent, width, height, styles, id, src, alt, hoverStyles, className, isVisible, onClick}: TagParams): HTMLImageElement {
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

    createCanvas({parent, width, height, styles, id, className, isVisible, onClick}: TagParams): HTMLCanvasElement {
      const newCanvas = document.createElement('canvas');
      newCanvas.width = width;
      newCanvas.height = height;
      id ? newCanvas.id = id : null;
      className? newCanvas.className = className : null;
      Object.assign(newCanvas.style, styles);
      parent.appendChild(newCanvas); 
      return newCanvas;
    }


    createVideo({parent, width, height, styles, id, className, srcObject, autoplay, playsInline}: TagParams): HTMLVideoElement {
      const newVideo = document.createElement('video');
      newVideo.width = width;
      newVideo.height = height;
      id ? newVideo.id = id : null;
      className? newVideo.className = className : null;
      Object.assign(newVideo.style, styles);
      parent.appendChild(newVideo); 
      srcObject ? newVideo.srcObject = srcObject : null;
      autoplay ? newVideo.autoplay = autoplay : newVideo.autoplay = true;
      playsInline ? newVideo.playsInline = playsInline : newVideo.playsInline = true;
      return newVideo;
    }

    createInput({parent, width, height, styles, id, className, placeholder}: TagParams): HTMLInputElement {
      const newInput = document.createElement('input');
      newInput.width = width;
      newInput.height = height;
      id ? newInput.id = id : null;
      className? newInput.className = className : null;
      Object.assign(newInput.style, styles);
      placeholder ? newInput.placeholder = placeholder : '';
      parent.appendChild(newInput); 
      return newInput;
    }


    // DO NOT set display to 'flex' in obj element
    setVisible(obj : HTMLElement, isVisible: boolean) : void {
      if(isVisible){
        obj.style.display = obj.dataset.originalDisplay || '';
      }
       else{
        obj.dataset.originalDisplay = obj.style.display;
        obj.style.display = 'none';
       }
      for (let i = 0; i < obj.children.length; i++) {
        this.setVisible(obj.children[i] as HTMLElement, isVisible);
      }
    }

    removeTag(tag: HTMLElement): void {
      const parent = tag.parentElement;
      if (parent) {
          parent.removeChild(tag);
      }
  }
}
  