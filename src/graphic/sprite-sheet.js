import { Sprite } from './sprite'
import { AnimationFrames } from './animation-frames'

export class SpriteSheet {
  constructor({ name, width, height, spriteWidth, spriteHeight }) {
    this.name = name
    this.width = width
    this.height = height
    this.spriteWidth = spriteWidth
    this.spriteHeight = spriteHeight
  }

    getAnimationFramesWithKey(key, ...indexes) {
    const frames = this.getAnimationFrames(...indexes)
    frames.key = key

    return frames
  }

  getAnimationFrames(...indexes) {
    return new AnimationFrames({
      name: this.name,
      frames: (Array.isArray(indexes[0]) ? indexes[0] : indexes).map(index => ({
        sx: this.getSourceX(index),
        sy: this.getSourceY(index)
      })),
      width: this.spriteWidth,
      height: this.spriteHeight
    })
  }

  getSprite(index) {
    return new Sprite({
      name: this.name,
      sourceX: this.getSourceX(index),
      sourceY: this.getSourceY(index),
      width: this.spriteWidth,
      height: this.spriteHeight
    })
  }

  getSourceX(index) {
    return (-- index * this.spriteWidth) % this.width
  }

  getSourceY(index) {
    return Math.trunc((-- index * this.spriteWidth) / this.width) * this.spriteHeight
  }
}

