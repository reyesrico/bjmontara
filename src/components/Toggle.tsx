import React, { useState } from 'react'
// Add css to src/components/Toggle.css
import './Toggle.css'

interface ToggleProps {
    toggled: boolean;
    onClick: (toggled: boolean) => void;
}

const Toggle = ({ toggled, onClick }: ToggleProps) => {
  const [isToggled, toggle] = useState(toggled);

  const callback = () => {
      toggle(!isToggled)
      onClick(!isToggled)
  }

  return (
    <label className="toggle-label">
      <input className="toggle-input" type="checkbox" defaultChecked={isToggled} onClick={callback} />
      <span className="toggle-slider" />
    </label>
  );
};

export default Toggle;
