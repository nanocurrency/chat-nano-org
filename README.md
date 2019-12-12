# chat-nano-org

Landing page for Discord invite with CAPTCHA for preventing bots - hosted at chat.nano.org. This single page setup includes Javascript call to endpoint for getting single-use Discord invites to prevent bots from joining in waves using non-expiring, infinite use invites from Discord (those have been disabled).

## Web Deployment

- Automatic deployment of web page from master commits using GitHub pages (doesn't include Lambda single-use Discord links API)


## Discord Invites

- Discord Application "chat.nano.org" under the private "Nano Core" team contains a "chat.nano.org" bot added to the Nano server with Create Invite permissions
- Serverless CLI used on local machine to deploy AWS resources (see CloudFormation lambda-dev for details of S3, Lambda, Logs, IAM and API Gateway resources) to support Lambda function-backed API request endpoint for single-use Discord invites using the chat.nano.org bot token

### Deployment

Requires AWS IAM User with sufficient permissions for various resources needed for the Serverless service.

- Copy `example.env` to `.env` and update values
- From AWS IAM User get `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` and set environment variables on local machine
- Setup the serverless CLI https://serverless.com/framework/docs/providers/aws/guide/credentials/
- Run `serverless deploy` from lambda directory