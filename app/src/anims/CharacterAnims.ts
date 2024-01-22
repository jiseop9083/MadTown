import Phaser from 'phaser'

declare var currentIndex: number;

export const createCharacterAnims = (anims: Phaser.Animations.AnimationManager) => {
    const animsFrameRate = 15
  
    anims.create({
      key: `avatar${currentIndex+1}_idle`,
      frames: anims.generateFrameNames(`avatar${currentIndex+1}_idle`, {
        start: 0,
        end: 1,
      }),
      repeat: -1,
      frameRate: animsFrameRate * 0.3,
    });

    anims.create({
        key: `avatar${currentIndex+1}_front`,
        frames: anims.generateFrameNames(`avatar${currentIndex+1}_front`, {
          start: 0,
          end: 3,
        }),
        repeat: -1,
        frameRate: animsFrameRate * 0.4,
      });

    anims.create({
        key: `avatar${currentIndex+1}_back`,
        frames: anims.generateFrameNames(`avatar${currentIndex+1}_back`, {
          start: 0,
          end: 3,
        }),
        repeat: -1,
        frameRate: animsFrameRate * 0.4,
      });


    anims.create({
        key: `avatar${currentIndex+1}_left`,
        frames: anims.generateFrameNames(`avatar${currentIndex+1}_left`, {
            start: 0,
            end: 3,
        }),
        repeat: -1,
        frameRate: animsFrameRate * 0.4,
    });

    anims.create({
        key: `avatar${currentIndex}_right`,
        frames: anims.generateFrameNames(`avatar${currentIndex+1}_right`, {
            start: 0,
            end: 3,
        }),
        repeat: -1,
        frameRate: animsFrameRate * 0.4,
    });
}