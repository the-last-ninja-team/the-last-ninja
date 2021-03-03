export class MobAction {
  constructor(key, callback) {
    this.canDoAction = true
    this.action = false
    this.key = key
    this.callback = callback

    this.timer = 0
    this.clear = this.clear.bind(this)
  }

  fire() {
    if (this.canDoAction) {
      console.debug('Action fired', this.key)
      this.canDoAction = false
      this.action = true

      // Запускаем таймаут сброса действия, если они не было произведено
      this.timer = setTimeout(() => {
        console.debug('Action canceled by timeout', this.key)
        this.clear()
      }, 1000)
    }
  }

  clear() {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = 0
    }

    this.canDoAction = true
    this.action = false
  }

  done() {
    if (this.action) {
      this.action = false
      this.callback?.()
      console.debug('Action done', this.key)
    }
  }
}