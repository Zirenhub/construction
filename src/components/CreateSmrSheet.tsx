'use client';

import { SmrFormData } from '@/lib/types';
import { useState, useTransition } from 'react';

const PRESET_UNITS = ['m', 'm2', 'm3', 'бр', 'кг', 'т', 'л'];

type Props = {
  open: boolean;
  brigades: { id: string; name: string }[];
  onCloseAction: () => void;
  onSaveAction: (smr: SmrFormData) => Promise<void>;
};

const empty = {
  name: '',
  unit: '',
  customUnit: '',
  quantity: '',
  pricePerUnit: '',
  totalValue: '',
  brigadeId: '',
  note: '',
  act: '',
};

export default function CreateSmrSheet({ open, brigades, onCloseAction, onSaveAction }: Props) {
  const [form, setForm] = useState(empty);
  const [useCustomUnit, setUseCustomUnit] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  function reset() {
    setForm(empty);
    setUseCustomUnit(false);
    setErrors({});
  }

  function handleClose() {
    reset();
    onCloseAction();
  }

  function handlePriceChange(val: string) {
    const total = Number(val) * Number(form.quantity);
    setForm({ ...form, pricePerUnit: val, totalValue: total > 0 ? String(total) : '' });
  }

  function handleQuantityChange(val: string) {
    const total = Number(form.pricePerUnit) * Number(val);
    setForm({ ...form, quantity: val, totalValue: total > 0 ? String(total) : '' });
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Задължително поле';
    if (!form.quantity || isNaN(Number(form.quantity)) || Number(form.quantity) <= 0)
      e.quantity = 'Въведете валидно количество';
    const unit = useCustomUnit ? form.customUnit.trim() : form.unit;
    if (!unit) e.unit = 'Изберете или въведете мярка';
    return e;
  }

  function handleSave() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    startTransition(async () => {
      await onSaveAction({
        name: form.name.trim(),
        unit: useCustomUnit ? form.customUnit.trim() : form.unit,
        quantity: Number(form.quantity),
        done: 0,
        active: true,
        brigadeId: form.brigadeId || null,
        pricePerUnit: Number(form.pricePerUnit) || 0,
        totalValue: Number(form.totalValue) || 0,
        note: form.note.trim(),
        act: form.act ? Number(form.act) : null,
      });
      reset();
      onCloseAction();
    });
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
        className={`fixed top-0 right-0 h-full w-full md:max-w-md bg-canvas md:border-l border-line
        z-50 flex flex-col transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-line">
          <h2 className="text-base font-medium text-ink">Нова СМР</h2>
          <button onClick={handleClose} className="text-ink-4 hover:text-ink-2 transition-colors text-xl leading-none">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-ink-3 mb-1.5">
              Вид работа <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="напр. Мазилка, Топлоизолация..."
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-surface border border-line rounded-lg px-3.5 py-2.5
                text-sm text-ink placeholder:text-ink-5
                focus:outline-none focus:border-line-3 transition-colors"
            />
            {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
          </div>

          {/* Unit */}
          <div>
            <label className="block text-xs font-medium text-ink-3 mb-1.5">
              Мярка <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {PRESET_UNITS.map((u) => (
                <button
                  key={u}
                  onClick={() => { setForm({ ...form, unit: u }); setUseCustomUnit(false); }}
                  className={`px-3 py-1.5 text-sm rounded-lg border transition-colors
                    ${!useCustomUnit && form.unit === u
                      ? 'border-line-3 text-ink bg-lift'
                      : 'border-line text-ink-4 hover:border-line-2 hover:text-ink-2'
                    }`}
                >
                  {u}
                </button>
              ))}
              <button
                onClick={() => { setUseCustomUnit(true); setForm({ ...form, unit: '' }); }}
                className={`px-3 py-1.5 text-sm rounded-lg border transition-colors
                  ${useCustomUnit
                    ? 'border-line-3 text-ink bg-lift'
                    : 'border-line text-ink-4 hover:border-line-2 hover:text-ink-2'
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
                onChange={(e) => setForm({ ...form, customUnit: e.target.value })}
                className="w-full bg-surface border border-line rounded-lg px-3.5 py-2.5
                  text-sm text-ink placeholder:text-ink-5
                  focus:outline-none focus:border-line-3 transition-colors"
              />
            )}
            {errors.unit && <p className="text-xs text-red-400 mt-1">{errors.unit}</p>}
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-xs font-medium text-ink-3 mb-1.5">
              Количество <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                placeholder="напр. 800"
                value={form.quantity}
                onChange={(e) => handleQuantityChange(e.target.value)}
                className="w-full bg-surface border border-line rounded-lg px-3.5 py-2.5
                  text-sm text-ink placeholder:text-ink-5
                  focus:outline-none focus:border-line-3 transition-colors pr-14"
              />
              {activeUnit && (
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-ink-4">
                  {activeUnit}
                </span>
              )}
            </div>
            {errors.quantity && <p className="text-xs text-red-400 mt-1">{errors.quantity}</p>}
          </div>

          {/* Price */}
          <div>
            <label className="block text-xs font-medium text-ink-3 mb-1.5">Цена</label>
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  placeholder="За единица"
                  value={form.pricePerUnit}
                  onChange={(e) => handlePriceChange(e.target.value)}
                  className="w-full bg-surface border border-line rounded-lg px-3.5 py-2.5
                    text-sm text-ink placeholder:text-ink-5
                    focus:outline-none focus:border-line-3 transition-colors pr-12"
                />
                {activeUnit && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink-4">
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
                  onChange={(e) => setForm({ ...form, totalValue: e.target.value })}
                  className="w-full bg-surface border border-line rounded-lg px-3.5 py-2.5
                    text-sm text-ink placeholder:text-ink-5
                    focus:outline-none focus:border-line-3 transition-colors pr-10"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink-4">лв</span>
              </div>
            </div>
            <p className="text-xs text-ink-5 mt-1">Общата стойност се изчислява автоматично</p>
          </div>

          {/* Brigade */}
          <div>
            <label className="block text-xs font-medium text-ink-3 mb-1.5">Бригада</label>
            {brigades.length === 0 ? (
              <p className="text-xs text-ink-5">
                Няма създадени бригади.{' '}
                <a href="/brigadi" className="text-ink-3 underline underline-offset-2 hover:text-ink-2">
                  Създай бригада
                </a>
              </p>
            ) : (
              <select
                value={form.brigadeId}
                onChange={(e) => setForm({ ...form, brigadeId: e.target.value })}
                className="w-full bg-surface border border-line rounded-lg px-3.5 py-2.5
                  text-sm text-ink
                  focus:outline-none focus:border-line-3 transition-colors"
              >
                <option value="">— без бригада —</option>
                {brigades.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            )}
          </div>

          {/* Act */}
          <div>
            <label className="block text-xs font-medium text-ink-3 mb-1.5">Акт №</label>
            <input
              type="number"
              min="0"
              placeholder="напр. 3"
              value={form.act}
              onChange={(e) => setForm({ ...form, act: e.target.value })}
              className="w-full bg-surface border border-line rounded-lg px-3.5 py-2.5
                text-sm text-ink placeholder:text-ink-5
                focus:outline-none focus:border-line-3 transition-colors"
            />
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs font-medium text-ink-3 mb-1.5">Бележка</label>
            <textarea
              rows={3}
              placeholder="Допълнителна информация..."
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              className="w-full bg-surface border border-line rounded-lg px-3.5 py-2.5
                text-sm text-ink placeholder:text-ink-5
                focus:outline-none focus:border-line-3 transition-colors resize-none"
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-line flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 py-2.5 text-sm border border-line rounded-lg text-ink-3
              hover:bg-surface hover:text-ink-2 transition-colors"
          >
            Отказ
          </button>
          <button
            onClick={handleSave}
            disabled={isPending}
            className="flex-1 py-2.5 text-sm bg-cta text-cta-fg rounded-lg font-medium
              hover:bg-cta-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Запазване...' : 'Създай'}
          </button>
        </div>
      </div>
    </>
  );
}
