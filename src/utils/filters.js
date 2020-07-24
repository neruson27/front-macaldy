export default [
  {
    name: 'coinFormat',
    function: (value) => {
      // if (typeof value !== "number") return value
      let split = value.toString().split('.')
      split[0] = split[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      return split.join('.')
    }
  }
]
