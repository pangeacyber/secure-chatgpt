# secure-chatgpt

The goal of this boilerplate is to show how developers can use Pangea's various services to secure their own ChatGPT implementation.

We are using the following Pangea services:

- Auth Service: To add authentication to a NextJS App and prevent unauthenticated users from using ChatGPT
- Redact Service: To redact sensitive information from the user's prompt before the entry reaches to OpenAI API
- Audit Service: To audit the user prompts
- Reputation/Threat Intel services: To detect and neutralize the malicious URLs and domain names in the OPENAI API's responses. 

## Setup

During the generator script, you will need the following information ready:

- OpenAI API Key: If you haven't done so, please head over to the OpenAI site and register a user and get an API Key for using OpenAI services
- Pangea Service Token: Go to Pangea Console and create a service token that has access to AuthN, Redact, URL Intel, File Intel, and Audit services
- Pangea Domain: This is visible in the project settings at Pangea Console
- Pangea AuthN Client Token and URL: You need go to the AuthN settings of your project at Pangea Console, and copy the Authn Client Token, Hosted Login URL, and also add `http://localhost:3000` to the redirect list.
- While you are at the AuthN settings page, create a test user for yourself.

Now that you have the necessary information to go thru the setup

Run the following command, and enter the required information when you are prompted.

```
npx create-secure-chatgpt-app
```

Now you can `cd` into the newly generated app directory and run

```npm run dev```

If everything went well, you should be able to open a browser and navigate to ```http://localhost:3000``` 



