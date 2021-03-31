import { Rect } from '#base/rect'

const RATIO = 10
const OFFSET = 5

export class MiniMap {
  constructor(screen) {
    this.screen = screen
    this.mapRects = []
  }

  init(limitRect) {
    const { width, height } = limitRect

    const mapWidth = width / RATIO
    const mapHeight = height / RATIO
    const mapX = Math.round(this.screen.width - mapWidth - OFFSET)
    const mapY = Math.round(OFFSET)

    this.mapRects = [
      new Rect(mapX, mapY, mapWidth, mapHeight),
      new Rect(mapX, mapY, Math.round(this.screen.width / RATIO), Math.round(this.screen.height / RATIO))
    ]
  }

  update() {
    const [map, screen] = this.mapRects
    screen.x = Math.round(map.x + this.screen.x / RATIO)
    screen.y = Math.round(map.y + this.screen.y / RATIO)
  }
}