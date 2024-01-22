import Phaser from 'phaser'

declare var currentIndex: number;

export const createCharacterAnims = (anims: Phaser.Animations.AnimationManager) => {
    const animsFrameRate = 15
  
    anims.create({
      key: `avatar1_idle`,
      frames: anims.generateFrameNames(`avatar1_idle`, {
        start: 0,
        end: 1,
      }),
      repeat: -1,
      frameRate: animsFrameRate * 0.3,
    });

    anims.create({
        key: `avatar1_front`,
        frames: anims.generateFrameNames(`avatar1_front`, {
          start: 0,
          end: 3,
        }),
        repeat: -1,
        frameRate: animsFrameRate * 0.4,
      });

    anims.create({
        key: `avatar1_back`,
        frames: anims.generateFrameNames(`avatar1_back`, {
          start: 0,
          end: 3,
        }),
        repeat: -1,
        frameRate: animsFrameRate * 0.4,
      });


    anims.create({
        key: `avatar1_left`,
        frames: anims.generateFrameNames(`avatar1_left`, {
            start: 0,
            end: 3,
        }),
        repeat: -1,
        frameRate: animsFrameRate * 0.4,
    });

    anims.create({
        key: `avatar1_right`,
        frames: anims.generateFrameNames(`avatar1_right`, {
            start: 0,
            end: 3,
        }),
        repeat: -1,
        frameRate: animsFrameRate * 0.4,
    });



    anims.create({
      key: `avatar2_idle`,
      frames: anims.generateFrameNames(`avatar2_idle`, {
        start: 0,
        end: 1,
      }),
      repeat: -1,
      frameRate: animsFrameRate * 0.3,
    });

    anims.create({
        key: `avatar2_front`,
        frames: anims.generateFrameNames(`avatar2_front`, {
          start: 0,
          end: 3,
        }),
        repeat: -1,
        frameRate: animsFrameRate * 0.4,
      });

    anims.create({
        key: `avatar2_back`,
        frames: anims.generateFrameNames(`avatar2_back`, {
          start: 0,
          end: 3,
        }),
        repeat: -1,
        frameRate: animsFrameRate * 0.4,
      });


    anims.create({
        key: `avatar2_left`,
        frames: anims.generateFrameNames(`avatar2_left`, {
            start: 0,
            end: 3,
        }),
        repeat: -1,
        frameRate: animsFrameRate * 0.4,
    });

    anims.create({
        key: `avatar2_right`,
        frames: anims.generateFrameNames(`avatar2_right`, {
            start: 0,
            end: 3,
        }),
        repeat: -1,
        frameRate: animsFrameRate * 0.4,
    });
}