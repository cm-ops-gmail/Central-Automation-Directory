import { readFileSync } from "fs";
import { join } from "path";
import Dashboard from "./dashboard";
import { ProjectsData } from "./types";

export default function Home() {
  const raw = readFileSync(join(process.cwd(), "data/projects.json"), "utf-8");
  const data: ProjectsData = JSON.parse(raw);
  return <Dashboard initialData={data} />;
}
