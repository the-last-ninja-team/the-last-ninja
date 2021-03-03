export const AnimatorMode = {
  // Выполняем анимацию и когда она завершилась останавливаемся
  pause: 'pause',
  // Зацикливаем анимацию
  loop: 'loop'
}

/** Класс где производится логика вычисления следующего кадра анимации */
export class Animator {
  constructor(animation, delay, mode = AnimatorMode.pause, key) {
    this.count = 0
    this.delay = (delay >= 1) ? delay : 1
    this.animation = animation
    this.frameIndex = 0
    this.mode = mode

    this.stopAnimation = false
    this.key = key
  }

  // Смена набора фреймов анимации с заданием с какого кадра ее проигрывать
  changeFrameSet(animation, mode, delay = 10, frameIndex = 0) {
    if (this.animation === animation) {
      return
    }

    this.count = 0
    this.delay = delay
    this.animation = animation
    this.frameIndex = frameIndex
    this.animation.setFrame(frameIndex)
    this.mode = mode
    this.played = false
  }

  // Остановка анимации
  stop() {
    this.stopAnimation = true
  }

  // Флаг, что анимация проиграна до конца
  isEnded() {
    return this.frameIndex === this.animation.frames.length - 1
  }

  // Сам процесс анимации
  animate(callback) {
    if (this.mode === AnimatorMode.pause && this.played) {
      // Если в режиме пауза и анимация уже проиграна, что выходим
      return
    }

    this.count ++

    // Цикл работает тогда, когда счетчик превысил заданную задержку (в нашем случае задержка - это кадр)
    // Т.е. исходим не из времени выполнения в миллисекундах, а кол-ве пройденных кадров
    while(this.count > this.delay) {
      this.count -= this.delay
      // Следующий кадр
      this.frameIndex ++

      if (this.frameIndex === this.animation.frames.length) {
        this.frameIndex = this.mode === AnimatorMode.loop
              ? this.frameIndex = 0
              : this.frameIndex = this.animation.frames.length - 1
      }

      this.animation.setFrame(this.frameIndex)

      let animationEnded = this.isEnded()
      if (this.stopAnimation || this.mode === AnimatorMode.pause && animationEnded) {
        if (this.mode === AnimatorMode.pause && animationEnded) {
          this.played = true
          this.frameIndex = 0
        }
        // Если анимацию остановили или в режиме "пауза" дошли до последнего кадра
        this.stopAnimation = false

        // Когда закончилась анимация, то вызываем колбэк
        if (callback) {
          callback(animationEnded, this.animation.key)
        }

        break
      } else if (callback && animationEnded) {
        // Когда закончилась анимация, то вызываем колбэк
        callback(true, this.animation.key)
      }
    }
  }
}