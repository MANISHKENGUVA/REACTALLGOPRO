/** Copy-paste JSX snippets for AllComponentsPlaygroundPage */
export const PLAYGROUND_SNIPPETS = {
  aubutton_primary: `<AUBUTTON variant="primary">Primary Action</AUBUTTON>`,
  aubutton_secondary: `<AUBUTTON variant="secondary">Secondary Action</AUBUTTON>`,
  aubutton_outline: `<AUBUTTON variant="outline">Outline Action</AUBUTTON>`,
  aubutton_ghost: `<AUBUTTON variant="ghost">Ghost Button</AUBUTTON>`,
  aubutton_danger: `<AUBUTTON variant="danger">Destructive Action</AUBUTTON>`,
  aubutton_gradient: `<AUBUTTON variant="gradient">Gradient Action</AUBUTTON>`,
  aubutton_link: `<AUBUTTON variant="link">Hyperlink Button</AUBUTTON>`,
  aubutton_rounded: `<AUBUTTON variant="primary" rounded>Rounded Button</AUBUTTON>`,
  aubutton_loading: `<AUBUTTON variant="primary" loading>Processing...</AUBUTTON>`,
  aubutton_disabled: `<AUBUTTON variant="primary" disabled>Unavailable</AUBUTTON>`,
  aubutton_leftIcon: `<AUBUTTON variant="outline" leftIcon="⭐">Starred Action</AUBUTTON>`,
  aubutton_rightIcon: `<AUBUTTON variant="primary" rightIcon="→">Continue</AUBUTTON>`,

  auchip_default: `<AUCHIP>Default tag</AUCHIP>`,
  auchip_success: `<AUCHIP variant="success">Completed</AUCHIP>`,
  auchip_warning: `<AUCHIP variant="warning">In Review</AUCHIP>`,
  auchip_danger: `<AUCHIP variant="danger">Rejected</AUCHIP>`,
  auchip_closable: `<AUCHIP closable onClose={() => alert("Chip dismissed")}>Dismissible</AUCHIP>`,
  auchip_selectable_selected: `<AUCHIP selectable selected>Active state</AUCHIP>`,
  auchip_selectable_unselected: `<AUCHIP selectable selected={false}>Inactive state</AUCHIP>`,

  aucard_basic: `<AUCARD title="Visual Analytics Panel" description="Overview of neural execution mesh metrics">
  <p>Depth and layering are maintained via primary-tinted hairlines.</p>
</AUCARD>`,
  aucard_footer: `<AUCARD
  title="System Update"
  description="Security patches deployed successfully"
  footer={
    <div style={{ display: "flex", gap: "0.5rem" }}>
      <AUBUTTON variant="primary">Acknowledge</AUBUTTON>
      <AUBUTTON variant="ghost">View release logs</AUBUTTON>
    </div>
  }
>
  <p>The visual system has been upgraded to Midnight Obsidian theme.</p>
</AUCARD>`,

  auinput_placeholder: `<AUINPUT placeholder="John Doe" />`,
  auinput_label: `<AUINPUT id="input-float" label="Full Name" />`,
  auinput_email: `<AUINPUT type="email" id="input-email" label="Email Address" defaultValue="manish@gmail.com" prefixIcon="✉️" />`,
  auinput_password: `<AUINPUT type="password" id="input-pass" label="Security Key" showPasswordToggle clearable defaultValue="pass123" prefixIcon="🔐" />`,
  auinput_disabled: `<AUINPUT id="input-dis" label="Username" defaultValue="manish37" disabled prefixIcon="👤" />`,
  auinput_error: `<AUINPUT id="input-err" label="PAN Identifier" defaultValue="ABC" error="Invalid PAN code pattern" prefixIcon="💳" />`,
  auinput_helper: `<AUINPUT id="input-help" label="Contact Mobile" placeholder="10-digit number" helperText="Exclude country code prefix (+91)" prefixIcon="📞" />`,

  autextarea_basic: `<AUTEXTAREA id="text-std" label="Project Brief" placeholder="Describe your vision here..." />`,
  autextarea_charCount: `<AUTEXTAREA
  id="text-count"
  label="Cover Statement"
  maxLength={200}
  charCount
  placeholder="Summarize your professional experience..."
  defaultValue="I have 5+ years of experience with React, building accessible design libraries."
/>`,
  autextarea_error: `<AUTEXTAREA id="text-err" label="Additional Comments" defaultValue="Short" error="Remarks must contain at least 20 characters." />`,

  auselect_single: `<AUSELECT
  label="Theme Preference"
  options={[
    { label: "Midnight Obsidian", value: "obsidian" },
    { label: "Nordic Alabaster", value: "nordic" },
    { label: "Cyberpunk Neon", value: "cyberpunk" }
  ]}
  value={selectValue}
  onChange={(e) => setSelectValue(e.target.value)}
/>`,
  auselect_searchable: `<AUSELECT
  label="Host Region"
  searchable
  options={[
    { label: "Mumbai (ap-south-1)", value: "bom" },
    { label: "Singapore (ap-southeast-1)", value: "sin" },
    { label: "Frankfurt (eu-central-1)", value: "fra" },
    { label: "N. Virginia (us-east-1)", value: "iad" }
  ]}
/>`,
  auselect_multiple: `<AUSELECT
  label="Required Clearance"
  multiple
  checkbox
  options={[
    { label: "Read Database", value: "r" },
    { label: "Write Records", value: "w" },
    { label: "Execute Triggers", value: "x" }
  ]}
  defaultValue={["r"]}
/>`,
  auselect_loading: `<AUSELECT label="Active Server Node" loading asyncText="Querying live host arrays..." />`,
  auselect_error: `<AUSELECT
  label="Operating System"
  error="Selected OS is unsupported"
  options={[{ label: "macOS", value: "mac" }, { label: "Linux", value: "linux" }]}
/>`,

  autoggle_basic: `<AUTOGGLE
  label="Environment Sync"
  checked={toggleValue}
  onChange={(e) => setToggleValue(e.target.checked)}
/>`,
  autoggle_labels: `<AUTOGGLE
  label="Server Flux"
  checked={toggleValue}
  onChange={(e) => setToggleValue(e.target.checked)}
  activeLabel="ONLINE"
  inactiveLabel="OFFLINE"
/>`,
  autoggle_disabled_on: `<AUTOGGLE label="Strict Enforcement" checked={true} disabled />`,
  autoggle_disabled_off: `<AUTOGGLE label="Volumetric Glow" checked={false} disabled />`,

  aurange_basic: `<AURANGE
  label="Audio Master Gain"
  min={0}
  max={100}
  value={rangeValue}
  onChange={(e) => setRangeValue(Number(e.target.value))}
/>`,
  aurange_tooltip: `<AURANGE
  label="Luminance Filter"
  min={0}
  max={100}
  tooltip
  value={rangeValue}
  onChange={(e) => setRangeValue(Number(e.target.value))}
/>`,
  aurange_disabled: `<AURANGE label="Contrast Threshold" min={0} max={100} value={72} disabled />`,

  audatepicker_date: `<AUDATEPICKER label="Filing Date" mode="date" />`,
  audatepicker_datetime: `<AUDATEPICKER label="Scheduled Time" mode="datetime" />`,
  audatepicker_time: `<AUDATEPICKER label="Trigger Alarm" mode="time" />`,
  audatepicker_range: `<AUDATEPICKER label="Deployment Window" range />`,

  aucheckbox_checked: `<AUCHECKBOX
  label="Include source maps"
  checked={checkboxValue}
  onChange={(e) => setCheckboxValue(e.target.checked)}
/>`,
  aucheckbox_indeterminate: `<AUCHECKBOX label="Parent check selection" indeterminate />`,
  aucheckbox_disabled_on: `<AUCHECKBOX label="Auto-deploy configuration" checked={true} disabled />`,
  aucheckbox_disabled_off: `<AUCHECKBOX label="Enforce SSL encryption" checked={false} disabled />`,

  aucheckboxgroup_horizontal: `<AUCHECKBOXGROUP
  label="Selected Server Capabilities"
  options={[
    { label: "Volumetric Lights", value: "lume" },
    { label: "Neural Flow Engine", value: "neural" },
    { label: "Hardware Raytracing", value: "ray" }
  ]}
  defaultValue={["lume", "neural"]}
/>`,

  auradio_checked: `<AURADIO
  label="Classic theme"
  checked={radioValue === "option1"}
  onChange={() => setRadioValue("option1")}
/>`,
  auradio_unchecked: `<AURADIO
  label="Midnight Obsidian"
  checked={radioValue === "option2"}
  onChange={() => setRadioValue("option2")}
/>`,
  auradio_disabled: `<AURADIO label="Cyberpunk Neon" checked={false} disabled />`,

  auradiogroup_vertical: `<AURADIOGROUP
  label="Target Deployment Host"
  options={[
    { label: "Amazon Web Services (AWS)", value: "aws" },
    { label: "Google Cloud Platform (GCP)", value: "gcp" },
    { label: "Microsoft Azure Node", value: "azure" }
  ]}
  defaultValue="aws"
/>`,

  aulistgroup_selectable: `<AULISTGROUP
  selectable
  selectedItems={selectedListItems}
  onSelectionChange={setSelectedListItems}
  items={[
    { id: "1", title: "Executive Dashboard", description: "Visual overview of recent spikes", icon: "📊", badge: "New" },
    { id: "2", title: "System Preferences", description: "Toggle lume layout constraints", icon: "⚙️" },
    { id: "3", title: "Cloud Integrations", description: "Audit remote node linkages", icon: "☁️", badge: "12" }
  ]}
/>`,

  aumenu_items: `<AUMENU
  items={[
    { label: "Profile Account", icon: "👤" },
    { label: "Theme Configurations", icon: "⚙️", active: true },
    { divider: true },
    { label: "Clear Session Cache", icon: "🧹", disabled: true },
    { label: "Logout", icon: "↩️" }
  ]}
/>`,

  austepper_active: `<AUSTEPPER
  steps={[
    { title: "Define Tokens", description: "Configure system colors & margins" },
    { title: "Deploy Library", description: "Run ES/UMD library compilers" },
    { title: "Verify Playground", description: "Visually check component specs" }
  ]}
  activeStep={activeStep}
/>`,

  autimeline_events: `<AUTIMELINE
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
/>`,

  aupagination_basic: `<AUPAGINATION
  currentPage={currentPage}
  totalPages={5}
  onPageChange={(page) => setCurrentPage(page)}
/>`,

  aumodal_trigger: `<AUBUTTON variant="primary" onClick={() => setModalOpen(true)}>
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
  <p>Your visual tokens are verified against standard checks.</p>
</AUMODAL>`,

  autoast_success: `<AUBUTTON variant="secondary" onClick={() => handleTriggerToast("Database syncing complete.", "success")}>
  Trigger Success
</AUBUTTON>`,
  autoast_warning: `<AUBUTTON variant="secondary" onClick={() => handleTriggerToast("Lume spread limit reaching capacity.", "warning")}>
  Trigger Warning
</AUBUTTON>`,
  autoast_error: `<AUBUTTON variant="secondary" onClick={() => handleTriggerToast("Token authorization failure.", "error")}>
  Trigger Error
</AUBUTTON>`,
  autoast_info: `<AUBUTTON variant="secondary" onClick={() => handleTriggerToast("New server updates verified.", "info")}>
  Trigger Info
</AUBUTTON>`,

  autooltip_top: `<AUTOOLTIP content="Tooltip top context message" position="top">
  <AUBUTTON variant="outline">Hover Top</AUBUTTON>
</AUTOOLTIP>`,
  autooltip_bottom: `<AUTOOLTIP content="Tooltip bottom context message" position="bottom">
  <AUBUTTON variant="outline">Hover Bottom</AUBUTTON>
</AUTOOLTIP>`,
  autooltip_left: `<AUTOOLTIP content="Tooltip left message" position="left">
  <AUBUTTON variant="outline">Hover Left</AUBUTTON>
</AUTOOLTIP>`,
  autooltip_right: `<AUTOOLTIP content="Tooltip right message" position="right">
  <AUBUTTON variant="outline">Hover Right</AUBUTTON>
</AUTOOLTIP>`,

  aupopover_basic: `<AUPOPOVER content="Obsidian theme integrates deep backdrops with diffuse indigo inner line glows.">
  <AUBUTTON variant="secondary">Display Specs</AUBUTTON>
</AUPOPOVER>`,

  auprogress_linear: `<AUPROGRESS variant="linear" value={64} showValue />`,
  auprogress_circular: `<AUPROGRESS variant="circular" value={82} showValue />`,
};
