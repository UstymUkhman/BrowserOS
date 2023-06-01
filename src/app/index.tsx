import "./App.css";

import { Version } from "@/components/Version";
import { Taskbar } from "@/components/Taskbar";

export const APP = globalThis as Application;

export const App = () => (
  <>
    <Taskbar />
    {import.meta.env.DEV && <Version />}
  </>
);
