import React from "react";
import { Icon } from "../os/PixelArt";

export default function RecycleBin() {
  return (
    <div className="recycle">
      <div className="recycle-empty sunken">
        <Icon name="bin" scale={3} />
        <p>The Recycle Bin is empty.</p>
      </div>
      <footer className="status-bar">
        <span>0 object(s)</span>
      </footer>
    </div>
  );
}
