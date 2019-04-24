const transNumber = (count) => {
  if (count == 0) {
    return ''
  } else if (count < 10000) {
  	var count = (count || 0).toString(), result = '';
    while (count.length > 3) {
       result = ',' + count.slice(-3) + result;
       count = count.slice(0, count.length - 3);
    }
    if (count) { result = count + result; }
    return result
  } else {
    var f = Math.round(count/10000 * 100) / 100;
    var s = f.toString() + '万';
    return s;
  }
}

export default transNumber