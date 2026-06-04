import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  AUBUTTON,
  AUINPUT,
  AUTEXTAREA,
  AUSELECT,
  AUTOGGLE,
  AURANGE,
  AUDATEPICKER,
  AUCHECKBOX,
  AUCHECKBOXGROUP,
  AURADIO,
  AURADIOGROUP,
  AUCARD,
  AUMODAL,
  AUTOAST,
  AUTOASTCONTAINER,
  AUTOOLTIP,
  AUPOPOVER,
  AUPROGRESS,
  AUPAGINATION,
  AUMENU,
  AUSTEPPER,
  AUCHIP,
  AUTIMELINE,
  AULISTGROUP
} from "artiqui/dist/router-engine.es.js";
import { PLAYGROUND_SNIPPETS } from "./playgroundSnippets.js";

// Helper components for the playground page layout
function PlaygroundSection({ id, title, description, children }) {
  return (
    <section
      id={id}
      style={{
        padding: "2rem",
        marginBottom: "3rem",
        background: "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(20px)",
        borderRadius: "16px",
        border: "1px solid rgba(103, 80, 164, 0.12)",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.02)",
        display: "grid",
        gap: "1.5rem",
      }}
    >
      <div style={{ borderBottom: "1px solid rgba(103, 80, 164, 0.1)", pb: "1rem", paddingBottom: "1rem" }}>
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "2rem",
            color: "#211f24",
            margin: 0,
            lineHeight: 1.2
          }}
        >
          {title}
        </h2>
        {description && (
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.95rem", color: "#606670", marginTop: "0.5rem", margin: 0 }}>
            {description}
          </p>
        )}
      </div>
      <div>{children}</div>
    </section>
  );
}

function CopyPasteCode({ code, label }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = code;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      {label && (
        <div
          style={{
            fontSize: "0.7rem",
            fontFamily: "Inter, sans-serif",
            color: "#606670",
            marginBottom: "0.35rem",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}
        >
          {label}
        </div>
      )}
      <button
        type="button"
        onClick={handleCopy}
        style={{
          position: "absolute",
          top: "0.5rem",
          right: "0.5rem",
          fontSize: "0.7rem",
          fontFamily: "Inter, sans-serif",
          fontWeight: 600,
          color: copied ? "#1b7a3a" : "#6750a4",
          background: "#ffffff",
          border: "1px solid rgba(103, 80, 164, 0.25)",
          borderRadius: "6px",
          padding: "0.25rem 0.55rem",
          cursor: "pointer",
          zIndex: 1,
        }}
      >
        {copied ? "Copied!" : "Copy"}
      </button>
      <pre
        style={{
          margin: 0,
          fontSize: "0.72rem",
          lineHeight: 1.5,
          fontFamily: "'Courier New', Courier, monospace",
          color: "#3d3a42",
          background: "rgba(103, 80, 164, 0.05)",
          padding: "0.65rem 4.5rem 0.65rem 0.75rem",
          borderRadius: "6px",
          overflowX: "auto",
          whiteSpace: "pre",
          border: "1px solid rgba(103, 80, 164, 0.1)",
        }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}

function PropCombination({ snippet, props, code, children }) {
  const usageCode = code ?? (snippet ? PLAYGROUND_SNIPPETS[snippet] : null);

  return (
    <div
      style={{
        padding: "1.25rem",
        borderRadius: "12px",
        background: "#ffffff",
        border: "1px solid rgba(148, 142, 156, 0.2)",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        justifyContent: "space-between",
        minHeight: "160px",
        transition: "all 0.2s ease"
      }}
    >
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flex: 1, minHeight: "80px" }}>
        {children}
      </div>
      {usageCode ? (
        <CopyPasteCode code={usageCode} label="Usage code" />
      ) : (
        <div
          style={{
            fontSize: "0.75rem",
            fontFamily: "'Courier New', Courier, monospace",
            color: "#6750a4",
            background: "rgba(103, 80, 164, 0.05)",
            padding: "0.4rem 0.6rem",
            borderRadius: "6px",
            wordBreak: "break-all"
          }}
        >
          {props}
        </div>
      )}
    </div>
  );
}

export default function AllComponentsPlaygroundPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [selectedListItems, setSelectedListItems] = useState(["1"]);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("info");
  const [checkboxValue, setCheckboxValue] = useState(true);
  const [radioValue, setRadioValue] = useState("option1");
  const [toggleValue, setToggleValue] = useState(true);
  const [rangeValue, setRangeValue] = useState(50);
  const [selectValue, setSelectValue] = useState("alpha");
  const [currentPage, setCurrentPage] = useState(1);

  // List of all components with metadata
  const componentList = [
    { id: "aubutton", name: "AUBUTTON", category: "Basic Elements" },
    { id: "auchip", name: "AUCHIP", category: "Basic Elements" },
    { id: "aucard", name: "AUCARD", category: "Basic Elements" },
    { id: "auinput", name: "AUINPUT", category: "Form Inputs" },
    { id: "autextarea", name: "AUTEXTAREA", category: "Form Inputs" },
    { id: "auselect", name: "AUSELECT", category: "Form Inputs" },
    { id: "autoggle", name: "AUTOGGLE", category: "Form Inputs" },
    { id: "aurange", name: "AURANGE", category: "Form Inputs" },
    { id: "audatepicker", name: "AUDATEPICKER", category: "Form Inputs" },
    { id: "aucheckbox", name: "AUCHECKBOX", category: "Selection Controls" },
    { id: "aucheckboxgroup", name: "AUCHECKBOXGROUP", category: "Selection Controls" },
    { id: "auradio", name: "AURADIO", category: "Selection Controls" },
    { id: "auradiogroup", name: "AURADIOGROUP", category: "Selection Controls" },
    { id: "aulistgroup", name: "AULISTGROUP", category: "Selection Controls" },
    { id: "aumenu", name: "AUMENU", category: "Navigation & Overlays" },
    { id: "austepper", name: "AUSTEPPER", category: "Navigation & Overlays" },
    { id: "autimeline", name: "AUTIMELINE", category: "Navigation & Overlays" },
    { id: "aupagination", name: "AUPAGINATION", category: "Navigation & Overlays" },
    { id: "aumodal", name: "AUMODAL", category: "Overlays & Feedback" },
    { id: "autoast", name: "AUTOAST", category: "Overlays & Feedback" },
    { id: "autooltip", name: "AUTOOLTIP", category: "Overlays & Feedback" },
    { id: "aupopover", name: "AUPOPOVER", category: "Overlays & Feedback" },
    { id: "auprogress", name: "AUPROGRESS", category: "Overlays & Feedback" },
  ];

  const filteredComponents = componentList.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTriggerToast = (msg, variant) => {
    setToastMessage(msg);
    setToastVariant(variant);
    setTimeout(() => {
      setToastMessage("");
    }, 4000);
  };

  const handleScroll = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "280px 1fr",
        minHeight: "100vh",
        fontFamily: "Inter, sans-serif",
        background: "linear-gradient(180deg, #F5F7FF 0%, #FFFFFF 100%)",
        color: "#1d1b20"
      }}
    >
      {/* Toast Notification Mount point */}
      {toastMessage && (
        <div style={{ position: "fixed", top: "24px", right: "24px", zIndex: 1000 }}>
          <AUTOAST
            message={toastMessage}
            variant={toastVariant}
            onClose={() => setToastMessage("")}
          />
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside
        style={{
          borderRight: "1px solid rgba(103, 80, 164, 0.12)",
          padding: "1.5rem",
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(20px)",
          position: "sticky",
          top: 0,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          zIndex: 50,
          overflowY: "auto"
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              textDecoration: "none",
              color: "#6750a4",
              fontWeight: 700,
              fontSize: "0.9rem"
            }}
          >
            ← Back to Home
          </Link>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", margin: 0, color: "#1d1b20" }}>
            AU Playground
          </h1>
          <p style={{ fontSize: "0.78rem", color: "#606670", margin: 0 }}>
            Visual QA Specs & Combinations
          </p>
        </div>

        <input
          type="text"
          placeholder="Filter components..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: "100%",
            padding: "0.6rem 0.8rem",
            borderRadius: "8px",
            border: "1px solid rgba(103, 80, 164, 0.2)",
            fontSize: "0.85rem",
            outline: "none"
          }}
        />

        <nav style={{ display: "flex", flexDirection: "column", gap: "1rem", flex: 1 }}>
          {["Basic Elements", "Form Inputs", "Selection Controls", "Navigation & Overlays", "Overlays & Feedback"].map(
            (category) => {
              const catComps = filteredComponents.filter((c) => c.category === category);
              if (catComps.length === 0) return null;
              return (
                <div key={category} style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      color: "#6750a4",
                      letterSpacing: "0.05em",
                      marginBottom: "0.25rem"
                    }}
                  >
                    {category}
                  </span>
                  {catComps.map((comp) => (
                    <button
                      key={comp.id}
                      onClick={() => handleScroll(comp.id)}
                      style={{
                        textAlign: "left",
                        background: "none",
                        border: "none",
                        padding: "0.4rem 0.5rem",
                        fontSize: "0.85rem",
                        color: "#3F4C89",
                        borderRadius: "6px",
                        cursor: "pointer",
                        width: "100%",
                        transition: "background 0.2s"
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = "rgba(103, 80, 164, 0.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = "none";
                      }}
                    >
                      {comp.name}
                    </button>
                  ))}
                </div>
              );
            }
          )}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main style={{ padding: "3rem 4rem", maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
        <header style={{ marginBottom: "4rem" }}>
          <span
            style={{
              padding: "0.35rem 0.6rem",
              borderRadius: "999px",
              background: "rgba(103, 80, 164, 0.1)",
              color: "#6750a4",
              fontSize: "0.8rem",
              fontWeight: 700,
              textTransform: "uppercase"
            }}
          >
            Visual QA Matrix
          </span>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "3.2rem",
              color: "#211f24",
              marginTop: "0.75rem",
              marginBottom: "1rem",
              lineHeight: 1.1
            }}
          >
            Component Showroom
          </h1>
          <p style={{ fontSize: "1.1rem", color: "#606670", maxWidth: "800px", margin: 0, lineHeight: 1.6 }}>
            Use this page to perform visual checks across all possible prop configurations, states, and variants of the ARTIQUI Design System library.
          </p>
        </header>

        {/* ========================================================
            AUBUTTON
           ======================================================== */}
        <PlaygroundSection
          id="aubutton"
          title="AUBUTTON (Button Variants)"
          description="Standard interaction points with multiple fills, icons, disabled and processing status variants."
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
            <PropCombination snippet="aubutton_primary" props='variant="primary"'>
              <AUBUTTON variant="primary">Primary Action</AUBUTTON>
            </PropCombination>
            <PropCombination snippet="aubutton_secondary" props='variant="secondary"'>
              <AUBUTTON variant="secondary">Secondary Action</AUBUTTON>
            </PropCombination>
            <PropCombination snippet="aubutton_outline" props='variant="outline"'>
              <AUBUTTON variant="outline">Outline Action</AUBUTTON>
            </PropCombination>
            <PropCombination snippet="aubutton_ghost" props='variant="ghost"'>
              <AUBUTTON variant="ghost">Ghost Button</AUBUTTON>
            </PropCombination>
            <PropCombination snippet="aubutton_danger" props='variant="danger"'>
              <AUBUTTON variant="danger">Destructive Action</AUBUTTON>
            </PropCombination>
            <PropCombination snippet="aubutton_gradient" props='variant="gradient"'>
              <AUBUTTON variant="gradient">Gradient Action</AUBUTTON>
            </PropCombination>
            <PropCombination snippet="aubutton_link" props='variant="link"'>
              <AUBUTTON variant="link">Hyperlink Button</AUBUTTON>
            </PropCombination>
            <PropCombination snippet="aubutton_rounded" props='rounded={true} variant="primary"'>
              <AUBUTTON variant="primary" rounded>Rounded Button</AUBUTTON>
            </PropCombination>
            <PropCombination snippet="aubutton_loading" props='loading={true} variant="primary"'>
              <AUBUTTON variant="primary" loading>Processing...</AUBUTTON>
            </PropCombination>
            <PropCombination snippet="aubutton_disabled" props='disabled={true} variant="primary"'>
              <AUBUTTON variant="primary" disabled>Unavailable</AUBUTTON>
            </PropCombination>
            <PropCombination snippet="aubutton_leftIcon" props='leftIcon="⭐" variant="outline"'>
              <AUBUTTON variant="outline" leftIcon="⭐">Starred Action</AUBUTTON>
            </PropCombination>
            <PropCombination snippet="aubutton_rightIcon" props='rightIcon="→" variant="primary"'>
              <AUBUTTON variant="primary" rightIcon="→">Continue</AUBUTTON>
            </PropCombination>
          </div>
        </PlaygroundSection>

        {/* ========================================================
            AUCHIP
           ======================================================== */}
        <PlaygroundSection
          id="auchip"
          title="AUCHIP (Pill Badges)"
          description="Categorization, status flags, filter items, and selection indicators."
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
            <PropCombination snippet="auchip_default" props='variant="default"'>
              <AUCHIP>Default tag</AUCHIP>
            </PropCombination>
            <PropCombination snippet="auchip_success" props='variant="success"'>
              <AUCHIP variant="success">Completed</AUCHIP>
            </PropCombination>
            <PropCombination snippet="auchip_warning" props='variant="warning"'>
              <AUCHIP variant="warning">In Review</AUCHIP>
            </PropCombination>
            <PropCombination snippet="auchip_danger" props='variant="danger"'>
              <AUCHIP variant="danger">Rejected</AUCHIP>
            </PropCombination>
            <PropCombination snippet="auchip_closable" props='closable={true} onClose={() => {}}'>
              <AUCHIP closable onClose={() => alert("Chip dismissed")}>Dismissible</AUCHIP>
            </PropCombination>
            <PropCombination snippet="auchip_selectable_selected" props='selectable={true} selected={true}'>
              <AUCHIP selectable selected>Active state</AUCHIP>
            </PropCombination>
            <PropCombination snippet="auchip_selectable_unselected" props='selectable={true} selected={false}'>
              <AUCHIP selectable selected={false}>Inactive state</AUCHIP>
            </PropCombination>
          </div>
        </PlaygroundSection>

        {/* ========================================================
            AUCARD
           ======================================================== */}
        <PlaygroundSection
          id="aucard"
          title="AUCARD (Content Blocks)"
          description="Standard panels styled for content grouping, visual alignment, headers, and footer items."
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }}>
            <PropCombination snippet="aucard_basic" props='title="Static Header" description="Basic description subtitle"'>
              <div style={{ width: "100%" }}>
                <AUCARD title="Visual Analytics Panel" description="Overview of neural execution mesh metrics">
                  <p style={{ margin: 0, fontSize: "0.95rem", color: "#606670" }}>
                    Depth and layering are maintained via primary-tinted hairlines rather than heavy drop shadows.
                  </p>
                </AUCARD>
              </div>
            </PropCombination>
            <PropCombination snippet="aucard_footer" props='footer={<AUBUTTON variant="link">Action</AUBUTTON>}'>
              <div style={{ width: "100%" }}>
                <AUCARD
                  title="System Update"
                  description="Security patches deployed successfully"
                  footer={
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <AUBUTTON variant="primary">Acknowledge</AUBUTTON>
                      <AUBUTTON variant="ghost">View release logs</AUBUTTON>
                    </div>
                  }
                >
                  <p style={{ margin: 0, fontSize: "0.95rem", color: "#606670" }}>
                    The visual system has been upgraded to Midnight Obsidian theme.
                  </p>
                </AUCARD>
              </div>
            </PropCombination>
          </div>
        </PlaygroundSection>

        {/* ========================================================
            AUINPUT
           ======================================================== */}
        <PlaygroundSection
          id="auinput"
          title="AUINPUT (Form Input Fields)"
          description="Flexible entries for emails, passwords, numeric checks, validation warnings, and inline clear icons."
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
            <PropCombination snippet="auinput_placeholder" props='placeholder="Name"'>
              <div style={{ width: "100%" }}>
                <AUINPUT placeholder="John Doe" />
              </div>
            </PropCombination>
            <PropCombination snippet="auinput_label" props='label="Floating label"'>
              <div style={{ width: "100%" }}>
                <AUINPUT id="input-float" label="Full Name" />
              </div>
            </PropCombination>
            <PropCombination snippet="auinput_email" props='type="email" prefixIcon="✉️"'>
              <div style={{ width: "100%" }}>
                <AUINPUT type="email" id="input-email" label="Email Address" defaultValue="manish@gmail.com" prefixIcon="✉️" />
              </div>
            </PropCombination>
            <PropCombination snippet="auinput_password" props='type="password" showPasswordToggle={true} clearable={true}'>
              <div style={{ width: "100%" }}>
                <AUINPUT type="password" id="input-pass" label="Security Key" showPasswordToggle clearable defaultValue="pass123" prefixIcon="🔐" />
              </div>
            </PropCombination>
            <PropCombination snippet="auinput_disabled" props='disabled={true} prefixIcon="👤"'>
              <div style={{ width: "100%" }}>
                <AUINPUT id="input-dis" label="Username" defaultValue="manish37" disabled prefixIcon="👤" />
              </div>
            </PropCombination>
            <PropCombination snippet="auinput_error" props='error="Message error" prefixIcon="💳"'>
              <div style={{ width: "100%" }}>
                <AUINPUT id="input-err" label="PAN Identifier" defaultValue="ABC" error="Invalid PAN code pattern" prefixIcon="💳" />
              </div>
            </PropCombination>
            <PropCombination snippet="auinput_helper" props='helperText="Helper message" prefixIcon="📞"'>
              <div style={{ width: "100%" }}>
                <AUINPUT id="input-help" label="Contact Mobile" placeholder="10-digit number" helperText="Exclude country code prefix (+91)" prefixIcon="📞" />
              </div>
            </PropCombination>
          </div>
        </PlaygroundSection>

        {/* ========================================================
            AUTEXTAREA
           ======================================================== */}
        <PlaygroundSection
          id="autextarea"
          title="AUTEXTAREA (Multi-line Entry)"
          description="Enlarged entry boxes with auto-growing height, text lengths counting, and custom guidelines."
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }}>
            <PropCombination snippet="autextarea_basic" props='label="Bio" placeholder="Vision..."'>
              <div style={{ width: "100%" }}>
                <AUTEXTAREA id="text-std" label="Project Brief" placeholder="Describe your vision here..." />
              </div>
            </PropCombination>
            <PropCombination snippet="autextarea_charCount" props='maxLength={200} charCount={true}'>
              <div style={{ width: "100%" }}>
                <AUTEXTAREA
                  id="text-count"
                  label="Cover Statement"
                  maxLength={200}
                  charCount
                  placeholder="Summarize your professional experience..."
                  defaultValue="I have 5+ years of experience with React, building accessible design libraries."
                />
              </div>
            </PropCombination>
            <PropCombination snippet="autextarea_error" props='error="Remarks error"'>
              <div style={{ width: "100%" }}>
                <AUTEXTAREA id="text-err" label="Additional Comments" defaultValue="Short" error="Remarks must contain at least 20 characters." />
              </div>
            </PropCombination>
          </div>
        </PlaygroundSection>

        {/* ========================================================
            AUSELECT
           ======================================================== */}
        <PlaygroundSection
          id="auselect"
          title="AUSELECT (Dropdown Options)"
          description="Selections for single choices, multi-item checkbox filters, input searching, and loading arrays."
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
            <PropCombination snippet="auselect_single" props='singleSelect'>
              <div style={{ width: "100%" }}>
                <AUSELECT
                  label="Theme Preference"
                  options={[
                    { label: "Midnight Obsidian", value: "obsidian" },
                    { label: "Nordic Alabaster", value: "nordic" },
                    { label: "Cyberpunk Neon", value: "cyberpunk" }
                  ]}
                  value={selectValue}
                  onChange={(e) => setSelectValue(e.target.value)}
                />
              </div>
            </PropCombination>
            <PropCombination snippet="auselect_searchable" props='searchable={true}'>
              <div style={{ width: "100%" }}>
                <AUSELECT
                  label="Host Region"
                  searchable
                  options={[
                    { label: "Mumbai (ap-south-1)", value: "bom" },
                    { label: "Singapore (ap-southeast-1)", value: "sin" },
                    { label: "Frankfurt (eu-central-1)", value: "fra" },
                    { label: "N. Virginia (us-east-1)", value: "iad" }
                  ]}
                />
              </div>
            </PropCombination>
            <PropCombination snippet="auselect_multiple" props='multiple={true} checkbox={true}'>
              <div style={{ width: "100%" }}>
                <AUSELECT
                  label="Required Clearance"
                  multiple
                  checkbox
                  options={[
                    { label: "Read Database", value: "r" },
                    { label: "Write Records", value: "w" },
                    { label: "Execute Triggers", value: "x" }
                  ]}
                  defaultValue={["r"]}
                />
              </div>
            </PropCombination>
            <PropCombination snippet="auselect_loading" props='loading={true}'>
              <div style={{ width: "100%" }}>
                <AUSELECT label="Active Server Node" loading asyncText="Querying live host arrays..." />
              </div>
            </PropCombination>
            <PropCombination snippet="auselect_error" props='error="Unsupported choice"'>
              <div style={{ width: "100%" }}>
                <AUSELECT
                  label="Operating System"
                  error="Selected OS is unsupported"
                  options={[{ label: "macOS", value: "mac" }, { label: "Linux", value: "linux" }]}
                />
              </div>
            </PropCombination>
          </div>
        </PlaygroundSection>

        {/* ========================================================
            AUTOGGLE
           ======================================================== */}
        <PlaygroundSection
          id="autoggle"
          title="AUTOGGLE (Toggle Switches)"
          description="Clean on/off controls supporting custom text labels and disabled layouts."
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
            <PropCombination snippet="autoggle_basic" props='checked={true}'>
              <AUTOGGLE
                label="Environment Sync"
                checked={toggleValue}
                onChange={(e) => setToggleValue(e.target.checked)}
              />
            </PropCombination>
            <PropCombination snippet="autoggle_labels" props='activeLabel="ONLINE" inactiveLabel="OFFLINE"'>
              <AUTOGGLE
                label="Server Flux"
                checked={toggleValue}
                onChange={(e) => setToggleValue(e.target.checked)}
                activeLabel="ONLINE"
                inactiveLabel="OFFLINE"
              />
            </PropCombination>
            <PropCombination snippet="autoggle_disabled_on" props='disabled={true} checked={true}'>
              <AUTOGGLE label="Strict Enforcement" checked={true} disabled />
            </PropCombination>
            <PropCombination snippet="autoggle_disabled_off" props='disabled={true} checked={false}'>
              <AUTOGGLE label="Volumetric Glow" checked={false} disabled />
            </PropCombination>
          </div>
        </PlaygroundSection>

        {/* ========================================================
            AURANGE
           ======================================================== */}
        <PlaygroundSection
          id="aurange"
          title="AURANGE (Range Sliders)"
          description="Continuous slider bar controls supporting value preview tooltips."
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
            <PropCombination snippet="aurange_basic" props='min={0} max={100}'>
              <div style={{ width: "100%" }}>
                <AURANGE
                  label="Audio Master Gain"
                  min={0}
                  max={100}
                  value={rangeValue}
                  onChange={(e) => setRangeValue(Number(e.target.value))}
                />
              </div>
            </PropCombination>
            <PropCombination snippet="aurange_tooltip" props='tooltip={true}'>
              <div style={{ width: "100%" }}>
                <AURANGE
                  label="Luminance Filter"
                  min={0}
                  max={100}
                  tooltip
                  value={rangeValue}
                  onChange={(e) => setRangeValue(Number(e.target.value))}
                />
              </div>
            </PropCombination>
            <PropCombination snippet="aurange_disabled" props='disabled={true}'>
              <div style={{ width: "100%" }}>
                <AURANGE label="Contrast Threshold" min={0} max={100} value={72} disabled />
              </div>
            </PropCombination>
          </div>
        </PlaygroundSection>

        {/* ========================================================
            AUDATEPICKER
           ======================================================== */}
        <PlaygroundSection
          id="audatepicker"
          title="AUDATEPICKER (Date Calendars)"
          description="Calendar and time selection views for dates, datetimes, clock indicators, and date ranges."
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
            <PropCombination snippet="audatepicker_date" props='mode="date"'>
              <div style={{ width: "100%" }}>
                <AUDATEPICKER label="Filing Date" mode="date" />
              </div>
            </PropCombination>
            <PropCombination snippet="audatepicker_datetime" props='mode="datetime"'>
              <div style={{ width: "100%" }}>
                <AUDATEPICKER label="Scheduled Time" mode="datetime" />
              </div>
            </PropCombination>
            <PropCombination snippet="audatepicker_time" props='mode="time"'>
              <div style={{ width: "100%" }}>
                <AUDATEPICKER label="Trigger Alarm" mode="time" />
              </div>
            </PropCombination>
            <PropCombination snippet="audatepicker_range" props='range={true}'>
              <div style={{ width: "100%" }}>
                <AUDATEPICKER label="Deployment Window" range />
              </div>
            </PropCombination>
          </div>
        </PlaygroundSection>

        {/* ========================================================
            AUCHECKBOX
           ======================================================== */}
        <PlaygroundSection
          id="aucheckbox"
          title="AUCHECKBOX (Checkbox States)"
          description="Binary checklist options showing checked, unchecked, disabled and indeterminate options."
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
            <PropCombination snippet="aucheckbox_checked" props='checked={true}'>
              <AUCHECKBOX
                label="Include source maps"
                checked={checkboxValue}
                onChange={(e) => setCheckboxValue(e.target.checked)}
              />
            </PropCombination>
            <PropCombination snippet="aucheckbox_indeterminate" props='indeterminate={true}'>
              <AUCHECKBOX label="Parent check selection" indeterminate />
            </PropCombination>
            <PropCombination snippet="aucheckbox_disabled_on" props='disabled={true} checked={true}'>
              <AUCHECKBOX label="Auto-deploy configuration" checked={true} disabled />
            </PropCombination>
            <PropCombination snippet="aucheckbox_disabled_off" props='disabled={true} checked={false}'>
              <AUCHECKBOX label="Enforce SSL encryption" checked={false} disabled />
            </PropCombination>
          </div>
        </PlaygroundSection>

        {/* ========================================================
            AUCHECKBOXGROUP
           ======================================================== */}
        <PlaygroundSection
          id="aucheckboxgroup"
          title="AUCHECKBOXGROUP (Check Groups)"
          description="Groups of checkboxes arranged horizontally or vertically."
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }}>
            <PropCombination snippet="aucheckboxgroup_horizontal" props='layout="horizontal"'>
              <AUCHECKBOXGROUP
                label="Selected Server Capabilities"
                options={[
                  { label: "Volumetric Lights", value: "lume" },
                  { label: "Neural Flow Engine", value: "neural" },
                  { label: "Hardware Raytracing", value: "ray" }
                ]}
                defaultValue={["lume", "neural"]}
              />
            </PropCombination>
          </div>
        </PlaygroundSection>

        {/* ========================================================
            AURADIO
           ======================================================== */}
        <PlaygroundSection
          id="auradio"
          title="AURADIO (Radio Indicators)"
          description="Single choice selection options representing exclusive states."
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
            <PropCombination snippet="auradio_checked" props='checked={true}'>
              <AURADIO
                label="Classic theme"
                checked={radioValue === "option1"}
                onChange={() => setRadioValue("option1")}
              />
            </PropCombination>
            <PropCombination snippet="auradio_unchecked" props='checked={false}'>
              <AURADIO
                label="Midnight Obsidian"
                checked={radioValue === "option2"}
                onChange={() => setRadioValue("option2")}
              />
            </PropCombination>
            <PropCombination snippet="auradio_disabled" props='disabled={true} checked={false}'>
              <AURADIO label="Cyberpunk Neon" checked={false} disabled />
            </PropCombination>
          </div>
        </PlaygroundSection>

        {/* ========================================================
            AURADIOGROUP
           ======================================================== */}
        <PlaygroundSection
          id="auradiogroup"
          title="AURADIOGROUP (Radio Groups)"
          description="Arranged list groups of exclusive choice radio items."
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }}>
            <PropCombination snippet="auradiogroup_vertical" props='layout="vertical"'>
              <AURADIOGROUP
                label="Target Deployment Host"
                options={[
                  { label: "Amazon Web Services (AWS)", value: "aws" },
                  { label: "Google Cloud Platform (GCP)", value: "gcp" },
                  { label: "Microsoft Azure Node", value: "azure" }
                ]}
                defaultValue="aws"
              />
            </PropCombination>
          </div>
        </PlaygroundSection>

        {/* ========================================================
            AULISTGROUP
           ======================================================== */}
        <PlaygroundSection
          id="aulistgroup"
          title="AULISTGROUP (List Blocks)"
          description="Groups of list items displaying structured data, badges, action links, and selections."
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }}>
            <PropCombination snippet="aulistgroup_selectable" props='selectable={true}'>
              <div style={{ width: "100%" }}>
                <AULISTGROUP
                  selectable
                  selectedItems={selectedListItems}
                  onSelectionChange={setSelectedListItems}
                  items={[
                    { id: "1", title: "Executive Dashboard", description: "Visual overview of recent spikes", icon: "📊", badge: "New" },
                    { id: "2", title: "System Preferences", description: "Toggle lume layout constraints", icon: "⚙️" },
                    { id: "3", title: "Cloud Integrations", description: "Audit remote node linkages", icon: "☁️", badge: "12" }
                  ]}
                />
              </div>
            </PropCombination>
          </div>
        </PlaygroundSection>

        {/* ========================================================
            AUMENU
           ======================================================== */}
        <PlaygroundSection
          id="aumenu"
          title="AUMENU & AUMENUDROPDOWN (Dropdown Shells)"
          description="Structured context items, dropdown menus, divider lines, and active buttons."
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
            <PropCombination snippet="aumenu_items" props='menu list items'>
              <div style={{ width: "100%" }}>
                <AUMENU
                  items={[
                    { label: "Profile Account", icon: "👤" },
                    { label: "Theme Configurations", icon: "⚙️", active: true },
                    { divider: true },
                    { label: "Clear Session Cache", icon: "🧹", disabled: true },
                    { label: "Logout", icon: "↩️" }
                  ]}
                />
              </div>
            </PropCombination>
          </div>
        </PlaygroundSection>

        {/* ========================================================
            AUSTEPPER
           ======================================================== */}
        <PlaygroundSection
          id="austepper"
          title="AUSTEPPER (Step Trackers)"
          description="Numbered sequence step trackers displaying configuration and verification phases."
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }}>
            <PropCombination snippet="austepper_active" props='activeStep={1}'>
              <div style={{ width: "100%" }}>
                <AUSTEPPER
                  steps={[
                    { title: "Define Tokens", description: "Configure system colors & margins" },
                    { title: "Deploy Library", description: "Run ES/UMD library compilers" },
                    { title: "Verify Playground", description: "Visually check component specs" }
                  ]}
                  activeStep={activeStep}
                />
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "1.5rem" }}>
                  <AUBUTTON variant="secondary" onClick={() => setActiveStep((p) => Math.max(0, p - 1))}>
                    Previous
                  </AUBUTTON>
                  <AUBUTTON variant="primary" onClick={() => setActiveStep((p) => Math.min(2, p + 1))}>
                    Next Step
                  </AUBUTTON>
                </div>
              </div>
            </PropCombination>
          </div>
        </PlaygroundSection>

        {/* ========================================================
            AUTIMELINE
           ======================================================== */}
        <PlaygroundSection
          id="autimeline"
          title="AUTIMELINE (Event Feeds)"
          description="Sleek chronologies showing system logs, check steps, and audit alerts."
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }}>
            <PropCombination snippet="autimeline_events" props='timeline event items'>
              <div style={{ width: "100%" }}>
                <AUTIMELINE
                  items={[
                    {
                      id: 1,
                      title: "Neural Mesh Setup Complete",
                      description: "Applied Midnight Obsidian visual overrides to AUBUTTON and AUCARD systems.",
                      timestamp: "Just now",
                      status: "completed",
                      icon: "✨"
                    },
                    {
                      id: 2,
                      title: "Theme Sync Complete",
                      description: "Local variables mapping aligned with color map arrays.",
                      timestamp: "12 mins ago",
                      status: "completed",
                      icon: "✓"
                    },
                    {
                      id: 3,
                      title: "Spike Detected",
                      description: "Luminance limits exceeded on Section 4 card glow borders.",
                      timestamp: "1 hour ago",
                      status: "pending",
                      icon: "⚠️"
                    }
                  ]}
                />
              </div>
            </PropCombination>
          </div>
        </PlaygroundSection>

        {/* ========================================================
            AUPAGINATION
           ======================================================== */}
        <PlaygroundSection
          id="aupagination"
          title="AUPAGINATION (Page Navigators)"
          description="Numbered list indexes for page increments and table queries."
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
            <PropCombination snippet="aupagination_basic" props='currentPage={1} totalPages={5}'>
              <AUPAGINATION
                currentPage={currentPage}
                totalPages={5}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </PropCombination>
          </div>
        </PlaygroundSection>

        {/* ========================================================
            AUMODAL
           ======================================================== */}
        <PlaygroundSection
          id="aumodal"
          title="AUMODAL (Dialog Overlays)"
          description="Sleek, blur-backdrop overlays displaying important settings details."
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
            <PropCombination snippet="aumodal_trigger" props='modalTriggerButton'>
              <div style={{ width: "100%" }}>
                <AUBUTTON variant="primary" onClick={() => setModalOpen(true)}>
                  Trigger Modal Box
                </AUBUTTON>
                <AUMODAL
                  isOpen={modalOpen}
                  onClose={() => setModalOpen(false)}
                  title="System Credentials Update"
                  footer={true}
                  confirmText="Acknowledge Details"
                  cancelText="Dismiss Window"
                  onConfirm={() => {
                    alert("Acknowledge trigger clicked");
                    setModalOpen(false);
                  }}
                >
                  <p style={{ margin: 0, fontSize: "0.95rem", color: "#606670", lineHeight: 1.5 }}>
                    Your visual tokens are verified against standard checks. Ensure primary elements are highlighted correctly inside layouts.
                  </p>
                </AUMODAL>
              </div>
            </PropCombination>
          </div>
        </PlaygroundSection>

        {/* ========================================================
            AUTOAST
           ======================================================== */}
        <PlaygroundSection
          id="autoast"
          title="AUTOAST (Toast Alerts)"
          description="Floating alerts displaying warnings, notifications, and operational errors."
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
            <PropCombination snippet="autoast_success" props='trigger variant success'>
              <AUBUTTON variant="secondary" onClick={() => handleTriggerToast("Database syncing complete.", "success")}>
                Trigger Success
              </AUBUTTON>
            </PropCombination>
            <PropCombination snippet="autoast_warning" props='trigger variant warning'>
              <AUBUTTON variant="secondary" onClick={() => handleTriggerToast("Lume spread limit reaching capacity.", "warning")}>
                Trigger Warning
              </AUBUTTON>
            </PropCombination>
            <PropCombination snippet="autoast_error" props='trigger variant error'>
              <AUBUTTON variant="secondary" onClick={() => handleTriggerToast("Token authorization failure.", "error")}>
                Trigger Error
              </AUBUTTON>
            </PropCombination>
            <PropCombination snippet="autoast_info" props='trigger variant info'>
              <AUBUTTON variant="secondary" onClick={() => handleTriggerToast("New server updates verified.", "info")}>
                Trigger Info
              </AUBUTTON>
            </PropCombination>
          </div>
        </PlaygroundSection>

        {/* ========================================================
            AUTOOLTIP
           ======================================================== */}
        <PlaygroundSection
          id="autooltip"
          title="AUTOOLTIP (Hover Specs)"
          description="Hover popup tooltips displaying details on focus/mouse moves."
        >
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            <PropCombination snippet="autooltip_top" props='position="top"'>
              <AUTOOLTIP content="Tooltip top context message" position="top">
                <AUBUTTON variant="outline">Hover Top</AUBUTTON>
              </AUTOOLTIP>
            </PropCombination>
            <PropCombination snippet="autooltip_bottom" props='position="bottom"'>
              <AUTOOLTIP content="Tooltip bottom context message" position="bottom">
                <AUBUTTON variant="outline">Hover Bottom</AUBUTTON>
              </AUTOOLTIP>
            </PropCombination>
            <PropCombination snippet="autooltip_left" props='position="left"'>
              <AUTOOLTIP content="Tooltip left message" position="left">
                <AUBUTTON variant="outline">Hover Left</AUBUTTON>
              </AUTOOLTIP>
            </PropCombination>
            <PropCombination snippet="autooltip_right" props='position="right"'>
              <AUTOOLTIP content="Tooltip right message" position="right">
                <AUBUTTON variant="outline">Hover Right</AUBUTTON>
              </AUTOOLTIP>
            </PropCombination>
          </div>
        </PlaygroundSection>

        {/* ========================================================
            AUPOPOVER
           ======================================================== */}
        <PlaygroundSection
          id="aupopover"
          title="AUPOPOVER (Context boxes)"
          description="Interactive detail bubbles holding markdown/HTML text."
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
            <PropCombination snippet="aupopover_basic" props='popover Trigger'>
              <AUPOPOVER content="Obsidian theme integrates deep backdrops with diffuse indigo inner line glows.">
                <AUBUTTON variant="secondary">Display Specs</AUBUTTON>
              </AUPOPOVER>
            </PropCombination>
          </div>
        </PlaygroundSection>

        {/* ========================================================
            AUPROGRESS
           ======================================================== */}
        <PlaygroundSection
          id="auprogress"
          title="AUPROGRESS (Progress Indicators)"
          description="Linear percentage slots and rotating circular gauges for operation queues."
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
            <PropCombination snippet="auprogress_linear" props='variant="linear" value={64}'>
              <div style={{ width: "100%" }}>
                <AUPROGRESS variant="linear" value={64} showValue />
              </div>
            </PropCombination>
            <PropCombination snippet="auprogress_circular" props='variant="circular" value={82}'>
              <AUPROGRESS variant="circular" value={82} showValue />
            </PropCombination>
          </div>
        </PlaygroundSection>
      </main>
    </div>
  );
}
