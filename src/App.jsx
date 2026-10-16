import React, { useCallback, useEffect, useState } from "react";
import Header from "./ui/Header";
import Shelf from "./ui/Shelf";
import Album from "./ui/Album";
import Opening from "./ui/Opening";
import Inspect from "./ui/Inspect";
import Trophies from "./ui/Trophies";
import Trade from "./ui/Trade";
import Toasts from "./ui/Toasts";
import Pairs from "./ui/Pairs";
import CV from "./ui/CV";
import { SETS, cardById } from "./cards/catalog";
import { addPack, award, drawPack, emptyCollection, loadCollection, packsLeft, saveCollection } from "./cards/collection";

/**
 * The portfolio as a trading card game. The career is a collection of cards
 * in three sets; boosters hold the cards you do not have yet; the album keeps
 * what you pulled, and every card opens to the full CV entry behind it.
 */
export default function App() {
  const [view, setView] = useState(() => (window.location.hash === "#cv" ? "cv" : "shelf"));
  const [albumSet, setAlbumSet] = useState("career");
  const [collection, setCollection] = useState(loadCollection);
  const [opening, setOpening] = useState(null);
  const [inspecting, setInspecting] = useState(null);
  const [panel, setPanel] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [dark, setDark] = useState(() => document.body.classList.contains("dark-theme"));

  useEffect(() => saveCollection(collection), [collection]);

  const toast = useCallback((t) => {
    const id = `${t.id}-${Date.now()}`;
    setToasts((all) => [...all, { id, title: t.title, text: t.text }]);
    setTimeout(() => setToasts((all) => all.filter((x) => x.id !== id)), 4200);
  }, []);

  /** Store the collection and announce any trophy it now earns. */
  const commit = (next, { quiet = false } = {}) => {
    if (quiet) {
      setCollection(next);
      return;
    }
    const { next: awarded, fresh } = award(next);
    setCollection(awarded);
    // A pile of trophies at once (opening everything) is one toast, not eight.
    if (fresh.length > 2) toast({ id: "many", title: `${fresh.length} trophies earned`, text: fresh.map((t) => t.name).join(" · ") });
    else fresh.forEach((t) => toast({ id: t.id, title: `Trophy · ${t.name}`, text: t.text }));
  };

  const openPack = (setId) => {
    const id = setId || SETS.find((s) => packsLeft(s.id, collection.owned))?.id;
    if (!id || !packsLeft(id, collection.owned)) return;
    setInspecting(null);
    setPanel(null);
    setOpening({ setId: id, cards: drawPack(id, collection.owned), packNo: Math.max(1, collection.opened + 1), key: Date.now() });
  };

  // The cards are yours the moment the foil tears; trophies wait until the
  // reveal is over, so a toast never gives a pull away.
  const tear = () => commit(addPack(collection, opening.cards), { quiet: true });

  const closeOpening = () => {
    setOpening(null);
    commit(collection);
  };

  const openAnother = () => {
    const setId = opening.setId;
    commit(collection);
    openPack(setId);
  };

  const openAll = () => {
    let c = collection;
    for (const s of SETS) while (packsLeft(s.id, c.owned)) c = addPack(c, drawPack(s.id, c.owned));
    commit(c);
    setAlbumSet("career");
    setView("album");
    window.scrollTo(0, 0);
  };

  const inspect = (card) => {
    setInspecting(card.id);
    if (!collection.inspected[card.id]) commit({ ...collection, inspected: { ...collection.inspected, [card.id]: true } });
  };

  const showPanel = (name) => {
    setPanel(name);
    if (name === "trade" && !collection.traded) commit({ ...collection, traded: true });
  };

  const toggleTheme = () => {
    const next = !document.body.classList.contains("dark-theme");
    document.body.classList.toggle("dark-theme", next);
    try {
      window.localStorage.setItem("jm-theme", next ? "dark" : "light");
    } catch {
      /* fine */
    }
    setDark(next);
    if (next && !collection.night) commit({ ...collection, night: true });
  };

  const showView = (v) => {
    setView(v);
    window.scrollTo(0, 0);
  };

  const showAlbum = (setId) => {
    if (setId) setAlbumSet(setId);
    showView("album");
  };

  const showCv = () => {
    setView("cv");
    window.history.replaceState(null, "", "#cv");
    window.scrollTo(0, 0);
  };

  if (view === "cv") {
    return (
      <CV
        onPlay={() => {
          setView("shelf");
          window.history.replaceState(null, "", window.location.pathname);
        }}
      />
    );
  }

  const card = inspecting && cardById[inspecting];

  return (
    <div className="table">
      <Header view={view} collection={collection} dark={dark} onView={showView} onPanel={showPanel} onTheme={toggleTheme} onCv={showCv} />

      {view === "album" ? (
        <Album setId={albumSet} owned={collection.owned} onSet={setAlbumSet} onInspect={inspect} onOpen={openPack} />
      ) : (
        <Shelf owned={collection.owned} onOpen={openPack} onOpenAll={openAll} onAlbum={showAlbum} onInspect={inspect} onCv={showCv} />
      )}

      <footer className="foot">
        {new Date().getFullYear()} · Made with ♥ by Jon Mendizabal ·{" "}
        <button type="button" className="link-btn" onClick={showCv}>
          Read as CV
        </button>
      </footer>

      {opening && (
        <Opening
          key={opening.key}
          setId={opening.setId}
          cards={opening.cards}
          packNo={opening.packNo}
          packsLeft={packsLeft(opening.setId, collection.owned)}
          onTear={tear}
          onClose={closeOpening}
          onAnother={openAnother}
          onInspect={inspect}
        />
      )}

      {card && <Inspect card={card} owned={collection.owned} onInspect={inspect} onClose={() => setInspecting(null)} />}

      {panel === "trophies" && (
        <Trophies
          collection={collection}
          onClose={() => setPanel(null)}
          onReset={() => {
            setCollection(emptyCollection());
            setPanel(null);
            showView("shelf");
          }}
        />
      )}
      {panel === "trade" && <Trade onClose={() => setPanel(null)} />}
      {panel === "pairs" && (
        <Pairs
          owned={collection.owned}
          best={collection.pairsBest}
          onClose={() => setPanel(null)}
          onWin={(moves) => commit({ ...collection, pairsBest: collection.pairsBest == null ? moves : Math.min(collection.pairsBest, moves) })}
        />
      )}

      <Toasts toasts={toasts} />
    </div>
  );
}
