import { Animator, AnimatorMode } from '#graphic/animator'
import { NinjaInterpreter } from '#world/interpreters/ninja-interpreter'
import { AnimationSets } from '#graphic/animation-sets'

import { NinjaAnimationDelay, NinjaActionType } from './constants'

/** Здесь определяем анимацию персонажа в зависимости от его координат и скоростей */
export class NinjaAnimation extends Animator {
  constructor({ main, bow, sword }) {
    const defaultFrame = main.getTileSet('idle')
    super(defaultFrame, NinjaAnimationDelay.idle, AnimatorMode.loop, 'ninja-animation')

    this.idle = defaultFrame
    this.armedIdle = main.getTileSet('armed-idle')
    this.crouch = main.getTileSet('crouch')
    this.slide = main.getTileSet('slide')

    this.flip = main.getTileSet('flip')
    this.fall = main.getTileSet('fall')
    this.touch = main.getTileSet('touch')
    this.jump = main.getTileSet('jump')
    this.move = main.getTileSet('move')
    this.armedMove = sword.getTileSet('armed-move')
    this.cast = main.getTileSet('cast')
    this.removeSword = main.getTileSet('remove-sword')

    this.airSwordAttacks = new AnimationSets([
      main.getTileSet('air-sword-attack1'),
      main.getTileSet('air-sword-attack2'),
      main.getTileSet('air-sword-attack3')
    ])

    this.swordAttacks = new AnimationSets([
      main.getTileSet('sword-attack1'),
      main.getTileSet('sword-attack2'),
      main.getTileSet('sword-attack3')
    ])

    this.bowAttack = bow.getTileSet('bow-attack')
    this.airBowAttack = bow.getTileSet('air-bow-attack')

    this.longAnimation = false
    this.mob = null
    this.controller = null

    this.resetAnimation = this.resetAnimation.bind(this)
  }

  watch(mob) {
    this.mob = mob
    this.interpreter = new NinjaInterpreter(mob)
  }

  position() {
    // Размещаем изображение по центру хитбокса игрока
    const { x, y, width, height } = this.mob
    const { width: spriteWidth, height: spriteHeight } = this.animation

    const newPosition = {
      x: x + (width / 2) - (spriteWidth / 2),
      y: y + height - spriteHeight
    }

    // Зеркалим изображение в зависимости от направления игрока
    this.animation.flipped = (this.mob.directionX < 0)
    // Устанавливаем новую позицию
    this.animation.setXY(newPosition.x, newPosition.y)
  }

  // Флаг, что производиться атака на земле
  isGroundAttack() {
    return this.animation === this.bowAttack
        || this.swordAttacks.equals(this.animation)
        || this.isActionType(NinjaActionType.casting)
  }

  // Флаг, что производится атака в воздухе
  isAirAttack() {
    return this.animation === this.airBowAttack
        || this.airSwordAttacks.equals(this.animation)
  }

  // Флаг, определяющий нужно ли прерывать длинную анимацию
  isInterrupted() {
    return this.interpreter.isCrouching() // когда присели
          // когда кастуем и начали атаку мечом или луком
          || (this.isActionType(NinjaActionType.casting) && (this.interpreter.isBowAttacking() || this.interpreter.isSwordAttacking()))
          // когда стреляем из лука и начали кастовать или атаковать мечом
          || (this.isActionType(NinjaActionType.bowAttacking) && (this.interpreter.isCasting() || this.interpreter.isSwordAttacking()))
          // когда атакуем мечом и начали кастовать или стрелять из лука
          || (this.isActionType(NinjaActionType.swordAttacking) && (this.interpreter.isCasting() || this.interpreter.isBowAttacking()))
          // когда стреляем из лука, кастуем или ударяем мечом и начали падать
          || this.isGroundAttack() && this.interpreter.isFalling()
  }

