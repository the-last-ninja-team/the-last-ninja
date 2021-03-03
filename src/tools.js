/**
 * Набор инструментов для отладки.
 * Сейчас только чек-бокс "Debug", который вкл/откл рамки вокруг всех объектов и коллизий
 * */
export class Tools {
  constructor(main) {
    this.main = main
    this.isDebug = false
    this.isShowGrid = false
    this.player = null

    this.debugInfo = document.getElementById('debug-info')

    this.handleDebugClick = this.handleDebugClick.bind(this)
    this.handleGridClick = this.handleGridClick.bind(this)
    this.handleStopSlick = this.handleStopSlick.bind(this)

    const debugCheckbox = document.getElementById('debug')
    debugCheckbox.addEventListener('click', this.handleDebugClick)

    const gridCheckbox = document.getElementById('grid')
    gridCheckbox.addEventListener('click', this.handleGridClick)

    const stopCheckbox = document.getElementById('stop')
    stopCheckbox.addEventListener('click', this.handleStopSlick)
  }

  watch(player) {
    this.player = player
  }

  handleDebugClick(event) {
    this.isDebug = event.target.checked
    this.main.display.isDebug = this.isDebug
  }

  handleGridClick(event) {
    this.isShowGrid = event.target.checked
  }

  handleStopSlick(event) {
    if (event.target.checked) {
      this.main.engine.stop()
    } else {
      this.main.engine.start()
    }
  }

  update() {
    if (this.player) {
      const { x, oldX, y, oldY, width, height, velocityX, velocityY } = this.player
      this.debugInfo.value = JSON.stringify({
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
      if (this.isShowGrid) {
        // Рисуем сетку уровня
        const { tileMap, collisionMap } = this.main.game.world.level
        this.main.display.drawMapGrid(tileMap, collisionMap)
      }

      // Рисуем все коллизии красным цветом
      this.main.game.world.level.collisionRects.forEach(rect => {
        this.main.display.drawStroke({...rect, color: 'red'})
      })

      // Рисуем границы камеры игрока, заданным цветом
      this.main.camera.rects.forEach((({rect, color, sticky}) => {
        this.main.display.drawStroke({...rect, color, sticky})
      }))
    }
  }
}