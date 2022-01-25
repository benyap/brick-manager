import { HashRouter, Route, Routes } from "react-router-dom";

import SideBar from "./components/core/SideBar";
import SplashScreen from "./components/core/SplashScreen";
import ResourceProvider from "./components/core/ResourceProvider";

import DashboardView from "./components/views/DashboardView";
import DatabaseView, {
  PartsView,
  ColorsView,
} from "./components/views/DatabaseView";
import InventoryView from "./components/views/InventoryView";
import CollectionsView from "./components/views/CollectionsView";

export function App() {
  return (
    <ResourceProvider loadingScreen={<SplashScreen />}>
      <HashRouter>
        <Routes>
          <Route element={<SideBar />}>
            <Route path="/" element={<DashboardView />} />
            <Route path="inventory" element={<InventoryView />}></Route>
            <Route path="collections" element={<CollectionsView />}></Route>
            <Route path="database" element={<DatabaseView />}>
              <Route path="parts" element={<PartsView />} />
              <Route path="colors" element={<ColorsView />} />
            </Route>
          </Route>
        </Routes>
      </HashRouter>
    </ResourceProvider>
  );
}
