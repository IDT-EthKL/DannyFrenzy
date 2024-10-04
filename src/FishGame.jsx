// src/FishGame.js
import React, { useEffect } from 'react';
import Phaser from 'phaser';

const FishGame = () => {
  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: false,
        },
      },
      scene: {
        preload,
        create,
        update,
      },
    };

    const game = new Phaser.Game(config);

    let player;
    let smallFish;
    let shark;
    let score = 0;
    let scoreText;
    let background;

    function preload() {
      this.load.image('player', 'path/to/fish.png'); // Your fish image
      this.load.image('smallFish', 'path/to/smallFish.png'); // Your small fish image
      this.load.image('shark', 'path/to/shark.png'); // Your shark image
      this.load.image('background', 'assets/bg.jpg'); // Your background image
    }

    function create() {
      // Add background image
      background = this.add.image(0, 0, 'background').setOrigin(0, 0);
      background.setDisplaySize(window.innerWidth, window.innerHeight);

      player = this.physics.add.sprite(window.innerWidth / 2, window.innerHeight / 2, 'player');
      player.setCollideWorldBounds(true);
      player.setScale(0.1); // Scale player as needed

      smallFish = this.physics.add.group({
        key: 'smallFish',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 },
      });

      smallFish.children.iterate((child) => {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        child.setScale(0.05); // Scale small fish as needed
      });

      shark = this.physics.add.sprite(window.innerWidth, window.innerHeight / 2, 'shark');
      shark.setVelocityX(-200);
      shark.setCollideWorldBounds(true);
      shark.setBounce(1);
      shark.setScale(0.15); // Scale shark as needed

      scoreText = this.add.text(16, 16, 'Score: 0', {
        fontSize: '32px',
        fill: '#000000',
      });

      this.physics.add.overlap(player, smallFish, eatFish, null, this);
      this.physics.add.overlap(player, shark, hitShark, null, this);
    }

    function update() {
      const cursors = this.input.keyboard.createCursorKeys();
      const wKey = this.input.keyboard.addKey("W");
      const aKey = this.input.keyboard.addKey("A");
      const sKey = this.input.keyboard.addKey("S");
      const dKey = this.input.keyboard.addKey("D");

      const playerSpeed = 160;
      const sharkSpeed = 80;

      if (cursors.left.isDown || aKey.isDown) {
        player.setVelocityX(-playerSpeed);
      } else if (cursors.right.isDown || dKey.isDown) {
        player.setVelocityX(playerSpeed);
      } else {
        player.setVelocityX(0);
      }

      if (cursors.up.isDown || wKey.isDown) {
        player.setVelocityY(-playerSpeed);
      } else if (cursors.down.isDown || sKey.isDown) {
        player.setVelocityY(playerSpeed);
      } else {
        player.setVelocityY(0);
      }

      // Move the shark toward the player
      if (player.x < shark.x) {
        shark.setVelocityX(-sharkSpeed);
      } else {
        shark.setVelocityX(sharkSpeed);
      }

      if (player.y < shark.y) {
        shark.setVelocityY(-sharkSpeed);
      } else {
        shark.setVelocityY(sharkSpeed);
      }
    }

    function eatFish(player, fish) {
      fish.destroy();
      score += 10;
      scoreText.setText('Score: ' + score);
    }

    function hitShark() {
      this.physics.pause();
      scoreText.setText('Game Over! Final Score: ' + score);
      // Restart the game or reset the score as needed
    }

    // Handle window resize
    const resizeGame = () => {
      game.scale.resize(window.innerWidth, window.innerHeight);
      background.setDisplaySize(window.innerWidth, window.innerHeight); // Resize background
    };

    window.addEventListener('resize', resizeGame);

    return () => {
      game.destroy(true);
      window.removeEventListener('resize', resizeGame);
    };
  }, []);

  return <div id="game-container" />;
};

export default FishGame;
