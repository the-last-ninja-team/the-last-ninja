import { Animator, AnimatorMode } from '#graphic/animator'
import { EnemyInterpreter } from '../interpreters/enemy-interpreter'

export class EnemyAnimation extends Animator {
  constructor({ tiles, delays, key }) {
  const defaultFrame = tiles.getTileSet('idle')
    super(defaultFrame, delays.idle, AnimatorMode.loop, key)

    this.idle = defaultFrame
    this.attack = tiles.getTileSet('attack')
    this.move = tiles.getTileSet('move')
    this.takeHit = tiles.getTileSet('take-hit')
    this.dead = tiles.getTileSet('dead')
    this.block = tiles.getTileSet('block')

    this.mob = null
    this.delays = delays
    this.longAnimation = false

    this.resetAnimation = this.resetAnimation.bind(this)
  }

  watch(mob) {
    this.mob = mob
    this.interpreter = new EnemyInterpreter(mob)
  }

  resetAnimation(done = false) {
    this.longAnimation = false

    // По типу анимации определяем, какое действие производится
    let mobAction
    if (mobAction) {
      // Если действие определено и анимация выполнена, то запускаем его
      done && mobAction.done()
      mobAction.clear()

      // Убираем флаг, что анимация была проиграна
      this.played = false
    }
  }

  handleAnimate() {
    this.animate(this.resetAnimation)
  }

  // Флаг, определяющий нужно ли прерывать длинную анимацию
  isInterrupted() {
    return false
  }

  position() {
    // Размещаем изображение по центру хитбокса игрока
    const { x, y, width, height } = this.mob
    const { width: spriteWidth, height: spriteHeight } = this.animation

    const newPosition = {
      x: x + (width / 2) - (spriteWidth / 2),
      y: y + height - spriteHeight + 48
    }

    // Зеркалим изображение в зависимости от направления игрока
    this.animation.flipped = (this.mob.directionX < 0)
    // Устанавливаем новую позицию
    this.animation.setXY(newPosition.x, newPosition.y)
  }

  update() {
    if (this.mob) {
      if (this.isInterrupted()) {
        this.resetAnimation()
      }

      if (this.longAnimation) {
        this.position()
        this.handleAnimate()

        return
      }

      if (this.interpreter.isAttacking()) {
        this.changeFrameSet(this.attack, AnimatorMode.loop, this.delays.attack)
      } else if (this.interpreter.isBlocking()) {
        this.changeFrameSet(this.block, AnimatorMode.loop, this.delays.block)
      } else if (this.interpreter.isDead()) {
        this.changeFrameSet(this.dead, AnimatorMode.loop, this.delays.dead)
      } else if (this.interpreter.isIdling()) {
        this.changeFrameSet(this.idle, AnimatorMode.loop, this.delays.idle)
      } else if (this.interpreter.isMoving()) {
        this.changeFrameSet(this.move, AnimatorMode.loop, this.delays.move)
      } else if (this.interpreter.isTakeHit()) {
        this.changeFrameSet(this.takeHit, AnimatorMode.loop, this.delays.takeHit)
      }

      this.position()
      this.handleAnimate()
    }
  }
}