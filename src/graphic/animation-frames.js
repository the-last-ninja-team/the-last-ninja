import { Sprite } from './sprite'

export class AnimationFrames extends Sprite {
  constructor({ name, frames, width, height }) {
    super({
      name,
      sourceX: frames[0].sx,
      sourceY: frames[0].sy,
      width,
      height
    })

    this.frames = frames
  }

  setFrame(index) {
    this.sourceX = this.frames[index].sx
    this.sourceY = this.frames[index].sy
  }
}