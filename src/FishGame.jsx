import React, { useEffect } from 'react';
import Phaser from 'phaser';

const FishGame = () => {
    useEffect(() => {
        const config = {
            type: Phaser.AUTO,
            width: window.innerWidth - 10,
            height: window.innerHeight - 3,
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 0 },
                    debug: true,
                },
            },
            scene: {
                preload,
                create,
                update,
            },
        };

        const game = new Phaser.Game(config);
        let player, smallFishGroup, shark, score = 0, scoreText, background, clickToStart;
        let fishCount = 0;
        const maxFishCount = 20;
        let isPlaying = false;

        function preload() {
            this.load.image('player', 'assets/fish_user_close.png');
            this.load.image('smallFish', 'assets/fish_prey.png');
            this.load.image('shark', 'assets/fish_predator_close.png');
            this.load.image('background', 'assets/bg.png');
        }

        function create() {
            background = this.add.image(0, 0, 'background').setOrigin(0, 0);
            background.setDisplaySize(window.innerWidth, window.innerHeight);

            player = this.physics.add.sprite(window.innerWidth / 2, window.innerHeight / 2, 'player')
                .setCollideWorldBounds(true)
                .setScale(0.1)
                .setCircle(320);
            player.body.offset.x = 400;

            smallFishGroup = this.physics.add.group();
            shark = this.physics.add.sprite(window.innerWidth, window.innerHeight / 2, 'shark')
                .setCollideWorldBounds(true)
                .setScale(0.11)
                .setCircle(450);
            shark.body.offset.x = 400;
            shark.body.offset.y = 350;
            // .setBodySize(0, 100);

            scoreText = this.add.text(50, 50, 'Score: 0', { fontSize: '32px', fill: '#000000' });

            shark.setVisible(false);

            clickToStart = this.add.text(window.innerWidth / 2, window.innerHeight / 2, 'Click to Play', {
                fontSize: '48px',
                fill: '#000',
            }).setOrigin(0.5)
                .setInteractive()
                .on('pointerdown', () => {
                    if (isPlaying == true) return;

                    isPlaying = true;
                    player.setVisible(true);
                    shark.setVisible(true);
                    score = 0;
                    scoreText.setText('Score: ' + score);
                    spawnFish();
                    spawnFish();
                    spawnFish();

                    this.time.addEvent({
                        delay: 1000,
                        callback: spawnFish,
                        callbackScope: this,
                        loop: true,
                    });
                });

            this.physics.add.overlap(player, smallFishGroup, eatFish, null, this);
            this.physics.add.overlap(player, shark, hitShark, null, this);

            // self.physics.world.setBoundsCollision(true, true, true, true);
        }

        function update() {
            if (isPlaying) {
                handlePlayerMovement.call(this);
                // updateSharkDirection.call(this);

                clickToStart.setText("");

                const sharkSpeed = 80;

                const angleToPlayer = Phaser.Math.Angle.Between(shark.x, shark.y, player.x, player.y);

                if (Phaser.Math.RadToDeg(angleToPlayer) > -90 && Phaser.Math.RadToDeg(angleToPlayer) <= 90) {
                    shark.flipX = false;
                    // console.log("flip");
                    shark.setAngle(Phaser.Math.RadToDeg(angleToPlayer)); // Face the player
                } else {
                    shark.flipX = true;
                    // console.log("non flip")
                    shark.setAngle(Phaser.Math.RadToDeg(angleToPlayer) - 180); // Face the player
                }

                // console.log(Phaser.Math.RadToDeg(angleToPlayer))

                this.physics.moveToObject(shark, player, sharkSpeed);
            }
        }

        function handlePlayerMovement() {
            const cursors = this.input.keyboard.createCursorKeys();
            const wKey = this.input.keyboard.addKey("W");
            const aKey = this.input.keyboard.addKey("A");
            const sKey = this.input.keyboard.addKey("S");
            const dKey = this.input.keyboard.addKey("D");
            const playerSpeed = 160;

            player.setVelocity(0); // Reset velocity
            player.setAngle(0);

            const left = cursors.left.isDown || aKey.isDown;
            const right = cursors.right.isDown || dKey.isDown;
            const up = cursors.up.isDown || wKey.isDown;
            const down = cursors.down.isDown || sKey.isDown;

            if (left && up) {
                player.setAngle(45);
                player.body.offset.x = 50;
                player.body.offset.y = -150;
                player.flipX = true;

                player.setVelocityX(-playerSpeed / 1.75);
                player.setVelocityY(-playerSpeed / 1.75);

            } else if (left && down) {
                player.setAngle(-45);
                player.body.offset.x = 50;
                player.body.offset.y = 150;
                player.flipX = true;

                player.setVelocityX(-playerSpeed / 1.75);
                player.setVelocityY(playerSpeed / 1.75);
            } else if (right && up) {
                player.setAngle(-45);
                player.body.offset.x = 350;
                player.body.offset.y = -100;
                player.flipX = false;

                player.setVelocityX(playerSpeed / 1.75);
                player.setVelocityY(-playerSpeed / 1.75);
            } else if (right && down) {
                player.setAngle(45);
                player.body.offset.x = 350;
                player.body.offset.y = 100;
                player.flipX = false;

                player.setVelocityX(playerSpeed / 1.75);
                player.setVelocityY(playerSpeed / 1.75);
            } else if (up) {
                player.setVelocityY(-playerSpeed);
            } else if (down) {
                player.setVelocityY(playerSpeed);
            } else if (left) {
                player.setVelocityX(-playerSpeed);
                // player.setAngle(-180); // Face left
                player.flipX = true;
                player.setAngle(0);
                player.body.offset.x = 0;
                player.body.offset.y = 0;
            } else if (right) {
                player.setVelocityX(playerSpeed);
                // player.setAngle(0); // Face right
                player.flipX = false;
                player.setAngle(0);
                player.body.offset.x = 400;
                player.body.offset.y = 0;
            }

            if ((up || down) && !(left || right)) {
                if (player.flipX) {
                    player.body.offset.x = 0;
                    player.body.offset.y = 0;
                } else {
                    player.body.offset.x = 400;
                    player.body.offset.y = 0;
                }
            }
        }

        function spawnFish() {
            if (fishCount < maxFishCount) {
                const fish = smallFishGroup.create(Phaser.Math.Between(0, window.innerWidth),
                    Phaser.Math.Between(0, window.innerHeight), 'smallFish');
                fish.setBounceY(Phaser.Math.FloatBetween(0.7, 1)).setBounceX(Phaser.Math.FloatBetween(0.7, 1)).setScale(0.1);
                fish.setRandomPosition(100, 100, window.innerWidth - 100, window.innerHeight - 100);
                fishCount++;

                fish.body.collideWorldBounds = true;
                fish.body.onWorldBounds = true;

                moveFish.call(this, fish);
            }
        }

        async function moveFish(fish) {
            const randomAngle = Phaser.Math.FloatBetween(0, 360);
            const speed = Phaser.Math.FloatBetween(50, 100);

            fish.setVelocity(
                Math.cos(Phaser.Math.DegToRad(randomAngle)) * speed,
                Math.sin(Phaser.Math.DegToRad(randomAngle)) * speed
            );

            // Check boundaries and reverse direction if necessary
            const checkBounds = () => {
                const screenBounds = {
                    left: 0,
                    right: window.innerWidth,
                    top: 0,
                    bottom: window.innerHeight,
                };

                // Reverse direction if out of bounds
                if (fish.x < screenBounds.left || fish.x > screenBounds.right) {
                    fish.setVelocityX(-fish.body.velocity.x);
                }
                if (fish.y < screenBounds.top || fish.y > screenBounds.bottom) {
                    fish.setVelocityY(-fish.body.velocity.y);
                }

                // Continue moving fish
                moveFish(fish); // Call moveFish again for continuous movement
            };

            // Change direction randomly every 2 seconds
            // this.time.addEvent({
            //     delay: 2000,
            //     callback: checkBounds,
            //     callbackScope: this,
            //     loop: false,
            // });
        }


        function eatFish(player, fish) {
            fish.destroy();
            score++;
            scoreText.setText('Score: ' + score);
            fishCount--;
        }

        function hitShark() {
            scoreText.setText('Game Over! Final Score: ' + score + '\nClick to Restart');
            this.physics.pause(); // Pause the game

            // Clear any existing pointerdown events to avoid multiple bindings
            this.input.off('pointerdown');

            // Restart the game on pointer down
            this.input.on('pointerdown', () => {
                this.scene.restart();
                score = 0;
                scoreText.setText('Score: ' + score);
                isPlaying = false; // Reset the game state
                clickToStart.setText('Click to Play'); // Reset the start text
            });
        }

        const resizeGame = () => {
            game.scale.resize(window.innerWidth, window.innerHeight);
            background.setDisplaySize(window.innerWidth, window.innerHeight);
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
