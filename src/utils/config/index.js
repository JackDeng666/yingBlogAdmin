let mode = 'prod'
const API_URL = mode === 'dev' ? 'https://localhost/' : 'https://anotherbug.cn/'
const UP_URL = mode === 'dev' ? 'https://localhost/' : 'https://anotherbug.cn/'

export {
  API_URL,
  UP_URL,
}
