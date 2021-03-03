export class Job {
  constructor() {
    this.completed = false
    this.callback = null
  }

  setCallback(callback) {
    this.callback = callback
  }

  jobComplete() {
    this.completed = true
    this.callback?.(this)
  }

  run() {
    //
  }
}