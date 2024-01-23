export type TagParams = {
    parent: HTMLElement, 
    width?: number, 
    height?: number, 
    styles?: any,
    id?: string,
    className?: string,
    src?: string,
    alt?: string,
    text?: string,
    hoverStyles?: any,
    isVisible?: boolean,
    onClick?: (() => void) | ((event: any) => void),
    // video
    srcObject?: any,
    autoplay?: boolean,
    playsInline?: boolean,
    // input
    placeholder?: string,

};

