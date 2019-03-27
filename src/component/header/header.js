import _ from 'lodash'
console.log('header.js')
function header () {
  let str = 'str'
  return _.merge(str, 'header')
}
export default header
