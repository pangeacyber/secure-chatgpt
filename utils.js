/* eslint-disable import/no-extraneous-dependencies */
import fs from "fs";
import chalk from "chalk";
import path from "path";
import prompts from "prompts";
import validateProjectName from "validate-npm-package-name";

const onPromptState = (state) => {
  if (state.aborted) {
    // If we don't re-enable the terminal cursor before exiting
    // the program, the cursor will remain hidden
    process.stdout.write("\x1B[?25h");
    process.stdout.write("\n");
    process.exit(1);
  }
};

export function validateNpmName(name) {
  const nameValidation = validateProjectName(name);
  if (nameValidation.validForNewPackages) {
    return { valid: true };
  }

  return {
    valid: false,
    problems: [
      ...(nameValidation.errors || []),
      ...(nameValidation.warnings || []),
    ],
  };
}

export function isPathAvailable(root, name) {
  const validFiles = [
    ".DS_Store",
    ".git",
    ".gitattributes",
    ".gitignore",
    ".gitlab-ci.yml",
    ".hg",
    ".hgcheck",
    ".hgignore",
    ".idea",
    ".npmignore",
    ".travis.yml",
    "LICENSE",
    "Thumbs.db",
    "docs",
    "mkdocs.yml",
    "npm-debug.log",
    "yarn-debug.log",
    "yarn-error.log",
    "yarnrc.yml",
    ".yarn",
  ];

  const conflicts = fs
    .readdirSync(root)
    .filter((file) => !validFiles.includes(file))
    // Support IntelliJ IDEA-based editors
    .filter((file) => !/\.iml$/.test(file));

  if (conflicts.length > 0) {
    console.log(
      `The directory ${chalk.green(name)} contains files that could conflict:`
    );
    console.log();
    for (const file of conflicts) {
      try {
        const stats = fs.lstatSync(path.join(root, file));
        if (stats.isDirectory()) {
          console.log(`  ${chalk.blue(file)}/`);
        } else {
          console.log(`  ${file}`);
        }
      } catch {
        console.log(`  ${file}`);
      }
    }
    console.log();
    console.log(
      "Either try using a new directory name, or remove the files listed above."
    );
    console.log();
    return false;
  }

  return true;
}

export const getUserInput = async (
  question,
  defaultValue,
  validateFunction,
  style = "default"
) => {
  const res = await prompts({
    onState: onPromptState,
    type: "text",
    name: "userInput",
    message: question,
    initial: defaultValue,
    validate: validateFunction,
    style: style,
  });

  if (typeof res.userInput === "string") {
    return res.userInput.trim();
  }
  return null;
};

//
// Validation functions for user inputs
//
export const validateAppName = (name) => {
  const validation = validateNpmName(path.basename(path.resolve(name)));
  if (validation.valid) {
    return true;
  }
  return "Invalid project name: " + validation.problems?.[0];
};

export const validateString = (key) => {
  if (typeof key === "string" && key.length > 0) {
    return true;
  }
  return "Invalid key";
};

export const validatePangeaServiceToken = (token) => {
  if (typeof token === "string" && token.startsWith("pts_")) {
    return true;
  }
  return "Invalid Service Token";
};

export const validatePangeaAuthClientHostedLoginURL = (url) => {
  try {
    if (typeof url === "string") {
      const urlObject = new URL(url.toLowerCase());
      const domain = urlObject?.hostname?.split(".")?.slice(-2).join(".");
      if (domain === "pangea.cloud") {
        return true;
      }
    }
  } catch (ex) {
    console.error(ex);
  }
  return "Invalid Hosted Login URL";
};

export const validatePangeaAuthClientToken = (token) => {
  if (typeof token === "string" && token.startsWith("pcl_")) {
    return true;
  }
  return "Invalid Auth Client Token";
};

export const replaceInFile = (filePath, oldValue, newValue) => {
  try {
    const contents = fs.readFileSync(filePath, { encoding: "utf-8" });
    // Replace the string
    const updated = contents.replace(oldValue, newValue);
    fs.writeFileSync(filePath, updated, { encoding: "utf-8" });
  } catch (ex) {
    console.error(ex);
  }
};

export const updateProjectNameInPackageJson = (projectDir, projectName) => {
  try {
    const pjsonPath = path.join(projectDir, "package.json");
    const projectPackage = fs.readFileSync(pjsonPath, { encoding: "utf-8" });
    const pjsonObject = JSON.parse(projectPackage);

    // Update the project's package.json with the new project name
    pjsonObject.name = projectName;
    const newValue = JSON.stringify(pjsonObject, null, 2);

    fs.writeFileSync(pjsonPath, newValue, { encoding: "utf-8" });
  } catch (ex) {
    console.error("Error updating package.json", ex);
  }
};
