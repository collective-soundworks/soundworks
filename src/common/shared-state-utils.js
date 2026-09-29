import {
  isPlainObject,
  isString,
  isFunction,
} from '@ircam/sc-utils';

export function sanitizeOnUpdateParams(caller, paramNameOrListener, listenerOrExecuteCallback, someExecuteListener) {
  const className = caller.constructor.name;

  let paramName;
  let listener;
  let executeListener;

  // updateUpdate(listener)
  if (arguments.length === 2) {
    if (!isFunction(paramNameOrListener)) {
      throw new TypeError(`Cannot execute 'onUpdate(listener)' on ${className} (overload resolution failed): listener must be a function`);
    }

    paramName = null;
    listener = paramNameOrListener;
    executeListener = false;
  }

  // updateUpdate(paramName, listener)
  // updateUpdate(listener, executeListener)
  if (arguments.length === 3) {
    if (isString(paramNameOrListener)) {
      if (!isFunction(listenerOrExecuteCallback)) {
        throw new TypeError(`Cannot execute 'onUpdate(paramName, listener)' on ${className} (overload resolution failed): listener must be a function`);
      }

      paramName = paramNameOrListener;
      listener = listenerOrExecuteCallback;
      executeListener = false;

    } else if (isFunction(paramNameOrListener)) {
      if (typeof listenerOrExecuteCallback !== 'boolean') {
        throw new TypeError(`Cannot execute 'onUpdate(callback, executeListener)' on ${className} (overload resolution failed): executeListener must be a boolean`);
      }

      paramName = null;
      listener = paramNameOrListener;
      executeListener = listenerOrExecuteCallback;
    } else {
      throw new TypeError(`Cannot execute 'onUpdate' on ${className} (overload resolution failed): possible signatures 'onUpdate(paramName, listener)' or 'onUpdate(listener, executeListener)'`);
    }
  }

  // onUpdate(paramName, listener, executeListener)
  if (arguments.length === 4) {
    if (!isString(paramNameOrListener)) {
      throw new TypeError(`Cannot execute 'onUpdate(paramName, listener, executeListener)' on ${className} (overload resolution failed): paramName must be a string`);
    }

    if (!isFunction(listenerOrExecuteCallback)) {
      throw new TypeError(`Cannot execute 'onUpdate(paramName, listener, executeListener)' on ${className} (overload resolution failed): listener must be a function`);
    }

    if (typeof someExecuteListener !== 'boolean') {
      throw new TypeError(`Cannot execute 'onUpdate(paramName, listener, executeListener)' on ${className} (overload resolution failed): executeListener must be a boolean`);
    }

    paramName = paramNameOrListener;
    listener = listenerOrExecuteCallback;
    executeListener = someExecuteListener;
  }

  // Check that paramName exists in description
  if (paramName !== null) {
    try {
      caller.getDescription(paramName);
    } catch (err) {
      throw new ReferenceError(`Cannot execute 'onUpdate' on ${className}: parameter '${paramName}' does not exists`);
    }
  }

  return { paramName, listener, executeListener };
}


/**
 * Check that given filters match the class description
 * Used in ServerStateManager and SharedStateCollection
 * @private
 */
export function checkValidFilters(options, className, classDescription) {
  const classParams = Object.keys(classDescription);

  for (let filterName of ['whiteList', 'backList']) {
    if (!options[filterName]) {
      continue;
    }

    const list = options[filterName];
    const invalid = list.filter(paramName => !classParams.includes(paramName));

    if (invalid.length > 0) {
      const msg = `Invalid filter (${invalid.join(', ')}) for shared state class '${className}'`;
      throw new Error(msg);
    }
  }
}
