import clsx from "clsx";

export default function RadioGroup({
  value,
  onChange,
  options = [],
  name = "radio-group",
  orientation = "vertical", // "vertical" | "horizontal"
  className,               
  ...props                 
}) {
  return (
    <div
      role="radiogroup"
      {...props}
      className={clsx(
        "flex gap-3",
        orientation === "vertical" ? "flex-col" : "flex-row",
        className
      )}
    >
      {options.map((record) => {
        const isSelected = value === record.value;

        return (
          <label
            key={record.value}
            className="inline-flex items-center gap-2 cursor-pointer select-none"
            onClick={(e) => {
              e.preventDefault(); // ⛔ cegah radio native mengunci
              onChange(isSelected ? null : record.value);
            }}
          >
            {/* Native input (for accessibility & form) */}
            <input
              type="radio"
              name={name}
              value={record.value}
              checked={isSelected}
              readOnly
              className="sr-only"
            />

            {/* Custom radio */}
            {isSelected ? (
              <div className="relative w-5 h-5">
                <div className="absolute inset-0 rounded-full border-2 border-black bg-white" />
                <div className="absolute inset-[4px] rounded-full bg-black" />
              </div>
            ) : (
              <div className="w-5 h-5 border-2 border-black rounded-full" />
            )}

            <span className="text-sm font-medium text-[#424242]">
              {record.label}
            </span>
          </label>
        );
      })}
    </div>
  );
}
