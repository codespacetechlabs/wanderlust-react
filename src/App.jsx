import "./App.css";
import "leaflet/dist/leaflet.css";
import Main from "./components/Main";
import { createAppState } from "./signals/index";

const initiatedThread = createAppState();
initiatedThread.createNewThread();

function App() {
  return <Main initiatedThread={initiatedThread} />;
}

export default App;
