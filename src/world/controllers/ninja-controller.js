/** Здесь мы уже перенаправляем ввод с клавиатуры на действия персонажа */
export class NinjaController {
  constructor(controller) {
    this.controller = controller
    this.player = null
  }

  watch(player) {
    this.player = player
  }

  update() {
    // Флаг игрок присел/игрок встал
    this.player.crouch(this.controller.down.active)

    // Движение влево
    if (this.controller.left.active)  {
      this.player.moveLeft()
    }
    // Движение вправо
    if (this.controller.right.active) {
      this.player.moveRight()
    }
    // Прыжок (после, сразу деактивируем нажатие, чтобы убрать эффект "прыгаем пока зажата клавиша")
    if (this.controller.jump.active) {
      this.player.jump()
      this.controller.jump.active = false
    }
    // Кастуем файербол
    if (this.controller.cast.active) {
      this.player.cast()
      this.controller.cast.active = false
    }
    // Удар мечом
    if (this.controller.sword.active) {
      this.player.sword()
      this.controller.sword.active = false
    }
    // Выстрел из лука
    if (this.controller.bow.active) {
      this.player.bow()
      this.controller.bow.active = false
    }
  }
}