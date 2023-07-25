// 千分符轉換
function numberComma(num) {
  if (num === undefined) {
    return ''
  }

  const [num1, num2] = num.toString().split('.')
  // 整數位部分新增千分位
  const formattedNumber = Number(num1).toLocaleString()

  return num2 !== undefined ? `${formattedNumber}.${num2}` : formattedNumber
}

export {
  numberComma,
}
