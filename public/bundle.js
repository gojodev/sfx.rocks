(() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));

  // node_modules/@firebase/util/dist/index.esm2017.js
  var stringToByteArray$1 = function(str) {
    const out = [];
    let p = 0;
    for (let i = 0; i < str.length; i++) {
      let c = str.charCodeAt(i);
      if (c < 128) {
        out[p++] = c;
      } else if (c < 2048) {
        out[p++] = c >> 6 | 192;
        out[p++] = c & 63 | 128;
      } else if ((c & 64512) === 55296 && i + 1 < str.length && (str.charCodeAt(i + 1) & 64512) === 56320) {
        c = 65536 + ((c & 1023) << 10) + (str.charCodeAt(++i) & 1023);
        out[p++] = c >> 18 | 240;
        out[p++] = c >> 12 & 63 | 128;
        out[p++] = c >> 6 & 63 | 128;
        out[p++] = c & 63 | 128;
      } else {
        out[p++] = c >> 12 | 224;
        out[p++] = c >> 6 & 63 | 128;
        out[p++] = c & 63 | 128;
      }
    }
    return out;
  };
  var byteArrayToString = function(bytes) {
    const out = [];
    let pos = 0, c = 0;
    while (pos < bytes.length) {
      const c1 = bytes[pos++];
      if (c1 < 128) {
        out[c++] = String.fromCharCode(c1);
      } else if (c1 > 191 && c1 < 224) {
        const c2 = bytes[pos++];
        out[c++] = String.fromCharCode((c1 & 31) << 6 | c2 & 63);
      } else if (c1 > 239 && c1 < 365) {
        const c2 = bytes[pos++];
        const c3 = bytes[pos++];
        const c4 = bytes[pos++];
        const u = ((c1 & 7) << 18 | (c2 & 63) << 12 | (c3 & 63) << 6 | c4 & 63) - 65536;
        out[c++] = String.fromCharCode(55296 + (u >> 10));
        out[c++] = String.fromCharCode(56320 + (u & 1023));
      } else {
        const c2 = bytes[pos++];
        const c3 = bytes[pos++];
        out[c++] = String.fromCharCode((c1 & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
      }
    }
    return out.join("");
  };
  var base64 = {
    /**
     * Maps bytes to characters.
     */
    byteToCharMap_: null,
    /**
     * Maps characters to bytes.
     */
    charToByteMap_: null,
    /**
     * Maps bytes to websafe characters.
     * @private
     */
    byteToCharMapWebSafe_: null,
    /**
     * Maps websafe characters to bytes.
     * @private
     */
    charToByteMapWebSafe_: null,
    /**
     * Our default alphabet, shared between
     * ENCODED_VALS and ENCODED_VALS_WEBSAFE
     */
    ENCODED_VALS_BASE: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    /**
     * Our default alphabet. Value 64 (=) is special; it means "nothing."
     */
    get ENCODED_VALS() {
      return this.ENCODED_VALS_BASE + "+/=";
    },
    /**
     * Our websafe alphabet.
     */
    get ENCODED_VALS_WEBSAFE() {
      return this.ENCODED_VALS_BASE + "-_.";
    },
    /**
     * Whether this browser supports the atob and btoa functions. This extension
     * started at Mozilla but is now implemented by many browsers. We use the
     * ASSUME_* variables to avoid pulling in the full useragent detection library
     * but still allowing the standard per-browser compilations.
     *
     */
    HAS_NATIVE_SUPPORT: typeof atob === "function",
    /**
     * Base64-encode an array of bytes.
     *
     * @param input An array of bytes (numbers with
     *     value in [0, 255]) to encode.
     * @param webSafe Boolean indicating we should use the
     *     alternative alphabet.
     * @return The base64 encoded string.
     */
    encodeByteArray(input, webSafe) {
      if (!Array.isArray(input)) {
        throw Error("encodeByteArray takes an array as a parameter");
      }
      this.init_();
      const byteToCharMap = webSafe ? this.byteToCharMapWebSafe_ : this.byteToCharMap_;
      const output = [];
      for (let i = 0; i < input.length; i += 3) {
        const byte1 = input[i];
        const haveByte2 = i + 1 < input.length;
        const byte2 = haveByte2 ? input[i + 1] : 0;
        const haveByte3 = i + 2 < input.length;
        const byte3 = haveByte3 ? input[i + 2] : 0;
        const outByte1 = byte1 >> 2;
        const outByte2 = (byte1 & 3) << 4 | byte2 >> 4;
        let outByte3 = (byte2 & 15) << 2 | byte3 >> 6;
        let outByte4 = byte3 & 63;
        if (!haveByte3) {
          outByte4 = 64;
          if (!haveByte2) {
            outByte3 = 64;
          }
        }
        output.push(byteToCharMap[outByte1], byteToCharMap[outByte2], byteToCharMap[outByte3], byteToCharMap[outByte4]);
      }
      return output.join("");
    },
    /**
     * Base64-encode a string.
     *
     * @param input A string to encode.
     * @param webSafe If true, we should use the
     *     alternative alphabet.
     * @return The base64 encoded string.
     */
    encodeString(input, webSafe) {
      if (this.HAS_NATIVE_SUPPORT && !webSafe) {
        return btoa(input);
      }
      return this.encodeByteArray(stringToByteArray$1(input), webSafe);
    },
    /**
     * Base64-decode a string.
     *
     * @param input to decode.
     * @param webSafe True if we should use the
     *     alternative alphabet.
     * @return string representing the decoded value.
     */
    decodeString(input, webSafe) {
      if (this.HAS_NATIVE_SUPPORT && !webSafe) {
        return atob(input);
      }
      return byteArrayToString(this.decodeStringToByteArray(input, webSafe));
    },
    /**
     * Base64-decode a string.
     *
     * In base-64 decoding, groups of four characters are converted into three
     * bytes.  If the encoder did not apply padding, the input length may not
     * be a multiple of 4.
     *
     * In this case, the last group will have fewer than 4 characters, and
     * padding will be inferred.  If the group has one or two characters, it decodes
     * to one byte.  If the group has three characters, it decodes to two bytes.
     *
     * @param input Input to decode.
     * @param webSafe True if we should use the web-safe alphabet.
     * @return bytes representing the decoded value.
     */
    decodeStringToByteArray(input, webSafe) {
      this.init_();
      const charToByteMap = webSafe ? this.charToByteMapWebSafe_ : this.charToByteMap_;
      const output = [];
      for (let i = 0; i < input.length; ) {
        const byte1 = charToByteMap[input.charAt(i++)];
        const haveByte2 = i < input.length;
        const byte2 = haveByte2 ? charToByteMap[input.charAt(i)] : 0;
        ++i;
        const haveByte3 = i < input.length;
        const byte3 = haveByte3 ? charToByteMap[input.charAt(i)] : 64;
        ++i;
        const haveByte4 = i < input.length;
        const byte4 = haveByte4 ? charToByteMap[input.charAt(i)] : 64;
        ++i;
        if (byte1 == null || byte2 == null || byte3 == null || byte4 == null) {
          throw new DecodeBase64StringError();
        }
        const outByte1 = byte1 << 2 | byte2 >> 4;
        output.push(outByte1);
        if (byte3 !== 64) {
          const outByte2 = byte2 << 4 & 240 | byte3 >> 2;
          output.push(outByte2);
          if (byte4 !== 64) {
            const outByte3 = byte3 << 6 & 192 | byte4;
            output.push(outByte3);
          }
        }
      }
      return output;
    },
    /**
     * Lazy static initialization function. Called before
     * accessing any of the static map variables.
     * @private
     */
    init_() {
      if (!this.byteToCharMap_) {
        this.byteToCharMap_ = {};
        this.charToByteMap_ = {};
        this.byteToCharMapWebSafe_ = {};
        this.charToByteMapWebSafe_ = {};
        for (let i = 0; i < this.ENCODED_VALS.length; i++) {
          this.byteToCharMap_[i] = this.ENCODED_VALS.charAt(i);
          this.charToByteMap_[this.byteToCharMap_[i]] = i;
          this.byteToCharMapWebSafe_[i] = this.ENCODED_VALS_WEBSAFE.charAt(i);
          this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[i]] = i;
          if (i >= this.ENCODED_VALS_BASE.length) {
            this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(i)] = i;
            this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(i)] = i;
          }
        }
      }
    }
  };
  var DecodeBase64StringError = class extends Error {
    constructor() {
      super(...arguments);
      this.name = "DecodeBase64StringError";
    }
  };
  var base64Encode = function(str) {
    const utf8Bytes = stringToByteArray$1(str);
    return base64.encodeByteArray(utf8Bytes, true);
  };
  var base64urlEncodeWithoutPadding = function(str) {
    return base64Encode(str).replace(/\./g, "");
  };
  var base64Decode = function(str) {
    try {
      return base64.decodeString(str, true);
    } catch (e) {
      console.error("base64Decode failed: ", e);
    }
    return null;
  };
  function getGlobal() {
    if (typeof self !== "undefined") {
      return self;
    }
    if (typeof window !== "undefined") {
      return window;
    }
    if (typeof global !== "undefined") {
      return global;
    }
    throw new Error("Unable to locate global object.");
  }
  var getDefaultsFromGlobal = () => getGlobal().__FIREBASE_DEFAULTS__;
  var getDefaultsFromEnvVariable = () => {
    if (typeof process === "undefined" || typeof process.env === "undefined") {
      return;
    }
    const defaultsJsonString = process.env.__FIREBASE_DEFAULTS__;
    if (defaultsJsonString) {
      return JSON.parse(defaultsJsonString);
    }
  };
  var getDefaultsFromCookie = () => {
    if (typeof document === "undefined") {
      return;
    }
    let match;
    try {
      match = document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/);
    } catch (e) {
      return;
    }
    const decoded = match && base64Decode(match[1]);
    return decoded && JSON.parse(decoded);
  };
  var getDefaults = () => {
    try {
      return getDefaultsFromGlobal() || getDefaultsFromEnvVariable() || getDefaultsFromCookie();
    } catch (e) {
      console.info("Unable to get __FIREBASE_DEFAULTS__ due to: ".concat(e));
      return;
    }
  };
  var getDefaultAppConfig = () => {
    var _a;
    return (_a = getDefaults()) === null || _a === void 0 ? void 0 : _a.config;
  };
  var Deferred = class {
    constructor() {
      this.reject = () => {
      };
      this.resolve = () => {
      };
      this.promise = new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    }
    /**
     * Our API internals are not promiseified and cannot because our callback APIs have subtle expectations around
     * invoking promises inline, which Promises are forbidden to do. This method accepts an optional node-style callback
     * and returns a node-style callback which will resolve or reject the Deferred's promise.
     */
    wrapCallback(callback) {
      return (error, value) => {
        if (error) {
          this.reject(error);
        } else {
          this.resolve(value);
        }
        if (typeof callback === "function") {
          this.promise.catch(() => {
          });
          if (callback.length === 1) {
            callback(error);
          } else {
            callback(error, value);
          }
        }
      };
    }
  };
  function isIndexedDBAvailable() {
    try {
      return typeof indexedDB === "object";
    } catch (e) {
      return false;
    }
  }
  function validateIndexedDBOpenable() {
    return new Promise((resolve, reject) => {
      try {
        let preExist = true;
        const DB_CHECK_NAME = "validate-browser-context-for-indexeddb-analytics-module";
        const request = self.indexedDB.open(DB_CHECK_NAME);
        request.onsuccess = () => {
          request.result.close();
          if (!preExist) {
            self.indexedDB.deleteDatabase(DB_CHECK_NAME);
          }
          resolve(true);
        };
        request.onupgradeneeded = () => {
          preExist = false;
        };
        request.onerror = () => {
          var _a;
          reject(((_a = request.error) === null || _a === void 0 ? void 0 : _a.message) || "");
        };
      } catch (error) {
        reject(error);
      }
    });
  }
  var ERROR_NAME = "FirebaseError";
  var FirebaseError = class _FirebaseError extends Error {
    constructor(code, message, customData) {
      super(message);
      this.code = code;
      this.customData = customData;
      this.name = ERROR_NAME;
      Object.setPrototypeOf(this, _FirebaseError.prototype);
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, ErrorFactory.prototype.create);
      }
    }
  };
  var ErrorFactory = class {
    constructor(service, serviceName, errors) {
      this.service = service;
      this.serviceName = serviceName;
      this.errors = errors;
    }
    create(code, ...data) {
      const customData = data[0] || {};
      const fullCode = "".concat(this.service, "/").concat(code);
      const template = this.errors[code];
      const message = template ? replaceTemplate(template, customData) : "Error";
      const fullMessage = "".concat(this.serviceName, ": ").concat(message, " (").concat(fullCode, ").");
      const error = new FirebaseError(fullCode, fullMessage, customData);
      return error;
    }
  };
  function replaceTemplate(template, data) {
    return template.replace(PATTERN, (_, key) => {
      const value = data[key];
      return value != null ? String(value) : "<".concat(key, "?>");
    });
  }
  var PATTERN = /\{\$([^}]+)}/g;
  function deepEqual(a, b) {
    if (a === b) {
      return true;
    }
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    for (const k of aKeys) {
      if (!bKeys.includes(k)) {
        return false;
      }
      const aProp = a[k];
      const bProp = b[k];
      if (isObject(aProp) && isObject(bProp)) {
        if (!deepEqual(aProp, bProp)) {
          return false;
        }
      } else if (aProp !== bProp) {
        return false;
      }
    }
    for (const k of bKeys) {
      if (!aKeys.includes(k)) {
        return false;
      }
    }
    return true;
  }
  function isObject(thing) {
    return thing !== null && typeof thing === "object";
  }
  var MAX_VALUE_MILLIS = 4 * 60 * 60 * 1e3;

  // node_modules/@firebase/component/dist/esm/index.esm2017.js
  var Component = class {
    /**
     *
     * @param name The public service name, e.g. app, auth, firestore, database
     * @param instanceFactory Service factory responsible for creating the public interface
     * @param type whether the service provided by the component is public or private
     */
    constructor(name3, instanceFactory, type) {
      this.name = name3;
      this.instanceFactory = instanceFactory;
      this.type = type;
      this.multipleInstances = false;
      this.serviceProps = {};
      this.instantiationMode = "LAZY";
      this.onInstanceCreated = null;
    }
    setInstantiationMode(mode) {
      this.instantiationMode = mode;
      return this;
    }
    setMultipleInstances(multipleInstances) {
      this.multipleInstances = multipleInstances;
      return this;
    }
    setServiceProps(props) {
      this.serviceProps = props;
      return this;
    }
    setInstanceCreatedCallback(callback) {
      this.onInstanceCreated = callback;
      return this;
    }
  };
  var DEFAULT_ENTRY_NAME = "[DEFAULT]";
  var Provider = class {
    constructor(name3, container) {
      this.name = name3;
      this.container = container;
      this.component = null;
      this.instances = /* @__PURE__ */ new Map();
      this.instancesDeferred = /* @__PURE__ */ new Map();
      this.instancesOptions = /* @__PURE__ */ new Map();
      this.onInitCallbacks = /* @__PURE__ */ new Map();
    }
    /**
     * @param identifier A provider can provide mulitple instances of a service
     * if this.component.multipleInstances is true.
     */
    get(identifier) {
      const normalizedIdentifier = this.normalizeInstanceIdentifier(identifier);
      if (!this.instancesDeferred.has(normalizedIdentifier)) {
        const deferred = new Deferred();
        this.instancesDeferred.set(normalizedIdentifier, deferred);
        if (this.isInitialized(normalizedIdentifier) || this.shouldAutoInitialize()) {
          try {
            const instance = this.getOrInitializeService({
              instanceIdentifier: normalizedIdentifier
            });
            if (instance) {
              deferred.resolve(instance);
            }
          } catch (e) {
          }
        }
      }
      return this.instancesDeferred.get(normalizedIdentifier).promise;
    }
    getImmediate(options) {
      var _a;
      const normalizedIdentifier = this.normalizeInstanceIdentifier(options === null || options === void 0 ? void 0 : options.identifier);
      const optional = (_a = options === null || options === void 0 ? void 0 : options.optional) !== null && _a !== void 0 ? _a : false;
      if (this.isInitialized(normalizedIdentifier) || this.shouldAutoInitialize()) {
        try {
          return this.getOrInitializeService({
            instanceIdentifier: normalizedIdentifier
          });
        } catch (e) {
          if (optional) {
            return null;
          } else {
            throw e;
          }
        }
      } else {
        if (optional) {
          return null;
        } else {
          throw Error("Service ".concat(this.name, " is not available"));
        }
      }
    }
    getComponent() {
      return this.component;
    }
    setComponent(component) {
      if (component.name !== this.name) {
        throw Error("Mismatching Component ".concat(component.name, " for Provider ").concat(this.name, "."));
      }
      if (this.component) {
        throw Error("Component for ".concat(this.name, " has already been provided"));
      }
      this.component = component;
      if (!this.shouldAutoInitialize()) {
        return;
      }
      if (isComponentEager(component)) {
        try {
          this.getOrInitializeService({ instanceIdentifier: DEFAULT_ENTRY_NAME });
        } catch (e) {
        }
      }
      for (const [instanceIdentifier, instanceDeferred] of this.instancesDeferred.entries()) {
        const normalizedIdentifier = this.normalizeInstanceIdentifier(instanceIdentifier);
        try {
          const instance = this.getOrInitializeService({
            instanceIdentifier: normalizedIdentifier
          });
          instanceDeferred.resolve(instance);
        } catch (e) {
        }
      }
    }
    clearInstance(identifier = DEFAULT_ENTRY_NAME) {
      this.instancesDeferred.delete(identifier);
      this.instancesOptions.delete(identifier);
      this.instances.delete(identifier);
    }
    // app.delete() will call this method on every provider to delete the services
    // TODO: should we mark the provider as deleted?
    async delete() {
      const services = Array.from(this.instances.values());
      await Promise.all([
        ...services.filter((service) => "INTERNAL" in service).map((service) => service.INTERNAL.delete()),
        ...services.filter((service) => "_delete" in service).map((service) => service._delete())
      ]);
    }
    isComponentSet() {
      return this.component != null;
    }
    isInitialized(identifier = DEFAULT_ENTRY_NAME) {
      return this.instances.has(identifier);
    }
    getOptions(identifier = DEFAULT_ENTRY_NAME) {
      return this.instancesOptions.get(identifier) || {};
    }
    initialize(opts = {}) {
      const { options = {} } = opts;
      const normalizedIdentifier = this.normalizeInstanceIdentifier(opts.instanceIdentifier);
      if (this.isInitialized(normalizedIdentifier)) {
        throw Error("".concat(this.name, "(").concat(normalizedIdentifier, ") has already been initialized"));
      }
      if (!this.isComponentSet()) {
        throw Error("Component ".concat(this.name, " has not been registered yet"));
      }
      const instance = this.getOrInitializeService({
        instanceIdentifier: normalizedIdentifier,
        options
      });
      for (const [instanceIdentifier, instanceDeferred] of this.instancesDeferred.entries()) {
        const normalizedDeferredIdentifier = this.normalizeInstanceIdentifier(instanceIdentifier);
        if (normalizedIdentifier === normalizedDeferredIdentifier) {
          instanceDeferred.resolve(instance);
        }
      }
      return instance;
    }
    /**
     *
     * @param callback - a function that will be invoked  after the provider has been initialized by calling provider.initialize().
     * The function is invoked SYNCHRONOUSLY, so it should not execute any longrunning tasks in order to not block the program.
     *
     * @param identifier An optional instance identifier
     * @returns a function to unregister the callback
     */
    onInit(callback, identifier) {
      var _a;
      const normalizedIdentifier = this.normalizeInstanceIdentifier(identifier);
      const existingCallbacks = (_a = this.onInitCallbacks.get(normalizedIdentifier)) !== null && _a !== void 0 ? _a : /* @__PURE__ */ new Set();
      existingCallbacks.add(callback);
      this.onInitCallbacks.set(normalizedIdentifier, existingCallbacks);
      const existingInstance = this.instances.get(normalizedIdentifier);
      if (existingInstance) {
        callback(existingInstance, normalizedIdentifier);
      }
      return () => {
        existingCallbacks.delete(callback);
      };
    }
    /**
     * Invoke onInit callbacks synchronously
     * @param instance the service instance`
     */
    invokeOnInitCallbacks(instance, identifier) {
      const callbacks = this.onInitCallbacks.get(identifier);
      if (!callbacks) {
        return;
      }
      for (const callback of callbacks) {
        try {
          callback(instance, identifier);
        } catch (_a) {
        }
      }
    }
    getOrInitializeService({ instanceIdentifier, options = {} }) {
      let instance = this.instances.get(instanceIdentifier);
      if (!instance && this.component) {
        instance = this.component.instanceFactory(this.container, {
          instanceIdentifier: normalizeIdentifierForFactory(instanceIdentifier),
          options
        });
        this.instances.set(instanceIdentifier, instance);
        this.instancesOptions.set(instanceIdentifier, options);
        this.invokeOnInitCallbacks(instance, instanceIdentifier);
        if (this.component.onInstanceCreated) {
          try {
            this.component.onInstanceCreated(this.container, instanceIdentifier, instance);
          } catch (_a) {
          }
        }
      }
      return instance || null;
    }
    normalizeInstanceIdentifier(identifier = DEFAULT_ENTRY_NAME) {
      if (this.component) {
        return this.component.multipleInstances ? identifier : DEFAULT_ENTRY_NAME;
      } else {
        return identifier;
      }
    }
    shouldAutoInitialize() {
      return !!this.component && this.component.instantiationMode !== "EXPLICIT";
    }
  };
  function normalizeIdentifierForFactory(identifier) {
    return identifier === DEFAULT_ENTRY_NAME ? void 0 : identifier;
  }
  function isComponentEager(component) {
    return component.instantiationMode === "EAGER";
  }
  var ComponentContainer = class {
    constructor(name3) {
      this.name = name3;
      this.providers = /* @__PURE__ */ new Map();
    }
    /**
     *
     * @param component Component being added
     * @param overwrite When a component with the same name has already been registered,
     * if overwrite is true: overwrite the existing component with the new component and create a new
     * provider with the new component. It can be useful in tests where you want to use different mocks
     * for different tests.
     * if overwrite is false: throw an exception
     */
    addComponent(component) {
      const provider = this.getProvider(component.name);
      if (provider.isComponentSet()) {
        throw new Error("Component ".concat(component.name, " has already been registered with ").concat(this.name));
      }
      provider.setComponent(component);
    }
    addOrOverwriteComponent(component) {
      const provider = this.getProvider(component.name);
      if (provider.isComponentSet()) {
        this.providers.delete(component.name);
      }
      this.addComponent(component);
    }
    /**
     * getProvider provides a type safe interface where it can only be called with a field name
     * present in NameServiceMapping interface.
     *
     * Firebase SDKs providing services should extend NameServiceMapping interface to register
     * themselves.
     */
    getProvider(name3) {
      if (this.providers.has(name3)) {
        return this.providers.get(name3);
      }
      const provider = new Provider(name3, this);
      this.providers.set(name3, provider);
      return provider;
    }
    getProviders() {
      return Array.from(this.providers.values());
    }
  };

  // node_modules/@firebase/logger/dist/esm/index.esm2017.js
  var instances = [];
  var LogLevel;
  (function(LogLevel2) {
    LogLevel2[LogLevel2["DEBUG"] = 0] = "DEBUG";
    LogLevel2[LogLevel2["VERBOSE"] = 1] = "VERBOSE";
    LogLevel2[LogLevel2["INFO"] = 2] = "INFO";
    LogLevel2[LogLevel2["WARN"] = 3] = "WARN";
    LogLevel2[LogLevel2["ERROR"] = 4] = "ERROR";
    LogLevel2[LogLevel2["SILENT"] = 5] = "SILENT";
  })(LogLevel || (LogLevel = {}));
  var levelStringToEnum = {
    "debug": LogLevel.DEBUG,
    "verbose": LogLevel.VERBOSE,
    "info": LogLevel.INFO,
    "warn": LogLevel.WARN,
    "error": LogLevel.ERROR,
    "silent": LogLevel.SILENT
  };
  var defaultLogLevel = LogLevel.INFO;
  var ConsoleMethod = {
    [LogLevel.DEBUG]: "log",
    [LogLevel.VERBOSE]: "log",
    [LogLevel.INFO]: "info",
    [LogLevel.WARN]: "warn",
    [LogLevel.ERROR]: "error"
  };
  var defaultLogHandler = (instance, logType, ...args) => {
    if (logType < instance.logLevel) {
      return;
    }
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const method = ConsoleMethod[logType];
    if (method) {
      console[method]("[".concat(now, "]  ").concat(instance.name, ":"), ...args);
    } else {
      throw new Error("Attempted to log a message with an invalid logType (value: ".concat(logType, ")"));
    }
  };
  var Logger = class {
    /**
     * Gives you an instance of a Logger to capture messages according to
     * Firebase's logging scheme.
     *
     * @param name The name that the logs will be associated with
     */
    constructor(name3) {
      this.name = name3;
      this._logLevel = defaultLogLevel;
      this._logHandler = defaultLogHandler;
      this._userLogHandler = null;
      instances.push(this);
    }
    get logLevel() {
      return this._logLevel;
    }
    set logLevel(val) {
      if (!(val in LogLevel)) {
        throw new TypeError('Invalid value "'.concat(val, '" assigned to `logLevel`'));
      }
      this._logLevel = val;
    }
    // Workaround for setter/getter having to be the same type.
    setLogLevel(val) {
      this._logLevel = typeof val === "string" ? levelStringToEnum[val] : val;
    }
    get logHandler() {
      return this._logHandler;
    }
    set logHandler(val) {
      if (typeof val !== "function") {
        throw new TypeError("Value assigned to `logHandler` must be a function");
      }
      this._logHandler = val;
    }
    get userLogHandler() {
      return this._userLogHandler;
    }
    set userLogHandler(val) {
      this._userLogHandler = val;
    }
    /**
     * The functions below are all based on the `console` interface
     */
    debug(...args) {
      this._userLogHandler && this._userLogHandler(this, LogLevel.DEBUG, ...args);
      this._logHandler(this, LogLevel.DEBUG, ...args);
    }
    log(...args) {
      this._userLogHandler && this._userLogHandler(this, LogLevel.VERBOSE, ...args);
      this._logHandler(this, LogLevel.VERBOSE, ...args);
    }
    info(...args) {
      this._userLogHandler && this._userLogHandler(this, LogLevel.INFO, ...args);
      this._logHandler(this, LogLevel.INFO, ...args);
    }
    warn(...args) {
      this._userLogHandler && this._userLogHandler(this, LogLevel.WARN, ...args);
      this._logHandler(this, LogLevel.WARN, ...args);
    }
    error(...args) {
      this._userLogHandler && this._userLogHandler(this, LogLevel.ERROR, ...args);
      this._logHandler(this, LogLevel.ERROR, ...args);
    }
  };

  // node_modules/idb/build/wrap-idb-value.js
  var instanceOfAny = (object, constructors) => constructors.some((c) => object instanceof c);
  var idbProxyableTypes;
  var cursorAdvanceMethods;
  function getIdbProxyableTypes() {
    return idbProxyableTypes || (idbProxyableTypes = [
      IDBDatabase,
      IDBObjectStore,
      IDBIndex,
      IDBCursor,
      IDBTransaction
    ]);
  }
  function getCursorAdvanceMethods() {
    return cursorAdvanceMethods || (cursorAdvanceMethods = [
      IDBCursor.prototype.advance,
      IDBCursor.prototype.continue,
      IDBCursor.prototype.continuePrimaryKey
    ]);
  }
  var cursorRequestMap = /* @__PURE__ */ new WeakMap();
  var transactionDoneMap = /* @__PURE__ */ new WeakMap();
  var transactionStoreNamesMap = /* @__PURE__ */ new WeakMap();
  var transformCache = /* @__PURE__ */ new WeakMap();
  var reverseTransformCache = /* @__PURE__ */ new WeakMap();
  function promisifyRequest(request) {
    const promise = new Promise((resolve, reject) => {
      const unlisten = () => {
        request.removeEventListener("success", success);
        request.removeEventListener("error", error);
      };
      const success = () => {
        resolve(wrap(request.result));
        unlisten();
      };
      const error = () => {
        reject(request.error);
        unlisten();
      };
      request.addEventListener("success", success);
      request.addEventListener("error", error);
    });
    promise.then((value) => {
      if (value instanceof IDBCursor) {
        cursorRequestMap.set(value, request);
      }
    }).catch(() => {
    });
    reverseTransformCache.set(promise, request);
    return promise;
  }
  function cacheDonePromiseForTransaction(tx) {
    if (transactionDoneMap.has(tx))
      return;
    const done = new Promise((resolve, reject) => {
      const unlisten = () => {
        tx.removeEventListener("complete", complete);
        tx.removeEventListener("error", error);
        tx.removeEventListener("abort", error);
      };
      const complete = () => {
        resolve();
        unlisten();
      };
      const error = () => {
        reject(tx.error || new DOMException("AbortError", "AbortError"));
        unlisten();
      };
      tx.addEventListener("complete", complete);
      tx.addEventListener("error", error);
      tx.addEventListener("abort", error);
    });
    transactionDoneMap.set(tx, done);
  }
  var idbProxyTraps = {
    get(target, prop, receiver) {
      if (target instanceof IDBTransaction) {
        if (prop === "done")
          return transactionDoneMap.get(target);
        if (prop === "objectStoreNames") {
          return target.objectStoreNames || transactionStoreNamesMap.get(target);
        }
        if (prop === "store") {
          return receiver.objectStoreNames[1] ? void 0 : receiver.objectStore(receiver.objectStoreNames[0]);
        }
      }
      return wrap(target[prop]);
    },
    set(target, prop, value) {
      target[prop] = value;
      return true;
    },
    has(target, prop) {
      if (target instanceof IDBTransaction && (prop === "done" || prop === "store")) {
        return true;
      }
      return prop in target;
    }
  };
  function replaceTraps(callback) {
    idbProxyTraps = callback(idbProxyTraps);
  }
  function wrapFunction(func) {
    if (func === IDBDatabase.prototype.transaction && !("objectStoreNames" in IDBTransaction.prototype)) {
      return function(storeNames, ...args) {
        const tx = func.call(unwrap(this), storeNames, ...args);
        transactionStoreNamesMap.set(tx, storeNames.sort ? storeNames.sort() : [storeNames]);
        return wrap(tx);
      };
    }
    if (getCursorAdvanceMethods().includes(func)) {
      return function(...args) {
        func.apply(unwrap(this), args);
        return wrap(cursorRequestMap.get(this));
      };
    }
    return function(...args) {
      return wrap(func.apply(unwrap(this), args));
    };
  }
  function transformCachableValue(value) {
    if (typeof value === "function")
      return wrapFunction(value);
    if (value instanceof IDBTransaction)
      cacheDonePromiseForTransaction(value);
    if (instanceOfAny(value, getIdbProxyableTypes()))
      return new Proxy(value, idbProxyTraps);
    return value;
  }
  function wrap(value) {
    if (value instanceof IDBRequest)
      return promisifyRequest(value);
    if (transformCache.has(value))
      return transformCache.get(value);
    const newValue = transformCachableValue(value);
    if (newValue !== value) {
      transformCache.set(value, newValue);
      reverseTransformCache.set(newValue, value);
    }
    return newValue;
  }
  var unwrap = (value) => reverseTransformCache.get(value);

  // node_modules/idb/build/index.js
  function openDB(name3, version2, { blocked, upgrade, blocking, terminated } = {}) {
    const request = indexedDB.open(name3, version2);
    const openPromise = wrap(request);
    if (upgrade) {
      request.addEventListener("upgradeneeded", (event) => {
        upgrade(wrap(request.result), event.oldVersion, event.newVersion, wrap(request.transaction), event);
      });
    }
    if (blocked) {
      request.addEventListener("blocked", (event) => blocked(
        // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
        event.oldVersion,
        event.newVersion,
        event
      ));
    }
    openPromise.then((db) => {
      if (terminated)
        db.addEventListener("close", () => terminated());
      if (blocking) {
        db.addEventListener("versionchange", (event) => blocking(event.oldVersion, event.newVersion, event));
      }
    }).catch(() => {
    });
    return openPromise;
  }
  var readMethods = ["get", "getKey", "getAll", "getAllKeys", "count"];
  var writeMethods = ["put", "add", "delete", "clear"];
  var cachedMethods = /* @__PURE__ */ new Map();
  function getMethod(target, prop) {
    if (!(target instanceof IDBDatabase && !(prop in target) && typeof prop === "string")) {
      return;
    }
    if (cachedMethods.get(prop))
      return cachedMethods.get(prop);
    const targetFuncName = prop.replace(/FromIndex$/, "");
    const useIndex = prop !== targetFuncName;
    const isWrite = writeMethods.includes(targetFuncName);
    if (
      // Bail if the target doesn't exist on the target. Eg, getAll isn't in Edge.
      !(targetFuncName in (useIndex ? IDBIndex : IDBObjectStore).prototype) || !(isWrite || readMethods.includes(targetFuncName))
    ) {
      return;
    }
    const method = async function(storeName, ...args) {
      const tx = this.transaction(storeName, isWrite ? "readwrite" : "readonly");
      let target2 = tx.store;
      if (useIndex)
        target2 = target2.index(args.shift());
      return (await Promise.all([
        target2[targetFuncName](...args),
        isWrite && tx.done
      ]))[0];
    };
    cachedMethods.set(prop, method);
    return method;
  }
  replaceTraps((oldTraps) => __spreadProps(__spreadValues({}, oldTraps), {
    get: (target, prop, receiver) => getMethod(target, prop) || oldTraps.get(target, prop, receiver),
    has: (target, prop) => !!getMethod(target, prop) || oldTraps.has(target, prop)
  }));

  // node_modules/@firebase/app/dist/esm/index.esm2017.js
  var PlatformLoggerServiceImpl = class {
    constructor(container) {
      this.container = container;
    }
    // In initial implementation, this will be called by installations on
    // auth token refresh, and installations will send this string.
    getPlatformInfoString() {
      const providers = this.container.getProviders();
      return providers.map((provider) => {
        if (isVersionServiceProvider(provider)) {
          const service = provider.getImmediate();
          return "".concat(service.library, "/").concat(service.version);
        } else {
          return null;
        }
      }).filter((logString) => logString).join(" ");
    }
  };
  function isVersionServiceProvider(provider) {
    const component = provider.getComponent();
    return (component === null || component === void 0 ? void 0 : component.type) === "VERSION";
  }
  var name$o = "@firebase/app";
  var version$1 = "0.9.29";
  var logger = new Logger("@firebase/app");
  var name$n = "@firebase/app-compat";
  var name$m = "@firebase/analytics-compat";
  var name$l = "@firebase/analytics";
  var name$k = "@firebase/app-check-compat";
  var name$j = "@firebase/app-check";
  var name$i = "@firebase/auth";
  var name$h = "@firebase/auth-compat";
  var name$g = "@firebase/database";
  var name$f = "@firebase/database-compat";
  var name$e = "@firebase/functions";
  var name$d = "@firebase/functions-compat";
  var name$c = "@firebase/installations";
  var name$b = "@firebase/installations-compat";
  var name$a = "@firebase/messaging";
  var name$9 = "@firebase/messaging-compat";
  var name$8 = "@firebase/performance";
  var name$7 = "@firebase/performance-compat";
  var name$6 = "@firebase/remote-config";
  var name$5 = "@firebase/remote-config-compat";
  var name$4 = "@firebase/storage";
  var name$3 = "@firebase/storage-compat";
  var name$2 = "@firebase/firestore";
  var name$1 = "@firebase/firestore-compat";
  var name = "firebase";
  var DEFAULT_ENTRY_NAME2 = "[DEFAULT]";
  var PLATFORM_LOG_STRING = {
    [name$o]: "fire-core",
    [name$n]: "fire-core-compat",
    [name$l]: "fire-analytics",
    [name$m]: "fire-analytics-compat",
    [name$j]: "fire-app-check",
    [name$k]: "fire-app-check-compat",
    [name$i]: "fire-auth",
    [name$h]: "fire-auth-compat",
    [name$g]: "fire-rtdb",
    [name$f]: "fire-rtdb-compat",
    [name$e]: "fire-fn",
    [name$d]: "fire-fn-compat",
    [name$c]: "fire-iid",
    [name$b]: "fire-iid-compat",
    [name$a]: "fire-fcm",
    [name$9]: "fire-fcm-compat",
    [name$8]: "fire-perf",
    [name$7]: "fire-perf-compat",
    [name$6]: "fire-rc",
    [name$5]: "fire-rc-compat",
    [name$4]: "fire-gcs",
    [name$3]: "fire-gcs-compat",
    [name$2]: "fire-fst",
    [name$1]: "fire-fst-compat",
    "fire-js": "fire-js",
    [name]: "fire-js-all"
  };
  var _apps = /* @__PURE__ */ new Map();
  var _components = /* @__PURE__ */ new Map();
  function _addComponent(app, component) {
    try {
      app.container.addComponent(component);
    } catch (e) {
      logger.debug("Component ".concat(component.name, " failed to register with FirebaseApp ").concat(app.name), e);
    }
  }
  function _registerComponent(component) {
    const componentName = component.name;
    if (_components.has(componentName)) {
      logger.debug("There were multiple attempts to register component ".concat(componentName, "."));
      return false;
    }
    _components.set(componentName, component);
    for (const app of _apps.values()) {
      _addComponent(app, component);
    }
    return true;
  }
  var ERRORS = {
    [
      "no-app"
      /* AppError.NO_APP */
    ]: "No Firebase App '{$appName}' has been created - call initializeApp() first",
    [
      "bad-app-name"
      /* AppError.BAD_APP_NAME */
    ]: "Illegal App name: '{$appName}",
    [
      "duplicate-app"
      /* AppError.DUPLICATE_APP */
    ]: "Firebase App named '{$appName}' already exists with different options or config",
    [
      "app-deleted"
      /* AppError.APP_DELETED */
    ]: "Firebase App named '{$appName}' already deleted",
    [
      "no-options"
      /* AppError.NO_OPTIONS */
    ]: "Need to provide options, when not being deployed to hosting via source.",
    [
      "invalid-app-argument"
      /* AppError.INVALID_APP_ARGUMENT */
    ]: "firebase.{$appName}() takes either no argument or a Firebase App instance.",
    [
      "invalid-log-argument"
      /* AppError.INVALID_LOG_ARGUMENT */
    ]: "First argument to `onLog` must be null or a function.",
    [
      "idb-open"
      /* AppError.IDB_OPEN */
    ]: "Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.",
    [
      "idb-get"
      /* AppError.IDB_GET */
    ]: "Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.",
    [
      "idb-set"
      /* AppError.IDB_WRITE */
    ]: "Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.",
    [
      "idb-delete"
      /* AppError.IDB_DELETE */
    ]: "Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}."
  };
  var ERROR_FACTORY = new ErrorFactory("app", "Firebase", ERRORS);
  var FirebaseAppImpl = class {
    constructor(options, config2, container) {
      this._isDeleted = false;
      this._options = Object.assign({}, options);
      this._config = Object.assign({}, config2);
      this._name = config2.name;
      this._automaticDataCollectionEnabled = config2.automaticDataCollectionEnabled;
      this._container = container;
      this.container.addComponent(new Component(
        "app",
        () => this,
        "PUBLIC"
        /* ComponentType.PUBLIC */
      ));
    }
    get automaticDataCollectionEnabled() {
      this.checkDestroyed();
      return this._automaticDataCollectionEnabled;
    }
    set automaticDataCollectionEnabled(val) {
      this.checkDestroyed();
      this._automaticDataCollectionEnabled = val;
    }
    get name() {
      this.checkDestroyed();
      return this._name;
    }
    get options() {
      this.checkDestroyed();
      return this._options;
    }
    get config() {
      this.checkDestroyed();
      return this._config;
    }
    get container() {
      return this._container;
    }
    get isDeleted() {
      return this._isDeleted;
    }
    set isDeleted(val) {
      this._isDeleted = val;
    }
    /**
     * This function will throw an Error if the App has already been deleted -
     * use before performing API actions on the App.
     */
    checkDestroyed() {
      if (this.isDeleted) {
        throw ERROR_FACTORY.create("app-deleted", { appName: this._name });
      }
    }
  };
  function initializeApp(_options, rawConfig = {}) {
    let options = _options;
    if (typeof rawConfig !== "object") {
      const name4 = rawConfig;
      rawConfig = { name: name4 };
    }
    const config2 = Object.assign({ name: DEFAULT_ENTRY_NAME2, automaticDataCollectionEnabled: false }, rawConfig);
    const name3 = config2.name;
    if (typeof name3 !== "string" || !name3) {
      throw ERROR_FACTORY.create("bad-app-name", {
        appName: String(name3)
      });
    }
    options || (options = getDefaultAppConfig());
    if (!options) {
      throw ERROR_FACTORY.create(
        "no-options"
        /* AppError.NO_OPTIONS */
      );
    }
    const existingApp = _apps.get(name3);
    if (existingApp) {
      if (deepEqual(options, existingApp.options) && deepEqual(config2, existingApp.config)) {
        return existingApp;
      } else {
        throw ERROR_FACTORY.create("duplicate-app", { appName: name3 });
      }
    }
    const container = new ComponentContainer(name3);
    for (const component of _components.values()) {
      container.addComponent(component);
    }
    const newApp = new FirebaseAppImpl(options, config2, container);
    _apps.set(name3, newApp);
    return newApp;
  }
  function registerVersion(libraryKeyOrName, version2, variant) {
    var _a;
    let library = (_a = PLATFORM_LOG_STRING[libraryKeyOrName]) !== null && _a !== void 0 ? _a : libraryKeyOrName;
    if (variant) {
      library += "-".concat(variant);
    }
    const libraryMismatch = library.match(/\s|\//);
    const versionMismatch = version2.match(/\s|\//);
    if (libraryMismatch || versionMismatch) {
      const warning = [
        'Unable to register library "'.concat(library, '" with version "').concat(version2, '":')
      ];
      if (libraryMismatch) {
        warning.push('library name "'.concat(library, '" contains illegal characters (whitespace or "/")'));
      }
      if (libraryMismatch && versionMismatch) {
        warning.push("and");
      }
      if (versionMismatch) {
        warning.push('version name "'.concat(version2, '" contains illegal characters (whitespace or "/")'));
      }
      logger.warn(warning.join(" "));
      return;
    }
    _registerComponent(new Component(
      "".concat(library, "-version"),
      () => ({ library, version: version2 }),
      "VERSION"
      /* ComponentType.VERSION */
    ));
  }
  var DB_NAME = "firebase-heartbeat-database";
  var DB_VERSION = 1;
  var STORE_NAME = "firebase-heartbeat-store";
  var dbPromise = null;
  function getDbPromise() {
    if (!dbPromise) {
      dbPromise = openDB(DB_NAME, DB_VERSION, {
        upgrade: (db, oldVersion) => {
          switch (oldVersion) {
            case 0:
              try {
                db.createObjectStore(STORE_NAME);
              } catch (e) {
                console.warn(e);
              }
          }
        }
      }).catch((e) => {
        throw ERROR_FACTORY.create("idb-open", {
          originalErrorMessage: e.message
        });
      });
    }
    return dbPromise;
  }
  async function readHeartbeatsFromIndexedDB(app) {
    try {
      const db = await getDbPromise();
      const tx = db.transaction(STORE_NAME);
      const result = await tx.objectStore(STORE_NAME).get(computeKey(app));
      await tx.done;
      return result;
    } catch (e) {
      if (e instanceof FirebaseError) {
        logger.warn(e.message);
      } else {
        const idbGetError = ERROR_FACTORY.create("idb-get", {
          originalErrorMessage: e === null || e === void 0 ? void 0 : e.message
        });
        logger.warn(idbGetError.message);
      }
    }
  }
  async function writeHeartbeatsToIndexedDB(app, heartbeatObject) {
    try {
      const db = await getDbPromise();
      const tx = db.transaction(STORE_NAME, "readwrite");
      const objectStore = tx.objectStore(STORE_NAME);
      await objectStore.put(heartbeatObject, computeKey(app));
      await tx.done;
    } catch (e) {
      if (e instanceof FirebaseError) {
        logger.warn(e.message);
      } else {
        const idbGetError = ERROR_FACTORY.create("idb-set", {
          originalErrorMessage: e === null || e === void 0 ? void 0 : e.message
        });
        logger.warn(idbGetError.message);
      }
    }
  }
  function computeKey(app) {
    return "".concat(app.name, "!").concat(app.options.appId);
  }
  var MAX_HEADER_BYTES = 1024;
  var STORED_HEARTBEAT_RETENTION_MAX_MILLIS = 30 * 24 * 60 * 60 * 1e3;
  var HeartbeatServiceImpl = class {
    constructor(container) {
      this.container = container;
      this._heartbeatsCache = null;
      const app = this.container.getProvider("app").getImmediate();
      this._storage = new HeartbeatStorageImpl(app);
      this._heartbeatsCachePromise = this._storage.read().then((result) => {
        this._heartbeatsCache = result;
        return result;
      });
    }
    /**
     * Called to report a heartbeat. The function will generate
     * a HeartbeatsByUserAgent object, update heartbeatsCache, and persist it
     * to IndexedDB.
     * Note that we only store one heartbeat per day. So if a heartbeat for today is
     * already logged, subsequent calls to this function in the same day will be ignored.
     */
    async triggerHeartbeat() {
      var _a, _b;
      const platformLogger = this.container.getProvider("platform-logger").getImmediate();
      const agent = platformLogger.getPlatformInfoString();
      const date = getUTCDateString();
      if (((_a = this._heartbeatsCache) === null || _a === void 0 ? void 0 : _a.heartbeats) == null) {
        this._heartbeatsCache = await this._heartbeatsCachePromise;
        if (((_b = this._heartbeatsCache) === null || _b === void 0 ? void 0 : _b.heartbeats) == null) {
          return;
        }
      }
      if (this._heartbeatsCache.lastSentHeartbeatDate === date || this._heartbeatsCache.heartbeats.some((singleDateHeartbeat) => singleDateHeartbeat.date === date)) {
        return;
      } else {
        this._heartbeatsCache.heartbeats.push({ date, agent });
      }
      this._heartbeatsCache.heartbeats = this._heartbeatsCache.heartbeats.filter((singleDateHeartbeat) => {
        const hbTimestamp = new Date(singleDateHeartbeat.date).valueOf();
        const now = Date.now();
        return now - hbTimestamp <= STORED_HEARTBEAT_RETENTION_MAX_MILLIS;
      });
      return this._storage.overwrite(this._heartbeatsCache);
    }
    /**
     * Returns a base64 encoded string which can be attached to the heartbeat-specific header directly.
     * It also clears all heartbeats from memory as well as in IndexedDB.
     *
     * NOTE: Consuming product SDKs should not send the header if this method
     * returns an empty string.
     */
    async getHeartbeatsHeader() {
      var _a;
      if (this._heartbeatsCache === null) {
        await this._heartbeatsCachePromise;
      }
      if (((_a = this._heartbeatsCache) === null || _a === void 0 ? void 0 : _a.heartbeats) == null || this._heartbeatsCache.heartbeats.length === 0) {
        return "";
      }
      const date = getUTCDateString();
      const { heartbeatsToSend, unsentEntries } = extractHeartbeatsForHeader(this._heartbeatsCache.heartbeats);
      const headerString = base64urlEncodeWithoutPadding(JSON.stringify({ version: 2, heartbeats: heartbeatsToSend }));
      this._heartbeatsCache.lastSentHeartbeatDate = date;
      if (unsentEntries.length > 0) {
        this._heartbeatsCache.heartbeats = unsentEntries;
        await this._storage.overwrite(this._heartbeatsCache);
      } else {
        this._heartbeatsCache.heartbeats = [];
        void this._storage.overwrite(this._heartbeatsCache);
      }
      return headerString;
    }
  };
  function getUTCDateString() {
    const today = /* @__PURE__ */ new Date();
    return today.toISOString().substring(0, 10);
  }
  function extractHeartbeatsForHeader(heartbeatsCache, maxSize = MAX_HEADER_BYTES) {
    const heartbeatsToSend = [];
    let unsentEntries = heartbeatsCache.slice();
    for (const singleDateHeartbeat of heartbeatsCache) {
      const heartbeatEntry = heartbeatsToSend.find((hb) => hb.agent === singleDateHeartbeat.agent);
      if (!heartbeatEntry) {
        heartbeatsToSend.push({
          agent: singleDateHeartbeat.agent,
          dates: [singleDateHeartbeat.date]
        });
        if (countBytes(heartbeatsToSend) > maxSize) {
          heartbeatsToSend.pop();
          break;
        }
      } else {
        heartbeatEntry.dates.push(singleDateHeartbeat.date);
        if (countBytes(heartbeatsToSend) > maxSize) {
          heartbeatEntry.dates.pop();
          break;
        }
      }
      unsentEntries = unsentEntries.slice(1);
    }
    return {
      heartbeatsToSend,
      unsentEntries
    };
  }
  var HeartbeatStorageImpl = class {
    constructor(app) {
      this.app = app;
      this._canUseIndexedDBPromise = this.runIndexedDBEnvironmentCheck();
    }
    async runIndexedDBEnvironmentCheck() {
      if (!isIndexedDBAvailable()) {
        return false;
      } else {
        return validateIndexedDBOpenable().then(() => true).catch(() => false);
      }
    }
    /**
     * Read all heartbeats.
     */
    async read() {
      const canUseIndexedDB = await this._canUseIndexedDBPromise;
      if (!canUseIndexedDB) {
        return { heartbeats: [] };
      } else {
        const idbHeartbeatObject = await readHeartbeatsFromIndexedDB(this.app);
        if (idbHeartbeatObject === null || idbHeartbeatObject === void 0 ? void 0 : idbHeartbeatObject.heartbeats) {
          return idbHeartbeatObject;
        } else {
          return { heartbeats: [] };
        }
      }
    }
    // overwrite the storage with the provided heartbeats
    async overwrite(heartbeatsObject) {
      var _a;
      const canUseIndexedDB = await this._canUseIndexedDBPromise;
      if (!canUseIndexedDB) {
        return;
      } else {
        const existingHeartbeatsObject = await this.read();
        return writeHeartbeatsToIndexedDB(this.app, {
          lastSentHeartbeatDate: (_a = heartbeatsObject.lastSentHeartbeatDate) !== null && _a !== void 0 ? _a : existingHeartbeatsObject.lastSentHeartbeatDate,
          heartbeats: heartbeatsObject.heartbeats
        });
      }
    }
    // add heartbeats
    async add(heartbeatsObject) {
      var _a;
      const canUseIndexedDB = await this._canUseIndexedDBPromise;
      if (!canUseIndexedDB) {
        return;
      } else {
        const existingHeartbeatsObject = await this.read();
        return writeHeartbeatsToIndexedDB(this.app, {
          lastSentHeartbeatDate: (_a = heartbeatsObject.lastSentHeartbeatDate) !== null && _a !== void 0 ? _a : existingHeartbeatsObject.lastSentHeartbeatDate,
          heartbeats: [
            ...existingHeartbeatsObject.heartbeats,
            ...heartbeatsObject.heartbeats
          ]
        });
      }
    }
  };
  function countBytes(heartbeatsCache) {
    return base64urlEncodeWithoutPadding(
      // heartbeatsCache wrapper properties
      JSON.stringify({ version: 2, heartbeats: heartbeatsCache })
    ).length;
  }
  function registerCoreComponents(variant) {
    _registerComponent(new Component(
      "platform-logger",
      (container) => new PlatformLoggerServiceImpl(container),
      "PRIVATE"
      /* ComponentType.PRIVATE */
    ));
    _registerComponent(new Component(
      "heartbeat",
      (container) => new HeartbeatServiceImpl(container),
      "PRIVATE"
      /* ComponentType.PRIVATE */
    ));
    registerVersion(name$o, version$1, variant);
    registerVersion(name$o, version$1, "esm2017");
    registerVersion("fire-js", "");
  }
  registerCoreComponents("");

  // node_modules/firebase/app/dist/esm/index.esm.js
  var name2 = "firebase";
  var version = "10.9.0";
  registerVersion(name2, version, "app");

  // public/firebase.config.js
  function config() {
    const firebaseConfig = {
      "apiKey": "AIzaSyA77HYtVdsJD_SdwDgdVWvGDeDA1IIquKY",
      "authDomain": "sfx-rocks.firebaseapp.com",
      "projectId": "sfx-rocks",
      "storageBucket": "sfx-rocks.appspot.com",
      "messagingSenderId": "221320269920",
      "appId": "1:221320269920:web:0804ed9dfe08c466677305",
      "measurementId": "G-V506HKS3NE"
    };
    const app = initializeApp(firebaseConfig);
  }

  // public/home.js
  config();
})();
/*! Bundled license information:

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/component/dist/esm/index.esm2017.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/logger/dist/esm/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/app/dist/esm/index.esm2017.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/app/dist/esm/index.esm2017.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/app/dist/esm/index.esm2017.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/app/dist/esm/index.esm2017.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

firebase/app/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
*/
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vbm9kZV9tb2R1bGVzL0BmaXJlYmFzZS91dGlsL3NyYy9jb25zdGFudHMudHMiLCAiLi4vbm9kZV9tb2R1bGVzL0BmaXJlYmFzZS91dGlsL3NyYy9hc3NlcnQudHMiLCAiLi4vbm9kZV9tb2R1bGVzL0BmaXJlYmFzZS91dGlsL3NyYy9jcnlwdC50cyIsICIuLi9ub2RlX21vZHVsZXMvQGZpcmViYXNlL3V0aWwvc3JjL2RlZXBDb3B5LnRzIiwgIi4uL25vZGVfbW9kdWxlcy9AZmlyZWJhc2UvdXRpbC9zcmMvZ2xvYmFsLnRzIiwgIi4uL25vZGVfbW9kdWxlcy9AZmlyZWJhc2UvdXRpbC9zcmMvZGVmYXVsdHMudHMiLCAiLi4vbm9kZV9tb2R1bGVzL0BmaXJlYmFzZS91dGlsL3NyYy9kZWZlcnJlZC50cyIsICIuLi9ub2RlX21vZHVsZXMvQGZpcmViYXNlL3V0aWwvc3JjL2VtdWxhdG9yLnRzIiwgIi4uL25vZGVfbW9kdWxlcy9AZmlyZWJhc2UvdXRpbC9zcmMvZW52aXJvbm1lbnQudHMiLCAiLi4vbm9kZV9tb2R1bGVzL0BmaXJlYmFzZS91dGlsL3NyYy9lcnJvcnMudHMiLCAiLi4vbm9kZV9tb2R1bGVzL0BmaXJlYmFzZS91dGlsL3NyYy9qc29uLnRzIiwgIi4uL25vZGVfbW9kdWxlcy9AZmlyZWJhc2UvdXRpbC9zcmMvand0LnRzIiwgIi4uL25vZGVfbW9kdWxlcy9AZmlyZWJhc2UvdXRpbC9zcmMvb2JqLnRzIiwgIi4uL25vZGVfbW9kdWxlcy9AZmlyZWJhc2UvdXRpbC9zcmMvcHJvbWlzZS50cyIsICIuLi9ub2RlX21vZHVsZXMvQGZpcmViYXNlL3V0aWwvc3JjL3F1ZXJ5LnRzIiwgIi4uL25vZGVfbW9kdWxlcy9AZmlyZWJhc2UvdXRpbC9zcmMvc2hhMS50cyIsICIuLi9ub2RlX21vZHVsZXMvQGZpcmViYXNlL3V0aWwvc3JjL3N1YnNjcmliZS50cyIsICIuLi9ub2RlX21vZHVsZXMvQGZpcmViYXNlL3V0aWwvc3JjL3ZhbGlkYXRpb24udHMiLCAiLi4vbm9kZV9tb2R1bGVzL0BmaXJlYmFzZS91dGlsL3NyYy91dGY4LnRzIiwgIi4uL25vZGVfbW9kdWxlcy9AZmlyZWJhc2UvdXRpbC9zcmMvdXVpZC50cyIsICIuLi9ub2RlX21vZHVsZXMvQGZpcmViYXNlL3V0aWwvc3JjL2V4cG9uZW50aWFsX2JhY2tvZmYudHMiLCAiLi4vbm9kZV9tb2R1bGVzL0BmaXJlYmFzZS91dGlsL3NyYy9mb3JtYXR0ZXJzLnRzIiwgIi4uL25vZGVfbW9kdWxlcy9AZmlyZWJhc2UvdXRpbC9zcmMvY29tcGF0LnRzIiwgIi4uL25vZGVfbW9kdWxlcy9AZmlyZWJhc2UvY29tcG9uZW50L3NyYy9jb21wb25lbnQudHMiLCAiLi4vbm9kZV9tb2R1bGVzL0BmaXJlYmFzZS9jb21wb25lbnQvc3JjL2NvbnN0YW50cy50cyIsICIuLi9ub2RlX21vZHVsZXMvQGZpcmViYXNlL2NvbXBvbmVudC9zcmMvcHJvdmlkZXIudHMiLCAiLi4vbm9kZV9tb2R1bGVzL0BmaXJlYmFzZS9jb21wb25lbnQvc3JjL2NvbXBvbmVudF9jb250YWluZXIudHMiLCAiLi4vbm9kZV9tb2R1bGVzL0BmaXJlYmFzZS9sb2dnZXIvc3JjL2xvZ2dlci50cyIsICIuLi9ub2RlX21vZHVsZXMvaWRiL2J1aWxkL3dyYXAtaWRiLXZhbHVlLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9pZGIvYnVpbGQvaW5kZXguanMiLCAiLi4vbm9kZV9tb2R1bGVzL0BmaXJlYmFzZS9hcHAvc3JjL3BsYXRmb3JtTG9nZ2VyU2VydmljZS50cyIsICIuLi9ub2RlX21vZHVsZXMvQGZpcmViYXNlL2FwcC9zcmMvbG9nZ2VyLnRzIiwgIi4uL25vZGVfbW9kdWxlcy9AZmlyZWJhc2UvYXBwL3NyYy9jb25zdGFudHMudHMiLCAiLi4vbm9kZV9tb2R1bGVzL0BmaXJlYmFzZS9hcHAvc3JjL2ludGVybmFsLnRzIiwgIi4uL25vZGVfbW9kdWxlcy9AZmlyZWJhc2UvYXBwL3NyYy9lcnJvcnMudHMiLCAiLi4vbm9kZV9tb2R1bGVzL0BmaXJlYmFzZS9hcHAvc3JjL2ZpcmViYXNlQXBwLnRzIiwgIi4uL25vZGVfbW9kdWxlcy9AZmlyZWJhc2UvYXBwL3NyYy9hcGkudHMiLCAiLi4vbm9kZV9tb2R1bGVzL0BmaXJlYmFzZS9hcHAvc3JjL2luZGV4ZWRkYi50cyIsICIuLi9ub2RlX21vZHVsZXMvQGZpcmViYXNlL2FwcC9zcmMvaGVhcnRiZWF0U2VydmljZS50cyIsICIuLi9ub2RlX21vZHVsZXMvQGZpcmViYXNlL2FwcC9zcmMvcmVnaXN0ZXJDb3JlQ29tcG9uZW50cy50cyIsICIuLi9ub2RlX21vZHVsZXMvQGZpcmViYXNlL2FwcC9zcmMvaW5kZXgudHMiLCAiLi4vbm9kZV9tb2R1bGVzL2ZpcmViYXNlL2FwcC9pbmRleC50cyIsICJmaXJlYmFzZS5jb25maWcuanMiLCAiaG9tZS5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQ1xuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IEZpcmViYXNlIGNvbnN0YW50cy4gIFNvbWUgb2YgdGhlc2UgKEBkZWZpbmVzKSBjYW4gYmUgb3ZlcnJpZGRlbiBhdCBjb21waWxlLXRpbWUuXG4gKi9cblxuZXhwb3J0IGNvbnN0IENPTlNUQU5UUyA9IHtcbiAgLyoqXG4gICAqIEBkZWZpbmUge2Jvb2xlYW59IFdoZXRoZXIgdGhpcyBpcyB0aGUgY2xpZW50IE5vZGUuanMgU0RLLlxuICAgKi9cbiAgTk9ERV9DTElFTlQ6IGZhbHNlLFxuICAvKipcbiAgICogQGRlZmluZSB7Ym9vbGVhbn0gV2hldGhlciB0aGlzIGlzIHRoZSBBZG1pbiBOb2RlLmpzIFNESy5cbiAgICovXG4gIE5PREVfQURNSU46IGZhbHNlLFxuXG4gIC8qKlxuICAgKiBGaXJlYmFzZSBTREsgVmVyc2lvblxuICAgKi9cbiAgU0RLX1ZFUlNJT046ICcke0pTQ09SRV9WRVJTSU9OfSdcbn07XG4iLCAiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQ1xuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgQ09OU1RBTlRTIH0gZnJvbSAnLi9jb25zdGFudHMnO1xuXG4vKipcbiAqIFRocm93cyBhbiBlcnJvciBpZiB0aGUgcHJvdmlkZWQgYXNzZXJ0aW9uIGlzIGZhbHN5XG4gKi9cbmV4cG9ydCBjb25zdCBhc3NlcnQgPSBmdW5jdGlvbiAoYXNzZXJ0aW9uOiB1bmtub3duLCBtZXNzYWdlOiBzdHJpbmcpOiB2b2lkIHtcbiAgaWYgKCFhc3NlcnRpb24pIHtcbiAgICB0aHJvdyBhc3NlcnRpb25FcnJvcihtZXNzYWdlKTtcbiAgfVxufTtcblxuLyoqXG4gKiBSZXR1cm5zIGFuIEVycm9yIG9iamVjdCBzdWl0YWJsZSBmb3IgdGhyb3dpbmcuXG4gKi9cbmV4cG9ydCBjb25zdCBhc3NlcnRpb25FcnJvciA9IGZ1bmN0aW9uIChtZXNzYWdlOiBzdHJpbmcpOiBFcnJvciB7XG4gIHJldHVybiBuZXcgRXJyb3IoXG4gICAgJ0ZpcmViYXNlIERhdGFiYXNlICgnICtcbiAgICAgIENPTlNUQU5UUy5TREtfVkVSU0lPTiArXG4gICAgICAnKSBJTlRFUk5BTCBBU1NFUlQgRkFJTEVEOiAnICtcbiAgICAgIG1lc3NhZ2VcbiAgKTtcbn07XG4iLCAiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQ1xuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuY29uc3Qgc3RyaW5nVG9CeXRlQXJyYXkgPSBmdW5jdGlvbiAoc3RyOiBzdHJpbmcpOiBudW1iZXJbXSB7XG4gIC8vIFRPRE8odXNlcik6IFVzZSBuYXRpdmUgaW1wbGVtZW50YXRpb25zIGlmL3doZW4gYXZhaWxhYmxlXG4gIGNvbnN0IG91dDogbnVtYmVyW10gPSBbXTtcbiAgbGV0IHAgPSAwO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgIGxldCBjID0gc3RyLmNoYXJDb2RlQXQoaSk7XG4gICAgaWYgKGMgPCAxMjgpIHtcbiAgICAgIG91dFtwKytdID0gYztcbiAgICB9IGVsc2UgaWYgKGMgPCAyMDQ4KSB7XG4gICAgICBvdXRbcCsrXSA9IChjID4+IDYpIHwgMTkyO1xuICAgICAgb3V0W3ArK10gPSAoYyAmIDYzKSB8IDEyODtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgKGMgJiAweGZjMDApID09PSAweGQ4MDAgJiZcbiAgICAgIGkgKyAxIDwgc3RyLmxlbmd0aCAmJlxuICAgICAgKHN0ci5jaGFyQ29kZUF0KGkgKyAxKSAmIDB4ZmMwMCkgPT09IDB4ZGMwMFxuICAgICkge1xuICAgICAgLy8gU3Vycm9nYXRlIFBhaXJcbiAgICAgIGMgPSAweDEwMDAwICsgKChjICYgMHgwM2ZmKSA8PCAxMCkgKyAoc3RyLmNoYXJDb2RlQXQoKytpKSAmIDB4MDNmZik7XG4gICAgICBvdXRbcCsrXSA9IChjID4+IDE4KSB8IDI0MDtcbiAgICAgIG91dFtwKytdID0gKChjID4+IDEyKSAmIDYzKSB8IDEyODtcbiAgICAgIG91dFtwKytdID0gKChjID4+IDYpICYgNjMpIHwgMTI4O1xuICAgICAgb3V0W3ArK10gPSAoYyAmIDYzKSB8IDEyODtcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0W3ArK10gPSAoYyA+PiAxMikgfCAyMjQ7XG4gICAgICBvdXRbcCsrXSA9ICgoYyA+PiA2KSAmIDYzKSB8IDEyODtcbiAgICAgIG91dFtwKytdID0gKGMgJiA2MykgfCAxMjg7XG4gICAgfVxuICB9XG4gIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIFR1cm5zIGFuIGFycmF5IG9mIG51bWJlcnMgaW50byB0aGUgc3RyaW5nIGdpdmVuIGJ5IHRoZSBjb25jYXRlbmF0aW9uIG9mIHRoZVxuICogY2hhcmFjdGVycyB0byB3aGljaCB0aGUgbnVtYmVycyBjb3JyZXNwb25kLlxuICogQHBhcmFtIGJ5dGVzIEFycmF5IG9mIG51bWJlcnMgcmVwcmVzZW50aW5nIGNoYXJhY3RlcnMuXG4gKiBAcmV0dXJuIFN0cmluZ2lmaWNhdGlvbiBvZiB0aGUgYXJyYXkuXG4gKi9cbmNvbnN0IGJ5dGVBcnJheVRvU3RyaW5nID0gZnVuY3Rpb24gKGJ5dGVzOiBudW1iZXJbXSk6IHN0cmluZyB7XG4gIC8vIFRPRE8odXNlcik6IFVzZSBuYXRpdmUgaW1wbGVtZW50YXRpb25zIGlmL3doZW4gYXZhaWxhYmxlXG4gIGNvbnN0IG91dDogc3RyaW5nW10gPSBbXTtcbiAgbGV0IHBvcyA9IDAsXG4gICAgYyA9IDA7XG4gIHdoaWxlIChwb3MgPCBieXRlcy5sZW5ndGgpIHtcbiAgICBjb25zdCBjMSA9IGJ5dGVzW3BvcysrXTtcbiAgICBpZiAoYzEgPCAxMjgpIHtcbiAgICAgIG91dFtjKytdID0gU3RyaW5nLmZyb21DaGFyQ29kZShjMSk7XG4gICAgfSBlbHNlIGlmIChjMSA+IDE5MSAmJiBjMSA8IDIyNCkge1xuICAgICAgY29uc3QgYzIgPSBieXRlc1twb3MrK107XG4gICAgICBvdXRbYysrXSA9IFN0cmluZy5mcm9tQ2hhckNvZGUoKChjMSAmIDMxKSA8PCA2KSB8IChjMiAmIDYzKSk7XG4gICAgfSBlbHNlIGlmIChjMSA+IDIzOSAmJiBjMSA8IDM2NSkge1xuICAgICAgLy8gU3Vycm9nYXRlIFBhaXJcbiAgICAgIGNvbnN0IGMyID0gYnl0ZXNbcG9zKytdO1xuICAgICAgY29uc3QgYzMgPSBieXRlc1twb3MrK107XG4gICAgICBjb25zdCBjNCA9IGJ5dGVzW3BvcysrXTtcbiAgICAgIGNvbnN0IHUgPVxuICAgICAgICAoKChjMSAmIDcpIDw8IDE4KSB8ICgoYzIgJiA2MykgPDwgMTIpIHwgKChjMyAmIDYzKSA8PCA2KSB8IChjNCAmIDYzKSkgLVxuICAgICAgICAweDEwMDAwO1xuICAgICAgb3V0W2MrK10gPSBTdHJpbmcuZnJvbUNoYXJDb2RlKDB4ZDgwMCArICh1ID4+IDEwKSk7XG4gICAgICBvdXRbYysrXSA9IFN0cmluZy5mcm9tQ2hhckNvZGUoMHhkYzAwICsgKHUgJiAxMDIzKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGMyID0gYnl0ZXNbcG9zKytdO1xuICAgICAgY29uc3QgYzMgPSBieXRlc1twb3MrK107XG4gICAgICBvdXRbYysrXSA9IFN0cmluZy5mcm9tQ2hhckNvZGUoXG4gICAgICAgICgoYzEgJiAxNSkgPDwgMTIpIHwgKChjMiAmIDYzKSA8PCA2KSB8IChjMyAmIDYzKVxuICAgICAgKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG91dC5qb2luKCcnKTtcbn07XG5cbmludGVyZmFjZSBCYXNlNjQge1xuICBieXRlVG9DaGFyTWFwXzogeyBba2V5OiBudW1iZXJdOiBzdHJpbmcgfSB8IG51bGw7XG4gIGNoYXJUb0J5dGVNYXBfOiB7IFtrZXk6IHN0cmluZ106IG51bWJlciB9IHwgbnVsbDtcbiAgYnl0ZVRvQ2hhck1hcFdlYlNhZmVfOiB7IFtrZXk6IG51bWJlcl06IHN0cmluZyB9IHwgbnVsbDtcbiAgY2hhclRvQnl0ZU1hcFdlYlNhZmVfOiB7IFtrZXk6IHN0cmluZ106IG51bWJlciB9IHwgbnVsbDtcbiAgRU5DT0RFRF9WQUxTX0JBU0U6IHN0cmluZztcbiAgcmVhZG9ubHkgRU5DT0RFRF9WQUxTOiBzdHJpbmc7XG4gIHJlYWRvbmx5IEVOQ09ERURfVkFMU19XRUJTQUZFOiBzdHJpbmc7XG4gIEhBU19OQVRJVkVfU1VQUE9SVDogYm9vbGVhbjtcbiAgZW5jb2RlQnl0ZUFycmF5KGlucHV0OiBudW1iZXJbXSB8IFVpbnQ4QXJyYXksIHdlYlNhZmU/OiBib29sZWFuKTogc3RyaW5nO1xuICBlbmNvZGVTdHJpbmcoaW5wdXQ6IHN0cmluZywgd2ViU2FmZT86IGJvb2xlYW4pOiBzdHJpbmc7XG4gIGRlY29kZVN0cmluZyhpbnB1dDogc3RyaW5nLCB3ZWJTYWZlOiBib29sZWFuKTogc3RyaW5nO1xuICBkZWNvZGVTdHJpbmdUb0J5dGVBcnJheShpbnB1dDogc3RyaW5nLCB3ZWJTYWZlOiBib29sZWFuKTogbnVtYmVyW107XG4gIGluaXRfKCk6IHZvaWQ7XG59XG5cbi8vIFdlIGRlZmluZSBpdCBhcyBhbiBvYmplY3QgbGl0ZXJhbCBpbnN0ZWFkIG9mIGEgY2xhc3MgYmVjYXVzZSBhIGNsYXNzIGNvbXBpbGVkIGRvd24gdG8gZXM1IGNhbid0XG4vLyBiZSB0cmVlc2hha2VkLiBodHRwczovL2dpdGh1Yi5jb20vcm9sbHVwL3JvbGx1cC9pc3N1ZXMvMTY5MVxuLy8gU3RhdGljIGxvb2t1cCBtYXBzLCBsYXppbHkgcG9wdWxhdGVkIGJ5IGluaXRfKClcbmV4cG9ydCBjb25zdCBiYXNlNjQ6IEJhc2U2NCA9IHtcbiAgLyoqXG4gICAqIE1hcHMgYnl0ZXMgdG8gY2hhcmFjdGVycy5cbiAgICovXG4gIGJ5dGVUb0NoYXJNYXBfOiBudWxsLFxuXG4gIC8qKlxuICAgKiBNYXBzIGNoYXJhY3RlcnMgdG8gYnl0ZXMuXG4gICAqL1xuICBjaGFyVG9CeXRlTWFwXzogbnVsbCxcblxuICAvKipcbiAgICogTWFwcyBieXRlcyB0byB3ZWJzYWZlIGNoYXJhY3RlcnMuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBieXRlVG9DaGFyTWFwV2ViU2FmZV86IG51bGwsXG5cbiAgLyoqXG4gICAqIE1hcHMgd2Vic2FmZSBjaGFyYWN0ZXJzIHRvIGJ5dGVzLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgY2hhclRvQnl0ZU1hcFdlYlNhZmVfOiBudWxsLFxuXG4gIC8qKlxuICAgKiBPdXIgZGVmYXVsdCBhbHBoYWJldCwgc2hhcmVkIGJldHdlZW5cbiAgICogRU5DT0RFRF9WQUxTIGFuZCBFTkNPREVEX1ZBTFNfV0VCU0FGRVxuICAgKi9cbiAgRU5DT0RFRF9WQUxTX0JBU0U6XG4gICAgJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaJyArICdhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5eicgKyAnMDEyMzQ1Njc4OScsXG5cbiAgLyoqXG4gICAqIE91ciBkZWZhdWx0IGFscGhhYmV0LiBWYWx1ZSA2NCAoPSkgaXMgc3BlY2lhbDsgaXQgbWVhbnMgXCJub3RoaW5nLlwiXG4gICAqL1xuICBnZXQgRU5DT0RFRF9WQUxTKCkge1xuICAgIHJldHVybiB0aGlzLkVOQ09ERURfVkFMU19CQVNFICsgJysvPSc7XG4gIH0sXG5cbiAgLyoqXG4gICAqIE91ciB3ZWJzYWZlIGFscGhhYmV0LlxuICAgKi9cbiAgZ2V0IEVOQ09ERURfVkFMU19XRUJTQUZFKCkge1xuICAgIHJldHVybiB0aGlzLkVOQ09ERURfVkFMU19CQVNFICsgJy1fLic7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhpcyBicm93c2VyIHN1cHBvcnRzIHRoZSBhdG9iIGFuZCBidG9hIGZ1bmN0aW9ucy4gVGhpcyBleHRlbnNpb25cbiAgICogc3RhcnRlZCBhdCBNb3ppbGxhIGJ1dCBpcyBub3cgaW1wbGVtZW50ZWQgYnkgbWFueSBicm93c2Vycy4gV2UgdXNlIHRoZVxuICAgKiBBU1NVTUVfKiB2YXJpYWJsZXMgdG8gYXZvaWQgcHVsbGluZyBpbiB0aGUgZnVsbCB1c2VyYWdlbnQgZGV0ZWN0aW9uIGxpYnJhcnlcbiAgICogYnV0IHN0aWxsIGFsbG93aW5nIHRoZSBzdGFuZGFyZCBwZXItYnJvd3NlciBjb21waWxhdGlvbnMuXG4gICAqXG4gICAqL1xuICBIQVNfTkFUSVZFX1NVUFBPUlQ6IHR5cGVvZiBhdG9iID09PSAnZnVuY3Rpb24nLFxuXG4gIC8qKlxuICAgKiBCYXNlNjQtZW5jb2RlIGFuIGFycmF5IG9mIGJ5dGVzLlxuICAgKlxuICAgKiBAcGFyYW0gaW5wdXQgQW4gYXJyYXkgb2YgYnl0ZXMgKG51bWJlcnMgd2l0aFxuICAgKiAgICAgdmFsdWUgaW4gWzAsIDI1NV0pIHRvIGVuY29kZS5cbiAgICogQHBhcmFtIHdlYlNhZmUgQm9vbGVhbiBpbmRpY2F0aW5nIHdlIHNob3VsZCB1c2UgdGhlXG4gICAqICAgICBhbHRlcm5hdGl2ZSBhbHBoYWJldC5cbiAgICogQHJldHVybiBUaGUgYmFzZTY0IGVuY29kZWQgc3RyaW5nLlxuICAgKi9cbiAgZW5jb2RlQnl0ZUFycmF5KGlucHV0OiBudW1iZXJbXSB8IFVpbnQ4QXJyYXksIHdlYlNhZmU/OiBib29sZWFuKTogc3RyaW5nIHtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoaW5wdXQpKSB7XG4gICAgICB0aHJvdyBFcnJvcignZW5jb2RlQnl0ZUFycmF5IHRha2VzIGFuIGFycmF5IGFzIGEgcGFyYW1ldGVyJyk7XG4gICAgfVxuXG4gICAgdGhpcy5pbml0XygpO1xuXG4gICAgY29uc3QgYnl0ZVRvQ2hhck1hcCA9IHdlYlNhZmVcbiAgICAgID8gdGhpcy5ieXRlVG9DaGFyTWFwV2ViU2FmZV8hXG4gICAgICA6IHRoaXMuYnl0ZVRvQ2hhck1hcF8hO1xuXG4gICAgY29uc3Qgb3V0cHV0ID0gW107XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGlucHV0Lmxlbmd0aDsgaSArPSAzKSB7XG4gICAgICBjb25zdCBieXRlMSA9IGlucHV0W2ldO1xuICAgICAgY29uc3QgaGF2ZUJ5dGUyID0gaSArIDEgPCBpbnB1dC5sZW5ndGg7XG4gICAgICBjb25zdCBieXRlMiA9IGhhdmVCeXRlMiA/IGlucHV0W2kgKyAxXSA6IDA7XG4gICAgICBjb25zdCBoYXZlQnl0ZTMgPSBpICsgMiA8IGlucHV0Lmxlbmd0aDtcbiAgICAgIGNvbnN0IGJ5dGUzID0gaGF2ZUJ5dGUzID8gaW5wdXRbaSArIDJdIDogMDtcblxuICAgICAgY29uc3Qgb3V0Qnl0ZTEgPSBieXRlMSA+PiAyO1xuICAgICAgY29uc3Qgb3V0Qnl0ZTIgPSAoKGJ5dGUxICYgMHgwMykgPDwgNCkgfCAoYnl0ZTIgPj4gNCk7XG4gICAgICBsZXQgb3V0Qnl0ZTMgPSAoKGJ5dGUyICYgMHgwZikgPDwgMikgfCAoYnl0ZTMgPj4gNik7XG4gICAgICBsZXQgb3V0Qnl0ZTQgPSBieXRlMyAmIDB4M2Y7XG5cbiAgICAgIGlmICghaGF2ZUJ5dGUzKSB7XG4gICAgICAgIG91dEJ5dGU0ID0gNjQ7XG5cbiAgICAgICAgaWYgKCFoYXZlQnl0ZTIpIHtcbiAgICAgICAgICBvdXRCeXRlMyA9IDY0O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIG91dHB1dC5wdXNoKFxuICAgICAgICBieXRlVG9DaGFyTWFwW291dEJ5dGUxXSxcbiAgICAgICAgYnl0ZVRvQ2hhck1hcFtvdXRCeXRlMl0sXG4gICAgICAgIGJ5dGVUb0NoYXJNYXBbb3V0Qnl0ZTNdLFxuICAgICAgICBieXRlVG9DaGFyTWFwW291dEJ5dGU0XVxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gb3V0cHV0LmpvaW4oJycpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBCYXNlNjQtZW5jb2RlIGEgc3RyaW5nLlxuICAgKlxuICAgKiBAcGFyYW0gaW5wdXQgQSBzdHJpbmcgdG8gZW5jb2RlLlxuICAgKiBAcGFyYW0gd2ViU2FmZSBJZiB0cnVlLCB3ZSBzaG91bGQgdXNlIHRoZVxuICAgKiAgICAgYWx0ZXJuYXRpdmUgYWxwaGFiZXQuXG4gICAqIEByZXR1cm4gVGhlIGJhc2U2NCBlbmNvZGVkIHN0cmluZy5cbiAgICovXG4gIGVuY29kZVN0cmluZyhpbnB1dDogc3RyaW5nLCB3ZWJTYWZlPzogYm9vbGVhbik6IHN0cmluZyB7XG4gICAgLy8gU2hvcnRjdXQgZm9yIE1vemlsbGEgYnJvd3NlcnMgdGhhdCBpbXBsZW1lbnRcbiAgICAvLyBhIG5hdGl2ZSBiYXNlNjQgZW5jb2RlciBpbiB0aGUgZm9ybSBvZiBcImJ0b2EvYXRvYlwiXG4gICAgaWYgKHRoaXMuSEFTX05BVElWRV9TVVBQT1JUICYmICF3ZWJTYWZlKSB7XG4gICAgICByZXR1cm4gYnRvYShpbnB1dCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmVuY29kZUJ5dGVBcnJheShzdHJpbmdUb0J5dGVBcnJheShpbnB1dCksIHdlYlNhZmUpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBCYXNlNjQtZGVjb2RlIGEgc3RyaW5nLlxuICAgKlxuICAgKiBAcGFyYW0gaW5wdXQgdG8gZGVjb2RlLlxuICAgKiBAcGFyYW0gd2ViU2FmZSBUcnVlIGlmIHdlIHNob3VsZCB1c2UgdGhlXG4gICAqICAgICBhbHRlcm5hdGl2ZSBhbHBoYWJldC5cbiAgICogQHJldHVybiBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSBkZWNvZGVkIHZhbHVlLlxuICAgKi9cbiAgZGVjb2RlU3RyaW5nKGlucHV0OiBzdHJpbmcsIHdlYlNhZmU6IGJvb2xlYW4pOiBzdHJpbmcge1xuICAgIC8vIFNob3J0Y3V0IGZvciBNb3ppbGxhIGJyb3dzZXJzIHRoYXQgaW1wbGVtZW50XG4gICAgLy8gYSBuYXRpdmUgYmFzZTY0IGVuY29kZXIgaW4gdGhlIGZvcm0gb2YgXCJidG9hL2F0b2JcIlxuICAgIGlmICh0aGlzLkhBU19OQVRJVkVfU1VQUE9SVCAmJiAhd2ViU2FmZSkge1xuICAgICAgcmV0dXJuIGF0b2IoaW5wdXQpO1xuICAgIH1cbiAgICByZXR1cm4gYnl0ZUFycmF5VG9TdHJpbmcodGhpcy5kZWNvZGVTdHJpbmdUb0J5dGVBcnJheShpbnB1dCwgd2ViU2FmZSkpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBCYXNlNjQtZGVjb2RlIGEgc3RyaW5nLlxuICAgKlxuICAgKiBJbiBiYXNlLTY0IGRlY29kaW5nLCBncm91cHMgb2YgZm91ciBjaGFyYWN0ZXJzIGFyZSBjb252ZXJ0ZWQgaW50byB0aHJlZVxuICAgKiBieXRlcy4gIElmIHRoZSBlbmNvZGVyIGRpZCBub3QgYXBwbHkgcGFkZGluZywgdGhlIGlucHV0IGxlbmd0aCBtYXkgbm90XG4gICAqIGJlIGEgbXVsdGlwbGUgb2YgNC5cbiAgICpcbiAgICogSW4gdGhpcyBjYXNlLCB0aGUgbGFzdCBncm91cCB3aWxsIGhhdmUgZmV3ZXIgdGhhbiA0IGNoYXJhY3RlcnMsIGFuZFxuICAgKiBwYWRkaW5nIHdpbGwgYmUgaW5mZXJyZWQuICBJZiB0aGUgZ3JvdXAgaGFzIG9uZSBvciB0d28gY2hhcmFjdGVycywgaXQgZGVjb2Rlc1xuICAgKiB0byBvbmUgYnl0ZS4gIElmIHRoZSBncm91cCBoYXMgdGhyZWUgY2hhcmFjdGVycywgaXQgZGVjb2RlcyB0byB0d28gYnl0ZXMuXG4gICAqXG4gICAqIEBwYXJhbSBpbnB1dCBJbnB1dCB0byBkZWNvZGUuXG4gICAqIEBwYXJhbSB3ZWJTYWZlIFRydWUgaWYgd2Ugc2hvdWxkIHVzZSB0aGUgd2ViLXNhZmUgYWxwaGFiZXQuXG4gICAqIEByZXR1cm4gYnl0ZXMgcmVwcmVzZW50aW5nIHRoZSBkZWNvZGVkIHZhbHVlLlxuICAgKi9cbiAgZGVjb2RlU3RyaW5nVG9CeXRlQXJyYXkoaW5wdXQ6IHN0cmluZywgd2ViU2FmZTogYm9vbGVhbik6IG51bWJlcltdIHtcbiAgICB0aGlzLmluaXRfKCk7XG5cbiAgICBjb25zdCBjaGFyVG9CeXRlTWFwID0gd2ViU2FmZVxuICAgICAgPyB0aGlzLmNoYXJUb0J5dGVNYXBXZWJTYWZlXyFcbiAgICAgIDogdGhpcy5jaGFyVG9CeXRlTWFwXyE7XG5cbiAgICBjb25zdCBvdXRwdXQ6IG51bWJlcltdID0gW107XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGlucHV0Lmxlbmd0aDsgKSB7XG4gICAgICBjb25zdCBieXRlMSA9IGNoYXJUb0J5dGVNYXBbaW5wdXQuY2hhckF0KGkrKyldO1xuXG4gICAgICBjb25zdCBoYXZlQnl0ZTIgPSBpIDwgaW5wdXQubGVuZ3RoO1xuICAgICAgY29uc3QgYnl0ZTIgPSBoYXZlQnl0ZTIgPyBjaGFyVG9CeXRlTWFwW2lucHV0LmNoYXJBdChpKV0gOiAwO1xuICAgICAgKytpO1xuXG4gICAgICBjb25zdCBoYXZlQnl0ZTMgPSBpIDwgaW5wdXQubGVuZ3RoO1xuICAgICAgY29uc3QgYnl0ZTMgPSBoYXZlQnl0ZTMgPyBjaGFyVG9CeXRlTWFwW2lucHV0LmNoYXJBdChpKV0gOiA2NDtcbiAgICAgICsraTtcblxuICAgICAgY29uc3QgaGF2ZUJ5dGU0ID0gaSA8IGlucHV0Lmxlbmd0aDtcbiAgICAgIGNvbnN0IGJ5dGU0ID0gaGF2ZUJ5dGU0ID8gY2hhclRvQnl0ZU1hcFtpbnB1dC5jaGFyQXQoaSldIDogNjQ7XG4gICAgICArK2k7XG5cbiAgICAgIGlmIChieXRlMSA9PSBudWxsIHx8IGJ5dGUyID09IG51bGwgfHwgYnl0ZTMgPT0gbnVsbCB8fCBieXRlNCA9PSBudWxsKSB7XG4gICAgICAgIHRocm93IG5ldyBEZWNvZGVCYXNlNjRTdHJpbmdFcnJvcigpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBvdXRCeXRlMSA9IChieXRlMSA8PCAyKSB8IChieXRlMiA+PiA0KTtcbiAgICAgIG91dHB1dC5wdXNoKG91dEJ5dGUxKTtcblxuICAgICAgaWYgKGJ5dGUzICE9PSA2NCkge1xuICAgICAgICBjb25zdCBvdXRCeXRlMiA9ICgoYnl0ZTIgPDwgNCkgJiAweGYwKSB8IChieXRlMyA+PiAyKTtcbiAgICAgICAgb3V0cHV0LnB1c2gob3V0Qnl0ZTIpO1xuXG4gICAgICAgIGlmIChieXRlNCAhPT0gNjQpIHtcbiAgICAgICAgICBjb25zdCBvdXRCeXRlMyA9ICgoYnl0ZTMgPDwgNikgJiAweGMwKSB8IGJ5dGU0O1xuICAgICAgICAgIG91dHB1dC5wdXNoKG91dEJ5dGUzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBvdXRwdXQ7XG4gIH0sXG5cbiAgLyoqXG4gICAqIExhenkgc3RhdGljIGluaXRpYWxpemF0aW9uIGZ1bmN0aW9uLiBDYWxsZWQgYmVmb3JlXG4gICAqIGFjY2Vzc2luZyBhbnkgb2YgdGhlIHN0YXRpYyBtYXAgdmFyaWFibGVzLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgaW5pdF8oKSB7XG4gICAgaWYgKCF0aGlzLmJ5dGVUb0NoYXJNYXBfKSB7XG4gICAgICB0aGlzLmJ5dGVUb0NoYXJNYXBfID0ge307XG4gICAgICB0aGlzLmNoYXJUb0J5dGVNYXBfID0ge307XG4gICAgICB0aGlzLmJ5dGVUb0NoYXJNYXBXZWJTYWZlXyA9IHt9O1xuICAgICAgdGhpcy5jaGFyVG9CeXRlTWFwV2ViU2FmZV8gPSB7fTtcblxuICAgICAgLy8gV2Ugd2FudCBxdWljayBtYXBwaW5ncyBiYWNrIGFuZCBmb3J0aCwgc28gd2UgcHJlY29tcHV0ZSB0d28gbWFwcy5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5FTkNPREVEX1ZBTFMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGhpcy5ieXRlVG9DaGFyTWFwX1tpXSA9IHRoaXMuRU5DT0RFRF9WQUxTLmNoYXJBdChpKTtcbiAgICAgICAgdGhpcy5jaGFyVG9CeXRlTWFwX1t0aGlzLmJ5dGVUb0NoYXJNYXBfW2ldXSA9IGk7XG4gICAgICAgIHRoaXMuYnl0ZVRvQ2hhck1hcFdlYlNhZmVfW2ldID0gdGhpcy5FTkNPREVEX1ZBTFNfV0VCU0FGRS5jaGFyQXQoaSk7XG4gICAgICAgIHRoaXMuY2hhclRvQnl0ZU1hcFdlYlNhZmVfW3RoaXMuYnl0ZVRvQ2hhck1hcFdlYlNhZmVfW2ldXSA9IGk7XG5cbiAgICAgICAgLy8gQmUgZm9yZ2l2aW5nIHdoZW4gZGVjb2RpbmcgYW5kIGNvcnJlY3RseSBkZWNvZGUgYm90aCBlbmNvZGluZ3MuXG4gICAgICAgIGlmIChpID49IHRoaXMuRU5DT0RFRF9WQUxTX0JBU0UubGVuZ3RoKSB7XG4gICAgICAgICAgdGhpcy5jaGFyVG9CeXRlTWFwX1t0aGlzLkVOQ09ERURfVkFMU19XRUJTQUZFLmNoYXJBdChpKV0gPSBpO1xuICAgICAgICAgIHRoaXMuY2hhclRvQnl0ZU1hcFdlYlNhZmVfW3RoaXMuRU5DT0RFRF9WQUxTLmNoYXJBdChpKV0gPSBpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG4vKipcbiAqIEFuIGVycm9yIGVuY291bnRlcmVkIHdoaWxlIGRlY29kaW5nIGJhc2U2NCBzdHJpbmcuXG4gKi9cbmV4cG9ydCBjbGFzcyBEZWNvZGVCYXNlNjRTdHJpbmdFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgcmVhZG9ubHkgbmFtZSA9ICdEZWNvZGVCYXNlNjRTdHJpbmdFcnJvcic7XG59XG5cbi8qKlxuICogVVJMLXNhZmUgYmFzZTY0IGVuY29kaW5nXG4gKi9cbmV4cG9ydCBjb25zdCBiYXNlNjRFbmNvZGUgPSBmdW5jdGlvbiAoc3RyOiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCB1dGY4Qnl0ZXMgPSBzdHJpbmdUb0J5dGVBcnJheShzdHIpO1xuICByZXR1cm4gYmFzZTY0LmVuY29kZUJ5dGVBcnJheSh1dGY4Qnl0ZXMsIHRydWUpO1xufTtcblxuLyoqXG4gKiBVUkwtc2FmZSBiYXNlNjQgZW5jb2RpbmcgKHdpdGhvdXQgXCIuXCIgcGFkZGluZyBpbiB0aGUgZW5kKS5cbiAqIGUuZy4gVXNlZCBpbiBKU09OIFdlYiBUb2tlbiAoSldUKSBwYXJ0cy5cbiAqL1xuZXhwb3J0IGNvbnN0IGJhc2U2NHVybEVuY29kZVdpdGhvdXRQYWRkaW5nID0gZnVuY3Rpb24gKHN0cjogc3RyaW5nKTogc3RyaW5nIHtcbiAgLy8gVXNlIGJhc2U2NHVybCBlbmNvZGluZyBhbmQgcmVtb3ZlIHBhZGRpbmcgaW4gdGhlIGVuZCAoZG90IGNoYXJhY3RlcnMpLlxuICByZXR1cm4gYmFzZTY0RW5jb2RlKHN0cikucmVwbGFjZSgvXFwuL2csICcnKTtcbn07XG5cbi8qKlxuICogVVJMLXNhZmUgYmFzZTY0IGRlY29kaW5nXG4gKlxuICogTk9URTogRE8gTk9UIHVzZSB0aGUgZ2xvYmFsIGF0b2IoKSBmdW5jdGlvbiAtIGl0IGRvZXMgTk9UIHN1cHBvcnQgdGhlXG4gKiBiYXNlNjRVcmwgdmFyaWFudCBlbmNvZGluZy5cbiAqXG4gKiBAcGFyYW0gc3RyIFRvIGJlIGRlY29kZWRcbiAqIEByZXR1cm4gRGVjb2RlZCByZXN1bHQsIGlmIHBvc3NpYmxlXG4gKi9cbmV4cG9ydCBjb25zdCBiYXNlNjREZWNvZGUgPSBmdW5jdGlvbiAoc3RyOiBzdHJpbmcpOiBzdHJpbmcgfCBudWxsIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gYmFzZTY0LmRlY29kZVN0cmluZyhzdHIsIHRydWUpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS5lcnJvcignYmFzZTY0RGVjb2RlIGZhaWxlZDogJywgZSk7XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59O1xuIiwgIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTENcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8qKlxuICogRG8gYSBkZWVwLWNvcHkgb2YgYmFzaWMgSmF2YVNjcmlwdCBPYmplY3RzIG9yIEFycmF5cy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlZXBDb3B5PFQ+KHZhbHVlOiBUKTogVCB7XG4gIHJldHVybiBkZWVwRXh0ZW5kKHVuZGVmaW5lZCwgdmFsdWUpIGFzIFQ7XG59XG5cbi8qKlxuICogQ29weSBwcm9wZXJ0aWVzIGZyb20gc291cmNlIHRvIHRhcmdldCAocmVjdXJzaXZlbHkgYWxsb3dzIGV4dGVuc2lvblxuICogb2YgT2JqZWN0cyBhbmQgQXJyYXlzKS4gIFNjYWxhciB2YWx1ZXMgaW4gdGhlIHRhcmdldCBhcmUgb3Zlci13cml0dGVuLlxuICogSWYgdGFyZ2V0IGlzIHVuZGVmaW5lZCwgYW4gb2JqZWN0IG9mIHRoZSBhcHByb3ByaWF0ZSB0eXBlIHdpbGwgYmUgY3JlYXRlZFxuICogKGFuZCByZXR1cm5lZCkuXG4gKlxuICogV2UgcmVjdXJzaXZlbHkgY29weSBhbGwgY2hpbGQgcHJvcGVydGllcyBvZiBwbGFpbiBPYmplY3RzIGluIHRoZSBzb3VyY2UtIHNvXG4gKiB0aGF0IG5hbWVzcGFjZS0gbGlrZSBkaWN0aW9uYXJpZXMgYXJlIG1lcmdlZC5cbiAqXG4gKiBOb3RlIHRoYXQgdGhlIHRhcmdldCBjYW4gYmUgYSBmdW5jdGlvbiwgaW4gd2hpY2ggY2FzZSB0aGUgcHJvcGVydGllcyBpblxuICogdGhlIHNvdXJjZSBPYmplY3QgYXJlIGNvcGllZCBvbnRvIGl0IGFzIHN0YXRpYyBwcm9wZXJ0aWVzIG9mIHRoZSBGdW5jdGlvbi5cbiAqXG4gKiBOb3RlOiB3ZSBkb24ndCBtZXJnZSBfX3Byb3RvX18gdG8gcHJldmVudCBwcm90b3R5cGUgcG9sbHV0aW9uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWVwRXh0ZW5kKHRhcmdldDogdW5rbm93biwgc291cmNlOiB1bmtub3duKTogdW5rbm93biB7XG4gIGlmICghKHNvdXJjZSBpbnN0YW5jZW9mIE9iamVjdCkpIHtcbiAgICByZXR1cm4gc291cmNlO1xuICB9XG5cbiAgc3dpdGNoIChzb3VyY2UuY29uc3RydWN0b3IpIHtcbiAgICBjYXNlIERhdGU6XG4gICAgICAvLyBUcmVhdCBEYXRlcyBsaWtlIHNjYWxhcnM7IGlmIHRoZSB0YXJnZXQgZGF0ZSBvYmplY3QgaGFkIGFueSBjaGlsZFxuICAgICAgLy8gcHJvcGVydGllcyAtIHRoZXkgd2lsbCBiZSBsb3N0IVxuICAgICAgY29uc3QgZGF0ZVZhbHVlID0gc291cmNlIGFzIERhdGU7XG4gICAgICByZXR1cm4gbmV3IERhdGUoZGF0ZVZhbHVlLmdldFRpbWUoKSk7XG5cbiAgICBjYXNlIE9iamVjdDpcbiAgICAgIGlmICh0YXJnZXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0YXJnZXQgPSB7fTtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgQXJyYXk6XG4gICAgICAvLyBBbHdheXMgY29weSB0aGUgYXJyYXkgc291cmNlIGFuZCBvdmVyd3JpdGUgdGhlIHRhcmdldC5cbiAgICAgIHRhcmdldCA9IFtdO1xuICAgICAgYnJlYWs7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgLy8gTm90IGEgcGxhaW4gT2JqZWN0IC0gdHJlYXQgaXQgYXMgYSBzY2FsYXIuXG4gICAgICByZXR1cm4gc291cmNlO1xuICB9XG5cbiAgZm9yIChjb25zdCBwcm9wIGluIHNvdXJjZSkge1xuICAgIC8vIHVzZSBpc1ZhbGlkS2V5IHRvIGd1YXJkIGFnYWluc3QgcHJvdG90eXBlIHBvbGx1dGlvbi4gU2VlIGh0dHBzOi8vc255ay5pby92dWxuL1NOWUstSlMtTE9EQVNILTQ1MDIwMlxuICAgIGlmICghc291cmNlLmhhc093blByb3BlcnR5KHByb3ApIHx8ICFpc1ZhbGlkS2V5KHByb3ApKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgKHRhcmdldCBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPilbcHJvcF0gPSBkZWVwRXh0ZW5kKFxuICAgICAgKHRhcmdldCBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPilbcHJvcF0sXG4gICAgICAoc291cmNlIGFzIFJlY29yZDxzdHJpbmcsIHVua25vd24+KVtwcm9wXVxuICAgICk7XG4gIH1cblxuICByZXR1cm4gdGFyZ2V0O1xufVxuXG5mdW5jdGlvbiBpc1ZhbGlkS2V5KGtleTogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiBrZXkgIT09ICdfX3Byb3RvX18nO1xufVxuIiwgIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIyIEdvb2dsZSBMTENcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8qKlxuICogUG9seWZpbGwgZm9yIGBnbG9iYWxUaGlzYCBvYmplY3QuXG4gKiBAcmV0dXJucyB0aGUgYGdsb2JhbFRoaXNgIG9iamVjdCBmb3IgdGhlIGdpdmVuIGVudmlyb25tZW50LlxuICogQHB1YmxpY1xuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0R2xvYmFsKCk6IHR5cGVvZiBnbG9iYWxUaGlzIHtcbiAgaWYgKHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybiBzZWxmO1xuICB9XG4gIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybiB3aW5kb3c7XG4gIH1cbiAgaWYgKHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIGdsb2JhbDtcbiAgfVxuICB0aHJvdyBuZXcgRXJyb3IoJ1VuYWJsZSB0byBsb2NhdGUgZ2xvYmFsIG9iamVjdC4nKTtcbn1cbiIsICIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMiBHb29nbGUgTExDXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBiYXNlNjREZWNvZGUgfSBmcm9tICcuL2NyeXB0JztcbmltcG9ydCB7IGdldEdsb2JhbCB9IGZyb20gJy4vZ2xvYmFsJztcblxuLyoqXG4gKiBLZXlzIGZvciBleHBlcmltZW50YWwgcHJvcGVydGllcyBvbiB0aGUgYEZpcmViYXNlRGVmYXVsdHNgIG9iamVjdC5cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IHR5cGUgRXhwZXJpbWVudGFsS2V5ID0gJ2F1dGhUb2tlblN5bmNVUkwnIHwgJ2F1dGhJZFRva2VuTWF4QWdlJztcblxuLyoqXG4gKiBBbiBvYmplY3QgdGhhdCBjYW4gYmUgaW5qZWN0ZWQgaW50byB0aGUgZW52aXJvbm1lbnQgYXMgX19GSVJFQkFTRV9ERUZBVUxUU19fLFxuICogZWl0aGVyIGFzIGEgcHJvcGVydHkgb2YgZ2xvYmFsVGhpcywgYSBzaGVsbCBlbnZpcm9ubWVudCB2YXJpYWJsZSwgb3IgYVxuICogY29va2llLlxuICpcbiAqIFRoaXMgb2JqZWN0IGNhbiBiZSB1c2VkIHRvIGF1dG9tYXRpY2FsbHkgY29uZmlndXJlIGFuZCBpbml0aWFsaXplXG4gKiBhIEZpcmViYXNlIGFwcCBhcyB3ZWxsIGFzIGFueSBlbXVsYXRvcnMuXG4gKlxuICogQHB1YmxpY1xuICovXG5leHBvcnQgaW50ZXJmYWNlIEZpcmViYXNlRGVmYXVsdHMge1xuICBjb25maWc/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICBlbXVsYXRvckhvc3RzPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgX2F1dGhUb2tlblN5bmNVUkw/OiBzdHJpbmc7XG4gIF9hdXRoSWRUb2tlbk1heEFnZT86IG51bWJlcjtcbiAgLyoqXG4gICAqIE92ZXJyaWRlIEZpcmViYXNlJ3MgcnVudGltZSBlbnZpcm9ubWVudCBkZXRlY3Rpb24gYW5kXG4gICAqIGZvcmNlIHRoZSBTREsgdG8gYWN0IGFzIGlmIGl0IHdlcmUgaW4gdGhlIHNwZWNpZmllZCBlbnZpcm9ubWVudC5cbiAgICovXG4gIGZvcmNlRW52aXJvbm1lbnQ/OiAnYnJvd3NlcicgfCAnbm9kZSc7XG4gIFtrZXk6IHN0cmluZ106IHVua25vd247XG59XG5cbmRlY2xhcmUgZ2xvYmFsIHtcbiAgLy8gTmVlZCBgdmFyYCBmb3IgdGhpcyB0byB3b3JrLlxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdmFyXG4gIHZhciBfX0ZJUkVCQVNFX0RFRkFVTFRTX186IEZpcmViYXNlRGVmYXVsdHMgfCB1bmRlZmluZWQ7XG59XG5cbmNvbnN0IGdldERlZmF1bHRzRnJvbUdsb2JhbCA9ICgpOiBGaXJlYmFzZURlZmF1bHRzIHwgdW5kZWZpbmVkID0+XG4gIGdldEdsb2JhbCgpLl9fRklSRUJBU0VfREVGQVVMVFNfXztcblxuLyoqXG4gKiBBdHRlbXB0IHRvIHJlYWQgZGVmYXVsdHMgZnJvbSBhIEpTT04gc3RyaW5nIHByb3ZpZGVkIHRvXG4gKiBwcm9jZXNzKC4pZW52KC4pX19GSVJFQkFTRV9ERUZBVUxUU19fIG9yIGEgSlNPTiBmaWxlIHdob3NlIHBhdGggaXMgaW5cbiAqIHByb2Nlc3MoLillbnYoLilfX0ZJUkVCQVNFX0RFRkFVTFRTX1BBVEhfX1xuICogVGhlIGRvdHMgYXJlIGluIHBhcmVucyBiZWNhdXNlIGNlcnRhaW4gY29tcGlsZXJzIChWaXRlPykgY2Fubm90XG4gKiBoYW5kbGUgc2VlaW5nIHRoYXQgdmFyaWFibGUgaW4gY29tbWVudHMuXG4gKiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2ZpcmViYXNlL2ZpcmViYXNlLWpzLXNkay9pc3N1ZXMvNjgzOFxuICovXG5jb25zdCBnZXREZWZhdWx0c0Zyb21FbnZWYXJpYWJsZSA9ICgpOiBGaXJlYmFzZURlZmF1bHRzIHwgdW5kZWZpbmVkID0+IHtcbiAgaWYgKHR5cGVvZiBwcm9jZXNzID09PSAndW5kZWZpbmVkJyB8fCB0eXBlb2YgcHJvY2Vzcy5lbnYgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvbnN0IGRlZmF1bHRzSnNvblN0cmluZyA9IHByb2Nlc3MuZW52Ll9fRklSRUJBU0VfREVGQVVMVFNfXztcbiAgaWYgKGRlZmF1bHRzSnNvblN0cmluZykge1xuICAgIHJldHVybiBKU09OLnBhcnNlKGRlZmF1bHRzSnNvblN0cmluZyk7XG4gIH1cbn07XG5cbmNvbnN0IGdldERlZmF1bHRzRnJvbUNvb2tpZSA9ICgpOiBGaXJlYmFzZURlZmF1bHRzIHwgdW5kZWZpbmVkID0+IHtcbiAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgbGV0IG1hdGNoO1xuICB0cnkge1xuICAgIG1hdGNoID0gZG9jdW1lbnQuY29va2llLm1hdGNoKC9fX0ZJUkVCQVNFX0RFRkFVTFRTX189KFteO10rKS8pO1xuICB9IGNhdGNoIChlKSB7XG4gICAgLy8gU29tZSBlbnZpcm9ubWVudHMgc3VjaCBhcyBBbmd1bGFyIFVuaXZlcnNhbCBTU1IgaGF2ZSBhXG4gICAgLy8gYGRvY3VtZW50YCBvYmplY3QgYnV0IGVycm9yIG9uIGFjY2Vzc2luZyBgZG9jdW1lbnQuY29va2llYC5cbiAgICByZXR1cm47XG4gIH1cbiAgY29uc3QgZGVjb2RlZCA9IG1hdGNoICYmIGJhc2U2NERlY29kZShtYXRjaFsxXSk7XG4gIHJldHVybiBkZWNvZGVkICYmIEpTT04ucGFyc2UoZGVjb2RlZCk7XG59O1xuXG4vKipcbiAqIEdldCB0aGUgX19GSVJFQkFTRV9ERUZBVUxUU19fIG9iamVjdC4gSXQgY2hlY2tzIGluIG9yZGVyOlxuICogKDEpIGlmIHN1Y2ggYW4gb2JqZWN0IGV4aXN0cyBhcyBhIHByb3BlcnR5IG9mIGBnbG9iYWxUaGlzYFxuICogKDIpIGlmIHN1Y2ggYW4gb2JqZWN0IHdhcyBwcm92aWRlZCBvbiBhIHNoZWxsIGVudmlyb25tZW50IHZhcmlhYmxlXG4gKiAoMykgaWYgc3VjaCBhbiBvYmplY3QgZXhpc3RzIGluIGEgY29va2llXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCBnZXREZWZhdWx0cyA9ICgpOiBGaXJlYmFzZURlZmF1bHRzIHwgdW5kZWZpbmVkID0+IHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gKFxuICAgICAgZ2V0RGVmYXVsdHNGcm9tR2xvYmFsKCkgfHxcbiAgICAgIGdldERlZmF1bHRzRnJvbUVudlZhcmlhYmxlKCkgfHxcbiAgICAgIGdldERlZmF1bHRzRnJvbUNvb2tpZSgpXG4gICAgKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIC8qKlxuICAgICAqIENhdGNoLWFsbCBmb3IgYmVpbmcgdW5hYmxlIHRvIGdldCBfX0ZJUkVCQVNFX0RFRkFVTFRTX18gZHVlXG4gICAgICogdG8gYW55IGVudmlyb25tZW50IGNhc2Ugd2UgaGF2ZSBub3QgYWNjb3VudGVkIGZvci4gTG9nIHRvXG4gICAgICogaW5mbyBpbnN0ZWFkIG9mIHN3YWxsb3dpbmcgc28gd2UgY2FuIGZpbmQgdGhlc2UgdW5rbm93biBjYXNlc1xuICAgICAqIGFuZCBhZGQgcGF0aHMgZm9yIHRoZW0gaWYgbmVlZGVkLlxuICAgICAqL1xuICAgIGNvbnNvbGUuaW5mbyhgVW5hYmxlIHRvIGdldCBfX0ZJUkVCQVNFX0RFRkFVTFRTX18gZHVlIHRvOiAke2V9YCk7XG4gICAgcmV0dXJuO1xuICB9XG59O1xuXG4vKipcbiAqIFJldHVybnMgZW11bGF0b3IgaG9zdCBzdG9yZWQgaW4gdGhlIF9fRklSRUJBU0VfREVGQVVMVFNfXyBvYmplY3RcbiAqIGZvciB0aGUgZ2l2ZW4gcHJvZHVjdC5cbiAqIEByZXR1cm5zIGEgVVJMIGhvc3QgZm9ybWF0dGVkIGxpa2UgYDEyNy4wLjAuMTo5OTk5YCBvciBgWzo6MV06NDAwMGAgaWYgYXZhaWxhYmxlXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCBnZXREZWZhdWx0RW11bGF0b3JIb3N0ID0gKFxuICBwcm9kdWN0TmFtZTogc3RyaW5nXG4pOiBzdHJpbmcgfCB1bmRlZmluZWQgPT4gZ2V0RGVmYXVsdHMoKT8uZW11bGF0b3JIb3N0cz8uW3Byb2R1Y3ROYW1lXTtcblxuLyoqXG4gKiBSZXR1cm5zIGVtdWxhdG9yIGhvc3RuYW1lIGFuZCBwb3J0IHN0b3JlZCBpbiB0aGUgX19GSVJFQkFTRV9ERUZBVUxUU19fIG9iamVjdFxuICogZm9yIHRoZSBnaXZlbiBwcm9kdWN0LlxuICogQHJldHVybnMgYSBwYWlyIG9mIGhvc3RuYW1lIGFuZCBwb3J0IGxpa2UgYFtcIjo6MVwiLCA0MDAwXWAgaWYgYXZhaWxhYmxlXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCBnZXREZWZhdWx0RW11bGF0b3JIb3N0bmFtZUFuZFBvcnQgPSAoXG4gIHByb2R1Y3ROYW1lOiBzdHJpbmdcbik6IFtob3N0bmFtZTogc3RyaW5nLCBwb3J0OiBudW1iZXJdIHwgdW5kZWZpbmVkID0+IHtcbiAgY29uc3QgaG9zdCA9IGdldERlZmF1bHRFbXVsYXRvckhvc3QocHJvZHVjdE5hbWUpO1xuICBpZiAoIWhvc3QpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG4gIGNvbnN0IHNlcGFyYXRvckluZGV4ID0gaG9zdC5sYXN0SW5kZXhPZignOicpOyAvLyBGaW5kaW5nIHRoZSBsYXN0IHNpbmNlIElQdjYgYWRkciBhbHNvIGhhcyBjb2xvbnMuXG4gIGlmIChzZXBhcmF0b3JJbmRleCA8PSAwIHx8IHNlcGFyYXRvckluZGV4ICsgMSA9PT0gaG9zdC5sZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgaG9zdCAke2hvc3R9IHdpdGggbm8gc2VwYXJhdGUgaG9zdG5hbWUgYW5kIHBvcnQhYCk7XG4gIH1cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXJlc3RyaWN0ZWQtZ2xvYmFsc1xuICBjb25zdCBwb3J0ID0gcGFyc2VJbnQoaG9zdC5zdWJzdHJpbmcoc2VwYXJhdG9ySW5kZXggKyAxKSwgMTApO1xuICBpZiAoaG9zdFswXSA9PT0gJ1snKSB7XG4gICAgLy8gQnJhY2tldC1xdW90ZWQgYFtpcHY2YWRkcl06cG9ydGAgPT4gcmV0dXJuIFwiaXB2NmFkZHJcIiAod2l0aG91dCBicmFja2V0cykuXG4gICAgcmV0dXJuIFtob3N0LnN1YnN0cmluZygxLCBzZXBhcmF0b3JJbmRleCAtIDEpLCBwb3J0XTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gW2hvc3Quc3Vic3RyaW5nKDAsIHNlcGFyYXRvckluZGV4KSwgcG9ydF07XG4gIH1cbn07XG5cbi8qKlxuICogUmV0dXJucyBGaXJlYmFzZSBhcHAgY29uZmlnIHN0b3JlZCBpbiB0aGUgX19GSVJFQkFTRV9ERUZBVUxUU19fIG9iamVjdC5cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNvbnN0IGdldERlZmF1bHRBcHBDb25maWcgPSAoKTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiB8IHVuZGVmaW5lZCA9PlxuICBnZXREZWZhdWx0cygpPy5jb25maWc7XG5cbi8qKlxuICogUmV0dXJucyBhbiBleHBlcmltZW50YWwgc2V0dGluZyBvbiB0aGUgX19GSVJFQkFTRV9ERUZBVUxUU19fIG9iamVjdCAocHJvcGVydGllc1xuICogcHJlZml4ZWQgYnkgXCJfXCIpXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCBnZXRFeHBlcmltZW50YWxTZXR0aW5nID0gPFQgZXh0ZW5kcyBFeHBlcmltZW50YWxLZXk+KFxuICBuYW1lOiBUXG4pOiBGaXJlYmFzZURlZmF1bHRzW2BfJHtUfWBdID0+XG4gIGdldERlZmF1bHRzKCk/LltgXyR7bmFtZX1gXSBhcyBGaXJlYmFzZURlZmF1bHRzW2BfJHtUfWBdO1xuIiwgIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTENcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmV4cG9ydCBjbGFzcyBEZWZlcnJlZDxSPiB7XG4gIHByb21pc2U6IFByb21pc2U8Uj47XG4gIHJlamVjdDogKHZhbHVlPzogdW5rbm93bikgPT4gdm9pZCA9ICgpID0+IHt9O1xuICByZXNvbHZlOiAodmFsdWU/OiB1bmtub3duKSA9PiB2b2lkID0gKCkgPT4ge307XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMucmVzb2x2ZSA9IHJlc29sdmUgYXMgKHZhbHVlPzogdW5rbm93bikgPT4gdm9pZDtcbiAgICAgIHRoaXMucmVqZWN0ID0gcmVqZWN0IGFzICh2YWx1ZT86IHVua25vd24pID0+IHZvaWQ7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogT3VyIEFQSSBpbnRlcm5hbHMgYXJlIG5vdCBwcm9taXNlaWZpZWQgYW5kIGNhbm5vdCBiZWNhdXNlIG91ciBjYWxsYmFjayBBUElzIGhhdmUgc3VidGxlIGV4cGVjdGF0aW9ucyBhcm91bmRcbiAgICogaW52b2tpbmcgcHJvbWlzZXMgaW5saW5lLCB3aGljaCBQcm9taXNlcyBhcmUgZm9yYmlkZGVuIHRvIGRvLiBUaGlzIG1ldGhvZCBhY2NlcHRzIGFuIG9wdGlvbmFsIG5vZGUtc3R5bGUgY2FsbGJhY2tcbiAgICogYW5kIHJldHVybnMgYSBub2RlLXN0eWxlIGNhbGxiYWNrIHdoaWNoIHdpbGwgcmVzb2x2ZSBvciByZWplY3QgdGhlIERlZmVycmVkJ3MgcHJvbWlzZS5cbiAgICovXG4gIHdyYXBDYWxsYmFjayhcbiAgICBjYWxsYmFjaz86IChlcnJvcj86IHVua25vd24sIHZhbHVlPzogdW5rbm93bikgPT4gdm9pZFxuICApOiAoZXJyb3I6IHVua25vd24sIHZhbHVlPzogdW5rbm93bikgPT4gdm9pZCB7XG4gICAgcmV0dXJuIChlcnJvciwgdmFsdWU/KSA9PiB7XG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgdGhpcy5yZWplY3QoZXJyb3IpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5yZXNvbHZlKHZhbHVlKTtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gQXR0YWNoaW5nIG5vb3AgaGFuZGxlciBqdXN0IGluIGNhc2UgZGV2ZWxvcGVyIHdhc24ndCBleHBlY3RpbmdcbiAgICAgICAgLy8gcHJvbWlzZXNcbiAgICAgICAgdGhpcy5wcm9taXNlLmNhdGNoKCgpID0+IHt9KTtcblxuICAgICAgICAvLyBTb21lIG9mIG91ciBjYWxsYmFja3MgZG9uJ3QgZXhwZWN0IGEgdmFsdWUgYW5kIG91ciBvd24gdGVzdHNcbiAgICAgICAgLy8gYXNzZXJ0IHRoYXQgdGhlIHBhcmFtZXRlciBsZW5ndGggaXMgMVxuICAgICAgICBpZiAoY2FsbGJhY2subGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgY2FsbGJhY2soZXJyb3IpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9XG59XG4iLCAiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjEgR29vZ2xlIExMQ1xuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgYmFzZTY0dXJsRW5jb2RlV2l0aG91dFBhZGRpbmcgfSBmcm9tICcuL2NyeXB0JztcblxuLy8gRmlyZWJhc2UgQXV0aCB0b2tlbnMgY29udGFpbiBzbmFrZV9jYXNlIGNsYWltcyBmb2xsb3dpbmcgdGhlIEpXVCBzdGFuZGFyZCAvIGNvbnZlbnRpb24uXG4vKiBlc2xpbnQtZGlzYWJsZSBjYW1lbGNhc2UgKi9cblxuZXhwb3J0IHR5cGUgRmlyZWJhc2VTaWduSW5Qcm92aWRlciA9XG4gIHwgJ2N1c3RvbSdcbiAgfCAnZW1haWwnXG4gIHwgJ3Bhc3N3b3JkJ1xuICB8ICdwaG9uZSdcbiAgfCAnYW5vbnltb3VzJ1xuICB8ICdnb29nbGUuY29tJ1xuICB8ICdmYWNlYm9vay5jb20nXG4gIHwgJ2dpdGh1Yi5jb20nXG4gIHwgJ3R3aXR0ZXIuY29tJ1xuICB8ICdtaWNyb3NvZnQuY29tJ1xuICB8ICdhcHBsZS5jb20nO1xuXG5pbnRlcmZhY2UgRmlyZWJhc2VJZFRva2VuIHtcbiAgLy8gQWx3YXlzIHNldCB0byBodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vUFJPSkVDVF9JRFxuICBpc3M6IHN0cmluZztcblxuICAvLyBBbHdheXMgc2V0IHRvIFBST0pFQ1RfSURcbiAgYXVkOiBzdHJpbmc7XG5cbiAgLy8gVGhlIHVzZXIncyB1bmlxdWUgSURcbiAgc3ViOiBzdHJpbmc7XG5cbiAgLy8gVGhlIHRva2VuIGlzc3VlIHRpbWUsIGluIHNlY29uZHMgc2luY2UgZXBvY2hcbiAgaWF0OiBudW1iZXI7XG5cbiAgLy8gVGhlIHRva2VuIGV4cGlyeSB0aW1lLCBub3JtYWxseSAnaWF0JyArIDM2MDBcbiAgZXhwOiBudW1iZXI7XG5cbiAgLy8gVGhlIHVzZXIncyB1bmlxdWUgSUQuIE11c3QgYmUgZXF1YWwgdG8gJ3N1YidcbiAgdXNlcl9pZDogc3RyaW5nO1xuXG4gIC8vIFRoZSB0aW1lIHRoZSB1c2VyIGF1dGhlbnRpY2F0ZWQsIG5vcm1hbGx5ICdpYXQnXG4gIGF1dGhfdGltZTogbnVtYmVyO1xuXG4gIC8vIFRoZSBzaWduIGluIHByb3ZpZGVyLCBvbmx5IHNldCB3aGVuIHRoZSBwcm92aWRlciBpcyAnYW5vbnltb3VzJ1xuICBwcm92aWRlcl9pZD86ICdhbm9ueW1vdXMnO1xuXG4gIC8vIFRoZSB1c2VyJ3MgcHJpbWFyeSBlbWFpbFxuICBlbWFpbD86IHN0cmluZztcblxuICAvLyBUaGUgdXNlcidzIGVtYWlsIHZlcmlmaWNhdGlvbiBzdGF0dXNcbiAgZW1haWxfdmVyaWZpZWQ/OiBib29sZWFuO1xuXG4gIC8vIFRoZSB1c2VyJ3MgcHJpbWFyeSBwaG9uZSBudW1iZXJcbiAgcGhvbmVfbnVtYmVyPzogc3RyaW5nO1xuXG4gIC8vIFRoZSB1c2VyJ3MgZGlzcGxheSBuYW1lXG4gIG5hbWU/OiBzdHJpbmc7XG5cbiAgLy8gVGhlIHVzZXIncyBwcm9maWxlIHBob3RvIFVSTFxuICBwaWN0dXJlPzogc3RyaW5nO1xuXG4gIC8vIEluZm9ybWF0aW9uIG9uIGFsbCBpZGVudGl0aWVzIGxpbmtlZCB0byB0aGlzIHVzZXJcbiAgZmlyZWJhc2U6IHtcbiAgICAvLyBUaGUgcHJpbWFyeSBzaWduLWluIHByb3ZpZGVyXG4gICAgc2lnbl9pbl9wcm92aWRlcjogRmlyZWJhc2VTaWduSW5Qcm92aWRlcjtcblxuICAgIC8vIEEgbWFwIG9mIHByb3ZpZGVycyB0byB0aGUgdXNlcidzIGxpc3Qgb2YgdW5pcXVlIGlkZW50aWZpZXJzIGZyb21cbiAgICAvLyBlYWNoIHByb3ZpZGVyXG4gICAgaWRlbnRpdGllcz86IHsgW3Byb3ZpZGVyIGluIEZpcmViYXNlU2lnbkluUHJvdmlkZXJdPzogc3RyaW5nW10gfTtcbiAgfTtcblxuICAvLyBDdXN0b20gY2xhaW1zIHNldCBieSB0aGUgZGV2ZWxvcGVyXG4gIFtjbGFpbTogc3RyaW5nXTogdW5rbm93bjtcblxuICB1aWQ/OiBuZXZlcjsgLy8gVHJ5IHRvIGNhdGNoIGEgY29tbW9uIG1pc3Rha2Ugb2YgXCJ1aWRcIiAoc2hvdWxkIGJlIFwic3ViXCIgaW5zdGVhZCkuXG59XG5cbmV4cG9ydCB0eXBlIEVtdWxhdG9yTW9ja1Rva2VuT3B0aW9ucyA9ICh7IHVzZXJfaWQ6IHN0cmluZyB9IHwgeyBzdWI6IHN0cmluZyB9KSAmXG4gIFBhcnRpYWw8RmlyZWJhc2VJZFRva2VuPjtcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU1vY2tVc2VyVG9rZW4oXG4gIHRva2VuOiBFbXVsYXRvck1vY2tUb2tlbk9wdGlvbnMsXG4gIHByb2plY3RJZD86IHN0cmluZ1xuKTogc3RyaW5nIHtcbiAgaWYgKHRva2VuLnVpZCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICdUaGUgXCJ1aWRcIiBmaWVsZCBpcyBubyBsb25nZXIgc3VwcG9ydGVkIGJ5IG1vY2tVc2VyVG9rZW4uIFBsZWFzZSB1c2UgXCJzdWJcIiBpbnN0ZWFkIGZvciBGaXJlYmFzZSBBdXRoIFVzZXIgSUQuJ1xuICAgICk7XG4gIH1cbiAgLy8gVW5zZWN1cmVkIEpXVHMgdXNlIFwibm9uZVwiIGFzIHRoZSBhbGdvcml0aG0uXG4gIGNvbnN0IGhlYWRlciA9IHtcbiAgICBhbGc6ICdub25lJyxcbiAgICB0eXBlOiAnSldUJ1xuICB9O1xuXG4gIGNvbnN0IHByb2plY3QgPSBwcm9qZWN0SWQgfHwgJ2RlbW8tcHJvamVjdCc7XG4gIGNvbnN0IGlhdCA9IHRva2VuLmlhdCB8fCAwO1xuICBjb25zdCBzdWIgPSB0b2tlbi5zdWIgfHwgdG9rZW4udXNlcl9pZDtcbiAgaWYgKCFzdWIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJtb2NrVXNlclRva2VuIG11c3QgY29udGFpbiAnc3ViJyBvciAndXNlcl9pZCcgZmllbGQhXCIpO1xuICB9XG5cbiAgY29uc3QgcGF5bG9hZDogRmlyZWJhc2VJZFRva2VuID0ge1xuICAgIC8vIFNldCBhbGwgcmVxdWlyZWQgZmllbGRzIHRvIGRlY2VudCBkZWZhdWx0c1xuICAgIGlzczogYGh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS8ke3Byb2plY3R9YCxcbiAgICBhdWQ6IHByb2plY3QsXG4gICAgaWF0LFxuICAgIGV4cDogaWF0ICsgMzYwMCxcbiAgICBhdXRoX3RpbWU6IGlhdCxcbiAgICBzdWIsXG4gICAgdXNlcl9pZDogc3ViLFxuICAgIGZpcmViYXNlOiB7XG4gICAgICBzaWduX2luX3Byb3ZpZGVyOiAnY3VzdG9tJyxcbiAgICAgIGlkZW50aXRpZXM6IHt9XG4gICAgfSxcblxuICAgIC8vIE92ZXJyaWRlIHdpdGggdXNlciBvcHRpb25zXG4gICAgLi4udG9rZW5cbiAgfTtcblxuICAvLyBVbnNlY3VyZWQgSldUcyB1c2UgdGhlIGVtcHR5IHN0cmluZyBhcyBhIHNpZ25hdHVyZS5cbiAgY29uc3Qgc2lnbmF0dXJlID0gJyc7XG4gIHJldHVybiBbXG4gICAgYmFzZTY0dXJsRW5jb2RlV2l0aG91dFBhZGRpbmcoSlNPTi5zdHJpbmdpZnkoaGVhZGVyKSksXG4gICAgYmFzZTY0dXJsRW5jb2RlV2l0aG91dFBhZGRpbmcoSlNPTi5zdHJpbmdpZnkocGF5bG9hZCkpLFxuICAgIHNpZ25hdHVyZVxuICBdLmpvaW4oJy4nKTtcbn1cbiIsICIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBDT05TVEFOVFMgfSBmcm9tICcuL2NvbnN0YW50cyc7XG5pbXBvcnQgeyBnZXREZWZhdWx0cyB9IGZyb20gJy4vZGVmYXVsdHMnO1xuXG4vKipcbiAqIFJldHVybnMgbmF2aWdhdG9yLnVzZXJBZ2VudCBzdHJpbmcgb3IgJycgaWYgaXQncyBub3QgZGVmaW5lZC5cbiAqIEByZXR1cm4gdXNlciBhZ2VudCBzdHJpbmdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFVBKCk6IHN0cmluZyB7XG4gIGlmIChcbiAgICB0eXBlb2YgbmF2aWdhdG9yICE9PSAndW5kZWZpbmVkJyAmJlxuICAgIHR5cGVvZiBuYXZpZ2F0b3JbJ3VzZXJBZ2VudCddID09PSAnc3RyaW5nJ1xuICApIHtcbiAgICByZXR1cm4gbmF2aWdhdG9yWyd1c2VyQWdlbnQnXTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cbn1cblxuLyoqXG4gKiBEZXRlY3QgQ29yZG92YSAvIFBob25lR2FwIC8gSW9uaWMgZnJhbWV3b3JrcyBvbiBhIG1vYmlsZSBkZXZpY2UuXG4gKlxuICogRGVsaWJlcmF0ZWx5IGRvZXMgbm90IHJlbHkgb24gY2hlY2tpbmcgYGZpbGU6Ly9gIFVSTHMgKGFzIHRoaXMgZmFpbHMgUGhvbmVHYXBcbiAqIGluIHRoZSBSaXBwbGUgZW11bGF0b3IpIG5vciBDb3Jkb3ZhIGBvbkRldmljZVJlYWR5YCwgd2hpY2ggd291bGQgbm9ybWFsbHlcbiAqIHdhaXQgZm9yIGEgY2FsbGJhY2suXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc01vYmlsZUNvcmRvdmEoKTogYm9vbGVhbiB7XG4gIHJldHVybiAoXG4gICAgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAvLyBAdHMtaWdub3JlIFNldHRpbmcgdXAgYW4gYnJvYWRseSBhcHBsaWNhYmxlIGluZGV4IHNpZ25hdHVyZSBmb3IgV2luZG93XG4gICAgLy8ganVzdCB0byBkZWFsIHdpdGggdGhpcyBjYXNlIHdvdWxkIHByb2JhYmx5IGJlIGEgYmFkIGlkZWEuXG4gICAgISEod2luZG93Wydjb3Jkb3ZhJ10gfHwgd2luZG93WydwaG9uZWdhcCddIHx8IHdpbmRvd1snUGhvbmVHYXAnXSkgJiZcbiAgICAvaW9zfGlwaG9uZXxpcG9kfGlwYWR8YW5kcm9pZHxibGFja2JlcnJ5fGllbW9iaWxlL2kudGVzdChnZXRVQSgpKVxuICApO1xufVxuXG4vKipcbiAqIERldGVjdCBOb2RlLmpzLlxuICpcbiAqIEByZXR1cm4gdHJ1ZSBpZiBOb2RlLmpzIGVudmlyb25tZW50IGlzIGRldGVjdGVkIG9yIHNwZWNpZmllZC5cbiAqL1xuLy8gTm9kZSBkZXRlY3Rpb24gbG9naWMgZnJvbTogaHR0cHM6Ly9naXRodWIuY29tL2lsaWFrYW4vZGV0ZWN0LW5vZGUvXG5leHBvcnQgZnVuY3Rpb24gaXNOb2RlKCk6IGJvb2xlYW4ge1xuICBjb25zdCBmb3JjZUVudmlyb25tZW50ID0gZ2V0RGVmYXVsdHMoKT8uZm9yY2VFbnZpcm9ubWVudDtcbiAgaWYgKGZvcmNlRW52aXJvbm1lbnQgPT09ICdub2RlJykge1xuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2UgaWYgKGZvcmNlRW52aXJvbm1lbnQgPT09ICdicm93c2VyJykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHRyeSB7XG4gICAgcmV0dXJuIChcbiAgICAgIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChnbG9iYWwucHJvY2VzcykgPT09ICdbb2JqZWN0IHByb2Nlc3NdJ1xuICAgICk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuLyoqXG4gKiBEZXRlY3QgQnJvd3NlciBFbnZpcm9ubWVudFxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNCcm93c2VyKCk6IGJvb2xlYW4ge1xuICByZXR1cm4gdHlwZW9mIHNlbGYgPT09ICdvYmplY3QnICYmIHNlbGYuc2VsZiA9PT0gc2VsZjtcbn1cblxuLyoqXG4gKiBEZXRlY3QgYnJvd3NlciBleHRlbnNpb25zIChDaHJvbWUgYW5kIEZpcmVmb3ggYXQgbGVhc3QpLlxuICovXG5pbnRlcmZhY2UgQnJvd3NlclJ1bnRpbWUge1xuICBpZD86IHVua25vd247XG59XG5kZWNsYXJlIGNvbnN0IGNocm9tZTogeyBydW50aW1lPzogQnJvd3NlclJ1bnRpbWUgfTtcbmRlY2xhcmUgY29uc3QgYnJvd3NlcjogeyBydW50aW1lPzogQnJvd3NlclJ1bnRpbWUgfTtcbmV4cG9ydCBmdW5jdGlvbiBpc0Jyb3dzZXJFeHRlbnNpb24oKTogYm9vbGVhbiB7XG4gIGNvbnN0IHJ1bnRpbWUgPVxuICAgIHR5cGVvZiBjaHJvbWUgPT09ICdvYmplY3QnXG4gICAgICA/IGNocm9tZS5ydW50aW1lXG4gICAgICA6IHR5cGVvZiBicm93c2VyID09PSAnb2JqZWN0J1xuICAgICAgPyBicm93c2VyLnJ1bnRpbWVcbiAgICAgIDogdW5kZWZpbmVkO1xuICByZXR1cm4gdHlwZW9mIHJ1bnRpbWUgPT09ICdvYmplY3QnICYmIHJ1bnRpbWUuaWQgIT09IHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBEZXRlY3QgUmVhY3QgTmF0aXZlLlxuICpcbiAqIEByZXR1cm4gdHJ1ZSBpZiBSZWFjdE5hdGl2ZSBlbnZpcm9ubWVudCBpcyBkZXRlY3RlZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzUmVhY3ROYXRpdmUoKTogYm9vbGVhbiB7XG4gIHJldHVybiAoXG4gICAgdHlwZW9mIG5hdmlnYXRvciA9PT0gJ29iamVjdCcgJiYgbmF2aWdhdG9yWydwcm9kdWN0J10gPT09ICdSZWFjdE5hdGl2ZSdcbiAgKTtcbn1cblxuLyoqIERldGVjdHMgRWxlY3Ryb24gYXBwcy4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0VsZWN0cm9uKCk6IGJvb2xlYW4ge1xuICByZXR1cm4gZ2V0VUEoKS5pbmRleE9mKCdFbGVjdHJvbi8nKSA+PSAwO1xufVxuXG4vKiogRGV0ZWN0cyBJbnRlcm5ldCBFeHBsb3Jlci4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0lFKCk6IGJvb2xlYW4ge1xuICBjb25zdCB1YSA9IGdldFVBKCk7XG4gIHJldHVybiB1YS5pbmRleE9mKCdNU0lFICcpID49IDAgfHwgdWEuaW5kZXhPZignVHJpZGVudC8nKSA+PSAwO1xufVxuXG4vKiogRGV0ZWN0cyBVbml2ZXJzYWwgV2luZG93cyBQbGF0Zm9ybSBhcHBzLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzVVdQKCk6IGJvb2xlYW4ge1xuICByZXR1cm4gZ2V0VUEoKS5pbmRleE9mKCdNU0FwcEhvc3QvJykgPj0gMDtcbn1cblxuLyoqXG4gKiBEZXRlY3Qgd2hldGhlciB0aGUgY3VycmVudCBTREsgYnVpbGQgaXMgdGhlIE5vZGUgdmVyc2lvbi5cbiAqXG4gKiBAcmV0dXJuIHRydWUgaWYgaXQncyB0aGUgTm9kZSBTREsgYnVpbGQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc05vZGVTZGsoKTogYm9vbGVhbiB7XG4gIHJldHVybiBDT05TVEFOVFMuTk9ERV9DTElFTlQgPT09IHRydWUgfHwgQ09OU1RBTlRTLk5PREVfQURNSU4gPT09IHRydWU7XG59XG5cbi8qKiBSZXR1cm5zIHRydWUgaWYgd2UgYXJlIHJ1bm5pbmcgaW4gU2FmYXJpLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzU2FmYXJpKCk6IGJvb2xlYW4ge1xuICByZXR1cm4gKFxuICAgICFpc05vZGUoKSAmJlxuICAgICEhbmF2aWdhdG9yLnVzZXJBZ2VudCAmJlxuICAgIG5hdmlnYXRvci51c2VyQWdlbnQuaW5jbHVkZXMoJ1NhZmFyaScpICYmXG4gICAgIW5hdmlnYXRvci51c2VyQWdlbnQuaW5jbHVkZXMoJ0Nocm9tZScpXG4gICk7XG59XG5cbi8qKlxuICogVGhpcyBtZXRob2QgY2hlY2tzIGlmIGluZGV4ZWREQiBpcyBzdXBwb3J0ZWQgYnkgY3VycmVudCBicm93c2VyL3NlcnZpY2Ugd29ya2VyIGNvbnRleHRcbiAqIEByZXR1cm4gdHJ1ZSBpZiBpbmRleGVkREIgaXMgc3VwcG9ydGVkIGJ5IGN1cnJlbnQgYnJvd3Nlci9zZXJ2aWNlIHdvcmtlciBjb250ZXh0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0luZGV4ZWREQkF2YWlsYWJsZSgpOiBib29sZWFuIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gdHlwZW9mIGluZGV4ZWREQiA9PT0gJ29iamVjdCc7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuLyoqXG4gKiBUaGlzIG1ldGhvZCB2YWxpZGF0ZXMgYnJvd3Nlci9zdyBjb250ZXh0IGZvciBpbmRleGVkREIgYnkgb3BlbmluZyBhIGR1bW15IGluZGV4ZWREQiBkYXRhYmFzZSBhbmQgcmVqZWN0XG4gKiBpZiBlcnJvcnMgb2NjdXIgZHVyaW5nIHRoZSBkYXRhYmFzZSBvcGVuIG9wZXJhdGlvbi5cbiAqXG4gKiBAdGhyb3dzIGV4Y2VwdGlvbiBpZiBjdXJyZW50IGJyb3dzZXIvc3cgY29udGV4dCBjYW4ndCBydW4gaWRiLm9wZW4gKGV4OiBTYWZhcmkgaWZyYW1lLCBGaXJlZm94XG4gKiBwcml2YXRlIGJyb3dzaW5nKVxuICovXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVJbmRleGVkREJPcGVuYWJsZSgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICB0cnkge1xuICAgICAgbGV0IHByZUV4aXN0OiBib29sZWFuID0gdHJ1ZTtcbiAgICAgIGNvbnN0IERCX0NIRUNLX05BTUUgPVxuICAgICAgICAndmFsaWRhdGUtYnJvd3Nlci1jb250ZXh0LWZvci1pbmRleGVkZGItYW5hbHl0aWNzLW1vZHVsZSc7XG4gICAgICBjb25zdCByZXF1ZXN0ID0gc2VsZi5pbmRleGVkREIub3BlbihEQl9DSEVDS19OQU1FKTtcbiAgICAgIHJlcXVlc3Qub25zdWNjZXNzID0gKCkgPT4ge1xuICAgICAgICByZXF1ZXN0LnJlc3VsdC5jbG9zZSgpO1xuICAgICAgICAvLyBkZWxldGUgZGF0YWJhc2Ugb25seSB3aGVuIGl0IGRvZXNuJ3QgcHJlLWV4aXN0XG4gICAgICAgIGlmICghcHJlRXhpc3QpIHtcbiAgICAgICAgICBzZWxmLmluZGV4ZWREQi5kZWxldGVEYXRhYmFzZShEQl9DSEVDS19OQU1FKTtcbiAgICAgICAgfVxuICAgICAgICByZXNvbHZlKHRydWUpO1xuICAgICAgfTtcbiAgICAgIHJlcXVlc3Qub251cGdyYWRlbmVlZGVkID0gKCkgPT4ge1xuICAgICAgICBwcmVFeGlzdCA9IGZhbHNlO1xuICAgICAgfTtcblxuICAgICAgcmVxdWVzdC5vbmVycm9yID0gKCkgPT4ge1xuICAgICAgICByZWplY3QocmVxdWVzdC5lcnJvcj8ubWVzc2FnZSB8fCAnJyk7XG4gICAgICB9O1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZWplY3QoZXJyb3IpO1xuICAgIH1cbiAgfSk7XG59XG5cbi8qKlxuICpcbiAqIFRoaXMgbWV0aG9kIGNoZWNrcyB3aGV0aGVyIGNvb2tpZSBpcyBlbmFibGVkIHdpdGhpbiBjdXJyZW50IGJyb3dzZXJcbiAqIEByZXR1cm4gdHJ1ZSBpZiBjb29raWUgaXMgZW5hYmxlZCB3aXRoaW4gY3VycmVudCBicm93c2VyXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhcmVDb29raWVzRW5hYmxlZCgpOiBib29sZWFuIHtcbiAgaWYgKHR5cGVvZiBuYXZpZ2F0b3IgPT09ICd1bmRlZmluZWQnIHx8ICFuYXZpZ2F0b3IuY29va2llRW5hYmxlZCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cbiIsICIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IFN0YW5kYXJkaXplZCBGaXJlYmFzZSBFcnJvci5cbiAqXG4gKiBVc2FnZTpcbiAqXG4gKiAgIC8vIFR5cGVzY3JpcHQgc3RyaW5nIGxpdGVyYWxzIGZvciB0eXBlLXNhZmUgY29kZXNcbiAqICAgdHlwZSBFcnIgPVxuICogICAgICd1bmtub3duJyB8XG4gKiAgICAgJ29iamVjdC1ub3QtZm91bmQnXG4gKiAgICAgO1xuICpcbiAqICAgLy8gQ2xvc3VyZSBlbnVtIGZvciB0eXBlLXNhZmUgZXJyb3IgY29kZXNcbiAqICAgLy8gYXQtZW51bSB7c3RyaW5nfVxuICogICB2YXIgRXJyID0ge1xuICogICAgIFVOS05PV046ICd1bmtub3duJyxcbiAqICAgICBPQkpFQ1RfTk9UX0ZPVU5EOiAnb2JqZWN0LW5vdC1mb3VuZCcsXG4gKiAgIH1cbiAqXG4gKiAgIGxldCBlcnJvcnM6IE1hcDxFcnIsIHN0cmluZz4gPSB7XG4gKiAgICAgJ2dlbmVyaWMtZXJyb3InOiBcIlVua25vd24gZXJyb3JcIixcbiAqICAgICAnZmlsZS1ub3QtZm91bmQnOiBcIkNvdWxkIG5vdCBmaW5kIGZpbGU6IHskZmlsZX1cIixcbiAqICAgfTtcbiAqXG4gKiAgIC8vIFR5cGUtc2FmZSBmdW5jdGlvbiAtIG11c3QgcGFzcyBhIHZhbGlkIGVycm9yIGNvZGUgYXMgcGFyYW0uXG4gKiAgIGxldCBlcnJvciA9IG5ldyBFcnJvckZhY3Rvcnk8RXJyPignc2VydmljZScsICdTZXJ2aWNlJywgZXJyb3JzKTtcbiAqXG4gKiAgIC4uLlxuICogICB0aHJvdyBlcnJvci5jcmVhdGUoRXJyLkdFTkVSSUMpO1xuICogICAuLi5cbiAqICAgdGhyb3cgZXJyb3IuY3JlYXRlKEVyci5GSUxFX05PVF9GT1VORCwgeydmaWxlJzogZmlsZU5hbWV9KTtcbiAqICAgLi4uXG4gKiAgIC8vIFNlcnZpY2U6IENvdWxkIG5vdCBmaWxlIGZpbGU6IGZvby50eHQgKHNlcnZpY2UvZmlsZS1ub3QtZm91bmQpLlxuICpcbiAqICAgY2F0Y2ggKGUpIHtcbiAqICAgICBhc3NlcnQoZS5tZXNzYWdlID09PSBcIkNvdWxkIG5vdCBmaW5kIGZpbGU6IGZvby50eHQuXCIpO1xuICogICAgIGlmICgoZSBhcyBGaXJlYmFzZUVycm9yKT8uY29kZSA9PT0gJ3NlcnZpY2UvZmlsZS1ub3QtZm91bmQnKSB7XG4gKiAgICAgICBjb25zb2xlLmxvZyhcIkNvdWxkIG5vdCByZWFkIGZpbGU6IFwiICsgZVsnZmlsZSddKTtcbiAqICAgICB9XG4gKiAgIH1cbiAqL1xuXG5leHBvcnQgdHlwZSBFcnJvck1hcDxFcnJvckNvZGUgZXh0ZW5kcyBzdHJpbmc+ID0ge1xuICByZWFkb25seSBbSyBpbiBFcnJvckNvZGVdOiBzdHJpbmc7XG59O1xuXG5jb25zdCBFUlJPUl9OQU1FID0gJ0ZpcmViYXNlRXJyb3InO1xuXG5leHBvcnQgaW50ZXJmYWNlIFN0cmluZ0xpa2Uge1xuICB0b1N0cmluZygpOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRXJyb3JEYXRhIHtcbiAgW2tleTogc3RyaW5nXTogdW5rbm93bjtcbn1cblxuLy8gQmFzZWQgb24gY29kZSBmcm9tOlxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvRXJyb3IjQ3VzdG9tX0Vycm9yX1R5cGVzXG5leHBvcnQgY2xhc3MgRmlyZWJhc2VFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgLyoqIFRoZSBjdXN0b20gbmFtZSBmb3IgYWxsIEZpcmViYXNlRXJyb3JzLiAqL1xuICByZWFkb25seSBuYW1lOiBzdHJpbmcgPSBFUlJPUl9OQU1FO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIC8qKiBUaGUgZXJyb3IgY29kZSBmb3IgdGhpcyBlcnJvci4gKi9cbiAgICByZWFkb25seSBjb2RlOiBzdHJpbmcsXG4gICAgbWVzc2FnZTogc3RyaW5nLFxuICAgIC8qKiBDdXN0b20gZGF0YSBmb3IgdGhpcyBlcnJvci4gKi9cbiAgICBwdWJsaWMgY3VzdG9tRGF0YT86IFJlY29yZDxzdHJpbmcsIHVua25vd24+XG4gICkge1xuICAgIHN1cGVyKG1lc3NhZ2UpO1xuXG4gICAgLy8gRml4IEZvciBFUzVcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vTWljcm9zb2Z0L1R5cGVTY3JpcHQtd2lraS9ibG9iL21hc3Rlci9CcmVha2luZy1DaGFuZ2VzLm1kI2V4dGVuZGluZy1idWlsdC1pbnMtbGlrZS1lcnJvci1hcnJheS1hbmQtbWFwLW1heS1uby1sb25nZXItd29ya1xuICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZih0aGlzLCBGaXJlYmFzZUVycm9yLnByb3RvdHlwZSk7XG5cbiAgICAvLyBNYWludGFpbnMgcHJvcGVyIHN0YWNrIHRyYWNlIGZvciB3aGVyZSBvdXIgZXJyb3Igd2FzIHRocm93bi5cbiAgICAvLyBPbmx5IGF2YWlsYWJsZSBvbiBWOC5cbiAgICBpZiAoRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UpIHtcbiAgICAgIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRoaXMsIEVycm9yRmFjdG9yeS5wcm90b3R5cGUuY3JlYXRlKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEVycm9yRmFjdG9yeTxcbiAgRXJyb3JDb2RlIGV4dGVuZHMgc3RyaW5nLFxuICBFcnJvclBhcmFtcyBleHRlbmRzIHsgcmVhZG9ubHkgW0sgaW4gRXJyb3JDb2RlXT86IEVycm9yRGF0YSB9ID0ge31cbj4ge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJlYWRvbmx5IHNlcnZpY2U6IHN0cmluZyxcbiAgICBwcml2YXRlIHJlYWRvbmx5IHNlcnZpY2VOYW1lOiBzdHJpbmcsXG4gICAgcHJpdmF0ZSByZWFkb25seSBlcnJvcnM6IEVycm9yTWFwPEVycm9yQ29kZT5cbiAgKSB7fVxuXG4gIGNyZWF0ZTxLIGV4dGVuZHMgRXJyb3JDb2RlPihcbiAgICBjb2RlOiBLLFxuICAgIC4uLmRhdGE6IEsgZXh0ZW5kcyBrZXlvZiBFcnJvclBhcmFtcyA/IFtFcnJvclBhcmFtc1tLXV0gOiBbXVxuICApOiBGaXJlYmFzZUVycm9yIHtcbiAgICBjb25zdCBjdXN0b21EYXRhID0gKGRhdGFbMF0gYXMgRXJyb3JEYXRhKSB8fCB7fTtcbiAgICBjb25zdCBmdWxsQ29kZSA9IGAke3RoaXMuc2VydmljZX0vJHtjb2RlfWA7XG4gICAgY29uc3QgdGVtcGxhdGUgPSB0aGlzLmVycm9yc1tjb2RlXTtcblxuICAgIGNvbnN0IG1lc3NhZ2UgPSB0ZW1wbGF0ZSA/IHJlcGxhY2VUZW1wbGF0ZSh0ZW1wbGF0ZSwgY3VzdG9tRGF0YSkgOiAnRXJyb3InO1xuICAgIC8vIFNlcnZpY2UgTmFtZTogRXJyb3IgbWVzc2FnZSAoc2VydmljZS9jb2RlKS5cbiAgICBjb25zdCBmdWxsTWVzc2FnZSA9IGAke3RoaXMuc2VydmljZU5hbWV9OiAke21lc3NhZ2V9ICgke2Z1bGxDb2RlfSkuYDtcblxuICAgIGNvbnN0IGVycm9yID0gbmV3IEZpcmViYXNlRXJyb3IoZnVsbENvZGUsIGZ1bGxNZXNzYWdlLCBjdXN0b21EYXRhKTtcblxuICAgIHJldHVybiBlcnJvcjtcbiAgfVxufVxuXG5mdW5jdGlvbiByZXBsYWNlVGVtcGxhdGUodGVtcGxhdGU6IHN0cmluZywgZGF0YTogRXJyb3JEYXRhKTogc3RyaW5nIHtcbiAgcmV0dXJuIHRlbXBsYXRlLnJlcGxhY2UoUEFUVEVSTiwgKF8sIGtleSkgPT4ge1xuICAgIGNvbnN0IHZhbHVlID0gZGF0YVtrZXldO1xuICAgIHJldHVybiB2YWx1ZSAhPSBudWxsID8gU3RyaW5nKHZhbHVlKSA6IGA8JHtrZXl9Pz5gO1xuICB9KTtcbn1cblxuY29uc3QgUEFUVEVSTiA9IC9cXHtcXCQoW159XSspfS9nO1xuIiwgIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTENcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8qKlxuICogRXZhbHVhdGVzIGEgSlNPTiBzdHJpbmcgaW50byBhIGphdmFzY3JpcHQgb2JqZWN0LlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHIgQSBzdHJpbmcgY29udGFpbmluZyBKU09OLlxuICogQHJldHVybiB7Kn0gVGhlIGphdmFzY3JpcHQgb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgc3BlY2lmaWVkIEpTT04uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBqc29uRXZhbChzdHI6IHN0cmluZyk6IHVua25vd24ge1xuICByZXR1cm4gSlNPTi5wYXJzZShzdHIpO1xufVxuXG4vKipcbiAqIFJldHVybnMgSlNPTiByZXByZXNlbnRpbmcgYSBqYXZhc2NyaXB0IG9iamVjdC5cbiAqIEBwYXJhbSB7Kn0gZGF0YSBKYXZhc2NyaXB0IG9iamVjdCB0byBiZSBzdHJpbmdpZmllZC5cbiAqIEByZXR1cm4ge3N0cmluZ30gVGhlIEpTT04gY29udGVudHMgb2YgdGhlIG9iamVjdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHN0cmluZ2lmeShkYXRhOiB1bmtub3duKTogc3RyaW5nIHtcbiAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGRhdGEpO1xufVxuIiwgIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTENcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IGJhc2U2NERlY29kZSB9IGZyb20gJy4vY3J5cHQnO1xuaW1wb3J0IHsganNvbkV2YWwgfSBmcm9tICcuL2pzb24nO1xuXG5pbnRlcmZhY2UgQ2xhaW1zIHtcbiAgW2tleTogc3RyaW5nXToge307XG59XG5cbmludGVyZmFjZSBEZWNvZGVkVG9rZW4ge1xuICBoZWFkZXI6IG9iamVjdDtcbiAgY2xhaW1zOiBDbGFpbXM7XG4gIGRhdGE6IG9iamVjdDtcbiAgc2lnbmF0dXJlOiBzdHJpbmc7XG59XG5cbi8qKlxuICogRGVjb2RlcyBhIEZpcmViYXNlIGF1dGguIHRva2VuIGludG8gY29uc3RpdHVlbnQgcGFydHMuXG4gKlxuICogTm90ZXM6XG4gKiAtIE1heSByZXR1cm4gd2l0aCBpbnZhbGlkIC8gaW5jb21wbGV0ZSBjbGFpbXMgaWYgdGhlcmUncyBubyBuYXRpdmUgYmFzZTY0IGRlY29kaW5nIHN1cHBvcnQuXG4gKiAtIERvZXNuJ3QgY2hlY2sgaWYgdGhlIHRva2VuIGlzIGFjdHVhbGx5IHZhbGlkLlxuICovXG5leHBvcnQgY29uc3QgZGVjb2RlID0gZnVuY3Rpb24gKHRva2VuOiBzdHJpbmcpOiBEZWNvZGVkVG9rZW4ge1xuICBsZXQgaGVhZGVyID0ge30sXG4gICAgY2xhaW1zOiBDbGFpbXMgPSB7fSxcbiAgICBkYXRhID0ge30sXG4gICAgc2lnbmF0dXJlID0gJyc7XG5cbiAgdHJ5IHtcbiAgICBjb25zdCBwYXJ0cyA9IHRva2VuLnNwbGl0KCcuJyk7XG4gICAgaGVhZGVyID0ganNvbkV2YWwoYmFzZTY0RGVjb2RlKHBhcnRzWzBdKSB8fCAnJykgYXMgb2JqZWN0O1xuICAgIGNsYWltcyA9IGpzb25FdmFsKGJhc2U2NERlY29kZShwYXJ0c1sxXSkgfHwgJycpIGFzIENsYWltcztcbiAgICBzaWduYXR1cmUgPSBwYXJ0c1syXTtcbiAgICBkYXRhID0gY2xhaW1zWydkJ10gfHwge307XG4gICAgZGVsZXRlIGNsYWltc1snZCddO1xuICB9IGNhdGNoIChlKSB7fVxuXG4gIHJldHVybiB7XG4gICAgaGVhZGVyLFxuICAgIGNsYWltcyxcbiAgICBkYXRhLFxuICAgIHNpZ25hdHVyZVxuICB9O1xufTtcblxuaW50ZXJmYWNlIERlY29kZWRUb2tlbiB7XG4gIGhlYWRlcjogb2JqZWN0O1xuICBjbGFpbXM6IENsYWltcztcbiAgZGF0YTogb2JqZWN0O1xuICBzaWduYXR1cmU6IHN0cmluZztcbn1cblxuLyoqXG4gKiBEZWNvZGVzIGEgRmlyZWJhc2UgYXV0aC4gdG9rZW4gYW5kIGNoZWNrcyB0aGUgdmFsaWRpdHkgb2YgaXRzIHRpbWUtYmFzZWQgY2xhaW1zLiBXaWxsIHJldHVybiB0cnVlIGlmIHRoZVxuICogdG9rZW4gaXMgd2l0aGluIHRoZSB0aW1lIHdpbmRvdyBhdXRob3JpemVkIGJ5IHRoZSAnbmJmJyAobm90LWJlZm9yZSkgYW5kICdpYXQnIChpc3N1ZWQtYXQpIGNsYWltcy5cbiAqXG4gKiBOb3RlczpcbiAqIC0gTWF5IHJldHVybiBhIGZhbHNlIG5lZ2F0aXZlIGlmIHRoZXJlJ3Mgbm8gbmF0aXZlIGJhc2U2NCBkZWNvZGluZyBzdXBwb3J0LlxuICogLSBEb2Vzbid0IGNoZWNrIGlmIHRoZSB0b2tlbiBpcyBhY3R1YWxseSB2YWxpZC5cbiAqL1xuZXhwb3J0IGNvbnN0IGlzVmFsaWRUaW1lc3RhbXAgPSBmdW5jdGlvbiAodG9rZW46IHN0cmluZyk6IGJvb2xlYW4ge1xuICBjb25zdCBjbGFpbXM6IENsYWltcyA9IGRlY29kZSh0b2tlbikuY2xhaW1zO1xuICBjb25zdCBub3c6IG51bWJlciA9IE1hdGguZmxvb3IobmV3IERhdGUoKS5nZXRUaW1lKCkgLyAxMDAwKTtcbiAgbGV0IHZhbGlkU2luY2U6IG51bWJlciA9IDAsXG4gICAgdmFsaWRVbnRpbDogbnVtYmVyID0gMDtcblxuICBpZiAodHlwZW9mIGNsYWltcyA9PT0gJ29iamVjdCcpIHtcbiAgICBpZiAoY2xhaW1zLmhhc093blByb3BlcnR5KCduYmYnKSkge1xuICAgICAgdmFsaWRTaW5jZSA9IGNsYWltc1snbmJmJ10gYXMgbnVtYmVyO1xuICAgIH0gZWxzZSBpZiAoY2xhaW1zLmhhc093blByb3BlcnR5KCdpYXQnKSkge1xuICAgICAgdmFsaWRTaW5jZSA9IGNsYWltc1snaWF0J10gYXMgbnVtYmVyO1xuICAgIH1cblxuICAgIGlmIChjbGFpbXMuaGFzT3duUHJvcGVydHkoJ2V4cCcpKSB7XG4gICAgICB2YWxpZFVudGlsID0gY2xhaW1zWydleHAnXSBhcyBudW1iZXI7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHRva2VuIHdpbGwgZXhwaXJlIGFmdGVyIDI0aCBieSBkZWZhdWx0XG4gICAgICB2YWxpZFVudGlsID0gdmFsaWRTaW5jZSArIDg2NDAwO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiAoXG4gICAgISFub3cgJiZcbiAgICAhIXZhbGlkU2luY2UgJiZcbiAgICAhIXZhbGlkVW50aWwgJiZcbiAgICBub3cgPj0gdmFsaWRTaW5jZSAmJlxuICAgIG5vdyA8PSB2YWxpZFVudGlsXG4gICk7XG59O1xuXG4vKipcbiAqIERlY29kZXMgYSBGaXJlYmFzZSBhdXRoLiB0b2tlbiBhbmQgcmV0dXJucyBpdHMgaXNzdWVkIGF0IHRpbWUgaWYgdmFsaWQsIG51bGwgb3RoZXJ3aXNlLlxuICpcbiAqIE5vdGVzOlxuICogLSBNYXkgcmV0dXJuIG51bGwgaWYgdGhlcmUncyBubyBuYXRpdmUgYmFzZTY0IGRlY29kaW5nIHN1cHBvcnQuXG4gKiAtIERvZXNuJ3QgY2hlY2sgaWYgdGhlIHRva2VuIGlzIGFjdHVhbGx5IHZhbGlkLlxuICovXG5leHBvcnQgY29uc3QgaXNzdWVkQXRUaW1lID0gZnVuY3Rpb24gKHRva2VuOiBzdHJpbmcpOiBudW1iZXIgfCBudWxsIHtcbiAgY29uc3QgY2xhaW1zOiBDbGFpbXMgPSBkZWNvZGUodG9rZW4pLmNsYWltcztcbiAgaWYgKHR5cGVvZiBjbGFpbXMgPT09ICdvYmplY3QnICYmIGNsYWltcy5oYXNPd25Qcm9wZXJ0eSgnaWF0JykpIHtcbiAgICByZXR1cm4gY2xhaW1zWydpYXQnXSBhcyBudW1iZXI7XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59O1xuXG4vKipcbiAqIERlY29kZXMgYSBGaXJlYmFzZSBhdXRoLiB0b2tlbiBhbmQgY2hlY2tzIHRoZSB2YWxpZGl0eSBvZiBpdHMgZm9ybWF0LiBFeHBlY3RzIGEgdmFsaWQgaXNzdWVkLWF0IHRpbWUuXG4gKlxuICogTm90ZXM6XG4gKiAtIE1heSByZXR1cm4gYSBmYWxzZSBuZWdhdGl2ZSBpZiB0aGVyZSdzIG5vIG5hdGl2ZSBiYXNlNjQgZGVjb2Rpbmcgc3VwcG9ydC5cbiAqIC0gRG9lc24ndCBjaGVjayBpZiB0aGUgdG9rZW4gaXMgYWN0dWFsbHkgdmFsaWQuXG4gKi9cbmV4cG9ydCBjb25zdCBpc1ZhbGlkRm9ybWF0ID0gZnVuY3Rpb24gKHRva2VuOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgY29uc3QgZGVjb2RlZCA9IGRlY29kZSh0b2tlbiksXG4gICAgY2xhaW1zID0gZGVjb2RlZC5jbGFpbXM7XG5cbiAgcmV0dXJuICEhY2xhaW1zICYmIHR5cGVvZiBjbGFpbXMgPT09ICdvYmplY3QnICYmIGNsYWltcy5oYXNPd25Qcm9wZXJ0eSgnaWF0Jyk7XG59O1xuXG4vKipcbiAqIEF0dGVtcHRzIHRvIHBlZXIgaW50byBhbiBhdXRoIHRva2VuIGFuZCBkZXRlcm1pbmUgaWYgaXQncyBhbiBhZG1pbiBhdXRoIHRva2VuIGJ5IGxvb2tpbmcgYXQgdGhlIGNsYWltcyBwb3J0aW9uLlxuICpcbiAqIE5vdGVzOlxuICogLSBNYXkgcmV0dXJuIGEgZmFsc2UgbmVnYXRpdmUgaWYgdGhlcmUncyBubyBuYXRpdmUgYmFzZTY0IGRlY29kaW5nIHN1cHBvcnQuXG4gKiAtIERvZXNuJ3QgY2hlY2sgaWYgdGhlIHRva2VuIGlzIGFjdHVhbGx5IHZhbGlkLlxuICovXG5leHBvcnQgY29uc3QgaXNBZG1pbiA9IGZ1bmN0aW9uICh0b2tlbjogc3RyaW5nKTogYm9vbGVhbiB7XG4gIGNvbnN0IGNsYWltczogQ2xhaW1zID0gZGVjb2RlKHRva2VuKS5jbGFpbXM7XG4gIHJldHVybiB0eXBlb2YgY2xhaW1zID09PSAnb2JqZWN0JyAmJiBjbGFpbXNbJ2FkbWluJ10gPT09IHRydWU7XG59O1xuIiwgIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTENcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBjb250YWluczxUIGV4dGVuZHMgb2JqZWN0PihvYmo6IFQsIGtleTogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2FmZUdldDxUIGV4dGVuZHMgb2JqZWN0LCBLIGV4dGVuZHMga2V5b2YgVD4oXG4gIG9iajogVCxcbiAga2V5OiBLXG4pOiBUW0tdIHwgdW5kZWZpbmVkIHtcbiAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHtcbiAgICByZXR1cm4gb2JqW2tleV07XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNFbXB0eShvYmo6IG9iamVjdCk6IG9iaiBpcyB7fSB7XG4gIGZvciAoY29uc3Qga2V5IGluIG9iaikge1xuICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFwPEsgZXh0ZW5kcyBzdHJpbmcsIFYsIFU+KFxuICBvYmo6IHsgW2tleSBpbiBLXTogViB9LFxuICBmbjogKHZhbHVlOiBWLCBrZXk6IEssIG9iajogeyBba2V5IGluIEtdOiBWIH0pID0+IFUsXG4gIGNvbnRleHRPYmo/OiB1bmtub3duXG4pOiB7IFtrZXkgaW4gS106IFUgfSB7XG4gIGNvbnN0IHJlczogUGFydGlhbDx7IFtrZXkgaW4gS106IFUgfT4gPSB7fTtcbiAgZm9yIChjb25zdCBrZXkgaW4gb2JqKSB7XG4gICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHtcbiAgICAgIHJlc1trZXldID0gZm4uY2FsbChjb250ZXh0T2JqLCBvYmpba2V5XSwga2V5LCBvYmopO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzIGFzIHsgW2tleSBpbiBLXTogVSB9O1xufVxuXG4vKipcbiAqIERlZXAgZXF1YWwgdHdvIG9iamVjdHMuIFN1cHBvcnQgQXJyYXlzIGFuZCBPYmplY3RzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVlcEVxdWFsKGE6IG9iamVjdCwgYjogb2JqZWN0KTogYm9vbGVhbiB7XG4gIGlmIChhID09PSBiKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBjb25zdCBhS2V5cyA9IE9iamVjdC5rZXlzKGEpO1xuICBjb25zdCBiS2V5cyA9IE9iamVjdC5rZXlzKGIpO1xuICBmb3IgKGNvbnN0IGsgb2YgYUtleXMpIHtcbiAgICBpZiAoIWJLZXlzLmluY2x1ZGVzKGspKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgYVByb3AgPSAoYSBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPilba107XG4gICAgY29uc3QgYlByb3AgPSAoYiBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPilba107XG4gICAgaWYgKGlzT2JqZWN0KGFQcm9wKSAmJiBpc09iamVjdChiUHJvcCkpIHtcbiAgICAgIGlmICghZGVlcEVxdWFsKGFQcm9wLCBiUHJvcCkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoYVByb3AgIT09IGJQcm9wKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgZm9yIChjb25zdCBrIG9mIGJLZXlzKSB7XG4gICAgaWYgKCFhS2V5cy5pbmNsdWRlcyhrKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gaXNPYmplY3QodGhpbmc6IHVua25vd24pOiB0aGluZyBpcyBvYmplY3Qge1xuICByZXR1cm4gdGhpbmcgIT09IG51bGwgJiYgdHlwZW9mIHRoaW5nID09PSAnb2JqZWN0Jztcbn1cbiIsICIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMiBHb29nbGUgTExDXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBEZWZlcnJlZCB9IGZyb20gJy4vZGVmZXJyZWQnO1xuXG4vKipcbiAqIFJlamVjdHMgaWYgdGhlIGdpdmVuIHByb21pc2UgZG9lc24ndCByZXNvbHZlIGluIHRpbWVJbk1TIG1pbGxpc2Vjb25kcy5cbiAqIEBpbnRlcm5hbFxuICovXG5leHBvcnQgZnVuY3Rpb24gcHJvbWlzZVdpdGhUaW1lb3V0PFQ+KFxuICBwcm9taXNlOiBQcm9taXNlPFQ+LFxuICB0aW1lSW5NUyA9IDIwMDBcbik6IFByb21pc2U8VD4ge1xuICBjb25zdCBkZWZlcnJlZFByb21pc2UgPSBuZXcgRGVmZXJyZWQ8VD4oKTtcbiAgc2V0VGltZW91dCgoKSA9PiBkZWZlcnJlZFByb21pc2UucmVqZWN0KCd0aW1lb3V0IScpLCB0aW1lSW5NUyk7XG4gIHByb21pc2UudGhlbihkZWZlcnJlZFByb21pc2UucmVzb2x2ZSwgZGVmZXJyZWRQcm9taXNlLnJlamVjdCk7XG4gIHJldHVybiBkZWZlcnJlZFByb21pc2UucHJvbWlzZTtcbn1cbiIsICIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4vKipcbiAqIFJldHVybnMgYSBxdWVyeXN0cmluZy1mb3JtYXR0ZWQgc3RyaW5nIChlLmcuICZhcmc9dmFsJmFyZzI9dmFsMikgZnJvbSBhXG4gKiBwYXJhbXMgb2JqZWN0IChlLmcuIHthcmc6ICd2YWwnLCBhcmcyOiAndmFsMid9KVxuICogTm90ZTogWW91IG11c3QgcHJlcGVuZCBpdCB3aXRoID8gd2hlbiBhZGRpbmcgaXQgdG8gYSBVUkwuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBxdWVyeXN0cmluZyhxdWVyeXN0cmluZ1BhcmFtczoge1xuICBba2V5OiBzdHJpbmddOiBzdHJpbmcgfCBudW1iZXI7XG59KTogc3RyaW5nIHtcbiAgY29uc3QgcGFyYW1zID0gW107XG4gIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKHF1ZXJ5c3RyaW5nUGFyYW1zKSkge1xuICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgdmFsdWUuZm9yRWFjaChhcnJheVZhbCA9PiB7XG4gICAgICAgIHBhcmFtcy5wdXNoKFxuICAgICAgICAgIGVuY29kZVVSSUNvbXBvbmVudChrZXkpICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KGFycmF5VmFsKVxuICAgICAgICApO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhcmFtcy5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChrZXkpICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBwYXJhbXMubGVuZ3RoID8gJyYnICsgcGFyYW1zLmpvaW4oJyYnKSA6ICcnO1xufVxuXG4vKipcbiAqIERlY29kZXMgYSBxdWVyeXN0cmluZyAoZS5nLiA/YXJnPXZhbCZhcmcyPXZhbDIpIGludG8gYSBwYXJhbXMgb2JqZWN0XG4gKiAoZS5nLiB7YXJnOiAndmFsJywgYXJnMjogJ3ZhbDInfSlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHF1ZXJ5c3RyaW5nRGVjb2RlKHF1ZXJ5c3RyaW5nOiBzdHJpbmcpOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IHtcbiAgY29uc3Qgb2JqOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG4gIGNvbnN0IHRva2VucyA9IHF1ZXJ5c3RyaW5nLnJlcGxhY2UoL15cXD8vLCAnJykuc3BsaXQoJyYnKTtcblxuICB0b2tlbnMuZm9yRWFjaCh0b2tlbiA9PiB7XG4gICAgaWYgKHRva2VuKSB7XG4gICAgICBjb25zdCBba2V5LCB2YWx1ZV0gPSB0b2tlbi5zcGxpdCgnPScpO1xuICAgICAgb2JqW2RlY29kZVVSSUNvbXBvbmVudChrZXkpXSA9IGRlY29kZVVSSUNvbXBvbmVudCh2YWx1ZSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIG9iajtcbn1cblxuLyoqXG4gKiBFeHRyYWN0IHRoZSBxdWVyeSBzdHJpbmcgcGFydCBvZiBhIFVSTCwgaW5jbHVkaW5nIHRoZSBsZWFkaW5nIHF1ZXN0aW9uIG1hcmsgKGlmIHByZXNlbnQpLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZXh0cmFjdFF1ZXJ5c3RyaW5nKHVybDogc3RyaW5nKTogc3RyaW5nIHtcbiAgY29uc3QgcXVlcnlTdGFydCA9IHVybC5pbmRleE9mKCc/Jyk7XG4gIGlmICghcXVlcnlTdGFydCkge1xuICAgIHJldHVybiAnJztcbiAgfVxuICBjb25zdCBmcmFnbWVudFN0YXJ0ID0gdXJsLmluZGV4T2YoJyMnLCBxdWVyeVN0YXJ0KTtcbiAgcmV0dXJuIHVybC5zdWJzdHJpbmcoXG4gICAgcXVlcnlTdGFydCxcbiAgICBmcmFnbWVudFN0YXJ0ID4gMCA/IGZyYWdtZW50U3RhcnQgOiB1bmRlZmluZWRcbiAgKTtcbn1cbiIsICIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4vKipcbiAqIEBmaWxlb3ZlcnZpZXcgU0hBLTEgY3J5cHRvZ3JhcGhpYyBoYXNoLlxuICogVmFyaWFibGUgbmFtZXMgZm9sbG93IHRoZSBub3RhdGlvbiBpbiBGSVBTIFBVQiAxODAtMzpcbiAqIGh0dHA6Ly9jc3JjLm5pc3QuZ292L3B1YmxpY2F0aW9ucy9maXBzL2ZpcHMxODAtMy9maXBzMTgwLTNfZmluYWwucGRmLlxuICpcbiAqIFVzYWdlOlxuICogICB2YXIgc2hhMSA9IG5ldyBzaGExKCk7XG4gKiAgIHNoYTEudXBkYXRlKGJ5dGVzKTtcbiAqICAgdmFyIGhhc2ggPSBzaGExLmRpZ2VzdCgpO1xuICpcbiAqIFBlcmZvcm1hbmNlOlxuICogICBDaHJvbWUgMjM6ICAgfjQwMCBNYml0L3NcbiAqICAgRmlyZWZveCAxNjogIH4yNTAgTWJpdC9zXG4gKlxuICovXG5cbi8qKlxuICogU0hBLTEgY3J5cHRvZ3JhcGhpYyBoYXNoIGNvbnN0cnVjdG9yLlxuICpcbiAqIFRoZSBwcm9wZXJ0aWVzIGRlY2xhcmVkIGhlcmUgYXJlIGRpc2N1c3NlZCBpbiB0aGUgYWJvdmUgYWxnb3JpdGhtIGRvY3VtZW50LlxuICogQGNvbnN0cnVjdG9yXG4gKiBAZmluYWxcbiAqIEBzdHJ1Y3RcbiAqL1xuZXhwb3J0IGNsYXNzIFNoYTEge1xuICAvKipcbiAgICogSG9sZHMgdGhlIHByZXZpb3VzIHZhbHVlcyBvZiBhY2N1bXVsYXRlZCB2YXJpYWJsZXMgYS1lIGluIHRoZSBjb21wcmVzc19cbiAgICogZnVuY3Rpb24uXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBwcml2YXRlIGNoYWluXzogbnVtYmVyW10gPSBbXTtcblxuICAvKipcbiAgICogQSBidWZmZXIgaG9sZGluZyB0aGUgcGFydGlhbGx5IGNvbXB1dGVkIGhhc2ggcmVzdWx0LlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcHJpdmF0ZSBidWZfOiBudW1iZXJbXSA9IFtdO1xuXG4gIC8qKlxuICAgKiBBbiBhcnJheSBvZiA4MCBieXRlcywgZWFjaCBhIHBhcnQgb2YgdGhlIG1lc3NhZ2UgdG8gYmUgaGFzaGVkLiAgUmVmZXJyZWQgdG9cbiAgICogYXMgdGhlIG1lc3NhZ2Ugc2NoZWR1bGUgaW4gdGhlIGRvY3MuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBwcml2YXRlIFdfOiBudW1iZXJbXSA9IFtdO1xuXG4gIC8qKlxuICAgKiBDb250YWlucyBkYXRhIG5lZWRlZCB0byBwYWQgbWVzc2FnZXMgbGVzcyB0aGFuIDY0IGJ5dGVzLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcHJpdmF0ZSBwYWRfOiBudW1iZXJbXSA9IFtdO1xuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZSB7bnVtYmVyfVxuICAgKi9cbiAgcHJpdmF0ZSBpbmJ1Zl86IG51bWJlciA9IDA7XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlIHtudW1iZXJ9XG4gICAqL1xuICBwcml2YXRlIHRvdGFsXzogbnVtYmVyID0gMDtcblxuICBibG9ja1NpemU6IG51bWJlcjtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmJsb2NrU2l6ZSA9IDUxMiAvIDg7XG5cbiAgICB0aGlzLnBhZF9bMF0gPSAxMjg7XG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCB0aGlzLmJsb2NrU2l6ZTsgKytpKSB7XG4gICAgICB0aGlzLnBhZF9baV0gPSAwO1xuICAgIH1cblxuICAgIHRoaXMucmVzZXQoKTtcbiAgfVxuXG4gIHJlc2V0KCk6IHZvaWQge1xuICAgIHRoaXMuY2hhaW5fWzBdID0gMHg2NzQ1MjMwMTtcbiAgICB0aGlzLmNoYWluX1sxXSA9IDB4ZWZjZGFiODk7XG4gICAgdGhpcy5jaGFpbl9bMl0gPSAweDk4YmFkY2ZlO1xuICAgIHRoaXMuY2hhaW5fWzNdID0gMHgxMDMyNTQ3NjtcbiAgICB0aGlzLmNoYWluX1s0XSA9IDB4YzNkMmUxZjA7XG5cbiAgICB0aGlzLmluYnVmXyA9IDA7XG4gICAgdGhpcy50b3RhbF8gPSAwO1xuICB9XG5cbiAgLyoqXG4gICAqIEludGVybmFsIGNvbXByZXNzIGhlbHBlciBmdW5jdGlvbi5cbiAgICogQHBhcmFtIGJ1ZiBCbG9jayB0byBjb21wcmVzcy5cbiAgICogQHBhcmFtIG9mZnNldCBPZmZzZXQgb2YgdGhlIGJsb2NrIGluIHRoZSBidWZmZXIuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBjb21wcmVzc18oYnVmOiBudW1iZXJbXSB8IFVpbnQ4QXJyYXkgfCBzdHJpbmcsIG9mZnNldD86IG51bWJlcik6IHZvaWQge1xuICAgIGlmICghb2Zmc2V0KSB7XG4gICAgICBvZmZzZXQgPSAwO1xuICAgIH1cblxuICAgIGNvbnN0IFcgPSB0aGlzLldfO1xuXG4gICAgLy8gZ2V0IDE2IGJpZyBlbmRpYW4gd29yZHNcbiAgICBpZiAodHlwZW9mIGJ1ZiA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTY7IGkrKykge1xuICAgICAgICAvLyBUT0RPKHVzZXIpOiBbYnVnIDgxNDAxMjJdIFJlY2VudCB2ZXJzaW9ucyBvZiBTYWZhcmkgZm9yIE1hYyBPUyBhbmQgaU9TXG4gICAgICAgIC8vIGhhdmUgYSBidWcgdGhhdCB0dXJucyB0aGUgcG9zdC1pbmNyZW1lbnQgKysgb3BlcmF0b3IgaW50byBwcmUtaW5jcmVtZW50XG4gICAgICAgIC8vIGR1cmluZyBKSVQgY29tcGlsYXRpb24uICBXZSBoYXZlIGNvZGUgdGhhdCBkZXBlbmRzIGhlYXZpbHkgb24gU0hBLTEgZm9yXG4gICAgICAgIC8vIGNvcnJlY3RuZXNzIGFuZCB3aGljaCBpcyBhZmZlY3RlZCBieSB0aGlzIGJ1Zywgc28gSSd2ZSByZW1vdmVkIGFsbCB1c2VzXG4gICAgICAgIC8vIG9mIHBvc3QtaW5jcmVtZW50ICsrIGluIHdoaWNoIHRoZSByZXN1bHQgdmFsdWUgaXMgdXNlZC4gIFdlIGNhbiByZXZlcnRcbiAgICAgICAgLy8gdGhpcyBjaGFuZ2Ugb25jZSB0aGUgU2FmYXJpIGJ1Z1xuICAgICAgICAvLyAoaHR0cHM6Ly9idWdzLndlYmtpdC5vcmcvc2hvd19idWcuY2dpP2lkPTEwOTAzNikgaGFzIGJlZW4gZml4ZWQgYW5kXG4gICAgICAgIC8vIG1vc3QgY2xpZW50cyBoYXZlIGJlZW4gdXBkYXRlZC5cbiAgICAgICAgV1tpXSA9XG4gICAgICAgICAgKGJ1Zi5jaGFyQ29kZUF0KG9mZnNldCkgPDwgMjQpIHxcbiAgICAgICAgICAoYnVmLmNoYXJDb2RlQXQob2Zmc2V0ICsgMSkgPDwgMTYpIHxcbiAgICAgICAgICAoYnVmLmNoYXJDb2RlQXQob2Zmc2V0ICsgMikgPDwgOCkgfFxuICAgICAgICAgIGJ1Zi5jaGFyQ29kZUF0KG9mZnNldCArIDMpO1xuICAgICAgICBvZmZzZXQgKz0gNDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxNjsgaSsrKSB7XG4gICAgICAgIFdbaV0gPVxuICAgICAgICAgIChidWZbb2Zmc2V0XSA8PCAyNCkgfFxuICAgICAgICAgIChidWZbb2Zmc2V0ICsgMV0gPDwgMTYpIHxcbiAgICAgICAgICAoYnVmW29mZnNldCArIDJdIDw8IDgpIHxcbiAgICAgICAgICBidWZbb2Zmc2V0ICsgM107XG4gICAgICAgIG9mZnNldCArPSA0O1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGV4cGFuZCB0byA4MCB3b3Jkc1xuICAgIGZvciAobGV0IGkgPSAxNjsgaSA8IDgwOyBpKyspIHtcbiAgICAgIGNvbnN0IHQgPSBXW2kgLSAzXSBeIFdbaSAtIDhdIF4gV1tpIC0gMTRdIF4gV1tpIC0gMTZdO1xuICAgICAgV1tpXSA9ICgodCA8PCAxKSB8ICh0ID4+PiAzMSkpICYgMHhmZmZmZmZmZjtcbiAgICB9XG5cbiAgICBsZXQgYSA9IHRoaXMuY2hhaW5fWzBdO1xuICAgIGxldCBiID0gdGhpcy5jaGFpbl9bMV07XG4gICAgbGV0IGMgPSB0aGlzLmNoYWluX1syXTtcbiAgICBsZXQgZCA9IHRoaXMuY2hhaW5fWzNdO1xuICAgIGxldCBlID0gdGhpcy5jaGFpbl9bNF07XG4gICAgbGV0IGYsIGs7XG5cbiAgICAvLyBUT0RPKHVzZXIpOiBUcnkgdG8gdW5yb2xsIHRoaXMgbG9vcCB0byBzcGVlZCB1cCB0aGUgY29tcHV0YXRpb24uXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA4MDsgaSsrKSB7XG4gICAgICBpZiAoaSA8IDQwKSB7XG4gICAgICAgIGlmIChpIDwgMjApIHtcbiAgICAgICAgICBmID0gZCBeIChiICYgKGMgXiBkKSk7XG4gICAgICAgICAgayA9IDB4NWE4Mjc5OTk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZiA9IGIgXiBjIF4gZDtcbiAgICAgICAgICBrID0gMHg2ZWQ5ZWJhMTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGkgPCA2MCkge1xuICAgICAgICAgIGYgPSAoYiAmIGMpIHwgKGQgJiAoYiB8IGMpKTtcbiAgICAgICAgICBrID0gMHg4ZjFiYmNkYztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmID0gYiBeIGMgXiBkO1xuICAgICAgICAgIGsgPSAweGNhNjJjMWQ2O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHQgPSAoKChhIDw8IDUpIHwgKGEgPj4+IDI3KSkgKyBmICsgZSArIGsgKyBXW2ldKSAmIDB4ZmZmZmZmZmY7XG4gICAgICBlID0gZDtcbiAgICAgIGQgPSBjO1xuICAgICAgYyA9ICgoYiA8PCAzMCkgfCAoYiA+Pj4gMikpICYgMHhmZmZmZmZmZjtcbiAgICAgIGIgPSBhO1xuICAgICAgYSA9IHQ7XG4gICAgfVxuXG4gICAgdGhpcy5jaGFpbl9bMF0gPSAodGhpcy5jaGFpbl9bMF0gKyBhKSAmIDB4ZmZmZmZmZmY7XG4gICAgdGhpcy5jaGFpbl9bMV0gPSAodGhpcy5jaGFpbl9bMV0gKyBiKSAmIDB4ZmZmZmZmZmY7XG4gICAgdGhpcy5jaGFpbl9bMl0gPSAodGhpcy5jaGFpbl9bMl0gKyBjKSAmIDB4ZmZmZmZmZmY7XG4gICAgdGhpcy5jaGFpbl9bM10gPSAodGhpcy5jaGFpbl9bM10gKyBkKSAmIDB4ZmZmZmZmZmY7XG4gICAgdGhpcy5jaGFpbl9bNF0gPSAodGhpcy5jaGFpbl9bNF0gKyBlKSAmIDB4ZmZmZmZmZmY7XG4gIH1cblxuICB1cGRhdGUoYnl0ZXM/OiBudW1iZXJbXSB8IFVpbnQ4QXJyYXkgfCBzdHJpbmcsIGxlbmd0aD86IG51bWJlcik6IHZvaWQge1xuICAgIC8vIFRPRE8oam9obmxlbnopOiB0aWdodGVuIHRoZSBmdW5jdGlvbiBzaWduYXR1cmUgYW5kIHJlbW92ZSB0aGlzIGNoZWNrXG4gICAgaWYgKGJ5dGVzID09IG51bGwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAobGVuZ3RoID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGxlbmd0aCA9IGJ5dGVzLmxlbmd0aDtcbiAgICB9XG5cbiAgICBjb25zdCBsZW5ndGhNaW51c0Jsb2NrID0gbGVuZ3RoIC0gdGhpcy5ibG9ja1NpemU7XG4gICAgbGV0IG4gPSAwO1xuICAgIC8vIFVzaW5nIGxvY2FsIGluc3RlYWQgb2YgbWVtYmVyIHZhcmlhYmxlcyBnaXZlcyB+NSUgc3BlZWR1cCBvbiBGaXJlZm94IDE2LlxuICAgIGNvbnN0IGJ1ZiA9IHRoaXMuYnVmXztcbiAgICBsZXQgaW5idWYgPSB0aGlzLmluYnVmXztcblxuICAgIC8vIFRoZSBvdXRlciB3aGlsZSBsb29wIHNob3VsZCBleGVjdXRlIGF0IG1vc3QgdHdpY2UuXG4gICAgd2hpbGUgKG4gPCBsZW5ndGgpIHtcbiAgICAgIC8vIFdoZW4gd2UgaGF2ZSBubyBkYXRhIGluIHRoZSBibG9jayB0byB0b3AgdXAsIHdlIGNhbiBkaXJlY3RseSBwcm9jZXNzIHRoZVxuICAgICAgLy8gaW5wdXQgYnVmZmVyIChhc3N1bWluZyBpdCBjb250YWlucyBzdWZmaWNpZW50IGRhdGEpLiBUaGlzIGdpdmVzIH4yNSVcbiAgICAgIC8vIHNwZWVkdXAgb24gQ2hyb21lIDIzIGFuZCB+MTUlIHNwZWVkdXAgb24gRmlyZWZveCAxNiwgYnV0IHJlcXVpcmVzIHRoYXRcbiAgICAgIC8vIHRoZSBkYXRhIGlzIHByb3ZpZGVkIGluIGxhcmdlIGNodW5rcyAob3IgaW4gbXVsdGlwbGVzIG9mIDY0IGJ5dGVzKS5cbiAgICAgIGlmIChpbmJ1ZiA9PT0gMCkge1xuICAgICAgICB3aGlsZSAobiA8PSBsZW5ndGhNaW51c0Jsb2NrKSB7XG4gICAgICAgICAgdGhpcy5jb21wcmVzc18oYnl0ZXMsIG4pO1xuICAgICAgICAgIG4gKz0gdGhpcy5ibG9ja1NpemU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBieXRlcyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgd2hpbGUgKG4gPCBsZW5ndGgpIHtcbiAgICAgICAgICBidWZbaW5idWZdID0gYnl0ZXMuY2hhckNvZGVBdChuKTtcbiAgICAgICAgICArK2luYnVmO1xuICAgICAgICAgICsrbjtcbiAgICAgICAgICBpZiAoaW5idWYgPT09IHRoaXMuYmxvY2tTaXplKSB7XG4gICAgICAgICAgICB0aGlzLmNvbXByZXNzXyhidWYpO1xuICAgICAgICAgICAgaW5idWYgPSAwO1xuICAgICAgICAgICAgLy8gSnVtcCB0byB0aGUgb3V0ZXIgbG9vcCBzbyB3ZSB1c2UgdGhlIGZ1bGwtYmxvY2sgb3B0aW1pemF0aW9uLlxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3aGlsZSAobiA8IGxlbmd0aCkge1xuICAgICAgICAgIGJ1ZltpbmJ1Zl0gPSBieXRlc1tuXTtcbiAgICAgICAgICArK2luYnVmO1xuICAgICAgICAgICsrbjtcbiAgICAgICAgICBpZiAoaW5idWYgPT09IHRoaXMuYmxvY2tTaXplKSB7XG4gICAgICAgICAgICB0aGlzLmNvbXByZXNzXyhidWYpO1xuICAgICAgICAgICAgaW5idWYgPSAwO1xuICAgICAgICAgICAgLy8gSnVtcCB0byB0aGUgb3V0ZXIgbG9vcCBzbyB3ZSB1c2UgdGhlIGZ1bGwtYmxvY2sgb3B0aW1pemF0aW9uLlxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5pbmJ1Zl8gPSBpbmJ1ZjtcbiAgICB0aGlzLnRvdGFsXyArPSBsZW5ndGg7XG4gIH1cblxuICAvKiogQG92ZXJyaWRlICovXG4gIGRpZ2VzdCgpOiBudW1iZXJbXSB7XG4gICAgY29uc3QgZGlnZXN0OiBudW1iZXJbXSA9IFtdO1xuICAgIGxldCB0b3RhbEJpdHMgPSB0aGlzLnRvdGFsXyAqIDg7XG5cbiAgICAvLyBBZGQgcGFkIDB4ODAgMHgwMCouXG4gICAgaWYgKHRoaXMuaW5idWZfIDwgNTYpIHtcbiAgICAgIHRoaXMudXBkYXRlKHRoaXMucGFkXywgNTYgLSB0aGlzLmluYnVmXyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudXBkYXRlKHRoaXMucGFkXywgdGhpcy5ibG9ja1NpemUgLSAodGhpcy5pbmJ1Zl8gLSA1NikpO1xuICAgIH1cblxuICAgIC8vIEFkZCAjIGJpdHMuXG4gICAgZm9yIChsZXQgaSA9IHRoaXMuYmxvY2tTaXplIC0gMTsgaSA+PSA1NjsgaS0tKSB7XG4gICAgICB0aGlzLmJ1Zl9baV0gPSB0b3RhbEJpdHMgJiAyNTU7XG4gICAgICB0b3RhbEJpdHMgLz0gMjU2OyAvLyBEb24ndCB1c2UgYml0LXNoaWZ0aW5nIGhlcmUhXG4gICAgfVxuXG4gICAgdGhpcy5jb21wcmVzc18odGhpcy5idWZfKTtcblxuICAgIGxldCBuID0gMDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDU7IGkrKykge1xuICAgICAgZm9yIChsZXQgaiA9IDI0OyBqID49IDA7IGogLT0gOCkge1xuICAgICAgICBkaWdlc3Rbbl0gPSAodGhpcy5jaGFpbl9baV0gPj4gaikgJiAyNTU7XG4gICAgICAgICsrbjtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGRpZ2VzdDtcbiAgfVxufVxuIiwgIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTENcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5leHBvcnQgdHlwZSBOZXh0Rm48VD4gPSAodmFsdWU6IFQpID0+IHZvaWQ7XG5leHBvcnQgdHlwZSBFcnJvckZuID0gKGVycm9yOiBFcnJvcikgPT4gdm9pZDtcbmV4cG9ydCB0eXBlIENvbXBsZXRlRm4gPSAoKSA9PiB2b2lkO1xuXG5leHBvcnQgaW50ZXJmYWNlIE9ic2VydmVyPFQ+IHtcbiAgLy8gQ2FsbGVkIG9uY2UgZm9yIGVhY2ggdmFsdWUgaW4gYSBzdHJlYW0gb2YgdmFsdWVzLlxuICBuZXh0OiBOZXh0Rm48VD47XG5cbiAgLy8gQSBzdHJlYW0gdGVybWluYXRlcyBieSBhIHNpbmdsZSBjYWxsIHRvIEVJVEhFUiBlcnJvcigpIG9yIGNvbXBsZXRlKCkuXG4gIGVycm9yOiBFcnJvckZuO1xuXG4gIC8vIE5vIGV2ZW50cyB3aWxsIGJlIHNlbnQgdG8gbmV4dCgpIG9uY2UgY29tcGxldGUoKSBpcyBjYWxsZWQuXG4gIGNvbXBsZXRlOiBDb21wbGV0ZUZuO1xufVxuXG5leHBvcnQgdHlwZSBQYXJ0aWFsT2JzZXJ2ZXI8VD4gPSBQYXJ0aWFsPE9ic2VydmVyPFQ+PjtcblxuLy8gVE9ETzogU3VwcG9ydCBhbHNvIFVuc3Vic2NyaWJlLnVuc3Vic2NyaWJlP1xuZXhwb3J0IHR5cGUgVW5zdWJzY3JpYmUgPSAoKSA9PiB2b2lkO1xuXG4vKipcbiAqIFRoZSBTdWJzY3JpYmUgaW50ZXJmYWNlIGhhcyB0d28gZm9ybXMgLSBwYXNzaW5nIHRoZSBpbmxpbmUgZnVuY3Rpb25cbiAqIGNhbGxiYWNrcywgb3IgYSBvYmplY3QgaW50ZXJmYWNlIHdpdGggY2FsbGJhY2sgcHJvcGVydGllcy5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBTdWJzY3JpYmU8VD4ge1xuICAobmV4dD86IE5leHRGbjxUPiwgZXJyb3I/OiBFcnJvckZuLCBjb21wbGV0ZT86IENvbXBsZXRlRm4pOiBVbnN1YnNjcmliZTtcbiAgKG9ic2VydmVyOiBQYXJ0aWFsT2JzZXJ2ZXI8VD4pOiBVbnN1YnNjcmliZTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBPYnNlcnZhYmxlPFQ+IHtcbiAgLy8gU3Vic2NyaWJlIG1ldGhvZFxuICBzdWJzY3JpYmU6IFN1YnNjcmliZTxUPjtcbn1cblxuZXhwb3J0IHR5cGUgRXhlY3V0b3I8VD4gPSAob2JzZXJ2ZXI6IE9ic2VydmVyPFQ+KSA9PiB2b2lkO1xuXG4vKipcbiAqIEhlbHBlciB0byBtYWtlIGEgU3Vic2NyaWJlIGZ1bmN0aW9uIChqdXN0IGxpa2UgUHJvbWlzZSBoZWxwcyBtYWtlIGFcbiAqIFRoZW5hYmxlKS5cbiAqXG4gKiBAcGFyYW0gZXhlY3V0b3IgRnVuY3Rpb24gd2hpY2ggY2FuIG1ha2UgY2FsbHMgdG8gYSBzaW5nbGUgT2JzZXJ2ZXJcbiAqICAgICBhcyBhIHByb3h5LlxuICogQHBhcmFtIG9uTm9PYnNlcnZlcnMgQ2FsbGJhY2sgd2hlbiBjb3VudCBvZiBPYnNlcnZlcnMgZ29lcyB0byB6ZXJvLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlU3Vic2NyaWJlPFQ+KFxuICBleGVjdXRvcjogRXhlY3V0b3I8VD4sXG4gIG9uTm9PYnNlcnZlcnM/OiBFeGVjdXRvcjxUPlxuKTogU3Vic2NyaWJlPFQ+IHtcbiAgY29uc3QgcHJveHkgPSBuZXcgT2JzZXJ2ZXJQcm94eTxUPihleGVjdXRvciwgb25Ob09ic2VydmVycyk7XG4gIHJldHVybiBwcm94eS5zdWJzY3JpYmUuYmluZChwcm94eSk7XG59XG5cbi8qKlxuICogSW1wbGVtZW50IGZhbi1vdXQgZm9yIGFueSBudW1iZXIgb2YgT2JzZXJ2ZXJzIGF0dGFjaGVkIHZpYSBhIHN1YnNjcmliZVxuICogZnVuY3Rpb24uXG4gKi9cbmNsYXNzIE9ic2VydmVyUHJveHk8VD4gaW1wbGVtZW50cyBPYnNlcnZlcjxUPiB7XG4gIHByaXZhdGUgb2JzZXJ2ZXJzOiBBcnJheTxPYnNlcnZlcjxUPj4gfCB1bmRlZmluZWQgPSBbXTtcbiAgcHJpdmF0ZSB1bnN1YnNjcmliZXM6IFVuc3Vic2NyaWJlW10gPSBbXTtcbiAgcHJpdmF0ZSBvbk5vT2JzZXJ2ZXJzOiBFeGVjdXRvcjxUPiB8IHVuZGVmaW5lZDtcbiAgcHJpdmF0ZSBvYnNlcnZlckNvdW50ID0gMDtcbiAgLy8gTWljcm8tdGFzayBzY2hlZHVsaW5nIGJ5IGNhbGxpbmcgdGFzay50aGVuKCkuXG4gIHByaXZhdGUgdGFzayA9IFByb21pc2UucmVzb2x2ZSgpO1xuICBwcml2YXRlIGZpbmFsaXplZCA9IGZhbHNlO1xuICBwcml2YXRlIGZpbmFsRXJyb3I/OiBFcnJvcjtcblxuICAvKipcbiAgICogQHBhcmFtIGV4ZWN1dG9yIEZ1bmN0aW9uIHdoaWNoIGNhbiBtYWtlIGNhbGxzIHRvIGEgc2luZ2xlIE9ic2VydmVyXG4gICAqICAgICBhcyBhIHByb3h5LlxuICAgKiBAcGFyYW0gb25Ob09ic2VydmVycyBDYWxsYmFjayB3aGVuIGNvdW50IG9mIE9ic2VydmVycyBnb2VzIHRvIHplcm8uXG4gICAqL1xuICBjb25zdHJ1Y3RvcihleGVjdXRvcjogRXhlY3V0b3I8VD4sIG9uTm9PYnNlcnZlcnM/OiBFeGVjdXRvcjxUPikge1xuICAgIHRoaXMub25Ob09ic2VydmVycyA9IG9uTm9PYnNlcnZlcnM7XG4gICAgLy8gQ2FsbCB0aGUgZXhlY3V0b3IgYXN5bmNocm9ub3VzbHkgc28gc3Vic2NyaWJlcnMgdGhhdCBhcmUgY2FsbGVkXG4gICAgLy8gc3luY2hyb25vdXNseSBhZnRlciB0aGUgY3JlYXRpb24gb2YgdGhlIHN1YnNjcmliZSBmdW5jdGlvblxuICAgIC8vIGNhbiBzdGlsbCByZWNlaXZlIHRoZSB2ZXJ5IGZpcnN0IHZhbHVlIGdlbmVyYXRlZCBpbiB0aGUgZXhlY3V0b3IuXG4gICAgdGhpcy50YXNrXG4gICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgIGV4ZWN1dG9yKHRoaXMpO1xuICAgICAgfSlcbiAgICAgIC5jYXRjaChlID0+IHtcbiAgICAgICAgdGhpcy5lcnJvcihlKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgbmV4dCh2YWx1ZTogVCk6IHZvaWQge1xuICAgIHRoaXMuZm9yRWFjaE9ic2VydmVyKChvYnNlcnZlcjogT2JzZXJ2ZXI8VD4pID0+IHtcbiAgICAgIG9ic2VydmVyLm5leHQodmFsdWUpO1xuICAgIH0pO1xuICB9XG5cbiAgZXJyb3IoZXJyb3I6IEVycm9yKTogdm9pZCB7XG4gICAgdGhpcy5mb3JFYWNoT2JzZXJ2ZXIoKG9ic2VydmVyOiBPYnNlcnZlcjxUPikgPT4ge1xuICAgICAgb2JzZXJ2ZXIuZXJyb3IoZXJyb3IpO1xuICAgIH0pO1xuICAgIHRoaXMuY2xvc2UoZXJyb3IpO1xuICB9XG5cbiAgY29tcGxldGUoKTogdm9pZCB7XG4gICAgdGhpcy5mb3JFYWNoT2JzZXJ2ZXIoKG9ic2VydmVyOiBPYnNlcnZlcjxUPikgPT4ge1xuICAgICAgb2JzZXJ2ZXIuY29tcGxldGUoKTtcbiAgICB9KTtcbiAgICB0aGlzLmNsb3NlKCk7XG4gIH1cblxuICAvKipcbiAgICogU3Vic2NyaWJlIGZ1bmN0aW9uIHRoYXQgY2FuIGJlIHVzZWQgdG8gYWRkIGFuIE9ic2VydmVyIHRvIHRoZSBmYW4tb3V0IGxpc3QuXG4gICAqXG4gICAqIC0gV2UgcmVxdWlyZSB0aGF0IG5vIGV2ZW50IGlzIHNlbnQgdG8gYSBzdWJzY3JpYmVyIHN5Y2hyb25vdXNseSB0byB0aGVpclxuICAgKiAgIGNhbGwgdG8gc3Vic2NyaWJlKCkuXG4gICAqL1xuICBzdWJzY3JpYmUoXG4gICAgbmV4dE9yT2JzZXJ2ZXI/OiBOZXh0Rm48VD4gfCBQYXJ0aWFsT2JzZXJ2ZXI8VD4sXG4gICAgZXJyb3I/OiBFcnJvckZuLFxuICAgIGNvbXBsZXRlPzogQ29tcGxldGVGblxuICApOiBVbnN1YnNjcmliZSB7XG4gICAgbGV0IG9ic2VydmVyOiBPYnNlcnZlcjxUPjtcblxuICAgIGlmIChcbiAgICAgIG5leHRPck9ic2VydmVyID09PSB1bmRlZmluZWQgJiZcbiAgICAgIGVycm9yID09PSB1bmRlZmluZWQgJiZcbiAgICAgIGNvbXBsZXRlID09PSB1bmRlZmluZWRcbiAgICApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTWlzc2luZyBPYnNlcnZlci4nKTtcbiAgICB9XG5cbiAgICAvLyBBc3NlbWJsZSBhbiBPYnNlcnZlciBvYmplY3Qgd2hlbiBwYXNzZWQgYXMgY2FsbGJhY2sgZnVuY3Rpb25zLlxuICAgIGlmIChcbiAgICAgIGltcGxlbWVudHNBbnlNZXRob2RzKG5leHRPck9ic2VydmVyIGFzIHsgW2tleTogc3RyaW5nXTogdW5rbm93biB9LCBbXG4gICAgICAgICduZXh0JyxcbiAgICAgICAgJ2Vycm9yJyxcbiAgICAgICAgJ2NvbXBsZXRlJ1xuICAgICAgXSlcbiAgICApIHtcbiAgICAgIG9ic2VydmVyID0gbmV4dE9yT2JzZXJ2ZXIgYXMgT2JzZXJ2ZXI8VD47XG4gICAgfSBlbHNlIHtcbiAgICAgIG9ic2VydmVyID0ge1xuICAgICAgICBuZXh0OiBuZXh0T3JPYnNlcnZlciBhcyBOZXh0Rm48VD4sXG4gICAgICAgIGVycm9yLFxuICAgICAgICBjb21wbGV0ZVxuICAgICAgfSBhcyBPYnNlcnZlcjxUPjtcbiAgICB9XG5cbiAgICBpZiAob2JzZXJ2ZXIubmV4dCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBvYnNlcnZlci5uZXh0ID0gbm9vcCBhcyBOZXh0Rm48VD47XG4gICAgfVxuICAgIGlmIChvYnNlcnZlci5lcnJvciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBvYnNlcnZlci5lcnJvciA9IG5vb3AgYXMgRXJyb3JGbjtcbiAgICB9XG4gICAgaWYgKG9ic2VydmVyLmNvbXBsZXRlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIG9ic2VydmVyLmNvbXBsZXRlID0gbm9vcCBhcyBDb21wbGV0ZUZuO1xuICAgIH1cblxuICAgIGNvbnN0IHVuc3ViID0gdGhpcy51bnN1YnNjcmliZU9uZS5iaW5kKHRoaXMsIHRoaXMub2JzZXJ2ZXJzIS5sZW5ndGgpO1xuXG4gICAgLy8gQXR0ZW1wdCB0byBzdWJzY3JpYmUgdG8gYSB0ZXJtaW5hdGVkIE9ic2VydmFibGUgLSB3ZVxuICAgIC8vIGp1c3QgcmVzcG9uZCB0byB0aGUgT2JzZXJ2ZXIgd2l0aCB0aGUgZmluYWwgZXJyb3Igb3IgY29tcGxldGVcbiAgICAvLyBldmVudC5cbiAgICBpZiAodGhpcy5maW5hbGl6ZWQpIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZmxvYXRpbmctcHJvbWlzZXNcbiAgICAgIHRoaXMudGFzay50aGVuKCgpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBpZiAodGhpcy5maW5hbEVycm9yKSB7XG4gICAgICAgICAgICBvYnNlcnZlci5lcnJvcih0aGlzLmZpbmFsRXJyb3IpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvYnNlcnZlci5jb21wbGV0ZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIC8vIG5vdGhpbmdcbiAgICAgICAgfVxuICAgICAgICByZXR1cm47XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLm9ic2VydmVycyEucHVzaChvYnNlcnZlciBhcyBPYnNlcnZlcjxUPik7XG5cbiAgICByZXR1cm4gdW5zdWI7XG4gIH1cblxuICAvLyBVbnN1YnNjcmliZSBpcyBzeW5jaHJvbm91cyAtIHdlIGd1YXJhbnRlZSB0aGF0IG5vIGV2ZW50cyBhcmUgc2VudCB0b1xuICAvLyBhbnkgdW5zdWJzY3JpYmVkIE9ic2VydmVyLlxuICBwcml2YXRlIHVuc3Vic2NyaWJlT25lKGk6IG51bWJlcik6IHZvaWQge1xuICAgIGlmICh0aGlzLm9ic2VydmVycyA9PT0gdW5kZWZpbmVkIHx8IHRoaXMub2JzZXJ2ZXJzW2ldID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBkZWxldGUgdGhpcy5vYnNlcnZlcnNbaV07XG5cbiAgICB0aGlzLm9ic2VydmVyQ291bnQgLT0gMTtcbiAgICBpZiAodGhpcy5vYnNlcnZlckNvdW50ID09PSAwICYmIHRoaXMub25Ob09ic2VydmVycyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLm9uTm9PYnNlcnZlcnModGhpcyk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBmb3JFYWNoT2JzZXJ2ZXIoZm46IChvYnNlcnZlcjogT2JzZXJ2ZXI8VD4pID0+IHZvaWQpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5maW5hbGl6ZWQpIHtcbiAgICAgIC8vIEFscmVhZHkgY2xvc2VkIGJ5IHByZXZpb3VzIGV2ZW50Li4uLmp1c3QgZWF0IHRoZSBhZGRpdGlvbmFsIHZhbHVlcy5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBTaW5jZSBzZW5kT25lIGNhbGxzIGFzeW5jaHJvbm91c2x5IC0gdGhlcmUgaXMgbm8gY2hhbmNlIHRoYXRcbiAgICAvLyB0aGlzLm9ic2VydmVycyB3aWxsIGJlY29tZSB1bmRlZmluZWQuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm9ic2VydmVycyEubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRoaXMuc2VuZE9uZShpLCBmbik7XG4gICAgfVxuICB9XG5cbiAgLy8gQ2FsbCB0aGUgT2JzZXJ2ZXIgdmlhIG9uZSBvZiBpdCdzIGNhbGxiYWNrIGZ1bmN0aW9uLiBXZSBhcmUgY2FyZWZ1bCB0b1xuICAvLyBjb25maXJtIHRoYXQgdGhlIG9ic2VydmUgaGFzIG5vdCBiZWVuIHVuc3Vic2NyaWJlZCBzaW5jZSB0aGlzIGFzeW5jaHJvbm91c1xuICAvLyBmdW5jdGlvbiBoYWQgYmVlbiBxdWV1ZWQuXG4gIHByaXZhdGUgc2VuZE9uZShpOiBudW1iZXIsIGZuOiAob2JzZXJ2ZXI6IE9ic2VydmVyPFQ+KSA9PiB2b2lkKTogdm9pZCB7XG4gICAgLy8gRXhlY3V0ZSB0aGUgY2FsbGJhY2sgYXN5bmNocm9ub3VzbHlcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWZsb2F0aW5nLXByb21pc2VzXG4gICAgdGhpcy50YXNrLnRoZW4oKCkgPT4ge1xuICAgICAgaWYgKHRoaXMub2JzZXJ2ZXJzICE9PSB1bmRlZmluZWQgJiYgdGhpcy5vYnNlcnZlcnNbaV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGZuKHRoaXMub2JzZXJ2ZXJzW2ldKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIC8vIElnbm9yZSBleGNlcHRpb25zIHJhaXNlZCBpbiBPYnNlcnZlcnMgb3IgbWlzc2luZyBtZXRob2RzIG9mIGFuXG4gICAgICAgICAgLy8gT2JzZXJ2ZXIuXG4gICAgICAgICAgLy8gTG9nIGVycm9yIHRvIGNvbnNvbGUuIGIvMzE0MDQ4MDZcbiAgICAgICAgICBpZiAodHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnICYmIGNvbnNvbGUuZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGNsb3NlKGVycj86IEVycm9yKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZmluYWxpemVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuZmluYWxpemVkID0gdHJ1ZTtcbiAgICBpZiAoZXJyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuZmluYWxFcnJvciA9IGVycjtcbiAgICB9XG4gICAgLy8gUHJveHkgaXMgbm8gbG9uZ2VyIG5lZWRlZCAtIGdhcmJhZ2UgY29sbGVjdCByZWZlcmVuY2VzXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1mbG9hdGluZy1wcm9taXNlc1xuICAgIHRoaXMudGFzay50aGVuKCgpID0+IHtcbiAgICAgIHRoaXMub2JzZXJ2ZXJzID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5vbk5vT2JzZXJ2ZXJzID0gdW5kZWZpbmVkO1xuICAgIH0pO1xuICB9XG59XG5cbi8qKiBUdXJuIHN5bmNocm9ub3VzIGZ1bmN0aW9uIGludG8gb25lIGNhbGxlZCBhc3luY2hyb25vdXNseS4gKi9cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvYmFuLXR5cGVzXG5leHBvcnQgZnVuY3Rpb24gYXN5bmMoZm46IEZ1bmN0aW9uLCBvbkVycm9yPzogRXJyb3JGbik6IEZ1bmN0aW9uIHtcbiAgcmV0dXJuICguLi5hcmdzOiB1bmtub3duW10pID0+IHtcbiAgICBQcm9taXNlLnJlc29sdmUodHJ1ZSlcbiAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgZm4oLi4uYXJncyk7XG4gICAgICB9KVxuICAgICAgLmNhdGNoKChlcnJvcjogRXJyb3IpID0+IHtcbiAgICAgICAgaWYgKG9uRXJyb3IpIHtcbiAgICAgICAgICBvbkVycm9yKGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gIH07XG59XG5cbi8qKlxuICogUmV0dXJuIHRydWUgaWYgdGhlIG9iamVjdCBwYXNzZWQgaW4gaW1wbGVtZW50cyBhbnkgb2YgdGhlIG5hbWVkIG1ldGhvZHMuXG4gKi9cbmZ1bmN0aW9uIGltcGxlbWVudHNBbnlNZXRob2RzKFxuICBvYmo6IHsgW2tleTogc3RyaW5nXTogdW5rbm93biB9LFxuICBtZXRob2RzOiBzdHJpbmdbXVxuKTogYm9vbGVhbiB7XG4gIGlmICh0eXBlb2Ygb2JqICE9PSAnb2JqZWN0JyB8fCBvYmogPT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBmb3IgKGNvbnN0IG1ldGhvZCBvZiBtZXRob2RzKSB7XG4gICAgaWYgKG1ldGhvZCBpbiBvYmogJiYgdHlwZW9mIG9ialttZXRob2RdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIG5vb3AoKTogdm9pZCB7XG4gIC8vIGRvIG5vdGhpbmdcbn1cbiIsICIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4vKipcbiAqIENoZWNrIHRvIG1ha2Ugc3VyZSB0aGUgYXBwcm9wcmlhdGUgbnVtYmVyIG9mIGFyZ3VtZW50cyBhcmUgcHJvdmlkZWQgZm9yIGEgcHVibGljIGZ1bmN0aW9uLlxuICogVGhyb3dzIGFuIGVycm9yIGlmIGl0IGZhaWxzLlxuICpcbiAqIEBwYXJhbSBmbk5hbWUgVGhlIGZ1bmN0aW9uIG5hbWVcbiAqIEBwYXJhbSBtaW5Db3VudCBUaGUgbWluaW11bSBudW1iZXIgb2YgYXJndW1lbnRzIHRvIGFsbG93IGZvciB0aGUgZnVuY3Rpb24gY2FsbFxuICogQHBhcmFtIG1heENvdW50IFRoZSBtYXhpbXVtIG51bWJlciBvZiBhcmd1bWVudCB0byBhbGxvdyBmb3IgdGhlIGZ1bmN0aW9uIGNhbGxcbiAqIEBwYXJhbSBhcmdDb3VudCBUaGUgYWN0dWFsIG51bWJlciBvZiBhcmd1bWVudHMgcHJvdmlkZWQuXG4gKi9cbmV4cG9ydCBjb25zdCB2YWxpZGF0ZUFyZ0NvdW50ID0gZnVuY3Rpb24gKFxuICBmbk5hbWU6IHN0cmluZyxcbiAgbWluQ291bnQ6IG51bWJlcixcbiAgbWF4Q291bnQ6IG51bWJlcixcbiAgYXJnQ291bnQ6IG51bWJlclxuKTogdm9pZCB7XG4gIGxldCBhcmdFcnJvcjtcbiAgaWYgKGFyZ0NvdW50IDwgbWluQ291bnQpIHtcbiAgICBhcmdFcnJvciA9ICdhdCBsZWFzdCAnICsgbWluQ291bnQ7XG4gIH0gZWxzZSBpZiAoYXJnQ291bnQgPiBtYXhDb3VudCkge1xuICAgIGFyZ0Vycm9yID0gbWF4Q291bnQgPT09IDAgPyAnbm9uZScgOiAnbm8gbW9yZSB0aGFuICcgKyBtYXhDb3VudDtcbiAgfVxuICBpZiAoYXJnRXJyb3IpIHtcbiAgICBjb25zdCBlcnJvciA9XG4gICAgICBmbk5hbWUgK1xuICAgICAgJyBmYWlsZWQ6IFdhcyBjYWxsZWQgd2l0aCAnICtcbiAgICAgIGFyZ0NvdW50ICtcbiAgICAgIChhcmdDb3VudCA9PT0gMSA/ICcgYXJndW1lbnQuJyA6ICcgYXJndW1lbnRzLicpICtcbiAgICAgICcgRXhwZWN0cyAnICtcbiAgICAgIGFyZ0Vycm9yICtcbiAgICAgICcuJztcbiAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3IpO1xuICB9XG59O1xuXG4vKipcbiAqIEdlbmVyYXRlcyBhIHN0cmluZyB0byBwcmVmaXggYW4gZXJyb3IgbWVzc2FnZSBhYm91dCBmYWlsZWQgYXJndW1lbnQgdmFsaWRhdGlvblxuICpcbiAqIEBwYXJhbSBmbk5hbWUgVGhlIGZ1bmN0aW9uIG5hbWVcbiAqIEBwYXJhbSBhcmdOYW1lIFRoZSBuYW1lIG9mIHRoZSBhcmd1bWVudFxuICogQHJldHVybiBUaGUgcHJlZml4IHRvIGFkZCB0byB0aGUgZXJyb3IgdGhyb3duIGZvciB2YWxpZGF0aW9uLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZXJyb3JQcmVmaXgoZm5OYW1lOiBzdHJpbmcsIGFyZ05hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBgJHtmbk5hbWV9IGZhaWxlZDogJHthcmdOYW1lfSBhcmd1bWVudCBgO1xufVxuXG4vKipcbiAqIEBwYXJhbSBmbk5hbWVcbiAqIEBwYXJhbSBhcmd1bWVudE51bWJlclxuICogQHBhcmFtIG5hbWVzcGFjZVxuICogQHBhcmFtIG9wdGlvbmFsXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZU5hbWVzcGFjZShcbiAgZm5OYW1lOiBzdHJpbmcsXG4gIG5hbWVzcGFjZTogc3RyaW5nLFxuICBvcHRpb25hbDogYm9vbGVhblxuKTogdm9pZCB7XG4gIGlmIChvcHRpb25hbCAmJiAhbmFtZXNwYWNlKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmICh0eXBlb2YgbmFtZXNwYWNlICE9PSAnc3RyaW5nJykge1xuICAgIC8vVE9ETzogSSBzaG91bGQgZG8gbW9yZSB2YWxpZGF0aW9uIGhlcmUuIFdlIG9ubHkgYWxsb3cgY2VydGFpbiBjaGFycyBpbiBuYW1lc3BhY2VzLlxuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGVycm9yUHJlZml4KGZuTmFtZSwgJ25hbWVzcGFjZScpICsgJ211c3QgYmUgYSB2YWxpZCBmaXJlYmFzZSBuYW1lc3BhY2UuJ1xuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlQ2FsbGJhY2soXG4gIGZuTmFtZTogc3RyaW5nLFxuICBhcmd1bWVudE5hbWU6IHN0cmluZyxcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9iYW4tdHlwZXNcbiAgY2FsbGJhY2s6IEZ1bmN0aW9uLFxuICBvcHRpb25hbDogYm9vbGVhblxuKTogdm9pZCB7XG4gIGlmIChvcHRpb25hbCAmJiAhY2FsbGJhY2spIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGVycm9yUHJlZml4KGZuTmFtZSwgYXJndW1lbnROYW1lKSArICdtdXN0IGJlIGEgdmFsaWQgZnVuY3Rpb24uJ1xuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlQ29udGV4dE9iamVjdChcbiAgZm5OYW1lOiBzdHJpbmcsXG4gIGFyZ3VtZW50TmFtZTogc3RyaW5nLFxuICBjb250ZXh0OiB1bmtub3duLFxuICBvcHRpb25hbDogYm9vbGVhblxuKTogdm9pZCB7XG4gIGlmIChvcHRpb25hbCAmJiAhY29udGV4dCkge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAodHlwZW9mIGNvbnRleHQgIT09ICdvYmplY3QnIHx8IGNvbnRleHQgPT09IG51bGwpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBlcnJvclByZWZpeChmbk5hbWUsIGFyZ3VtZW50TmFtZSkgKyAnbXVzdCBiZSBhIHZhbGlkIGNvbnRleHQgb2JqZWN0LidcbiAgICApO1xuICB9XG59XG4iLCAiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQ1xuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgYXNzZXJ0IH0gZnJvbSAnLi9hc3NlcnQnO1xuXG4vLyBDb2RlIG9yaWdpbmFsbHkgY2FtZSBmcm9tIGdvb2cuY3J5cHQuc3RyaW5nVG9VdGY4Qnl0ZUFycmF5LCBidXQgZm9yIHNvbWUgcmVhc29uIHRoZXlcbi8vIGF1dG9tYXRpY2FsbHkgcmVwbGFjZWQgJ1xcclxcbicgd2l0aCAnXFxuJywgYW5kIHRoZXkgZGlkbid0IGhhbmRsZSBzdXJyb2dhdGUgcGFpcnMsXG4vLyBzbyBpdCdzIGJlZW4gbW9kaWZpZWQuXG5cbi8vIE5vdGUgdGhhdCBub3QgYWxsIFVuaWNvZGUgY2hhcmFjdGVycyBhcHBlYXIgYXMgc2luZ2xlIGNoYXJhY3RlcnMgaW4gSmF2YVNjcmlwdCBzdHJpbmdzLlxuLy8gZnJvbUNoYXJDb2RlIHJldHVybnMgdGhlIFVURi0xNiBlbmNvZGluZyBvZiBhIGNoYXJhY3RlciAtIHNvIHNvbWUgVW5pY29kZSBjaGFyYWN0ZXJzXG4vLyB1c2UgMiBjaGFyYWN0ZXJzIGluIEphdmFzY3JpcHQuICBBbGwgNC1ieXRlIFVURi04IGNoYXJhY3RlcnMgYmVnaW4gd2l0aCBhIGZpcnN0XG4vLyBjaGFyYWN0ZXIgaW4gdGhlIHJhbmdlIDB4RDgwMCAtIDB4REJGRiAodGhlIGZpcnN0IGNoYXJhY3RlciBvZiBhIHNvLWNhbGxlZCBzdXJyb2dhdGVcbi8vIHBhaXIpLlxuLy8gU2VlIGh0dHA6Ly93d3cuZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi81LjEvI3NlYy0xNS4xLjNcblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtBcnJheX1cbiAqL1xuZXhwb3J0IGNvbnN0IHN0cmluZ1RvQnl0ZUFycmF5ID0gZnVuY3Rpb24gKHN0cjogc3RyaW5nKTogbnVtYmVyW10ge1xuICBjb25zdCBvdXQ6IG51bWJlcltdID0gW107XG4gIGxldCBwID0gMDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICBsZXQgYyA9IHN0ci5jaGFyQ29kZUF0KGkpO1xuXG4gICAgLy8gSXMgdGhpcyB0aGUgbGVhZCBzdXJyb2dhdGUgaW4gYSBzdXJyb2dhdGUgcGFpcj9cbiAgICBpZiAoYyA+PSAweGQ4MDAgJiYgYyA8PSAweGRiZmYpIHtcbiAgICAgIGNvbnN0IGhpZ2ggPSBjIC0gMHhkODAwOyAvLyB0aGUgaGlnaCAxMCBiaXRzLlxuICAgICAgaSsrO1xuICAgICAgYXNzZXJ0KGkgPCBzdHIubGVuZ3RoLCAnU3Vycm9nYXRlIHBhaXIgbWlzc2luZyB0cmFpbCBzdXJyb2dhdGUuJyk7XG4gICAgICBjb25zdCBsb3cgPSBzdHIuY2hhckNvZGVBdChpKSAtIDB4ZGMwMDsgLy8gdGhlIGxvdyAxMCBiaXRzLlxuICAgICAgYyA9IDB4MTAwMDAgKyAoaGlnaCA8PCAxMCkgKyBsb3c7XG4gICAgfVxuXG4gICAgaWYgKGMgPCAxMjgpIHtcbiAgICAgIG91dFtwKytdID0gYztcbiAgICB9IGVsc2UgaWYgKGMgPCAyMDQ4KSB7XG4gICAgICBvdXRbcCsrXSA9IChjID4+IDYpIHwgMTkyO1xuICAgICAgb3V0W3ArK10gPSAoYyAmIDYzKSB8IDEyODtcbiAgICB9IGVsc2UgaWYgKGMgPCA2NTUzNikge1xuICAgICAgb3V0W3ArK10gPSAoYyA+PiAxMikgfCAyMjQ7XG4gICAgICBvdXRbcCsrXSA9ICgoYyA+PiA2KSAmIDYzKSB8IDEyODtcbiAgICAgIG91dFtwKytdID0gKGMgJiA2MykgfCAxMjg7XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dFtwKytdID0gKGMgPj4gMTgpIHwgMjQwO1xuICAgICAgb3V0W3ArK10gPSAoKGMgPj4gMTIpICYgNjMpIHwgMTI4O1xuICAgICAgb3V0W3ArK10gPSAoKGMgPj4gNikgJiA2MykgfCAxMjg7XG4gICAgICBvdXRbcCsrXSA9IChjICYgNjMpIHwgMTI4O1xuICAgIH1cbiAgfVxuICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBDYWxjdWxhdGUgbGVuZ3RoIHdpdGhvdXQgYWN0dWFsbHkgY29udmVydGluZzsgdXNlZnVsIGZvciBkb2luZyBjaGVhcGVyIHZhbGlkYXRpb24uXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtudW1iZXJ9XG4gKi9cbmV4cG9ydCBjb25zdCBzdHJpbmdMZW5ndGggPSBmdW5jdGlvbiAoc3RyOiBzdHJpbmcpOiBudW1iZXIge1xuICBsZXQgcCA9IDA7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgYyA9IHN0ci5jaGFyQ29kZUF0KGkpO1xuICAgIGlmIChjIDwgMTI4KSB7XG4gICAgICBwKys7XG4gICAgfSBlbHNlIGlmIChjIDwgMjA0OCkge1xuICAgICAgcCArPSAyO1xuICAgIH0gZWxzZSBpZiAoYyA+PSAweGQ4MDAgJiYgYyA8PSAweGRiZmYpIHtcbiAgICAgIC8vIExlYWQgc3Vycm9nYXRlIG9mIGEgc3Vycm9nYXRlIHBhaXIuICBUaGUgcGFpciB0b2dldGhlciB3aWxsIHRha2UgNCBieXRlcyB0byByZXByZXNlbnQuXG4gICAgICBwICs9IDQ7XG4gICAgICBpKys7IC8vIHNraXAgdHJhaWwgc3Vycm9nYXRlLlxuICAgIH0gZWxzZSB7XG4gICAgICBwICs9IDM7XG4gICAgfVxuICB9XG4gIHJldHVybiBwO1xufTtcbiIsICIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMiBHb29nbGUgTExDXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4vKipcbiAqIENvcGllZCBmcm9tIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yMTE3NTIzXG4gKiBHZW5lcmF0ZXMgYSBuZXcgdXVpZC5cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNvbnN0IHV1aWR2NCA9IGZ1bmN0aW9uICgpOiBzdHJpbmcge1xuICByZXR1cm4gJ3h4eHh4eHh4LXh4eHgtNHh4eC15eHh4LXh4eHh4eHh4eHh4eCcucmVwbGFjZSgvW3h5XS9nLCBjID0+IHtcbiAgICBjb25zdCByID0gKE1hdGgucmFuZG9tKCkgKiAxNikgfCAwLFxuICAgICAgdiA9IGMgPT09ICd4JyA/IHIgOiAociAmIDB4MykgfCAweDg7XG4gICAgcmV0dXJuIHYudG9TdHJpbmcoMTYpO1xuICB9KTtcbn07XG4iLCAiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLyoqXG4gKiBUaGUgYW1vdW50IG9mIG1pbGxpc2Vjb25kcyB0byBleHBvbmVudGlhbGx5IGluY3JlYXNlLlxuICovXG5jb25zdCBERUZBVUxUX0lOVEVSVkFMX01JTExJUyA9IDEwMDA7XG5cbi8qKlxuICogVGhlIGZhY3RvciB0byBiYWNrb2ZmIGJ5LlxuICogU2hvdWxkIGJlIGEgbnVtYmVyIGdyZWF0ZXIgdGhhbiAxLlxuICovXG5jb25zdCBERUZBVUxUX0JBQ0tPRkZfRkFDVE9SID0gMjtcblxuLyoqXG4gKiBUaGUgbWF4aW11bSBtaWxsaXNlY29uZHMgdG8gaW5jcmVhc2UgdG8uXG4gKlxuICogPHA+VmlzaWJsZSBmb3IgdGVzdGluZ1xuICovXG5leHBvcnQgY29uc3QgTUFYX1ZBTFVFX01JTExJUyA9IDQgKiA2MCAqIDYwICogMTAwMDsgLy8gRm91ciBob3VycywgbGlrZSBpT1MgYW5kIEFuZHJvaWQuXG5cbi8qKlxuICogVGhlIHBlcmNlbnRhZ2Ugb2YgYmFja29mZiB0aW1lIHRvIHJhbmRvbWl6ZSBieS5cbiAqIFNlZVxuICogaHR0cDovL2dvL3NhZmUtY2xpZW50LWJlaGF2aW9yI3N0ZXAtMS1kZXRlcm1pbmUtdGhlLWFwcHJvcHJpYXRlLXJldHJ5LWludGVydmFsLXRvLWhhbmRsZS1zcGlrZS10cmFmZmljXG4gKiBmb3IgY29udGV4dC5cbiAqXG4gKiA8cD5WaXNpYmxlIGZvciB0ZXN0aW5nXG4gKi9cbmV4cG9ydCBjb25zdCBSQU5ET01fRkFDVE9SID0gMC41O1xuXG4vKipcbiAqIEJhc2VkIG9uIHRoZSBiYWNrb2ZmIG1ldGhvZCBmcm9tXG4gKiBodHRwczovL2dpdGh1Yi5jb20vZ29vZ2xlL2Nsb3N1cmUtbGlicmFyeS9ibG9iL21hc3Rlci9jbG9zdXJlL2dvb2cvbWF0aC9leHBvbmVudGlhbGJhY2tvZmYuanMuXG4gKiBFeHRyYWN0ZWQgaGVyZSBzbyB3ZSBkb24ndCBuZWVkIHRvIHBhc3MgbWV0YWRhdGEgYW5kIGEgc3RhdGVmdWwgRXhwb25lbnRpYWxCYWNrb2ZmIG9iamVjdCBhcm91bmQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjYWxjdWxhdGVCYWNrb2ZmTWlsbGlzKFxuICBiYWNrb2ZmQ291bnQ6IG51bWJlcixcbiAgaW50ZXJ2YWxNaWxsaXM6IG51bWJlciA9IERFRkFVTFRfSU5URVJWQUxfTUlMTElTLFxuICBiYWNrb2ZmRmFjdG9yOiBudW1iZXIgPSBERUZBVUxUX0JBQ0tPRkZfRkFDVE9SXG4pOiBudW1iZXIge1xuICAvLyBDYWxjdWxhdGVzIGFuIGV4cG9uZW50aWFsbHkgaW5jcmVhc2luZyB2YWx1ZS5cbiAgLy8gRGV2aWF0aW9uOiBjYWxjdWxhdGVzIHZhbHVlIGZyb20gY291bnQgYW5kIGEgY29uc3RhbnQgaW50ZXJ2YWwsIHNvIHdlIG9ubHkgbmVlZCB0byBzYXZlIHZhbHVlXG4gIC8vIGFuZCBjb3VudCB0byByZXN0b3JlIHN0YXRlLlxuICBjb25zdCBjdXJyQmFzZVZhbHVlID0gaW50ZXJ2YWxNaWxsaXMgKiBNYXRoLnBvdyhiYWNrb2ZmRmFjdG9yLCBiYWNrb2ZmQ291bnQpO1xuXG4gIC8vIEEgcmFuZG9tIFwiZnV6elwiIHRvIGF2b2lkIHdhdmVzIG9mIHJldHJpZXMuXG4gIC8vIERldmlhdGlvbjogcmFuZG9tRmFjdG9yIGlzIHJlcXVpcmVkLlxuICBjb25zdCByYW5kb21XYWl0ID0gTWF0aC5yb3VuZChcbiAgICAvLyBBIGZyYWN0aW9uIG9mIHRoZSBiYWNrb2ZmIHZhbHVlIHRvIGFkZC9zdWJ0cmFjdC5cbiAgICAvLyBEZXZpYXRpb246IGNoYW5nZXMgbXVsdGlwbGljYXRpb24gb3JkZXIgdG8gaW1wcm92ZSByZWFkYWJpbGl0eS5cbiAgICBSQU5ET01fRkFDVE9SICpcbiAgICAgIGN1cnJCYXNlVmFsdWUgKlxuICAgICAgLy8gQSByYW5kb20gZmxvYXQgKHJvdW5kZWQgdG8gaW50IGJ5IE1hdGgucm91bmQgYWJvdmUpIGluIHRoZSByYW5nZSBbLTEsIDFdLiBEZXRlcm1pbmVzXG4gICAgICAvLyBpZiB3ZSBhZGQgb3Igc3VidHJhY3QuXG4gICAgICAoTWF0aC5yYW5kb20oKSAtIDAuNSkgKlxuICAgICAgMlxuICApO1xuXG4gIC8vIExpbWl0cyBiYWNrb2ZmIHRvIG1heCB0byBhdm9pZCBlZmZlY3RpdmVseSBwZXJtYW5lbnQgYmFja29mZi5cbiAgcmV0dXJuIE1hdGgubWluKE1BWF9WQUxVRV9NSUxMSVMsIGN1cnJCYXNlVmFsdWUgKyByYW5kb21XYWl0KTtcbn1cbiIsICIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4vKipcbiAqIFByb3ZpZGUgRW5nbGlzaCBvcmRpbmFsIGxldHRlcnMgYWZ0ZXIgYSBudW1iZXJcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG9yZGluYWwoaTogbnVtYmVyKTogc3RyaW5nIHtcbiAgaWYgKCFOdW1iZXIuaXNGaW5pdGUoaSkpIHtcbiAgICByZXR1cm4gYCR7aX1gO1xuICB9XG4gIHJldHVybiBpICsgaW5kaWNhdG9yKGkpO1xufVxuXG5mdW5jdGlvbiBpbmRpY2F0b3IoaTogbnVtYmVyKTogc3RyaW5nIHtcbiAgaSA9IE1hdGguYWJzKGkpO1xuICBjb25zdCBjZW50ID0gaSAlIDEwMDtcbiAgaWYgKGNlbnQgPj0gMTAgJiYgY2VudCA8PSAyMCkge1xuICAgIHJldHVybiAndGgnO1xuICB9XG4gIGNvbnN0IGRlYyA9IGkgJSAxMDtcbiAgaWYgKGRlYyA9PT0gMSkge1xuICAgIHJldHVybiAnc3QnO1xuICB9XG4gIGlmIChkZWMgPT09IDIpIHtcbiAgICByZXR1cm4gJ25kJztcbiAgfVxuICBpZiAoZGVjID09PSAzKSB7XG4gICAgcmV0dXJuICdyZCc7XG4gIH1cbiAgcmV0dXJuICd0aCc7XG59XG4iLCAiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjEgR29vZ2xlIExMQ1xuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuZXhwb3J0IGludGVyZmFjZSBDb21wYXQ8VD4ge1xuICBfZGVsZWdhdGU6IFQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRNb2R1bGFySW5zdGFuY2U8RXhwU2VydmljZT4oXG4gIHNlcnZpY2U6IENvbXBhdDxFeHBTZXJ2aWNlPiB8IEV4cFNlcnZpY2Vcbik6IEV4cFNlcnZpY2Uge1xuICBpZiAoc2VydmljZSAmJiAoc2VydmljZSBhcyBDb21wYXQ8RXhwU2VydmljZT4pLl9kZWxlZ2F0ZSkge1xuICAgIHJldHVybiAoc2VydmljZSBhcyBDb21wYXQ8RXhwU2VydmljZT4pLl9kZWxlZ2F0ZTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gc2VydmljZSBhcyBFeHBTZXJ2aWNlO1xuICB9XG59XG4iLCAiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cbmltcG9ydCB7XG4gIEluc3RhbnRpYXRpb25Nb2RlLFxuICBJbnN0YW5jZUZhY3RvcnksXG4gIENvbXBvbmVudFR5cGUsXG4gIERpY3Rpb25hcnksXG4gIE5hbWUsXG4gIG9uSW5zdGFuY2VDcmVhdGVkQ2FsbGJhY2tcbn0gZnJvbSAnLi90eXBlcyc7XG5cbi8qKlxuICogQ29tcG9uZW50IGZvciBzZXJ2aWNlIG5hbWUgVCwgZS5nLiBgYXV0aGAsIGBhdXRoLWludGVybmFsYFxuICovXG5leHBvcnQgY2xhc3MgQ29tcG9uZW50PFQgZXh0ZW5kcyBOYW1lID0gTmFtZT4ge1xuICBtdWx0aXBsZUluc3RhbmNlcyA9IGZhbHNlO1xuICAvKipcbiAgICogUHJvcGVydGllcyB0byBiZSBhZGRlZCB0byB0aGUgc2VydmljZSBuYW1lc3BhY2VcbiAgICovXG4gIHNlcnZpY2VQcm9wczogRGljdGlvbmFyeSA9IHt9O1xuXG4gIGluc3RhbnRpYXRpb25Nb2RlID0gSW5zdGFudGlhdGlvbk1vZGUuTEFaWTtcblxuICBvbkluc3RhbmNlQ3JlYXRlZDogb25JbnN0YW5jZUNyZWF0ZWRDYWxsYmFjazxUPiB8IG51bGwgPSBudWxsO1xuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0gbmFtZSBUaGUgcHVibGljIHNlcnZpY2UgbmFtZSwgZS5nLiBhcHAsIGF1dGgsIGZpcmVzdG9yZSwgZGF0YWJhc2VcbiAgICogQHBhcmFtIGluc3RhbmNlRmFjdG9yeSBTZXJ2aWNlIGZhY3RvcnkgcmVzcG9uc2libGUgZm9yIGNyZWF0aW5nIHRoZSBwdWJsaWMgaW50ZXJmYWNlXG4gICAqIEBwYXJhbSB0eXBlIHdoZXRoZXIgdGhlIHNlcnZpY2UgcHJvdmlkZWQgYnkgdGhlIGNvbXBvbmVudCBpcyBwdWJsaWMgb3IgcHJpdmF0ZVxuICAgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgcmVhZG9ubHkgbmFtZTogVCxcbiAgICByZWFkb25seSBpbnN0YW5jZUZhY3Rvcnk6IEluc3RhbmNlRmFjdG9yeTxUPixcbiAgICByZWFkb25seSB0eXBlOiBDb21wb25lbnRUeXBlXG4gICkge31cblxuICBzZXRJbnN0YW50aWF0aW9uTW9kZShtb2RlOiBJbnN0YW50aWF0aW9uTW9kZSk6IHRoaXMge1xuICAgIHRoaXMuaW5zdGFudGlhdGlvbk1vZGUgPSBtb2RlO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgc2V0TXVsdGlwbGVJbnN0YW5jZXMobXVsdGlwbGVJbnN0YW5jZXM6IGJvb2xlYW4pOiB0aGlzIHtcbiAgICB0aGlzLm11bHRpcGxlSW5zdGFuY2VzID0gbXVsdGlwbGVJbnN0YW5jZXM7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBzZXRTZXJ2aWNlUHJvcHMocHJvcHM6IERpY3Rpb25hcnkpOiB0aGlzIHtcbiAgICB0aGlzLnNlcnZpY2VQcm9wcyA9IHByb3BzO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgc2V0SW5zdGFuY2VDcmVhdGVkQ2FsbGJhY2soY2FsbGJhY2s6IG9uSW5zdGFuY2VDcmVhdGVkQ2FsbGJhY2s8VD4pOiB0aGlzIHtcbiAgICB0aGlzLm9uSW5zdGFuY2VDcmVhdGVkID0gY2FsbGJhY2s7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn1cbiIsICIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9FTlRSWV9OQU1FID0gJ1tERUZBVUxUXSc7XG4iLCAiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgRGVmZXJyZWQgfSBmcm9tICdAZmlyZWJhc2UvdXRpbCc7XG5pbXBvcnQgeyBDb21wb25lbnRDb250YWluZXIgfSBmcm9tICcuL2NvbXBvbmVudF9jb250YWluZXInO1xuaW1wb3J0IHsgREVGQVVMVF9FTlRSWV9OQU1FIH0gZnJvbSAnLi9jb25zdGFudHMnO1xuaW1wb3J0IHtcbiAgSW5pdGlhbGl6ZU9wdGlvbnMsXG4gIEluc3RhbnRpYXRpb25Nb2RlLFxuICBOYW1lLFxuICBOYW1lU2VydmljZU1hcHBpbmcsXG4gIE9uSW5pdENhbGxCYWNrXG59IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnQnO1xuXG4vKipcbiAqIFByb3ZpZGVyIGZvciBpbnN0YW5jZSBmb3Igc2VydmljZSBuYW1lIFQsIGUuZy4gJ2F1dGgnLCAnYXV0aC1pbnRlcm5hbCdcbiAqIE5hbWVTZXJ2aWNlTWFwcGluZ1tUXSBpcyBhbiBhbGlhcyBmb3IgdGhlIHR5cGUgb2YgdGhlIGluc3RhbmNlXG4gKi9cbmV4cG9ydCBjbGFzcyBQcm92aWRlcjxUIGV4dGVuZHMgTmFtZT4ge1xuICBwcml2YXRlIGNvbXBvbmVudDogQ29tcG9uZW50PFQ+IHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgcmVhZG9ubHkgaW5zdGFuY2VzOiBNYXA8c3RyaW5nLCBOYW1lU2VydmljZU1hcHBpbmdbVF0+ID0gbmV3IE1hcCgpO1xuICBwcml2YXRlIHJlYWRvbmx5IGluc3RhbmNlc0RlZmVycmVkOiBNYXA8XG4gICAgc3RyaW5nLFxuICAgIERlZmVycmVkPE5hbWVTZXJ2aWNlTWFwcGluZ1tUXT5cbiAgPiA9IG5ldyBNYXAoKTtcbiAgcHJpdmF0ZSByZWFkb25seSBpbnN0YW5jZXNPcHRpb25zOiBNYXA8c3RyaW5nLCBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPj4gPVxuICAgIG5ldyBNYXAoKTtcbiAgcHJpdmF0ZSBvbkluaXRDYWxsYmFja3M6IE1hcDxzdHJpbmcsIFNldDxPbkluaXRDYWxsQmFjazxUPj4+ID0gbmV3IE1hcCgpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcmVhZG9ubHkgbmFtZTogVCxcbiAgICBwcml2YXRlIHJlYWRvbmx5IGNvbnRhaW5lcjogQ29tcG9uZW50Q29udGFpbmVyXG4gICkge31cblxuICAvKipcbiAgICogQHBhcmFtIGlkZW50aWZpZXIgQSBwcm92aWRlciBjYW4gcHJvdmlkZSBtdWxpdHBsZSBpbnN0YW5jZXMgb2YgYSBzZXJ2aWNlXG4gICAqIGlmIHRoaXMuY29tcG9uZW50Lm11bHRpcGxlSW5zdGFuY2VzIGlzIHRydWUuXG4gICAqL1xuICBnZXQoaWRlbnRpZmllcj86IHN0cmluZyk6IFByb21pc2U8TmFtZVNlcnZpY2VNYXBwaW5nW1RdPiB7XG4gICAgLy8gaWYgbXVsdGlwbGVJbnN0YW5jZXMgaXMgbm90IHN1cHBvcnRlZCwgdXNlIHRoZSBkZWZhdWx0IG5hbWVcbiAgICBjb25zdCBub3JtYWxpemVkSWRlbnRpZmllciA9IHRoaXMubm9ybWFsaXplSW5zdGFuY2VJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuXG4gICAgaWYgKCF0aGlzLmluc3RhbmNlc0RlZmVycmVkLmhhcyhub3JtYWxpemVkSWRlbnRpZmllcikpIHtcbiAgICAgIGNvbnN0IGRlZmVycmVkID0gbmV3IERlZmVycmVkPE5hbWVTZXJ2aWNlTWFwcGluZ1tUXT4oKTtcbiAgICAgIHRoaXMuaW5zdGFuY2VzRGVmZXJyZWQuc2V0KG5vcm1hbGl6ZWRJZGVudGlmaWVyLCBkZWZlcnJlZCk7XG5cbiAgICAgIGlmIChcbiAgICAgICAgdGhpcy5pc0luaXRpYWxpemVkKG5vcm1hbGl6ZWRJZGVudGlmaWVyKSB8fFxuICAgICAgICB0aGlzLnNob3VsZEF1dG9Jbml0aWFsaXplKClcbiAgICAgICkge1xuICAgICAgICAvLyBpbml0aWFsaXplIHRoZSBzZXJ2aWNlIGlmIGl0IGNhbiBiZSBhdXRvLWluaXRpYWxpemVkXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLmdldE9ySW5pdGlhbGl6ZVNlcnZpY2Uoe1xuICAgICAgICAgICAgaW5zdGFuY2VJZGVudGlmaWVyOiBub3JtYWxpemVkSWRlbnRpZmllclxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmIChpbnN0YW5jZSkge1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShpbnN0YW5jZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgLy8gd2hlbiB0aGUgaW5zdGFuY2UgZmFjdG9yeSB0aHJvd3MgYW4gZXhjZXB0aW9uIGR1cmluZyBnZXQoKSwgaXQgc2hvdWxkIG5vdCBjYXVzZVxuICAgICAgICAgIC8vIGEgZmF0YWwgZXJyb3IuIFdlIGp1c3QgcmV0dXJuIHRoZSB1bnJlc29sdmVkIHByb21pc2UgaW4gdGhpcyBjYXNlLlxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaW5zdGFuY2VzRGVmZXJyZWQuZ2V0KG5vcm1hbGl6ZWRJZGVudGlmaWVyKSEucHJvbWlzZTtcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0gb3B0aW9ucy5pZGVudGlmaWVyIEEgcHJvdmlkZXIgY2FuIHByb3ZpZGUgbXVsaXRwbGUgaW5zdGFuY2VzIG9mIGEgc2VydmljZVxuICAgKiBpZiB0aGlzLmNvbXBvbmVudC5tdWx0aXBsZUluc3RhbmNlcyBpcyB0cnVlLlxuICAgKiBAcGFyYW0gb3B0aW9ucy5vcHRpb25hbCBJZiBvcHRpb25hbCBpcyBmYWxzZSBvciBub3QgcHJvdmlkZWQsIHRoZSBtZXRob2QgdGhyb3dzIGFuIGVycm9yIHdoZW5cbiAgICogdGhlIHNlcnZpY2UgaXMgbm90IGltbWVkaWF0ZWx5IGF2YWlsYWJsZS5cbiAgICogSWYgb3B0aW9uYWwgaXMgdHJ1ZSwgdGhlIG1ldGhvZCByZXR1cm5zIG51bGwgaWYgdGhlIHNlcnZpY2UgaXMgbm90IGltbWVkaWF0ZWx5IGF2YWlsYWJsZS5cbiAgICovXG4gIGdldEltbWVkaWF0ZShvcHRpb25zOiB7XG4gICAgaWRlbnRpZmllcj86IHN0cmluZztcbiAgICBvcHRpb25hbDogdHJ1ZTtcbiAgfSk6IE5hbWVTZXJ2aWNlTWFwcGluZ1tUXSB8IG51bGw7XG4gIGdldEltbWVkaWF0ZShvcHRpb25zPzoge1xuICAgIGlkZW50aWZpZXI/OiBzdHJpbmc7XG4gICAgb3B0aW9uYWw/OiBmYWxzZTtcbiAgfSk6IE5hbWVTZXJ2aWNlTWFwcGluZ1tUXTtcbiAgZ2V0SW1tZWRpYXRlKG9wdGlvbnM/OiB7XG4gICAgaWRlbnRpZmllcj86IHN0cmluZztcbiAgICBvcHRpb25hbD86IGJvb2xlYW47XG4gIH0pOiBOYW1lU2VydmljZU1hcHBpbmdbVF0gfCBudWxsIHtcbiAgICAvLyBpZiBtdWx0aXBsZUluc3RhbmNlcyBpcyBub3Qgc3VwcG9ydGVkLCB1c2UgdGhlIGRlZmF1bHQgbmFtZVxuICAgIGNvbnN0IG5vcm1hbGl6ZWRJZGVudGlmaWVyID0gdGhpcy5ub3JtYWxpemVJbnN0YW5jZUlkZW50aWZpZXIoXG4gICAgICBvcHRpb25zPy5pZGVudGlmaWVyXG4gICAgKTtcbiAgICBjb25zdCBvcHRpb25hbCA9IG9wdGlvbnM/Lm9wdGlvbmFsID8/IGZhbHNlO1xuXG4gICAgaWYgKFxuICAgICAgdGhpcy5pc0luaXRpYWxpemVkKG5vcm1hbGl6ZWRJZGVudGlmaWVyKSB8fFxuICAgICAgdGhpcy5zaG91bGRBdXRvSW5pdGlhbGl6ZSgpXG4gICAgKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRPckluaXRpYWxpemVTZXJ2aWNlKHtcbiAgICAgICAgICBpbnN0YW5jZUlkZW50aWZpZXI6IG5vcm1hbGl6ZWRJZGVudGlmaWVyXG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBpZiAob3B0aW9uYWwpIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEluIGNhc2UgYSBjb21wb25lbnQgaXMgbm90IGluaXRpYWxpemVkIGFuZCBzaG91bGQvY2FuIG5vdCBiZSBhdXRvLWluaXRpYWxpemVkIGF0IHRoZSBtb21lbnQsIHJldHVybiBudWxsIGlmIHRoZSBvcHRpb25hbCBmbGFnIGlzIHNldCwgb3IgdGhyb3dcbiAgICAgIGlmIChvcHRpb25hbCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IEVycm9yKGBTZXJ2aWNlICR7dGhpcy5uYW1lfSBpcyBub3QgYXZhaWxhYmxlYCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZ2V0Q29tcG9uZW50KCk6IENvbXBvbmVudDxUPiB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLmNvbXBvbmVudDtcbiAgfVxuXG4gIHNldENvbXBvbmVudChjb21wb25lbnQ6IENvbXBvbmVudDxUPik6IHZvaWQge1xuICAgIGlmIChjb21wb25lbnQubmFtZSAhPT0gdGhpcy5uYW1lKSB7XG4gICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgYE1pc21hdGNoaW5nIENvbXBvbmVudCAke2NvbXBvbmVudC5uYW1lfSBmb3IgUHJvdmlkZXIgJHt0aGlzLm5hbWV9LmBcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY29tcG9uZW50KSB7XG4gICAgICB0aHJvdyBFcnJvcihgQ29tcG9uZW50IGZvciAke3RoaXMubmFtZX0gaGFzIGFscmVhZHkgYmVlbiBwcm92aWRlZGApO1xuICAgIH1cblxuICAgIHRoaXMuY29tcG9uZW50ID0gY29tcG9uZW50O1xuXG4gICAgLy8gcmV0dXJuIGVhcmx5IHdpdGhvdXQgYXR0ZW1wdGluZyB0byBpbml0aWFsaXplIHRoZSBjb21wb25lbnQgaWYgdGhlIGNvbXBvbmVudCByZXF1aXJlcyBleHBsaWNpdCBpbml0aWFsaXphdGlvbiAoY2FsbGluZyBgUHJvdmlkZXIuaW5pdGlhbGl6ZSgpYClcbiAgICBpZiAoIXRoaXMuc2hvdWxkQXV0b0luaXRpYWxpemUoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIGlmIHRoZSBzZXJ2aWNlIGlzIGVhZ2VyLCBpbml0aWFsaXplIHRoZSBkZWZhdWx0IGluc3RhbmNlXG4gICAgaWYgKGlzQ29tcG9uZW50RWFnZXIoY29tcG9uZW50KSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdGhpcy5nZXRPckluaXRpYWxpemVTZXJ2aWNlKHsgaW5zdGFuY2VJZGVudGlmaWVyOiBERUZBVUxUX0VOVFJZX05BTUUgfSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIHdoZW4gdGhlIGluc3RhbmNlIGZhY3RvcnkgZm9yIGFuIGVhZ2VyIENvbXBvbmVudCB0aHJvd3MgYW4gZXhjZXB0aW9uIGR1cmluZyB0aGUgZWFnZXJcbiAgICAgICAgLy8gaW5pdGlhbGl6YXRpb24sIGl0IHNob3VsZCBub3QgY2F1c2UgYSBmYXRhbCBlcnJvci5cbiAgICAgICAgLy8gVE9ETzogSW52ZXN0aWdhdGUgaWYgd2UgbmVlZCB0byBtYWtlIGl0IGNvbmZpZ3VyYWJsZSwgYmVjYXVzZSBzb21lIGNvbXBvbmVudCBtYXkgd2FudCB0byBjYXVzZVxuICAgICAgICAvLyBhIGZhdGFsIGVycm9yIGluIHRoaXMgY2FzZT9cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBDcmVhdGUgc2VydmljZSBpbnN0YW5jZXMgZm9yIHRoZSBwZW5kaW5nIHByb21pc2VzIGFuZCByZXNvbHZlIHRoZW1cbiAgICAvLyBOT1RFOiBpZiB0aGlzLm11bHRpcGxlSW5zdGFuY2VzIGlzIGZhbHNlLCBvbmx5IHRoZSBkZWZhdWx0IGluc3RhbmNlIHdpbGwgYmUgY3JlYXRlZFxuICAgIC8vIGFuZCBhbGwgcHJvbWlzZXMgd2l0aCByZXNvbHZlIHdpdGggaXQgcmVnYXJkbGVzcyBvZiB0aGUgaWRlbnRpZmllci5cbiAgICBmb3IgKGNvbnN0IFtcbiAgICAgIGluc3RhbmNlSWRlbnRpZmllcixcbiAgICAgIGluc3RhbmNlRGVmZXJyZWRcbiAgICBdIG9mIHRoaXMuaW5zdGFuY2VzRGVmZXJyZWQuZW50cmllcygpKSB7XG4gICAgICBjb25zdCBub3JtYWxpemVkSWRlbnRpZmllciA9XG4gICAgICAgIHRoaXMubm9ybWFsaXplSW5zdGFuY2VJZGVudGlmaWVyKGluc3RhbmNlSWRlbnRpZmllcik7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIGBnZXRPckluaXRpYWxpemVTZXJ2aWNlKClgIHNob3VsZCBhbHdheXMgcmV0dXJuIGEgdmFsaWQgaW5zdGFuY2Ugc2luY2UgYSBjb21wb25lbnQgaXMgZ3VhcmFudGVlZC4gdXNlICEgdG8gbWFrZSB0eXBlc2NyaXB0IGhhcHB5LlxuICAgICAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuZ2V0T3JJbml0aWFsaXplU2VydmljZSh7XG4gICAgICAgICAgaW5zdGFuY2VJZGVudGlmaWVyOiBub3JtYWxpemVkSWRlbnRpZmllclxuICAgICAgICB9KSE7XG4gICAgICAgIGluc3RhbmNlRGVmZXJyZWQucmVzb2x2ZShpbnN0YW5jZSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIHdoZW4gdGhlIGluc3RhbmNlIGZhY3RvcnkgdGhyb3dzIGFuIGV4Y2VwdGlvbiwgaXQgc2hvdWxkIG5vdCBjYXVzZVxuICAgICAgICAvLyBhIGZhdGFsIGVycm9yLiBXZSBqdXN0IGxlYXZlIHRoZSBwcm9taXNlIHVucmVzb2x2ZWQuXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY2xlYXJJbnN0YW5jZShpZGVudGlmaWVyOiBzdHJpbmcgPSBERUZBVUxUX0VOVFJZX05BTUUpOiB2b2lkIHtcbiAgICB0aGlzLmluc3RhbmNlc0RlZmVycmVkLmRlbGV0ZShpZGVudGlmaWVyKTtcbiAgICB0aGlzLmluc3RhbmNlc09wdGlvbnMuZGVsZXRlKGlkZW50aWZpZXIpO1xuICAgIHRoaXMuaW5zdGFuY2VzLmRlbGV0ZShpZGVudGlmaWVyKTtcbiAgfVxuXG4gIC8vIGFwcC5kZWxldGUoKSB3aWxsIGNhbGwgdGhpcyBtZXRob2Qgb24gZXZlcnkgcHJvdmlkZXIgdG8gZGVsZXRlIHRoZSBzZXJ2aWNlc1xuICAvLyBUT0RPOiBzaG91bGQgd2UgbWFyayB0aGUgcHJvdmlkZXIgYXMgZGVsZXRlZD9cbiAgYXN5bmMgZGVsZXRlKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHNlcnZpY2VzID0gQXJyYXkuZnJvbSh0aGlzLmluc3RhbmNlcy52YWx1ZXMoKSk7XG5cbiAgICBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICAuLi5zZXJ2aWNlc1xuICAgICAgICAuZmlsdGVyKHNlcnZpY2UgPT4gJ0lOVEVSTkFMJyBpbiBzZXJ2aWNlKSAvLyBsZWdhY3kgc2VydmljZXNcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbiAgICAgICAgLm1hcChzZXJ2aWNlID0+IChzZXJ2aWNlIGFzIGFueSkuSU5URVJOQUwhLmRlbGV0ZSgpKSxcbiAgICAgIC4uLnNlcnZpY2VzXG4gICAgICAgIC5maWx0ZXIoc2VydmljZSA9PiAnX2RlbGV0ZScgaW4gc2VydmljZSkgLy8gbW9kdWxhcml6ZWQgc2VydmljZXNcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbiAgICAgICAgLm1hcChzZXJ2aWNlID0+IChzZXJ2aWNlIGFzIGFueSkuX2RlbGV0ZSgpKVxuICAgIF0pO1xuICB9XG5cbiAgaXNDb21wb25lbnRTZXQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuY29tcG9uZW50ICE9IG51bGw7XG4gIH1cblxuICBpc0luaXRpYWxpemVkKGlkZW50aWZpZXI6IHN0cmluZyA9IERFRkFVTFRfRU5UUllfTkFNRSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmluc3RhbmNlcy5oYXMoaWRlbnRpZmllcik7XG4gIH1cblxuICBnZXRPcHRpb25zKGlkZW50aWZpZXI6IHN0cmluZyA9IERFRkFVTFRfRU5UUllfTkFNRSk6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IHtcbiAgICByZXR1cm4gdGhpcy5pbnN0YW5jZXNPcHRpb25zLmdldChpZGVudGlmaWVyKSB8fCB7fTtcbiAgfVxuXG4gIGluaXRpYWxpemUob3B0czogSW5pdGlhbGl6ZU9wdGlvbnMgPSB7fSk6IE5hbWVTZXJ2aWNlTWFwcGluZ1tUXSB7XG4gICAgY29uc3QgeyBvcHRpb25zID0ge30gfSA9IG9wdHM7XG4gICAgY29uc3Qgbm9ybWFsaXplZElkZW50aWZpZXIgPSB0aGlzLm5vcm1hbGl6ZUluc3RhbmNlSWRlbnRpZmllcihcbiAgICAgIG9wdHMuaW5zdGFuY2VJZGVudGlmaWVyXG4gICAgKTtcbiAgICBpZiAodGhpcy5pc0luaXRpYWxpemVkKG5vcm1hbGl6ZWRJZGVudGlmaWVyKSkge1xuICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgIGAke3RoaXMubmFtZX0oJHtub3JtYWxpemVkSWRlbnRpZmllcn0pIGhhcyBhbHJlYWR5IGJlZW4gaW5pdGlhbGl6ZWRgXG4gICAgICApO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5pc0NvbXBvbmVudFNldCgpKSB7XG4gICAgICB0aHJvdyBFcnJvcihgQ29tcG9uZW50ICR7dGhpcy5uYW1lfSBoYXMgbm90IGJlZW4gcmVnaXN0ZXJlZCB5ZXRgKTtcbiAgICB9XG5cbiAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuZ2V0T3JJbml0aWFsaXplU2VydmljZSh7XG4gICAgICBpbnN0YW5jZUlkZW50aWZpZXI6IG5vcm1hbGl6ZWRJZGVudGlmaWVyLFxuICAgICAgb3B0aW9uc1xuICAgIH0pITtcblxuICAgIC8vIHJlc29sdmUgYW55IHBlbmRpbmcgcHJvbWlzZSB3YWl0aW5nIGZvciB0aGUgc2VydmljZSBpbnN0YW5jZVxuICAgIGZvciAoY29uc3QgW1xuICAgICAgaW5zdGFuY2VJZGVudGlmaWVyLFxuICAgICAgaW5zdGFuY2VEZWZlcnJlZFxuICAgIF0gb2YgdGhpcy5pbnN0YW5jZXNEZWZlcnJlZC5lbnRyaWVzKCkpIHtcbiAgICAgIGNvbnN0IG5vcm1hbGl6ZWREZWZlcnJlZElkZW50aWZpZXIgPVxuICAgICAgICB0aGlzLm5vcm1hbGl6ZUluc3RhbmNlSWRlbnRpZmllcihpbnN0YW5jZUlkZW50aWZpZXIpO1xuICAgICAgaWYgKG5vcm1hbGl6ZWRJZGVudGlmaWVyID09PSBub3JtYWxpemVkRGVmZXJyZWRJZGVudGlmaWVyKSB7XG4gICAgICAgIGluc3RhbmNlRGVmZXJyZWQucmVzb2x2ZShpbnN0YW5jZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGluc3RhbmNlO1xuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSBjYWxsYmFjayAtIGEgZnVuY3Rpb24gdGhhdCB3aWxsIGJlIGludm9rZWQgIGFmdGVyIHRoZSBwcm92aWRlciBoYXMgYmVlbiBpbml0aWFsaXplZCBieSBjYWxsaW5nIHByb3ZpZGVyLmluaXRpYWxpemUoKS5cbiAgICogVGhlIGZ1bmN0aW9uIGlzIGludm9rZWQgU1lOQ0hST05PVVNMWSwgc28gaXQgc2hvdWxkIG5vdCBleGVjdXRlIGFueSBsb25ncnVubmluZyB0YXNrcyBpbiBvcmRlciB0byBub3QgYmxvY2sgdGhlIHByb2dyYW0uXG4gICAqXG4gICAqIEBwYXJhbSBpZGVudGlmaWVyIEFuIG9wdGlvbmFsIGluc3RhbmNlIGlkZW50aWZpZXJcbiAgICogQHJldHVybnMgYSBmdW5jdGlvbiB0byB1bnJlZ2lzdGVyIHRoZSBjYWxsYmFja1xuICAgKi9cbiAgb25Jbml0KGNhbGxiYWNrOiBPbkluaXRDYWxsQmFjazxUPiwgaWRlbnRpZmllcj86IHN0cmluZyk6ICgpID0+IHZvaWQge1xuICAgIGNvbnN0IG5vcm1hbGl6ZWRJZGVudGlmaWVyID0gdGhpcy5ub3JtYWxpemVJbnN0YW5jZUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgY29uc3QgZXhpc3RpbmdDYWxsYmFja3MgPVxuICAgICAgdGhpcy5vbkluaXRDYWxsYmFja3MuZ2V0KG5vcm1hbGl6ZWRJZGVudGlmaWVyKSA/P1xuICAgICAgbmV3IFNldDxPbkluaXRDYWxsQmFjazxUPj4oKTtcbiAgICBleGlzdGluZ0NhbGxiYWNrcy5hZGQoY2FsbGJhY2spO1xuICAgIHRoaXMub25Jbml0Q2FsbGJhY2tzLnNldChub3JtYWxpemVkSWRlbnRpZmllciwgZXhpc3RpbmdDYWxsYmFja3MpO1xuXG4gICAgY29uc3QgZXhpc3RpbmdJbnN0YW5jZSA9IHRoaXMuaW5zdGFuY2VzLmdldChub3JtYWxpemVkSWRlbnRpZmllcik7XG4gICAgaWYgKGV4aXN0aW5nSW5zdGFuY2UpIHtcbiAgICAgIGNhbGxiYWNrKGV4aXN0aW5nSW5zdGFuY2UsIG5vcm1hbGl6ZWRJZGVudGlmaWVyKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgZXhpc3RpbmdDYWxsYmFja3MuZGVsZXRlKGNhbGxiYWNrKTtcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIEludm9rZSBvbkluaXQgY2FsbGJhY2tzIHN5bmNocm9ub3VzbHlcbiAgICogQHBhcmFtIGluc3RhbmNlIHRoZSBzZXJ2aWNlIGluc3RhbmNlYFxuICAgKi9cbiAgcHJpdmF0ZSBpbnZva2VPbkluaXRDYWxsYmFja3MoXG4gICAgaW5zdGFuY2U6IE5hbWVTZXJ2aWNlTWFwcGluZ1tUXSxcbiAgICBpZGVudGlmaWVyOiBzdHJpbmdcbiAgKTogdm9pZCB7XG4gICAgY29uc3QgY2FsbGJhY2tzID0gdGhpcy5vbkluaXRDYWxsYmFja3MuZ2V0KGlkZW50aWZpZXIpO1xuICAgIGlmICghY2FsbGJhY2tzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGZvciAoY29uc3QgY2FsbGJhY2sgb2YgY2FsbGJhY2tzKSB7XG4gICAgICB0cnkge1xuICAgICAgICBjYWxsYmFjayhpbnN0YW5jZSwgaWRlbnRpZmllcik7XG4gICAgICB9IGNhdGNoIHtcbiAgICAgICAgLy8gaWdub3JlIGVycm9ycyBpbiB0aGUgb25Jbml0IGNhbGxiYWNrXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBnZXRPckluaXRpYWxpemVTZXJ2aWNlKHtcbiAgICBpbnN0YW5jZUlkZW50aWZpZXIsXG4gICAgb3B0aW9ucyA9IHt9XG4gIH06IHtcbiAgICBpbnN0YW5jZUlkZW50aWZpZXI6IHN0cmluZztcbiAgICBvcHRpb25zPzogUmVjb3JkPHN0cmluZywgdW5rbm93bj47XG4gIH0pOiBOYW1lU2VydmljZU1hcHBpbmdbVF0gfCBudWxsIHtcbiAgICBsZXQgaW5zdGFuY2UgPSB0aGlzLmluc3RhbmNlcy5nZXQoaW5zdGFuY2VJZGVudGlmaWVyKTtcbiAgICBpZiAoIWluc3RhbmNlICYmIHRoaXMuY29tcG9uZW50KSB7XG4gICAgICBpbnN0YW5jZSA9IHRoaXMuY29tcG9uZW50Lmluc3RhbmNlRmFjdG9yeSh0aGlzLmNvbnRhaW5lciwge1xuICAgICAgICBpbnN0YW5jZUlkZW50aWZpZXI6IG5vcm1hbGl6ZUlkZW50aWZpZXJGb3JGYWN0b3J5KGluc3RhbmNlSWRlbnRpZmllciksXG4gICAgICAgIG9wdGlvbnNcbiAgICAgIH0pO1xuICAgICAgdGhpcy5pbnN0YW5jZXMuc2V0KGluc3RhbmNlSWRlbnRpZmllciwgaW5zdGFuY2UpO1xuICAgICAgdGhpcy5pbnN0YW5jZXNPcHRpb25zLnNldChpbnN0YW5jZUlkZW50aWZpZXIsIG9wdGlvbnMpO1xuXG4gICAgICAvKipcbiAgICAgICAqIEludm9rZSBvbkluaXQgbGlzdGVuZXJzLlxuICAgICAgICogTm90ZSB0aGlzLmNvbXBvbmVudC5vbkluc3RhbmNlQ3JlYXRlZCBpcyBkaWZmZXJlbnQsIHdoaWNoIGlzIHVzZWQgYnkgdGhlIGNvbXBvbmVudCBjcmVhdG9yLFxuICAgICAgICogd2hpbGUgb25Jbml0IGxpc3RlbmVycyBhcmUgcmVnaXN0ZXJlZCBieSBjb25zdW1lcnMgb2YgdGhlIHByb3ZpZGVyLlxuICAgICAgICovXG4gICAgICB0aGlzLmludm9rZU9uSW5pdENhbGxiYWNrcyhpbnN0YW5jZSwgaW5zdGFuY2VJZGVudGlmaWVyKTtcblxuICAgICAgLyoqXG4gICAgICAgKiBPcmRlciBpcyBpbXBvcnRhbnRcbiAgICAgICAqIG9uSW5zdGFuY2VDcmVhdGVkKCkgc2hvdWxkIGJlIGNhbGxlZCBhZnRlciB0aGlzLmluc3RhbmNlcy5zZXQoaW5zdGFuY2VJZGVudGlmaWVyLCBpbnN0YW5jZSk7IHdoaWNoXG4gICAgICAgKiBtYWtlcyBgaXNJbml0aWFsaXplZCgpYCByZXR1cm4gdHJ1ZS5cbiAgICAgICAqL1xuICAgICAgaWYgKHRoaXMuY29tcG9uZW50Lm9uSW5zdGFuY2VDcmVhdGVkKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdGhpcy5jb21wb25lbnQub25JbnN0YW5jZUNyZWF0ZWQoXG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lcixcbiAgICAgICAgICAgIGluc3RhbmNlSWRlbnRpZmllcixcbiAgICAgICAgICAgIGluc3RhbmNlXG4gICAgICAgICAgKTtcbiAgICAgICAgfSBjYXRjaCB7XG4gICAgICAgICAgLy8gaWdub3JlIGVycm9ycyBpbiB0aGUgb25JbnN0YW5jZUNyZWF0ZWRDYWxsYmFja1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGluc3RhbmNlIHx8IG51bGw7XG4gIH1cblxuICBwcml2YXRlIG5vcm1hbGl6ZUluc3RhbmNlSWRlbnRpZmllcihcbiAgICBpZGVudGlmaWVyOiBzdHJpbmcgPSBERUZBVUxUX0VOVFJZX05BTUVcbiAgKTogc3RyaW5nIHtcbiAgICBpZiAodGhpcy5jb21wb25lbnQpIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbXBvbmVudC5tdWx0aXBsZUluc3RhbmNlcyA/IGlkZW50aWZpZXIgOiBERUZBVUxUX0VOVFJZX05BTUU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBpZGVudGlmaWVyOyAvLyBhc3N1bWUgbXVsdGlwbGUgaW5zdGFuY2VzIGFyZSBzdXBwb3J0ZWQgYmVmb3JlIHRoZSBjb21wb25lbnQgaXMgcHJvdmlkZWQuXG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzaG91bGRBdXRvSW5pdGlhbGl6ZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gKFxuICAgICAgISF0aGlzLmNvbXBvbmVudCAmJlxuICAgICAgdGhpcy5jb21wb25lbnQuaW5zdGFudGlhdGlvbk1vZGUgIT09IEluc3RhbnRpYXRpb25Nb2RlLkVYUExJQ0lUXG4gICAgKTtcbiAgfVxufVxuXG4vLyB1bmRlZmluZWQgc2hvdWxkIGJlIHBhc3NlZCB0byB0aGUgc2VydmljZSBmYWN0b3J5IGZvciB0aGUgZGVmYXVsdCBpbnN0YW5jZVxuZnVuY3Rpb24gbm9ybWFsaXplSWRlbnRpZmllckZvckZhY3RvcnkoaWRlbnRpZmllcjogc3RyaW5nKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgcmV0dXJuIGlkZW50aWZpZXIgPT09IERFRkFVTFRfRU5UUllfTkFNRSA/IHVuZGVmaW5lZCA6IGlkZW50aWZpZXI7XG59XG5cbmZ1bmN0aW9uIGlzQ29tcG9uZW50RWFnZXI8VCBleHRlbmRzIE5hbWU+KGNvbXBvbmVudDogQ29tcG9uZW50PFQ+KTogYm9vbGVhbiB7XG4gIHJldHVybiBjb21wb25lbnQuaW5zdGFudGlhdGlvbk1vZGUgPT09IEluc3RhbnRpYXRpb25Nb2RlLkVBR0VSO1xufVxuIiwgIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IFByb3ZpZGVyIH0gZnJvbSAnLi9wcm92aWRlcic7XG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudCc7XG5pbXBvcnQgeyBOYW1lIH0gZnJvbSAnLi90eXBlcyc7XG5cbi8qKlxuICogQ29tcG9uZW50Q29udGFpbmVyIHRoYXQgcHJvdmlkZXMgUHJvdmlkZXJzIGZvciBzZXJ2aWNlIG5hbWUgVCwgZS5nLiBgYXV0aGAsIGBhdXRoLWludGVybmFsYFxuICovXG5leHBvcnQgY2xhc3MgQ29tcG9uZW50Q29udGFpbmVyIHtcbiAgcHJpdmF0ZSByZWFkb25seSBwcm92aWRlcnMgPSBuZXcgTWFwPHN0cmluZywgUHJvdmlkZXI8TmFtZT4+KCk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBuYW1lOiBzdHJpbmcpIHt9XG5cbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSBjb21wb25lbnQgQ29tcG9uZW50IGJlaW5nIGFkZGVkXG4gICAqIEBwYXJhbSBvdmVyd3JpdGUgV2hlbiBhIGNvbXBvbmVudCB3aXRoIHRoZSBzYW1lIG5hbWUgaGFzIGFscmVhZHkgYmVlbiByZWdpc3RlcmVkLFxuICAgKiBpZiBvdmVyd3JpdGUgaXMgdHJ1ZTogb3ZlcndyaXRlIHRoZSBleGlzdGluZyBjb21wb25lbnQgd2l0aCB0aGUgbmV3IGNvbXBvbmVudCBhbmQgY3JlYXRlIGEgbmV3XG4gICAqIHByb3ZpZGVyIHdpdGggdGhlIG5ldyBjb21wb25lbnQuIEl0IGNhbiBiZSB1c2VmdWwgaW4gdGVzdHMgd2hlcmUgeW91IHdhbnQgdG8gdXNlIGRpZmZlcmVudCBtb2Nrc1xuICAgKiBmb3IgZGlmZmVyZW50IHRlc3RzLlxuICAgKiBpZiBvdmVyd3JpdGUgaXMgZmFsc2U6IHRocm93IGFuIGV4Y2VwdGlvblxuICAgKi9cbiAgYWRkQ29tcG9uZW50PFQgZXh0ZW5kcyBOYW1lPihjb21wb25lbnQ6IENvbXBvbmVudDxUPik6IHZvaWQge1xuICAgIGNvbnN0IHByb3ZpZGVyID0gdGhpcy5nZXRQcm92aWRlcihjb21wb25lbnQubmFtZSk7XG4gICAgaWYgKHByb3ZpZGVyLmlzQ29tcG9uZW50U2V0KCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYENvbXBvbmVudCAke2NvbXBvbmVudC5uYW1lfSBoYXMgYWxyZWFkeSBiZWVuIHJlZ2lzdGVyZWQgd2l0aCAke3RoaXMubmFtZX1gXG4gICAgICApO1xuICAgIH1cblxuICAgIHByb3ZpZGVyLnNldENvbXBvbmVudChjb21wb25lbnQpO1xuICB9XG5cbiAgYWRkT3JPdmVyd3JpdGVDb21wb25lbnQ8VCBleHRlbmRzIE5hbWU+KGNvbXBvbmVudDogQ29tcG9uZW50PFQ+KTogdm9pZCB7XG4gICAgY29uc3QgcHJvdmlkZXIgPSB0aGlzLmdldFByb3ZpZGVyKGNvbXBvbmVudC5uYW1lKTtcbiAgICBpZiAocHJvdmlkZXIuaXNDb21wb25lbnRTZXQoKSkge1xuICAgICAgLy8gZGVsZXRlIHRoZSBleGlzdGluZyBwcm92aWRlciBmcm9tIHRoZSBjb250YWluZXIsIHNvIHdlIGNhbiByZWdpc3RlciB0aGUgbmV3IGNvbXBvbmVudFxuICAgICAgdGhpcy5wcm92aWRlcnMuZGVsZXRlKGNvbXBvbmVudC5uYW1lKTtcbiAgICB9XG5cbiAgICB0aGlzLmFkZENvbXBvbmVudChjb21wb25lbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIGdldFByb3ZpZGVyIHByb3ZpZGVzIGEgdHlwZSBzYWZlIGludGVyZmFjZSB3aGVyZSBpdCBjYW4gb25seSBiZSBjYWxsZWQgd2l0aCBhIGZpZWxkIG5hbWVcbiAgICogcHJlc2VudCBpbiBOYW1lU2VydmljZU1hcHBpbmcgaW50ZXJmYWNlLlxuICAgKlxuICAgKiBGaXJlYmFzZSBTREtzIHByb3ZpZGluZyBzZXJ2aWNlcyBzaG91bGQgZXh0ZW5kIE5hbWVTZXJ2aWNlTWFwcGluZyBpbnRlcmZhY2UgdG8gcmVnaXN0ZXJcbiAgICogdGhlbXNlbHZlcy5cbiAgICovXG4gIGdldFByb3ZpZGVyPFQgZXh0ZW5kcyBOYW1lPihuYW1lOiBUKTogUHJvdmlkZXI8VD4ge1xuICAgIGlmICh0aGlzLnByb3ZpZGVycy5oYXMobmFtZSkpIHtcbiAgICAgIHJldHVybiB0aGlzLnByb3ZpZGVycy5nZXQobmFtZSkgYXMgdW5rbm93biBhcyBQcm92aWRlcjxUPjtcbiAgICB9XG5cbiAgICAvLyBjcmVhdGUgYSBQcm92aWRlciBmb3IgYSBzZXJ2aWNlIHRoYXQgaGFzbid0IHJlZ2lzdGVyZWQgd2l0aCBGaXJlYmFzZVxuICAgIGNvbnN0IHByb3ZpZGVyID0gbmV3IFByb3ZpZGVyPFQ+KG5hbWUsIHRoaXMpO1xuICAgIHRoaXMucHJvdmlkZXJzLnNldChuYW1lLCBwcm92aWRlciBhcyB1bmtub3duIGFzIFByb3ZpZGVyPE5hbWU+KTtcblxuICAgIHJldHVybiBwcm92aWRlciBhcyBQcm92aWRlcjxUPjtcbiAgfVxuXG4gIGdldFByb3ZpZGVycygpOiBBcnJheTxQcm92aWRlcjxOYW1lPj4ge1xuICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMucHJvdmlkZXJzLnZhbHVlcygpKTtcbiAgfVxufVxuIiwgIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTENcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmV4cG9ydCB0eXBlIExvZ0xldmVsU3RyaW5nID1cbiAgfCAnZGVidWcnXG4gIHwgJ3ZlcmJvc2UnXG4gIHwgJ2luZm8nXG4gIHwgJ3dhcm4nXG4gIHwgJ2Vycm9yJ1xuICB8ICdzaWxlbnQnO1xuXG5leHBvcnQgaW50ZXJmYWNlIExvZ09wdGlvbnMge1xuICBsZXZlbDogTG9nTGV2ZWxTdHJpbmc7XG59XG5cbmV4cG9ydCB0eXBlIExvZ0NhbGxiYWNrID0gKGNhbGxiYWNrUGFyYW1zOiBMb2dDYWxsYmFja1BhcmFtcykgPT4gdm9pZDtcblxuZXhwb3J0IGludGVyZmFjZSBMb2dDYWxsYmFja1BhcmFtcyB7XG4gIGxldmVsOiBMb2dMZXZlbFN0cmluZztcbiAgbWVzc2FnZTogc3RyaW5nO1xuICBhcmdzOiB1bmtub3duW107XG4gIHR5cGU6IHN0cmluZztcbn1cblxuLyoqXG4gKiBBIGNvbnRhaW5lciBmb3IgYWxsIG9mIHRoZSBMb2dnZXIgaW5zdGFuY2VzXG4gKi9cbmV4cG9ydCBjb25zdCBpbnN0YW5jZXM6IExvZ2dlcltdID0gW107XG5cbi8qKlxuICogVGhlIEpTIFNESyBzdXBwb3J0cyA1IGxvZyBsZXZlbHMgYW5kIGFsc28gYWxsb3dzIGEgdXNlciB0aGUgYWJpbGl0eSB0b1xuICogc2lsZW5jZSB0aGUgbG9ncyBhbHRvZ2V0aGVyLlxuICpcbiAqIFRoZSBvcmRlciBpcyBhIGZvbGxvd3M6XG4gKiBERUJVRyA8IFZFUkJPU0UgPCBJTkZPIDwgV0FSTiA8IEVSUk9SXG4gKlxuICogQWxsIG9mIHRoZSBsb2cgdHlwZXMgYWJvdmUgdGhlIGN1cnJlbnQgbG9nIGxldmVsIHdpbGwgYmUgY2FwdHVyZWQgKGkuZS4gaWZcbiAqIHlvdSBzZXQgdGhlIGxvZyBsZXZlbCB0byBgSU5GT2AsIGVycm9ycyB3aWxsIHN0aWxsIGJlIGxvZ2dlZCwgYnV0IGBERUJVR2AgYW5kXG4gKiBgVkVSQk9TRWAgbG9ncyB3aWxsIG5vdClcbiAqL1xuZXhwb3J0IGVudW0gTG9nTGV2ZWwge1xuICBERUJVRyxcbiAgVkVSQk9TRSxcbiAgSU5GTyxcbiAgV0FSTixcbiAgRVJST1IsXG4gIFNJTEVOVFxufVxuXG5jb25zdCBsZXZlbFN0cmluZ1RvRW51bTogeyBba2V5IGluIExvZ0xldmVsU3RyaW5nXTogTG9nTGV2ZWwgfSA9IHtcbiAgJ2RlYnVnJzogTG9nTGV2ZWwuREVCVUcsXG4gICd2ZXJib3NlJzogTG9nTGV2ZWwuVkVSQk9TRSxcbiAgJ2luZm8nOiBMb2dMZXZlbC5JTkZPLFxuICAnd2Fybic6IExvZ0xldmVsLldBUk4sXG4gICdlcnJvcic6IExvZ0xldmVsLkVSUk9SLFxuICAnc2lsZW50JzogTG9nTGV2ZWwuU0lMRU5UXG59O1xuXG4vKipcbiAqIFRoZSBkZWZhdWx0IGxvZyBsZXZlbFxuICovXG5jb25zdCBkZWZhdWx0TG9nTGV2ZWw6IExvZ0xldmVsID0gTG9nTGV2ZWwuSU5GTztcblxuLyoqXG4gKiBXZSBhbGxvdyB1c2VycyB0aGUgYWJpbGl0eSB0byBwYXNzIHRoZWlyIG93biBsb2cgaGFuZGxlci4gV2Ugd2lsbCBwYXNzIHRoZVxuICogdHlwZSBvZiBsb2csIHRoZSBjdXJyZW50IGxvZyBsZXZlbCwgYW5kIGFueSBvdGhlciBhcmd1bWVudHMgcGFzc2VkIChpLmUuIHRoZVxuICogbWVzc2FnZXMgdGhhdCB0aGUgdXNlciB3YW50cyB0byBsb2cpIHRvIHRoaXMgZnVuY3Rpb24uXG4gKi9cbmV4cG9ydCB0eXBlIExvZ0hhbmRsZXIgPSAoXG4gIGxvZ2dlckluc3RhbmNlOiBMb2dnZXIsXG4gIGxvZ1R5cGU6IExvZ0xldmVsLFxuICAuLi5hcmdzOiB1bmtub3duW11cbikgPT4gdm9pZDtcblxuLyoqXG4gKiBCeSBkZWZhdWx0LCBgY29uc29sZS5kZWJ1Z2AgaXMgbm90IGRpc3BsYXllZCBpbiB0aGUgZGV2ZWxvcGVyIGNvbnNvbGUgKGluXG4gKiBjaHJvbWUpLiBUbyBhdm9pZCBmb3JjaW5nIHVzZXJzIHRvIGhhdmUgdG8gb3B0LWluIHRvIHRoZXNlIGxvZ3MgdHdpY2VcbiAqIChpLmUuIG9uY2UgZm9yIGZpcmViYXNlLCBhbmQgb25jZSBpbiB0aGUgY29uc29sZSksIHdlIGFyZSBzZW5kaW5nIGBERUJVR2BcbiAqIGxvZ3MgdG8gdGhlIGBjb25zb2xlLmxvZ2AgZnVuY3Rpb24uXG4gKi9cbmNvbnN0IENvbnNvbGVNZXRob2QgPSB7XG4gIFtMb2dMZXZlbC5ERUJVR106ICdsb2cnLFxuICBbTG9nTGV2ZWwuVkVSQk9TRV06ICdsb2cnLFxuICBbTG9nTGV2ZWwuSU5GT106ICdpbmZvJyxcbiAgW0xvZ0xldmVsLldBUk5dOiAnd2FybicsXG4gIFtMb2dMZXZlbC5FUlJPUl06ICdlcnJvcidcbn07XG5cbi8qKlxuICogVGhlIGRlZmF1bHQgbG9nIGhhbmRsZXIgd2lsbCBmb3J3YXJkIERFQlVHLCBWRVJCT1NFLCBJTkZPLCBXQVJOLCBhbmQgRVJST1JcbiAqIG1lc3NhZ2VzIG9uIHRvIHRoZWlyIGNvcnJlc3BvbmRpbmcgY29uc29sZSBjb3VudGVycGFydHMgKGlmIHRoZSBsb2cgbWV0aG9kXG4gKiBpcyBzdXBwb3J0ZWQgYnkgdGhlIGN1cnJlbnQgbG9nIGxldmVsKVxuICovXG5jb25zdCBkZWZhdWx0TG9nSGFuZGxlcjogTG9nSGFuZGxlciA9IChpbnN0YW5jZSwgbG9nVHlwZSwgLi4uYXJncyk6IHZvaWQgPT4ge1xuICBpZiAobG9nVHlwZSA8IGluc3RhbmNlLmxvZ0xldmVsKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKTtcbiAgY29uc3QgbWV0aG9kID0gQ29uc29sZU1ldGhvZFtsb2dUeXBlIGFzIGtleW9mIHR5cGVvZiBDb25zb2xlTWV0aG9kXTtcbiAgaWYgKG1ldGhvZCkge1xuICAgIGNvbnNvbGVbbWV0aG9kIGFzICdsb2cnIHwgJ2luZm8nIHwgJ3dhcm4nIHwgJ2Vycm9yJ10oXG4gICAgICBgWyR7bm93fV0gICR7aW5zdGFuY2UubmFtZX06YCxcbiAgICAgIC4uLmFyZ3NcbiAgICApO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGBBdHRlbXB0ZWQgdG8gbG9nIGEgbWVzc2FnZSB3aXRoIGFuIGludmFsaWQgbG9nVHlwZSAodmFsdWU6ICR7bG9nVHlwZX0pYFxuICAgICk7XG4gIH1cbn07XG5cbmV4cG9ydCBjbGFzcyBMb2dnZXIge1xuICAvKipcbiAgICogR2l2ZXMgeW91IGFuIGluc3RhbmNlIG9mIGEgTG9nZ2VyIHRvIGNhcHR1cmUgbWVzc2FnZXMgYWNjb3JkaW5nIHRvXG4gICAqIEZpcmViYXNlJ3MgbG9nZ2luZyBzY2hlbWUuXG4gICAqXG4gICAqIEBwYXJhbSBuYW1lIFRoZSBuYW1lIHRoYXQgdGhlIGxvZ3Mgd2lsbCBiZSBhc3NvY2lhdGVkIHdpdGhcbiAgICovXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcpIHtcbiAgICAvKipcbiAgICAgKiBDYXB0dXJlIHRoZSBjdXJyZW50IGluc3RhbmNlIGZvciBsYXRlciB1c2VcbiAgICAgKi9cbiAgICBpbnN0YW5jZXMucHVzaCh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgbG9nIGxldmVsIG9mIHRoZSBnaXZlbiBMb2dnZXIgaW5zdGFuY2UuXG4gICAqL1xuICBwcml2YXRlIF9sb2dMZXZlbCA9IGRlZmF1bHRMb2dMZXZlbDtcblxuICBnZXQgbG9nTGV2ZWwoKTogTG9nTGV2ZWwge1xuICAgIHJldHVybiB0aGlzLl9sb2dMZXZlbDtcbiAgfVxuXG4gIHNldCBsb2dMZXZlbCh2YWw6IExvZ0xldmVsKSB7XG4gICAgaWYgKCEodmFsIGluIExvZ0xldmVsKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgSW52YWxpZCB2YWx1ZSBcIiR7dmFsfVwiIGFzc2lnbmVkIHRvIFxcYGxvZ0xldmVsXFxgYCk7XG4gICAgfVxuICAgIHRoaXMuX2xvZ0xldmVsID0gdmFsO1xuICB9XG5cbiAgLy8gV29ya2Fyb3VuZCBmb3Igc2V0dGVyL2dldHRlciBoYXZpbmcgdG8gYmUgdGhlIHNhbWUgdHlwZS5cbiAgc2V0TG9nTGV2ZWwodmFsOiBMb2dMZXZlbCB8IExvZ0xldmVsU3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5fbG9nTGV2ZWwgPSB0eXBlb2YgdmFsID09PSAnc3RyaW5nJyA/IGxldmVsU3RyaW5nVG9FbnVtW3ZhbF0gOiB2YWw7XG4gIH1cblxuICAvKipcbiAgICogVGhlIG1haW4gKGludGVybmFsKSBsb2cgaGFuZGxlciBmb3IgdGhlIExvZ2dlciBpbnN0YW5jZS5cbiAgICogQ2FuIGJlIHNldCB0byBhIG5ldyBmdW5jdGlvbiBpbiBpbnRlcm5hbCBwYWNrYWdlIGNvZGUgYnV0IG5vdCBieSB1c2VyLlxuICAgKi9cbiAgcHJpdmF0ZSBfbG9nSGFuZGxlcjogTG9nSGFuZGxlciA9IGRlZmF1bHRMb2dIYW5kbGVyO1xuICBnZXQgbG9nSGFuZGxlcigpOiBMb2dIYW5kbGVyIHtcbiAgICByZXR1cm4gdGhpcy5fbG9nSGFuZGxlcjtcbiAgfVxuICBzZXQgbG9nSGFuZGxlcih2YWw6IExvZ0hhbmRsZXIpIHtcbiAgICBpZiAodHlwZW9mIHZhbCAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVmFsdWUgYXNzaWduZWQgdG8gYGxvZ0hhbmRsZXJgIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuICAgIH1cbiAgICB0aGlzLl9sb2dIYW5kbGVyID0gdmFsO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBvcHRpb25hbCwgYWRkaXRpb25hbCwgdXNlci1kZWZpbmVkIGxvZyBoYW5kbGVyIGZvciB0aGUgTG9nZ2VyIGluc3RhbmNlLlxuICAgKi9cbiAgcHJpdmF0ZSBfdXNlckxvZ0hhbmRsZXI6IExvZ0hhbmRsZXIgfCBudWxsID0gbnVsbDtcbiAgZ2V0IHVzZXJMb2dIYW5kbGVyKCk6IExvZ0hhbmRsZXIgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5fdXNlckxvZ0hhbmRsZXI7XG4gIH1cbiAgc2V0IHVzZXJMb2dIYW5kbGVyKHZhbDogTG9nSGFuZGxlciB8IG51bGwpIHtcbiAgICB0aGlzLl91c2VyTG9nSGFuZGxlciA9IHZhbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgZnVuY3Rpb25zIGJlbG93IGFyZSBhbGwgYmFzZWQgb24gdGhlIGBjb25zb2xlYCBpbnRlcmZhY2VcbiAgICovXG5cbiAgZGVidWcoLi4uYXJnczogdW5rbm93bltdKTogdm9pZCB7XG4gICAgdGhpcy5fdXNlckxvZ0hhbmRsZXIgJiYgdGhpcy5fdXNlckxvZ0hhbmRsZXIodGhpcywgTG9nTGV2ZWwuREVCVUcsIC4uLmFyZ3MpO1xuICAgIHRoaXMuX2xvZ0hhbmRsZXIodGhpcywgTG9nTGV2ZWwuREVCVUcsIC4uLmFyZ3MpO1xuICB9XG4gIGxvZyguLi5hcmdzOiB1bmtub3duW10pOiB2b2lkIHtcbiAgICB0aGlzLl91c2VyTG9nSGFuZGxlciAmJlxuICAgICAgdGhpcy5fdXNlckxvZ0hhbmRsZXIodGhpcywgTG9nTGV2ZWwuVkVSQk9TRSwgLi4uYXJncyk7XG4gICAgdGhpcy5fbG9nSGFuZGxlcih0aGlzLCBMb2dMZXZlbC5WRVJCT1NFLCAuLi5hcmdzKTtcbiAgfVxuICBpbmZvKC4uLmFyZ3M6IHVua25vd25bXSk6IHZvaWQge1xuICAgIHRoaXMuX3VzZXJMb2dIYW5kbGVyICYmIHRoaXMuX3VzZXJMb2dIYW5kbGVyKHRoaXMsIExvZ0xldmVsLklORk8sIC4uLmFyZ3MpO1xuICAgIHRoaXMuX2xvZ0hhbmRsZXIodGhpcywgTG9nTGV2ZWwuSU5GTywgLi4uYXJncyk7XG4gIH1cbiAgd2FybiguLi5hcmdzOiB1bmtub3duW10pOiB2b2lkIHtcbiAgICB0aGlzLl91c2VyTG9nSGFuZGxlciAmJiB0aGlzLl91c2VyTG9nSGFuZGxlcih0aGlzLCBMb2dMZXZlbC5XQVJOLCAuLi5hcmdzKTtcbiAgICB0aGlzLl9sb2dIYW5kbGVyKHRoaXMsIExvZ0xldmVsLldBUk4sIC4uLmFyZ3MpO1xuICB9XG4gIGVycm9yKC4uLmFyZ3M6IHVua25vd25bXSk6IHZvaWQge1xuICAgIHRoaXMuX3VzZXJMb2dIYW5kbGVyICYmIHRoaXMuX3VzZXJMb2dIYW5kbGVyKHRoaXMsIExvZ0xldmVsLkVSUk9SLCAuLi5hcmdzKTtcbiAgICB0aGlzLl9sb2dIYW5kbGVyKHRoaXMsIExvZ0xldmVsLkVSUk9SLCAuLi5hcmdzKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0TG9nTGV2ZWwobGV2ZWw6IExvZ0xldmVsU3RyaW5nIHwgTG9nTGV2ZWwpOiB2b2lkIHtcbiAgaW5zdGFuY2VzLmZvckVhY2goaW5zdCA9PiB7XG4gICAgaW5zdC5zZXRMb2dMZXZlbChsZXZlbCk7XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0VXNlckxvZ0hhbmRsZXIoXG4gIGxvZ0NhbGxiYWNrOiBMb2dDYWxsYmFjayB8IG51bGwsXG4gIG9wdGlvbnM/OiBMb2dPcHRpb25zXG4pOiB2b2lkIHtcbiAgZm9yIChjb25zdCBpbnN0YW5jZSBvZiBpbnN0YW5jZXMpIHtcbiAgICBsZXQgY3VzdG9tTG9nTGV2ZWw6IExvZ0xldmVsIHwgbnVsbCA9IG51bGw7XG4gICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5sZXZlbCkge1xuICAgICAgY3VzdG9tTG9nTGV2ZWwgPSBsZXZlbFN0cmluZ1RvRW51bVtvcHRpb25zLmxldmVsXTtcbiAgICB9XG4gICAgaWYgKGxvZ0NhbGxiYWNrID09PSBudWxsKSB7XG4gICAgICBpbnN0YW5jZS51c2VyTG9nSGFuZGxlciA9IG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgIGluc3RhbmNlLnVzZXJMb2dIYW5kbGVyID0gKFxuICAgICAgICBpbnN0YW5jZTogTG9nZ2VyLFxuICAgICAgICBsZXZlbDogTG9nTGV2ZWwsXG4gICAgICAgIC4uLmFyZ3M6IHVua25vd25bXVxuICAgICAgKSA9PiB7XG4gICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBhcmdzXG4gICAgICAgICAgLm1hcChhcmcgPT4ge1xuICAgICAgICAgICAgaWYgKGFyZyA9PSBudWxsKSB7XG4gICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYXJnID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICByZXR1cm4gYXJnO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYXJnID09PSAnbnVtYmVyJyB8fCB0eXBlb2YgYXJnID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGFyZy50b1N0cmluZygpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChhcmcgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICAgICAgICByZXR1cm4gYXJnLm1lc3NhZ2U7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShhcmcpO1xuICAgICAgICAgICAgICB9IGNhdGNoIChpZ25vcmVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICAgIC5maWx0ZXIoYXJnID0+IGFyZylcbiAgICAgICAgICAuam9pbignICcpO1xuICAgICAgICBpZiAobGV2ZWwgPj0gKGN1c3RvbUxvZ0xldmVsID8/IGluc3RhbmNlLmxvZ0xldmVsKSkge1xuICAgICAgICAgIGxvZ0NhbGxiYWNrKHtcbiAgICAgICAgICAgIGxldmVsOiBMb2dMZXZlbFtsZXZlbF0udG9Mb3dlckNhc2UoKSBhcyBMb2dMZXZlbFN0cmluZyxcbiAgICAgICAgICAgIG1lc3NhZ2UsXG4gICAgICAgICAgICBhcmdzLFxuICAgICAgICAgICAgdHlwZTogaW5zdGFuY2UubmFtZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgfVxufVxuIiwgImNvbnN0IGluc3RhbmNlT2ZBbnkgPSAob2JqZWN0LCBjb25zdHJ1Y3RvcnMpID0+IGNvbnN0cnVjdG9ycy5zb21lKChjKSA9PiBvYmplY3QgaW5zdGFuY2VvZiBjKTtcblxubGV0IGlkYlByb3h5YWJsZVR5cGVzO1xubGV0IGN1cnNvckFkdmFuY2VNZXRob2RzO1xuLy8gVGhpcyBpcyBhIGZ1bmN0aW9uIHRvIHByZXZlbnQgaXQgdGhyb3dpbmcgdXAgaW4gbm9kZSBlbnZpcm9ubWVudHMuXG5mdW5jdGlvbiBnZXRJZGJQcm94eWFibGVUeXBlcygpIHtcbiAgICByZXR1cm4gKGlkYlByb3h5YWJsZVR5cGVzIHx8XG4gICAgICAgIChpZGJQcm94eWFibGVUeXBlcyA9IFtcbiAgICAgICAgICAgIElEQkRhdGFiYXNlLFxuICAgICAgICAgICAgSURCT2JqZWN0U3RvcmUsXG4gICAgICAgICAgICBJREJJbmRleCxcbiAgICAgICAgICAgIElEQkN1cnNvcixcbiAgICAgICAgICAgIElEQlRyYW5zYWN0aW9uLFxuICAgICAgICBdKSk7XG59XG4vLyBUaGlzIGlzIGEgZnVuY3Rpb24gdG8gcHJldmVudCBpdCB0aHJvd2luZyB1cCBpbiBub2RlIGVudmlyb25tZW50cy5cbmZ1bmN0aW9uIGdldEN1cnNvckFkdmFuY2VNZXRob2RzKCkge1xuICAgIHJldHVybiAoY3Vyc29yQWR2YW5jZU1ldGhvZHMgfHxcbiAgICAgICAgKGN1cnNvckFkdmFuY2VNZXRob2RzID0gW1xuICAgICAgICAgICAgSURCQ3Vyc29yLnByb3RvdHlwZS5hZHZhbmNlLFxuICAgICAgICAgICAgSURCQ3Vyc29yLnByb3RvdHlwZS5jb250aW51ZSxcbiAgICAgICAgICAgIElEQkN1cnNvci5wcm90b3R5cGUuY29udGludWVQcmltYXJ5S2V5LFxuICAgICAgICBdKSk7XG59XG5jb25zdCBjdXJzb3JSZXF1ZXN0TWFwID0gbmV3IFdlYWtNYXAoKTtcbmNvbnN0IHRyYW5zYWN0aW9uRG9uZU1hcCA9IG5ldyBXZWFrTWFwKCk7XG5jb25zdCB0cmFuc2FjdGlvblN0b3JlTmFtZXNNYXAgPSBuZXcgV2Vha01hcCgpO1xuY29uc3QgdHJhbnNmb3JtQ2FjaGUgPSBuZXcgV2Vha01hcCgpO1xuY29uc3QgcmV2ZXJzZVRyYW5zZm9ybUNhY2hlID0gbmV3IFdlYWtNYXAoKTtcbmZ1bmN0aW9uIHByb21pc2lmeVJlcXVlc3QocmVxdWVzdCkge1xuICAgIGNvbnN0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGNvbnN0IHVubGlzdGVuID0gKCkgPT4ge1xuICAgICAgICAgICAgcmVxdWVzdC5yZW1vdmVFdmVudExpc3RlbmVyKCdzdWNjZXNzJywgc3VjY2Vzcyk7XG4gICAgICAgICAgICByZXF1ZXN0LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgZXJyb3IpO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBzdWNjZXNzID0gKCkgPT4ge1xuICAgICAgICAgICAgcmVzb2x2ZSh3cmFwKHJlcXVlc3QucmVzdWx0KSk7XG4gICAgICAgICAgICB1bmxpc3RlbigpO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBlcnJvciA9ICgpID0+IHtcbiAgICAgICAgICAgIHJlamVjdChyZXF1ZXN0LmVycm9yKTtcbiAgICAgICAgICAgIHVubGlzdGVuKCk7XG4gICAgICAgIH07XG4gICAgICAgIHJlcXVlc3QuYWRkRXZlbnRMaXN0ZW5lcignc3VjY2VzcycsIHN1Y2Nlc3MpO1xuICAgICAgICByZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgZXJyb3IpO1xuICAgIH0pO1xuICAgIHByb21pc2VcbiAgICAgICAgLnRoZW4oKHZhbHVlKSA9PiB7XG4gICAgICAgIC8vIFNpbmNlIGN1cnNvcmluZyByZXVzZXMgdGhlIElEQlJlcXVlc3QgKCpzaWdoKiksIHdlIGNhY2hlIGl0IGZvciBsYXRlciByZXRyaWV2YWxcbiAgICAgICAgLy8gKHNlZSB3cmFwRnVuY3Rpb24pLlxuICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBJREJDdXJzb3IpIHtcbiAgICAgICAgICAgIGN1cnNvclJlcXVlc3RNYXAuc2V0KHZhbHVlLCByZXF1ZXN0KTtcbiAgICAgICAgfVxuICAgICAgICAvLyBDYXRjaGluZyB0byBhdm9pZCBcIlVuY2F1Z2h0IFByb21pc2UgZXhjZXB0aW9uc1wiXG4gICAgfSlcbiAgICAgICAgLmNhdGNoKCgpID0+IHsgfSk7XG4gICAgLy8gVGhpcyBtYXBwaW5nIGV4aXN0cyBpbiByZXZlcnNlVHJhbnNmb3JtQ2FjaGUgYnV0IGRvZXNuJ3QgZG9lc24ndCBleGlzdCBpbiB0cmFuc2Zvcm1DYWNoZS4gVGhpc1xuICAgIC8vIGlzIGJlY2F1c2Ugd2UgY3JlYXRlIG1hbnkgcHJvbWlzZXMgZnJvbSBhIHNpbmdsZSBJREJSZXF1ZXN0LlxuICAgIHJldmVyc2VUcmFuc2Zvcm1DYWNoZS5zZXQocHJvbWlzZSwgcmVxdWVzdCk7XG4gICAgcmV0dXJuIHByb21pc2U7XG59XG5mdW5jdGlvbiBjYWNoZURvbmVQcm9taXNlRm9yVHJhbnNhY3Rpb24odHgpIHtcbiAgICAvLyBFYXJseSBiYWlsIGlmIHdlJ3ZlIGFscmVhZHkgY3JlYXRlZCBhIGRvbmUgcHJvbWlzZSBmb3IgdGhpcyB0cmFuc2FjdGlvbi5cbiAgICBpZiAodHJhbnNhY3Rpb25Eb25lTWFwLmhhcyh0eCkpXG4gICAgICAgIHJldHVybjtcbiAgICBjb25zdCBkb25lID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBjb25zdCB1bmxpc3RlbiA9ICgpID0+IHtcbiAgICAgICAgICAgIHR4LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NvbXBsZXRlJywgY29tcGxldGUpO1xuICAgICAgICAgICAgdHgucmVtb3ZlRXZlbnRMaXN0ZW5lcignZXJyb3InLCBlcnJvcik7XG4gICAgICAgICAgICB0eC5yZW1vdmVFdmVudExpc3RlbmVyKCdhYm9ydCcsIGVycm9yKTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgY29tcGxldGUgPSAoKSA9PiB7XG4gICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICB1bmxpc3RlbigpO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBlcnJvciA9ICgpID0+IHtcbiAgICAgICAgICAgIHJlamVjdCh0eC5lcnJvciB8fCBuZXcgRE9NRXhjZXB0aW9uKCdBYm9ydEVycm9yJywgJ0Fib3J0RXJyb3InKSk7XG4gICAgICAgICAgICB1bmxpc3RlbigpO1xuICAgICAgICB9O1xuICAgICAgICB0eC5hZGRFdmVudExpc3RlbmVyKCdjb21wbGV0ZScsIGNvbXBsZXRlKTtcbiAgICAgICAgdHguYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCBlcnJvcik7XG4gICAgICAgIHR4LmFkZEV2ZW50TGlzdGVuZXIoJ2Fib3J0JywgZXJyb3IpO1xuICAgIH0pO1xuICAgIC8vIENhY2hlIGl0IGZvciBsYXRlciByZXRyaWV2YWwuXG4gICAgdHJhbnNhY3Rpb25Eb25lTWFwLnNldCh0eCwgZG9uZSk7XG59XG5sZXQgaWRiUHJveHlUcmFwcyA9IHtcbiAgICBnZXQodGFyZ2V0LCBwcm9wLCByZWNlaXZlcikge1xuICAgICAgICBpZiAodGFyZ2V0IGluc3RhbmNlb2YgSURCVHJhbnNhY3Rpb24pIHtcbiAgICAgICAgICAgIC8vIFNwZWNpYWwgaGFuZGxpbmcgZm9yIHRyYW5zYWN0aW9uLmRvbmUuXG4gICAgICAgICAgICBpZiAocHJvcCA9PT0gJ2RvbmUnKVxuICAgICAgICAgICAgICAgIHJldHVybiB0cmFuc2FjdGlvbkRvbmVNYXAuZ2V0KHRhcmdldCk7XG4gICAgICAgICAgICAvLyBQb2x5ZmlsbCBmb3Igb2JqZWN0U3RvcmVOYW1lcyBiZWNhdXNlIG9mIEVkZ2UuXG4gICAgICAgICAgICBpZiAocHJvcCA9PT0gJ29iamVjdFN0b3JlTmFtZXMnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRhcmdldC5vYmplY3RTdG9yZU5hbWVzIHx8IHRyYW5zYWN0aW9uU3RvcmVOYW1lc01hcC5nZXQodGFyZ2V0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIE1ha2UgdHguc3RvcmUgcmV0dXJuIHRoZSBvbmx5IHN0b3JlIGluIHRoZSB0cmFuc2FjdGlvbiwgb3IgdW5kZWZpbmVkIGlmIHRoZXJlIGFyZSBtYW55LlxuICAgICAgICAgICAgaWYgKHByb3AgPT09ICdzdG9yZScpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVjZWl2ZXIub2JqZWN0U3RvcmVOYW1lc1sxXVxuICAgICAgICAgICAgICAgICAgICA/IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgICAgICA6IHJlY2VpdmVyLm9iamVjdFN0b3JlKHJlY2VpdmVyLm9iamVjdFN0b3JlTmFtZXNbMF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIEVsc2UgdHJhbnNmb3JtIHdoYXRldmVyIHdlIGdldCBiYWNrLlxuICAgICAgICByZXR1cm4gd3JhcCh0YXJnZXRbcHJvcF0pO1xuICAgIH0sXG4gICAgc2V0KHRhcmdldCwgcHJvcCwgdmFsdWUpIHtcbiAgICAgICAgdGFyZ2V0W3Byb3BdID0gdmFsdWU7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gICAgaGFzKHRhcmdldCwgcHJvcCkge1xuICAgICAgICBpZiAodGFyZ2V0IGluc3RhbmNlb2YgSURCVHJhbnNhY3Rpb24gJiZcbiAgICAgICAgICAgIChwcm9wID09PSAnZG9uZScgfHwgcHJvcCA9PT0gJ3N0b3JlJykpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwcm9wIGluIHRhcmdldDtcbiAgICB9LFxufTtcbmZ1bmN0aW9uIHJlcGxhY2VUcmFwcyhjYWxsYmFjaykge1xuICAgIGlkYlByb3h5VHJhcHMgPSBjYWxsYmFjayhpZGJQcm94eVRyYXBzKTtcbn1cbmZ1bmN0aW9uIHdyYXBGdW5jdGlvbihmdW5jKSB7XG4gICAgLy8gRHVlIHRvIGV4cGVjdGVkIG9iamVjdCBlcXVhbGl0eSAod2hpY2ggaXMgZW5mb3JjZWQgYnkgdGhlIGNhY2hpbmcgaW4gYHdyYXBgKSwgd2VcbiAgICAvLyBvbmx5IGNyZWF0ZSBvbmUgbmV3IGZ1bmMgcGVyIGZ1bmMuXG4gICAgLy8gRWRnZSBkb2Vzbid0IHN1cHBvcnQgb2JqZWN0U3RvcmVOYW1lcyAoYm9vbyksIHNvIHdlIHBvbHlmaWxsIGl0IGhlcmUuXG4gICAgaWYgKGZ1bmMgPT09IElEQkRhdGFiYXNlLnByb3RvdHlwZS50cmFuc2FjdGlvbiAmJlxuICAgICAgICAhKCdvYmplY3RTdG9yZU5hbWVzJyBpbiBJREJUcmFuc2FjdGlvbi5wcm90b3R5cGUpKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoc3RvcmVOYW1lcywgLi4uYXJncykge1xuICAgICAgICAgICAgY29uc3QgdHggPSBmdW5jLmNhbGwodW53cmFwKHRoaXMpLCBzdG9yZU5hbWVzLCAuLi5hcmdzKTtcbiAgICAgICAgICAgIHRyYW5zYWN0aW9uU3RvcmVOYW1lc01hcC5zZXQodHgsIHN0b3JlTmFtZXMuc29ydCA/IHN0b3JlTmFtZXMuc29ydCgpIDogW3N0b3JlTmFtZXNdKTtcbiAgICAgICAgICAgIHJldHVybiB3cmFwKHR4KTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgLy8gQ3Vyc29yIG1ldGhvZHMgYXJlIHNwZWNpYWwsIGFzIHRoZSBiZWhhdmlvdXIgaXMgYSBsaXR0bGUgbW9yZSBkaWZmZXJlbnQgdG8gc3RhbmRhcmQgSURCLiBJblxuICAgIC8vIElEQiwgeW91IGFkdmFuY2UgdGhlIGN1cnNvciBhbmQgd2FpdCBmb3IgYSBuZXcgJ3N1Y2Nlc3MnIG9uIHRoZSBJREJSZXF1ZXN0IHRoYXQgZ2F2ZSB5b3UgdGhlXG4gICAgLy8gY3Vyc29yLiBJdCdzIGtpbmRhIGxpa2UgYSBwcm9taXNlIHRoYXQgY2FuIHJlc29sdmUgd2l0aCBtYW55IHZhbHVlcy4gVGhhdCBkb2Vzbid0IG1ha2Ugc2Vuc2VcbiAgICAvLyB3aXRoIHJlYWwgcHJvbWlzZXMsIHNvIGVhY2ggYWR2YW5jZSBtZXRob2RzIHJldHVybnMgYSBuZXcgcHJvbWlzZSBmb3IgdGhlIGN1cnNvciBvYmplY3QsIG9yXG4gICAgLy8gdW5kZWZpbmVkIGlmIHRoZSBlbmQgb2YgdGhlIGN1cnNvciBoYXMgYmVlbiByZWFjaGVkLlxuICAgIGlmIChnZXRDdXJzb3JBZHZhbmNlTWV0aG9kcygpLmluY2x1ZGVzKGZ1bmMpKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgICAgICAgICAgLy8gQ2FsbGluZyB0aGUgb3JpZ2luYWwgZnVuY3Rpb24gd2l0aCB0aGUgcHJveHkgYXMgJ3RoaXMnIGNhdXNlcyBJTExFR0FMIElOVk9DQVRJT04sIHNvIHdlIHVzZVxuICAgICAgICAgICAgLy8gdGhlIG9yaWdpbmFsIG9iamVjdC5cbiAgICAgICAgICAgIGZ1bmMuYXBwbHkodW53cmFwKHRoaXMpLCBhcmdzKTtcbiAgICAgICAgICAgIHJldHVybiB3cmFwKGN1cnNvclJlcXVlc3RNYXAuZ2V0KHRoaXMpKTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgICAgIC8vIENhbGxpbmcgdGhlIG9yaWdpbmFsIGZ1bmN0aW9uIHdpdGggdGhlIHByb3h5IGFzICd0aGlzJyBjYXVzZXMgSUxMRUdBTCBJTlZPQ0FUSU9OLCBzbyB3ZSB1c2VcbiAgICAgICAgLy8gdGhlIG9yaWdpbmFsIG9iamVjdC5cbiAgICAgICAgcmV0dXJuIHdyYXAoZnVuYy5hcHBseSh1bndyYXAodGhpcyksIGFyZ3MpKTtcbiAgICB9O1xufVxuZnVuY3Rpb24gdHJhbnNmb3JtQ2FjaGFibGVWYWx1ZSh2YWx1ZSkge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicpXG4gICAgICAgIHJldHVybiB3cmFwRnVuY3Rpb24odmFsdWUpO1xuICAgIC8vIFRoaXMgZG9lc24ndCByZXR1cm4sIGl0IGp1c3QgY3JlYXRlcyBhICdkb25lJyBwcm9taXNlIGZvciB0aGUgdHJhbnNhY3Rpb24sXG4gICAgLy8gd2hpY2ggaXMgbGF0ZXIgcmV0dXJuZWQgZm9yIHRyYW5zYWN0aW9uLmRvbmUgKHNlZSBpZGJPYmplY3RIYW5kbGVyKS5cbiAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBJREJUcmFuc2FjdGlvbilcbiAgICAgICAgY2FjaGVEb25lUHJvbWlzZUZvclRyYW5zYWN0aW9uKHZhbHVlKTtcbiAgICBpZiAoaW5zdGFuY2VPZkFueSh2YWx1ZSwgZ2V0SWRiUHJveHlhYmxlVHlwZXMoKSkpXG4gICAgICAgIHJldHVybiBuZXcgUHJveHkodmFsdWUsIGlkYlByb3h5VHJhcHMpO1xuICAgIC8vIFJldHVybiB0aGUgc2FtZSB2YWx1ZSBiYWNrIGlmIHdlJ3JlIG5vdCBnb2luZyB0byB0cmFuc2Zvcm0gaXQuXG4gICAgcmV0dXJuIHZhbHVlO1xufVxuZnVuY3Rpb24gd3JhcCh2YWx1ZSkge1xuICAgIC8vIFdlIHNvbWV0aW1lcyBnZW5lcmF0ZSBtdWx0aXBsZSBwcm9taXNlcyBmcm9tIGEgc2luZ2xlIElEQlJlcXVlc3QgKGVnIHdoZW4gY3Vyc29yaW5nKSwgYmVjYXVzZVxuICAgIC8vIElEQiBpcyB3ZWlyZCBhbmQgYSBzaW5nbGUgSURCUmVxdWVzdCBjYW4geWllbGQgbWFueSByZXNwb25zZXMsIHNvIHRoZXNlIGNhbid0IGJlIGNhY2hlZC5cbiAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBJREJSZXF1ZXN0KVxuICAgICAgICByZXR1cm4gcHJvbWlzaWZ5UmVxdWVzdCh2YWx1ZSk7XG4gICAgLy8gSWYgd2UndmUgYWxyZWFkeSB0cmFuc2Zvcm1lZCB0aGlzIHZhbHVlIGJlZm9yZSwgcmV1c2UgdGhlIHRyYW5zZm9ybWVkIHZhbHVlLlxuICAgIC8vIFRoaXMgaXMgZmFzdGVyLCBidXQgaXQgYWxzbyBwcm92aWRlcyBvYmplY3QgZXF1YWxpdHkuXG4gICAgaWYgKHRyYW5zZm9ybUNhY2hlLmhhcyh2YWx1ZSkpXG4gICAgICAgIHJldHVybiB0cmFuc2Zvcm1DYWNoZS5nZXQodmFsdWUpO1xuICAgIGNvbnN0IG5ld1ZhbHVlID0gdHJhbnNmb3JtQ2FjaGFibGVWYWx1ZSh2YWx1ZSk7XG4gICAgLy8gTm90IGFsbCB0eXBlcyBhcmUgdHJhbnNmb3JtZWQuXG4gICAgLy8gVGhlc2UgbWF5IGJlIHByaW1pdGl2ZSB0eXBlcywgc28gdGhleSBjYW4ndCBiZSBXZWFrTWFwIGtleXMuXG4gICAgaWYgKG5ld1ZhbHVlICE9PSB2YWx1ZSkge1xuICAgICAgICB0cmFuc2Zvcm1DYWNoZS5zZXQodmFsdWUsIG5ld1ZhbHVlKTtcbiAgICAgICAgcmV2ZXJzZVRyYW5zZm9ybUNhY2hlLnNldChuZXdWYWx1ZSwgdmFsdWUpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3VmFsdWU7XG59XG5jb25zdCB1bndyYXAgPSAodmFsdWUpID0+IHJldmVyc2VUcmFuc2Zvcm1DYWNoZS5nZXQodmFsdWUpO1xuXG5leHBvcnQgeyByZXZlcnNlVHJhbnNmb3JtQ2FjaGUgYXMgYSwgaW5zdGFuY2VPZkFueSBhcyBpLCByZXBsYWNlVHJhcHMgYXMgciwgdW53cmFwIGFzIHUsIHdyYXAgYXMgdyB9O1xuIiwgImltcG9ydCB7IHcgYXMgd3JhcCwgciBhcyByZXBsYWNlVHJhcHMgfSBmcm9tICcuL3dyYXAtaWRiLXZhbHVlLmpzJztcbmV4cG9ydCB7IHUgYXMgdW53cmFwLCB3IGFzIHdyYXAgfSBmcm9tICcuL3dyYXAtaWRiLXZhbHVlLmpzJztcblxuLyoqXG4gKiBPcGVuIGEgZGF0YWJhc2UuXG4gKlxuICogQHBhcmFtIG5hbWUgTmFtZSBvZiB0aGUgZGF0YWJhc2UuXG4gKiBAcGFyYW0gdmVyc2lvbiBTY2hlbWEgdmVyc2lvbi5cbiAqIEBwYXJhbSBjYWxsYmFja3MgQWRkaXRpb25hbCBjYWxsYmFja3MuXG4gKi9cbmZ1bmN0aW9uIG9wZW5EQihuYW1lLCB2ZXJzaW9uLCB7IGJsb2NrZWQsIHVwZ3JhZGUsIGJsb2NraW5nLCB0ZXJtaW5hdGVkIH0gPSB7fSkge1xuICAgIGNvbnN0IHJlcXVlc3QgPSBpbmRleGVkREIub3BlbihuYW1lLCB2ZXJzaW9uKTtcbiAgICBjb25zdCBvcGVuUHJvbWlzZSA9IHdyYXAocmVxdWVzdCk7XG4gICAgaWYgKHVwZ3JhZGUpIHtcbiAgICAgICAgcmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKCd1cGdyYWRlbmVlZGVkJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICB1cGdyYWRlKHdyYXAocmVxdWVzdC5yZXN1bHQpLCBldmVudC5vbGRWZXJzaW9uLCBldmVudC5uZXdWZXJzaW9uLCB3cmFwKHJlcXVlc3QudHJhbnNhY3Rpb24pLCBldmVudCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoYmxvY2tlZCkge1xuICAgICAgICByZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoJ2Jsb2NrZWQnLCAoZXZlbnQpID0+IGJsb2NrZWQoXG4gICAgICAgIC8vIENhc3RpbmcgZHVlIHRvIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvVHlwZVNjcmlwdC1ET00tbGliLWdlbmVyYXRvci9wdWxsLzE0MDVcbiAgICAgICAgZXZlbnQub2xkVmVyc2lvbiwgZXZlbnQubmV3VmVyc2lvbiwgZXZlbnQpKTtcbiAgICB9XG4gICAgb3BlblByb21pc2VcbiAgICAgICAgLnRoZW4oKGRiKSA9PiB7XG4gICAgICAgIGlmICh0ZXJtaW5hdGVkKVxuICAgICAgICAgICAgZGIuYWRkRXZlbnRMaXN0ZW5lcignY2xvc2UnLCAoKSA9PiB0ZXJtaW5hdGVkKCkpO1xuICAgICAgICBpZiAoYmxvY2tpbmcpIHtcbiAgICAgICAgICAgIGRiLmFkZEV2ZW50TGlzdGVuZXIoJ3ZlcnNpb25jaGFuZ2UnLCAoZXZlbnQpID0+IGJsb2NraW5nKGV2ZW50Lm9sZFZlcnNpb24sIGV2ZW50Lm5ld1ZlcnNpb24sIGV2ZW50KSk7XG4gICAgICAgIH1cbiAgICB9KVxuICAgICAgICAuY2F0Y2goKCkgPT4geyB9KTtcbiAgICByZXR1cm4gb3BlblByb21pc2U7XG59XG4vKipcbiAqIERlbGV0ZSBhIGRhdGFiYXNlLlxuICpcbiAqIEBwYXJhbSBuYW1lIE5hbWUgb2YgdGhlIGRhdGFiYXNlLlxuICovXG5mdW5jdGlvbiBkZWxldGVEQihuYW1lLCB7IGJsb2NrZWQgfSA9IHt9KSB7XG4gICAgY29uc3QgcmVxdWVzdCA9IGluZGV4ZWREQi5kZWxldGVEYXRhYmFzZShuYW1lKTtcbiAgICBpZiAoYmxvY2tlZCkge1xuICAgICAgICByZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoJ2Jsb2NrZWQnLCAoZXZlbnQpID0+IGJsb2NrZWQoXG4gICAgICAgIC8vIENhc3RpbmcgZHVlIHRvIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvVHlwZVNjcmlwdC1ET00tbGliLWdlbmVyYXRvci9wdWxsLzE0MDVcbiAgICAgICAgZXZlbnQub2xkVmVyc2lvbiwgZXZlbnQpKTtcbiAgICB9XG4gICAgcmV0dXJuIHdyYXAocmVxdWVzdCkudGhlbigoKSA9PiB1bmRlZmluZWQpO1xufVxuXG5jb25zdCByZWFkTWV0aG9kcyA9IFsnZ2V0JywgJ2dldEtleScsICdnZXRBbGwnLCAnZ2V0QWxsS2V5cycsICdjb3VudCddO1xuY29uc3Qgd3JpdGVNZXRob2RzID0gWydwdXQnLCAnYWRkJywgJ2RlbGV0ZScsICdjbGVhciddO1xuY29uc3QgY2FjaGVkTWV0aG9kcyA9IG5ldyBNYXAoKTtcbmZ1bmN0aW9uIGdldE1ldGhvZCh0YXJnZXQsIHByb3ApIHtcbiAgICBpZiAoISh0YXJnZXQgaW5zdGFuY2VvZiBJREJEYXRhYmFzZSAmJlxuICAgICAgICAhKHByb3AgaW4gdGFyZ2V0KSAmJlxuICAgICAgICB0eXBlb2YgcHJvcCA9PT0gJ3N0cmluZycpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGNhY2hlZE1ldGhvZHMuZ2V0KHByb3ApKVxuICAgICAgICByZXR1cm4gY2FjaGVkTWV0aG9kcy5nZXQocHJvcCk7XG4gICAgY29uc3QgdGFyZ2V0RnVuY05hbWUgPSBwcm9wLnJlcGxhY2UoL0Zyb21JbmRleCQvLCAnJyk7XG4gICAgY29uc3QgdXNlSW5kZXggPSBwcm9wICE9PSB0YXJnZXRGdW5jTmFtZTtcbiAgICBjb25zdCBpc1dyaXRlID0gd3JpdGVNZXRob2RzLmluY2x1ZGVzKHRhcmdldEZ1bmNOYW1lKTtcbiAgICBpZiAoXG4gICAgLy8gQmFpbCBpZiB0aGUgdGFyZ2V0IGRvZXNuJ3QgZXhpc3Qgb24gdGhlIHRhcmdldC4gRWcsIGdldEFsbCBpc24ndCBpbiBFZGdlLlxuICAgICEodGFyZ2V0RnVuY05hbWUgaW4gKHVzZUluZGV4ID8gSURCSW5kZXggOiBJREJPYmplY3RTdG9yZSkucHJvdG90eXBlKSB8fFxuICAgICAgICAhKGlzV3JpdGUgfHwgcmVhZE1ldGhvZHMuaW5jbHVkZXModGFyZ2V0RnVuY05hbWUpKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG1ldGhvZCA9IGFzeW5jIGZ1bmN0aW9uIChzdG9yZU5hbWUsIC4uLmFyZ3MpIHtcbiAgICAgICAgLy8gaXNXcml0ZSA/ICdyZWFkd3JpdGUnIDogdW5kZWZpbmVkIGd6aXBwcyBiZXR0ZXIsIGJ1dCBmYWlscyBpbiBFZGdlIDooXG4gICAgICAgIGNvbnN0IHR4ID0gdGhpcy50cmFuc2FjdGlvbihzdG9yZU5hbWUsIGlzV3JpdGUgPyAncmVhZHdyaXRlJyA6ICdyZWFkb25seScpO1xuICAgICAgICBsZXQgdGFyZ2V0ID0gdHguc3RvcmU7XG4gICAgICAgIGlmICh1c2VJbmRleClcbiAgICAgICAgICAgIHRhcmdldCA9IHRhcmdldC5pbmRleChhcmdzLnNoaWZ0KCkpO1xuICAgICAgICAvLyBNdXN0IHJlamVjdCBpZiBvcCByZWplY3RzLlxuICAgICAgICAvLyBJZiBpdCdzIGEgd3JpdGUgb3BlcmF0aW9uLCBtdXN0IHJlamVjdCBpZiB0eC5kb25lIHJlamVjdHMuXG4gICAgICAgIC8vIE11c3QgcmVqZWN0IHdpdGggb3AgcmVqZWN0aW9uIGZpcnN0LlxuICAgICAgICAvLyBNdXN0IHJlc29sdmUgd2l0aCBvcCB2YWx1ZS5cbiAgICAgICAgLy8gTXVzdCBoYW5kbGUgYm90aCBwcm9taXNlcyAobm8gdW5oYW5kbGVkIHJlamVjdGlvbnMpXG4gICAgICAgIHJldHVybiAoYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgICAgICAgdGFyZ2V0W3RhcmdldEZ1bmNOYW1lXSguLi5hcmdzKSxcbiAgICAgICAgICAgIGlzV3JpdGUgJiYgdHguZG9uZSxcbiAgICAgICAgXSkpWzBdO1xuICAgIH07XG4gICAgY2FjaGVkTWV0aG9kcy5zZXQocHJvcCwgbWV0aG9kKTtcbiAgICByZXR1cm4gbWV0aG9kO1xufVxucmVwbGFjZVRyYXBzKChvbGRUcmFwcykgPT4gKHtcbiAgICAuLi5vbGRUcmFwcyxcbiAgICBnZXQ6ICh0YXJnZXQsIHByb3AsIHJlY2VpdmVyKSA9PiBnZXRNZXRob2QodGFyZ2V0LCBwcm9wKSB8fCBvbGRUcmFwcy5nZXQodGFyZ2V0LCBwcm9wLCByZWNlaXZlciksXG4gICAgaGFzOiAodGFyZ2V0LCBwcm9wKSA9PiAhIWdldE1ldGhvZCh0YXJnZXQsIHByb3ApIHx8IG9sZFRyYXBzLmhhcyh0YXJnZXQsIHByb3ApLFxufSkpO1xuXG5leHBvcnQgeyBkZWxldGVEQiwgb3BlbkRCIH07XG4iLCAiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHtcbiAgQ29tcG9uZW50Q29udGFpbmVyLFxuICBDb21wb25lbnRUeXBlLFxuICBQcm92aWRlcixcbiAgTmFtZVxufSBmcm9tICdAZmlyZWJhc2UvY29tcG9uZW50JztcbmltcG9ydCB7IFBsYXRmb3JtTG9nZ2VyU2VydmljZSwgVmVyc2lvblNlcnZpY2UgfSBmcm9tICcuL3R5cGVzJztcblxuZXhwb3J0IGNsYXNzIFBsYXRmb3JtTG9nZ2VyU2VydmljZUltcGwgaW1wbGVtZW50cyBQbGF0Zm9ybUxvZ2dlclNlcnZpY2Uge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGNvbnRhaW5lcjogQ29tcG9uZW50Q29udGFpbmVyKSB7fVxuICAvLyBJbiBpbml0aWFsIGltcGxlbWVudGF0aW9uLCB0aGlzIHdpbGwgYmUgY2FsbGVkIGJ5IGluc3RhbGxhdGlvbnMgb25cbiAgLy8gYXV0aCB0b2tlbiByZWZyZXNoLCBhbmQgaW5zdGFsbGF0aW9ucyB3aWxsIHNlbmQgdGhpcyBzdHJpbmcuXG4gIGdldFBsYXRmb3JtSW5mb1N0cmluZygpOiBzdHJpbmcge1xuICAgIGNvbnN0IHByb3ZpZGVycyA9IHRoaXMuY29udGFpbmVyLmdldFByb3ZpZGVycygpO1xuICAgIC8vIExvb3AgdGhyb3VnaCBwcm92aWRlcnMgYW5kIGdldCBsaWJyYXJ5L3ZlcnNpb24gcGFpcnMgZnJvbSBhbnkgdGhhdCBhcmVcbiAgICAvLyB2ZXJzaW9uIGNvbXBvbmVudHMuXG4gICAgcmV0dXJuIHByb3ZpZGVyc1xuICAgICAgLm1hcChwcm92aWRlciA9PiB7XG4gICAgICAgIGlmIChpc1ZlcnNpb25TZXJ2aWNlUHJvdmlkZXIocHJvdmlkZXIpKSB7XG4gICAgICAgICAgY29uc3Qgc2VydmljZSA9IHByb3ZpZGVyLmdldEltbWVkaWF0ZSgpIGFzIFZlcnNpb25TZXJ2aWNlO1xuICAgICAgICAgIHJldHVybiBgJHtzZXJ2aWNlLmxpYnJhcnl9LyR7c2VydmljZS52ZXJzaW9ufWA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAuZmlsdGVyKGxvZ1N0cmluZyA9PiBsb2dTdHJpbmcpXG4gICAgICAuam9pbignICcpO1xuICB9XG59XG4vKipcbiAqXG4gKiBAcGFyYW0gcHJvdmlkZXIgY2hlY2sgaWYgdGhpcyBwcm92aWRlciBwcm92aWRlcyBhIFZlcnNpb25TZXJ2aWNlXG4gKlxuICogTk9URTogVXNpbmcgUHJvdmlkZXI8J2FwcC12ZXJzaW9uJz4gaXMgYSBoYWNrIHRvIGluZGljYXRlIHRoYXQgdGhlIHByb3ZpZGVyXG4gKiBwcm92aWRlcyBWZXJzaW9uU2VydmljZS4gVGhlIHByb3ZpZGVyIGlzIG5vdCBuZWNlc3NhcmlseSBhICdhcHAtdmVyc2lvbidcbiAqIHByb3ZpZGVyLlxuICovXG5mdW5jdGlvbiBpc1ZlcnNpb25TZXJ2aWNlUHJvdmlkZXIocHJvdmlkZXI6IFByb3ZpZGVyPE5hbWU+KTogYm9vbGVhbiB7XG4gIGNvbnN0IGNvbXBvbmVudCA9IHByb3ZpZGVyLmdldENvbXBvbmVudCgpO1xuICByZXR1cm4gY29tcG9uZW50Py50eXBlID09PSBDb21wb25lbnRUeXBlLlZFUlNJT047XG59XG4iLCAiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgTG9nZ2VyIH0gZnJvbSAnQGZpcmViYXNlL2xvZ2dlcic7XG5cbmV4cG9ydCBjb25zdCBsb2dnZXIgPSBuZXcgTG9nZ2VyKCdAZmlyZWJhc2UvYXBwJyk7XG4iLCAiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgbmFtZSBhcyBhcHBOYW1lIH0gZnJvbSAnLi4vcGFja2FnZS5qc29uJztcbmltcG9ydCB7IG5hbWUgYXMgYXBwQ29tcGF0TmFtZSB9IGZyb20gJy4uLy4uL2FwcC1jb21wYXQvcGFja2FnZS5qc29uJztcbmltcG9ydCB7IG5hbWUgYXMgYW5hbHl0aWNzQ29tcGF0TmFtZSB9IGZyb20gJy4uLy4uLy4uL3BhY2thZ2VzL2FuYWx5dGljcy1jb21wYXQvcGFja2FnZS5qc29uJztcbmltcG9ydCB7IG5hbWUgYXMgYW5hbHl0aWNzTmFtZSB9IGZyb20gJy4uLy4uLy4uL3BhY2thZ2VzL2FuYWx5dGljcy9wYWNrYWdlLmpzb24nO1xuaW1wb3J0IHsgbmFtZSBhcyBhcHBDaGVja0NvbXBhdE5hbWUgfSBmcm9tICcuLi8uLi8uLi9wYWNrYWdlcy9hcHAtY2hlY2stY29tcGF0L3BhY2thZ2UuanNvbic7XG5pbXBvcnQgeyBuYW1lIGFzIGFwcENoZWNrTmFtZSB9IGZyb20gJy4uLy4uLy4uL3BhY2thZ2VzL2FwcC1jaGVjay9wYWNrYWdlLmpzb24nO1xuaW1wb3J0IHsgbmFtZSBhcyBhdXRoTmFtZSB9IGZyb20gJy4uLy4uLy4uL3BhY2thZ2VzL2F1dGgvcGFja2FnZS5qc29uJztcbmltcG9ydCB7IG5hbWUgYXMgYXV0aENvbXBhdE5hbWUgfSBmcm9tICcuLi8uLi8uLi9wYWNrYWdlcy9hdXRoLWNvbXBhdC9wYWNrYWdlLmpzb24nO1xuaW1wb3J0IHsgbmFtZSBhcyBkYXRhYmFzZU5hbWUgfSBmcm9tICcuLi8uLi8uLi9wYWNrYWdlcy9kYXRhYmFzZS9wYWNrYWdlLmpzb24nO1xuaW1wb3J0IHsgbmFtZSBhcyBkYXRhYmFzZUNvbXBhdE5hbWUgfSBmcm9tICcuLi8uLi8uLi9wYWNrYWdlcy9kYXRhYmFzZS1jb21wYXQvcGFja2FnZS5qc29uJztcbmltcG9ydCB7IG5hbWUgYXMgZnVuY3Rpb25zTmFtZSB9IGZyb20gJy4uLy4uLy4uL3BhY2thZ2VzL2Z1bmN0aW9ucy9wYWNrYWdlLmpzb24nO1xuaW1wb3J0IHsgbmFtZSBhcyBmdW5jdGlvbnNDb21wYXROYW1lIH0gZnJvbSAnLi4vLi4vLi4vcGFja2FnZXMvZnVuY3Rpb25zLWNvbXBhdC9wYWNrYWdlLmpzb24nO1xuaW1wb3J0IHsgbmFtZSBhcyBpbnN0YWxsYXRpb25zTmFtZSB9IGZyb20gJy4uLy4uLy4uL3BhY2thZ2VzL2luc3RhbGxhdGlvbnMvcGFja2FnZS5qc29uJztcbmltcG9ydCB7IG5hbWUgYXMgaW5zdGFsbGF0aW9uc0NvbXBhdE5hbWUgfSBmcm9tICcuLi8uLi8uLi9wYWNrYWdlcy9pbnN0YWxsYXRpb25zLWNvbXBhdC9wYWNrYWdlLmpzb24nO1xuaW1wb3J0IHsgbmFtZSBhcyBtZXNzYWdpbmdOYW1lIH0gZnJvbSAnLi4vLi4vLi4vcGFja2FnZXMvbWVzc2FnaW5nL3BhY2thZ2UuanNvbic7XG5pbXBvcnQgeyBuYW1lIGFzIG1lc3NhZ2luZ0NvbXBhdE5hbWUgfSBmcm9tICcuLi8uLi8uLi9wYWNrYWdlcy9tZXNzYWdpbmctY29tcGF0L3BhY2thZ2UuanNvbic7XG5pbXBvcnQgeyBuYW1lIGFzIHBlcmZvcm1hbmNlTmFtZSB9IGZyb20gJy4uLy4uLy4uL3BhY2thZ2VzL3BlcmZvcm1hbmNlL3BhY2thZ2UuanNvbic7XG5pbXBvcnQgeyBuYW1lIGFzIHBlcmZvcm1hbmNlQ29tcGF0TmFtZSB9IGZyb20gJy4uLy4uLy4uL3BhY2thZ2VzL3BlcmZvcm1hbmNlLWNvbXBhdC9wYWNrYWdlLmpzb24nO1xuaW1wb3J0IHsgbmFtZSBhcyByZW1vdGVDb25maWdOYW1lIH0gZnJvbSAnLi4vLi4vLi4vcGFja2FnZXMvcmVtb3RlLWNvbmZpZy9wYWNrYWdlLmpzb24nO1xuaW1wb3J0IHsgbmFtZSBhcyByZW1vdGVDb25maWdDb21wYXROYW1lIH0gZnJvbSAnLi4vLi4vLi4vcGFja2FnZXMvcmVtb3RlLWNvbmZpZy1jb21wYXQvcGFja2FnZS5qc29uJztcbmltcG9ydCB7IG5hbWUgYXMgc3RvcmFnZU5hbWUgfSBmcm9tICcuLi8uLi8uLi9wYWNrYWdlcy9zdG9yYWdlL3BhY2thZ2UuanNvbic7XG5pbXBvcnQgeyBuYW1lIGFzIHN0b3JhZ2VDb21wYXROYW1lIH0gZnJvbSAnLi4vLi4vLi4vcGFja2FnZXMvc3RvcmFnZS1jb21wYXQvcGFja2FnZS5qc29uJztcbmltcG9ydCB7IG5hbWUgYXMgZmlyZXN0b3JlTmFtZSB9IGZyb20gJy4uLy4uLy4uL3BhY2thZ2VzL2ZpcmVzdG9yZS9wYWNrYWdlLmpzb24nO1xuaW1wb3J0IHsgbmFtZSBhcyBmaXJlc3RvcmVDb21wYXROYW1lIH0gZnJvbSAnLi4vLi4vLi4vcGFja2FnZXMvZmlyZXN0b3JlLWNvbXBhdC9wYWNrYWdlLmpzb24nO1xuaW1wb3J0IHsgbmFtZSBhcyBwYWNrYWdlTmFtZSB9IGZyb20gJy4uLy4uLy4uL3BhY2thZ2VzL2ZpcmViYXNlL3BhY2thZ2UuanNvbic7XG5cbi8qKlxuICogVGhlIGRlZmF1bHQgYXBwIG5hbWVcbiAqXG4gKiBAaW50ZXJuYWxcbiAqL1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfRU5UUllfTkFNRSA9ICdbREVGQVVMVF0nO1xuXG5leHBvcnQgY29uc3QgUExBVEZPUk1fTE9HX1NUUklORyA9IHtcbiAgW2FwcE5hbWVdOiAnZmlyZS1jb3JlJyxcbiAgW2FwcENvbXBhdE5hbWVdOiAnZmlyZS1jb3JlLWNvbXBhdCcsXG4gIFthbmFseXRpY3NOYW1lXTogJ2ZpcmUtYW5hbHl0aWNzJyxcbiAgW2FuYWx5dGljc0NvbXBhdE5hbWVdOiAnZmlyZS1hbmFseXRpY3MtY29tcGF0JyxcbiAgW2FwcENoZWNrTmFtZV06ICdmaXJlLWFwcC1jaGVjaycsXG4gIFthcHBDaGVja0NvbXBhdE5hbWVdOiAnZmlyZS1hcHAtY2hlY2stY29tcGF0JyxcbiAgW2F1dGhOYW1lXTogJ2ZpcmUtYXV0aCcsXG4gIFthdXRoQ29tcGF0TmFtZV06ICdmaXJlLWF1dGgtY29tcGF0JyxcbiAgW2RhdGFiYXNlTmFtZV06ICdmaXJlLXJ0ZGInLFxuICBbZGF0YWJhc2VDb21wYXROYW1lXTogJ2ZpcmUtcnRkYi1jb21wYXQnLFxuICBbZnVuY3Rpb25zTmFtZV06ICdmaXJlLWZuJyxcbiAgW2Z1bmN0aW9uc0NvbXBhdE5hbWVdOiAnZmlyZS1mbi1jb21wYXQnLFxuICBbaW5zdGFsbGF0aW9uc05hbWVdOiAnZmlyZS1paWQnLFxuICBbaW5zdGFsbGF0aW9uc0NvbXBhdE5hbWVdOiAnZmlyZS1paWQtY29tcGF0JyxcbiAgW21lc3NhZ2luZ05hbWVdOiAnZmlyZS1mY20nLFxuICBbbWVzc2FnaW5nQ29tcGF0TmFtZV06ICdmaXJlLWZjbS1jb21wYXQnLFxuICBbcGVyZm9ybWFuY2VOYW1lXTogJ2ZpcmUtcGVyZicsXG4gIFtwZXJmb3JtYW5jZUNvbXBhdE5hbWVdOiAnZmlyZS1wZXJmLWNvbXBhdCcsXG4gIFtyZW1vdGVDb25maWdOYW1lXTogJ2ZpcmUtcmMnLFxuICBbcmVtb3RlQ29uZmlnQ29tcGF0TmFtZV06ICdmaXJlLXJjLWNvbXBhdCcsXG4gIFtzdG9yYWdlTmFtZV06ICdmaXJlLWdjcycsXG4gIFtzdG9yYWdlQ29tcGF0TmFtZV06ICdmaXJlLWdjcy1jb21wYXQnLFxuICBbZmlyZXN0b3JlTmFtZV06ICdmaXJlLWZzdCcsXG4gIFtmaXJlc3RvcmVDb21wYXROYW1lXTogJ2ZpcmUtZnN0LWNvbXBhdCcsXG4gICdmaXJlLWpzJzogJ2ZpcmUtanMnLCAvLyBQbGF0Zm9ybSBpZGVudGlmaWVyIGZvciBKUyBTREsuXG4gIFtwYWNrYWdlTmFtZV06ICdmaXJlLWpzLWFsbCdcbn0gYXMgY29uc3Q7XG4iLCAiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgRmlyZWJhc2VBcHAgfSBmcm9tICcuL3B1YmxpYy10eXBlcyc7XG5pbXBvcnQgeyBDb21wb25lbnQsIFByb3ZpZGVyLCBOYW1lIH0gZnJvbSAnQGZpcmViYXNlL2NvbXBvbmVudCc7XG5pbXBvcnQgeyBsb2dnZXIgfSBmcm9tICcuL2xvZ2dlcic7XG5pbXBvcnQgeyBERUZBVUxUX0VOVFJZX05BTUUgfSBmcm9tICcuL2NvbnN0YW50cyc7XG5pbXBvcnQgeyBGaXJlYmFzZUFwcEltcGwgfSBmcm9tICcuL2ZpcmViYXNlQXBwJztcblxuLyoqXG4gKiBAaW50ZXJuYWxcbiAqL1xuZXhwb3J0IGNvbnN0IF9hcHBzID0gbmV3IE1hcDxzdHJpbmcsIEZpcmViYXNlQXBwPigpO1xuXG4vKipcbiAqIFJlZ2lzdGVyZWQgY29tcG9uZW50cy5cbiAqXG4gKiBAaW50ZXJuYWxcbiAqL1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbmV4cG9ydCBjb25zdCBfY29tcG9uZW50cyA9IG5ldyBNYXA8c3RyaW5nLCBDb21wb25lbnQ8YW55Pj4oKTtcblxuLyoqXG4gKiBAcGFyYW0gY29tcG9uZW50IC0gdGhlIGNvbXBvbmVudCBiZWluZyBhZGRlZCB0byB0aGlzIGFwcCdzIGNvbnRhaW5lclxuICpcbiAqIEBpbnRlcm5hbFxuICovXG5leHBvcnQgZnVuY3Rpb24gX2FkZENvbXBvbmVudDxUIGV4dGVuZHMgTmFtZT4oXG4gIGFwcDogRmlyZWJhc2VBcHAsXG4gIGNvbXBvbmVudDogQ29tcG9uZW50PFQ+XG4pOiB2b2lkIHtcbiAgdHJ5IHtcbiAgICAoYXBwIGFzIEZpcmViYXNlQXBwSW1wbCkuY29udGFpbmVyLmFkZENvbXBvbmVudChjb21wb25lbnQpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgbG9nZ2VyLmRlYnVnKFxuICAgICAgYENvbXBvbmVudCAke2NvbXBvbmVudC5uYW1lfSBmYWlsZWQgdG8gcmVnaXN0ZXIgd2l0aCBGaXJlYmFzZUFwcCAke2FwcC5uYW1lfWAsXG4gICAgICBlXG4gICAgKTtcbiAgfVxufVxuXG4vKipcbiAqXG4gKiBAaW50ZXJuYWxcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIF9hZGRPck92ZXJ3cml0ZUNvbXBvbmVudChcbiAgYXBwOiBGaXJlYmFzZUFwcCxcbiAgY29tcG9uZW50OiBDb21wb25lbnRcbik6IHZvaWQge1xuICAoYXBwIGFzIEZpcmViYXNlQXBwSW1wbCkuY29udGFpbmVyLmFkZE9yT3ZlcndyaXRlQ29tcG9uZW50KGNvbXBvbmVudCk7XG59XG5cbi8qKlxuICpcbiAqIEBwYXJhbSBjb21wb25lbnQgLSB0aGUgY29tcG9uZW50IHRvIHJlZ2lzdGVyXG4gKiBAcmV0dXJucyB3aGV0aGVyIG9yIG5vdCB0aGUgY29tcG9uZW50IGlzIHJlZ2lzdGVyZWQgc3VjY2Vzc2Z1bGx5XG4gKlxuICogQGludGVybmFsXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBfcmVnaXN0ZXJDb21wb25lbnQ8VCBleHRlbmRzIE5hbWU+KFxuICBjb21wb25lbnQ6IENvbXBvbmVudDxUPlxuKTogYm9vbGVhbiB7XG4gIGNvbnN0IGNvbXBvbmVudE5hbWUgPSBjb21wb25lbnQubmFtZTtcbiAgaWYgKF9jb21wb25lbnRzLmhhcyhjb21wb25lbnROYW1lKSkge1xuICAgIGxvZ2dlci5kZWJ1ZyhcbiAgICAgIGBUaGVyZSB3ZXJlIG11bHRpcGxlIGF0dGVtcHRzIHRvIHJlZ2lzdGVyIGNvbXBvbmVudCAke2NvbXBvbmVudE5hbWV9LmBcbiAgICApO1xuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgX2NvbXBvbmVudHMuc2V0KGNvbXBvbmVudE5hbWUsIGNvbXBvbmVudCk7XG5cbiAgLy8gYWRkIHRoZSBjb21wb25lbnQgdG8gZXhpc3RpbmcgYXBwIGluc3RhbmNlc1xuICBmb3IgKGNvbnN0IGFwcCBvZiBfYXBwcy52YWx1ZXMoKSkge1xuICAgIF9hZGRDb21wb25lbnQoYXBwIGFzIEZpcmViYXNlQXBwSW1wbCwgY29tcG9uZW50KTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG4vKipcbiAqXG4gKiBAcGFyYW0gYXBwIC0gRmlyZWJhc2VBcHAgaW5zdGFuY2VcbiAqIEBwYXJhbSBuYW1lIC0gc2VydmljZSBuYW1lXG4gKlxuICogQHJldHVybnMgdGhlIHByb3ZpZGVyIGZvciB0aGUgc2VydmljZSB3aXRoIHRoZSBtYXRjaGluZyBuYW1lXG4gKlxuICogQGludGVybmFsXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBfZ2V0UHJvdmlkZXI8VCBleHRlbmRzIE5hbWU+KFxuICBhcHA6IEZpcmViYXNlQXBwLFxuICBuYW1lOiBUXG4pOiBQcm92aWRlcjxUPiB7XG4gIGNvbnN0IGhlYXJ0YmVhdENvbnRyb2xsZXIgPSAoYXBwIGFzIEZpcmViYXNlQXBwSW1wbCkuY29udGFpbmVyXG4gICAgLmdldFByb3ZpZGVyKCdoZWFydGJlYXQnKVxuICAgIC5nZXRJbW1lZGlhdGUoeyBvcHRpb25hbDogdHJ1ZSB9KTtcbiAgaWYgKGhlYXJ0YmVhdENvbnRyb2xsZXIpIHtcbiAgICB2b2lkIGhlYXJ0YmVhdENvbnRyb2xsZXIudHJpZ2dlckhlYXJ0YmVhdCgpO1xuICB9XG4gIHJldHVybiAoYXBwIGFzIEZpcmViYXNlQXBwSW1wbCkuY29udGFpbmVyLmdldFByb3ZpZGVyKG5hbWUpO1xufVxuXG4vKipcbiAqXG4gKiBAcGFyYW0gYXBwIC0gRmlyZWJhc2VBcHAgaW5zdGFuY2VcbiAqIEBwYXJhbSBuYW1lIC0gc2VydmljZSBuYW1lXG4gKiBAcGFyYW0gaW5zdGFuY2VJZGVudGlmaWVyIC0gc2VydmljZSBpbnN0YW5jZSBpZGVudGlmaWVyIGluIGNhc2UgdGhlIHNlcnZpY2Ugc3VwcG9ydHMgbXVsdGlwbGUgaW5zdGFuY2VzXG4gKlxuICogQGludGVybmFsXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBfcmVtb3ZlU2VydmljZUluc3RhbmNlPFQgZXh0ZW5kcyBOYW1lPihcbiAgYXBwOiBGaXJlYmFzZUFwcCxcbiAgbmFtZTogVCxcbiAgaW5zdGFuY2VJZGVudGlmaWVyOiBzdHJpbmcgPSBERUZBVUxUX0VOVFJZX05BTUVcbik6IHZvaWQge1xuICBfZ2V0UHJvdmlkZXIoYXBwLCBuYW1lKS5jbGVhckluc3RhbmNlKGluc3RhbmNlSWRlbnRpZmllcik7XG59XG5cbi8qKlxuICogVGVzdCBvbmx5XG4gKlxuICogQGludGVybmFsXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBfY2xlYXJDb21wb25lbnRzKCk6IHZvaWQge1xuICBfY29tcG9uZW50cy5jbGVhcigpO1xufVxuXG4vKipcbiAqIEV4cG9ydGVkIGluIG9yZGVyIHRvIGJlIHVzZWQgaW4gYXBwLWNvbXBhdCBwYWNrYWdlXG4gKi9cbmV4cG9ydCB7IERFRkFVTFRfRU5UUllfTkFNRSBhcyBfREVGQVVMVF9FTlRSWV9OQU1FIH07XG4iLCAiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgRXJyb3JGYWN0b3J5LCBFcnJvck1hcCB9IGZyb20gJ0BmaXJlYmFzZS91dGlsJztcblxuZXhwb3J0IGNvbnN0IGVudW0gQXBwRXJyb3Ige1xuICBOT19BUFAgPSAnbm8tYXBwJyxcbiAgQkFEX0FQUF9OQU1FID0gJ2JhZC1hcHAtbmFtZScsXG4gIERVUExJQ0FURV9BUFAgPSAnZHVwbGljYXRlLWFwcCcsXG4gIEFQUF9ERUxFVEVEID0gJ2FwcC1kZWxldGVkJyxcbiAgTk9fT1BUSU9OUyA9ICduby1vcHRpb25zJyxcbiAgSU5WQUxJRF9BUFBfQVJHVU1FTlQgPSAnaW52YWxpZC1hcHAtYXJndW1lbnQnLFxuICBJTlZBTElEX0xPR19BUkdVTUVOVCA9ICdpbnZhbGlkLWxvZy1hcmd1bWVudCcsXG4gIElEQl9PUEVOID0gJ2lkYi1vcGVuJyxcbiAgSURCX0dFVCA9ICdpZGItZ2V0JyxcbiAgSURCX1dSSVRFID0gJ2lkYi1zZXQnLFxuICBJREJfREVMRVRFID0gJ2lkYi1kZWxldGUnXG59XG5cbmNvbnN0IEVSUk9SUzogRXJyb3JNYXA8QXBwRXJyb3I+ID0ge1xuICBbQXBwRXJyb3IuTk9fQVBQXTpcbiAgICBcIk5vIEZpcmViYXNlIEFwcCAneyRhcHBOYW1lfScgaGFzIGJlZW4gY3JlYXRlZCAtIFwiICtcbiAgICAnY2FsbCBpbml0aWFsaXplQXBwKCkgZmlyc3QnLFxuICBbQXBwRXJyb3IuQkFEX0FQUF9OQU1FXTogXCJJbGxlZ2FsIEFwcCBuYW1lOiAneyRhcHBOYW1lfVwiLFxuICBbQXBwRXJyb3IuRFVQTElDQVRFX0FQUF06XG4gICAgXCJGaXJlYmFzZSBBcHAgbmFtZWQgJ3skYXBwTmFtZX0nIGFscmVhZHkgZXhpc3RzIHdpdGggZGlmZmVyZW50IG9wdGlvbnMgb3IgY29uZmlnXCIsXG4gIFtBcHBFcnJvci5BUFBfREVMRVRFRF06IFwiRmlyZWJhc2UgQXBwIG5hbWVkICd7JGFwcE5hbWV9JyBhbHJlYWR5IGRlbGV0ZWRcIixcbiAgW0FwcEVycm9yLk5PX09QVElPTlNdOlxuICAgICdOZWVkIHRvIHByb3ZpZGUgb3B0aW9ucywgd2hlbiBub3QgYmVpbmcgZGVwbG95ZWQgdG8gaG9zdGluZyB2aWEgc291cmNlLicsXG4gIFtBcHBFcnJvci5JTlZBTElEX0FQUF9BUkdVTUVOVF06XG4gICAgJ2ZpcmViYXNlLnskYXBwTmFtZX0oKSB0YWtlcyBlaXRoZXIgbm8gYXJndW1lbnQgb3IgYSAnICtcbiAgICAnRmlyZWJhc2UgQXBwIGluc3RhbmNlLicsXG4gIFtBcHBFcnJvci5JTlZBTElEX0xPR19BUkdVTUVOVF06XG4gICAgJ0ZpcnN0IGFyZ3VtZW50IHRvIGBvbkxvZ2AgbXVzdCBiZSBudWxsIG9yIGEgZnVuY3Rpb24uJyxcbiAgW0FwcEVycm9yLklEQl9PUEVOXTpcbiAgICAnRXJyb3IgdGhyb3duIHdoZW4gb3BlbmluZyBJbmRleGVkREIuIE9yaWdpbmFsIGVycm9yOiB7JG9yaWdpbmFsRXJyb3JNZXNzYWdlfS4nLFxuICBbQXBwRXJyb3IuSURCX0dFVF06XG4gICAgJ0Vycm9yIHRocm93biB3aGVuIHJlYWRpbmcgZnJvbSBJbmRleGVkREIuIE9yaWdpbmFsIGVycm9yOiB7JG9yaWdpbmFsRXJyb3JNZXNzYWdlfS4nLFxuICBbQXBwRXJyb3IuSURCX1dSSVRFXTpcbiAgICAnRXJyb3IgdGhyb3duIHdoZW4gd3JpdGluZyB0byBJbmRleGVkREIuIE9yaWdpbmFsIGVycm9yOiB7JG9yaWdpbmFsRXJyb3JNZXNzYWdlfS4nLFxuICBbQXBwRXJyb3IuSURCX0RFTEVURV06XG4gICAgJ0Vycm9yIHRocm93biB3aGVuIGRlbGV0aW5nIGZyb20gSW5kZXhlZERCLiBPcmlnaW5hbCBlcnJvcjogeyRvcmlnaW5hbEVycm9yTWVzc2FnZX0uJ1xufTtcblxuaW50ZXJmYWNlIEVycm9yUGFyYW1zIHtcbiAgW0FwcEVycm9yLk5PX0FQUF06IHsgYXBwTmFtZTogc3RyaW5nIH07XG4gIFtBcHBFcnJvci5CQURfQVBQX05BTUVdOiB7IGFwcE5hbWU6IHN0cmluZyB9O1xuICBbQXBwRXJyb3IuRFVQTElDQVRFX0FQUF06IHsgYXBwTmFtZTogc3RyaW5nIH07XG4gIFtBcHBFcnJvci5BUFBfREVMRVRFRF06IHsgYXBwTmFtZTogc3RyaW5nIH07XG4gIFtBcHBFcnJvci5JTlZBTElEX0FQUF9BUkdVTUVOVF06IHsgYXBwTmFtZTogc3RyaW5nIH07XG4gIFtBcHBFcnJvci5JREJfT1BFTl06IHsgb3JpZ2luYWxFcnJvck1lc3NhZ2U/OiBzdHJpbmcgfTtcbiAgW0FwcEVycm9yLklEQl9HRVRdOiB7IG9yaWdpbmFsRXJyb3JNZXNzYWdlPzogc3RyaW5nIH07XG4gIFtBcHBFcnJvci5JREJfV1JJVEVdOiB7IG9yaWdpbmFsRXJyb3JNZXNzYWdlPzogc3RyaW5nIH07XG4gIFtBcHBFcnJvci5JREJfREVMRVRFXTogeyBvcmlnaW5hbEVycm9yTWVzc2FnZT86IHN0cmluZyB9O1xufVxuXG5leHBvcnQgY29uc3QgRVJST1JfRkFDVE9SWSA9IG5ldyBFcnJvckZhY3Rvcnk8QXBwRXJyb3IsIEVycm9yUGFyYW1zPihcbiAgJ2FwcCcsXG4gICdGaXJlYmFzZScsXG4gIEVSUk9SU1xuKTtcbiIsICIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQge1xuICBGaXJlYmFzZUFwcCxcbiAgRmlyZWJhc2VPcHRpb25zLFxuICBGaXJlYmFzZUFwcFNldHRpbmdzXG59IGZyb20gJy4vcHVibGljLXR5cGVzJztcbmltcG9ydCB7XG4gIENvbXBvbmVudENvbnRhaW5lcixcbiAgQ29tcG9uZW50LFxuICBDb21wb25lbnRUeXBlXG59IGZyb20gJ0BmaXJlYmFzZS9jb21wb25lbnQnO1xuaW1wb3J0IHsgRVJST1JfRkFDVE9SWSwgQXBwRXJyb3IgfSBmcm9tICcuL2Vycm9ycyc7XG5cbmV4cG9ydCBjbGFzcyBGaXJlYmFzZUFwcEltcGwgaW1wbGVtZW50cyBGaXJlYmFzZUFwcCB7XG4gIHByaXZhdGUgcmVhZG9ubHkgX29wdGlvbnM6IEZpcmViYXNlT3B0aW9ucztcbiAgcHJpdmF0ZSByZWFkb25seSBfbmFtZTogc3RyaW5nO1xuICAvKipcbiAgICogT3JpZ2luYWwgY29uZmlnIHZhbHVlcyBwYXNzZWQgaW4gYXMgYSBjb25zdHJ1Y3RvciBwYXJhbWV0ZXIuXG4gICAqIEl0IGlzIG9ubHkgdXNlZCB0byBjb21wYXJlIHdpdGggYW5vdGhlciBjb25maWcgb2JqZWN0IHRvIHN1cHBvcnQgaWRlbXBvdGVudCBpbml0aWFsaXplQXBwKCkuXG4gICAqXG4gICAqIFVwZGF0aW5nIGF1dG9tYXRpY0RhdGFDb2xsZWN0aW9uRW5hYmxlZCBvbiB0aGUgQXBwIGluc3RhbmNlIHdpbGwgbm90IGNoYW5nZSBpdHMgdmFsdWUgaW4gX2NvbmZpZy5cbiAgICovXG4gIHByaXZhdGUgcmVhZG9ubHkgX2NvbmZpZzogUmVxdWlyZWQ8RmlyZWJhc2VBcHBTZXR0aW5ncz47XG4gIHByaXZhdGUgX2F1dG9tYXRpY0RhdGFDb2xsZWN0aW9uRW5hYmxlZDogYm9vbGVhbjtcbiAgcHJpdmF0ZSBfaXNEZWxldGVkID0gZmFsc2U7XG4gIHByaXZhdGUgcmVhZG9ubHkgX2NvbnRhaW5lcjogQ29tcG9uZW50Q29udGFpbmVyO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIG9wdGlvbnM6IEZpcmViYXNlT3B0aW9ucyxcbiAgICBjb25maWc6IFJlcXVpcmVkPEZpcmViYXNlQXBwU2V0dGluZ3M+LFxuICAgIGNvbnRhaW5lcjogQ29tcG9uZW50Q29udGFpbmVyXG4gICkge1xuICAgIHRoaXMuX29wdGlvbnMgPSB7IC4uLm9wdGlvbnMgfTtcbiAgICB0aGlzLl9jb25maWcgPSB7IC4uLmNvbmZpZyB9O1xuICAgIHRoaXMuX25hbWUgPSBjb25maWcubmFtZTtcbiAgICB0aGlzLl9hdXRvbWF0aWNEYXRhQ29sbGVjdGlvbkVuYWJsZWQgPVxuICAgICAgY29uZmlnLmF1dG9tYXRpY0RhdGFDb2xsZWN0aW9uRW5hYmxlZDtcbiAgICB0aGlzLl9jb250YWluZXIgPSBjb250YWluZXI7XG4gICAgdGhpcy5jb250YWluZXIuYWRkQ29tcG9uZW50KFxuICAgICAgbmV3IENvbXBvbmVudCgnYXBwJywgKCkgPT4gdGhpcywgQ29tcG9uZW50VHlwZS5QVUJMSUMpXG4gICAgKTtcbiAgfVxuXG4gIGdldCBhdXRvbWF0aWNEYXRhQ29sbGVjdGlvbkVuYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgdGhpcy5jaGVja0Rlc3Ryb3llZCgpO1xuICAgIHJldHVybiB0aGlzLl9hdXRvbWF0aWNEYXRhQ29sbGVjdGlvbkVuYWJsZWQ7XG4gIH1cblxuICBzZXQgYXV0b21hdGljRGF0YUNvbGxlY3Rpb25FbmFibGVkKHZhbDogYm9vbGVhbikge1xuICAgIHRoaXMuY2hlY2tEZXN0cm95ZWQoKTtcbiAgICB0aGlzLl9hdXRvbWF0aWNEYXRhQ29sbGVjdGlvbkVuYWJsZWQgPSB2YWw7XG4gIH1cblxuICBnZXQgbmFtZSgpOiBzdHJpbmcge1xuICAgIHRoaXMuY2hlY2tEZXN0cm95ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5fbmFtZTtcbiAgfVxuXG4gIGdldCBvcHRpb25zKCk6IEZpcmViYXNlT3B0aW9ucyB7XG4gICAgdGhpcy5jaGVja0Rlc3Ryb3llZCgpO1xuICAgIHJldHVybiB0aGlzLl9vcHRpb25zO1xuICB9XG5cbiAgZ2V0IGNvbmZpZygpOiBSZXF1aXJlZDxGaXJlYmFzZUFwcFNldHRpbmdzPiB7XG4gICAgdGhpcy5jaGVja0Rlc3Ryb3llZCgpO1xuICAgIHJldHVybiB0aGlzLl9jb25maWc7XG4gIH1cblxuICBnZXQgY29udGFpbmVyKCk6IENvbXBvbmVudENvbnRhaW5lciB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbnRhaW5lcjtcbiAgfVxuXG4gIGdldCBpc0RlbGV0ZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2lzRGVsZXRlZDtcbiAgfVxuXG4gIHNldCBpc0RlbGV0ZWQodmFsOiBib29sZWFuKSB7XG4gICAgdGhpcy5faXNEZWxldGVkID0gdmFsO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgZnVuY3Rpb24gd2lsbCB0aHJvdyBhbiBFcnJvciBpZiB0aGUgQXBwIGhhcyBhbHJlYWR5IGJlZW4gZGVsZXRlZCAtXG4gICAqIHVzZSBiZWZvcmUgcGVyZm9ybWluZyBBUEkgYWN0aW9ucyBvbiB0aGUgQXBwLlxuICAgKi9cbiAgcHJpdmF0ZSBjaGVja0Rlc3Ryb3llZCgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5pc0RlbGV0ZWQpIHtcbiAgICAgIHRocm93IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKEFwcEVycm9yLkFQUF9ERUxFVEVELCB7IGFwcE5hbWU6IHRoaXMuX25hbWUgfSk7XG4gICAgfVxuICB9XG59XG4iLCAiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHtcbiAgRmlyZWJhc2VBcHAsXG4gIEZpcmViYXNlT3B0aW9ucyxcbiAgRmlyZWJhc2VBcHBTZXR0aW5nc1xufSBmcm9tICcuL3B1YmxpYy10eXBlcyc7XG5pbXBvcnQgeyBERUZBVUxUX0VOVFJZX05BTUUsIFBMQVRGT1JNX0xPR19TVFJJTkcgfSBmcm9tICcuL2NvbnN0YW50cyc7XG5pbXBvcnQgeyBFUlJPUl9GQUNUT1JZLCBBcHBFcnJvciB9IGZyb20gJy4vZXJyb3JzJztcbmltcG9ydCB7XG4gIENvbXBvbmVudENvbnRhaW5lcixcbiAgQ29tcG9uZW50LFxuICBOYW1lLFxuICBDb21wb25lbnRUeXBlXG59IGZyb20gJ0BmaXJlYmFzZS9jb21wb25lbnQnO1xuaW1wb3J0IHsgdmVyc2lvbiB9IGZyb20gJy4uLy4uL2ZpcmViYXNlL3BhY2thZ2UuanNvbic7XG5pbXBvcnQgeyBGaXJlYmFzZUFwcEltcGwgfSBmcm9tICcuL2ZpcmViYXNlQXBwJztcbmltcG9ydCB7IF9hcHBzLCBfY29tcG9uZW50cywgX3JlZ2lzdGVyQ29tcG9uZW50IH0gZnJvbSAnLi9pbnRlcm5hbCc7XG5pbXBvcnQgeyBsb2dnZXIgfSBmcm9tICcuL2xvZ2dlcic7XG5pbXBvcnQge1xuICBMb2dMZXZlbFN0cmluZyxcbiAgc2V0TG9nTGV2ZWwgYXMgc2V0TG9nTGV2ZWxJbXBsLFxuICBMb2dDYWxsYmFjayxcbiAgTG9nT3B0aW9ucyxcbiAgc2V0VXNlckxvZ0hhbmRsZXJcbn0gZnJvbSAnQGZpcmViYXNlL2xvZ2dlcic7XG5pbXBvcnQgeyBkZWVwRXF1YWwsIGdldERlZmF1bHRBcHBDb25maWcgfSBmcm9tICdAZmlyZWJhc2UvdXRpbCc7XG5cbmV4cG9ydCB7IEZpcmViYXNlRXJyb3IgfSBmcm9tICdAZmlyZWJhc2UvdXRpbCc7XG5cbi8qKlxuICogVGhlIGN1cnJlbnQgU0RLIHZlcnNpb24uXG4gKlxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3QgU0RLX1ZFUlNJT04gPSB2ZXJzaW9uO1xuXG4vKipcbiAqIENyZWF0ZXMgYW5kIGluaXRpYWxpemVzIGEge0BsaW5rIEBmaXJlYmFzZS9hcHAjRmlyZWJhc2VBcHB9IGluc3RhbmNlLlxuICpcbiAqIFNlZVxuICoge0BsaW5rXG4gKiAgIGh0dHBzOi8vZmlyZWJhc2UuZ29vZ2xlLmNvbS9kb2NzL3dlYi9zZXR1cCNhZGRfZmlyZWJhc2VfdG9feW91cl9hcHBcbiAqICAgfCBBZGQgRmlyZWJhc2UgdG8geW91ciBhcHB9IGFuZFxuICoge0BsaW5rXG4gKiAgIGh0dHBzOi8vZmlyZWJhc2UuZ29vZ2xlLmNvbS9kb2NzL3dlYi9zZXR1cCNtdWx0aXBsZS1wcm9qZWN0c1xuICogICB8IEluaXRpYWxpemUgbXVsdGlwbGUgcHJvamVjdHN9IGZvciBkZXRhaWxlZCBkb2N1bWVudGF0aW9uLlxuICpcbiAqIEBleGFtcGxlXG4gKiBgYGBqYXZhc2NyaXB0XG4gKlxuICogLy8gSW5pdGlhbGl6ZSBkZWZhdWx0IGFwcFxuICogLy8gUmV0cmlldmUgeW91ciBvd24gb3B0aW9ucyB2YWx1ZXMgYnkgYWRkaW5nIGEgd2ViIGFwcCBvblxuICogLy8gaHR0cHM6Ly9jb25zb2xlLmZpcmViYXNlLmdvb2dsZS5jb21cbiAqIGluaXRpYWxpemVBcHAoe1xuICogICBhcGlLZXk6IFwiQUl6YS4uLi5cIiwgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEF1dGggLyBHZW5lcmFsIFVzZVxuICogICBhdXRoRG9tYWluOiBcIllPVVJfQVBQLmZpcmViYXNlYXBwLmNvbVwiLCAgICAgICAgIC8vIEF1dGggd2l0aCBwb3B1cC9yZWRpcmVjdFxuICogICBkYXRhYmFzZVVSTDogXCJodHRwczovL1lPVVJfQVBQLmZpcmViYXNlaW8uY29tXCIsIC8vIFJlYWx0aW1lIERhdGFiYXNlXG4gKiAgIHN0b3JhZ2VCdWNrZXQ6IFwiWU9VUl9BUFAuYXBwc3BvdC5jb21cIiwgICAgICAgICAgLy8gU3RvcmFnZVxuICogICBtZXNzYWdpbmdTZW5kZXJJZDogXCIxMjM0NTY3ODlcIiAgICAgICAgICAgICAgICAgIC8vIENsb3VkIE1lc3NhZ2luZ1xuICogfSk7XG4gKiBgYGBcbiAqXG4gKiBAZXhhbXBsZVxuICogYGBgamF2YXNjcmlwdFxuICpcbiAqIC8vIEluaXRpYWxpemUgYW5vdGhlciBhcHBcbiAqIGNvbnN0IG90aGVyQXBwID0gaW5pdGlhbGl6ZUFwcCh7XG4gKiAgIGRhdGFiYXNlVVJMOiBcImh0dHBzOi8vPE9USEVSX0RBVEFCQVNFX05BTUU+LmZpcmViYXNlaW8uY29tXCIsXG4gKiAgIHN0b3JhZ2VCdWNrZXQ6IFwiPE9USEVSX1NUT1JBR0VfQlVDS0VUPi5hcHBzcG90LmNvbVwiXG4gKiB9LCBcIm90aGVyQXBwXCIpO1xuICogYGBgXG4gKlxuICogQHBhcmFtIG9wdGlvbnMgLSBPcHRpb25zIHRvIGNvbmZpZ3VyZSB0aGUgYXBwJ3Mgc2VydmljZXMuXG4gKiBAcGFyYW0gbmFtZSAtIE9wdGlvbmFsIG5hbWUgb2YgdGhlIGFwcCB0byBpbml0aWFsaXplLiBJZiBubyBuYW1lXG4gKiAgIGlzIHByb3ZpZGVkLCB0aGUgZGVmYXVsdCBpcyBgXCJbREVGQVVMVF1cImAuXG4gKlxuICogQHJldHVybnMgVGhlIGluaXRpYWxpemVkIGFwcC5cbiAqXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbml0aWFsaXplQXBwKFxuICBvcHRpb25zOiBGaXJlYmFzZU9wdGlvbnMsXG4gIG5hbWU/OiBzdHJpbmdcbik6IEZpcmViYXNlQXBwO1xuLyoqXG4gKiBDcmVhdGVzIGFuZCBpbml0aWFsaXplcyBhIEZpcmViYXNlQXBwIGluc3RhbmNlLlxuICpcbiAqIEBwYXJhbSBvcHRpb25zIC0gT3B0aW9ucyB0byBjb25maWd1cmUgdGhlIGFwcCdzIHNlcnZpY2VzLlxuICogQHBhcmFtIGNvbmZpZyAtIEZpcmViYXNlQXBwIENvbmZpZ3VyYXRpb25cbiAqXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbml0aWFsaXplQXBwKFxuICBvcHRpb25zOiBGaXJlYmFzZU9wdGlvbnMsXG4gIGNvbmZpZz86IEZpcmViYXNlQXBwU2V0dGluZ3Ncbik6IEZpcmViYXNlQXBwO1xuLyoqXG4gKiBDcmVhdGVzIGFuZCBpbml0aWFsaXplcyBhIEZpcmViYXNlQXBwIGluc3RhbmNlLlxuICpcbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluaXRpYWxpemVBcHAoKTogRmlyZWJhc2VBcHA7XG5leHBvcnQgZnVuY3Rpb24gaW5pdGlhbGl6ZUFwcChcbiAgX29wdGlvbnM/OiBGaXJlYmFzZU9wdGlvbnMsXG4gIHJhd0NvbmZpZyA9IHt9XG4pOiBGaXJlYmFzZUFwcCB7XG4gIGxldCBvcHRpb25zID0gX29wdGlvbnM7XG5cbiAgaWYgKHR5cGVvZiByYXdDb25maWcgIT09ICdvYmplY3QnKSB7XG4gICAgY29uc3QgbmFtZSA9IHJhd0NvbmZpZztcbiAgICByYXdDb25maWcgPSB7IG5hbWUgfTtcbiAgfVxuXG4gIGNvbnN0IGNvbmZpZzogUmVxdWlyZWQ8RmlyZWJhc2VBcHBTZXR0aW5ncz4gPSB7XG4gICAgbmFtZTogREVGQVVMVF9FTlRSWV9OQU1FLFxuICAgIGF1dG9tYXRpY0RhdGFDb2xsZWN0aW9uRW5hYmxlZDogZmFsc2UsXG4gICAgLi4ucmF3Q29uZmlnXG4gIH07XG4gIGNvbnN0IG5hbWUgPSBjb25maWcubmFtZTtcblxuICBpZiAodHlwZW9mIG5hbWUgIT09ICdzdHJpbmcnIHx8ICFuYW1lKSB7XG4gICAgdGhyb3cgRVJST1JfRkFDVE9SWS5jcmVhdGUoQXBwRXJyb3IuQkFEX0FQUF9OQU1FLCB7XG4gICAgICBhcHBOYW1lOiBTdHJpbmcobmFtZSlcbiAgICB9KTtcbiAgfVxuXG4gIG9wdGlvbnMgfHw9IGdldERlZmF1bHRBcHBDb25maWcoKTtcblxuICBpZiAoIW9wdGlvbnMpIHtcbiAgICB0aHJvdyBFUlJPUl9GQUNUT1JZLmNyZWF0ZShBcHBFcnJvci5OT19PUFRJT05TKTtcbiAgfVxuXG4gIGNvbnN0IGV4aXN0aW5nQXBwID0gX2FwcHMuZ2V0KG5hbWUpIGFzIEZpcmViYXNlQXBwSW1wbDtcbiAgaWYgKGV4aXN0aW5nQXBwKSB7XG4gICAgLy8gcmV0dXJuIHRoZSBleGlzdGluZyBhcHAgaWYgb3B0aW9ucyBhbmQgY29uZmlnIGRlZXAgZXF1YWwgdGhlIG9uZXMgaW4gdGhlIGV4aXN0aW5nIGFwcC5cbiAgICBpZiAoXG4gICAgICBkZWVwRXF1YWwob3B0aW9ucywgZXhpc3RpbmdBcHAub3B0aW9ucykgJiZcbiAgICAgIGRlZXBFcXVhbChjb25maWcsIGV4aXN0aW5nQXBwLmNvbmZpZylcbiAgICApIHtcbiAgICAgIHJldHVybiBleGlzdGluZ0FwcDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgRVJST1JfRkFDVE9SWS5jcmVhdGUoQXBwRXJyb3IuRFVQTElDQVRFX0FQUCwgeyBhcHBOYW1lOiBuYW1lIH0pO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGNvbnRhaW5lciA9IG5ldyBDb21wb25lbnRDb250YWluZXIobmFtZSk7XG4gIGZvciAoY29uc3QgY29tcG9uZW50IG9mIF9jb21wb25lbnRzLnZhbHVlcygpKSB7XG4gICAgY29udGFpbmVyLmFkZENvbXBvbmVudChjb21wb25lbnQpO1xuICB9XG5cbiAgY29uc3QgbmV3QXBwID0gbmV3IEZpcmViYXNlQXBwSW1wbChvcHRpb25zLCBjb25maWcsIGNvbnRhaW5lcik7XG5cbiAgX2FwcHMuc2V0KG5hbWUsIG5ld0FwcCk7XG5cbiAgcmV0dXJuIG5ld0FwcDtcbn1cblxuLyoqXG4gKiBSZXRyaWV2ZXMgYSB7QGxpbmsgQGZpcmViYXNlL2FwcCNGaXJlYmFzZUFwcH0gaW5zdGFuY2UuXG4gKlxuICogV2hlbiBjYWxsZWQgd2l0aCBubyBhcmd1bWVudHMsIHRoZSBkZWZhdWx0IGFwcCBpcyByZXR1cm5lZC4gV2hlbiBhbiBhcHAgbmFtZVxuICogaXMgcHJvdmlkZWQsIHRoZSBhcHAgY29ycmVzcG9uZGluZyB0byB0aGF0IG5hbWUgaXMgcmV0dXJuZWQuXG4gKlxuICogQW4gZXhjZXB0aW9uIGlzIHRocm93biBpZiB0aGUgYXBwIGJlaW5nIHJldHJpZXZlZCBoYXMgbm90IHlldCBiZWVuXG4gKiBpbml0aWFsaXplZC5cbiAqXG4gKiBAZXhhbXBsZVxuICogYGBgamF2YXNjcmlwdFxuICogLy8gUmV0dXJuIHRoZSBkZWZhdWx0IGFwcFxuICogY29uc3QgYXBwID0gZ2V0QXBwKCk7XG4gKiBgYGBcbiAqXG4gKiBAZXhhbXBsZVxuICogYGBgamF2YXNjcmlwdFxuICogLy8gUmV0dXJuIGEgbmFtZWQgYXBwXG4gKiBjb25zdCBvdGhlckFwcCA9IGdldEFwcChcIm90aGVyQXBwXCIpO1xuICogYGBgXG4gKlxuICogQHBhcmFtIG5hbWUgLSBPcHRpb25hbCBuYW1lIG9mIHRoZSBhcHAgdG8gcmV0dXJuLiBJZiBubyBuYW1lIGlzXG4gKiAgIHByb3ZpZGVkLCB0aGUgZGVmYXVsdCBpcyBgXCJbREVGQVVMVF1cImAuXG4gKlxuICogQHJldHVybnMgVGhlIGFwcCBjb3JyZXNwb25kaW5nIHRvIHRoZSBwcm92aWRlZCBhcHAgbmFtZS5cbiAqICAgSWYgbm8gYXBwIG5hbWUgaXMgcHJvdmlkZWQsIHRoZSBkZWZhdWx0IGFwcCBpcyByZXR1cm5lZC5cbiAqXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRBcHAobmFtZTogc3RyaW5nID0gREVGQVVMVF9FTlRSWV9OQU1FKTogRmlyZWJhc2VBcHAge1xuICBjb25zdCBhcHAgPSBfYXBwcy5nZXQobmFtZSk7XG4gIGlmICghYXBwICYmIG5hbWUgPT09IERFRkFVTFRfRU5UUllfTkFNRSAmJiBnZXREZWZhdWx0QXBwQ29uZmlnKCkpIHtcbiAgICByZXR1cm4gaW5pdGlhbGl6ZUFwcCgpO1xuICB9XG4gIGlmICghYXBwKSB7XG4gICAgdGhyb3cgRVJST1JfRkFDVE9SWS5jcmVhdGUoQXBwRXJyb3IuTk9fQVBQLCB7IGFwcE5hbWU6IG5hbWUgfSk7XG4gIH1cblxuICByZXR1cm4gYXBwO1xufVxuXG4vKipcbiAqIEEgKHJlYWQtb25seSkgYXJyYXkgb2YgYWxsIGluaXRpYWxpemVkIGFwcHMuXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRBcHBzKCk6IEZpcmViYXNlQXBwW10ge1xuICByZXR1cm4gQXJyYXkuZnJvbShfYXBwcy52YWx1ZXMoKSk7XG59XG5cbi8qKlxuICogUmVuZGVycyB0aGlzIGFwcCB1bnVzYWJsZSBhbmQgZnJlZXMgdGhlIHJlc291cmNlcyBvZiBhbGwgYXNzb2NpYXRlZFxuICogc2VydmljZXMuXG4gKlxuICogQGV4YW1wbGVcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGRlbGV0ZUFwcChhcHApXG4gKiAgIC50aGVuKGZ1bmN0aW9uKCkge1xuICogICAgIGNvbnNvbGUubG9nKFwiQXBwIGRlbGV0ZWQgc3VjY2Vzc2Z1bGx5XCIpO1xuICogICB9KVxuICogICAuY2F0Y2goZnVuY3Rpb24oZXJyb3IpIHtcbiAqICAgICBjb25zb2xlLmxvZyhcIkVycm9yIGRlbGV0aW5nIGFwcDpcIiwgZXJyb3IpO1xuICogICB9KTtcbiAqIGBgYFxuICpcbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRlbGV0ZUFwcChhcHA6IEZpcmViYXNlQXBwKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IG5hbWUgPSBhcHAubmFtZTtcbiAgaWYgKF9hcHBzLmhhcyhuYW1lKSkge1xuICAgIF9hcHBzLmRlbGV0ZShuYW1lKTtcbiAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgIChhcHAgYXMgRmlyZWJhc2VBcHBJbXBsKS5jb250YWluZXJcbiAgICAgICAgLmdldFByb3ZpZGVycygpXG4gICAgICAgIC5tYXAocHJvdmlkZXIgPT4gcHJvdmlkZXIuZGVsZXRlKCkpXG4gICAgKTtcbiAgICAoYXBwIGFzIEZpcmViYXNlQXBwSW1wbCkuaXNEZWxldGVkID0gdHJ1ZTtcbiAgfVxufVxuXG4vKipcbiAqIFJlZ2lzdGVycyBhIGxpYnJhcnkncyBuYW1lIGFuZCB2ZXJzaW9uIGZvciBwbGF0Zm9ybSBsb2dnaW5nIHB1cnBvc2VzLlxuICogQHBhcmFtIGxpYnJhcnkgLSBOYW1lIG9mIDFwIG9yIDNwIGxpYnJhcnkgKGUuZy4gZmlyZXN0b3JlLCBhbmd1bGFyZmlyZSlcbiAqIEBwYXJhbSB2ZXJzaW9uIC0gQ3VycmVudCB2ZXJzaW9uIG9mIHRoYXQgbGlicmFyeS5cbiAqIEBwYXJhbSB2YXJpYW50IC0gQnVuZGxlIHZhcmlhbnQsIGUuZy4sIG5vZGUsIHJuLCBldGMuXG4gKlxuICogQHB1YmxpY1xuICovXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXJWZXJzaW9uKFxuICBsaWJyYXJ5S2V5T3JOYW1lOiBzdHJpbmcsXG4gIHZlcnNpb246IHN0cmluZyxcbiAgdmFyaWFudD86IHN0cmluZ1xuKTogdm9pZCB7XG4gIC8vIFRPRE86IFdlIGNhbiB1c2UgdGhpcyBjaGVjayB0byB3aGl0ZWxpc3Qgc3RyaW5ncyB3aGVuL2lmIHdlIHNldCB1cFxuICAvLyBhIGdvb2Qgd2hpdGVsaXN0IHN5c3RlbS5cbiAgbGV0IGxpYnJhcnkgPSBQTEFURk9STV9MT0dfU1RSSU5HW2xpYnJhcnlLZXlPck5hbWVdID8/IGxpYnJhcnlLZXlPck5hbWU7XG4gIGlmICh2YXJpYW50KSB7XG4gICAgbGlicmFyeSArPSBgLSR7dmFyaWFudH1gO1xuICB9XG4gIGNvbnN0IGxpYnJhcnlNaXNtYXRjaCA9IGxpYnJhcnkubWF0Y2goL1xcc3xcXC8vKTtcbiAgY29uc3QgdmVyc2lvbk1pc21hdGNoID0gdmVyc2lvbi5tYXRjaCgvXFxzfFxcLy8pO1xuICBpZiAobGlicmFyeU1pc21hdGNoIHx8IHZlcnNpb25NaXNtYXRjaCkge1xuICAgIGNvbnN0IHdhcm5pbmcgPSBbXG4gICAgICBgVW5hYmxlIHRvIHJlZ2lzdGVyIGxpYnJhcnkgXCIke2xpYnJhcnl9XCIgd2l0aCB2ZXJzaW9uIFwiJHt2ZXJzaW9ufVwiOmBcbiAgICBdO1xuICAgIGlmIChsaWJyYXJ5TWlzbWF0Y2gpIHtcbiAgICAgIHdhcm5pbmcucHVzaChcbiAgICAgICAgYGxpYnJhcnkgbmFtZSBcIiR7bGlicmFyeX1cIiBjb250YWlucyBpbGxlZ2FsIGNoYXJhY3RlcnMgKHdoaXRlc3BhY2Ugb3IgXCIvXCIpYFxuICAgICAgKTtcbiAgICB9XG4gICAgaWYgKGxpYnJhcnlNaXNtYXRjaCAmJiB2ZXJzaW9uTWlzbWF0Y2gpIHtcbiAgICAgIHdhcm5pbmcucHVzaCgnYW5kJyk7XG4gICAgfVxuICAgIGlmICh2ZXJzaW9uTWlzbWF0Y2gpIHtcbiAgICAgIHdhcm5pbmcucHVzaChcbiAgICAgICAgYHZlcnNpb24gbmFtZSBcIiR7dmVyc2lvbn1cIiBjb250YWlucyBpbGxlZ2FsIGNoYXJhY3RlcnMgKHdoaXRlc3BhY2Ugb3IgXCIvXCIpYFxuICAgICAgKTtcbiAgICB9XG4gICAgbG9nZ2VyLndhcm4od2FybmluZy5qb2luKCcgJykpO1xuICAgIHJldHVybjtcbiAgfVxuICBfcmVnaXN0ZXJDb21wb25lbnQoXG4gICAgbmV3IENvbXBvbmVudChcbiAgICAgIGAke2xpYnJhcnl9LXZlcnNpb25gIGFzIE5hbWUsXG4gICAgICAoKSA9PiAoeyBsaWJyYXJ5LCB2ZXJzaW9uIH0pLFxuICAgICAgQ29tcG9uZW50VHlwZS5WRVJTSU9OXG4gICAgKVxuICApO1xufVxuXG4vKipcbiAqIFNldHMgbG9nIGhhbmRsZXIgZm9yIGFsbCBGaXJlYmFzZSBTREtzLlxuICogQHBhcmFtIGxvZ0NhbGxiYWNrIC0gQW4gb3B0aW9uYWwgY3VzdG9tIGxvZyBoYW5kbGVyIHRoYXQgZXhlY3V0ZXMgdXNlciBjb2RlIHdoZW5ldmVyXG4gKiB0aGUgRmlyZWJhc2UgU0RLIG1ha2VzIGEgbG9nZ2luZyBjYWxsLlxuICpcbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG9uTG9nKFxuICBsb2dDYWxsYmFjazogTG9nQ2FsbGJhY2sgfCBudWxsLFxuICBvcHRpb25zPzogTG9nT3B0aW9uc1xuKTogdm9pZCB7XG4gIGlmIChsb2dDYWxsYmFjayAhPT0gbnVsbCAmJiB0eXBlb2YgbG9nQ2FsbGJhY2sgIT09ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBFUlJPUl9GQUNUT1JZLmNyZWF0ZShBcHBFcnJvci5JTlZBTElEX0xPR19BUkdVTUVOVCk7XG4gIH1cbiAgc2V0VXNlckxvZ0hhbmRsZXIobG9nQ2FsbGJhY2ssIG9wdGlvbnMpO1xufVxuXG4vKipcbiAqIFNldHMgbG9nIGxldmVsIGZvciBhbGwgRmlyZWJhc2UgU0RLcy5cbiAqXG4gKiBBbGwgb2YgdGhlIGxvZyB0eXBlcyBhYm92ZSB0aGUgY3VycmVudCBsb2cgbGV2ZWwgYXJlIGNhcHR1cmVkIChpLmUuIGlmXG4gKiB5b3Ugc2V0IHRoZSBsb2cgbGV2ZWwgdG8gYGluZm9gLCBlcnJvcnMgYXJlIGxvZ2dlZCwgYnV0IGBkZWJ1Z2AgYW5kXG4gKiBgdmVyYm9zZWAgbG9ncyBhcmUgbm90KS5cbiAqXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXRMb2dMZXZlbChsb2dMZXZlbDogTG9nTGV2ZWxTdHJpbmcpOiB2b2lkIHtcbiAgc2V0TG9nTGV2ZWxJbXBsKGxvZ0xldmVsKTtcbn1cbiIsICIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMSBHb29nbGUgTExDXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBGaXJlYmFzZUVycm9yIH0gZnJvbSAnQGZpcmViYXNlL3V0aWwnO1xuaW1wb3J0IHsgREJTY2hlbWEsIG9wZW5EQiwgSURCUERhdGFiYXNlIH0gZnJvbSAnaWRiJztcbmltcG9ydCB7IEFwcEVycm9yLCBFUlJPUl9GQUNUT1JZIH0gZnJvbSAnLi9lcnJvcnMnO1xuaW1wb3J0IHsgRmlyZWJhc2VBcHAgfSBmcm9tICcuL3B1YmxpYy10eXBlcyc7XG5pbXBvcnQgeyBIZWFydGJlYXRzSW5JbmRleGVkREIgfSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCB7IGxvZ2dlciB9IGZyb20gJy4vbG9nZ2VyJztcblxuY29uc3QgREJfTkFNRSA9ICdmaXJlYmFzZS1oZWFydGJlYXQtZGF0YWJhc2UnO1xuY29uc3QgREJfVkVSU0lPTiA9IDE7XG5jb25zdCBTVE9SRV9OQU1FID0gJ2ZpcmViYXNlLWhlYXJ0YmVhdC1zdG9yZSc7XG5cbmludGVyZmFjZSBBcHBEQiBleHRlbmRzIERCU2NoZW1hIHtcbiAgJ2ZpcmViYXNlLWhlYXJ0YmVhdC1zdG9yZSc6IHtcbiAgICBrZXk6IHN0cmluZztcbiAgICB2YWx1ZTogSGVhcnRiZWF0c0luSW5kZXhlZERCO1xuICB9O1xufVxuXG5sZXQgZGJQcm9taXNlOiBQcm9taXNlPElEQlBEYXRhYmFzZTxBcHBEQj4+IHwgbnVsbCA9IG51bGw7XG5mdW5jdGlvbiBnZXREYlByb21pc2UoKTogUHJvbWlzZTxJREJQRGF0YWJhc2U8QXBwREI+PiB7XG4gIGlmICghZGJQcm9taXNlKSB7XG4gICAgZGJQcm9taXNlID0gb3BlbkRCPEFwcERCPihEQl9OQU1FLCBEQl9WRVJTSU9OLCB7XG4gICAgICB1cGdyYWRlOiAoZGIsIG9sZFZlcnNpb24pID0+IHtcbiAgICAgICAgLy8gV2UgZG9uJ3QgdXNlICdicmVhaycgaW4gdGhpcyBzd2l0Y2ggc3RhdGVtZW50LCB0aGUgZmFsbC10aHJvdWdoXG4gICAgICAgIC8vIGJlaGF2aW9yIGlzIHdoYXQgd2Ugd2FudCwgYmVjYXVzZSBpZiB0aGVyZSBhcmUgbXVsdGlwbGUgdmVyc2lvbnMgYmV0d2VlblxuICAgICAgICAvLyB0aGUgb2xkIHZlcnNpb24gYW5kIHRoZSBjdXJyZW50IHZlcnNpb24sIHdlIHdhbnQgQUxMIHRoZSBtaWdyYXRpb25zXG4gICAgICAgIC8vIHRoYXQgY29ycmVzcG9uZCB0byB0aG9zZSB2ZXJzaW9ucyB0byBydW4sIG5vdCBvbmx5IHRoZSBsYXN0IG9uZS5cbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGRlZmF1bHQtY2FzZVxuICAgICAgICBzd2l0Y2ggKG9sZFZlcnNpb24pIHtcbiAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBkYi5jcmVhdGVPYmplY3RTdG9yZShTVE9SRV9OQU1FKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgLy8gU2FmYXJpL2lPUyBicm93c2VycyB0aHJvdyBvY2Nhc2lvbmFsIGV4Y2VwdGlvbnMgb25cbiAgICAgICAgICAgICAgLy8gZGIuY3JlYXRlT2JqZWN0U3RvcmUoKSB0aGF0IG1heSBiZSBhIGJ1Zy4gQXZvaWQgYmxvY2tpbmdcbiAgICAgICAgICAgICAgLy8gdGhlIHJlc3Qgb2YgdGhlIGFwcCBmdW5jdGlvbmFsaXR5LlxuICAgICAgICAgICAgICBjb25zb2xlLndhcm4oZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KS5jYXRjaChlID0+IHtcbiAgICAgIHRocm93IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKEFwcEVycm9yLklEQl9PUEVOLCB7XG4gICAgICAgIG9yaWdpbmFsRXJyb3JNZXNzYWdlOiBlLm1lc3NhZ2VcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG4gIHJldHVybiBkYlByb21pc2U7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZWFkSGVhcnRiZWF0c0Zyb21JbmRleGVkREIoXG4gIGFwcDogRmlyZWJhc2VBcHBcbik6IFByb21pc2U8SGVhcnRiZWF0c0luSW5kZXhlZERCIHwgdW5kZWZpbmVkPiB7XG4gIHRyeSB7XG4gICAgY29uc3QgZGIgPSBhd2FpdCBnZXREYlByb21pc2UoKTtcbiAgICBjb25zdCB0eCA9IGRiLnRyYW5zYWN0aW9uKFNUT1JFX05BTUUpO1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHR4Lm9iamVjdFN0b3JlKFNUT1JFX05BTUUpLmdldChjb21wdXRlS2V5KGFwcCkpO1xuICAgIC8vIFdlIGFscmVhZHkgaGF2ZSB0aGUgdmFsdWUgYnV0IHR4LmRvbmUgY2FuIHRocm93LFxuICAgIC8vIHNvIHdlIG5lZWQgdG8gYXdhaXQgaXQgaGVyZSB0byBjYXRjaCBlcnJvcnNcbiAgICBhd2FpdCB0eC5kb25lO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBpZiAoZSBpbnN0YW5jZW9mIEZpcmViYXNlRXJyb3IpIHtcbiAgICAgIGxvZ2dlci53YXJuKGUubWVzc2FnZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGlkYkdldEVycm9yID0gRVJST1JfRkFDVE9SWS5jcmVhdGUoQXBwRXJyb3IuSURCX0dFVCwge1xuICAgICAgICBvcmlnaW5hbEVycm9yTWVzc2FnZTogKGUgYXMgRXJyb3IpPy5tZXNzYWdlXG4gICAgICB9KTtcbiAgICAgIGxvZ2dlci53YXJuKGlkYkdldEVycm9yLm1lc3NhZ2UpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd3JpdGVIZWFydGJlYXRzVG9JbmRleGVkREIoXG4gIGFwcDogRmlyZWJhc2VBcHAsXG4gIGhlYXJ0YmVhdE9iamVjdDogSGVhcnRiZWF0c0luSW5kZXhlZERCXG4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBkYiA9IGF3YWl0IGdldERiUHJvbWlzZSgpO1xuICAgIGNvbnN0IHR4ID0gZGIudHJhbnNhY3Rpb24oU1RPUkVfTkFNRSwgJ3JlYWR3cml0ZScpO1xuICAgIGNvbnN0IG9iamVjdFN0b3JlID0gdHgub2JqZWN0U3RvcmUoU1RPUkVfTkFNRSk7XG4gICAgYXdhaXQgb2JqZWN0U3RvcmUucHV0KGhlYXJ0YmVhdE9iamVjdCwgY29tcHV0ZUtleShhcHApKTtcbiAgICBhd2FpdCB0eC5kb25lO1xuICB9IGNhdGNoIChlKSB7XG4gICAgaWYgKGUgaW5zdGFuY2VvZiBGaXJlYmFzZUVycm9yKSB7XG4gICAgICBsb2dnZXIud2FybihlLm1lc3NhZ2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBpZGJHZXRFcnJvciA9IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKEFwcEVycm9yLklEQl9XUklURSwge1xuICAgICAgICBvcmlnaW5hbEVycm9yTWVzc2FnZTogKGUgYXMgRXJyb3IpPy5tZXNzYWdlXG4gICAgICB9KTtcbiAgICAgIGxvZ2dlci53YXJuKGlkYkdldEVycm9yLm1lc3NhZ2UpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBjb21wdXRlS2V5KGFwcDogRmlyZWJhc2VBcHApOiBzdHJpbmcge1xuICByZXR1cm4gYCR7YXBwLm5hbWV9ISR7YXBwLm9wdGlvbnMuYXBwSWR9YDtcbn1cbiIsICIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMSBHb29nbGUgTExDXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBDb21wb25lbnRDb250YWluZXIgfSBmcm9tICdAZmlyZWJhc2UvY29tcG9uZW50JztcbmltcG9ydCB7XG4gIGJhc2U2NHVybEVuY29kZVdpdGhvdXRQYWRkaW5nLFxuICBpc0luZGV4ZWREQkF2YWlsYWJsZSxcbiAgdmFsaWRhdGVJbmRleGVkREJPcGVuYWJsZVxufSBmcm9tICdAZmlyZWJhc2UvdXRpbCc7XG5pbXBvcnQge1xuICByZWFkSGVhcnRiZWF0c0Zyb21JbmRleGVkREIsXG4gIHdyaXRlSGVhcnRiZWF0c1RvSW5kZXhlZERCXG59IGZyb20gJy4vaW5kZXhlZGRiJztcbmltcG9ydCB7IEZpcmViYXNlQXBwIH0gZnJvbSAnLi9wdWJsaWMtdHlwZXMnO1xuaW1wb3J0IHtcbiAgSGVhcnRiZWF0c0J5VXNlckFnZW50LFxuICBIZWFydGJlYXRTZXJ2aWNlLFxuICBIZWFydGJlYXRzSW5JbmRleGVkREIsXG4gIEhlYXJ0YmVhdFN0b3JhZ2UsXG4gIFNpbmdsZURhdGVIZWFydGJlYXRcbn0gZnJvbSAnLi90eXBlcyc7XG5cbmNvbnN0IE1BWF9IRUFERVJfQllURVMgPSAxMDI0O1xuLy8gMzAgZGF5c1xuY29uc3QgU1RPUkVEX0hFQVJUQkVBVF9SRVRFTlRJT05fTUFYX01JTExJUyA9IDMwICogMjQgKiA2MCAqIDYwICogMTAwMDtcblxuZXhwb3J0IGNsYXNzIEhlYXJ0YmVhdFNlcnZpY2VJbXBsIGltcGxlbWVudHMgSGVhcnRiZWF0U2VydmljZSB7XG4gIC8qKlxuICAgKiBUaGUgcGVyc2lzdGVuY2UgbGF5ZXIgZm9yIGhlYXJ0YmVhdHNcbiAgICogTGVhdmUgcHVibGljIGZvciBlYXNpZXIgdGVzdGluZy5cbiAgICovXG4gIF9zdG9yYWdlOiBIZWFydGJlYXRTdG9yYWdlSW1wbDtcblxuICAvKipcbiAgICogSW4tbWVtb3J5IGNhY2hlIGZvciBoZWFydGJlYXRzLCB1c2VkIGJ5IGdldEhlYXJ0YmVhdHNIZWFkZXIoKSB0byBnZW5lcmF0ZVxuICAgKiB0aGUgaGVhZGVyIHN0cmluZy5cbiAgICogU3RvcmVzIG9uZSByZWNvcmQgcGVyIGRhdGUuIFRoaXMgd2lsbCBiZSBjb25zb2xpZGF0ZWQgaW50byB0aGUgc3RhbmRhcmRcbiAgICogZm9ybWF0IG9mIG9uZSByZWNvcmQgcGVyIHVzZXIgYWdlbnQgc3RyaW5nIGJlZm9yZSBiZWluZyBzZW50IGFzIGEgaGVhZGVyLlxuICAgKiBQb3B1bGF0ZWQgZnJvbSBpbmRleGVkREIgd2hlbiB0aGUgY29udHJvbGxlciBpcyBpbnN0YW50aWF0ZWQgYW5kIHNob3VsZFxuICAgKiBiZSBrZXB0IGluIHN5bmMgd2l0aCBpbmRleGVkREIuXG4gICAqIExlYXZlIHB1YmxpYyBmb3IgZWFzaWVyIHRlc3RpbmcuXG4gICAqL1xuICBfaGVhcnRiZWF0c0NhY2hlOiBIZWFydGJlYXRzSW5JbmRleGVkREIgfCBudWxsID0gbnVsbDtcblxuICAvKipcbiAgICogdGhlIGluaXRpYWxpemF0aW9uIHByb21pc2UgZm9yIHBvcHVsYXRpbmcgaGVhcnRiZWF0Q2FjaGUuXG4gICAqIElmIGdldEhlYXJ0YmVhdHNIZWFkZXIoKSBpcyBjYWxsZWQgYmVmb3JlIHRoZSBwcm9taXNlIHJlc29sdmVzXG4gICAqIChoZWFyYmVhdHNDYWNoZSA9PSBudWxsKSwgaXQgc2hvdWxkIHdhaXQgZm9yIHRoaXMgcHJvbWlzZVxuICAgKiBMZWF2ZSBwdWJsaWMgZm9yIGVhc2llciB0ZXN0aW5nLlxuICAgKi9cbiAgX2hlYXJ0YmVhdHNDYWNoZVByb21pc2U6IFByb21pc2U8SGVhcnRiZWF0c0luSW5kZXhlZERCPjtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBjb250YWluZXI6IENvbXBvbmVudENvbnRhaW5lcikge1xuICAgIGNvbnN0IGFwcCA9IHRoaXMuY29udGFpbmVyLmdldFByb3ZpZGVyKCdhcHAnKS5nZXRJbW1lZGlhdGUoKTtcbiAgICB0aGlzLl9zdG9yYWdlID0gbmV3IEhlYXJ0YmVhdFN0b3JhZ2VJbXBsKGFwcCk7XG4gICAgdGhpcy5faGVhcnRiZWF0c0NhY2hlUHJvbWlzZSA9IHRoaXMuX3N0b3JhZ2UucmVhZCgpLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgIHRoaXMuX2hlYXJ0YmVhdHNDYWNoZSA9IHJlc3VsdDtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHRvIHJlcG9ydCBhIGhlYXJ0YmVhdC4gVGhlIGZ1bmN0aW9uIHdpbGwgZ2VuZXJhdGVcbiAgICogYSBIZWFydGJlYXRzQnlVc2VyQWdlbnQgb2JqZWN0LCB1cGRhdGUgaGVhcnRiZWF0c0NhY2hlLCBhbmQgcGVyc2lzdCBpdFxuICAgKiB0byBJbmRleGVkREIuXG4gICAqIE5vdGUgdGhhdCB3ZSBvbmx5IHN0b3JlIG9uZSBoZWFydGJlYXQgcGVyIGRheS4gU28gaWYgYSBoZWFydGJlYXQgZm9yIHRvZGF5IGlzXG4gICAqIGFscmVhZHkgbG9nZ2VkLCBzdWJzZXF1ZW50IGNhbGxzIHRvIHRoaXMgZnVuY3Rpb24gaW4gdGhlIHNhbWUgZGF5IHdpbGwgYmUgaWdub3JlZC5cbiAgICovXG4gIGFzeW5jIHRyaWdnZXJIZWFydGJlYXQoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgcGxhdGZvcm1Mb2dnZXIgPSB0aGlzLmNvbnRhaW5lclxuICAgICAgLmdldFByb3ZpZGVyKCdwbGF0Zm9ybS1sb2dnZXInKVxuICAgICAgLmdldEltbWVkaWF0ZSgpO1xuXG4gICAgLy8gVGhpcyBpcyB0aGUgXCJGaXJlYmFzZSB1c2VyIGFnZW50XCIgc3RyaW5nIGZyb20gdGhlIHBsYXRmb3JtIGxvZ2dlclxuICAgIC8vIHNlcnZpY2UsIG5vdCB0aGUgYnJvd3NlciB1c2VyIGFnZW50LlxuICAgIGNvbnN0IGFnZW50ID0gcGxhdGZvcm1Mb2dnZXIuZ2V0UGxhdGZvcm1JbmZvU3RyaW5nKCk7XG4gICAgY29uc3QgZGF0ZSA9IGdldFVUQ0RhdGVTdHJpbmcoKTtcbiAgICBpZiAodGhpcy5faGVhcnRiZWF0c0NhY2hlPy5oZWFydGJlYXRzID09IG51bGwpIHtcbiAgICAgIHRoaXMuX2hlYXJ0YmVhdHNDYWNoZSA9IGF3YWl0IHRoaXMuX2hlYXJ0YmVhdHNDYWNoZVByb21pc2U7XG4gICAgICAvLyBJZiB3ZSBmYWlsZWQgdG8gY29uc3RydWN0IGEgaGVhcnRiZWF0cyBjYWNoZSwgdGhlbiByZXR1cm4gaW1tZWRpYXRlbHkuXG4gICAgICBpZiAodGhpcy5faGVhcnRiZWF0c0NhY2hlPy5oZWFydGJlYXRzID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBEbyBub3Qgc3RvcmUgYSBoZWFydGJlYXQgaWYgb25lIGlzIGFscmVhZHkgc3RvcmVkIGZvciB0aGlzIGRheVxuICAgIC8vIG9yIGlmIGEgaGVhZGVyIGhhcyBhbHJlYWR5IGJlZW4gc2VudCB0b2RheS5cbiAgICBpZiAoXG4gICAgICB0aGlzLl9oZWFydGJlYXRzQ2FjaGUubGFzdFNlbnRIZWFydGJlYXREYXRlID09PSBkYXRlIHx8XG4gICAgICB0aGlzLl9oZWFydGJlYXRzQ2FjaGUuaGVhcnRiZWF0cy5zb21lKFxuICAgICAgICBzaW5nbGVEYXRlSGVhcnRiZWF0ID0+IHNpbmdsZURhdGVIZWFydGJlYXQuZGF0ZSA9PT0gZGF0ZVxuICAgICAgKVxuICAgICkge1xuICAgICAgcmV0dXJuO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBUaGVyZSBpcyBubyBlbnRyeSBmb3IgdGhpcyBkYXRlLiBDcmVhdGUgb25lLlxuICAgICAgdGhpcy5faGVhcnRiZWF0c0NhY2hlLmhlYXJ0YmVhdHMucHVzaCh7IGRhdGUsIGFnZW50IH0pO1xuICAgIH1cbiAgICAvLyBSZW1vdmUgZW50cmllcyBvbGRlciB0aGFuIDMwIGRheXMuXG4gICAgdGhpcy5faGVhcnRiZWF0c0NhY2hlLmhlYXJ0YmVhdHMgPSB0aGlzLl9oZWFydGJlYXRzQ2FjaGUuaGVhcnRiZWF0cy5maWx0ZXIoXG4gICAgICBzaW5nbGVEYXRlSGVhcnRiZWF0ID0+IHtcbiAgICAgICAgY29uc3QgaGJUaW1lc3RhbXAgPSBuZXcgRGF0ZShzaW5nbGVEYXRlSGVhcnRiZWF0LmRhdGUpLnZhbHVlT2YoKTtcbiAgICAgICAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcbiAgICAgICAgcmV0dXJuIG5vdyAtIGhiVGltZXN0YW1wIDw9IFNUT1JFRF9IRUFSVEJFQVRfUkVURU5USU9OX01BWF9NSUxMSVM7XG4gICAgICB9XG4gICAgKTtcbiAgICByZXR1cm4gdGhpcy5fc3RvcmFnZS5vdmVyd3JpdGUodGhpcy5faGVhcnRiZWF0c0NhY2hlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgYmFzZTY0IGVuY29kZWQgc3RyaW5nIHdoaWNoIGNhbiBiZSBhdHRhY2hlZCB0byB0aGUgaGVhcnRiZWF0LXNwZWNpZmljIGhlYWRlciBkaXJlY3RseS5cbiAgICogSXQgYWxzbyBjbGVhcnMgYWxsIGhlYXJ0YmVhdHMgZnJvbSBtZW1vcnkgYXMgd2VsbCBhcyBpbiBJbmRleGVkREIuXG4gICAqXG4gICAqIE5PVEU6IENvbnN1bWluZyBwcm9kdWN0IFNES3Mgc2hvdWxkIG5vdCBzZW5kIHRoZSBoZWFkZXIgaWYgdGhpcyBtZXRob2RcbiAgICogcmV0dXJucyBhbiBlbXB0eSBzdHJpbmcuXG4gICAqL1xuICBhc3luYyBnZXRIZWFydGJlYXRzSGVhZGVyKCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgaWYgKHRoaXMuX2hlYXJ0YmVhdHNDYWNoZSA9PT0gbnVsbCkge1xuICAgICAgYXdhaXQgdGhpcy5faGVhcnRiZWF0c0NhY2hlUHJvbWlzZTtcbiAgICB9XG4gICAgLy8gSWYgaXQncyBzdGlsbCBudWxsIG9yIHRoZSBhcnJheSBpcyBlbXB0eSwgdGhlcmUgaXMgbm8gZGF0YSB0byBzZW5kLlxuICAgIGlmIChcbiAgICAgIHRoaXMuX2hlYXJ0YmVhdHNDYWNoZT8uaGVhcnRiZWF0cyA9PSBudWxsIHx8XG4gICAgICB0aGlzLl9oZWFydGJlYXRzQ2FjaGUuaGVhcnRiZWF0cy5sZW5ndGggPT09IDBcbiAgICApIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgY29uc3QgZGF0ZSA9IGdldFVUQ0RhdGVTdHJpbmcoKTtcbiAgICAvLyBFeHRyYWN0IGFzIG1hbnkgaGVhcnRiZWF0cyBmcm9tIHRoZSBjYWNoZSBhcyB3aWxsIGZpdCB1bmRlciB0aGUgc2l6ZSBsaW1pdC5cbiAgICBjb25zdCB7IGhlYXJ0YmVhdHNUb1NlbmQsIHVuc2VudEVudHJpZXMgfSA9IGV4dHJhY3RIZWFydGJlYXRzRm9ySGVhZGVyKFxuICAgICAgdGhpcy5faGVhcnRiZWF0c0NhY2hlLmhlYXJ0YmVhdHNcbiAgICApO1xuICAgIGNvbnN0IGhlYWRlclN0cmluZyA9IGJhc2U2NHVybEVuY29kZVdpdGhvdXRQYWRkaW5nKFxuICAgICAgSlNPTi5zdHJpbmdpZnkoeyB2ZXJzaW9uOiAyLCBoZWFydGJlYXRzOiBoZWFydGJlYXRzVG9TZW5kIH0pXG4gICAgKTtcbiAgICAvLyBTdG9yZSBsYXN0IHNlbnQgZGF0ZSB0byBwcmV2ZW50IGFub3RoZXIgYmVpbmcgbG9nZ2VkL3NlbnQgZm9yIHRoZSBzYW1lIGRheS5cbiAgICB0aGlzLl9oZWFydGJlYXRzQ2FjaGUubGFzdFNlbnRIZWFydGJlYXREYXRlID0gZGF0ZTtcbiAgICBpZiAodW5zZW50RW50cmllcy5sZW5ndGggPiAwKSB7XG4gICAgICAvLyBTdG9yZSBhbnkgdW5zZW50IGVudHJpZXMgaWYgdGhleSBleGlzdC5cbiAgICAgIHRoaXMuX2hlYXJ0YmVhdHNDYWNoZS5oZWFydGJlYXRzID0gdW5zZW50RW50cmllcztcbiAgICAgIC8vIFRoaXMgc2VlbXMgbW9yZSBsaWtlbHkgdGhhbiBlbXB0eWluZyB0aGUgYXJyYXkgKGJlbG93KSB0byBsZWFkIHRvIHNvbWUgb2RkIHN0YXRlXG4gICAgICAvLyBzaW5jZSB0aGUgY2FjaGUgaXNuJ3QgZW1wdHkgYW5kIHRoaXMgd2lsbCBiZSBjYWxsZWQgYWdhaW4gb24gdGhlIG5leHQgcmVxdWVzdCxcbiAgICAgIC8vIGFuZCBpcyBwcm9iYWJseSBzYWZlc3QgaWYgd2UgYXdhaXQgaXQuXG4gICAgICBhd2FpdCB0aGlzLl9zdG9yYWdlLm92ZXJ3cml0ZSh0aGlzLl9oZWFydGJlYXRzQ2FjaGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9oZWFydGJlYXRzQ2FjaGUuaGVhcnRiZWF0cyA9IFtdO1xuICAgICAgLy8gRG8gbm90IHdhaXQgZm9yIHRoaXMsIHRvIHJlZHVjZSBsYXRlbmN5LlxuICAgICAgdm9pZCB0aGlzLl9zdG9yYWdlLm92ZXJ3cml0ZSh0aGlzLl9oZWFydGJlYXRzQ2FjaGUpO1xuICAgIH1cbiAgICByZXR1cm4gaGVhZGVyU3RyaW5nO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldFVUQ0RhdGVTdHJpbmcoKTogc3RyaW5nIHtcbiAgY29uc3QgdG9kYXkgPSBuZXcgRGF0ZSgpO1xuICAvLyBSZXR1cm5zIGRhdGUgZm9ybWF0ICdZWVlZLU1NLUREJ1xuICByZXR1cm4gdG9kYXkudG9JU09TdHJpbmcoKS5zdWJzdHJpbmcoMCwgMTApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZXh0cmFjdEhlYXJ0YmVhdHNGb3JIZWFkZXIoXG4gIGhlYXJ0YmVhdHNDYWNoZTogU2luZ2xlRGF0ZUhlYXJ0YmVhdFtdLFxuICBtYXhTaXplID0gTUFYX0hFQURFUl9CWVRFU1xuKToge1xuICBoZWFydGJlYXRzVG9TZW5kOiBIZWFydGJlYXRzQnlVc2VyQWdlbnRbXTtcbiAgdW5zZW50RW50cmllczogU2luZ2xlRGF0ZUhlYXJ0YmVhdFtdO1xufSB7XG4gIC8vIEhlYXJ0YmVhdHMgZ3JvdXBlZCBieSB1c2VyIGFnZW50IGluIHRoZSBzdGFuZGFyZCBmb3JtYXQgdG8gYmUgc2VudCBpblxuICAvLyB0aGUgaGVhZGVyLlxuICBjb25zdCBoZWFydGJlYXRzVG9TZW5kOiBIZWFydGJlYXRzQnlVc2VyQWdlbnRbXSA9IFtdO1xuICAvLyBTaW5nbGUgZGF0ZSBmb3JtYXQgaGVhcnRiZWF0cyB0aGF0IGFyZSBub3Qgc2VudC5cbiAgbGV0IHVuc2VudEVudHJpZXMgPSBoZWFydGJlYXRzQ2FjaGUuc2xpY2UoKTtcbiAgZm9yIChjb25zdCBzaW5nbGVEYXRlSGVhcnRiZWF0IG9mIGhlYXJ0YmVhdHNDYWNoZSkge1xuICAgIC8vIExvb2sgZm9yIGFuIGV4aXN0aW5nIGVudHJ5IHdpdGggdGhlIHNhbWUgdXNlciBhZ2VudC5cbiAgICBjb25zdCBoZWFydGJlYXRFbnRyeSA9IGhlYXJ0YmVhdHNUb1NlbmQuZmluZChcbiAgICAgIGhiID0+IGhiLmFnZW50ID09PSBzaW5nbGVEYXRlSGVhcnRiZWF0LmFnZW50XG4gICAgKTtcbiAgICBpZiAoIWhlYXJ0YmVhdEVudHJ5KSB7XG4gICAgICAvLyBJZiBubyBlbnRyeSBmb3IgdGhpcyB1c2VyIGFnZW50IGV4aXN0cywgY3JlYXRlIG9uZS5cbiAgICAgIGhlYXJ0YmVhdHNUb1NlbmQucHVzaCh7XG4gICAgICAgIGFnZW50OiBzaW5nbGVEYXRlSGVhcnRiZWF0LmFnZW50LFxuICAgICAgICBkYXRlczogW3NpbmdsZURhdGVIZWFydGJlYXQuZGF0ZV1cbiAgICAgIH0pO1xuICAgICAgaWYgKGNvdW50Qnl0ZXMoaGVhcnRiZWF0c1RvU2VuZCkgPiBtYXhTaXplKSB7XG4gICAgICAgIC8vIElmIHRoZSBoZWFkZXIgd291bGQgZXhjZWVkIG1heCBzaXplLCByZW1vdmUgdGhlIGFkZGVkIGhlYXJ0YmVhdFxuICAgICAgICAvLyBlbnRyeSBhbmQgc3RvcCBhZGRpbmcgdG8gdGhlIGhlYWRlci5cbiAgICAgICAgaGVhcnRiZWF0c1RvU2VuZC5wb3AoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGhlYXJ0YmVhdEVudHJ5LmRhdGVzLnB1c2goc2luZ2xlRGF0ZUhlYXJ0YmVhdC5kYXRlKTtcbiAgICAgIC8vIElmIHRoZSBoZWFkZXIgd291bGQgZXhjZWVkIG1heCBzaXplLCByZW1vdmUgdGhlIGFkZGVkIGRhdGVcbiAgICAgIC8vIGFuZCBzdG9wIGFkZGluZyB0byB0aGUgaGVhZGVyLlxuICAgICAgaWYgKGNvdW50Qnl0ZXMoaGVhcnRiZWF0c1RvU2VuZCkgPiBtYXhTaXplKSB7XG4gICAgICAgIGhlYXJ0YmVhdEVudHJ5LmRhdGVzLnBvcCgpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gUG9wIHVuc2VudCBlbnRyeSBmcm9tIHF1ZXVlLiAoU2tpcHBlZCBpZiBhZGRpbmcgdGhlIGVudHJ5IGV4Y2VlZGVkXG4gICAgLy8gcXVvdGEgYW5kIHRoZSBsb29wIGJyZWFrcyBlYXJseS4pXG4gICAgdW5zZW50RW50cmllcyA9IHVuc2VudEVudHJpZXMuc2xpY2UoMSk7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBoZWFydGJlYXRzVG9TZW5kLFxuICAgIHVuc2VudEVudHJpZXNcbiAgfTtcbn1cblxuZXhwb3J0IGNsYXNzIEhlYXJ0YmVhdFN0b3JhZ2VJbXBsIGltcGxlbWVudHMgSGVhcnRiZWF0U3RvcmFnZSB7XG4gIHByaXZhdGUgX2NhblVzZUluZGV4ZWREQlByb21pc2U6IFByb21pc2U8Ym9vbGVhbj47XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBhcHA6IEZpcmViYXNlQXBwKSB7XG4gICAgdGhpcy5fY2FuVXNlSW5kZXhlZERCUHJvbWlzZSA9IHRoaXMucnVuSW5kZXhlZERCRW52aXJvbm1lbnRDaGVjaygpO1xuICB9XG4gIGFzeW5jIHJ1bkluZGV4ZWREQkVudmlyb25tZW50Q2hlY2soKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgaWYgKCFpc0luZGV4ZWREQkF2YWlsYWJsZSgpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB2YWxpZGF0ZUluZGV4ZWREQk9wZW5hYmxlKClcbiAgICAgICAgLnRoZW4oKCkgPT4gdHJ1ZSlcbiAgICAgICAgLmNhdGNoKCgpID0+IGZhbHNlKTtcbiAgICB9XG4gIH1cbiAgLyoqXG4gICAqIFJlYWQgYWxsIGhlYXJ0YmVhdHMuXG4gICAqL1xuICBhc3luYyByZWFkKCk6IFByb21pc2U8SGVhcnRiZWF0c0luSW5kZXhlZERCPiB7XG4gICAgY29uc3QgY2FuVXNlSW5kZXhlZERCID0gYXdhaXQgdGhpcy5fY2FuVXNlSW5kZXhlZERCUHJvbWlzZTtcbiAgICBpZiAoIWNhblVzZUluZGV4ZWREQikge1xuICAgICAgcmV0dXJuIHsgaGVhcnRiZWF0czogW10gfTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgaWRiSGVhcnRiZWF0T2JqZWN0ID0gYXdhaXQgcmVhZEhlYXJ0YmVhdHNGcm9tSW5kZXhlZERCKHRoaXMuYXBwKTtcbiAgICAgIGlmIChpZGJIZWFydGJlYXRPYmplY3Q/LmhlYXJ0YmVhdHMpIHtcbiAgICAgICAgcmV0dXJuIGlkYkhlYXJ0YmVhdE9iamVjdDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB7IGhlYXJ0YmVhdHM6IFtdIH07XG4gICAgICB9XG4gICAgfVxuICB9XG4gIC8vIG92ZXJ3cml0ZSB0aGUgc3RvcmFnZSB3aXRoIHRoZSBwcm92aWRlZCBoZWFydGJlYXRzXG4gIGFzeW5jIG92ZXJ3cml0ZShoZWFydGJlYXRzT2JqZWN0OiBIZWFydGJlYXRzSW5JbmRleGVkREIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBjYW5Vc2VJbmRleGVkREIgPSBhd2FpdCB0aGlzLl9jYW5Vc2VJbmRleGVkREJQcm9taXNlO1xuICAgIGlmICghY2FuVXNlSW5kZXhlZERCKSB7XG4gICAgICByZXR1cm47XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGV4aXN0aW5nSGVhcnRiZWF0c09iamVjdCA9IGF3YWl0IHRoaXMucmVhZCgpO1xuICAgICAgcmV0dXJuIHdyaXRlSGVhcnRiZWF0c1RvSW5kZXhlZERCKHRoaXMuYXBwLCB7XG4gICAgICAgIGxhc3RTZW50SGVhcnRiZWF0RGF0ZTpcbiAgICAgICAgICBoZWFydGJlYXRzT2JqZWN0Lmxhc3RTZW50SGVhcnRiZWF0RGF0ZSA/P1xuICAgICAgICAgIGV4aXN0aW5nSGVhcnRiZWF0c09iamVjdC5sYXN0U2VudEhlYXJ0YmVhdERhdGUsXG4gICAgICAgIGhlYXJ0YmVhdHM6IGhlYXJ0YmVhdHNPYmplY3QuaGVhcnRiZWF0c1xuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIC8vIGFkZCBoZWFydGJlYXRzXG4gIGFzeW5jIGFkZChoZWFydGJlYXRzT2JqZWN0OiBIZWFydGJlYXRzSW5JbmRleGVkREIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBjYW5Vc2VJbmRleGVkREIgPSBhd2FpdCB0aGlzLl9jYW5Vc2VJbmRleGVkREJQcm9taXNlO1xuICAgIGlmICghY2FuVXNlSW5kZXhlZERCKSB7XG4gICAgICByZXR1cm47XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGV4aXN0aW5nSGVhcnRiZWF0c09iamVjdCA9IGF3YWl0IHRoaXMucmVhZCgpO1xuICAgICAgcmV0dXJuIHdyaXRlSGVhcnRiZWF0c1RvSW5kZXhlZERCKHRoaXMuYXBwLCB7XG4gICAgICAgIGxhc3RTZW50SGVhcnRiZWF0RGF0ZTpcbiAgICAgICAgICBoZWFydGJlYXRzT2JqZWN0Lmxhc3RTZW50SGVhcnRiZWF0RGF0ZSA/P1xuICAgICAgICAgIGV4aXN0aW5nSGVhcnRiZWF0c09iamVjdC5sYXN0U2VudEhlYXJ0YmVhdERhdGUsXG4gICAgICAgIGhlYXJ0YmVhdHM6IFtcbiAgICAgICAgICAuLi5leGlzdGluZ0hlYXJ0YmVhdHNPYmplY3QuaGVhcnRiZWF0cyxcbiAgICAgICAgICAuLi5oZWFydGJlYXRzT2JqZWN0LmhlYXJ0YmVhdHNcbiAgICAgICAgXVxuICAgICAgfSk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQ2FsY3VsYXRlIGJ5dGVzIG9mIGEgSGVhcnRiZWF0c0J5VXNlckFnZW50IGFycmF5IGFmdGVyIGJlaW5nIHdyYXBwZWRcbiAqIGluIGEgcGxhdGZvcm0gbG9nZ2luZyBoZWFkZXIgSlNPTiBvYmplY3QsIHN0cmluZ2lmaWVkLCBhbmQgY29udmVydGVkXG4gKiB0byBiYXNlIDY0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gY291bnRCeXRlcyhoZWFydGJlYXRzQ2FjaGU6IEhlYXJ0YmVhdHNCeVVzZXJBZ2VudFtdKTogbnVtYmVyIHtcbiAgLy8gYmFzZTY0IGhhcyBhIHJlc3RyaWN0ZWQgc2V0IG9mIGNoYXJhY3RlcnMsIGFsbCBvZiB3aGljaCBzaG91bGQgYmUgMSBieXRlLlxuICByZXR1cm4gYmFzZTY0dXJsRW5jb2RlV2l0aG91dFBhZGRpbmcoXG4gICAgLy8gaGVhcnRiZWF0c0NhY2hlIHdyYXBwZXIgcHJvcGVydGllc1xuICAgIEpTT04uc3RyaW5naWZ5KHsgdmVyc2lvbjogMiwgaGVhcnRiZWF0czogaGVhcnRiZWF0c0NhY2hlIH0pXG4gICkubGVuZ3RoO1xufVxuIiwgIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IENvbXBvbmVudCwgQ29tcG9uZW50VHlwZSB9IGZyb20gJ0BmaXJlYmFzZS9jb21wb25lbnQnO1xuaW1wb3J0IHsgUGxhdGZvcm1Mb2dnZXJTZXJ2aWNlSW1wbCB9IGZyb20gJy4vcGxhdGZvcm1Mb2dnZXJTZXJ2aWNlJztcbmltcG9ydCB7IG5hbWUsIHZlcnNpb24gfSBmcm9tICcuLi9wYWNrYWdlLmpzb24nO1xuaW1wb3J0IHsgX3JlZ2lzdGVyQ29tcG9uZW50IH0gZnJvbSAnLi9pbnRlcm5hbCc7XG5pbXBvcnQgeyByZWdpc3RlclZlcnNpb24gfSBmcm9tICcuL2FwaSc7XG5pbXBvcnQgeyBIZWFydGJlYXRTZXJ2aWNlSW1wbCB9IGZyb20gJy4vaGVhcnRiZWF0U2VydmljZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiByZWdpc3RlckNvcmVDb21wb25lbnRzKHZhcmlhbnQ/OiBzdHJpbmcpOiB2b2lkIHtcbiAgX3JlZ2lzdGVyQ29tcG9uZW50KFxuICAgIG5ldyBDb21wb25lbnQoXG4gICAgICAncGxhdGZvcm0tbG9nZ2VyJyxcbiAgICAgIGNvbnRhaW5lciA9PiBuZXcgUGxhdGZvcm1Mb2dnZXJTZXJ2aWNlSW1wbChjb250YWluZXIpLFxuICAgICAgQ29tcG9uZW50VHlwZS5QUklWQVRFXG4gICAgKVxuICApO1xuICBfcmVnaXN0ZXJDb21wb25lbnQoXG4gICAgbmV3IENvbXBvbmVudChcbiAgICAgICdoZWFydGJlYXQnLFxuICAgICAgY29udGFpbmVyID0+IG5ldyBIZWFydGJlYXRTZXJ2aWNlSW1wbChjb250YWluZXIpLFxuICAgICAgQ29tcG9uZW50VHlwZS5QUklWQVRFXG4gICAgKVxuICApO1xuXG4gIC8vIFJlZ2lzdGVyIGBhcHBgIHBhY2thZ2UuXG4gIHJlZ2lzdGVyVmVyc2lvbihuYW1lLCB2ZXJzaW9uLCB2YXJpYW50KTtcbiAgLy8gQlVJTERfVEFSR0VUIHdpbGwgYmUgcmVwbGFjZWQgYnkgdmFsdWVzIGxpa2UgZXNtNSwgZXNtMjAxNywgY2pzNSwgZXRjIGR1cmluZyB0aGUgY29tcGlsYXRpb25cbiAgcmVnaXN0ZXJWZXJzaW9uKG5hbWUsIHZlcnNpb24sICdfX0JVSUxEX1RBUkdFVF9fJyk7XG4gIC8vIFJlZ2lzdGVyIHBsYXRmb3JtIFNESyBpZGVudGlmaWVyIChubyB2ZXJzaW9uKS5cbiAgcmVnaXN0ZXJWZXJzaW9uKCdmaXJlLWpzJywgJycpO1xufVxuIiwgIi8qKlxuICogRmlyZWJhc2UgQXBwXG4gKlxuICogQHJlbWFya3MgVGhpcyBwYWNrYWdlIGNvb3JkaW5hdGVzIHRoZSBjb21tdW5pY2F0aW9uIGJldHdlZW4gdGhlIGRpZmZlcmVudCBGaXJlYmFzZSBjb21wb25lbnRzXG4gKiBAcGFja2FnZURvY3VtZW50YXRpb25cbiAqL1xuXG4vKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyByZWdpc3RlckNvcmVDb21wb25lbnRzIH0gZnJvbSAnLi9yZWdpc3RlckNvcmVDb21wb25lbnRzJztcblxuZXhwb3J0ICogZnJvbSAnLi9hcGknO1xuZXhwb3J0ICogZnJvbSAnLi9pbnRlcm5hbCc7XG5leHBvcnQgKiBmcm9tICcuL3B1YmxpYy10eXBlcyc7XG5cbnJlZ2lzdGVyQ29yZUNvbXBvbmVudHMoJ19fUlVOVElNRV9FTlZfXycpO1xuIiwgIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTENcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5pbXBvcnQgeyByZWdpc3RlclZlcnNpb24gfSBmcm9tICdAZmlyZWJhc2UvYXBwJztcbmltcG9ydCB7IG5hbWUsIHZlcnNpb24gfSBmcm9tICcuLi9wYWNrYWdlLmpzb24nO1xuXG5yZWdpc3RlclZlcnNpb24obmFtZSwgdmVyc2lvbiwgJ2FwcCcpO1xuZXhwb3J0ICogZnJvbSAnQGZpcmViYXNlL2FwcCc7XG4iLCAiaW1wb3J0IHsgaW5pdGlhbGl6ZUFwcCB9IGZyb20gXCJmaXJlYmFzZS9hcHBcIjtcclxuZXhwb3J0IGZ1bmN0aW9uIGNvbmZpZygpIHtcclxuICAgIGNvbnN0IGZpcmViYXNlQ29uZmlnID0ge1xyXG4gICAgICAgIFwiYXBpS2V5XCI6IFwiQUl6YVN5QTc3SFl0VmRzSkRfU2R3RGdkVld2R0RlREExSUlxdUtZXCIsXHJcbiAgICAgICAgXCJhdXRoRG9tYWluXCI6IFwic2Z4LXJvY2tzLmZpcmViYXNlYXBwLmNvbVwiLFxyXG4gICAgICAgIFwicHJvamVjdElkXCI6IFwic2Z4LXJvY2tzXCIsXHJcbiAgICAgICAgXCJzdG9yYWdlQnVja2V0XCI6IFwic2Z4LXJvY2tzLmFwcHNwb3QuY29tXCIsXHJcbiAgICAgICAgXCJtZXNzYWdpbmdTZW5kZXJJZFwiOiBcIjIyMTMyMDI2OTkyMFwiLFxyXG4gICAgICAgIFwiYXBwSWRcIjogXCIxOjIyMTMyMDI2OTkyMDp3ZWI6MDgwNGVkOWRmZTA4YzQ2NjY3NzMwNVwiLFxyXG4gICAgICAgIFwibWVhc3VyZW1lbnRJZFwiOiBcIkctVjUwNkhLUzNORVwiXHJcbiAgICB9XHJcbiAgICBjb25zdCBhcHAgPSBpbml0aWFsaXplQXBwKGZpcmViYXNlQ29uZmlnKTtcclxufSIsICJpbXBvcnQgeyBjb25maWcgfSBmcm9tIFwiLi9maXJlYmFzZS5jb25maWdcIjtcclxuY29uZmlnKCk7XHJcblxyXG5hc3luYyBmdW5jdGlvbiBnZXRDYXRlZ29yeSgpIHtcclxuICAgIGNvbnNvbGUubG9nKFwiZ2V0dGluZyBmaWxlcy4uLlwiKTtcclxuICAgIGNvbnN0IHN0b3JhZ2UgPSBnZXRTdG9yYWdlKCk7XHJcblxyXG4gICAgY29uc3QgcmVmX3RleHQgPSByZWYoc3RvcmFnZSwgJ2NhdGVnb3J5Lmpzb24nKTtcclxuICAgIGNvbnN0IHRleHRfdXJsID0gYXdhaXQgZ2V0RG93bmxvYWRVUkwocmVmX3RleHQpO1xyXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh0ZXh0X3VybCwgeyBtb2RlOiAnY29ycycgfSk7XHJcbiAgICBsZXQgdGV4dCA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKTtcclxuICAgIHRleHQgPSBKU09OLnBhcnNlKHRleHQpO1xyXG4gICAgY29uc29sZS5sb2codGV4dCk7XHJcbiAgICAvLyByZXR1cm4gdGV4dDtcclxufVxyXG5cclxuXHJcbi8vIHRvZG86IGFjY2VzcyBzb3VuZHMgYW5kIGltYWdlcyBmcm9tIGZpcmViYXNlXHJcbmFzeW5jIGZ1bmN0aW9uIGdldFNvdW5kc0FuZEltYWdlcygpIHtcclxuXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNlYXJjaCgpIHtcclxuICAgIGNvbnN0IEZ1c2UgPSByZXF1aXJlKFwiZnVzZS5qc1wiKTtcclxuICAgIC8vICEgYWxsX3NvdW5kcy5qc29uIHdpbGwgYmUgcmVwbGFjZWQgd2l0aCBhIGxpbmsgdG8gYSAuanNvbiBmaWxlIG9ubGluZVxyXG4gICAgY29uc3QgZnVzZSA9IG5ldyBGdXNlKGFsbF9zb3VuZHMsIHtcclxuICAgICAgICBrZXlzOiBbJ25hbWUnLCAnaWQnLCAnY2F0ZWdvcnknXVxyXG4gICAgfSk7XHJcblxyXG4gICAgbGV0IG91dHB1dCA9IGZ1c2Uuc2VhcmNoKCdHb29meSBDYXIgSG9ybicpO1xyXG4gICAgY29uc29sZS5sb2cob3V0cHV0KTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ29qb2RldigpIHtcclxuICAgIGxldCBlbW1hbnVlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ29qb2RldlwiKTtcclxuICAgIGxldCBpbmRleCA9IDE7XHJcbiAgICBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcblxyXG4gICAgICAgIGVtbWFudWVsLmNsYXNzTGlzdC5yZW1vdmUoXCJmYWRlSW5cIik7XHJcbiAgICAgICAgZW1tYW51ZWwub2Zmc2V0V2lkdGg7XHJcbiAgICAgICAgZW1tYW51ZWwuY2xhc3NMaXN0LmFkZChcImZhZGVJblwiKTtcclxuXHJcbiAgICAgICAgaWYgKGluZGV4ID09IDApIHtcclxuICAgICAgICAgICAgZW1tYW51ZWwuc3JjID0gXCJpbWFnZXMvZ29qb2Rldi53ZWJwXCI7XHJcbiAgICAgICAgICAgIGluZGV4ID0gMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGVtbWFudWVsLnNyYyA9IFwiaW1hZ2VzL3NmeF9yb2Nrcy53ZWJwXCI7XHJcbiAgICAgICAgICAgIGluZGV4ID0gMDtcclxuICAgICAgICB9XHJcbiAgICB9LCAzNTAwKVxyXG59XHJcblxyXG4vLyA/IERPTVxyXG4vLyBnb2pvZGV2KClcclxuXHJcbi8vIHRvZG86IGFsbG93IHRoZSB1c2VycyB0byBzdWJtaXQgc291bmRzIHRocm91Z2ggdGhlIHdlYnNpdGVcclxuZnVuY3Rpb24gc3VibWl0KCkge1xyXG5cclxufVxyXG5cclxuLy8gdG9kbzogZ2VuZXJhdGUgc2hvdyBhbGwgdGhlIHNvdW5kcyBhbmQgdGhlaXIgaW1hZ2VzXHJcbmZ1bmN0aW9uIHNob3dfc291bmRzKCkge1xyXG5cclxufSJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUVpQkEsTUFBTUEsc0JBQW9CLFNBQVUsS0FBVztBQUU3QyxVQUFNLE1BQWdCLENBQUE7QUFDdEIsUUFBSSxJQUFJO0FBQ1IsYUFBUyxJQUFJLEdBQUcsSUFBSSxJQUFJLFFBQVEsS0FBSztBQUNuQyxVQUFJLElBQUksSUFBSSxXQUFXLENBQUM7QUFDeEIsVUFBSSxJQUFJLEtBQUs7QUFDWCxZQUFJLEdBQUcsSUFBSTtNQUNaLFdBQVUsSUFBSSxNQUFNO0FBQ25CLFlBQUksR0FBRyxJQUFLLEtBQUssSUFBSztBQUN0QixZQUFJLEdBQUcsSUFBSyxJQUFJLEtBQU07TUFDdkIsWUFDRSxJQUFJLFdBQVksU0FDakIsSUFBSSxJQUFJLElBQUksV0FDWCxJQUFJLFdBQVcsSUFBSSxDQUFDLElBQUksV0FBWSxPQUNyQztBQUVBLFlBQUksVUFBWSxJQUFJLFNBQVcsT0FBTyxJQUFJLFdBQVcsRUFBRSxDQUFDLElBQUk7QUFDNUQsWUFBSSxHQUFHLElBQUssS0FBSyxLQUFNO0FBQ3ZCLFlBQUksR0FBRyxJQUFNLEtBQUssS0FBTSxLQUFNO0FBQzlCLFlBQUksR0FBRyxJQUFNLEtBQUssSUFBSyxLQUFNO0FBQzdCLFlBQUksR0FBRyxJQUFLLElBQUksS0FBTTtNQUN2QixPQUFNO0FBQ0wsWUFBSSxHQUFHLElBQUssS0FBSyxLQUFNO0FBQ3ZCLFlBQUksR0FBRyxJQUFNLEtBQUssSUFBSyxLQUFNO0FBQzdCLFlBQUksR0FBRyxJQUFLLElBQUksS0FBTTtNQUN2QjtJQUNGO0FBQ0QsV0FBTztFQUNUO0FBUUEsTUFBTSxvQkFBb0IsU0FBVSxPQUFlO0FBRWpELFVBQU0sTUFBZ0IsQ0FBQTtBQUN0QixRQUFJLE1BQU0sR0FDUixJQUFJO0FBQ04sV0FBTyxNQUFNLE1BQU0sUUFBUTtBQUN6QixZQUFNLEtBQUssTUFBTSxLQUFLO0FBQ3RCLFVBQUksS0FBSyxLQUFLO0FBQ1osWUFBSSxHQUFHLElBQUksT0FBTyxhQUFhLEVBQUU7TUFDbEMsV0FBVSxLQUFLLE9BQU8sS0FBSyxLQUFLO0FBQy9CLGNBQU0sS0FBSyxNQUFNLEtBQUs7QUFDdEIsWUFBSSxHQUFHLElBQUksT0FBTyxjQUFlLEtBQUssT0FBTyxJQUFNLEtBQUssRUFBRztNQUM1RCxXQUFVLEtBQUssT0FBTyxLQUFLLEtBQUs7QUFFL0IsY0FBTSxLQUFLLE1BQU0sS0FBSztBQUN0QixjQUFNLEtBQUssTUFBTSxLQUFLO0FBQ3RCLGNBQU0sS0FBSyxNQUFNLEtBQUs7QUFDdEIsY0FBTSxNQUNELEtBQUssTUFBTSxNQUFRLEtBQUssT0FBTyxNQUFRLEtBQUssT0FBTyxJQUFNLEtBQUssTUFDakU7QUFDRixZQUFJLEdBQUcsSUFBSSxPQUFPLGFBQWEsU0FBVSxLQUFLLEdBQUc7QUFDakQsWUFBSSxHQUFHLElBQUksT0FBTyxhQUFhLFNBQVUsSUFBSSxLQUFLO01BQ25ELE9BQU07QUFDTCxjQUFNLEtBQUssTUFBTSxLQUFLO0FBQ3RCLGNBQU0sS0FBSyxNQUFNLEtBQUs7QUFDdEIsWUFBSSxHQUFHLElBQUksT0FBTyxjQUNkLEtBQUssT0FBTyxNQUFRLEtBQUssT0FBTyxJQUFNLEtBQUssRUFBRztNQUVuRDtJQUNGO0FBQ0QsV0FBTyxJQUFJLEtBQUssRUFBRTtFQUNwQjtBQXFCYSxNQUFBLFNBQWlCOzs7O0lBSTVCLGdCQUFnQjs7OztJQUtoQixnQkFBZ0I7Ozs7O0lBTWhCLHVCQUF1Qjs7Ozs7SUFNdkIsdUJBQXVCOzs7OztJQU12QixtQkFDRTs7OztJQUtGLElBQUksZUFBWTtBQUNkLGFBQU8sS0FBSyxvQkFBb0I7Ozs7O0lBTWxDLElBQUksdUJBQW9CO0FBQ3RCLGFBQU8sS0FBSyxvQkFBb0I7Ozs7Ozs7OztJQVVsQyxvQkFBb0IsT0FBTyxTQUFTOzs7Ozs7Ozs7O0lBV3BDLGdCQUFnQixPQUE4QixTQUFpQjtBQUM3RCxVQUFJLENBQUMsTUFBTSxRQUFRLEtBQUssR0FBRztBQUN6QixjQUFNLE1BQU0sK0NBQStDO01BQzVEO0FBRUQsV0FBSyxNQUFLO0FBRVYsWUFBTSxnQkFBZ0IsVUFDbEIsS0FBSyx3QkFDTCxLQUFLO0FBRVQsWUFBTSxTQUFTLENBQUE7QUFFZixlQUFTLElBQUksR0FBRyxJQUFJLE1BQU0sUUFBUSxLQUFLLEdBQUc7QUFDeEMsY0FBTSxRQUFRLE1BQU0sQ0FBQztBQUNyQixjQUFNLFlBQVksSUFBSSxJQUFJLE1BQU07QUFDaEMsY0FBTSxRQUFRLFlBQVksTUFBTSxJQUFJLENBQUMsSUFBSTtBQUN6QyxjQUFNLFlBQVksSUFBSSxJQUFJLE1BQU07QUFDaEMsY0FBTSxRQUFRLFlBQVksTUFBTSxJQUFJLENBQUMsSUFBSTtBQUV6QyxjQUFNLFdBQVcsU0FBUztBQUMxQixjQUFNLFlBQWEsUUFBUSxNQUFTLElBQU0sU0FBUztBQUNuRCxZQUFJLFlBQWEsUUFBUSxPQUFTLElBQU0sU0FBUztBQUNqRCxZQUFJLFdBQVcsUUFBUTtBQUV2QixZQUFJLENBQUMsV0FBVztBQUNkLHFCQUFXO0FBRVgsY0FBSSxDQUFDLFdBQVc7QUFDZCx1QkFBVztVQUNaO1FBQ0Y7QUFFRCxlQUFPLEtBQ0wsY0FBYyxRQUFRLEdBQ3RCLGNBQWMsUUFBUSxHQUN0QixjQUFjLFFBQVEsR0FDdEIsY0FBYyxRQUFRLENBQUM7TUFFMUI7QUFFRCxhQUFPLE9BQU8sS0FBSyxFQUFFOzs7Ozs7Ozs7O0lBV3ZCLGFBQWEsT0FBZSxTQUFpQjtBQUczQyxVQUFJLEtBQUssc0JBQXNCLENBQUMsU0FBUztBQUN2QyxlQUFPLEtBQUssS0FBSztNQUNsQjtBQUNELGFBQU8sS0FBSyxnQkFBZ0JBLG9CQUFrQixLQUFLLEdBQUcsT0FBTzs7Ozs7Ozs7OztJQVcvRCxhQUFhLE9BQWUsU0FBZ0I7QUFHMUMsVUFBSSxLQUFLLHNCQUFzQixDQUFDLFNBQVM7QUFDdkMsZUFBTyxLQUFLLEtBQUs7TUFDbEI7QUFDRCxhQUFPLGtCQUFrQixLQUFLLHdCQUF3QixPQUFPLE9BQU8sQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFrQnZFLHdCQUF3QixPQUFlLFNBQWdCO0FBQ3JELFdBQUssTUFBSztBQUVWLFlBQU0sZ0JBQWdCLFVBQ2xCLEtBQUssd0JBQ0wsS0FBSztBQUVULFlBQU0sU0FBbUIsQ0FBQTtBQUV6QixlQUFTLElBQUksR0FBRyxJQUFJLE1BQU0sVUFBVTtBQUNsQyxjQUFNLFFBQVEsY0FBYyxNQUFNLE9BQU8sR0FBRyxDQUFDO0FBRTdDLGNBQU0sWUFBWSxJQUFJLE1BQU07QUFDNUIsY0FBTSxRQUFRLFlBQVksY0FBYyxNQUFNLE9BQU8sQ0FBQyxDQUFDLElBQUk7QUFDM0QsVUFBRTtBQUVGLGNBQU0sWUFBWSxJQUFJLE1BQU07QUFDNUIsY0FBTSxRQUFRLFlBQVksY0FBYyxNQUFNLE9BQU8sQ0FBQyxDQUFDLElBQUk7QUFDM0QsVUFBRTtBQUVGLGNBQU0sWUFBWSxJQUFJLE1BQU07QUFDNUIsY0FBTSxRQUFRLFlBQVksY0FBYyxNQUFNLE9BQU8sQ0FBQyxDQUFDLElBQUk7QUFDM0QsVUFBRTtBQUVGLFlBQUksU0FBUyxRQUFRLFNBQVMsUUFBUSxTQUFTLFFBQVEsU0FBUyxNQUFNO0FBQ3BFLGdCQUFNLElBQUksd0JBQXVCO1FBQ2xDO0FBRUQsY0FBTSxXQUFZLFNBQVMsSUFBTSxTQUFTO0FBQzFDLGVBQU8sS0FBSyxRQUFRO0FBRXBCLFlBQUksVUFBVSxJQUFJO0FBQ2hCLGdCQUFNLFdBQWEsU0FBUyxJQUFLLE1BQVMsU0FBUztBQUNuRCxpQkFBTyxLQUFLLFFBQVE7QUFFcEIsY0FBSSxVQUFVLElBQUk7QUFDaEIsa0JBQU0sV0FBYSxTQUFTLElBQUssTUFBUTtBQUN6QyxtQkFBTyxLQUFLLFFBQVE7VUFDckI7UUFDRjtNQUNGO0FBRUQsYUFBTzs7Ozs7OztJQVFULFFBQUs7QUFDSCxVQUFJLENBQUMsS0FBSyxnQkFBZ0I7QUFDeEIsYUFBSyxpQkFBaUIsQ0FBQTtBQUN0QixhQUFLLGlCQUFpQixDQUFBO0FBQ3RCLGFBQUssd0JBQXdCLENBQUE7QUFDN0IsYUFBSyx3QkFBd0IsQ0FBQTtBQUc3QixpQkFBUyxJQUFJLEdBQUcsSUFBSSxLQUFLLGFBQWEsUUFBUSxLQUFLO0FBQ2pELGVBQUssZUFBZSxDQUFDLElBQUksS0FBSyxhQUFhLE9BQU8sQ0FBQztBQUNuRCxlQUFLLGVBQWUsS0FBSyxlQUFlLENBQUMsQ0FBQyxJQUFJO0FBQzlDLGVBQUssc0JBQXNCLENBQUMsSUFBSSxLQUFLLHFCQUFxQixPQUFPLENBQUM7QUFDbEUsZUFBSyxzQkFBc0IsS0FBSyxzQkFBc0IsQ0FBQyxDQUFDLElBQUk7QUFHNUQsY0FBSSxLQUFLLEtBQUssa0JBQWtCLFFBQVE7QUFDdEMsaUJBQUssZUFBZSxLQUFLLHFCQUFxQixPQUFPLENBQUMsQ0FBQyxJQUFJO0FBQzNELGlCQUFLLHNCQUFzQixLQUFLLGFBQWEsT0FBTyxDQUFDLENBQUMsSUFBSTtVQUMzRDtRQUNGO01BQ0Y7OztBQU9DLE1BQU8sMEJBQVAsY0FBdUMsTUFBSztJQUFsRCxjQUFBOztBQUNXLFdBQUksT0FBRzs7RUFDakI7QUFLTSxNQUFNLGVBQWUsU0FBVSxLQUFXO0FBQy9DLFVBQU0sWUFBWUEsb0JBQWtCLEdBQUc7QUFDdkMsV0FBTyxPQUFPLGdCQUFnQixXQUFXLElBQUk7RUFDL0M7QUFNTyxNQUFNLGdDQUFnQyxTQUFVLEtBQVc7QUFFaEUsV0FBTyxhQUFhLEdBQUcsRUFBRSxRQUFRLE9BQU8sRUFBRTtFQUM1QztBQVdPLE1BQU0sZUFBZSxTQUFVLEtBQVc7QUFDL0MsUUFBSTtBQUNGLGFBQU8sT0FBTyxhQUFhLEtBQUssSUFBSTtJQUNyQyxTQUFRLEdBQUc7QUFDVixjQUFRLE1BQU0seUJBQXlCLENBQUM7SUFDekM7QUFDRCxXQUFPO0VBQ1Q7V0VqV2dCLFlBQVM7QUFDdkIsUUFBSSxPQUFPLFNBQVMsYUFBYTtBQUMvQixhQUFPO0lBQ1I7QUFDRCxRQUFJLE9BQU8sV0FBVyxhQUFhO0FBQ2pDLGFBQU87SUFDUjtBQUNELFFBQUksT0FBTyxXQUFXLGFBQWE7QUFDakMsYUFBTztJQUNSO0FBQ0QsVUFBTSxJQUFJLE1BQU0saUNBQWlDO0VBQ25EO0FDc0JBLE1BQU0sd0JBQXdCLE1BQzVCLFVBQVMsRUFBRztBQVVkLE1BQU0sNkJBQTZCLE1BQW1DO0FBQ3BFLFFBQUksT0FBTyxZQUFZLGVBQWUsT0FBTyxRQUFRLFFBQVEsYUFBYTtBQUN4RTtJQUNEO0FBQ0QsVUFBTSxxQkFBcUIsUUFBUSxJQUFJO0FBQ3ZDLFFBQUksb0JBQW9CO0FBQ3RCLGFBQU8sS0FBSyxNQUFNLGtCQUFrQjtJQUNyQztFQUNIO0FBRUEsTUFBTSx3QkFBd0IsTUFBbUM7QUFDL0QsUUFBSSxPQUFPLGFBQWEsYUFBYTtBQUNuQztJQUNEO0FBQ0QsUUFBSTtBQUNKLFFBQUk7QUFDRixjQUFRLFNBQVMsT0FBTyxNQUFNLCtCQUErQjtJQUM5RCxTQUFRLEdBQUc7QUFHVjtJQUNEO0FBQ0QsVUFBTSxVQUFVLFNBQVMsYUFBYSxNQUFNLENBQUMsQ0FBQztBQUM5QyxXQUFPLFdBQVcsS0FBSyxNQUFNLE9BQU87RUFDdEM7QUFTTyxNQUFNLGNBQWMsTUFBbUM7QUFDNUQsUUFBSTtBQUNGLGFBQ0Usc0JBQXFCLEtBQ3JCLDJCQUEwQixLQUMxQixzQkFBcUI7SUFFeEIsU0FBUSxHQUFHO0FBT1YsY0FBUSxLQUFLLCtDQUErQyxTQUFHO0FBQy9EO0lBQ0Q7RUFDSDtBQTJDTyxNQUFNLHNCQUFzQixNQUF5QztBQUFBLFFBQUE7QUFDMUUsWUFBQSxLQUFBLFlBQVcsT0FBRSxRQUFBLE9BQUEsU0FBQSxTQUFBLEdBQUU7RUFBTTtNQy9JVixpQkFBUTtJQUluQixjQUFBO0FBRkEsV0FBQSxTQUFvQyxNQUFLO01BQUE7QUFDekMsV0FBQSxVQUFxQyxNQUFLO01BQUE7QUFFeEMsV0FBSyxVQUFVLElBQUksUUFBUSxDQUFDLFNBQVMsV0FBVTtBQUM3QyxhQUFLLFVBQVU7QUFDZixhQUFLLFNBQVM7TUFDaEIsQ0FBQzs7Ozs7OztJQVFILGFBQ0UsVUFBcUQ7QUFFckQsYUFBTyxDQUFDLE9BQU8sVUFBVTtBQUN2QixZQUFJLE9BQU87QUFDVCxlQUFLLE9BQU8sS0FBSztRQUNsQixPQUFNO0FBQ0wsZUFBSyxRQUFRLEtBQUs7UUFDbkI7QUFDRCxZQUFJLE9BQU8sYUFBYSxZQUFZO0FBR2xDLGVBQUssUUFBUSxNQUFNLE1BQUs7VUFBQSxDQUFHO0FBSTNCLGNBQUksU0FBUyxXQUFXLEdBQUc7QUFDekIscUJBQVMsS0FBSztVQUNmLE9BQU07QUFDTCxxQkFBUyxPQUFPLEtBQUs7VUFDdEI7UUFDRjtNQUNIOztFQUVIO1dFNkZlLHVCQUFvQjtBQUNsQyxRQUFJO0FBQ0YsYUFBTyxPQUFPLGNBQWM7SUFDN0IsU0FBUSxHQUFHO0FBQ1YsYUFBTztJQUNSO0VBQ0g7V0FTZ0IsNEJBQXlCO0FBQ3ZDLFdBQU8sSUFBSSxRQUFRLENBQUMsU0FBUyxXQUFVO0FBQ3JDLFVBQUk7QUFDRixZQUFJLFdBQW9CO0FBQ3hCLGNBQU0sZ0JBQ0o7QUFDRixjQUFNLFVBQVUsS0FBSyxVQUFVLEtBQUssYUFBYTtBQUNqRCxnQkFBUSxZQUFZLE1BQUs7QUFDdkIsa0JBQVEsT0FBTyxNQUFLO0FBRXBCLGNBQUksQ0FBQyxVQUFVO0FBQ2IsaUJBQUssVUFBVSxlQUFlLGFBQWE7VUFDNUM7QUFDRCxrQkFBUSxJQUFJO1FBQ2Q7QUFDQSxnQkFBUSxrQkFBa0IsTUFBSztBQUM3QixxQkFBVztRQUNiO0FBRUEsZ0JBQVEsVUFBVSxNQUFLOztBQUNyQixtQkFBTyxLQUFBLFFBQVEsV0FBSyxRQUFBLE9BQUEsU0FBQSxTQUFBLEdBQUUsWUFBVyxFQUFFO1FBQ3JDO01BQ0QsU0FBUSxPQUFPO0FBQ2QsZUFBTyxLQUFLO01BQ2I7SUFDSCxDQUFDO0VBQ0g7QUNsSUEsTUFBTSxhQUFhO0FBWWIsTUFBTyxnQkFBUCxNQUFPLHVCQUFzQixNQUFLO0lBSXRDLFlBRVcsTUFDVCxTQUVPLFlBQW9DO0FBRTNDLFlBQU0sT0FBTztBQUxKLFdBQUksT0FBSjtBQUdGLFdBQVUsYUFBVjtBQVBBLFdBQUksT0FBVztBQWF0QixhQUFPLGVBQWUsTUFBTSxlQUFjLFNBQVM7QUFJbkQsVUFBSSxNQUFNLG1CQUFtQjtBQUMzQixjQUFNLGtCQUFrQixNQUFNLGFBQWEsVUFBVSxNQUFNO01BQzVEOztFQUVKO01BRVkscUJBQVk7SUFJdkIsWUFDbUIsU0FDQSxhQUNBLFFBQTJCO0FBRjNCLFdBQU8sVUFBUDtBQUNBLFdBQVcsY0FBWDtBQUNBLFdBQU0sU0FBTjs7SUFHbkIsT0FDRSxTQUNHLE1BQXlEO0FBRTVELFlBQU0sYUFBYyxLQUFLLENBQUMsS0FBbUIsQ0FBQTtBQUM3QyxZQUFNLFdBQVcsR0FBRyxZQUFLLFNBQU8sS0FBSTtBQUNwQyxZQUFNLFdBQVcsS0FBSyxPQUFPLElBQUk7QUFFakMsWUFBTSxVQUFVLFdBQVcsZ0JBQWdCLFVBQVUsVUFBVSxJQUFJO0FBRW5FLFlBQU0sY0FBYyxHQUFHLFlBQUssYUFBVyxNQUFLLGdCQUFPLE1BQUssaUJBQVE7QUFFaEUsWUFBTSxRQUFRLElBQUksY0FBYyxVQUFVLGFBQWEsVUFBVTtBQUVqRSxhQUFPOztFQUVWO0FBRUQsV0FBUyxnQkFBZ0IsVUFBa0IsTUFBZTtBQUN4RCxXQUFPLFNBQVMsUUFBUSxTQUFTLENBQUMsR0FBRyxRQUFPO0FBQzFDLFlBQU0sUUFBUSxLQUFLLEdBQUc7QUFDdEIsYUFBTyxTQUFTLE9BQU8sT0FBTyxLQUFLLElBQUksSUFBSSxZQUFHO0lBQ2hELENBQUM7RUFDSDtBQUVBLE1BQU0sVUFBVTtBRzNFQSxXQUFBLFVBQVUsR0FBVyxHQUFTO0FBQzVDLFFBQUksTUFBTSxHQUFHO0FBQ1gsYUFBTztJQUNSO0FBRUQsVUFBTSxRQUFRLE9BQU8sS0FBSyxDQUFDO0FBQzNCLFVBQU0sUUFBUSxPQUFPLEtBQUssQ0FBQztBQUMzQixlQUFXLEtBQUssT0FBTztBQUNyQixVQUFJLENBQUMsTUFBTSxTQUFTLENBQUMsR0FBRztBQUN0QixlQUFPO01BQ1I7QUFFRCxZQUFNLFFBQVMsRUFBOEIsQ0FBQztBQUM5QyxZQUFNLFFBQVMsRUFBOEIsQ0FBQztBQUM5QyxVQUFJLFNBQVMsS0FBSyxLQUFLLFNBQVMsS0FBSyxHQUFHO0FBQ3RDLFlBQUksQ0FBQyxVQUFVLE9BQU8sS0FBSyxHQUFHO0FBQzVCLGlCQUFPO1FBQ1I7TUFDRixXQUFVLFVBQVUsT0FBTztBQUMxQixlQUFPO01BQ1I7SUFDRjtBQUVELGVBQVcsS0FBSyxPQUFPO0FBQ3JCLFVBQUksQ0FBQyxNQUFNLFNBQVMsQ0FBQyxHQUFHO0FBQ3RCLGVBQU87TUFDUjtJQUNGO0FBQ0QsV0FBTztFQUNUO0FBRUEsV0FBUyxTQUFTLE9BQWM7QUFDOUIsV0FBTyxVQUFVLFFBQVEsT0FBTyxVQUFVO0VBQzVDO0FRMURPLE1BQU0sbUJBQW1CLElBQUksS0FBSyxLQUFLOzs7TUdMakMsa0JBQVM7Ozs7Ozs7SUFpQnBCLFlBQ1dDLE9BQ0EsaUJBQ0EsTUFBbUI7QUFGbkIsV0FBSSxPQUFKQTtBQUNBLFdBQWUsa0JBQWY7QUFDQSxXQUFJLE9BQUo7QUFuQlgsV0FBaUIsb0JBQUc7QUFJcEIsV0FBWSxlQUFlLENBQUE7QUFFM0IsV0FBQSxvQkFBMkM7QUFFM0MsV0FBaUIsb0JBQXdDOztJQWN6RCxxQkFBcUIsTUFBdUI7QUFDMUMsV0FBSyxvQkFBb0I7QUFDekIsYUFBTzs7SUFHVCxxQkFBcUIsbUJBQTBCO0FBQzdDLFdBQUssb0JBQW9CO0FBQ3pCLGFBQU87O0lBR1QsZ0JBQWdCLE9BQWlCO0FBQy9CLFdBQUssZUFBZTtBQUNwQixhQUFPOztJQUdULDJCQUEyQixVQUFzQztBQUMvRCxXQUFLLG9CQUFvQjtBQUN6QixhQUFPOztFQUVWO0FDckRNLE1BQU0scUJBQXFCO01DZ0JyQixpQkFBUTtJQVduQixZQUNtQkEsT0FDQSxXQUE2QjtBQUQ3QixXQUFJLE9BQUpBO0FBQ0EsV0FBUyxZQUFUO0FBWlgsV0FBUyxZQUF3QjtBQUN4QixXQUFBLFlBQWdELG9CQUFJLElBQUc7QUFDdkQsV0FBQSxvQkFHYixvQkFBSSxJQUFHO0FBQ00sV0FBQSxtQkFDZixvQkFBSSxJQUFHO0FBQ0QsV0FBQSxrQkFBdUQsb0JBQUksSUFBRzs7Ozs7O0lBV3RFLElBQUksWUFBbUI7QUFFckIsWUFBTSx1QkFBdUIsS0FBSyw0QkFBNEIsVUFBVTtBQUV4RSxVQUFJLENBQUMsS0FBSyxrQkFBa0IsSUFBSSxvQkFBb0IsR0FBRztBQUNyRCxjQUFNLFdBQVcsSUFBSSxTQUFRO0FBQzdCLGFBQUssa0JBQWtCLElBQUksc0JBQXNCLFFBQVE7QUFFekQsWUFDRSxLQUFLLGNBQWMsb0JBQW9CLEtBQ3ZDLEtBQUsscUJBQW9CLEdBQ3pCO0FBRUEsY0FBSTtBQUNGLGtCQUFNLFdBQVcsS0FBSyx1QkFBdUI7Y0FDM0Msb0JBQW9CO1lBQ3JCLENBQUE7QUFDRCxnQkFBSSxVQUFVO0FBQ1osdUJBQVMsUUFBUSxRQUFRO1lBQzFCO1VBQ0YsU0FBUSxHQUFHO1VBR1g7UUFDRjtNQUNGO0FBRUQsYUFBTyxLQUFLLGtCQUFrQixJQUFJLG9CQUFvQixFQUFHOztJQW1CM0QsYUFBYSxTQUdaOztBQUVDLFlBQU0sdUJBQXVCLEtBQUssNEJBQ2hDLFlBQUEsUUFBQSxZQUFBLFNBQUEsU0FBQSxRQUFTLFVBQVU7QUFFckIsWUFBTSxZQUFXLEtBQUEsWUFBQSxRQUFBLFlBQUEsU0FBQSxTQUFBLFFBQVMsY0FBWSxRQUFBLE9BQUEsU0FBQSxLQUFBO0FBRXRDLFVBQ0UsS0FBSyxjQUFjLG9CQUFvQixLQUN2QyxLQUFLLHFCQUFvQixHQUN6QjtBQUNBLFlBQUk7QUFDRixpQkFBTyxLQUFLLHVCQUF1QjtZQUNqQyxvQkFBb0I7VUFDckIsQ0FBQTtRQUNGLFNBQVEsR0FBRztBQUNWLGNBQUksVUFBVTtBQUNaLG1CQUFPO1VBQ1IsT0FBTTtBQUNMLGtCQUFNO1VBQ1A7UUFDRjtNQUNGLE9BQU07QUFFTCxZQUFJLFVBQVU7QUFDWixpQkFBTztRQUNSLE9BQU07QUFDTCxnQkFBTSxNQUFNLFdBQVcsWUFBSyxNQUFJLG9CQUFtQjtRQUNwRDtNQUNGOztJQUdILGVBQVk7QUFDVixhQUFPLEtBQUs7O0lBR2QsYUFBYSxXQUF1QjtBQUNsQyxVQUFJLFVBQVUsU0FBUyxLQUFLLE1BQU07QUFDaEMsY0FBTSxNQUNKLHlCQUF5QixpQkFBVSxNQUFJLGtCQUFpQixZQUFLLE1BQUksSUFBRztNQUV2RTtBQUVELFVBQUksS0FBSyxXQUFXO0FBQ2xCLGNBQU0sTUFBTSxpQkFBaUIsWUFBSyxNQUFJLDZCQUE0QjtNQUNuRTtBQUVELFdBQUssWUFBWTtBQUdqQixVQUFJLENBQUMsS0FBSyxxQkFBb0IsR0FBSTtBQUNoQztNQUNEO0FBR0QsVUFBSSxpQkFBaUIsU0FBUyxHQUFHO0FBQy9CLFlBQUk7QUFDRixlQUFLLHVCQUF1QixFQUFFLG9CQUFvQixtQkFBa0IsQ0FBRTtRQUN2RSxTQUFRLEdBQUc7UUFLWDtNQUNGO0FBS0QsaUJBQVcsQ0FDVCxvQkFDQSxnQkFBZ0IsS0FDYixLQUFLLGtCQUFrQixRQUFPLEdBQUk7QUFDckMsY0FBTSx1QkFDSixLQUFLLDRCQUE0QixrQkFBa0I7QUFFckQsWUFBSTtBQUVGLGdCQUFNLFdBQVcsS0FBSyx1QkFBdUI7WUFDM0Msb0JBQW9CO1VBQ3JCLENBQUE7QUFDRCwyQkFBaUIsUUFBUSxRQUFRO1FBQ2xDLFNBQVEsR0FBRztRQUdYO01BQ0Y7O0lBR0gsY0FBYyxhQUFxQixvQkFBa0I7QUFDbkQsV0FBSyxrQkFBa0IsT0FBTyxVQUFVO0FBQ3hDLFdBQUssaUJBQWlCLE9BQU8sVUFBVTtBQUN2QyxXQUFLLFVBQVUsT0FBTyxVQUFVOzs7O0lBS2xDLE1BQU0sU0FBTTtBQUNWLFlBQU0sV0FBVyxNQUFNLEtBQUssS0FBSyxVQUFVLE9BQU0sQ0FBRTtBQUVuRCxZQUFNLFFBQVEsSUFBSTtRQUNoQixHQUFHLFNBQ0EsT0FBTyxhQUFXLGNBQWMsT0FBTyxFQUV2QyxJQUFJLGFBQVksUUFBZ0IsU0FBVSxPQUFNLENBQUU7UUFDckQsR0FBRyxTQUNBLE9BQU8sYUFBVyxhQUFhLE9BQU8sRUFFdEMsSUFBSSxhQUFZLFFBQWdCLFFBQU8sQ0FBRTtNQUM3QyxDQUFBOztJQUdILGlCQUFjO0FBQ1osYUFBTyxLQUFLLGFBQWE7O0lBRzNCLGNBQWMsYUFBcUIsb0JBQWtCO0FBQ25ELGFBQU8sS0FBSyxVQUFVLElBQUksVUFBVTs7SUFHdEMsV0FBVyxhQUFxQixvQkFBa0I7QUFDaEQsYUFBTyxLQUFLLGlCQUFpQixJQUFJLFVBQVUsS0FBSyxDQUFBOztJQUdsRCxXQUFXLE9BQTBCLENBQUEsR0FBRTtBQUNyQyxZQUFNLEVBQUUsVUFBVSxDQUFBLEVBQUUsSUFBSztBQUN6QixZQUFNLHVCQUF1QixLQUFLLDRCQUNoQyxLQUFLLGtCQUFrQjtBQUV6QixVQUFJLEtBQUssY0FBYyxvQkFBb0IsR0FBRztBQUM1QyxjQUFNLE1BQ0osR0FBRyxZQUFLLE1BQUksS0FBSSw2QkFBb0IsaUNBQWdDO01BRXZFO0FBRUQsVUFBSSxDQUFDLEtBQUssZUFBYyxHQUFJO0FBQzFCLGNBQU0sTUFBTSxhQUFhLFlBQUssTUFBSSwrQkFBOEI7TUFDakU7QUFFRCxZQUFNLFdBQVcsS0FBSyx1QkFBdUI7UUFDM0Msb0JBQW9CO1FBQ3BCO01BQ0QsQ0FBQTtBQUdELGlCQUFXLENBQ1Qsb0JBQ0EsZ0JBQWdCLEtBQ2IsS0FBSyxrQkFBa0IsUUFBTyxHQUFJO0FBQ3JDLGNBQU0sK0JBQ0osS0FBSyw0QkFBNEIsa0JBQWtCO0FBQ3JELFlBQUkseUJBQXlCLDhCQUE4QjtBQUN6RCwyQkFBaUIsUUFBUSxRQUFRO1FBQ2xDO01BQ0Y7QUFFRCxhQUFPOzs7Ozs7Ozs7O0lBV1QsT0FBTyxVQUE2QixZQUFtQjs7QUFDckQsWUFBTSx1QkFBdUIsS0FBSyw0QkFBNEIsVUFBVTtBQUN4RSxZQUFNLHFCQUNKLEtBQUEsS0FBSyxnQkFBZ0IsSUFBSSxvQkFBb0IsT0FBQyxRQUFBLE9BQUEsU0FBQSxLQUM5QyxvQkFBSSxJQUFHO0FBQ1Qsd0JBQWtCLElBQUksUUFBUTtBQUM5QixXQUFLLGdCQUFnQixJQUFJLHNCQUFzQixpQkFBaUI7QUFFaEUsWUFBTSxtQkFBbUIsS0FBSyxVQUFVLElBQUksb0JBQW9CO0FBQ2hFLFVBQUksa0JBQWtCO0FBQ3BCLGlCQUFTLGtCQUFrQixvQkFBb0I7TUFDaEQ7QUFFRCxhQUFPLE1BQUs7QUFDViwwQkFBa0IsT0FBTyxRQUFRO01BQ25DOzs7Ozs7SUFPTSxzQkFDTixVQUNBLFlBQWtCO0FBRWxCLFlBQU0sWUFBWSxLQUFLLGdCQUFnQixJQUFJLFVBQVU7QUFDckQsVUFBSSxDQUFDLFdBQVc7QUFDZDtNQUNEO0FBQ0QsaUJBQVcsWUFBWSxXQUFXO0FBQ2hDLFlBQUk7QUFDRixtQkFBUyxVQUFVLFVBQVU7UUFDOUIsU0FBTyxJQUFBO1FBRVA7TUFDRjs7SUFHSyx1QkFBdUIsRUFDN0Isb0JBQ0EsVUFBVSxDQUFBLEVBQUUsR0FJYjtBQUNDLFVBQUksV0FBVyxLQUFLLFVBQVUsSUFBSSxrQkFBa0I7QUFDcEQsVUFBSSxDQUFDLFlBQVksS0FBSyxXQUFXO0FBQy9CLG1CQUFXLEtBQUssVUFBVSxnQkFBZ0IsS0FBSyxXQUFXO1VBQ3hELG9CQUFvQiw4QkFBOEIsa0JBQWtCO1VBQ3BFO1FBQ0QsQ0FBQTtBQUNELGFBQUssVUFBVSxJQUFJLG9CQUFvQixRQUFRO0FBQy9DLGFBQUssaUJBQWlCLElBQUksb0JBQW9CLE9BQU87QUFPckQsYUFBSyxzQkFBc0IsVUFBVSxrQkFBa0I7QUFPdkQsWUFBSSxLQUFLLFVBQVUsbUJBQW1CO0FBQ3BDLGNBQUk7QUFDRixpQkFBSyxVQUFVLGtCQUNiLEtBQUssV0FDTCxvQkFDQSxRQUFRO1VBRVgsU0FBTyxJQUFBO1VBRVA7UUFDRjtNQUNGO0FBRUQsYUFBTyxZQUFZOztJQUdiLDRCQUNOLGFBQXFCLG9CQUFrQjtBQUV2QyxVQUFJLEtBQUssV0FBVztBQUNsQixlQUFPLEtBQUssVUFBVSxvQkFBb0IsYUFBYTtNQUN4RCxPQUFNO0FBQ0wsZUFBTztNQUNSOztJQUdLLHVCQUFvQjtBQUMxQixhQUNFLENBQUMsQ0FBQyxLQUFLLGFBQ1AsS0FBSyxVQUFVLHNCQUFpQjs7RUFHckM7QUFHRCxXQUFTLDhCQUE4QixZQUFrQjtBQUN2RCxXQUFPLGVBQWUscUJBQXFCLFNBQVk7RUFDekQ7QUFFQSxXQUFTLGlCQUFpQyxXQUF1QjtBQUMvRCxXQUFPLFVBQVUsc0JBQWlCO0VBQ3BDO01DaldhLDJCQUFrQjtJQUc3QixZQUE2QkEsT0FBWTtBQUFaLFdBQUksT0FBSkE7QUFGWixXQUFBLFlBQVksb0JBQUksSUFBRzs7Ozs7Ozs7Ozs7SUFhcEMsYUFBNkIsV0FBdUI7QUFDbEQsWUFBTSxXQUFXLEtBQUssWUFBWSxVQUFVLElBQUk7QUFDaEQsVUFBSSxTQUFTLGVBQWMsR0FBSTtBQUM3QixjQUFNLElBQUksTUFDUixhQUFhLGlCQUFVLE1BQUksc0NBQXFDLFlBQUssS0FBTTtNQUU5RTtBQUVELGVBQVMsYUFBYSxTQUFTOztJQUdqQyx3QkFBd0MsV0FBdUI7QUFDN0QsWUFBTSxXQUFXLEtBQUssWUFBWSxVQUFVLElBQUk7QUFDaEQsVUFBSSxTQUFTLGVBQWMsR0FBSTtBQUU3QixhQUFLLFVBQVUsT0FBTyxVQUFVLElBQUk7TUFDckM7QUFFRCxXQUFLLGFBQWEsU0FBUzs7Ozs7Ozs7O0lBVTdCLFlBQTRCQSxPQUFPO0FBQ2pDLFVBQUksS0FBSyxVQUFVLElBQUlBLEtBQUksR0FBRztBQUM1QixlQUFPLEtBQUssVUFBVSxJQUFJQSxLQUFJO01BQy9CO0FBR0QsWUFBTSxXQUFXLElBQUksU0FBWUEsT0FBTSxJQUFJO0FBQzNDLFdBQUssVUFBVSxJQUFJQSxPQUFNLFFBQXFDO0FBRTlELGFBQU87O0lBR1QsZUFBWTtBQUNWLGFBQU8sTUFBTSxLQUFLLEtBQUssVUFBVSxPQUFNLENBQUU7O0VBRTVDOzs7QUN4Q00sTUFBTSxZQUFzQixDQUFBO01BYXZCO0FBQVosR0FBQSxTQUFZQyxXQUFRO0FBQ2xCLElBQUFBLFVBQUFBLFVBQUEsT0FBQSxJQUFBLENBQUEsSUFBQTtBQUNBLElBQUFBLFVBQUFBLFVBQUEsU0FBQSxJQUFBLENBQUEsSUFBQTtBQUNBLElBQUFBLFVBQUFBLFVBQUEsTUFBQSxJQUFBLENBQUEsSUFBQTtBQUNBLElBQUFBLFVBQUFBLFVBQUEsTUFBQSxJQUFBLENBQUEsSUFBQTtBQUNBLElBQUFBLFVBQUFBLFVBQUEsT0FBQSxJQUFBLENBQUEsSUFBQTtBQUNBLElBQUFBLFVBQUFBLFVBQUEsUUFBQSxJQUFBLENBQUEsSUFBQTtFQUNGLEdBUFksYUFBQSxXQU9YLENBQUEsRUFBQTtBQUVELE1BQU0sb0JBQTJEO0lBQy9ELFNBQVMsU0FBUztJQUNsQixXQUFXLFNBQVM7SUFDcEIsUUFBUSxTQUFTO0lBQ2pCLFFBQVEsU0FBUztJQUNqQixTQUFTLFNBQVM7SUFDbEIsVUFBVSxTQUFTOztBQU1yQixNQUFNLGtCQUE0QixTQUFTO0FBbUIzQyxNQUFNLGdCQUFnQjtJQUNwQixDQUFDLFNBQVMsS0FBSyxHQUFHO0lBQ2xCLENBQUMsU0FBUyxPQUFPLEdBQUc7SUFDcEIsQ0FBQyxTQUFTLElBQUksR0FBRztJQUNqQixDQUFDLFNBQVMsSUFBSSxHQUFHO0lBQ2pCLENBQUMsU0FBUyxLQUFLLEdBQUc7O0FBUXBCLE1BQU0sb0JBQWdDLENBQUMsVUFBVSxZQUFZLFNBQWM7QUFDekUsUUFBSSxVQUFVLFNBQVMsVUFBVTtBQUMvQjtJQUNEO0FBQ0QsVUFBTSxPQUFNLG9CQUFJLEtBQUksR0FBRyxZQUFXO0FBQ2xDLFVBQU0sU0FBUyxjQUFjLE9BQXFDO0FBQ2xFLFFBQUksUUFBUTtBQUNWLGNBQVEsTUFBMkMsRUFDakQsSUFBSSxZQUFHLE9BQU0sZ0JBQVMsTUFBSSxNQUMxQixHQUFHLElBQUk7SUFFVixPQUFNO0FBQ0wsWUFBTSxJQUFJLE1BQ1IsOERBQThELGdCQUFPLElBQUc7SUFFM0U7RUFDSDtNQUVhLGVBQU07Ozs7Ozs7SUFPakIsWUFBbUJDLE9BQVk7QUFBWixXQUFJLE9BQUpBO0FBVVgsV0FBUyxZQUFHO0FBc0JaLFdBQVcsY0FBZTtBQWMxQixXQUFlLGtCQUFzQjtBQTFDM0MsZ0JBQVUsS0FBSyxJQUFJOztJQVFyQixJQUFJLFdBQVE7QUFDVixhQUFPLEtBQUs7O0lBR2QsSUFBSSxTQUFTLEtBQWE7QUFDeEIsVUFBSSxFQUFFLE9BQU8sV0FBVztBQUN0QixjQUFNLElBQUksVUFBVSxrQkFBa0IsWUFBRywyQkFBNEI7TUFDdEU7QUFDRCxXQUFLLFlBQVk7OztJQUluQixZQUFZLEtBQThCO0FBQ3hDLFdBQUssWUFBWSxPQUFPLFFBQVEsV0FBVyxrQkFBa0IsR0FBRyxJQUFJOztJQVF0RSxJQUFJLGFBQVU7QUFDWixhQUFPLEtBQUs7O0lBRWQsSUFBSSxXQUFXLEtBQWU7QUFDNUIsVUFBSSxPQUFPLFFBQVEsWUFBWTtBQUM3QixjQUFNLElBQUksVUFBVSxtREFBbUQ7TUFDeEU7QUFDRCxXQUFLLGNBQWM7O0lBT3JCLElBQUksaUJBQWM7QUFDaEIsYUFBTyxLQUFLOztJQUVkLElBQUksZUFBZSxLQUFzQjtBQUN2QyxXQUFLLGtCQUFrQjs7Ozs7SUFPekIsU0FBUyxNQUFlO0FBQ3RCLFdBQUssbUJBQW1CLEtBQUssZ0JBQWdCLE1BQU0sU0FBUyxPQUFPLEdBQUcsSUFBSTtBQUMxRSxXQUFLLFlBQVksTUFBTSxTQUFTLE9BQU8sR0FBRyxJQUFJOztJQUVoRCxPQUFPLE1BQWU7QUFDcEIsV0FBSyxtQkFDSCxLQUFLLGdCQUFnQixNQUFNLFNBQVMsU0FBUyxHQUFHLElBQUk7QUFDdEQsV0FBSyxZQUFZLE1BQU0sU0FBUyxTQUFTLEdBQUcsSUFBSTs7SUFFbEQsUUFBUSxNQUFlO0FBQ3JCLFdBQUssbUJBQW1CLEtBQUssZ0JBQWdCLE1BQU0sU0FBUyxNQUFNLEdBQUcsSUFBSTtBQUN6RSxXQUFLLFlBQVksTUFBTSxTQUFTLE1BQU0sR0FBRyxJQUFJOztJQUUvQyxRQUFRLE1BQWU7QUFDckIsV0FBSyxtQkFBbUIsS0FBSyxnQkFBZ0IsTUFBTSxTQUFTLE1BQU0sR0FBRyxJQUFJO0FBQ3pFLFdBQUssWUFBWSxNQUFNLFNBQVMsTUFBTSxHQUFHLElBQUk7O0lBRS9DLFNBQVMsTUFBZTtBQUN0QixXQUFLLG1CQUFtQixLQUFLLGdCQUFnQixNQUFNLFNBQVMsT0FBTyxHQUFHLElBQUk7QUFDMUUsV0FBSyxZQUFZLE1BQU0sU0FBUyxPQUFPLEdBQUcsSUFBSTs7RUFFakQ7OztBQ25ORCxNQUFNLGdCQUFnQixDQUFDLFFBQVEsaUJBQWlCLGFBQWEsS0FBSyxDQUFDLE1BQU0sa0JBQWtCLENBQUM7QUFFNUYsTUFBSTtBQUNKLE1BQUk7QUFFSixXQUFTLHVCQUF1QjtBQUM1QixXQUFRLHNCQUNILG9CQUFvQjtBQUFBLE1BQ2pCO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLElBQ0o7QUFBQSxFQUNSO0FBRUEsV0FBUywwQkFBMEI7QUFDL0IsV0FBUSx5QkFDSCx1QkFBdUI7QUFBQSxNQUNwQixVQUFVLFVBQVU7QUFBQSxNQUNwQixVQUFVLFVBQVU7QUFBQSxNQUNwQixVQUFVLFVBQVU7QUFBQSxJQUN4QjtBQUFBLEVBQ1I7QUFDQSxNQUFNLG1CQUFtQixvQkFBSSxRQUFRO0FBQ3JDLE1BQU0scUJBQXFCLG9CQUFJLFFBQVE7QUFDdkMsTUFBTSwyQkFBMkIsb0JBQUksUUFBUTtBQUM3QyxNQUFNLGlCQUFpQixvQkFBSSxRQUFRO0FBQ25DLE1BQU0sd0JBQXdCLG9CQUFJLFFBQVE7QUFDMUMsV0FBUyxpQkFBaUIsU0FBUztBQUMvQixVQUFNLFVBQVUsSUFBSSxRQUFRLENBQUMsU0FBUyxXQUFXO0FBQzdDLFlBQU0sV0FBVyxNQUFNO0FBQ25CLGdCQUFRLG9CQUFvQixXQUFXLE9BQU87QUFDOUMsZ0JBQVEsb0JBQW9CLFNBQVMsS0FBSztBQUFBLE1BQzlDO0FBQ0EsWUFBTSxVQUFVLE1BQU07QUFDbEIsZ0JBQVEsS0FBSyxRQUFRLE1BQU0sQ0FBQztBQUM1QixpQkFBUztBQUFBLE1BQ2I7QUFDQSxZQUFNLFFBQVEsTUFBTTtBQUNoQixlQUFPLFFBQVEsS0FBSztBQUNwQixpQkFBUztBQUFBLE1BQ2I7QUFDQSxjQUFRLGlCQUFpQixXQUFXLE9BQU87QUFDM0MsY0FBUSxpQkFBaUIsU0FBUyxLQUFLO0FBQUEsSUFDM0MsQ0FBQztBQUNELFlBQ0ssS0FBSyxDQUFDLFVBQVU7QUFHakIsVUFBSSxpQkFBaUIsV0FBVztBQUM1Qix5QkFBaUIsSUFBSSxPQUFPLE9BQU87QUFBQSxNQUN2QztBQUFBLElBRUosQ0FBQyxFQUNJLE1BQU0sTUFBTTtBQUFBLElBQUUsQ0FBQztBQUdwQiwwQkFBc0IsSUFBSSxTQUFTLE9BQU87QUFDMUMsV0FBTztBQUFBLEVBQ1g7QUFDQSxXQUFTLCtCQUErQixJQUFJO0FBRXhDLFFBQUksbUJBQW1CLElBQUksRUFBRTtBQUN6QjtBQUNKLFVBQU0sT0FBTyxJQUFJLFFBQVEsQ0FBQyxTQUFTLFdBQVc7QUFDMUMsWUFBTSxXQUFXLE1BQU07QUFDbkIsV0FBRyxvQkFBb0IsWUFBWSxRQUFRO0FBQzNDLFdBQUcsb0JBQW9CLFNBQVMsS0FBSztBQUNyQyxXQUFHLG9CQUFvQixTQUFTLEtBQUs7QUFBQSxNQUN6QztBQUNBLFlBQU0sV0FBVyxNQUFNO0FBQ25CLGdCQUFRO0FBQ1IsaUJBQVM7QUFBQSxNQUNiO0FBQ0EsWUFBTSxRQUFRLE1BQU07QUFDaEIsZUFBTyxHQUFHLFNBQVMsSUFBSSxhQUFhLGNBQWMsWUFBWSxDQUFDO0FBQy9ELGlCQUFTO0FBQUEsTUFDYjtBQUNBLFNBQUcsaUJBQWlCLFlBQVksUUFBUTtBQUN4QyxTQUFHLGlCQUFpQixTQUFTLEtBQUs7QUFDbEMsU0FBRyxpQkFBaUIsU0FBUyxLQUFLO0FBQUEsSUFDdEMsQ0FBQztBQUVELHVCQUFtQixJQUFJLElBQUksSUFBSTtBQUFBLEVBQ25DO0FBQ0EsTUFBSSxnQkFBZ0I7QUFBQSxJQUNoQixJQUFJLFFBQVEsTUFBTSxVQUFVO0FBQ3hCLFVBQUksa0JBQWtCLGdCQUFnQjtBQUVsQyxZQUFJLFNBQVM7QUFDVCxpQkFBTyxtQkFBbUIsSUFBSSxNQUFNO0FBRXhDLFlBQUksU0FBUyxvQkFBb0I7QUFDN0IsaUJBQU8sT0FBTyxvQkFBb0IseUJBQXlCLElBQUksTUFBTTtBQUFBLFFBQ3pFO0FBRUEsWUFBSSxTQUFTLFNBQVM7QUFDbEIsaUJBQU8sU0FBUyxpQkFBaUIsQ0FBQyxJQUM1QixTQUNBLFNBQVMsWUFBWSxTQUFTLGlCQUFpQixDQUFDLENBQUM7QUFBQSxRQUMzRDtBQUFBLE1BQ0o7QUFFQSxhQUFPLEtBQUssT0FBTyxJQUFJLENBQUM7QUFBQSxJQUM1QjtBQUFBLElBQ0EsSUFBSSxRQUFRLE1BQU0sT0FBTztBQUNyQixhQUFPLElBQUksSUFBSTtBQUNmLGFBQU87QUFBQSxJQUNYO0FBQUEsSUFDQSxJQUFJLFFBQVEsTUFBTTtBQUNkLFVBQUksa0JBQWtCLG1CQUNqQixTQUFTLFVBQVUsU0FBUyxVQUFVO0FBQ3ZDLGVBQU87QUFBQSxNQUNYO0FBQ0EsYUFBTyxRQUFRO0FBQUEsSUFDbkI7QUFBQSxFQUNKO0FBQ0EsV0FBUyxhQUFhLFVBQVU7QUFDNUIsb0JBQWdCLFNBQVMsYUFBYTtBQUFBLEVBQzFDO0FBQ0EsV0FBUyxhQUFhLE1BQU07QUFJeEIsUUFBSSxTQUFTLFlBQVksVUFBVSxlQUMvQixFQUFFLHNCQUFzQixlQUFlLFlBQVk7QUFDbkQsYUFBTyxTQUFVLGVBQWUsTUFBTTtBQUNsQyxjQUFNLEtBQUssS0FBSyxLQUFLLE9BQU8sSUFBSSxHQUFHLFlBQVksR0FBRyxJQUFJO0FBQ3RELGlDQUF5QixJQUFJLElBQUksV0FBVyxPQUFPLFdBQVcsS0FBSyxJQUFJLENBQUMsVUFBVSxDQUFDO0FBQ25GLGVBQU8sS0FBSyxFQUFFO0FBQUEsTUFDbEI7QUFBQSxJQUNKO0FBTUEsUUFBSSx3QkFBd0IsRUFBRSxTQUFTLElBQUksR0FBRztBQUMxQyxhQUFPLFlBQWEsTUFBTTtBQUd0QixhQUFLLE1BQU0sT0FBTyxJQUFJLEdBQUcsSUFBSTtBQUM3QixlQUFPLEtBQUssaUJBQWlCLElBQUksSUFBSSxDQUFDO0FBQUEsTUFDMUM7QUFBQSxJQUNKO0FBQ0EsV0FBTyxZQUFhLE1BQU07QUFHdEIsYUFBTyxLQUFLLEtBQUssTUFBTSxPQUFPLElBQUksR0FBRyxJQUFJLENBQUM7QUFBQSxJQUM5QztBQUFBLEVBQ0o7QUFDQSxXQUFTLHVCQUF1QixPQUFPO0FBQ25DLFFBQUksT0FBTyxVQUFVO0FBQ2pCLGFBQU8sYUFBYSxLQUFLO0FBRzdCLFFBQUksaUJBQWlCO0FBQ2pCLHFDQUErQixLQUFLO0FBQ3hDLFFBQUksY0FBYyxPQUFPLHFCQUFxQixDQUFDO0FBQzNDLGFBQU8sSUFBSSxNQUFNLE9BQU8sYUFBYTtBQUV6QyxXQUFPO0FBQUEsRUFDWDtBQUNBLFdBQVMsS0FBSyxPQUFPO0FBR2pCLFFBQUksaUJBQWlCO0FBQ2pCLGFBQU8saUJBQWlCLEtBQUs7QUFHakMsUUFBSSxlQUFlLElBQUksS0FBSztBQUN4QixhQUFPLGVBQWUsSUFBSSxLQUFLO0FBQ25DLFVBQU0sV0FBVyx1QkFBdUIsS0FBSztBQUc3QyxRQUFJLGFBQWEsT0FBTztBQUNwQixxQkFBZSxJQUFJLE9BQU8sUUFBUTtBQUNsQyw0QkFBc0IsSUFBSSxVQUFVLEtBQUs7QUFBQSxJQUM3QztBQUNBLFdBQU87QUFBQSxFQUNYO0FBQ0EsTUFBTSxTQUFTLENBQUMsVUFBVSxzQkFBc0IsSUFBSSxLQUFLOzs7QUM1S3pELFdBQVMsT0FBT0MsT0FBTUMsVUFBUyxFQUFFLFNBQVMsU0FBUyxVQUFVLFdBQVcsSUFBSSxDQUFDLEdBQUc7QUFDNUUsVUFBTSxVQUFVLFVBQVUsS0FBS0QsT0FBTUMsUUFBTztBQUM1QyxVQUFNLGNBQWMsS0FBSyxPQUFPO0FBQ2hDLFFBQUksU0FBUztBQUNULGNBQVEsaUJBQWlCLGlCQUFpQixDQUFDLFVBQVU7QUFDakQsZ0JBQVEsS0FBSyxRQUFRLE1BQU0sR0FBRyxNQUFNLFlBQVksTUFBTSxZQUFZLEtBQUssUUFBUSxXQUFXLEdBQUcsS0FBSztBQUFBLE1BQ3RHLENBQUM7QUFBQSxJQUNMO0FBQ0EsUUFBSSxTQUFTO0FBQ1QsY0FBUSxpQkFBaUIsV0FBVyxDQUFDLFVBQVU7QUFBQTtBQUFBLFFBRS9DLE1BQU07QUFBQSxRQUFZLE1BQU07QUFBQSxRQUFZO0FBQUEsTUFBSyxDQUFDO0FBQUEsSUFDOUM7QUFDQSxnQkFDSyxLQUFLLENBQUMsT0FBTztBQUNkLFVBQUk7QUFDQSxXQUFHLGlCQUFpQixTQUFTLE1BQU0sV0FBVyxDQUFDO0FBQ25ELFVBQUksVUFBVTtBQUNWLFdBQUcsaUJBQWlCLGlCQUFpQixDQUFDLFVBQVUsU0FBUyxNQUFNLFlBQVksTUFBTSxZQUFZLEtBQUssQ0FBQztBQUFBLE1BQ3ZHO0FBQUEsSUFDSixDQUFDLEVBQ0ksTUFBTSxNQUFNO0FBQUEsSUFBRSxDQUFDO0FBQ3BCLFdBQU87QUFBQSxFQUNYO0FBZ0JBLE1BQU0sY0FBYyxDQUFDLE9BQU8sVUFBVSxVQUFVLGNBQWMsT0FBTztBQUNyRSxNQUFNLGVBQWUsQ0FBQyxPQUFPLE9BQU8sVUFBVSxPQUFPO0FBQ3JELE1BQU0sZ0JBQWdCLG9CQUFJLElBQUk7QUFDOUIsV0FBUyxVQUFVLFFBQVEsTUFBTTtBQUM3QixRQUFJLEVBQUUsa0JBQWtCLGVBQ3BCLEVBQUUsUUFBUSxXQUNWLE9BQU8sU0FBUyxXQUFXO0FBQzNCO0FBQUEsSUFDSjtBQUNBLFFBQUksY0FBYyxJQUFJLElBQUk7QUFDdEIsYUFBTyxjQUFjLElBQUksSUFBSTtBQUNqQyxVQUFNLGlCQUFpQixLQUFLLFFBQVEsY0FBYyxFQUFFO0FBQ3BELFVBQU0sV0FBVyxTQUFTO0FBQzFCLFVBQU0sVUFBVSxhQUFhLFNBQVMsY0FBYztBQUNwRDtBQUFBO0FBQUEsTUFFQSxFQUFFLG1CQUFtQixXQUFXLFdBQVcsZ0JBQWdCLGNBQ3ZELEVBQUUsV0FBVyxZQUFZLFNBQVMsY0FBYztBQUFBLE1BQUk7QUFDcEQ7QUFBQSxJQUNKO0FBQ0EsVUFBTSxTQUFTLGVBQWdCLGNBQWMsTUFBTTtBQUUvQyxZQUFNLEtBQUssS0FBSyxZQUFZLFdBQVcsVUFBVSxjQUFjLFVBQVU7QUFDekUsVUFBSUMsVUFBUyxHQUFHO0FBQ2hCLFVBQUk7QUFDQSxRQUFBQSxVQUFTQSxRQUFPLE1BQU0sS0FBSyxNQUFNLENBQUM7QUFNdEMsY0FBUSxNQUFNLFFBQVEsSUFBSTtBQUFBLFFBQ3RCQSxRQUFPLGNBQWMsRUFBRSxHQUFHLElBQUk7QUFBQSxRQUM5QixXQUFXLEdBQUc7QUFBQSxNQUNsQixDQUFDLEdBQUcsQ0FBQztBQUFBLElBQ1Q7QUFDQSxrQkFBYyxJQUFJLE1BQU0sTUFBTTtBQUM5QixXQUFPO0FBQUEsRUFDWDtBQUNBLGVBQWEsQ0FBQyxhQUFjLGlDQUNyQixXQURxQjtBQUFBLElBRXhCLEtBQUssQ0FBQyxRQUFRLE1BQU0sYUFBYSxVQUFVLFFBQVEsSUFBSSxLQUFLLFNBQVMsSUFBSSxRQUFRLE1BQU0sUUFBUTtBQUFBLElBQy9GLEtBQUssQ0FBQyxRQUFRLFNBQVMsQ0FBQyxDQUFDLFVBQVUsUUFBUSxJQUFJLEtBQUssU0FBUyxJQUFJLFFBQVEsSUFBSTtBQUFBLEVBQ2pGLEVBQUU7OztNQ25FVyxrQ0FBeUI7SUFDcEMsWUFBNkIsV0FBNkI7QUFBN0IsV0FBUyxZQUFUOzs7O0lBRzdCLHdCQUFxQjtBQUNuQixZQUFNLFlBQVksS0FBSyxVQUFVLGFBQVk7QUFHN0MsYUFBTyxVQUNKLElBQUksY0FBVztBQUNkLFlBQUkseUJBQXlCLFFBQVEsR0FBRztBQUN0QyxnQkFBTSxVQUFVLFNBQVMsYUFBWTtBQUNyQyxpQkFBTyxHQUFHLGVBQVEsU0FBTyxLQUFJLGVBQVE7UUFDdEMsT0FBTTtBQUNMLGlCQUFPO1FBQ1I7TUFDSCxDQUFDLEVBQ0EsT0FBTyxlQUFhLFNBQVMsRUFDN0IsS0FBSyxHQUFHOztFQUVkO0FBU0QsV0FBUyx5QkFBeUIsVUFBd0I7QUFDeEQsVUFBTSxZQUFZLFNBQVMsYUFBWTtBQUN2QyxZQUFPLGNBQUEsUUFBQSxjQUFTLFNBQUEsU0FBVCxVQUFXLFVBQUk7RUFDeEI7OztBQ3RDTyxNQUFNLFNBQVMsSUFBSSxPQUFPLGVBQWU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM2QnpDLE1BQU1DLHNCQUFxQjtBQUUzQixNQUFNLHNCQUFzQjtJQUNqQyxDQUFDQyxNQUFPLEdBQUc7SUFDWCxDQUFDQyxNQUFhLEdBQUc7SUFDakIsQ0FBQ0MsTUFBYSxHQUFHO0lBQ2pCLENBQUNDLE1BQW1CLEdBQUc7SUFDdkIsQ0FBQ0MsTUFBWSxHQUFHO0lBQ2hCLENBQUNDLE1BQWtCLEdBQUc7SUFDdEIsQ0FBQ0MsTUFBUSxHQUFHO0lBQ1osQ0FBQ0MsTUFBYyxHQUFHO0lBQ2xCLENBQUNDLE1BQVksR0FBRztJQUNoQixDQUFDQyxNQUFrQixHQUFHO0lBQ3RCLENBQUNDLE1BQWEsR0FBRztJQUNqQixDQUFDQyxNQUFtQixHQUFHO0lBQ3ZCLENBQUNDLE1BQWlCLEdBQUc7SUFDckIsQ0FBQ0MsTUFBdUIsR0FBRztJQUMzQixDQUFDQyxNQUFhLEdBQUc7SUFDakIsQ0FBQ0MsTUFBbUIsR0FBRztJQUN2QixDQUFDQyxNQUFlLEdBQUc7SUFDbkIsQ0FBQ0MsTUFBcUIsR0FBRztJQUN6QixDQUFDQyxNQUFnQixHQUFHO0lBQ3BCLENBQUNDLE1BQXNCLEdBQUc7SUFDMUIsQ0FBQ0MsTUFBVyxHQUFHO0lBQ2YsQ0FBQ0MsTUFBaUIsR0FBRztJQUNyQixDQUFDQyxNQUFhLEdBQUc7SUFDakIsQ0FBQ0MsTUFBbUIsR0FBRztJQUN2QixXQUFXO0lBQ1gsQ0FBQ0MsSUFBVyxHQUFHOztBQ2xESixNQUFBLFFBQVEsb0JBQUksSUFBRztBQVFmLE1BQUEsY0FBYyxvQkFBSSxJQUFHO0FBT2xCLFdBQUEsY0FDZCxLQUNBLFdBQXVCO0FBRXZCLFFBQUk7QUFDRCxVQUF3QixVQUFVLGFBQWEsU0FBUztJQUMxRCxTQUFRLEdBQUc7QUFDVixhQUFPLE1BQ0wsYUFBYSxpQkFBVSxNQUFJLHlDQUF3QyxXQUFJLE9BQ3ZFLENBQUM7SUFFSjtFQUNIO0FBb0JNLFdBQVUsbUJBQ2QsV0FBdUI7QUFFdkIsVUFBTSxnQkFBZ0IsVUFBVTtBQUNoQyxRQUFJLFlBQVksSUFBSSxhQUFhLEdBQUc7QUFDbEMsYUFBTyxNQUNMLHNEQUFzRCxzQkFBYSxJQUFHO0FBR3hFLGFBQU87SUFDUjtBQUVELGdCQUFZLElBQUksZUFBZSxTQUFTO0FBR3hDLGVBQVcsT0FBTyxNQUFNLE9BQU0sR0FBSTtBQUNoQyxvQkFBYyxLQUF3QixTQUFTO0lBQ2hEO0FBRUQsV0FBTztFQUNUO0FDNURBLE1BQU0sU0FBNkI7SUFDakM7TUFBQTs7SUFBQSxHQUNFO0lBRUY7TUFBQTs7SUFBQSxHQUF5QjtJQUN6QjtNQUFBOztJQUFBLEdBQ0U7SUFDRjtNQUFBOztJQUFBLEdBQXdCO0lBQ3hCO01BQUE7O0lBQUEsR0FDRTtJQUNGO01BQUE7O0lBQUEsR0FDRTtJQUVGO01BQUE7O0lBQUEsR0FDRTtJQUNGO01BQUE7O0lBQUEsR0FDRTtJQUNGO01BQUE7O0lBQUEsR0FDRTtJQUNGO01BQUE7O0lBQUEsR0FDRTtJQUNGO01BQUE7O0lBQUEsR0FDRTs7QUFlRyxNQUFNLGdCQUFnQixJQUFJLGFBQy9CLE9BQ0EsWUFDQSxNQUFNO01DNUNLLHdCQUFlO0lBYzFCLFlBQ0UsU0FDQUMsU0FDQSxXQUE2QjtBQU52QixXQUFVLGFBQUc7QUFRbkIsV0FBSyxXQUFnQixPQUFBLE9BQUEsQ0FBQSxHQUFBLE9BQU87QUFDNUIsV0FBSyxVQUFlLE9BQUEsT0FBQSxDQUFBLEdBQUFBLE9BQU07QUFDMUIsV0FBSyxRQUFRQSxRQUFPO0FBQ3BCLFdBQUssa0NBQ0hBLFFBQU87QUFDVCxXQUFLLGFBQWE7QUFDbEIsV0FBSyxVQUFVLGFBQ2IsSUFBSTtRQUFVO1FBQU8sTUFBTTtRQUFJOztNQUFBLENBQXVCOztJQUkxRCxJQUFJLGlDQUE4QjtBQUNoQyxXQUFLLGVBQWM7QUFDbkIsYUFBTyxLQUFLOztJQUdkLElBQUksK0JBQStCLEtBQVk7QUFDN0MsV0FBSyxlQUFjO0FBQ25CLFdBQUssa0NBQWtDOztJQUd6QyxJQUFJLE9BQUk7QUFDTixXQUFLLGVBQWM7QUFDbkIsYUFBTyxLQUFLOztJQUdkLElBQUksVUFBTztBQUNULFdBQUssZUFBYztBQUNuQixhQUFPLEtBQUs7O0lBR2QsSUFBSSxTQUFNO0FBQ1IsV0FBSyxlQUFjO0FBQ25CLGFBQU8sS0FBSzs7SUFHZCxJQUFJLFlBQVM7QUFDWCxhQUFPLEtBQUs7O0lBR2QsSUFBSSxZQUFTO0FBQ1gsYUFBTyxLQUFLOztJQUdkLElBQUksVUFBVSxLQUFZO0FBQ3hCLFdBQUssYUFBYTs7Ozs7O0lBT1osaUJBQWM7QUFDcEIsVUFBSSxLQUFLLFdBQVc7QUFDbEIsY0FBTSxjQUFjLE9BQU0sZUFBdUIsRUFBRSxTQUFTLEtBQUssTUFBSyxDQUFFO01BQ3pFOztFQUVKO1dDYWUsY0FDZCxVQUNBLFlBQVksQ0FBQSxHQUFFO0FBRWQsUUFBSSxVQUFVO0FBRWQsUUFBSSxPQUFPLGNBQWMsVUFBVTtBQUNqQyxZQUFNQyxRQUFPO0FBQ2Isa0JBQVksRUFBRSxNQUFBQSxNQUFJO0lBQ25CO0FBRUQsVUFBTUMsVUFBTSxPQUFBLE9BQUEsRUFDVixNQUFNQyxxQkFDTixnQ0FBZ0MsTUFBSyxHQUNsQyxTQUFTO0FBRWQsVUFBTUYsUUFBT0MsUUFBTztBQUVwQixRQUFJLE9BQU9ELFVBQVMsWUFBWSxDQUFDQSxPQUFNO0FBQ3JDLFlBQU0sY0FBYyxPQUE4QixnQkFBQTtRQUNoRCxTQUFTLE9BQU9BLEtBQUk7TUFDckIsQ0FBQTtJQUNGO0FBRUQsZ0JBQUEsVUFBWSxvQkFBbUI7QUFFL0IsUUFBSSxDQUFDLFNBQVM7QUFDWixZQUFNLGNBQWM7UUFBTTs7TUFBQTtJQUMzQjtBQUVELFVBQU0sY0FBYyxNQUFNLElBQUlBLEtBQUk7QUFDbEMsUUFBSSxhQUFhO0FBRWYsVUFDRSxVQUFVLFNBQVMsWUFBWSxPQUFPLEtBQ3RDLFVBQVVDLFNBQVEsWUFBWSxNQUFNLEdBQ3BDO0FBQ0EsZUFBTztNQUNSLE9BQU07QUFDTCxjQUFNLGNBQWMsT0FBK0IsaUJBQUEsRUFBRSxTQUFTRCxNQUFJLENBQUU7TUFDckU7SUFDRjtBQUVELFVBQU0sWUFBWSxJQUFJLG1CQUFtQkEsS0FBSTtBQUM3QyxlQUFXLGFBQWEsWUFBWSxPQUFNLEdBQUk7QUFDNUMsZ0JBQVUsYUFBYSxTQUFTO0lBQ2pDO0FBRUQsVUFBTSxTQUFTLElBQUksZ0JBQWdCLFNBQVNDLFNBQVEsU0FBUztBQUU3RCxVQUFNLElBQUlELE9BQU0sTUFBTTtBQUV0QixXQUFPO0VBQ1Q7V0F5RmdCLGdCQUNkLGtCQUNBRyxVQUNBLFNBQWdCOztBQUloQixRQUFJLFdBQVUsS0FBQSxvQkFBb0IsZ0JBQWdCLE9BQUssUUFBQSxPQUFBLFNBQUEsS0FBQTtBQUN2RCxRQUFJLFNBQVM7QUFDWCxpQkFBVyxJQUFJO0lBQ2hCO0FBQ0QsVUFBTSxrQkFBa0IsUUFBUSxNQUFNLE9BQU87QUFDN0MsVUFBTSxrQkFBa0JBLFNBQVEsTUFBTSxPQUFPO0FBQzdDLFFBQUksbUJBQW1CLGlCQUFpQjtBQUN0QyxZQUFNLFVBQVU7UUFDZCwrQkFBK0IsZ0JBQU8sb0JBQW1CLE9BQUFBLFVBQU87O0FBRWxFLFVBQUksaUJBQWlCO0FBQ25CLGdCQUFRLEtBQ04saUJBQWlCLGdCQUFPLG9EQUFtRDtNQUU5RTtBQUNELFVBQUksbUJBQW1CLGlCQUFpQjtBQUN0QyxnQkFBUSxLQUFLLEtBQUs7TUFDbkI7QUFDRCxVQUFJLGlCQUFpQjtBQUNuQixnQkFBUSxLQUNOLGlCQUFpQixPQUFBQSxVQUFPLG9EQUFtRDtNQUU5RTtBQUNELGFBQU8sS0FBSyxRQUFRLEtBQUssR0FBRyxDQUFDO0FBQzdCO0lBQ0Q7QUFDRCx1QkFDRSxJQUFJO01BQ0YsR0FBRyxnQkFBTztNQUNWLE9BQU8sRUFBRSxTQUFTLFNBQUFBLFNBQU87TUFBRzs7SUFBQSxDQUU3QjtFQUVMO0FDcFJBLE1BQU0sVUFBVTtBQUNoQixNQUFNLGFBQWE7QUFDbkIsTUFBTSxhQUFhO0FBU25CLE1BQUksWUFBaUQ7QUFDckQsV0FBUyxlQUFZO0FBQ25CLFFBQUksQ0FBQyxXQUFXO0FBQ2Qsa0JBQVksT0FBYyxTQUFTLFlBQVk7UUFDN0MsU0FBUyxDQUFDLElBQUksZUFBYztBQU0xQixrQkFBUSxZQUFVO1lBQ2hCLEtBQUs7QUFDSCxrQkFBSTtBQUNGLG1CQUFHLGtCQUFrQixVQUFVO2NBQ2hDLFNBQVEsR0FBRztBQUlWLHdCQUFRLEtBQUssQ0FBQztjQUNmO1VBQ0o7O01BRUosQ0FBQSxFQUFFLE1BQU0sT0FBSTtBQUNYLGNBQU0sY0FBYyxPQUEwQixZQUFBO1VBQzVDLHNCQUFzQixFQUFFO1FBQ3pCLENBQUE7TUFDSCxDQUFDO0lBQ0Y7QUFDRCxXQUFPO0VBQ1Q7QUFFTyxpQkFBZSw0QkFDcEIsS0FBZ0I7QUFFaEIsUUFBSTtBQUNGLFlBQU0sS0FBSyxNQUFNLGFBQVk7QUFDN0IsWUFBTSxLQUFLLEdBQUcsWUFBWSxVQUFVO0FBQ3BDLFlBQU0sU0FBUyxNQUFNLEdBQUcsWUFBWSxVQUFVLEVBQUUsSUFBSSxXQUFXLEdBQUcsQ0FBQztBQUduRSxZQUFNLEdBQUc7QUFDVCxhQUFPO0lBQ1IsU0FBUSxHQUFHO0FBQ1YsVUFBSSxhQUFhLGVBQWU7QUFDOUIsZUFBTyxLQUFLLEVBQUUsT0FBTztNQUN0QixPQUFNO0FBQ0wsY0FBTSxjQUFjLGNBQWMsT0FBeUIsV0FBQTtVQUN6RCxzQkFBdUIsTUFBVyxRQUFYLE1BQUEsU0FBQSxTQUFBLEVBQWE7UUFDckMsQ0FBQTtBQUNELGVBQU8sS0FBSyxZQUFZLE9BQU87TUFDaEM7SUFDRjtFQUNIO0FBRU8saUJBQWUsMkJBQ3BCLEtBQ0EsaUJBQXNDO0FBRXRDLFFBQUk7QUFDRixZQUFNLEtBQUssTUFBTSxhQUFZO0FBQzdCLFlBQU0sS0FBSyxHQUFHLFlBQVksWUFBWSxXQUFXO0FBQ2pELFlBQU0sY0FBYyxHQUFHLFlBQVksVUFBVTtBQUM3QyxZQUFNLFlBQVksSUFBSSxpQkFBaUIsV0FBVyxHQUFHLENBQUM7QUFDdEQsWUFBTSxHQUFHO0lBQ1YsU0FBUSxHQUFHO0FBQ1YsVUFBSSxhQUFhLGVBQWU7QUFDOUIsZUFBTyxLQUFLLEVBQUUsT0FBTztNQUN0QixPQUFNO0FBQ0wsY0FBTSxjQUFjLGNBQWMsT0FBMkIsV0FBQTtVQUMzRCxzQkFBdUIsTUFBVyxRQUFYLE1BQUEsU0FBQSxTQUFBLEVBQWE7UUFDckMsQ0FBQTtBQUNELGVBQU8sS0FBSyxZQUFZLE9BQU87TUFDaEM7SUFDRjtFQUNIO0FBRUEsV0FBUyxXQUFXLEtBQWdCO0FBQ2xDLFdBQU8sR0FBRyxXQUFJLE1BQUksS0FBSSxXQUFJLFFBQVE7RUFDcEM7QUM3RUEsTUFBTSxtQkFBbUI7QUFFekIsTUFBTSx3Q0FBd0MsS0FBSyxLQUFLLEtBQUssS0FBSztNQUVyRCw2QkFBb0I7SUF5Qi9CLFlBQTZCLFdBQTZCO0FBQTdCLFdBQVMsWUFBVDtBQVQ3QixXQUFnQixtQkFBaUM7QUFVL0MsWUFBTSxNQUFNLEtBQUssVUFBVSxZQUFZLEtBQUssRUFBRSxhQUFZO0FBQzFELFdBQUssV0FBVyxJQUFJLHFCQUFxQixHQUFHO0FBQzVDLFdBQUssMEJBQTBCLEtBQUssU0FBUyxLQUFJLEVBQUcsS0FBSyxZQUFTO0FBQ2hFLGFBQUssbUJBQW1CO0FBQ3hCLGVBQU87TUFDVCxDQUFDOzs7Ozs7Ozs7SUFVSCxNQUFNLG1CQUFnQjs7QUFDcEIsWUFBTSxpQkFBaUIsS0FBSyxVQUN6QixZQUFZLGlCQUFpQixFQUM3QixhQUFZO0FBSWYsWUFBTSxRQUFRLGVBQWUsc0JBQXFCO0FBQ2xELFlBQU0sT0FBTyxpQkFBZ0I7QUFDN0IsWUFBSSxLQUFBLEtBQUssc0JBQWtCLFFBQUEsT0FBQSxTQUFBLFNBQUEsR0FBQSxlQUFjLE1BQU07QUFDN0MsYUFBSyxtQkFBbUIsTUFBTSxLQUFLO0FBRW5DLGNBQUksS0FBQSxLQUFLLHNCQUFrQixRQUFBLE9BQUEsU0FBQSxTQUFBLEdBQUEsZUFBYyxNQUFNO0FBQzdDO1FBQ0Q7TUFDRjtBQUdELFVBQ0UsS0FBSyxpQkFBaUIsMEJBQTBCLFFBQ2hELEtBQUssaUJBQWlCLFdBQVcsS0FDL0IseUJBQXVCLG9CQUFvQixTQUFTLElBQUksR0FFMUQ7QUFDQTtNQUNELE9BQU07QUFFTCxhQUFLLGlCQUFpQixXQUFXLEtBQUssRUFBRSxNQUFNLE1BQUssQ0FBRTtNQUN0RDtBQUVELFdBQUssaUJBQWlCLGFBQWEsS0FBSyxpQkFBaUIsV0FBVyxPQUNsRSx5QkFBc0I7QUFDcEIsY0FBTSxjQUFjLElBQUksS0FBSyxvQkFBb0IsSUFBSSxFQUFFLFFBQU87QUFDOUQsY0FBTSxNQUFNLEtBQUssSUFBRztBQUNwQixlQUFPLE1BQU0sZUFBZTtNQUM5QixDQUFDO0FBRUgsYUFBTyxLQUFLLFNBQVMsVUFBVSxLQUFLLGdCQUFnQjs7Ozs7Ozs7O0lBVXRELE1BQU0sc0JBQW1COztBQUN2QixVQUFJLEtBQUsscUJBQXFCLE1BQU07QUFDbEMsY0FBTSxLQUFLO01BQ1o7QUFFRCxZQUNFLEtBQUEsS0FBSyxzQkFBa0IsUUFBQSxPQUFBLFNBQUEsU0FBQSxHQUFBLGVBQWMsUUFDckMsS0FBSyxpQkFBaUIsV0FBVyxXQUFXLEdBQzVDO0FBQ0EsZUFBTztNQUNSO0FBQ0QsWUFBTSxPQUFPLGlCQUFnQjtBQUU3QixZQUFNLEVBQUUsa0JBQWtCLGNBQWEsSUFBSywyQkFDMUMsS0FBSyxpQkFBaUIsVUFBVTtBQUVsQyxZQUFNLGVBQWUsOEJBQ25CLEtBQUssVUFBVSxFQUFFLFNBQVMsR0FBRyxZQUFZLGlCQUFnQixDQUFFLENBQUM7QUFHOUQsV0FBSyxpQkFBaUIsd0JBQXdCO0FBQzlDLFVBQUksY0FBYyxTQUFTLEdBQUc7QUFFNUIsYUFBSyxpQkFBaUIsYUFBYTtBQUluQyxjQUFNLEtBQUssU0FBUyxVQUFVLEtBQUssZ0JBQWdCO01BQ3BELE9BQU07QUFDTCxhQUFLLGlCQUFpQixhQUFhLENBQUE7QUFFbkMsYUFBSyxLQUFLLFNBQVMsVUFBVSxLQUFLLGdCQUFnQjtNQUNuRDtBQUNELGFBQU87O0VBRVY7QUFFRCxXQUFTLG1CQUFnQjtBQUN2QixVQUFNLFFBQVEsb0JBQUksS0FBSTtBQUV0QixXQUFPLE1BQU0sWUFBVyxFQUFHLFVBQVUsR0FBRyxFQUFFO0VBQzVDO1dBRWdCLDJCQUNkLGlCQUNBLFVBQVUsa0JBQWdCO0FBTzFCLFVBQU0sbUJBQTRDLENBQUE7QUFFbEQsUUFBSSxnQkFBZ0IsZ0JBQWdCLE1BQUs7QUFDekMsZUFBVyx1QkFBdUIsaUJBQWlCO0FBRWpELFlBQU0saUJBQWlCLGlCQUFpQixLQUN0QyxRQUFNLEdBQUcsVUFBVSxvQkFBb0IsS0FBSztBQUU5QyxVQUFJLENBQUMsZ0JBQWdCO0FBRW5CLHlCQUFpQixLQUFLO1VBQ3BCLE9BQU8sb0JBQW9CO1VBQzNCLE9BQU8sQ0FBQyxvQkFBb0IsSUFBSTtRQUNqQyxDQUFBO0FBQ0QsWUFBSSxXQUFXLGdCQUFnQixJQUFJLFNBQVM7QUFHMUMsMkJBQWlCLElBQUc7QUFDcEI7UUFDRDtNQUNGLE9BQU07QUFDTCx1QkFBZSxNQUFNLEtBQUssb0JBQW9CLElBQUk7QUFHbEQsWUFBSSxXQUFXLGdCQUFnQixJQUFJLFNBQVM7QUFDMUMseUJBQWUsTUFBTSxJQUFHO0FBQ3hCO1FBQ0Q7TUFDRjtBQUdELHNCQUFnQixjQUFjLE1BQU0sQ0FBQztJQUN0QztBQUNELFdBQU87TUFDTDtNQUNBOztFQUVKO01BRWEsNkJBQW9CO0lBRS9CLFlBQW1CLEtBQWdCO0FBQWhCLFdBQUcsTUFBSDtBQUNqQixXQUFLLDBCQUEwQixLQUFLLDZCQUE0Qjs7SUFFbEUsTUFBTSwrQkFBNEI7QUFDaEMsVUFBSSxDQUFDLHFCQUFvQixHQUFJO0FBQzNCLGVBQU87TUFDUixPQUFNO0FBQ0wsZUFBTywwQkFBeUIsRUFDN0IsS0FBSyxNQUFNLElBQUksRUFDZixNQUFNLE1BQU0sS0FBSztNQUNyQjs7Ozs7SUFLSCxNQUFNLE9BQUk7QUFDUixZQUFNLGtCQUFrQixNQUFNLEtBQUs7QUFDbkMsVUFBSSxDQUFDLGlCQUFpQjtBQUNwQixlQUFPLEVBQUUsWUFBWSxDQUFBLEVBQUU7TUFDeEIsT0FBTTtBQUNMLGNBQU0scUJBQXFCLE1BQU0sNEJBQTRCLEtBQUssR0FBRztBQUNyRSxZQUFJLHVCQUFBLFFBQUEsdUJBQWtCLFNBQUEsU0FBbEIsbUJBQW9CLFlBQVk7QUFDbEMsaUJBQU87UUFDUixPQUFNO0FBQ0wsaUJBQU8sRUFBRSxZQUFZLENBQUEsRUFBRTtRQUN4QjtNQUNGOzs7SUFHSCxNQUFNLFVBQVUsa0JBQXVDOztBQUNyRCxZQUFNLGtCQUFrQixNQUFNLEtBQUs7QUFDbkMsVUFBSSxDQUFDLGlCQUFpQjtBQUNwQjtNQUNELE9BQU07QUFDTCxjQUFNLDJCQUEyQixNQUFNLEtBQUssS0FBSTtBQUNoRCxlQUFPLDJCQUEyQixLQUFLLEtBQUs7VUFDMUMsd0JBQ0UsS0FBQSxpQkFBaUIsMkJBQ2pCLFFBQUEsT0FBQSxTQUFBLEtBQUEseUJBQXlCO1VBQzNCLFlBQVksaUJBQWlCO1FBQzlCLENBQUE7TUFDRjs7O0lBR0gsTUFBTSxJQUFJLGtCQUF1Qzs7QUFDL0MsWUFBTSxrQkFBa0IsTUFBTSxLQUFLO0FBQ25DLFVBQUksQ0FBQyxpQkFBaUI7QUFDcEI7TUFDRCxPQUFNO0FBQ0wsY0FBTSwyQkFBMkIsTUFBTSxLQUFLLEtBQUk7QUFDaEQsZUFBTywyQkFBMkIsS0FBSyxLQUFLO1VBQzFDLHdCQUNFLEtBQUEsaUJBQWlCLDJCQUNqQixRQUFBLE9BQUEsU0FBQSxLQUFBLHlCQUF5QjtVQUMzQixZQUFZO1lBQ1YsR0FBRyx5QkFBeUI7WUFDNUIsR0FBRyxpQkFBaUI7VUFDckI7UUFDRixDQUFBO01BQ0Y7O0VBRUo7QUFPSyxXQUFVLFdBQVcsaUJBQXdDO0FBRWpFLFdBQU87O01BRUwsS0FBSyxVQUFVLEVBQUUsU0FBUyxHQUFHLFlBQVksZ0JBQWUsQ0FBRTtJQUFDLEVBQzNEO0VBQ0o7QUMvUU0sV0FBVSx1QkFBdUIsU0FBZ0I7QUFDckQsdUJBQ0UsSUFBSTtNQUNGO01BQ0EsZUFBYSxJQUFJLDBCQUEwQixTQUFTO01BQUM7O0lBQUEsQ0FFdEQ7QUFFSCx1QkFDRSxJQUFJO01BQ0Y7TUFDQSxlQUFhLElBQUkscUJBQXFCLFNBQVM7TUFBQzs7SUFBQSxDQUVqRDtBQUlILG9CQUFnQkMsUUFBTUMsV0FBUyxPQUFPO0FBRXRDLG9CQUFnQkQsUUFBTUMsV0FBUyxTQUFrQjtBQUVqRCxvQkFBZ0IsV0FBVyxFQUFFO0VBQy9CO0FDaEJBLHlCQUF1QixFQUFpQjs7Ozs7QUNYeEMsa0JBQWdCQyxPQUFNLFNBQVMsS0FBSzs7O0FDbEI3QixXQUFTLFNBQVM7QUFDckIsVUFBTSxpQkFBaUI7QUFBQSxNQUNuQixVQUFVO0FBQUEsTUFDVixjQUFjO0FBQUEsTUFDZCxhQUFhO0FBQUEsTUFDYixpQkFBaUI7QUFBQSxNQUNqQixxQkFBcUI7QUFBQSxNQUNyQixTQUFTO0FBQUEsTUFDVCxpQkFBaUI7QUFBQSxJQUNyQjtBQUNBLFVBQU0sTUFBTSxjQUFjLGNBQWM7QUFBQSxFQUM1Qzs7O0FDWEEsU0FBTzsiLAogICJuYW1lcyI6IFsic3RyaW5nVG9CeXRlQXJyYXkiLCAibmFtZSIsICJMb2dMZXZlbCIsICJuYW1lIiwgIm5hbWUiLCAidmVyc2lvbiIsICJ0YXJnZXQiLCAiREVGQVVMVF9FTlRSWV9OQU1FIiwgImFwcE5hbWUiLCAiYXBwQ29tcGF0TmFtZSIsICJhbmFseXRpY3NOYW1lIiwgImFuYWx5dGljc0NvbXBhdE5hbWUiLCAiYXBwQ2hlY2tOYW1lIiwgImFwcENoZWNrQ29tcGF0TmFtZSIsICJhdXRoTmFtZSIsICJhdXRoQ29tcGF0TmFtZSIsICJkYXRhYmFzZU5hbWUiLCAiZGF0YWJhc2VDb21wYXROYW1lIiwgImZ1bmN0aW9uc05hbWUiLCAiZnVuY3Rpb25zQ29tcGF0TmFtZSIsICJpbnN0YWxsYXRpb25zTmFtZSIsICJpbnN0YWxsYXRpb25zQ29tcGF0TmFtZSIsICJtZXNzYWdpbmdOYW1lIiwgIm1lc3NhZ2luZ0NvbXBhdE5hbWUiLCAicGVyZm9ybWFuY2VOYW1lIiwgInBlcmZvcm1hbmNlQ29tcGF0TmFtZSIsICJyZW1vdGVDb25maWdOYW1lIiwgInJlbW90ZUNvbmZpZ0NvbXBhdE5hbWUiLCAic3RvcmFnZU5hbWUiLCAic3RvcmFnZUNvbXBhdE5hbWUiLCAiZmlyZXN0b3JlTmFtZSIsICJmaXJlc3RvcmVDb21wYXROYW1lIiwgInBhY2thZ2VOYW1lIiwgImNvbmZpZyIsICJuYW1lIiwgImNvbmZpZyIsICJERUZBVUxUX0VOVFJZX05BTUUiLCAidmVyc2lvbiIsICJuYW1lIiwgInZlcnNpb24iLCAibmFtZSJdCn0K
