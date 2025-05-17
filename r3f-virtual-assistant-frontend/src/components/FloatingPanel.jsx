import React, { useState } from "react";
import { Rnd } from "react-rnd";

const FloatingPanel = ({ side = "left" }) => {
  const defaultHeights = { left: 670, right: 500 };
  const [collapsed, setCollapsed] = useState(false);
  const [prevHeight, setPrevHeight] = useState(defaultHeights[side]);

  const [leftSize, setLeftSize] = useState({ width: 490, height: defaultHeights.left });
  const [rightSize, setRightSize] = useState({ width: 720, height: defaultHeights.right });
  const size = side === "left" ? leftSize : rightSize;
  const setSize = side === "left" ? setLeftSize : setRightSize;

  const initialX = side === "left" ? 400 : window.innerWidth - rightSize.width - 21;
  const initialY = side === "left" ? 450 : 540;
  const [position, setPosition] = useState({ x: initialX, y: initialY });

  const toggleCollapse = (e) => {
    e.stopPropagation();
    if (!collapsed) {
      setPrevHeight(size.height);
      setSize({ width: size.width, height: 40 });
    } else {
      setSize({ width: size.width, height: prevHeight });
    }
    setCollapsed(!collapsed);
  };

  return (
    <Rnd
      size={{ width: size.width, height: size.height }}
      position={position}
      onDragStop={(e, d) => setPosition({ x: d.x, y: d.y })}
      onResizeStop={(e, direction, ref, delta, pos) => {
        setSize({ width: ref.offsetWidth, height: ref.offsetHeight });
        setPosition(pos);
      }}
      bounds="window"
      minWidth={200}
      minHeight={40}
      style={{
        background: "white",
        border: "1px solid #ccc",
        borderRadius: "12px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        padding: "10px",
        zIndex: 1000,
        overflow: "hidden",
        transition: "height 0.2s ease",
      }}
    >
      {/* Panel Header with Collapse Button */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "20px",
        }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "1rem",
            fontWeight: "bold",
            color: side === "left" ? "#2c3e50" : "#8e44ad",
          }}
        >
          {side === "left" ? "Messages" : "Research Search"}
        </h2>

        <button
          onClick={toggleCollapse}
          aria-label={collapsed ? "Expand panel" : "Collapse panel"}
          style={{
            background: "none",
            border: "none",
            fontSize: "18px",
            fontWeight: "bold",
            cursor: "pointer",
            color: "#555",
          }}
        >
          {collapsed ? "➕" : "➖"}
        </button>
      </div>

      {/* Panel Content */}
      {!collapsed && (
        <div style={{ marginTop: "10px" }}>
          <div className="pcss3t pcss3t-effect-scale pcss3t-theme-1 pcss3t-height-auto">
            <input type="radio" name={`tab-${side}`} defaultChecked id={`tab1-${side}`} />
            <label htmlFor={`tab1-${side}`}><i>{side === "left" ? "Messages" : "Search"}</i></label>

            <input type="radio" name={`tab-${side}`} id={`tab2-${side}`} />
            <label htmlFor={`tab2-${side}`}><i>{side === "left" ? "Goals" : "Research"}</i></label>

            <input type="radio" name={`tab-${side}`} id={`tab3-${side}`} />
            <label htmlFor={`tab3-${side}`}><i>{side === "left" ? "Notes" : "YouTube"}</i></label>

            {side === "left" && (
              <>
                <input type="radio" name={`tab-${side}`} id={`tab4-${side}`} />
                <label htmlFor={`tab4-${side}`}><i>Maps</i></label>
              </>
            )}

            <ul>
              <li className="tab-content tab-content-first typography">
                <h1>{side === "left" ? "Inbox Messages" : "Google Search"}</h1>
                <p>{side === "left" ? "Show user assistant messages here." : "Search across your topics of interest."}</p>
              </li>

              <li className="tab-content tab-content-2 typography">
                <h1>{side === "left" ? "Daily Goals" : "Research Projects"}</h1>
                <ul>
                  <li>🏋️ Workout</li>
                  <li>📚 Study Session</li>
                  <li>💻 Dev Task</li>
                </ul>
              </li>

              <li className="tab-content tab-content-3 typography">
                <h1>{side === "left" ? "Sticky Notes" : "YouTube Results"}</h1>
                {side === "right" ? (
                  <form
                    action="https://www.youtube.com/results"
                    method="GET"
                    target="_blank"
                    className="pcss-search"
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    <input type="text" name="search_query" placeholder="Search YouTube" className="pcss-search__input" />
                    <button type="submit" className="pcss-search__button">Search</button>
                  </form>
                ) : (
                  <p>Use this area for brief ideas, reminders, or thoughts.</p>
                )}
              </li>

              {side === "left" && (
                <li className="tab-content tab-content-4 typography">
                  <div style={{ width: "100%", height: "500px", borderRadius: "8px", overflow: "hidden" }}>
                    <iframe
                      title="Google Maps - Eastvale"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3313.590825495394!2d-117.58385028478173!3d33.963801030915504!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80dcca3406e39a8d%3A0xb66054e678ec3905!2sEastvale%2C%20CA!5e0!3m2!1sen!2sus!4v1682891582409!5m2!1sen!2sus"
                    ></iframe>
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </Rnd>
  );
};

export default FloatingPanel;
