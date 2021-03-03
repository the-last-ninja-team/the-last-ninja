export class AnimationSets {
  constructor(sets) {
    this.sets = sets
    this.index = 0
  }

  reset() {
    this.index = 0
  }

  equals(animation) {
    return !!this.sets.find(set => set === animation)
  }

  next() {
    const animation = this.sets[this.index]
    this.index ++
    if (this.index > this.sets.length - 1) {
      this.index = 0
    }

    return animation
  }
}