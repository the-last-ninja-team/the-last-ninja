import { Rect } from '#base/rect'
import { Polygon } from '#base/polygon'
import { Resources } from '#/resources'
import { StaticMapAnimation } from '#graphic/static-map-animation'
import { LevelImagesStore } from './level-images-store'
import { LayerType } from '#/level-images-draw'

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
    const levelBoxes = getLayerByName('level')

    // Точки респауна
    this.respawns = getLayerByName('respawn')?.objects ?? []
    // Исходные позиции противников
    this.enemies = getLayerByName('enemies')?.objects ?? []
    // Объекты коллизий
    this.collisionObjects = (getLayerByName('collisions')?.objects ?? []).map(object => {
      switch (object.type) {
        case 'triangle':
        case 'polygon':
          return new Polygon(object.x, object.y, object.polygon)
        default:
          return new Rect(object.x, object.y, object.width, object.height)
      }
    })

    const getObjectByName = findByName(levelBoxes.objects)
    // Позиция игрока на старте
    this.playerPosition = getObjectByName('player')
    this.respawns.push(this.playerPosition)
    // Точка входа на следующий уровень
    this.nextLevelGate = getObjectByName('next-level-gate')
    // Точка входа на предыдущий уровень
    this.prevLevelGate = getObjectByName('prev-level-gate')
    // Указатель на следующий уровень
    this.nextLevelArrow = getObjectByName('next-level-arrow')

    // Позиция камеры
    const cameraTrap = getObjectByName('camera-trap')
    // Размер экрана
    const screen = getObjectByName('screen')

    this.cameraTrap = new Rect(cameraTrap.x, cameraTrap.y, cameraTrap.width, cameraTrap.height)
    this.screenRect = new Rect(screen.x, screen.y, screen.width, screen.height)
    this.limitRect = new Rect(0, 0, map.width * map.tilewidth, map.height * map.tileheight)

    this.imagesStore = new LevelImagesStore(this.limitRect.width)
  }

  createImages(display, camera) {
    const { key, map, spriteSheet } = this

    const levelMap = {
      width: map.width,
      height: map.height,
      spriteWidth: map.tilewidth,
      spriteHeight: map.tileheight
    }

    const levelSprite = display.createMap(
      key,
      {
        ...levelMap,
        layers: map.layers.filter(({ name, type }) => {
          return type === 'tilelayer' && name !== 'before-layer'
        })
      }, spriteSheet)
    this.imagesStore.addSprite(LayerType.level, levelSprite)

    const frontSprite = display.createMap(
      `${key}-before-sprite`,
      {
        ...levelMap,
        layers: map.layers.filter(({ name, type }) => {
          return type === 'tilelayer' && name === 'before-layer'
        })
      }, spriteSheet)
    this.imagesStore.addSprite(LayerType.front, frontSprite)
  }

  watch(player) {
    this.player = player
  }

  isCanMoveToTheNextLevel() {
    return true
  }

  update() {
    this.imagesStore.update()

    // Временная затычка, чтобы переходить на следующий уровень
    if (this.isCanMoveToTheNextLevel() && !this.nextLevelArrowCreated && this.nextLevelArrow) {
      this.nextLevelArrowCreated = true
      const arrowStaticAnimation = new StaticMapAnimation(
        [this.nextLevelArrow],
        Resources.getSprite('arrow-down'),
        {
          frames: [1, 2, 3, 4],
          delay: 4
        })
      this.imagesStore.addStaticAnimation(arrowStaticAnimation)
    }
  }
}