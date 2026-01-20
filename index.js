import { readdirSync, readFile, writeFile } from "fs";
import { resolve } from "path";
import readline from "readline";
import { fileURLToPath } from "url";
import { dirname } from "path";
import setup from "./config.json" with { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const blogFolder = resolve(setup.blog_folder);

console.log(blogFolder);

const hollas = [
  "Ola!",
  "Hello",
  "Bonjour!",
  "Hola!",
  "Ciao!",
  "こんにちは",
  "안녕하세요",
  "Namaste!",
  "Hallo!",
];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const config = {
  title: "",
  slug: "",
  mainheader: "",
  description: "",
};

const templatePath = resolve(__dirname, "templates");

const templateOptions = readdirSync(templatePath).filter((file) =>
  file.endsWith(".md"),
);
const defaultTemplate = templateOptions.find((file) => file === "default.md");

console.log(process.argv, defaultTemplate);

console.info(
  hollas[Math.floor(Math.random() * hollas.length)].toLocaleUpperCase(),
);

if (templateOptions.length === 0) {
  console.error("No templates found in the templates directory.");
  process.exit(1);
}

let selectedTemplate = "";

if (templateOptions.length === 1 && defaultTemplate) {
  console.info("Only the default template is available.");
  console.info("Using the default template.");
  selectedTemplate = defaultTemplate;

} else {
  const validTemplateIndices = templateOptions.map((_, index) => index + 1);
  console.info("Available templates:");
  templateOptions.forEach((file, index) => {
    console.info(`${index + 1}. ${file}`);
  });

  const answer = await askQuestion(
    "Select template by entering the corresponding index: ",
  );

  if (!validTemplateIndices.includes(parseInt(answer))) {
    console.error("No file mathing the selected index., sayonara!");
    process.exit(1);
  }

  const selected = templateOptions[parseInt(answer) - 1];
  console.info("Selected template:", selected);
  selectedTemplate = selected;
}

//required
const title = await askQuestion("note title/filename*: ", true);

//unrequired
const slug = await askQuestion("url-friendly slug: ");
const mainheader = await askQuestion("main header: ");
const description = await askQuestion("note description: ");

config.title = title;
config.slug = createProperSlug(slug) || createProperSlug(title);
config.mainheader = mainheader || title;
config.description = description || "A useful note.";

readFile(
  resolve(__dirname, "templates", selectedTemplate),
  { encoding: "utf8" },
  (err, data) => {
    console.log(resolve(__dirname, "templates", selectedTemplate));
    if (err) {
      console.error(
        "Something's not right with the template you give me: ",
        err,
      );
      process.exit(1);
    }

    let templateContent = data;
    Object.entries(config).forEach(([key, value]) => {
      const placeholder = `{{_${key}_}}`;
      templateContent = templateContent.replaceAll(placeholder, value);
    });

    // fix duplicate slug
    const existingFiles = readdirSync(blogFolder);
    let slug = config.slug;
    let counter = 1;
    let renamed = false;
    while (existingFiles.includes(slug + ".md")) {
      slug = `${config.slug}-${counter}`;
      counter++;
      renamed = true;
    }
    config.slug = slug;

    if (renamed) {
      console.info(
        `Note: The filename was modified to "${config.slug}.md" to avoid duplication.`,
      );
    }

    // copy to the human's zola blog folder
    writeFile(
      resolve(blogFolder, config.slug + ".md"),
      templateContent,
      "utf8",
      (err) => {
        if (err) {
          console.error("Error writing file, try again maybe", err);

          process.exit(1);
        }
        console.log(
          `\nYou're good to go at ${resolve(blogFolder, config.slug)}.md\n`,
        );
      },
    );

    rl.close();
  },
);

function askQuestion(question, required = false) {
  return new Promise((resolve) => {
    rl.question("\n" + question, (response) => {
      if (!required) {
        resolve(response);
        return;
      } else {
        if (!response.trim()) {
          console.info("required field");
          resolve(askQuestion(question, required));
        } else {
          resolve(response);
        }
      }
    });
  });
}

function createProperSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "-");
}
