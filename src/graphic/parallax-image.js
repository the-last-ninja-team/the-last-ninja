import { Sprite } from './sprite'

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
    this.sprites = []

    const counts = Math.floor(screenWidth / (width + space)) + 2

    let x = 0
    for (let i = 0; i < counts; i ++) {
      this.sprites.push(this.createSprite(x))
      x += width + space
    }
  }

  createSprite(x) {
    return new Sprite({
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
    this.sprites.forEach(image => {
      const x = image.x + (this.direction === ParallaxDirection.forward ? -this.step : this.step)
      image.setXY(Math.round(x), this.y)
    })

    const first = this.sprites[0]
    const last = this.sprites[this.sprites.length - 1]
    const others = this.sprites.filter((_, index) => index > 0 && index < this.sprites.length - 1)

    if (this.direction === ParallaxDirection.forward && (first.x + first.width + this.space <= 0)) {
      first.setXY(last.x + last.width + this.space, this.y)
      this.sprites = [...others, last, first]
    } else if (this.direction === ParallaxDirection.backward && (first.x >= 0)) {
      last.setXY(-((last.width + this.space) - first.x), this.y)
      this.sprites = [last, first, ...others]
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