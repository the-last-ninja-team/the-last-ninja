/**
 * Здесь мы пытаемся интерпретировать состояние персонажа, в зависимости от его флагов,
 * положения, ускорения и т.д. в действие
 * */
export class NinjaInterpreter {
  constructor(ninja) {
    this.ninja = ninja
  }

  __getVelocityX() {
    return Math.abs(this.ninja.velocityX)
  }

  // Присел
  isCrouching() {
    return this.ninja.crouching
  }

  // Скользит
  isSliding() {
    return this.ninja.crouching && this.__getVelocityX() > 1
  }

  // Кастует
  isCasting() {
    return this.ninja.castAction.action
  }

  // Стрельба из лука
  isBowAttacking() {
    return this.ninja.bowAttackAction.action
  }

  // Удар мечом
  isSwordAttacking() {
    return this.ninja.swordAttackAction.action
  }

  // Прыжок
  isJumping() {
    const { velocityY } = this.ninja
    return velocityY < 0 && velocityY < -17
  }

  // Падение
  isFalling() {
    return this.ninja.velocityY >= 11
  }

  // Переворот (верхняя точка прыжка)
  isFlipping() {
    const { velocityY } = this.ninja
    return velocityY < 0 && velocityY >= -17
  }

  // Ожидание
  isIdling() {
    return !this.ninja.jumping && this.__getVelocityX() < 0.05
  }

  // Движение
  isMoving() {
    return !this.ninja.jumping && !(this.__getVelocityX() < 1)
  }

  // Замедление ускорения
  isSlowing() {
    const velocityX = this.__getVelocityX()
    return velocityX < 1 && velocityX > 0.098
              && !this.ninja.jumping
  }
}