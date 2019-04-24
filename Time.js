const formatDate = (date) => {
  var time = new Date(date)
  if (date > 0) {
    date = time.getTime()
    var now = new Date().getTime()
    var d = ''
    var h = ''
    var m = ''
    var y = ''
    if (now - date < 1000* 60 * 60 * 24) {
      if (now - date <= 1000 * 60) {
        return '刚刚'
      } else if (now - date < 1000 * 60 * 60) {
        return parseInt((now - date) / 1000 / 60) + '分钟前'
      } else {
        return Math.floor((now - date) / 1000 / 60 / 60) + '小时前'
      }
    } else if (new Date().getMonth() - new Date(date).getMonth() == 0 && new Date().getDate() - new Date(date).getDate() < 2) {
      h = new Date(date).getHours() < 10 ? '0' + new Date(date).getHours() : new Date(date).getHours()
      m = new Date(date).getMinutes() < 10 ? '0' + new Date(date).getMinutes() : new Date(date).getMinutes()
      return '昨天' + h + ':' + m
    } else if (new Date().getMonth() - new Date(date).getMonth() == 0 && new Date().getDate() - new Date(date).getDate() < 3) {
      h = new Date(date).getHours() < 10 ? '0' + new Date(date).getHours() : new Date(date).getHours()
      m = new Date(date).getMinutes() < 10 ? '0' + new Date(date).getMinutes() : new Date(date).getMinutes()
      return '前天' + h + ':' + m
    } else {
      if (new Date().getFullYear() - time.getFullYear() < 1) {
        m = time.getMonth() + 1 >= 10 ? time.getMonth()+ 1 : '0' + (time.getMonth()+ 1)
        d = time.getDate() >= 10 ? time.getDate() : '0' + time.getDate()
        return m + '-' + d
      } else {
        y = time.getFullYear()
        m = time.getMonth() + 1 >= 10 ? time.getMonth() + 1 : '0' + (time.getMonth()+1)
        d = time.getDate() >= 10 ? time.getDate() : '0' + time.getDate()
        return y + '-' + m + '-' + d
      }
    }
  } else {
    return ''
  }
}

export default formatDate