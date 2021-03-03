import { ButtonInput } from './button-input'

/** Контроллер, который слушает ввод с клавиатуры и мыши (когда это понадобиться) */
export class Controller {
  constructor() {
    this.down = new ButtonInput()
    this.left = new ButtonInput()
    this.right = new ButtonInput()
    this.up = new ButtonInput()
    this.jump = new ButtonInput()
    this.cast = new ButtonInput()
    this.sword = new ButtonInput()
    this.bow = new ButtonInput()
  }

  keyDownUp(type, keyCode) {
    const down = (type === "keydown")

    switch(keyCode) {
      case 37: // Стрелка влево - двигаемся влево (во время прыжка можно управлять)
        this.left.getInput(down)
        break
      case 38: // Стрелка вверх - пока ничего нет
        this.up.getInput(down)
        break
      case 39: // Стрелка вправо - двигаемся вправо (во время прыжка можно управлять)
        this.right.getInput(down)
        break
      case 40: // Стрелка вниз - присесть или слайд во время движения
        this.down.getInput(down)
        break
      case 32: // Пробел - прыжок
        this.jump.getInput(down)
        break
      case 70: // Клавиша F - каст файербола
        this.cast.getInput(down)
        break
      case 82: // Клавиша R - удар мечом (как на земле, так и в воздухе)
        this.sword.getInput(down)
        break
      case 66: // Клавиш B - выстрел из лука (как на земле, так и в воздухе)
        this.bow.getInput(down)
        break
    }
  }
}