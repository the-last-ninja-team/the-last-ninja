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

  init({ edgeRect, screenRect, limitRect }) {
    this.edgeRect = edgeRect
    this.screenRect = screenRect
    this.limitRect = limitRect
    this.widthBetweenViewPortAndLimit = (this.screenRect.width - (this.edgeRect.x + this.edgeRect.width))

    this.startEdgeRect = { ...this.edgeRect }
    this.endEdgeRect = {
      ...this.edgeRect,
      x: this.limitRect.width - this.widthBetweenViewPortAndLimit - this.edgeRect.width
    }

    this.rects = [
      { rect: this.startEdgeRect, color: 'green' },
      { rect: this.endEdgeRect, color: 'red' },
      { rect: this.edgeRect, color: 'black', sticky: true },
    ]
  }

  update() {
    super.update()

    if (this.object) {
      if (this.x > 0 && this.object.x - this.x < this.edgeRect.x) {
        /** Если уже есть x камеры и объект выходит за рамки назад по уровню, то высчитываем x координату */
        this.x = Math.max(0, this.object.x - this.edgeRect.x)
      } else if (this.object.x > this.x + this.edgeRect.x + this.edgeRect.width - this.object.width) {
        /** Если объект выходит за рамки вперед по уровню, то высчитываем x координату */
        this.x = this.object.x - (this.edgeRect.x + this.edgeRect.width - this.object.width)
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

      // TODO: временно не считаем Y координату (пока непонятно как будут строиться уровни)
      this.y = 0 // Math.min(0, -(this.edgeRect.y - this.object.y))

      // Округляем для более плавного движения камеры
      this.y = Math.round(this.y)
      this.x = Math.round(this.x)
    }
  }
}