import React, { useState } from "react";
import {
  AUCARD,
  AUBUTTON,
  AUCHIP,
  AUTIMELINE,
  AULISTGROUP,
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
  AUMODAL,
  AUTOAST,
  AUTOASTCONTAINER,
  AUTOOLTIP,
  AUPOPOVER,
  AUPROGRESS,
  AUPAGINATION,
  AUMENU,
  AUSTEPPER
} from "./routerEngine";

export default function App() {
  // Form states
  const [name, setName] = useState("John Doe");
  const [securityKey, setSecurityKey] = useState("secret_key_123");
  const [email, setEmail] = useState("invalid-email");
  const [projectBrief, setProjectBrief] = useState("");
  const [visualTheme, setVisualTheme] = useState("Midnight Obsidian");
  const [highContrast, setHighContrast] = useState(true);
  const [motionBlur, setMotionBlur] = useState(false);
  const [rangeVal, setRangeVal] = useState(6.4);
  const [dateVal, setDateVal] = useState("2026-05-22");
  const [selectedCapabilities, setSelectedCapabilities] = useState(["ray-tracing", "volumetric-lighting"]);
  const [priorityLevel, setPriorityLevel] = useState("critical");

  // Interactive controls
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toasts, setToasts] = useState([
    {
      id: 1,
      message: "Update Successful: Global variables synced to local cache.",
      variant: "success",
      duration: 5000
    }
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedListItems, setSelectedListItems] = useState(["1"]);

  // Sample static data
  const themeOptions = [
    { label: "Midnight Obsidian", value: "Midnight Obsidian" },
    { label: "Nordic Alabaster", value: "Nordic Alabaster" },
    { label: "Cyberpunk Neon", value: "Cyberpunk Neon" },
    { label: "Earth & Anthracite", value: "Earth & Anthracite" }
  ];

  const capabilityOptions = [
    { label: "Ray Tracing", value: "ray-tracing" },
    { label: "Neural Engine", value: "neural-engine" },
    { label: "Volumetric Lighting", value: "volumetric-lighting" }
  ];

  const priorityOptions = [
    { label: "Critical Apex", value: "critical" },
    { label: "Standard Flow", value: "standard" },
    { label: "Legacy Arch", value: "legacy" }
  ];

  const timelineItems = [
    {
      id: 1,
      title: "Neural Mesh Optimized",
      description: "Optimization engine applied high-contrast indigo filters to the dashboard layer.",
      timestamp: "2 mins ago",
      status: "completed",
      icon: <span className="material-symbols-outlined">auto_awesome</span>
    },
    {
      id: 2,
      title: "Data Sync Complete",
      description: "Global assets synchronized with Obsidian cloud storage.",
      timestamp: "14 mins ago",
      status: "pending",
      icon: <span className="material-symbols-outlined">sync</span>
    },
    {
      id: 3,
      title: "Anomalous Spike",
      description: "Detected luminance overflow in Section 4. Auto-dimming applied.",
      timestamp: "1 hour ago",
      status: "failed",
      icon: <span className="material-symbols-outlined">priority_high</span>
    }
  ];

  const listItems = [
    {
      id: "1",
      title: "Ray Tracing",
      description: "Activate volumetric lighting calculations.",
      icon: <span className="material-symbols-outlined">bolt</span>,
      badge: "Enabled"
    },
    {
      id: "2",
      title: "Neural Engine",
      description: "Load local model weights into system memory.",
      icon: <span className="material-symbols-outlined">memory</span>
    },
    {
      id: "3",
      title: "Operational Feed",
      description: "Check system integrity alerts.",
      icon: <span className="material-symbols-outlined">notifications</span>,
      badge: "3 Alerts"
    }
  ];

  const stepperSteps = [
    { title: "Configuration", description: "Define system core" },
    { title: "Feedback Loop", description: "Establish Lume mesh" },
    { title: "Final Review", description: "Deploy system updates" }
  ];

  const handleTriggerToast = () => {
    const nextId = Date.now();
    const newToast = {
      id: nextId,
      message: "Interactive Action: The feedback loop has been initiated.",
      variant: "info",
      duration: 4000,
      onClose: () => {
        setToasts((prev) => prev.filter((t) => t.id !== nextId));
      }
    };
    setToasts((prev) => [newToast, ...prev]);
  };

  return (
    <div style={{ backgroundColor: "#141218", minHeight: "100vh", color: "#e6e0e9", paddingBottom: "100px" }}>
      {/* Toast notifications */}
      <AUTOASTCONTAINER toasts={toasts} position="top-right" />

      {/* TopAppBar */}
      <header className="fixed-header" style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: 100 + "%",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        height: "64px",
        backgroundColor: "rgba(20, 18, 24, 0.8)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(207, 188, 255, 0.2)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span className="material-symbols-outlined" style={{ color: "#cfbcff" }}>palette</span>
          <h1 className="font-headline-sm" style={{ color: "#cfbcff", margin: 0 }}>Aura Color Lab</h1>
        </div>
        <div style={{ display: "none", gap: "24px" }} className="md-flex">
          <a href="#" className="font-label-md" style={{ color: "#cfbcff", textDecoration: "none", fontWeight: "bold" }}>Inputs</a>
          <a href="#" className="font-label-md" style={{ color: "#cbc4d2", textDecoration: "none" }}>Buttons</a>
          <a href="#" className="font-label-md" style={{ color: "#cbc4d2", textDecoration: "none" }}>Cards</a>
          <a href="#" className="font-label-md" style={{ color: "#cbc4d2", textDecoration: "none" }}>Themes</a>
        </div>
        <button className="material-symbols-outlined" style={{
          background: "none",
          border: "none",
          color: "#cfbcff",
          cursor: "pointer",
          fontSize: "24px"
        }}>account_circle</button>
      </header>

      {/* Main content container */}
      <main style={{ maxWidth: "1440px", margin: "0 auto", padding: "100px 24px 24px 24px" }}>
        
        {/* Hero Section */}
        <section style={{ marginBottom: "48px" }}>
          <h2 className="font-headline-lg" style={{ marginBottom: "8px" }}>Form & Inputs</h2>
          <p className="font-body-lg" style={{ color: "#cbc4d2", maxWidth: "700px" }}>
            Experience the precision of the Midnight Obsidian interface. Every input field is crafted with digital craftsmanship, featuring 'Lume' borders and focused interactions.
          </p>
        </section>

        {/* Bento Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "24px" }}>
          
          {/* Form Entries Column */}
          <div style={{ gridColumn: "span 8", display: "flex", flexDirection: "column", gap: "24px" }} className="col-12-mobile">
            
            {/* Text Entry Card */}
            <AUCARD>
              <h3 className="font-headline-sm" style={{ borderBottom: "1px solid rgba(73, 69, 81, 0.3)", paddingBottom: "8px", marginBottom: "24px" }}>Text Entry</h3>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }} className="grid-1-mobile">
                
                {/* Name field */}
                <AUINPUT
                  id="fullname"
                  label="Full Name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  clearable
                />

                {/* Password field */}
                <AUINPUT
                  id="security-key"
                  label="Security Key"
                  type="password"
                  value={securityKey}
                  onChange={(e) => setSecurityKey(e.target.value)}
                  showPasswordToggle
                  prefixIcon={<span className="material-symbols-outlined" style={{ fontSize: "18px" }}>lock</span>}
                />

                {/* Email with error */}
                <AUINPUT
                  id="email"
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error="Please enter a valid email address."
                  prefixIcon={<span className="material-symbols-outlined" style={{ fontSize: "18px" }}>mail</span>}
                />

                {/* Date Picker */}
                <AUDATEPICKER
                  id="date-picker"
                  label="Date Picker"
                  mode="date"
                  value={dateVal}
                  onChange={(e) => setDateVal(e.target.value)}
                />
              </div>

              {/* Textarea field */}
              <div style={{ marginTop: "24px" }}>
                <AUTEXTAREA
                  id="project-brief"
                  label="Project Brief"
                  placeholder="Describe your vision..."
                  value={projectBrief}
                  onChange={(e) => setProjectBrief(e.target.value)}
                  maxLength={500}
                  charCount
                />
              </div>
            </AUCARD>

            {/* Selection & Toggles Card */}
            <AUCARD>
              <h3 className="font-headline-sm" style={{ borderBottom: "1px solid rgba(73, 69, 81, 0.3)", paddingBottom: "8px", marginBottom: "24px" }}>Selection & Toggles</h3>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }} className="grid-1-mobile">
                
                {/* Select field */}
                <AUSELECT
                  id="visual-theme"
                  label="Visual Theme"
                  options={themeOptions}
                  value={visualTheme}
                  onChange={(e) => setVisualTheme(e.target.value)}
                  searchable
                />

                {/* Toggles */}
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <label className="font-label-lg" style={{ color: "#e6e0e9", textTransform: "uppercase", letterSpacing: "0.05em" }}>Environment Settings</label>
                  <AUTOGGLE
                    id="high-contrast"
                    label="Enable High Contrast"
                    checked={highContrast}
                    onChange={(e) => setHighContrast(e.target.checked)}
                    activeLabel="On"
                    inactiveLabel="Off"
                  />
                  <AUTOGGLE
                    id="motion-blur"
                    label="Motion Blur FX"
                    checked={motionBlur}
                    onChange={(e) => setMotionBlur(e.target.checked)}
                    activeLabel="Active"
                    inactiveLabel="Disabled"
                  />
                </div>
              </div>
            </AUCARD>

            {/* Linear Progress bars */}
            <AUCARD>
              <h3 className="font-headline-sm" style={{ marginBottom: "24px" }}>System Integrity</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }} className="font-label-md">
                    <span>System Integrity</span>
                    <span>84%</span>
                  </div>
                  <AUPROGRESS variant="linear" value={84} />
                </div>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }} className="font-label-md">
                    <span>Processing Flux</span>
                    <span>42%</span>
                  </div>
                  <AUPROGRESS variant="linear" value={42} showValue />
                </div>
              </div>
            </AUCARD>
          </div>

          {/* Sidebar controls / interactive overlays */}
          <div style={{ gridColumn: "span 4", display: "flex", flexDirection: "column", gap: "24px" }} className="col-12-mobile">
            
            {/* Capabilities Checkbox Group */}
            <AUCARD>
              <AUCHECKBOXGROUP
                label="Capabilities"
                value={selectedCapabilities}
                onChange={setSelectedCapabilities}
              >
                <AUCHECKBOX id="cap-ray" value="ray-tracing" label="Ray Tracing" />
                <AUCHECKBOX id="cap-neural" value="neural-engine" label="Neural Engine" />
                <AUCHECKBOX id="cap-vol" value="volumetric-lighting" label="Volumetric Lighting" />
              </AUCHECKBOXGROUP>
            </AUCARD>

            {/* Priority Radio Group */}
            <AUCARD>
              <AURADIOGROUP
                label="Priority Level"
                value={priorityLevel}
                onChange={setPriorityLevel}
              >
                <AURADIO id="prio-crit" value="critical" label="Critical Apex" />
                <AURADIO id="prio-std" value="standard" label="Standard Flow" />
                <AURADIO id="prio-leg" value="legacy" label="Legacy Arch" />
              </AURADIOGROUP>
            </AUCARD>

            {/* Range Slider */}
            <AUCARD>
              <AURANGE
                id="luminance-sensitivity"
                label="Luminance Sensitivity"
                min={0}
                max={10}
                step={0.1}
                value={rangeVal}
                onChange={(e) => setRangeVal(parseFloat(e.target.value))}
                helperText="Interaction effects calculated on 4px grid"
              />
            </AUCARD>

            {/* Popovers & Tooltips Card */}
            <AUCARD>
              <h3 className="font-headline-sm" style={{ marginBottom: "16px" }}>Popover & Tooltip</h3>
              <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                <AUPOPOVER
                  content={
                    <div style={{ padding: "8px" }}>
                      <p className="font-label-lg" style={{ color: "#cfbcff", margin: "0 0 8px 0" }}>Lume Elevation</p>
                      <p className="font-body-sm" style={{ margin: 0 }}>This surface uses a 1px primary-tinted hairline and a subtle inner glow to create perceived depth.</p>
                    </div>
                  }
                  position="top"
                >
                  <AUBUTTON variant="secondary" size="small">Info Popover</AUBUTTON>
                </AUPOPOVER>

                <AUTOOLTIP content="Midnight Obsidian CSS theme is fully active." position="bottom">
                  <AUBUTTON variant="outline" size="small">Hover Tooltip</AUBUTTON>
                </AUTOOLTIP>
              </div>
            </AUCARD>
          </div>

          {/* Stepper Flow Card */}
          <div style={{ gridColumn: "span 12" }}>
            <AUCARD>
              <h3 className="font-headline-sm" style={{ marginBottom: "24px" }}>Operational Pipeline</h3>
              <AUSTEPPER steps={stepperSteps} activeStep={1} />
            </AUCARD>
          </div>

          {/* Timeline and List Group row */}
          <div style={{ gridColumn: "span 6" }} className="col-12-mobile">
            <AUCARD>
              <h3 className="font-headline-sm" style={{ marginBottom: "24px" }}>Operational Feed</h3>
              <AUTIMELINE items={timelineItems} />
            </AUCARD>
          </div>

          <div style={{ gridColumn: "span 6" }} className="col-12-mobile">
            <AUCARD>
              <h3 className="font-headline-sm" style={{ marginBottom: "24px" }}>Interactive Checklist</h3>
              <AULISTGROUP
                selectable
                selectedItems={selectedListItems}
                onSelectionChange={setSelectedListItems}
                items={listItems}
              />
            </AUCARD>
          </div>

          {/* Centered Actions section */}
          <div style={{ gridColumn: "span 12", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px", marginTop: "24px" }}>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
              <AUBUTTON variant="primary" onClick={handleTriggerToast} rightIcon={<span className="material-symbols-outlined">notifications</span>}>
                Trigger Toast
              </AUBUTTON>
              
              <AUBUTTON variant="gradient" onClick={() => setIsModalOpen(true)}>
                Security Apex Modal
              </AUBUTTON>
            </div>
            <p className="font-label-md" style={{ color: "#cbc4d2" }}>Requires high-level authentication clearance</p>
          </div>

        </div>

        {/* Modal definition */}
        <AUMODAL
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="System Security Update"
          onConfirm={() => setIsModalOpen(false)}
          confirmText="Acknowledge"
          cancelText="View Logs"
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "16px" }}>
            <div style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              backgroundColor: "rgba(103, 80, 164, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: "32px", color: "#cfbcff" }}>verified_user</span>
            </div>
            <p className="font-body-md" style={{ color: "#cbc4d2" }}>
              Your security protocols have been enhanced. The Aura Color Lab now utilizes multi-layered Lume encryption for all design tokens.
            </p>
          </div>
        </AUMODAL>

      </main>

      {/* Styles for mobile and desktop alignment */}
      <style>{`
        .md-flex {
          display: flex !important;
        }
        @media (max-width: 768px) {
          .col-12-mobile {
            grid-column: span 12 !important;
          }
          .grid-1-mobile {
            grid-template-columns: 1fr !important;
          }
          .md-flex {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
