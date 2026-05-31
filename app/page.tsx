import Dashboard from "./dashboard";
import { getData } from "../lib/data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await getData();
  return <Dashboard initialData={data} />;
}
