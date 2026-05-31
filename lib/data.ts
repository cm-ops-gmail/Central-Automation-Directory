import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { ProjectsData } from "../app/types";

const LOCAL_PATH = join(process.cwd(), "data/projects.json");
const REPO = "cm-ops-gmail/Central-Automation-Directory";
const REPO_FILE = "data/projects.json";
const API = "https://api.github.com";

// ── GitHub helpers ────────────────────────────────────────────────────────

async function ghGet(): Promise<{ data: ProjectsData; sha: string }> {
  const res = await fetch(`${API}/repos/${REPO}/contents/${REPO_FILE}`, {
    headers: {
      Authorization: `token ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
    },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`GitHub read failed: ${res.status}`);
  const json = await res.json();
  const content = Buffer.from(json.content, "base64").toString("utf-8");
  return { data: JSON.parse(content), sha: json.sha };
}

async function ghSet(data: ProjectsData): Promise<void> {
  const { sha } = await ghGet();
  const content = Buffer.from(JSON.stringify(data, null, 2)).toString("base64");
  const res = await fetch(`${API}/repos/${REPO}/contents/${REPO_FILE}`, {
    method: "PUT",
    headers: {
      Authorization: `token ${process.env.GITHUB_TOKEN}`,
      "Content-Type": "application/json",
      Accept: "application/vnd.github.v3+json",
    },
    body: JSON.stringify({
      message: "chore: update automation hub data",
      content,
      sha,
    }),
  });
  if (!res.ok) throw new Error(`GitHub write failed: ${res.status}`);
}

// ── Public API ────────────────────────────────────────────────────────────

const useGitHub = () => !!process.env.GITHUB_TOKEN;

export async function getData(): Promise<ProjectsData> {
  if (useGitHub()) {
    const { data } = await ghGet();
    return data;
  }
  return JSON.parse(readFileSync(LOCAL_PATH, "utf-8"));
}

export async function setData(data: ProjectsData): Promise<void> {
  if (useGitHub()) {
    await ghSet(data);
    return;
  }
  writeFileSync(LOCAL_PATH, JSON.stringify(data, null, 2), "utf-8");
}
