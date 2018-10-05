import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'anim-weather',
  templateUrl: './anim-weather.component.html',
  styleUrls: ['./anim-weather.component.scss']
})
export class AnimWeatherComponent implements OnInit {

  public lottieConfig: Object;
  private anim: any;
  private animationSpeed: number = 1;

  constructor() {
      this.lottieConfig = {
          path: 'assets/cloud_loader_v1.json',
          renderer: 'canvas',
          autoplay: true,
          loop: true
      };
  }

  handleAnimation(anim: any) {
      this.anim = anim;
  }

  stop() {
      this.anim.stop();
  }

  play() {
      this.anim.play();
  }

  pause() {
      this.anim.pause();
  }

  setSpeed(speed: number) {
      this.animationSpeed = speed;
      this.anim.setSpeed(speed);
  }

  ngOnInit() {
    this.setSpeed(1);
    this.play();
  }

}
