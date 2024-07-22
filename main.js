import * as PIXI from 'pixi.js';
import './style.css';
import manifest from './manifest.json'
import ReelView from './src/reelView';


function render(app) {
  document.body.appendChild(app.canvas);
  window.PIXIApp = PIXI;
  window.gameApp = app.stage;
  globalThis.__PIXI_APP__ = app;
}

window.onload = async() => {
  const app = new PIXI.Application();
  await app.init({ background: '#ffffff', resizeTo: window });

  render(app);
  initAssets();
}


export async function initAssets() {

  const assetsManifest = manifest;
  await PIXI.Assets.init({ manifest: assetsManifest});
  PIXI.Assets.loadBundle(['game-screen'], (progress) => {
    if(progress === 1){
      setTimeout(() => {
        createGame();
      }, 0);
    }
  });

}


function createGame(){
    let reelView = new ReelView();
    gameApp.addChild(reelView);
    const spinBtn = PIXI.Sprite.from(PIXI.Assets.cache.get('spin_button'));
    gameApp.addChild(spinBtn);
    spinBtn.scale.set(0.3);
    spinBtn.anchor.set(0.5, 1);
    spinBtn.eventMode = 'static';
    spinBtn.cursor = 'pointer'
    spinBtn.on('click', ()=> {
      if(!reelView?.allReelsSpinning){
        reelView.allReelsSpinning = true;
        reelView.spinReel();
      }
    })

    resize();
    window.addEventListener('resize', resize); // Call on resize



    function resize(){
      spinBtn.position.set(window.innerWidth / 2, window.innerHeight);
    }
}
