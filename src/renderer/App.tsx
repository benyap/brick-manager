import { Routes } from "react-router-dom";
import { HashRouter, Route } from "react-router-dom";

import SideBar from "./components/core/SideBar";
import SplashScreen from "./components/core/SplashScreen";
import ResourceProvider from "./components/core/ResourceProvider";

import DashboardView from "./components/views/DashboardView";
import DatabaseView, {
  PartsView,
  ColorsView,
} from "./components/views/DatabaseView";
import InventoryView from "./components/views/InventoryView";
import BuildsView from "./components/views/BuildsView";

export function App() {
  return (
    <HashRouter>
      <ResourceProvider loadingScreen={<SplashScreen />}>
        <Routes>
          <Route element={<SideBar />}>
            <Route path="/" element={<DashboardView />} />
            <Route path="inventory" element={<InventoryView />}></Route>
            <Route path="builds" element={<BuildsView />}></Route>
            <Route path="database" element={<DatabaseView />}>
              <Route path="parts" element={<PartsView />} />
              <Route path="colors" element={<ColorsView />} />
            </Route>
          </Route>
        </Routes>
      </ResourceProvider>
    </HashRouter>
  );
}