  // Проверка, нужно ли прерывать ввода влево-вправо, в тот момент когда персонаж двигается и одновременно производит атаку
  // Это нужно, т.к. нет анимации атаки в движении
  checkController() {
    if ((this.interpreter.isMoving() && this.isGroundAttack()) || this.isGroundAttack()) {
      // Останавливаем движение игрока, если во время оного произведен выстрел из лука, каст файера или удар мечом
      if (this.mob.directionX < 0) {
        this.controller.left.active = false
      } else {
        this.controller.right.active = false
      }
    }
  }

  /**
   * Окончание длинной анимации и вызов колбэка, если она завершилась удачно.
   * Т.е. побуждение к действию атаки (удар мечом, файер или стрела) производится тогда, когда закончилась анимация (флаг done).
   *
   * Такое поведение необходимо, чтобы мы могли прерывать, например выстрел из лука, если игрок хочет "прямо сейчас"
   * произвести удар мечом, или присесть, или он получил урон и какое-то время "обездвижен" (мы должны отменять
   * текущее действие).
   *
   * Пока сделано "в лоб", т.е. данный класс определяет и какую анимацию выполнять и вызывает выполнение того или иного действия
   * по окончании анимации. В будущем, нужно это дело разводиться по отдельным объектам.
   */
  resetAnimation(done = false) {
    this.longAnimation = false

    // По типу анимации определяем, какое действие производится
    let mobAction
    if (this.isActionType(NinjaActionType.bowAttacking)) {
      mobAction = this.mob.bowAttackAction
    } else if (this.isActionType(NinjaActionType.swordAttacking)) {
      mobAction = this.mob.swordAttackAction
    } else if (this.isActionType(NinjaActionType.casting)) {
      mobAction = this.mob.castAction
    }

    if (mobAction) {
      // Если действие определено и анимация выполнена, то запускаем его
      done && mobAction.done()
      mobAction.clear()

      // Возвращаем обратно возможность движения, не отпуская клавиши
      // Т.е. когда игрок во время движения выполнил атаку (мы остановились) и по окончании анимации, клавиша
      // все еще нажата, ты возвращаем ей активность - чтобы продолжить движение
      if (this.mob.directionX < 0) {
        this.controller.left.active = this.controller.left.down
      } else {
        this.controller.right.active = this.controller.right.down
      }

      // Убираем флаг, что анимация была проиграна
      this.played = false
    }
  }

  handleAnimate() {
    this.animate(this.resetAnimation)
  }

  isActionType(type) {
    switch (type) {
      case NinjaActionType.falling:
        return this.animation === this.fall
      case NinjaActionType.jumping:
        return this.animation === this.jump
      case NinjaActionType.flipping:
        return this.animation === this.flip
      case NinjaActionType.crouching:
        return this.animation === this.crouch
      case NinjaActionType.sliding:
        return this.animation === this.slide
      case NinjaActionType.moving:
        return this.animation === this.move
            || this.animation === this.armedMove
      case NinjaActionType.bowAttacking:
        return this.animation === this.bowAttack
            || this.animation === this.airBowAttack
      case NinjaActionType.swordAttacking:
        return this.swordAttacks.equals(this.animation)
            || this.airSwordAttacks.equals(this.animation)
      case NinjaActionType.idling:
        return this.animation === this.idle
            || this.animation === this.armedIdle
      case NinjaActionType.casting:
        return this.animation === this.cast
    }

    return false
  }

