import { Img } from './img'

export const ParallaxDirection = {
  forward: 'forward',
  backward: 'backward'
}

export const ParallaxType = {
  custom: 'custom',
  delay: 'delay'
}

export class ParallaxImage {
  constructor({ name, y = 0, screenWidth, width, height, delay = 10, step = 0,
                direction = ParallaxDirection.forward, type = ParallaxType.delay,
                autorun = false, space = 0 }) {

    this.name = name
    this.y = y
    this.baseWidth = width
    this.baseHeight = height
    this.step = step
    this.delay = delay
    this.running = autorun
    this.direction = direction
    this.type = type
    this.space = space
    this.count = 0
    this.images = []

    const counts = Math.floor(screenWidth / (width + space)) + 2

    let x = 0
    for (let i = 0; i < counts; i ++) {
      this.images.push(this.createImage(x))
      x += width + space
    }
  }

  createImage(x) {
    return new Img({
      name: this.name,
      x,
      y: this.y,
      width: this.baseWidth,
      height: this.baseHeight
    })
  }

  run(direction = ParallaxDirection.forward, step) {
    this.step = step ?? this.step
    this.direction = direction
    this.running = true
  }

  stop() {
    this.running = false
  }

  nextFrame() {
    this.images.forEach(image => {
      const x = image.x + (this.direction === ParallaxDirection.forward ? -this.step : this.step)
      image.setXY(Math.round(x), this.y)
    })

    const first = this.images[0]
    const last = this.images[this.images.length - 1]
    const others = this.images.filter((_, index) => index > 0 && index < this.images.length - 1)

    if (this.direction === ParallaxDirection.forward && (first.x + first.width + this.space <= 0)) {
      first.setXY(last.x + last.width + this.space, this.y)
      this.images = [...others, last, first]
    } else if (this.direction === ParallaxDirection.backward && (first.x >= 0)) {
      last.setXY(-((last.width + this.space) - first.x), this.y)
      this.images = [last, first, ...others]
    }
  }

  update() {
    if (!this.running) {
      return
    }

    if (this.type === ParallaxType.delay) {
      this.count ++

      while(this.count > this.delay) {
        this.count -= this.delay
        this.nextFrame()
      }
    } else {
      this.nextFrame()
    }
  }
}