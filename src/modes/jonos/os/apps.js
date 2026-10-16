import AboutApp from "../apps/AboutApp";
import CareerWizard from "../apps/CareerWizard";
import ExperienceApp from "../apps/ExperienceApp";
import ProjectsApp from "../apps/ProjectsApp";
import ProjectViewer from "../apps/ProjectViewer";
import ToolsApp from "../apps/ToolsApp";
import MailApp from "../apps/MailApp";
import RecycleBin from "../apps/RecycleBin";

const MENU = ["File", "Edit", "View", "Help"];

/** Every program on the system, by id. `label` is its desktop icon name. */
export const APPS = {
  about: { title: "About_Me.txt - Notepad", label: "About_Me.txt", icon: "notepad", w: 580, h: 540, menu: ["File", "Edit", "Search", "Help"], Component: AboutApp },
  career: { title: "Career Setup Wizard", label: "Career Setup", icon: "wizard", w: 600, h: 430, Component: CareerWizard },
  experience: { title: "Experience - Explorer", label: "Experience", icon: "briefcase", w: 920, h: 620, menu: MENU, Component: ExperienceApp },
  projects: { title: "C:\\Projects", label: "Projects", icon: "folder", w: 800, h: 580, menu: MENU, Component: ProjectsApp },
  tools: { title: "Control Panel - Technologies & tools", label: "Control Panel", icon: "gear", w: 720, h: 580, menu: MENU, Component: ToolsApp },
  contact: { title: "New Message - Mail", label: "Mail", icon: "mail", w: 780, h: 540, menu: ["File", "Edit", "Insert", "Help"], Component: MailApp },
  recycle: { title: "Recycle Bin", label: "Recycle Bin", icon: "bin", w: 440, h: 300, menu: MENU, Component: RecycleBin },
  viewer: { title: "Media Player", icon: "film", w: 780, h: 660, menu: ["File", "View", "Play", "Help"], Component: ProjectViewer },
};

/** Desktop icons, top to bottom. */
export const DESKTOP = ["about", "career", "experience", "projects", "tools", "contact"];
