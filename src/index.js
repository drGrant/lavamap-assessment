import './index.css'
function init () {
  import('./App').then(({ appFunctions }) => {
    appFunctions()
  })
}
init()
