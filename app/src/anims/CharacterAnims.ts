import Phaser from 'phaser'

export const createCharacterAnims = (anims: Phaser.Animations.AnimationManager) => {
    const animsFrameRate = 15
  
    anims.create({
      key: 'avatar1_idle',
      frames: anims.generateFrameNames('avatar1', {
        start: 0,
        end: 1,
      }),
      repeat: -1,
      frameRate: animsFrameRate * 0.3,
    });
}