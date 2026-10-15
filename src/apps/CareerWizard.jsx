import React, { useState } from "react";
import PixelArt from "../os/PixelArt";
import { SCENES, SCENE_SIZE } from "../os/scenes";
import { chapters, profile } from "../data/journey";

const scenes = Object.fromEntries(Object.entries(SCENES).map(([k, f]) => [k, f()]));

/**
 * The career as a setup wizard: one page per act (steel, reset, software),
 * each with its own pixel picture, then a finish page.
 */
export default function CareerWizard({ os, onClose }) {
  const [step, setStep] = useState(0);
  const last = chapters.length; // the finish page
  const chapter = chapters[Math.min(step, chapters.length - 1)];
  const scene = step < last ? chapter.id : "software";

  return (
    <div className="wizard">
      <div className="wizard-main">
        <div className={`wizard-art scene-${scene}`}>
          <PixelArt pixels={scenes[scene]} {...SCENE_SIZE} scale={4} label={step < last ? `${chapter.title}: pixel illustration` : "A computer, ready"} />
        </div>
        <div className="wizard-copy" aria-live="polite">
          {step < last ? (
            <>
              <p className="wizard-step">
                Step {step + 1} of {chapters.length} · {chapter.span}
              </p>
              <h3>{chapter.title}</h3>
              <p>{chapter.detail}</p>
              <div className="wizard-progress" aria-hidden="true">
                <span style={{ width: `${((step + 1) / (chapters.length + 1)) * 100}%` }} />
              </div>
            </>
          ) : (
            <>
              <p className="wizard-step">Setup complete</p>
              <h3>{profile.title}</h3>
              <p>{profile.lede}</p>
              <p>Open Experience for the full record, every role and degree.</p>
              <div className="wizard-progress" aria-hidden="true">
                <span style={{ width: "100%" }} />
              </div>
            </>
          )}
        </div>
      </div>
      <div className="wizard-buttons">
        <button type="button" className="btn95" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
          &lt; Back
        </button>
        {step < last ? (
          <button type="button" className="btn95 btn95-default" onClick={() => setStep((s) => s + 1)}>
            Next &gt;
          </button>
        ) : (
          <button
            type="button"
            className="btn95 btn95-default"
            onClick={() => {
              onClose();
              os.launch("experience");
            }}
          >
            Finish
          </button>
        )}
        <button type="button" className="btn95" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}
