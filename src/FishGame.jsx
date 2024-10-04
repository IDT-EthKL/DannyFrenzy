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

    function preload() {
      this.load.image('player', 'path/to/fish.png'); // Add your fish image
      this.load.image('smallFish', 'path/to/smallFish.png'); // Add your small fish image
      this.load.image('shark', 'path/to/shark.png'); // Add your shark image
    }

    function create() {
      player = this.physics.add.sprite(window.innerWidth / 2, window.innerHeight / 2, 'player');
      player.setCollideWorldBounds(true);

      smallFish = this.physics.add.group({
        key: 'smallFish',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 },
      });

      smallFish.children.iterate((child) => {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
      });

      shark = this.physics.add.sprite(window.innerWidth, window.innerHeight / 2, 'shark');
      shark.setVelocityX(-200);
      shark.setCollideWorldBounds(true);
      shark.setBounce(1);

      scoreText = this.add.text(16, 16, 'Score: 0', {
        fontSize: '32px',
        fill: '#fff',
      });

      this.physics.add.overlap(player, smallFish, eatFish, null, this);
      this.physics.add.overlap(player, shark, hitShark, null, this);
    }

    function update() {
      const cursors = this.input.keyboard.createCursorKeys();
      const wKey = this.input.keyboard.addKey('W');
      const aKey = this.input.keyboard.addKey('A');
      const sKey = this.input.keyboard.addKey('S');
      const dKey = this.input.keyboard.addKey('D');

      if (cursors.left.isDown || aKey.isDown) {
        player.setVelocityX(-160);
      } else if (cursors.right.isDown || dKey.isDown) {
        player.setVelocityX(160);
      } else {
        player.setVelocityX(0);
      }

      if (cursors.up.isDown || wKey.isDown) {
        player.setVelocityY(-160);
      } else if (cursors.down.isDown || sKey.isDown) {
        player.setVelocityY(160);
      } else {
        player.setVelocityY(0);
      }

      // Move the shark toward the player
      if (player.x < shark.x) {
        shark.setVelocityX(-80);
      } else {
        shark.setVelocityX(80);
      }

      if (player.y < shark.y) {
        shark.setVelocityY(-80);
      } else {
        shark.setVelocityY(80);
      }
    }

    function eatFish(player, fish) {
      fish.destroy();
      score += 1;
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
