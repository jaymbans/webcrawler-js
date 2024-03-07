const { argv } = require("node:process")
const { crawlPage } = require("./crawl.js")

async function main() {
  //exit if invalid CLI arguments
  if (argv.length !== 3) {
    console.log("Error, please use the following CLI commands")
    console.log('"npm run start [insert website URL]"')
    return
  }

  const baseURL = argv[2]

  console.log(`Processing webcrawler to [${baseURL}]...`)
  const pages = await crawlPage(baseURL)

  const sortedPages = []
  for (let page in pages) {
    sortedPages.push({ page, freq: pages[page] })
  }

  sortedPages.sort((a, b) => b.freq - a.freq)
  console.log("===================================")
  console.log("=============Output:===============")
  sortedPages.forEach(page => console.log(`Webhost: ${page.page} was hit ${page.freq} time${page.freq > 1 ? "s" : ""} from your base URL: ${baseURL}`))
  console.log("===================================")
}
main()
