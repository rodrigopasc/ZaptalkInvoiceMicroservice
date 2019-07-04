# ZapTalk Invoice Microservice

<p align="center">
  <img src="https://rodrigotestssizeless.s3.amazonaws.com/uploads/microservices.png" width="25%" alt="Microservices" />
</p>

Fake invoice microservice example.
> This _event-driven_ microservice is just a mock that represents a invoice generator. 🧾

<p align="center">
  <img src="https://rodrigotestssizeless.s3.amazonaws.com/uploads/architecture-design-invoice.png" alt="Architecture Design" />
</p>

## Briefing
Assuming the goal is to build a highly scalable, robust, reliable checkout service that meets the standards of [AWS Well-Architected](https://aws.amazon.com/architecture/well-architected/), this project takes the most of the [serverless design pattern](https://amzn.to/2J3lEkD) and communicate with other microservices through [Amazon SNS](https://aws.amazon.com/sns/).

## Architecture
* [Checkout Microservice](https://github.com/rodrigopasc/ZaptalkCheckoutMicroservice)
  * It starts the checkout process by doing what the application needs and then communicate via SNS to the **invoice** microservice.
* **Invoice Microservice**
  * Generate its invoice file, uploads to S3 and communicate via SNS to both **logger** and **notification** microservices.
* [Logger Microservice](https://github.com/rodrigopasc/ZaptalkLoggerMicroservice)
  * Receive the information, customer details, generated invoice S3 URL and then persists on [DynamoDB](https://aws.amazon.com/dynamodb/).
* [Notification Microservice](https://github.com/rodrigopasc/ZaptalkNotificationMicroservice)
  * When the **invoice** microservice informs that the invoice itself was successfully generated, then this microservice sends the notification to the customer.

## Dependencies
* [Node.js](https://nodejs.org/en/)
* [Serverless](https://serverless.com/)
* [AWS Account](https://aws.amazon.com/)

## Setup
* Copy `secrets.json.example`, update with your information and rename it to `secrets.json`.
* Run `$ serverless config credentials -o --provider aws --key=YOUR_AWS_KEY --secret YOUR_AWS_SECRET`.
* Deploy to AWS `$ serverless deploy`.