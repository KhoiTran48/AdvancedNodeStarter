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

test('When signed in, shows logout button', async()=>{
    await customPage.login()
    const text = await customPage.getContentsOf('a[href="/auth/logout"]')
    expect(text).toEqual('Logout')
})

describe('User is not logged in', async () => {
    test('User cannot create blog post', async() => {
        const result = await customPage.evaluate(
            () => {
                return fetch('/api/blogs', {
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ title: 'My title', content: 'My content'})
                }).then(res => res.json())
            }
        )
        expect(result).toEqual({error: 'You must log in!'})
    })

    test.only('User cannot get a list of posts', async() => {
        const result = await customPage.evaluate(
            () => {
                return fetch('/api/blogs', {
                    method: 'GET',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                }).then(res => res.json())
            }
        )
        expect(result).toEqual({error: 'You must log in!'})
    })
})
