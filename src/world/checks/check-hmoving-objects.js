import { Animator, AnimatorMode } from '../../graphic/animator'

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

export class CheckHMovingObjects {
  constructor({ player, limitRect, createObjectCallback }) {
    this.player = player
    this.limitRect = limitRect
    this.createObjectCallback = createObjectCallback

    this.objects = []
  }

  fire() {
    const { object, frames, delay } = this.createObjectCallback(this.player)
    frames.flipped = object.directionX < 0

    const animator = new Animator(frames, delay, AnimatorMode.loop)
    animator.animation.setXY(object.x, object.y)
    const objectWithRef = { ...object, ref: animator }
    const proxy = new Proxy(objectWithRef, proxyHandler)

    this.objects.push(proxy)
  }

  update() {
    this.objects.forEach(object => {
      object.oldX = object.x
      object.oldY = object.y
      object.x = object.x + (object.speed * object.directionX)
      object.ref.animate()
    })
    this.objects = this.objects.filter(object => {
      return (object.x + object.width) >= 0 && object.x <= this.limitRect.width
    })
  }
}