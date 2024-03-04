const { test, expect } = require('@jest/globals')
const { normalizeURL } = require('./crawl.js')

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