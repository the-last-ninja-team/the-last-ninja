import { MovingObject } from './moving-object'

export class Mob extends MovingObject {
  constructor({ x, y, width, height, velocityMax, jumpPower = 20, speed = 0.55, hitBox }) {
    super(x, y, width, height, velocityMax)

    this.hitBox = hitBox?.base ?? { width, height }
    this.originHitBox = { ...hitBox }

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
    const { width, height} = hitBox
    if (this.hitBox.width === width && this.hitBox.height === height) {
      return
    }
    this.hitBox = hitBox
    this.y = this.getBottom() - height
    this.height = height

    this.oldY = this.y
  }

  jump() {
    if (!this.jumping && this.velocityY < 10) {
      this.crouching = false
      this.setHitBox(this.originHitBox.base)
      this.jumping = true
      this.velocityY -= this.jumpPower
    }
  }

  moveLeft() {
    this.crouching = false
    this.setHitBox(this.originHitBox.base)
    this.directionX = -1
    this.velocityX -= this.speed
  }

  moveRight() {
    this.crouching = false
    this.setHitBox(this.originHitBox.base)
    this.directionX = 1
    this.velocityX += this.speed
  }

  crouch(crouching) {
    if (!this.jumping && this.velocityY === 0) {
      this.crouching = crouching
      if (!this.crouching) {
        this.setHitBox(this.originHitBox.base)
      } else {
        this.setHitBox(this.originHitBox.crouch)
      }
    }
  }
}