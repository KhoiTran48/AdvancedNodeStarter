const ppteer = require('puppeteer')
const sessionFactory = require('../factories/sessionFactory')
const userFactory = require('../factories/userFactory')

class CustomPage {
    static async build() {
        const browser = await ppteer.launch({
            // headless: false
            headless: true,
            args: ['--no-sandbox']
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

    async login() {
        const user = await userFactory()
        const { session, sig } = sessionFactory(user)

        await this.page.setCookie({ name: 'session', value: session})
        await this.page.setCookie({ name: 'session.sig', value: sig})
        await this.page.goto('http://localhost:3000/blogs')
    }

    async getContentsOf(selector) {
        // chromium take so long to generate the page
        // so the test have to wait until the selected element is appear on the page
        // using waitFor
        // if waiting more than 5000ms, we will take timeout
        await this.page.waitFor(selector)
        return await this.page.$eval(selector, el => el.innerHTML)
    }
}

module.exports = CustomPage
