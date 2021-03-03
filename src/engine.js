/** Это движок, который запускает отображение следующего кадра канвы */
export class Engine {
  /**
   * Конструктор
   * @param timeStep - кол-во кадров в секунду (сейчас это 1000 / 30)
   * @param update - функция для обновления всех позиций и коллизий
   * @param render - функция для отрисовки канвы
   * */
  constructor(timeStep, update, render) {
    this.timeStep = timeStep
    this.update = update
    this.render = render

    this.animationFrameRequest = undefined
    this.accumulatedTime = 0
    this.time = undefined
    this.updated = false

    this.handleRun = this.handleRun.bind(this)
  }

  run(time) {
    this.animationFrameRequest = requestAnimationFrame(this.handleRun)

    this.accumulatedTime += time - this.time
    this.time = time

    if (this.accumulatedTime >= this.timeStep * 3) {
      this.accumulatedTime = this.timeStep
    }

    // На случай, если были "тормоза", все накопленное время разбиваем на заданное кол-во кадров и обновляем позиции
    while (this.accumulatedTime >= this.timeStep) {
      this.accumulatedTime -= this.timeStep
      this.update(time)
      this.updated = true
    }

    if (this.updated) {
      // Если обновили все позиции, то отрисовываем канву
      this.updated = false
      this.render(time)
    }
  }

  // Хендл для requestAnimationFrame функции
  handleRun(time) {
    this.run(time)
  }

  // Старт анимации
  start() {
    this.accumulatedTime = this.timeStep
    this.time = window.performance.now()
    this.animationFrameRequest = requestAnimationFrame(this.handleRun)
  }

  // Остановка анимации
  stop() {
    cancelAnimationFrame(this.animationFrameRequest)
  }
}