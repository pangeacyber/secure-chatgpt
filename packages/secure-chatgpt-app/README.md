# Next.js and Pangea AuthN Example

## Introduction 

The Next.js and Pangea AuthN Example is a code repository that provides a simple way to add authentication to your Next.js web application using the Pangea AuthN service. It includes examples of how to implement user sign-up, sign-in, and sign-out functionality, how to protect client-side pages and API endpoints from public access. The example also includes instructions on setting up the Pangea AuthN service for your project and deploying your application. Most of the NextJS applications need authentication to protect specific pages and API endpoints from general public visibility. This example shows how you can easily add authentication to your NextJS app using the Pangea AuthN service.

## Features

The Pangea AuthN service is not limited to the following features:
- Sign up
- Sign in
- Sign out
- Protecting client-side pages
- Protecting API endpoints


## Use Pangea AuthN 

### Generating the sample app

- Make sure you have NodeJS installed on your system

- Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init), [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/), or [pnpm](https://pnpm.io) to bootstrap the example:

  ```bash
  npx create-next-app --example https://github.com/pangeacyber/pangea-integration-nextjs-authn
  ```

  The script will ask you to give your new app a name. (ex: my-app)
- `cd` into the newly created app folder
  ```bash
  cd my-app
  ```

- Copy the `.env.local.example` as `.env.local`

  ```bash
  cp .env.local.example .env.local
  ```

### Setup Pangea AuthN service

Navigate to the Pangea service config page and do the following:

- Enable the AuthN service for your project
- Go to the AuthN settings and customize as per your requirements
- Copy the necessary values from the service config into the `.env.local` file
- If you plan to use the AuthN service to protect your API endpoints, you must set up an AuthN service token and copy its value into your `.env.local` as `PANGEA_SERVICE_TOKEN`. For more information, see the `.env.local.example` file for the exact environment variable names

Once you have set the environment variables, open a terminal window, go to the root of your project, and run your favorite command `npm run dev`. Now, you have set up the Pangea AuthN service.

### Protecting Various Parts of the App

There are certain parts of an application that developers want to hide from the general public visibility and only make available to authenticated users. This example includes one example of protecting a client page and an example of protecting an API endpoint.

- Client components: Refer to the example in `/app/user/page.tsx` and wrap your components with the `pageWithAuthentication` higher-order component.

- API endpoints: Refer to the example in `/app/api/user/me/route.ts` and wrap your API handler with the `withAPIAuthentication` helper function.


## How to Deploy

You can deploy your project as any other NextJS app. Refer to the [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=next-example) ([Documentation](https://nextjs.org/docs/deployment)) for more information.
