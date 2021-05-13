const ppteer = require('puppeteer')
const sessionFactory = require('./factories/sessionFactory')
const userFactory = require('./factories/userFactory')

let browser, page
beforeEach(async() => {
    browser = await ppteer.launch({
        headless: false
    })
    page = await browser.newPage()
    await page.goto('localhost:3000')
})

afterEach(async()=>{
    await browser.close()
})

test('the header has  the correct text', async () => {
    const text = await page.$eval('a.brand-logo', el => el.innerHTML)
    expect(text).toEqual('Blogster')
})

test('clicking login starts oauth flow', async()=>{
    await page.click('.right a')
    const url = await page.url()
    console.log(url)
})

test.only('When signed in, shows logout button', async()=>{
    const user = await userFactory()
    const { session, sig } = sessionFactory(user)

    await page.setCookie({ name: 'session', value: session})
    await page.setCookie({ name: 'session.sig', value: sig})
    await page.goto('localhost:3000')

    // chromium take so long to generate the page
    // and the test is not see the element 'a[href="/auth/logout"]'
    // so the expectation is fail
    // so the test have to wait until the element is appear on the page
    // using waitFor
    // if waiting more than 5000ms, we will take timeout
    // and test is fail
    // -> let's try :))
    await page.waitFor('a[href="/auth/logout"]')
    const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML)
    expect(text).toEqual('Logout')
})
