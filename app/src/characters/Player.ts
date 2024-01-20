import Phaser from 'phaser'

enum PlayerState {
    IDLE,
    SITTING,
  }

export class Player extends Phaser.Physics.Arcade.Sprite {
    playerId: string;
    playerTexture: string;
    playerBehavior = PlayerState.IDLE;
    // readyToConnect = false;
    // videoConnected = false;
    playerName: Phaser.GameObjects.Text;
    playerContainer: Phaser.GameObjects.Container;
    scene: Phaser.Scene;
    // private playerDialogBubble: Phaser.GameObjects.Container;
  
    constructor(
      scene: Phaser.Scene,
      x: number,
      y: number,
      texture: string, // player animation sprite name
      id: string,
      size: number = 1,
      frame?: string | number
    ) {
      super(scene, x, y, texture, frame);
      this.scene = scene;
      scene.add.existing(this);
      scene.physics.add.existing(this);
      this.playerId = id;
      this.playerTexture = texture;
      // this.setDepth(this.y);
      console.log(`${this.playerTexture}_idle`);
      this.anims.play(`${this.playerTexture}_idle`);
      this.setScale(size);
      this.playerContainer = this.scene.add.container(this.x, this.y - 30).setDepth(5000);

    //   this.playerName = this.scene.add
    //     .text(0, 0, '')
    //     .setFontFamily('Arial')
    //     .setFontSize(12)
    //     .setColor('#000000')
    //     .setOrigin(0.5)
    //   this.playerContainer.add(this.playerName)
  

    // collision
    //   this.scene.physics.world.enable(this.playerContainer);
    //   const playContainerBody = this.playerContainer.body as Phaser.Physics.Arcade.Body;
    //   const collisionScale = [0.5, 0.2];
    //   playContainerBody
    //     .setSize(this.width * collisionScale[0], this.height * collisionScale[1])
    //     .setOffset(-8, this.height * (1 - collisionScale[1]) + 6);
    }

    debugMode = (mode : boolean) => {
        if(mode){
            

            this.scene.remoteRef = this.scene.add.rectangle(0, 0, this.width, this.height);
            this.scene.remoteRef.setStrokeStyle(1, 0xff0000);
        }
    };


    // this.remoteRef = this.add.rectangle(0, 0, entity.width, entity.height);
          // this.remoteRef.setStrokeStyle(1, 0xff0000);
  }