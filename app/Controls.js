export default class Controls {

  // Setup ---------------------------------------------------------------------
  constructor(options) {

    this.el = options.el;
    this.timeline = this.el.querySelector('.js-controls__timeline');
    this.sound = this.el.querySelector('.js-controls__sound');
    this.loaded = false;
    this.startProgress = 0;
    this.progress = 0;

    this.setup();
  }

  setup() {

    this.loadAssets();
  }

  loadAssets() {

    this.disableTimeline = new Image();
    this.enableTimeline = new Image();

    this.disableTimeline.onload = () => {

      if (this.loaded) {

        this.setupCanvas();
      }

      this.loaded = true;
    }

    this.enableTimeline.onload = () => {

      if (this.loaded) {

        this.setupCanvas();
      }

      this.loaded = true;
    }


    this.disableTimeline.src = 'images/timeline_off.png';
    this.enableTimeline.src = 'images/timeline_on.png';
  }

  setupCanvas() {

    const strokeWidth = 1;

    this.canvas = document.createElement('canvas');
    this.canvas.width = this.timeline.offsetWidth;
    this.canvas.height = this.timeline.offsetHeight;
    this.timeline.appendChild( this.canvas );

    this.drawHeight = this.canvas.width * this.disableTimeline.height / this.disableTimeline.width;

    this.context = this.canvas.getContext('2d');
    // this.context.drawImage( this.disableTimeline, 0, 0, this.canvas.width, this.drawHeight );
    // this.context.drawImage( this.disableTimeline, 0, 0, this.disableTimeline.width, this.disableTimeline.height, 0, 0, this.canvas.width, this.drawHeight );
    // this.context.drawImage( this.enableTimeline, 0, 0, this.enableTimeline.width, this.enableTimeline.height, 0, 0, this.canvas.width, this.drawHeight );

    TweenLite.to(
      this,
      1.5,
      {
        delay: 7,
        startProgress: 1,
        ease: 'Power4.easeOut',
      }
    );

    TweenLite.to(
      this.sound,
      1.5,
      {
        delay: 8,
        autoAlpha: 1,
        ease: 'Power2.easeOut',
      }
    );
  }

  resize( width, height ) {

    this.canvas.width = this.timeline.offsetWidth;
    this.canvas.height = this.timeline.offsetHeight;

    if (this.loaded) {

      this.drawHeight = this.canvas.width * this.disableTimeline.height / this.disableTimeline.width;

      this.context.drawImage( this.disableTimeline, 0, 0, this.disableTimeline.width * this.progress, this.disableTimeline.height, 0, 0, this.canvas.width * this.progress, this.drawHeight );
      this.context.drawImage( this.enableTimeline, 0, 0, this.enableTimeline.width * this.progress, this.enableTimeline.height, 0, 0, this.canvas.width * this.progress, this.drawHeight );

    }
  }

  update(value) {

    if (this.loaded) {

      this.progress += ( value - this.progress ) * 0.025;

      // this.context.drawImage( this.enableTimeline, 0, 0, this.canvas.width * this.progress, this.drawHeight, 0, 0, this.canvas.width * this.progress, this.drawHeight );
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.context.drawImage( this.disableTimeline, 0, 0, this.disableTimeline.width * this.startProgress, this.disableTimeline.height, 0, 0, this.canvas.width * this.startProgress, this.drawHeight );
      this.context.drawImage( this.enableTimeline, 0, 0, this.enableTimeline.width * this.progress, this.enableTimeline.height, 0, 0, this.canvas.width * this.progress, this.drawHeight );
    }
  }
}
