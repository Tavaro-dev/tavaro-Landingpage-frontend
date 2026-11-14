"use client";

import { useState } from "react";
import { RESORT_LOCATION_POINTS } from "../content/resortLocation";
import "./InteractiveLocationMap.css";

export function InteractiveLocationMap() {
  const [activeId, setActiveId] = useState<string | null>(null);

  const tavaro = RESORT_LOCATION_POINTS.find((p) => p.type === "resort");

  return (
    <>
      <div className="location-map">
        <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
          {tavaro && RESORT_LOCATION_POINTS.map((point) => {
            if (point.id === tavaro.id) return null;
            const isActive = activeId === point.id;
            return (
              <line
                key={`line-${point.id}`}
                x1={`${tavaro.x}%`}
                y1={`${tavaro.y}%`}
                x2={`${point.x}%`}
                y2={`${point.y}%`}
                stroke={isActive ? "var(--ink)" : "var(--surface-line)"}
                strokeWidth={isActive ? "2" : "1.5"}
                strokeDasharray={isActive ? "none" : "4 4"}
                style={{ transition: "all 0.3s ease" }}
              />
            );
          })}
        </svg>

        {RESORT_LOCATION_POINTS.map((point) => {
          const isTavaro = point.type === "resort";
          const isActive = activeId === point.id || isTavaro;
          const isTop = point.y > 60;
          
          return (
            <div
              key={point.id}
              className={`map-marker ${isTavaro ? 'map-marker-resort' : ''}`}
              style={{
                left: `${point.x}%`,
                top: `${point.y}%`,
                zIndex: activeId === point.id ? 20 : isTavaro ? 10 : 1,
              }}
            >
              <button
                type="button"
                className={`map-marker-btn ${activeId === point.id ? 'active' : ''} ${isTavaro ? 'resort' : ''}`}
                aria-label={isTavaro ? point.name : `${point.name}, ${point.travelTime} from Tavaro`}
                onMouseEnter={() => setActiveId(point.id)}
                onMouseLeave={() => setActiveId(null)}
                onClick={() => setActiveId(activeId === point.id ? null : point.id)}
                onFocus={() => setActiveId(point.id)}
                onBlur={() => setActiveId(null)}
              >
                {isTavaro ? "★" : "●"}
              </button>

              <div className={`map-marker-label-container ${isTop ? 'pos-top' : 'pos-bottom'} ${isActive ? 'active' : ''}`}>
                {isTop && activeId === point.id && !isTavaro && (
                  <div className="map-info-card">
                    {point.travelTime} FROM TAVARO
                  </div>
                )}

                {isTop && activeId === point.id && isTavaro && (
                  <div className="map-info-card">
                    KOKAPET, HYDERABAD
                  </div>
                )}

                <span className="map-marker-name">
                  {point.name}
                </span>
                
                {!isTop && activeId === point.id && !isTavaro && (
                  <div className="map-info-card">
                    {point.travelTime} FROM TAVARO
                  </div>
                )}
                
                {!isTop && activeId === point.id && isTavaro && (
                  <div className="map-info-card">
                    KOKAPET, HYDERABAD
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