  update() {
    if (this.mob) {
      if (this.isInterrupted()) {
        this.resetAnimation()
      }

      if (this.longAnimation) {
        /**
         * Если проигрывается длинная анимация, то её можно прервать 2мя путями:
         * 1) Если игрок произвел движение влево, вправо, присел, прыжок, падение, кастует,
         * стреляет из лука (если идет анимация меча), ударяет мечом (если идет стрельба из лука) или ему нанесли урон
         * 2) Если анимация закончилась, то убираем флаг
         * */
        this.checkController()
        this.position()
        this.handleAnimate()

        return
      }

      if (!this.mob.jumping) {
        // Если прыжок закончился, то сбрасываем анимацию удара мечом в воздухе до первого сета
        this.airSwordAttacks.reset()
      }

      if (!this.mob.isArmed && this.animation === this.armedIdle) {
        this.longAnimation = true
        // Убираем меч
        this.changeFrameSet(this.removeSword, AnimatorMode.pause, NinjaAnimationDelay.getOrRemoveSword)
      } else if (this.interpreter.isSliding()) {
        // Скользим
        this.changeFrameSet(this.slide, AnimatorMode.pause, NinjaAnimationDelay.slide)
      } else if (this.interpreter.isCrouching()) {
        // Приседания
        this.changeFrameSet(this.crouch, AnimatorMode.loop, NinjaAnimationDelay.crouch)
      } else if (this.interpreter.isCasting()) {
        this.longAnimation = true

        // Кастуем файер
        this.changeFrameSet(this.cast, AnimatorMode.pause, NinjaAnimationDelay.cast)
      } else if (this.interpreter.isSwordAttacking()) {
        this.longAnimation = true

        // Атакуем мечом
        if (this.mob.jumping || this.interpreter.isFalling()) {
          this.changeFrameSet(this.airSwordAttacks.next(), AnimatorMode.pause, NinjaAnimationDelay.airSword)
        } else {
          this.changeFrameSet(this.swordAttacks.next(), AnimatorMode.pause, NinjaAnimationDelay.sword)
        }
      } else if (this.interpreter.isBowAttacking()) {
        this.longAnimation = true

        // Стреляем из лука
        if (this.mob.jumping || this.interpreter.isFalling()) {
          this.changeFrameSet(this.airBowAttack, AnimatorMode.pause, NinjaAnimationDelay.airBow)
        } else {
          this.changeFrameSet(this.bowAttack, AnimatorMode.pause, NinjaAnimationDelay.bow)
        }
      } else {
        if (this.interpreter.isFlipping()) {
          // Переворот в верхней точке прыжка
          this.changeFrameSet(this.flip, AnimatorMode.pause, NinjaAnimationDelay.flip)
        } else if (this.interpreter.isJumping()) {
          // Прыжок
          this.changeFrameSet(this.jump, AnimatorMode.pause, NinjaAnimationDelay.jump)
        } else if (this.interpreter.isFalling()) {
          // Падение вниз
          this.changeFrameSet(this.fall, AnimatorMode.loop, NinjaAnimationDelay.fall)
        } else if (this.interpreter.isIdling()
              || (this.interpreter.isSlowing() && !this.isActionType(NinjaActionType.falling))) {
          // Ожидание по триггеру "ожидание" и когда скорость почти упала
          // Это нужно для того, чтобы выполнить переход от "длинную анимации", когда она производится
          // в момент покоя, к следующему состоянию
          if (this.mob.isArmed) {
            this.changeFrameSet(this.armedIdle, AnimatorMode.loop, NinjaAnimationDelay.idle)
          } else {
            this.changeFrameSet(this.idle, AnimatorMode.loop, NinjaAnimationDelay.idle)
          }
        } else if (this.interpreter.isMoving()) {
          // Двигаемся
          if (this.mob.isArmed) {
            this.changeFrameSet(this.armedMove, AnimatorMode.loop, NinjaAnimationDelay.move)
          } else {
            this.changeFrameSet(this.move, AnimatorMode.loop, NinjaAnimationDelay.move)
          }
        }
      }

      this.position()

      if (this.interpreter.isSlowing() && (
            this.isActionType(NinjaActionType.falling)
          || this.isActionType(NinjaActionType.moving))) {
        // Это блок, когда скорость игрока "почти" останавливается

        if (this.isActionType(NinjaActionType.falling)) {
          // Проигрываем анимацию приземления когда просто падаем
          this.longAnimation = true
          this.changeFrameSet(this.touch, AnimatorMode.loop, NinjaAnimationDelay.touch)
          this.position()
          this.handleAnimate()
        } else if (this.isGroundAttack()) {
          // Если производится атака, то даем ей завершиться
          this.handleAnimate()
        } else {
          // Если ускорение по X координате маленькое,
          // то останавливаем анимацию, т.е. не проигрываем следующий кадр
          this.stop()
        }
      } else {
        // Проигрываем анимацию
        this.handleAnimate()
      }

      this.checkController()
    }
  }
}