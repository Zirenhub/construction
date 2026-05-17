'use client';

import { useState } from 'react';

const PRESET_UNITS = ['m', 'm2', 'm3', 'бр', 'кг', 'т', 'л'];

export type SmrFormData = {
  name: string;
  unit: string;
  quantity: number;
  done: number;
  active: boolean;
  brigade: string;
  pricePerUnit: number;
  totalValue: number;
  note: string;
};

type Props = {
  open: boolean;
  onCloseAction: () => void;
  onSaveAction: (smr: SmrFormData) => void;
};

const empty = {
  name: '',
  unit: '',
  customUnit: '',
  quantity: '',
  pricePerUnit: '',
  totalValue: '',
  brigade: '',
  note: '',
};

export default function CreateSmrSheet({
  open,
  onCloseAction,
  onSaveAction,
}: Props) {
  const [form, setForm] = useState(empty);
  const [useCustomUnit, setUseCustomUnit] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function reset() {
    setForm(empty);
    setUseCustomUnit(false);
    setErrors({});
  }

  function handleClose() {
    reset();
    onCloseAction();
  }

  // Auto-calculate total when price or quantity changes
  function handlePriceChange(val: string) {
    const total = Number(val) * Number(form.quantity);
    setForm({
      ...form,
      pricePerUnit: val,
      totalValue: total > 0 ? String(total) : '',
    });
  }

  function handleQuantityChange(val: string) {
    const total = Number(form.pricePerUnit) * Number(val);
    setForm({
      ...form,
      quantity: val,
      totalValue: total > 0 ? String(total) : '',
    });
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Задължително поле';
    if (
      !form.quantity ||
      isNaN(Number(form.quantity)) ||
      Number(form.quantity) <= 0
    )
      e.quantity = 'Въведете валидно количество';
    const unit = useCustomUnit ? form.customUnit.trim() : form.unit;
    if (!unit) e.unit = 'Изберете или въведете мярка';
    return e;
  }

  function handleSave() {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    onSaveAction({
      name: form.name.trim(),
      unit: useCustomUnit ? form.customUnit.trim() : form.unit,
      quantity: Number(form.quantity),
      done: 0,
      active: true,
      brigade: form.brigade.trim() || '—',
      pricePerUnit: Number(form.pricePerUnit) || 0,
      totalValue: Number(form.totalValue) || 0,
      note: form.note.trim(),
    });
    reset();
    onCloseAction();
  }

  const activeUnit = useCustomUnit ? form.customUnit : form.unit;

  return (
    <>
      <div
        onClick={handleClose}
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-200
          ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      />
      <div
        className={`fixed top-0 right-0 h-full w-full md:max-w-md bg-zinc-950 md:border-l border-zinc-800
        z-50 flex flex-col transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800">
          <h2 className="text-base font-medium text-zinc-100">Нова СМР</h2>
          <button
            onClick={handleClose}
            className="text-zinc-500 hover:text-zinc-200 transition-colors text-xl leading-none"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">
              Вид работа <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="напр. Мазилка, Топлоизолация..."
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2.5
                text-sm text-zinc-100 placeholder:text-zinc-600
                focus:outline-none focus:border-zinc-600 transition-colors"
            />
            {errors.name && (
              <p className="text-xs text-red-400 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Unit */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">
              Мярка <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {PRESET_UNITS.map((u) => (
                <button
                  key={u}
                  onClick={() => {
                    setForm({ ...form, unit: u });
                    setUseCustomUnit(false);
                  }}
                  className={`px-3 py-1.5 text-sm rounded-lg border transition-colors
                    ${
                      !useCustomUnit && form.unit === u
                        ? 'border-zinc-400 text-zinc-100 bg-zinc-800'
                        : 'border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300'
                    }`}
                >
                  {u}
                </button>
              ))}
              <button
                onClick={() => {
                  setUseCustomUnit(true);
                  setForm({ ...form, unit: '' });
                }}
                className={`px-3 py-1.5 text-sm rounded-lg border transition-colors
                  ${
                    useCustomUnit
                      ? 'border-zinc-400 text-zinc-100 bg-zinc-800'
                      : 'border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300'
                  }`}
              >
                друго
              </button>
            </div>
            {useCustomUnit && (
              <input
                type="text"
                placeholder="Въведете мярка..."
                value={form.customUnit}
                autoFocus
                onChange={(e) =>
                  setForm({ ...form, customUnit: e.target.value })
                }
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2.5
                  text-sm text-zinc-100 placeholder:text-zinc-600
                  focus:outline-none focus:border-zinc-600 transition-colors"
              />
            )}
            {errors.unit && (
              <p className="text-xs text-red-400 mt-1">{errors.unit}</p>
            )}
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">
              Количество <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                placeholder="напр. 800"
                value={form.quantity}
                onChange={(e) => handleQuantityChange(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2.5
                  text-sm text-zinc-100 placeholder:text-zinc-600
                  focus:outline-none focus:border-zinc-600 transition-colors pr-14"
              />
              {activeUnit && (
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-zinc-500">
                  {activeUnit}
                </span>
              )}
            </div>
            {errors.quantity && (
              <p className="text-xs text-red-400 mt-1">{errors.quantity}</p>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">
              Цена
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  placeholder="За единица"
                  value={form.pricePerUnit}
                  onChange={(e) => handlePriceChange(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2.5
                    text-sm text-zinc-100 placeholder:text-zinc-600
                    focus:outline-none focus:border-zinc-600 transition-colors pr-12"
                />
                {activeUnit && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500">
                    лв/{activeUnit}
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  placeholder="Обща стойност"
                  value={form.totalValue}
                  onChange={(e) =>
                    setForm({ ...form, totalValue: e.target.value })
                  }
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2.5
                    text-sm text-zinc-100 placeholder:text-zinc-600
                    focus:outline-none focus:border-zinc-600 transition-colors pr-10"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500">
                  лв
                </span>
              </div>
            </div>
            <p className="text-xs text-zinc-600 mt-1">
              Общата стойност се изчислява автоматично
            </p>
          </div>

          {/* Brigade */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">
              Бригада
            </label>
            <input
              type="text"
              placeholder="напр. Бригада Иванов"
              value={form.brigade}
              onChange={(e) => setForm({ ...form, brigade: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2.5
                text-sm text-zinc-100 placeholder:text-zinc-600
                focus:outline-none focus:border-zinc-600 transition-colors"
            />
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">
              Бележка
            </label>
            <textarea
              rows={3}
              placeholder="Допълнителна информация..."
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2.5
                text-sm text-zinc-100 placeholder:text-zinc-600
                focus:outline-none focus:border-zinc-600 transition-colors resize-none"
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-zinc-800 flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 py-2.5 text-sm border border-zinc-800 rounded-lg text-zinc-400
              hover:bg-zinc-900 hover:text-zinc-200 transition-colors"
          >
            Отказ
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 text-sm bg-white text-zinc-950 rounded-lg font-medium
              hover:bg-zinc-200 transition-colors"
          >
            Създай
          </button>
        </div>
      </div>
    </>
  );
}
