import { Camera } from './base/camera'
import { Vector } from './base/vector'

/**
 * Camera trap
 *
 * Камера, которая следует за заданной рамкой, которую игрок может двигать.
 * И применяя эти координаты, при отрисовки всей анимации, создается эффект динамичности происходящего,
 * что персонаж продвигается по уровню.
 *
 * Для визуальной отладки, создается 3 прямоугольника:
 * - зеленый - стартовая позиция камеры
 * - черный - рамка, которую "толкает" персонаж
 * - красный - финишная позиция камеры
 * */
export class MainCamera extends Camera {
  constructor() {
    super()

    this.steps = 0
    this.index = 1
   }

  init({ cameraTrap, screenRect, limitRect }) {
    // Координаты, относительно которых будем работать вывод на экран
    this.x = screenRect.x
    this.y = screenRect.y

    // Координаты, которые получены в текущий момент и от них нужно интерполировать, чтобы добавить плавности
    this.newX = this.x
    this.newY = this.y

    this.cameraTrap = cameraTrap
    this.screenRect = screenRect
    this.limitRect = limitRect
    this.widthBetweenViewPortAndLimit = (this.screenRect.width - (cameraTrap.x + cameraTrap.width))
    this.heightBetweenViewPortAndLimit = (this.screenRect.height - (cameraTrap.y + cameraTrap.height))

    this.rects = [
      { rect: cameraTrap, color: 'black', sticky: true },
    ]
  }

  calcX() {
    if (this.x > 0 && this.object.x - this.x < this.cameraTrap.x) {
      /** Если уже есть X камеры и объект выходит за рамки назад по уровню, то высчитываем X координату */
      this.newX = Math.max(0, this.object.x - this.cameraTrap.x)
    } else if (this.object.x > this.x + this.cameraTrap.x + this.cameraTrap.width - this.object.width) {
      /** Если объект выходит за рамки вперед по уровню, то высчитываем X координату */
      this.newX = this.object.x - (this.cameraTrap.x + this.cameraTrap.width - this.object.width)
    }

    if (this.object.x + this.object.width  > (this.limitRect.width - this.widthBetweenViewPortAndLimit)) {
      /**
       * Объект достиг границы лимита по X координате с учетом рамки.
       * В этом случае, мы должны дать ему пройти до конца (за границу) уровня, не двигая рамку.
       * */
      if (this.screenRect.width === this.limitRect.width) {
        this.newX = 0
      } else {
        this.newX = this.limitRect.width - this.screenRect.width
      }
    }
  }

  calcY() {
    if (this.y > 0 && this.object.y - this.y < this.cameraTrap.y) {
      /** Если уже есть Y камеры и объект выходит за рамки назад по уровню, то высчитываем Y координату */
      this.newY = Math.max(0, this.object.y - this.cameraTrap.y)
    } else if (this.object.y > this.y + this.cameraTrap.y + this.cameraTrap.height - this.object.height) {
      /** Если объект выходит за рамки вперед по уровню, то высчитываем Y координату */
      this.newY = this.object.y - (this.cameraTrap.y + this.cameraTrap.height - this.object.height)
    }

    if (this.object.y + this.object.height  > (this.limitRect.height - this.heightBetweenViewPortAndLimit)) {
      /**
       * Объект достиг границы лимита по Y координате с учетом рамки.
       * В этом случае, мы должны дать ему пройти до конца (за границу) уровня, не двигая рамку.
       * */
      if (this.screenRect.height === this.limitRect.height) {
        this.newY = 0
      } else {
        this.newY = this.limitRect.height - this.screenRect.height
      }
    }
  }

  update() {
    super.update()

    if (this.object) {
      this.calcX()
      this.calcY()

      // X координату применяем сразу, т.к. нет смысла делать плавность по причине того, что игрок всегда передвигается по горизонтали
      this.x = Math.round(this.newX)

      if (this.y !== Math.round(this.newY)) {
        // Интерполируем длину до новой точки, чтобы при падении или подъеме камера двигалась плавно
        const startPos = new Vector(this.x, this.y)
        const targetPos = new Vector(this.newX, this.newY)

        this.steps += (0.003 * this.index)
        this.index++
        startPos.lerp(targetPos.x, targetPos.y, this.steps)

        this.y = Math.round(startPos.y)
      } else {
        this.steps = 0
        this.index = 1
      }
    }
  }
}