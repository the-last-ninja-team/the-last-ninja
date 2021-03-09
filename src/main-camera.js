import { Camera } from './base/camera'

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
   }

  init({ cameraTrap, screenRect, limitRect }) {
    this.x = screenRect.x
    this.y = screenRect.y
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
      this.x = Math.max(0, this.object.x - this.cameraTrap.x)
    } else if (this.object.x > this.x + this.cameraTrap.x + this.cameraTrap.width - this.object.width) {
      /** Если объект выходит за рамки вперед по уровню, то высчитываем X координату */
      this.x = this.object.x - (this.cameraTrap.x + this.cameraTrap.width - this.object.width)
    }

    if (this.object.x + this.object.width  > (this.limitRect.width - this.widthBetweenViewPortAndLimit)) {
      /**
       * Объект достиг границы лимита по X координате с учетом рамки.
       * В этом случае, мы должны дать ему пройти до конца (за границу) уровня, не двигая рамку.
       * */
      if (this.screenRect.width === this.limitRect.width) {
        this.x = 0
      } else {
        this.x = this.limitRect.width - this.screenRect.width
      }
    }
  }

  calcY() {
    if (this.y > 0 && this.object.y - this.y < this.cameraTrap.y) {
      /** Если уже есть Y камеры и объект выходит за рамки назад по уровню, то высчитываем Y координату */
      this.y = Math.max(0, this.object.y - this.cameraTrap.y)
    } else if (this.object.y > this.y + this.cameraTrap.y + this.cameraTrap.height - this.object.height) {
      /** Если объект выходит за рамки вперед по уровню, то высчитываем Y координату */
      this.y = this.object.y - (this.cameraTrap.y + this.cameraTrap.height - this.object.height)
    }

    if (this.object.y + this.object.height  > (this.limitRect.height - this.heightBetweenViewPortAndLimit)) {
      /**
       * Объект достиг границы лимита по Y координате с учетом рамки.
       * В этом случае, мы должны дать ему пройти до конца (за границу) уровня, не двигая рамку.
       * */
      if (this.screenRect.height === this.limitRect.height) {
        this.y = 0
      } else {
        this.y = this.limitRect.height - this.screenRect.height
      }
    }
  }

  update() {
    super.update()

    if (this.object) {
      this.calcX()
      this.calcY()

      // Округляем для более плавного движения камеры
      this.y = Math.round(this.y)
      this.x = Math.round(this.x)
    }
  }
}