import { Container, Graphics } from "pixi.js";
import ReelStripView from "./reelStripView";

class ReelView extends Container {
    constructor() {
        super();
        this.reelsArray = [];
        this.currentReel = 0;
        this.startedReels = 0;
        this.stoppedReels = 0;
        this.spinResultReceived = false;
        this.allReelsSpinning = false;

        this.spinStartTime = 0;

        this.config = {
            numberOfReels: 5,
            viewConfig: {
                reelFrame: {
                    // image: reelFrame
                },
                reelContainer: {
                    // mask: reelMask
                },
                reelMask: {
                    y: 55,
                    width: 770,
                    height: 430,
                    color: 0xffffff,
                    alpha: 0.5
                }
            },
            reelPositions: [
                {
                    "x": 0,
                    "y": 0
                },
                {
                    "x": 150,
                    "y": 0
                },
                {
                    "x": 300,
                    "y": 0
                },
                {
                    "x": 450,
                    "y": 0
                },
                {
                    "x": 600,
                    "y": 0
                }
            ],
            reelSpinStartGap: 150,
            reelSpinStopGap: 200,
            symbolsInReel: 3,
            defaultSymbols: [
                [2, 1, 3],
                [4, 5, 5],
                [2, 1, 3],
                [5, 2, 6],
                [4, 1, 1]
            ],
        },
        this.createView();
        window.addEventListener('resize', this.resize.bind(this)); // Call on resize

    }

    createView() {
        for (let i = 0; i < this.config.numberOfReels; i++) {
            let reelStrip = new ReelStripView(i);
            reelStrip.setReelView(this);
            reelStrip.x = this.config.reelPositions[i].x;
            reelStrip.y = this.config.reelPositions[i].y;
            this.addChild(reelStrip);
            this.reelsArray.push(reelStrip);
        }

        this.pivot.set(this.width / 2, this.height / 2);
        this.scale.set(0.5);
        this.resize();
        let graphics = new Graphics();
        graphics.rect(0, 150, 750, 450);
        graphics.fill(0xde3249);
        this.addChild(graphics);
        this.mask = graphics;
    }

    resize() {
        this.position.set(window.innerWidth / 2, window.innerHeight / 2);
    }

    spinReel() {
        this.currentReel = 0;
        this.startedReels = 0;
        this.allReelsSpinning = false;
        this.spinStartTime = Date.now();
        this.initiateReelSpin();
    }

    initiateReelSpin() {
        if (this.currentReel < this.config.numberOfReels) {
            this.reelsArray[this.currentReel].startReelSpin();
            this.currentReel++;

            if (this.currentReel < this.config.numberOfReels) {
                let reelSpinStartGap = this.config.reelSpinStartGap;
                setTimeout(this.initiateReelSpin.bind(this), reelSpinStartGap);
            }
        }
    }

    reelStarted() {
        this.startedReels++;
        if (this.startedReels === this.config.numberOfReels) {
            this.allReelsSpinning = true;
            this.checkToStartReelStop();
        }
    }

    checkToStartReelStop() {
        if (this.allReelsSpinning) {
            this.currentReel = 0;
            this.stoppedReels = 0;

            let resultDelay = 3000;
            let elapsedTime = Date.now() - this.spinStartTime;
            let stopDuration = this.config.reelSpinStopGap * this.config.numberOfReels;
            let timeToWait = Math.max(resultDelay - (elapsedTime + stopDuration), 0);

            setTimeout(this.initiateReelStop.bind(this), timeToWait);
        }
    }

    initiateReelStop() {
        this.finalSymbols = [
            [
                5,
                1,
                2
            ],
            [
                2,
                4,
                5
            ],
            [
                4,
                5,
                0
            ],
            [
                2,
                0,
                1
            ],
            [
                3,
                2,
                4
            ]
        ]
        if (this.currentReel < this.config.numberOfReels) {
            this.reelsArray[this.currentReel].stopReelSpin(this.finalSymbols[this.currentReel]);
            this.currentReel++;

            if (this.currentReel < this.config.numberOfReels) {
                let reelSpinStopGap = this.config.reelSpinStopGap;
                setTimeout(this.initiateReelStop.bind(this), reelSpinStopGap);
            }
        }
    }

}

export default ReelView;