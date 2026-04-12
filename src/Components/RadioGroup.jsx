import clsx from "clsx";

export default function RadioGroup({
  value,
  onChange,
  options = [],
  name = "radio-group",
  orientation = "vertical",
  mode="",
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
        const isSelected = value === record.identifier;
        const isClassification = mode=="classification";

        return (
          <label
            key={record.identifier}
            className={clsx(
              "cursor-pointer select-none transition-all",
              isClassification
                ? "w-full flex items-center gap-3 px-6 py-5 rounded-2xl border-2"
                : "inline-flex items-center gap-2",
              record.className
            )}
            onClick={(e) => {
              e.preventDefault();
              onChange(isSelected ? null : record.identifier);
            }}
          >
            {/* Native input */}
            <input
              type="radio"
              name={name}
              value={record.identifier}
              checked={isSelected}
              readOnly
              className="sr-only"
            />

            {/* Classification Variant */}
            {isClassification ? (
              <>
                <div
                  className={clsx(
                    "w-3 h-3 rounded-full bg-current",
                    !isSelected && "opacity-40"
                  )}
                />

                <span className="text-base font-semibold">
                  {record.label}
                </span>
              </>
            ) : (
              <>
                {/* Default Variant */}
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
              </>
            )}
          </label>
        );
      })}
    </div>
  );
}