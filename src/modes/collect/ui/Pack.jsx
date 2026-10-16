import React from "react";
import Art from "../cards/art";
import { cardById, cardsOf } from "../cards/catalog";

/** What is printed on the front of each booster. */
function PackArt({ setId }) {
  if (setId === "tools") {
    return (
      <div className="pack-icons">
        {cardsOf("tools")
          .slice(0, 7)
          .map((t) => (
            <span key={t.id}>
              <img src={t.art.image} alt="" />
            </span>
          ))}
      </div>
    );
  }
  const card = setId === "career" ? cardById.hero : cardsOf("projects")[0];
  return <Art card={card} />;
}

/** A sealed booster: crimped foil, the set's art and name. */
export default function Pack({ set, torn = false }) {
  return (
    <div className={`pack pack-${set.id}${torn ? " is-torn" : ""}`}>
      <span className="pack-crimp pack-top" aria-hidden="true" />
      <div className="pack-body">
        <span className="pack-brand">JM · Career TCG</span>
        <div className="pack-art">
          <PackArt setId={set.id} />
        </div>
        <h3 className="pack-name">{set.name}</h3>
        <span className="pack-count">
          Booster · {set.packSize} cards · {set.code}
        </span>
      </div>
      <span className="pack-crimp pack-bottom" aria-hidden="true" />
      <span className="pack-sheen" aria-hidden="true" />
    </div>
  );
}
