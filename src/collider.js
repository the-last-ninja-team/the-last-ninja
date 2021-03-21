export class Collider {
  constructor() {
    //
  }

  init(limitRect, collisionObjects, tileMap) {
    this.limitRect = limitRect
    this.collisionObjects = collisionObjects
    this.tileMap = tileMap
  }

  collide(mob) {
    if (mob.getLeft() < 0) {
      mob.setLeft(0)
      mob.velocityX = 0
    } else if (mob.getRight() > this.limitRect.width) {
      mob.setRight(this.limitRect.width)
      mob.velocityX = 0
    }

    // Пока не ограничиваем выход за границы по Y оси
    // if (mob.getTop() < 0) {
    //   mob.setTop(0)
    //   mob.velocityY = 0
    // } else if (mob.getBottom() > this.limitRect.height) {
    //   mob.setBottom(this.limitRect.height)
    //   mob.velocityY = 0
    //   mob.jumping = false
    // }

    return []
  }

  applyPosition(mob) {
    mob.x += mob.velocityX
    mob.y += mob.velocityY
  }

  updatePosition(mob, gravity, friction) {
    mob.velocityY += gravity
    mob.velocityX *= mob.crouching ? friction + 0.08 : friction

    /* Made it so that velocity cannot exceed velocity_max */
    if (Math.abs(mob.velocityX) > mob.velocityMax) {
      mob.velocityX = mob.velocityMax * Math.sign(mob.velocityX)
    }

    if (Math.abs(mob.velocityY) > mob.velocityMax) {
      mob.velocityY = mob.velocityMax * Math.sign(mob.velocityY)
    }
  }

  check(mob, gravity, friction) {
    this.updatePosition(mob, gravity, friction)
    this.applyPosition(mob)
    return this.collide(mob)
  }
}