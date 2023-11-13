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
    <label>
      <input type="checkbox" defaultChecked={isToggled} onClick={callback} />
      <span />
    </label>
  );
};

export default Toggle;
