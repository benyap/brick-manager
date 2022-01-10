import { Routes } from "react-router-dom";
import { HashRouter, Route } from "react-router-dom";

import DashboardView from "~/components/views/DashboardView";
import DatabaseView from "~/components/views/DatabaseView";
import DatabaseColorsView from "~/components/views/DatabaseColorsView";
import CollectionsView from "./components/views/CollectionsView";
import BuildsView from "./components/views/BuildsView";

import SideBar from "~/components/core/SideBar";

export function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<SideBar />}>
          <Route path="/" element={<DashboardView />}></Route>
          <Route path="collections" element={<CollectionsView />}></Route>
          <Route path="builds" element={<BuildsView />}></Route>
          <Route path="database" element={<DatabaseView />}>
            <Route path="colors" element={<DatabaseColorsView />} />
            <Route path="categories" element={<div />} />
            <Route path="parts" element={<div />} />
          </Route>
        </Route>
      </Routes>
    </HashRouter>
  );
}
