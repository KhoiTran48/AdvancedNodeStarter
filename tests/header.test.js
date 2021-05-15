const CustomPage = require('./helpers/customPage')

let customPage
beforeEach(async() => {
    customPage = await CustomPage.build()
    await customPage.goto('localhost:3000')
})

afterEach(async()=>{
    await customPage.close()
})

test('the header has  the correct text', async () => {
    const text = await customPage.getContentsOf('a.brand-logo')
    expect(text).toEqual('Blogster')
})

test('clicking login starts oauth flow', async()=>{
    await customPage.click('.right a')
    const url = await customPage.url()
    console.log(url)
})

test.only('When signed in, shows logout button', async()=>{
    await customPage.login()
    const text = await customPage.getContentsOf('a[href="/auth/logout"]')
    expect(text).toEqual('Logout')
})
