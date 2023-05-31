import { Version } from "@/components/Version";

export const App = () => import.meta.env.DEV && <Version /> || null;
