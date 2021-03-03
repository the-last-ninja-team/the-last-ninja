import { SpriteSheet } from './sprite-sheet'
import { Animator, AnimatorMode } from './animator'

const proxyHandler = {
  set(target, prop, val) {
    switch (prop) {
      case 'x':
        target.ref.animation.x = val
        break
      case 'y':
        target.ref.animation.y = val
        break
    }

    target[prop] = val

    return true
  }
}

export class StaticMapAnimation {
  constructor(points, tileProps, { frames, delay }) {
    const tiles = new SpriteSheet(tileProps)
    this.points = []
    this.objects = []

    points.forEach(point => {
      const animationFrames = tiles.getAnimationFrames(...frames)
      animationFrames.setXY(point.x, point.y)
      animationFrames.imageWidth = point.width
      animationFrames.imageHeight = point.height

      const index = Math.floor(Math.random() * frames.length)

      const object = new Animator(animationFrames, delay, AnimatorMode.loop)
      object.frameIndex = index

      const pointWithRef = { ...point, ref: object }
      const proxy = new Proxy(pointWithRef, proxyHandler)

      this.points.push(proxy)
      this.objects.push(object)
    })
  }

  removePoints(...pointsToRemove) {
    const objectsToRemove = pointsToRemove.map(point => point.ref)

    this.objects = this.objects.filter(object => {
      return !objectsToRemove.find(toRemove => toRemove === object)
    })

    this.points = this.points.filter(point => {
      return !pointsToRemove.find(toRemove => toRemove === point)
    })
  }

  update() {
    this.objects.forEach(object => object.animate())
  }
}