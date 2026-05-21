import React, { useState } from 'react';
import { AUBUTTON, AUINPUT, AUTEXTAREA, AUSELECT, AUTOGGLE, AURANGE, AUDATEPICKER, AUCHECKBOX, AUCHECKBOXGROUP, AURADIO, AURADIOGROUP, AUCARD, AUMODAL, AUTOAST, AUTOASTCONTAINER, AUTOOLTIP, AUPOPOVER, AUPROGRESS, AUPAGINATION, AUMENU, AUSTEPPER, AUCHIP, AUTIMELINE, AULISTGROUP } from 'artiqui/dist/router-engine.es.js';

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [activeStep, setActiveStep] = useState(1);
  const [selectedChip, setSelectedChip] = useState(false);
  const [selectedItems, setSelectedItems] = useState(['1']);

  const showToast = (variant, message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, variant, message, onClose: () => removeToast(id) }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <div style={{ padding: "20px" }}>
      <AUTOASTCONTAINER toasts={toasts} />

      <AUCARD>
        <h2 className="underline">Hello World</h2>
        <p>This is inside a card.</p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
          <AUBUTTON variant="primary" onClick={() => alert('Primary clicked')}>
            Primary
          </AUBUTTON>
          <AUBUTTON variant="secondary" onClick={() => alert('Secondary clicked')}>
            Secondary
          </AUBUTTON>
          <AUBUTTON variant="outline" onClick={() => alert('Outline clicked')}>
            Outline
          </AUBUTTON>
          <AUBUTTON variant="ghost" onClick={() => alert('Ghost clicked')}>
            Ghost
          </AUBUTTON>
          <AUBUTTON variant="danger" onClick={() => alert('Danger clicked')}>
            Danger
          </AUBUTTON>
          <AUBUTTON variant="link" onClick={() => alert('Link clicked')}>
            Link
          </AUBUTTON>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
          <AUBUTTON loading>Loading</AUBUTTON>
          <AUBUTTON disabled>Disabled</AUBUTTON>
          <AUBUTTON leftIcon="←">Left Icon</AUBUTTON>
          <AUBUTTON rightIcon="→">Right Icon</AUBUTTON>
          <AUBUTTON rounded>Rounded</AUBUTTON>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <AUBUTTON variant="outline" rounded leftIcon="⭐" rightIcon="→">
            Rounded Outline
          </AUBUTTON>
          <AUBUTTON variant="danger" loading rounded>
            Saving
          </AUBUTTON>
        </div>

        <div style={{ marginTop: '1.5rem', display: 'grid', gap: '1rem' }}>
          <h3>AUINPUT Demo</h3>
          <AUINPUT
            id="input-text"
            label="Text input"
            placeholder="Enter text"
            helperText="This is a normal text field."
            clearable
            prefixIcon="T"
          />

          <AUINPUT
            id="input-password"
            label="Password"
            type="password"
            placeholder="Enter password"
            suffixIcon="🔒"
            helperText="Use a strong password."
          />

          <AUINPUT
            id="input-email"
            label="Email"
            type="email"
            placeholder="name@example.com"
            helperText="We'll never share your email."
            clearable
          />

          <AUINPUT
            id="input-number"
            label="Number"
            type="number"
            placeholder="0"
            helperText="Only numeric values are allowed."
            prefixIcon="#"
          />

          <AUINPUT
            id="input-error"
            label="With error"
            type="text"
            placeholder="Invalid value"
            error="This field is required."
            suffixIcon="!"
          />

          <div style={{ marginTop: '1.5rem', display: 'grid', gap: '1rem' }}>
            <h3>Textarea, Select, Checkbox, and Radio Demo</h3>
            <AUTEXTAREA
              id="textarea-auto"
              label="Auto resize textarea"
              placeholder="Type a longer message..."
              helperText="This textarea expands automatically."
              maxLength={200}
              charCount
              autoResize
            />

            <AUSELECT
              id="select-basic"
              label="Single select"
              placeholder="Choose an option"
              options={[
                { label: 'Option A', value: 'a' },
                { label: 'Option B', value: 'b' },
                { label: 'Option C', value: 'c' }
              ]}
              helperText="Single select with default theme styling."
            />

            <AUSELECT
              id="select-group"
              label="Grouped multi-select"
              placeholder="Search or select"
              searchable
              multiple
              checkbox
              options={[
                {
                  label: 'Countries',
                  options: [
                    { label: 'United States', value: 'us' },
                    { label: 'Canada', value: 'ca' }
                  ]
                },
                {
                  label: 'Cities',
                  options: [
                    { label: 'London', value: 'ldn' },
                    { label: 'Tokyo', value: 'tky' }
                  ]
                }
              ]}
              helperText="Multi-select with grouped options and checkbox support."
            />

            <div style={{ display: 'grid', gap: '0.75rem' }}>
              <AUCHECKBOX
                id="checkbox-checked"
                label="Checked checkbox"
                checked
                onChange={() => {}}
              />
              <AUCHECKBOX
                id="checkbox-indeterminate"
                label="Indeterminate checkbox"
                indeterminate
                onChange={() => {}}
              />
              <AUCHECKBOX
                id="checkbox-disabled"
                label="Disabled checkbox"
                checked
                disabled
                onChange={() => {}}
              />
            </div>

            <AUCHECKBOXGROUP
              name="pkg-options"
              label="Group checkbox"
              options={[
                { label: 'Apple', value: 'apple' },
                { label: 'Banana', value: 'banana' },
                { label: 'Cherry', value: 'cherry' }
              ]}
              value={['banana']}
              onChange={() => {}}
              layout="horizontal"
            />

            <AURADIOGROUP
              name="choices"
              label="Radio group"
              options={[
                { label: 'First', value: 'first' },
                { label: 'Second', value: 'second' },
                { label: 'Third', value: 'third' }
              ]}
              value="second"
              onChange={() => {}}
              layout="horizontal"
            />

            <div style={{ marginTop: '1.5rem', display: 'grid', gap: '1rem' }}>
              <h3>Toggle, Range, and Date Picker Demo</h3>
              <AUTOGGLE
                id="toggle-active"
                label="Active / Inactive"
                checked
                activeLabel="Active"
                inactiveLabel="Inactive"
                onChange={() => {}}
              />

              <AUTOGGLE
                id="toggle-disabled"
                label="Disabled toggle"
                checked={false}
                disabled
                onChange={() => {}}
              />

              <AURANGE
                id="slider-single"
                label="Range slider"
                min={0}
                max={100}
                step={5}
                tooltip
                helperText="Single value slider with tooltip."
              />

              <AURANGE
                id="slider-range"
                label="Min / Max range"
                min={0}
                max={200}
                step={10}
                range
                tooltip
                helperText="Two-handle range slider."
              />

              <AUDATEPICKER
                id="date-single"
                label="Single date"
                mode="date"
                helperText="Choose a single calendar date."
              />

              <AUDATEPICKER
                id="date-time"
                label="Time picker"
                mode="time"
                helperText="Choose a time."
              />

              <AUDATEPICKER
                id="date-datetime"
                label="Date & time"
                mode="datetime"
                helperText="Choose a date and time."
              />

              <AUDATEPICKER
                id="date-range"
                label="Date range"
                mode="range"
                helperText="Select a start and end date."
              />
            </div>
          </div>
        </div>
      </AUCARD>

      <AUCARD style={{ marginTop: '2rem' }}>
        <h2 className="underline">New Components Demo</h2>

        <div style={{ marginTop: '1.5rem', display: 'grid', gap: '2rem' }}>
          <div>
            <h3>AUMODAL Demo</h3>
            <AUBUTTON onClick={() => setModalOpen(true)}>Open Modal</AUBUTTON>
            <AUMODAL
              isOpen={modalOpen}
              onClose={() => setModalOpen(false)}
              title="Confirm Action"
              onConfirm={() => {
                alert('Confirmed!');
                setModalOpen(false);
              }}
            >
              <p>Are you sure you want to proceed with this action?</p>
            </AUMODAL>
          </div>

          <div>
            <h3>AUTOAST Demo</h3>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <AUBUTTON onClick={() => showToast('success', 'Success message!')}>Success Toast</AUBUTTON>
              <AUBUTTON onClick={() => showToast('error', 'Error message!')}>Error Toast</AUBUTTON>
              <AUBUTTON onClick={() => showToast('warning', 'Warning message!')}>Warning Toast</AUBUTTON>
              <AUBUTTON onClick={() => showToast('info', 'Info message!')}>Info Toast</AUBUTTON>
            </div>
          </div>

          <div>
            <h3>AUTOOLTIP Demo</h3>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <AUTOOLTIP content="This is a tooltip" position="top">
                <AUBUTTON>Hover me (Top)</AUBUTTON>
              </AUTOOLTIP>
              <AUTOOLTIP content="This is a tooltip" position="bottom" variant="error">
                <AUBUTTON variant="secondary">Hover me (Bottom)</AUBUTTON>
              </AUTOOLTIP>
            </div>
          </div>

          <div>
            <h3>AUPOPOVER Demo</h3>
            <AUPOPOVER
              trigger="click"
              content={
                <div>
                  <p>This is popover content!</p>
                  <AUBUTTON>Action</AUBUTTON>
                </div>
              }
            >
              <AUBUTTON>Click for Popover</AUBUTTON>
            </AUPOPOVER>
          </div>

          <div>
            <h3>AUPROGRESS Demo</h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <AUPROGRESS variant="linear" value={75} showValue />
              <AUPROGRESS variant="circular" value={60} showValue />
              <AUPROGRESS variant="dots" />
              <AUPROGRESS variant="spinner" />
            </div>
          </div>

          <div>
            <h3>AUPAGINATION Demo</h3>
            <AUPAGINATION
              currentPage={currentPage}
              totalPages={10}
              onPageChange={setCurrentPage}
              showPageSize
              pageSize={pageSize}
              onPageSizeChange={setPageSize}
              showJumpToPage
            />
          </div>

          <div>
            <h3>AUMENU Demo</h3>
            <AUMENU
              items={[
                { label: 'Home', icon: '🏠', active: true },
                { label: 'Profile', icon: '👤' },
                { divider: true },
                { label: 'Settings', icon: '⚙️', children: [
                  { label: 'Account' },
                  { label: 'Privacy' },
                  { label: 'Notifications' }
                ]},
                { label: 'Logout', icon: '🚪' }
              ]}
            />
          </div>

          <div>
            <h3>AUSTEPPER Demo</h3>
            <AUSTEPPER
              activeStep={activeStep}
              steps={[
                { title: 'Step 1', description: 'First step description' },
                { title: 'Step 2', description: 'Second step description' },
                { title: 'Step 3', description: 'Third step description' },
                { title: 'Step 4', description: 'Final step description' }
              ]}
            />
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
              <AUBUTTON onClick={() => setActiveStep(Math.max(0, activeStep - 1))} disabled={activeStep === 0}>Previous</AUBUTTON>
              <AUBUTTON onClick={() => setActiveStep(Math.min(3, activeStep + 1))} disabled={activeStep === 3}>Next</AUBUTTON>
            </div>
          </div>

          <div>
            <h3>AUCHIP Demo</h3>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <AUCHIP>Default Chip</AUCHIP>
              <AUCHIP closable onClose={() => alert('Chip closed!')}>Closable Chip</AUCHIP>
              <AUCHIP selectable selected={selectedChip} onClick={() => setSelectedChip(!selectedChip)}>
                Selectable Chip
              </AUCHIP>
            </div>
          </div>

          <div>
            <h3>AUTIMELINE Demo</h3>
            <AUTIMELINE
              items={[
                { title: 'Order Placed', description: 'Your order has been placed successfully', timestamp: '2 hours ago', status: 'completed' },
                { title: 'Order Confirmed', description: 'Seller has confirmed your order', timestamp: '1 hour ago', status: 'completed' },
                { title: 'Shipped', description: 'Your order is on the way', timestamp: '30 mins ago', status: 'active' },
                { title: 'Delivered', description: 'Expected delivery tomorrow', timestamp: 'Tomorrow', status: 'pending' }
              ]}
            />
          </div>

          <div>
            <h3>AULISTGROUP Demo</h3>
            <AULISTGROUP
              selectable
              selectedItems={selectedItems}
              onSelectionChange={setSelectedItems}
              items={[
                { id: '1', title: 'Item 1', description: 'Description for item 1', icon: '📄' },
                { id: '2', title: 'Item 2', description: 'Description for item 2', icon: '📊' },
                { id: '3', title: 'Item 3', description: 'Description for item 3', icon: '⚙️', children: [
                  { id: '3-1', title: 'Subitem 1', icon: '🔧' },
                  { id: '3-2', title: 'Subitem 2', icon: '🛠️' }
                ]}
              ]}
            />
          </div>
        </div>
      </AUCARD>
    </div>
  );
}
