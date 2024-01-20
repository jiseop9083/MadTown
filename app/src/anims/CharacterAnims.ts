import Phaser from 'phaser'

export const createCharacterAnims = (anims: Phaser.Animations.AnimationManager) => {
    const animsFrameRate = 15
  
    anims.create({
      key: 'avatar_idle',
      frames: anims.generateFrameNames('avatar_idle', {
        start: 0,
        end: 1,
      }),
      repeat: -1,
      frameRate: animsFrameRate * 0.3,
    });

    anims.create({
        key: 'avatar_front',
        frames: anims.generateFrameNames('avatar_front', {
          start: 0,
          end: 3,
        }),
        repeat: -1,
        frameRate: animsFrameRate * 0.4,
      });

    anims.create({
        key: 'avatar_back',
        frames: anims.generateFrameNames('avatar_back', {
          start: 0,
          end: 3,
        }),
        repeat: -1,
        frameRate: animsFrameRate * 0.4,
      });


    anims.create({
        key: 'avatar_left',
        frames: anims.generateFrameNames('avatar_left', {
            start: 0,
            end: 3,
        }),
        repeat: -1,
        frameRate: animsFrameRate * 0.4,
    });

    anims.create({
        key: 'avatar_right',
        frames: anims.generateFrameNames('avatar_right', {
            start: 0,
            end: 3,
        }),
        repeat: -1,
        frameRate: animsFrameRate * 0.4,
    });
}