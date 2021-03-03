export class Vector {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  static zero() {
    return new Vector(0, 0)
  }

  isZero() {
    return this.x === 0 && this.y === 0
  }

  copy() {
    return new Vector(this.x, this.y)
  }

  toString() {
    return `(${this.x}, ${this.y})`
  }

  length() {
    return Math.sqrt(this.x ** 2 + this.y ** 2)
  }

  equals(v) {
    return this.x === v.x && this.y === v.y
  }

  normalize() {
    const length = this.length()
    if (length !== 0) {
      this.divideBy(length)
    }
  }

  addTo(v) {
    if (v instanceof Vector) {
      this.x += v.x
      this.y += v.y
    } else {
      this.x += v
      this.y += v
    }

    return this
  }

  add(v) {
    return this.copy().addTo(v)
  }

  subtractFrom(v) {
    if (v instanceof Vector) {
      this.x -= v.x
      this.y -= v.y
    } else {
      this.x -= v.x
      this.y -= v.y
    }

    return this
  }

  subtract(v) {
    return this.copy().subtractFrom(v)
  }

  divideBy(v) {
    if (v instanceof Vector) {
      this.x /= v.x
      this.y /= v.y
    } else {
      this.x /= v
      this.y /= v
    }

    return this
  }

  divide(v) {
    return this.copy().divideBy(v)
  }

  multiplyWith(v) {
    if (v instanceof Vector) {
      this.x *= v.x
      this.y *= v.y
    } else {
      this.x *= v
      this.y *= v
    }

    return this
  }

  multiply(v) {
    return this.copy().multiplyWith(v)
  }

  distanceFrom(v) {
    return Math.sqrt((this.x - v.x) ** 2 + (this.y - v.y) ** 2)
  }

  // linear interpolate the vector to another vector
  lerp(x, y, amt) {
    if (x instanceof Vector) {
      return this.lerp(x.x, x.y, y)
    }
    if (amt > 1.0) {
      amt = 1.0
    }
    this.x += (x - this.x) * amt
    this.y += (y - this.y) * amt
    return this
  }
}