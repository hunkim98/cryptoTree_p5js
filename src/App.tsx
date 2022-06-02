import "./App.css";
import CryptoTree from "./components/main";

function App() {
  return (
    <div
      className="App"
      style={{ display: "flex", justifyContent: "center", paddingTop: 100 }}
    >
      {/* <canvas id="canvas" width="480" height="640"></canvas> */}
      <CryptoTree />
    </div>
  );
}

export default App;
