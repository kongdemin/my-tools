import { Dimensions, Platform } from 'react-native';

const isPhoneAvailable = (phone) => {
  let myreg = /^1[0-9]{10}$/
  if (!myreg.test(phone)) {
    return false
  } else {
    return true
  }
}

const isAutoCode = code => {
  let myreg = /[0-9]{6}$/
  if (!myreg.test(code)) {
    return false
  } else {
    return true
  }
}

const isAutoNumber = (str) => {
  var num = (num || 0).toString(), result = '';
  while (num.length > 3) {
      result = ',' + num.slice(-3) + result;
      num = num.slice(0, num.length - 3);
  }
  if (num) { result = num + result; }
  return result;
}

const isIphoneX = () => {
  let dimen = Dimensions.get('window');
  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (dimen.height >= 812 || dimen.width >= 812)
  );
}

export {
  isPhoneAvailable,
  isAutoCode,
  isAutoNumber,
  isIphoneX
}
