const AWS = require('aws-sdk')
const SNS = new AWS.SNS({ region: process.env.region })
const S3 = new AWS.S3()
const fs = require('fs')

const publishSNSMessage = async (data, topic) => {
  const params = {
    Message: JSON.stringify(data),
    TopicArn: `arn:aws:sns:${process.env.region}:${process.env.accountId}:${topic}`
  }
  
  return SNS.publish(params).promise()
}

const generateInvoiceFile = async (customerId, fileName) => {
  const invoiceContent = `Generated invoice for ${customerId}`
  fs.writeFileSync(`/tmp/${fileName}`, invoiceContent)
}

module.exports.handle = async (event) => {
  const { customerId } = JSON.parse(event.Records[0].Sns.Message)
  const data = { customerId }

  const fileName = `${customerId}-invoice.txt`
  const generatedInovice = await generateInvoiceFile(customerId, fileName)
  const generatedInvoiceData = fs.readFileSync(`/tmp/${fileName}`)

  await S3.putObject({
    Bucket: process.env.bucket,
    ContentType: 'text/plain',
    Key: fileName,
    Body: generatedInvoiceData,
  }).promise()

  const invoiceFile = S3.getSignedUrl('getObject', { Bucket: process.env.bucket, Key: fileName })

  const notificationSNSMetadata = await publishSNSMessage(data, process.env.notificationSNS)
  const loggerSNSMetadata = await publishSNSMessage({ customerId, invoiceFile }, process.env.loggerSNS)

  console.log(`Invoice generated for customer ${customerId}.`)

  return { notificationSNSMetadata, loggerSNSMetadata }
}