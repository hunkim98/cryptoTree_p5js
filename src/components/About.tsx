import React from "react";
import sample from "../data/sample.mov";

function About() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        paddingTop: 50,
        paddingBottom: 100,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 643,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h1 style={{ fontSize: 30, fontWeight: "bold", marginBottom: 10 }}>
          What is this?
        </h1>

        <video width="100%" autoPlay muted loop>
          <source src={sample} type="video/mp4" />
        </video>
        <h2 style={{}}>Example Video based on data 21.11.27~22.05.13</h2>
        <div style={{ padding: 20, fontSize: 18, lineHeight: 1.5 }}>
          <p style={paragraphStyle}>
            This tree shows how BTC is doing in the market.
          </p>
          <p style={paragraphStyle}>
            The stem represents the 20 day slope of BTC. The slope is compared
            to the minimum slope calculated on a 5 day interval and a maximum
            slope calculated on a 5 day interval The stem's height is determined
            based on where its location is at between the minimum slope and
            maximum slope
          </p>
          <p style={paragraphStyle}>
            The amount of branches represents the 20 day volume ratio of BTC
            More branches mean that there have been many people buying BTC
          </p>
          <p style={paragraphStyle}>
            The area of the leaf and the length of the branches represent the
            current price's relative location to the support and resistance
            price in the recent 20 days. The bigger the area of the leaf is, the
            farther it is from the recent support price
          </p>
        </div>
        <div>Created by Kim Dong Hun</div>
      </div>
    </div>
  );
}
const paragraphStyle: React.CSSProperties = {
  paddingTop: 10,
  paddingBottom: 10,
};

export default About;
