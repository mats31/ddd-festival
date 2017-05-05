/* global TweenLite */
import Controls from './Controls';
import Webgl from './Webgl';
import raf from 'raf';
import dat from 'dat-gui';
import sono from 'sono';
import 'gsap';

let webgl;
let controls;
let gui;
let soundState = false;
let waitForReset = false;
const outro = document.querySelector('.js-outro');

// webgl settings
webgl = new Webgl( window.innerWidth, window.innerHeight );
document.body.appendChild( webgl.renderer.domElement );

controls = new Controls({
  el: document.querySelector('.js-controls'),
});

// GUI settings
// gui = new dat.GUI();

const sound = sono.create({
  id: 'skyfall',
  url: ['audios/skyfall.mp3'],
  loop: true,
  volume: 0.5,
});

function activateSound(activate) {

  if (activate) {

    soundState = true;
    sound.play();
    controls.sound.className = 'js-controls__sound controls__sound is--active';
  } else {

    soundState = false;
    sound.pause();
    controls.sound.className = 'js-controls__sound controls__sound';
  }
}

function reset() {

  outro.style.display = 'block';

  TweenLite.killTweensOf(outro);
  TweenLite.to(
    outro,
    2,
    {
      autoAlpha: 1,
      ease: 'Power2.easeIn',
    }
  );

  waitForReset = true;
}

function resizeHandler() {
  webgl.resize( window.innerWidth, window.innerHeight );
  controls.resize( window.innerWidth, window.innerHeight );
}

function animate() {
  raf( animate );

  webgl.render();

  if (webgl.readyToReset && !waitForReset ) {
    reset();
  }

  const value = webgl.getIndex() / webgl.getMeshesLength() + webgl.getCurrentAverage() / webgl.getMeshesLength();
  controls.update(value);
}

controls.sound.addEventListener('click', () => {

  if (soundState) {

    activateSound(false);
  } else {

    activateSound(true);
  }
});

document.querySelector('.js-outro__replay').addEventListener('click', () => {

  webgl.resetWebgl();

  TweenLite.killTweensOf(outro);
  TweenLite.to(
    outro,
    2,
    {
      autoAlpha: 0,
      ease: 'Power2.easeIn',
      onComplete: () => {
        outro.style.display = 'none';
        waitForReset = false;
      },
    }
  );
});

// handle resize
window.addEventListener( 'resize', resizeHandler );

// let's play !
animate();

activateSound(true);
