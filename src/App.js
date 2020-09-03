import React from "react";
import Axios from "axios";
import { useState, useEffect } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import "./index.css";
import LogEntryForm from "./componets/LogEntryForm";

function App() {
  const [logEntries, setLogEntries] = useState([]);
  const [showPopup, setShowPopup] = useState({});
  const [addEntryLocation, setAddEntryLocation] = useState(null);
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 3,
  });

  const listLogEntries = async () => {
    const res = await Axios.get("http://localhost:2000/api/logs");
    const requestedEntry = res.data;
    return setLogEntries(requestedEntry);
  };

  useEffect(() => {
    listLogEntries();
  }, []);

  const showAddMarkerPoupup = (event) => {
    const [longitude, latitude] = event.lngLat;
    setAddEntryLocation({
      latitude: latitude,
      longitude: longitude,
    });
  };

  return (
    <ReactMapGL
      {...viewport}
      mapStyle="mapbox://styles/mike8827/ckebih4sl1aef1ap4ff9xtmxv"
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      onViewportChange={(nextViewport) => setViewport(nextViewport)}
      onDblClick={showAddMarkerPoupup}
    >
      {logEntries.map((entry) => {
        return (
          <React.Fragment key={entry._id}>
            <Marker
              latitude={entry.latitude}
              longitude={entry.longitude}
              offsetTop={-24}
              offsetLeft={-12}
            >
              <div
                onClick={() => {
                  setShowPopup({
                    [entry._id]: true,
                  });
                }}
              >
                <svg
                  className="marker"
                  style={{
                    width: "24px",
                    height: "24px",
                  }}
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
            </Marker>
            {showPopup[entry._id] ? (
              <Popup
                latitude={entry.latitude}
                longitude={entry.longitude}
                closeButton={true}
                closeOnClick={false}
                dynamicPosition={true}
                onClose={() => {
                  setShowPopup({});
                }}
                anchor="top"
              >
                <div className="popup">
                  <img src={entry.image} alt="image-log-entry" />
                  <h3>{entry.title}</h3>
                  <p>{entry.comments}</p>
                  <small>
                    visited on :{" "}
                    {new Date(entry.visitDate).toLocaleDateString()}
                  </small>
                </div>
              </Popup>
            ) : null}
          </React.Fragment>
        );
      })}
      {addEntryLocation ? (
        <>
          <Marker
            latitude={addEntryLocation.latitude}
            longitude={addEntryLocation.longitude}
            offsetTop={-24}
            offsetLeft={-12}
          >
            <div>
              <svg
                className="marker"
                style={{
                  width: "24px",
                  height: "24px",
                }}
                viewBox="0 0 24 24"
                stroke-width="2"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
          </Marker>
          <Popup
            className="popup"
            latitude={addEntryLocation.latitude}
            longitude={addEntryLocation.longitude}
            closeButton={true}
            closeOnClick={false}
            dynamicPosition={true}
            onClose={() => {
              setAddEntryLocation(null);
            }}
            anchor="top"
          >
            <div className="popup">
              <LogEntryForm
                onClose={() => {
                  setAddEntryLocation(null);
                  listLogEntries();
                }}
                location={addEntryLocation}
              />
            </div>
          </Popup>
        </>
      ) : null}
    </ReactMapGL>
  );
}

export default App;
