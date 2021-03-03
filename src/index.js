import { Main } from './main'
import './styles/styles.css'
import { LEVELS } from './constants'

window.onload = () => {
  const query = String(window.location).split("?")[1];
  const [filter, value] = query?.split('=') ?? ''

  let level
  if (filter === 'level') {
    level = value
  }
  new Main(1000 / 30, (main) => {
    main.createLevel(level ?? LEVELS.level01)
  })
}