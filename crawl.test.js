const { test, expect } = require('@jest/globals')
const { normalizeURL, getURLsFromHTML } = require('./crawl.js')
const jsdom = require("jsdom")
const { JSDOM } = jsdom


describe("normalizeURL()", () => {
  const http = "http://fake.url.com"
  const httpSlash = "http://fake.url.com/"
  const https = "https://fake.url.com"
  const httpsSlash = "https://fake.url.com/"
  const differentHttp = "http://fake2.url.com"

  test("should return the same url string from http and https", () => {
    expect(
      normalizeURL(https))
      .toEqual(normalizeURL(http)
      )
  })
  test("should return different urls from different paths", () => {
    expect(http + "/path1").not.toEqual(http + "/path2")

    expect(http + "/path").not.toEqual(http)
  })
  test("should return the same url even if there are ending '/'", () => {
    expect(
      normalizeURL(http))
      .toEqual(normalizeURL(httpSlash)
      )
    expect(
      normalizeURL(https))
      .toEqual(normalizeURL(httpsSlash)
      )
  })
  test("should not return the same url for different domains/subdomains", () => {
    expect(normalizeURL(http))
      .not.toEqual(normalizeURL(differentHttp))

  })
  test("should return strings only", () => {
    expect(typeof normalizeURL(http))
      .toBe("string")
  })
  test("should return 'invalid input' if input does not start with http or https", () => {
    expect(normalizeURL("testing"))
      .toBe("invalid input")
  })
  test("should return 'invalid input' if input does not have a domain", () => {
    expect(normalizeURL("http://test"))
      .toBe("invalid input")

    expect(normalizeURL("http://test."))
      .toBe("invalid input")

    expect(normalizeURL("http://test./"))
      .toBe("invalid input")

  })
  test("should return 'invalid input' if input is not a string", () => {
    expect(normalizeURL(3))
      .toBe("invalid input")

    expect(normalizeURL([]))
      .toBe("invalid input")

    expect(normalizeURL({})).toBe("invalid input")

  })
  test("should return 'invalid input' if input is empty", () => {
    expect(normalizeURL("")).
      toBe("invalid input")
  })
})

describe("getURLsFromHTML", () => {
  const absoluteHTML = `
  <html>
    <body>
      <a href="https://blog.boot.dev">
      Blog
      </a>
    </body>
  </html>
  `
  const relativeHTML = `
  <html>
    <body>
      <a href="/path/">
      Blog
      </a>
    </body>
  </html>
  `

  const multipleHTML = `
  <html>
    <body>
      <a href="/path1/">
      Blog
      </a>
      <a href="https://blog.boot.dev/path2/">
      Blog
      </a>
    </body>
  </html>
  `

  const invalidHTML = `
  <html>
    <body>
      <a href="not valid">
      Blog
      </a>
    </body>
  </html>
  `

  const baseURL = "https://blog.boot.dev"

  const absoluteExpected = ["https://blog.boot.dev/"]
  const relativeExpected = ["https://blog.boot.dev/path/"]
  const multipleExpected = [
    "https://blog.boot.dev/path1/",
    "https://blog.boot.dev/path2/"
  ]

  const invalidExpected = []

  test("should return links from htmlbody from absolute references", () => {
    expect(
      getURLsFromHTML(absoluteHTML, baseURL))
      .toEqual(absoluteExpected)
  })

  test("should return links from htmlbody from relative references", () => {
    expect(
      getURLsFromHTML(relativeHTML, baseURL))
      .toEqual(relativeExpected)
  })
  test("should return links from htmlbody from both relative and absolute references", () => {
    expect(
      getURLsFromHTML(multipleHTML, baseURL))
      .toEqual(multipleExpected)
  })
  test("should not return invalid links", () => {
    expect(
      getURLsFromHTML(invalidHTML, baseURL))
      .toEqual([])
  })
})