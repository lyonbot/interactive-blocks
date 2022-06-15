type AnyFn = (...args: any[]) => any;
type DefaultListener = Record<string, AnyFn>;
type ListenerItem<F extends AnyFn> = { listener: F; once?: boolean };

const addEventListener = <L extends Record<keyof L, AnyFn>, k extends keyof L>(
  c: EventEmitter<L>,
  event: k,
  it: ListenerItem<L[k]>
) => {
  const l = c._listeners;
  if (!l[event]) l[event] = [it];
  else l[event]!.push(it);
};

export class EventEmitter<L extends Record<keyof L, AnyFn> = DefaultListener> {
  _listeners: { [k in keyof L]?: ListenerItem<L[k]>[] | null; } = {};

  on<U extends keyof L>(event: U, listener: L[U]): this {
    addEventListener(this, event, { listener });
    return this;
  }

  once<U extends keyof L>(event: U, listener: L[U]): this {
    addEventListener(this, event, { listener, once: true });
    return this;
  }

  off<U extends keyof L>(event: U, listener: L[U]): this {
    const l = this._listeners[event];
    if (!l) return this;

    if (l.length === 1 && listener === l[0]!.listener) {
      this._listeners[event] = null;
      return this;
    }

    const i = l.findIndex(x => x.listener === listener);
    if (i !== -1) l.splice(i, 1);

    return this;
  }

  emit<U extends keyof L>(event: U, ...args: Parameters<L[U]>) {
    const l = this._listeners[event];
    if (!l) return;

    let hasOnce = false;
    l.forEach(i => {
      i.listener(args);
      if (i.once) hasOnce = true;
    });

    if (hasOnce) this._listeners[event] = l.filter(x => !x.once);
  }

  removeAllListeners() {
    this._listeners = {};
    return this;
  }
}
