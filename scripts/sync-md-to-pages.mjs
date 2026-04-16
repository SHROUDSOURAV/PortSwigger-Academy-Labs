import fs from "node:fs/promises";
import path from "node:path";

const projectRoot = process.cwd();
const contentRoot = path.join(projectRoot, "content");

const EXCLUDE_DIRS = new Set([
  ".git",
  ".next",
  "node_modules",
  "pages",
  "content",
  "styles",
  "scripts"
]);

const normalizeForRoute = (segment) => segment.replace(/\\/g, "/");

const toRoutePath = (relativePath) => {
  const normalized = normalizeForRoute(relativePath).trim();
  if (!normalized) return "/";
  return `/${normalized
    .split("/")
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join("/")}`;
};

const convertToPagePath = (relativeFilePath) => {
  const parsed = path.parse(relativeFilePath);
  const dirPath = normalizeForRoute(parsed.dir);
  return path.join(contentRoot, dirPath, `${parsed.name}.mdx`);
};

const walkMarkdownFiles = async (dir) => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const markdownFiles = [];

  for (const entry of entries) {
    if (EXCLUDE_DIRS.has(entry.name)) {
      continue;
    }

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const nested = await walkMarkdownFiles(fullPath);
      markdownFiles.push(...nested);
      continue;
    }

    if (!entry.isFile() || !(entry.name.toLowerCase().endsWith(".md") || entry.name.toLowerCase().endsWith(".mdx"))) {
      continue;
    }

    markdownFiles.push(fullPath);
  }

  return markdownFiles;
};

const exists = async (targetPath) => {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
};

const clearGeneratedPages = async () => {
  const entries = await fs.readdir(contentRoot, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === "index.mdx") {
      continue;
    }
    await fs.rm(path.join(contentRoot, entry.name), { recursive: true, force: true });
  }
};

const run = async () => {
  await fs.mkdir(contentRoot, { recursive: true });
  await clearGeneratedPages();

  const markdownFiles = await walkMarkdownFiles(projectRoot);
  const directories = new Set();
  const directoryEntries = new Map();

  const ensureDirectoryRecord = (relativeDir) => {
    if (!directoryEntries.has(relativeDir)) {
      directoryEntries.set(relativeDir, { folders: new Set(), pages: new Set() });
    }
    return directoryEntries.get(relativeDir);
  };

  const addDirectoryAncestors = (relativeDir) => {
    const normalizedDir = normalizeForRoute(relativeDir);
    if (!normalizedDir) return;

    const parts = normalizedDir.split("/").filter(Boolean);
    for (let i = 0; i < parts.length; i += 1) {
      const current = parts.slice(0, i + 1).join("/");
      directories.add(current);
      ensureDirectoryRecord(current);
      if (i > 0) {
        const parent = parts.slice(0, i).join("/");
        ensureDirectoryRecord(parent).folders.add(parts[i]);
      }
    }
  };

  const addTopicDirectories = async (relativeDir) => {
    const absoluteDir = path.join(projectRoot, relativeDir);
    if (!(await exists(absoluteDir))) return;

    addDirectoryAncestors(relativeDir);
    const entries = await fs.readdir(absoluteDir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      if (entry.name === "Images") continue;
      const childRelative = normalizeForRoute(path.join(relativeDir, entry.name));
      addDirectoryAncestors(childRelative);
      await addTopicDirectories(childRelative);
    }
  };

  for (const absoluteFilePath of markdownFiles) {
    const relativeFilePath = path.relative(projectRoot, absoluteFilePath);
    const targetPagePath = convertToPagePath(relativeFilePath);
    const targetDir = path.dirname(targetPagePath);
    await fs.mkdir(targetDir, { recursive: true });

    const source = await fs.readFile(absoluteFilePath, "utf8");
    await fs.writeFile(targetPagePath, source, "utf8");

    const parsed = path.parse(relativeFilePath);
    const relativeDir = normalizeForRoute(parsed.dir);
    addDirectoryAncestors(relativeDir);
    ensureDirectoryRecord(relativeDir).pages.add(parsed.name);

    const sourceImagesDir = path.join(path.dirname(absoluteFilePath), "Images");
    const targetImagesDir = path.join(targetDir, "Images");
    if (await exists(sourceImagesDir)) {
      await fs.cp(sourceImagesDir, targetImagesDir, { recursive: true });
    }
  }

  for (const topicRoot of ["Server Side Topics", "Client Side Topics"]) {
    await addTopicDirectories(topicRoot);
  }

  for (const relativeDir of Array.from(directories).sort()) {
    const sectionDir = path.join(contentRoot, relativeDir);
    const sectionPath = path.join(sectionDir, "index.mdx");
    await fs.mkdir(sectionDir, { recursive: true });
    const entry = ensureDirectoryRecord(relativeDir);
    const folderLinks = Array.from(entry.folders)
      .sort((a, b) => a.localeCompare(b))
      .map((folder) => `- [${folder}](${toRoutePath(path.posix.join(relativeDir, folder))})`);
    const pageLinks = Array.from(entry.pages)
      .sort((a, b) => a.localeCompare(b))
      .map((page) => `- [${page}](${toRoutePath(path.posix.join(relativeDir, page))})`);

    const title = relativeDir.split("/").filter(Boolean).at(-1) || "Section";
    const sections = [];
    if (folderLinks.length) {
      sections.push("## Folders", ...folderLinks);
    }
    if (pageLinks.length) {
      sections.push("## Pages", ...pageLinks);
    }

    const listingContent = [`# ${title}`, "", ...sections].join("\n");
    await fs.writeFile(sectionPath, `${listingContent}\n`, "utf8");
  }

  console.log(`Synced ${markdownFiles.length} markdown files to content/.`);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
