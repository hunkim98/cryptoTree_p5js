import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import CryptoTree from "./components/main";
import Navigation from "./components/Navigation/Navigation";

function App() {
  return (
    <>
      <Navigation />
      <div
        className="App"
        style={{ display: "flex", justifyContent: "center" }}
      >
        {/* <canvas id="canvas" width="480" height="640"></canvas> */}
        <CryptoTree />
      </div>
    </>
  );
}

export default App;
