import { NinjaAnimation } from './animation/ninja-animation'
import { NinjaController } from './controllers/ninja-controller'

import { ObjectsFactory } from './objects/objects-factory'
import { CollideObject } from './collide-object'
import { Enemies } from './enemies';

import { Level01 } from './levels/level-01'
import { Level02 } from './levels/level-02'
import { LevelRaycastTest } from './levels/level-raycast-test'

import { CheckCoins } from './checks/check-coins'
import { CheckHMovingObjects } from './checks/check-hmoving-objects'

import { Environment } from './environment'
import { checkRectCollision } from '../utils'
import { ObjectType, PlayerType } from './constants'

export class World {
  constructor({ friction = 0.85, gravity = 2, createLevel }) {
    // Цвет фона
    this.backgroundColor = 'grey'
    this.createLevel = createLevel

    this.collider = new CollideObject()
    this.env = new Environment(friction, gravity, this.collider)
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
      case 'RaycastTest':
        this.level = new LevelRaycastTest()
        break
      default:
        throw new Error(`Unsupported level value ${level}`)
    }

    this.initLevel()
  }

  initLevel() {
    const { x, y } = this.level.playerPosition
    this.player = ObjectsFactory.createPlayer(x, y, PlayerType.props)
    this.collider.setLevel(this.level)

    this.env.init(this.level.limitRect)
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

    this.level.collisionRects = this.env.getAllCollisionRects()
      .concat(this.checkFireballs.objects.map(object => {
          return this.collider.getCollisionRects(object, true)
        }).flat())
      .concat(this.checkArrows.objects.map(object => {
          return this.collider.getCollisionRects(object, true)
        }).flat())
    this.checkCoins?.update(this.env.getMobCollisionRects(this.player))

    if (this.level.nextLevelGate && this.level.isCanMoveToTheNextLevel()) {
      if (checkRectCollision(this.player, this.level.nextLevelGate)) {
        this.createLevel(this.level.nextLevel)
      }
    }

    // if (this.level.prevLevelGate) {
    //   if (checkRectCollision(this.player, this.level.prevLevelGate)) {
    //     this.createLevel(this.level.prevLevel)
    //   }
    // }
  }
}