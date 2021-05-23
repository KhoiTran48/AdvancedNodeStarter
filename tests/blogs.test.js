const CustomPage = require('./helpers/customPage')

let customPage
beforeEach(async() => {
    customPage = await CustomPage.build()
    await customPage.goto('http://localhost:3000')
})

afterEach(async()=>{
    await customPage.close()
})

describe('When logged in', async() => {
    beforeEach(async() => {
        await customPage.login()
        await customPage.click('a[href="/blogs/new"]')
    })

    test('When logged in, can see log create form', async()=>{
        const blogTitleLabel = await customPage.getContentsOf('.title label')
        expect(blogTitleLabel).toEqual('Blog Title')
    })

    describe('And using invalid inputs', async() => {
        beforeEach(async() => {
            await customPage.click('form button')
        })

        test('the form shows error message', async() => {
            const titleError = await customPage.getContentsOf('.title .red-text')
            const contentError = await customPage.getContentsOf('.content .red-text')

            expect(titleError).toEqual('You must provide a value')
            expect(contentError).toEqual('You must provide a value')
        })

    })

    describe('And using valid inputs', async() => {
        beforeEach(async() => {
            await customPage.type('.title input', 'My title')
            await customPage.type('.content input', 'My content')

            // click submit button
            await customPage.click('form button')
        })
        test('show review page after submit', async() => {
            const headerOfReviewPage = await customPage.getContentsOf('form h5')
            expect(headerOfReviewPage).toEqual('Please confirm your entries')
        })
        test('redirect to list blogs page after confirmation', async() => {

            // click save button
            await customPage.click('button.green')

            // wait for page /blogs appear
            await customPage.waitFor('.card')

            const title = await customPage.getContentsOf('.card-title')
            const content = await customPage.getContentsOf('p')

            expect(title).toEqual('My title')
            expect(content).toEqual('My content')
        })
    })
})

describe('User is not logged in', async () => {

    test('User cannot get a list of posts', async() => {
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

    
})
