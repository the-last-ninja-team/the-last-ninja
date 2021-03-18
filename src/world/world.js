import { NinjaAnimation } from './animation/ninja-animation'
import { NinjaController } from './controllers/ninja-controller'

import { ObjectsFactory } from './objects/objects-factory'
import { Enemies } from './enemies';

// Levels
import { Level01 } from './levels/level-01'
import { Level02 } from './levels/level-02'
import { LevelRayCastTest } from './levels/level-raycast-test'

// Checking objects
import { CheckCoins } from './checks/check-coins'
import { CheckHMovingObjects } from './checks/check-hmoving-objects'

import { Environment } from './environment'
import { ObjectType, PlayerType } from './constants'

// Colliders
import { RayCastCollider } from './colliders/raycast-collider'
import { HitBoxesHelper } from './hitboxes-helper'
import { CollisionDetected } from '#/collision-detected'

export class World {
  constructor({ friction = 0.85, gravity = 2, createLevel }) {
    // Цвет фона
    this.backgroundColor = 'grey'
    this.createLevel = createLevel
    this.hitBoxes = []

    // Окружение, куда будем помещать все объекты (противники, игрок, стрелы и т.д.)
    this.env = new Environment(friction, gravity, new RayCastCollider())
    // Хелпер для чтения хитбоксов объектов
    this.hitBoxesHelper = new HitBoxesHelper()
    // Противники
    this.enemies = new Enemies(this.env)
    // Анимация игрока
    this.playerAnimation = new NinjaAnimation(PlayerType.tiles())
  }

  setLevel(level) {
    switch (level) {
      case '01':
        this.level = new Level01()
        break
      case '02':
        this.level = new Level02()
        break
      case 'RayCastTest':
        this.level = new LevelRayCastTest()
        break
      default:
        throw new Error(`Unsupported level value ${level}`)
    }

    this.initLevel()
  }

  initLevel() {
    const { x, y } = this.level.playerPosition
    this.player = ObjectsFactory.createPlayer(x, y, PlayerType.props)

    const { limitRect, collisionObjects, tileMap } = this.level

    this.env.init(limitRect, collisionObjects, tileMap)
    this.env.addMob(this.player)
    this.playerAnimation.watch(this.player)
    this.level.watch(this.player)
    this.enemies.init(this.level.enemies)

    this.checkFireballs = new CheckHMovingObjects({
      player: this.player,
      limitRect: this.level.limitRect,
      createObjectCallback: ObjectsFactory.createMovingObject(ObjectType.fireBall)
    })

    this.checkArrows = new CheckHMovingObjects({
      player: this.player,
      limitRect: this.level.limitRect,
      createObjectCallback: ObjectsFactory.createMovingObject(ObjectType.arrow)
    })

    this.player.castAction.callback = this.checkFireballs.fire.bind(this.checkFireballs)
    this.player.bowAttackAction.callback = this.checkArrows.fire.bind(this.checkArrows)
    if (this.level.coinsStaticAnimation) {
      this.checkCoins = new CheckCoins(this.player, this.level.coinsStaticAnimation)
    } else {
      this.checkCoins = null
    }
  }

  getPlayerController(controller) {
    this.playerAnimation.controller = controller
    return new NinjaController(controller)
  }

  update() {
    this.env.update()
    this.checkFireballs.update()
    this.checkArrows.update()
    this.level.update()
    this.playerAnimation.update()
    this.enemies.update()

    this.hitBoxes = this.env.mobs.map(mob => this.hitBoxesHelper.getHitBoxes(mob)).flat()
      .concat(this.checkFireballs.objects.map(object => {
          return this.hitBoxesHelper.getHitBoxes(object, true)
        }).flat())
      .concat(this.checkArrows.objects.map(object => {
          return this.hitBoxesHelper.getHitBoxes(object, true)
        }).flat())

    this.checkCoins?.update(this.hitBoxesHelper.getHitBoxes(this.player))

    if (this.level.nextLevelGate && this.level.isCanMoveToTheNextLevel()) {
      if (CollisionDetected.isRectRect(this.player, this.level.nextLevelGate)) {
        this.createLevel(this.level.nextLevel)
      }
    }

    // if (this.level.prevLevelGate) {
    //   if (CollisionDetected.isRectRect(this.player, this.level.prevLevelGate)) {
    //     this.createLevel(this.level.prevLevel)
    //   }
    // }
  }
}