import { Rect } from '../base/rect'
import { Img } from '../graphic/img'
import { ParallaxImage } from '../graphic/parallax-image'
import { Resources } from '../resources'
import { StaticMapAnimation } from '../graphic/static-map-animation'

const findByName = (array) => (name) => {
  return array.find((object) => object.name === name)
}

export class Level {
  constructor({ key, map, spriteSheet, nextLevel, prevLevel }) {
    this.key = key
    this.map = map
    this.spriteSheet = spriteSheet
    this.nextLevel = nextLevel
    this.prevLevel = prevLevel
    this.nextLevelArrowCreated = false

    this.tileMap = {
      rows: map.height,
      columns: map.width,
      size: {
        width: map.tilewidth,
        height: map.tileheight
      }
    }

    const getLayerByName = findByName(map.layers)
    const hitBoxes = getLayerByName('collisions')
    const levelBoxes = getLayerByName('level')
    // Точки респауна
    this.respawns = getLayerByName('respawn')
    // Исходные позиции противников
    this.enemies = getLayerByName('enemies')?.objects ?? []

    const getObjectByName = findByName(levelBoxes.objects)
    // Позиция игрока на старте
    this.playerPosition = getObjectByName('player')
    // Точка входа на следующий уровень
    this.nextLevelGate = getObjectByName('next-level-gate')
    // Точка входа на предыдущий уровень
    this.prevLevelGate = getObjectByName('prev-level-gate')
    // Указатель на следующий уровень
    this.nextLevelArrow = getObjectByName('next-level-arrow')
    // Мапа коллизий
    this.collisionMap = [...Array.from({ length: this.tileMap.rows * this.tileMap.columns }).map(() => 0)]

    hitBoxes.objects.forEach(({ type, x, y, width, height }) => {
      const value = parseInt(type, 10)
      if (value) {
        let startX = x
        let startY = y
        const rows = height / this.tileMap.size.height
        const columns = width / this.tileMap.size.width

        for (let i = 1; i <= rows * columns; i ++) {
          const index = (startY / this.tileMap.size.height) * this.tileMap.columns + (startX / this.tileMap.size.width)
          this.collisionMap[index] = value

          startX += this.tileMap.size.width

          if (i % columns === 0) {
            startY += this.tileMap.size.height
            startX = x
          }
        }
      }
    })

    this.collisionRects = []
    this.staticAnimations = []

    // Позиция камеры
    const cameraTrap = getObjectByName('camera-trap')
    // Размер экрана
    const screen = getObjectByName('screen')

    this.cameraTrap = new Rect(cameraTrap.x, cameraTrap.y, cameraTrap.width, cameraTrap.height)
    this.screenRect = new Rect(0, 0, screen.width, screen.height)
    this.limitRect = new Rect(0, 0, map.width * map.tilewidth, map.height * map.tileheight)

    this.levelSprite = null
    this.beforeSprite = null
    this.images = []
    this.parallaxes = []
  }

  createImages(display, camera) {
    //
  }

  watch(player) {
    this.player = player
  }

  addImage(name, x, y, width, height) {
    const image = new Img({ name, x, y, width, height })
    this.images.push(image)
    return image
  }

  addParallax({ name, y, width, height, delay, step, direction, type, space }) {
    const parallax = new ParallaxImage({
      name, screenWidth: this.screenRect.width, y, width, height, delay, step, direction, type, space
    })
    this.parallaxes.push(parallax)
    return parallax
  }

  addStaticAnimation(animation) {
    this.staticAnimations.push(animation)
  }

  isCanMoveToTheNextLevel() {
    return true
  }

  update() {
    this.staticAnimations.forEach(staticAnimation => staticAnimation.update())
    if (this.isCanMoveToTheNextLevel() && !this.nextLevelArrowCreated) {
      this.nextLevelArrowCreated = true
      const arrowStaticAnimation = new StaticMapAnimation(
        [this.nextLevelArrow],
        Resources.getSprite('arrow-down'),
        {
          frames: [1, 2, 3, 4],
          delay: 4
        })
      this.addStaticAnimation(arrowStaticAnimation)
    }
  }
}