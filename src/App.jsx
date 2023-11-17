import "./App.css";
import "leaflet/dist/leaflet.css";
import Main from "./components/Main";
import { OpenAI } from "openai";

export const openai = new OpenAI({
  apiKey: import.meta.env.VITE_REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export const thread = openai.beta.threads.create();

function App() {
  return <Main />;
}

export default App;
