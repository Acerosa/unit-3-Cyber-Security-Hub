import { createElement, useEffect, useState } from "react";
import { createRoot, type Root } from "react-dom/client";
import {
  LearningTextField,
  SHORT_RESPONSE_DEFAULT_MIN_CHARS
} from "@learning-platform/ui";

export type Unit3LearningTextMountOptions = {
  id?: string;
  prompt: string;
  placeholder?: string;
  minChars?: number;
  value?: string;
  rows?: number;
  disabled?: boolean;
  hidePrompt?: boolean;
  onChange?: (value: string) => void;
};

export type Unit3LearningTextHandle = {
  getValue: () => string;
  setValue: (next: string) => void;
  metMin: () => boolean;
  destroy: () => void;
};

export type Unit3LearningTextMountBatch = {
  destroyAll: () => void;
  mount: (
    parent: HTMLElement,
    options: Unit3LearningTextMountOptions & { wrapClass?: string }
  ) => Unit3LearningTextHandle;
};

type ValueStore = {
  value: string;
  setReact: ((next: string) => void) | null;
};

type MountRecord = {
  root: Root;
  store: ValueStore;
  minChars: number;
};

const mounts = new WeakMap<HTMLElement, MountRecord>();

function FieldHost({
  options,
  store,
  minChars
}: {
  options: Unit3LearningTextMountOptions;
  store: ValueStore;
  minChars: number;
}) {
  const [value, setValue] = useState(store.value);

  useEffect(() => {
    store.setReact = setValue;
    return () => {
      store.setReact = null;
    };
  }, [store]);

  useEffect(() => {
    store.value = value;
  }, [store, value]);

  return createElement(LearningTextField, {
    id: options.id,
    prompt: options.prompt,
    placeholder: options.placeholder,
    minChars,
    value,
    rows: options.rows ?? 4,
    disabled: options.disabled,
    hidePrompt: options.hidePrompt,
    onChange: (next: string) => {
      setValue(next);
      options.onChange?.(next);
    }
  });
}

/**
 * Install window.Unit3LearningText for classic host worksheets (option B).
 * Call before loading week-N/.../app.js scripts.
 */
export function installUnit3LearningText(): void {
  if (typeof window === "undefined") return;
  if (window.Unit3LearningText?.mount) return;

  window.Unit3LearningText = {
    mount(container: HTMLElement, options: Unit3LearningTextMountOptions): Unit3LearningTextHandle {
      if (!container) {
        throw new Error("Unit3LearningText.mount requires a container element");
      }
      const existing = mounts.get(container);
      if (existing) {
        existing.root.unmount();
        mounts.delete(container);
      }

      const minChars = options.minChars ?? SHORT_RESPONSE_DEFAULT_MIN_CHARS;
      const store: ValueStore = {
        value: String(options.value || ""),
        setReact: null
      };

      const root = createRoot(container);
      root.render(createElement(FieldHost, { options, store, minChars }));

      const record: MountRecord = { root, store, minChars };
      mounts.set(container, record);

      return {
        getValue: () => record.store.value,
        setValue: (next: string) => {
          const normalised = String(next || "");
          record.store.value = normalised;
          record.store.setReact?.(normalised);
        },
        metMin: () => record.store.value.trim().length >= record.minChars,
        destroy: () => {
          record.root.unmount();
          mounts.delete(container);
          container.replaceChildren();
        }
      };
    },
    createMounts(): Unit3LearningTextMountBatch {
      const handles: Unit3LearningTextHandle[] = [];
      return {
        destroyAll() {
          while (handles.length) {
            handles.pop()?.destroy();
          }
        },
        mount(parent, options) {
          if (!parent) {
            throw new Error("Unit3LearningText.createMounts().mount requires a parent element");
          }
          const wrap = document.createElement("div");
          if (options.wrapClass) wrap.className = options.wrapClass;
          parent.appendChild(wrap);
          const { wrapClass: _wrapClass, ...mountOptions } = options;
          const handle = window.Unit3LearningText!.mount(wrap, mountOptions);
          handles.push(handle);
          return handle;
        }
      };
    }
  };
}

declare global {
  interface Window {
    Unit3LearningText?: {
      mount: (container: HTMLElement, options: Unit3LearningTextMountOptions) => Unit3LearningTextHandle;
      createMounts: () => Unit3LearningTextMountBatch;
    };
  }
}
