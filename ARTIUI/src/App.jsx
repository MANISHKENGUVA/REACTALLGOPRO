import React, { useState } from "react";
import { AUCARD, AUBUTTON, AUCHIP, AUTIMELINE, AULISTGROUP } from "./routerEngine";

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

  return (
    <div style={{ padding: "20px", display: "grid", gap: "1.5rem" }}>
      <AUCARD>
        <h1>AU Button Demo</h1>
        <p>All button variants and features are now available.</p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center", marginBottom: "1rem" }}>
          <AUBUTTON variant="primary">Primary</AUBUTTON>
          <AUBUTTON variant="secondary">Secondary</AUBUTTON>
          <AUBUTTON variant="outline">Outline</AUBUTTON>
          <AUBUTTON variant="ghost">Ghost</AUBUTTON>
          <AUBUTTON variant="danger">Danger</AUBUTTON>
          <AUBUTTON variant="link">Link</AUBUTTON>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center", marginBottom: "1rem" }}>
          <AUBUTTON loading>Loading</AUBUTTON>
          <AUBUTTON disabled>Disabled</AUBUTTON>
          <AUBUTTON leftIcon="←">Left Icon</AUBUTTON>
          <AUBUTTON rightIcon="→">Right Icon</AUBUTTON>
          <AUBUTTON rounded>Rounded</AUBUTTON>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center" }}>
          <AUBUTTON variant="outline" rounded leftIcon="⭐" rightIcon="→">
            Icon Button
          </AUBUTTON>
          <AUBUTTON variant="danger" loading rounded>
            Saving
          </AUBUTTON>
        </div>
      </AUCARD>

      <AUCARD>
        <h1>AU Chip Demo</h1>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "1rem" }}>
          <AUCHIP>Default Chip</AUCHIP>
          <AUCHIP selectable selected>Selected Chip</AUCHIP>
          <AUCHIP variant="success" closable>
            Success Chip
          </AUCHIP>
          <AUCHIP variant="danger" closable>
            Danger Chip
          </AUCHIP>
        </div>
      </AUCARD>

      <AUCARD>
        <h1>AU Timeline Demo</h1>
        <AUTIMELINE items={timelineItems} />
      </AUCARD>

      <AUCARD>
        <h1>AU List Group Demo</h1>
        <AULISTGROUP
          selectable
          selectedItems={selectedItems}
          onSelectionChange={setSelectedItems}
          items={listItems}
        />
      </AUCARD>
    </div>
  );
}
