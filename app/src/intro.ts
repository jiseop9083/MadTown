document.addEventListener('DOMContentLoaded', () => {
    const button = document.createElement('button');
    button.textContent = 'Click me to load index.ts';
    button.addEventListener('click', () => {
        // 버튼이 클릭되면 index.ts를 동적으로 로드
        import('./index').then((indexModule) => {
            button.style.display = 'none';
            indexModule.handleButtonClick();
        }).catch((error) => {
            console.error('Failed to load index.ts:', error);
        });
    });

    document.body.appendChild(button);
});
