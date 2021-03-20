import { ParallaxDirection } from '#graphic/parallax-image'

export class ParallaxAnimation {
  constructor({ parallax, camera, screenRect, cameraTrap, limitRect }) {
    this.parallax = parallax
    this.camera = camera

    this.screenRect = screenRect
    this.cameraTrap = cameraTrap
    this.limitRect = limitRect

    this.maxViewPortalX = this.limitRect.width - this.screenRect.width + this.cameraTrap.x + this.cameraTrap.width

    this.player = null
  }

  watch(player) {
    this.player = player
    this.parallax.step = player.speed
  }

  update() {
    if (this.player) {
      const x1 = this.cameraTrap.x + Math.round(this.camera.x) + 0.5
      const x2 = this.cameraTrap.x + Math.round(this.camera.x) + this.cameraTrap.width - 0.5
      const roundedVelocityX = Math.trunc(Math.abs(this.player.velocityX))

      if ((this.player.x > x1 && this.player.x + this.player.width < x2)
        || (this.player.x < this.cameraTrap.x)
        || (this.limitRect.width === this.screenRect.width)
        || (this.maxViewPortalX < (this.player.x + this.player.width))
        || roundedVelocityX === 0) {
        this.parallax.stop()
      } else {
        this.parallax.run(this.player.directionX < 0 ? ParallaxDirection.backward : ParallaxDirection.forward)
      }
    }
  }
}