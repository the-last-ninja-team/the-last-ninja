import { Engine } from './engine'
import { Display } from './display'
import { Controller } from './controller'
import { Game } from './game'
import { MainCamera } from './main-camera'
import { Tools } from './tools';

import { ImageLoader } from './loaders/image-loader'
import { Resources } from './resources'

/**
 * Основной класс, который грузит ресурсы и управляет:
 * - игрой (где описывается логика и физика игры)
 * - дисплеем (наша канва)
 * - движком (запуск update/render функций)
 * - контроллером (нажатие клавиш)
 * */
export class Main {
  /**
   * Конструктор
   * @param timeStep - кол-во кадров в секунду (сейчас это 1000 / 30)
   * @param callback - колбэк, который нужно вызвать, когда будут подгружены все ресурсы
   * */
  constructor(timeStep, callback) {
    const root = document.getElementById('container')
    const elements = root.getElementsByTagName('canvas')

    let canvas
    if (elements.length) {
      // Если нашли ранее созданный, то возвращаем его
      canvas = elements[0]
    } else {
      canvas = document.createElement('canvas')
      root.appendChild(canvas)
    }

    this.keyDownUp = this.keyDownUp.bind(this)
    this.resize = this.resize.bind(this)
    this.render = this.render.bind(this)
    this.update = this.update.bind(this)

    this.tools = new Tools(this)

    this.controller = new Controller()
    this.camera = new MainCamera()
    this.display = new Display(canvas, this.camera)
    this.game = new Game(this.createLevel.bind(this))
    this.engine = new Engine(timeStep, this.update, this.render)
    this.playerController = this.game.world.getPlayerController(this.controller)

    window.addEventListener('resize', this.resize)
    window.addEventListener('keydown', this.keyDownUp)
    window.addEventListener('keyup', this.keyDownUp)

    // Грузим все ресурсы
    const imageLoader = new ImageLoader(Resources.getAllAssets())
    imageLoader.load().then(() => {
      this.display.setImages(imageLoader.images)
      callback?.(this)
    })
  }

  createLevel(level) {
    try {
      this.game.world.setLevel(level)
    } catch (e) {
      console.error(e)
      return
    }

    this.createLevelSprite()

    const { player } = this.game.world
    this.camera.watch(player)
    this.playerController.watch(player)
    this.tools.watch(player)

    this.resize()
    this.engine.start()
  }

  createLevelSprite() {
    const { key, map, spriteSheet, limitRect, cameraTrap, screenRect } = this.game.world.level
    const levelMap = {
      width: map.width,
      height: map.height,
      spriteWidth: map.tilewidth,
      spriteHeight: map.tileheight
    }
    this.game.world.level.levelSprite = this.display.createMap(
      key,
      {
        ...levelMap,
        layers: map.layers.filter(({ name, type }) => {
          return type === 'tilelayer' && name !== 'before-layer'
        })
      }, spriteSheet)

    this.game.world.level.beforeSprite = this.display.createMap(
      `${key}-before-sprite`,
      {
        ...levelMap,
        layers: map.layers.filter(({ name, type }) => {
          return type === 'tilelayer' && name === 'before-layer'
        })
      }, spriteSheet)

    // Создаем нужные спрайты уровня
    this.game.world.level.createImages(this.display, this.camera)

    // Устанавливаем размер канвы
    this.display.buffer.canvas.width = screenRect.width
    this.display.buffer.canvas.height = screenRect.height

    // Инициализируем камеру по параметрам уровня
    this.camera.init({ edgeRect: cameraTrap, limitRect, screenRect })
  }

  keyDownUp(event) {
    this.controller.keyDownUp(event.type, event.keyCode)
  }

  resize() {
    const { screenRect } = this.game.world.level
    this.display.resize(
      document.documentElement.clientWidth - 32,
      document.documentElement.clientHeight - 32,
      screenRect.height / screenRect.width)
    this.display.render()
  }

  /**
   * Здесь происходит отрисовка (рендер) всех объектов игры
   * TODO: надо сделать так, чтобы не руками добавлять, а где-то регистрировать объект
   */
  render() {
    // Цвет фона
    this.display.fill(this.game.world.backgroundColor)
    // Рисуем все что до карты уровня
    this.game.world.level.images.forEach(image => this.display.drawImg(image))
    // Рисуем параллакс, все что после бэкграунда и до карты уровня
    this.game.world.level.parallaxes.forEach(parallax => {
      parallax.images.forEach(image => this.display.drawImg(image))
    })
    // Рисуем карту уровня
    this.display.drawSprite(this.game.world.level.levelSprite)
    // Рисуем всю статичную анимацию (сейчас это монетки)
    this.game.world.level.staticAnimations.forEach(staticAnimation => {
      this.display.drawStaticAnimation(staticAnimation)
    })

    // Рисуем анимацию противников
    this.game.world.enemies.enemyAnimations.forEach(({ animation }) => {
      this.display.drawSprite(animation)
    })

    // Рисуем анимацию игрока
    this.display.drawSprite(this.game.world.playerAnimation.animation)

    // Рисуем все снаряды, которые находятся на экране
    const { checkFireballs, checkArrows } = this.game.world
    checkFireballs.objects.concat(checkArrows.objects).forEach(object => {
      const { width, height } = object
      this.display.drawSprite(object.ref.animation, { width, height })
    })

    // Рисуем, что должно быть поверх всего
    this.display.drawSprite(this.game.world.level.beforeSprite)

    // Если в режиме "Debug"
    this.tools.render()
    // Выводим на экран
    this.display.render()
  }

  // Здесь обновляем позиции объектов и "слушаем" ввод с клавиатуры
  update(time) {
    // Слушаем ввод с клавиатуры
    this.playerController.update()
    // Обновляем объекты самой игры
    this.game.update(time)
    // Обновляем координаты камеры
    this.camera.update()
    // Обновляем отладочные инструменты
    this.tools.update()
  }
}