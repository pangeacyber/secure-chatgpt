# secure-chatgpt

The goal of this boilerplate is to show how developers can use Pangea's various services to secure their own ChatGPT implementation.

We are using the following Pangea services:

- Redact Service: To redact sensitive information from the user's prompt before the entry reaches to OpenAI API
- Audit Service: To audit the user prompts
- Reputation/Threat Intel services: To detect and neutralize the malicious URLs and domain names in the OPENAI API's responses. 

## Just add water

You will need an OpenAI API Key and Pangea Service Key

Run the following command

```
npx create-secure-chatgpt-app
```

