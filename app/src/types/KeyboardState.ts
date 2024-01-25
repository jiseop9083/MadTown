import Phaser from 'phaser'

export type Keyboard = {
    W: Phaser.Input.Keyboard.Key
    S: Phaser.Input.Keyboard.Key
    A: Phaser.Input.Keyboard.Key
    D: Phaser.Input.Keyboard.Key
    E: Phaser.Input.Keyboard.Key
    R: Phaser.Input.Keyboard.Key
}

export type Keys = Keyboard & Phaser.Types.Input.Keyboard.CursorKeys