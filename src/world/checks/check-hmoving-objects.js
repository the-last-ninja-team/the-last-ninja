import { Animator, AnimatorMode } from '#graphic/animator'

const proxyHandler = {
  set(target, propKey, value) {
    switch (propKey) {
      case 'x':
        target.ref.animation.x = value
        break
      case 'y':
        target.ref.animation.y = value
        break
    }

    target[propKey] = value

    return true
  },
  // get(target, propKey) {
  //   if (typeof target[propKey] === 'function') {
  //     return new Proxy(target[propKey], {
  //       apply(applyTarget, thisArg, args) {
  //         const result = Reflect.apply(applyTarget, thisArg, args)
  //         if (propKey === 'update') {
  //           target.ref.animate()
  //         }
  //         return result
  //       }
  //     })
  //   }
  //
  //   return target[propKey]
  // }
}

export class CheckHMovingObjects {
  constructor({ player, limitRect, createObjectCallback }) {
    this.player = player
    this.limitRect = limitRect
    this.createObjectCallback = createObjectCallback

    this.objects = []
    this.fire = this.fire.bind(this)
    this.getPosition = this.getPosition.bind(this)
    this.applyPosition = this.applyPosition.bind(this)
  }

  fire() {
    const { object, frames, delay } = this.createObjectCallback(this.player)
    frames.flipped = object.directionX < 0

    const animator = new Animator(frames, delay, AnimatorMode.loop)
    animator.animation.setXY(object.x, object.y)
    object.ref = animator

    const proxy = new Proxy(object, proxyHandler)
    this.objects.push(proxy)

    return proxy
  }

  getPosition(object) {
    return {
      y: object.y,
      x: object.x + (object.speed * object.directionX)
    }
  }

  applyPosition(object, position) {
    object.y = position.y
    object.x = position.x

    object.ref.animate()
  }
}