import "mapbox-gl/dist/mapbox-gl.css";

import MapGl from "react-map-gl";
import { MAPBOX_ACCESS_TOKEN, MAPBOX_STYLE } from "../../constants";
import { useEffect, useMemo, useState } from "react";
import { DeckGL, LineLayer, TripsLayer } from "deck.gl/typed";

const initializeState = {
  longitude: -122.4,
  latitude: 37.8,
  zoom: 0,
  pitch: 0,
  bearing: 0,
  maxZoom: 2,
};

function getRandomCoordinates(from: number, to: number, fixed: number) {
  return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
  // .toFixed() returns string, so ' * 1' is a trick to convert to number
}


// function getRandomCoordinates(
//   minLat: number,
//   maxLat: number,
//   minLon: number,
//   maxLon: number
// ) {
//   const randomLat = Math.random() * (maxLat - minLat) + minLat;
//   const randomLon = Math.random() * (maxLon - minLon) + minLon;

//   return [randomLon, randomLat]; // Return [longitude, latitude]
//   // return [randomLat, randomLon]; // Return [latitude, longitude]
// }

const cityBoundingBox = {
  minLat: 37.5,
  maxLat: 37.9,
  minLon: -122.6,
  maxLon: -122.1,
};

type Data = {
  waypoints: { coordinates: number[]; timestamp: number }[];
  severity: string;
  name: string;
};

function getRandomSeverity() {
  const dataTypes = ["low", "medium", "hard", "critical"];
  const randomIndex = Math.floor(Math.random() * dataTypes.length);
  return dataTypes[randomIndex];
}

function getRandomAttack() {
  const dataTypes = [
    "MS.Windows.GDLLibraryEMF.Dos",
    "Trojan.WIN32.Toptools.A",
    "SSH Protection Violation",
    "Web Server Enforcement Violation",
    "Infecting Website.TC.6jawdk2",
    "REP.TC.mwWSj2",
  ];
  const randomIndex = Math.floor(Math.random() * dataTypes.length);
  return dataTypes[randomIndex];
}

const textColorClassName: { [key: string]: string } = {
  critical: "text-[#5b21b6]",
  hard: "text-[#9f1239]",
  medium: "text-[#92400e]",
  low: "text-[#047857]",
};
const rgbColor = {
  critical: [91, 33, 182],
  hard: [159, 18, 57],
  medium: [146, 64, 14],
  low: [4, 120, 87],
}
const dummy = new Array(1000).fill(null).map((item, index) => {
  const coordinatesFrom = [getRandomCoordinates(-180, 75, 3), getRandomCoordinates(-75, 75, 3)]
  const coordinatesTo = [getRandomCoordinates(-75, 75, 3), getRandomCoordinates(-75, 75, 3)]
  const severity = getRandomSeverity();
  const attack = getRandomAttack();
  const time = (index * 250) + Math.floor(Math.random() * 1000);

  return {
    waypoints: [
      {
        coordinates: coordinatesFrom,
        timestamp: time,
      },
      {
        coordinates: coordinatesTo,
        timestamp: time + 200,
      },
    ],
    severity,
    name: attack,
  };
});
console.log(dummy)
export function DeckGLMap() {
  // const [data, setData] = useState<Data[]>([]);
  const [currentTime, setCurrentTime] = useState(0);

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     const coordinatesFrom = getRandomCoordinates(
  //       cityBoundingBox.minLat,
  //       cityBoundingBox.maxLat,
  //       cityBoundingBox.minLon,
  //       cityBoundingBox.maxLon
  //     );
  //     const coordinatesTo = getRandomCoordinates(
  //       cityBoundingBox.minLat,
  //       cityBoundingBox.maxLat,
  //       cityBoundingBox.minLon,
  //       cityBoundingBox.maxLon
  //     );
  //     const severity = getRandomSeverity();
  //     const attack = getRandomAttack();

  //     setData((prev) => [
  //       {
  //         waypoints: [
  //           {
  //             coordinates: coordinatesFrom,
  //             timestamp: currentTime,
  //           },
  //           {
  //             coordinates: coordinatesTo,
  //             timestamp: currentTime + 200,
  //           },
  //         ],
  //         severity,
  //         name: attack,
  //       },
  //       ...prev,
  //     ]);

  //     setTimeout(() => setData((prev) => prev.slice(0, -1)), 10000);
  //   }, 2000);

  //   return () => {
  //     clearInterval(intervalId);
  //   };
  // }, []);

  useEffect(() => {
    const intervalId = setInterval(
      () => setCurrentTime((prev) => prev + 5),
      0.1
    );
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const layers = [
    new TripsLayer({
      id: "trips-layer",
      data: dummy,
      getPath: (d) => d.waypoints.map((p) => p.coordinates),
      // deduct start timestamp from each data point to avoid overflow
      getTimestamps: (d) => d.waypoints.map((p) => p.timestamp),
      getColor: (d) => rgbColor[d.severity],
      opacity: 0.8,
      widthMinPixels: 2,
      capRounded: true,
      fadeTrail: true,
      trailLength: 1200,
      currentTime,
      updateTriggers: {
        currentTime,
      },
    }),
  ];

  return (
    <>
      <DeckGL initialViewState={initializeState} controller layers={layers}>
        <MapGl
          bearing={0}
          bearingSnap={0}
          dragRotate={false}
          projection={{
            name: "mercator",
          }}
          mapboxAccessToken={MAPBOX_ACCESS_TOKEN ?? ""}
          initialViewState={initializeState}
          style={{ width: "100%", height: "100vh" }}
          cursor="auto"
          mapStyle={MAPBOX_STYLE}
        />
      </DeckGL>
      <div className="overflow-auto absolute bottom-10 left-1/2 border border-[#3D3D3D] -translate-x-1/2 bg-black bg-opacity-50 w-1/2 h-40">
        <table className="text-white text-sm">
          <thead className="sticky top-0 bg-black">
            <tr>
              <th className="px-2 py-1 w-full text-left">Attack</th>
              <th className="px-2 py-1 min-w-32 text-left">Severity</th>
              <th className="px-2 py-1 min-w-40 text-left">Location</th>
            </tr>
          </thead>
          <tbody>
            {dummy.map((i, key) =>
              i.waypoints[0].timestamp < currentTime ? (
                <tr key={key} className={textColorClassName[i.severity]}>
                  <td className="px-2 py-1">{i.name}</td>
                  <td className="px-2 py-1">{i.severity}</td>
                  <td className="px-2 py-1">-</td>
                </tr>
              ) : null
            ).reverse()}
          </tbody>
        </table>
      </div>
    </>
  );
}
