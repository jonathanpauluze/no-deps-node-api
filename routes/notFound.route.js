const notFoundRoute = (data, callback) => {
  callback(200, {
    name: 'sample!'
  })
}

export { notFoundRoute }
