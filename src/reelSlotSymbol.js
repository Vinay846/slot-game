import { Assets, Sprite } from "pixi.js";

class ReelSlotSymbol extends Sprite{
    constructor(symbolName){
        super();
        this.symbol = symbolName
        this.createView();
    }
    
    createView(){
        this.texture = Assets.cache.get('symbol' + this.symbol);
    }

    swapSymbolTexture (symbolNumber) {
        this.symbolNumber = symbolNumber;
        this.texture = Assets.cache.get('symbol' + this.symbolNumber);
    }
}

export default ReelSlotSymbol;