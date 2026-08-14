import { createRoot } from "react-dom/client";
import "@learning-platform/core/theme.css";
import "../css/main.css";
import "../css/activity.css";
import "../css/activity-engine.css";
import "../css/supabase-auth.css";
import "../week-2/css/week2.css";
import "../week-3/css/week3.css";
import "../week-4/css/week4.css";
import "../week-5/css/week5.css";
import "../week-6/css/week6.css";
import "../week-7/css/week7.css";
import "../js/config/supabase-config.js";
import "./globals";
import { App } from "./App";
import { readPageContext } from "./page-context";

const root = document.getElementById("root");
if (!root) throw new Error("UNIT3_ROOT_MISSING");

createRoot(root).render(<App context={readPageContext()} />);
