const ppteer = require('puppeteer')

class CustomPage {
    static async build() {
        const browser = await ppteer.launch({
            headless: false
        })
        const page = await browser.newPage()
        const customPage = new CustomPage(page)

        return new Proxy(customPage, {
            get(target, property) {
                return target[property] || browser[property] || page[property]
            }
        })
    }

    constructor(page) {
        this.page = page
    }
}

module.exports = CustomPage
