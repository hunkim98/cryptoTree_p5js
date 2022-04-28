import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import Tree from "./components/tree";

function App() {
  return (
    <div className="App">
      {/* <canvas id="canvas" width="480" height="640"></canvas> */}
      <Tree />
    </div>
  );
}

export default App;
