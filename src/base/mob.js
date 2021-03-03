import { MovingObject } from './moving-object'

export class Mob extends MovingObject {
  constructor({ x, y, width, height, velocityMax, jumpPower = 20, speed = 0.55, hitBox }) {
    super(x, y, width, height, velocityMax)

    this.hitBox = hitBox
    this.originHitBox = hitBox

    this.originX = x
    this.originY = y

    this.jumpPower = jumpPower
    this.speed = speed
    this.directionX = 1
    this.jumping = true
    this.crouching = false
    this.idling = false
  }

  setHitBox(hitBox) {
    this.hitBox = hitBox
    return this
  }

  jump() {
    if (!this.jumping && this.velocityY < 10) {
      this.crouching = false
      this.jumping = true
      this.velocityY -= this.jumpPower
    }
  }

  moveLeft() {
    this.crouching = false
    this.directionX = -1
    this.velocityX -= this.speed
  }

  moveRight() {
    this.crouching = false
    this.directionX = 1
    this.velocityX += this.speed
  }

  crouch(crouching) {
    if (!this.jumping) {
      this.crouching = crouching
      if (!this.crouching) {
        this.hitBox = this.originHitBox
      } else {
        this.hitBox = {...this.originHitBox, height: this.originHitBox.height / 2}
      }
    }
  }

  updatePosition(gravity, friction) {
    this.oldX = this.x
    this.oldY = this.y

    this.velocityY += gravity
    this.velocityX *= this.crouching ? friction + 0.08 : friction

    /* Made it so that velocity cannot exceed velocity_max */
    if (Math.abs(this.velocityX) > this.velocityMax) {
      this.velocityX = this.velocityMax * Math.sign(this.velocityX)
    }

    if (Math.abs(this.velocityY) > this.velocityMax) {
      this.velocityY = this.velocityMax * Math.sign(this.velocityY)
    }

    this.x += this.velocityX
    this.y += this.velocityY
  }
}