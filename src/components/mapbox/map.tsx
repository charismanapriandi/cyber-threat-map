import "mapbox-gl/dist/mapbox-gl.css";

import MapGl from "react-map-gl";
import { MAPBOX_ACCESS_TOKEN, MAPBOX_STYLE } from "../../constants";
import { useEffect, useState } from "react";
import { DeckGL } from "deck.gl/typed";

const initializeState = {
  longitude: -122.4,
  latitude: 37.8,
  zoom: 0,
  pitch: 0,
  bearing: 0,
};

function getRandomCoordinates(
  minLat: number,
  maxLat: number,
  minLon: number,
  maxLon: number
) {
  const randomLat = Math.random() * (maxLat - minLat) + minLat;
  const randomLon = Math.random() * (maxLon - minLon) + minLon;

  return [randomLon, randomLat]; // Return [longitude, latitude]
}

const cityBoundingBox = {
  minLat: 37.5,
  maxLat: 37.9,
  minLon: -122.6,
  maxLon: -122.1,
};

type Data = {
  coordinates: {
    from: number[];
    to: number[];
  };
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

const textColorClassName: {[key: string]: string} = {
  critical: 'text-[#5b21b6]',
  hard: "text-[#9f1239]",
  medium: "text-[#92400e]",
  low: "text-[#047857]"
}

export function DeckGLMap() {
  const [data, setData] = useState<Data[]>([]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const coordinatesFrom = getRandomCoordinates(
        cityBoundingBox.minLat,
        cityBoundingBox.maxLat,
        cityBoundingBox.minLon,
        cityBoundingBox.maxLon
      );
      const coordinatesTo = getRandomCoordinates(
        cityBoundingBox.minLat,
        cityBoundingBox.maxLat,
        cityBoundingBox.minLon,
        cityBoundingBox.maxLon
      );
      const severity = getRandomSeverity();
      const attack = getRandomAttack();

      setData((prev) => [
        {
          coordinates: { from: coordinatesFrom, to: coordinatesTo },
          severity,
          name: attack,
        },
        ...prev,
      ]);

      setTimeout(() => setData((prev) => prev.slice(0, -1)), 10000);
    }, 2000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <>
      <DeckGL initialViewState={initializeState} controller>
        <MapGl
          bearing={0}
          bearingSnap={0}
          dragRotate={false}
          projection={{
            name: "mercator",
          }}
          maxPitch={0}
          mapboxAccessToken={MAPBOX_ACCESS_TOKEN ?? ""}
          initialViewState={initializeState}
          style={{ width: "100%", height: "100vh" }}
          maxZoom={3}
          cursor="auto"
          onClick={(a) => console.log(a.lngLat)}
          mapStyle={MAPBOX_STYLE}
        ></MapGl>
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
            {data.map((i, key) => (
              <tr key={key} className={textColorClassName[i.severity]}>
                <td className="px-2 py-1">{i.name}</td>
                <td className="px-2 py-1">{i.severity}</td>
                <td className="px-2 py-1">-</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
