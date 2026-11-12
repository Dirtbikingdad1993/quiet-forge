import { useEffect, useId, useState } from "react";
import { fmtLen, type Unit } from "@/lib/quietforge/model";

export function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-bg/80 p-4 sm:items-center"
      onMouseDown={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="qf-dialog-title"
        className="w-full max-w-md rounded-lg border border-border bg-surface p-5 shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h2 id="qf-dialog-title" className="text-lg font-semibold text-fg">
          {title}
        </h2>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

export function LengthControl({
  label,
  inches,
  minIn,
  maxIn,
  stepIn,
  unit,
  digits = 3,
  onChange,
}: {
  label: string;
  inches: number;
  minIn: number;
  maxIn: number;
  stepIn: number;
  unit: Unit;
  digits?: number;
  onChange: (inches: number) => void;
}) {
  const scale = unit === "mm" ? 25.4 : 1;
  const shown = inches * scale;
  const [focused, setFocused] = useState(false);
  const [text, setText] = useState("");
  const id = useId();
  useEffect(() => {
    if (!focused) setText(shown.toFixed(unit === "mm" ? Math.max(1, digits - 1) : digits));
  }, [shown, focused, unit, digits]);

  const commit = (raw: string) => {
    const n = Number(raw);
    if (!Number.isFinite(n)) return;
    onChange(n / scale);
  };

  return (
    <label className="block" htmlFor={id}>
      <span className="mb-2 flex flex-wrap items-baseline justify-between gap-2 text-base font-medium text-fg">
        <span>{label}</span>
        <span className="font-mono text-xs text-brass">{fmtLen(inches, unit, digits)}</span>
      </span>
      <div className="flex items-center gap-3">
        <input
          id={id}
          type="range"
          min={minIn * scale}
          max={maxIn * scale}
          step={unit === "mm" ? Math.max(0.1, stepIn * scale) : stepIn}
          value={shown}
          onChange={(e) => onChange(Number(e.target.value) / scale)}
          className="h-11 min-w-0 flex-1 cursor-pointer accent-brass touch-pan-y"
        />
        <input
          aria-label={`${label} value`}
          inputMode="decimal"
          value={text}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            commit(text);
          }}
          onChange={(e) => {
            setText(e.target.value);
            commit(e.target.value);
          }}
          className="h-12 w-24 shrink-0 rounded-md border border-border bg-bg px-3 py-2 text-right font-mono text-base text-fg outline-none focus:border-brass"
        />
      </div>
    </label>
  );
}

export function CountControl({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
}) {
  const id = useId();
  return (
    <label className="block" htmlFor={id}>
      <span className="mb-2 flex items-baseline justify-between gap-2 text-base font-medium text-fg">
        <span>{label}</span>
        <span className="font-mono text-xs text-brass">{value}</span>
      </span>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-11 w-full cursor-pointer accent-brass touch-pan-y"
      />
    </label>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  const id = useId();
  return (
    <label className="block text-base font-medium text-fg" htmlFor={id}>
      {label}
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 min-h-12 w-full rounded-md border border-border bg-bg px-3 py-2.5 text-base text-fg outline-none focus:border-brass"
      >
        {children}
      </select>
    </label>
  );
}
