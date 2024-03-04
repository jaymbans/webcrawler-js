const normalizeURL = (urlStr) => {
  try {
    const cleaned = new URL(urlStr)
    const host = cleaned.host

    if (!host.length
      || host.lastIndexOf(".") === host.length - 1
      || host.indexOf(".") === -1) {
      return "invalid input"
    }

    return host
  } catch (error) {
    return "invalid input"
  }
}

module.exports = {
  normalizeURL
}
