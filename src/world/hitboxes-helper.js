import { Rect } from '../base/rect'

export class HitBoxesHelper {
  constructor() {
   //
  }

  /**
   * Функция для инициализации прямоугольников хитбосов объекта
   * TODO: пока неясно, как это дело обыгрывать
   * */
  getHitBoxes(object) {
   return [new Rect(object.x, object.y, object.width, object.height)]
  }
}