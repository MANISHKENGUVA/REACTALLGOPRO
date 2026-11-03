import React, { useEffect, useState } from "react";
import { AUCARD, AUBUTTON, AUCHIP, AUINPUT, AUTIMELINE, AULISTGROUP } from "./routerEngine";
import ComponentDocsPage from "./ComponentDocsPage";

const timelineItems = [
  {
    id: 1,
    title: "Project Created",
    description: "The initial project scaffolding was generated.",
    timestamp: "2026-05-15",
    status: "completed",
  },
  {
    id: 2,
    title: "Design Review",
    description: "UI and interaction patterns were reviewed.",
    timestamp: "2026-06-01",
    status: "pending",
    icon: "⭐",
  },
  {
    id: 3,
    title: "Release",
    description: "The new component demos will ship.",
    timestamp: "2026-06-20",
    status: "pending",
  },
];

const listItems = [
  {
    id: "1",
    title: "Dashboard",
    description: "Overview of recent activity.",
    icon: "📊",
    badge: "New",
  },
  {
    id: "2",
    title: "Settings",
    description: "Manage your preferences.",
    icon: "⚙️",
  },
  {
    id: "3",
    title: "Messages",
    description: "Review your unread messages.",
    icon: "✉️",
    badge: "3",
  },
];

export default function App() {
  const [selectedItems, setSelectedItems] = useState(["1"]);
  const [route, setRoute] = useState(() => window.location.hash === "#/docs" ? "docs" : "home");

  useEffect(() => {
    const syncRoute = () => setRoute(window.location.hash === "#/docs" ? "docs" : "home");
    window.addEventListener("hashchange", syncRoute);
    return () => window.removeEventListener("hashchange", syncRoute);
  }, []);

  if (route === "docs") {
    return <ComponentDocsPage />;
  }

  return (
    <div style={{ padding: "24px", display: "grid", gap: "1.5rem", background: "linear-gradient(180deg, #F5F7FF 0%, #FFFFFF 100%)", minHeight: "100vh" }}>
      <AUCARD>
        <div style={{ display: "grid", gap: "0.75rem" }}>
          <span style={{ display: "inline-flex", width: "fit-content", padding: "0.35rem 0.6rem", borderRadius: "999px", background: "#EEF2FF", color: "#4455E8", fontSize: "0.82rem", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}>
            Premium AU Design System
          </span>
          <h1 style={{ margin: 0, fontSize: "1.8rem", lineHeight: 1.2 }}>Refreshed components, premium palette, cleaner hierarchy.</h1>
          <p style={{ margin: 0, color: "#3F4C89", maxWidth: "720px" }}>
            The visual system now uses the premium Indigo theme across buttons, cards, chips, inputs, and the live demo surface.
          </p>
          <AUBUTTON variant="primary" onClick={() => (window.location.hash = "#/docs")}>Open docs route</AUBUTTON>
        </div>
      </AUCARD>

      <AUCARD>
        <h2 style={{ margin: 0, fontSize: "1.1rem" }}>Buttons</h2>
        <p style={{ marginTop: "0.25rem" }}>Polished primary actions, softer secondary states, and cleaner hover motion.</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.85rem" }}>
          <AUBUTTON variant="primary">Primary</AUBUTTON>
          <AUBUTTON variant="secondary">Secondary</AUBUTTON>
          <AUBUTTON variant="outline">Outline</AUBUTTON>
          <AUBUTTON variant="ghost">Ghost</AUBUTTON>
          <AUBUTTON variant="danger">Danger</AUBUTTON>
          <AUBUTTON variant="link">Link</AUBUTTON>
        </div>
      </AUCARD>

      <AUCARD>
        <h2 style={{ margin: 0, fontSize: "1.1rem" }}>Input & chips</h2>
        <p style={{ marginTop: "0.25rem" }}>Icon placement, focus contrast, and chip color treatment are now aligned with the main palette.</p>
        <div style={{ display: "grid", gap: "1rem" }}>
          <AUINPUT id="demo-email" label="Email address" placeholder="name@company.com" prefixIcon="✉️" />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
            <AUCHIP>Default</AUCHIP>
            <AUCHIP selectable selected>Selected</AUCHIP>
            <AUCHIP variant="success" closable>Success</AUCHIP>
            <AUCHIP variant="danger" closable>Danger</AUCHIP>
          </div>
        </div>
      </AUCARD>

      <AUCARD>
        <h2 style={{ margin: 0, fontSize: "1.1rem" }}>Timeline & list group</h2>
        <div style={{ display: "grid", gap: "1rem" }}>
          <AUTIMELINE items={timelineItems} />
          <AULISTGROUP
            selectable
            selectedItems={selectedItems}
            onSelectionChange={setSelectedItems}
            items={listItems}
          />
        </div>
      </AUCARD>
    </div>
  );
}
