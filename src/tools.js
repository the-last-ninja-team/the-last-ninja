import { Rect } from './base/rect'
import { Ray } from './base/ray'

const COLLIDE_COLOR = 'yellow'
const HITBOX_COLOR = 'red'

/**
 * Набор инструментов для отладки.
 * Сейчас только чек-бокс "Debug", который вкл/откл рамки вокруг всех объектов и коллизий
 * */
export class Tools {
  constructor(main) {
    this.main = main
    this.isDebug = false
    this.isDebugRects = false
    this.player = null

    this.debugInfoEl = document.getElementById('debug-info')
    this.gridCheckboxEl = document.getElementById('grid')
    this.collideCheckboxEl = document.getElementById('collide')
    this.hitBoxesCheckboxEl = document.getElementById('hitboxes')
    this.cameraCheckboxEl = document.getElementById('camera')

    this.handleDebugClick = this.handleDebugClick.bind(this)
    this.handleDebugRectsClick = this.handleDebugRectsClick.bind(this)
    this.handleStopClick = this.handleStopClick.bind(this)

    const debugCheckboxEl = document.getElementById('debug')
    debugCheckboxEl.addEventListener('click', this.handleDebugClick)

    const debugRectsCheckboxEl = document.getElementById('rects')
    debugRectsCheckboxEl.addEventListener('click', this.handleDebugRectsClick)

    const stopCheckboxEl = document.getElementById('stop')
    stopCheckboxEl.addEventListener('click', this.handleStopClick)
  }

  watch(player) {
    this.player = player
  }

  checkDisplayDebug() {
    this.main.display.isDebug = this.isDebug && this.isDebugRects
  }

  handleDebugClick(event) {
    this.isDebug = event.target.checked
    this.checkDisplayDebug()
  }

  handleDebugRectsClick(event) {
    this.isDebugRects = event.target.checked
    this.checkDisplayDebug()
  }

  handleStopClick(event) {
    if (event.target.checked) {
      this.main.engine.stop()
    } else {
      this.main.engine.start()
    }
  }

  update() {
    if (this.player) {
      const { x, oldX, y, oldY, width, height, velocityX, velocityY } = this.player
      this.debugInfoEl.value = JSON.stringify({
        x: Math.round(x),
        oldX: Math.round(oldX),
        y: Math.round(y),
        oldY: Math.round(oldY),
        width,
        height,
        velocityX: Math.round(velocityX),
        velocityY: Math.round(velocityY)
      })
    }
  }

  render() {
    if (this.isDebug) {
      if (this.gridCheckboxEl.checked) {
        // Рисуем сетку уровня
        const { tileMap } = this.main.game.world.level
        const { collisionMap } = this.main.game.world.env.collider
        this.main.display.drawMapGrid(tileMap, collisionMap ?? [])
      }

      if (this.hitBoxesCheckboxEl.checked) {
        // Рисуем все хитбоксы красным цветом
        this.main.game.world.hitBoxes.forEach(hitBox => {
          this.main.display.drawStroke({ ...hitBox, color: HITBOX_COLOR })
        })

        this.main.game.world.level.collisionObjects.forEach(hitBox => {
          this.main.display.drawStroke({ ...hitBox, color: HITBOX_COLOR })
        })
      }

      if (this.collideCheckboxEl.checked) {
        // Рисуем все лучи синим цветом
        this.main.game.world.env.collides.forEach(collide => {
          if (collide instanceof Rect) {
            this.main.display.drawStroke({ ...collide, color: COLLIDE_COLOR })
          } else if (collide instanceof Ray) {
            this.main.display.drawLine({ ...collide, color: COLLIDE_COLOR })
          }
        })
      }

      // Рисуем границы камеры игрока, заданным цветом
      if (this.cameraCheckboxEl.checked) {
        this.main.camera.rects.forEach((({rect, color, sticky}) => {
          this.main.display.drawStroke({ ...rect, color, sticky })
        }))
      }
    }
  }
}