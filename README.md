## Zolander

Just a more robust version of Davead's Zola quick note initializer https://github.com/daveads/daveads.github.io/blob/main/scripts/create_md.py

* added templates choices ( extensible )
* configuration files
* actually useful input validations


> Dude should be thanking me :)

---

## What it does

A simple CLI tool for quickly creating markdown notes for your Zola blog. Run it, answer a few questions, and boom - new note ready to go in your content folder.

## Setup

1. Clone this thing
2. `npm insta (oh wait, there's no deps!)
3. Edit `config.json` and set your blog folder path

```json
{
  "blog_folder": "path/to/your/zola/content/notes"
}
```

## Usage

```bash
node index.js
```

Then follow the prompts:
- Pick a template
- Enter a title (required)
- Optionally add a slug, main header, and description

The script handles duplicate filenames by adding a number suffix like `note-1.md`, `note-2.md`, etc.

## Templates

Templates live in the `templates/` folder. They're just markdown files with placeholders:

- `{{_title_}}` - the note title
- `{{_slug_}}` - url-friendly slug
- `{{_mainheader_}}` - main heading
- `{{_description_}}` - note description

Add your own templates by dropping `.md` files in the templates directory. They'll show up as options when you run the script.

## Example template

```markdown
+++
title = "{{_title_}}"
slug = "{{_slug_}}"
description = "{{_description_}}"
+++

# {{_mainheader_}}

Write something cool here.
```

---

That's it. Simple stuff.