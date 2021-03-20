import { Rect } from '#base/rect'

export class HitBoxesHelper {
  constructor() {
   //
  }

  /** Функция для инициализации хитбокса объекта */
  getHitBox(object) {
    return new Rect(object.x, object.y, object.width, object.height)
  }

  /**
   * Функция для инициализации прямоугольников хитбосов вокруг объекта
   * */
  getCoinsHitBoxes(object, offset) {
    const { x, y, width, height } = object

    const hitBox = new Rect(
      x - offset.width, y - offset.height,
      width + (offset.width * 2), height + (offset.height * 2))
    return [hitBox]
  }
}