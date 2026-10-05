"use client";

import { useState } from "react";
import { RESORT_LOCATION_POINTS } from "../content/resortLocation";

export function InteractiveLocationMap() {
  const [activeId, setActiveId] = useState<string | null>(null);

  const tavaro = RESORT_LOCATION_POINTS.find((p) => p.type === "resort");

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .location-map {
          position: relative;
          width: 100%;
          height: clamp(400px, 60vh, 600px);
          margin: 40px 0;
          background-color: var(--cream-2);
          border: 1px solid var(--surface-line);
          overflow: hidden;
          border-radius: 4px;
        }
        .map-marker {
          position: absolute;
          transform: translate(-50%, -50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: z-index 0.3s;
        }
        .map-marker-btn {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: var(--cream);
          border: 1.5px solid var(--ink);
          color: var(--ink);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 0;
          outline: none;
          font-size: 10px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.08);
        }
        .map-marker-btn:focus-visible {
          box-shadow: 0 0 0 3px rgba(0,0,0,0.1);
        }
        .map-marker-btn.active, .map-marker-btn.resort {
          background: var(--ink);
          color: var(--cream);
        }
        .map-marker-btn.resort {
          width: 40px;
          height: 40px;
          font-size: 16px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .map-marker-label-container {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          width: 200px;
          pointer-events: none;
          opacity: 0.7;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .map-marker-label-container.pos-bottom {
          top: 100%;
          margin-top: 10px;
        }
        .map-marker-label-container.pos-top {
          bottom: 100%;
          margin-bottom: 10px;
        }
        .map-marker-label-container.active {
          opacity: 1;
        }
        .map-marker-name {
          font-family: var(--font-sans);
          font-weight: 500;
          font-size: 11px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          background: var(--cream);
          color: var(--ink);
          padding: 4px 10px;
          border-radius: 4px;
          border: 1px solid var(--surface-line);
          white-space: nowrap;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .map-marker-resort .map-marker-name {
          font-weight: 600;
        }
        .map-info-card {
          margin: 6px 0;
          padding: 6px 10px;
          background: var(--ink);
          color: var(--cream);
          font-size: 10px;
          font-family: var(--font-sans);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          opacity: 0;
          transform: translateY(4px);
          transition: all 0.3s ease;
          border-radius: 4px;
        }
        .map-marker-label-container.active .map-info-card {
          opacity: 1;
          transform: translateY(0);
        }
        @media (max-width: 768px) {
          .map-marker-label-container {
            width: 140px;
          }
          .map-marker-name {
            font-size: 9px;
            padding: 2px 5px;
          }
        }
      `}} />
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
