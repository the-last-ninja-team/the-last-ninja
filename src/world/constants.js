import { TilesetSpriteSheet } from '../graphic/tileset-sprite-sheet'
import { Resources } from '../resources'
import { SpriteSheet } from '../graphic/sprite-sheet'

const SKELETON_TILES = Resources.getSprite('skeleton-tiles')
const FLYING_EYE_TILES = Resources.getSprite('flying-eye-tiles')
const GOBLIN_TILES = Resources.getSprite('goblin-tiles')
const MUSHROOM_TILES = Resources.getSprite('mushroom-tiles')

const NINJA_TILES = Resources.getSprite('ninja-tiles')
const NINJA_BOW_TILES = Resources.getSprite('ninja-bow-tiles')
const NINJA_SWORD_RUN_TILES = Resources.getSprite('ninja-sword-run-tiles')

export const ObjectType = {
  fireBall: {
    props: {
      key: 'fire-ball',
      width: 32,
      height: 12,
      speed: 10.5
    },
    tiles: () => ({
      frames: new SpriteSheet(Resources.getSprite('red-fire-ball-tiles'))
                      .getAnimationFrames(7, 8, 9, 10, 11, 12),
      delay: 2
    }),
    getPosition: (player) => ({
        x: player.directionX === -1 ? player.getRight() - 42 : player.getLeft() + 10,
        y: (player.getBottom() - player.hitBox.height) + (player.hitBox.height / 2) - 6
      })

  },
  arrow: {
    props: {
      key: 'arrow',
      width: 18,
      height: 3,
      speed: 18
    },
    tiles: () => ({
      frames: new SpriteSheet(Resources.getSprite('arrow'))
                      .getAnimationFrames(1),
      delay: 2
    }),
    getPosition: (player) => ({
      x: player.directionX === -1 ? player.getRight() - 28 : player.getLeft() + 10,
      y: (player.getBottom() - player.hitBox.height) + (player.hitBox.height / 2) - 2
    })
  }
}

export const PlayerType = {
  tiles: () => ({
    main: new TilesetSpriteSheet(NINJA_TILES, require('../assets/animation-maps/ninja.json')),
    bow: new TilesetSpriteSheet(NINJA_BOW_TILES, require('../assets/animation-maps/ninja-bow.json')),
    sword: new TilesetSpriteSheet(NINJA_SWORD_RUN_TILES, require('../assets/animation-maps/ninja-sword.json'))
  }),
  props: {
    width: 16,
    height: 16,
    jumpPower: 32,
    speed: 1.55,
    hitBox: { width: 16, height: 32 }
  }
}

export const EnemyType = {
  skeleton: {
    key: 'skeleton',
    tiles: () => new TilesetSpriteSheet(SKELETON_TILES, require('../assets/animation-maps/skeleton.json')),
    delays: {
      idle: 5,
      attack: 2,
      move: 2,
      dead: 2,
      block: 2,
      takeHit: 2
    },
    props: {
      width: 16,
      height: 16,
      jumpPower: 0,
      speed: 0.8,
      hitBox: { width: 32, height: 48 },
      isCanBlocking: true
    }
  },
  flyingEye: {
    key: 'flying-eye',
    tiles: () => new TilesetSpriteSheet(FLYING_EYE_TILES, require('../assets/animation-maps/flying-eye.json')),
    delays: {
      idle: 3,
      attack: 2,
      move: 2,
      dead: 2,
      block: 2,
      takeHit: 2
    },
    props: {
      width: 16,
      height: 16,
      jumpPower: 0,
      speed: 1.2,
      hitBox: { width: 32, height: 32 }
    }
  },
  goblin: {
    key: 'goblin',
    tiles: () => new TilesetSpriteSheet(GOBLIN_TILES, require('../assets/animation-maps/goblin.json')),
    delays: {
      idle: 5,
      attack: 2,
      move: 2,
      dead: 2,
      block: 2,
      takeHit: 2
    },
    props: {
      width: 16,
      height: 16,
      jumpPower: 0,
      speed: 1.65,
      hitBox: { width: 16, height: 32 }
    }

  },
  mushroom: {
    key: 'mushroom',
    tiles: () => new TilesetSpriteSheet(MUSHROOM_TILES, require('../assets/animation-maps/mushroom.json')),
    delays: {
      idle: 5,
      attack: 2,
      move: 2,
      dead: 2,
      block: 2,
      takeHit: 2
    },
    props: {
      width: 16,
      height: 16,
      jumpPower: 0,
      speed: 0.7,
      hitBox: { width: 16, height: 32 }
    }
  }
}