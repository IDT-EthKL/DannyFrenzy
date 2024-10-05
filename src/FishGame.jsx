import React, { useEffect, useState, useCallback, useRef } from 'react';
import Phaser from 'phaser';
import { useContract, useContractWrite, useAddress } from "@thirdweb-dev/react";
import { FISH_GAME_ADDRESS, REWARD_TOKEN_ADDRESS, FISH_NFT_ADDRESS } from './config';
import FISH_GAME_ABI from './abis/CrossChainFishGame.json';
import REWARD_TOKEN_ABI from './abis/ERC20ScrollAbi.json';
import FISH_NFT_ABI from './abis/ERC721ScrollAbi.json';

const FishGame = () => {
    const [game, setGame] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const address = useAddress();
    const scoreRef = useRef(0);

    const { contract: gameContract } = useContract(FISH_GAME_ADDRESS, FISH_GAME_ABI);
    const { contract: tokenContract } = useContract(REWARD_TOKEN_ADDRESS, REWARD_TOKEN_ABI);
    const { contract: nftContract } = useContract(FISH_NFT_ADDRESS, FISH_NFT_ABI);

    const { mutateAsync: mintReward } = useContractWrite(tokenContract, "mintReward");
    const { mutateAsync: mintNFT } = useContractWrite(nftContract, "mintFishNFT");

    const claimRewards = useCallback(async () => {
        if (!address) {
            setErrorMessage("Please connect your wallet to claim rewards.");
            return;
        }
        try {
            const tx = await mintReward({ args: [address, scoreRef.current] });
            console.log("Reward claimed:", tx);
            setErrorMessage("Rewards claimed successfully!");
        } catch (error) {
            console.error("Error claiming reward:", error);
            setErrorMessage("Failed to claim reward. Please try again.");
        }
    }, [mintReward, address]);

    const mintFishNFT = useCallback(async () => {
        if (!address) {
            setErrorMessage("Please connect your wallet to mint NFT.");
            return;
        }
        try {
            const tx = await mintNFT({ args: [address, scoreRef.current] });
            console.log("NFT minted:", tx);
            setErrorMessage("NFT minted successfully!");
        } catch (error) {
            console.error("Error minting NFT:", error);
            setErrorMessage("Failed to mint NFT. Please try again.");
        }
    }, [mintNFT, address]);

    useEffect(() => {
        class MainScene extends Phaser.Scene {
            constructor() {
                super('MainScene');
            }

            preload() {
                this.load.image('player', 'assets/fish_user_close.png');
                this.load.image('smallFish', 'assets/fish_prey.png');
                this.load.image('shark', 'assets/fish_predator_close.png');
                this.load.image('background', 'assets/bg.png');
            }
            create() {
                this.background = this.add.image(0, 0, 'background').setOrigin(0, 0);
                this.background.setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);

                this.player = this.physics.add.sprite(400, 300, 'player')
                    .setCollideWorldBounds(true)
                    .setScale(0.1)
                    .setCircle(320);
                this.player.body.offset.x = 400;

                this.smallFishGroup = this.physics.add.group();
                this.shark = this.physics.add.sprite(800, 300, 'shark')
                    .setCollideWorldBounds(true)
                    .setScale(0.11)
                    .setCircle(450);
                this.shark.body.offset.x = 400;
                this.shark.body.offset.y = 350;

                this.scoreText = this.add.text(50, 50, 'Score: 0', { fontSize: '32px', fill: '#000000' });

                this.shark.setVisible(false);

                this.clickToStart = this.add.text(400, 300, 'Click to Play', {
                    fontSize: '48px',
                    fill: '#000',
                }).setOrigin(0.5)
                    .setInteractive()
                    .on('pointerdown', () => {
                        this.clickToStart.setVisible(false);
                        this.player.setVisible(true);
                        this.shark.setVisible(true);
                        this.spawnFish();
                        this.time.addEvent({
                            delay: 2000,
                            callback: this.spawnFish,
                            callbackScope: this,
                            loop: true
                        });
                    });

                this.physics.add.overlap(this.player, this.smallFishGroup, this.eatFish, null, this);
                this.physics.add.overlap(this.player, this.shark, this.hitShark, null, this);

                this.cursors = this.input.keyboard.createCursorKeys();
            }

            update() {
                if (this.clickToStart.visible) return;

                const speed = 200;
                if (this.cursors.left.isDown) {
                    this.player.setVelocityX(-speed);
                } else if (this.cursors.right.isDown) {
                    this.player.setVelocityX(speed);
                } else {
                    this.player.setVelocityX(0);
                }

                if (this.cursors.up.isDown) {
                    this.player.setVelocityY(-speed);
                } else if (this.cursors.down.isDown) {
                    this.player.setVelocityY(speed);
                } else {
                    this.player.setVelocityY(0);
                }

                // Move shark towards player
                const angle = Phaser.Math.Angle.Between(this.shark.x, this.shark.y, this.player.x, this.player.y);
                this.physics.moveToObject(this.shark, this.player, 100);
            }

            spawnFish() {
                const x = Phaser.Math.Between(0, this.sys.game.config.width);
                const y = Phaser.Math.Between(0, this.sys.game.config.height);
                const fish = this.smallFishGroup.create(x, y, 'smallFish').setScale(0.1);
                fish.setCollideWorldBounds(true);
                this.moveFish(fish);
            }

            moveFish(fish) {
                const randomAngle = Phaser.Math.FloatBetween(0, 360);
                const speed = Phaser.Math.FloatBetween(50, 100);
                fish.setVelocity(
                    Math.cos(Phaser.Math.DegToRad(randomAngle)) * speed,
                    Math.sin(Phaser.Math.DegToRad(randomAngle)) * speed
                );
            }

            eatFish(player, fish) {
                fish.destroy();
                scoreRef.current += 1;
                this.scoreText.setText('Score: ' + scoreRef.current);
            }

            hitShark() {
                scoreRef.current = 0;
                this.scene.restart();
            }
        }

        const config = {
            type: Phaser.AUTO,
            width: window.innerWidth - 10,
            height: window.innerHeight - 3,
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 0 },
                    debug: false,
                },
            },
            scene: MainScene
        };

        const newGame = new Phaser.Game(config);
        setGame(newGame);

        return () => {
            newGame.destroy(true);
        };
    }, []);

    return (
        <div id="game-container">
            <div style={{ position: 'absolute', top: 10, left: 10, color: 'white', fontSize: '24px', backgroundColor: 'rgba(0,0,0,0.5)', padding: '10px' }}>
                Score: {scoreRef.current}
                <button onClick={claimRewards} style={{ marginLeft: '10px' }}>Claim Rewards</button>
                <button onClick={mintFishNFT} style={{ marginLeft: '10px' }}>Mint Fish NFT</button>
                {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
            </div>
        </div>
    );
};

export default FishGame;