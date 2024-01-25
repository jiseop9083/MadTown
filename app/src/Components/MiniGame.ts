
export const startMiniGame = () => {
    
    const miniGameButton = document.getElementById('miniGameButton');
    let event = new Event('click');
    miniGameButton.dispatchEvent(event);
}