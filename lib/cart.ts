"use client";
import { useMemo, useSyncExternalStore } from "react";
export type CartItem = { id: string; quantity: number };
const key = "anc-cart-v1";
const event = "anc-cart-change";
let fallback = "[]";
let storageFailed = false;
function snapshot() {
  if (storageFailed) return fallback;
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}
export function parseCart(value: string): CartItem[] {
  try {
    const rows: unknown = JSON.parse(value);
    if (!Array.isArray(rows)) return [];
    const seen = new Set<string>();
    return rows.filter((row): row is CartItem => {
      if (
        !row ||
        typeof row !== "object" ||
        typeof row.id !== "string" ||
        !row.id ||
        !Number.isInteger(row.quantity) ||
        row.quantity < 1 ||
        row.quantity > 9999 ||
        seen.has(row.id)
      )
        return false;
      seen.add(row.id);
      return true;
    });
  } catch {
    return [];
  }
}
function subscribe(callback: () => void) {
  window.addEventListener(event, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(event, callback);
    window.removeEventListener("storage", callback);
  };
}
export function setCartQuantity(id: string, quantity: number) {
  if (!Number.isInteger(quantity) || quantity < 0 || quantity > 9999) return;
  const items = parseCart(snapshot());
  const existing = items.find((item) => item.id === id);
  if (existing) existing.quantity = quantity;
  else if (quantity > 0) items.push({ id, quantity });
  fallback = JSON.stringify(items.filter((item) => item.quantity > 0));
  try {
    localStorage.setItem(key, fallback);
    storageFailed = false;
  } catch {
    storageFailed = true;
  }
  window.dispatchEvent(new Event(event));
}
export function addToCart(id: string) {
  const quantity =
    parseCart(snapshot()).find((item) => item.id === id)?.quantity ?? 0;
  setCartQuantity(id, Math.min(9999, quantity + 1));
}
export function useCart() {
  const value = useSyncExternalStore(subscribe, snapshot, () => "[]");
  return useMemo(() => parseCart(value), [value]);
}
