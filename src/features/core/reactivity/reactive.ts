const bucket = new WeakMap<object, Map<string | symbol, Set<() => void>>>();

let activeEffect: (() => void) | null = null;

export function reactive<T extends object>(target: T): T {
  return new Proxy(target, {
    get(obj, key) {
      if (activeEffect) {
        let depsMap = bucket.get(obj);

        if (!depsMap) {
          depsMap = new Map();
          bucket.set(obj, depsMap);
        }

        let deps = depsMap.get(key);

        if (!deps) {
          deps = new Set();

          depsMap.set(key, deps);
        }

        deps.add(activeEffect);
      }

      return Reflect.get(obj, key);
    },

    set(obj, key, value) {
      const result = Reflect.set(obj, key, value);
      const deps = bucket.get(obj)?.get(key);

      deps?.forEach((effect) => effect());

      return result;
    },
  });
}

export function effect(fn: () => void) {
  activeEffect = fn;

  fn();

  activeEffect = null;
}
