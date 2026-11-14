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
        <svg className="tw:absolute tw:top-[0] tw:left-[0] tw:w-full tw:h-full tw:pointer-events-none">
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
                className="tw:transition-all tw:duration-300 tw:ease-[ease]"
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
