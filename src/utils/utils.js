export function fixDecimals (digits, round, precision) {
  // return parseFloat(digits.toFixed(config.decimals))
  // const ceros = (precision == 2) ? 100 : 1000
  const ceros = 10 ** precision
  // Math.ceil(x)
  // Devuelve el entero más pequeño mayor o igual que un número.
  if (round === 'up') return Math.ceil(digits * ceros) / ceros
  // Devuelve el máximo entero menor o igual a un número.
  else if (round === 'down') return Math.floor(digits * ceros) / ceros
  // no se redondea, se multiplica por el numero de decimales correspondientes a la cifra
  // luego se truca la parte entera
  // luego se divide para llevar la cifra a flotante
  else return Math.trunc(digits * ceros) / ceros
}

export function sumFix (x, y, precision) {
  // BigNumber.set({ DECIMAL_PLACES: precision,   ROUND_HALF_FLOOR: 5})
  // BigNumber.DEBUG = true
  const ceros = 10**precision
  /**
   * NOTE:  para evitar problemas con decimales:
   * - algunos valores no tienen los 3 decimales u 8 en caso de bitcoins, lo fixeo con toFixed, esto evita generar
   *  valores incorrectos al reemplazar el punto
   * - llevo todo a string, les elimino el punto y quedan  un entero string, incluso si es negativo
   * - luego los parseo a numero entero
   * - consideración, y puede ser negativo o positivo
   */
  const _x = (x == 0) ? x : parseInt(x.toFixed(precision).toString().replace('.',''))

  const _y = (y == 0) ? y : parseInt(y.toFixed(precision).toString().replace('.',''))

  // como no se sabe si el valor de _y es negativo, valido si y es menor que  0
  // si es  menos lo multiplico por -1
  // if (y < 0) _y = -1 * _y
  
  // if (_yCeil < 0) s = _xCeil - (-1 * _yCeil)
  // else s = _xCeil + _yCeil
  
  // s = _xCeil + _yCeil
  let s = _x + _y

  const result = Math.trunc(s)/ceros

  // --------------------------------------
  // let _x = new BigNumber(x)
  // let _y = new BigNumber(y)

  // // divido ambos  por ceros
  // _x = _x.multipliedBy(ceros)
  // _y = _y.multipliedBy(ceros)

  // // sumo o resto los  valores
  // let s = _x.plus(_y)

  // const result = s.dividedBy(ceros)

  console.log(
    `----------------------------------  SUMFIX   ---------------------------------------
    con decimales
    x: ${x}
    y: ${y}
    precision: ${precision}
    ceros: ${ceros}

    sin decimales
    _x: ${_x}
    _y: ${_y}

    s: ${s}
    result: ${result}
    ---------------------------------------------------------------------------------------`)
  return result
}

// export function ceroFix (x, precision) {
//   // BigNumber.set({ DECIMAL_PLACES: precision,   ROUND_HALF_FLOOR: 5})
//   // BigNumber.DEBUG = true
//   const ceros = 10**precision
//   /**
//    * NOTE:  para evitar problemas con decimales:
//    * - algunos valores no tienen los 3 decimales u 8 en caso de bitcoins, lo fixeo con toFixed, esto evita generar
//    *  valores incorrectos al reemplazar el punto
//    * - llevo todo a string, les elimino el punto y quedan  un entero string, incluso si es negativo
//    * - luego los parseo a numero entero
//    * - consideración, y puede ser negativo o positivo
//    */
//   const _x = (x == 0) ? x : parseInt(x.toFixed(precision).toString().replace('.',''))

//   // como no se sabe si el valor de _y es negativo, valido si y es menor que  0
//   // si es  menos lo multiplico por -1
//   // if (y < 0) _y = -1 * _y
  
//   // if (_yCeil < 0) s = _xCeil - (-1 * _yCeil)
//   // else s = _xCeil + _yCeil
  
//   // s = _xCeil + _yCeil
//   let s = _x

//   const result = Math.trunc(s)/ceros

//   // --------------------------------------
//   // let _x = new BigNumber(x)
//   // let _y = new BigNumber(y)

//   // // divido ambos  por ceros
//   // _x = _x.multipliedBy(ceros)
//   // _y = _y.multipliedBy(ceros)

//   // // sumo o resto los  valores
//   // let s = _x.plus(_y)

//   // const result = s.dividedBy(ceros)

//   /* console.log(
//     `----------------------------------  SUMFIX   ---------------------------------------
//     con decimales
//     x: ${x}
//     precision: ${precision}
//     ceros: ${ceros}

//     sin decimales
//     _x: ${_x}

//     s: ${s}
//     result: ${result}
//     ---------------------------------------------------------------------------------------`) */
//   return result
// }

export function ceroFix (x, precision) {
  let number = x === 0 || x === '0' ? 0 : Number.parseFloat(x)
  var factorConversion = Math.pow(10,precision)
  number = Math.round(number*factorConversion)/factorConversion
  if(String(number).indexOf('e') !== -1){
    let arrNumber = String(number).indexOf('e+') === -1 ? String(number).split('e-') : String(number).split('e+')
    number = Number(arrNumber[0]) 
    let exponent = Number(arrNumber[1])
    number = number*(10**exponent)
    return Number(number).toFixed(precision)
  }
  return Number(number)
}
