import React from "react";

interface SliderProps {
  id: string;
  value: number;
  onChange: (value: number) => void;
  onBlur?: () => void;
  onMouseDown?: () => void;
  onMouseUp?: () => void;
  min?: number;
  max?: number;
  step?: number;
  widthClass?: string;
  disabled?: boolean;
}

const Slider: React.FC<SliderProps> = ({
  id,
  value,
  onChange,
  min = 0,
  max = 1,
  step = 0.1,
  onBlur,
  onMouseDown,
  onMouseUp,
  widthClass = "w-[215px]",
  disabled = false
}) => {
  const backgroundStyle = {
    background: `linear-gradient(to right, var(--tw-neutral-750, #484B5A) ${((value - min) / (max - min)) * 100}%, var(--tw-light-inertBorder, rgba(72, 75, 90, 0.08)) ${((value - min) / (max - min)) * 100}%)`
  };

  const baseStyles =
    "h-2 w-full cursor-pointer appearance-none rounded-full focus:outline-none focus:ring-0";

  const mozRangeThumbStyles = `
    [&::-moz-range-thumb]:-mt-1
    [&::-moz-range-thumb]:h-3
    [&::-moz-range-thumb]:w-3
    [&::-moz-range-thumb]:cursor-pointer
    [&::-moz-range-thumb]:rounded-full
    [&::-moz-range-thumb]:border-[1px]
    [&::-moz-range-thumb]:border-solid
    [&::-moz-range-thumb]:border-neutral-750
    [&::-moz-range-thumb]:bg-light-surface-1
  `;

  const mozRangeTrackStyles = `
    [&::-moz-range-track]:h-1
    [&::-moz-range-track]:rounded-full
    [&::-moz-range-track]:bg-transparent
  `;

  const webkitSliderTrackStyles = `
    [&::-webkit-slider-runnable-track]:h-1
    [&::-webkit-slider-runnable-track]:rounded-full
    [&::-webkit-slider-runnable-track]:bg-transparent
  `;

  const webkitSliderThumbStyles = `
    [&::-webkit-slider-thumb]:-mt-1
    [&::-webkit-slider-thumb]:h-3
    [&::-webkit-slider-thumb]:w-3
    [&::-webkit-slider-thumb]:cursor-pointer
    [&::-webkit-slider-thumb]:appearance-none
    [&::-webkit-slider-thumb]:rounded-full
    [&::-webkit-slider-thumb]:border-[1px]
    [&::-webkit-slider-thumb]:border-solid
    [&::-webkit-slider-thumb]:border-neutral-750
    [&::-webkit-slider-thumb]:bg-light-surface-1
    [&::-webkit-slider-thumb]:hover:shadow-elevation2
    [&::-webkit-slider-thumb]:active:shadow-elevation3
  `;

  return (
    <div
      id={id}
      role="slider"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      className={`slider-container m-0 flex h-2 select-none  ${widthClass} flex-col items-center justify-center p-0 focus:outline-none focus:ring-0`}
    >
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        onBlur={onBlur}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        className={`
          ${baseStyles}
          ${mozRangeThumbStyles}
          ${mozRangeTrackStyles}
          ${webkitSliderTrackStyles}
          ${webkitSliderThumbStyles}
        `}
        style={backgroundStyle}
        disabled={disabled}
      />
    </div>
  );
};

export default React.memo(Slider);