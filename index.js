#! /usr/bin/env node

/* eslint-disable import/no-extraneous-dependencies */
import chalk from "chalk";
import { Command } from "commander";
import fs from "fs";
import path from "path";
import url from "url";
import spawnSync from "child_process";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import packageJson from "./package.json" assert { type: "json" };
import {
  isPathAvailable,
  validateNpmName,
  getUserInput,
  validateAppName,
  validatePangeaAuthClientHostedLoginURL,
  validatePangeaAuthClientToken,
  validatePangeaServiceToken,
  validateString,
  replaceInFile,
  updateProjectNameInPackageJson,
} from "./utils.js";

const handleSigTerm = () => process.exit(0);

process.on("SIGINT", handleSigTerm);
process.on("SIGTERM", handleSigTerm);

// CLI argument parser
const program = new Command(packageJson.name)
  .version(packageJson.version)
  .option(
    "--pangeaToken <pangea-token>",
    `
        Specify pangea token.
    `
  )
  .option(
    "--openAIToken <open-ai-token>",
    `
        Specify pangea token.
    `
  )
  .allowUnknownOption()
  .parse(process.argv);

const cloneTemplate = (projectDir) => {
  const templateDir = path.resolve(__dirname, "template");
  fs.cpSync(templateDir, projectDir, { recursive: true });
};

const collectUserEntry = async () => {
  let projectPath;
  let openAIKey;
  let pangeaServiceToken;
  let pangeaServiceDomain;
  let pangeaAuthClientToken;
  let pangeaAuthClientHostedLoginURL;
  let root;

  // Get the project name from the user and make sure it is valid
  console.log("Welcome to the Secure ChatGPT App generator!");
  console.log(
    "This utility will walk you through creating a new Secure ChatGPT App."
  );
  console.log("Press ^C at any time to quit.");
  console.log("");
  console.log(
    "This application uses OpenAI API to provide ChatGPT functionality, and Pangea SDKs to provide security functions."
  );
  console.log(
    "We need you to get an API key from OpenAI also the following values from the Pangea console:"
  );
  console.log(
    " - Pangea Service Token which has access to Authn, Redact, Secure Audit Log, Domain Intel, and URL Intel services (ex pts_xxxxxx"
  );
  console.log(" - Pangea service domain (ex: aws.us.pangea.cloud)");
  console.log(" - Pangea AuthN client token (ex: pcl_xxxxxx)");
  console.log(
    " - Pangea AuthN hosted login url (ex: https://xxxxxx.login.aws.us.pangea.cloud)"
  );
  console.log("");
  console.log("");

  console.log(
    "Let's start with the project name. This will be the name of the project directory, and the name of the project in package.json."
  );

  while (!projectPath) {
    const userPath = await getUserInput(
      "What is the name of your project?",
      "my-secure-chatgpt-app",
      validateAppName
    );

    const resolvedProjectPath = path.resolve(userPath);
    const projectName = path.basename(resolvedProjectPath);
    const { valid, problems } = validateNpmName(projectName);

    if (!valid) {
      console.error(
        `Could not create a project called ${chalk.red(
          `"${projectName}"`
        )} because of npm naming restrictions:`
      );

      problems?.forEach((p) => console.error(`${chalk.red.bold("*")} ${p}`));
    }

    /**
     * Verify the project dir is empty or doesn't exist
     */
    root = path.resolve(resolvedProjectPath);
    const appName = path.basename(root);
    const folderExists = fs.existsSync(root);

    if (folderExists && !isPathAvailable(root, appName)) {
      console.error(
        "The path already exists, please pick another name for your app"
      );
    } else {
      projectPath = userPath;
    }
  }

  console.log("");
  while (!openAIKey) {
    openAIKey = await getUserInput(
      "OpenAI API Key?",
      null,
      validateString,
      "password"
    );
  }

  console.log("");
  while (!pangeaServiceToken) {
    pangeaServiceToken = await getUserInput(
      "Pangea Service Token?",
      null,
      validatePangeaServiceToken,
      "password"
    );
  }

  console.log("");
  while (!pangeaServiceDomain) {
    pangeaServiceDomain = await getUserInput("Pangea Domain?", null);
  }

  console.log("");
  while (!pangeaAuthClientToken) {
    pangeaAuthClientToken = await getUserInput(
      "Pangea AuthN Client Token?",
      null,
      validatePangeaAuthClientToken
    );
  }

  console.log("");
  while (!pangeaAuthClientHostedLoginURL) {
    pangeaAuthClientHostedLoginURL = await getUserInput(
      "Pangea AuthN Hosted Login URL?",
      null,
      validatePangeaAuthClientHostedLoginURL
    );
  }

  return {
    root,
    projectPath,
    openAIKey,
    pangeaServiceToken,
    pangeaServiceDomain,
    pangeaAuthClientToken,
    pangeaAuthClientHostedLoginURL,
  };
};

// Main function that does the job
const run = async () => {
  const userEntry = await collectUserEntry();
  console.log(
    "We got what we need from you, now we will generate the Secure ChatGPT app! This might take short while so please be patient...."
  );
  console.log("");
  cloneTemplate(userEntry.root);
  updateProjectNameInPackageJson(userEntry.root, userEntry.projectPath);

  // Copy example env file to .env.local
  const exampleEnvFile = path.join(userEntry.root, ".env.local.example");
  const envFile = path.join(userEntry.root, ".env.local");
  fs.cpSync(exampleEnvFile, envFile);

  // Replace the values in the .env.local file

  replaceInFile(
    envFile,
    "$NEXT_PUBLIC_PANGEA_DOMAIN$",
    userEntry.pangeaServiceDomain
  );
  replaceInFile(
    envFile,
    "$NEXT_PUBLIC_AUTHN_CLIENT_TOKEN$",
    userEntry.pangeaAuthClientToken
  );
  replaceInFile(
    envFile,
    "$NEXT_PUBLIC_AUTHN_HOSTED_LOGIN_URL$",
    userEntry.pangeaAuthClientHostedLoginURL
  );
  replaceInFile(
    envFile,
    "$PANGEA_SERVICE_TOKEN$",
    userEntry.pangeaServiceToken
  );
  replaceInFile(envFile, "$OPENAI_API_KEY$", userEntry.openAIKey);

  // Run `npm install` in the project directory to install
  spawnSync.spawnSync("npm", ["install"], {
    stdio: "inherit",
    cwd: userEntry.root,
  });

  console.log("Success! Your new project is ready.");
  console.log(`Created ${userEntry.projectPat} at ${userEntry.root}`);
};

// handle general failures here
const handleFailure = async (reason) => {
  console.log();
  console.log("Aborting installation.");
  if (reason.command) {
    console.log(`  ${chalk.cyan(reason.command)} has failed.`);
  } else {
    console.log(
      chalk.red("Unexpected error. Please report it as a bug:") + "\n",
      reason
    );
  }
  console.log();
  process.exit(1);
};

// Let's run the script
run().catch(handleFailure);
