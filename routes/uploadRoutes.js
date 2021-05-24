const AWS = require('aws-sdk')
const keys = require('../config/keys')
const requireLogin = require('../middlewares/requireLogin')
const uuid = require('uuid/v1')

const s3 = new AWS.S3({
    accessKeyId: keys.accessKeyId,
    secretAccessKey: keys.secretAccessKey
})

module.exports = (app) => {
    app.get('/api/upload', requireLogin, (req, res) => {
        const fileName = `${req.user.id}/${uuid()}.jpeg`

        s3.getSignedUrl('putObject',
            {
                Bucket: 'my-blog-bucket-555',
                ContentType: 'image/jpeg',
                Key: fileName
            },
            (error, url) => { res.send({ fileName, url }) }
        )
    })
}
