const jsdom = require("jsdom");
const { JSDOM } = jsdom;

/**
 * 
 * @param {*} baseURL 
 * @param {*} currentURL 
 * @param {*} pages 
 * @returns An object with webhosts as keys and frequency of the mnumber of links on a page as values
 */
const crawlPage = async (baseURL, currentURL = baseURL, pages = {}) => {
  const normalizedCurrentURL = normalizeURL(currentURL)

  if (normalizedCurrentURL in pages) {
    pages[normalizedCurrentURL]++
    return pages
  }

  if (!(normalizedCurrentURL in pages)) {
    pages[normalizedCurrentURL] = 1
  }

  console.log(`Crawling [${currentURL}]...`)
  try {
    //fetch response and validate
    const response = await fetch(currentURL)

    if (response.status === 400) {
      console.log("Error - Bad Request")
      return pages
    }

    const contentType = response.headers.get("content-type")

    if (!contentType.includes("text/html")) {
      console.log("Error - Web Address needs to be in HTML format")
      return pages
    }

    const baseURLCheck = new URL(baseURL)
    const currentURLCheck = new URL(currentURL)
    if (baseURLCheck.host !== currentURLCheck.host) {
      return pages
    }

    //Convert HTML and recursively crawl other links
    const html = await response.text()
    const urls = getURLsFromHTML(html, currentURL)

    for (let url of urls) {
      pages = await crawlPage(baseURL, url, pages)
    }
    return pages

  } catch (error) {
    console.log(error)
    return
  }

}

/**
 * normalizeURL takes in a string and input and returns the host of a url if the string is valid
 * @param {string} urlStr 
 * @returns url host string if valid input, and "invalid input" if not
 */
const normalizeURL = (urlStr) => {
  try {
    const cleaned = new URL(urlStr)
    const host = cleaned.host

    if (!host.length
      || host.lastIndexOf(".") === host.length - 1
      || host.indexOf(".") === -1) {
      return "invalid input"
    }

    return "https://" + host
  } catch (error) {
    return "invalid input"
  }
}

/**
 * 
 * @param {*} htmlBody 
 * @param {*} baseURL 
 * @returns a list of anchor tags from a website
 */
const getURLsFromHTML = (htmlBody, baseURL) => {
  const urls = []
  const dom = new JSDOM(htmlBody)
  const links = dom.window.document.querySelectorAll("a")

  links.forEach(link => {
    if (link.href.slice(0, 1) === "/") {
      //relative
      try {
        const urlObj = new URL(link.href, baseURL)
        urls.push(urlObj.href)
      } catch (error) {
        console.log(error.message)
      }
    } else {
      //absolute
      try {
        const urlObj = new URL(link.href)
        urls.push(urlObj.href)
      } catch (error) {
        console.log(error.message)
      }
    }
  })

  return urls
}

module.exports = {
  normalizeURL,
  getURLsFromHTML,
  crawlPage
}
