import { Container } from "pixi.js";
import ReelSlotSymbol from "./reelSlotSymbol";

class ReelStripView extends Container{
    constructor(reelIndex){
        super();
        this.config = {
            symbolsInReel: 3,
            symbolGapY: 150,
            symbolsInGame: 6,
            minSpinSpeed: 5,
            maxSpinSpeed: 40,
            acceleration: 1,
            duration:0.001,
        };
        this.symbolsList = [];
        this.reelStripData = [];
        this.spinState = 'IDLE';
        this.reelView = null;
        this.currentSymbolIndex = 0;
        this.finalSymbolsList = [];
        this.reelIndex = reelIndex;
    
        this.createView();
    }

    createView(){
        for(let i = 0; i < this.config.symbolsInReel + 2; i++) {
            let symbol = this.getSymbol(this.getRandomNumber());
            symbol.y = (i - 1) * this.config.symbolGapY;
            symbol.scale.set(0.5);
            this.addChild(symbol);
            this.symbolsList.push(symbol);
        }
    }

    getSymbol (symbolNumber) {
        return new ReelSlotSymbol(symbolNumber);
    }

    setReelView (view) {
        this.reelView = view;
    }

    getRandomNumber () {
        return Math.floor(Math.random() * 7);
    }

    startReelSpin () {
        this.currentTimeStamp = null;
        this.spinSpeed = this.config.minSpinSpeed;
        this.loopId = requestAnimationFrame(this.refreshViewTick.bind(this));
        this.ReelStart();
    }

    ReelStart () {
        this.spinState = 'SPINNING';
        setTimeout(() => {
            this.reelView.reelStarted();
        }, 200);
    }

    refreshViewTick (timeStamp) {
        timeStamp /= 10;
        if(this.currentTimeStamp === null) {
            this.currentTimeStamp = timeStamp;
        }
        this.loopId = requestAnimationFrame(this.refreshViewTick.bind(this));
    
        if(this.spinState === 'SPINNING') {
            this.doSpinning(timeStamp);
        } else if(this.spinState === 'SETFINALSYMBOLS') {
            this.setFinalSymbols(timeStamp);
        }
    
        this.currentTimeStamp = timeStamp;
    }

    doSpinning (timeStamp) {
        let maxSpinSpeed = this.config.maxSpinSpeed;
        let acceleration = this.config.acceleration;
        let timeDiff = Math.min(timeStamp - this.currentTimeStamp, 3.2);
        if(this.spinSpeed < maxSpinSpeed) {
            this.spinSpeed += acceleration * timeDiff;
            this.spinSpeed = Math.min(maxSpinSpeed, this.spinSpeed);
        }
        let incrementY = (this.spinSpeed * timeDiff);
        this.moveSymbols(incrementY);
    
        let topSymbol = this.symbolsList[0];
        if(topSymbol.y >= 0) {
            let bottomSymbol = this.symbolsList.pop();
            bottomSymbol.y = topSymbol.y - this.config.symbolGapY
            this.currentSymbolIndex = (this.currentSymbolIndex + 1) % this.reelStripData.length;
            let symbolNumber = this.getRandomNumber();
            bottomSymbol.swapSymbolTexture(symbolNumber);
            this.symbolsList.unshift(bottomSymbol);
        }
    }

    moveSymbols (incrementY) {
        for(let i = 0; i < this.symbolsList.length; i++) {
            let currentSymbol = this.symbolsList[i];
            currentSymbol.y = currentSymbol.y + incrementY;
        }
    }

    stopReelSpin (finalSymbolsList) {
        this.finalSymbolsSetCount = 0;
        this.finalSymbolsList = finalSymbolsList;
        this.finalSymbolsList.push(Math.floor(Math.random() * (this.config.symbolsInGame)));
        this.finalSymbolsList.splice(0, 0, Math.floor(Math.random() * (this.config.symbolsInGame)));
        this.spinState = 'SETFINALSYMBOLS';
    }

    setFinalSymbols (timeStamp) {
        if(this.finalSymbolsSetCount < this.finalSymbolsList.length) {
            let timeDiff = Math.min(timeStamp - this.currentTimeStamp, 3.2);    // Limit to minimum 30 FPS
            let incrementY = this.spinSpeed * timeDiff;
            this.moveSymbols(incrementY);
    
            let topSymbol = this.symbolsList[0];
            if (topSymbol.y >= 0) {
                let bottomSymbol = this.symbolsList.pop();
                bottomSymbol.y = topSymbol.y - this.config.symbolGapY;
                let symbolNumber = this.finalSymbolsList[this.finalSymbolsList.length - this.finalSymbolsSetCount - 1];
                bottomSymbol.swapSymbolTexture(symbolNumber);
                this.symbolsList.unshift(bottomSymbol);
                this.finalSymbolsSetCount++;
            }
        } else {
            cancelAnimationFrame(this.loopId);
            this.ReelStop();
        }
    }

    ReelStop () {
        for(let i = 0; i < this.symbolsList.length; i++) {
            let currentSymbol = this.symbolsList[i];
            currentSymbol.y = i * this.config.symbolGapY;
        }
        setTimeout(() => {
            this.reelView.allReelsSpinning = false;
        }, 1000);
    }
}

export default ReelStripView;