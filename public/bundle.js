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
  var getDefaultEmulatorHost = (productName) => {
    var _a, _b;
    return (_b = (_a = getDefaults()) === null || _a === void 0 ? void 0 : _a.emulatorHosts) === null || _b === void 0 ? void 0 : _b[productName];
  };
  var getDefaultEmulatorHostnameAndPort = (productName) => {
    const host = getDefaultEmulatorHost(productName);
    if (!host) {
      return void 0;
    }
    const separatorIndex = host.lastIndexOf(":");
    if (separatorIndex <= 0 || separatorIndex + 1 === host.length) {
      throw new Error("Invalid host ".concat(host, " with no separate hostname and port!"));
    }
    const port = parseInt(host.substring(separatorIndex + 1), 10);
    if (host[0] === "[") {
      return [host.substring(1, separatorIndex - 1), port];
    } else {
      return [host.substring(0, separatorIndex), port];
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
  function createMockUserToken(token, projectId) {
    if (token.uid) {
      throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');
    }
    const header = {
      alg: "none",
      type: "JWT"
    };
    const project = projectId || "demo-project";
    const iat = token.iat || 0;
    const sub = token.sub || token.user_id;
    if (!sub) {
      throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");
    }
    const payload = Object.assign({
      // Set all required fields to decent defaults
      iss: "https://securetoken.google.com/".concat(project),
      aud: project,
      iat,
      exp: iat + 3600,
      auth_time: iat,
      sub,
      user_id: sub,
      firebase: {
        sign_in_provider: "custom",
        identities: {}
      }
    }, token);
    const signature = "";
    return [
      base64urlEncodeWithoutPadding(JSON.stringify(header)),
      base64urlEncodeWithoutPadding(JSON.stringify(payload)),
      signature
    ].join(".");
  }
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
  function getModularInstance(service) {
    if (service && service._delegate) {
      return service._delegate;
    } else {
      return service;
    }
  }

  // node_modules/@firebase/component/dist/esm/index.esm2017.js
  var Component = class {
    /**
     *
     * @param name The public service name, e.g. app, auth, firestore, database
     * @param instanceFactory Service factory responsible for creating the public interface
     * @param type whether the service provided by the component is public or private
     */
    constructor(name4, instanceFactory, type) {
      this.name = name4;
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
    constructor(name4, container) {
      this.name = name4;
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
    constructor(name4) {
      this.name = name4;
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
    getProvider(name4) {
      if (this.providers.has(name4)) {
        return this.providers.get(name4);
      }
      const provider = new Provider(name4, this);
      this.providers.set(name4, provider);
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
    constructor(name4) {
      this.name = name4;
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
  function openDB(name4, version4, { blocked, upgrade, blocking, terminated } = {}) {
    const request = indexedDB.open(name4, version4);
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
  var name$p = "@firebase/app";
  var version$1 = "0.10.5";
  var logger = new Logger("@firebase/app");
  var name$o = "@firebase/app-compat";
  var name$n = "@firebase/analytics-compat";
  var name$m = "@firebase/analytics";
  var name$l = "@firebase/app-check-compat";
  var name$k = "@firebase/app-check";
  var name$j = "@firebase/auth";
  var name$i = "@firebase/auth-compat";
  var name$h = "@firebase/database";
  var name$g = "@firebase/database-compat";
  var name$f = "@firebase/functions";
  var name$e = "@firebase/functions-compat";
  var name$d = "@firebase/installations";
  var name$c = "@firebase/installations-compat";
  var name$b = "@firebase/messaging";
  var name$a = "@firebase/messaging-compat";
  var name$9 = "@firebase/performance";
  var name$8 = "@firebase/performance-compat";
  var name$7 = "@firebase/remote-config";
  var name$6 = "@firebase/remote-config-compat";
  var name$5 = "@firebase/storage";
  var name$4 = "@firebase/storage-compat";
  var name$3 = "@firebase/firestore";
  var name$2 = "@firebase/vertexai-preview";
  var name$1 = "@firebase/firestore-compat";
  var name = "firebase";
  var version = "10.12.2";
  var DEFAULT_ENTRY_NAME2 = "[DEFAULT]";
  var PLATFORM_LOG_STRING = {
    [name$p]: "fire-core",
    [name$o]: "fire-core-compat",
    [name$m]: "fire-analytics",
    [name$n]: "fire-analytics-compat",
    [name$k]: "fire-app-check",
    [name$l]: "fire-app-check-compat",
    [name$j]: "fire-auth",
    [name$i]: "fire-auth-compat",
    [name$h]: "fire-rtdb",
    [name$g]: "fire-rtdb-compat",
    [name$f]: "fire-fn",
    [name$e]: "fire-fn-compat",
    [name$d]: "fire-iid",
    [name$c]: "fire-iid-compat",
    [name$b]: "fire-fcm",
    [name$a]: "fire-fcm-compat",
    [name$9]: "fire-perf",
    [name$8]: "fire-perf-compat",
    [name$7]: "fire-rc",
    [name$6]: "fire-rc-compat",
    [name$5]: "fire-gcs",
    [name$4]: "fire-gcs-compat",
    [name$3]: "fire-fst",
    [name$1]: "fire-fst-compat",
    [name$2]: "fire-vertex",
    "fire-js": "fire-js",
    [name]: "fire-js-all"
  };
  var _apps = /* @__PURE__ */ new Map();
  var _serverApps = /* @__PURE__ */ new Map();
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
    for (const serverApp of _serverApps.values()) {
      _addComponent(serverApp, component);
    }
    return true;
  }
  function _getProvider(app, name4) {
    const heartbeatController = app.container.getProvider("heartbeat").getImmediate({ optional: true });
    if (heartbeatController) {
      void heartbeatController.triggerHeartbeat();
    }
    return app.container.getProvider(name4);
  }
  var ERRORS = {
    [
      "no-app"
      /* AppError.NO_APP */
    ]: "No Firebase App '{$appName}' has been created - call initializeApp() first",
    [
      "bad-app-name"
      /* AppError.BAD_APP_NAME */
    ]: "Illegal App name: '{$appName}'",
    [
      "duplicate-app"
      /* AppError.DUPLICATE_APP */
    ]: "Firebase App named '{$appName}' already exists with different options or config",
    [
      "app-deleted"
      /* AppError.APP_DELETED */
    ]: "Firebase App named '{$appName}' already deleted",
    [
      "server-app-deleted"
      /* AppError.SERVER_APP_DELETED */
    ]: "Firebase Server App has been deleted",
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
    ]: "Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.",
    [
      "finalization-registry-not-supported"
      /* AppError.FINALIZATION_REGISTRY_NOT_SUPPORTED */
    ]: "FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.",
    [
      "invalid-server-app-environment"
      /* AppError.INVALID_SERVER_APP_ENVIRONMENT */
    ]: "FirebaseServerApp is not for use in browser environments."
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
  var SDK_VERSION = version;
  function initializeApp(_options, rawConfig = {}) {
    let options = _options;
    if (typeof rawConfig !== "object") {
      const name5 = rawConfig;
      rawConfig = { name: name5 };
    }
    const config2 = Object.assign({ name: DEFAULT_ENTRY_NAME2, automaticDataCollectionEnabled: false }, rawConfig);
    const name4 = config2.name;
    if (typeof name4 !== "string" || !name4) {
      throw ERROR_FACTORY.create("bad-app-name", {
        appName: String(name4)
      });
    }
    options || (options = getDefaultAppConfig());
    if (!options) {
      throw ERROR_FACTORY.create(
        "no-options"
        /* AppError.NO_OPTIONS */
      );
    }
    const existingApp = _apps.get(name4);
    if (existingApp) {
      if (deepEqual(options, existingApp.options) && deepEqual(config2, existingApp.config)) {
        return existingApp;
      } else {
        throw ERROR_FACTORY.create("duplicate-app", { appName: name4 });
      }
    }
    const container = new ComponentContainer(name4);
    for (const component of _components.values()) {
      container.addComponent(component);
    }
    const newApp = new FirebaseAppImpl(options, config2, container);
    _apps.set(name4, newApp);
    return newApp;
  }
  function getApp(name4 = DEFAULT_ENTRY_NAME2) {
    const app = _apps.get(name4);
    if (!app && name4 === DEFAULT_ENTRY_NAME2 && getDefaultAppConfig()) {
      return initializeApp();
    }
    if (!app) {
      throw ERROR_FACTORY.create("no-app", { appName: name4 });
    }
    return app;
  }
  function registerVersion(libraryKeyOrName, version4, variant) {
    var _a;
    let library = (_a = PLATFORM_LOG_STRING[libraryKeyOrName]) !== null && _a !== void 0 ? _a : libraryKeyOrName;
    if (variant) {
      library += "-".concat(variant);
    }
    const libraryMismatch = library.match(/\s|\//);
    const versionMismatch = version4.match(/\s|\//);
    if (libraryMismatch || versionMismatch) {
      const warning = [
        'Unable to register library "'.concat(library, '" with version "').concat(version4, '":')
      ];
      if (libraryMismatch) {
        warning.push('library name "'.concat(library, '" contains illegal characters (whitespace or "/")'));
      }
      if (libraryMismatch && versionMismatch) {
        warning.push("and");
      }
      if (versionMismatch) {
        warning.push('version name "'.concat(version4, '" contains illegal characters (whitespace or "/")'));
      }
      logger.warn(warning.join(" "));
      return;
    }
    _registerComponent(new Component(
      "".concat(library, "-version"),
      () => ({ library, version: version4 }),
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
    registerVersion(name$p, version$1, variant);
    registerVersion(name$p, version$1, "esm2017");
    registerVersion("fire-js", "");
  }
  registerCoreComponents("");

  // node_modules/firebase/app/dist/esm/index.esm.js
  var name2 = "firebase";
  var version2 = "10.12.2";
  registerVersion(name2, version2, "app");

  // node_modules/@firebase/storage/dist/index.esm2017.js
  var DEFAULT_HOST = "firebasestorage.googleapis.com";
  var CONFIG_STORAGE_BUCKET_KEY = "storageBucket";
  var DEFAULT_MAX_OPERATION_RETRY_TIME = 2 * 60 * 1e3;
  var DEFAULT_MAX_UPLOAD_RETRY_TIME = 10 * 60 * 1e3;
  var StorageError = class _StorageError extends FirebaseError {
    /**
     * @param code - A `StorageErrorCode` string to be prefixed with 'storage/' and
     *  added to the end of the message.
     * @param message  - Error message.
     * @param status_ - Corresponding HTTP Status Code
     */
    constructor(code, message, status_ = 0) {
      super(prependCode(code), "Firebase Storage: ".concat(message, " (").concat(prependCode(code), ")"));
      this.status_ = status_;
      this.customData = { serverResponse: null };
      this._baseMessage = this.message;
      Object.setPrototypeOf(this, _StorageError.prototype);
    }
    get status() {
      return this.status_;
    }
    set status(status) {
      this.status_ = status;
    }
    /**
     * Compares a `StorageErrorCode` against this error's code, filtering out the prefix.
     */
    _codeEquals(code) {
      return prependCode(code) === this.code;
    }
    /**
     * Optional response message that was added by the server.
     */
    get serverResponse() {
      return this.customData.serverResponse;
    }
    set serverResponse(serverResponse) {
      this.customData.serverResponse = serverResponse;
      if (this.customData.serverResponse) {
        this.message = "".concat(this._baseMessage, "\n").concat(this.customData.serverResponse);
      } else {
        this.message = this._baseMessage;
      }
    }
  };
  var StorageErrorCode;
  (function(StorageErrorCode2) {
    StorageErrorCode2["UNKNOWN"] = "unknown";
    StorageErrorCode2["OBJECT_NOT_FOUND"] = "object-not-found";
    StorageErrorCode2["BUCKET_NOT_FOUND"] = "bucket-not-found";
    StorageErrorCode2["PROJECT_NOT_FOUND"] = "project-not-found";
    StorageErrorCode2["QUOTA_EXCEEDED"] = "quota-exceeded";
    StorageErrorCode2["UNAUTHENTICATED"] = "unauthenticated";
    StorageErrorCode2["UNAUTHORIZED"] = "unauthorized";
    StorageErrorCode2["UNAUTHORIZED_APP"] = "unauthorized-app";
    StorageErrorCode2["RETRY_LIMIT_EXCEEDED"] = "retry-limit-exceeded";
    StorageErrorCode2["INVALID_CHECKSUM"] = "invalid-checksum";
    StorageErrorCode2["CANCELED"] = "canceled";
    StorageErrorCode2["INVALID_EVENT_NAME"] = "invalid-event-name";
    StorageErrorCode2["INVALID_URL"] = "invalid-url";
    StorageErrorCode2["INVALID_DEFAULT_BUCKET"] = "invalid-default-bucket";
    StorageErrorCode2["NO_DEFAULT_BUCKET"] = "no-default-bucket";
    StorageErrorCode2["CANNOT_SLICE_BLOB"] = "cannot-slice-blob";
    StorageErrorCode2["SERVER_FILE_WRONG_SIZE"] = "server-file-wrong-size";
    StorageErrorCode2["NO_DOWNLOAD_URL"] = "no-download-url";
    StorageErrorCode2["INVALID_ARGUMENT"] = "invalid-argument";
    StorageErrorCode2["INVALID_ARGUMENT_COUNT"] = "invalid-argument-count";
    StorageErrorCode2["APP_DELETED"] = "app-deleted";
    StorageErrorCode2["INVALID_ROOT_OPERATION"] = "invalid-root-operation";
    StorageErrorCode2["INVALID_FORMAT"] = "invalid-format";
    StorageErrorCode2["INTERNAL_ERROR"] = "internal-error";
    StorageErrorCode2["UNSUPPORTED_ENVIRONMENT"] = "unsupported-environment";
  })(StorageErrorCode || (StorageErrorCode = {}));
  function prependCode(code) {
    return "storage/" + code;
  }
  function unknown() {
    const message = "An unknown error occurred, please check the error payload for server response.";
    return new StorageError(StorageErrorCode.UNKNOWN, message);
  }
  function objectNotFound(path) {
    return new StorageError(StorageErrorCode.OBJECT_NOT_FOUND, "Object '" + path + "' does not exist.");
  }
  function quotaExceeded(bucket) {
    return new StorageError(StorageErrorCode.QUOTA_EXCEEDED, "Quota for bucket '" + bucket + "' exceeded, please view quota on https://firebase.google.com/pricing/.");
  }
  function unauthenticated() {
    const message = "User is not authenticated, please authenticate using Firebase Authentication and try again.";
    return new StorageError(StorageErrorCode.UNAUTHENTICATED, message);
  }
  function unauthorizedApp() {
    return new StorageError(StorageErrorCode.UNAUTHORIZED_APP, "This app does not have permission to access Firebase Storage on this project.");
  }
  function unauthorized(path) {
    return new StorageError(StorageErrorCode.UNAUTHORIZED, "User does not have permission to access '" + path + "'.");
  }
  function retryLimitExceeded() {
    return new StorageError(StorageErrorCode.RETRY_LIMIT_EXCEEDED, "Max retry time for operation exceeded, please try again.");
  }
  function canceled() {
    return new StorageError(StorageErrorCode.CANCELED, "User canceled the upload/download.");
  }
  function invalidUrl(url) {
    return new StorageError(StorageErrorCode.INVALID_URL, "Invalid URL '" + url + "'.");
  }
  function invalidDefaultBucket(bucket) {
    return new StorageError(StorageErrorCode.INVALID_DEFAULT_BUCKET, "Invalid default bucket '" + bucket + "'.");
  }
  function noDefaultBucket() {
    return new StorageError(StorageErrorCode.NO_DEFAULT_BUCKET, "No default bucket found. Did you set the '" + CONFIG_STORAGE_BUCKET_KEY + "' property when initializing the app?");
  }
  function noDownloadURL() {
    return new StorageError(StorageErrorCode.NO_DOWNLOAD_URL, "The given file does not have any download URLs.");
  }
  function invalidArgument(message) {
    return new StorageError(StorageErrorCode.INVALID_ARGUMENT, message);
  }
  function appDeleted() {
    return new StorageError(StorageErrorCode.APP_DELETED, "The Firebase app was deleted.");
  }
  function invalidRootOperation(name4) {
    return new StorageError(StorageErrorCode.INVALID_ROOT_OPERATION, "The operation '" + name4 + "' cannot be performed on a root reference, create a non-root reference using child, such as .child('file.png').");
  }
  function internalError(message) {
    throw new StorageError(StorageErrorCode.INTERNAL_ERROR, "Internal error: " + message);
  }
  var Location = class _Location {
    constructor(bucket, path) {
      this.bucket = bucket;
      this.path_ = path;
    }
    get path() {
      return this.path_;
    }
    get isRoot() {
      return this.path.length === 0;
    }
    fullServerUrl() {
      const encode = encodeURIComponent;
      return "/b/" + encode(this.bucket) + "/o/" + encode(this.path);
    }
    bucketOnlyServerUrl() {
      const encode = encodeURIComponent;
      return "/b/" + encode(this.bucket) + "/o";
    }
    static makeFromBucketSpec(bucketString, host) {
      let bucketLocation;
      try {
        bucketLocation = _Location.makeFromUrl(bucketString, host);
      } catch (e) {
        return new _Location(bucketString, "");
      }
      if (bucketLocation.path === "") {
        return bucketLocation;
      } else {
        throw invalidDefaultBucket(bucketString);
      }
    }
    static makeFromUrl(url, host) {
      let location = null;
      const bucketDomain = "([A-Za-z0-9.\\-_]+)";
      function gsModify(loc) {
        if (loc.path.charAt(loc.path.length - 1) === "/") {
          loc.path_ = loc.path_.slice(0, -1);
        }
      }
      const gsPath = "(/(.*))?$";
      const gsRegex = new RegExp("^gs://" + bucketDomain + gsPath, "i");
      const gsIndices = { bucket: 1, path: 3 };
      function httpModify(loc) {
        loc.path_ = decodeURIComponent(loc.path);
      }
      const version4 = "v[A-Za-z0-9_]+";
      const firebaseStorageHost = host.replace(/[.]/g, "\\.");
      const firebaseStoragePath = "(/([^?#]*).*)?$";
      const firebaseStorageRegExp = new RegExp("^https?://".concat(firebaseStorageHost, "/").concat(version4, "/b/").concat(bucketDomain, "/o").concat(firebaseStoragePath), "i");
      const firebaseStorageIndices = { bucket: 1, path: 3 };
      const cloudStorageHost = host === DEFAULT_HOST ? "(?:storage.googleapis.com|storage.cloud.google.com)" : host;
      const cloudStoragePath = "([^?#]*)";
      const cloudStorageRegExp = new RegExp("^https?://".concat(cloudStorageHost, "/").concat(bucketDomain, "/").concat(cloudStoragePath), "i");
      const cloudStorageIndices = { bucket: 1, path: 2 };
      const groups = [
        { regex: gsRegex, indices: gsIndices, postModify: gsModify },
        {
          regex: firebaseStorageRegExp,
          indices: firebaseStorageIndices,
          postModify: httpModify
        },
        {
          regex: cloudStorageRegExp,
          indices: cloudStorageIndices,
          postModify: httpModify
        }
      ];
      for (let i = 0; i < groups.length; i++) {
        const group = groups[i];
        const captures = group.regex.exec(url);
        if (captures) {
          const bucketValue = captures[group.indices.bucket];
          let pathValue = captures[group.indices.path];
          if (!pathValue) {
            pathValue = "";
          }
          location = new _Location(bucketValue, pathValue);
          group.postModify(location);
          break;
        }
      }
      if (location == null) {
        throw invalidUrl(url);
      }
      return location;
    }
  };
  var FailRequest = class {
    constructor(error) {
      this.promise_ = Promise.reject(error);
    }
    /** @inheritDoc */
    getPromise() {
      return this.promise_;
    }
    /** @inheritDoc */
    cancel(_appDelete = false) {
    }
  };
  function start(doRequest, backoffCompleteCb, timeout) {
    let waitSeconds = 1;
    let retryTimeoutId = null;
    let globalTimeoutId = null;
    let hitTimeout = false;
    let cancelState = 0;
    function canceled2() {
      return cancelState === 2;
    }
    let triggeredCallback = false;
    function triggerCallback(...args) {
      if (!triggeredCallback) {
        triggeredCallback = true;
        backoffCompleteCb.apply(null, args);
      }
    }
    function callWithDelay(millis) {
      retryTimeoutId = setTimeout(() => {
        retryTimeoutId = null;
        doRequest(responseHandler, canceled2());
      }, millis);
    }
    function clearGlobalTimeout() {
      if (globalTimeoutId) {
        clearTimeout(globalTimeoutId);
      }
    }
    function responseHandler(success, ...args) {
      if (triggeredCallback) {
        clearGlobalTimeout();
        return;
      }
      if (success) {
        clearGlobalTimeout();
        triggerCallback.call(null, success, ...args);
        return;
      }
      const mustStop = canceled2() || hitTimeout;
      if (mustStop) {
        clearGlobalTimeout();
        triggerCallback.call(null, success, ...args);
        return;
      }
      if (waitSeconds < 64) {
        waitSeconds *= 2;
      }
      let waitMillis;
      if (cancelState === 1) {
        cancelState = 2;
        waitMillis = 0;
      } else {
        waitMillis = (waitSeconds + Math.random()) * 1e3;
      }
      callWithDelay(waitMillis);
    }
    let stopped = false;
    function stop2(wasTimeout) {
      if (stopped) {
        return;
      }
      stopped = true;
      clearGlobalTimeout();
      if (triggeredCallback) {
        return;
      }
      if (retryTimeoutId !== null) {
        if (!wasTimeout) {
          cancelState = 2;
        }
        clearTimeout(retryTimeoutId);
        callWithDelay(0);
      } else {
        if (!wasTimeout) {
          cancelState = 1;
        }
      }
    }
    callWithDelay(0);
    globalTimeoutId = setTimeout(() => {
      hitTimeout = true;
      stop2(true);
    }, timeout);
    return stop2;
  }
  function stop(id) {
    id(false);
  }
  function isJustDef(p) {
    return p !== void 0;
  }
  function isNonArrayObject(p) {
    return typeof p === "object" && !Array.isArray(p);
  }
  function isString(p) {
    return typeof p === "string" || p instanceof String;
  }
  function validateNumber(argument, minValue, maxValue, value) {
    if (value < minValue) {
      throw invalidArgument("Invalid value for '".concat(argument, "'. Expected ").concat(minValue, " or greater."));
    }
    if (value > maxValue) {
      throw invalidArgument("Invalid value for '".concat(argument, "'. Expected ").concat(maxValue, " or less."));
    }
  }
  function makeUrl(urlPart, host, protocol) {
    let origin = host;
    if (protocol == null) {
      origin = "https://".concat(host);
    }
    return "".concat(protocol, "://").concat(origin, "/v0").concat(urlPart);
  }
  function makeQueryString(params) {
    const encode = encodeURIComponent;
    let queryPart = "?";
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        const nextPart = encode(key) + "=" + encode(params[key]);
        queryPart = queryPart + nextPart + "&";
      }
    }
    queryPart = queryPart.slice(0, -1);
    return queryPart;
  }
  var ErrorCode;
  (function(ErrorCode2) {
    ErrorCode2[ErrorCode2["NO_ERROR"] = 0] = "NO_ERROR";
    ErrorCode2[ErrorCode2["NETWORK_ERROR"] = 1] = "NETWORK_ERROR";
    ErrorCode2[ErrorCode2["ABORT"] = 2] = "ABORT";
  })(ErrorCode || (ErrorCode = {}));
  function isRetryStatusCode(status, additionalRetryCodes) {
    const isFiveHundredCode = status >= 500 && status < 600;
    const extraRetryCodes = [
      // Request Timeout: web server didn't receive full request in time.
      408,
      // Too Many Requests: you're getting rate-limited, basically.
      429
    ];
    const isExtraRetryCode = extraRetryCodes.indexOf(status) !== -1;
    const isAdditionalRetryCode = additionalRetryCodes.indexOf(status) !== -1;
    return isFiveHundredCode || isExtraRetryCode || isAdditionalRetryCode;
  }
  var NetworkRequest = class {
    constructor(url_, method_, headers_, body_, successCodes_, additionalRetryCodes_, callback_, errorCallback_, timeout_, progressCallback_, connectionFactory_, retry = true) {
      this.url_ = url_;
      this.method_ = method_;
      this.headers_ = headers_;
      this.body_ = body_;
      this.successCodes_ = successCodes_;
      this.additionalRetryCodes_ = additionalRetryCodes_;
      this.callback_ = callback_;
      this.errorCallback_ = errorCallback_;
      this.timeout_ = timeout_;
      this.progressCallback_ = progressCallback_;
      this.connectionFactory_ = connectionFactory_;
      this.retry = retry;
      this.pendingConnection_ = null;
      this.backoffId_ = null;
      this.canceled_ = false;
      this.appDelete_ = false;
      this.promise_ = new Promise((resolve, reject) => {
        this.resolve_ = resolve;
        this.reject_ = reject;
        this.start_();
      });
    }
    /**
     * Actually starts the retry loop.
     */
    start_() {
      const doTheRequest = (backoffCallback, canceled2) => {
        if (canceled2) {
          backoffCallback(false, new RequestEndStatus(false, null, true));
          return;
        }
        const connection = this.connectionFactory_();
        this.pendingConnection_ = connection;
        const progressListener = (progressEvent) => {
          const loaded = progressEvent.loaded;
          const total = progressEvent.lengthComputable ? progressEvent.total : -1;
          if (this.progressCallback_ !== null) {
            this.progressCallback_(loaded, total);
          }
        };
        if (this.progressCallback_ !== null) {
          connection.addUploadProgressListener(progressListener);
        }
        connection.send(this.url_, this.method_, this.body_, this.headers_).then(() => {
          if (this.progressCallback_ !== null) {
            connection.removeUploadProgressListener(progressListener);
          }
          this.pendingConnection_ = null;
          const hitServer = connection.getErrorCode() === ErrorCode.NO_ERROR;
          const status = connection.getStatus();
          if (!hitServer || isRetryStatusCode(status, this.additionalRetryCodes_) && this.retry) {
            const wasCanceled = connection.getErrorCode() === ErrorCode.ABORT;
            backoffCallback(false, new RequestEndStatus(false, null, wasCanceled));
            return;
          }
          const successCode = this.successCodes_.indexOf(status) !== -1;
          backoffCallback(true, new RequestEndStatus(successCode, connection));
        });
      };
      const backoffDone = (requestWentThrough, status) => {
        const resolve = this.resolve_;
        const reject = this.reject_;
        const connection = status.connection;
        if (status.wasSuccessCode) {
          try {
            const result = this.callback_(connection, connection.getResponse());
            if (isJustDef(result)) {
              resolve(result);
            } else {
              resolve();
            }
          } catch (e) {
            reject(e);
          }
        } else {
          if (connection !== null) {
            const err = unknown();
            err.serverResponse = connection.getErrorText();
            if (this.errorCallback_) {
              reject(this.errorCallback_(connection, err));
            } else {
              reject(err);
            }
          } else {
            if (status.canceled) {
              const err = this.appDelete_ ? appDeleted() : canceled();
              reject(err);
            } else {
              const err = retryLimitExceeded();
              reject(err);
            }
          }
        }
      };
      if (this.canceled_) {
        backoffDone(false, new RequestEndStatus(false, null, true));
      } else {
        this.backoffId_ = start(doTheRequest, backoffDone, this.timeout_);
      }
    }
    /** @inheritDoc */
    getPromise() {
      return this.promise_;
    }
    /** @inheritDoc */
    cancel(appDelete) {
      this.canceled_ = true;
      this.appDelete_ = appDelete || false;
      if (this.backoffId_ !== null) {
        stop(this.backoffId_);
      }
      if (this.pendingConnection_ !== null) {
        this.pendingConnection_.abort();
      }
    }
  };
  var RequestEndStatus = class {
    constructor(wasSuccessCode, connection, canceled2) {
      this.wasSuccessCode = wasSuccessCode;
      this.connection = connection;
      this.canceled = !!canceled2;
    }
  };
  function addAuthHeader_(headers, authToken) {
    if (authToken !== null && authToken.length > 0) {
      headers["Authorization"] = "Firebase " + authToken;
    }
  }
  function addVersionHeader_(headers, firebaseVersion) {
    headers["X-Firebase-Storage-Version"] = "webjs/" + (firebaseVersion !== null && firebaseVersion !== void 0 ? firebaseVersion : "AppManager");
  }
  function addGmpidHeader_(headers, appId) {
    if (appId) {
      headers["X-Firebase-GMPID"] = appId;
    }
  }
  function addAppCheckHeader_(headers, appCheckToken) {
    if (appCheckToken !== null) {
      headers["X-Firebase-AppCheck"] = appCheckToken;
    }
  }
  function makeRequest(requestInfo, appId, authToken, appCheckToken, requestFactory, firebaseVersion, retry = true) {
    const queryPart = makeQueryString(requestInfo.urlParams);
    const url = requestInfo.url + queryPart;
    const headers = Object.assign({}, requestInfo.headers);
    addGmpidHeader_(headers, appId);
    addAuthHeader_(headers, authToken);
    addVersionHeader_(headers, firebaseVersion);
    addAppCheckHeader_(headers, appCheckToken);
    return new NetworkRequest(url, requestInfo.method, headers, requestInfo.body, requestInfo.successCodes, requestInfo.additionalRetryCodes, requestInfo.handler, requestInfo.errorHandler, requestInfo.timeout, requestInfo.progressCallback, requestFactory, retry);
  }
  function jsonObjectOrNull(s) {
    let obj;
    try {
      obj = JSON.parse(s);
    } catch (e) {
      return null;
    }
    if (isNonArrayObject(obj)) {
      return obj;
    } else {
      return null;
    }
  }
  function parent(path) {
    if (path.length === 0) {
      return null;
    }
    const index = path.lastIndexOf("/");
    if (index === -1) {
      return "";
    }
    const newPath = path.slice(0, index);
    return newPath;
  }
  function child(path, childPath) {
    const canonicalChildPath = childPath.split("/").filter((component) => component.length > 0).join("/");
    if (path.length === 0) {
      return canonicalChildPath;
    } else {
      return path + "/" + canonicalChildPath;
    }
  }
  function lastComponent(path) {
    const index = path.lastIndexOf("/", path.length - 2);
    if (index === -1) {
      return path;
    } else {
      return path.slice(index + 1);
    }
  }
  function noXform_(metadata, value) {
    return value;
  }
  var Mapping = class {
    constructor(server, local, writable, xform) {
      this.server = server;
      this.local = local || server;
      this.writable = !!writable;
      this.xform = xform || noXform_;
    }
  };
  var mappings_ = null;
  function xformPath(fullPath) {
    if (!isString(fullPath) || fullPath.length < 2) {
      return fullPath;
    } else {
      return lastComponent(fullPath);
    }
  }
  function getMappings() {
    if (mappings_) {
      return mappings_;
    }
    const mappings = [];
    mappings.push(new Mapping("bucket"));
    mappings.push(new Mapping("generation"));
    mappings.push(new Mapping("metageneration"));
    mappings.push(new Mapping("name", "fullPath", true));
    function mappingsXformPath(_metadata, fullPath) {
      return xformPath(fullPath);
    }
    const nameMapping = new Mapping("name");
    nameMapping.xform = mappingsXformPath;
    mappings.push(nameMapping);
    function xformSize(_metadata, size) {
      if (size !== void 0) {
        return Number(size);
      } else {
        return size;
      }
    }
    const sizeMapping = new Mapping("size");
    sizeMapping.xform = xformSize;
    mappings.push(sizeMapping);
    mappings.push(new Mapping("timeCreated"));
    mappings.push(new Mapping("updated"));
    mappings.push(new Mapping("md5Hash", null, true));
    mappings.push(new Mapping("cacheControl", null, true));
    mappings.push(new Mapping("contentDisposition", null, true));
    mappings.push(new Mapping("contentEncoding", null, true));
    mappings.push(new Mapping("contentLanguage", null, true));
    mappings.push(new Mapping("contentType", null, true));
    mappings.push(new Mapping("metadata", "customMetadata", true));
    mappings_ = mappings;
    return mappings_;
  }
  function addRef(metadata, service) {
    function generateRef() {
      const bucket = metadata["bucket"];
      const path = metadata["fullPath"];
      const loc = new Location(bucket, path);
      return service._makeStorageReference(loc);
    }
    Object.defineProperty(metadata, "ref", { get: generateRef });
  }
  function fromResource(service, resource, mappings) {
    const metadata = {};
    metadata["type"] = "file";
    const len = mappings.length;
    for (let i = 0; i < len; i++) {
      const mapping = mappings[i];
      metadata[mapping.local] = mapping.xform(metadata, resource[mapping.server]);
    }
    addRef(metadata, service);
    return metadata;
  }
  function fromResourceString(service, resourceString, mappings) {
    const obj = jsonObjectOrNull(resourceString);
    if (obj === null) {
      return null;
    }
    const resource = obj;
    return fromResource(service, resource, mappings);
  }
  function downloadUrlFromResourceString(metadata, resourceString, host, protocol) {
    const obj = jsonObjectOrNull(resourceString);
    if (obj === null) {
      return null;
    }
    if (!isString(obj["downloadTokens"])) {
      return null;
    }
    const tokens = obj["downloadTokens"];
    if (tokens.length === 0) {
      return null;
    }
    const encode = encodeURIComponent;
    const tokensList = tokens.split(",");
    const urls = tokensList.map((token) => {
      const bucket = metadata["bucket"];
      const path = metadata["fullPath"];
      const urlPart = "/b/" + encode(bucket) + "/o/" + encode(path);
      const base = makeUrl(urlPart, host, protocol);
      const queryString = makeQueryString({
        alt: "media",
        token
      });
      return base + queryString;
    });
    return urls[0];
  }
  var RequestInfo = class {
    constructor(url, method, handler, timeout) {
      this.url = url;
      this.method = method;
      this.handler = handler;
      this.timeout = timeout;
      this.urlParams = {};
      this.headers = {};
      this.body = null;
      this.errorHandler = null;
      this.progressCallback = null;
      this.successCodes = [200];
      this.additionalRetryCodes = [];
    }
  };
  function handlerCheck(cndn) {
    if (!cndn) {
      throw unknown();
    }
  }
  function downloadUrlHandler(service, mappings) {
    function handler(xhr, text) {
      const metadata = fromResourceString(service, text, mappings);
      handlerCheck(metadata !== null);
      return downloadUrlFromResourceString(metadata, text, service.host, service._protocol);
    }
    return handler;
  }
  function sharedErrorHandler(location) {
    function errorHandler(xhr, err) {
      let newErr;
      if (xhr.getStatus() === 401) {
        if (
          // This exact message string is the only consistent part of the
          // server's error response that identifies it as an App Check error.
          xhr.getErrorText().includes("Firebase App Check token is invalid")
        ) {
          newErr = unauthorizedApp();
        } else {
          newErr = unauthenticated();
        }
      } else {
        if (xhr.getStatus() === 402) {
          newErr = quotaExceeded(location.bucket);
        } else {
          if (xhr.getStatus() === 403) {
            newErr = unauthorized(location.path);
          } else {
            newErr = err;
          }
        }
      }
      newErr.status = xhr.getStatus();
      newErr.serverResponse = err.serverResponse;
      return newErr;
    }
    return errorHandler;
  }
  function objectErrorHandler(location) {
    const shared = sharedErrorHandler(location);
    function errorHandler(xhr, err) {
      let newErr = shared(xhr, err);
      if (xhr.getStatus() === 404) {
        newErr = objectNotFound(location.path);
      }
      newErr.serverResponse = err.serverResponse;
      return newErr;
    }
    return errorHandler;
  }
  function getDownloadUrl(service, location, mappings) {
    const urlPart = location.fullServerUrl();
    const url = makeUrl(urlPart, service.host, service._protocol);
    const method = "GET";
    const timeout = service.maxOperationRetryTime;
    const requestInfo = new RequestInfo(url, method, downloadUrlHandler(service, mappings), timeout);
    requestInfo.errorHandler = objectErrorHandler(location);
    return requestInfo;
  }
  var RESUMABLE_UPLOAD_CHUNK_SIZE = 256 * 1024;
  var textFactoryOverride = null;
  var XhrConnection = class {
    constructor() {
      this.sent_ = false;
      this.xhr_ = new XMLHttpRequest();
      this.initXhr();
      this.errorCode_ = ErrorCode.NO_ERROR;
      this.sendPromise_ = new Promise((resolve) => {
        this.xhr_.addEventListener("abort", () => {
          this.errorCode_ = ErrorCode.ABORT;
          resolve();
        });
        this.xhr_.addEventListener("error", () => {
          this.errorCode_ = ErrorCode.NETWORK_ERROR;
          resolve();
        });
        this.xhr_.addEventListener("load", () => {
          resolve();
        });
      });
    }
    send(url, method, body, headers) {
      if (this.sent_) {
        throw internalError("cannot .send() more than once");
      }
      this.sent_ = true;
      this.xhr_.open(method, url, true);
      if (headers !== void 0) {
        for (const key in headers) {
          if (headers.hasOwnProperty(key)) {
            this.xhr_.setRequestHeader(key, headers[key].toString());
          }
        }
      }
      if (body !== void 0) {
        this.xhr_.send(body);
      } else {
        this.xhr_.send();
      }
      return this.sendPromise_;
    }
    getErrorCode() {
      if (!this.sent_) {
        throw internalError("cannot .getErrorCode() before sending");
      }
      return this.errorCode_;
    }
    getStatus() {
      if (!this.sent_) {
        throw internalError("cannot .getStatus() before sending");
      }
      try {
        return this.xhr_.status;
      } catch (e) {
        return -1;
      }
    }
    getResponse() {
      if (!this.sent_) {
        throw internalError("cannot .getResponse() before sending");
      }
      return this.xhr_.response;
    }
    getErrorText() {
      if (!this.sent_) {
        throw internalError("cannot .getErrorText() before sending");
      }
      return this.xhr_.statusText;
    }
    /** Aborts the request. */
    abort() {
      this.xhr_.abort();
    }
    getResponseHeader(header) {
      return this.xhr_.getResponseHeader(header);
    }
    addUploadProgressListener(listener) {
      if (this.xhr_.upload != null) {
        this.xhr_.upload.addEventListener("progress", listener);
      }
    }
    removeUploadProgressListener(listener) {
      if (this.xhr_.upload != null) {
        this.xhr_.upload.removeEventListener("progress", listener);
      }
    }
  };
  var XhrTextConnection = class extends XhrConnection {
    initXhr() {
      this.xhr_.responseType = "text";
    }
  };
  function newTextConnection() {
    return textFactoryOverride ? textFactoryOverride() : new XhrTextConnection();
  }
  var Reference = class _Reference {
    constructor(_service, location) {
      this._service = _service;
      if (location instanceof Location) {
        this._location = location;
      } else {
        this._location = Location.makeFromUrl(location, _service.host);
      }
    }
    /**
     * Returns the URL for the bucket and path this object references,
     *     in the form gs://<bucket>/<object-path>
     * @override
     */
    toString() {
      return "gs://" + this._location.bucket + "/" + this._location.path;
    }
    _newRef(service, location) {
      return new _Reference(service, location);
    }
    /**
     * A reference to the root of this object's bucket.
     */
    get root() {
      const location = new Location(this._location.bucket, "");
      return this._newRef(this._service, location);
    }
    /**
     * The name of the bucket containing this reference's object.
     */
    get bucket() {
      return this._location.bucket;
    }
    /**
     * The full path of this object.
     */
    get fullPath() {
      return this._location.path;
    }
    /**
     * The short name of this object, which is the last component of the full path.
     * For example, if fullPath is 'full/path/image.png', name is 'image.png'.
     */
    get name() {
      return lastComponent(this._location.path);
    }
    /**
     * The `StorageService` instance this `StorageReference` is associated with.
     */
    get storage() {
      return this._service;
    }
    /**
     * A `StorageReference` pointing to the parent location of this `StorageReference`, or null if
     * this reference is the root.
     */
    get parent() {
      const newPath = parent(this._location.path);
      if (newPath === null) {
        return null;
      }
      const location = new Location(this._location.bucket, newPath);
      return new _Reference(this._service, location);
    }
    /**
     * Utility function to throw an error in methods that do not accept a root reference.
     */
    _throwIfRoot(name4) {
      if (this._location.path === "") {
        throw invalidRootOperation(name4);
      }
    }
  };
  function getDownloadURL$1(ref2) {
    ref2._throwIfRoot("getDownloadURL");
    const requestInfo = getDownloadUrl(ref2.storage, ref2._location, getMappings());
    return ref2.storage.makeRequestWithTokens(requestInfo, newTextConnection).then((url) => {
      if (url === null) {
        throw noDownloadURL();
      }
      return url;
    });
  }
  function _getChild$1(ref2, childPath) {
    const newPath = child(ref2._location.path, childPath);
    const location = new Location(ref2._location.bucket, newPath);
    return new Reference(ref2.storage, location);
  }
  function isUrl(path) {
    return /^[A-Za-z]+:\/\//.test(path);
  }
  function refFromURL(service, url) {
    return new Reference(service, url);
  }
  function refFromPath(ref2, path) {
    if (ref2 instanceof FirebaseStorageImpl) {
      const service = ref2;
      if (service._bucket == null) {
        throw noDefaultBucket();
      }
      const reference = new Reference(service, service._bucket);
      if (path != null) {
        return refFromPath(reference, path);
      } else {
        return reference;
      }
    } else {
      if (path !== void 0) {
        return _getChild$1(ref2, path);
      } else {
        return ref2;
      }
    }
  }
  function ref$1(serviceOrRef, pathOrUrl) {
    if (pathOrUrl && isUrl(pathOrUrl)) {
      if (serviceOrRef instanceof FirebaseStorageImpl) {
        return refFromURL(serviceOrRef, pathOrUrl);
      } else {
        throw invalidArgument("To use ref(service, url), the first argument must be a Storage instance.");
      }
    } else {
      return refFromPath(serviceOrRef, pathOrUrl);
    }
  }
  function extractBucket(host, config2) {
    const bucketString = config2 === null || config2 === void 0 ? void 0 : config2[CONFIG_STORAGE_BUCKET_KEY];
    if (bucketString == null) {
      return null;
    }
    return Location.makeFromBucketSpec(bucketString, host);
  }
  function connectStorageEmulator$1(storage2, host, port, options = {}) {
    storage2.host = "".concat(host, ":").concat(port);
    storage2._protocol = "http";
    const { mockUserToken } = options;
    if (mockUserToken) {
      storage2._overrideAuthToken = typeof mockUserToken === "string" ? mockUserToken : createMockUserToken(mockUserToken, storage2.app.options.projectId);
    }
  }
  var FirebaseStorageImpl = class {
    constructor(app, _authProvider, _appCheckProvider, _url, _firebaseVersion) {
      this.app = app;
      this._authProvider = _authProvider;
      this._appCheckProvider = _appCheckProvider;
      this._url = _url;
      this._firebaseVersion = _firebaseVersion;
      this._bucket = null;
      this._host = DEFAULT_HOST;
      this._protocol = "https";
      this._appId = null;
      this._deleted = false;
      this._maxOperationRetryTime = DEFAULT_MAX_OPERATION_RETRY_TIME;
      this._maxUploadRetryTime = DEFAULT_MAX_UPLOAD_RETRY_TIME;
      this._requests = /* @__PURE__ */ new Set();
      if (_url != null) {
        this._bucket = Location.makeFromBucketSpec(_url, this._host);
      } else {
        this._bucket = extractBucket(this._host, this.app.options);
      }
    }
    /**
     * The host string for this service, in the form of `host` or
     * `host:port`.
     */
    get host() {
      return this._host;
    }
    set host(host) {
      this._host = host;
      if (this._url != null) {
        this._bucket = Location.makeFromBucketSpec(this._url, host);
      } else {
        this._bucket = extractBucket(host, this.app.options);
      }
    }
    /**
     * The maximum time to retry uploads in milliseconds.
     */
    get maxUploadRetryTime() {
      return this._maxUploadRetryTime;
    }
    set maxUploadRetryTime(time) {
      validateNumber(
        "time",
        /* minValue=*/
        0,
        /* maxValue= */
        Number.POSITIVE_INFINITY,
        time
      );
      this._maxUploadRetryTime = time;
    }
    /**
     * The maximum time to retry operations other than uploads or downloads in
     * milliseconds.
     */
    get maxOperationRetryTime() {
      return this._maxOperationRetryTime;
    }
    set maxOperationRetryTime(time) {
      validateNumber(
        "time",
        /* minValue=*/
        0,
        /* maxValue= */
        Number.POSITIVE_INFINITY,
        time
      );
      this._maxOperationRetryTime = time;
    }
    async _getAuthToken() {
      if (this._overrideAuthToken) {
        return this._overrideAuthToken;
      }
      const auth = this._authProvider.getImmediate({ optional: true });
      if (auth) {
        const tokenData = await auth.getToken();
        if (tokenData !== null) {
          return tokenData.accessToken;
        }
      }
      return null;
    }
    async _getAppCheckToken() {
      const appCheck = this._appCheckProvider.getImmediate({ optional: true });
      if (appCheck) {
        const result = await appCheck.getToken();
        return result.token;
      }
      return null;
    }
    /**
     * Stop running requests and prevent more from being created.
     */
    _delete() {
      if (!this._deleted) {
        this._deleted = true;
        this._requests.forEach((request) => request.cancel());
        this._requests.clear();
      }
      return Promise.resolve();
    }
    /**
     * Returns a new firebaseStorage.Reference object referencing this StorageService
     * at the given Location.
     */
    _makeStorageReference(loc) {
      return new Reference(this, loc);
    }
    /**
     * @param requestInfo - HTTP RequestInfo object
     * @param authToken - Firebase auth token
     */
    _makeRequest(requestInfo, requestFactory, authToken, appCheckToken, retry = true) {
      if (!this._deleted) {
        const request = makeRequest(requestInfo, this._appId, authToken, appCheckToken, requestFactory, this._firebaseVersion, retry);
        this._requests.add(request);
        request.getPromise().then(() => this._requests.delete(request), () => this._requests.delete(request));
        return request;
      } else {
        return new FailRequest(appDeleted());
      }
    }
    async makeRequestWithTokens(requestInfo, requestFactory) {
      const [authToken, appCheckToken] = await Promise.all([
        this._getAuthToken(),
        this._getAppCheckToken()
      ]);
      return this._makeRequest(requestInfo, requestFactory, authToken, appCheckToken).getPromise();
    }
  };
  var name3 = "@firebase/storage";
  var version3 = "0.12.5";
  var STORAGE_TYPE = "storage";
  function getDownloadURL(ref2) {
    ref2 = getModularInstance(ref2);
    return getDownloadURL$1(ref2);
  }
  function ref(serviceOrRef, pathOrUrl) {
    serviceOrRef = getModularInstance(serviceOrRef);
    return ref$1(serviceOrRef, pathOrUrl);
  }
  function getStorage(app = getApp(), bucketUrl) {
    app = getModularInstance(app);
    const storageProvider = _getProvider(app, STORAGE_TYPE);
    const storageInstance = storageProvider.getImmediate({
      identifier: bucketUrl
    });
    const emulator = getDefaultEmulatorHostnameAndPort("storage");
    if (emulator) {
      connectStorageEmulator(storageInstance, ...emulator);
    }
    return storageInstance;
  }
  function connectStorageEmulator(storage2, host, port, options = {}) {
    connectStorageEmulator$1(storage2, host, port, options);
  }
  function factory(container, { instanceIdentifier: url }) {
    const app = container.getProvider("app").getImmediate();
    const authProvider = container.getProvider("auth-internal");
    const appCheckProvider = container.getProvider("app-check-internal");
    return new FirebaseStorageImpl(app, authProvider, appCheckProvider, url, SDK_VERSION);
  }
  function registerStorage() {
    _registerComponent(new Component(
      STORAGE_TYPE,
      factory,
      "PUBLIC"
      /* ComponentType.PUBLIC */
    ).setMultipleInstances(true));
    registerVersion(name3, version3, "");
    registerVersion(name3, version3, "esm2017");
  }
  registerStorage();

  // node_modules/fuse.js/dist/fuse.mjs
  function isArray(value) {
    return !Array.isArray ? getTag(value) === "[object Array]" : Array.isArray(value);
  }
  var INFINITY = 1 / 0;
  function baseToString(value) {
    if (typeof value == "string") {
      return value;
    }
    let result = value + "";
    return result == "0" && 1 / value == -INFINITY ? "-0" : result;
  }
  function toString(value) {
    return value == null ? "" : baseToString(value);
  }
  function isString2(value) {
    return typeof value === "string";
  }
  function isNumber(value) {
    return typeof value === "number";
  }
  function isBoolean(value) {
    return value === true || value === false || isObjectLike(value) && getTag(value) == "[object Boolean]";
  }
  function isObject2(value) {
    return typeof value === "object";
  }
  function isObjectLike(value) {
    return isObject2(value) && value !== null;
  }
  function isDefined(value) {
    return value !== void 0 && value !== null;
  }
  function isBlank(value) {
    return !value.trim().length;
  }
  function getTag(value) {
    return value == null ? value === void 0 ? "[object Undefined]" : "[object Null]" : Object.prototype.toString.call(value);
  }
  var INCORRECT_INDEX_TYPE = "Incorrect 'index' type";
  var LOGICAL_SEARCH_INVALID_QUERY_FOR_KEY = (key) => "Invalid value for key ".concat(key);
  var PATTERN_LENGTH_TOO_LARGE = (max) => "Pattern length exceeds max of ".concat(max, ".");
  var MISSING_KEY_PROPERTY = (name4) => "Missing ".concat(name4, " property in key");
  var INVALID_KEY_WEIGHT_VALUE = (key) => "Property 'weight' in key '".concat(key, "' must be a positive integer");
  var hasOwn = Object.prototype.hasOwnProperty;
  var KeyStore = class {
    constructor(keys) {
      this._keys = [];
      this._keyMap = {};
      let totalWeight = 0;
      keys.forEach((key) => {
        let obj = createKey(key);
        this._keys.push(obj);
        this._keyMap[obj.id] = obj;
        totalWeight += obj.weight;
      });
      this._keys.forEach((key) => {
        key.weight /= totalWeight;
      });
    }
    get(keyId) {
      return this._keyMap[keyId];
    }
    keys() {
      return this._keys;
    }
    toJSON() {
      return JSON.stringify(this._keys);
    }
  };
  function createKey(key) {
    let path = null;
    let id = null;
    let src = null;
    let weight = 1;
    let getFn = null;
    if (isString2(key) || isArray(key)) {
      src = key;
      path = createKeyPath(key);
      id = createKeyId(key);
    } else {
      if (!hasOwn.call(key, "name")) {
        throw new Error(MISSING_KEY_PROPERTY("name"));
      }
      const name4 = key.name;
      src = name4;
      if (hasOwn.call(key, "weight")) {
        weight = key.weight;
        if (weight <= 0) {
          throw new Error(INVALID_KEY_WEIGHT_VALUE(name4));
        }
      }
      path = createKeyPath(name4);
      id = createKeyId(name4);
      getFn = key.getFn;
    }
    return { path, id, weight, src, getFn };
  }
  function createKeyPath(key) {
    return isArray(key) ? key : key.split(".");
  }
  function createKeyId(key) {
    return isArray(key) ? key.join(".") : key;
  }
  function get(obj, path) {
    let list = [];
    let arr = false;
    const deepGet = (obj2, path2, index) => {
      if (!isDefined(obj2)) {
        return;
      }
      if (!path2[index]) {
        list.push(obj2);
      } else {
        let key = path2[index];
        const value = obj2[key];
        if (!isDefined(value)) {
          return;
        }
        if (index === path2.length - 1 && (isString2(value) || isNumber(value) || isBoolean(value))) {
          list.push(toString(value));
        } else if (isArray(value)) {
          arr = true;
          for (let i = 0, len = value.length; i < len; i += 1) {
            deepGet(value[i], path2, index + 1);
          }
        } else if (path2.length) {
          deepGet(value, path2, index + 1);
        }
      }
    };
    deepGet(obj, isString2(path) ? path.split(".") : path, 0);
    return arr ? list : list[0];
  }
  var MatchOptions = {
    // Whether the matches should be included in the result set. When `true`, each record in the result
    // set will include the indices of the matched characters.
    // These can consequently be used for highlighting purposes.
    includeMatches: false,
    // When `true`, the matching function will continue to the end of a search pattern even if
    // a perfect match has already been located in the string.
    findAllMatches: false,
    // Minimum number of characters that must be matched before a result is considered a match
    minMatchCharLength: 1
  };
  var BasicOptions = {
    // When `true`, the algorithm continues searching to the end of the input even if a perfect
    // match is found before the end of the same input.
    isCaseSensitive: false,
    // When true, the matching function will continue to the end of a search pattern even if
    includeScore: false,
    // List of properties that will be searched. This also supports nested properties.
    keys: [],
    // Whether to sort the result list, by score
    shouldSort: true,
    // Default sort function: sort by ascending score, ascending index
    sortFn: (a, b) => a.score === b.score ? a.idx < b.idx ? -1 : 1 : a.score < b.score ? -1 : 1
  };
  var FuzzyOptions = {
    // Approximately where in the text is the pattern expected to be found?
    location: 0,
    // At what point does the match algorithm give up. A threshold of '0.0' requires a perfect match
    // (of both letters and location), a threshold of '1.0' would match anything.
    threshold: 0.6,
    // Determines how close the match must be to the fuzzy location (specified above).
    // An exact letter match which is 'distance' characters away from the fuzzy location
    // would score as a complete mismatch. A distance of '0' requires the match be at
    // the exact location specified, a threshold of '1000' would require a perfect match
    // to be within 800 characters of the fuzzy location to be found using a 0.8 threshold.
    distance: 100
  };
  var AdvancedOptions = {
    // When `true`, it enables the use of unix-like search commands
    useExtendedSearch: false,
    // The get function to use when fetching an object's properties.
    // The default will search nested paths *ie foo.bar.baz*
    getFn: get,
    // When `true`, search will ignore `location` and `distance`, so it won't matter
    // where in the string the pattern appears.
    // More info: https://fusejs.io/concepts/scoring-theory.html#fuzziness-score
    ignoreLocation: false,
    // When `true`, the calculation for the relevance score (used for sorting) will
    // ignore the field-length norm.
    // More info: https://fusejs.io/concepts/scoring-theory.html#field-length-norm
    ignoreFieldNorm: false,
    // The weight to determine how much field length norm effects scoring.
    fieldNormWeight: 1
  };
  var Config = __spreadValues(__spreadValues(__spreadValues(__spreadValues({}, BasicOptions), MatchOptions), FuzzyOptions), AdvancedOptions);
  var SPACE = /[^ ]+/g;
  function norm(weight = 1, mantissa = 3) {
    const cache = /* @__PURE__ */ new Map();
    const m = Math.pow(10, mantissa);
    return {
      get(value) {
        const numTokens = value.match(SPACE).length;
        if (cache.has(numTokens)) {
          return cache.get(numTokens);
        }
        const norm2 = 1 / Math.pow(numTokens, 0.5 * weight);
        const n = parseFloat(Math.round(norm2 * m) / m);
        cache.set(numTokens, n);
        return n;
      },
      clear() {
        cache.clear();
      }
    };
  }
  var FuseIndex = class {
    constructor({
      getFn = Config.getFn,
      fieldNormWeight = Config.fieldNormWeight
    } = {}) {
      this.norm = norm(fieldNormWeight, 3);
      this.getFn = getFn;
      this.isCreated = false;
      this.setIndexRecords();
    }
    setSources(docs = []) {
      this.docs = docs;
    }
    setIndexRecords(records = []) {
      this.records = records;
    }
    setKeys(keys = []) {
      this.keys = keys;
      this._keysMap = {};
      keys.forEach((key, idx) => {
        this._keysMap[key.id] = idx;
      });
    }
    create() {
      if (this.isCreated || !this.docs.length) {
        return;
      }
      this.isCreated = true;
      if (isString2(this.docs[0])) {
        this.docs.forEach((doc, docIndex) => {
          this._addString(doc, docIndex);
        });
      } else {
        this.docs.forEach((doc, docIndex) => {
          this._addObject(doc, docIndex);
        });
      }
      this.norm.clear();
    }
    // Adds a doc to the end of the index
    add(doc) {
      const idx = this.size();
      if (isString2(doc)) {
        this._addString(doc, idx);
      } else {
        this._addObject(doc, idx);
      }
    }
    // Removes the doc at the specified index of the index
    removeAt(idx) {
      this.records.splice(idx, 1);
      for (let i = idx, len = this.size(); i < len; i += 1) {
        this.records[i].i -= 1;
      }
    }
    getValueForItemAtKeyId(item, keyId) {
      return item[this._keysMap[keyId]];
    }
    size() {
      return this.records.length;
    }
    _addString(doc, docIndex) {
      if (!isDefined(doc) || isBlank(doc)) {
        return;
      }
      let record = {
        v: doc,
        i: docIndex,
        n: this.norm.get(doc)
      };
      this.records.push(record);
    }
    _addObject(doc, docIndex) {
      let record = { i: docIndex, $: {} };
      this.keys.forEach((key, keyIndex) => {
        let value = key.getFn ? key.getFn(doc) : this.getFn(doc, key.path);
        if (!isDefined(value)) {
          return;
        }
        if (isArray(value)) {
          let subRecords = [];
          const stack = [{ nestedArrIndex: -1, value }];
          while (stack.length) {
            const { nestedArrIndex, value: value2 } = stack.pop();
            if (!isDefined(value2)) {
              continue;
            }
            if (isString2(value2) && !isBlank(value2)) {
              let subRecord = {
                v: value2,
                i: nestedArrIndex,
                n: this.norm.get(value2)
              };
              subRecords.push(subRecord);
            } else if (isArray(value2)) {
              value2.forEach((item, k) => {
                stack.push({
                  nestedArrIndex: k,
                  value: item
                });
              });
            } else
              ;
          }
          record.$[keyIndex] = subRecords;
        } else if (isString2(value) && !isBlank(value)) {
          let subRecord = {
            v: value,
            n: this.norm.get(value)
          };
          record.$[keyIndex] = subRecord;
        }
      });
      this.records.push(record);
    }
    toJSON() {
      return {
        keys: this.keys,
        records: this.records
      };
    }
  };
  function createIndex(keys, docs, { getFn = Config.getFn, fieldNormWeight = Config.fieldNormWeight } = {}) {
    const myIndex = new FuseIndex({ getFn, fieldNormWeight });
    myIndex.setKeys(keys.map(createKey));
    myIndex.setSources(docs);
    myIndex.create();
    return myIndex;
  }
  function parseIndex(data, { getFn = Config.getFn, fieldNormWeight = Config.fieldNormWeight } = {}) {
    const { keys, records } = data;
    const myIndex = new FuseIndex({ getFn, fieldNormWeight });
    myIndex.setKeys(keys);
    myIndex.setIndexRecords(records);
    return myIndex;
  }
  function computeScore$1(pattern, {
    errors = 0,
    currentLocation = 0,
    expectedLocation = 0,
    distance = Config.distance,
    ignoreLocation = Config.ignoreLocation
  } = {}) {
    const accuracy = errors / pattern.length;
    if (ignoreLocation) {
      return accuracy;
    }
    const proximity = Math.abs(expectedLocation - currentLocation);
    if (!distance) {
      return proximity ? 1 : accuracy;
    }
    return accuracy + proximity / distance;
  }
  function convertMaskToIndices(matchmask = [], minMatchCharLength = Config.minMatchCharLength) {
    let indices = [];
    let start2 = -1;
    let end = -1;
    let i = 0;
    for (let len = matchmask.length; i < len; i += 1) {
      let match = matchmask[i];
      if (match && start2 === -1) {
        start2 = i;
      } else if (!match && start2 !== -1) {
        end = i - 1;
        if (end - start2 + 1 >= minMatchCharLength) {
          indices.push([start2, end]);
        }
        start2 = -1;
      }
    }
    if (matchmask[i - 1] && i - start2 >= minMatchCharLength) {
      indices.push([start2, i - 1]);
    }
    return indices;
  }
  var MAX_BITS = 32;
  function search(text, pattern, patternAlphabet, {
    location = Config.location,
    distance = Config.distance,
    threshold = Config.threshold,
    findAllMatches = Config.findAllMatches,
    minMatchCharLength = Config.minMatchCharLength,
    includeMatches = Config.includeMatches,
    ignoreLocation = Config.ignoreLocation
  } = {}) {
    if (pattern.length > MAX_BITS) {
      throw new Error(PATTERN_LENGTH_TOO_LARGE(MAX_BITS));
    }
    const patternLen = pattern.length;
    const textLen = text.length;
    const expectedLocation = Math.max(0, Math.min(location, textLen));
    let currentThreshold = threshold;
    let bestLocation = expectedLocation;
    const computeMatches = minMatchCharLength > 1 || includeMatches;
    const matchMask = computeMatches ? Array(textLen) : [];
    let index;
    while ((index = text.indexOf(pattern, bestLocation)) > -1) {
      let score = computeScore$1(pattern, {
        currentLocation: index,
        expectedLocation,
        distance,
        ignoreLocation
      });
      currentThreshold = Math.min(score, currentThreshold);
      bestLocation = index + patternLen;
      if (computeMatches) {
        let i = 0;
        while (i < patternLen) {
          matchMask[index + i] = 1;
          i += 1;
        }
      }
    }
    bestLocation = -1;
    let lastBitArr = [];
    let finalScore = 1;
    let binMax = patternLen + textLen;
    const mask = 1 << patternLen - 1;
    for (let i = 0; i < patternLen; i += 1) {
      let binMin = 0;
      let binMid = binMax;
      while (binMin < binMid) {
        const score2 = computeScore$1(pattern, {
          errors: i,
          currentLocation: expectedLocation + binMid,
          expectedLocation,
          distance,
          ignoreLocation
        });
        if (score2 <= currentThreshold) {
          binMin = binMid;
        } else {
          binMax = binMid;
        }
        binMid = Math.floor((binMax - binMin) / 2 + binMin);
      }
      binMax = binMid;
      let start2 = Math.max(1, expectedLocation - binMid + 1);
      let finish = findAllMatches ? textLen : Math.min(expectedLocation + binMid, textLen) + patternLen;
      let bitArr = Array(finish + 2);
      bitArr[finish + 1] = (1 << i) - 1;
      for (let j = finish; j >= start2; j -= 1) {
        let currentLocation = j - 1;
        let charMatch = patternAlphabet[text.charAt(currentLocation)];
        if (computeMatches) {
          matchMask[currentLocation] = +!!charMatch;
        }
        bitArr[j] = (bitArr[j + 1] << 1 | 1) & charMatch;
        if (i) {
          bitArr[j] |= (lastBitArr[j + 1] | lastBitArr[j]) << 1 | 1 | lastBitArr[j + 1];
        }
        if (bitArr[j] & mask) {
          finalScore = computeScore$1(pattern, {
            errors: i,
            currentLocation,
            expectedLocation,
            distance,
            ignoreLocation
          });
          if (finalScore <= currentThreshold) {
            currentThreshold = finalScore;
            bestLocation = currentLocation;
            if (bestLocation <= expectedLocation) {
              break;
            }
            start2 = Math.max(1, 2 * expectedLocation - bestLocation);
          }
        }
      }
      const score = computeScore$1(pattern, {
        errors: i + 1,
        currentLocation: expectedLocation,
        expectedLocation,
        distance,
        ignoreLocation
      });
      if (score > currentThreshold) {
        break;
      }
      lastBitArr = bitArr;
    }
    const result = {
      isMatch: bestLocation >= 0,
      // Count exact matches (those with a score of 0) to be "almost" exact
      score: Math.max(1e-3, finalScore)
    };
    if (computeMatches) {
      const indices = convertMaskToIndices(matchMask, minMatchCharLength);
      if (!indices.length) {
        result.isMatch = false;
      } else if (includeMatches) {
        result.indices = indices;
      }
    }
    return result;
  }
  function createPatternAlphabet(pattern) {
    let mask = {};
    for (let i = 0, len = pattern.length; i < len; i += 1) {
      const char = pattern.charAt(i);
      mask[char] = (mask[char] || 0) | 1 << len - i - 1;
    }
    return mask;
  }
  var BitapSearch = class {
    constructor(pattern, {
      location = Config.location,
      threshold = Config.threshold,
      distance = Config.distance,
      includeMatches = Config.includeMatches,
      findAllMatches = Config.findAllMatches,
      minMatchCharLength = Config.minMatchCharLength,
      isCaseSensitive = Config.isCaseSensitive,
      ignoreLocation = Config.ignoreLocation
    } = {}) {
      this.options = {
        location,
        threshold,
        distance,
        includeMatches,
        findAllMatches,
        minMatchCharLength,
        isCaseSensitive,
        ignoreLocation
      };
      this.pattern = isCaseSensitive ? pattern : pattern.toLowerCase();
      this.chunks = [];
      if (!this.pattern.length) {
        return;
      }
      const addChunk = (pattern2, startIndex) => {
        this.chunks.push({
          pattern: pattern2,
          alphabet: createPatternAlphabet(pattern2),
          startIndex
        });
      };
      const len = this.pattern.length;
      if (len > MAX_BITS) {
        let i = 0;
        const remainder = len % MAX_BITS;
        const end = len - remainder;
        while (i < end) {
          addChunk(this.pattern.substr(i, MAX_BITS), i);
          i += MAX_BITS;
        }
        if (remainder) {
          const startIndex = len - MAX_BITS;
          addChunk(this.pattern.substr(startIndex), startIndex);
        }
      } else {
        addChunk(this.pattern, 0);
      }
    }
    searchIn(text) {
      const { isCaseSensitive, includeMatches } = this.options;
      if (!isCaseSensitive) {
        text = text.toLowerCase();
      }
      if (this.pattern === text) {
        let result2 = {
          isMatch: true,
          score: 0
        };
        if (includeMatches) {
          result2.indices = [[0, text.length - 1]];
        }
        return result2;
      }
      const {
        location,
        distance,
        threshold,
        findAllMatches,
        minMatchCharLength,
        ignoreLocation
      } = this.options;
      let allIndices = [];
      let totalScore = 0;
      let hasMatches = false;
      this.chunks.forEach(({ pattern, alphabet, startIndex }) => {
        const { isMatch, score, indices } = search(text, pattern, alphabet, {
          location: location + startIndex,
          distance,
          threshold,
          findAllMatches,
          minMatchCharLength,
          includeMatches,
          ignoreLocation
        });
        if (isMatch) {
          hasMatches = true;
        }
        totalScore += score;
        if (isMatch && indices) {
          allIndices = [...allIndices, ...indices];
        }
      });
      let result = {
        isMatch: hasMatches,
        score: hasMatches ? totalScore / this.chunks.length : 1
      };
      if (hasMatches && includeMatches) {
        result.indices = allIndices;
      }
      return result;
    }
  };
  var BaseMatch = class {
    constructor(pattern) {
      this.pattern = pattern;
    }
    static isMultiMatch(pattern) {
      return getMatch(pattern, this.multiRegex);
    }
    static isSingleMatch(pattern) {
      return getMatch(pattern, this.singleRegex);
    }
    search() {
    }
  };
  function getMatch(pattern, exp) {
    const matches = pattern.match(exp);
    return matches ? matches[1] : null;
  }
  var ExactMatch = class extends BaseMatch {
    constructor(pattern) {
      super(pattern);
    }
    static get type() {
      return "exact";
    }
    static get multiRegex() {
      return /^="(.*)"$/;
    }
    static get singleRegex() {
      return /^=(.*)$/;
    }
    search(text) {
      const isMatch = text === this.pattern;
      return {
        isMatch,
        score: isMatch ? 0 : 1,
        indices: [0, this.pattern.length - 1]
      };
    }
  };
  var InverseExactMatch = class extends BaseMatch {
    constructor(pattern) {
      super(pattern);
    }
    static get type() {
      return "inverse-exact";
    }
    static get multiRegex() {
      return /^!"(.*)"$/;
    }
    static get singleRegex() {
      return /^!(.*)$/;
    }
    search(text) {
      const index = text.indexOf(this.pattern);
      const isMatch = index === -1;
      return {
        isMatch,
        score: isMatch ? 0 : 1,
        indices: [0, text.length - 1]
      };
    }
  };
  var PrefixExactMatch = class extends BaseMatch {
    constructor(pattern) {
      super(pattern);
    }
    static get type() {
      return "prefix-exact";
    }
    static get multiRegex() {
      return /^\^"(.*)"$/;
    }
    static get singleRegex() {
      return /^\^(.*)$/;
    }
    search(text) {
      const isMatch = text.startsWith(this.pattern);
      return {
        isMatch,
        score: isMatch ? 0 : 1,
        indices: [0, this.pattern.length - 1]
      };
    }
  };
  var InversePrefixExactMatch = class extends BaseMatch {
    constructor(pattern) {
      super(pattern);
    }
    static get type() {
      return "inverse-prefix-exact";
    }
    static get multiRegex() {
      return /^!\^"(.*)"$/;
    }
    static get singleRegex() {
      return /^!\^(.*)$/;
    }
    search(text) {
      const isMatch = !text.startsWith(this.pattern);
      return {
        isMatch,
        score: isMatch ? 0 : 1,
        indices: [0, text.length - 1]
      };
    }
  };
  var SuffixExactMatch = class extends BaseMatch {
    constructor(pattern) {
      super(pattern);
    }
    static get type() {
      return "suffix-exact";
    }
    static get multiRegex() {
      return /^"(.*)"\$$/;
    }
    static get singleRegex() {
      return /^(.*)\$$/;
    }
    search(text) {
      const isMatch = text.endsWith(this.pattern);
      return {
        isMatch,
        score: isMatch ? 0 : 1,
        indices: [text.length - this.pattern.length, text.length - 1]
      };
    }
  };
  var InverseSuffixExactMatch = class extends BaseMatch {
    constructor(pattern) {
      super(pattern);
    }
    static get type() {
      return "inverse-suffix-exact";
    }
    static get multiRegex() {
      return /^!"(.*)"\$$/;
    }
    static get singleRegex() {
      return /^!(.*)\$$/;
    }
    search(text) {
      const isMatch = !text.endsWith(this.pattern);
      return {
        isMatch,
        score: isMatch ? 0 : 1,
        indices: [0, text.length - 1]
      };
    }
  };
  var FuzzyMatch = class extends BaseMatch {
    constructor(pattern, {
      location = Config.location,
      threshold = Config.threshold,
      distance = Config.distance,
      includeMatches = Config.includeMatches,
      findAllMatches = Config.findAllMatches,
      minMatchCharLength = Config.minMatchCharLength,
      isCaseSensitive = Config.isCaseSensitive,
      ignoreLocation = Config.ignoreLocation
    } = {}) {
      super(pattern);
      this._bitapSearch = new BitapSearch(pattern, {
        location,
        threshold,
        distance,
        includeMatches,
        findAllMatches,
        minMatchCharLength,
        isCaseSensitive,
        ignoreLocation
      });
    }
    static get type() {
      return "fuzzy";
    }
    static get multiRegex() {
      return /^"(.*)"$/;
    }
    static get singleRegex() {
      return /^(.*)$/;
    }
    search(text) {
      return this._bitapSearch.searchIn(text);
    }
  };
  var IncludeMatch = class extends BaseMatch {
    constructor(pattern) {
      super(pattern);
    }
    static get type() {
      return "include";
    }
    static get multiRegex() {
      return /^'"(.*)"$/;
    }
    static get singleRegex() {
      return /^'(.*)$/;
    }
    search(text) {
      let location = 0;
      let index;
      const indices = [];
      const patternLen = this.pattern.length;
      while ((index = text.indexOf(this.pattern, location)) > -1) {
        location = index + patternLen;
        indices.push([index, location - 1]);
      }
      const isMatch = !!indices.length;
      return {
        isMatch,
        score: isMatch ? 0 : 1,
        indices
      };
    }
  };
  var searchers = [
    ExactMatch,
    IncludeMatch,
    PrefixExactMatch,
    InversePrefixExactMatch,
    InverseSuffixExactMatch,
    SuffixExactMatch,
    InverseExactMatch,
    FuzzyMatch
  ];
  var searchersLen = searchers.length;
  var SPACE_RE = / +(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/;
  var OR_TOKEN = "|";
  function parseQuery(pattern, options = {}) {
    return pattern.split(OR_TOKEN).map((item) => {
      let query = item.trim().split(SPACE_RE).filter((item2) => item2 && !!item2.trim());
      let results = [];
      for (let i = 0, len = query.length; i < len; i += 1) {
        const queryItem = query[i];
        let found = false;
        let idx = -1;
        while (!found && ++idx < searchersLen) {
          const searcher = searchers[idx];
          let token = searcher.isMultiMatch(queryItem);
          if (token) {
            results.push(new searcher(token, options));
            found = true;
          }
        }
        if (found) {
          continue;
        }
        idx = -1;
        while (++idx < searchersLen) {
          const searcher = searchers[idx];
          let token = searcher.isSingleMatch(queryItem);
          if (token) {
            results.push(new searcher(token, options));
            break;
          }
        }
      }
      return results;
    });
  }
  var MultiMatchSet = /* @__PURE__ */ new Set([FuzzyMatch.type, IncludeMatch.type]);
  var ExtendedSearch = class {
    constructor(pattern, {
      isCaseSensitive = Config.isCaseSensitive,
      includeMatches = Config.includeMatches,
      minMatchCharLength = Config.minMatchCharLength,
      ignoreLocation = Config.ignoreLocation,
      findAllMatches = Config.findAllMatches,
      location = Config.location,
      threshold = Config.threshold,
      distance = Config.distance
    } = {}) {
      this.query = null;
      this.options = {
        isCaseSensitive,
        includeMatches,
        minMatchCharLength,
        findAllMatches,
        ignoreLocation,
        location,
        threshold,
        distance
      };
      this.pattern = isCaseSensitive ? pattern : pattern.toLowerCase();
      this.query = parseQuery(this.pattern, this.options);
    }
    static condition(_, options) {
      return options.useExtendedSearch;
    }
    searchIn(text) {
      const query = this.query;
      if (!query) {
        return {
          isMatch: false,
          score: 1
        };
      }
      const { includeMatches, isCaseSensitive } = this.options;
      text = isCaseSensitive ? text : text.toLowerCase();
      let numMatches = 0;
      let allIndices = [];
      let totalScore = 0;
      for (let i = 0, qLen = query.length; i < qLen; i += 1) {
        const searchers2 = query[i];
        allIndices.length = 0;
        numMatches = 0;
        for (let j = 0, pLen = searchers2.length; j < pLen; j += 1) {
          const searcher = searchers2[j];
          const { isMatch, indices, score } = searcher.search(text);
          if (isMatch) {
            numMatches += 1;
            totalScore += score;
            if (includeMatches) {
              const type = searcher.constructor.type;
              if (MultiMatchSet.has(type)) {
                allIndices = [...allIndices, ...indices];
              } else {
                allIndices.push(indices);
              }
            }
          } else {
            totalScore = 0;
            numMatches = 0;
            allIndices.length = 0;
            break;
          }
        }
        if (numMatches) {
          let result = {
            isMatch: true,
            score: totalScore / numMatches
          };
          if (includeMatches) {
            result.indices = allIndices;
          }
          return result;
        }
      }
      return {
        isMatch: false,
        score: 1
      };
    }
  };
  var registeredSearchers = [];
  function register(...args) {
    registeredSearchers.push(...args);
  }
  function createSearcher(pattern, options) {
    for (let i = 0, len = registeredSearchers.length; i < len; i += 1) {
      let searcherClass = registeredSearchers[i];
      if (searcherClass.condition(pattern, options)) {
        return new searcherClass(pattern, options);
      }
    }
    return new BitapSearch(pattern, options);
  }
  var LogicalOperator = {
    AND: "$and",
    OR: "$or"
  };
  var KeyType = {
    PATH: "$path",
    PATTERN: "$val"
  };
  var isExpression = (query) => !!(query[LogicalOperator.AND] || query[LogicalOperator.OR]);
  var isPath = (query) => !!query[KeyType.PATH];
  var isLeaf = (query) => !isArray(query) && isObject2(query) && !isExpression(query);
  var convertToExplicit = (query) => ({
    [LogicalOperator.AND]: Object.keys(query).map((key) => ({
      [key]: query[key]
    }))
  });
  function parse(query, options, { auto = true } = {}) {
    const next = (query2) => {
      let keys = Object.keys(query2);
      const isQueryPath = isPath(query2);
      if (!isQueryPath && keys.length > 1 && !isExpression(query2)) {
        return next(convertToExplicit(query2));
      }
      if (isLeaf(query2)) {
        const key = isQueryPath ? query2[KeyType.PATH] : keys[0];
        const pattern = isQueryPath ? query2[KeyType.PATTERN] : query2[key];
        if (!isString2(pattern)) {
          throw new Error(LOGICAL_SEARCH_INVALID_QUERY_FOR_KEY(key));
        }
        const obj = {
          keyId: createKeyId(key),
          pattern
        };
        if (auto) {
          obj.searcher = createSearcher(pattern, options);
        }
        return obj;
      }
      let node = {
        children: [],
        operator: keys[0]
      };
      keys.forEach((key) => {
        const value = query2[key];
        if (isArray(value)) {
          value.forEach((item) => {
            node.children.push(next(item));
          });
        }
      });
      return node;
    };
    if (!isExpression(query)) {
      query = convertToExplicit(query);
    }
    return next(query);
  }
  function computeScore(results, { ignoreFieldNorm = Config.ignoreFieldNorm }) {
    results.forEach((result) => {
      let totalScore = 1;
      result.matches.forEach(({ key, norm: norm2, score }) => {
        const weight = key ? key.weight : null;
        totalScore *= Math.pow(
          score === 0 && weight ? Number.EPSILON : score,
          (weight || 1) * (ignoreFieldNorm ? 1 : norm2)
        );
      });
      result.score = totalScore;
    });
  }
  function transformMatches(result, data) {
    const matches = result.matches;
    data.matches = [];
    if (!isDefined(matches)) {
      return;
    }
    matches.forEach((match) => {
      if (!isDefined(match.indices) || !match.indices.length) {
        return;
      }
      const { indices, value } = match;
      let obj = {
        indices,
        value
      };
      if (match.key) {
        obj.key = match.key.src;
      }
      if (match.idx > -1) {
        obj.refIndex = match.idx;
      }
      data.matches.push(obj);
    });
  }
  function transformScore(result, data) {
    data.score = result.score;
  }
  function format(results, docs, {
    includeMatches = Config.includeMatches,
    includeScore = Config.includeScore
  } = {}) {
    const transformers = [];
    if (includeMatches)
      transformers.push(transformMatches);
    if (includeScore)
      transformers.push(transformScore);
    return results.map((result) => {
      const { idx } = result;
      const data = {
        item: docs[idx],
        refIndex: idx
      };
      if (transformers.length) {
        transformers.forEach((transformer) => {
          transformer(result, data);
        });
      }
      return data;
    });
  }
  var Fuse = class {
    constructor(docs, options = {}, index) {
      this.options = __spreadValues(__spreadValues({}, Config), options);
      if (this.options.useExtendedSearch && false) {
        throw new Error(EXTENDED_SEARCH_UNAVAILABLE);
      }
      this._keyStore = new KeyStore(this.options.keys);
      this.setCollection(docs, index);
    }
    setCollection(docs, index) {
      this._docs = docs;
      if (index && !(index instanceof FuseIndex)) {
        throw new Error(INCORRECT_INDEX_TYPE);
      }
      this._myIndex = index || createIndex(this.options.keys, this._docs, {
        getFn: this.options.getFn,
        fieldNormWeight: this.options.fieldNormWeight
      });
    }
    add(doc) {
      if (!isDefined(doc)) {
        return;
      }
      this._docs.push(doc);
      this._myIndex.add(doc);
    }
    remove(predicate = () => false) {
      const results = [];
      for (let i = 0, len = this._docs.length; i < len; i += 1) {
        const doc = this._docs[i];
        if (predicate(doc, i)) {
          this.removeAt(i);
          i -= 1;
          len -= 1;
          results.push(doc);
        }
      }
      return results;
    }
    removeAt(idx) {
      this._docs.splice(idx, 1);
      this._myIndex.removeAt(idx);
    }
    getIndex() {
      return this._myIndex;
    }
    search(query, { limit = -1 } = {}) {
      const {
        includeMatches,
        includeScore,
        shouldSort,
        sortFn,
        ignoreFieldNorm
      } = this.options;
      let results = isString2(query) ? isString2(this._docs[0]) ? this._searchStringList(query) : this._searchObjectList(query) : this._searchLogical(query);
      computeScore(results, { ignoreFieldNorm });
      if (shouldSort) {
        results.sort(sortFn);
      }
      if (isNumber(limit) && limit > -1) {
        results = results.slice(0, limit);
      }
      return format(results, this._docs, {
        includeMatches,
        includeScore
      });
    }
    _searchStringList(query) {
      const searcher = createSearcher(query, this.options);
      const { records } = this._myIndex;
      const results = [];
      records.forEach(({ v: text, i: idx, n: norm2 }) => {
        if (!isDefined(text)) {
          return;
        }
        const { isMatch, score, indices } = searcher.searchIn(text);
        if (isMatch) {
          results.push({
            item: text,
            idx,
            matches: [{ score, value: text, norm: norm2, indices }]
          });
        }
      });
      return results;
    }
    _searchLogical(query) {
      const expression = parse(query, this.options);
      const evaluate = (node, item, idx) => {
        if (!node.children) {
          const { keyId, searcher } = node;
          const matches = this._findMatches({
            key: this._keyStore.get(keyId),
            value: this._myIndex.getValueForItemAtKeyId(item, keyId),
            searcher
          });
          if (matches && matches.length) {
            return [
              {
                idx,
                item,
                matches
              }
            ];
          }
          return [];
        }
        const res = [];
        for (let i = 0, len = node.children.length; i < len; i += 1) {
          const child2 = node.children[i];
          const result = evaluate(child2, item, idx);
          if (result.length) {
            res.push(...result);
          } else if (node.operator === LogicalOperator.AND) {
            return [];
          }
        }
        return res;
      };
      const records = this._myIndex.records;
      const resultMap = {};
      const results = [];
      records.forEach(({ $: item, i: idx }) => {
        if (isDefined(item)) {
          let expResults = evaluate(expression, item, idx);
          if (expResults.length) {
            if (!resultMap[idx]) {
              resultMap[idx] = { idx, item, matches: [] };
              results.push(resultMap[idx]);
            }
            expResults.forEach(({ matches }) => {
              resultMap[idx].matches.push(...matches);
            });
          }
        }
      });
      return results;
    }
    _searchObjectList(query) {
      const searcher = createSearcher(query, this.options);
      const { keys, records } = this._myIndex;
      const results = [];
      records.forEach(({ $: item, i: idx }) => {
        if (!isDefined(item)) {
          return;
        }
        let matches = [];
        keys.forEach((key, keyIndex) => {
          matches.push(
            ...this._findMatches({
              key,
              value: item[keyIndex],
              searcher
            })
          );
        });
        if (matches.length) {
          results.push({
            idx,
            item,
            matches
          });
        }
      });
      return results;
    }
    _findMatches({ key, value, searcher }) {
      if (!isDefined(value)) {
        return [];
      }
      let matches = [];
      if (isArray(value)) {
        value.forEach(({ v: text, i: idx, n: norm2 }) => {
          if (!isDefined(text)) {
            return;
          }
          const { isMatch, score, indices } = searcher.searchIn(text);
          if (isMatch) {
            matches.push({
              score,
              key,
              value: text,
              idx,
              norm: norm2,
              indices
            });
          }
        });
      } else {
        const { v: text, n: norm2 } = value;
        const { isMatch, score, indices } = searcher.searchIn(text);
        if (isMatch) {
          matches.push({ score, key, value: text, norm: norm2, indices });
        }
      }
      return matches;
    }
  };
  Fuse.version = "7.0.0";
  Fuse.createIndex = createIndex;
  Fuse.parseIndex = parseIndex;
  Fuse.config = Config;
  {
    Fuse.parseQuery = parse;
  }
  {
    register(ExtendedSearch);
  }

  // public/home.js
  function config() {
    const firebaseConfig = {
      apiKey: "AIzaSyA77HYtVdsJD_SdwDgdVWvGDeDA1IIquKY",
      authDomain: "sfx-rocks.firebaseapp.com",
      projectId: "sfx-rocks",
      storageBucket: "sfx-rocks.appspot.com",
      messagingSenderId: "221320269920",
      appId: "1:221320269920:web:0804ed9dfe08c466677305",
      measurementId: "G-V506HKS3NE"
    };
    initializeApp(firebaseConfig);
  }
  config();
  function gojodev() {
    let emmanuel = document.getElementById("gojodev");
    let index = 1;
    setInterval(() => {
      emmanuel.classList.remove("fadeIn");
      emmanuel.offsetWidth;
      emmanuel.classList.add("fadeIn");
      if (index == 0) {
        emmanuel.src = "images/gojodev.webp";
        index = 1;
      } else {
        emmanuel.src = "images/logo.webp";
        index = 0;
      }
    }, 3500);
  }
  gojodev();
  var storage = getStorage();
  async function getRef_json(refItem) {
    const url = await getDownloadURL(refItem);
    const response = await fetch(url, { mode: "cors" });
    let data = await response.text();
    data = JSON.parse(data);
    return data;
  }
  async function getRef_text(refItem) {
    const url = await getDownloadURL(refItem);
    const response = await fetch(url, { mode: "cors" });
    let data = await response.text();
    return data;
  }
  function showLoadError() {
    const header_container = document.getElementById("cat_header_container");
    header_container.textContent = "";
    const message = document.createElement("div");
    message.classList.add("cat-header", "black-bg", "white", "box-shadow");
    message.textContent = "Couldn't load sounds right now. Please try again later.";
    header_container.appendChild(message);
    const searchInput = document.getElementById("target_text");
    if (searchInput)
      searchInput.disabled = true;
  }
  function setupSearch(searchIndex, categoryEntries) {
    const searchInput = document.getElementById("target_text");
    const noResults = document.getElementById("no-results");
    const headerContainer = document.getElementById("cat_header_container");
    if (!searchInput || !headerContainer)
      return;
    const resultsContainer = document.createElement("div");
    resultsContainer.classList.add("black-bg", "white", "box-shadow", "item-container");
    resultsContainer.style.display = "none";
    headerContainer.insertBefore(resultsContainer, headerContainer.firstChild);
    const fuse = new Fuse(searchIndex, {
      keys: ["name"],
      threshold: 0.2,
      ignoreLocation: true,
      minMatchCharLength: 3
    });
    function rankResults(rawQuery) {
      const query = rawQuery.trim().toLowerCase();
      const exactWord = [];
      const wordStarts = [];
      const substring = [];
      const matched = /* @__PURE__ */ new Set();
      searchIndex.forEach((entry) => {
        const lowerName = entry.name.toLowerCase();
        const words = lowerName.split(/\s+/);
        if (words.includes(query)) {
          exactWord.push(entry);
          matched.add(entry);
        } else if (words.some((w) => w.startsWith(query))) {
          wordStarts.push(entry);
          matched.add(entry);
        } else if (lowerName.includes(query)) {
          substring.push(entry);
          matched.add(entry);
        }
      });
      const fuzzy = fuse.search(rawQuery).map((result) => result.item).filter((entry) => !matched.has(entry));
      return [...exactWord, ...wordStarts, ...substring, ...fuzzy];
    }
    function showCategorizedView() {
      searchIndex.forEach(({ itemEl, containerEl }) => {
        containerEl.appendChild(itemEl);
      });
      categoryEntries.forEach(({ headerEl, containerEl }) => {
        headerEl.style.display = "";
        containerEl.style.display = "";
      });
      resultsContainer.style.display = "none";
      noResults.style.display = "none";
    }
    function showResults(query) {
      const results = rankResults(query);
      categoryEntries.forEach(({ headerEl, containerEl }) => {
        headerEl.style.display = "none";
        containerEl.style.display = "none";
      });
      if (results.length === 0) {
        resultsContainer.style.display = "none";
        noResults.style.display = "block";
        return;
      }
      noResults.style.display = "none";
      resultsContainer.replaceChildren();
      results.forEach((entry) => {
        resultsContainer.appendChild(entry.itemEl);
      });
      resultsContainer.style.display = "flex";
    }
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.trim();
      if (!query) {
        showCategorizedView();
      } else {
        showResults(query);
      }
    });
  }
  function setupHomeLinkScroll() {
    document.querySelectorAll('a[href="index.html"]').forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });
  }
  async function loadInfo() {
    const soundsRef = ref(storage, "sounds.json");
    const catArrRef = ref(storage, "category_array.txt");
    const [catArrResult, soundsJsonResult] = await Promise.allSettled([getRef_text(catArrRef), getRef_json(soundsRef)]);
    if (catArrResult.status !== "fulfilled" || soundsJsonResult.status !== "fulfilled") {
      console.error("Failed to load sound data:", catArrResult.reason, soundsJsonResult.reason);
      showLoadError();
      return;
    }
    var catArr = catArrResult.value.split(",");
    var soundsJson = soundsJsonResult.value;
    var name4;
    var id;
    var category;
    var img_url;
    var sound_url;
    var header_container;
    var items_container;
    const searchIndex = [];
    const categoryEntries = [];
    for (const cat_key in soundsJson) {
      let cat = soundsJson[cat_key];
      const div_header = document.createElement("div");
      const div_node = document.createTextNode(cat_key);
      div_header.appendChild(div_node);
      div_header.classList.add("cat-header", "black-bg", "white", "box-shadow");
      header_container = document.getElementById("cat_header_container");
      header_container.appendChild(div_header);
      items_container = document.createElement("div");
      items_container.classList.add("black-bg", "white", "box-shadow", "item-container");
      categoryEntries.push({ headerEl: div_header, containerEl: items_container });
      for (const item_key in cat) {
        name4 = cat[item_key].name;
        id = cat[item_key].id;
        category = cat[item_key].category;
        img_url = cat[item_key].img_url;
        sound_url = cat[item_key].sound_url;
        const item = document.createElement("span");
        item.classList.toggle("item");
        const img = document.createElement("img");
        img.classList.add("img-style");
        img.src = img_url;
        img.id = id;
        item.appendChild(img);
        const img_desc = document.createElement("h3");
        const img_desc_node = document.createTextNode(name4);
        img_desc.appendChild(img_desc_node);
        item.appendChild(img_desc);
        img.addEventListener("click", () => {
          var audio = new Audio("".concat(cat[item_key].sound_url));
          audio.play();
        });
        items_container.appendChild(item);
        searchIndex.push({ name: name4, itemEl: item, containerEl: items_container });
      }
      header_container.appendChild(items_container);
    }
    setupSearch(searchIndex, categoryEntries);
  }
  setupHomeLinkScroll();
  loadInfo().catch((err) => {
    console.error("Failed to load sound data:", err);
    showLoadError();
  });
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
  (**
   * @license
   * Copyright 2023 Google LLC
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

@firebase/storage/dist/index.esm2017.js:
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

@firebase/storage/dist/index.esm2017.js:
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

@firebase/storage/dist/index.esm2017.js:
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

@firebase/storage/dist/index.esm2017.js:
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

@firebase/storage/dist/index.esm2017.js:
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

@firebase/storage/dist/index.esm2017.js:
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

@firebase/storage/dist/index.esm2017.js:
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

@firebase/storage/dist/index.esm2017.js:
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

@firebase/storage/dist/index.esm2017.js:
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

@firebase/storage/dist/index.esm2017.js:
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

@firebase/storage/dist/index.esm2017.js:
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

@firebase/storage/dist/index.esm2017.js:
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

@firebase/storage/dist/index.esm2017.js:
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

@firebase/storage/dist/index.esm2017.js:
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

@firebase/storage/dist/index.esm2017.js:
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

@firebase/storage/dist/index.esm2017.js:
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

@firebase/storage/dist/index.esm2017.js:
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

@firebase/storage/dist/index.esm2017.js:
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
*/
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vbm9kZV9tb2R1bGVzL0BmaXJlYmFzZS91dGlsL3NyYy9jb25zdGFudHMudHMiLCAiLi4vbm9kZV9tb2R1bGVzL0BmaXJlYmFzZS91dGlsL3NyYy9hc3NlcnQudHMiLCAiLi4vbm9kZV9tb2R1bGVzL0BmaXJlYmFzZS91dGlsL3NyYy9jcnlwdC50cyIsICIuLi9ub2RlX21vZHVsZXMvQGZpcmViYXNlL3V0aWwvc3JjL2RlZXBDb3B5LnRzIiwgIi4uL25vZGVfbW9kdWxlcy9AZmlyZWJhc2UvdXRpbC9zcmMvZ2xvYmFsLnRzIiwgIi4uL25vZGVfbW9kdWxlcy9AZmlyZWJhc2UvdXRpbC9zcmMvZGVmYXVsdHMudHMiLCAiLi4vbm9kZV9tb2R1bGVzL0BmaXJlYmFzZS91dGlsL3NyYy9kZWZlcnJlZC50cyIsICIuLi9ub2RlX21vZHVsZXMvQGZpcmViYXNlL3V0aWwvc3JjL2VtdWxhdG9yLnRzIiwgIi4uL25vZGVfbW9kdWxlcy9AZmlyZWJhc2UvdXRpbC9zcmMvZW52aXJvbm1lbnQudHMiLCAiLi4vbm9kZV9tb2R1bGVzL0BmaXJlYmFzZS91dGlsL3NyYy9lcnJvcnMudHMiLCAiLi4vbm9kZV9tb2R1bGVzL0BmaXJlYmFzZS91dGlsL3NyYy9qc29uLnRzIiwgIi4uL25vZGVfbW9kdWxlcy9AZmlyZWJhc2UvdXRpbC9zcmMvand0LnRzIiwgIi4uL25vZGVfbW9kdWxlcy9AZmlyZWJhc2UvdXRpbC9zcmMvb2JqLnRzIiwgIi4uL25vZGVfbW9kdWxlcy9AZmlyZWJhc2UvdXRpbC9zcmMvcHJvbWlzZS50cyIsICIuLi9ub2RlX21vZHVsZXMvQGZpcmViYXNlL3V0aWwvc3JjL3F1ZXJ5LnRzIiwgIi4uL25vZGVfbW9kdWxlcy9AZmlyZWJhc2UvdXRpbC9zcmMvc2hhMS50cyIsICIuLi9ub2RlX21vZHVsZXMvQGZpcmViYXNlL3V0aWwvc3JjL3N1YnNjcmliZS50cyIsICIuLi9ub2RlX21vZHVsZXMvQGZpcmViYXNlL3V0aWwvc3JjL3ZhbGlkYXRpb24udHMiLCAiLi4vbm9kZV9tb2R1bGVzL0BmaXJlYmFzZS91dGlsL3NyYy91dGY4LnRzIiwgIi4uL25vZGVfbW9kdWxlcy9AZmlyZWJhc2UvdXRpbC9zcmMvdXVpZC50cyIsICIuLi9ub2RlX21vZHVsZXMvQGZpcmViYXNlL3V0aWwvc3JjL2V4cG9uZW50aWFsX2JhY2tvZmYudHMiLCAiLi4vbm9kZV9tb2R1bGVzL0BmaXJlYmFzZS91dGlsL3NyYy9mb3JtYXR0ZXJzLnRzIiwgIi4uL25vZGVfbW9kdWxlcy9AZmlyZWJhc2UvdXRpbC9zcmMvY29tcGF0LnRzIiwgIi4uL25vZGVfbW9kdWxlcy9AZmlyZWJhc2UvY29tcG9uZW50L3NyYy9jb21wb25lbnQudHMiLCAiLi4vbm9kZV9tb2R1bGVzL0BmaXJlYmFzZS9jb21wb25lbnQvc3JjL2NvbnN0YW50cy50cyIsICIuLi9ub2RlX21vZHVsZXMvQGZpcmViYXNlL2NvbXBvbmVudC9zcmMvcHJvdmlkZXIudHMiLCAiLi4vbm9kZV9tb2R1bGVzL0BmaXJlYmFzZS9jb21wb25lbnQvc3JjL2NvbXBvbmVudF9jb250YWluZXIudHMiLCAiLi4vbm9kZV9tb2R1bGVzL0BmaXJlYmFzZS9sb2dnZXIvc3JjL2xvZ2dlci50cyIsICIuLi9ub2RlX21vZHVsZXMvaWRiL2J1aWxkL3dyYXAtaWRiLXZhbHVlLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9pZGIvYnVpbGQvaW5kZXguanMiLCAiLi4vbm9kZV9tb2R1bGVzL0BmaXJlYmFzZS9hcHAvc3JjL3BsYXRmb3JtTG9nZ2VyU2VydmljZS50cyIsICIuLi9ub2RlX21vZHVsZXMvQGZpcmViYXNlL2FwcC9zcmMvbG9nZ2VyLnRzIiwgIi4uL25vZGVfbW9kdWxlcy9AZmlyZWJhc2UvYXBwL3NyYy9jb25zdGFudHMudHMiLCAiLi4vbm9kZV9tb2R1bGVzL0BmaXJlYmFzZS9hcHAvc3JjL2ludGVybmFsLnRzIiwgIi4uL25vZGVfbW9kdWxlcy9AZmlyZWJhc2UvYXBwL3NyYy9lcnJvcnMudHMiLCAiLi4vbm9kZV9tb2R1bGVzL0BmaXJlYmFzZS9hcHAvc3JjL2ZpcmViYXNlQXBwLnRzIiwgIi4uL25vZGVfbW9kdWxlcy9AZmlyZWJhc2UvYXBwL3NyYy9maXJlYmFzZVNlcnZlckFwcC50cyIsICIuLi9ub2RlX21vZHVsZXMvQGZpcmViYXNlL2FwcC9zcmMvYXBpLnRzIiwgIi4uL25vZGVfbW9kdWxlcy9AZmlyZWJhc2UvYXBwL3NyYy9pbmRleGVkZGIudHMiLCAiLi4vbm9kZV9tb2R1bGVzL0BmaXJlYmFzZS9hcHAvc3JjL2hlYXJ0YmVhdFNlcnZpY2UudHMiLCAiLi4vbm9kZV9tb2R1bGVzL0BmaXJlYmFzZS9hcHAvc3JjL3JlZ2lzdGVyQ29yZUNvbXBvbmVudHMudHMiLCAiLi4vbm9kZV9tb2R1bGVzL0BmaXJlYmFzZS9hcHAvc3JjL2luZGV4LnRzIiwgIi4uL25vZGVfbW9kdWxlcy9maXJlYmFzZS9hcHAvaW5kZXgudHMiLCAiLi4vbm9kZV9tb2R1bGVzL0BmaXJlYmFzZS9zdG9yYWdlL3NyYy9pbXBsZW1lbnRhdGlvbi9jb25zdGFudHMudHMiLCAiLi4vbm9kZV9tb2R1bGVzL0BmaXJlYmFzZS9zdG9yYWdlL3NyYy9pbXBsZW1lbnRhdGlvbi9lcnJvci50cyIsICIuLi9ub2RlX21vZHVsZXMvQGZpcmViYXNlL3N0b3JhZ2Uvc3JjL2ltcGxlbWVudGF0aW9uL2xvY2F0aW9uLnRzIiwgIi4uL25vZGVfbW9kdWxlcy9AZmlyZWJhc2Uvc3RvcmFnZS9zcmMvaW1wbGVtZW50YXRpb24vZmFpbHJlcXVlc3QudHMiLCAiLi4vbm9kZV9tb2R1bGVzL0BmaXJlYmFzZS9zdG9yYWdlL3NyYy9pbXBsZW1lbnRhdGlvbi9iYWNrb2ZmLnRzIiwgIi4uL25vZGVfbW9kdWxlcy9AZmlyZWJhc2Uvc3RvcmFnZS9zcmMvaW1wbGVtZW50YXRpb24vdHlwZS50cyIsICIuLi9ub2RlX21vZHVsZXMvQGZpcmViYXNlL3N0b3JhZ2Uvc3JjL2ltcGxlbWVudGF0aW9uL3VybC50cyIsICIuLi9ub2RlX21vZHVsZXMvQGZpcmViYXNlL3N0b3JhZ2Uvc3JjL2ltcGxlbWVudGF0aW9uL2Nvbm5lY3Rpb24udHMiLCAiLi4vbm9kZV9tb2R1bGVzL0BmaXJlYmFzZS9zdG9yYWdlL3NyYy9pbXBsZW1lbnRhdGlvbi91dGlscy50cyIsICIuLi9ub2RlX21vZHVsZXMvQGZpcmViYXNlL3N0b3JhZ2Uvc3JjL2ltcGxlbWVudGF0aW9uL3JlcXVlc3QudHMiLCAiLi4vbm9kZV9tb2R1bGVzL0BmaXJlYmFzZS9zdG9yYWdlL3NyYy9pbXBsZW1lbnRhdGlvbi9mcy50cyIsICIuLi9ub2RlX21vZHVsZXMvQGZpcmViYXNlL3N0b3JhZ2Uvc3JjL3BsYXRmb3JtL2Jyb3dzZXIvYmFzZTY0LnRzIiwgIi4uL25vZGVfbW9kdWxlcy9AZmlyZWJhc2Uvc3RvcmFnZS9zcmMvaW1wbGVtZW50YXRpb24vc3RyaW5nLnRzIiwgIi4uL25vZGVfbW9kdWxlcy9AZmlyZWJhc2Uvc3RvcmFnZS9zcmMvaW1wbGVtZW50YXRpb24vYmxvYi50cyIsICIuLi9ub2RlX21vZHVsZXMvQGZpcmViYXNlL3N0b3JhZ2Uvc3JjL2ltcGxlbWVudGF0aW9uL2pzb24udHMiLCAiLi4vbm9kZV9tb2R1bGVzL0BmaXJlYmFzZS9zdG9yYWdlL3NyYy9pbXBsZW1lbnRhdGlvbi9wYXRoLnRzIiwgIi4uL25vZGVfbW9kdWxlcy9AZmlyZWJhc2Uvc3RvcmFnZS9zcmMvaW1wbGVtZW50YXRpb24vbWV0YWRhdGEudHMiLCAiLi4vbm9kZV9tb2R1bGVzL0BmaXJlYmFzZS9zdG9yYWdlL3NyYy9pbXBsZW1lbnRhdGlvbi9saXN0LnRzIiwgIi4uL25vZGVfbW9kdWxlcy9AZmlyZWJhc2Uvc3RvcmFnZS9zcmMvaW1wbGVtZW50YXRpb24vcmVxdWVzdGluZm8udHMiLCAiLi4vbm9kZV9tb2R1bGVzL0BmaXJlYmFzZS9zdG9yYWdlL3NyYy9pbXBsZW1lbnRhdGlvbi9yZXF1ZXN0cy50cyIsICIuLi9ub2RlX21vZHVsZXMvQGZpcmViYXNlL3N0b3JhZ2Uvc3JjL2ltcGxlbWVudGF0aW9uL3Rhc2tlbnVtcy50cyIsICIuLi9ub2RlX21vZHVsZXMvQGZpcmViYXNlL3N0b3JhZ2Uvc3JjL2ltcGxlbWVudGF0aW9uL29ic2VydmVyLnRzIiwgIi4uL25vZGVfbW9kdWxlcy9AZmlyZWJhc2Uvc3RvcmFnZS9zcmMvaW1wbGVtZW50YXRpb24vYXN5bmMudHMiLCAiLi4vbm9kZV9tb2R1bGVzL0BmaXJlYmFzZS9zdG9yYWdlL3NyYy9wbGF0Zm9ybS9icm93c2VyL2Nvbm5lY3Rpb24udHMiLCAiLi4vbm9kZV9tb2R1bGVzL0BmaXJlYmFzZS9zdG9yYWdlL3NyYy90YXNrLnRzIiwgIi4uL25vZGVfbW9kdWxlcy9AZmlyZWJhc2Uvc3RvcmFnZS9zcmMvcmVmZXJlbmNlLnRzIiwgIi4uL25vZGVfbW9kdWxlcy9AZmlyZWJhc2Uvc3RvcmFnZS9zcmMvc2VydmljZS50cyIsICIuLi9ub2RlX21vZHVsZXMvQGZpcmViYXNlL3N0b3JhZ2Uvc3JjL2NvbnN0YW50cy50cyIsICIuLi9ub2RlX21vZHVsZXMvQGZpcmViYXNlL3N0b3JhZ2Uvc3JjL2FwaS50cyIsICIuLi9ub2RlX21vZHVsZXMvQGZpcmViYXNlL3N0b3JhZ2Uvc3JjL2FwaS5icm93c2VyLnRzIiwgIi4uL25vZGVfbW9kdWxlcy9AZmlyZWJhc2Uvc3RvcmFnZS9zcmMvaW5kZXgudHMiLCAiLi4vbm9kZV9tb2R1bGVzL2Z1c2UuanMvZGlzdC9mdXNlLm1qcyIsICJob21lLmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4vKipcbiAqIEBmaWxlb3ZlcnZpZXcgRmlyZWJhc2UgY29uc3RhbnRzLiAgU29tZSBvZiB0aGVzZSAoQGRlZmluZXMpIGNhbiBiZSBvdmVycmlkZGVuIGF0IGNvbXBpbGUtdGltZS5cbiAqL1xuXG5leHBvcnQgY29uc3QgQ09OU1RBTlRTID0ge1xuICAvKipcbiAgICogQGRlZmluZSB7Ym9vbGVhbn0gV2hldGhlciB0aGlzIGlzIHRoZSBjbGllbnQgTm9kZS5qcyBTREsuXG4gICAqL1xuICBOT0RFX0NMSUVOVDogZmFsc2UsXG4gIC8qKlxuICAgKiBAZGVmaW5lIHtib29sZWFufSBXaGV0aGVyIHRoaXMgaXMgdGhlIEFkbWluIE5vZGUuanMgU0RLLlxuICAgKi9cbiAgTk9ERV9BRE1JTjogZmFsc2UsXG5cbiAgLyoqXG4gICAqIEZpcmViYXNlIFNESyBWZXJzaW9uXG4gICAqL1xuICBTREtfVkVSU0lPTjogJyR7SlNDT1JFX1ZFUlNJT059J1xufTtcbiIsICIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBDT05TVEFOVFMgfSBmcm9tICcuL2NvbnN0YW50cyc7XG5cbi8qKlxuICogVGhyb3dzIGFuIGVycm9yIGlmIHRoZSBwcm92aWRlZCBhc3NlcnRpb24gaXMgZmFsc3lcbiAqL1xuZXhwb3J0IGNvbnN0IGFzc2VydCA9IGZ1bmN0aW9uIChhc3NlcnRpb246IHVua25vd24sIG1lc3NhZ2U6IHN0cmluZyk6IHZvaWQge1xuICBpZiAoIWFzc2VydGlvbikge1xuICAgIHRocm93IGFzc2VydGlvbkVycm9yKG1lc3NhZ2UpO1xuICB9XG59O1xuXG4vKipcbiAqIFJldHVybnMgYW4gRXJyb3Igb2JqZWN0IHN1aXRhYmxlIGZvciB0aHJvd2luZy5cbiAqL1xuZXhwb3J0IGNvbnN0IGFzc2VydGlvbkVycm9yID0gZnVuY3Rpb24gKG1lc3NhZ2U6IHN0cmluZyk6IEVycm9yIHtcbiAgcmV0dXJuIG5ldyBFcnJvcihcbiAgICAnRmlyZWJhc2UgRGF0YWJhc2UgKCcgK1xuICAgICAgQ09OU1RBTlRTLlNES19WRVJTSU9OICtcbiAgICAgICcpIElOVEVSTkFMIEFTU0VSVCBGQUlMRUQ6ICcgK1xuICAgICAgbWVzc2FnZVxuICApO1xufTtcbiIsICIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5jb25zdCBzdHJpbmdUb0J5dGVBcnJheSA9IGZ1bmN0aW9uIChzdHI6IHN0cmluZyk6IG51bWJlcltdIHtcbiAgLy8gVE9ETyh1c2VyKTogVXNlIG5hdGl2ZSBpbXBsZW1lbnRhdGlvbnMgaWYvd2hlbiBhdmFpbGFibGVcbiAgY29uc3Qgb3V0OiBudW1iZXJbXSA9IFtdO1xuICBsZXQgcCA9IDA7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgbGV0IGMgPSBzdHIuY2hhckNvZGVBdChpKTtcbiAgICBpZiAoYyA8IDEyOCkge1xuICAgICAgb3V0W3ArK10gPSBjO1xuICAgIH0gZWxzZSBpZiAoYyA8IDIwNDgpIHtcbiAgICAgIG91dFtwKytdID0gKGMgPj4gNikgfCAxOTI7XG4gICAgICBvdXRbcCsrXSA9IChjICYgNjMpIHwgMTI4O1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICAoYyAmIDB4ZmMwMCkgPT09IDB4ZDgwMCAmJlxuICAgICAgaSArIDEgPCBzdHIubGVuZ3RoICYmXG4gICAgICAoc3RyLmNoYXJDb2RlQXQoaSArIDEpICYgMHhmYzAwKSA9PT0gMHhkYzAwXG4gICAgKSB7XG4gICAgICAvLyBTdXJyb2dhdGUgUGFpclxuICAgICAgYyA9IDB4MTAwMDAgKyAoKGMgJiAweDAzZmYpIDw8IDEwKSArIChzdHIuY2hhckNvZGVBdCgrK2kpICYgMHgwM2ZmKTtcbiAgICAgIG91dFtwKytdID0gKGMgPj4gMTgpIHwgMjQwO1xuICAgICAgb3V0W3ArK10gPSAoKGMgPj4gMTIpICYgNjMpIHwgMTI4O1xuICAgICAgb3V0W3ArK10gPSAoKGMgPj4gNikgJiA2MykgfCAxMjg7XG4gICAgICBvdXRbcCsrXSA9IChjICYgNjMpIHwgMTI4O1xuICAgIH0gZWxzZSB7XG4gICAgICBvdXRbcCsrXSA9IChjID4+IDEyKSB8IDIyNDtcbiAgICAgIG91dFtwKytdID0gKChjID4+IDYpICYgNjMpIHwgMTI4O1xuICAgICAgb3V0W3ArK10gPSAoYyAmIDYzKSB8IDEyODtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogVHVybnMgYW4gYXJyYXkgb2YgbnVtYmVycyBpbnRvIHRoZSBzdHJpbmcgZ2l2ZW4gYnkgdGhlIGNvbmNhdGVuYXRpb24gb2YgdGhlXG4gKiBjaGFyYWN0ZXJzIHRvIHdoaWNoIHRoZSBudW1iZXJzIGNvcnJlc3BvbmQuXG4gKiBAcGFyYW0gYnl0ZXMgQXJyYXkgb2YgbnVtYmVycyByZXByZXNlbnRpbmcgY2hhcmFjdGVycy5cbiAqIEByZXR1cm4gU3RyaW5naWZpY2F0aW9uIG9mIHRoZSBhcnJheS5cbiAqL1xuY29uc3QgYnl0ZUFycmF5VG9TdHJpbmcgPSBmdW5jdGlvbiAoYnl0ZXM6IG51bWJlcltdKTogc3RyaW5nIHtcbiAgLy8gVE9ETyh1c2VyKTogVXNlIG5hdGl2ZSBpbXBsZW1lbnRhdGlvbnMgaWYvd2hlbiBhdmFpbGFibGVcbiAgY29uc3Qgb3V0OiBzdHJpbmdbXSA9IFtdO1xuICBsZXQgcG9zID0gMCxcbiAgICBjID0gMDtcbiAgd2hpbGUgKHBvcyA8IGJ5dGVzLmxlbmd0aCkge1xuICAgIGNvbnN0IGMxID0gYnl0ZXNbcG9zKytdO1xuICAgIGlmIChjMSA8IDEyOCkge1xuICAgICAgb3V0W2MrK10gPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGMxKTtcbiAgICB9IGVsc2UgaWYgKGMxID4gMTkxICYmIGMxIDwgMjI0KSB7XG4gICAgICBjb25zdCBjMiA9IGJ5dGVzW3BvcysrXTtcbiAgICAgIG91dFtjKytdID0gU3RyaW5nLmZyb21DaGFyQ29kZSgoKGMxICYgMzEpIDw8IDYpIHwgKGMyICYgNjMpKTtcbiAgICB9IGVsc2UgaWYgKGMxID4gMjM5ICYmIGMxIDwgMzY1KSB7XG4gICAgICAvLyBTdXJyb2dhdGUgUGFpclxuICAgICAgY29uc3QgYzIgPSBieXRlc1twb3MrK107XG4gICAgICBjb25zdCBjMyA9IGJ5dGVzW3BvcysrXTtcbiAgICAgIGNvbnN0IGM0ID0gYnl0ZXNbcG9zKytdO1xuICAgICAgY29uc3QgdSA9XG4gICAgICAgICgoKGMxICYgNykgPDwgMTgpIHwgKChjMiAmIDYzKSA8PCAxMikgfCAoKGMzICYgNjMpIDw8IDYpIHwgKGM0ICYgNjMpKSAtXG4gICAgICAgIDB4MTAwMDA7XG4gICAgICBvdXRbYysrXSA9IFN0cmluZy5mcm9tQ2hhckNvZGUoMHhkODAwICsgKHUgPj4gMTApKTtcbiAgICAgIG91dFtjKytdID0gU3RyaW5nLmZyb21DaGFyQ29kZSgweGRjMDAgKyAodSAmIDEwMjMpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgYzIgPSBieXRlc1twb3MrK107XG4gICAgICBjb25zdCBjMyA9IGJ5dGVzW3BvcysrXTtcbiAgICAgIG91dFtjKytdID0gU3RyaW5nLmZyb21DaGFyQ29kZShcbiAgICAgICAgKChjMSAmIDE1KSA8PCAxMikgfCAoKGMyICYgNjMpIDw8IDYpIHwgKGMzICYgNjMpXG4gICAgICApO1xuICAgIH1cbiAgfVxuICByZXR1cm4gb3V0LmpvaW4oJycpO1xufTtcblxuaW50ZXJmYWNlIEJhc2U2NCB7XG4gIGJ5dGVUb0NoYXJNYXBfOiB7IFtrZXk6IG51bWJlcl06IHN0cmluZyB9IHwgbnVsbDtcbiAgY2hhclRvQnl0ZU1hcF86IHsgW2tleTogc3RyaW5nXTogbnVtYmVyIH0gfCBudWxsO1xuICBieXRlVG9DaGFyTWFwV2ViU2FmZV86IHsgW2tleTogbnVtYmVyXTogc3RyaW5nIH0gfCBudWxsO1xuICBjaGFyVG9CeXRlTWFwV2ViU2FmZV86IHsgW2tleTogc3RyaW5nXTogbnVtYmVyIH0gfCBudWxsO1xuICBFTkNPREVEX1ZBTFNfQkFTRTogc3RyaW5nO1xuICByZWFkb25seSBFTkNPREVEX1ZBTFM6IHN0cmluZztcbiAgcmVhZG9ubHkgRU5DT0RFRF9WQUxTX1dFQlNBRkU6IHN0cmluZztcbiAgSEFTX05BVElWRV9TVVBQT1JUOiBib29sZWFuO1xuICBlbmNvZGVCeXRlQXJyYXkoaW5wdXQ6IG51bWJlcltdIHwgVWludDhBcnJheSwgd2ViU2FmZT86IGJvb2xlYW4pOiBzdHJpbmc7XG4gIGVuY29kZVN0cmluZyhpbnB1dDogc3RyaW5nLCB3ZWJTYWZlPzogYm9vbGVhbik6IHN0cmluZztcbiAgZGVjb2RlU3RyaW5nKGlucHV0OiBzdHJpbmcsIHdlYlNhZmU6IGJvb2xlYW4pOiBzdHJpbmc7XG4gIGRlY29kZVN0cmluZ1RvQnl0ZUFycmF5KGlucHV0OiBzdHJpbmcsIHdlYlNhZmU6IGJvb2xlYW4pOiBudW1iZXJbXTtcbiAgaW5pdF8oKTogdm9pZDtcbn1cblxuLy8gV2UgZGVmaW5lIGl0IGFzIGFuIG9iamVjdCBsaXRlcmFsIGluc3RlYWQgb2YgYSBjbGFzcyBiZWNhdXNlIGEgY2xhc3MgY29tcGlsZWQgZG93biB0byBlczUgY2FuJ3Rcbi8vIGJlIHRyZWVzaGFrZWQuIGh0dHBzOi8vZ2l0aHViLmNvbS9yb2xsdXAvcm9sbHVwL2lzc3Vlcy8xNjkxXG4vLyBTdGF0aWMgbG9va3VwIG1hcHMsIGxhemlseSBwb3B1bGF0ZWQgYnkgaW5pdF8oKVxuZXhwb3J0IGNvbnN0IGJhc2U2NDogQmFzZTY0ID0ge1xuICAvKipcbiAgICogTWFwcyBieXRlcyB0byBjaGFyYWN0ZXJzLlxuICAgKi9cbiAgYnl0ZVRvQ2hhck1hcF86IG51bGwsXG5cbiAgLyoqXG4gICAqIE1hcHMgY2hhcmFjdGVycyB0byBieXRlcy5cbiAgICovXG4gIGNoYXJUb0J5dGVNYXBfOiBudWxsLFxuXG4gIC8qKlxuICAgKiBNYXBzIGJ5dGVzIHRvIHdlYnNhZmUgY2hhcmFjdGVycy5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGJ5dGVUb0NoYXJNYXBXZWJTYWZlXzogbnVsbCxcblxuICAvKipcbiAgICogTWFwcyB3ZWJzYWZlIGNoYXJhY3RlcnMgdG8gYnl0ZXMuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBjaGFyVG9CeXRlTWFwV2ViU2FmZV86IG51bGwsXG5cbiAgLyoqXG4gICAqIE91ciBkZWZhdWx0IGFscGhhYmV0LCBzaGFyZWQgYmV0d2VlblxuICAgKiBFTkNPREVEX1ZBTFMgYW5kIEVOQ09ERURfVkFMU19XRUJTQUZFXG4gICAqL1xuICBFTkNPREVEX1ZBTFNfQkFTRTpcbiAgICAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVonICsgJ2FiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6JyArICcwMTIzNDU2Nzg5JyxcblxuICAvKipcbiAgICogT3VyIGRlZmF1bHQgYWxwaGFiZXQuIFZhbHVlIDY0ICg9KSBpcyBzcGVjaWFsOyBpdCBtZWFucyBcIm5vdGhpbmcuXCJcbiAgICovXG4gIGdldCBFTkNPREVEX1ZBTFMoKSB7XG4gICAgcmV0dXJuIHRoaXMuRU5DT0RFRF9WQUxTX0JBU0UgKyAnKy89JztcbiAgfSxcblxuICAvKipcbiAgICogT3VyIHdlYnNhZmUgYWxwaGFiZXQuXG4gICAqL1xuICBnZXQgRU5DT0RFRF9WQUxTX1dFQlNBRkUoKSB7XG4gICAgcmV0dXJuIHRoaXMuRU5DT0RFRF9WQUxTX0JBU0UgKyAnLV8uJztcbiAgfSxcblxuICAvKipcbiAgICogV2hldGhlciB0aGlzIGJyb3dzZXIgc3VwcG9ydHMgdGhlIGF0b2IgYW5kIGJ0b2EgZnVuY3Rpb25zLiBUaGlzIGV4dGVuc2lvblxuICAgKiBzdGFydGVkIGF0IE1vemlsbGEgYnV0IGlzIG5vdyBpbXBsZW1lbnRlZCBieSBtYW55IGJyb3dzZXJzLiBXZSB1c2UgdGhlXG4gICAqIEFTU1VNRV8qIHZhcmlhYmxlcyB0byBhdm9pZCBwdWxsaW5nIGluIHRoZSBmdWxsIHVzZXJhZ2VudCBkZXRlY3Rpb24gbGlicmFyeVxuICAgKiBidXQgc3RpbGwgYWxsb3dpbmcgdGhlIHN0YW5kYXJkIHBlci1icm93c2VyIGNvbXBpbGF0aW9ucy5cbiAgICpcbiAgICovXG4gIEhBU19OQVRJVkVfU1VQUE9SVDogdHlwZW9mIGF0b2IgPT09ICdmdW5jdGlvbicsXG5cbiAgLyoqXG4gICAqIEJhc2U2NC1lbmNvZGUgYW4gYXJyYXkgb2YgYnl0ZXMuXG4gICAqXG4gICAqIEBwYXJhbSBpbnB1dCBBbiBhcnJheSBvZiBieXRlcyAobnVtYmVycyB3aXRoXG4gICAqICAgICB2YWx1ZSBpbiBbMCwgMjU1XSkgdG8gZW5jb2RlLlxuICAgKiBAcGFyYW0gd2ViU2FmZSBCb29sZWFuIGluZGljYXRpbmcgd2Ugc2hvdWxkIHVzZSB0aGVcbiAgICogICAgIGFsdGVybmF0aXZlIGFscGhhYmV0LlxuICAgKiBAcmV0dXJuIFRoZSBiYXNlNjQgZW5jb2RlZCBzdHJpbmcuXG4gICAqL1xuICBlbmNvZGVCeXRlQXJyYXkoaW5wdXQ6IG51bWJlcltdIHwgVWludDhBcnJheSwgd2ViU2FmZT86IGJvb2xlYW4pOiBzdHJpbmcge1xuICAgIGlmICghQXJyYXkuaXNBcnJheShpbnB1dCkpIHtcbiAgICAgIHRocm93IEVycm9yKCdlbmNvZGVCeXRlQXJyYXkgdGFrZXMgYW4gYXJyYXkgYXMgYSBwYXJhbWV0ZXInKTtcbiAgICB9XG5cbiAgICB0aGlzLmluaXRfKCk7XG5cbiAgICBjb25zdCBieXRlVG9DaGFyTWFwID0gd2ViU2FmZVxuICAgICAgPyB0aGlzLmJ5dGVUb0NoYXJNYXBXZWJTYWZlXyFcbiAgICAgIDogdGhpcy5ieXRlVG9DaGFyTWFwXyE7XG5cbiAgICBjb25zdCBvdXRwdXQgPSBbXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5wdXQubGVuZ3RoOyBpICs9IDMpIHtcbiAgICAgIGNvbnN0IGJ5dGUxID0gaW5wdXRbaV07XG4gICAgICBjb25zdCBoYXZlQnl0ZTIgPSBpICsgMSA8IGlucHV0Lmxlbmd0aDtcbiAgICAgIGNvbnN0IGJ5dGUyID0gaGF2ZUJ5dGUyID8gaW5wdXRbaSArIDFdIDogMDtcbiAgICAgIGNvbnN0IGhhdmVCeXRlMyA9IGkgKyAyIDwgaW5wdXQubGVuZ3RoO1xuICAgICAgY29uc3QgYnl0ZTMgPSBoYXZlQnl0ZTMgPyBpbnB1dFtpICsgMl0gOiAwO1xuXG4gICAgICBjb25zdCBvdXRCeXRlMSA9IGJ5dGUxID4+IDI7XG4gICAgICBjb25zdCBvdXRCeXRlMiA9ICgoYnl0ZTEgJiAweDAzKSA8PCA0KSB8IChieXRlMiA+PiA0KTtcbiAgICAgIGxldCBvdXRCeXRlMyA9ICgoYnl0ZTIgJiAweDBmKSA8PCAyKSB8IChieXRlMyA+PiA2KTtcbiAgICAgIGxldCBvdXRCeXRlNCA9IGJ5dGUzICYgMHgzZjtcblxuICAgICAgaWYgKCFoYXZlQnl0ZTMpIHtcbiAgICAgICAgb3V0Qnl0ZTQgPSA2NDtcblxuICAgICAgICBpZiAoIWhhdmVCeXRlMikge1xuICAgICAgICAgIG91dEJ5dGUzID0gNjQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgb3V0cHV0LnB1c2goXG4gICAgICAgIGJ5dGVUb0NoYXJNYXBbb3V0Qnl0ZTFdLFxuICAgICAgICBieXRlVG9DaGFyTWFwW291dEJ5dGUyXSxcbiAgICAgICAgYnl0ZVRvQ2hhck1hcFtvdXRCeXRlM10sXG4gICAgICAgIGJ5dGVUb0NoYXJNYXBbb3V0Qnl0ZTRdXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiBvdXRwdXQuam9pbignJyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEJhc2U2NC1lbmNvZGUgYSBzdHJpbmcuXG4gICAqXG4gICAqIEBwYXJhbSBpbnB1dCBBIHN0cmluZyB0byBlbmNvZGUuXG4gICAqIEBwYXJhbSB3ZWJTYWZlIElmIHRydWUsIHdlIHNob3VsZCB1c2UgdGhlXG4gICAqICAgICBhbHRlcm5hdGl2ZSBhbHBoYWJldC5cbiAgICogQHJldHVybiBUaGUgYmFzZTY0IGVuY29kZWQgc3RyaW5nLlxuICAgKi9cbiAgZW5jb2RlU3RyaW5nKGlucHV0OiBzdHJpbmcsIHdlYlNhZmU/OiBib29sZWFuKTogc3RyaW5nIHtcbiAgICAvLyBTaG9ydGN1dCBmb3IgTW96aWxsYSBicm93c2VycyB0aGF0IGltcGxlbWVudFxuICAgIC8vIGEgbmF0aXZlIGJhc2U2NCBlbmNvZGVyIGluIHRoZSBmb3JtIG9mIFwiYnRvYS9hdG9iXCJcbiAgICBpZiAodGhpcy5IQVNfTkFUSVZFX1NVUFBPUlQgJiYgIXdlYlNhZmUpIHtcbiAgICAgIHJldHVybiBidG9hKGlucHV0KTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZW5jb2RlQnl0ZUFycmF5KHN0cmluZ1RvQnl0ZUFycmF5KGlucHV0KSwgd2ViU2FmZSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEJhc2U2NC1kZWNvZGUgYSBzdHJpbmcuXG4gICAqXG4gICAqIEBwYXJhbSBpbnB1dCB0byBkZWNvZGUuXG4gICAqIEBwYXJhbSB3ZWJTYWZlIFRydWUgaWYgd2Ugc2hvdWxkIHVzZSB0aGVcbiAgICogICAgIGFsdGVybmF0aXZlIGFscGhhYmV0LlxuICAgKiBAcmV0dXJuIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIGRlY29kZWQgdmFsdWUuXG4gICAqL1xuICBkZWNvZGVTdHJpbmcoaW5wdXQ6IHN0cmluZywgd2ViU2FmZTogYm9vbGVhbik6IHN0cmluZyB7XG4gICAgLy8gU2hvcnRjdXQgZm9yIE1vemlsbGEgYnJvd3NlcnMgdGhhdCBpbXBsZW1lbnRcbiAgICAvLyBhIG5hdGl2ZSBiYXNlNjQgZW5jb2RlciBpbiB0aGUgZm9ybSBvZiBcImJ0b2EvYXRvYlwiXG4gICAgaWYgKHRoaXMuSEFTX05BVElWRV9TVVBQT1JUICYmICF3ZWJTYWZlKSB7XG4gICAgICByZXR1cm4gYXRvYihpbnB1dCk7XG4gICAgfVxuICAgIHJldHVybiBieXRlQXJyYXlUb1N0cmluZyh0aGlzLmRlY29kZVN0cmluZ1RvQnl0ZUFycmF5KGlucHV0LCB3ZWJTYWZlKSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEJhc2U2NC1kZWNvZGUgYSBzdHJpbmcuXG4gICAqXG4gICAqIEluIGJhc2UtNjQgZGVjb2RpbmcsIGdyb3VwcyBvZiBmb3VyIGNoYXJhY3RlcnMgYXJlIGNvbnZlcnRlZCBpbnRvIHRocmVlXG4gICAqIGJ5dGVzLiAgSWYgdGhlIGVuY29kZXIgZGlkIG5vdCBhcHBseSBwYWRkaW5nLCB0aGUgaW5wdXQgbGVuZ3RoIG1heSBub3RcbiAgICogYmUgYSBtdWx0aXBsZSBvZiA0LlxuICAgKlxuICAgKiBJbiB0aGlzIGNhc2UsIHRoZSBsYXN0IGdyb3VwIHdpbGwgaGF2ZSBmZXdlciB0aGFuIDQgY2hhcmFjdGVycywgYW5kXG4gICAqIHBhZGRpbmcgd2lsbCBiZSBpbmZlcnJlZC4gIElmIHRoZSBncm91cCBoYXMgb25lIG9yIHR3byBjaGFyYWN0ZXJzLCBpdCBkZWNvZGVzXG4gICAqIHRvIG9uZSBieXRlLiAgSWYgdGhlIGdyb3VwIGhhcyB0aHJlZSBjaGFyYWN0ZXJzLCBpdCBkZWNvZGVzIHRvIHR3byBieXRlcy5cbiAgICpcbiAgICogQHBhcmFtIGlucHV0IElucHV0IHRvIGRlY29kZS5cbiAgICogQHBhcmFtIHdlYlNhZmUgVHJ1ZSBpZiB3ZSBzaG91bGQgdXNlIHRoZSB3ZWItc2FmZSBhbHBoYWJldC5cbiAgICogQHJldHVybiBieXRlcyByZXByZXNlbnRpbmcgdGhlIGRlY29kZWQgdmFsdWUuXG4gICAqL1xuICBkZWNvZGVTdHJpbmdUb0J5dGVBcnJheShpbnB1dDogc3RyaW5nLCB3ZWJTYWZlOiBib29sZWFuKTogbnVtYmVyW10ge1xuICAgIHRoaXMuaW5pdF8oKTtcblxuICAgIGNvbnN0IGNoYXJUb0J5dGVNYXAgPSB3ZWJTYWZlXG4gICAgICA/IHRoaXMuY2hhclRvQnl0ZU1hcFdlYlNhZmVfIVxuICAgICAgOiB0aGlzLmNoYXJUb0J5dGVNYXBfITtcblxuICAgIGNvbnN0IG91dHB1dDogbnVtYmVyW10gPSBbXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5wdXQubGVuZ3RoOyApIHtcbiAgICAgIGNvbnN0IGJ5dGUxID0gY2hhclRvQnl0ZU1hcFtpbnB1dC5jaGFyQXQoaSsrKV07XG5cbiAgICAgIGNvbnN0IGhhdmVCeXRlMiA9IGkgPCBpbnB1dC5sZW5ndGg7XG4gICAgICBjb25zdCBieXRlMiA9IGhhdmVCeXRlMiA/IGNoYXJUb0J5dGVNYXBbaW5wdXQuY2hhckF0KGkpXSA6IDA7XG4gICAgICArK2k7XG5cbiAgICAgIGNvbnN0IGhhdmVCeXRlMyA9IGkgPCBpbnB1dC5sZW5ndGg7XG4gICAgICBjb25zdCBieXRlMyA9IGhhdmVCeXRlMyA/IGNoYXJUb0J5dGVNYXBbaW5wdXQuY2hhckF0KGkpXSA6IDY0O1xuICAgICAgKytpO1xuXG4gICAgICBjb25zdCBoYXZlQnl0ZTQgPSBpIDwgaW5wdXQubGVuZ3RoO1xuICAgICAgY29uc3QgYnl0ZTQgPSBoYXZlQnl0ZTQgPyBjaGFyVG9CeXRlTWFwW2lucHV0LmNoYXJBdChpKV0gOiA2NDtcbiAgICAgICsraTtcblxuICAgICAgaWYgKGJ5dGUxID09IG51bGwgfHwgYnl0ZTIgPT0gbnVsbCB8fCBieXRlMyA9PSBudWxsIHx8IGJ5dGU0ID09IG51bGwpIHtcbiAgICAgICAgdGhyb3cgbmV3IERlY29kZUJhc2U2NFN0cmluZ0Vycm9yKCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG91dEJ5dGUxID0gKGJ5dGUxIDw8IDIpIHwgKGJ5dGUyID4+IDQpO1xuICAgICAgb3V0cHV0LnB1c2gob3V0Qnl0ZTEpO1xuXG4gICAgICBpZiAoYnl0ZTMgIT09IDY0KSB7XG4gICAgICAgIGNvbnN0IG91dEJ5dGUyID0gKChieXRlMiA8PCA0KSAmIDB4ZjApIHwgKGJ5dGUzID4+IDIpO1xuICAgICAgICBvdXRwdXQucHVzaChvdXRCeXRlMik7XG5cbiAgICAgICAgaWYgKGJ5dGU0ICE9PSA2NCkge1xuICAgICAgICAgIGNvbnN0IG91dEJ5dGUzID0gKChieXRlMyA8PCA2KSAmIDB4YzApIHwgYnl0ZTQ7XG4gICAgICAgICAgb3V0cHV0LnB1c2gob3V0Qnl0ZTMpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG91dHB1dDtcbiAgfSxcblxuICAvKipcbiAgICogTGF6eSBzdGF0aWMgaW5pdGlhbGl6YXRpb24gZnVuY3Rpb24uIENhbGxlZCBiZWZvcmVcbiAgICogYWNjZXNzaW5nIGFueSBvZiB0aGUgc3RhdGljIG1hcCB2YXJpYWJsZXMuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBpbml0XygpIHtcbiAgICBpZiAoIXRoaXMuYnl0ZVRvQ2hhck1hcF8pIHtcbiAgICAgIHRoaXMuYnl0ZVRvQ2hhck1hcF8gPSB7fTtcbiAgICAgIHRoaXMuY2hhclRvQnl0ZU1hcF8gPSB7fTtcbiAgICAgIHRoaXMuYnl0ZVRvQ2hhck1hcFdlYlNhZmVfID0ge307XG4gICAgICB0aGlzLmNoYXJUb0J5dGVNYXBXZWJTYWZlXyA9IHt9O1xuXG4gICAgICAvLyBXZSB3YW50IHF1aWNrIG1hcHBpbmdzIGJhY2sgYW5kIGZvcnRoLCBzbyB3ZSBwcmVjb21wdXRlIHR3byBtYXBzLlxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLkVOQ09ERURfVkFMUy5sZW5ndGg7IGkrKykge1xuICAgICAgICB0aGlzLmJ5dGVUb0NoYXJNYXBfW2ldID0gdGhpcy5FTkNPREVEX1ZBTFMuY2hhckF0KGkpO1xuICAgICAgICB0aGlzLmNoYXJUb0J5dGVNYXBfW3RoaXMuYnl0ZVRvQ2hhck1hcF9baV1dID0gaTtcbiAgICAgICAgdGhpcy5ieXRlVG9DaGFyTWFwV2ViU2FmZV9baV0gPSB0aGlzLkVOQ09ERURfVkFMU19XRUJTQUZFLmNoYXJBdChpKTtcbiAgICAgICAgdGhpcy5jaGFyVG9CeXRlTWFwV2ViU2FmZV9bdGhpcy5ieXRlVG9DaGFyTWFwV2ViU2FmZV9baV1dID0gaTtcblxuICAgICAgICAvLyBCZSBmb3JnaXZpbmcgd2hlbiBkZWNvZGluZyBhbmQgY29ycmVjdGx5IGRlY29kZSBib3RoIGVuY29kaW5ncy5cbiAgICAgICAgaWYgKGkgPj0gdGhpcy5FTkNPREVEX1ZBTFNfQkFTRS5sZW5ndGgpIHtcbiAgICAgICAgICB0aGlzLmNoYXJUb0J5dGVNYXBfW3RoaXMuRU5DT0RFRF9WQUxTX1dFQlNBRkUuY2hhckF0KGkpXSA9IGk7XG4gICAgICAgICAgdGhpcy5jaGFyVG9CeXRlTWFwV2ViU2FmZV9bdGhpcy5FTkNPREVEX1ZBTFMuY2hhckF0KGkpXSA9IGk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbi8qKlxuICogQW4gZXJyb3IgZW5jb3VudGVyZWQgd2hpbGUgZGVjb2RpbmcgYmFzZTY0IHN0cmluZy5cbiAqL1xuZXhwb3J0IGNsYXNzIERlY29kZUJhc2U2NFN0cmluZ0Vycm9yIGV4dGVuZHMgRXJyb3Ige1xuICByZWFkb25seSBuYW1lID0gJ0RlY29kZUJhc2U2NFN0cmluZ0Vycm9yJztcbn1cblxuLyoqXG4gKiBVUkwtc2FmZSBiYXNlNjQgZW5jb2RpbmdcbiAqL1xuZXhwb3J0IGNvbnN0IGJhc2U2NEVuY29kZSA9IGZ1bmN0aW9uIChzdHI6IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IHV0ZjhCeXRlcyA9IHN0cmluZ1RvQnl0ZUFycmF5KHN0cik7XG4gIHJldHVybiBiYXNlNjQuZW5jb2RlQnl0ZUFycmF5KHV0ZjhCeXRlcywgdHJ1ZSk7XG59O1xuXG4vKipcbiAqIFVSTC1zYWZlIGJhc2U2NCBlbmNvZGluZyAod2l0aG91dCBcIi5cIiBwYWRkaW5nIGluIHRoZSBlbmQpLlxuICogZS5nLiBVc2VkIGluIEpTT04gV2ViIFRva2VuIChKV1QpIHBhcnRzLlxuICovXG5leHBvcnQgY29uc3QgYmFzZTY0dXJsRW5jb2RlV2l0aG91dFBhZGRpbmcgPSBmdW5jdGlvbiAoc3RyOiBzdHJpbmcpOiBzdHJpbmcge1xuICAvLyBVc2UgYmFzZTY0dXJsIGVuY29kaW5nIGFuZCByZW1vdmUgcGFkZGluZyBpbiB0aGUgZW5kIChkb3QgY2hhcmFjdGVycykuXG4gIHJldHVybiBiYXNlNjRFbmNvZGUoc3RyKS5yZXBsYWNlKC9cXC4vZywgJycpO1xufTtcblxuLyoqXG4gKiBVUkwtc2FmZSBiYXNlNjQgZGVjb2RpbmdcbiAqXG4gKiBOT1RFOiBETyBOT1QgdXNlIHRoZSBnbG9iYWwgYXRvYigpIGZ1bmN0aW9uIC0gaXQgZG9lcyBOT1Qgc3VwcG9ydCB0aGVcbiAqIGJhc2U2NFVybCB2YXJpYW50IGVuY29kaW5nLlxuICpcbiAqIEBwYXJhbSBzdHIgVG8gYmUgZGVjb2RlZFxuICogQHJldHVybiBEZWNvZGVkIHJlc3VsdCwgaWYgcG9zc2libGVcbiAqL1xuZXhwb3J0IGNvbnN0IGJhc2U2NERlY29kZSA9IGZ1bmN0aW9uIChzdHI6IHN0cmluZyk6IHN0cmluZyB8IG51bGwge1xuICB0cnkge1xuICAgIHJldHVybiBiYXNlNjQuZGVjb2RlU3RyaW5nKHN0ciwgdHJ1ZSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLmVycm9yKCdiYXNlNjREZWNvZGUgZmFpbGVkOiAnLCBlKTtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn07XG4iLCAiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQ1xuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLyoqXG4gKiBEbyBhIGRlZXAtY29weSBvZiBiYXNpYyBKYXZhU2NyaXB0IE9iamVjdHMgb3IgQXJyYXlzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVlcENvcHk8VD4odmFsdWU6IFQpOiBUIHtcbiAgcmV0dXJuIGRlZXBFeHRlbmQodW5kZWZpbmVkLCB2YWx1ZSkgYXMgVDtcbn1cblxuLyoqXG4gKiBDb3B5IHByb3BlcnRpZXMgZnJvbSBzb3VyY2UgdG8gdGFyZ2V0IChyZWN1cnNpdmVseSBhbGxvd3MgZXh0ZW5zaW9uXG4gKiBvZiBPYmplY3RzIGFuZCBBcnJheXMpLiAgU2NhbGFyIHZhbHVlcyBpbiB0aGUgdGFyZ2V0IGFyZSBvdmVyLXdyaXR0ZW4uXG4gKiBJZiB0YXJnZXQgaXMgdW5kZWZpbmVkLCBhbiBvYmplY3Qgb2YgdGhlIGFwcHJvcHJpYXRlIHR5cGUgd2lsbCBiZSBjcmVhdGVkXG4gKiAoYW5kIHJldHVybmVkKS5cbiAqXG4gKiBXZSByZWN1cnNpdmVseSBjb3B5IGFsbCBjaGlsZCBwcm9wZXJ0aWVzIG9mIHBsYWluIE9iamVjdHMgaW4gdGhlIHNvdXJjZS0gc29cbiAqIHRoYXQgbmFtZXNwYWNlLSBsaWtlIGRpY3Rpb25hcmllcyBhcmUgbWVyZ2VkLlxuICpcbiAqIE5vdGUgdGhhdCB0aGUgdGFyZ2V0IGNhbiBiZSBhIGZ1bmN0aW9uLCBpbiB3aGljaCBjYXNlIHRoZSBwcm9wZXJ0aWVzIGluXG4gKiB0aGUgc291cmNlIE9iamVjdCBhcmUgY29waWVkIG9udG8gaXQgYXMgc3RhdGljIHByb3BlcnRpZXMgb2YgdGhlIEZ1bmN0aW9uLlxuICpcbiAqIE5vdGU6IHdlIGRvbid0IG1lcmdlIF9fcHJvdG9fXyB0byBwcmV2ZW50IHByb3RvdHlwZSBwb2xsdXRpb25cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlZXBFeHRlbmQodGFyZ2V0OiB1bmtub3duLCBzb3VyY2U6IHVua25vd24pOiB1bmtub3duIHtcbiAgaWYgKCEoc291cmNlIGluc3RhbmNlb2YgT2JqZWN0KSkge1xuICAgIHJldHVybiBzb3VyY2U7XG4gIH1cblxuICBzd2l0Y2ggKHNvdXJjZS5jb25zdHJ1Y3Rvcikge1xuICAgIGNhc2UgRGF0ZTpcbiAgICAgIC8vIFRyZWF0IERhdGVzIGxpa2Ugc2NhbGFyczsgaWYgdGhlIHRhcmdldCBkYXRlIG9iamVjdCBoYWQgYW55IGNoaWxkXG4gICAgICAvLyBwcm9wZXJ0aWVzIC0gdGhleSB3aWxsIGJlIGxvc3QhXG4gICAgICBjb25zdCBkYXRlVmFsdWUgPSBzb3VyY2UgYXMgRGF0ZTtcbiAgICAgIHJldHVybiBuZXcgRGF0ZShkYXRlVmFsdWUuZ2V0VGltZSgpKTtcblxuICAgIGNhc2UgT2JqZWN0OlxuICAgICAgaWYgKHRhcmdldCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRhcmdldCA9IHt9O1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgY2FzZSBBcnJheTpcbiAgICAgIC8vIEFsd2F5cyBjb3B5IHRoZSBhcnJheSBzb3VyY2UgYW5kIG92ZXJ3cml0ZSB0aGUgdGFyZ2V0LlxuICAgICAgdGFyZ2V0ID0gW107XG4gICAgICBicmVhaztcblxuICAgIGRlZmF1bHQ6XG4gICAgICAvLyBOb3QgYSBwbGFpbiBPYmplY3QgLSB0cmVhdCBpdCBhcyBhIHNjYWxhci5cbiAgICAgIHJldHVybiBzb3VyY2U7XG4gIH1cblxuICBmb3IgKGNvbnN0IHByb3AgaW4gc291cmNlKSB7XG4gICAgLy8gdXNlIGlzVmFsaWRLZXkgdG8gZ3VhcmQgYWdhaW5zdCBwcm90b3R5cGUgcG9sbHV0aW9uLiBTZWUgaHR0cHM6Ly9zbnlrLmlvL3Z1bG4vU05ZSy1KUy1MT0RBU0gtNDUwMjAyXG4gICAgaWYgKCFzb3VyY2UuaGFzT3duUHJvcGVydHkocHJvcCkgfHwgIWlzVmFsaWRLZXkocHJvcCkpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICAodGFyZ2V0IGFzIFJlY29yZDxzdHJpbmcsIHVua25vd24+KVtwcm9wXSA9IGRlZXBFeHRlbmQoXG4gICAgICAodGFyZ2V0IGFzIFJlY29yZDxzdHJpbmcsIHVua25vd24+KVtwcm9wXSxcbiAgICAgIChzb3VyY2UgYXMgUmVjb3JkPHN0cmluZywgdW5rbm93bj4pW3Byb3BdXG4gICAgKTtcbiAgfVxuXG4gIHJldHVybiB0YXJnZXQ7XG59XG5cbmZ1bmN0aW9uIGlzVmFsaWRLZXkoa2V5OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIGtleSAhPT0gJ19fcHJvdG9fXyc7XG59XG4iLCAiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjIgR29vZ2xlIExMQ1xuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLyoqXG4gKiBQb2x5ZmlsbCBmb3IgYGdsb2JhbFRoaXNgIG9iamVjdC5cbiAqIEByZXR1cm5zIHRoZSBgZ2xvYmFsVGhpc2Agb2JqZWN0IGZvciB0aGUgZ2l2ZW4gZW52aXJvbm1lbnQuXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRHbG9iYWwoKTogdHlwZW9mIGdsb2JhbFRoaXMge1xuICBpZiAodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIHNlbGY7XG4gIH1cbiAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIHdpbmRvdztcbiAgfVxuICBpZiAodHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gZ2xvYmFsO1xuICB9XG4gIHRocm93IG5ldyBFcnJvcignVW5hYmxlIHRvIGxvY2F0ZSBnbG9iYWwgb2JqZWN0LicpO1xufVxuIiwgIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIyIEdvb2dsZSBMTENcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IGJhc2U2NERlY29kZSB9IGZyb20gJy4vY3J5cHQnO1xuaW1wb3J0IHsgZ2V0R2xvYmFsIH0gZnJvbSAnLi9nbG9iYWwnO1xuXG4vKipcbiAqIEtleXMgZm9yIGV4cGVyaW1lbnRhbCBwcm9wZXJ0aWVzIG9uIHRoZSBgRmlyZWJhc2VEZWZhdWx0c2Agb2JqZWN0LlxuICogQHB1YmxpY1xuICovXG5leHBvcnQgdHlwZSBFeHBlcmltZW50YWxLZXkgPSAnYXV0aFRva2VuU3luY1VSTCcgfCAnYXV0aElkVG9rZW5NYXhBZ2UnO1xuXG4vKipcbiAqIEFuIG9iamVjdCB0aGF0IGNhbiBiZSBpbmplY3RlZCBpbnRvIHRoZSBlbnZpcm9ubWVudCBhcyBfX0ZJUkVCQVNFX0RFRkFVTFRTX18sXG4gKiBlaXRoZXIgYXMgYSBwcm9wZXJ0eSBvZiBnbG9iYWxUaGlzLCBhIHNoZWxsIGVudmlyb25tZW50IHZhcmlhYmxlLCBvciBhXG4gKiBjb29raWUuXG4gKlxuICogVGhpcyBvYmplY3QgY2FuIGJlIHVzZWQgdG8gYXV0b21hdGljYWxseSBjb25maWd1cmUgYW5kIGluaXRpYWxpemVcbiAqIGEgRmlyZWJhc2UgYXBwIGFzIHdlbGwgYXMgYW55IGVtdWxhdG9ycy5cbiAqXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRmlyZWJhc2VEZWZhdWx0cyB7XG4gIGNvbmZpZz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gIGVtdWxhdG9ySG9zdHM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICBfYXV0aFRva2VuU3luY1VSTD86IHN0cmluZztcbiAgX2F1dGhJZFRva2VuTWF4QWdlPzogbnVtYmVyO1xuICAvKipcbiAgICogT3ZlcnJpZGUgRmlyZWJhc2UncyBydW50aW1lIGVudmlyb25tZW50IGRldGVjdGlvbiBhbmRcbiAgICogZm9yY2UgdGhlIFNESyB0byBhY3QgYXMgaWYgaXQgd2VyZSBpbiB0aGUgc3BlY2lmaWVkIGVudmlyb25tZW50LlxuICAgKi9cbiAgZm9yY2VFbnZpcm9ubWVudD86ICdicm93c2VyJyB8ICdub2RlJztcbiAgW2tleTogc3RyaW5nXTogdW5rbm93bjtcbn1cblxuZGVjbGFyZSBnbG9iYWwge1xuICAvLyBOZWVkIGB2YXJgIGZvciB0aGlzIHRvIHdvcmsuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby12YXJcbiAgdmFyIF9fRklSRUJBU0VfREVGQVVMVFNfXzogRmlyZWJhc2VEZWZhdWx0cyB8IHVuZGVmaW5lZDtcbn1cblxuY29uc3QgZ2V0RGVmYXVsdHNGcm9tR2xvYmFsID0gKCk6IEZpcmViYXNlRGVmYXVsdHMgfCB1bmRlZmluZWQgPT5cbiAgZ2V0R2xvYmFsKCkuX19GSVJFQkFTRV9ERUZBVUxUU19fO1xuXG4vKipcbiAqIEF0dGVtcHQgdG8gcmVhZCBkZWZhdWx0cyBmcm9tIGEgSlNPTiBzdHJpbmcgcHJvdmlkZWQgdG9cbiAqIHByb2Nlc3MoLillbnYoLilfX0ZJUkVCQVNFX0RFRkFVTFRTX18gb3IgYSBKU09OIGZpbGUgd2hvc2UgcGF0aCBpcyBpblxuICogcHJvY2VzcyguKWVudiguKV9fRklSRUJBU0VfREVGQVVMVFNfUEFUSF9fXG4gKiBUaGUgZG90cyBhcmUgaW4gcGFyZW5zIGJlY2F1c2UgY2VydGFpbiBjb21waWxlcnMgKFZpdGU/KSBjYW5ub3RcbiAqIGhhbmRsZSBzZWVpbmcgdGhhdCB2YXJpYWJsZSBpbiBjb21tZW50cy5cbiAqIFNlZSBodHRwczovL2dpdGh1Yi5jb20vZmlyZWJhc2UvZmlyZWJhc2UtanMtc2RrL2lzc3Vlcy82ODM4XG4gKi9cbmNvbnN0IGdldERlZmF1bHRzRnJvbUVudlZhcmlhYmxlID0gKCk6IEZpcmViYXNlRGVmYXVsdHMgfCB1bmRlZmluZWQgPT4ge1xuICBpZiAodHlwZW9mIHByb2Nlc3MgPT09ICd1bmRlZmluZWQnIHx8IHR5cGVvZiBwcm9jZXNzLmVudiA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc3QgZGVmYXVsdHNKc29uU3RyaW5nID0gcHJvY2Vzcy5lbnYuX19GSVJFQkFTRV9ERUZBVUxUU19fO1xuICBpZiAoZGVmYXVsdHNKc29uU3RyaW5nKSB7XG4gICAgcmV0dXJuIEpTT04ucGFyc2UoZGVmYXVsdHNKc29uU3RyaW5nKTtcbiAgfVxufTtcblxuY29uc3QgZ2V0RGVmYXVsdHNGcm9tQ29va2llID0gKCk6IEZpcmViYXNlRGVmYXVsdHMgfCB1bmRlZmluZWQgPT4ge1xuICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybjtcbiAgfVxuICBsZXQgbWF0Y2g7XG4gIHRyeSB7XG4gICAgbWF0Y2ggPSBkb2N1bWVudC5jb29raWUubWF0Y2goL19fRklSRUJBU0VfREVGQVVMVFNfXz0oW147XSspLyk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICAvLyBTb21lIGVudmlyb25tZW50cyBzdWNoIGFzIEFuZ3VsYXIgVW5pdmVyc2FsIFNTUiBoYXZlIGFcbiAgICAvLyBgZG9jdW1lbnRgIG9iamVjdCBidXQgZXJyb3Igb24gYWNjZXNzaW5nIGBkb2N1bWVudC5jb29raWVgLlxuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCBkZWNvZGVkID0gbWF0Y2ggJiYgYmFzZTY0RGVjb2RlKG1hdGNoWzFdKTtcbiAgcmV0dXJuIGRlY29kZWQgJiYgSlNPTi5wYXJzZShkZWNvZGVkKTtcbn07XG5cbi8qKlxuICogR2V0IHRoZSBfX0ZJUkVCQVNFX0RFRkFVTFRTX18gb2JqZWN0LiBJdCBjaGVja3MgaW4gb3JkZXI6XG4gKiAoMSkgaWYgc3VjaCBhbiBvYmplY3QgZXhpc3RzIGFzIGEgcHJvcGVydHkgb2YgYGdsb2JhbFRoaXNgXG4gKiAoMikgaWYgc3VjaCBhbiBvYmplY3Qgd2FzIHByb3ZpZGVkIG9uIGEgc2hlbGwgZW52aXJvbm1lbnQgdmFyaWFibGVcbiAqICgzKSBpZiBzdWNoIGFuIG9iamVjdCBleGlzdHMgaW4gYSBjb29raWVcbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNvbnN0IGdldERlZmF1bHRzID0gKCk6IEZpcmViYXNlRGVmYXVsdHMgfCB1bmRlZmluZWQgPT4ge1xuICB0cnkge1xuICAgIHJldHVybiAoXG4gICAgICBnZXREZWZhdWx0c0Zyb21HbG9iYWwoKSB8fFxuICAgICAgZ2V0RGVmYXVsdHNGcm9tRW52VmFyaWFibGUoKSB8fFxuICAgICAgZ2V0RGVmYXVsdHNGcm9tQ29va2llKClcbiAgICApO1xuICB9IGNhdGNoIChlKSB7XG4gICAgLyoqXG4gICAgICogQ2F0Y2gtYWxsIGZvciBiZWluZyB1bmFibGUgdG8gZ2V0IF9fRklSRUJBU0VfREVGQVVMVFNfXyBkdWVcbiAgICAgKiB0byBhbnkgZW52aXJvbm1lbnQgY2FzZSB3ZSBoYXZlIG5vdCBhY2NvdW50ZWQgZm9yLiBMb2cgdG9cbiAgICAgKiBpbmZvIGluc3RlYWQgb2Ygc3dhbGxvd2luZyBzbyB3ZSBjYW4gZmluZCB0aGVzZSB1bmtub3duIGNhc2VzXG4gICAgICogYW5kIGFkZCBwYXRocyBmb3IgdGhlbSBpZiBuZWVkZWQuXG4gICAgICovXG4gICAgY29uc29sZS5pbmZvKGBVbmFibGUgdG8gZ2V0IF9fRklSRUJBU0VfREVGQVVMVFNfXyBkdWUgdG86ICR7ZX1gKTtcbiAgICByZXR1cm47XG4gIH1cbn07XG5cbi8qKlxuICogUmV0dXJucyBlbXVsYXRvciBob3N0IHN0b3JlZCBpbiB0aGUgX19GSVJFQkFTRV9ERUZBVUxUU19fIG9iamVjdFxuICogZm9yIHRoZSBnaXZlbiBwcm9kdWN0LlxuICogQHJldHVybnMgYSBVUkwgaG9zdCBmb3JtYXR0ZWQgbGlrZSBgMTI3LjAuMC4xOjk5OTlgIG9yIGBbOjoxXTo0MDAwYCBpZiBhdmFpbGFibGVcbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNvbnN0IGdldERlZmF1bHRFbXVsYXRvckhvc3QgPSAoXG4gIHByb2R1Y3ROYW1lOiBzdHJpbmdcbik6IHN0cmluZyB8IHVuZGVmaW5lZCA9PiBnZXREZWZhdWx0cygpPy5lbXVsYXRvckhvc3RzPy5bcHJvZHVjdE5hbWVdO1xuXG4vKipcbiAqIFJldHVybnMgZW11bGF0b3IgaG9zdG5hbWUgYW5kIHBvcnQgc3RvcmVkIGluIHRoZSBfX0ZJUkVCQVNFX0RFRkFVTFRTX18gb2JqZWN0XG4gKiBmb3IgdGhlIGdpdmVuIHByb2R1Y3QuXG4gKiBAcmV0dXJucyBhIHBhaXIgb2YgaG9zdG5hbWUgYW5kIHBvcnQgbGlrZSBgW1wiOjoxXCIsIDQwMDBdYCBpZiBhdmFpbGFibGVcbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNvbnN0IGdldERlZmF1bHRFbXVsYXRvckhvc3RuYW1lQW5kUG9ydCA9IChcbiAgcHJvZHVjdE5hbWU6IHN0cmluZ1xuKTogW2hvc3RuYW1lOiBzdHJpbmcsIHBvcnQ6IG51bWJlcl0gfCB1bmRlZmluZWQgPT4ge1xuICBjb25zdCBob3N0ID0gZ2V0RGVmYXVsdEVtdWxhdG9ySG9zdChwcm9kdWN0TmFtZSk7XG4gIGlmICghaG9zdCkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbiAgY29uc3Qgc2VwYXJhdG9ySW5kZXggPSBob3N0Lmxhc3RJbmRleE9mKCc6Jyk7IC8vIEZpbmRpbmcgdGhlIGxhc3Qgc2luY2UgSVB2NiBhZGRyIGFsc28gaGFzIGNvbG9ucy5cbiAgaWYgKHNlcGFyYXRvckluZGV4IDw9IDAgfHwgc2VwYXJhdG9ySW5kZXggKyAxID09PSBob3N0Lmxlbmd0aCkge1xuICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBob3N0ICR7aG9zdH0gd2l0aCBubyBzZXBhcmF0ZSBob3N0bmFtZSBhbmQgcG9ydCFgKTtcbiAgfVxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcmVzdHJpY3RlZC1nbG9iYWxzXG4gIGNvbnN0IHBvcnQgPSBwYXJzZUludChob3N0LnN1YnN0cmluZyhzZXBhcmF0b3JJbmRleCArIDEpLCAxMCk7XG4gIGlmIChob3N0WzBdID09PSAnWycpIHtcbiAgICAvLyBCcmFja2V0LXF1b3RlZCBgW2lwdjZhZGRyXTpwb3J0YCA9PiByZXR1cm4gXCJpcHY2YWRkclwiICh3aXRob3V0IGJyYWNrZXRzKS5cbiAgICByZXR1cm4gW2hvc3Quc3Vic3RyaW5nKDEsIHNlcGFyYXRvckluZGV4IC0gMSksIHBvcnRdO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBbaG9zdC5zdWJzdHJpbmcoMCwgc2VwYXJhdG9ySW5kZXgpLCBwb3J0XTtcbiAgfVxufTtcblxuLyoqXG4gKiBSZXR1cm5zIEZpcmViYXNlIGFwcCBjb25maWcgc3RvcmVkIGluIHRoZSBfX0ZJUkVCQVNFX0RFRkFVTFRTX18gb2JqZWN0LlxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3QgZ2V0RGVmYXVsdEFwcENvbmZpZyA9ICgpOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IHwgdW5kZWZpbmVkID0+XG4gIGdldERlZmF1bHRzKCk/LmNvbmZpZztcblxuLyoqXG4gKiBSZXR1cm5zIGFuIGV4cGVyaW1lbnRhbCBzZXR0aW5nIG9uIHRoZSBfX0ZJUkVCQVNFX0RFRkFVTFRTX18gb2JqZWN0IChwcm9wZXJ0aWVzXG4gKiBwcmVmaXhlZCBieSBcIl9cIilcbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNvbnN0IGdldEV4cGVyaW1lbnRhbFNldHRpbmcgPSA8VCBleHRlbmRzIEV4cGVyaW1lbnRhbEtleT4oXG4gIG5hbWU6IFRcbik6IEZpcmViYXNlRGVmYXVsdHNbYF8ke1R9YF0gPT5cbiAgZ2V0RGVmYXVsdHMoKT8uW2BfJHtuYW1lfWBdIGFzIEZpcmViYXNlRGVmYXVsdHNbYF8ke1R9YF07XG4iLCAiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQ1xuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuZXhwb3J0IGNsYXNzIERlZmVycmVkPFI+IHtcbiAgcHJvbWlzZTogUHJvbWlzZTxSPjtcbiAgcmVqZWN0OiAodmFsdWU/OiB1bmtub3duKSA9PiB2b2lkID0gKCkgPT4ge307XG4gIHJlc29sdmU6ICh2YWx1ZT86IHVua25vd24pID0+IHZvaWQgPSAoKSA9PiB7fTtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5wcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdGhpcy5yZXNvbHZlID0gcmVzb2x2ZSBhcyAodmFsdWU/OiB1bmtub3duKSA9PiB2b2lkO1xuICAgICAgdGhpcy5yZWplY3QgPSByZWplY3QgYXMgKHZhbHVlPzogdW5rbm93bikgPT4gdm9pZDtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBPdXIgQVBJIGludGVybmFscyBhcmUgbm90IHByb21pc2VpZmllZCBhbmQgY2Fubm90IGJlY2F1c2Ugb3VyIGNhbGxiYWNrIEFQSXMgaGF2ZSBzdWJ0bGUgZXhwZWN0YXRpb25zIGFyb3VuZFxuICAgKiBpbnZva2luZyBwcm9taXNlcyBpbmxpbmUsIHdoaWNoIFByb21pc2VzIGFyZSBmb3JiaWRkZW4gdG8gZG8uIFRoaXMgbWV0aG9kIGFjY2VwdHMgYW4gb3B0aW9uYWwgbm9kZS1zdHlsZSBjYWxsYmFja1xuICAgKiBhbmQgcmV0dXJucyBhIG5vZGUtc3R5bGUgY2FsbGJhY2sgd2hpY2ggd2lsbCByZXNvbHZlIG9yIHJlamVjdCB0aGUgRGVmZXJyZWQncyBwcm9taXNlLlxuICAgKi9cbiAgd3JhcENhbGxiYWNrKFxuICAgIGNhbGxiYWNrPzogKGVycm9yPzogdW5rbm93biwgdmFsdWU/OiB1bmtub3duKSA9PiB2b2lkXG4gICk6IChlcnJvcjogdW5rbm93biwgdmFsdWU/OiB1bmtub3duKSA9PiB2b2lkIHtcbiAgICByZXR1cm4gKGVycm9yLCB2YWx1ZT8pID0+IHtcbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICB0aGlzLnJlamVjdChlcnJvcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnJlc29sdmUodmFsdWUpO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAvLyBBdHRhY2hpbmcgbm9vcCBoYW5kbGVyIGp1c3QgaW4gY2FzZSBkZXZlbG9wZXIgd2Fzbid0IGV4cGVjdGluZ1xuICAgICAgICAvLyBwcm9taXNlc1xuICAgICAgICB0aGlzLnByb21pc2UuY2F0Y2goKCkgPT4ge30pO1xuXG4gICAgICAgIC8vIFNvbWUgb2Ygb3VyIGNhbGxiYWNrcyBkb24ndCBleHBlY3QgYSB2YWx1ZSBhbmQgb3VyIG93biB0ZXN0c1xuICAgICAgICAvLyBhc3NlcnQgdGhhdCB0aGUgcGFyYW1ldGVyIGxlbmd0aCBpcyAxXG4gICAgICAgIGlmIChjYWxsYmFjay5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICBjYWxsYmFjayhlcnJvcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY2FsbGJhY2soZXJyb3IsIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH1cbn1cbiIsICIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMSBHb29nbGUgTExDXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBiYXNlNjR1cmxFbmNvZGVXaXRob3V0UGFkZGluZyB9IGZyb20gJy4vY3J5cHQnO1xuXG4vLyBGaXJlYmFzZSBBdXRoIHRva2VucyBjb250YWluIHNuYWtlX2Nhc2UgY2xhaW1zIGZvbGxvd2luZyB0aGUgSldUIHN0YW5kYXJkIC8gY29udmVudGlvbi5cbi8qIGVzbGludC1kaXNhYmxlIGNhbWVsY2FzZSAqL1xuXG5leHBvcnQgdHlwZSBGaXJlYmFzZVNpZ25JblByb3ZpZGVyID1cbiAgfCAnY3VzdG9tJ1xuICB8ICdlbWFpbCdcbiAgfCAncGFzc3dvcmQnXG4gIHwgJ3Bob25lJ1xuICB8ICdhbm9ueW1vdXMnXG4gIHwgJ2dvb2dsZS5jb20nXG4gIHwgJ2ZhY2Vib29rLmNvbSdcbiAgfCAnZ2l0aHViLmNvbSdcbiAgfCAndHdpdHRlci5jb20nXG4gIHwgJ21pY3Jvc29mdC5jb20nXG4gIHwgJ2FwcGxlLmNvbSc7XG5cbmludGVyZmFjZSBGaXJlYmFzZUlkVG9rZW4ge1xuICAvLyBBbHdheXMgc2V0IHRvIGh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9QUk9KRUNUX0lEXG4gIGlzczogc3RyaW5nO1xuXG4gIC8vIEFsd2F5cyBzZXQgdG8gUFJPSkVDVF9JRFxuICBhdWQ6IHN0cmluZztcblxuICAvLyBUaGUgdXNlcidzIHVuaXF1ZSBJRFxuICBzdWI6IHN0cmluZztcblxuICAvLyBUaGUgdG9rZW4gaXNzdWUgdGltZSwgaW4gc2Vjb25kcyBzaW5jZSBlcG9jaFxuICBpYXQ6IG51bWJlcjtcblxuICAvLyBUaGUgdG9rZW4gZXhwaXJ5IHRpbWUsIG5vcm1hbGx5ICdpYXQnICsgMzYwMFxuICBleHA6IG51bWJlcjtcblxuICAvLyBUaGUgdXNlcidzIHVuaXF1ZSBJRC4gTXVzdCBiZSBlcXVhbCB0byAnc3ViJ1xuICB1c2VyX2lkOiBzdHJpbmc7XG5cbiAgLy8gVGhlIHRpbWUgdGhlIHVzZXIgYXV0aGVudGljYXRlZCwgbm9ybWFsbHkgJ2lhdCdcbiAgYXV0aF90aW1lOiBudW1iZXI7XG5cbiAgLy8gVGhlIHNpZ24gaW4gcHJvdmlkZXIsIG9ubHkgc2V0IHdoZW4gdGhlIHByb3ZpZGVyIGlzICdhbm9ueW1vdXMnXG4gIHByb3ZpZGVyX2lkPzogJ2Fub255bW91cyc7XG5cbiAgLy8gVGhlIHVzZXIncyBwcmltYXJ5IGVtYWlsXG4gIGVtYWlsPzogc3RyaW5nO1xuXG4gIC8vIFRoZSB1c2VyJ3MgZW1haWwgdmVyaWZpY2F0aW9uIHN0YXR1c1xuICBlbWFpbF92ZXJpZmllZD86IGJvb2xlYW47XG5cbiAgLy8gVGhlIHVzZXIncyBwcmltYXJ5IHBob25lIG51bWJlclxuICBwaG9uZV9udW1iZXI/OiBzdHJpbmc7XG5cbiAgLy8gVGhlIHVzZXIncyBkaXNwbGF5IG5hbWVcbiAgbmFtZT86IHN0cmluZztcblxuICAvLyBUaGUgdXNlcidzIHByb2ZpbGUgcGhvdG8gVVJMXG4gIHBpY3R1cmU/OiBzdHJpbmc7XG5cbiAgLy8gSW5mb3JtYXRpb24gb24gYWxsIGlkZW50aXRpZXMgbGlua2VkIHRvIHRoaXMgdXNlclxuICBmaXJlYmFzZToge1xuICAgIC8vIFRoZSBwcmltYXJ5IHNpZ24taW4gcHJvdmlkZXJcbiAgICBzaWduX2luX3Byb3ZpZGVyOiBGaXJlYmFzZVNpZ25JblByb3ZpZGVyO1xuXG4gICAgLy8gQSBtYXAgb2YgcHJvdmlkZXJzIHRvIHRoZSB1c2VyJ3MgbGlzdCBvZiB1bmlxdWUgaWRlbnRpZmllcnMgZnJvbVxuICAgIC8vIGVhY2ggcHJvdmlkZXJcbiAgICBpZGVudGl0aWVzPzogeyBbcHJvdmlkZXIgaW4gRmlyZWJhc2VTaWduSW5Qcm92aWRlcl0/OiBzdHJpbmdbXSB9O1xuICB9O1xuXG4gIC8vIEN1c3RvbSBjbGFpbXMgc2V0IGJ5IHRoZSBkZXZlbG9wZXJcbiAgW2NsYWltOiBzdHJpbmddOiB1bmtub3duO1xuXG4gIHVpZD86IG5ldmVyOyAvLyBUcnkgdG8gY2F0Y2ggYSBjb21tb24gbWlzdGFrZSBvZiBcInVpZFwiIChzaG91bGQgYmUgXCJzdWJcIiBpbnN0ZWFkKS5cbn1cblxuZXhwb3J0IHR5cGUgRW11bGF0b3JNb2NrVG9rZW5PcHRpb25zID0gKHsgdXNlcl9pZDogc3RyaW5nIH0gfCB7IHN1Yjogc3RyaW5nIH0pICZcbiAgUGFydGlhbDxGaXJlYmFzZUlkVG9rZW4+O1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlTW9ja1VzZXJUb2tlbihcbiAgdG9rZW46IEVtdWxhdG9yTW9ja1Rva2VuT3B0aW9ucyxcbiAgcHJvamVjdElkPzogc3RyaW5nXG4pOiBzdHJpbmcge1xuICBpZiAodG9rZW4udWlkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgJ1RoZSBcInVpZFwiIGZpZWxkIGlzIG5vIGxvbmdlciBzdXBwb3J0ZWQgYnkgbW9ja1VzZXJUb2tlbi4gUGxlYXNlIHVzZSBcInN1YlwiIGluc3RlYWQgZm9yIEZpcmViYXNlIEF1dGggVXNlciBJRC4nXG4gICAgKTtcbiAgfVxuICAvLyBVbnNlY3VyZWQgSldUcyB1c2UgXCJub25lXCIgYXMgdGhlIGFsZ29yaXRobS5cbiAgY29uc3QgaGVhZGVyID0ge1xuICAgIGFsZzogJ25vbmUnLFxuICAgIHR5cGU6ICdKV1QnXG4gIH07XG5cbiAgY29uc3QgcHJvamVjdCA9IHByb2plY3RJZCB8fCAnZGVtby1wcm9qZWN0JztcbiAgY29uc3QgaWF0ID0gdG9rZW4uaWF0IHx8IDA7XG4gIGNvbnN0IHN1YiA9IHRva2VuLnN1YiB8fCB0b2tlbi51c2VyX2lkO1xuICBpZiAoIXN1Yikge1xuICAgIHRocm93IG5ldyBFcnJvcihcIm1vY2tVc2VyVG9rZW4gbXVzdCBjb250YWluICdzdWInIG9yICd1c2VyX2lkJyBmaWVsZCFcIik7XG4gIH1cblxuICBjb25zdCBwYXlsb2FkOiBGaXJlYmFzZUlkVG9rZW4gPSB7XG4gICAgLy8gU2V0IGFsbCByZXF1aXJlZCBmaWVsZHMgdG8gZGVjZW50IGRlZmF1bHRzXG4gICAgaXNzOiBgaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tLyR7cHJvamVjdH1gLFxuICAgIGF1ZDogcHJvamVjdCxcbiAgICBpYXQsXG4gICAgZXhwOiBpYXQgKyAzNjAwLFxuICAgIGF1dGhfdGltZTogaWF0LFxuICAgIHN1YixcbiAgICB1c2VyX2lkOiBzdWIsXG4gICAgZmlyZWJhc2U6IHtcbiAgICAgIHNpZ25faW5fcHJvdmlkZXI6ICdjdXN0b20nLFxuICAgICAgaWRlbnRpdGllczoge31cbiAgICB9LFxuXG4gICAgLy8gT3ZlcnJpZGUgd2l0aCB1c2VyIG9wdGlvbnNcbiAgICAuLi50b2tlblxuICB9O1xuXG4gIC8vIFVuc2VjdXJlZCBKV1RzIHVzZSB0aGUgZW1wdHkgc3RyaW5nIGFzIGEgc2lnbmF0dXJlLlxuICBjb25zdCBzaWduYXR1cmUgPSAnJztcbiAgcmV0dXJuIFtcbiAgICBiYXNlNjR1cmxFbmNvZGVXaXRob3V0UGFkZGluZyhKU09OLnN0cmluZ2lmeShoZWFkZXIpKSxcbiAgICBiYXNlNjR1cmxFbmNvZGVXaXRob3V0UGFkZGluZyhKU09OLnN0cmluZ2lmeShwYXlsb2FkKSksXG4gICAgc2lnbmF0dXJlXG4gIF0uam9pbignLicpO1xufVxuIiwgIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTENcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IENPTlNUQU5UUyB9IGZyb20gJy4vY29uc3RhbnRzJztcbmltcG9ydCB7IGdldERlZmF1bHRzIH0gZnJvbSAnLi9kZWZhdWx0cyc7XG5cbi8qKlxuICogUmV0dXJucyBuYXZpZ2F0b3IudXNlckFnZW50IHN0cmluZyBvciAnJyBpZiBpdCdzIG5vdCBkZWZpbmVkLlxuICogQHJldHVybiB1c2VyIGFnZW50IHN0cmluZ1xuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0VUEoKTogc3RyaW5nIHtcbiAgaWYgKFxuICAgIHR5cGVvZiBuYXZpZ2F0b3IgIT09ICd1bmRlZmluZWQnICYmXG4gICAgdHlwZW9mIG5hdmlnYXRvclsndXNlckFnZW50J10gPT09ICdzdHJpbmcnXG4gICkge1xuICAgIHJldHVybiBuYXZpZ2F0b3JbJ3VzZXJBZ2VudCddO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiAnJztcbiAgfVxufVxuXG4vKipcbiAqIERldGVjdCBDb3Jkb3ZhIC8gUGhvbmVHYXAgLyBJb25pYyBmcmFtZXdvcmtzIG9uIGEgbW9iaWxlIGRldmljZS5cbiAqXG4gKiBEZWxpYmVyYXRlbHkgZG9lcyBub3QgcmVseSBvbiBjaGVja2luZyBgZmlsZTovL2AgVVJMcyAoYXMgdGhpcyBmYWlscyBQaG9uZUdhcFxuICogaW4gdGhlIFJpcHBsZSBlbXVsYXRvcikgbm9yIENvcmRvdmEgYG9uRGV2aWNlUmVhZHlgLCB3aGljaCB3b3VsZCBub3JtYWxseVxuICogd2FpdCBmb3IgYSBjYWxsYmFjay5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzTW9iaWxlQ29yZG92YSgpOiBib29sZWFuIHtcbiAgcmV0dXJuIChcbiAgICB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJlxuICAgIC8vIEB0cy1pZ25vcmUgU2V0dGluZyB1cCBhbiBicm9hZGx5IGFwcGxpY2FibGUgaW5kZXggc2lnbmF0dXJlIGZvciBXaW5kb3dcbiAgICAvLyBqdXN0IHRvIGRlYWwgd2l0aCB0aGlzIGNhc2Ugd291bGQgcHJvYmFibHkgYmUgYSBiYWQgaWRlYS5cbiAgICAhISh3aW5kb3dbJ2NvcmRvdmEnXSB8fCB3aW5kb3dbJ3Bob25lZ2FwJ10gfHwgd2luZG93WydQaG9uZUdhcCddKSAmJlxuICAgIC9pb3N8aXBob25lfGlwb2R8aXBhZHxhbmRyb2lkfGJsYWNrYmVycnl8aWVtb2JpbGUvaS50ZXN0KGdldFVBKCkpXG4gICk7XG59XG5cbi8qKlxuICogRGV0ZWN0IE5vZGUuanMuXG4gKlxuICogQHJldHVybiB0cnVlIGlmIE5vZGUuanMgZW52aXJvbm1lbnQgaXMgZGV0ZWN0ZWQgb3Igc3BlY2lmaWVkLlxuICovXG4vLyBOb2RlIGRldGVjdGlvbiBsb2dpYyBmcm9tOiBodHRwczovL2dpdGh1Yi5jb20vaWxpYWthbi9kZXRlY3Qtbm9kZS9cbmV4cG9ydCBmdW5jdGlvbiBpc05vZGUoKTogYm9vbGVhbiB7XG4gIGNvbnN0IGZvcmNlRW52aXJvbm1lbnQgPSBnZXREZWZhdWx0cygpPy5mb3JjZUVudmlyb25tZW50O1xuICBpZiAoZm9yY2VFbnZpcm9ubWVudCA9PT0gJ25vZGUnKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gZWxzZSBpZiAoZm9yY2VFbnZpcm9ubWVudCA9PT0gJ2Jyb3dzZXInKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdHJ5IHtcbiAgICByZXR1cm4gKFxuICAgICAgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGdsb2JhbC5wcm9jZXNzKSA9PT0gJ1tvYmplY3QgcHJvY2Vzc10nXG4gICAgKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG4vKipcbiAqIERldGVjdCBCcm93c2VyIEVudmlyb25tZW50XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0Jyb3dzZXIoKTogYm9vbGVhbiB7XG4gIHJldHVybiB0eXBlb2Ygc2VsZiA9PT0gJ29iamVjdCcgJiYgc2VsZi5zZWxmID09PSBzZWxmO1xufVxuXG4vKipcbiAqIERldGVjdCBicm93c2VyIGV4dGVuc2lvbnMgKENocm9tZSBhbmQgRmlyZWZveCBhdCBsZWFzdCkuXG4gKi9cbmludGVyZmFjZSBCcm93c2VyUnVudGltZSB7XG4gIGlkPzogdW5rbm93bjtcbn1cbmRlY2xhcmUgY29uc3QgY2hyb21lOiB7IHJ1bnRpbWU/OiBCcm93c2VyUnVudGltZSB9O1xuZGVjbGFyZSBjb25zdCBicm93c2VyOiB7IHJ1bnRpbWU/OiBCcm93c2VyUnVudGltZSB9O1xuZXhwb3J0IGZ1bmN0aW9uIGlzQnJvd3NlckV4dGVuc2lvbigpOiBib29sZWFuIHtcbiAgY29uc3QgcnVudGltZSA9XG4gICAgdHlwZW9mIGNocm9tZSA9PT0gJ29iamVjdCdcbiAgICAgID8gY2hyb21lLnJ1bnRpbWVcbiAgICAgIDogdHlwZW9mIGJyb3dzZXIgPT09ICdvYmplY3QnXG4gICAgICA/IGJyb3dzZXIucnVudGltZVxuICAgICAgOiB1bmRlZmluZWQ7XG4gIHJldHVybiB0eXBlb2YgcnVudGltZSA9PT0gJ29iamVjdCcgJiYgcnVudGltZS5pZCAhPT0gdW5kZWZpbmVkO1xufVxuXG4vKipcbiAqIERldGVjdCBSZWFjdCBOYXRpdmUuXG4gKlxuICogQHJldHVybiB0cnVlIGlmIFJlYWN0TmF0aXZlIGVudmlyb25tZW50IGlzIGRldGVjdGVkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNSZWFjdE5hdGl2ZSgpOiBib29sZWFuIHtcbiAgcmV0dXJuIChcbiAgICB0eXBlb2YgbmF2aWdhdG9yID09PSAnb2JqZWN0JyAmJiBuYXZpZ2F0b3JbJ3Byb2R1Y3QnXSA9PT0gJ1JlYWN0TmF0aXZlJ1xuICApO1xufVxuXG4vKiogRGV0ZWN0cyBFbGVjdHJvbiBhcHBzLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzRWxlY3Ryb24oKTogYm9vbGVhbiB7XG4gIHJldHVybiBnZXRVQSgpLmluZGV4T2YoJ0VsZWN0cm9uLycpID49IDA7XG59XG5cbi8qKiBEZXRlY3RzIEludGVybmV0IEV4cGxvcmVyLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzSUUoKTogYm9vbGVhbiB7XG4gIGNvbnN0IHVhID0gZ2V0VUEoKTtcbiAgcmV0dXJuIHVhLmluZGV4T2YoJ01TSUUgJykgPj0gMCB8fCB1YS5pbmRleE9mKCdUcmlkZW50LycpID49IDA7XG59XG5cbi8qKiBEZXRlY3RzIFVuaXZlcnNhbCBXaW5kb3dzIFBsYXRmb3JtIGFwcHMuICovXG5leHBvcnQgZnVuY3Rpb24gaXNVV1AoKTogYm9vbGVhbiB7XG4gIHJldHVybiBnZXRVQSgpLmluZGV4T2YoJ01TQXBwSG9zdC8nKSA+PSAwO1xufVxuXG4vKipcbiAqIERldGVjdCB3aGV0aGVyIHRoZSBjdXJyZW50IFNESyBidWlsZCBpcyB0aGUgTm9kZSB2ZXJzaW9uLlxuICpcbiAqIEByZXR1cm4gdHJ1ZSBpZiBpdCdzIHRoZSBOb2RlIFNESyBidWlsZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzTm9kZVNkaygpOiBib29sZWFuIHtcbiAgcmV0dXJuIENPTlNUQU5UUy5OT0RFX0NMSUVOVCA9PT0gdHJ1ZSB8fCBDT05TVEFOVFMuTk9ERV9BRE1JTiA9PT0gdHJ1ZTtcbn1cblxuLyoqIFJldHVybnMgdHJ1ZSBpZiB3ZSBhcmUgcnVubmluZyBpbiBTYWZhcmkuICovXG5leHBvcnQgZnVuY3Rpb24gaXNTYWZhcmkoKTogYm9vbGVhbiB7XG4gIHJldHVybiAoXG4gICAgIWlzTm9kZSgpICYmXG4gICAgISFuYXZpZ2F0b3IudXNlckFnZW50ICYmXG4gICAgbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmNsdWRlcygnU2FmYXJpJykgJiZcbiAgICAhbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmNsdWRlcygnQ2hyb21lJylcbiAgKTtcbn1cblxuLyoqXG4gKiBUaGlzIG1ldGhvZCBjaGVja3MgaWYgaW5kZXhlZERCIGlzIHN1cHBvcnRlZCBieSBjdXJyZW50IGJyb3dzZXIvc2VydmljZSB3b3JrZXIgY29udGV4dFxuICogQHJldHVybiB0cnVlIGlmIGluZGV4ZWREQiBpcyBzdXBwb3J0ZWQgYnkgY3VycmVudCBicm93c2VyL3NlcnZpY2Ugd29ya2VyIGNvbnRleHRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzSW5kZXhlZERCQXZhaWxhYmxlKCk6IGJvb2xlYW4ge1xuICB0cnkge1xuICAgIHJldHVybiB0eXBlb2YgaW5kZXhlZERCID09PSAnb2JqZWN0JztcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG4vKipcbiAqIFRoaXMgbWV0aG9kIHZhbGlkYXRlcyBicm93c2VyL3N3IGNvbnRleHQgZm9yIGluZGV4ZWREQiBieSBvcGVuaW5nIGEgZHVtbXkgaW5kZXhlZERCIGRhdGFiYXNlIGFuZCByZWplY3RcbiAqIGlmIGVycm9ycyBvY2N1ciBkdXJpbmcgdGhlIGRhdGFiYXNlIG9wZW4gb3BlcmF0aW9uLlxuICpcbiAqIEB0aHJvd3MgZXhjZXB0aW9uIGlmIGN1cnJlbnQgYnJvd3Nlci9zdyBjb250ZXh0IGNhbid0IHJ1biBpZGIub3BlbiAoZXg6IFNhZmFyaSBpZnJhbWUsIEZpcmVmb3hcbiAqIHByaXZhdGUgYnJvd3NpbmcpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZUluZGV4ZWREQk9wZW5hYmxlKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBsZXQgcHJlRXhpc3Q6IGJvb2xlYW4gPSB0cnVlO1xuICAgICAgY29uc3QgREJfQ0hFQ0tfTkFNRSA9XG4gICAgICAgICd2YWxpZGF0ZS1icm93c2VyLWNvbnRleHQtZm9yLWluZGV4ZWRkYi1hbmFseXRpY3MtbW9kdWxlJztcbiAgICAgIGNvbnN0IHJlcXVlc3QgPSBzZWxmLmluZGV4ZWREQi5vcGVuKERCX0NIRUNLX05BTUUpO1xuICAgICAgcmVxdWVzdC5vbnN1Y2Nlc3MgPSAoKSA9PiB7XG4gICAgICAgIHJlcXVlc3QucmVzdWx0LmNsb3NlKCk7XG4gICAgICAgIC8vIGRlbGV0ZSBkYXRhYmFzZSBvbmx5IHdoZW4gaXQgZG9lc24ndCBwcmUtZXhpc3RcbiAgICAgICAgaWYgKCFwcmVFeGlzdCkge1xuICAgICAgICAgIHNlbGYuaW5kZXhlZERCLmRlbGV0ZURhdGFiYXNlKERCX0NIRUNLX05BTUUpO1xuICAgICAgICB9XG4gICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICB9O1xuICAgICAgcmVxdWVzdC5vbnVwZ3JhZGVuZWVkZWQgPSAoKSA9PiB7XG4gICAgICAgIHByZUV4aXN0ID0gZmFsc2U7XG4gICAgICB9O1xuXG4gICAgICByZXF1ZXN0Lm9uZXJyb3IgPSAoKSA9PiB7XG4gICAgICAgIHJlamVjdChyZXF1ZXN0LmVycm9yPy5tZXNzYWdlIHx8ICcnKTtcbiAgICAgIH07XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJlamVjdChlcnJvcik7XG4gICAgfVxuICB9KTtcbn1cblxuLyoqXG4gKlxuICogVGhpcyBtZXRob2QgY2hlY2tzIHdoZXRoZXIgY29va2llIGlzIGVuYWJsZWQgd2l0aGluIGN1cnJlbnQgYnJvd3NlclxuICogQHJldHVybiB0cnVlIGlmIGNvb2tpZSBpcyBlbmFibGVkIHdpdGhpbiBjdXJyZW50IGJyb3dzZXJcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFyZUNvb2tpZXNFbmFibGVkKCk6IGJvb2xlYW4ge1xuICBpZiAodHlwZW9mIG5hdmlnYXRvciA9PT0gJ3VuZGVmaW5lZCcgfHwgIW5hdmlnYXRvci5jb29raWVFbmFibGVkKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB0cnVlO1xufVxuIiwgIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTENcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG4vKipcbiAqIEBmaWxlb3ZlcnZpZXcgU3RhbmRhcmRpemVkIEZpcmViYXNlIEVycm9yLlxuICpcbiAqIFVzYWdlOlxuICpcbiAqICAgLy8gVHlwZXNjcmlwdCBzdHJpbmcgbGl0ZXJhbHMgZm9yIHR5cGUtc2FmZSBjb2Rlc1xuICogICB0eXBlIEVyciA9XG4gKiAgICAgJ3Vua25vd24nIHxcbiAqICAgICAnb2JqZWN0LW5vdC1mb3VuZCdcbiAqICAgICA7XG4gKlxuICogICAvLyBDbG9zdXJlIGVudW0gZm9yIHR5cGUtc2FmZSBlcnJvciBjb2Rlc1xuICogICAvLyBhdC1lbnVtIHtzdHJpbmd9XG4gKiAgIHZhciBFcnIgPSB7XG4gKiAgICAgVU5LTk9XTjogJ3Vua25vd24nLFxuICogICAgIE9CSkVDVF9OT1RfRk9VTkQ6ICdvYmplY3Qtbm90LWZvdW5kJyxcbiAqICAgfVxuICpcbiAqICAgbGV0IGVycm9yczogTWFwPEVyciwgc3RyaW5nPiA9IHtcbiAqICAgICAnZ2VuZXJpYy1lcnJvcic6IFwiVW5rbm93biBlcnJvclwiLFxuICogICAgICdmaWxlLW5vdC1mb3VuZCc6IFwiQ291bGQgbm90IGZpbmQgZmlsZTogeyRmaWxlfVwiLFxuICogICB9O1xuICpcbiAqICAgLy8gVHlwZS1zYWZlIGZ1bmN0aW9uIC0gbXVzdCBwYXNzIGEgdmFsaWQgZXJyb3IgY29kZSBhcyBwYXJhbS5cbiAqICAgbGV0IGVycm9yID0gbmV3IEVycm9yRmFjdG9yeTxFcnI+KCdzZXJ2aWNlJywgJ1NlcnZpY2UnLCBlcnJvcnMpO1xuICpcbiAqICAgLi4uXG4gKiAgIHRocm93IGVycm9yLmNyZWF0ZShFcnIuR0VORVJJQyk7XG4gKiAgIC4uLlxuICogICB0aHJvdyBlcnJvci5jcmVhdGUoRXJyLkZJTEVfTk9UX0ZPVU5ELCB7J2ZpbGUnOiBmaWxlTmFtZX0pO1xuICogICAuLi5cbiAqICAgLy8gU2VydmljZTogQ291bGQgbm90IGZpbGUgZmlsZTogZm9vLnR4dCAoc2VydmljZS9maWxlLW5vdC1mb3VuZCkuXG4gKlxuICogICBjYXRjaCAoZSkge1xuICogICAgIGFzc2VydChlLm1lc3NhZ2UgPT09IFwiQ291bGQgbm90IGZpbmQgZmlsZTogZm9vLnR4dC5cIik7XG4gKiAgICAgaWYgKChlIGFzIEZpcmViYXNlRXJyb3IpPy5jb2RlID09PSAnc2VydmljZS9maWxlLW5vdC1mb3VuZCcpIHtcbiAqICAgICAgIGNvbnNvbGUubG9nKFwiQ291bGQgbm90IHJlYWQgZmlsZTogXCIgKyBlWydmaWxlJ10pO1xuICogICAgIH1cbiAqICAgfVxuICovXG5cbmV4cG9ydCB0eXBlIEVycm9yTWFwPEVycm9yQ29kZSBleHRlbmRzIHN0cmluZz4gPSB7XG4gIHJlYWRvbmx5IFtLIGluIEVycm9yQ29kZV06IHN0cmluZztcbn07XG5cbmNvbnN0IEVSUk9SX05BTUUgPSAnRmlyZWJhc2VFcnJvcic7XG5cbmV4cG9ydCBpbnRlcmZhY2UgU3RyaW5nTGlrZSB7XG4gIHRvU3RyaW5nKCk6IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBFcnJvckRhdGEge1xuICBba2V5OiBzdHJpbmddOiB1bmtub3duO1xufVxuXG4vLyBCYXNlZCBvbiBjb2RlIGZyb206XG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9FcnJvciNDdXN0b21fRXJyb3JfVHlwZXNcbmV4cG9ydCBjbGFzcyBGaXJlYmFzZUVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICAvKiogVGhlIGN1c3RvbSBuYW1lIGZvciBhbGwgRmlyZWJhc2VFcnJvcnMuICovXG4gIHJlYWRvbmx5IG5hbWU6IHN0cmluZyA9IEVSUk9SX05BTUU7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgLyoqIFRoZSBlcnJvciBjb2RlIGZvciB0aGlzIGVycm9yLiAqL1xuICAgIHJlYWRvbmx5IGNvZGU6IHN0cmluZyxcbiAgICBtZXNzYWdlOiBzdHJpbmcsXG4gICAgLyoqIEN1c3RvbSBkYXRhIGZvciB0aGlzIGVycm9yLiAqL1xuICAgIHB1YmxpYyBjdXN0b21EYXRhPzogUmVjb3JkPHN0cmluZywgdW5rbm93bj5cbiAgKSB7XG4gICAgc3VwZXIobWVzc2FnZSk7XG5cbiAgICAvLyBGaXggRm9yIEVTNVxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvVHlwZVNjcmlwdC13aWtpL2Jsb2IvbWFzdGVyL0JyZWFraW5nLUNoYW5nZXMubWQjZXh0ZW5kaW5nLWJ1aWx0LWlucy1saWtlLWVycm9yLWFycmF5LWFuZC1tYXAtbWF5LW5vLWxvbmdlci13b3JrXG4gICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKHRoaXMsIEZpcmViYXNlRXJyb3IucHJvdG90eXBlKTtcblxuICAgIC8vIE1haW50YWlucyBwcm9wZXIgc3RhY2sgdHJhY2UgZm9yIHdoZXJlIG91ciBlcnJvciB3YXMgdGhyb3duLlxuICAgIC8vIE9ubHkgYXZhaWxhYmxlIG9uIFY4LlxuICAgIGlmIChFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSkge1xuICAgICAgRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UodGhpcywgRXJyb3JGYWN0b3J5LnByb3RvdHlwZS5jcmVhdGUpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgRXJyb3JGYWN0b3J5PFxuICBFcnJvckNvZGUgZXh0ZW5kcyBzdHJpbmcsXG4gIEVycm9yUGFyYW1zIGV4dGVuZHMgeyByZWFkb25seSBbSyBpbiBFcnJvckNvZGVdPzogRXJyb3JEYXRhIH0gPSB7fVxuPiB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcmVhZG9ubHkgc2VydmljZTogc3RyaW5nLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgc2VydmljZU5hbWU6IHN0cmluZyxcbiAgICBwcml2YXRlIHJlYWRvbmx5IGVycm9yczogRXJyb3JNYXA8RXJyb3JDb2RlPlxuICApIHt9XG5cbiAgY3JlYXRlPEsgZXh0ZW5kcyBFcnJvckNvZGU+KFxuICAgIGNvZGU6IEssXG4gICAgLi4uZGF0YTogSyBleHRlbmRzIGtleW9mIEVycm9yUGFyYW1zID8gW0Vycm9yUGFyYW1zW0tdXSA6IFtdXG4gICk6IEZpcmViYXNlRXJyb3Ige1xuICAgIGNvbnN0IGN1c3RvbURhdGEgPSAoZGF0YVswXSBhcyBFcnJvckRhdGEpIHx8IHt9O1xuICAgIGNvbnN0IGZ1bGxDb2RlID0gYCR7dGhpcy5zZXJ2aWNlfS8ke2NvZGV9YDtcbiAgICBjb25zdCB0ZW1wbGF0ZSA9IHRoaXMuZXJyb3JzW2NvZGVdO1xuXG4gICAgY29uc3QgbWVzc2FnZSA9IHRlbXBsYXRlID8gcmVwbGFjZVRlbXBsYXRlKHRlbXBsYXRlLCBjdXN0b21EYXRhKSA6ICdFcnJvcic7XG4gICAgLy8gU2VydmljZSBOYW1lOiBFcnJvciBtZXNzYWdlIChzZXJ2aWNlL2NvZGUpLlxuICAgIGNvbnN0IGZ1bGxNZXNzYWdlID0gYCR7dGhpcy5zZXJ2aWNlTmFtZX06ICR7bWVzc2FnZX0gKCR7ZnVsbENvZGV9KS5gO1xuXG4gICAgY29uc3QgZXJyb3IgPSBuZXcgRmlyZWJhc2VFcnJvcihmdWxsQ29kZSwgZnVsbE1lc3NhZ2UsIGN1c3RvbURhdGEpO1xuXG4gICAgcmV0dXJuIGVycm9yO1xuICB9XG59XG5cbmZ1bmN0aW9uIHJlcGxhY2VUZW1wbGF0ZSh0ZW1wbGF0ZTogc3RyaW5nLCBkYXRhOiBFcnJvckRhdGEpOiBzdHJpbmcge1xuICByZXR1cm4gdGVtcGxhdGUucmVwbGFjZShQQVRURVJOLCAoXywga2V5KSA9PiB7XG4gICAgY29uc3QgdmFsdWUgPSBkYXRhW2tleV07XG4gICAgcmV0dXJuIHZhbHVlICE9IG51bGwgPyBTdHJpbmcodmFsdWUpIDogYDwke2tleX0/PmA7XG4gIH0pO1xufVxuXG5jb25zdCBQQVRURVJOID0gL1xce1xcJChbXn1dKyl9L2c7XG4iLCAiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQ1xuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLyoqXG4gKiBFdmFsdWF0ZXMgYSBKU09OIHN0cmluZyBpbnRvIGEgamF2YXNjcmlwdCBvYmplY3QuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHN0ciBBIHN0cmluZyBjb250YWluaW5nIEpTT04uXG4gKiBAcmV0dXJuIHsqfSBUaGUgamF2YXNjcmlwdCBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBzcGVjaWZpZWQgSlNPTi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGpzb25FdmFsKHN0cjogc3RyaW5nKTogdW5rbm93biB7XG4gIHJldHVybiBKU09OLnBhcnNlKHN0cik7XG59XG5cbi8qKlxuICogUmV0dXJucyBKU09OIHJlcHJlc2VudGluZyBhIGphdmFzY3JpcHQgb2JqZWN0LlxuICogQHBhcmFtIHsqfSBkYXRhIEphdmFzY3JpcHQgb2JqZWN0IHRvIGJlIHN0cmluZ2lmaWVkLlxuICogQHJldHVybiB7c3RyaW5nfSBUaGUgSlNPTiBjb250ZW50cyBvZiB0aGUgb2JqZWN0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gc3RyaW5naWZ5KGRhdGE6IHVua25vd24pOiBzdHJpbmcge1xuICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoZGF0YSk7XG59XG4iLCAiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQ1xuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgYmFzZTY0RGVjb2RlIH0gZnJvbSAnLi9jcnlwdCc7XG5pbXBvcnQgeyBqc29uRXZhbCB9IGZyb20gJy4vanNvbic7XG5cbmludGVyZmFjZSBDbGFpbXMge1xuICBba2V5OiBzdHJpbmddOiB7fTtcbn1cblxuaW50ZXJmYWNlIERlY29kZWRUb2tlbiB7XG4gIGhlYWRlcjogb2JqZWN0O1xuICBjbGFpbXM6IENsYWltcztcbiAgZGF0YTogb2JqZWN0O1xuICBzaWduYXR1cmU6IHN0cmluZztcbn1cblxuLyoqXG4gKiBEZWNvZGVzIGEgRmlyZWJhc2UgYXV0aC4gdG9rZW4gaW50byBjb25zdGl0dWVudCBwYXJ0cy5cbiAqXG4gKiBOb3RlczpcbiAqIC0gTWF5IHJldHVybiB3aXRoIGludmFsaWQgLyBpbmNvbXBsZXRlIGNsYWltcyBpZiB0aGVyZSdzIG5vIG5hdGl2ZSBiYXNlNjQgZGVjb2Rpbmcgc3VwcG9ydC5cbiAqIC0gRG9lc24ndCBjaGVjayBpZiB0aGUgdG9rZW4gaXMgYWN0dWFsbHkgdmFsaWQuXG4gKi9cbmV4cG9ydCBjb25zdCBkZWNvZGUgPSBmdW5jdGlvbiAodG9rZW46IHN0cmluZyk6IERlY29kZWRUb2tlbiB7XG4gIGxldCBoZWFkZXIgPSB7fSxcbiAgICBjbGFpbXM6IENsYWltcyA9IHt9LFxuICAgIGRhdGEgPSB7fSxcbiAgICBzaWduYXR1cmUgPSAnJztcblxuICB0cnkge1xuICAgIGNvbnN0IHBhcnRzID0gdG9rZW4uc3BsaXQoJy4nKTtcbiAgICBoZWFkZXIgPSBqc29uRXZhbChiYXNlNjREZWNvZGUocGFydHNbMF0pIHx8ICcnKSBhcyBvYmplY3Q7XG4gICAgY2xhaW1zID0ganNvbkV2YWwoYmFzZTY0RGVjb2RlKHBhcnRzWzFdKSB8fCAnJykgYXMgQ2xhaW1zO1xuICAgIHNpZ25hdHVyZSA9IHBhcnRzWzJdO1xuICAgIGRhdGEgPSBjbGFpbXNbJ2QnXSB8fCB7fTtcbiAgICBkZWxldGUgY2xhaW1zWydkJ107XG4gIH0gY2F0Y2ggKGUpIHt9XG5cbiAgcmV0dXJuIHtcbiAgICBoZWFkZXIsXG4gICAgY2xhaW1zLFxuICAgIGRhdGEsXG4gICAgc2lnbmF0dXJlXG4gIH07XG59O1xuXG5pbnRlcmZhY2UgRGVjb2RlZFRva2VuIHtcbiAgaGVhZGVyOiBvYmplY3Q7XG4gIGNsYWltczogQ2xhaW1zO1xuICBkYXRhOiBvYmplY3Q7XG4gIHNpZ25hdHVyZTogc3RyaW5nO1xufVxuXG4vKipcbiAqIERlY29kZXMgYSBGaXJlYmFzZSBhdXRoLiB0b2tlbiBhbmQgY2hlY2tzIHRoZSB2YWxpZGl0eSBvZiBpdHMgdGltZS1iYXNlZCBjbGFpbXMuIFdpbGwgcmV0dXJuIHRydWUgaWYgdGhlXG4gKiB0b2tlbiBpcyB3aXRoaW4gdGhlIHRpbWUgd2luZG93IGF1dGhvcml6ZWQgYnkgdGhlICduYmYnIChub3QtYmVmb3JlKSBhbmQgJ2lhdCcgKGlzc3VlZC1hdCkgY2xhaW1zLlxuICpcbiAqIE5vdGVzOlxuICogLSBNYXkgcmV0dXJuIGEgZmFsc2UgbmVnYXRpdmUgaWYgdGhlcmUncyBubyBuYXRpdmUgYmFzZTY0IGRlY29kaW5nIHN1cHBvcnQuXG4gKiAtIERvZXNuJ3QgY2hlY2sgaWYgdGhlIHRva2VuIGlzIGFjdHVhbGx5IHZhbGlkLlxuICovXG5leHBvcnQgY29uc3QgaXNWYWxpZFRpbWVzdGFtcCA9IGZ1bmN0aW9uICh0b2tlbjogc3RyaW5nKTogYm9vbGVhbiB7XG4gIGNvbnN0IGNsYWltczogQ2xhaW1zID0gZGVjb2RlKHRva2VuKS5jbGFpbXM7XG4gIGNvbnN0IG5vdzogbnVtYmVyID0gTWF0aC5mbG9vcihuZXcgRGF0ZSgpLmdldFRpbWUoKSAvIDEwMDApO1xuICBsZXQgdmFsaWRTaW5jZTogbnVtYmVyID0gMCxcbiAgICB2YWxpZFVudGlsOiBudW1iZXIgPSAwO1xuXG4gIGlmICh0eXBlb2YgY2xhaW1zID09PSAnb2JqZWN0Jykge1xuICAgIGlmIChjbGFpbXMuaGFzT3duUHJvcGVydHkoJ25iZicpKSB7XG4gICAgICB2YWxpZFNpbmNlID0gY2xhaW1zWyduYmYnXSBhcyBudW1iZXI7XG4gICAgfSBlbHNlIGlmIChjbGFpbXMuaGFzT3duUHJvcGVydHkoJ2lhdCcpKSB7XG4gICAgICB2YWxpZFNpbmNlID0gY2xhaW1zWydpYXQnXSBhcyBudW1iZXI7XG4gICAgfVxuXG4gICAgaWYgKGNsYWltcy5oYXNPd25Qcm9wZXJ0eSgnZXhwJykpIHtcbiAgICAgIHZhbGlkVW50aWwgPSBjbGFpbXNbJ2V4cCddIGFzIG51bWJlcjtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gdG9rZW4gd2lsbCBleHBpcmUgYWZ0ZXIgMjRoIGJ5IGRlZmF1bHRcbiAgICAgIHZhbGlkVW50aWwgPSB2YWxpZFNpbmNlICsgODY0MDA7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIChcbiAgICAhIW5vdyAmJlxuICAgICEhdmFsaWRTaW5jZSAmJlxuICAgICEhdmFsaWRVbnRpbCAmJlxuICAgIG5vdyA+PSB2YWxpZFNpbmNlICYmXG4gICAgbm93IDw9IHZhbGlkVW50aWxcbiAgKTtcbn07XG5cbi8qKlxuICogRGVjb2RlcyBhIEZpcmViYXNlIGF1dGguIHRva2VuIGFuZCByZXR1cm5zIGl0cyBpc3N1ZWQgYXQgdGltZSBpZiB2YWxpZCwgbnVsbCBvdGhlcndpc2UuXG4gKlxuICogTm90ZXM6XG4gKiAtIE1heSByZXR1cm4gbnVsbCBpZiB0aGVyZSdzIG5vIG5hdGl2ZSBiYXNlNjQgZGVjb2Rpbmcgc3VwcG9ydC5cbiAqIC0gRG9lc24ndCBjaGVjayBpZiB0aGUgdG9rZW4gaXMgYWN0dWFsbHkgdmFsaWQuXG4gKi9cbmV4cG9ydCBjb25zdCBpc3N1ZWRBdFRpbWUgPSBmdW5jdGlvbiAodG9rZW46IHN0cmluZyk6IG51bWJlciB8IG51bGwge1xuICBjb25zdCBjbGFpbXM6IENsYWltcyA9IGRlY29kZSh0b2tlbikuY2xhaW1zO1xuICBpZiAodHlwZW9mIGNsYWltcyA9PT0gJ29iamVjdCcgJiYgY2xhaW1zLmhhc093blByb3BlcnR5KCdpYXQnKSkge1xuICAgIHJldHVybiBjbGFpbXNbJ2lhdCddIGFzIG51bWJlcjtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn07XG5cbi8qKlxuICogRGVjb2RlcyBhIEZpcmViYXNlIGF1dGguIHRva2VuIGFuZCBjaGVja3MgdGhlIHZhbGlkaXR5IG9mIGl0cyBmb3JtYXQuIEV4cGVjdHMgYSB2YWxpZCBpc3N1ZWQtYXQgdGltZS5cbiAqXG4gKiBOb3RlczpcbiAqIC0gTWF5IHJldHVybiBhIGZhbHNlIG5lZ2F0aXZlIGlmIHRoZXJlJ3Mgbm8gbmF0aXZlIGJhc2U2NCBkZWNvZGluZyBzdXBwb3J0LlxuICogLSBEb2Vzbid0IGNoZWNrIGlmIHRoZSB0b2tlbiBpcyBhY3R1YWxseSB2YWxpZC5cbiAqL1xuZXhwb3J0IGNvbnN0IGlzVmFsaWRGb3JtYXQgPSBmdW5jdGlvbiAodG9rZW46IHN0cmluZyk6IGJvb2xlYW4ge1xuICBjb25zdCBkZWNvZGVkID0gZGVjb2RlKHRva2VuKSxcbiAgICBjbGFpbXMgPSBkZWNvZGVkLmNsYWltcztcblxuICByZXR1cm4gISFjbGFpbXMgJiYgdHlwZW9mIGNsYWltcyA9PT0gJ29iamVjdCcgJiYgY2xhaW1zLmhhc093blByb3BlcnR5KCdpYXQnKTtcbn07XG5cbi8qKlxuICogQXR0ZW1wdHMgdG8gcGVlciBpbnRvIGFuIGF1dGggdG9rZW4gYW5kIGRldGVybWluZSBpZiBpdCdzIGFuIGFkbWluIGF1dGggdG9rZW4gYnkgbG9va2luZyBhdCB0aGUgY2xhaW1zIHBvcnRpb24uXG4gKlxuICogTm90ZXM6XG4gKiAtIE1heSByZXR1cm4gYSBmYWxzZSBuZWdhdGl2ZSBpZiB0aGVyZSdzIG5vIG5hdGl2ZSBiYXNlNjQgZGVjb2Rpbmcgc3VwcG9ydC5cbiAqIC0gRG9lc24ndCBjaGVjayBpZiB0aGUgdG9rZW4gaXMgYWN0dWFsbHkgdmFsaWQuXG4gKi9cbmV4cG9ydCBjb25zdCBpc0FkbWluID0gZnVuY3Rpb24gKHRva2VuOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgY29uc3QgY2xhaW1zOiBDbGFpbXMgPSBkZWNvZGUodG9rZW4pLmNsYWltcztcbiAgcmV0dXJuIHR5cGVvZiBjbGFpbXMgPT09ICdvYmplY3QnICYmIGNsYWltc1snYWRtaW4nXSA9PT0gdHJ1ZTtcbn07XG4iLCAiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQ1xuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbnRhaW5zPFQgZXh0ZW5kcyBvYmplY3Q+KG9iajogVCwga2V5OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzYWZlR2V0PFQgZXh0ZW5kcyBvYmplY3QsIEsgZXh0ZW5kcyBrZXlvZiBUPihcbiAgb2JqOiBULFxuICBrZXk6IEtcbik6IFRbS10gfCB1bmRlZmluZWQge1xuICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkge1xuICAgIHJldHVybiBvYmpba2V5XTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0VtcHR5KG9iajogb2JqZWN0KTogb2JqIGlzIHt9IHtcbiAgZm9yIChjb25zdCBrZXkgaW4gb2JqKSB7XG4gICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXA8SyBleHRlbmRzIHN0cmluZywgViwgVT4oXG4gIG9iajogeyBba2V5IGluIEtdOiBWIH0sXG4gIGZuOiAodmFsdWU6IFYsIGtleTogSywgb2JqOiB7IFtrZXkgaW4gS106IFYgfSkgPT4gVSxcbiAgY29udGV4dE9iaj86IHVua25vd25cbik6IHsgW2tleSBpbiBLXTogVSB9IHtcbiAgY29uc3QgcmVzOiBQYXJ0aWFsPHsgW2tleSBpbiBLXTogVSB9PiA9IHt9O1xuICBmb3IgKGNvbnN0IGtleSBpbiBvYmopIHtcbiAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkge1xuICAgICAgcmVzW2tleV0gPSBmbi5jYWxsKGNvbnRleHRPYmosIG9ialtrZXldLCBrZXksIG9iaik7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXMgYXMgeyBba2V5IGluIEtdOiBVIH07XG59XG5cbi8qKlxuICogRGVlcCBlcXVhbCB0d28gb2JqZWN0cy4gU3VwcG9ydCBBcnJheXMgYW5kIE9iamVjdHMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWVwRXF1YWwoYTogb2JqZWN0LCBiOiBvYmplY3QpOiBib29sZWFuIHtcbiAgaWYgKGEgPT09IGIpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGNvbnN0IGFLZXlzID0gT2JqZWN0LmtleXMoYSk7XG4gIGNvbnN0IGJLZXlzID0gT2JqZWN0LmtleXMoYik7XG4gIGZvciAoY29uc3QgayBvZiBhS2V5cykge1xuICAgIGlmICghYktleXMuaW5jbHVkZXMoaykpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBhUHJvcCA9IChhIGFzIFJlY29yZDxzdHJpbmcsIHVua25vd24+KVtrXTtcbiAgICBjb25zdCBiUHJvcCA9IChiIGFzIFJlY29yZDxzdHJpbmcsIHVua25vd24+KVtrXTtcbiAgICBpZiAoaXNPYmplY3QoYVByb3ApICYmIGlzT2JqZWN0KGJQcm9wKSkge1xuICAgICAgaWYgKCFkZWVwRXF1YWwoYVByb3AsIGJQcm9wKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChhUHJvcCAhPT0gYlByb3ApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBmb3IgKGNvbnN0IGsgb2YgYktleXMpIHtcbiAgICBpZiAoIWFLZXlzLmluY2x1ZGVzKGspKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBpc09iamVjdCh0aGluZzogdW5rbm93bik6IHRoaW5nIGlzIG9iamVjdCB7XG4gIHJldHVybiB0aGluZyAhPT0gbnVsbCAmJiB0eXBlb2YgdGhpbmcgPT09ICdvYmplY3QnO1xufVxuIiwgIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIyIEdvb2dsZSBMTENcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IERlZmVycmVkIH0gZnJvbSAnLi9kZWZlcnJlZCc7XG5cbi8qKlxuICogUmVqZWN0cyBpZiB0aGUgZ2l2ZW4gcHJvbWlzZSBkb2Vzbid0IHJlc29sdmUgaW4gdGltZUluTVMgbWlsbGlzZWNvbmRzLlxuICogQGludGVybmFsXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwcm9taXNlV2l0aFRpbWVvdXQ8VD4oXG4gIHByb21pc2U6IFByb21pc2U8VD4sXG4gIHRpbWVJbk1TID0gMjAwMFxuKTogUHJvbWlzZTxUPiB7XG4gIGNvbnN0IGRlZmVycmVkUHJvbWlzZSA9IG5ldyBEZWZlcnJlZDxUPigpO1xuICBzZXRUaW1lb3V0KCgpID0+IGRlZmVycmVkUHJvbWlzZS5yZWplY3QoJ3RpbWVvdXQhJyksIHRpbWVJbk1TKTtcbiAgcHJvbWlzZS50aGVuKGRlZmVycmVkUHJvbWlzZS5yZXNvbHZlLCBkZWZlcnJlZFByb21pc2UucmVqZWN0KTtcbiAgcmV0dXJuIGRlZmVycmVkUHJvbWlzZS5wcm9taXNlO1xufVxuIiwgIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTENcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8qKlxuICogUmV0dXJucyBhIHF1ZXJ5c3RyaW5nLWZvcm1hdHRlZCBzdHJpbmcgKGUuZy4gJmFyZz12YWwmYXJnMj12YWwyKSBmcm9tIGFcbiAqIHBhcmFtcyBvYmplY3QgKGUuZy4ge2FyZzogJ3ZhbCcsIGFyZzI6ICd2YWwyJ30pXG4gKiBOb3RlOiBZb3UgbXVzdCBwcmVwZW5kIGl0IHdpdGggPyB3aGVuIGFkZGluZyBpdCB0byBhIFVSTC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHF1ZXJ5c3RyaW5nKHF1ZXJ5c3RyaW5nUGFyYW1zOiB7XG4gIFtrZXk6IHN0cmluZ106IHN0cmluZyB8IG51bWJlcjtcbn0pOiBzdHJpbmcge1xuICBjb25zdCBwYXJhbXMgPSBbXTtcbiAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMocXVlcnlzdHJpbmdQYXJhbXMpKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICB2YWx1ZS5mb3JFYWNoKGFycmF5VmFsID0+IHtcbiAgICAgICAgcGFyYW1zLnB1c2goXG4gICAgICAgICAgZW5jb2RlVVJJQ29tcG9uZW50KGtleSkgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQoYXJyYXlWYWwpXG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGFyYW1zLnB1c2goZW5jb2RlVVJJQ29tcG9uZW50KGtleSkgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQodmFsdWUpKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHBhcmFtcy5sZW5ndGggPyAnJicgKyBwYXJhbXMuam9pbignJicpIDogJyc7XG59XG5cbi8qKlxuICogRGVjb2RlcyBhIHF1ZXJ5c3RyaW5nIChlLmcuID9hcmc9dmFsJmFyZzI9dmFsMikgaW50byBhIHBhcmFtcyBvYmplY3RcbiAqIChlLmcuIHthcmc6ICd2YWwnLCBhcmcyOiAndmFsMid9KVxuICovXG5leHBvcnQgZnVuY3Rpb24gcXVlcnlzdHJpbmdEZWNvZGUocXVlcnlzdHJpbmc6IHN0cmluZyk6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4ge1xuICBjb25zdCBvYmo6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcbiAgY29uc3QgdG9rZW5zID0gcXVlcnlzdHJpbmcucmVwbGFjZSgvXlxcPy8sICcnKS5zcGxpdCgnJicpO1xuXG4gIHRva2Vucy5mb3JFYWNoKHRva2VuID0+IHtcbiAgICBpZiAodG9rZW4pIHtcbiAgICAgIGNvbnN0IFtrZXksIHZhbHVlXSA9IHRva2VuLnNwbGl0KCc9Jyk7XG4gICAgICBvYmpbZGVjb2RlVVJJQ29tcG9uZW50KGtleSldID0gZGVjb2RlVVJJQ29tcG9uZW50KHZhbHVlKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gb2JqO1xufVxuXG4vKipcbiAqIEV4dHJhY3QgdGhlIHF1ZXJ5IHN0cmluZyBwYXJ0IG9mIGEgVVJMLCBpbmNsdWRpbmcgdGhlIGxlYWRpbmcgcXVlc3Rpb24gbWFyayAoaWYgcHJlc2VudCkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBleHRyYWN0UXVlcnlzdHJpbmcodXJsOiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCBxdWVyeVN0YXJ0ID0gdXJsLmluZGV4T2YoJz8nKTtcbiAgaWYgKCFxdWVyeVN0YXJ0KSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG4gIGNvbnN0IGZyYWdtZW50U3RhcnQgPSB1cmwuaW5kZXhPZignIycsIHF1ZXJ5U3RhcnQpO1xuICByZXR1cm4gdXJsLnN1YnN0cmluZyhcbiAgICBxdWVyeVN0YXJ0LFxuICAgIGZyYWdtZW50U3RhcnQgPiAwID8gZnJhZ21lbnRTdGFydCA6IHVuZGVmaW5lZFxuICApO1xufVxuIiwgIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTENcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8qKlxuICogQGZpbGVvdmVydmlldyBTSEEtMSBjcnlwdG9ncmFwaGljIGhhc2guXG4gKiBWYXJpYWJsZSBuYW1lcyBmb2xsb3cgdGhlIG5vdGF0aW9uIGluIEZJUFMgUFVCIDE4MC0zOlxuICogaHR0cDovL2NzcmMubmlzdC5nb3YvcHVibGljYXRpb25zL2ZpcHMvZmlwczE4MC0zL2ZpcHMxODAtM19maW5hbC5wZGYuXG4gKlxuICogVXNhZ2U6XG4gKiAgIHZhciBzaGExID0gbmV3IHNoYTEoKTtcbiAqICAgc2hhMS51cGRhdGUoYnl0ZXMpO1xuICogICB2YXIgaGFzaCA9IHNoYTEuZGlnZXN0KCk7XG4gKlxuICogUGVyZm9ybWFuY2U6XG4gKiAgIENocm9tZSAyMzogICB+NDAwIE1iaXQvc1xuICogICBGaXJlZm94IDE2OiAgfjI1MCBNYml0L3NcbiAqXG4gKi9cblxuLyoqXG4gKiBTSEEtMSBjcnlwdG9ncmFwaGljIGhhc2ggY29uc3RydWN0b3IuXG4gKlxuICogVGhlIHByb3BlcnRpZXMgZGVjbGFyZWQgaGVyZSBhcmUgZGlzY3Vzc2VkIGluIHRoZSBhYm92ZSBhbGdvcml0aG0gZG9jdW1lbnQuXG4gKiBAY29uc3RydWN0b3JcbiAqIEBmaW5hbFxuICogQHN0cnVjdFxuICovXG5leHBvcnQgY2xhc3MgU2hhMSB7XG4gIC8qKlxuICAgKiBIb2xkcyB0aGUgcHJldmlvdXMgdmFsdWVzIG9mIGFjY3VtdWxhdGVkIHZhcmlhYmxlcyBhLWUgaW4gdGhlIGNvbXByZXNzX1xuICAgKiBmdW5jdGlvbi5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHByaXZhdGUgY2hhaW5fOiBudW1iZXJbXSA9IFtdO1xuXG4gIC8qKlxuICAgKiBBIGJ1ZmZlciBob2xkaW5nIHRoZSBwYXJ0aWFsbHkgY29tcHV0ZWQgaGFzaCByZXN1bHQuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBwcml2YXRlIGJ1Zl86IG51bWJlcltdID0gW107XG5cbiAgLyoqXG4gICAqIEFuIGFycmF5IG9mIDgwIGJ5dGVzLCBlYWNoIGEgcGFydCBvZiB0aGUgbWVzc2FnZSB0byBiZSBoYXNoZWQuICBSZWZlcnJlZCB0b1xuICAgKiBhcyB0aGUgbWVzc2FnZSBzY2hlZHVsZSBpbiB0aGUgZG9jcy5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHByaXZhdGUgV186IG51bWJlcltdID0gW107XG5cbiAgLyoqXG4gICAqIENvbnRhaW5zIGRhdGEgbmVlZGVkIHRvIHBhZCBtZXNzYWdlcyBsZXNzIHRoYW4gNjQgYnl0ZXMuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBwcml2YXRlIHBhZF86IG51bWJlcltdID0gW107XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlIHtudW1iZXJ9XG4gICAqL1xuICBwcml2YXRlIGluYnVmXzogbnVtYmVyID0gMDtcblxuICAvKipcbiAgICogQHByaXZhdGUge251bWJlcn1cbiAgICovXG4gIHByaXZhdGUgdG90YWxfOiBudW1iZXIgPSAwO1xuXG4gIGJsb2NrU2l6ZTogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuYmxvY2tTaXplID0gNTEyIC8gODtcblxuICAgIHRoaXMucGFkX1swXSA9IDEyODtcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IHRoaXMuYmxvY2tTaXplOyArK2kpIHtcbiAgICAgIHRoaXMucGFkX1tpXSA9IDA7XG4gICAgfVxuXG4gICAgdGhpcy5yZXNldCgpO1xuICB9XG5cbiAgcmVzZXQoKTogdm9pZCB7XG4gICAgdGhpcy5jaGFpbl9bMF0gPSAweDY3NDUyMzAxO1xuICAgIHRoaXMuY2hhaW5fWzFdID0gMHhlZmNkYWI4OTtcbiAgICB0aGlzLmNoYWluX1syXSA9IDB4OThiYWRjZmU7XG4gICAgdGhpcy5jaGFpbl9bM10gPSAweDEwMzI1NDc2O1xuICAgIHRoaXMuY2hhaW5fWzRdID0gMHhjM2QyZTFmMDtcblxuICAgIHRoaXMuaW5idWZfID0gMDtcbiAgICB0aGlzLnRvdGFsXyA9IDA7XG4gIH1cblxuICAvKipcbiAgICogSW50ZXJuYWwgY29tcHJlc3MgaGVscGVyIGZ1bmN0aW9uLlxuICAgKiBAcGFyYW0gYnVmIEJsb2NrIHRvIGNvbXByZXNzLlxuICAgKiBAcGFyYW0gb2Zmc2V0IE9mZnNldCBvZiB0aGUgYmxvY2sgaW4gdGhlIGJ1ZmZlci5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGNvbXByZXNzXyhidWY6IG51bWJlcltdIHwgVWludDhBcnJheSB8IHN0cmluZywgb2Zmc2V0PzogbnVtYmVyKTogdm9pZCB7XG4gICAgaWYgKCFvZmZzZXQpIHtcbiAgICAgIG9mZnNldCA9IDA7XG4gICAgfVxuXG4gICAgY29uc3QgVyA9IHRoaXMuV187XG5cbiAgICAvLyBnZXQgMTYgYmlnIGVuZGlhbiB3b3Jkc1xuICAgIGlmICh0eXBlb2YgYnVmID09PSAnc3RyaW5nJykge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxNjsgaSsrKSB7XG4gICAgICAgIC8vIFRPRE8odXNlcik6IFtidWcgODE0MDEyMl0gUmVjZW50IHZlcnNpb25zIG9mIFNhZmFyaSBmb3IgTWFjIE9TIGFuZCBpT1NcbiAgICAgICAgLy8gaGF2ZSBhIGJ1ZyB0aGF0IHR1cm5zIHRoZSBwb3N0LWluY3JlbWVudCArKyBvcGVyYXRvciBpbnRvIHByZS1pbmNyZW1lbnRcbiAgICAgICAgLy8gZHVyaW5nIEpJVCBjb21waWxhdGlvbi4gIFdlIGhhdmUgY29kZSB0aGF0IGRlcGVuZHMgaGVhdmlseSBvbiBTSEEtMSBmb3JcbiAgICAgICAgLy8gY29ycmVjdG5lc3MgYW5kIHdoaWNoIGlzIGFmZmVjdGVkIGJ5IHRoaXMgYnVnLCBzbyBJJ3ZlIHJlbW92ZWQgYWxsIHVzZXNcbiAgICAgICAgLy8gb2YgcG9zdC1pbmNyZW1lbnQgKysgaW4gd2hpY2ggdGhlIHJlc3VsdCB2YWx1ZSBpcyB1c2VkLiAgV2UgY2FuIHJldmVydFxuICAgICAgICAvLyB0aGlzIGNoYW5nZSBvbmNlIHRoZSBTYWZhcmkgYnVnXG4gICAgICAgIC8vIChodHRwczovL2J1Z3Mud2Via2l0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MTA5MDM2KSBoYXMgYmVlbiBmaXhlZCBhbmRcbiAgICAgICAgLy8gbW9zdCBjbGllbnRzIGhhdmUgYmVlbiB1cGRhdGVkLlxuICAgICAgICBXW2ldID1cbiAgICAgICAgICAoYnVmLmNoYXJDb2RlQXQob2Zmc2V0KSA8PCAyNCkgfFxuICAgICAgICAgIChidWYuY2hhckNvZGVBdChvZmZzZXQgKyAxKSA8PCAxNikgfFxuICAgICAgICAgIChidWYuY2hhckNvZGVBdChvZmZzZXQgKyAyKSA8PCA4KSB8XG4gICAgICAgICAgYnVmLmNoYXJDb2RlQXQob2Zmc2V0ICsgMyk7XG4gICAgICAgIG9mZnNldCArPSA0O1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDE2OyBpKyspIHtcbiAgICAgICAgV1tpXSA9XG4gICAgICAgICAgKGJ1ZltvZmZzZXRdIDw8IDI0KSB8XG4gICAgICAgICAgKGJ1ZltvZmZzZXQgKyAxXSA8PCAxNikgfFxuICAgICAgICAgIChidWZbb2Zmc2V0ICsgMl0gPDwgOCkgfFxuICAgICAgICAgIGJ1ZltvZmZzZXQgKyAzXTtcbiAgICAgICAgb2Zmc2V0ICs9IDQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gZXhwYW5kIHRvIDgwIHdvcmRzXG4gICAgZm9yIChsZXQgaSA9IDE2OyBpIDwgODA7IGkrKykge1xuICAgICAgY29uc3QgdCA9IFdbaSAtIDNdIF4gV1tpIC0gOF0gXiBXW2kgLSAxNF0gXiBXW2kgLSAxNl07XG4gICAgICBXW2ldID0gKCh0IDw8IDEpIHwgKHQgPj4+IDMxKSkgJiAweGZmZmZmZmZmO1xuICAgIH1cblxuICAgIGxldCBhID0gdGhpcy5jaGFpbl9bMF07XG4gICAgbGV0IGIgPSB0aGlzLmNoYWluX1sxXTtcbiAgICBsZXQgYyA9IHRoaXMuY2hhaW5fWzJdO1xuICAgIGxldCBkID0gdGhpcy5jaGFpbl9bM107XG4gICAgbGV0IGUgPSB0aGlzLmNoYWluX1s0XTtcbiAgICBsZXQgZiwgaztcblxuICAgIC8vIFRPRE8odXNlcik6IFRyeSB0byB1bnJvbGwgdGhpcyBsb29wIHRvIHNwZWVkIHVwIHRoZSBjb21wdXRhdGlvbi5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDgwOyBpKyspIHtcbiAgICAgIGlmIChpIDwgNDApIHtcbiAgICAgICAgaWYgKGkgPCAyMCkge1xuICAgICAgICAgIGYgPSBkIF4gKGIgJiAoYyBeIGQpKTtcbiAgICAgICAgICBrID0gMHg1YTgyNzk5OTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmID0gYiBeIGMgXiBkO1xuICAgICAgICAgIGsgPSAweDZlZDllYmExO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoaSA8IDYwKSB7XG4gICAgICAgICAgZiA9IChiICYgYykgfCAoZCAmIChiIHwgYykpO1xuICAgICAgICAgIGsgPSAweDhmMWJiY2RjO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGYgPSBiIF4gYyBeIGQ7XG4gICAgICAgICAgayA9IDB4Y2E2MmMxZDY7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29uc3QgdCA9ICgoKGEgPDwgNSkgfCAoYSA+Pj4gMjcpKSArIGYgKyBlICsgayArIFdbaV0pICYgMHhmZmZmZmZmZjtcbiAgICAgIGUgPSBkO1xuICAgICAgZCA9IGM7XG4gICAgICBjID0gKChiIDw8IDMwKSB8IChiID4+PiAyKSkgJiAweGZmZmZmZmZmO1xuICAgICAgYiA9IGE7XG4gICAgICBhID0gdDtcbiAgICB9XG5cbiAgICB0aGlzLmNoYWluX1swXSA9ICh0aGlzLmNoYWluX1swXSArIGEpICYgMHhmZmZmZmZmZjtcbiAgICB0aGlzLmNoYWluX1sxXSA9ICh0aGlzLmNoYWluX1sxXSArIGIpICYgMHhmZmZmZmZmZjtcbiAgICB0aGlzLmNoYWluX1syXSA9ICh0aGlzLmNoYWluX1syXSArIGMpICYgMHhmZmZmZmZmZjtcbiAgICB0aGlzLmNoYWluX1szXSA9ICh0aGlzLmNoYWluX1szXSArIGQpICYgMHhmZmZmZmZmZjtcbiAgICB0aGlzLmNoYWluX1s0XSA9ICh0aGlzLmNoYWluX1s0XSArIGUpICYgMHhmZmZmZmZmZjtcbiAgfVxuXG4gIHVwZGF0ZShieXRlcz86IG51bWJlcltdIHwgVWludDhBcnJheSB8IHN0cmluZywgbGVuZ3RoPzogbnVtYmVyKTogdm9pZCB7XG4gICAgLy8gVE9ETyhqb2hubGVueik6IHRpZ2h0ZW4gdGhlIGZ1bmN0aW9uIHNpZ25hdHVyZSBhbmQgcmVtb3ZlIHRoaXMgY2hlY2tcbiAgICBpZiAoYnl0ZXMgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCkge1xuICAgICAgbGVuZ3RoID0gYnl0ZXMubGVuZ3RoO1xuICAgIH1cblxuICAgIGNvbnN0IGxlbmd0aE1pbnVzQmxvY2sgPSBsZW5ndGggLSB0aGlzLmJsb2NrU2l6ZTtcbiAgICBsZXQgbiA9IDA7XG4gICAgLy8gVXNpbmcgbG9jYWwgaW5zdGVhZCBvZiBtZW1iZXIgdmFyaWFibGVzIGdpdmVzIH41JSBzcGVlZHVwIG9uIEZpcmVmb3ggMTYuXG4gICAgY29uc3QgYnVmID0gdGhpcy5idWZfO1xuICAgIGxldCBpbmJ1ZiA9IHRoaXMuaW5idWZfO1xuXG4gICAgLy8gVGhlIG91dGVyIHdoaWxlIGxvb3Agc2hvdWxkIGV4ZWN1dGUgYXQgbW9zdCB0d2ljZS5cbiAgICB3aGlsZSAobiA8IGxlbmd0aCkge1xuICAgICAgLy8gV2hlbiB3ZSBoYXZlIG5vIGRhdGEgaW4gdGhlIGJsb2NrIHRvIHRvcCB1cCwgd2UgY2FuIGRpcmVjdGx5IHByb2Nlc3MgdGhlXG4gICAgICAvLyBpbnB1dCBidWZmZXIgKGFzc3VtaW5nIGl0IGNvbnRhaW5zIHN1ZmZpY2llbnQgZGF0YSkuIFRoaXMgZ2l2ZXMgfjI1JVxuICAgICAgLy8gc3BlZWR1cCBvbiBDaHJvbWUgMjMgYW5kIH4xNSUgc3BlZWR1cCBvbiBGaXJlZm94IDE2LCBidXQgcmVxdWlyZXMgdGhhdFxuICAgICAgLy8gdGhlIGRhdGEgaXMgcHJvdmlkZWQgaW4gbGFyZ2UgY2h1bmtzIChvciBpbiBtdWx0aXBsZXMgb2YgNjQgYnl0ZXMpLlxuICAgICAgaWYgKGluYnVmID09PSAwKSB7XG4gICAgICAgIHdoaWxlIChuIDw9IGxlbmd0aE1pbnVzQmxvY2spIHtcbiAgICAgICAgICB0aGlzLmNvbXByZXNzXyhieXRlcywgbik7XG4gICAgICAgICAgbiArPSB0aGlzLmJsb2NrU2l6ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIGJ5dGVzID09PSAnc3RyaW5nJykge1xuICAgICAgICB3aGlsZSAobiA8IGxlbmd0aCkge1xuICAgICAgICAgIGJ1ZltpbmJ1Zl0gPSBieXRlcy5jaGFyQ29kZUF0KG4pO1xuICAgICAgICAgICsraW5idWY7XG4gICAgICAgICAgKytuO1xuICAgICAgICAgIGlmIChpbmJ1ZiA9PT0gdGhpcy5ibG9ja1NpemUpIHtcbiAgICAgICAgICAgIHRoaXMuY29tcHJlc3NfKGJ1Zik7XG4gICAgICAgICAgICBpbmJ1ZiA9IDA7XG4gICAgICAgICAgICAvLyBKdW1wIHRvIHRoZSBvdXRlciBsb29wIHNvIHdlIHVzZSB0aGUgZnVsbC1ibG9jayBvcHRpbWl6YXRpb24uXG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHdoaWxlIChuIDwgbGVuZ3RoKSB7XG4gICAgICAgICAgYnVmW2luYnVmXSA9IGJ5dGVzW25dO1xuICAgICAgICAgICsraW5idWY7XG4gICAgICAgICAgKytuO1xuICAgICAgICAgIGlmIChpbmJ1ZiA9PT0gdGhpcy5ibG9ja1NpemUpIHtcbiAgICAgICAgICAgIHRoaXMuY29tcHJlc3NfKGJ1Zik7XG4gICAgICAgICAgICBpbmJ1ZiA9IDA7XG4gICAgICAgICAgICAvLyBKdW1wIHRvIHRoZSBvdXRlciBsb29wIHNvIHdlIHVzZSB0aGUgZnVsbC1ibG9jayBvcHRpbWl6YXRpb24uXG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmluYnVmXyA9IGluYnVmO1xuICAgIHRoaXMudG90YWxfICs9IGxlbmd0aDtcbiAgfVxuXG4gIC8qKiBAb3ZlcnJpZGUgKi9cbiAgZGlnZXN0KCk6IG51bWJlcltdIHtcbiAgICBjb25zdCBkaWdlc3Q6IG51bWJlcltdID0gW107XG4gICAgbGV0IHRvdGFsQml0cyA9IHRoaXMudG90YWxfICogODtcblxuICAgIC8vIEFkZCBwYWQgMHg4MCAweDAwKi5cbiAgICBpZiAodGhpcy5pbmJ1Zl8gPCA1Nikge1xuICAgICAgdGhpcy51cGRhdGUodGhpcy5wYWRfLCA1NiAtIHRoaXMuaW5idWZfKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy51cGRhdGUodGhpcy5wYWRfLCB0aGlzLmJsb2NrU2l6ZSAtICh0aGlzLmluYnVmXyAtIDU2KSk7XG4gICAgfVxuXG4gICAgLy8gQWRkICMgYml0cy5cbiAgICBmb3IgKGxldCBpID0gdGhpcy5ibG9ja1NpemUgLSAxOyBpID49IDU2OyBpLS0pIHtcbiAgICAgIHRoaXMuYnVmX1tpXSA9IHRvdGFsQml0cyAmIDI1NTtcbiAgICAgIHRvdGFsQml0cyAvPSAyNTY7IC8vIERvbid0IHVzZSBiaXQtc2hpZnRpbmcgaGVyZSFcbiAgICB9XG5cbiAgICB0aGlzLmNvbXByZXNzXyh0aGlzLmJ1Zl8pO1xuXG4gICAgbGV0IG4gPSAwO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNTsgaSsrKSB7XG4gICAgICBmb3IgKGxldCBqID0gMjQ7IGogPj0gMDsgaiAtPSA4KSB7XG4gICAgICAgIGRpZ2VzdFtuXSA9ICh0aGlzLmNoYWluX1tpXSA+PiBqKSAmIDI1NTtcbiAgICAgICAgKytuO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZGlnZXN0O1xuICB9XG59XG4iLCAiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQ1xuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cbmV4cG9ydCB0eXBlIE5leHRGbjxUPiA9ICh2YWx1ZTogVCkgPT4gdm9pZDtcbmV4cG9ydCB0eXBlIEVycm9yRm4gPSAoZXJyb3I6IEVycm9yKSA9PiB2b2lkO1xuZXhwb3J0IHR5cGUgQ29tcGxldGVGbiA9ICgpID0+IHZvaWQ7XG5cbmV4cG9ydCBpbnRlcmZhY2UgT2JzZXJ2ZXI8VD4ge1xuICAvLyBDYWxsZWQgb25jZSBmb3IgZWFjaCB2YWx1ZSBpbiBhIHN0cmVhbSBvZiB2YWx1ZXMuXG4gIG5leHQ6IE5leHRGbjxUPjtcblxuICAvLyBBIHN0cmVhbSB0ZXJtaW5hdGVzIGJ5IGEgc2luZ2xlIGNhbGwgdG8gRUlUSEVSIGVycm9yKCkgb3IgY29tcGxldGUoKS5cbiAgZXJyb3I6IEVycm9yRm47XG5cbiAgLy8gTm8gZXZlbnRzIHdpbGwgYmUgc2VudCB0byBuZXh0KCkgb25jZSBjb21wbGV0ZSgpIGlzIGNhbGxlZC5cbiAgY29tcGxldGU6IENvbXBsZXRlRm47XG59XG5cbmV4cG9ydCB0eXBlIFBhcnRpYWxPYnNlcnZlcjxUPiA9IFBhcnRpYWw8T2JzZXJ2ZXI8VD4+O1xuXG4vLyBUT0RPOiBTdXBwb3J0IGFsc28gVW5zdWJzY3JpYmUudW5zdWJzY3JpYmU/XG5leHBvcnQgdHlwZSBVbnN1YnNjcmliZSA9ICgpID0+IHZvaWQ7XG5cbi8qKlxuICogVGhlIFN1YnNjcmliZSBpbnRlcmZhY2UgaGFzIHR3byBmb3JtcyAtIHBhc3NpbmcgdGhlIGlubGluZSBmdW5jdGlvblxuICogY2FsbGJhY2tzLCBvciBhIG9iamVjdCBpbnRlcmZhY2Ugd2l0aCBjYWxsYmFjayBwcm9wZXJ0aWVzLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFN1YnNjcmliZTxUPiB7XG4gIChuZXh0PzogTmV4dEZuPFQ+LCBlcnJvcj86IEVycm9yRm4sIGNvbXBsZXRlPzogQ29tcGxldGVGbik6IFVuc3Vic2NyaWJlO1xuICAob2JzZXJ2ZXI6IFBhcnRpYWxPYnNlcnZlcjxUPik6IFVuc3Vic2NyaWJlO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE9ic2VydmFibGU8VD4ge1xuICAvLyBTdWJzY3JpYmUgbWV0aG9kXG4gIHN1YnNjcmliZTogU3Vic2NyaWJlPFQ+O1xufVxuXG5leHBvcnQgdHlwZSBFeGVjdXRvcjxUPiA9IChvYnNlcnZlcjogT2JzZXJ2ZXI8VD4pID0+IHZvaWQ7XG5cbi8qKlxuICogSGVscGVyIHRvIG1ha2UgYSBTdWJzY3JpYmUgZnVuY3Rpb24gKGp1c3QgbGlrZSBQcm9taXNlIGhlbHBzIG1ha2UgYVxuICogVGhlbmFibGUpLlxuICpcbiAqIEBwYXJhbSBleGVjdXRvciBGdW5jdGlvbiB3aGljaCBjYW4gbWFrZSBjYWxscyB0byBhIHNpbmdsZSBPYnNlcnZlclxuICogICAgIGFzIGEgcHJveHkuXG4gKiBAcGFyYW0gb25Ob09ic2VydmVycyBDYWxsYmFjayB3aGVuIGNvdW50IG9mIE9ic2VydmVycyBnb2VzIHRvIHplcm8uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVTdWJzY3JpYmU8VD4oXG4gIGV4ZWN1dG9yOiBFeGVjdXRvcjxUPixcbiAgb25Ob09ic2VydmVycz86IEV4ZWN1dG9yPFQ+XG4pOiBTdWJzY3JpYmU8VD4ge1xuICBjb25zdCBwcm94eSA9IG5ldyBPYnNlcnZlclByb3h5PFQ+KGV4ZWN1dG9yLCBvbk5vT2JzZXJ2ZXJzKTtcbiAgcmV0dXJuIHByb3h5LnN1YnNjcmliZS5iaW5kKHByb3h5KTtcbn1cblxuLyoqXG4gKiBJbXBsZW1lbnQgZmFuLW91dCBmb3IgYW55IG51bWJlciBvZiBPYnNlcnZlcnMgYXR0YWNoZWQgdmlhIGEgc3Vic2NyaWJlXG4gKiBmdW5jdGlvbi5cbiAqL1xuY2xhc3MgT2JzZXJ2ZXJQcm94eTxUPiBpbXBsZW1lbnRzIE9ic2VydmVyPFQ+IHtcbiAgcHJpdmF0ZSBvYnNlcnZlcnM6IEFycmF5PE9ic2VydmVyPFQ+PiB8IHVuZGVmaW5lZCA9IFtdO1xuICBwcml2YXRlIHVuc3Vic2NyaWJlczogVW5zdWJzY3JpYmVbXSA9IFtdO1xuICBwcml2YXRlIG9uTm9PYnNlcnZlcnM6IEV4ZWN1dG9yPFQ+IHwgdW5kZWZpbmVkO1xuICBwcml2YXRlIG9ic2VydmVyQ291bnQgPSAwO1xuICAvLyBNaWNyby10YXNrIHNjaGVkdWxpbmcgYnkgY2FsbGluZyB0YXNrLnRoZW4oKS5cbiAgcHJpdmF0ZSB0YXNrID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gIHByaXZhdGUgZmluYWxpemVkID0gZmFsc2U7XG4gIHByaXZhdGUgZmluYWxFcnJvcj86IEVycm9yO1xuXG4gIC8qKlxuICAgKiBAcGFyYW0gZXhlY3V0b3IgRnVuY3Rpb24gd2hpY2ggY2FuIG1ha2UgY2FsbHMgdG8gYSBzaW5nbGUgT2JzZXJ2ZXJcbiAgICogICAgIGFzIGEgcHJveHkuXG4gICAqIEBwYXJhbSBvbk5vT2JzZXJ2ZXJzIENhbGxiYWNrIHdoZW4gY291bnQgb2YgT2JzZXJ2ZXJzIGdvZXMgdG8gemVyby5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGV4ZWN1dG9yOiBFeGVjdXRvcjxUPiwgb25Ob09ic2VydmVycz86IEV4ZWN1dG9yPFQ+KSB7XG4gICAgdGhpcy5vbk5vT2JzZXJ2ZXJzID0gb25Ob09ic2VydmVycztcbiAgICAvLyBDYWxsIHRoZSBleGVjdXRvciBhc3luY2hyb25vdXNseSBzbyBzdWJzY3JpYmVycyB0aGF0IGFyZSBjYWxsZWRcbiAgICAvLyBzeW5jaHJvbm91c2x5IGFmdGVyIHRoZSBjcmVhdGlvbiBvZiB0aGUgc3Vic2NyaWJlIGZ1bmN0aW9uXG4gICAgLy8gY2FuIHN0aWxsIHJlY2VpdmUgdGhlIHZlcnkgZmlyc3QgdmFsdWUgZ2VuZXJhdGVkIGluIHRoZSBleGVjdXRvci5cbiAgICB0aGlzLnRhc2tcbiAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgZXhlY3V0b3IodGhpcyk7XG4gICAgICB9KVxuICAgICAgLmNhdGNoKGUgPT4ge1xuICAgICAgICB0aGlzLmVycm9yKGUpO1xuICAgICAgfSk7XG4gIH1cblxuICBuZXh0KHZhbHVlOiBUKTogdm9pZCB7XG4gICAgdGhpcy5mb3JFYWNoT2JzZXJ2ZXIoKG9ic2VydmVyOiBPYnNlcnZlcjxUPikgPT4ge1xuICAgICAgb2JzZXJ2ZXIubmV4dCh2YWx1ZSk7XG4gICAgfSk7XG4gIH1cblxuICBlcnJvcihlcnJvcjogRXJyb3IpOiB2b2lkIHtcbiAgICB0aGlzLmZvckVhY2hPYnNlcnZlcigob2JzZXJ2ZXI6IE9ic2VydmVyPFQ+KSA9PiB7XG4gICAgICBvYnNlcnZlci5lcnJvcihlcnJvcik7XG4gICAgfSk7XG4gICAgdGhpcy5jbG9zZShlcnJvcik7XG4gIH1cblxuICBjb21wbGV0ZSgpOiB2b2lkIHtcbiAgICB0aGlzLmZvckVhY2hPYnNlcnZlcigob2JzZXJ2ZXI6IE9ic2VydmVyPFQ+KSA9PiB7XG4gICAgICBvYnNlcnZlci5jb21wbGV0ZSgpO1xuICAgIH0pO1xuICAgIHRoaXMuY2xvc2UoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdWJzY3JpYmUgZnVuY3Rpb24gdGhhdCBjYW4gYmUgdXNlZCB0byBhZGQgYW4gT2JzZXJ2ZXIgdG8gdGhlIGZhbi1vdXQgbGlzdC5cbiAgICpcbiAgICogLSBXZSByZXF1aXJlIHRoYXQgbm8gZXZlbnQgaXMgc2VudCB0byBhIHN1YnNjcmliZXIgc3ljaHJvbm91c2x5IHRvIHRoZWlyXG4gICAqICAgY2FsbCB0byBzdWJzY3JpYmUoKS5cbiAgICovXG4gIHN1YnNjcmliZShcbiAgICBuZXh0T3JPYnNlcnZlcj86IE5leHRGbjxUPiB8IFBhcnRpYWxPYnNlcnZlcjxUPixcbiAgICBlcnJvcj86IEVycm9yRm4sXG4gICAgY29tcGxldGU/OiBDb21wbGV0ZUZuXG4gICk6IFVuc3Vic2NyaWJlIHtcbiAgICBsZXQgb2JzZXJ2ZXI6IE9ic2VydmVyPFQ+O1xuXG4gICAgaWYgKFxuICAgICAgbmV4dE9yT2JzZXJ2ZXIgPT09IHVuZGVmaW5lZCAmJlxuICAgICAgZXJyb3IgPT09IHVuZGVmaW5lZCAmJlxuICAgICAgY29tcGxldGUgPT09IHVuZGVmaW5lZFxuICAgICkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIE9ic2VydmVyLicpO1xuICAgIH1cblxuICAgIC8vIEFzc2VtYmxlIGFuIE9ic2VydmVyIG9iamVjdCB3aGVuIHBhc3NlZCBhcyBjYWxsYmFjayBmdW5jdGlvbnMuXG4gICAgaWYgKFxuICAgICAgaW1wbGVtZW50c0FueU1ldGhvZHMobmV4dE9yT2JzZXJ2ZXIgYXMgeyBba2V5OiBzdHJpbmddOiB1bmtub3duIH0sIFtcbiAgICAgICAgJ25leHQnLFxuICAgICAgICAnZXJyb3InLFxuICAgICAgICAnY29tcGxldGUnXG4gICAgICBdKVxuICAgICkge1xuICAgICAgb2JzZXJ2ZXIgPSBuZXh0T3JPYnNlcnZlciBhcyBPYnNlcnZlcjxUPjtcbiAgICB9IGVsc2Uge1xuICAgICAgb2JzZXJ2ZXIgPSB7XG4gICAgICAgIG5leHQ6IG5leHRPck9ic2VydmVyIGFzIE5leHRGbjxUPixcbiAgICAgICAgZXJyb3IsXG4gICAgICAgIGNvbXBsZXRlXG4gICAgICB9IGFzIE9ic2VydmVyPFQ+O1xuICAgIH1cblxuICAgIGlmIChvYnNlcnZlci5uZXh0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIG9ic2VydmVyLm5leHQgPSBub29wIGFzIE5leHRGbjxUPjtcbiAgICB9XG4gICAgaWYgKG9ic2VydmVyLmVycm9yID09PSB1bmRlZmluZWQpIHtcbiAgICAgIG9ic2VydmVyLmVycm9yID0gbm9vcCBhcyBFcnJvckZuO1xuICAgIH1cbiAgICBpZiAob2JzZXJ2ZXIuY29tcGxldGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgb2JzZXJ2ZXIuY29tcGxldGUgPSBub29wIGFzIENvbXBsZXRlRm47XG4gICAgfVxuXG4gICAgY29uc3QgdW5zdWIgPSB0aGlzLnVuc3Vic2NyaWJlT25lLmJpbmQodGhpcywgdGhpcy5vYnNlcnZlcnMhLmxlbmd0aCk7XG5cbiAgICAvLyBBdHRlbXB0IHRvIHN1YnNjcmliZSB0byBhIHRlcm1pbmF0ZWQgT2JzZXJ2YWJsZSAtIHdlXG4gICAgLy8ganVzdCByZXNwb25kIHRvIHRoZSBPYnNlcnZlciB3aXRoIHRoZSBmaW5hbCBlcnJvciBvciBjb21wbGV0ZVxuICAgIC8vIGV2ZW50LlxuICAgIGlmICh0aGlzLmZpbmFsaXplZCkge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1mbG9hdGluZy1wcm9taXNlc1xuICAgICAgdGhpcy50YXNrLnRoZW4oKCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGlmICh0aGlzLmZpbmFsRXJyb3IpIHtcbiAgICAgICAgICAgIG9ic2VydmVyLmVycm9yKHRoaXMuZmluYWxFcnJvcik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG9ic2VydmVyLmNvbXBsZXRlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgLy8gbm90aGluZ1xuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMub2JzZXJ2ZXJzIS5wdXNoKG9ic2VydmVyIGFzIE9ic2VydmVyPFQ+KTtcblxuICAgIHJldHVybiB1bnN1YjtcbiAgfVxuXG4gIC8vIFVuc3Vic2NyaWJlIGlzIHN5bmNocm9ub3VzIC0gd2UgZ3VhcmFudGVlIHRoYXQgbm8gZXZlbnRzIGFyZSBzZW50IHRvXG4gIC8vIGFueSB1bnN1YnNjcmliZWQgT2JzZXJ2ZXIuXG4gIHByaXZhdGUgdW5zdWJzY3JpYmVPbmUoaTogbnVtYmVyKTogdm9pZCB7XG4gICAgaWYgKHRoaXMub2JzZXJ2ZXJzID09PSB1bmRlZmluZWQgfHwgdGhpcy5vYnNlcnZlcnNbaV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGRlbGV0ZSB0aGlzLm9ic2VydmVyc1tpXTtcblxuICAgIHRoaXMub2JzZXJ2ZXJDb3VudCAtPSAxO1xuICAgIGlmICh0aGlzLm9ic2VydmVyQ291bnQgPT09IDAgJiYgdGhpcy5vbk5vT2JzZXJ2ZXJzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMub25Ob09ic2VydmVycyh0aGlzKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGZvckVhY2hPYnNlcnZlcihmbjogKG9ic2VydmVyOiBPYnNlcnZlcjxUPikgPT4gdm9pZCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmZpbmFsaXplZCkge1xuICAgICAgLy8gQWxyZWFkeSBjbG9zZWQgYnkgcHJldmlvdXMgZXZlbnQuLi4uanVzdCBlYXQgdGhlIGFkZGl0aW9uYWwgdmFsdWVzLlxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFNpbmNlIHNlbmRPbmUgY2FsbHMgYXN5bmNocm9ub3VzbHkgLSB0aGVyZSBpcyBubyBjaGFuY2UgdGhhdFxuICAgIC8vIHRoaXMub2JzZXJ2ZXJzIHdpbGwgYmVjb21lIHVuZGVmaW5lZC5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMub2JzZXJ2ZXJzIS5sZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy5zZW5kT25lKGksIGZuKTtcbiAgICB9XG4gIH1cblxuICAvLyBDYWxsIHRoZSBPYnNlcnZlciB2aWEgb25lIG9mIGl0J3MgY2FsbGJhY2sgZnVuY3Rpb24uIFdlIGFyZSBjYXJlZnVsIHRvXG4gIC8vIGNvbmZpcm0gdGhhdCB0aGUgb2JzZXJ2ZSBoYXMgbm90IGJlZW4gdW5zdWJzY3JpYmVkIHNpbmNlIHRoaXMgYXN5bmNocm9ub3VzXG4gIC8vIGZ1bmN0aW9uIGhhZCBiZWVuIHF1ZXVlZC5cbiAgcHJpdmF0ZSBzZW5kT25lKGk6IG51bWJlciwgZm46IChvYnNlcnZlcjogT2JzZXJ2ZXI8VD4pID0+IHZvaWQpOiB2b2lkIHtcbiAgICAvLyBFeGVjdXRlIHRoZSBjYWxsYmFjayBhc3luY2hyb25vdXNseVxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZmxvYXRpbmctcHJvbWlzZXNcbiAgICB0aGlzLnRhc2sudGhlbigoKSA9PiB7XG4gICAgICBpZiAodGhpcy5vYnNlcnZlcnMgIT09IHVuZGVmaW5lZCAmJiB0aGlzLm9ic2VydmVyc1tpXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZm4odGhpcy5vYnNlcnZlcnNbaV0pO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgLy8gSWdub3JlIGV4Y2VwdGlvbnMgcmFpc2VkIGluIE9ic2VydmVycyBvciBtaXNzaW5nIG1ldGhvZHMgb2YgYW5cbiAgICAgICAgICAvLyBPYnNlcnZlci5cbiAgICAgICAgICAvLyBMb2cgZXJyb3IgdG8gY29uc29sZS4gYi8zMTQwNDgwNlxuICAgICAgICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcgJiYgY29uc29sZS5lcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgY2xvc2UoZXJyPzogRXJyb3IpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5maW5hbGl6ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5maW5hbGl6ZWQgPSB0cnVlO1xuICAgIGlmIChlcnIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5maW5hbEVycm9yID0gZXJyO1xuICAgIH1cbiAgICAvLyBQcm94eSBpcyBubyBsb25nZXIgbmVlZGVkIC0gZ2FyYmFnZSBjb2xsZWN0IHJlZmVyZW5jZXNcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWZsb2F0aW5nLXByb21pc2VzXG4gICAgdGhpcy50YXNrLnRoZW4oKCkgPT4ge1xuICAgICAgdGhpcy5vYnNlcnZlcnMgPSB1bmRlZmluZWQ7XG4gICAgICB0aGlzLm9uTm9PYnNlcnZlcnMgPSB1bmRlZmluZWQ7XG4gICAgfSk7XG4gIH1cbn1cblxuLyoqIFR1cm4gc3luY2hyb25vdXMgZnVuY3Rpb24gaW50byBvbmUgY2FsbGVkIGFzeW5jaHJvbm91c2x5LiAqL1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9iYW4tdHlwZXNcbmV4cG9ydCBmdW5jdGlvbiBhc3luYyhmbjogRnVuY3Rpb24sIG9uRXJyb3I/OiBFcnJvckZuKTogRnVuY3Rpb24ge1xuICByZXR1cm4gKC4uLmFyZ3M6IHVua25vd25bXSkgPT4ge1xuICAgIFByb21pc2UucmVzb2x2ZSh0cnVlKVxuICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICBmbiguLi5hcmdzKTtcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKGVycm9yOiBFcnJvcikgPT4ge1xuICAgICAgICBpZiAob25FcnJvcikge1xuICAgICAgICAgIG9uRXJyb3IoZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgfTtcbn1cblxuLyoqXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgb2JqZWN0IHBhc3NlZCBpbiBpbXBsZW1lbnRzIGFueSBvZiB0aGUgbmFtZWQgbWV0aG9kcy5cbiAqL1xuZnVuY3Rpb24gaW1wbGVtZW50c0FueU1ldGhvZHMoXG4gIG9iajogeyBba2V5OiBzdHJpbmddOiB1bmtub3duIH0sXG4gIG1ldGhvZHM6IHN0cmluZ1tdXG4pOiBib29sZWFuIHtcbiAgaWYgKHR5cGVvZiBvYmogIT09ICdvYmplY3QnIHx8IG9iaiA9PT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGZvciAoY29uc3QgbWV0aG9kIG9mIG1ldGhvZHMpIHtcbiAgICBpZiAobWV0aG9kIGluIG9iaiAmJiB0eXBlb2Ygb2JqW21ldGhvZF0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gbm9vcCgpOiB2b2lkIHtcbiAgLy8gZG8gbm90aGluZ1xufVxuIiwgIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTENcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8qKlxuICogQ2hlY2sgdG8gbWFrZSBzdXJlIHRoZSBhcHByb3ByaWF0ZSBudW1iZXIgb2YgYXJndW1lbnRzIGFyZSBwcm92aWRlZCBmb3IgYSBwdWJsaWMgZnVuY3Rpb24uXG4gKiBUaHJvd3MgYW4gZXJyb3IgaWYgaXQgZmFpbHMuXG4gKlxuICogQHBhcmFtIGZuTmFtZSBUaGUgZnVuY3Rpb24gbmFtZVxuICogQHBhcmFtIG1pbkNvdW50IFRoZSBtaW5pbXVtIG51bWJlciBvZiBhcmd1bWVudHMgdG8gYWxsb3cgZm9yIHRoZSBmdW5jdGlvbiBjYWxsXG4gKiBAcGFyYW0gbWF4Q291bnQgVGhlIG1heGltdW0gbnVtYmVyIG9mIGFyZ3VtZW50IHRvIGFsbG93IGZvciB0aGUgZnVuY3Rpb24gY2FsbFxuICogQHBhcmFtIGFyZ0NvdW50IFRoZSBhY3R1YWwgbnVtYmVyIG9mIGFyZ3VtZW50cyBwcm92aWRlZC5cbiAqL1xuZXhwb3J0IGNvbnN0IHZhbGlkYXRlQXJnQ291bnQgPSBmdW5jdGlvbiAoXG4gIGZuTmFtZTogc3RyaW5nLFxuICBtaW5Db3VudDogbnVtYmVyLFxuICBtYXhDb3VudDogbnVtYmVyLFxuICBhcmdDb3VudDogbnVtYmVyXG4pOiB2b2lkIHtcbiAgbGV0IGFyZ0Vycm9yO1xuICBpZiAoYXJnQ291bnQgPCBtaW5Db3VudCkge1xuICAgIGFyZ0Vycm9yID0gJ2F0IGxlYXN0ICcgKyBtaW5Db3VudDtcbiAgfSBlbHNlIGlmIChhcmdDb3VudCA+IG1heENvdW50KSB7XG4gICAgYXJnRXJyb3IgPSBtYXhDb3VudCA9PT0gMCA/ICdub25lJyA6ICdubyBtb3JlIHRoYW4gJyArIG1heENvdW50O1xuICB9XG4gIGlmIChhcmdFcnJvcikge1xuICAgIGNvbnN0IGVycm9yID1cbiAgICAgIGZuTmFtZSArXG4gICAgICAnIGZhaWxlZDogV2FzIGNhbGxlZCB3aXRoICcgK1xuICAgICAgYXJnQ291bnQgK1xuICAgICAgKGFyZ0NvdW50ID09PSAxID8gJyBhcmd1bWVudC4nIDogJyBhcmd1bWVudHMuJykgK1xuICAgICAgJyBFeHBlY3RzICcgK1xuICAgICAgYXJnRXJyb3IgK1xuICAgICAgJy4nO1xuICAgIHRocm93IG5ldyBFcnJvcihlcnJvcik7XG4gIH1cbn07XG5cbi8qKlxuICogR2VuZXJhdGVzIGEgc3RyaW5nIHRvIHByZWZpeCBhbiBlcnJvciBtZXNzYWdlIGFib3V0IGZhaWxlZCBhcmd1bWVudCB2YWxpZGF0aW9uXG4gKlxuICogQHBhcmFtIGZuTmFtZSBUaGUgZnVuY3Rpb24gbmFtZVxuICogQHBhcmFtIGFyZ05hbWUgVGhlIG5hbWUgb2YgdGhlIGFyZ3VtZW50XG4gKiBAcmV0dXJuIFRoZSBwcmVmaXggdG8gYWRkIHRvIHRoZSBlcnJvciB0aHJvd24gZm9yIHZhbGlkYXRpb24uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBlcnJvclByZWZpeChmbk5hbWU6IHN0cmluZywgYXJnTmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIGAke2ZuTmFtZX0gZmFpbGVkOiAke2FyZ05hbWV9IGFyZ3VtZW50IGA7XG59XG5cbi8qKlxuICogQHBhcmFtIGZuTmFtZVxuICogQHBhcmFtIGFyZ3VtZW50TnVtYmVyXG4gKiBAcGFyYW0gbmFtZXNwYWNlXG4gKiBAcGFyYW0gb3B0aW9uYWxcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlTmFtZXNwYWNlKFxuICBmbk5hbWU6IHN0cmluZyxcbiAgbmFtZXNwYWNlOiBzdHJpbmcsXG4gIG9wdGlvbmFsOiBib29sZWFuXG4pOiB2b2lkIHtcbiAgaWYgKG9wdGlvbmFsICYmICFuYW1lc3BhY2UpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKHR5cGVvZiBuYW1lc3BhY2UgIT09ICdzdHJpbmcnKSB7XG4gICAgLy9UT0RPOiBJIHNob3VsZCBkbyBtb3JlIHZhbGlkYXRpb24gaGVyZS4gV2Ugb25seSBhbGxvdyBjZXJ0YWluIGNoYXJzIGluIG5hbWVzcGFjZXMuXG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgZXJyb3JQcmVmaXgoZm5OYW1lLCAnbmFtZXNwYWNlJykgKyAnbXVzdCBiZSBhIHZhbGlkIGZpcmViYXNlIG5hbWVzcGFjZS4nXG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVDYWxsYmFjayhcbiAgZm5OYW1lOiBzdHJpbmcsXG4gIGFyZ3VtZW50TmFtZTogc3RyaW5nLFxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L2Jhbi10eXBlc1xuICBjYWxsYmFjazogRnVuY3Rpb24sXG4gIG9wdGlvbmFsOiBib29sZWFuXG4pOiB2b2lkIHtcbiAgaWYgKG9wdGlvbmFsICYmICFjYWxsYmFjaykge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAodHlwZW9mIGNhbGxiYWNrICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgZXJyb3JQcmVmaXgoZm5OYW1lLCBhcmd1bWVudE5hbWUpICsgJ211c3QgYmUgYSB2YWxpZCBmdW5jdGlvbi4nXG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVDb250ZXh0T2JqZWN0KFxuICBmbk5hbWU6IHN0cmluZyxcbiAgYXJndW1lbnROYW1lOiBzdHJpbmcsXG4gIGNvbnRleHQ6IHVua25vd24sXG4gIG9wdGlvbmFsOiBib29sZWFuXG4pOiB2b2lkIHtcbiAgaWYgKG9wdGlvbmFsICYmICFjb250ZXh0KSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmICh0eXBlb2YgY29udGV4dCAhPT0gJ29iamVjdCcgfHwgY29udGV4dCA9PT0gbnVsbCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGVycm9yUHJlZml4KGZuTmFtZSwgYXJndW1lbnROYW1lKSArICdtdXN0IGJlIGEgdmFsaWQgY29udGV4dCBvYmplY3QuJ1xuICAgICk7XG4gIH1cbn1cbiIsICIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBhc3NlcnQgfSBmcm9tICcuL2Fzc2VydCc7XG5cbi8vIENvZGUgb3JpZ2luYWxseSBjYW1lIGZyb20gZ29vZy5jcnlwdC5zdHJpbmdUb1V0ZjhCeXRlQXJyYXksIGJ1dCBmb3Igc29tZSByZWFzb24gdGhleVxuLy8gYXV0b21hdGljYWxseSByZXBsYWNlZCAnXFxyXFxuJyB3aXRoICdcXG4nLCBhbmQgdGhleSBkaWRuJ3QgaGFuZGxlIHN1cnJvZ2F0ZSBwYWlycyxcbi8vIHNvIGl0J3MgYmVlbiBtb2RpZmllZC5cblxuLy8gTm90ZSB0aGF0IG5vdCBhbGwgVW5pY29kZSBjaGFyYWN0ZXJzIGFwcGVhciBhcyBzaW5nbGUgY2hhcmFjdGVycyBpbiBKYXZhU2NyaXB0IHN0cmluZ3MuXG4vLyBmcm9tQ2hhckNvZGUgcmV0dXJucyB0aGUgVVRGLTE2IGVuY29kaW5nIG9mIGEgY2hhcmFjdGVyIC0gc28gc29tZSBVbmljb2RlIGNoYXJhY3RlcnNcbi8vIHVzZSAyIGNoYXJhY3RlcnMgaW4gSmF2YXNjcmlwdC4gIEFsbCA0LWJ5dGUgVVRGLTggY2hhcmFjdGVycyBiZWdpbiB3aXRoIGEgZmlyc3Rcbi8vIGNoYXJhY3RlciBpbiB0aGUgcmFuZ2UgMHhEODAwIC0gMHhEQkZGICh0aGUgZmlyc3QgY2hhcmFjdGVyIG9mIGEgc28tY2FsbGVkIHN1cnJvZ2F0ZVxuLy8gcGFpcikuXG4vLyBTZWUgaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzUuMS8jc2VjLTE1LjEuM1xuXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge0FycmF5fVxuICovXG5leHBvcnQgY29uc3Qgc3RyaW5nVG9CeXRlQXJyYXkgPSBmdW5jdGlvbiAoc3RyOiBzdHJpbmcpOiBudW1iZXJbXSB7XG4gIGNvbnN0IG91dDogbnVtYmVyW10gPSBbXTtcbiAgbGV0IHAgPSAwO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgIGxldCBjID0gc3RyLmNoYXJDb2RlQXQoaSk7XG5cbiAgICAvLyBJcyB0aGlzIHRoZSBsZWFkIHN1cnJvZ2F0ZSBpbiBhIHN1cnJvZ2F0ZSBwYWlyP1xuICAgIGlmIChjID49IDB4ZDgwMCAmJiBjIDw9IDB4ZGJmZikge1xuICAgICAgY29uc3QgaGlnaCA9IGMgLSAweGQ4MDA7IC8vIHRoZSBoaWdoIDEwIGJpdHMuXG4gICAgICBpKys7XG4gICAgICBhc3NlcnQoaSA8IHN0ci5sZW5ndGgsICdTdXJyb2dhdGUgcGFpciBtaXNzaW5nIHRyYWlsIHN1cnJvZ2F0ZS4nKTtcbiAgICAgIGNvbnN0IGxvdyA9IHN0ci5jaGFyQ29kZUF0KGkpIC0gMHhkYzAwOyAvLyB0aGUgbG93IDEwIGJpdHMuXG4gICAgICBjID0gMHgxMDAwMCArIChoaWdoIDw8IDEwKSArIGxvdztcbiAgICB9XG5cbiAgICBpZiAoYyA8IDEyOCkge1xuICAgICAgb3V0W3ArK10gPSBjO1xuICAgIH0gZWxzZSBpZiAoYyA8IDIwNDgpIHtcbiAgICAgIG91dFtwKytdID0gKGMgPj4gNikgfCAxOTI7XG4gICAgICBvdXRbcCsrXSA9IChjICYgNjMpIHwgMTI4O1xuICAgIH0gZWxzZSBpZiAoYyA8IDY1NTM2KSB7XG4gICAgICBvdXRbcCsrXSA9IChjID4+IDEyKSB8IDIyNDtcbiAgICAgIG91dFtwKytdID0gKChjID4+IDYpICYgNjMpIHwgMTI4O1xuICAgICAgb3V0W3ArK10gPSAoYyAmIDYzKSB8IDEyODtcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0W3ArK10gPSAoYyA+PiAxOCkgfCAyNDA7XG4gICAgICBvdXRbcCsrXSA9ICgoYyA+PiAxMikgJiA2MykgfCAxMjg7XG4gICAgICBvdXRbcCsrXSA9ICgoYyA+PiA2KSAmIDYzKSB8IDEyODtcbiAgICAgIG91dFtwKytdID0gKGMgJiA2MykgfCAxMjg7XG4gICAgfVxuICB9XG4gIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIENhbGN1bGF0ZSBsZW5ndGggd2l0aG91dCBhY3R1YWxseSBjb252ZXJ0aW5nOyB1c2VmdWwgZm9yIGRvaW5nIGNoZWFwZXIgdmFsaWRhdGlvbi5cbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge251bWJlcn1cbiAqL1xuZXhwb3J0IGNvbnN0IHN0cmluZ0xlbmd0aCA9IGZ1bmN0aW9uIChzdHI6IHN0cmluZyk6IG51bWJlciB7XG4gIGxldCBwID0gMDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBjID0gc3RyLmNoYXJDb2RlQXQoaSk7XG4gICAgaWYgKGMgPCAxMjgpIHtcbiAgICAgIHArKztcbiAgICB9IGVsc2UgaWYgKGMgPCAyMDQ4KSB7XG4gICAgICBwICs9IDI7XG4gICAgfSBlbHNlIGlmIChjID49IDB4ZDgwMCAmJiBjIDw9IDB4ZGJmZikge1xuICAgICAgLy8gTGVhZCBzdXJyb2dhdGUgb2YgYSBzdXJyb2dhdGUgcGFpci4gIFRoZSBwYWlyIHRvZ2V0aGVyIHdpbGwgdGFrZSA0IGJ5dGVzIHRvIHJlcHJlc2VudC5cbiAgICAgIHAgKz0gNDtcbiAgICAgIGkrKzsgLy8gc2tpcCB0cmFpbCBzdXJyb2dhdGUuXG4gICAgfSBlbHNlIHtcbiAgICAgIHAgKz0gMztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHA7XG59O1xuIiwgIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIyIEdvb2dsZSBMTENcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8qKlxuICogQ29waWVkIGZyb20gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzIxMTc1MjNcbiAqIEdlbmVyYXRlcyBhIG5ldyB1dWlkLlxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3QgdXVpZHY0ID0gZnVuY3Rpb24gKCk6IHN0cmluZyB7XG4gIHJldHVybiAneHh4eHh4eHgteHh4eC00eHh4LXl4eHgteHh4eHh4eHh4eHh4Jy5yZXBsYWNlKC9beHldL2csIGMgPT4ge1xuICAgIGNvbnN0IHIgPSAoTWF0aC5yYW5kb20oKSAqIDE2KSB8IDAsXG4gICAgICB2ID0gYyA9PT0gJ3gnID8gciA6IChyICYgMHgzKSB8IDB4ODtcbiAgICByZXR1cm4gdi50b1N0cmluZygxNik7XG4gIH0pO1xufTtcbiIsICIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4vKipcbiAqIFRoZSBhbW91bnQgb2YgbWlsbGlzZWNvbmRzIHRvIGV4cG9uZW50aWFsbHkgaW5jcmVhc2UuXG4gKi9cbmNvbnN0IERFRkFVTFRfSU5URVJWQUxfTUlMTElTID0gMTAwMDtcblxuLyoqXG4gKiBUaGUgZmFjdG9yIHRvIGJhY2tvZmYgYnkuXG4gKiBTaG91bGQgYmUgYSBudW1iZXIgZ3JlYXRlciB0aGFuIDEuXG4gKi9cbmNvbnN0IERFRkFVTFRfQkFDS09GRl9GQUNUT1IgPSAyO1xuXG4vKipcbiAqIFRoZSBtYXhpbXVtIG1pbGxpc2Vjb25kcyB0byBpbmNyZWFzZSB0by5cbiAqXG4gKiA8cD5WaXNpYmxlIGZvciB0ZXN0aW5nXG4gKi9cbmV4cG9ydCBjb25zdCBNQVhfVkFMVUVfTUlMTElTID0gNCAqIDYwICogNjAgKiAxMDAwOyAvLyBGb3VyIGhvdXJzLCBsaWtlIGlPUyBhbmQgQW5kcm9pZC5cblxuLyoqXG4gKiBUaGUgcGVyY2VudGFnZSBvZiBiYWNrb2ZmIHRpbWUgdG8gcmFuZG9taXplIGJ5LlxuICogU2VlXG4gKiBodHRwOi8vZ28vc2FmZS1jbGllbnQtYmVoYXZpb3Ijc3RlcC0xLWRldGVybWluZS10aGUtYXBwcm9wcmlhdGUtcmV0cnktaW50ZXJ2YWwtdG8taGFuZGxlLXNwaWtlLXRyYWZmaWNcbiAqIGZvciBjb250ZXh0LlxuICpcbiAqIDxwPlZpc2libGUgZm9yIHRlc3RpbmdcbiAqL1xuZXhwb3J0IGNvbnN0IFJBTkRPTV9GQUNUT1IgPSAwLjU7XG5cbi8qKlxuICogQmFzZWQgb24gdGhlIGJhY2tvZmYgbWV0aG9kIGZyb21cbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9nb29nbGUvY2xvc3VyZS1saWJyYXJ5L2Jsb2IvbWFzdGVyL2Nsb3N1cmUvZ29vZy9tYXRoL2V4cG9uZW50aWFsYmFja29mZi5qcy5cbiAqIEV4dHJhY3RlZCBoZXJlIHNvIHdlIGRvbid0IG5lZWQgdG8gcGFzcyBtZXRhZGF0YSBhbmQgYSBzdGF0ZWZ1bCBFeHBvbmVudGlhbEJhY2tvZmYgb2JqZWN0IGFyb3VuZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNhbGN1bGF0ZUJhY2tvZmZNaWxsaXMoXG4gIGJhY2tvZmZDb3VudDogbnVtYmVyLFxuICBpbnRlcnZhbE1pbGxpczogbnVtYmVyID0gREVGQVVMVF9JTlRFUlZBTF9NSUxMSVMsXG4gIGJhY2tvZmZGYWN0b3I6IG51bWJlciA9IERFRkFVTFRfQkFDS09GRl9GQUNUT1Jcbik6IG51bWJlciB7XG4gIC8vIENhbGN1bGF0ZXMgYW4gZXhwb25lbnRpYWxseSBpbmNyZWFzaW5nIHZhbHVlLlxuICAvLyBEZXZpYXRpb246IGNhbGN1bGF0ZXMgdmFsdWUgZnJvbSBjb3VudCBhbmQgYSBjb25zdGFudCBpbnRlcnZhbCwgc28gd2Ugb25seSBuZWVkIHRvIHNhdmUgdmFsdWVcbiAgLy8gYW5kIGNvdW50IHRvIHJlc3RvcmUgc3RhdGUuXG4gIGNvbnN0IGN1cnJCYXNlVmFsdWUgPSBpbnRlcnZhbE1pbGxpcyAqIE1hdGgucG93KGJhY2tvZmZGYWN0b3IsIGJhY2tvZmZDb3VudCk7XG5cbiAgLy8gQSByYW5kb20gXCJmdXp6XCIgdG8gYXZvaWQgd2F2ZXMgb2YgcmV0cmllcy5cbiAgLy8gRGV2aWF0aW9uOiByYW5kb21GYWN0b3IgaXMgcmVxdWlyZWQuXG4gIGNvbnN0IHJhbmRvbVdhaXQgPSBNYXRoLnJvdW5kKFxuICAgIC8vIEEgZnJhY3Rpb24gb2YgdGhlIGJhY2tvZmYgdmFsdWUgdG8gYWRkL3N1YnRyYWN0LlxuICAgIC8vIERldmlhdGlvbjogY2hhbmdlcyBtdWx0aXBsaWNhdGlvbiBvcmRlciB0byBpbXByb3ZlIHJlYWRhYmlsaXR5LlxuICAgIFJBTkRPTV9GQUNUT1IgKlxuICAgICAgY3VyckJhc2VWYWx1ZSAqXG4gICAgICAvLyBBIHJhbmRvbSBmbG9hdCAocm91bmRlZCB0byBpbnQgYnkgTWF0aC5yb3VuZCBhYm92ZSkgaW4gdGhlIHJhbmdlIFstMSwgMV0uIERldGVybWluZXNcbiAgICAgIC8vIGlmIHdlIGFkZCBvciBzdWJ0cmFjdC5cbiAgICAgIChNYXRoLnJhbmRvbSgpIC0gMC41KSAqXG4gICAgICAyXG4gICk7XG5cbiAgLy8gTGltaXRzIGJhY2tvZmYgdG8gbWF4IHRvIGF2b2lkIGVmZmVjdGl2ZWx5IHBlcm1hbmVudCBiYWNrb2ZmLlxuICByZXR1cm4gTWF0aC5taW4oTUFYX1ZBTFVFX01JTExJUywgY3VyckJhc2VWYWx1ZSArIHJhbmRvbVdhaXQpO1xufVxuIiwgIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTENcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8qKlxuICogUHJvdmlkZSBFbmdsaXNoIG9yZGluYWwgbGV0dGVycyBhZnRlciBhIG51bWJlclxuICovXG5leHBvcnQgZnVuY3Rpb24gb3JkaW5hbChpOiBudW1iZXIpOiBzdHJpbmcge1xuICBpZiAoIU51bWJlci5pc0Zpbml0ZShpKSkge1xuICAgIHJldHVybiBgJHtpfWA7XG4gIH1cbiAgcmV0dXJuIGkgKyBpbmRpY2F0b3IoaSk7XG59XG5cbmZ1bmN0aW9uIGluZGljYXRvcihpOiBudW1iZXIpOiBzdHJpbmcge1xuICBpID0gTWF0aC5hYnMoaSk7XG4gIGNvbnN0IGNlbnQgPSBpICUgMTAwO1xuICBpZiAoY2VudCA+PSAxMCAmJiBjZW50IDw9IDIwKSB7XG4gICAgcmV0dXJuICd0aCc7XG4gIH1cbiAgY29uc3QgZGVjID0gaSAlIDEwO1xuICBpZiAoZGVjID09PSAxKSB7XG4gICAgcmV0dXJuICdzdCc7XG4gIH1cbiAgaWYgKGRlYyA9PT0gMikge1xuICAgIHJldHVybiAnbmQnO1xuICB9XG4gIGlmIChkZWMgPT09IDMpIHtcbiAgICByZXR1cm4gJ3JkJztcbiAgfVxuICByZXR1cm4gJ3RoJztcbn1cbiIsICIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMSBHb29nbGUgTExDXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5leHBvcnQgaW50ZXJmYWNlIENvbXBhdDxUPiB7XG4gIF9kZWxlZ2F0ZTogVDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldE1vZHVsYXJJbnN0YW5jZTxFeHBTZXJ2aWNlPihcbiAgc2VydmljZTogQ29tcGF0PEV4cFNlcnZpY2U+IHwgRXhwU2VydmljZVxuKTogRXhwU2VydmljZSB7XG4gIGlmIChzZXJ2aWNlICYmIChzZXJ2aWNlIGFzIENvbXBhdDxFeHBTZXJ2aWNlPikuX2RlbGVnYXRlKSB7XG4gICAgcmV0dXJuIChzZXJ2aWNlIGFzIENvbXBhdDxFeHBTZXJ2aWNlPikuX2RlbGVnYXRlO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBzZXJ2aWNlIGFzIEV4cFNlcnZpY2U7XG4gIH1cbn1cbiIsICIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuaW1wb3J0IHtcbiAgSW5zdGFudGlhdGlvbk1vZGUsXG4gIEluc3RhbmNlRmFjdG9yeSxcbiAgQ29tcG9uZW50VHlwZSxcbiAgRGljdGlvbmFyeSxcbiAgTmFtZSxcbiAgb25JbnN0YW5jZUNyZWF0ZWRDYWxsYmFja1xufSBmcm9tICcuL3R5cGVzJztcblxuLyoqXG4gKiBDb21wb25lbnQgZm9yIHNlcnZpY2UgbmFtZSBULCBlLmcuIGBhdXRoYCwgYGF1dGgtaW50ZXJuYWxgXG4gKi9cbmV4cG9ydCBjbGFzcyBDb21wb25lbnQ8VCBleHRlbmRzIE5hbWUgPSBOYW1lPiB7XG4gIG11bHRpcGxlSW5zdGFuY2VzID0gZmFsc2U7XG4gIC8qKlxuICAgKiBQcm9wZXJ0aWVzIHRvIGJlIGFkZGVkIHRvIHRoZSBzZXJ2aWNlIG5hbWVzcGFjZVxuICAgKi9cbiAgc2VydmljZVByb3BzOiBEaWN0aW9uYXJ5ID0ge307XG5cbiAgaW5zdGFudGlhdGlvbk1vZGUgPSBJbnN0YW50aWF0aW9uTW9kZS5MQVpZO1xuXG4gIG9uSW5zdGFuY2VDcmVhdGVkOiBvbkluc3RhbmNlQ3JlYXRlZENhbGxiYWNrPFQ+IHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSBuYW1lIFRoZSBwdWJsaWMgc2VydmljZSBuYW1lLCBlLmcuIGFwcCwgYXV0aCwgZmlyZXN0b3JlLCBkYXRhYmFzZVxuICAgKiBAcGFyYW0gaW5zdGFuY2VGYWN0b3J5IFNlcnZpY2UgZmFjdG9yeSByZXNwb25zaWJsZSBmb3IgY3JlYXRpbmcgdGhlIHB1YmxpYyBpbnRlcmZhY2VcbiAgICogQHBhcmFtIHR5cGUgd2hldGhlciB0aGUgc2VydmljZSBwcm92aWRlZCBieSB0aGUgY29tcG9uZW50IGlzIHB1YmxpYyBvciBwcml2YXRlXG4gICAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICByZWFkb25seSBuYW1lOiBULFxuICAgIHJlYWRvbmx5IGluc3RhbmNlRmFjdG9yeTogSW5zdGFuY2VGYWN0b3J5PFQ+LFxuICAgIHJlYWRvbmx5IHR5cGU6IENvbXBvbmVudFR5cGVcbiAgKSB7fVxuXG4gIHNldEluc3RhbnRpYXRpb25Nb2RlKG1vZGU6IEluc3RhbnRpYXRpb25Nb2RlKTogdGhpcyB7XG4gICAgdGhpcy5pbnN0YW50aWF0aW9uTW9kZSA9IG1vZGU7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBzZXRNdWx0aXBsZUluc3RhbmNlcyhtdWx0aXBsZUluc3RhbmNlczogYm9vbGVhbik6IHRoaXMge1xuICAgIHRoaXMubXVsdGlwbGVJbnN0YW5jZXMgPSBtdWx0aXBsZUluc3RhbmNlcztcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHNldFNlcnZpY2VQcm9wcyhwcm9wczogRGljdGlvbmFyeSk6IHRoaXMge1xuICAgIHRoaXMuc2VydmljZVByb3BzID0gcHJvcHM7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBzZXRJbnN0YW5jZUNyZWF0ZWRDYWxsYmFjayhjYWxsYmFjazogb25JbnN0YW5jZUNyZWF0ZWRDYWxsYmFjazxUPik6IHRoaXMge1xuICAgIHRoaXMub25JbnN0YW5jZUNyZWF0ZWQgPSBjYWxsYmFjaztcbiAgICByZXR1cm4gdGhpcztcbiAgfVxufVxuIiwgIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0VOVFJZX05BTUUgPSAnW0RFRkFVTFRdJztcbiIsICIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBEZWZlcnJlZCB9IGZyb20gJ0BmaXJlYmFzZS91dGlsJztcbmltcG9ydCB7IENvbXBvbmVudENvbnRhaW5lciB9IGZyb20gJy4vY29tcG9uZW50X2NvbnRhaW5lcic7XG5pbXBvcnQgeyBERUZBVUxUX0VOVFJZX05BTUUgfSBmcm9tICcuL2NvbnN0YW50cyc7XG5pbXBvcnQge1xuICBJbml0aWFsaXplT3B0aW9ucyxcbiAgSW5zdGFudGlhdGlvbk1vZGUsXG4gIE5hbWUsXG4gIE5hbWVTZXJ2aWNlTWFwcGluZyxcbiAgT25Jbml0Q2FsbEJhY2tcbn0gZnJvbSAnLi90eXBlcyc7XG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudCc7XG5cbi8qKlxuICogUHJvdmlkZXIgZm9yIGluc3RhbmNlIGZvciBzZXJ2aWNlIG5hbWUgVCwgZS5nLiAnYXV0aCcsICdhdXRoLWludGVybmFsJ1xuICogTmFtZVNlcnZpY2VNYXBwaW5nW1RdIGlzIGFuIGFsaWFzIGZvciB0aGUgdHlwZSBvZiB0aGUgaW5zdGFuY2VcbiAqL1xuZXhwb3J0IGNsYXNzIFByb3ZpZGVyPFQgZXh0ZW5kcyBOYW1lPiB7XG4gIHByaXZhdGUgY29tcG9uZW50OiBDb21wb25lbnQ8VD4gfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSByZWFkb25seSBpbnN0YW5jZXM6IE1hcDxzdHJpbmcsIE5hbWVTZXJ2aWNlTWFwcGluZ1tUXT4gPSBuZXcgTWFwKCk7XG4gIHByaXZhdGUgcmVhZG9ubHkgaW5zdGFuY2VzRGVmZXJyZWQ6IE1hcDxcbiAgICBzdHJpbmcsXG4gICAgRGVmZXJyZWQ8TmFtZVNlcnZpY2VNYXBwaW5nW1RdPlxuICA+ID0gbmV3IE1hcCgpO1xuICBwcml2YXRlIHJlYWRvbmx5IGluc3RhbmNlc09wdGlvbnM6IE1hcDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIHVua25vd24+PiA9XG4gICAgbmV3IE1hcCgpO1xuICBwcml2YXRlIG9uSW5pdENhbGxiYWNrczogTWFwPHN0cmluZywgU2V0PE9uSW5pdENhbGxCYWNrPFQ+Pj4gPSBuZXcgTWFwKCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSByZWFkb25seSBuYW1lOiBULFxuICAgIHByaXZhdGUgcmVhZG9ubHkgY29udGFpbmVyOiBDb21wb25lbnRDb250YWluZXJcbiAgKSB7fVxuXG4gIC8qKlxuICAgKiBAcGFyYW0gaWRlbnRpZmllciBBIHByb3ZpZGVyIGNhbiBwcm92aWRlIG11bGl0cGxlIGluc3RhbmNlcyBvZiBhIHNlcnZpY2VcbiAgICogaWYgdGhpcy5jb21wb25lbnQubXVsdGlwbGVJbnN0YW5jZXMgaXMgdHJ1ZS5cbiAgICovXG4gIGdldChpZGVudGlmaWVyPzogc3RyaW5nKTogUHJvbWlzZTxOYW1lU2VydmljZU1hcHBpbmdbVF0+IHtcbiAgICAvLyBpZiBtdWx0aXBsZUluc3RhbmNlcyBpcyBub3Qgc3VwcG9ydGVkLCB1c2UgdGhlIGRlZmF1bHQgbmFtZVxuICAgIGNvbnN0IG5vcm1hbGl6ZWRJZGVudGlmaWVyID0gdGhpcy5ub3JtYWxpemVJbnN0YW5jZUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG5cbiAgICBpZiAoIXRoaXMuaW5zdGFuY2VzRGVmZXJyZWQuaGFzKG5vcm1hbGl6ZWRJZGVudGlmaWVyKSkge1xuICAgICAgY29uc3QgZGVmZXJyZWQgPSBuZXcgRGVmZXJyZWQ8TmFtZVNlcnZpY2VNYXBwaW5nW1RdPigpO1xuICAgICAgdGhpcy5pbnN0YW5jZXNEZWZlcnJlZC5zZXQobm9ybWFsaXplZElkZW50aWZpZXIsIGRlZmVycmVkKTtcblxuICAgICAgaWYgKFxuICAgICAgICB0aGlzLmlzSW5pdGlhbGl6ZWQobm9ybWFsaXplZElkZW50aWZpZXIpIHx8XG4gICAgICAgIHRoaXMuc2hvdWxkQXV0b0luaXRpYWxpemUoKVxuICAgICAgKSB7XG4gICAgICAgIC8vIGluaXRpYWxpemUgdGhlIHNlcnZpY2UgaWYgaXQgY2FuIGJlIGF1dG8taW5pdGlhbGl6ZWRcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuZ2V0T3JJbml0aWFsaXplU2VydmljZSh7XG4gICAgICAgICAgICBpbnN0YW5jZUlkZW50aWZpZXI6IG5vcm1hbGl6ZWRJZGVudGlmaWVyXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKGluc3RhbmNlKSB7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKGluc3RhbmNlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAvLyB3aGVuIHRoZSBpbnN0YW5jZSBmYWN0b3J5IHRocm93cyBhbiBleGNlcHRpb24gZHVyaW5nIGdldCgpLCBpdCBzaG91bGQgbm90IGNhdXNlXG4gICAgICAgICAgLy8gYSBmYXRhbCBlcnJvci4gV2UganVzdCByZXR1cm4gdGhlIHVucmVzb2x2ZWQgcHJvbWlzZSBpbiB0aGlzIGNhc2UuXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5pbnN0YW5jZXNEZWZlcnJlZC5nZXQobm9ybWFsaXplZElkZW50aWZpZXIpIS5wcm9taXNlO1xuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSBvcHRpb25zLmlkZW50aWZpZXIgQSBwcm92aWRlciBjYW4gcHJvdmlkZSBtdWxpdHBsZSBpbnN0YW5jZXMgb2YgYSBzZXJ2aWNlXG4gICAqIGlmIHRoaXMuY29tcG9uZW50Lm11bHRpcGxlSW5zdGFuY2VzIGlzIHRydWUuXG4gICAqIEBwYXJhbSBvcHRpb25zLm9wdGlvbmFsIElmIG9wdGlvbmFsIGlzIGZhbHNlIG9yIG5vdCBwcm92aWRlZCwgdGhlIG1ldGhvZCB0aHJvd3MgYW4gZXJyb3Igd2hlblxuICAgKiB0aGUgc2VydmljZSBpcyBub3QgaW1tZWRpYXRlbHkgYXZhaWxhYmxlLlxuICAgKiBJZiBvcHRpb25hbCBpcyB0cnVlLCB0aGUgbWV0aG9kIHJldHVybnMgbnVsbCBpZiB0aGUgc2VydmljZSBpcyBub3QgaW1tZWRpYXRlbHkgYXZhaWxhYmxlLlxuICAgKi9cbiAgZ2V0SW1tZWRpYXRlKG9wdGlvbnM6IHtcbiAgICBpZGVudGlmaWVyPzogc3RyaW5nO1xuICAgIG9wdGlvbmFsOiB0cnVlO1xuICB9KTogTmFtZVNlcnZpY2VNYXBwaW5nW1RdIHwgbnVsbDtcbiAgZ2V0SW1tZWRpYXRlKG9wdGlvbnM/OiB7XG4gICAgaWRlbnRpZmllcj86IHN0cmluZztcbiAgICBvcHRpb25hbD86IGZhbHNlO1xuICB9KTogTmFtZVNlcnZpY2VNYXBwaW5nW1RdO1xuICBnZXRJbW1lZGlhdGUob3B0aW9ucz86IHtcbiAgICBpZGVudGlmaWVyPzogc3RyaW5nO1xuICAgIG9wdGlvbmFsPzogYm9vbGVhbjtcbiAgfSk6IE5hbWVTZXJ2aWNlTWFwcGluZ1tUXSB8IG51bGwge1xuICAgIC8vIGlmIG11bHRpcGxlSW5zdGFuY2VzIGlzIG5vdCBzdXBwb3J0ZWQsIHVzZSB0aGUgZGVmYXVsdCBuYW1lXG4gICAgY29uc3Qgbm9ybWFsaXplZElkZW50aWZpZXIgPSB0aGlzLm5vcm1hbGl6ZUluc3RhbmNlSWRlbnRpZmllcihcbiAgICAgIG9wdGlvbnM/LmlkZW50aWZpZXJcbiAgICApO1xuICAgIGNvbnN0IG9wdGlvbmFsID0gb3B0aW9ucz8ub3B0aW9uYWwgPz8gZmFsc2U7XG5cbiAgICBpZiAoXG4gICAgICB0aGlzLmlzSW5pdGlhbGl6ZWQobm9ybWFsaXplZElkZW50aWZpZXIpIHx8XG4gICAgICB0aGlzLnNob3VsZEF1dG9Jbml0aWFsaXplKClcbiAgICApIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldE9ySW5pdGlhbGl6ZVNlcnZpY2Uoe1xuICAgICAgICAgIGluc3RhbmNlSWRlbnRpZmllcjogbm9ybWFsaXplZElkZW50aWZpZXJcbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGlmIChvcHRpb25hbCkge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSW4gY2FzZSBhIGNvbXBvbmVudCBpcyBub3QgaW5pdGlhbGl6ZWQgYW5kIHNob3VsZC9jYW4gbm90IGJlIGF1dG8taW5pdGlhbGl6ZWQgYXQgdGhlIG1vbWVudCwgcmV0dXJuIG51bGwgaWYgdGhlIG9wdGlvbmFsIGZsYWcgaXMgc2V0LCBvciB0aHJvd1xuICAgICAgaWYgKG9wdGlvbmFsKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoYFNlcnZpY2UgJHt0aGlzLm5hbWV9IGlzIG5vdCBhdmFpbGFibGVgKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBnZXRDb21wb25lbnQoKTogQ29tcG9uZW50PFQ+IHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuY29tcG9uZW50O1xuICB9XG5cbiAgc2V0Q29tcG9uZW50KGNvbXBvbmVudDogQ29tcG9uZW50PFQ+KTogdm9pZCB7XG4gICAgaWYgKGNvbXBvbmVudC5uYW1lICE9PSB0aGlzLm5hbWUpIHtcbiAgICAgIHRocm93IEVycm9yKFxuICAgICAgICBgTWlzbWF0Y2hpbmcgQ29tcG9uZW50ICR7Y29tcG9uZW50Lm5hbWV9IGZvciBQcm92aWRlciAke3RoaXMubmFtZX0uYFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5jb21wb25lbnQpIHtcbiAgICAgIHRocm93IEVycm9yKGBDb21wb25lbnQgZm9yICR7dGhpcy5uYW1lfSBoYXMgYWxyZWFkeSBiZWVuIHByb3ZpZGVkYCk7XG4gICAgfVxuXG4gICAgdGhpcy5jb21wb25lbnQgPSBjb21wb25lbnQ7XG5cbiAgICAvLyByZXR1cm4gZWFybHkgd2l0aG91dCBhdHRlbXB0aW5nIHRvIGluaXRpYWxpemUgdGhlIGNvbXBvbmVudCBpZiB0aGUgY29tcG9uZW50IHJlcXVpcmVzIGV4cGxpY2l0IGluaXRpYWxpemF0aW9uIChjYWxsaW5nIGBQcm92aWRlci5pbml0aWFsaXplKClgKVxuICAgIGlmICghdGhpcy5zaG91bGRBdXRvSW5pdGlhbGl6ZSgpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gaWYgdGhlIHNlcnZpY2UgaXMgZWFnZXIsIGluaXRpYWxpemUgdGhlIGRlZmF1bHQgaW5zdGFuY2VcbiAgICBpZiAoaXNDb21wb25lbnRFYWdlcihjb21wb25lbnQpKSB7XG4gICAgICB0cnkge1xuICAgICAgICB0aGlzLmdldE9ySW5pdGlhbGl6ZVNlcnZpY2UoeyBpbnN0YW5jZUlkZW50aWZpZXI6IERFRkFVTFRfRU5UUllfTkFNRSB9KTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gd2hlbiB0aGUgaW5zdGFuY2UgZmFjdG9yeSBmb3IgYW4gZWFnZXIgQ29tcG9uZW50IHRocm93cyBhbiBleGNlcHRpb24gZHVyaW5nIHRoZSBlYWdlclxuICAgICAgICAvLyBpbml0aWFsaXphdGlvbiwgaXQgc2hvdWxkIG5vdCBjYXVzZSBhIGZhdGFsIGVycm9yLlxuICAgICAgICAvLyBUT0RPOiBJbnZlc3RpZ2F0ZSBpZiB3ZSBuZWVkIHRvIG1ha2UgaXQgY29uZmlndXJhYmxlLCBiZWNhdXNlIHNvbWUgY29tcG9uZW50IG1heSB3YW50IHRvIGNhdXNlXG4gICAgICAgIC8vIGEgZmF0YWwgZXJyb3IgaW4gdGhpcyBjYXNlP1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIENyZWF0ZSBzZXJ2aWNlIGluc3RhbmNlcyBmb3IgdGhlIHBlbmRpbmcgcHJvbWlzZXMgYW5kIHJlc29sdmUgdGhlbVxuICAgIC8vIE5PVEU6IGlmIHRoaXMubXVsdGlwbGVJbnN0YW5jZXMgaXMgZmFsc2UsIG9ubHkgdGhlIGRlZmF1bHQgaW5zdGFuY2Ugd2lsbCBiZSBjcmVhdGVkXG4gICAgLy8gYW5kIGFsbCBwcm9taXNlcyB3aXRoIHJlc29sdmUgd2l0aCBpdCByZWdhcmRsZXNzIG9mIHRoZSBpZGVudGlmaWVyLlxuICAgIGZvciAoY29uc3QgW1xuICAgICAgaW5zdGFuY2VJZGVudGlmaWVyLFxuICAgICAgaW5zdGFuY2VEZWZlcnJlZFxuICAgIF0gb2YgdGhpcy5pbnN0YW5jZXNEZWZlcnJlZC5lbnRyaWVzKCkpIHtcbiAgICAgIGNvbnN0IG5vcm1hbGl6ZWRJZGVudGlmaWVyID1cbiAgICAgICAgdGhpcy5ub3JtYWxpemVJbnN0YW5jZUlkZW50aWZpZXIoaW5zdGFuY2VJZGVudGlmaWVyKTtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gYGdldE9ySW5pdGlhbGl6ZVNlcnZpY2UoKWAgc2hvdWxkIGFsd2F5cyByZXR1cm4gYSB2YWxpZCBpbnN0YW5jZSBzaW5jZSBhIGNvbXBvbmVudCBpcyBndWFyYW50ZWVkLiB1c2UgISB0byBtYWtlIHR5cGVzY3JpcHQgaGFwcHkuXG4gICAgICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5nZXRPckluaXRpYWxpemVTZXJ2aWNlKHtcbiAgICAgICAgICBpbnN0YW5jZUlkZW50aWZpZXI6IG5vcm1hbGl6ZWRJZGVudGlmaWVyXG4gICAgICAgIH0pITtcbiAgICAgICAgaW5zdGFuY2VEZWZlcnJlZC5yZXNvbHZlKGluc3RhbmNlKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gd2hlbiB0aGUgaW5zdGFuY2UgZmFjdG9yeSB0aHJvd3MgYW4gZXhjZXB0aW9uLCBpdCBzaG91bGQgbm90IGNhdXNlXG4gICAgICAgIC8vIGEgZmF0YWwgZXJyb3IuIFdlIGp1c3QgbGVhdmUgdGhlIHByb21pc2UgdW5yZXNvbHZlZC5cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjbGVhckluc3RhbmNlKGlkZW50aWZpZXI6IHN0cmluZyA9IERFRkFVTFRfRU5UUllfTkFNRSk6IHZvaWQge1xuICAgIHRoaXMuaW5zdGFuY2VzRGVmZXJyZWQuZGVsZXRlKGlkZW50aWZpZXIpO1xuICAgIHRoaXMuaW5zdGFuY2VzT3B0aW9ucy5kZWxldGUoaWRlbnRpZmllcik7XG4gICAgdGhpcy5pbnN0YW5jZXMuZGVsZXRlKGlkZW50aWZpZXIpO1xuICB9XG5cbiAgLy8gYXBwLmRlbGV0ZSgpIHdpbGwgY2FsbCB0aGlzIG1ldGhvZCBvbiBldmVyeSBwcm92aWRlciB0byBkZWxldGUgdGhlIHNlcnZpY2VzXG4gIC8vIFRPRE86IHNob3VsZCB3ZSBtYXJrIHRoZSBwcm92aWRlciBhcyBkZWxldGVkP1xuICBhc3luYyBkZWxldGUoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3Qgc2VydmljZXMgPSBBcnJheS5mcm9tKHRoaXMuaW5zdGFuY2VzLnZhbHVlcygpKTtcblxuICAgIGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgIC4uLnNlcnZpY2VzXG4gICAgICAgIC5maWx0ZXIoc2VydmljZSA9PiAnSU5URVJOQUwnIGluIHNlcnZpY2UpIC8vIGxlZ2FjeSBzZXJ2aWNlc1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICAgICAgICAubWFwKHNlcnZpY2UgPT4gKHNlcnZpY2UgYXMgYW55KS5JTlRFUk5BTCEuZGVsZXRlKCkpLFxuICAgICAgLi4uc2VydmljZXNcbiAgICAgICAgLmZpbHRlcihzZXJ2aWNlID0+ICdfZGVsZXRlJyBpbiBzZXJ2aWNlKSAvLyBtb2R1bGFyaXplZCBzZXJ2aWNlc1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICAgICAgICAubWFwKHNlcnZpY2UgPT4gKHNlcnZpY2UgYXMgYW55KS5fZGVsZXRlKCkpXG4gICAgXSk7XG4gIH1cblxuICBpc0NvbXBvbmVudFNldCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5jb21wb25lbnQgIT0gbnVsbDtcbiAgfVxuXG4gIGlzSW5pdGlhbGl6ZWQoaWRlbnRpZmllcjogc3RyaW5nID0gREVGQVVMVF9FTlRSWV9OQU1FKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuaW5zdGFuY2VzLmhhcyhpZGVudGlmaWVyKTtcbiAgfVxuXG4gIGdldE9wdGlvbnMoaWRlbnRpZmllcjogc3RyaW5nID0gREVGQVVMVF9FTlRSWV9OQU1FKTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4ge1xuICAgIHJldHVybiB0aGlzLmluc3RhbmNlc09wdGlvbnMuZ2V0KGlkZW50aWZpZXIpIHx8IHt9O1xuICB9XG5cbiAgaW5pdGlhbGl6ZShvcHRzOiBJbml0aWFsaXplT3B0aW9ucyA9IHt9KTogTmFtZVNlcnZpY2VNYXBwaW5nW1RdIHtcbiAgICBjb25zdCB7IG9wdGlvbnMgPSB7fSB9ID0gb3B0cztcbiAgICBjb25zdCBub3JtYWxpemVkSWRlbnRpZmllciA9IHRoaXMubm9ybWFsaXplSW5zdGFuY2VJZGVudGlmaWVyKFxuICAgICAgb3B0cy5pbnN0YW5jZUlkZW50aWZpZXJcbiAgICApO1xuICAgIGlmICh0aGlzLmlzSW5pdGlhbGl6ZWQobm9ybWFsaXplZElkZW50aWZpZXIpKSB7XG4gICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgYCR7dGhpcy5uYW1lfSgke25vcm1hbGl6ZWRJZGVudGlmaWVyfSkgaGFzIGFscmVhZHkgYmVlbiBpbml0aWFsaXplZGBcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmlzQ29tcG9uZW50U2V0KCkpIHtcbiAgICAgIHRocm93IEVycm9yKGBDb21wb25lbnQgJHt0aGlzLm5hbWV9IGhhcyBub3QgYmVlbiByZWdpc3RlcmVkIHlldGApO1xuICAgIH1cblxuICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5nZXRPckluaXRpYWxpemVTZXJ2aWNlKHtcbiAgICAgIGluc3RhbmNlSWRlbnRpZmllcjogbm9ybWFsaXplZElkZW50aWZpZXIsXG4gICAgICBvcHRpb25zXG4gICAgfSkhO1xuXG4gICAgLy8gcmVzb2x2ZSBhbnkgcGVuZGluZyBwcm9taXNlIHdhaXRpbmcgZm9yIHRoZSBzZXJ2aWNlIGluc3RhbmNlXG4gICAgZm9yIChjb25zdCBbXG4gICAgICBpbnN0YW5jZUlkZW50aWZpZXIsXG4gICAgICBpbnN0YW5jZURlZmVycmVkXG4gICAgXSBvZiB0aGlzLmluc3RhbmNlc0RlZmVycmVkLmVudHJpZXMoKSkge1xuICAgICAgY29uc3Qgbm9ybWFsaXplZERlZmVycmVkSWRlbnRpZmllciA9XG4gICAgICAgIHRoaXMubm9ybWFsaXplSW5zdGFuY2VJZGVudGlmaWVyKGluc3RhbmNlSWRlbnRpZmllcik7XG4gICAgICBpZiAobm9ybWFsaXplZElkZW50aWZpZXIgPT09IG5vcm1hbGl6ZWREZWZlcnJlZElkZW50aWZpZXIpIHtcbiAgICAgICAgaW5zdGFuY2VEZWZlcnJlZC5yZXNvbHZlKGluc3RhbmNlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gaW5zdGFuY2U7XG4gIH1cblxuICAvKipcbiAgICpcbiAgICogQHBhcmFtIGNhbGxiYWNrIC0gYSBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgaW52b2tlZCAgYWZ0ZXIgdGhlIHByb3ZpZGVyIGhhcyBiZWVuIGluaXRpYWxpemVkIGJ5IGNhbGxpbmcgcHJvdmlkZXIuaW5pdGlhbGl6ZSgpLlxuICAgKiBUaGUgZnVuY3Rpb24gaXMgaW52b2tlZCBTWU5DSFJPTk9VU0xZLCBzbyBpdCBzaG91bGQgbm90IGV4ZWN1dGUgYW55IGxvbmdydW5uaW5nIHRhc2tzIGluIG9yZGVyIHRvIG5vdCBibG9jayB0aGUgcHJvZ3JhbS5cbiAgICpcbiAgICogQHBhcmFtIGlkZW50aWZpZXIgQW4gb3B0aW9uYWwgaW5zdGFuY2UgaWRlbnRpZmllclxuICAgKiBAcmV0dXJucyBhIGZ1bmN0aW9uIHRvIHVucmVnaXN0ZXIgdGhlIGNhbGxiYWNrXG4gICAqL1xuICBvbkluaXQoY2FsbGJhY2s6IE9uSW5pdENhbGxCYWNrPFQ+LCBpZGVudGlmaWVyPzogc3RyaW5nKTogKCkgPT4gdm9pZCB7XG4gICAgY29uc3Qgbm9ybWFsaXplZElkZW50aWZpZXIgPSB0aGlzLm5vcm1hbGl6ZUluc3RhbmNlSWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICBjb25zdCBleGlzdGluZ0NhbGxiYWNrcyA9XG4gICAgICB0aGlzLm9uSW5pdENhbGxiYWNrcy5nZXQobm9ybWFsaXplZElkZW50aWZpZXIpID8/XG4gICAgICBuZXcgU2V0PE9uSW5pdENhbGxCYWNrPFQ+PigpO1xuICAgIGV4aXN0aW5nQ2FsbGJhY2tzLmFkZChjYWxsYmFjayk7XG4gICAgdGhpcy5vbkluaXRDYWxsYmFja3Muc2V0KG5vcm1hbGl6ZWRJZGVudGlmaWVyLCBleGlzdGluZ0NhbGxiYWNrcyk7XG5cbiAgICBjb25zdCBleGlzdGluZ0luc3RhbmNlID0gdGhpcy5pbnN0YW5jZXMuZ2V0KG5vcm1hbGl6ZWRJZGVudGlmaWVyKTtcbiAgICBpZiAoZXhpc3RpbmdJbnN0YW5jZSkge1xuICAgICAgY2FsbGJhY2soZXhpc3RpbmdJbnN0YW5jZSwgbm9ybWFsaXplZElkZW50aWZpZXIpO1xuICAgIH1cblxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBleGlzdGluZ0NhbGxiYWNrcy5kZWxldGUoY2FsbGJhY2spO1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogSW52b2tlIG9uSW5pdCBjYWxsYmFja3Mgc3luY2hyb25vdXNseVxuICAgKiBAcGFyYW0gaW5zdGFuY2UgdGhlIHNlcnZpY2UgaW5zdGFuY2VgXG4gICAqL1xuICBwcml2YXRlIGludm9rZU9uSW5pdENhbGxiYWNrcyhcbiAgICBpbnN0YW5jZTogTmFtZVNlcnZpY2VNYXBwaW5nW1RdLFxuICAgIGlkZW50aWZpZXI6IHN0cmluZ1xuICApOiB2b2lkIHtcbiAgICBjb25zdCBjYWxsYmFja3MgPSB0aGlzLm9uSW5pdENhbGxiYWNrcy5nZXQoaWRlbnRpZmllcik7XG4gICAgaWYgKCFjYWxsYmFja3MpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZm9yIChjb25zdCBjYWxsYmFjayBvZiBjYWxsYmFja3MpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNhbGxiYWNrKGluc3RhbmNlLCBpZGVudGlmaWVyKTtcbiAgICAgIH0gY2F0Y2gge1xuICAgICAgICAvLyBpZ25vcmUgZXJyb3JzIGluIHRoZSBvbkluaXQgY2FsbGJhY2tcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGdldE9ySW5pdGlhbGl6ZVNlcnZpY2Uoe1xuICAgIGluc3RhbmNlSWRlbnRpZmllcixcbiAgICBvcHRpb25zID0ge31cbiAgfToge1xuICAgIGluc3RhbmNlSWRlbnRpZmllcjogc3RyaW5nO1xuICAgIG9wdGlvbnM/OiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPjtcbiAgfSk6IE5hbWVTZXJ2aWNlTWFwcGluZ1tUXSB8IG51bGwge1xuICAgIGxldCBpbnN0YW5jZSA9IHRoaXMuaW5zdGFuY2VzLmdldChpbnN0YW5jZUlkZW50aWZpZXIpO1xuICAgIGlmICghaW5zdGFuY2UgJiYgdGhpcy5jb21wb25lbnQpIHtcbiAgICAgIGluc3RhbmNlID0gdGhpcy5jb21wb25lbnQuaW5zdGFuY2VGYWN0b3J5KHRoaXMuY29udGFpbmVyLCB7XG4gICAgICAgIGluc3RhbmNlSWRlbnRpZmllcjogbm9ybWFsaXplSWRlbnRpZmllckZvckZhY3RvcnkoaW5zdGFuY2VJZGVudGlmaWVyKSxcbiAgICAgICAgb3B0aW9uc1xuICAgICAgfSk7XG4gICAgICB0aGlzLmluc3RhbmNlcy5zZXQoaW5zdGFuY2VJZGVudGlmaWVyLCBpbnN0YW5jZSk7XG4gICAgICB0aGlzLmluc3RhbmNlc09wdGlvbnMuc2V0KGluc3RhbmNlSWRlbnRpZmllciwgb3B0aW9ucyk7XG5cbiAgICAgIC8qKlxuICAgICAgICogSW52b2tlIG9uSW5pdCBsaXN0ZW5lcnMuXG4gICAgICAgKiBOb3RlIHRoaXMuY29tcG9uZW50Lm9uSW5zdGFuY2VDcmVhdGVkIGlzIGRpZmZlcmVudCwgd2hpY2ggaXMgdXNlZCBieSB0aGUgY29tcG9uZW50IGNyZWF0b3IsXG4gICAgICAgKiB3aGlsZSBvbkluaXQgbGlzdGVuZXJzIGFyZSByZWdpc3RlcmVkIGJ5IGNvbnN1bWVycyBvZiB0aGUgcHJvdmlkZXIuXG4gICAgICAgKi9cbiAgICAgIHRoaXMuaW52b2tlT25Jbml0Q2FsbGJhY2tzKGluc3RhbmNlLCBpbnN0YW5jZUlkZW50aWZpZXIpO1xuXG4gICAgICAvKipcbiAgICAgICAqIE9yZGVyIGlzIGltcG9ydGFudFxuICAgICAgICogb25JbnN0YW5jZUNyZWF0ZWQoKSBzaG91bGQgYmUgY2FsbGVkIGFmdGVyIHRoaXMuaW5zdGFuY2VzLnNldChpbnN0YW5jZUlkZW50aWZpZXIsIGluc3RhbmNlKTsgd2hpY2hcbiAgICAgICAqIG1ha2VzIGBpc0luaXRpYWxpemVkKClgIHJldHVybiB0cnVlLlxuICAgICAgICovXG4gICAgICBpZiAodGhpcy5jb21wb25lbnQub25JbnN0YW5jZUNyZWF0ZWQpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB0aGlzLmNvbXBvbmVudC5vbkluc3RhbmNlQ3JlYXRlZChcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLFxuICAgICAgICAgICAgaW5zdGFuY2VJZGVudGlmaWVyLFxuICAgICAgICAgICAgaW5zdGFuY2VcbiAgICAgICAgICApO1xuICAgICAgICB9IGNhdGNoIHtcbiAgICAgICAgICAvLyBpZ25vcmUgZXJyb3JzIGluIHRoZSBvbkluc3RhbmNlQ3JlYXRlZENhbGxiYWNrXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gaW5zdGFuY2UgfHwgbnVsbDtcbiAgfVxuXG4gIHByaXZhdGUgbm9ybWFsaXplSW5zdGFuY2VJZGVudGlmaWVyKFxuICAgIGlkZW50aWZpZXI6IHN0cmluZyA9IERFRkFVTFRfRU5UUllfTkFNRVxuICApOiBzdHJpbmcge1xuICAgIGlmICh0aGlzLmNvbXBvbmVudCkge1xuICAgICAgcmV0dXJuIHRoaXMuY29tcG9uZW50Lm11bHRpcGxlSW5zdGFuY2VzID8gaWRlbnRpZmllciA6IERFRkFVTFRfRU5UUllfTkFNRTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGlkZW50aWZpZXI7IC8vIGFzc3VtZSBtdWx0aXBsZSBpbnN0YW5jZXMgYXJlIHN1cHBvcnRlZCBiZWZvcmUgdGhlIGNvbXBvbmVudCBpcyBwcm92aWRlZC5cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHNob3VsZEF1dG9Jbml0aWFsaXplKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAoXG4gICAgICAhIXRoaXMuY29tcG9uZW50ICYmXG4gICAgICB0aGlzLmNvbXBvbmVudC5pbnN0YW50aWF0aW9uTW9kZSAhPT0gSW5zdGFudGlhdGlvbk1vZGUuRVhQTElDSVRcbiAgICApO1xuICB9XG59XG5cbi8vIHVuZGVmaW5lZCBzaG91bGQgYmUgcGFzc2VkIHRvIHRoZSBzZXJ2aWNlIGZhY3RvcnkgZm9yIHRoZSBkZWZhdWx0IGluc3RhbmNlXG5mdW5jdGlvbiBub3JtYWxpemVJZGVudGlmaWVyRm9yRmFjdG9yeShpZGVudGlmaWVyOiBzdHJpbmcpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICByZXR1cm4gaWRlbnRpZmllciA9PT0gREVGQVVMVF9FTlRSWV9OQU1FID8gdW5kZWZpbmVkIDogaWRlbnRpZmllcjtcbn1cblxuZnVuY3Rpb24gaXNDb21wb25lbnRFYWdlcjxUIGV4dGVuZHMgTmFtZT4oY29tcG9uZW50OiBDb21wb25lbnQ8VD4pOiBib29sZWFuIHtcbiAgcmV0dXJuIGNvbXBvbmVudC5pbnN0YW50aWF0aW9uTW9kZSA9PT0gSW5zdGFudGlhdGlvbk1vZGUuRUFHRVI7XG59XG4iLCAiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgUHJvdmlkZXIgfSBmcm9tICcuL3Byb3ZpZGVyJztcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50JztcbmltcG9ydCB7IE5hbWUgfSBmcm9tICcuL3R5cGVzJztcblxuLyoqXG4gKiBDb21wb25lbnRDb250YWluZXIgdGhhdCBwcm92aWRlcyBQcm92aWRlcnMgZm9yIHNlcnZpY2UgbmFtZSBULCBlLmcuIGBhdXRoYCwgYGF1dGgtaW50ZXJuYWxgXG4gKi9cbmV4cG9ydCBjbGFzcyBDb21wb25lbnRDb250YWluZXIge1xuICBwcml2YXRlIHJlYWRvbmx5IHByb3ZpZGVycyA9IG5ldyBNYXA8c3RyaW5nLCBQcm92aWRlcjxOYW1lPj4oKTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IG5hbWU6IHN0cmluZykge31cblxuICAvKipcbiAgICpcbiAgICogQHBhcmFtIGNvbXBvbmVudCBDb21wb25lbnQgYmVpbmcgYWRkZWRcbiAgICogQHBhcmFtIG92ZXJ3cml0ZSBXaGVuIGEgY29tcG9uZW50IHdpdGggdGhlIHNhbWUgbmFtZSBoYXMgYWxyZWFkeSBiZWVuIHJlZ2lzdGVyZWQsXG4gICAqIGlmIG92ZXJ3cml0ZSBpcyB0cnVlOiBvdmVyd3JpdGUgdGhlIGV4aXN0aW5nIGNvbXBvbmVudCB3aXRoIHRoZSBuZXcgY29tcG9uZW50IGFuZCBjcmVhdGUgYSBuZXdcbiAgICogcHJvdmlkZXIgd2l0aCB0aGUgbmV3IGNvbXBvbmVudC4gSXQgY2FuIGJlIHVzZWZ1bCBpbiB0ZXN0cyB3aGVyZSB5b3Ugd2FudCB0byB1c2UgZGlmZmVyZW50IG1vY2tzXG4gICAqIGZvciBkaWZmZXJlbnQgdGVzdHMuXG4gICAqIGlmIG92ZXJ3cml0ZSBpcyBmYWxzZTogdGhyb3cgYW4gZXhjZXB0aW9uXG4gICAqL1xuICBhZGRDb21wb25lbnQ8VCBleHRlbmRzIE5hbWU+KGNvbXBvbmVudDogQ29tcG9uZW50PFQ+KTogdm9pZCB7XG4gICAgY29uc3QgcHJvdmlkZXIgPSB0aGlzLmdldFByb3ZpZGVyKGNvbXBvbmVudC5uYW1lKTtcbiAgICBpZiAocHJvdmlkZXIuaXNDb21wb25lbnRTZXQoKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgQ29tcG9uZW50ICR7Y29tcG9uZW50Lm5hbWV9IGhhcyBhbHJlYWR5IGJlZW4gcmVnaXN0ZXJlZCB3aXRoICR7dGhpcy5uYW1lfWBcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcHJvdmlkZXIuc2V0Q29tcG9uZW50KGNvbXBvbmVudCk7XG4gIH1cblxuICBhZGRPck92ZXJ3cml0ZUNvbXBvbmVudDxUIGV4dGVuZHMgTmFtZT4oY29tcG9uZW50OiBDb21wb25lbnQ8VD4pOiB2b2lkIHtcbiAgICBjb25zdCBwcm92aWRlciA9IHRoaXMuZ2V0UHJvdmlkZXIoY29tcG9uZW50Lm5hbWUpO1xuICAgIGlmIChwcm92aWRlci5pc0NvbXBvbmVudFNldCgpKSB7XG4gICAgICAvLyBkZWxldGUgdGhlIGV4aXN0aW5nIHByb3ZpZGVyIGZyb20gdGhlIGNvbnRhaW5lciwgc28gd2UgY2FuIHJlZ2lzdGVyIHRoZSBuZXcgY29tcG9uZW50XG4gICAgICB0aGlzLnByb3ZpZGVycy5kZWxldGUoY29tcG9uZW50Lm5hbWUpO1xuICAgIH1cblxuICAgIHRoaXMuYWRkQ29tcG9uZW50KGNvbXBvbmVudCk7XG4gIH1cblxuICAvKipcbiAgICogZ2V0UHJvdmlkZXIgcHJvdmlkZXMgYSB0eXBlIHNhZmUgaW50ZXJmYWNlIHdoZXJlIGl0IGNhbiBvbmx5IGJlIGNhbGxlZCB3aXRoIGEgZmllbGQgbmFtZVxuICAgKiBwcmVzZW50IGluIE5hbWVTZXJ2aWNlTWFwcGluZyBpbnRlcmZhY2UuXG4gICAqXG4gICAqIEZpcmViYXNlIFNES3MgcHJvdmlkaW5nIHNlcnZpY2VzIHNob3VsZCBleHRlbmQgTmFtZVNlcnZpY2VNYXBwaW5nIGludGVyZmFjZSB0byByZWdpc3RlclxuICAgKiB0aGVtc2VsdmVzLlxuICAgKi9cbiAgZ2V0UHJvdmlkZXI8VCBleHRlbmRzIE5hbWU+KG5hbWU6IFQpOiBQcm92aWRlcjxUPiB7XG4gICAgaWYgKHRoaXMucHJvdmlkZXJzLmhhcyhuYW1lKSkge1xuICAgICAgcmV0dXJuIHRoaXMucHJvdmlkZXJzLmdldChuYW1lKSBhcyB1bmtub3duIGFzIFByb3ZpZGVyPFQ+O1xuICAgIH1cblxuICAgIC8vIGNyZWF0ZSBhIFByb3ZpZGVyIGZvciBhIHNlcnZpY2UgdGhhdCBoYXNuJ3QgcmVnaXN0ZXJlZCB3aXRoIEZpcmViYXNlXG4gICAgY29uc3QgcHJvdmlkZXIgPSBuZXcgUHJvdmlkZXI8VD4obmFtZSwgdGhpcyk7XG4gICAgdGhpcy5wcm92aWRlcnMuc2V0KG5hbWUsIHByb3ZpZGVyIGFzIHVua25vd24gYXMgUHJvdmlkZXI8TmFtZT4pO1xuXG4gICAgcmV0dXJuIHByb3ZpZGVyIGFzIFByb3ZpZGVyPFQ+O1xuICB9XG5cbiAgZ2V0UHJvdmlkZXJzKCk6IEFycmF5PFByb3ZpZGVyPE5hbWU+PiB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20odGhpcy5wcm92aWRlcnMudmFsdWVzKCkpO1xuICB9XG59XG4iLCAiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQ1xuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuZXhwb3J0IHR5cGUgTG9nTGV2ZWxTdHJpbmcgPVxuICB8ICdkZWJ1ZydcbiAgfCAndmVyYm9zZSdcbiAgfCAnaW5mbydcbiAgfCAnd2FybidcbiAgfCAnZXJyb3InXG4gIHwgJ3NpbGVudCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTG9nT3B0aW9ucyB7XG4gIGxldmVsOiBMb2dMZXZlbFN0cmluZztcbn1cblxuZXhwb3J0IHR5cGUgTG9nQ2FsbGJhY2sgPSAoY2FsbGJhY2tQYXJhbXM6IExvZ0NhbGxiYWNrUGFyYW1zKSA9PiB2b2lkO1xuXG5leHBvcnQgaW50ZXJmYWNlIExvZ0NhbGxiYWNrUGFyYW1zIHtcbiAgbGV2ZWw6IExvZ0xldmVsU3RyaW5nO1xuICBtZXNzYWdlOiBzdHJpbmc7XG4gIGFyZ3M6IHVua25vd25bXTtcbiAgdHlwZTogc3RyaW5nO1xufVxuXG4vKipcbiAqIEEgY29udGFpbmVyIGZvciBhbGwgb2YgdGhlIExvZ2dlciBpbnN0YW5jZXNcbiAqL1xuZXhwb3J0IGNvbnN0IGluc3RhbmNlczogTG9nZ2VyW10gPSBbXTtcblxuLyoqXG4gKiBUaGUgSlMgU0RLIHN1cHBvcnRzIDUgbG9nIGxldmVscyBhbmQgYWxzbyBhbGxvd3MgYSB1c2VyIHRoZSBhYmlsaXR5IHRvXG4gKiBzaWxlbmNlIHRoZSBsb2dzIGFsdG9nZXRoZXIuXG4gKlxuICogVGhlIG9yZGVyIGlzIGEgZm9sbG93czpcbiAqIERFQlVHIDwgVkVSQk9TRSA8IElORk8gPCBXQVJOIDwgRVJST1JcbiAqXG4gKiBBbGwgb2YgdGhlIGxvZyB0eXBlcyBhYm92ZSB0aGUgY3VycmVudCBsb2cgbGV2ZWwgd2lsbCBiZSBjYXB0dXJlZCAoaS5lLiBpZlxuICogeW91IHNldCB0aGUgbG9nIGxldmVsIHRvIGBJTkZPYCwgZXJyb3JzIHdpbGwgc3RpbGwgYmUgbG9nZ2VkLCBidXQgYERFQlVHYCBhbmRcbiAqIGBWRVJCT1NFYCBsb2dzIHdpbGwgbm90KVxuICovXG5leHBvcnQgZW51bSBMb2dMZXZlbCB7XG4gIERFQlVHLFxuICBWRVJCT1NFLFxuICBJTkZPLFxuICBXQVJOLFxuICBFUlJPUixcbiAgU0lMRU5UXG59XG5cbmNvbnN0IGxldmVsU3RyaW5nVG9FbnVtOiB7IFtrZXkgaW4gTG9nTGV2ZWxTdHJpbmddOiBMb2dMZXZlbCB9ID0ge1xuICAnZGVidWcnOiBMb2dMZXZlbC5ERUJVRyxcbiAgJ3ZlcmJvc2UnOiBMb2dMZXZlbC5WRVJCT1NFLFxuICAnaW5mbyc6IExvZ0xldmVsLklORk8sXG4gICd3YXJuJzogTG9nTGV2ZWwuV0FSTixcbiAgJ2Vycm9yJzogTG9nTGV2ZWwuRVJST1IsXG4gICdzaWxlbnQnOiBMb2dMZXZlbC5TSUxFTlRcbn07XG5cbi8qKlxuICogVGhlIGRlZmF1bHQgbG9nIGxldmVsXG4gKi9cbmNvbnN0IGRlZmF1bHRMb2dMZXZlbDogTG9nTGV2ZWwgPSBMb2dMZXZlbC5JTkZPO1xuXG4vKipcbiAqIFdlIGFsbG93IHVzZXJzIHRoZSBhYmlsaXR5IHRvIHBhc3MgdGhlaXIgb3duIGxvZyBoYW5kbGVyLiBXZSB3aWxsIHBhc3MgdGhlXG4gKiB0eXBlIG9mIGxvZywgdGhlIGN1cnJlbnQgbG9nIGxldmVsLCBhbmQgYW55IG90aGVyIGFyZ3VtZW50cyBwYXNzZWQgKGkuZS4gdGhlXG4gKiBtZXNzYWdlcyB0aGF0IHRoZSB1c2VyIHdhbnRzIHRvIGxvZykgdG8gdGhpcyBmdW5jdGlvbi5cbiAqL1xuZXhwb3J0IHR5cGUgTG9nSGFuZGxlciA9IChcbiAgbG9nZ2VySW5zdGFuY2U6IExvZ2dlcixcbiAgbG9nVHlwZTogTG9nTGV2ZWwsXG4gIC4uLmFyZ3M6IHVua25vd25bXVxuKSA9PiB2b2lkO1xuXG4vKipcbiAqIEJ5IGRlZmF1bHQsIGBjb25zb2xlLmRlYnVnYCBpcyBub3QgZGlzcGxheWVkIGluIHRoZSBkZXZlbG9wZXIgY29uc29sZSAoaW5cbiAqIGNocm9tZSkuIFRvIGF2b2lkIGZvcmNpbmcgdXNlcnMgdG8gaGF2ZSB0byBvcHQtaW4gdG8gdGhlc2UgbG9ncyB0d2ljZVxuICogKGkuZS4gb25jZSBmb3IgZmlyZWJhc2UsIGFuZCBvbmNlIGluIHRoZSBjb25zb2xlKSwgd2UgYXJlIHNlbmRpbmcgYERFQlVHYFxuICogbG9ncyB0byB0aGUgYGNvbnNvbGUubG9nYCBmdW5jdGlvbi5cbiAqL1xuY29uc3QgQ29uc29sZU1ldGhvZCA9IHtcbiAgW0xvZ0xldmVsLkRFQlVHXTogJ2xvZycsXG4gIFtMb2dMZXZlbC5WRVJCT1NFXTogJ2xvZycsXG4gIFtMb2dMZXZlbC5JTkZPXTogJ2luZm8nLFxuICBbTG9nTGV2ZWwuV0FSTl06ICd3YXJuJyxcbiAgW0xvZ0xldmVsLkVSUk9SXTogJ2Vycm9yJ1xufTtcblxuLyoqXG4gKiBUaGUgZGVmYXVsdCBsb2cgaGFuZGxlciB3aWxsIGZvcndhcmQgREVCVUcsIFZFUkJPU0UsIElORk8sIFdBUk4sIGFuZCBFUlJPUlxuICogbWVzc2FnZXMgb24gdG8gdGhlaXIgY29ycmVzcG9uZGluZyBjb25zb2xlIGNvdW50ZXJwYXJ0cyAoaWYgdGhlIGxvZyBtZXRob2RcbiAqIGlzIHN1cHBvcnRlZCBieSB0aGUgY3VycmVudCBsb2cgbGV2ZWwpXG4gKi9cbmNvbnN0IGRlZmF1bHRMb2dIYW5kbGVyOiBMb2dIYW5kbGVyID0gKGluc3RhbmNlLCBsb2dUeXBlLCAuLi5hcmdzKTogdm9pZCA9PiB7XG4gIGlmIChsb2dUeXBlIDwgaW5zdGFuY2UubG9nTGV2ZWwpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc3Qgbm93ID0gbmV3IERhdGUoKS50b0lTT1N0cmluZygpO1xuICBjb25zdCBtZXRob2QgPSBDb25zb2xlTWV0aG9kW2xvZ1R5cGUgYXMga2V5b2YgdHlwZW9mIENvbnNvbGVNZXRob2RdO1xuICBpZiAobWV0aG9kKSB7XG4gICAgY29uc29sZVttZXRob2QgYXMgJ2xvZycgfCAnaW5mbycgfCAnd2FybicgfCAnZXJyb3InXShcbiAgICAgIGBbJHtub3d9XSAgJHtpbnN0YW5jZS5uYW1lfTpgLFxuICAgICAgLi4uYXJnc1xuICAgICk7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYEF0dGVtcHRlZCB0byBsb2cgYSBtZXNzYWdlIHdpdGggYW4gaW52YWxpZCBsb2dUeXBlICh2YWx1ZTogJHtsb2dUeXBlfSlgXG4gICAgKTtcbiAgfVxufTtcblxuZXhwb3J0IGNsYXNzIExvZ2dlciB7XG4gIC8qKlxuICAgKiBHaXZlcyB5b3UgYW4gaW5zdGFuY2Ugb2YgYSBMb2dnZXIgdG8gY2FwdHVyZSBtZXNzYWdlcyBhY2NvcmRpbmcgdG9cbiAgICogRmlyZWJhc2UncyBsb2dnaW5nIHNjaGVtZS5cbiAgICpcbiAgICogQHBhcmFtIG5hbWUgVGhlIG5hbWUgdGhhdCB0aGUgbG9ncyB3aWxsIGJlIGFzc29jaWF0ZWQgd2l0aFxuICAgKi9cbiAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xuICAgIC8qKlxuICAgICAqIENhcHR1cmUgdGhlIGN1cnJlbnQgaW5zdGFuY2UgZm9yIGxhdGVyIHVzZVxuICAgICAqL1xuICAgIGluc3RhbmNlcy5wdXNoKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBsb2cgbGV2ZWwgb2YgdGhlIGdpdmVuIExvZ2dlciBpbnN0YW5jZS5cbiAgICovXG4gIHByaXZhdGUgX2xvZ0xldmVsID0gZGVmYXVsdExvZ0xldmVsO1xuXG4gIGdldCBsb2dMZXZlbCgpOiBMb2dMZXZlbCB7XG4gICAgcmV0dXJuIHRoaXMuX2xvZ0xldmVsO1xuICB9XG5cbiAgc2V0IGxvZ0xldmVsKHZhbDogTG9nTGV2ZWwpIHtcbiAgICBpZiAoISh2YWwgaW4gTG9nTGV2ZWwpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGBJbnZhbGlkIHZhbHVlIFwiJHt2YWx9XCIgYXNzaWduZWQgdG8gXFxgbG9nTGV2ZWxcXGBgKTtcbiAgICB9XG4gICAgdGhpcy5fbG9nTGV2ZWwgPSB2YWw7XG4gIH1cblxuICAvLyBXb3JrYXJvdW5kIGZvciBzZXR0ZXIvZ2V0dGVyIGhhdmluZyB0byBiZSB0aGUgc2FtZSB0eXBlLlxuICBzZXRMb2dMZXZlbCh2YWw6IExvZ0xldmVsIHwgTG9nTGV2ZWxTdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLl9sb2dMZXZlbCA9IHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnID8gbGV2ZWxTdHJpbmdUb0VudW1bdmFsXSA6IHZhbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgbWFpbiAoaW50ZXJuYWwpIGxvZyBoYW5kbGVyIGZvciB0aGUgTG9nZ2VyIGluc3RhbmNlLlxuICAgKiBDYW4gYmUgc2V0IHRvIGEgbmV3IGZ1bmN0aW9uIGluIGludGVybmFsIHBhY2thZ2UgY29kZSBidXQgbm90IGJ5IHVzZXIuXG4gICAqL1xuICBwcml2YXRlIF9sb2dIYW5kbGVyOiBMb2dIYW5kbGVyID0gZGVmYXVsdExvZ0hhbmRsZXI7XG4gIGdldCBsb2dIYW5kbGVyKCk6IExvZ0hhbmRsZXIge1xuICAgIHJldHVybiB0aGlzLl9sb2dIYW5kbGVyO1xuICB9XG4gIHNldCBsb2dIYW5kbGVyKHZhbDogTG9nSGFuZGxlcikge1xuICAgIGlmICh0eXBlb2YgdmFsICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdWYWx1ZSBhc3NpZ25lZCB0byBgbG9nSGFuZGxlcmAgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG4gICAgfVxuICAgIHRoaXMuX2xvZ0hhbmRsZXIgPSB2YWw7XG4gIH1cblxuICAvKipcbiAgICogVGhlIG9wdGlvbmFsLCBhZGRpdGlvbmFsLCB1c2VyLWRlZmluZWQgbG9nIGhhbmRsZXIgZm9yIHRoZSBMb2dnZXIgaW5zdGFuY2UuXG4gICAqL1xuICBwcml2YXRlIF91c2VyTG9nSGFuZGxlcjogTG9nSGFuZGxlciB8IG51bGwgPSBudWxsO1xuICBnZXQgdXNlckxvZ0hhbmRsZXIoKTogTG9nSGFuZGxlciB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLl91c2VyTG9nSGFuZGxlcjtcbiAgfVxuICBzZXQgdXNlckxvZ0hhbmRsZXIodmFsOiBMb2dIYW5kbGVyIHwgbnVsbCkge1xuICAgIHRoaXMuX3VzZXJMb2dIYW5kbGVyID0gdmFsO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBmdW5jdGlvbnMgYmVsb3cgYXJlIGFsbCBiYXNlZCBvbiB0aGUgYGNvbnNvbGVgIGludGVyZmFjZVxuICAgKi9cblxuICBkZWJ1ZyguLi5hcmdzOiB1bmtub3duW10pOiB2b2lkIHtcbiAgICB0aGlzLl91c2VyTG9nSGFuZGxlciAmJiB0aGlzLl91c2VyTG9nSGFuZGxlcih0aGlzLCBMb2dMZXZlbC5ERUJVRywgLi4uYXJncyk7XG4gICAgdGhpcy5fbG9nSGFuZGxlcih0aGlzLCBMb2dMZXZlbC5ERUJVRywgLi4uYXJncyk7XG4gIH1cbiAgbG9nKC4uLmFyZ3M6IHVua25vd25bXSk6IHZvaWQge1xuICAgIHRoaXMuX3VzZXJMb2dIYW5kbGVyICYmXG4gICAgICB0aGlzLl91c2VyTG9nSGFuZGxlcih0aGlzLCBMb2dMZXZlbC5WRVJCT1NFLCAuLi5hcmdzKTtcbiAgICB0aGlzLl9sb2dIYW5kbGVyKHRoaXMsIExvZ0xldmVsLlZFUkJPU0UsIC4uLmFyZ3MpO1xuICB9XG4gIGluZm8oLi4uYXJnczogdW5rbm93bltdKTogdm9pZCB7XG4gICAgdGhpcy5fdXNlckxvZ0hhbmRsZXIgJiYgdGhpcy5fdXNlckxvZ0hhbmRsZXIodGhpcywgTG9nTGV2ZWwuSU5GTywgLi4uYXJncyk7XG4gICAgdGhpcy5fbG9nSGFuZGxlcih0aGlzLCBMb2dMZXZlbC5JTkZPLCAuLi5hcmdzKTtcbiAgfVxuICB3YXJuKC4uLmFyZ3M6IHVua25vd25bXSk6IHZvaWQge1xuICAgIHRoaXMuX3VzZXJMb2dIYW5kbGVyICYmIHRoaXMuX3VzZXJMb2dIYW5kbGVyKHRoaXMsIExvZ0xldmVsLldBUk4sIC4uLmFyZ3MpO1xuICAgIHRoaXMuX2xvZ0hhbmRsZXIodGhpcywgTG9nTGV2ZWwuV0FSTiwgLi4uYXJncyk7XG4gIH1cbiAgZXJyb3IoLi4uYXJnczogdW5rbm93bltdKTogdm9pZCB7XG4gICAgdGhpcy5fdXNlckxvZ0hhbmRsZXIgJiYgdGhpcy5fdXNlckxvZ0hhbmRsZXIodGhpcywgTG9nTGV2ZWwuRVJST1IsIC4uLmFyZ3MpO1xuICAgIHRoaXMuX2xvZ0hhbmRsZXIodGhpcywgTG9nTGV2ZWwuRVJST1IsIC4uLmFyZ3MpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRMb2dMZXZlbChsZXZlbDogTG9nTGV2ZWxTdHJpbmcgfCBMb2dMZXZlbCk6IHZvaWQge1xuICBpbnN0YW5jZXMuZm9yRWFjaChpbnN0ID0+IHtcbiAgICBpbnN0LnNldExvZ0xldmVsKGxldmVsKTtcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRVc2VyTG9nSGFuZGxlcihcbiAgbG9nQ2FsbGJhY2s6IExvZ0NhbGxiYWNrIHwgbnVsbCxcbiAgb3B0aW9ucz86IExvZ09wdGlvbnNcbik6IHZvaWQge1xuICBmb3IgKGNvbnN0IGluc3RhbmNlIG9mIGluc3RhbmNlcykge1xuICAgIGxldCBjdXN0b21Mb2dMZXZlbDogTG9nTGV2ZWwgfCBudWxsID0gbnVsbDtcbiAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLmxldmVsKSB7XG4gICAgICBjdXN0b21Mb2dMZXZlbCA9IGxldmVsU3RyaW5nVG9FbnVtW29wdGlvbnMubGV2ZWxdO1xuICAgIH1cbiAgICBpZiAobG9nQ2FsbGJhY2sgPT09IG51bGwpIHtcbiAgICAgIGluc3RhbmNlLnVzZXJMb2dIYW5kbGVyID0gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgaW5zdGFuY2UudXNlckxvZ0hhbmRsZXIgPSAoXG4gICAgICAgIGluc3RhbmNlOiBMb2dnZXIsXG4gICAgICAgIGxldmVsOiBMb2dMZXZlbCxcbiAgICAgICAgLi4uYXJnczogdW5rbm93bltdXG4gICAgICApID0+IHtcbiAgICAgICAgY29uc3QgbWVzc2FnZSA9IGFyZ3NcbiAgICAgICAgICAubWFwKGFyZyA9PiB7XG4gICAgICAgICAgICBpZiAoYXJnID09IG51bGwpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBhcmcgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgIHJldHVybiBhcmc7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBhcmcgPT09ICdudW1iZXInIHx8IHR5cGVvZiBhcmcgPT09ICdib29sZWFuJykge1xuICAgICAgICAgICAgICByZXR1cm4gYXJnLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGFyZyBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgICAgICAgIHJldHVybiBhcmcubWVzc2FnZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGFyZyk7XG4gICAgICAgICAgICAgIH0gY2F0Y2ggKGlnbm9yZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgICAgLmZpbHRlcihhcmcgPT4gYXJnKVxuICAgICAgICAgIC5qb2luKCcgJyk7XG4gICAgICAgIGlmIChsZXZlbCA+PSAoY3VzdG9tTG9nTGV2ZWwgPz8gaW5zdGFuY2UubG9nTGV2ZWwpKSB7XG4gICAgICAgICAgbG9nQ2FsbGJhY2soe1xuICAgICAgICAgICAgbGV2ZWw6IExvZ0xldmVsW2xldmVsXS50b0xvd2VyQ2FzZSgpIGFzIExvZ0xldmVsU3RyaW5nLFxuICAgICAgICAgICAgbWVzc2FnZSxcbiAgICAgICAgICAgIGFyZ3MsXG4gICAgICAgICAgICB0eXBlOiBpbnN0YW5jZS5uYW1lXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuICB9XG59XG4iLCAiY29uc3QgaW5zdGFuY2VPZkFueSA9IChvYmplY3QsIGNvbnN0cnVjdG9ycykgPT4gY29uc3RydWN0b3JzLnNvbWUoKGMpID0+IG9iamVjdCBpbnN0YW5jZW9mIGMpO1xuXG5sZXQgaWRiUHJveHlhYmxlVHlwZXM7XG5sZXQgY3Vyc29yQWR2YW5jZU1ldGhvZHM7XG4vLyBUaGlzIGlzIGEgZnVuY3Rpb24gdG8gcHJldmVudCBpdCB0aHJvd2luZyB1cCBpbiBub2RlIGVudmlyb25tZW50cy5cbmZ1bmN0aW9uIGdldElkYlByb3h5YWJsZVR5cGVzKCkge1xuICAgIHJldHVybiAoaWRiUHJveHlhYmxlVHlwZXMgfHxcbiAgICAgICAgKGlkYlByb3h5YWJsZVR5cGVzID0gW1xuICAgICAgICAgICAgSURCRGF0YWJhc2UsXG4gICAgICAgICAgICBJREJPYmplY3RTdG9yZSxcbiAgICAgICAgICAgIElEQkluZGV4LFxuICAgICAgICAgICAgSURCQ3Vyc29yLFxuICAgICAgICAgICAgSURCVHJhbnNhY3Rpb24sXG4gICAgICAgIF0pKTtcbn1cbi8vIFRoaXMgaXMgYSBmdW5jdGlvbiB0byBwcmV2ZW50IGl0IHRocm93aW5nIHVwIGluIG5vZGUgZW52aXJvbm1lbnRzLlxuZnVuY3Rpb24gZ2V0Q3Vyc29yQWR2YW5jZU1ldGhvZHMoKSB7XG4gICAgcmV0dXJuIChjdXJzb3JBZHZhbmNlTWV0aG9kcyB8fFxuICAgICAgICAoY3Vyc29yQWR2YW5jZU1ldGhvZHMgPSBbXG4gICAgICAgICAgICBJREJDdXJzb3IucHJvdG90eXBlLmFkdmFuY2UsXG4gICAgICAgICAgICBJREJDdXJzb3IucHJvdG90eXBlLmNvbnRpbnVlLFxuICAgICAgICAgICAgSURCQ3Vyc29yLnByb3RvdHlwZS5jb250aW51ZVByaW1hcnlLZXksXG4gICAgICAgIF0pKTtcbn1cbmNvbnN0IGN1cnNvclJlcXVlc3RNYXAgPSBuZXcgV2Vha01hcCgpO1xuY29uc3QgdHJhbnNhY3Rpb25Eb25lTWFwID0gbmV3IFdlYWtNYXAoKTtcbmNvbnN0IHRyYW5zYWN0aW9uU3RvcmVOYW1lc01hcCA9IG5ldyBXZWFrTWFwKCk7XG5jb25zdCB0cmFuc2Zvcm1DYWNoZSA9IG5ldyBXZWFrTWFwKCk7XG5jb25zdCByZXZlcnNlVHJhbnNmb3JtQ2FjaGUgPSBuZXcgV2Vha01hcCgpO1xuZnVuY3Rpb24gcHJvbWlzaWZ5UmVxdWVzdChyZXF1ZXN0KSB7XG4gICAgY29uc3QgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgY29uc3QgdW5saXN0ZW4gPSAoKSA9PiB7XG4gICAgICAgICAgICByZXF1ZXN0LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3N1Y2Nlc3MnLCBzdWNjZXNzKTtcbiAgICAgICAgICAgIHJlcXVlc3QucmVtb3ZlRXZlbnRMaXN0ZW5lcignZXJyb3InLCBlcnJvcik7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IHN1Y2Nlc3MgPSAoKSA9PiB7XG4gICAgICAgICAgICByZXNvbHZlKHdyYXAocmVxdWVzdC5yZXN1bHQpKTtcbiAgICAgICAgICAgIHVubGlzdGVuKCk7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGVycm9yID0gKCkgPT4ge1xuICAgICAgICAgICAgcmVqZWN0KHJlcXVlc3QuZXJyb3IpO1xuICAgICAgICAgICAgdW5saXN0ZW4oKTtcbiAgICAgICAgfTtcbiAgICAgICAgcmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKCdzdWNjZXNzJywgc3VjY2Vzcyk7XG4gICAgICAgIHJlcXVlc3QuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCBlcnJvcik7XG4gICAgfSk7XG4gICAgcHJvbWlzZVxuICAgICAgICAudGhlbigodmFsdWUpID0+IHtcbiAgICAgICAgLy8gU2luY2UgY3Vyc29yaW5nIHJldXNlcyB0aGUgSURCUmVxdWVzdCAoKnNpZ2gqKSwgd2UgY2FjaGUgaXQgZm9yIGxhdGVyIHJldHJpZXZhbFxuICAgICAgICAvLyAoc2VlIHdyYXBGdW5jdGlvbikuXG4gICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIElEQkN1cnNvcikge1xuICAgICAgICAgICAgY3Vyc29yUmVxdWVzdE1hcC5zZXQodmFsdWUsIHJlcXVlc3QpO1xuICAgICAgICB9XG4gICAgICAgIC8vIENhdGNoaW5nIHRvIGF2b2lkIFwiVW5jYXVnaHQgUHJvbWlzZSBleGNlcHRpb25zXCJcbiAgICB9KVxuICAgICAgICAuY2F0Y2goKCkgPT4geyB9KTtcbiAgICAvLyBUaGlzIG1hcHBpbmcgZXhpc3RzIGluIHJldmVyc2VUcmFuc2Zvcm1DYWNoZSBidXQgZG9lc24ndCBkb2Vzbid0IGV4aXN0IGluIHRyYW5zZm9ybUNhY2hlLiBUaGlzXG4gICAgLy8gaXMgYmVjYXVzZSB3ZSBjcmVhdGUgbWFueSBwcm9taXNlcyBmcm9tIGEgc2luZ2xlIElEQlJlcXVlc3QuXG4gICAgcmV2ZXJzZVRyYW5zZm9ybUNhY2hlLnNldChwcm9taXNlLCByZXF1ZXN0KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbn1cbmZ1bmN0aW9uIGNhY2hlRG9uZVByb21pc2VGb3JUcmFuc2FjdGlvbih0eCkge1xuICAgIC8vIEVhcmx5IGJhaWwgaWYgd2UndmUgYWxyZWFkeSBjcmVhdGVkIGEgZG9uZSBwcm9taXNlIGZvciB0aGlzIHRyYW5zYWN0aW9uLlxuICAgIGlmICh0cmFuc2FjdGlvbkRvbmVNYXAuaGFzKHR4KSlcbiAgICAgICAgcmV0dXJuO1xuICAgIGNvbnN0IGRvbmUgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGNvbnN0IHVubGlzdGVuID0gKCkgPT4ge1xuICAgICAgICAgICAgdHgucmVtb3ZlRXZlbnRMaXN0ZW5lcignY29tcGxldGUnLCBjb21wbGV0ZSk7XG4gICAgICAgICAgICB0eC5yZW1vdmVFdmVudExpc3RlbmVyKCdlcnJvcicsIGVycm9yKTtcbiAgICAgICAgICAgIHR4LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Fib3J0JywgZXJyb3IpO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBjb21wbGV0ZSA9ICgpID0+IHtcbiAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgIHVubGlzdGVuKCk7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGVycm9yID0gKCkgPT4ge1xuICAgICAgICAgICAgcmVqZWN0KHR4LmVycm9yIHx8IG5ldyBET01FeGNlcHRpb24oJ0Fib3J0RXJyb3InLCAnQWJvcnRFcnJvcicpKTtcbiAgICAgICAgICAgIHVubGlzdGVuKCk7XG4gICAgICAgIH07XG4gICAgICAgIHR4LmFkZEV2ZW50TGlzdGVuZXIoJ2NvbXBsZXRlJywgY29tcGxldGUpO1xuICAgICAgICB0eC5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIGVycm9yKTtcbiAgICAgICAgdHguYWRkRXZlbnRMaXN0ZW5lcignYWJvcnQnLCBlcnJvcik7XG4gICAgfSk7XG4gICAgLy8gQ2FjaGUgaXQgZm9yIGxhdGVyIHJldHJpZXZhbC5cbiAgICB0cmFuc2FjdGlvbkRvbmVNYXAuc2V0KHR4LCBkb25lKTtcbn1cbmxldCBpZGJQcm94eVRyYXBzID0ge1xuICAgIGdldCh0YXJnZXQsIHByb3AsIHJlY2VpdmVyKSB7XG4gICAgICAgIGlmICh0YXJnZXQgaW5zdGFuY2VvZiBJREJUcmFuc2FjdGlvbikge1xuICAgICAgICAgICAgLy8gU3BlY2lhbCBoYW5kbGluZyBmb3IgdHJhbnNhY3Rpb24uZG9uZS5cbiAgICAgICAgICAgIGlmIChwcm9wID09PSAnZG9uZScpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRyYW5zYWN0aW9uRG9uZU1hcC5nZXQodGFyZ2V0KTtcbiAgICAgICAgICAgIC8vIFBvbHlmaWxsIGZvciBvYmplY3RTdG9yZU5hbWVzIGJlY2F1c2Ugb2YgRWRnZS5cbiAgICAgICAgICAgIGlmIChwcm9wID09PSAnb2JqZWN0U3RvcmVOYW1lcycpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGFyZ2V0Lm9iamVjdFN0b3JlTmFtZXMgfHwgdHJhbnNhY3Rpb25TdG9yZU5hbWVzTWFwLmdldCh0YXJnZXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gTWFrZSB0eC5zdG9yZSByZXR1cm4gdGhlIG9ubHkgc3RvcmUgaW4gdGhlIHRyYW5zYWN0aW9uLCBvciB1bmRlZmluZWQgaWYgdGhlcmUgYXJlIG1hbnkuXG4gICAgICAgICAgICBpZiAocHJvcCA9PT0gJ3N0b3JlJykge1xuICAgICAgICAgICAgICAgIHJldHVybiByZWNlaXZlci5vYmplY3RTdG9yZU5hbWVzWzFdXG4gICAgICAgICAgICAgICAgICAgID8gdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgICAgIDogcmVjZWl2ZXIub2JqZWN0U3RvcmUocmVjZWl2ZXIub2JqZWN0U3RvcmVOYW1lc1swXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gRWxzZSB0cmFuc2Zvcm0gd2hhdGV2ZXIgd2UgZ2V0IGJhY2suXG4gICAgICAgIHJldHVybiB3cmFwKHRhcmdldFtwcm9wXSk7XG4gICAgfSxcbiAgICBzZXQodGFyZ2V0LCBwcm9wLCB2YWx1ZSkge1xuICAgICAgICB0YXJnZXRbcHJvcF0gPSB2YWx1ZTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgICBoYXModGFyZ2V0LCBwcm9wKSB7XG4gICAgICAgIGlmICh0YXJnZXQgaW5zdGFuY2VvZiBJREJUcmFuc2FjdGlvbiAmJlxuICAgICAgICAgICAgKHByb3AgPT09ICdkb25lJyB8fCBwcm9wID09PSAnc3RvcmUnKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHByb3AgaW4gdGFyZ2V0O1xuICAgIH0sXG59O1xuZnVuY3Rpb24gcmVwbGFjZVRyYXBzKGNhbGxiYWNrKSB7XG4gICAgaWRiUHJveHlUcmFwcyA9IGNhbGxiYWNrKGlkYlByb3h5VHJhcHMpO1xufVxuZnVuY3Rpb24gd3JhcEZ1bmN0aW9uKGZ1bmMpIHtcbiAgICAvLyBEdWUgdG8gZXhwZWN0ZWQgb2JqZWN0IGVxdWFsaXR5ICh3aGljaCBpcyBlbmZvcmNlZCBieSB0aGUgY2FjaGluZyBpbiBgd3JhcGApLCB3ZVxuICAgIC8vIG9ubHkgY3JlYXRlIG9uZSBuZXcgZnVuYyBwZXIgZnVuYy5cbiAgICAvLyBFZGdlIGRvZXNuJ3Qgc3VwcG9ydCBvYmplY3RTdG9yZU5hbWVzIChib29vKSwgc28gd2UgcG9seWZpbGwgaXQgaGVyZS5cbiAgICBpZiAoZnVuYyA9PT0gSURCRGF0YWJhc2UucHJvdG90eXBlLnRyYW5zYWN0aW9uICYmXG4gICAgICAgICEoJ29iamVjdFN0b3JlTmFtZXMnIGluIElEQlRyYW5zYWN0aW9uLnByb3RvdHlwZSkpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChzdG9yZU5hbWVzLCAuLi5hcmdzKSB7XG4gICAgICAgICAgICBjb25zdCB0eCA9IGZ1bmMuY2FsbCh1bndyYXAodGhpcyksIHN0b3JlTmFtZXMsIC4uLmFyZ3MpO1xuICAgICAgICAgICAgdHJhbnNhY3Rpb25TdG9yZU5hbWVzTWFwLnNldCh0eCwgc3RvcmVOYW1lcy5zb3J0ID8gc3RvcmVOYW1lcy5zb3J0KCkgOiBbc3RvcmVOYW1lc10pO1xuICAgICAgICAgICAgcmV0dXJuIHdyYXAodHgpO1xuICAgICAgICB9O1xuICAgIH1cbiAgICAvLyBDdXJzb3IgbWV0aG9kcyBhcmUgc3BlY2lhbCwgYXMgdGhlIGJlaGF2aW91ciBpcyBhIGxpdHRsZSBtb3JlIGRpZmZlcmVudCB0byBzdGFuZGFyZCBJREIuIEluXG4gICAgLy8gSURCLCB5b3UgYWR2YW5jZSB0aGUgY3Vyc29yIGFuZCB3YWl0IGZvciBhIG5ldyAnc3VjY2Vzcycgb24gdGhlIElEQlJlcXVlc3QgdGhhdCBnYXZlIHlvdSB0aGVcbiAgICAvLyBjdXJzb3IuIEl0J3Mga2luZGEgbGlrZSBhIHByb21pc2UgdGhhdCBjYW4gcmVzb2x2ZSB3aXRoIG1hbnkgdmFsdWVzLiBUaGF0IGRvZXNuJ3QgbWFrZSBzZW5zZVxuICAgIC8vIHdpdGggcmVhbCBwcm9taXNlcywgc28gZWFjaCBhZHZhbmNlIG1ldGhvZHMgcmV0dXJucyBhIG5ldyBwcm9taXNlIGZvciB0aGUgY3Vyc29yIG9iamVjdCwgb3JcbiAgICAvLyB1bmRlZmluZWQgaWYgdGhlIGVuZCBvZiB0aGUgY3Vyc29yIGhhcyBiZWVuIHJlYWNoZWQuXG4gICAgaWYgKGdldEN1cnNvckFkdmFuY2VNZXRob2RzKCkuaW5jbHVkZXMoZnVuYykpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgICAgICAgICAvLyBDYWxsaW5nIHRoZSBvcmlnaW5hbCBmdW5jdGlvbiB3aXRoIHRoZSBwcm94eSBhcyAndGhpcycgY2F1c2VzIElMTEVHQUwgSU5WT0NBVElPTiwgc28gd2UgdXNlXG4gICAgICAgICAgICAvLyB0aGUgb3JpZ2luYWwgb2JqZWN0LlxuICAgICAgICAgICAgZnVuYy5hcHBseSh1bndyYXAodGhpcyksIGFyZ3MpO1xuICAgICAgICAgICAgcmV0dXJuIHdyYXAoY3Vyc29yUmVxdWVzdE1hcC5nZXQodGhpcykpO1xuICAgICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICAgICAgLy8gQ2FsbGluZyB0aGUgb3JpZ2luYWwgZnVuY3Rpb24gd2l0aCB0aGUgcHJveHkgYXMgJ3RoaXMnIGNhdXNlcyBJTExFR0FMIElOVk9DQVRJT04sIHNvIHdlIHVzZVxuICAgICAgICAvLyB0aGUgb3JpZ2luYWwgb2JqZWN0LlxuICAgICAgICByZXR1cm4gd3JhcChmdW5jLmFwcGx5KHVud3JhcCh0aGlzKSwgYXJncykpO1xuICAgIH07XG59XG5mdW5jdGlvbiB0cmFuc2Zvcm1DYWNoYWJsZVZhbHVlKHZhbHVlKSB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgcmV0dXJuIHdyYXBGdW5jdGlvbih2YWx1ZSk7XG4gICAgLy8gVGhpcyBkb2Vzbid0IHJldHVybiwgaXQganVzdCBjcmVhdGVzIGEgJ2RvbmUnIHByb21pc2UgZm9yIHRoZSB0cmFuc2FjdGlvbixcbiAgICAvLyB3aGljaCBpcyBsYXRlciByZXR1cm5lZCBmb3IgdHJhbnNhY3Rpb24uZG9uZSAoc2VlIGlkYk9iamVjdEhhbmRsZXIpLlxuICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIElEQlRyYW5zYWN0aW9uKVxuICAgICAgICBjYWNoZURvbmVQcm9taXNlRm9yVHJhbnNhY3Rpb24odmFsdWUpO1xuICAgIGlmIChpbnN0YW5jZU9mQW55KHZhbHVlLCBnZXRJZGJQcm94eWFibGVUeXBlcygpKSlcbiAgICAgICAgcmV0dXJuIG5ldyBQcm94eSh2YWx1ZSwgaWRiUHJveHlUcmFwcyk7XG4gICAgLy8gUmV0dXJuIHRoZSBzYW1lIHZhbHVlIGJhY2sgaWYgd2UncmUgbm90IGdvaW5nIHRvIHRyYW5zZm9ybSBpdC5cbiAgICByZXR1cm4gdmFsdWU7XG59XG5mdW5jdGlvbiB3cmFwKHZhbHVlKSB7XG4gICAgLy8gV2Ugc29tZXRpbWVzIGdlbmVyYXRlIG11bHRpcGxlIHByb21pc2VzIGZyb20gYSBzaW5nbGUgSURCUmVxdWVzdCAoZWcgd2hlbiBjdXJzb3JpbmcpLCBiZWNhdXNlXG4gICAgLy8gSURCIGlzIHdlaXJkIGFuZCBhIHNpbmdsZSBJREJSZXF1ZXN0IGNhbiB5aWVsZCBtYW55IHJlc3BvbnNlcywgc28gdGhlc2UgY2FuJ3QgYmUgY2FjaGVkLlxuICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIElEQlJlcXVlc3QpXG4gICAgICAgIHJldHVybiBwcm9taXNpZnlSZXF1ZXN0KHZhbHVlKTtcbiAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IHRyYW5zZm9ybWVkIHRoaXMgdmFsdWUgYmVmb3JlLCByZXVzZSB0aGUgdHJhbnNmb3JtZWQgdmFsdWUuXG4gICAgLy8gVGhpcyBpcyBmYXN0ZXIsIGJ1dCBpdCBhbHNvIHByb3ZpZGVzIG9iamVjdCBlcXVhbGl0eS5cbiAgICBpZiAodHJhbnNmb3JtQ2FjaGUuaGFzKHZhbHVlKSlcbiAgICAgICAgcmV0dXJuIHRyYW5zZm9ybUNhY2hlLmdldCh2YWx1ZSk7XG4gICAgY29uc3QgbmV3VmFsdWUgPSB0cmFuc2Zvcm1DYWNoYWJsZVZhbHVlKHZhbHVlKTtcbiAgICAvLyBOb3QgYWxsIHR5cGVzIGFyZSB0cmFuc2Zvcm1lZC5cbiAgICAvLyBUaGVzZSBtYXkgYmUgcHJpbWl0aXZlIHR5cGVzLCBzbyB0aGV5IGNhbid0IGJlIFdlYWtNYXAga2V5cy5cbiAgICBpZiAobmV3VmFsdWUgIT09IHZhbHVlKSB7XG4gICAgICAgIHRyYW5zZm9ybUNhY2hlLnNldCh2YWx1ZSwgbmV3VmFsdWUpO1xuICAgICAgICByZXZlcnNlVHJhbnNmb3JtQ2FjaGUuc2V0KG5ld1ZhbHVlLCB2YWx1ZSk7XG4gICAgfVxuICAgIHJldHVybiBuZXdWYWx1ZTtcbn1cbmNvbnN0IHVud3JhcCA9ICh2YWx1ZSkgPT4gcmV2ZXJzZVRyYW5zZm9ybUNhY2hlLmdldCh2YWx1ZSk7XG5cbmV4cG9ydCB7IHJldmVyc2VUcmFuc2Zvcm1DYWNoZSBhcyBhLCBpbnN0YW5jZU9mQW55IGFzIGksIHJlcGxhY2VUcmFwcyBhcyByLCB1bndyYXAgYXMgdSwgd3JhcCBhcyB3IH07XG4iLCAiaW1wb3J0IHsgdyBhcyB3cmFwLCByIGFzIHJlcGxhY2VUcmFwcyB9IGZyb20gJy4vd3JhcC1pZGItdmFsdWUuanMnO1xuZXhwb3J0IHsgdSBhcyB1bndyYXAsIHcgYXMgd3JhcCB9IGZyb20gJy4vd3JhcC1pZGItdmFsdWUuanMnO1xuXG4vKipcbiAqIE9wZW4gYSBkYXRhYmFzZS5cbiAqXG4gKiBAcGFyYW0gbmFtZSBOYW1lIG9mIHRoZSBkYXRhYmFzZS5cbiAqIEBwYXJhbSB2ZXJzaW9uIFNjaGVtYSB2ZXJzaW9uLlxuICogQHBhcmFtIGNhbGxiYWNrcyBBZGRpdGlvbmFsIGNhbGxiYWNrcy5cbiAqL1xuZnVuY3Rpb24gb3BlbkRCKG5hbWUsIHZlcnNpb24sIHsgYmxvY2tlZCwgdXBncmFkZSwgYmxvY2tpbmcsIHRlcm1pbmF0ZWQgfSA9IHt9KSB7XG4gICAgY29uc3QgcmVxdWVzdCA9IGluZGV4ZWREQi5vcGVuKG5hbWUsIHZlcnNpb24pO1xuICAgIGNvbnN0IG9wZW5Qcm9taXNlID0gd3JhcChyZXF1ZXN0KTtcbiAgICBpZiAodXBncmFkZSkge1xuICAgICAgICByZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoJ3VwZ3JhZGVuZWVkZWQnLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIHVwZ3JhZGUod3JhcChyZXF1ZXN0LnJlc3VsdCksIGV2ZW50Lm9sZFZlcnNpb24sIGV2ZW50Lm5ld1ZlcnNpb24sIHdyYXAocmVxdWVzdC50cmFuc2FjdGlvbiksIGV2ZW50KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChibG9ja2VkKSB7XG4gICAgICAgIHJlcXVlc3QuYWRkRXZlbnRMaXN0ZW5lcignYmxvY2tlZCcsIChldmVudCkgPT4gYmxvY2tlZChcbiAgICAgICAgLy8gQ2FzdGluZyBkdWUgdG8gaHR0cHM6Ly9naXRodWIuY29tL21pY3Jvc29mdC9UeXBlU2NyaXB0LURPTS1saWItZ2VuZXJhdG9yL3B1bGwvMTQwNVxuICAgICAgICBldmVudC5vbGRWZXJzaW9uLCBldmVudC5uZXdWZXJzaW9uLCBldmVudCkpO1xuICAgIH1cbiAgICBvcGVuUHJvbWlzZVxuICAgICAgICAudGhlbigoZGIpID0+IHtcbiAgICAgICAgaWYgKHRlcm1pbmF0ZWQpXG4gICAgICAgICAgICBkYi5hZGRFdmVudExpc3RlbmVyKCdjbG9zZScsICgpID0+IHRlcm1pbmF0ZWQoKSk7XG4gICAgICAgIGlmIChibG9ja2luZykge1xuICAgICAgICAgICAgZGIuYWRkRXZlbnRMaXN0ZW5lcigndmVyc2lvbmNoYW5nZScsIChldmVudCkgPT4gYmxvY2tpbmcoZXZlbnQub2xkVmVyc2lvbiwgZXZlbnQubmV3VmVyc2lvbiwgZXZlbnQpKTtcbiAgICAgICAgfVxuICAgIH0pXG4gICAgICAgIC5jYXRjaCgoKSA9PiB7IH0pO1xuICAgIHJldHVybiBvcGVuUHJvbWlzZTtcbn1cbi8qKlxuICogRGVsZXRlIGEgZGF0YWJhc2UuXG4gKlxuICogQHBhcmFtIG5hbWUgTmFtZSBvZiB0aGUgZGF0YWJhc2UuXG4gKi9cbmZ1bmN0aW9uIGRlbGV0ZURCKG5hbWUsIHsgYmxvY2tlZCB9ID0ge30pIHtcbiAgICBjb25zdCByZXF1ZXN0ID0gaW5kZXhlZERCLmRlbGV0ZURhdGFiYXNlKG5hbWUpO1xuICAgIGlmIChibG9ja2VkKSB7XG4gICAgICAgIHJlcXVlc3QuYWRkRXZlbnRMaXN0ZW5lcignYmxvY2tlZCcsIChldmVudCkgPT4gYmxvY2tlZChcbiAgICAgICAgLy8gQ2FzdGluZyBkdWUgdG8gaHR0cHM6Ly9naXRodWIuY29tL21pY3Jvc29mdC9UeXBlU2NyaXB0LURPTS1saWItZ2VuZXJhdG9yL3B1bGwvMTQwNVxuICAgICAgICBldmVudC5vbGRWZXJzaW9uLCBldmVudCkpO1xuICAgIH1cbiAgICByZXR1cm4gd3JhcChyZXF1ZXN0KS50aGVuKCgpID0+IHVuZGVmaW5lZCk7XG59XG5cbmNvbnN0IHJlYWRNZXRob2RzID0gWydnZXQnLCAnZ2V0S2V5JywgJ2dldEFsbCcsICdnZXRBbGxLZXlzJywgJ2NvdW50J107XG5jb25zdCB3cml0ZU1ldGhvZHMgPSBbJ3B1dCcsICdhZGQnLCAnZGVsZXRlJywgJ2NsZWFyJ107XG5jb25zdCBjYWNoZWRNZXRob2RzID0gbmV3IE1hcCgpO1xuZnVuY3Rpb24gZ2V0TWV0aG9kKHRhcmdldCwgcHJvcCkge1xuICAgIGlmICghKHRhcmdldCBpbnN0YW5jZW9mIElEQkRhdGFiYXNlICYmXG4gICAgICAgICEocHJvcCBpbiB0YXJnZXQpICYmXG4gICAgICAgIHR5cGVvZiBwcm9wID09PSAnc3RyaW5nJykpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoY2FjaGVkTWV0aG9kcy5nZXQocHJvcCkpXG4gICAgICAgIHJldHVybiBjYWNoZWRNZXRob2RzLmdldChwcm9wKTtcbiAgICBjb25zdCB0YXJnZXRGdW5jTmFtZSA9IHByb3AucmVwbGFjZSgvRnJvbUluZGV4JC8sICcnKTtcbiAgICBjb25zdCB1c2VJbmRleCA9IHByb3AgIT09IHRhcmdldEZ1bmNOYW1lO1xuICAgIGNvbnN0IGlzV3JpdGUgPSB3cml0ZU1ldGhvZHMuaW5jbHVkZXModGFyZ2V0RnVuY05hbWUpO1xuICAgIGlmIChcbiAgICAvLyBCYWlsIGlmIHRoZSB0YXJnZXQgZG9lc24ndCBleGlzdCBvbiB0aGUgdGFyZ2V0LiBFZywgZ2V0QWxsIGlzbid0IGluIEVkZ2UuXG4gICAgISh0YXJnZXRGdW5jTmFtZSBpbiAodXNlSW5kZXggPyBJREJJbmRleCA6IElEQk9iamVjdFN0b3JlKS5wcm90b3R5cGUpIHx8XG4gICAgICAgICEoaXNXcml0ZSB8fCByZWFkTWV0aG9kcy5pbmNsdWRlcyh0YXJnZXRGdW5jTmFtZSkpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgbWV0aG9kID0gYXN5bmMgZnVuY3Rpb24gKHN0b3JlTmFtZSwgLi4uYXJncykge1xuICAgICAgICAvLyBpc1dyaXRlID8gJ3JlYWR3cml0ZScgOiB1bmRlZmluZWQgZ3ppcHBzIGJldHRlciwgYnV0IGZhaWxzIGluIEVkZ2UgOihcbiAgICAgICAgY29uc3QgdHggPSB0aGlzLnRyYW5zYWN0aW9uKHN0b3JlTmFtZSwgaXNXcml0ZSA/ICdyZWFkd3JpdGUnIDogJ3JlYWRvbmx5Jyk7XG4gICAgICAgIGxldCB0YXJnZXQgPSB0eC5zdG9yZTtcbiAgICAgICAgaWYgKHVzZUluZGV4KVxuICAgICAgICAgICAgdGFyZ2V0ID0gdGFyZ2V0LmluZGV4KGFyZ3Muc2hpZnQoKSk7XG4gICAgICAgIC8vIE11c3QgcmVqZWN0IGlmIG9wIHJlamVjdHMuXG4gICAgICAgIC8vIElmIGl0J3MgYSB3cml0ZSBvcGVyYXRpb24sIG11c3QgcmVqZWN0IGlmIHR4LmRvbmUgcmVqZWN0cy5cbiAgICAgICAgLy8gTXVzdCByZWplY3Qgd2l0aCBvcCByZWplY3Rpb24gZmlyc3QuXG4gICAgICAgIC8vIE11c3QgcmVzb2x2ZSB3aXRoIG9wIHZhbHVlLlxuICAgICAgICAvLyBNdXN0IGhhbmRsZSBib3RoIHByb21pc2VzIChubyB1bmhhbmRsZWQgcmVqZWN0aW9ucylcbiAgICAgICAgcmV0dXJuIChhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICAgICAgICB0YXJnZXRbdGFyZ2V0RnVuY05hbWVdKC4uLmFyZ3MpLFxuICAgICAgICAgICAgaXNXcml0ZSAmJiB0eC5kb25lLFxuICAgICAgICBdKSlbMF07XG4gICAgfTtcbiAgICBjYWNoZWRNZXRob2RzLnNldChwcm9wLCBtZXRob2QpO1xuICAgIHJldHVybiBtZXRob2Q7XG59XG5yZXBsYWNlVHJhcHMoKG9sZFRyYXBzKSA9PiAoe1xuICAgIC4uLm9sZFRyYXBzLFxuICAgIGdldDogKHRhcmdldCwgcHJvcCwgcmVjZWl2ZXIpID0+IGdldE1ldGhvZCh0YXJnZXQsIHByb3ApIHx8IG9sZFRyYXBzLmdldCh0YXJnZXQsIHByb3AsIHJlY2VpdmVyKSxcbiAgICBoYXM6ICh0YXJnZXQsIHByb3ApID0+ICEhZ2V0TWV0aG9kKHRhcmdldCwgcHJvcCkgfHwgb2xkVHJhcHMuaGFzKHRhcmdldCwgcHJvcCksXG59KSk7XG5cbmV4cG9ydCB7IGRlbGV0ZURCLCBvcGVuREIgfTtcbiIsICIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQge1xuICBDb21wb25lbnRDb250YWluZXIsXG4gIENvbXBvbmVudFR5cGUsXG4gIFByb3ZpZGVyLFxuICBOYW1lXG59IGZyb20gJ0BmaXJlYmFzZS9jb21wb25lbnQnO1xuaW1wb3J0IHsgUGxhdGZvcm1Mb2dnZXJTZXJ2aWNlLCBWZXJzaW9uU2VydmljZSB9IGZyb20gJy4vdHlwZXMnO1xuXG5leHBvcnQgY2xhc3MgUGxhdGZvcm1Mb2dnZXJTZXJ2aWNlSW1wbCBpbXBsZW1lbnRzIFBsYXRmb3JtTG9nZ2VyU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgY29udGFpbmVyOiBDb21wb25lbnRDb250YWluZXIpIHt9XG4gIC8vIEluIGluaXRpYWwgaW1wbGVtZW50YXRpb24sIHRoaXMgd2lsbCBiZSBjYWxsZWQgYnkgaW5zdGFsbGF0aW9ucyBvblxuICAvLyBhdXRoIHRva2VuIHJlZnJlc2gsIGFuZCBpbnN0YWxsYXRpb25zIHdpbGwgc2VuZCB0aGlzIHN0cmluZy5cbiAgZ2V0UGxhdGZvcm1JbmZvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgY29uc3QgcHJvdmlkZXJzID0gdGhpcy5jb250YWluZXIuZ2V0UHJvdmlkZXJzKCk7XG4gICAgLy8gTG9vcCB0aHJvdWdoIHByb3ZpZGVycyBhbmQgZ2V0IGxpYnJhcnkvdmVyc2lvbiBwYWlycyBmcm9tIGFueSB0aGF0IGFyZVxuICAgIC8vIHZlcnNpb24gY29tcG9uZW50cy5cbiAgICByZXR1cm4gcHJvdmlkZXJzXG4gICAgICAubWFwKHByb3ZpZGVyID0+IHtcbiAgICAgICAgaWYgKGlzVmVyc2lvblNlcnZpY2VQcm92aWRlcihwcm92aWRlcikpIHtcbiAgICAgICAgICBjb25zdCBzZXJ2aWNlID0gcHJvdmlkZXIuZ2V0SW1tZWRpYXRlKCkgYXMgVmVyc2lvblNlcnZpY2U7XG4gICAgICAgICAgcmV0dXJuIGAke3NlcnZpY2UubGlicmFyeX0vJHtzZXJ2aWNlLnZlcnNpb259YDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIC5maWx0ZXIobG9nU3RyaW5nID0+IGxvZ1N0cmluZylcbiAgICAgIC5qb2luKCcgJyk7XG4gIH1cbn1cbi8qKlxuICpcbiAqIEBwYXJhbSBwcm92aWRlciBjaGVjayBpZiB0aGlzIHByb3ZpZGVyIHByb3ZpZGVzIGEgVmVyc2lvblNlcnZpY2VcbiAqXG4gKiBOT1RFOiBVc2luZyBQcm92aWRlcjwnYXBwLXZlcnNpb24nPiBpcyBhIGhhY2sgdG8gaW5kaWNhdGUgdGhhdCB0aGUgcHJvdmlkZXJcbiAqIHByb3ZpZGVzIFZlcnNpb25TZXJ2aWNlLiBUaGUgcHJvdmlkZXIgaXMgbm90IG5lY2Vzc2FyaWx5IGEgJ2FwcC12ZXJzaW9uJ1xuICogcHJvdmlkZXIuXG4gKi9cbmZ1bmN0aW9uIGlzVmVyc2lvblNlcnZpY2VQcm92aWRlcihwcm92aWRlcjogUHJvdmlkZXI8TmFtZT4pOiBib29sZWFuIHtcbiAgY29uc3QgY29tcG9uZW50ID0gcHJvdmlkZXIuZ2V0Q29tcG9uZW50KCk7XG4gIHJldHVybiBjb21wb25lbnQ/LnR5cGUgPT09IENvbXBvbmVudFR5cGUuVkVSU0lPTjtcbn1cbiIsICIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBMb2dnZXIgfSBmcm9tICdAZmlyZWJhc2UvbG9nZ2VyJztcblxuZXhwb3J0IGNvbnN0IGxvZ2dlciA9IG5ldyBMb2dnZXIoJ0BmaXJlYmFzZS9hcHAnKTtcbiIsICIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBuYW1lIGFzIGFwcE5hbWUgfSBmcm9tICcuLi9wYWNrYWdlLmpzb24nO1xuaW1wb3J0IHsgbmFtZSBhcyBhcHBDb21wYXROYW1lIH0gZnJvbSAnLi4vLi4vYXBwLWNvbXBhdC9wYWNrYWdlLmpzb24nO1xuaW1wb3J0IHsgbmFtZSBhcyBhbmFseXRpY3NDb21wYXROYW1lIH0gZnJvbSAnLi4vLi4vLi4vcGFja2FnZXMvYW5hbHl0aWNzLWNvbXBhdC9wYWNrYWdlLmpzb24nO1xuaW1wb3J0IHsgbmFtZSBhcyBhbmFseXRpY3NOYW1lIH0gZnJvbSAnLi4vLi4vLi4vcGFja2FnZXMvYW5hbHl0aWNzL3BhY2thZ2UuanNvbic7XG5pbXBvcnQgeyBuYW1lIGFzIGFwcENoZWNrQ29tcGF0TmFtZSB9IGZyb20gJy4uLy4uLy4uL3BhY2thZ2VzL2FwcC1jaGVjay1jb21wYXQvcGFja2FnZS5qc29uJztcbmltcG9ydCB7IG5hbWUgYXMgYXBwQ2hlY2tOYW1lIH0gZnJvbSAnLi4vLi4vLi4vcGFja2FnZXMvYXBwLWNoZWNrL3BhY2thZ2UuanNvbic7XG5pbXBvcnQgeyBuYW1lIGFzIGF1dGhOYW1lIH0gZnJvbSAnLi4vLi4vLi4vcGFja2FnZXMvYXV0aC9wYWNrYWdlLmpzb24nO1xuaW1wb3J0IHsgbmFtZSBhcyBhdXRoQ29tcGF0TmFtZSB9IGZyb20gJy4uLy4uLy4uL3BhY2thZ2VzL2F1dGgtY29tcGF0L3BhY2thZ2UuanNvbic7XG5pbXBvcnQgeyBuYW1lIGFzIGRhdGFiYXNlTmFtZSB9IGZyb20gJy4uLy4uLy4uL3BhY2thZ2VzL2RhdGFiYXNlL3BhY2thZ2UuanNvbic7XG5pbXBvcnQgeyBuYW1lIGFzIGRhdGFiYXNlQ29tcGF0TmFtZSB9IGZyb20gJy4uLy4uLy4uL3BhY2thZ2VzL2RhdGFiYXNlLWNvbXBhdC9wYWNrYWdlLmpzb24nO1xuaW1wb3J0IHsgbmFtZSBhcyBmdW5jdGlvbnNOYW1lIH0gZnJvbSAnLi4vLi4vLi4vcGFja2FnZXMvZnVuY3Rpb25zL3BhY2thZ2UuanNvbic7XG5pbXBvcnQgeyBuYW1lIGFzIGZ1bmN0aW9uc0NvbXBhdE5hbWUgfSBmcm9tICcuLi8uLi8uLi9wYWNrYWdlcy9mdW5jdGlvbnMtY29tcGF0L3BhY2thZ2UuanNvbic7XG5pbXBvcnQgeyBuYW1lIGFzIGluc3RhbGxhdGlvbnNOYW1lIH0gZnJvbSAnLi4vLi4vLi4vcGFja2FnZXMvaW5zdGFsbGF0aW9ucy9wYWNrYWdlLmpzb24nO1xuaW1wb3J0IHsgbmFtZSBhcyBpbnN0YWxsYXRpb25zQ29tcGF0TmFtZSB9IGZyb20gJy4uLy4uLy4uL3BhY2thZ2VzL2luc3RhbGxhdGlvbnMtY29tcGF0L3BhY2thZ2UuanNvbic7XG5pbXBvcnQgeyBuYW1lIGFzIG1lc3NhZ2luZ05hbWUgfSBmcm9tICcuLi8uLi8uLi9wYWNrYWdlcy9tZXNzYWdpbmcvcGFja2FnZS5qc29uJztcbmltcG9ydCB7IG5hbWUgYXMgbWVzc2FnaW5nQ29tcGF0TmFtZSB9IGZyb20gJy4uLy4uLy4uL3BhY2thZ2VzL21lc3NhZ2luZy1jb21wYXQvcGFja2FnZS5qc29uJztcbmltcG9ydCB7IG5hbWUgYXMgcGVyZm9ybWFuY2VOYW1lIH0gZnJvbSAnLi4vLi4vLi4vcGFja2FnZXMvcGVyZm9ybWFuY2UvcGFja2FnZS5qc29uJztcbmltcG9ydCB7IG5hbWUgYXMgcGVyZm9ybWFuY2VDb21wYXROYW1lIH0gZnJvbSAnLi4vLi4vLi4vcGFja2FnZXMvcGVyZm9ybWFuY2UtY29tcGF0L3BhY2thZ2UuanNvbic7XG5pbXBvcnQgeyBuYW1lIGFzIHJlbW90ZUNvbmZpZ05hbWUgfSBmcm9tICcuLi8uLi8uLi9wYWNrYWdlcy9yZW1vdGUtY29uZmlnL3BhY2thZ2UuanNvbic7XG5pbXBvcnQgeyBuYW1lIGFzIHJlbW90ZUNvbmZpZ0NvbXBhdE5hbWUgfSBmcm9tICcuLi8uLi8uLi9wYWNrYWdlcy9yZW1vdGUtY29uZmlnLWNvbXBhdC9wYWNrYWdlLmpzb24nO1xuaW1wb3J0IHsgbmFtZSBhcyBzdG9yYWdlTmFtZSB9IGZyb20gJy4uLy4uLy4uL3BhY2thZ2VzL3N0b3JhZ2UvcGFja2FnZS5qc29uJztcbmltcG9ydCB7IG5hbWUgYXMgc3RvcmFnZUNvbXBhdE5hbWUgfSBmcm9tICcuLi8uLi8uLi9wYWNrYWdlcy9zdG9yYWdlLWNvbXBhdC9wYWNrYWdlLmpzb24nO1xuaW1wb3J0IHsgbmFtZSBhcyBmaXJlc3RvcmVOYW1lIH0gZnJvbSAnLi4vLi4vLi4vcGFja2FnZXMvZmlyZXN0b3JlL3BhY2thZ2UuanNvbic7XG5pbXBvcnQgeyBuYW1lIGFzIHZlcnRleE5hbWUgfSBmcm9tICcuLi8uLi8uLi9wYWNrYWdlcy92ZXJ0ZXhhaS9wYWNrYWdlLmpzb24nO1xuaW1wb3J0IHsgbmFtZSBhcyBmaXJlc3RvcmVDb21wYXROYW1lIH0gZnJvbSAnLi4vLi4vLi4vcGFja2FnZXMvZmlyZXN0b3JlLWNvbXBhdC9wYWNrYWdlLmpzb24nO1xuaW1wb3J0IHsgbmFtZSBhcyBwYWNrYWdlTmFtZSB9IGZyb20gJy4uLy4uLy4uL3BhY2thZ2VzL2ZpcmViYXNlL3BhY2thZ2UuanNvbic7XG5cbi8qKlxuICogVGhlIGRlZmF1bHQgYXBwIG5hbWVcbiAqXG4gKiBAaW50ZXJuYWxcbiAqL1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfRU5UUllfTkFNRSA9ICdbREVGQVVMVF0nO1xuXG5leHBvcnQgY29uc3QgUExBVEZPUk1fTE9HX1NUUklORyA9IHtcbiAgW2FwcE5hbWVdOiAnZmlyZS1jb3JlJyxcbiAgW2FwcENvbXBhdE5hbWVdOiAnZmlyZS1jb3JlLWNvbXBhdCcsXG4gIFthbmFseXRpY3NOYW1lXTogJ2ZpcmUtYW5hbHl0aWNzJyxcbiAgW2FuYWx5dGljc0NvbXBhdE5hbWVdOiAnZmlyZS1hbmFseXRpY3MtY29tcGF0JyxcbiAgW2FwcENoZWNrTmFtZV06ICdmaXJlLWFwcC1jaGVjaycsXG4gIFthcHBDaGVja0NvbXBhdE5hbWVdOiAnZmlyZS1hcHAtY2hlY2stY29tcGF0JyxcbiAgW2F1dGhOYW1lXTogJ2ZpcmUtYXV0aCcsXG4gIFthdXRoQ29tcGF0TmFtZV06ICdmaXJlLWF1dGgtY29tcGF0JyxcbiAgW2RhdGFiYXNlTmFtZV06ICdmaXJlLXJ0ZGInLFxuICBbZGF0YWJhc2VDb21wYXROYW1lXTogJ2ZpcmUtcnRkYi1jb21wYXQnLFxuICBbZnVuY3Rpb25zTmFtZV06ICdmaXJlLWZuJyxcbiAgW2Z1bmN0aW9uc0NvbXBhdE5hbWVdOiAnZmlyZS1mbi1jb21wYXQnLFxuICBbaW5zdGFsbGF0aW9uc05hbWVdOiAnZmlyZS1paWQnLFxuICBbaW5zdGFsbGF0aW9uc0NvbXBhdE5hbWVdOiAnZmlyZS1paWQtY29tcGF0JyxcbiAgW21lc3NhZ2luZ05hbWVdOiAnZmlyZS1mY20nLFxuICBbbWVzc2FnaW5nQ29tcGF0TmFtZV06ICdmaXJlLWZjbS1jb21wYXQnLFxuICBbcGVyZm9ybWFuY2VOYW1lXTogJ2ZpcmUtcGVyZicsXG4gIFtwZXJmb3JtYW5jZUNvbXBhdE5hbWVdOiAnZmlyZS1wZXJmLWNvbXBhdCcsXG4gIFtyZW1vdGVDb25maWdOYW1lXTogJ2ZpcmUtcmMnLFxuICBbcmVtb3RlQ29uZmlnQ29tcGF0TmFtZV06ICdmaXJlLXJjLWNvbXBhdCcsXG4gIFtzdG9yYWdlTmFtZV06ICdmaXJlLWdjcycsXG4gIFtzdG9yYWdlQ29tcGF0TmFtZV06ICdmaXJlLWdjcy1jb21wYXQnLFxuICBbZmlyZXN0b3JlTmFtZV06ICdmaXJlLWZzdCcsXG4gIFtmaXJlc3RvcmVDb21wYXROYW1lXTogJ2ZpcmUtZnN0LWNvbXBhdCcsXG4gIFt2ZXJ0ZXhOYW1lXTogJ2ZpcmUtdmVydGV4JyxcbiAgJ2ZpcmUtanMnOiAnZmlyZS1qcycsIC8vIFBsYXRmb3JtIGlkZW50aWZpZXIgZm9yIEpTIFNESy5cbiAgW3BhY2thZ2VOYW1lXTogJ2ZpcmUtanMtYWxsJ1xufSBhcyBjb25zdDtcbiIsICIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQge1xuICBGaXJlYmFzZUFwcCxcbiAgRmlyZWJhc2VPcHRpb25zLFxuICBGaXJlYmFzZVNlcnZlckFwcFxufSBmcm9tICcuL3B1YmxpYy10eXBlcyc7XG5pbXBvcnQgeyBDb21wb25lbnQsIFByb3ZpZGVyLCBOYW1lIH0gZnJvbSAnQGZpcmViYXNlL2NvbXBvbmVudCc7XG5pbXBvcnQgeyBsb2dnZXIgfSBmcm9tICcuL2xvZ2dlcic7XG5pbXBvcnQgeyBERUZBVUxUX0VOVFJZX05BTUUgfSBmcm9tICcuL2NvbnN0YW50cyc7XG5pbXBvcnQgeyBGaXJlYmFzZUFwcEltcGwgfSBmcm9tICcuL2ZpcmViYXNlQXBwJztcbmltcG9ydCB7IEZpcmViYXNlU2VydmVyQXBwSW1wbCB9IGZyb20gJy4vZmlyZWJhc2VTZXJ2ZXJBcHAnO1xuXG4vKipcbiAqIEBpbnRlcm5hbFxuICovXG5leHBvcnQgY29uc3QgX2FwcHMgPSBuZXcgTWFwPHN0cmluZywgRmlyZWJhc2VBcHA+KCk7XG5cbi8qKlxuICogQGludGVybmFsXG4gKi9cbmV4cG9ydCBjb25zdCBfc2VydmVyQXBwcyA9IG5ldyBNYXA8c3RyaW5nLCBGaXJlYmFzZVNlcnZlckFwcD4oKTtcblxuLyoqXG4gKiBSZWdpc3RlcmVkIGNvbXBvbmVudHMuXG4gKlxuICogQGludGVybmFsXG4gKi9cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XG5leHBvcnQgY29uc3QgX2NvbXBvbmVudHMgPSBuZXcgTWFwPHN0cmluZywgQ29tcG9uZW50PGFueT4+KCk7XG5cbi8qKlxuICogQHBhcmFtIGNvbXBvbmVudCAtIHRoZSBjb21wb25lbnQgYmVpbmcgYWRkZWQgdG8gdGhpcyBhcHAncyBjb250YWluZXJcbiAqXG4gKiBAaW50ZXJuYWxcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIF9hZGRDb21wb25lbnQ8VCBleHRlbmRzIE5hbWU+KFxuICBhcHA6IEZpcmViYXNlQXBwLFxuICBjb21wb25lbnQ6IENvbXBvbmVudDxUPlxuKTogdm9pZCB7XG4gIHRyeSB7XG4gICAgKGFwcCBhcyBGaXJlYmFzZUFwcEltcGwpLmNvbnRhaW5lci5hZGRDb21wb25lbnQoY29tcG9uZW50KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGxvZ2dlci5kZWJ1ZyhcbiAgICAgIGBDb21wb25lbnQgJHtjb21wb25lbnQubmFtZX0gZmFpbGVkIHRvIHJlZ2lzdGVyIHdpdGggRmlyZWJhc2VBcHAgJHthcHAubmFtZX1gLFxuICAgICAgZVxuICAgICk7XG4gIH1cbn1cblxuLyoqXG4gKlxuICogQGludGVybmFsXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBfYWRkT3JPdmVyd3JpdGVDb21wb25lbnQoXG4gIGFwcDogRmlyZWJhc2VBcHAsXG4gIGNvbXBvbmVudDogQ29tcG9uZW50XG4pOiB2b2lkIHtcbiAgKGFwcCBhcyBGaXJlYmFzZUFwcEltcGwpLmNvbnRhaW5lci5hZGRPck92ZXJ3cml0ZUNvbXBvbmVudChjb21wb25lbnQpO1xufVxuXG4vKipcbiAqXG4gKiBAcGFyYW0gY29tcG9uZW50IC0gdGhlIGNvbXBvbmVudCB0byByZWdpc3RlclxuICogQHJldHVybnMgd2hldGhlciBvciBub3QgdGhlIGNvbXBvbmVudCBpcyByZWdpc3RlcmVkIHN1Y2Nlc3NmdWxseVxuICpcbiAqIEBpbnRlcm5hbFxuICovXG5leHBvcnQgZnVuY3Rpb24gX3JlZ2lzdGVyQ29tcG9uZW50PFQgZXh0ZW5kcyBOYW1lPihcbiAgY29tcG9uZW50OiBDb21wb25lbnQ8VD5cbik6IGJvb2xlYW4ge1xuICBjb25zdCBjb21wb25lbnROYW1lID0gY29tcG9uZW50Lm5hbWU7XG4gIGlmIChfY29tcG9uZW50cy5oYXMoY29tcG9uZW50TmFtZSkpIHtcbiAgICBsb2dnZXIuZGVidWcoXG4gICAgICBgVGhlcmUgd2VyZSBtdWx0aXBsZSBhdHRlbXB0cyB0byByZWdpc3RlciBjb21wb25lbnQgJHtjb21wb25lbnROYW1lfS5gXG4gICAgKTtcblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIF9jb21wb25lbnRzLnNldChjb21wb25lbnROYW1lLCBjb21wb25lbnQpO1xuXG4gIC8vIGFkZCB0aGUgY29tcG9uZW50IHRvIGV4aXN0aW5nIGFwcCBpbnN0YW5jZXNcbiAgZm9yIChjb25zdCBhcHAgb2YgX2FwcHMudmFsdWVzKCkpIHtcbiAgICBfYWRkQ29tcG9uZW50KGFwcCBhcyBGaXJlYmFzZUFwcEltcGwsIGNvbXBvbmVudCk7XG4gIH1cblxuICBmb3IgKGNvbnN0IHNlcnZlckFwcCBvZiBfc2VydmVyQXBwcy52YWx1ZXMoKSkge1xuICAgIF9hZGRDb21wb25lbnQoc2VydmVyQXBwIGFzIEZpcmViYXNlU2VydmVyQXBwSW1wbCwgY29tcG9uZW50KTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG4vKipcbiAqXG4gKiBAcGFyYW0gYXBwIC0gRmlyZWJhc2VBcHAgaW5zdGFuY2VcbiAqIEBwYXJhbSBuYW1lIC0gc2VydmljZSBuYW1lXG4gKlxuICogQHJldHVybnMgdGhlIHByb3ZpZGVyIGZvciB0aGUgc2VydmljZSB3aXRoIHRoZSBtYXRjaGluZyBuYW1lXG4gKlxuICogQGludGVybmFsXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBfZ2V0UHJvdmlkZXI8VCBleHRlbmRzIE5hbWU+KFxuICBhcHA6IEZpcmViYXNlQXBwLFxuICBuYW1lOiBUXG4pOiBQcm92aWRlcjxUPiB7XG4gIGNvbnN0IGhlYXJ0YmVhdENvbnRyb2xsZXIgPSAoYXBwIGFzIEZpcmViYXNlQXBwSW1wbCkuY29udGFpbmVyXG4gICAgLmdldFByb3ZpZGVyKCdoZWFydGJlYXQnKVxuICAgIC5nZXRJbW1lZGlhdGUoeyBvcHRpb25hbDogdHJ1ZSB9KTtcbiAgaWYgKGhlYXJ0YmVhdENvbnRyb2xsZXIpIHtcbiAgICB2b2lkIGhlYXJ0YmVhdENvbnRyb2xsZXIudHJpZ2dlckhlYXJ0YmVhdCgpO1xuICB9XG4gIHJldHVybiAoYXBwIGFzIEZpcmViYXNlQXBwSW1wbCkuY29udGFpbmVyLmdldFByb3ZpZGVyKG5hbWUpO1xufVxuXG4vKipcbiAqXG4gKiBAcGFyYW0gYXBwIC0gRmlyZWJhc2VBcHAgaW5zdGFuY2VcbiAqIEBwYXJhbSBuYW1lIC0gc2VydmljZSBuYW1lXG4gKiBAcGFyYW0gaW5zdGFuY2VJZGVudGlmaWVyIC0gc2VydmljZSBpbnN0YW5jZSBpZGVudGlmaWVyIGluIGNhc2UgdGhlIHNlcnZpY2Ugc3VwcG9ydHMgbXVsdGlwbGUgaW5zdGFuY2VzXG4gKlxuICogQGludGVybmFsXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBfcmVtb3ZlU2VydmljZUluc3RhbmNlPFQgZXh0ZW5kcyBOYW1lPihcbiAgYXBwOiBGaXJlYmFzZUFwcCxcbiAgbmFtZTogVCxcbiAgaW5zdGFuY2VJZGVudGlmaWVyOiBzdHJpbmcgPSBERUZBVUxUX0VOVFJZX05BTUVcbik6IHZvaWQge1xuICBfZ2V0UHJvdmlkZXIoYXBwLCBuYW1lKS5jbGVhckluc3RhbmNlKGluc3RhbmNlSWRlbnRpZmllcik7XG59XG5cbi8qKlxuICpcbiAqIEBwYXJhbSBvYmogLSBhbiBvYmplY3Qgb2YgdHlwZSBGaXJlYmFzZUFwcCBvciBGaXJlYmFzZU9wdGlvbnMuXG4gKlxuICogQHJldHVybnMgdHJ1ZSBpZiB0aGUgcHJvdmlkZSBvYmplY3QgaXMgb2YgdHlwZSBGaXJlYmFzZUFwcC5cbiAqXG4gKiBAaW50ZXJuYWxcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIF9pc0ZpcmViYXNlQXBwKFxuICBvYmo6IEZpcmViYXNlQXBwIHwgRmlyZWJhc2VPcHRpb25zXG4pOiBvYmogaXMgRmlyZWJhc2VBcHAge1xuICByZXR1cm4gKG9iaiBhcyBGaXJlYmFzZUFwcCkub3B0aW9ucyAhPT0gdW5kZWZpbmVkO1xufVxuXG4vKipcbiAqXG4gKiBAcGFyYW0gb2JqIC0gYW4gb2JqZWN0IG9mIHR5cGUgRmlyZWJhc2VBcHAuXG4gKlxuICogQHJldHVybnMgdHJ1ZSBpZiB0aGUgcHJvdmlkZWQgb2JqZWN0IGlzIG9mIHR5cGUgRmlyZWJhc2VTZXJ2ZXJBcHBJbXBsLlxuICpcbiAqIEBpbnRlcm5hbFxuICovXG5leHBvcnQgZnVuY3Rpb24gX2lzRmlyZWJhc2VTZXJ2ZXJBcHAoXG4gIG9iajogRmlyZWJhc2VBcHAgfCBGaXJlYmFzZVNlcnZlckFwcFxuKTogb2JqIGlzIEZpcmViYXNlU2VydmVyQXBwIHtcbiAgcmV0dXJuIChvYmogYXMgRmlyZWJhc2VTZXJ2ZXJBcHApLnNldHRpbmdzICE9PSB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogVGVzdCBvbmx5XG4gKlxuICogQGludGVybmFsXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBfY2xlYXJDb21wb25lbnRzKCk6IHZvaWQge1xuICBfY29tcG9uZW50cy5jbGVhcigpO1xufVxuXG4vKipcbiAqIEV4cG9ydGVkIGluIG9yZGVyIHRvIGJlIHVzZWQgaW4gYXBwLWNvbXBhdCBwYWNrYWdlXG4gKi9cbmV4cG9ydCB7IERFRkFVTFRfRU5UUllfTkFNRSBhcyBfREVGQVVMVF9FTlRSWV9OQU1FIH07XG4iLCAiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgRXJyb3JGYWN0b3J5LCBFcnJvck1hcCB9IGZyb20gJ0BmaXJlYmFzZS91dGlsJztcblxuZXhwb3J0IGNvbnN0IGVudW0gQXBwRXJyb3Ige1xuICBOT19BUFAgPSAnbm8tYXBwJyxcbiAgQkFEX0FQUF9OQU1FID0gJ2JhZC1hcHAtbmFtZScsXG4gIERVUExJQ0FURV9BUFAgPSAnZHVwbGljYXRlLWFwcCcsXG4gIEFQUF9ERUxFVEVEID0gJ2FwcC1kZWxldGVkJyxcbiAgU0VSVkVSX0FQUF9ERUxFVEVEID0gJ3NlcnZlci1hcHAtZGVsZXRlZCcsXG4gIE5PX09QVElPTlMgPSAnbm8tb3B0aW9ucycsXG4gIElOVkFMSURfQVBQX0FSR1VNRU5UID0gJ2ludmFsaWQtYXBwLWFyZ3VtZW50JyxcbiAgSU5WQUxJRF9MT0dfQVJHVU1FTlQgPSAnaW52YWxpZC1sb2ctYXJndW1lbnQnLFxuICBJREJfT1BFTiA9ICdpZGItb3BlbicsXG4gIElEQl9HRVQgPSAnaWRiLWdldCcsXG4gIElEQl9XUklURSA9ICdpZGItc2V0JyxcbiAgSURCX0RFTEVURSA9ICdpZGItZGVsZXRlJyxcbiAgRklOQUxJWkFUSU9OX1JFR0lTVFJZX05PVF9TVVBQT1JURUQgPSAnZmluYWxpemF0aW9uLXJlZ2lzdHJ5LW5vdC1zdXBwb3J0ZWQnLFxuICBJTlZBTElEX1NFUlZFUl9BUFBfRU5WSVJPTk1FTlQgPSAnaW52YWxpZC1zZXJ2ZXItYXBwLWVudmlyb25tZW50J1xufVxuXG5jb25zdCBFUlJPUlM6IEVycm9yTWFwPEFwcEVycm9yPiA9IHtcbiAgW0FwcEVycm9yLk5PX0FQUF06XG4gICAgXCJObyBGaXJlYmFzZSBBcHAgJ3skYXBwTmFtZX0nIGhhcyBiZWVuIGNyZWF0ZWQgLSBcIiArXG4gICAgJ2NhbGwgaW5pdGlhbGl6ZUFwcCgpIGZpcnN0JyxcbiAgW0FwcEVycm9yLkJBRF9BUFBfTkFNRV06IFwiSWxsZWdhbCBBcHAgbmFtZTogJ3skYXBwTmFtZX0nXCIsXG4gIFtBcHBFcnJvci5EVVBMSUNBVEVfQVBQXTpcbiAgICBcIkZpcmViYXNlIEFwcCBuYW1lZCAneyRhcHBOYW1lfScgYWxyZWFkeSBleGlzdHMgd2l0aCBkaWZmZXJlbnQgb3B0aW9ucyBvciBjb25maWdcIixcbiAgW0FwcEVycm9yLkFQUF9ERUxFVEVEXTogXCJGaXJlYmFzZSBBcHAgbmFtZWQgJ3skYXBwTmFtZX0nIGFscmVhZHkgZGVsZXRlZFwiLFxuICBbQXBwRXJyb3IuU0VSVkVSX0FQUF9ERUxFVEVEXTogJ0ZpcmViYXNlIFNlcnZlciBBcHAgaGFzIGJlZW4gZGVsZXRlZCcsXG4gIFtBcHBFcnJvci5OT19PUFRJT05TXTpcbiAgICAnTmVlZCB0byBwcm92aWRlIG9wdGlvbnMsIHdoZW4gbm90IGJlaW5nIGRlcGxveWVkIHRvIGhvc3RpbmcgdmlhIHNvdXJjZS4nLFxuICBbQXBwRXJyb3IuSU5WQUxJRF9BUFBfQVJHVU1FTlRdOlxuICAgICdmaXJlYmFzZS57JGFwcE5hbWV9KCkgdGFrZXMgZWl0aGVyIG5vIGFyZ3VtZW50IG9yIGEgJyArXG4gICAgJ0ZpcmViYXNlIEFwcCBpbnN0YW5jZS4nLFxuICBbQXBwRXJyb3IuSU5WQUxJRF9MT0dfQVJHVU1FTlRdOlxuICAgICdGaXJzdCBhcmd1bWVudCB0byBgb25Mb2dgIG11c3QgYmUgbnVsbCBvciBhIGZ1bmN0aW9uLicsXG4gIFtBcHBFcnJvci5JREJfT1BFTl06XG4gICAgJ0Vycm9yIHRocm93biB3aGVuIG9wZW5pbmcgSW5kZXhlZERCLiBPcmlnaW5hbCBlcnJvcjogeyRvcmlnaW5hbEVycm9yTWVzc2FnZX0uJyxcbiAgW0FwcEVycm9yLklEQl9HRVRdOlxuICAgICdFcnJvciB0aHJvd24gd2hlbiByZWFkaW5nIGZyb20gSW5kZXhlZERCLiBPcmlnaW5hbCBlcnJvcjogeyRvcmlnaW5hbEVycm9yTWVzc2FnZX0uJyxcbiAgW0FwcEVycm9yLklEQl9XUklURV06XG4gICAgJ0Vycm9yIHRocm93biB3aGVuIHdyaXRpbmcgdG8gSW5kZXhlZERCLiBPcmlnaW5hbCBlcnJvcjogeyRvcmlnaW5hbEVycm9yTWVzc2FnZX0uJyxcbiAgW0FwcEVycm9yLklEQl9ERUxFVEVdOlxuICAgICdFcnJvciB0aHJvd24gd2hlbiBkZWxldGluZyBmcm9tIEluZGV4ZWREQi4gT3JpZ2luYWwgZXJyb3I6IHskb3JpZ2luYWxFcnJvck1lc3NhZ2V9LicsXG4gIFtBcHBFcnJvci5GSU5BTElaQVRJT05fUkVHSVNUUllfTk9UX1NVUFBPUlRFRF06XG4gICAgJ0ZpcmViYXNlU2VydmVyQXBwIGRlbGV0ZU9uRGVyZWYgZmllbGQgZGVmaW5lZCBidXQgdGhlIEpTIHJ1bnRpbWUgZG9lcyBub3Qgc3VwcG9ydCBGaW5hbGl6YXRpb25SZWdpc3RyeS4nLFxuICBbQXBwRXJyb3IuSU5WQUxJRF9TRVJWRVJfQVBQX0VOVklST05NRU5UXTpcbiAgICAnRmlyZWJhc2VTZXJ2ZXJBcHAgaXMgbm90IGZvciB1c2UgaW4gYnJvd3NlciBlbnZpcm9ubWVudHMuJ1xufTtcblxuaW50ZXJmYWNlIEVycm9yUGFyYW1zIHtcbiAgW0FwcEVycm9yLk5PX0FQUF06IHsgYXBwTmFtZTogc3RyaW5nIH07XG4gIFtBcHBFcnJvci5CQURfQVBQX05BTUVdOiB7IGFwcE5hbWU6IHN0cmluZyB9O1xuICBbQXBwRXJyb3IuRFVQTElDQVRFX0FQUF06IHsgYXBwTmFtZTogc3RyaW5nIH07XG4gIFtBcHBFcnJvci5BUFBfREVMRVRFRF06IHsgYXBwTmFtZTogc3RyaW5nIH07XG4gIFtBcHBFcnJvci5JTlZBTElEX0FQUF9BUkdVTUVOVF06IHsgYXBwTmFtZTogc3RyaW5nIH07XG4gIFtBcHBFcnJvci5JREJfT1BFTl06IHsgb3JpZ2luYWxFcnJvck1lc3NhZ2U/OiBzdHJpbmcgfTtcbiAgW0FwcEVycm9yLklEQl9HRVRdOiB7IG9yaWdpbmFsRXJyb3JNZXNzYWdlPzogc3RyaW5nIH07XG4gIFtBcHBFcnJvci5JREJfV1JJVEVdOiB7IG9yaWdpbmFsRXJyb3JNZXNzYWdlPzogc3RyaW5nIH07XG4gIFtBcHBFcnJvci5JREJfREVMRVRFXTogeyBvcmlnaW5hbEVycm9yTWVzc2FnZT86IHN0cmluZyB9O1xuICBbQXBwRXJyb3IuRklOQUxJWkFUSU9OX1JFR0lTVFJZX05PVF9TVVBQT1JURURdOiB7IGFwcE5hbWU/OiBzdHJpbmcgfTtcbn1cblxuZXhwb3J0IGNvbnN0IEVSUk9SX0ZBQ1RPUlkgPSBuZXcgRXJyb3JGYWN0b3J5PEFwcEVycm9yLCBFcnJvclBhcmFtcz4oXG4gICdhcHAnLFxuICAnRmlyZWJhc2UnLFxuICBFUlJPUlNcbik7XG4iLCAiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHtcbiAgRmlyZWJhc2VBcHAsXG4gIEZpcmViYXNlT3B0aW9ucyxcbiAgRmlyZWJhc2VBcHBTZXR0aW5nc1xufSBmcm9tICcuL3B1YmxpYy10eXBlcyc7XG5pbXBvcnQge1xuICBDb21wb25lbnRDb250YWluZXIsXG4gIENvbXBvbmVudCxcbiAgQ29tcG9uZW50VHlwZVxufSBmcm9tICdAZmlyZWJhc2UvY29tcG9uZW50JztcbmltcG9ydCB7IEVSUk9SX0ZBQ1RPUlksIEFwcEVycm9yIH0gZnJvbSAnLi9lcnJvcnMnO1xuXG5leHBvcnQgY2xhc3MgRmlyZWJhc2VBcHBJbXBsIGltcGxlbWVudHMgRmlyZWJhc2VBcHAge1xuICBwcm90ZWN0ZWQgcmVhZG9ubHkgX29wdGlvbnM6IEZpcmViYXNlT3B0aW9ucztcbiAgcHJvdGVjdGVkIHJlYWRvbmx5IF9uYW1lOiBzdHJpbmc7XG4gIC8qKlxuICAgKiBPcmlnaW5hbCBjb25maWcgdmFsdWVzIHBhc3NlZCBpbiBhcyBhIGNvbnN0cnVjdG9yIHBhcmFtZXRlci5cbiAgICogSXQgaXMgb25seSB1c2VkIHRvIGNvbXBhcmUgd2l0aCBhbm90aGVyIGNvbmZpZyBvYmplY3QgdG8gc3VwcG9ydCBpZGVtcG90ZW50IGluaXRpYWxpemVBcHAoKS5cbiAgICpcbiAgICogVXBkYXRpbmcgYXV0b21hdGljRGF0YUNvbGxlY3Rpb25FbmFibGVkIG9uIHRoZSBBcHAgaW5zdGFuY2Ugd2lsbCBub3QgY2hhbmdlIGl0cyB2YWx1ZSBpbiBfY29uZmlnLlxuICAgKi9cbiAgcHJpdmF0ZSByZWFkb25seSBfY29uZmlnOiBSZXF1aXJlZDxGaXJlYmFzZUFwcFNldHRpbmdzPjtcbiAgcHJpdmF0ZSBfYXV0b21hdGljRGF0YUNvbGxlY3Rpb25FbmFibGVkOiBib29sZWFuO1xuICBwcm90ZWN0ZWQgX2lzRGVsZXRlZCA9IGZhbHNlO1xuICBwcml2YXRlIHJlYWRvbmx5IF9jb250YWluZXI6IENvbXBvbmVudENvbnRhaW5lcjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBvcHRpb25zOiBGaXJlYmFzZU9wdGlvbnMsXG4gICAgY29uZmlnOiBSZXF1aXJlZDxGaXJlYmFzZUFwcFNldHRpbmdzPixcbiAgICBjb250YWluZXI6IENvbXBvbmVudENvbnRhaW5lclxuICApIHtcbiAgICB0aGlzLl9vcHRpb25zID0geyAuLi5vcHRpb25zIH07XG4gICAgdGhpcy5fY29uZmlnID0geyAuLi5jb25maWcgfTtcbiAgICB0aGlzLl9uYW1lID0gY29uZmlnLm5hbWU7XG4gICAgdGhpcy5fYXV0b21hdGljRGF0YUNvbGxlY3Rpb25FbmFibGVkID1cbiAgICAgIGNvbmZpZy5hdXRvbWF0aWNEYXRhQ29sbGVjdGlvbkVuYWJsZWQ7XG4gICAgdGhpcy5fY29udGFpbmVyID0gY29udGFpbmVyO1xuICAgIHRoaXMuY29udGFpbmVyLmFkZENvbXBvbmVudChcbiAgICAgIG5ldyBDb21wb25lbnQoJ2FwcCcsICgpID0+IHRoaXMsIENvbXBvbmVudFR5cGUuUFVCTElDKVxuICAgICk7XG4gIH1cblxuICBnZXQgYXV0b21hdGljRGF0YUNvbGxlY3Rpb25FbmFibGVkKCk6IGJvb2xlYW4ge1xuICAgIHRoaXMuY2hlY2tEZXN0cm95ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5fYXV0b21hdGljRGF0YUNvbGxlY3Rpb25FbmFibGVkO1xuICB9XG5cbiAgc2V0IGF1dG9tYXRpY0RhdGFDb2xsZWN0aW9uRW5hYmxlZCh2YWw6IGJvb2xlYW4pIHtcbiAgICB0aGlzLmNoZWNrRGVzdHJveWVkKCk7XG4gICAgdGhpcy5fYXV0b21hdGljRGF0YUNvbGxlY3Rpb25FbmFibGVkID0gdmFsO1xuICB9XG5cbiAgZ2V0IG5hbWUoKTogc3RyaW5nIHtcbiAgICB0aGlzLmNoZWNrRGVzdHJveWVkKCk7XG4gICAgcmV0dXJuIHRoaXMuX25hbWU7XG4gIH1cblxuICBnZXQgb3B0aW9ucygpOiBGaXJlYmFzZU9wdGlvbnMge1xuICAgIHRoaXMuY2hlY2tEZXN0cm95ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5fb3B0aW9ucztcbiAgfVxuXG4gIGdldCBjb25maWcoKTogUmVxdWlyZWQ8RmlyZWJhc2VBcHBTZXR0aW5ncz4ge1xuICAgIHRoaXMuY2hlY2tEZXN0cm95ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5fY29uZmlnO1xuICB9XG5cbiAgZ2V0IGNvbnRhaW5lcigpOiBDb21wb25lbnRDb250YWluZXIge1xuICAgIHJldHVybiB0aGlzLl9jb250YWluZXI7XG4gIH1cblxuICBnZXQgaXNEZWxldGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9pc0RlbGV0ZWQ7XG4gIH1cblxuICBzZXQgaXNEZWxldGVkKHZhbDogYm9vbGVhbikge1xuICAgIHRoaXMuX2lzRGVsZXRlZCA9IHZhbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIHdpbGwgdGhyb3cgYW4gRXJyb3IgaWYgdGhlIEFwcCBoYXMgYWxyZWFkeSBiZWVuIGRlbGV0ZWQgLVxuICAgKiB1c2UgYmVmb3JlIHBlcmZvcm1pbmcgQVBJIGFjdGlvbnMgb24gdGhlIEFwcC5cbiAgICovXG4gIHByb3RlY3RlZCBjaGVja0Rlc3Ryb3llZCgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5pc0RlbGV0ZWQpIHtcbiAgICAgIHRocm93IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKEFwcEVycm9yLkFQUF9ERUxFVEVELCB7IGFwcE5hbWU6IHRoaXMuX25hbWUgfSk7XG4gICAgfVxuICB9XG59XG4iLCAiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjMgR29vZ2xlIExMQ1xuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHtcbiAgRmlyZWJhc2VBcHBTZXR0aW5ncyxcbiAgRmlyZWJhc2VTZXJ2ZXJBcHAsXG4gIEZpcmViYXNlU2VydmVyQXBwU2V0dGluZ3MsXG4gIEZpcmViYXNlT3B0aW9uc1xufSBmcm9tICcuL3B1YmxpYy10eXBlcyc7XG5pbXBvcnQgeyBkZWxldGVBcHAsIHJlZ2lzdGVyVmVyc2lvbiB9IGZyb20gJy4vYXBpJztcbmltcG9ydCB7IENvbXBvbmVudENvbnRhaW5lciB9IGZyb20gJ0BmaXJlYmFzZS9jb21wb25lbnQnO1xuaW1wb3J0IHsgRmlyZWJhc2VBcHBJbXBsIH0gZnJvbSAnLi9maXJlYmFzZUFwcCc7XG5pbXBvcnQgeyBFUlJPUl9GQUNUT1JZLCBBcHBFcnJvciB9IGZyb20gJy4vZXJyb3JzJztcbmltcG9ydCB7IG5hbWUgYXMgcGFja2FnZU5hbWUsIHZlcnNpb24gfSBmcm9tICcuLi9wYWNrYWdlLmpzb24nO1xuXG5leHBvcnQgY2xhc3MgRmlyZWJhc2VTZXJ2ZXJBcHBJbXBsXG4gIGV4dGVuZHMgRmlyZWJhc2VBcHBJbXBsXG4gIGltcGxlbWVudHMgRmlyZWJhc2VTZXJ2ZXJBcHBcbntcbiAgcHJpdmF0ZSByZWFkb25seSBfc2VydmVyQ29uZmlnOiBGaXJlYmFzZVNlcnZlckFwcFNldHRpbmdzO1xuICBwcml2YXRlIF9maW5hbGl6YXRpb25SZWdpc3RyeTogRmluYWxpemF0aW9uUmVnaXN0cnk8b2JqZWN0PjtcbiAgcHJpdmF0ZSBfcmVmQ291bnQ6IG51bWJlcjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBvcHRpb25zOiBGaXJlYmFzZU9wdGlvbnMgfCBGaXJlYmFzZUFwcEltcGwsXG4gICAgc2VydmVyQ29uZmlnOiBGaXJlYmFzZVNlcnZlckFwcFNldHRpbmdzLFxuICAgIG5hbWU6IHN0cmluZyxcbiAgICBjb250YWluZXI6IENvbXBvbmVudENvbnRhaW5lclxuICApIHtcbiAgICAvLyBCdWlsZCBjb25maWd1cmF0aW9uIHBhcmFtZXRlcnMgZm9yIHRoZSBGaXJlYmFzZUFwcEltcGwgYmFzZSBjbGFzcy5cbiAgICBjb25zdCBhdXRvbWF0aWNEYXRhQ29sbGVjdGlvbkVuYWJsZWQgPVxuICAgICAgc2VydmVyQ29uZmlnLmF1dG9tYXRpY0RhdGFDb2xsZWN0aW9uRW5hYmxlZCAhPT0gdW5kZWZpbmVkXG4gICAgICAgID8gc2VydmVyQ29uZmlnLmF1dG9tYXRpY0RhdGFDb2xsZWN0aW9uRW5hYmxlZFxuICAgICAgICA6IGZhbHNlO1xuXG4gICAgLy8gQ3JlYXRlIHRoZSBGaXJlYmFzZUFwcFNldHRpbmdzIG9iamVjdCBmb3IgdGhlIEZpcmViYXNlQXBwSW1wIGNvbnN0cnVjdG9yLlxuICAgIGNvbnN0IGNvbmZpZzogUmVxdWlyZWQ8RmlyZWJhc2VBcHBTZXR0aW5ncz4gPSB7XG4gICAgICBuYW1lLFxuICAgICAgYXV0b21hdGljRGF0YUNvbGxlY3Rpb25FbmFibGVkXG4gICAgfTtcblxuICAgIGlmICgob3B0aW9ucyBhcyBGaXJlYmFzZU9wdGlvbnMpLmFwaUtleSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBDb25zdHJ1Y3QgdGhlIHBhcmVudCBGaXJlYmFzZUFwcEltcCBvYmplY3QuXG4gICAgICBzdXBlcihvcHRpb25zIGFzIEZpcmViYXNlT3B0aW9ucywgY29uZmlnLCBjb250YWluZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBhcHBJbXBsOiBGaXJlYmFzZUFwcEltcGwgPSBvcHRpb25zIGFzIEZpcmViYXNlQXBwSW1wbDtcbiAgICAgIHN1cGVyKGFwcEltcGwub3B0aW9ucywgY29uZmlnLCBjb250YWluZXIpO1xuICAgIH1cblxuICAgIC8vIE5vdyBjb25zdHJ1Y3QgdGhlIGRhdGEgZm9yIHRoZSBGaXJlYmFzZVNlcnZlckFwcEltcGwuXG4gICAgdGhpcy5fc2VydmVyQ29uZmlnID0ge1xuICAgICAgYXV0b21hdGljRGF0YUNvbGxlY3Rpb25FbmFibGVkLFxuICAgICAgLi4uc2VydmVyQ29uZmlnXG4gICAgfTtcblxuICAgIHRoaXMuX2ZpbmFsaXphdGlvblJlZ2lzdHJ5ID0gbmV3IEZpbmFsaXphdGlvblJlZ2lzdHJ5KCgpID0+IHtcbiAgICAgIHRoaXMuYXV0b21hdGljQ2xlYW51cCgpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5fcmVmQ291bnQgPSAwO1xuICAgIHRoaXMuaW5jUmVmQ291bnQodGhpcy5fc2VydmVyQ29uZmlnLnJlbGVhc2VPbkRlcmVmKTtcblxuICAgIC8vIERvIG5vdCByZXRhaW4gYSBoYXJkIHJlZmVyZW5jZSB0byB0aGUgZHJlZiBvYmplY3QsIG90aGVyd2lzZSB0aGUgRmluYWxpemF0aW9uUmVnaXNyeVxuICAgIC8vIHdpbGwgbmV2ZXIgdHJpZ2dlci5cbiAgICB0aGlzLl9zZXJ2ZXJDb25maWcucmVsZWFzZU9uRGVyZWYgPSB1bmRlZmluZWQ7XG4gICAgc2VydmVyQ29uZmlnLnJlbGVhc2VPbkRlcmVmID0gdW5kZWZpbmVkO1xuXG4gICAgcmVnaXN0ZXJWZXJzaW9uKHBhY2thZ2VOYW1lLCB2ZXJzaW9uLCAnc2VydmVyYXBwJyk7XG4gIH1cblxuICB0b0pTT04oKTogdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgZ2V0IHJlZkNvdW50KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX3JlZkNvdW50O1xuICB9XG5cbiAgLy8gSW5jcmVtZW50IHRoZSByZWZlcmVuY2UgY291bnQgb2YgdGhpcyBzZXJ2ZXIgYXBwLiBJZiBhbiBvYmplY3QgaXMgcHJvdmlkZWQsIHJlZ2lzdGVyIGl0XG4gIC8vIHdpdGggdGhlIGZpbmFsaXphdGlvbiByZWdpc3RyeS5cbiAgaW5jUmVmQ291bnQob2JqOiBvYmplY3QgfCB1bmRlZmluZWQpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5pc0RlbGV0ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5fcmVmQ291bnQrKztcbiAgICBpZiAob2JqICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuX2ZpbmFsaXphdGlvblJlZ2lzdHJ5LnJlZ2lzdGVyKG9iaiwgdGhpcyk7XG4gICAgfVxuICB9XG5cbiAgLy8gRGVjcmVtZW50IHRoZSByZWZlcmVuY2UgY291bnQuXG4gIGRlY1JlZkNvdW50KCk6IG51bWJlciB7XG4gICAgaWYgKHRoaXMuaXNEZWxldGVkKSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG4gICAgcmV0dXJuIC0tdGhpcy5fcmVmQ291bnQ7XG4gIH1cblxuICAvLyBJbnZva2VkIGJ5IHRoZSBGaW5hbGl6YXRpb25SZWdpc3RyeSBjYWxsYmFjayB0byBub3RlIHRoYXQgdGhpcyBhcHAgc2hvdWxkIGdvIHRocm91Z2ggaXRzXG4gIC8vIHJlZmVyZW5jZSBjb3VudHMgYW5kIGRlbGV0ZSBpdHNlbGYgaWYgbm8gcmVmZXJlbmNlIGNvdW50IHJlbWFpbi4gVGhlIGNvb3JkaW5hdGluZyBsb2dpYyB0aGF0XG4gIC8vIGhhbmRsZXMgdGhpcyBpcyBpbiBkZWxldGVBcHAoLi4uKS5cbiAgcHJpdmF0ZSBhdXRvbWF0aWNDbGVhbnVwKCk6IHZvaWQge1xuICAgIHZvaWQgZGVsZXRlQXBwKHRoaXMpO1xuICB9XG5cbiAgZ2V0IHNldHRpbmdzKCk6IEZpcmViYXNlU2VydmVyQXBwU2V0dGluZ3Mge1xuICAgIHRoaXMuY2hlY2tEZXN0cm95ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5fc2VydmVyQ29uZmlnO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgZnVuY3Rpb24gd2lsbCB0aHJvdyBhbiBFcnJvciBpZiB0aGUgQXBwIGhhcyBhbHJlYWR5IGJlZW4gZGVsZXRlZCAtXG4gICAqIHVzZSBiZWZvcmUgcGVyZm9ybWluZyBBUEkgYWN0aW9ucyBvbiB0aGUgQXBwLlxuICAgKi9cbiAgcHJvdGVjdGVkIGNoZWNrRGVzdHJveWVkKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmlzRGVsZXRlZCkge1xuICAgICAgdGhyb3cgRVJST1JfRkFDVE9SWS5jcmVhdGUoQXBwRXJyb3IuU0VSVkVSX0FQUF9ERUxFVEVEKTtcbiAgICB9XG4gIH1cbn1cbiIsICIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQge1xuICBGaXJlYmFzZUFwcCxcbiAgRmlyZWJhc2VTZXJ2ZXJBcHAsXG4gIEZpcmViYXNlT3B0aW9ucyxcbiAgRmlyZWJhc2VBcHBTZXR0aW5ncyxcbiAgRmlyZWJhc2VTZXJ2ZXJBcHBTZXR0aW5nc1xufSBmcm9tICcuL3B1YmxpYy10eXBlcyc7XG5pbXBvcnQgeyBERUZBVUxUX0VOVFJZX05BTUUsIFBMQVRGT1JNX0xPR19TVFJJTkcgfSBmcm9tICcuL2NvbnN0YW50cyc7XG5pbXBvcnQgeyBFUlJPUl9GQUNUT1JZLCBBcHBFcnJvciB9IGZyb20gJy4vZXJyb3JzJztcbmltcG9ydCB7XG4gIENvbXBvbmVudENvbnRhaW5lcixcbiAgQ29tcG9uZW50LFxuICBOYW1lLFxuICBDb21wb25lbnRUeXBlXG59IGZyb20gJ0BmaXJlYmFzZS9jb21wb25lbnQnO1xuaW1wb3J0IHsgdmVyc2lvbiB9IGZyb20gJy4uLy4uL2ZpcmViYXNlL3BhY2thZ2UuanNvbic7XG5pbXBvcnQgeyBGaXJlYmFzZUFwcEltcGwgfSBmcm9tICcuL2ZpcmViYXNlQXBwJztcbmltcG9ydCB7IEZpcmViYXNlU2VydmVyQXBwSW1wbCB9IGZyb20gJy4vZmlyZWJhc2VTZXJ2ZXJBcHAnO1xuaW1wb3J0IHtcbiAgX2FwcHMsXG4gIF9jb21wb25lbnRzLFxuICBfaXNGaXJlYmFzZUFwcCxcbiAgX3JlZ2lzdGVyQ29tcG9uZW50LFxuICBfc2VydmVyQXBwc1xufSBmcm9tICcuL2ludGVybmFsJztcbmltcG9ydCB7IGxvZ2dlciB9IGZyb20gJy4vbG9nZ2VyJztcbmltcG9ydCB7XG4gIExvZ0xldmVsU3RyaW5nLFxuICBzZXRMb2dMZXZlbCBhcyBzZXRMb2dMZXZlbEltcGwsXG4gIExvZ0NhbGxiYWNrLFxuICBMb2dPcHRpb25zLFxuICBzZXRVc2VyTG9nSGFuZGxlclxufSBmcm9tICdAZmlyZWJhc2UvbG9nZ2VyJztcbmltcG9ydCB7IGRlZXBFcXVhbCwgZ2V0RGVmYXVsdEFwcENvbmZpZywgaXNCcm93c2VyIH0gZnJvbSAnQGZpcmViYXNlL3V0aWwnO1xuXG5leHBvcnQgeyBGaXJlYmFzZUVycm9yIH0gZnJvbSAnQGZpcmViYXNlL3V0aWwnO1xuXG4vKipcbiAqIFRoZSBjdXJyZW50IFNESyB2ZXJzaW9uLlxuICpcbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNvbnN0IFNES19WRVJTSU9OID0gdmVyc2lvbjtcblxuLyoqXG4gKiBDcmVhdGVzIGFuZCBpbml0aWFsaXplcyBhIHtAbGluayBAZmlyZWJhc2UvYXBwI0ZpcmViYXNlQXBwfSBpbnN0YW5jZS5cbiAqXG4gKiBTZWVcbiAqIHtAbGlua1xuICogICBodHRwczovL2ZpcmViYXNlLmdvb2dsZS5jb20vZG9jcy93ZWIvc2V0dXAjYWRkX2ZpcmViYXNlX3RvX3lvdXJfYXBwXG4gKiAgIHwgQWRkIEZpcmViYXNlIHRvIHlvdXIgYXBwfSBhbmRcbiAqIHtAbGlua1xuICogICBodHRwczovL2ZpcmViYXNlLmdvb2dsZS5jb20vZG9jcy93ZWIvc2V0dXAjbXVsdGlwbGUtcHJvamVjdHNcbiAqICAgfCBJbml0aWFsaXplIG11bHRpcGxlIHByb2plY3RzfSBmb3IgZGV0YWlsZWQgZG9jdW1lbnRhdGlvbi5cbiAqXG4gKiBAZXhhbXBsZVxuICogYGBgamF2YXNjcmlwdFxuICpcbiAqIC8vIEluaXRpYWxpemUgZGVmYXVsdCBhcHBcbiAqIC8vIFJldHJpZXZlIHlvdXIgb3duIG9wdGlvbnMgdmFsdWVzIGJ5IGFkZGluZyBhIHdlYiBhcHAgb25cbiAqIC8vIGh0dHBzOi8vY29uc29sZS5maXJlYmFzZS5nb29nbGUuY29tXG4gKiBpbml0aWFsaXplQXBwKHtcbiAqICAgYXBpS2V5OiBcIkFJemEuLi4uXCIsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBdXRoIC8gR2VuZXJhbCBVc2VcbiAqICAgYXV0aERvbWFpbjogXCJZT1VSX0FQUC5maXJlYmFzZWFwcC5jb21cIiwgICAgICAgICAvLyBBdXRoIHdpdGggcG9wdXAvcmVkaXJlY3RcbiAqICAgZGF0YWJhc2VVUkw6IFwiaHR0cHM6Ly9ZT1VSX0FQUC5maXJlYmFzZWlvLmNvbVwiLCAvLyBSZWFsdGltZSBEYXRhYmFzZVxuICogICBzdG9yYWdlQnVja2V0OiBcIllPVVJfQVBQLmFwcHNwb3QuY29tXCIsICAgICAgICAgIC8vIFN0b3JhZ2VcbiAqICAgbWVzc2FnaW5nU2VuZGVySWQ6IFwiMTIzNDU2Nzg5XCIgICAgICAgICAgICAgICAgICAvLyBDbG91ZCBNZXNzYWdpbmdcbiAqIH0pO1xuICogYGBgXG4gKlxuICogQGV4YW1wbGVcbiAqIGBgYGphdmFzY3JpcHRcbiAqXG4gKiAvLyBJbml0aWFsaXplIGFub3RoZXIgYXBwXG4gKiBjb25zdCBvdGhlckFwcCA9IGluaXRpYWxpemVBcHAoe1xuICogICBkYXRhYmFzZVVSTDogXCJodHRwczovLzxPVEhFUl9EQVRBQkFTRV9OQU1FPi5maXJlYmFzZWlvLmNvbVwiLFxuICogICBzdG9yYWdlQnVja2V0OiBcIjxPVEhFUl9TVE9SQUdFX0JVQ0tFVD4uYXBwc3BvdC5jb21cIlxuICogfSwgXCJvdGhlckFwcFwiKTtcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSBvcHRpb25zIC0gT3B0aW9ucyB0byBjb25maWd1cmUgdGhlIGFwcCdzIHNlcnZpY2VzLlxuICogQHBhcmFtIG5hbWUgLSBPcHRpb25hbCBuYW1lIG9mIHRoZSBhcHAgdG8gaW5pdGlhbGl6ZS4gSWYgbm8gbmFtZVxuICogICBpcyBwcm92aWRlZCwgdGhlIGRlZmF1bHQgaXMgYFwiW0RFRkFVTFRdXCJgLlxuICpcbiAqIEByZXR1cm5zIFRoZSBpbml0aWFsaXplZCBhcHAuXG4gKlxuICogQHB1YmxpY1xuICovXG5leHBvcnQgZnVuY3Rpb24gaW5pdGlhbGl6ZUFwcChcbiAgb3B0aW9uczogRmlyZWJhc2VPcHRpb25zLFxuICBuYW1lPzogc3RyaW5nXG4pOiBGaXJlYmFzZUFwcDtcbi8qKlxuICogQ3JlYXRlcyBhbmQgaW5pdGlhbGl6ZXMgYSBGaXJlYmFzZUFwcCBpbnN0YW5jZS5cbiAqXG4gKiBAcGFyYW0gb3B0aW9ucyAtIE9wdGlvbnMgdG8gY29uZmlndXJlIHRoZSBhcHAncyBzZXJ2aWNlcy5cbiAqIEBwYXJhbSBjb25maWcgLSBGaXJlYmFzZUFwcCBDb25maWd1cmF0aW9uXG4gKlxuICogQHB1YmxpY1xuICovXG5leHBvcnQgZnVuY3Rpb24gaW5pdGlhbGl6ZUFwcChcbiAgb3B0aW9uczogRmlyZWJhc2VPcHRpb25zLFxuICBjb25maWc/OiBGaXJlYmFzZUFwcFNldHRpbmdzXG4pOiBGaXJlYmFzZUFwcDtcbi8qKlxuICogQ3JlYXRlcyBhbmQgaW5pdGlhbGl6ZXMgYSBGaXJlYmFzZUFwcCBpbnN0YW5jZS5cbiAqXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbml0aWFsaXplQXBwKCk6IEZpcmViYXNlQXBwO1xuZXhwb3J0IGZ1bmN0aW9uIGluaXRpYWxpemVBcHAoXG4gIF9vcHRpb25zPzogRmlyZWJhc2VPcHRpb25zLFxuICByYXdDb25maWcgPSB7fVxuKTogRmlyZWJhc2VBcHAge1xuICBsZXQgb3B0aW9ucyA9IF9vcHRpb25zO1xuXG4gIGlmICh0eXBlb2YgcmF3Q29uZmlnICE9PSAnb2JqZWN0Jykge1xuICAgIGNvbnN0IG5hbWUgPSByYXdDb25maWc7XG4gICAgcmF3Q29uZmlnID0geyBuYW1lIH07XG4gIH1cblxuICBjb25zdCBjb25maWc6IFJlcXVpcmVkPEZpcmViYXNlQXBwU2V0dGluZ3M+ID0ge1xuICAgIG5hbWU6IERFRkFVTFRfRU5UUllfTkFNRSxcbiAgICBhdXRvbWF0aWNEYXRhQ29sbGVjdGlvbkVuYWJsZWQ6IGZhbHNlLFxuICAgIC4uLnJhd0NvbmZpZ1xuICB9O1xuICBjb25zdCBuYW1lID0gY29uZmlnLm5hbWU7XG5cbiAgaWYgKHR5cGVvZiBuYW1lICE9PSAnc3RyaW5nJyB8fCAhbmFtZSkge1xuICAgIHRocm93IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKEFwcEVycm9yLkJBRF9BUFBfTkFNRSwge1xuICAgICAgYXBwTmFtZTogU3RyaW5nKG5hbWUpXG4gICAgfSk7XG4gIH1cblxuICBvcHRpb25zIHx8PSBnZXREZWZhdWx0QXBwQ29uZmlnKCk7XG5cbiAgaWYgKCFvcHRpb25zKSB7XG4gICAgdGhyb3cgRVJST1JfRkFDVE9SWS5jcmVhdGUoQXBwRXJyb3IuTk9fT1BUSU9OUyk7XG4gIH1cblxuICBjb25zdCBleGlzdGluZ0FwcCA9IF9hcHBzLmdldChuYW1lKSBhcyBGaXJlYmFzZUFwcEltcGw7XG4gIGlmIChleGlzdGluZ0FwcCkge1xuICAgIC8vIHJldHVybiB0aGUgZXhpc3RpbmcgYXBwIGlmIG9wdGlvbnMgYW5kIGNvbmZpZyBkZWVwIGVxdWFsIHRoZSBvbmVzIGluIHRoZSBleGlzdGluZyBhcHAuXG4gICAgaWYgKFxuICAgICAgZGVlcEVxdWFsKG9wdGlvbnMsIGV4aXN0aW5nQXBwLm9wdGlvbnMpICYmXG4gICAgICBkZWVwRXF1YWwoY29uZmlnLCBleGlzdGluZ0FwcC5jb25maWcpXG4gICAgKSB7XG4gICAgICByZXR1cm4gZXhpc3RpbmdBcHA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKEFwcEVycm9yLkRVUExJQ0FURV9BUFAsIHsgYXBwTmFtZTogbmFtZSB9KTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBjb250YWluZXIgPSBuZXcgQ29tcG9uZW50Q29udGFpbmVyKG5hbWUpO1xuICBmb3IgKGNvbnN0IGNvbXBvbmVudCBvZiBfY29tcG9uZW50cy52YWx1ZXMoKSkge1xuICAgIGNvbnRhaW5lci5hZGRDb21wb25lbnQoY29tcG9uZW50KTtcbiAgfVxuXG4gIGNvbnN0IG5ld0FwcCA9IG5ldyBGaXJlYmFzZUFwcEltcGwob3B0aW9ucywgY29uZmlnLCBjb250YWluZXIpO1xuXG4gIF9hcHBzLnNldChuYW1lLCBuZXdBcHApO1xuXG4gIHJldHVybiBuZXdBcHA7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhbmQgaW5pdGlhbGl6ZXMgYSB7QGxpbmsgQGZpcmViYXNlL2FwcCNGaXJlYmFzZVNlcnZlckFwcH0gaW5zdGFuY2UuXG4gKlxuICogVGhlIGBGaXJlYmFzZVNlcnZlckFwcGAgaXMgc2ltaWxhciB0byBgRmlyZWJhc2VBcHBgLCBidXQgaXMgaW50ZW5kZWQgZm9yIGV4ZWN1dGlvbiBpblxuICogc2VydmVyIHNpZGUgcmVuZGVyaW5nIGVudmlyb25tZW50cyBvbmx5LiBJbml0aWFsaXphdGlvbiB3aWxsIGZhaWwgaWYgaW52b2tlZCBmcm9tIGFcbiAqIGJyb3dzZXIgZW52aXJvbm1lbnQuXG4gKlxuICogU2VlXG4gKiB7QGxpbmtcbiAqICAgaHR0cHM6Ly9maXJlYmFzZS5nb29nbGUuY29tL2RvY3Mvd2ViL3NldHVwI2FkZF9maXJlYmFzZV90b195b3VyX2FwcFxuICogICB8IEFkZCBGaXJlYmFzZSB0byB5b3VyIGFwcH0gYW5kXG4gKiB7QGxpbmtcbiAqICAgaHR0cHM6Ly9maXJlYmFzZS5nb29nbGUuY29tL2RvY3Mvd2ViL3NldHVwI211bHRpcGxlLXByb2plY3RzXG4gKiAgIHwgSW5pdGlhbGl6ZSBtdWx0aXBsZSBwcm9qZWN0c30gZm9yIGRldGFpbGVkIGRvY3VtZW50YXRpb24uXG4gKlxuICogQGV4YW1wbGVcbiAqIGBgYGphdmFzY3JpcHRcbiAqXG4gKiAvLyBJbml0aWFsaXplIGFuIGluc3RhbmNlIG9mIGBGaXJlYmFzZVNlcnZlckFwcGAuXG4gKiAvLyBSZXRyaWV2ZSB5b3VyIG93biBvcHRpb25zIHZhbHVlcyBieSBhZGRpbmcgYSB3ZWIgYXBwIG9uXG4gKiAvLyBodHRwczovL2NvbnNvbGUuZmlyZWJhc2UuZ29vZ2xlLmNvbVxuICogaW5pdGlhbGl6ZVNlcnZlckFwcCh7XG4gKiAgICAgYXBpS2V5OiBcIkFJemEuLi4uXCIsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBdXRoIC8gR2VuZXJhbCBVc2VcbiAqICAgICBhdXRoRG9tYWluOiBcIllPVVJfQVBQLmZpcmViYXNlYXBwLmNvbVwiLCAgICAgICAgIC8vIEF1dGggd2l0aCBwb3B1cC9yZWRpcmVjdFxuICogICAgIGRhdGFiYXNlVVJMOiBcImh0dHBzOi8vWU9VUl9BUFAuZmlyZWJhc2Vpby5jb21cIiwgLy8gUmVhbHRpbWUgRGF0YWJhc2VcbiAqICAgICBzdG9yYWdlQnVja2V0OiBcIllPVVJfQVBQLmFwcHNwb3QuY29tXCIsICAgICAgICAgIC8vIFN0b3JhZ2VcbiAqICAgICBtZXNzYWdpbmdTZW5kZXJJZDogXCIxMjM0NTY3ODlcIiAgICAgICAgICAgICAgICAgIC8vIENsb3VkIE1lc3NhZ2luZ1xuICogICB9LFxuICogICB7XG4gKiAgICBhdXRoSWRUb2tlbjogXCJZb3VyIEF1dGggSUQgVG9rZW5cIlxuICogICB9KTtcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSBvcHRpb25zIC0gYEZpcmViYXNlLkFwcE9wdGlvbnNgIHRvIGNvbmZpZ3VyZSB0aGUgYXBwJ3Mgc2VydmljZXMsIG9yIGFcbiAqICAgYSBgRmlyZWJhc2VBcHBgIGluc3RhbmNlIHdoaWNoIGNvbnRhaW5zIHRoZSBgQXBwT3B0aW9uc2Agd2l0aGluLlxuICogQHBhcmFtIGNvbmZpZyAtIGBGaXJlYmFzZVNlcnZlckFwcGAgY29uZmlndXJhdGlvbi5cbiAqXG4gKiBAcmV0dXJucyBUaGUgaW5pdGlhbGl6ZWQgYEZpcmViYXNlU2VydmVyQXBwYC5cbiAqXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbml0aWFsaXplU2VydmVyQXBwKFxuICBvcHRpb25zOiBGaXJlYmFzZU9wdGlvbnMgfCBGaXJlYmFzZUFwcCxcbiAgY29uZmlnOiBGaXJlYmFzZVNlcnZlckFwcFNldHRpbmdzXG4pOiBGaXJlYmFzZVNlcnZlckFwcDtcblxuZXhwb3J0IGZ1bmN0aW9uIGluaXRpYWxpemVTZXJ2ZXJBcHAoXG4gIF9vcHRpb25zOiBGaXJlYmFzZU9wdGlvbnMgfCBGaXJlYmFzZUFwcCxcbiAgX3NlcnZlckFwcENvbmZpZzogRmlyZWJhc2VTZXJ2ZXJBcHBTZXR0aW5nc1xuKTogRmlyZWJhc2VTZXJ2ZXJBcHAge1xuICBpZiAoaXNCcm93c2VyKCkpIHtcbiAgICAvLyBGaXJlYmFzZVNlcnZlckFwcCBpc24ndCBkZXNpZ25lZCB0byBiZSBydW4gaW4gYnJvd3NlcnMuXG4gICAgdGhyb3cgRVJST1JfRkFDVE9SWS5jcmVhdGUoQXBwRXJyb3IuSU5WQUxJRF9TRVJWRVJfQVBQX0VOVklST05NRU5UKTtcbiAgfVxuXG4gIGlmIChfc2VydmVyQXBwQ29uZmlnLmF1dG9tYXRpY0RhdGFDb2xsZWN0aW9uRW5hYmxlZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgX3NlcnZlckFwcENvbmZpZy5hdXRvbWF0aWNEYXRhQ29sbGVjdGlvbkVuYWJsZWQgPSBmYWxzZTtcbiAgfVxuXG4gIGxldCBhcHBPcHRpb25zOiBGaXJlYmFzZU9wdGlvbnM7XG4gIGlmIChfaXNGaXJlYmFzZUFwcChfb3B0aW9ucykpIHtcbiAgICBhcHBPcHRpb25zID0gX29wdGlvbnMub3B0aW9ucztcbiAgfSBlbHNlIHtcbiAgICBhcHBPcHRpb25zID0gX29wdGlvbnM7XG4gIH1cblxuICAvLyBCdWlsZCBhbiBhcHAgbmFtZSBiYXNlZCBvbiBhIGhhc2ggb2YgdGhlIGNvbmZpZ3VyYXRpb24gb3B0aW9ucy5cbiAgY29uc3QgbmFtZU9iaiA9IHtcbiAgICAuLi5fc2VydmVyQXBwQ29uZmlnLFxuICAgIC4uLmFwcE9wdGlvbnNcbiAgfTtcblxuICAvLyBIb3dldmVyLCBEbyBub3QgbWFuZ2xlIHRoZSBuYW1lIGJhc2VkIG9uIHJlbGVhc2VPbkRlcmVmLCBzaW5jZSBpdCB3aWxsIHZhcnkgYmV0d2VlbiB0aGVcbiAgLy8gY29uc3RydWN0aW9uIG9mIEZpcmViYXNlU2VydmVyQXBwIGluc3RhbmNlcy4gRm9yIGV4YW1wbGUsIGlmIHRoZSBvYmplY3QgaXMgdGhlIHJlcXVlc3QgaGVhZGVycy5cbiAgaWYgKG5hbWVPYmoucmVsZWFzZU9uRGVyZWYgIT09IHVuZGVmaW5lZCkge1xuICAgIGRlbGV0ZSBuYW1lT2JqLnJlbGVhc2VPbkRlcmVmO1xuICB9XG5cbiAgY29uc3QgaGFzaENvZGUgPSAoczogc3RyaW5nKTogbnVtYmVyID0+IHtcbiAgICByZXR1cm4gWy4uLnNdLnJlZHVjZShcbiAgICAgIChoYXNoLCBjKSA9PiAoTWF0aC5pbXVsKDMxLCBoYXNoKSArIGMuY2hhckNvZGVBdCgwKSkgfCAwLFxuICAgICAgMFxuICAgICk7XG4gIH07XG5cbiAgaWYgKF9zZXJ2ZXJBcHBDb25maWcucmVsZWFzZU9uRGVyZWYgIT09IHVuZGVmaW5lZCkge1xuICAgIGlmICh0eXBlb2YgRmluYWxpemF0aW9uUmVnaXN0cnkgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aHJvdyBFUlJPUl9GQUNUT1JZLmNyZWF0ZShcbiAgICAgICAgQXBwRXJyb3IuRklOQUxJWkFUSU9OX1JFR0lTVFJZX05PVF9TVVBQT1JURUQsXG4gICAgICAgIHt9XG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IG5hbWVTdHJpbmcgPSAnJyArIGhhc2hDb2RlKEpTT04uc3RyaW5naWZ5KG5hbWVPYmopKTtcbiAgY29uc3QgZXhpc3RpbmdBcHAgPSBfc2VydmVyQXBwcy5nZXQobmFtZVN0cmluZykgYXMgRmlyZWJhc2VTZXJ2ZXJBcHA7XG4gIGlmIChleGlzdGluZ0FwcCkge1xuICAgIChleGlzdGluZ0FwcCBhcyBGaXJlYmFzZVNlcnZlckFwcEltcGwpLmluY1JlZkNvdW50KFxuICAgICAgX3NlcnZlckFwcENvbmZpZy5yZWxlYXNlT25EZXJlZlxuICAgICk7XG4gICAgcmV0dXJuIGV4aXN0aW5nQXBwO1xuICB9XG5cbiAgY29uc3QgY29udGFpbmVyID0gbmV3IENvbXBvbmVudENvbnRhaW5lcihuYW1lU3RyaW5nKTtcbiAgZm9yIChjb25zdCBjb21wb25lbnQgb2YgX2NvbXBvbmVudHMudmFsdWVzKCkpIHtcbiAgICBjb250YWluZXIuYWRkQ29tcG9uZW50KGNvbXBvbmVudCk7XG4gIH1cblxuICBjb25zdCBuZXdBcHAgPSBuZXcgRmlyZWJhc2VTZXJ2ZXJBcHBJbXBsKFxuICAgIGFwcE9wdGlvbnMsXG4gICAgX3NlcnZlckFwcENvbmZpZyxcbiAgICBuYW1lU3RyaW5nLFxuICAgIGNvbnRhaW5lclxuICApO1xuXG4gIF9zZXJ2ZXJBcHBzLnNldChuYW1lU3RyaW5nLCBuZXdBcHApO1xuXG4gIHJldHVybiBuZXdBcHA7XG59XG5cbi8qKlxuICogUmV0cmlldmVzIGEge0BsaW5rIEBmaXJlYmFzZS9hcHAjRmlyZWJhc2VBcHB9IGluc3RhbmNlLlxuICpcbiAqIFdoZW4gY2FsbGVkIHdpdGggbm8gYXJndW1lbnRzLCB0aGUgZGVmYXVsdCBhcHAgaXMgcmV0dXJuZWQuIFdoZW4gYW4gYXBwIG5hbWVcbiAqIGlzIHByb3ZpZGVkLCB0aGUgYXBwIGNvcnJlc3BvbmRpbmcgdG8gdGhhdCBuYW1lIGlzIHJldHVybmVkLlxuICpcbiAqIEFuIGV4Y2VwdGlvbiBpcyB0aHJvd24gaWYgdGhlIGFwcCBiZWluZyByZXRyaWV2ZWQgaGFzIG5vdCB5ZXQgYmVlblxuICogaW5pdGlhbGl6ZWQuXG4gKlxuICogQGV4YW1wbGVcbiAqIGBgYGphdmFzY3JpcHRcbiAqIC8vIFJldHVybiB0aGUgZGVmYXVsdCBhcHBcbiAqIGNvbnN0IGFwcCA9IGdldEFwcCgpO1xuICogYGBgXG4gKlxuICogQGV4YW1wbGVcbiAqIGBgYGphdmFzY3JpcHRcbiAqIC8vIFJldHVybiBhIG5hbWVkIGFwcFxuICogY29uc3Qgb3RoZXJBcHAgPSBnZXRBcHAoXCJvdGhlckFwcFwiKTtcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSBuYW1lIC0gT3B0aW9uYWwgbmFtZSBvZiB0aGUgYXBwIHRvIHJldHVybi4gSWYgbm8gbmFtZSBpc1xuICogICBwcm92aWRlZCwgdGhlIGRlZmF1bHQgaXMgYFwiW0RFRkFVTFRdXCJgLlxuICpcbiAqIEByZXR1cm5zIFRoZSBhcHAgY29ycmVzcG9uZGluZyB0byB0aGUgcHJvdmlkZWQgYXBwIG5hbWUuXG4gKiAgIElmIG5vIGFwcCBuYW1lIGlzIHByb3ZpZGVkLCB0aGUgZGVmYXVsdCBhcHAgaXMgcmV0dXJuZWQuXG4gKlxuICogQHB1YmxpY1xuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0QXBwKG5hbWU6IHN0cmluZyA9IERFRkFVTFRfRU5UUllfTkFNRSk6IEZpcmViYXNlQXBwIHtcbiAgY29uc3QgYXBwID0gX2FwcHMuZ2V0KG5hbWUpO1xuICBpZiAoIWFwcCAmJiBuYW1lID09PSBERUZBVUxUX0VOVFJZX05BTUUgJiYgZ2V0RGVmYXVsdEFwcENvbmZpZygpKSB7XG4gICAgcmV0dXJuIGluaXRpYWxpemVBcHAoKTtcbiAgfVxuICBpZiAoIWFwcCkge1xuICAgIHRocm93IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKEFwcEVycm9yLk5PX0FQUCwgeyBhcHBOYW1lOiBuYW1lIH0pO1xuICB9XG5cbiAgcmV0dXJuIGFwcDtcbn1cblxuLyoqXG4gKiBBIChyZWFkLW9ubHkpIGFycmF5IG9mIGFsbCBpbml0aWFsaXplZCBhcHBzLlxuICogQHB1YmxpY1xuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0QXBwcygpOiBGaXJlYmFzZUFwcFtdIHtcbiAgcmV0dXJuIEFycmF5LmZyb20oX2FwcHMudmFsdWVzKCkpO1xufVxuXG4vKipcbiAqIFJlbmRlcnMgdGhpcyBhcHAgdW51c2FibGUgYW5kIGZyZWVzIHRoZSByZXNvdXJjZXMgb2YgYWxsIGFzc29jaWF0ZWRcbiAqIHNlcnZpY2VzLlxuICpcbiAqIEBleGFtcGxlXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBkZWxldGVBcHAoYXBwKVxuICogICAudGhlbihmdW5jdGlvbigpIHtcbiAqICAgICBjb25zb2xlLmxvZyhcIkFwcCBkZWxldGVkIHN1Y2Nlc3NmdWxseVwiKTtcbiAqICAgfSlcbiAqICAgLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7XG4gKiAgICAgY29uc29sZS5sb2coXCJFcnJvciBkZWxldGluZyBhcHA6XCIsIGVycm9yKTtcbiAqICAgfSk7XG4gKiBgYGBcbiAqXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkZWxldGVBcHAoYXBwOiBGaXJlYmFzZUFwcCk6IFByb21pc2U8dm9pZD4ge1xuICBsZXQgY2xlYW51cFByb3ZpZGVycyA9IGZhbHNlO1xuICBjb25zdCBuYW1lID0gYXBwLm5hbWU7XG4gIGlmIChfYXBwcy5oYXMobmFtZSkpIHtcbiAgICBjbGVhbnVwUHJvdmlkZXJzID0gdHJ1ZTtcbiAgICBfYXBwcy5kZWxldGUobmFtZSk7XG4gIH0gZWxzZSBpZiAoX3NlcnZlckFwcHMuaGFzKG5hbWUpKSB7XG4gICAgY29uc3QgZmlyZWJhc2VTZXJ2ZXJBcHAgPSBhcHAgYXMgRmlyZWJhc2VTZXJ2ZXJBcHBJbXBsO1xuICAgIGlmIChmaXJlYmFzZVNlcnZlckFwcC5kZWNSZWZDb3VudCgpIDw9IDApIHtcbiAgICAgIF9zZXJ2ZXJBcHBzLmRlbGV0ZShuYW1lKTtcbiAgICAgIGNsZWFudXBQcm92aWRlcnMgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIGlmIChjbGVhbnVwUHJvdmlkZXJzKSB7XG4gICAgYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAoYXBwIGFzIEZpcmViYXNlQXBwSW1wbCkuY29udGFpbmVyXG4gICAgICAgIC5nZXRQcm92aWRlcnMoKVxuICAgICAgICAubWFwKHByb3ZpZGVyID0+IHByb3ZpZGVyLmRlbGV0ZSgpKVxuICAgICk7XG4gICAgKGFwcCBhcyBGaXJlYmFzZUFwcEltcGwpLmlzRGVsZXRlZCA9IHRydWU7XG4gIH1cbn1cblxuLyoqXG4gKiBSZWdpc3RlcnMgYSBsaWJyYXJ5J3MgbmFtZSBhbmQgdmVyc2lvbiBmb3IgcGxhdGZvcm0gbG9nZ2luZyBwdXJwb3Nlcy5cbiAqIEBwYXJhbSBsaWJyYXJ5IC0gTmFtZSBvZiAxcCBvciAzcCBsaWJyYXJ5IChlLmcuIGZpcmVzdG9yZSwgYW5ndWxhcmZpcmUpXG4gKiBAcGFyYW0gdmVyc2lvbiAtIEN1cnJlbnQgdmVyc2lvbiBvZiB0aGF0IGxpYnJhcnkuXG4gKiBAcGFyYW0gdmFyaWFudCAtIEJ1bmRsZSB2YXJpYW50LCBlLmcuLCBub2RlLCBybiwgZXRjLlxuICpcbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdGVyVmVyc2lvbihcbiAgbGlicmFyeUtleU9yTmFtZTogc3RyaW5nLFxuICB2ZXJzaW9uOiBzdHJpbmcsXG4gIHZhcmlhbnQ/OiBzdHJpbmdcbik6IHZvaWQge1xuICAvLyBUT0RPOiBXZSBjYW4gdXNlIHRoaXMgY2hlY2sgdG8gd2hpdGVsaXN0IHN0cmluZ3Mgd2hlbi9pZiB3ZSBzZXQgdXBcbiAgLy8gYSBnb29kIHdoaXRlbGlzdCBzeXN0ZW0uXG4gIGxldCBsaWJyYXJ5ID0gUExBVEZPUk1fTE9HX1NUUklOR1tsaWJyYXJ5S2V5T3JOYW1lXSA/PyBsaWJyYXJ5S2V5T3JOYW1lO1xuICBpZiAodmFyaWFudCkge1xuICAgIGxpYnJhcnkgKz0gYC0ke3ZhcmlhbnR9YDtcbiAgfVxuICBjb25zdCBsaWJyYXJ5TWlzbWF0Y2ggPSBsaWJyYXJ5Lm1hdGNoKC9cXHN8XFwvLyk7XG4gIGNvbnN0IHZlcnNpb25NaXNtYXRjaCA9IHZlcnNpb24ubWF0Y2goL1xcc3xcXC8vKTtcbiAgaWYgKGxpYnJhcnlNaXNtYXRjaCB8fCB2ZXJzaW9uTWlzbWF0Y2gpIHtcbiAgICBjb25zdCB3YXJuaW5nID0gW1xuICAgICAgYFVuYWJsZSB0byByZWdpc3RlciBsaWJyYXJ5IFwiJHtsaWJyYXJ5fVwiIHdpdGggdmVyc2lvbiBcIiR7dmVyc2lvbn1cIjpgXG4gICAgXTtcbiAgICBpZiAobGlicmFyeU1pc21hdGNoKSB7XG4gICAgICB3YXJuaW5nLnB1c2goXG4gICAgICAgIGBsaWJyYXJ5IG5hbWUgXCIke2xpYnJhcnl9XCIgY29udGFpbnMgaWxsZWdhbCBjaGFyYWN0ZXJzICh3aGl0ZXNwYWNlIG9yIFwiL1wiKWBcbiAgICAgICk7XG4gICAgfVxuICAgIGlmIChsaWJyYXJ5TWlzbWF0Y2ggJiYgdmVyc2lvbk1pc21hdGNoKSB7XG4gICAgICB3YXJuaW5nLnB1c2goJ2FuZCcpO1xuICAgIH1cbiAgICBpZiAodmVyc2lvbk1pc21hdGNoKSB7XG4gICAgICB3YXJuaW5nLnB1c2goXG4gICAgICAgIGB2ZXJzaW9uIG5hbWUgXCIke3ZlcnNpb259XCIgY29udGFpbnMgaWxsZWdhbCBjaGFyYWN0ZXJzICh3aGl0ZXNwYWNlIG9yIFwiL1wiKWBcbiAgICAgICk7XG4gICAgfVxuICAgIGxvZ2dlci53YXJuKHdhcm5pbmcuam9pbignICcpKTtcbiAgICByZXR1cm47XG4gIH1cbiAgX3JlZ2lzdGVyQ29tcG9uZW50KFxuICAgIG5ldyBDb21wb25lbnQoXG4gICAgICBgJHtsaWJyYXJ5fS12ZXJzaW9uYCBhcyBOYW1lLFxuICAgICAgKCkgPT4gKHsgbGlicmFyeSwgdmVyc2lvbiB9KSxcbiAgICAgIENvbXBvbmVudFR5cGUuVkVSU0lPTlxuICAgIClcbiAgKTtcbn1cblxuLyoqXG4gKiBTZXRzIGxvZyBoYW5kbGVyIGZvciBhbGwgRmlyZWJhc2UgU0RLcy5cbiAqIEBwYXJhbSBsb2dDYWxsYmFjayAtIEFuIG9wdGlvbmFsIGN1c3RvbSBsb2cgaGFuZGxlciB0aGF0IGV4ZWN1dGVzIHVzZXIgY29kZSB3aGVuZXZlclxuICogdGhlIEZpcmViYXNlIFNESyBtYWtlcyBhIGxvZ2dpbmcgY2FsbC5cbiAqXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBvbkxvZyhcbiAgbG9nQ2FsbGJhY2s6IExvZ0NhbGxiYWNrIHwgbnVsbCxcbiAgb3B0aW9ucz86IExvZ09wdGlvbnNcbik6IHZvaWQge1xuICBpZiAobG9nQ2FsbGJhY2sgIT09IG51bGwgJiYgdHlwZW9mIGxvZ0NhbGxiYWNrICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgRVJST1JfRkFDVE9SWS5jcmVhdGUoQXBwRXJyb3IuSU5WQUxJRF9MT0dfQVJHVU1FTlQpO1xuICB9XG4gIHNldFVzZXJMb2dIYW5kbGVyKGxvZ0NhbGxiYWNrLCBvcHRpb25zKTtcbn1cblxuLyoqXG4gKiBTZXRzIGxvZyBsZXZlbCBmb3IgYWxsIEZpcmViYXNlIFNES3MuXG4gKlxuICogQWxsIG9mIHRoZSBsb2cgdHlwZXMgYWJvdmUgdGhlIGN1cnJlbnQgbG9nIGxldmVsIGFyZSBjYXB0dXJlZCAoaS5lLiBpZlxuICogeW91IHNldCB0aGUgbG9nIGxldmVsIHRvIGBpbmZvYCwgZXJyb3JzIGFyZSBsb2dnZWQsIGJ1dCBgZGVidWdgIGFuZFxuICogYHZlcmJvc2VgIGxvZ3MgYXJlIG5vdCkuXG4gKlxuICogQHB1YmxpY1xuICovXG5leHBvcnQgZnVuY3Rpb24gc2V0TG9nTGV2ZWwobG9nTGV2ZWw6IExvZ0xldmVsU3RyaW5nKTogdm9pZCB7XG4gIHNldExvZ0xldmVsSW1wbChsb2dMZXZlbCk7XG59XG4iLCAiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjEgR29vZ2xlIExMQ1xuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgRmlyZWJhc2VFcnJvciB9IGZyb20gJ0BmaXJlYmFzZS91dGlsJztcbmltcG9ydCB7IERCU2NoZW1hLCBvcGVuREIsIElEQlBEYXRhYmFzZSB9IGZyb20gJ2lkYic7XG5pbXBvcnQgeyBBcHBFcnJvciwgRVJST1JfRkFDVE9SWSB9IGZyb20gJy4vZXJyb3JzJztcbmltcG9ydCB7IEZpcmViYXNlQXBwIH0gZnJvbSAnLi9wdWJsaWMtdHlwZXMnO1xuaW1wb3J0IHsgSGVhcnRiZWF0c0luSW5kZXhlZERCIH0gZnJvbSAnLi90eXBlcyc7XG5pbXBvcnQgeyBsb2dnZXIgfSBmcm9tICcuL2xvZ2dlcic7XG5cbmNvbnN0IERCX05BTUUgPSAnZmlyZWJhc2UtaGVhcnRiZWF0LWRhdGFiYXNlJztcbmNvbnN0IERCX1ZFUlNJT04gPSAxO1xuY29uc3QgU1RPUkVfTkFNRSA9ICdmaXJlYmFzZS1oZWFydGJlYXQtc3RvcmUnO1xuXG5pbnRlcmZhY2UgQXBwREIgZXh0ZW5kcyBEQlNjaGVtYSB7XG4gICdmaXJlYmFzZS1oZWFydGJlYXQtc3RvcmUnOiB7XG4gICAga2V5OiBzdHJpbmc7XG4gICAgdmFsdWU6IEhlYXJ0YmVhdHNJbkluZGV4ZWREQjtcbiAgfTtcbn1cblxubGV0IGRiUHJvbWlzZTogUHJvbWlzZTxJREJQRGF0YWJhc2U8QXBwREI+PiB8IG51bGwgPSBudWxsO1xuZnVuY3Rpb24gZ2V0RGJQcm9taXNlKCk6IFByb21pc2U8SURCUERhdGFiYXNlPEFwcERCPj4ge1xuICBpZiAoIWRiUHJvbWlzZSkge1xuICAgIGRiUHJvbWlzZSA9IG9wZW5EQjxBcHBEQj4oREJfTkFNRSwgREJfVkVSU0lPTiwge1xuICAgICAgdXBncmFkZTogKGRiLCBvbGRWZXJzaW9uKSA9PiB7XG4gICAgICAgIC8vIFdlIGRvbid0IHVzZSAnYnJlYWsnIGluIHRoaXMgc3dpdGNoIHN0YXRlbWVudCwgdGhlIGZhbGwtdGhyb3VnaFxuICAgICAgICAvLyBiZWhhdmlvciBpcyB3aGF0IHdlIHdhbnQsIGJlY2F1c2UgaWYgdGhlcmUgYXJlIG11bHRpcGxlIHZlcnNpb25zIGJldHdlZW5cbiAgICAgICAgLy8gdGhlIG9sZCB2ZXJzaW9uIGFuZCB0aGUgY3VycmVudCB2ZXJzaW9uLCB3ZSB3YW50IEFMTCB0aGUgbWlncmF0aW9uc1xuICAgICAgICAvLyB0aGF0IGNvcnJlc3BvbmQgdG8gdGhvc2UgdmVyc2lvbnMgdG8gcnVuLCBub3Qgb25seSB0aGUgbGFzdCBvbmUuXG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBkZWZhdWx0LWNhc2VcbiAgICAgICAgc3dpdGNoIChvbGRWZXJzaW9uKSB7XG4gICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgZGIuY3JlYXRlT2JqZWN0U3RvcmUoU1RPUkVfTkFNRSk7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgIC8vIFNhZmFyaS9pT1MgYnJvd3NlcnMgdGhyb3cgb2NjYXNpb25hbCBleGNlcHRpb25zIG9uXG4gICAgICAgICAgICAgIC8vIGRiLmNyZWF0ZU9iamVjdFN0b3JlKCkgdGhhdCBtYXkgYmUgYSBidWcuIEF2b2lkIGJsb2NraW5nXG4gICAgICAgICAgICAgIC8vIHRoZSByZXN0IG9mIHRoZSBhcHAgZnVuY3Rpb25hbGl0eS5cbiAgICAgICAgICAgICAgY29uc29sZS53YXJuKGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSkuY2F0Y2goZSA9PiB7XG4gICAgICB0aHJvdyBFUlJPUl9GQUNUT1JZLmNyZWF0ZShBcHBFcnJvci5JREJfT1BFTiwge1xuICAgICAgICBvcmlnaW5hbEVycm9yTWVzc2FnZTogZS5tZXNzYWdlXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuICByZXR1cm4gZGJQcm9taXNlO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVhZEhlYXJ0YmVhdHNGcm9tSW5kZXhlZERCKFxuICBhcHA6IEZpcmViYXNlQXBwXG4pOiBQcm9taXNlPEhlYXJ0YmVhdHNJbkluZGV4ZWREQiB8IHVuZGVmaW5lZD4ge1xuICB0cnkge1xuICAgIGNvbnN0IGRiID0gYXdhaXQgZ2V0RGJQcm9taXNlKCk7XG4gICAgY29uc3QgdHggPSBkYi50cmFuc2FjdGlvbihTVE9SRV9OQU1FKTtcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCB0eC5vYmplY3RTdG9yZShTVE9SRV9OQU1FKS5nZXQoY29tcHV0ZUtleShhcHApKTtcbiAgICAvLyBXZSBhbHJlYWR5IGhhdmUgdGhlIHZhbHVlIGJ1dCB0eC5kb25lIGNhbiB0aHJvdyxcbiAgICAvLyBzbyB3ZSBuZWVkIHRvIGF3YWl0IGl0IGhlcmUgdG8gY2F0Y2ggZXJyb3JzXG4gICAgYXdhaXQgdHguZG9uZTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9IGNhdGNoIChlKSB7XG4gICAgaWYgKGUgaW5zdGFuY2VvZiBGaXJlYmFzZUVycm9yKSB7XG4gICAgICBsb2dnZXIud2FybihlLm1lc3NhZ2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBpZGJHZXRFcnJvciA9IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKEFwcEVycm9yLklEQl9HRVQsIHtcbiAgICAgICAgb3JpZ2luYWxFcnJvck1lc3NhZ2U6IChlIGFzIEVycm9yKT8ubWVzc2FnZVxuICAgICAgfSk7XG4gICAgICBsb2dnZXIud2FybihpZGJHZXRFcnJvci5tZXNzYWdlKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHdyaXRlSGVhcnRiZWF0c1RvSW5kZXhlZERCKFxuICBhcHA6IEZpcmViYXNlQXBwLFxuICBoZWFydGJlYXRPYmplY3Q6IEhlYXJ0YmVhdHNJbkluZGV4ZWREQlxuKTogUHJvbWlzZTx2b2lkPiB7XG4gIHRyeSB7XG4gICAgY29uc3QgZGIgPSBhd2FpdCBnZXREYlByb21pc2UoKTtcbiAgICBjb25zdCB0eCA9IGRiLnRyYW5zYWN0aW9uKFNUT1JFX05BTUUsICdyZWFkd3JpdGUnKTtcbiAgICBjb25zdCBvYmplY3RTdG9yZSA9IHR4Lm9iamVjdFN0b3JlKFNUT1JFX05BTUUpO1xuICAgIGF3YWl0IG9iamVjdFN0b3JlLnB1dChoZWFydGJlYXRPYmplY3QsIGNvbXB1dGVLZXkoYXBwKSk7XG4gICAgYXdhaXQgdHguZG9uZTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGlmIChlIGluc3RhbmNlb2YgRmlyZWJhc2VFcnJvcikge1xuICAgICAgbG9nZ2VyLndhcm4oZS5tZXNzYWdlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgaWRiR2V0RXJyb3IgPSBFUlJPUl9GQUNUT1JZLmNyZWF0ZShBcHBFcnJvci5JREJfV1JJVEUsIHtcbiAgICAgICAgb3JpZ2luYWxFcnJvck1lc3NhZ2U6IChlIGFzIEVycm9yKT8ubWVzc2FnZVxuICAgICAgfSk7XG4gICAgICBsb2dnZXIud2FybihpZGJHZXRFcnJvci5tZXNzYWdlKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gY29tcHV0ZUtleShhcHA6IEZpcmViYXNlQXBwKTogc3RyaW5nIHtcbiAgcmV0dXJuIGAke2FwcC5uYW1lfSEke2FwcC5vcHRpb25zLmFwcElkfWA7XG59XG4iLCAiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjEgR29vZ2xlIExMQ1xuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgQ29tcG9uZW50Q29udGFpbmVyIH0gZnJvbSAnQGZpcmViYXNlL2NvbXBvbmVudCc7XG5pbXBvcnQge1xuICBiYXNlNjR1cmxFbmNvZGVXaXRob3V0UGFkZGluZyxcbiAgaXNJbmRleGVkREJBdmFpbGFibGUsXG4gIHZhbGlkYXRlSW5kZXhlZERCT3BlbmFibGVcbn0gZnJvbSAnQGZpcmViYXNlL3V0aWwnO1xuaW1wb3J0IHtcbiAgcmVhZEhlYXJ0YmVhdHNGcm9tSW5kZXhlZERCLFxuICB3cml0ZUhlYXJ0YmVhdHNUb0luZGV4ZWREQlxufSBmcm9tICcuL2luZGV4ZWRkYic7XG5pbXBvcnQgeyBGaXJlYmFzZUFwcCB9IGZyb20gJy4vcHVibGljLXR5cGVzJztcbmltcG9ydCB7XG4gIEhlYXJ0YmVhdHNCeVVzZXJBZ2VudCxcbiAgSGVhcnRiZWF0U2VydmljZSxcbiAgSGVhcnRiZWF0c0luSW5kZXhlZERCLFxuICBIZWFydGJlYXRTdG9yYWdlLFxuICBTaW5nbGVEYXRlSGVhcnRiZWF0XG59IGZyb20gJy4vdHlwZXMnO1xuXG5jb25zdCBNQVhfSEVBREVSX0JZVEVTID0gMTAyNDtcbi8vIDMwIGRheXNcbmNvbnN0IFNUT1JFRF9IRUFSVEJFQVRfUkVURU5USU9OX01BWF9NSUxMSVMgPSAzMCAqIDI0ICogNjAgKiA2MCAqIDEwMDA7XG5cbmV4cG9ydCBjbGFzcyBIZWFydGJlYXRTZXJ2aWNlSW1wbCBpbXBsZW1lbnRzIEhlYXJ0YmVhdFNlcnZpY2Uge1xuICAvKipcbiAgICogVGhlIHBlcnNpc3RlbmNlIGxheWVyIGZvciBoZWFydGJlYXRzXG4gICAqIExlYXZlIHB1YmxpYyBmb3IgZWFzaWVyIHRlc3RpbmcuXG4gICAqL1xuICBfc3RvcmFnZTogSGVhcnRiZWF0U3RvcmFnZUltcGw7XG5cbiAgLyoqXG4gICAqIEluLW1lbW9yeSBjYWNoZSBmb3IgaGVhcnRiZWF0cywgdXNlZCBieSBnZXRIZWFydGJlYXRzSGVhZGVyKCkgdG8gZ2VuZXJhdGVcbiAgICogdGhlIGhlYWRlciBzdHJpbmcuXG4gICAqIFN0b3JlcyBvbmUgcmVjb3JkIHBlciBkYXRlLiBUaGlzIHdpbGwgYmUgY29uc29saWRhdGVkIGludG8gdGhlIHN0YW5kYXJkXG4gICAqIGZvcm1hdCBvZiBvbmUgcmVjb3JkIHBlciB1c2VyIGFnZW50IHN0cmluZyBiZWZvcmUgYmVpbmcgc2VudCBhcyBhIGhlYWRlci5cbiAgICogUG9wdWxhdGVkIGZyb20gaW5kZXhlZERCIHdoZW4gdGhlIGNvbnRyb2xsZXIgaXMgaW5zdGFudGlhdGVkIGFuZCBzaG91bGRcbiAgICogYmUga2VwdCBpbiBzeW5jIHdpdGggaW5kZXhlZERCLlxuICAgKiBMZWF2ZSBwdWJsaWMgZm9yIGVhc2llciB0ZXN0aW5nLlxuICAgKi9cbiAgX2hlYXJ0YmVhdHNDYWNoZTogSGVhcnRiZWF0c0luSW5kZXhlZERCIHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqXG4gICAqIHRoZSBpbml0aWFsaXphdGlvbiBwcm9taXNlIGZvciBwb3B1bGF0aW5nIGhlYXJ0YmVhdENhY2hlLlxuICAgKiBJZiBnZXRIZWFydGJlYXRzSGVhZGVyKCkgaXMgY2FsbGVkIGJlZm9yZSB0aGUgcHJvbWlzZSByZXNvbHZlc1xuICAgKiAoaGVhcmJlYXRzQ2FjaGUgPT0gbnVsbCksIGl0IHNob3VsZCB3YWl0IGZvciB0aGlzIHByb21pc2VcbiAgICogTGVhdmUgcHVibGljIGZvciBlYXNpZXIgdGVzdGluZy5cbiAgICovXG4gIF9oZWFydGJlYXRzQ2FjaGVQcm9taXNlOiBQcm9taXNlPEhlYXJ0YmVhdHNJbkluZGV4ZWREQj47XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgY29udGFpbmVyOiBDb21wb25lbnRDb250YWluZXIpIHtcbiAgICBjb25zdCBhcHAgPSB0aGlzLmNvbnRhaW5lci5nZXRQcm92aWRlcignYXBwJykuZ2V0SW1tZWRpYXRlKCk7XG4gICAgdGhpcy5fc3RvcmFnZSA9IG5ldyBIZWFydGJlYXRTdG9yYWdlSW1wbChhcHApO1xuICAgIHRoaXMuX2hlYXJ0YmVhdHNDYWNoZVByb21pc2UgPSB0aGlzLl9zdG9yYWdlLnJlYWQoKS50aGVuKHJlc3VsdCA9PiB7XG4gICAgICB0aGlzLl9oZWFydGJlYXRzQ2FjaGUgPSByZXN1bHQ7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB0byByZXBvcnQgYSBoZWFydGJlYXQuIFRoZSBmdW5jdGlvbiB3aWxsIGdlbmVyYXRlXG4gICAqIGEgSGVhcnRiZWF0c0J5VXNlckFnZW50IG9iamVjdCwgdXBkYXRlIGhlYXJ0YmVhdHNDYWNoZSwgYW5kIHBlcnNpc3QgaXRcbiAgICogdG8gSW5kZXhlZERCLlxuICAgKiBOb3RlIHRoYXQgd2Ugb25seSBzdG9yZSBvbmUgaGVhcnRiZWF0IHBlciBkYXkuIFNvIGlmIGEgaGVhcnRiZWF0IGZvciB0b2RheSBpc1xuICAgKiBhbHJlYWR5IGxvZ2dlZCwgc3Vic2VxdWVudCBjYWxscyB0byB0aGlzIGZ1bmN0aW9uIGluIHRoZSBzYW1lIGRheSB3aWxsIGJlIGlnbm9yZWQuXG4gICAqL1xuICBhc3luYyB0cmlnZ2VySGVhcnRiZWF0KCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHBsYXRmb3JtTG9nZ2VyID0gdGhpcy5jb250YWluZXJcbiAgICAgIC5nZXRQcm92aWRlcigncGxhdGZvcm0tbG9nZ2VyJylcbiAgICAgIC5nZXRJbW1lZGlhdGUoKTtcblxuICAgIC8vIFRoaXMgaXMgdGhlIFwiRmlyZWJhc2UgdXNlciBhZ2VudFwiIHN0cmluZyBmcm9tIHRoZSBwbGF0Zm9ybSBsb2dnZXJcbiAgICAvLyBzZXJ2aWNlLCBub3QgdGhlIGJyb3dzZXIgdXNlciBhZ2VudC5cbiAgICBjb25zdCBhZ2VudCA9IHBsYXRmb3JtTG9nZ2VyLmdldFBsYXRmb3JtSW5mb1N0cmluZygpO1xuICAgIGNvbnN0IGRhdGUgPSBnZXRVVENEYXRlU3RyaW5nKCk7XG4gICAgaWYgKHRoaXMuX2hlYXJ0YmVhdHNDYWNoZT8uaGVhcnRiZWF0cyA9PSBudWxsKSB7XG4gICAgICB0aGlzLl9oZWFydGJlYXRzQ2FjaGUgPSBhd2FpdCB0aGlzLl9oZWFydGJlYXRzQ2FjaGVQcm9taXNlO1xuICAgICAgLy8gSWYgd2UgZmFpbGVkIHRvIGNvbnN0cnVjdCBhIGhlYXJ0YmVhdHMgY2FjaGUsIHRoZW4gcmV0dXJuIGltbWVkaWF0ZWx5LlxuICAgICAgaWYgKHRoaXMuX2hlYXJ0YmVhdHNDYWNoZT8uaGVhcnRiZWF0cyA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gRG8gbm90IHN0b3JlIGEgaGVhcnRiZWF0IGlmIG9uZSBpcyBhbHJlYWR5IHN0b3JlZCBmb3IgdGhpcyBkYXlcbiAgICAvLyBvciBpZiBhIGhlYWRlciBoYXMgYWxyZWFkeSBiZWVuIHNlbnQgdG9kYXkuXG4gICAgaWYgKFxuICAgICAgdGhpcy5faGVhcnRiZWF0c0NhY2hlLmxhc3RTZW50SGVhcnRiZWF0RGF0ZSA9PT0gZGF0ZSB8fFxuICAgICAgdGhpcy5faGVhcnRiZWF0c0NhY2hlLmhlYXJ0YmVhdHMuc29tZShcbiAgICAgICAgc2luZ2xlRGF0ZUhlYXJ0YmVhdCA9PiBzaW5nbGVEYXRlSGVhcnRiZWF0LmRhdGUgPT09IGRhdGVcbiAgICAgIClcbiAgICApIHtcbiAgICAgIHJldHVybjtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVGhlcmUgaXMgbm8gZW50cnkgZm9yIHRoaXMgZGF0ZS4gQ3JlYXRlIG9uZS5cbiAgICAgIHRoaXMuX2hlYXJ0YmVhdHNDYWNoZS5oZWFydGJlYXRzLnB1c2goeyBkYXRlLCBhZ2VudCB9KTtcbiAgICB9XG4gICAgLy8gUmVtb3ZlIGVudHJpZXMgb2xkZXIgdGhhbiAzMCBkYXlzLlxuICAgIHRoaXMuX2hlYXJ0YmVhdHNDYWNoZS5oZWFydGJlYXRzID0gdGhpcy5faGVhcnRiZWF0c0NhY2hlLmhlYXJ0YmVhdHMuZmlsdGVyKFxuICAgICAgc2luZ2xlRGF0ZUhlYXJ0YmVhdCA9PiB7XG4gICAgICAgIGNvbnN0IGhiVGltZXN0YW1wID0gbmV3IERhdGUoc2luZ2xlRGF0ZUhlYXJ0YmVhdC5kYXRlKS52YWx1ZU9mKCk7XG4gICAgICAgIGNvbnN0IG5vdyA9IERhdGUubm93KCk7XG4gICAgICAgIHJldHVybiBub3cgLSBoYlRpbWVzdGFtcCA8PSBTVE9SRURfSEVBUlRCRUFUX1JFVEVOVElPTl9NQVhfTUlMTElTO1xuICAgICAgfVxuICAgICk7XG4gICAgcmV0dXJuIHRoaXMuX3N0b3JhZ2Uub3ZlcndyaXRlKHRoaXMuX2hlYXJ0YmVhdHNDYWNoZSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIGJhc2U2NCBlbmNvZGVkIHN0cmluZyB3aGljaCBjYW4gYmUgYXR0YWNoZWQgdG8gdGhlIGhlYXJ0YmVhdC1zcGVjaWZpYyBoZWFkZXIgZGlyZWN0bHkuXG4gICAqIEl0IGFsc28gY2xlYXJzIGFsbCBoZWFydGJlYXRzIGZyb20gbWVtb3J5IGFzIHdlbGwgYXMgaW4gSW5kZXhlZERCLlxuICAgKlxuICAgKiBOT1RFOiBDb25zdW1pbmcgcHJvZHVjdCBTREtzIHNob3VsZCBub3Qgc2VuZCB0aGUgaGVhZGVyIGlmIHRoaXMgbWV0aG9kXG4gICAqIHJldHVybnMgYW4gZW1wdHkgc3RyaW5nLlxuICAgKi9cbiAgYXN5bmMgZ2V0SGVhcnRiZWF0c0hlYWRlcigpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIGlmICh0aGlzLl9oZWFydGJlYXRzQ2FjaGUgPT09IG51bGwpIHtcbiAgICAgIGF3YWl0IHRoaXMuX2hlYXJ0YmVhdHNDYWNoZVByb21pc2U7XG4gICAgfVxuICAgIC8vIElmIGl0J3Mgc3RpbGwgbnVsbCBvciB0aGUgYXJyYXkgaXMgZW1wdHksIHRoZXJlIGlzIG5vIGRhdGEgdG8gc2VuZC5cbiAgICBpZiAoXG4gICAgICB0aGlzLl9oZWFydGJlYXRzQ2FjaGU/LmhlYXJ0YmVhdHMgPT0gbnVsbCB8fFxuICAgICAgdGhpcy5faGVhcnRiZWF0c0NhY2hlLmhlYXJ0YmVhdHMubGVuZ3RoID09PSAwXG4gICAgKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIGNvbnN0IGRhdGUgPSBnZXRVVENEYXRlU3RyaW5nKCk7XG4gICAgLy8gRXh0cmFjdCBhcyBtYW55IGhlYXJ0YmVhdHMgZnJvbSB0aGUgY2FjaGUgYXMgd2lsbCBmaXQgdW5kZXIgdGhlIHNpemUgbGltaXQuXG4gICAgY29uc3QgeyBoZWFydGJlYXRzVG9TZW5kLCB1bnNlbnRFbnRyaWVzIH0gPSBleHRyYWN0SGVhcnRiZWF0c0ZvckhlYWRlcihcbiAgICAgIHRoaXMuX2hlYXJ0YmVhdHNDYWNoZS5oZWFydGJlYXRzXG4gICAgKTtcbiAgICBjb25zdCBoZWFkZXJTdHJpbmcgPSBiYXNlNjR1cmxFbmNvZGVXaXRob3V0UGFkZGluZyhcbiAgICAgIEpTT04uc3RyaW5naWZ5KHsgdmVyc2lvbjogMiwgaGVhcnRiZWF0czogaGVhcnRiZWF0c1RvU2VuZCB9KVxuICAgICk7XG4gICAgLy8gU3RvcmUgbGFzdCBzZW50IGRhdGUgdG8gcHJldmVudCBhbm90aGVyIGJlaW5nIGxvZ2dlZC9zZW50IGZvciB0aGUgc2FtZSBkYXkuXG4gICAgdGhpcy5faGVhcnRiZWF0c0NhY2hlLmxhc3RTZW50SGVhcnRiZWF0RGF0ZSA9IGRhdGU7XG4gICAgaWYgKHVuc2VudEVudHJpZXMubGVuZ3RoID4gMCkge1xuICAgICAgLy8gU3RvcmUgYW55IHVuc2VudCBlbnRyaWVzIGlmIHRoZXkgZXhpc3QuXG4gICAgICB0aGlzLl9oZWFydGJlYXRzQ2FjaGUuaGVhcnRiZWF0cyA9IHVuc2VudEVudHJpZXM7XG4gICAgICAvLyBUaGlzIHNlZW1zIG1vcmUgbGlrZWx5IHRoYW4gZW1wdHlpbmcgdGhlIGFycmF5IChiZWxvdykgdG8gbGVhZCB0byBzb21lIG9kZCBzdGF0ZVxuICAgICAgLy8gc2luY2UgdGhlIGNhY2hlIGlzbid0IGVtcHR5IGFuZCB0aGlzIHdpbGwgYmUgY2FsbGVkIGFnYWluIG9uIHRoZSBuZXh0IHJlcXVlc3QsXG4gICAgICAvLyBhbmQgaXMgcHJvYmFibHkgc2FmZXN0IGlmIHdlIGF3YWl0IGl0LlxuICAgICAgYXdhaXQgdGhpcy5fc3RvcmFnZS5vdmVyd3JpdGUodGhpcy5faGVhcnRiZWF0c0NhY2hlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5faGVhcnRiZWF0c0NhY2hlLmhlYXJ0YmVhdHMgPSBbXTtcbiAgICAgIC8vIERvIG5vdCB3YWl0IGZvciB0aGlzLCB0byByZWR1Y2UgbGF0ZW5jeS5cbiAgICAgIHZvaWQgdGhpcy5fc3RvcmFnZS5vdmVyd3JpdGUodGhpcy5faGVhcnRiZWF0c0NhY2hlKTtcbiAgICB9XG4gICAgcmV0dXJuIGhlYWRlclN0cmluZztcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRVVENEYXRlU3RyaW5nKCk6IHN0cmluZyB7XG4gIGNvbnN0IHRvZGF5ID0gbmV3IERhdGUoKTtcbiAgLy8gUmV0dXJucyBkYXRlIGZvcm1hdCAnWVlZWS1NTS1ERCdcbiAgcmV0dXJuIHRvZGF5LnRvSVNPU3RyaW5nKCkuc3Vic3RyaW5nKDAsIDEwKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGV4dHJhY3RIZWFydGJlYXRzRm9ySGVhZGVyKFxuICBoZWFydGJlYXRzQ2FjaGU6IFNpbmdsZURhdGVIZWFydGJlYXRbXSxcbiAgbWF4U2l6ZSA9IE1BWF9IRUFERVJfQllURVNcbik6IHtcbiAgaGVhcnRiZWF0c1RvU2VuZDogSGVhcnRiZWF0c0J5VXNlckFnZW50W107XG4gIHVuc2VudEVudHJpZXM6IFNpbmdsZURhdGVIZWFydGJlYXRbXTtcbn0ge1xuICAvLyBIZWFydGJlYXRzIGdyb3VwZWQgYnkgdXNlciBhZ2VudCBpbiB0aGUgc3RhbmRhcmQgZm9ybWF0IHRvIGJlIHNlbnQgaW5cbiAgLy8gdGhlIGhlYWRlci5cbiAgY29uc3QgaGVhcnRiZWF0c1RvU2VuZDogSGVhcnRiZWF0c0J5VXNlckFnZW50W10gPSBbXTtcbiAgLy8gU2luZ2xlIGRhdGUgZm9ybWF0IGhlYXJ0YmVhdHMgdGhhdCBhcmUgbm90IHNlbnQuXG4gIGxldCB1bnNlbnRFbnRyaWVzID0gaGVhcnRiZWF0c0NhY2hlLnNsaWNlKCk7XG4gIGZvciAoY29uc3Qgc2luZ2xlRGF0ZUhlYXJ0YmVhdCBvZiBoZWFydGJlYXRzQ2FjaGUpIHtcbiAgICAvLyBMb29rIGZvciBhbiBleGlzdGluZyBlbnRyeSB3aXRoIHRoZSBzYW1lIHVzZXIgYWdlbnQuXG4gICAgY29uc3QgaGVhcnRiZWF0RW50cnkgPSBoZWFydGJlYXRzVG9TZW5kLmZpbmQoXG4gICAgICBoYiA9PiBoYi5hZ2VudCA9PT0gc2luZ2xlRGF0ZUhlYXJ0YmVhdC5hZ2VudFxuICAgICk7XG4gICAgaWYgKCFoZWFydGJlYXRFbnRyeSkge1xuICAgICAgLy8gSWYgbm8gZW50cnkgZm9yIHRoaXMgdXNlciBhZ2VudCBleGlzdHMsIGNyZWF0ZSBvbmUuXG4gICAgICBoZWFydGJlYXRzVG9TZW5kLnB1c2goe1xuICAgICAgICBhZ2VudDogc2luZ2xlRGF0ZUhlYXJ0YmVhdC5hZ2VudCxcbiAgICAgICAgZGF0ZXM6IFtzaW5nbGVEYXRlSGVhcnRiZWF0LmRhdGVdXG4gICAgICB9KTtcbiAgICAgIGlmIChjb3VudEJ5dGVzKGhlYXJ0YmVhdHNUb1NlbmQpID4gbWF4U2l6ZSkge1xuICAgICAgICAvLyBJZiB0aGUgaGVhZGVyIHdvdWxkIGV4Y2VlZCBtYXggc2l6ZSwgcmVtb3ZlIHRoZSBhZGRlZCBoZWFydGJlYXRcbiAgICAgICAgLy8gZW50cnkgYW5kIHN0b3AgYWRkaW5nIHRvIHRoZSBoZWFkZXIuXG4gICAgICAgIGhlYXJ0YmVhdHNUb1NlbmQucG9wKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBoZWFydGJlYXRFbnRyeS5kYXRlcy5wdXNoKHNpbmdsZURhdGVIZWFydGJlYXQuZGF0ZSk7XG4gICAgICAvLyBJZiB0aGUgaGVhZGVyIHdvdWxkIGV4Y2VlZCBtYXggc2l6ZSwgcmVtb3ZlIHRoZSBhZGRlZCBkYXRlXG4gICAgICAvLyBhbmQgc3RvcCBhZGRpbmcgdG8gdGhlIGhlYWRlci5cbiAgICAgIGlmIChjb3VudEJ5dGVzKGhlYXJ0YmVhdHNUb1NlbmQpID4gbWF4U2l6ZSkge1xuICAgICAgICBoZWFydGJlYXRFbnRyeS5kYXRlcy5wb3AoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIFBvcCB1bnNlbnQgZW50cnkgZnJvbSBxdWV1ZS4gKFNraXBwZWQgaWYgYWRkaW5nIHRoZSBlbnRyeSBleGNlZWRlZFxuICAgIC8vIHF1b3RhIGFuZCB0aGUgbG9vcCBicmVha3MgZWFybHkuKVxuICAgIHVuc2VudEVudHJpZXMgPSB1bnNlbnRFbnRyaWVzLnNsaWNlKDEpO1xuICB9XG4gIHJldHVybiB7XG4gICAgaGVhcnRiZWF0c1RvU2VuZCxcbiAgICB1bnNlbnRFbnRyaWVzXG4gIH07XG59XG5cbmV4cG9ydCBjbGFzcyBIZWFydGJlYXRTdG9yYWdlSW1wbCBpbXBsZW1lbnRzIEhlYXJ0YmVhdFN0b3JhZ2Uge1xuICBwcml2YXRlIF9jYW5Vc2VJbmRleGVkREJQcm9taXNlOiBQcm9taXNlPGJvb2xlYW4+O1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgYXBwOiBGaXJlYmFzZUFwcCkge1xuICAgIHRoaXMuX2NhblVzZUluZGV4ZWREQlByb21pc2UgPSB0aGlzLnJ1bkluZGV4ZWREQkVudmlyb25tZW50Q2hlY2soKTtcbiAgfVxuICBhc3luYyBydW5JbmRleGVkREJFbnZpcm9ubWVudENoZWNrKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGlmICghaXNJbmRleGVkREJBdmFpbGFibGUoKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdmFsaWRhdGVJbmRleGVkREJPcGVuYWJsZSgpXG4gICAgICAgIC50aGVuKCgpID0+IHRydWUpXG4gICAgICAgIC5jYXRjaCgoKSA9PiBmYWxzZSk7XG4gICAgfVxuICB9XG4gIC8qKlxuICAgKiBSZWFkIGFsbCBoZWFydGJlYXRzLlxuICAgKi9cbiAgYXN5bmMgcmVhZCgpOiBQcm9taXNlPEhlYXJ0YmVhdHNJbkluZGV4ZWREQj4ge1xuICAgIGNvbnN0IGNhblVzZUluZGV4ZWREQiA9IGF3YWl0IHRoaXMuX2NhblVzZUluZGV4ZWREQlByb21pc2U7XG4gICAgaWYgKCFjYW5Vc2VJbmRleGVkREIpIHtcbiAgICAgIHJldHVybiB7IGhlYXJ0YmVhdHM6IFtdIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGlkYkhlYXJ0YmVhdE9iamVjdCA9IGF3YWl0IHJlYWRIZWFydGJlYXRzRnJvbUluZGV4ZWREQih0aGlzLmFwcCk7XG4gICAgICBpZiAoaWRiSGVhcnRiZWF0T2JqZWN0Py5oZWFydGJlYXRzKSB7XG4gICAgICAgIHJldHVybiBpZGJIZWFydGJlYXRPYmplY3Q7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4geyBoZWFydGJlYXRzOiBbXSB9O1xuICAgICAgfVxuICAgIH1cbiAgfVxuICAvLyBvdmVyd3JpdGUgdGhlIHN0b3JhZ2Ugd2l0aCB0aGUgcHJvdmlkZWQgaGVhcnRiZWF0c1xuICBhc3luYyBvdmVyd3JpdGUoaGVhcnRiZWF0c09iamVjdDogSGVhcnRiZWF0c0luSW5kZXhlZERCKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgY2FuVXNlSW5kZXhlZERCID0gYXdhaXQgdGhpcy5fY2FuVXNlSW5kZXhlZERCUHJvbWlzZTtcbiAgICBpZiAoIWNhblVzZUluZGV4ZWREQikge1xuICAgICAgcmV0dXJuO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBleGlzdGluZ0hlYXJ0YmVhdHNPYmplY3QgPSBhd2FpdCB0aGlzLnJlYWQoKTtcbiAgICAgIHJldHVybiB3cml0ZUhlYXJ0YmVhdHNUb0luZGV4ZWREQih0aGlzLmFwcCwge1xuICAgICAgICBsYXN0U2VudEhlYXJ0YmVhdERhdGU6XG4gICAgICAgICAgaGVhcnRiZWF0c09iamVjdC5sYXN0U2VudEhlYXJ0YmVhdERhdGUgPz9cbiAgICAgICAgICBleGlzdGluZ0hlYXJ0YmVhdHNPYmplY3QubGFzdFNlbnRIZWFydGJlYXREYXRlLFxuICAgICAgICBoZWFydGJlYXRzOiBoZWFydGJlYXRzT2JqZWN0LmhlYXJ0YmVhdHNcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICAvLyBhZGQgaGVhcnRiZWF0c1xuICBhc3luYyBhZGQoaGVhcnRiZWF0c09iamVjdDogSGVhcnRiZWF0c0luSW5kZXhlZERCKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgY2FuVXNlSW5kZXhlZERCID0gYXdhaXQgdGhpcy5fY2FuVXNlSW5kZXhlZERCUHJvbWlzZTtcbiAgICBpZiAoIWNhblVzZUluZGV4ZWREQikge1xuICAgICAgcmV0dXJuO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBleGlzdGluZ0hlYXJ0YmVhdHNPYmplY3QgPSBhd2FpdCB0aGlzLnJlYWQoKTtcbiAgICAgIHJldHVybiB3cml0ZUhlYXJ0YmVhdHNUb0luZGV4ZWREQih0aGlzLmFwcCwge1xuICAgICAgICBsYXN0U2VudEhlYXJ0YmVhdERhdGU6XG4gICAgICAgICAgaGVhcnRiZWF0c09iamVjdC5sYXN0U2VudEhlYXJ0YmVhdERhdGUgPz9cbiAgICAgICAgICBleGlzdGluZ0hlYXJ0YmVhdHNPYmplY3QubGFzdFNlbnRIZWFydGJlYXREYXRlLFxuICAgICAgICBoZWFydGJlYXRzOiBbXG4gICAgICAgICAgLi4uZXhpc3RpbmdIZWFydGJlYXRzT2JqZWN0LmhlYXJ0YmVhdHMsXG4gICAgICAgICAgLi4uaGVhcnRiZWF0c09iamVjdC5oZWFydGJlYXRzXG4gICAgICAgIF1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIENhbGN1bGF0ZSBieXRlcyBvZiBhIEhlYXJ0YmVhdHNCeVVzZXJBZ2VudCBhcnJheSBhZnRlciBiZWluZyB3cmFwcGVkXG4gKiBpbiBhIHBsYXRmb3JtIGxvZ2dpbmcgaGVhZGVyIEpTT04gb2JqZWN0LCBzdHJpbmdpZmllZCwgYW5kIGNvbnZlcnRlZFxuICogdG8gYmFzZSA2NC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvdW50Qnl0ZXMoaGVhcnRiZWF0c0NhY2hlOiBIZWFydGJlYXRzQnlVc2VyQWdlbnRbXSk6IG51bWJlciB7XG4gIC8vIGJhc2U2NCBoYXMgYSByZXN0cmljdGVkIHNldCBvZiBjaGFyYWN0ZXJzLCBhbGwgb2Ygd2hpY2ggc2hvdWxkIGJlIDEgYnl0ZS5cbiAgcmV0dXJuIGJhc2U2NHVybEVuY29kZVdpdGhvdXRQYWRkaW5nKFxuICAgIC8vIGhlYXJ0YmVhdHNDYWNoZSB3cmFwcGVyIHByb3BlcnRpZXNcbiAgICBKU09OLnN0cmluZ2lmeSh7IHZlcnNpb246IDIsIGhlYXJ0YmVhdHM6IGhlYXJ0YmVhdHNDYWNoZSB9KVxuICApLmxlbmd0aDtcbn1cbiIsICIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBDb21wb25lbnQsIENvbXBvbmVudFR5cGUgfSBmcm9tICdAZmlyZWJhc2UvY29tcG9uZW50JztcbmltcG9ydCB7IFBsYXRmb3JtTG9nZ2VyU2VydmljZUltcGwgfSBmcm9tICcuL3BsYXRmb3JtTG9nZ2VyU2VydmljZSc7XG5pbXBvcnQgeyBuYW1lLCB2ZXJzaW9uIH0gZnJvbSAnLi4vcGFja2FnZS5qc29uJztcbmltcG9ydCB7IF9yZWdpc3RlckNvbXBvbmVudCB9IGZyb20gJy4vaW50ZXJuYWwnO1xuaW1wb3J0IHsgcmVnaXN0ZXJWZXJzaW9uIH0gZnJvbSAnLi9hcGknO1xuaW1wb3J0IHsgSGVhcnRiZWF0U2VydmljZUltcGwgfSBmcm9tICcuL2hlYXJ0YmVhdFNlcnZpY2UnO1xuXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXJDb3JlQ29tcG9uZW50cyh2YXJpYW50Pzogc3RyaW5nKTogdm9pZCB7XG4gIF9yZWdpc3RlckNvbXBvbmVudChcbiAgICBuZXcgQ29tcG9uZW50KFxuICAgICAgJ3BsYXRmb3JtLWxvZ2dlcicsXG4gICAgICBjb250YWluZXIgPT4gbmV3IFBsYXRmb3JtTG9nZ2VyU2VydmljZUltcGwoY29udGFpbmVyKSxcbiAgICAgIENvbXBvbmVudFR5cGUuUFJJVkFURVxuICAgIClcbiAgKTtcbiAgX3JlZ2lzdGVyQ29tcG9uZW50KFxuICAgIG5ldyBDb21wb25lbnQoXG4gICAgICAnaGVhcnRiZWF0JyxcbiAgICAgIGNvbnRhaW5lciA9PiBuZXcgSGVhcnRiZWF0U2VydmljZUltcGwoY29udGFpbmVyKSxcbiAgICAgIENvbXBvbmVudFR5cGUuUFJJVkFURVxuICAgIClcbiAgKTtcblxuICAvLyBSZWdpc3RlciBgYXBwYCBwYWNrYWdlLlxuICByZWdpc3RlclZlcnNpb24obmFtZSwgdmVyc2lvbiwgdmFyaWFudCk7XG4gIC8vIEJVSUxEX1RBUkdFVCB3aWxsIGJlIHJlcGxhY2VkIGJ5IHZhbHVlcyBsaWtlIGVzbTUsIGVzbTIwMTcsIGNqczUsIGV0YyBkdXJpbmcgdGhlIGNvbXBpbGF0aW9uXG4gIHJlZ2lzdGVyVmVyc2lvbihuYW1lLCB2ZXJzaW9uLCAnX19CVUlMRF9UQVJHRVRfXycpO1xuICAvLyBSZWdpc3RlciBwbGF0Zm9ybSBTREsgaWRlbnRpZmllciAobm8gdmVyc2lvbikuXG4gIHJlZ2lzdGVyVmVyc2lvbignZmlyZS1qcycsICcnKTtcbn1cbiIsICIvKipcbiAqIEZpcmViYXNlIEFwcFxuICpcbiAqIEByZW1hcmtzIFRoaXMgcGFja2FnZSBjb29yZGluYXRlcyB0aGUgY29tbXVuaWNhdGlvbiBiZXR3ZWVuIHRoZSBkaWZmZXJlbnQgRmlyZWJhc2UgY29tcG9uZW50c1xuICogQHBhY2thZ2VEb2N1bWVudGF0aW9uXG4gKi9cblxuLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgcmVnaXN0ZXJDb3JlQ29tcG9uZW50cyB9IGZyb20gJy4vcmVnaXN0ZXJDb3JlQ29tcG9uZW50cyc7XG5cbmV4cG9ydCAqIGZyb20gJy4vYXBpJztcbmV4cG9ydCAqIGZyb20gJy4vaW50ZXJuYWwnO1xuZXhwb3J0ICogZnJvbSAnLi9wdWJsaWMtdHlwZXMnO1xuXG5yZWdpc3RlckNvcmVDb21wb25lbnRzKCdfX1JVTlRJTUVfRU5WX18nKTtcbiIsICIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuaW1wb3J0IHsgcmVnaXN0ZXJWZXJzaW9uIH0gZnJvbSAnQGZpcmViYXNlL2FwcCc7XG5pbXBvcnQgeyBuYW1lLCB2ZXJzaW9uIH0gZnJvbSAnLi4vcGFja2FnZS5qc29uJztcblxucmVnaXN0ZXJWZXJzaW9uKG5hbWUsIHZlcnNpb24sICdhcHAnKTtcbmV4cG9ydCAqIGZyb20gJ0BmaXJlYmFzZS9hcHAnO1xuIiwgIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTENcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG4vKipcbiAqIEBmaWxlb3ZlcnZpZXcgQ29uc3RhbnRzIHVzZWQgaW4gdGhlIEZpcmViYXNlIFN0b3JhZ2UgbGlicmFyeS5cbiAqL1xuXG4vKipcbiAqIERvbWFpbiBuYW1lIGZvciBmaXJlYmFzZSBzdG9yYWdlLlxuICovXG5leHBvcnQgY29uc3QgREVGQVVMVF9IT1NUID0gJ2ZpcmViYXNlc3RvcmFnZS5nb29nbGVhcGlzLmNvbSc7XG5cbi8qKlxuICogVGhlIGtleSBpbiBGaXJlYmFzZSBjb25maWcganNvbiBmb3IgdGhlIHN0b3JhZ2UgYnVja2V0LlxuICovXG5leHBvcnQgY29uc3QgQ09ORklHX1NUT1JBR0VfQlVDS0VUX0tFWSA9ICdzdG9yYWdlQnVja2V0JztcblxuLyoqXG4gKiAyIG1pbnV0ZXNcbiAqXG4gKiBUaGUgdGltZW91dCBmb3IgYWxsIG9wZXJhdGlvbnMgZXhjZXB0IHVwbG9hZC5cbiAqL1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfTUFYX09QRVJBVElPTl9SRVRSWV9USU1FID0gMiAqIDYwICogMTAwMDtcblxuLyoqXG4gKiAxMCBtaW51dGVzXG4gKlxuICogVGhlIHRpbWVvdXQgZm9yIHVwbG9hZC5cbiAqL1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfTUFYX1VQTE9BRF9SRVRSWV9USU1FID0gMTAgKiA2MCAqIDEwMDA7XG5cbi8qKlxuICogMSBzZWNvbmRcbiAqL1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfTUlOX1NMRUVQX1RJTUVfTUlMTElTID0gMTAwMDtcblxuLyoqXG4gKiBUaGlzIGlzIHRoZSB2YWx1ZSBvZiBOdW1iZXIuTUlOX1NBRkVfSU5URUdFUiwgd2hpY2ggaXMgbm90IHdlbGwgc3VwcG9ydGVkXG4gKiBlbm91Z2ggZm9yIHVzIHRvIHVzZSBpdCBkaXJlY3RseS5cbiAqL1xuZXhwb3J0IGNvbnN0IE1JTl9TQUZFX0lOVEVHRVIgPSAtOTAwNzE5OTI1NDc0MDk5MTtcbiIsICIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBGaXJlYmFzZUVycm9yIH0gZnJvbSAnQGZpcmViYXNlL3V0aWwnO1xuXG5pbXBvcnQgeyBDT05GSUdfU1RPUkFHRV9CVUNLRVRfS0VZIH0gZnJvbSAnLi9jb25zdGFudHMnO1xuXG4vKipcbiAqIEFuIGVycm9yIHJldHVybmVkIGJ5IHRoZSBGaXJlYmFzZSBTdG9yYWdlIFNESy5cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNsYXNzIFN0b3JhZ2VFcnJvciBleHRlbmRzIEZpcmViYXNlRXJyb3Ige1xuICBwcml2YXRlIHJlYWRvbmx5IF9iYXNlTWVzc2FnZTogc3RyaW5nO1xuICAvKipcbiAgICogU3RvcmVzIGN1c3RvbSBlcnJvciBkYXRhIHVuaXF1ZSB0byB0aGUgYFN0b3JhZ2VFcnJvcmAuXG4gICAqL1xuICBjdXN0b21EYXRhOiB7IHNlcnZlclJlc3BvbnNlOiBzdHJpbmcgfCBudWxsIH0gPSB7IHNlcnZlclJlc3BvbnNlOiBudWxsIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSBjb2RlIC0gQSBgU3RvcmFnZUVycm9yQ29kZWAgc3RyaW5nIHRvIGJlIHByZWZpeGVkIHdpdGggJ3N0b3JhZ2UvJyBhbmRcbiAgICogIGFkZGVkIHRvIHRoZSBlbmQgb2YgdGhlIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSBtZXNzYWdlICAtIEVycm9yIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSBzdGF0dXNfIC0gQ29ycmVzcG9uZGluZyBIVFRQIFN0YXR1cyBDb2RlXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihjb2RlOiBTdG9yYWdlRXJyb3JDb2RlLCBtZXNzYWdlOiBzdHJpbmcsIHByaXZhdGUgc3RhdHVzXyA9IDApIHtcbiAgICBzdXBlcihcbiAgICAgIHByZXBlbmRDb2RlKGNvZGUpLFxuICAgICAgYEZpcmViYXNlIFN0b3JhZ2U6ICR7bWVzc2FnZX0gKCR7cHJlcGVuZENvZGUoY29kZSl9KWBcbiAgICApO1xuICAgIHRoaXMuX2Jhc2VNZXNzYWdlID0gdGhpcy5tZXNzYWdlO1xuICAgIC8vIFdpdGhvdXQgdGhpcywgYGluc3RhbmNlb2YgU3RvcmFnZUVycm9yYCwgaW4gdGVzdHMgZm9yIGV4YW1wbGUsXG4gICAgLy8gcmV0dXJucyBmYWxzZS5cbiAgICBPYmplY3Quc2V0UHJvdG90eXBlT2YodGhpcywgU3RvcmFnZUVycm9yLnByb3RvdHlwZSk7XG4gIH1cblxuICBnZXQgc3RhdHVzKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdHVzXztcbiAgfVxuXG4gIHNldCBzdGF0dXMoc3RhdHVzOiBudW1iZXIpIHtcbiAgICB0aGlzLnN0YXR1c18gPSBzdGF0dXM7XG4gIH1cblxuICAvKipcbiAgICogQ29tcGFyZXMgYSBgU3RvcmFnZUVycm9yQ29kZWAgYWdhaW5zdCB0aGlzIGVycm9yJ3MgY29kZSwgZmlsdGVyaW5nIG91dCB0aGUgcHJlZml4LlxuICAgKi9cbiAgX2NvZGVFcXVhbHMoY29kZTogU3RvcmFnZUVycm9yQ29kZSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBwcmVwZW5kQ29kZShjb2RlKSA9PT0gdGhpcy5jb2RlO1xuICB9XG5cbiAgLyoqXG4gICAqIE9wdGlvbmFsIHJlc3BvbnNlIG1lc3NhZ2UgdGhhdCB3YXMgYWRkZWQgYnkgdGhlIHNlcnZlci5cbiAgICovXG4gIGdldCBzZXJ2ZXJSZXNwb25zZSgpOiBudWxsIHwgc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5jdXN0b21EYXRhLnNlcnZlclJlc3BvbnNlO1xuICB9XG5cbiAgc2V0IHNlcnZlclJlc3BvbnNlKHNlcnZlclJlc3BvbnNlOiBzdHJpbmcgfCBudWxsKSB7XG4gICAgdGhpcy5jdXN0b21EYXRhLnNlcnZlclJlc3BvbnNlID0gc2VydmVyUmVzcG9uc2U7XG4gICAgaWYgKHRoaXMuY3VzdG9tRGF0YS5zZXJ2ZXJSZXNwb25zZSkge1xuICAgICAgdGhpcy5tZXNzYWdlID0gYCR7dGhpcy5fYmFzZU1lc3NhZ2V9XFxuJHt0aGlzLmN1c3RvbURhdGEuc2VydmVyUmVzcG9uc2V9YDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5tZXNzYWdlID0gdGhpcy5fYmFzZU1lc3NhZ2U7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCBlcnJvcnMgPSB7fTtcblxuLyoqXG4gKiBAcHVibGljXG4gKiBFcnJvciBjb2RlcyB0aGF0IGNhbiBiZSBhdHRhY2hlZCB0byBgU3RvcmFnZUVycm9yYCBvYmplY3RzLlxuICovXG5leHBvcnQgZW51bSBTdG9yYWdlRXJyb3JDb2RlIHtcbiAgLy8gU2hhcmVkIGJldHdlZW4gYWxsIHBsYXRmb3Jtc1xuICBVTktOT1dOID0gJ3Vua25vd24nLFxuICBPQkpFQ1RfTk9UX0ZPVU5EID0gJ29iamVjdC1ub3QtZm91bmQnLFxuICBCVUNLRVRfTk9UX0ZPVU5EID0gJ2J1Y2tldC1ub3QtZm91bmQnLFxuICBQUk9KRUNUX05PVF9GT1VORCA9ICdwcm9qZWN0LW5vdC1mb3VuZCcsXG4gIFFVT1RBX0VYQ0VFREVEID0gJ3F1b3RhLWV4Y2VlZGVkJyxcbiAgVU5BVVRIRU5USUNBVEVEID0gJ3VuYXV0aGVudGljYXRlZCcsXG4gIFVOQVVUSE9SSVpFRCA9ICd1bmF1dGhvcml6ZWQnLFxuICBVTkFVVEhPUklaRURfQVBQID0gJ3VuYXV0aG9yaXplZC1hcHAnLFxuICBSRVRSWV9MSU1JVF9FWENFRURFRCA9ICdyZXRyeS1saW1pdC1leGNlZWRlZCcsXG4gIElOVkFMSURfQ0hFQ0tTVU0gPSAnaW52YWxpZC1jaGVja3N1bScsXG4gIENBTkNFTEVEID0gJ2NhbmNlbGVkJyxcbiAgLy8gSlMgc3BlY2lmaWNcbiAgSU5WQUxJRF9FVkVOVF9OQU1FID0gJ2ludmFsaWQtZXZlbnQtbmFtZScsXG4gIElOVkFMSURfVVJMID0gJ2ludmFsaWQtdXJsJyxcbiAgSU5WQUxJRF9ERUZBVUxUX0JVQ0tFVCA9ICdpbnZhbGlkLWRlZmF1bHQtYnVja2V0JyxcbiAgTk9fREVGQVVMVF9CVUNLRVQgPSAnbm8tZGVmYXVsdC1idWNrZXQnLFxuICBDQU5OT1RfU0xJQ0VfQkxPQiA9ICdjYW5ub3Qtc2xpY2UtYmxvYicsXG4gIFNFUlZFUl9GSUxFX1dST05HX1NJWkUgPSAnc2VydmVyLWZpbGUtd3Jvbmctc2l6ZScsXG4gIE5PX0RPV05MT0FEX1VSTCA9ICduby1kb3dubG9hZC11cmwnLFxuICBJTlZBTElEX0FSR1VNRU5UID0gJ2ludmFsaWQtYXJndW1lbnQnLFxuICBJTlZBTElEX0FSR1VNRU5UX0NPVU5UID0gJ2ludmFsaWQtYXJndW1lbnQtY291bnQnLFxuICBBUFBfREVMRVRFRCA9ICdhcHAtZGVsZXRlZCcsXG4gIElOVkFMSURfUk9PVF9PUEVSQVRJT04gPSAnaW52YWxpZC1yb290LW9wZXJhdGlvbicsXG4gIElOVkFMSURfRk9STUFUID0gJ2ludmFsaWQtZm9ybWF0JyxcbiAgSU5URVJOQUxfRVJST1IgPSAnaW50ZXJuYWwtZXJyb3InLFxuICBVTlNVUFBPUlRFRF9FTlZJUk9OTUVOVCA9ICd1bnN1cHBvcnRlZC1lbnZpcm9ubWVudCdcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHByZXBlbmRDb2RlKGNvZGU6IFN0b3JhZ2VFcnJvckNvZGUpOiBzdHJpbmcge1xuICByZXR1cm4gJ3N0b3JhZ2UvJyArIGNvZGU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1bmtub3duKCk6IFN0b3JhZ2VFcnJvciB7XG4gIGNvbnN0IG1lc3NhZ2UgPVxuICAgICdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkLCBwbGVhc2UgY2hlY2sgdGhlIGVycm9yIHBheWxvYWQgZm9yICcgK1xuICAgICdzZXJ2ZXIgcmVzcG9uc2UuJztcbiAgcmV0dXJuIG5ldyBTdG9yYWdlRXJyb3IoU3RvcmFnZUVycm9yQ29kZS5VTktOT1dOLCBtZXNzYWdlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG9iamVjdE5vdEZvdW5kKHBhdGg6IHN0cmluZyk6IFN0b3JhZ2VFcnJvciB7XG4gIHJldHVybiBuZXcgU3RvcmFnZUVycm9yKFxuICAgIFN0b3JhZ2VFcnJvckNvZGUuT0JKRUNUX05PVF9GT1VORCxcbiAgICBcIk9iamVjdCAnXCIgKyBwYXRoICsgXCInIGRvZXMgbm90IGV4aXN0LlwiXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBidWNrZXROb3RGb3VuZChidWNrZXQ6IHN0cmluZyk6IFN0b3JhZ2VFcnJvciB7XG4gIHJldHVybiBuZXcgU3RvcmFnZUVycm9yKFxuICAgIFN0b3JhZ2VFcnJvckNvZGUuQlVDS0VUX05PVF9GT1VORCxcbiAgICBcIkJ1Y2tldCAnXCIgKyBidWNrZXQgKyBcIicgZG9lcyBub3QgZXhpc3QuXCJcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHByb2plY3ROb3RGb3VuZChwcm9qZWN0OiBzdHJpbmcpOiBTdG9yYWdlRXJyb3Ige1xuICByZXR1cm4gbmV3IFN0b3JhZ2VFcnJvcihcbiAgICBTdG9yYWdlRXJyb3JDb2RlLlBST0pFQ1RfTk9UX0ZPVU5ELFxuICAgIFwiUHJvamVjdCAnXCIgKyBwcm9qZWN0ICsgXCInIGRvZXMgbm90IGV4aXN0LlwiXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBxdW90YUV4Y2VlZGVkKGJ1Y2tldDogc3RyaW5nKTogU3RvcmFnZUVycm9yIHtcbiAgcmV0dXJuIG5ldyBTdG9yYWdlRXJyb3IoXG4gICAgU3RvcmFnZUVycm9yQ29kZS5RVU9UQV9FWENFRURFRCxcbiAgICBcIlF1b3RhIGZvciBidWNrZXQgJ1wiICtcbiAgICAgIGJ1Y2tldCArXG4gICAgICBcIicgZXhjZWVkZWQsIHBsZWFzZSB2aWV3IHF1b3RhIG9uIFwiICtcbiAgICAgICdodHRwczovL2ZpcmViYXNlLmdvb2dsZS5jb20vcHJpY2luZy8uJ1xuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdW5hdXRoZW50aWNhdGVkKCk6IFN0b3JhZ2VFcnJvciB7XG4gIGNvbnN0IG1lc3NhZ2UgPVxuICAgICdVc2VyIGlzIG5vdCBhdXRoZW50aWNhdGVkLCBwbGVhc2UgYXV0aGVudGljYXRlIHVzaW5nIEZpcmViYXNlICcgK1xuICAgICdBdXRoZW50aWNhdGlvbiBhbmQgdHJ5IGFnYWluLic7XG4gIHJldHVybiBuZXcgU3RvcmFnZUVycm9yKFN0b3JhZ2VFcnJvckNvZGUuVU5BVVRIRU5USUNBVEVELCBtZXNzYWdlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVuYXV0aG9yaXplZEFwcCgpOiBTdG9yYWdlRXJyb3Ige1xuICByZXR1cm4gbmV3IFN0b3JhZ2VFcnJvcihcbiAgICBTdG9yYWdlRXJyb3JDb2RlLlVOQVVUSE9SSVpFRF9BUFAsXG4gICAgJ1RoaXMgYXBwIGRvZXMgbm90IGhhdmUgcGVybWlzc2lvbiB0byBhY2Nlc3MgRmlyZWJhc2UgU3RvcmFnZSBvbiB0aGlzIHByb2plY3QuJ1xuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdW5hdXRob3JpemVkKHBhdGg6IHN0cmluZyk6IFN0b3JhZ2VFcnJvciB7XG4gIHJldHVybiBuZXcgU3RvcmFnZUVycm9yKFxuICAgIFN0b3JhZ2VFcnJvckNvZGUuVU5BVVRIT1JJWkVELFxuICAgIFwiVXNlciBkb2VzIG5vdCBoYXZlIHBlcm1pc3Npb24gdG8gYWNjZXNzICdcIiArIHBhdGggKyBcIicuXCJcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJldHJ5TGltaXRFeGNlZWRlZCgpOiBTdG9yYWdlRXJyb3Ige1xuICByZXR1cm4gbmV3IFN0b3JhZ2VFcnJvcihcbiAgICBTdG9yYWdlRXJyb3JDb2RlLlJFVFJZX0xJTUlUX0VYQ0VFREVELFxuICAgICdNYXggcmV0cnkgdGltZSBmb3Igb3BlcmF0aW9uIGV4Y2VlZGVkLCBwbGVhc2UgdHJ5IGFnYWluLidcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGludmFsaWRDaGVja3N1bShcbiAgcGF0aDogc3RyaW5nLFxuICBjaGVja3N1bTogc3RyaW5nLFxuICBjYWxjdWxhdGVkOiBzdHJpbmdcbik6IFN0b3JhZ2VFcnJvciB7XG4gIHJldHVybiBuZXcgU3RvcmFnZUVycm9yKFxuICAgIFN0b3JhZ2VFcnJvckNvZGUuSU5WQUxJRF9DSEVDS1NVTSxcbiAgICBcIlVwbG9hZGVkL2Rvd25sb2FkZWQgb2JqZWN0ICdcIiArXG4gICAgICBwYXRoICtcbiAgICAgIFwiJyBoYXMgY2hlY2tzdW0gJ1wiICtcbiAgICAgIGNoZWNrc3VtICtcbiAgICAgIFwiJyB3aGljaCBkb2VzIG5vdCBtYXRjaCAnXCIgK1xuICAgICAgY2FsY3VsYXRlZCArXG4gICAgICBcIicuIFBsZWFzZSByZXRyeSB0aGUgdXBsb2FkL2Rvd25sb2FkLlwiXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjYW5jZWxlZCgpOiBTdG9yYWdlRXJyb3Ige1xuICByZXR1cm4gbmV3IFN0b3JhZ2VFcnJvcihcbiAgICBTdG9yYWdlRXJyb3JDb2RlLkNBTkNFTEVELFxuICAgICdVc2VyIGNhbmNlbGVkIHRoZSB1cGxvYWQvZG93bmxvYWQuJ1xuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW52YWxpZEV2ZW50TmFtZShuYW1lOiBzdHJpbmcpOiBTdG9yYWdlRXJyb3Ige1xuICByZXR1cm4gbmV3IFN0b3JhZ2VFcnJvcihcbiAgICBTdG9yYWdlRXJyb3JDb2RlLklOVkFMSURfRVZFTlRfTkFNRSxcbiAgICBcIkludmFsaWQgZXZlbnQgbmFtZSAnXCIgKyBuYW1lICsgXCInLlwiXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbnZhbGlkVXJsKHVybDogc3RyaW5nKTogU3RvcmFnZUVycm9yIHtcbiAgcmV0dXJuIG5ldyBTdG9yYWdlRXJyb3IoXG4gICAgU3RvcmFnZUVycm9yQ29kZS5JTlZBTElEX1VSTCxcbiAgICBcIkludmFsaWQgVVJMICdcIiArIHVybCArIFwiJy5cIlxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW52YWxpZERlZmF1bHRCdWNrZXQoYnVja2V0OiBzdHJpbmcpOiBTdG9yYWdlRXJyb3Ige1xuICByZXR1cm4gbmV3IFN0b3JhZ2VFcnJvcihcbiAgICBTdG9yYWdlRXJyb3JDb2RlLklOVkFMSURfREVGQVVMVF9CVUNLRVQsXG4gICAgXCJJbnZhbGlkIGRlZmF1bHQgYnVja2V0ICdcIiArIGJ1Y2tldCArIFwiJy5cIlxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbm9EZWZhdWx0QnVja2V0KCk6IFN0b3JhZ2VFcnJvciB7XG4gIHJldHVybiBuZXcgU3RvcmFnZUVycm9yKFxuICAgIFN0b3JhZ2VFcnJvckNvZGUuTk9fREVGQVVMVF9CVUNLRVQsXG4gICAgJ05vIGRlZmF1bHQgYnVja2V0ICcgK1xuICAgICAgXCJmb3VuZC4gRGlkIHlvdSBzZXQgdGhlICdcIiArXG4gICAgICBDT05GSUdfU1RPUkFHRV9CVUNLRVRfS0VZICtcbiAgICAgIFwiJyBwcm9wZXJ0eSB3aGVuIGluaXRpYWxpemluZyB0aGUgYXBwP1wiXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjYW5ub3RTbGljZUJsb2IoKTogU3RvcmFnZUVycm9yIHtcbiAgcmV0dXJuIG5ldyBTdG9yYWdlRXJyb3IoXG4gICAgU3RvcmFnZUVycm9yQ29kZS5DQU5OT1RfU0xJQ0VfQkxPQixcbiAgICAnQ2Fubm90IHNsaWNlIGJsb2IgZm9yIHVwbG9hZC4gUGxlYXNlIHJldHJ5IHRoZSB1cGxvYWQuJ1xuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2VydmVyRmlsZVdyb25nU2l6ZSgpOiBTdG9yYWdlRXJyb3Ige1xuICByZXR1cm4gbmV3IFN0b3JhZ2VFcnJvcihcbiAgICBTdG9yYWdlRXJyb3JDb2RlLlNFUlZFUl9GSUxFX1dST05HX1NJWkUsXG4gICAgJ1NlcnZlciByZWNvcmRlZCBpbmNvcnJlY3QgdXBsb2FkIGZpbGUgc2l6ZSwgcGxlYXNlIHJldHJ5IHRoZSB1cGxvYWQuJ1xuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbm9Eb3dubG9hZFVSTCgpOiBTdG9yYWdlRXJyb3Ige1xuICByZXR1cm4gbmV3IFN0b3JhZ2VFcnJvcihcbiAgICBTdG9yYWdlRXJyb3JDb2RlLk5PX0RPV05MT0FEX1VSTCxcbiAgICAnVGhlIGdpdmVuIGZpbGUgZG9lcyBub3QgaGF2ZSBhbnkgZG93bmxvYWQgVVJMcy4nXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtaXNzaW5nUG9seUZpbGwocG9seUZpbGw6IHN0cmluZyk6IFN0b3JhZ2VFcnJvciB7XG4gIHJldHVybiBuZXcgU3RvcmFnZUVycm9yKFxuICAgIFN0b3JhZ2VFcnJvckNvZGUuVU5TVVBQT1JURURfRU5WSVJPTk1FTlQsXG4gICAgYCR7cG9seUZpbGx9IGlzIG1pc3NpbmcuIE1ha2Ugc3VyZSB0byBpbnN0YWxsIHRoZSByZXF1aXJlZCBwb2x5ZmlsbHMuIFNlZSBodHRwczovL2ZpcmViYXNlLmdvb2dsZS5jb20vZG9jcy93ZWIvZW52aXJvbm1lbnRzLWpzLXNkayNwb2x5ZmlsbHMgZm9yIG1vcmUgaW5mb3JtYXRpb24uYFxuICApO1xufVxuXG4vKipcbiAqIEBpbnRlcm5hbFxuICovXG5leHBvcnQgZnVuY3Rpb24gaW52YWxpZEFyZ3VtZW50KG1lc3NhZ2U6IHN0cmluZyk6IFN0b3JhZ2VFcnJvciB7XG4gIHJldHVybiBuZXcgU3RvcmFnZUVycm9yKFN0b3JhZ2VFcnJvckNvZGUuSU5WQUxJRF9BUkdVTUVOVCwgbWVzc2FnZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbnZhbGlkQXJndW1lbnRDb3VudChcbiAgYXJnTWluOiBudW1iZXIsXG4gIGFyZ01heDogbnVtYmVyLFxuICBmbk5hbWU6IHN0cmluZyxcbiAgcmVhbDogbnVtYmVyXG4pOiBTdG9yYWdlRXJyb3Ige1xuICBsZXQgY291bnRQYXJ0O1xuICBsZXQgcGx1cmFsO1xuICBpZiAoYXJnTWluID09PSBhcmdNYXgpIHtcbiAgICBjb3VudFBhcnQgPSBhcmdNaW47XG4gICAgcGx1cmFsID0gYXJnTWluID09PSAxID8gJ2FyZ3VtZW50JyA6ICdhcmd1bWVudHMnO1xuICB9IGVsc2Uge1xuICAgIGNvdW50UGFydCA9ICdiZXR3ZWVuICcgKyBhcmdNaW4gKyAnIGFuZCAnICsgYXJnTWF4O1xuICAgIHBsdXJhbCA9ICdhcmd1bWVudHMnO1xuICB9XG4gIHJldHVybiBuZXcgU3RvcmFnZUVycm9yKFxuICAgIFN0b3JhZ2VFcnJvckNvZGUuSU5WQUxJRF9BUkdVTUVOVF9DT1VOVCxcbiAgICAnSW52YWxpZCBhcmd1bWVudCBjb3VudCBpbiBgJyArXG4gICAgICBmbk5hbWUgK1xuICAgICAgJ2A6IEV4cGVjdGVkICcgK1xuICAgICAgY291bnRQYXJ0ICtcbiAgICAgICcgJyArXG4gICAgICBwbHVyYWwgK1xuICAgICAgJywgcmVjZWl2ZWQgJyArXG4gICAgICByZWFsICtcbiAgICAgICcuJ1xuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXBwRGVsZXRlZCgpOiBTdG9yYWdlRXJyb3Ige1xuICByZXR1cm4gbmV3IFN0b3JhZ2VFcnJvcihcbiAgICBTdG9yYWdlRXJyb3JDb2RlLkFQUF9ERUxFVEVELFxuICAgICdUaGUgRmlyZWJhc2UgYXBwIHdhcyBkZWxldGVkLidcbiAgKTtcbn1cblxuLyoqXG4gKiBAcGFyYW0gbmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBvcGVyYXRpb24gdGhhdCB3YXMgaW52YWxpZC5cbiAqXG4gKiBAaW50ZXJuYWxcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGludmFsaWRSb290T3BlcmF0aW9uKG5hbWU6IHN0cmluZyk6IFN0b3JhZ2VFcnJvciB7XG4gIHJldHVybiBuZXcgU3RvcmFnZUVycm9yKFxuICAgIFN0b3JhZ2VFcnJvckNvZGUuSU5WQUxJRF9ST09UX09QRVJBVElPTixcbiAgICBcIlRoZSBvcGVyYXRpb24gJ1wiICtcbiAgICAgIG5hbWUgK1xuICAgICAgXCInIGNhbm5vdCBiZSBwZXJmb3JtZWQgb24gYSByb290IHJlZmVyZW5jZSwgY3JlYXRlIGEgbm9uLXJvb3QgXCIgK1xuICAgICAgXCJyZWZlcmVuY2UgdXNpbmcgY2hpbGQsIHN1Y2ggYXMgLmNoaWxkKCdmaWxlLnBuZycpLlwiXG4gICk7XG59XG5cbi8qKlxuICogQHBhcmFtIGZvcm1hdCAtIFRoZSBmb3JtYXQgdGhhdCB3YXMgbm90IHZhbGlkLlxuICogQHBhcmFtIG1lc3NhZ2UgLSBBIG1lc3NhZ2UgZGVzY3JpYmluZyB0aGUgZm9ybWF0IHZpb2xhdGlvbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGludmFsaWRGb3JtYXQoZm9ybWF0OiBzdHJpbmcsIG1lc3NhZ2U6IHN0cmluZyk6IFN0b3JhZ2VFcnJvciB7XG4gIHJldHVybiBuZXcgU3RvcmFnZUVycm9yKFxuICAgIFN0b3JhZ2VFcnJvckNvZGUuSU5WQUxJRF9GT1JNQVQsXG4gICAgXCJTdHJpbmcgZG9lcyBub3QgbWF0Y2ggZm9ybWF0ICdcIiArIGZvcm1hdCArIFwiJzogXCIgKyBtZXNzYWdlXG4gICk7XG59XG5cbi8qKlxuICogQHBhcmFtIG1lc3NhZ2UgLSBBIG1lc3NhZ2UgZGVzY3JpYmluZyB0aGUgaW50ZXJuYWwgZXJyb3IuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1bnN1cHBvcnRlZEVudmlyb25tZW50KG1lc3NhZ2U6IHN0cmluZyk6IFN0b3JhZ2VFcnJvciB7XG4gIHRocm93IG5ldyBTdG9yYWdlRXJyb3IoU3RvcmFnZUVycm9yQ29kZS5VTlNVUFBPUlRFRF9FTlZJUk9OTUVOVCwgbWVzc2FnZSk7XG59XG5cbi8qKlxuICogQHBhcmFtIG1lc3NhZ2UgLSBBIG1lc3NhZ2UgZGVzY3JpYmluZyB0aGUgaW50ZXJuYWwgZXJyb3IuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbnRlcm5hbEVycm9yKG1lc3NhZ2U6IHN0cmluZyk6IFN0b3JhZ2VFcnJvciB7XG4gIHRocm93IG5ldyBTdG9yYWdlRXJyb3IoXG4gICAgU3RvcmFnZUVycm9yQ29kZS5JTlRFUk5BTF9FUlJPUixcbiAgICAnSW50ZXJuYWwgZXJyb3I6ICcgKyBtZXNzYWdlXG4gICk7XG59XG4iLCAiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQ1xuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IEZ1bmN0aW9uYWxpdHkgcmVsYXRlZCB0byB0aGUgcGFyc2luZy9jb21wb3NpdGlvbiBvZiBidWNrZXQvXG4gKiBvYmplY3QgbG9jYXRpb24uXG4gKi9cblxuaW1wb3J0IHsgaW52YWxpZERlZmF1bHRCdWNrZXQsIGludmFsaWRVcmwgfSBmcm9tICcuL2Vycm9yJztcbmltcG9ydCB7IERFRkFVTFRfSE9TVCB9IGZyb20gJy4vY29uc3RhbnRzJztcblxuLyoqXG4gKiBGaXJlYmFzZSBTdG9yYWdlIGxvY2F0aW9uIGRhdGEuXG4gKlxuICogQGludGVybmFsXG4gKi9cbmV4cG9ydCBjbGFzcyBMb2NhdGlvbiB7XG4gIHByaXZhdGUgcGF0aF86IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgYnVja2V0OiBzdHJpbmcsIHBhdGg6IHN0cmluZykge1xuICAgIHRoaXMucGF0aF8gPSBwYXRoO1xuICB9XG5cbiAgZ2V0IHBhdGgoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5wYXRoXztcbiAgfVxuXG4gIGdldCBpc1Jvb3QoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMucGF0aC5sZW5ndGggPT09IDA7XG4gIH1cblxuICBmdWxsU2VydmVyVXJsKCk6IHN0cmluZyB7XG4gICAgY29uc3QgZW5jb2RlID0gZW5jb2RlVVJJQ29tcG9uZW50O1xuICAgIHJldHVybiAnL2IvJyArIGVuY29kZSh0aGlzLmJ1Y2tldCkgKyAnL28vJyArIGVuY29kZSh0aGlzLnBhdGgpO1xuICB9XG5cbiAgYnVja2V0T25seVNlcnZlclVybCgpOiBzdHJpbmcge1xuICAgIGNvbnN0IGVuY29kZSA9IGVuY29kZVVSSUNvbXBvbmVudDtcbiAgICByZXR1cm4gJy9iLycgKyBlbmNvZGUodGhpcy5idWNrZXQpICsgJy9vJztcbiAgfVxuXG4gIHN0YXRpYyBtYWtlRnJvbUJ1Y2tldFNwZWMoYnVja2V0U3RyaW5nOiBzdHJpbmcsIGhvc3Q6IHN0cmluZyk6IExvY2F0aW9uIHtcbiAgICBsZXQgYnVja2V0TG9jYXRpb247XG4gICAgdHJ5IHtcbiAgICAgIGJ1Y2tldExvY2F0aW9uID0gTG9jYXRpb24ubWFrZUZyb21VcmwoYnVja2V0U3RyaW5nLCBob3N0KTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAvLyBOb3QgdmFsaWQgVVJMLCB1c2UgYXMtaXMuIFRoaXMgbGV0cyB5b3UgcHV0IGJhcmUgYnVja2V0IG5hbWVzIGluXG4gICAgICAvLyBjb25maWcuXG4gICAgICByZXR1cm4gbmV3IExvY2F0aW9uKGJ1Y2tldFN0cmluZywgJycpO1xuICAgIH1cbiAgICBpZiAoYnVja2V0TG9jYXRpb24ucGF0aCA9PT0gJycpIHtcbiAgICAgIHJldHVybiBidWNrZXRMb2NhdGlvbjtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgaW52YWxpZERlZmF1bHRCdWNrZXQoYnVja2V0U3RyaW5nKTtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgbWFrZUZyb21VcmwodXJsOiBzdHJpbmcsIGhvc3Q6IHN0cmluZyk6IExvY2F0aW9uIHtcbiAgICBsZXQgbG9jYXRpb246IExvY2F0aW9uIHwgbnVsbCA9IG51bGw7XG4gICAgY29uc3QgYnVja2V0RG9tYWluID0gJyhbQS1aYS16MC05LlxcXFwtX10rKSc7XG5cbiAgICBmdW5jdGlvbiBnc01vZGlmeShsb2M6IExvY2F0aW9uKTogdm9pZCB7XG4gICAgICBpZiAobG9jLnBhdGguY2hhckF0KGxvYy5wYXRoLmxlbmd0aCAtIDEpID09PSAnLycpIHtcbiAgICAgICAgbG9jLnBhdGhfID0gbG9jLnBhdGhfLnNsaWNlKDAsIC0xKTtcbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgZ3NQYXRoID0gJygvKC4qKSk/JCc7XG4gICAgY29uc3QgZ3NSZWdleCA9IG5ldyBSZWdFeHAoJ15nczovLycgKyBidWNrZXREb21haW4gKyBnc1BhdGgsICdpJyk7XG4gICAgY29uc3QgZ3NJbmRpY2VzID0geyBidWNrZXQ6IDEsIHBhdGg6IDMgfTtcblxuICAgIGZ1bmN0aW9uIGh0dHBNb2RpZnkobG9jOiBMb2NhdGlvbik6IHZvaWQge1xuICAgICAgbG9jLnBhdGhfID0gZGVjb2RlVVJJQ29tcG9uZW50KGxvYy5wYXRoKTtcbiAgICB9XG4gICAgY29uc3QgdmVyc2lvbiA9ICd2W0EtWmEtejAtOV9dKyc7XG4gICAgY29uc3QgZmlyZWJhc2VTdG9yYWdlSG9zdCA9IGhvc3QucmVwbGFjZSgvWy5dL2csICdcXFxcLicpO1xuICAgIGNvbnN0IGZpcmViYXNlU3RvcmFnZVBhdGggPSAnKC8oW14/I10qKS4qKT8kJztcbiAgICBjb25zdCBmaXJlYmFzZVN0b3JhZ2VSZWdFeHAgPSBuZXcgUmVnRXhwKFxuICAgICAgYF5odHRwcz86Ly8ke2ZpcmViYXNlU3RvcmFnZUhvc3R9LyR7dmVyc2lvbn0vYi8ke2J1Y2tldERvbWFpbn0vbyR7ZmlyZWJhc2VTdG9yYWdlUGF0aH1gLFxuICAgICAgJ2knXG4gICAgKTtcbiAgICBjb25zdCBmaXJlYmFzZVN0b3JhZ2VJbmRpY2VzID0geyBidWNrZXQ6IDEsIHBhdGg6IDMgfTtcblxuICAgIGNvbnN0IGNsb3VkU3RvcmFnZUhvc3QgPVxuICAgICAgaG9zdCA9PT0gREVGQVVMVF9IT1NUXG4gICAgICAgID8gJyg/OnN0b3JhZ2UuZ29vZ2xlYXBpcy5jb218c3RvcmFnZS5jbG91ZC5nb29nbGUuY29tKSdcbiAgICAgICAgOiBob3N0O1xuICAgIGNvbnN0IGNsb3VkU3RvcmFnZVBhdGggPSAnKFtePyNdKiknO1xuICAgIGNvbnN0IGNsb3VkU3RvcmFnZVJlZ0V4cCA9IG5ldyBSZWdFeHAoXG4gICAgICBgXmh0dHBzPzovLyR7Y2xvdWRTdG9yYWdlSG9zdH0vJHtidWNrZXREb21haW59LyR7Y2xvdWRTdG9yYWdlUGF0aH1gLFxuICAgICAgJ2knXG4gICAgKTtcbiAgICBjb25zdCBjbG91ZFN0b3JhZ2VJbmRpY2VzID0geyBidWNrZXQ6IDEsIHBhdGg6IDIgfTtcblxuICAgIGNvbnN0IGdyb3VwcyA9IFtcbiAgICAgIHsgcmVnZXg6IGdzUmVnZXgsIGluZGljZXM6IGdzSW5kaWNlcywgcG9zdE1vZGlmeTogZ3NNb2RpZnkgfSxcbiAgICAgIHtcbiAgICAgICAgcmVnZXg6IGZpcmViYXNlU3RvcmFnZVJlZ0V4cCxcbiAgICAgICAgaW5kaWNlczogZmlyZWJhc2VTdG9yYWdlSW5kaWNlcyxcbiAgICAgICAgcG9zdE1vZGlmeTogaHR0cE1vZGlmeVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgcmVnZXg6IGNsb3VkU3RvcmFnZVJlZ0V4cCxcbiAgICAgICAgaW5kaWNlczogY2xvdWRTdG9yYWdlSW5kaWNlcyxcbiAgICAgICAgcG9zdE1vZGlmeTogaHR0cE1vZGlmeVxuICAgICAgfVxuICAgIF07XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBncm91cHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGdyb3VwID0gZ3JvdXBzW2ldO1xuICAgICAgY29uc3QgY2FwdHVyZXMgPSBncm91cC5yZWdleC5leGVjKHVybCk7XG4gICAgICBpZiAoY2FwdHVyZXMpIHtcbiAgICAgICAgY29uc3QgYnVja2V0VmFsdWUgPSBjYXB0dXJlc1tncm91cC5pbmRpY2VzLmJ1Y2tldF07XG4gICAgICAgIGxldCBwYXRoVmFsdWUgPSBjYXB0dXJlc1tncm91cC5pbmRpY2VzLnBhdGhdO1xuICAgICAgICBpZiAoIXBhdGhWYWx1ZSkge1xuICAgICAgICAgIHBhdGhWYWx1ZSA9ICcnO1xuICAgICAgICB9XG4gICAgICAgIGxvY2F0aW9uID0gbmV3IExvY2F0aW9uKGJ1Y2tldFZhbHVlLCBwYXRoVmFsdWUpO1xuICAgICAgICBncm91cC5wb3N0TW9kaWZ5KGxvY2F0aW9uKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChsb2NhdGlvbiA9PSBudWxsKSB7XG4gICAgICB0aHJvdyBpbnZhbGlkVXJsKHVybCk7XG4gICAgfVxuICAgIHJldHVybiBsb2NhdGlvbjtcbiAgfVxufVxuIiwgIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTENcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5pbXBvcnQgeyBTdG9yYWdlRXJyb3IgfSBmcm9tICcuL2Vycm9yJztcbmltcG9ydCB7IFJlcXVlc3QgfSBmcm9tICcuL3JlcXVlc3QnO1xuXG4vKipcbiAqIEEgcmVxdWVzdCB3aG9zZSBwcm9taXNlIGFsd2F5cyBmYWlscy5cbiAqL1xuZXhwb3J0IGNsYXNzIEZhaWxSZXF1ZXN0PFQ+IGltcGxlbWVudHMgUmVxdWVzdDxUPiB7XG4gIHByb21pc2VfOiBQcm9taXNlPFQ+O1xuXG4gIGNvbnN0cnVjdG9yKGVycm9yOiBTdG9yYWdlRXJyb3IpIHtcbiAgICB0aGlzLnByb21pc2VfID0gUHJvbWlzZS5yZWplY3Q8VD4oZXJyb3IpO1xuICB9XG5cbiAgLyoqIEBpbmhlcml0RG9jICovXG4gIGdldFByb21pc2UoKTogUHJvbWlzZTxUPiB7XG4gICAgcmV0dXJuIHRoaXMucHJvbWlzZV87XG4gIH1cblxuICAvKiogQGluaGVyaXREb2MgKi9cbiAgY2FuY2VsKF9hcHBEZWxldGUgPSBmYWxzZSk6IHZvaWQge31cbn1cbiIsICIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4vKipcbiAqIEBmaWxlb3ZlcnZpZXcgUHJvdmlkZXMgYSBtZXRob2QgZm9yIHJ1bm5pbmcgYSBmdW5jdGlvbiB3aXRoIGV4cG9uZW50aWFsXG4gKiBiYWNrb2ZmLlxuICovXG50eXBlIGlkID0gKHAxOiBib29sZWFuKSA9PiB2b2lkO1xuXG5leHBvcnQgeyBpZCB9O1xuXG4vKipcbiAqIEFjY2VwdHMgYSBjYWxsYmFjayBmb3IgYW4gYWN0aW9uIHRvIHBlcmZvcm0gKGBkb1JlcXVlc3RgKSxcbiAqIGFuZCB0aGVuIGEgY2FsbGJhY2sgZm9yIHdoZW4gdGhlIGJhY2tvZmYgaGFzIGNvbXBsZXRlZCAoYGJhY2tvZmZDb21wbGV0ZUNiYCkuXG4gKiBUaGUgY2FsbGJhY2sgc2VudCB0byBzdGFydCByZXF1aXJlcyBhbiBhcmd1bWVudCB0byBjYWxsIChgb25SZXF1ZXN0Q29tcGxldGVgKS5cbiAqIFdoZW4gYHN0YXJ0YCBjYWxscyBgZG9SZXF1ZXN0YCwgaXQgcGFzc2VzIGEgY2FsbGJhY2sgZm9yIHdoZW4gdGhlIHJlcXVlc3QgaGFzXG4gKiBjb21wbGV0ZWQsIGBvblJlcXVlc3RDb21wbGV0ZWAuIEJhc2VkIG9uIHRoaXMsIHRoZSBiYWNrb2ZmIGNvbnRpbnVlcywgd2l0aFxuICogYW5vdGhlciBjYWxsIHRvIGBkb1JlcXVlc3RgIGFuZCB0aGUgYWJvdmUgbG9vcCBjb250aW51ZXMgdW50aWwgdGhlIHRpbWVvdXRcbiAqIGlzIGhpdCwgb3IgYSBzdWNjZXNzZnVsIHJlc3BvbnNlIG9jY3Vycy5cbiAqIEBkZXNjcmlwdGlvblxuICogQHBhcmFtIGRvUmVxdWVzdCBDYWxsYmFjayB0byBwZXJmb3JtIHJlcXVlc3RcbiAqIEBwYXJhbSBiYWNrb2ZmQ29tcGxldGVDYiBDYWxsYmFjayB0byBjYWxsIHdoZW4gYmFja29mZiBoYXMgYmVlbiBjb21wbGV0ZWRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHN0YXJ0KFxuICBkb1JlcXVlc3Q6IChcbiAgICBvblJlcXVlc3RDb21wbGV0ZTogKHN1Y2Nlc3M6IGJvb2xlYW4pID0+IHZvaWQsXG4gICAgY2FuY2VsZWQ6IGJvb2xlYW5cbiAgKSA9PiB2b2lkLFxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICBiYWNrb2ZmQ29tcGxldGVDYjogKC4uLmFyZ3M6IGFueVtdKSA9PiB1bmtub3duLFxuICB0aW1lb3V0OiBudW1iZXJcbik6IGlkIHtcbiAgLy8gVE9ETyhhbmR5c290byk6IG1ha2UgdGhpcyBjb2RlIGNsZWFuZXIgKHByb2JhYmx5IHJlZmFjdG9yIGludG8gYW4gYWN0dWFsXG4gIC8vIHR5cGUgaW5zdGVhZCBvZiBhIGJ1bmNoIG9mIGZ1bmN0aW9ucyB3aXRoIHN0YXRlIHNoYXJlZCBpbiB0aGUgY2xvc3VyZSlcbiAgbGV0IHdhaXRTZWNvbmRzID0gMTtcbiAgLy8gV291bGQgdHlwZSB0aGlzIGFzIFwibnVtYmVyXCIgYnV0IHRoYXQgZG9lc24ndCB3b3JrIGZvciBOb2RlIHNvIMKvXFxfKOODhClfL8KvXG4gIC8vIFRPRE86IGZpbmQgYSB3YXkgdG8gZXhjbHVkZSBOb2RlIHR5cGUgZGVmaW5pdGlvbiBmb3Igc3RvcmFnZSBiZWNhdXNlIHN0b3JhZ2Ugb25seSB3b3JrcyBpbiBicm93c2VyXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XG4gIGxldCByZXRyeVRpbWVvdXRJZDogYW55ID0gbnVsbDtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbiAgbGV0IGdsb2JhbFRpbWVvdXRJZDogYW55ID0gbnVsbDtcbiAgbGV0IGhpdFRpbWVvdXQgPSBmYWxzZTtcbiAgbGV0IGNhbmNlbFN0YXRlID0gMDtcblxuICBmdW5jdGlvbiBjYW5jZWxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gY2FuY2VsU3RhdGUgPT09IDI7XG4gIH1cbiAgbGV0IHRyaWdnZXJlZENhbGxiYWNrID0gZmFsc2U7XG5cbiAgZnVuY3Rpb24gdHJpZ2dlckNhbGxiYWNrKC4uLmFyZ3M6IGFueVtdKTogdm9pZCB7XG4gICAgaWYgKCF0cmlnZ2VyZWRDYWxsYmFjaykge1xuICAgICAgdHJpZ2dlcmVkQ2FsbGJhY2sgPSB0cnVlO1xuICAgICAgYmFja29mZkNvbXBsZXRlQ2IuYXBwbHkobnVsbCwgYXJncyk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gY2FsbFdpdGhEZWxheShtaWxsaXM6IG51bWJlcik6IHZvaWQge1xuICAgIHJldHJ5VGltZW91dElkID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICByZXRyeVRpbWVvdXRJZCA9IG51bGw7XG4gICAgICBkb1JlcXVlc3QocmVzcG9uc2VIYW5kbGVyLCBjYW5jZWxlZCgpKTtcbiAgICB9LCBtaWxsaXMpO1xuICB9XG5cbiAgZnVuY3Rpb24gY2xlYXJHbG9iYWxUaW1lb3V0KCk6IHZvaWQge1xuICAgIGlmIChnbG9iYWxUaW1lb3V0SWQpIHtcbiAgICAgIGNsZWFyVGltZW91dChnbG9iYWxUaW1lb3V0SWQpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc3BvbnNlSGFuZGxlcihzdWNjZXNzOiBib29sZWFuLCAuLi5hcmdzOiBhbnlbXSk6IHZvaWQge1xuICAgIGlmICh0cmlnZ2VyZWRDYWxsYmFjaykge1xuICAgICAgY2xlYXJHbG9iYWxUaW1lb3V0KCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChzdWNjZXNzKSB7XG4gICAgICBjbGVhckdsb2JhbFRpbWVvdXQoKTtcbiAgICAgIHRyaWdnZXJDYWxsYmFjay5jYWxsKG51bGwsIHN1Y2Nlc3MsIC4uLmFyZ3MpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBtdXN0U3RvcCA9IGNhbmNlbGVkKCkgfHwgaGl0VGltZW91dDtcbiAgICBpZiAobXVzdFN0b3ApIHtcbiAgICAgIGNsZWFyR2xvYmFsVGltZW91dCgpO1xuICAgICAgdHJpZ2dlckNhbGxiYWNrLmNhbGwobnVsbCwgc3VjY2VzcywgLi4uYXJncyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh3YWl0U2Vjb25kcyA8IDY0KSB7XG4gICAgICAvKiBUT0RPKGFuZHlzb3RvKTogZG9uJ3QgYmFjayBvZmYgc28gcXVpY2tseSBpZiB3ZSBrbm93IHdlJ3JlIG9mZmxpbmUuICovXG4gICAgICB3YWl0U2Vjb25kcyAqPSAyO1xuICAgIH1cbiAgICBsZXQgd2FpdE1pbGxpcztcbiAgICBpZiAoY2FuY2VsU3RhdGUgPT09IDEpIHtcbiAgICAgIGNhbmNlbFN0YXRlID0gMjtcbiAgICAgIHdhaXRNaWxsaXMgPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICB3YWl0TWlsbGlzID0gKHdhaXRTZWNvbmRzICsgTWF0aC5yYW5kb20oKSkgKiAxMDAwO1xuICAgIH1cbiAgICBjYWxsV2l0aERlbGF5KHdhaXRNaWxsaXMpO1xuICB9XG4gIGxldCBzdG9wcGVkID0gZmFsc2U7XG5cbiAgZnVuY3Rpb24gc3RvcCh3YXNUaW1lb3V0OiBib29sZWFuKTogdm9pZCB7XG4gICAgaWYgKHN0b3BwZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgc3RvcHBlZCA9IHRydWU7XG4gICAgY2xlYXJHbG9iYWxUaW1lb3V0KCk7XG4gICAgaWYgKHRyaWdnZXJlZENhbGxiYWNrKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChyZXRyeVRpbWVvdXRJZCAhPT0gbnVsbCkge1xuICAgICAgaWYgKCF3YXNUaW1lb3V0KSB7XG4gICAgICAgIGNhbmNlbFN0YXRlID0gMjtcbiAgICAgIH1cbiAgICAgIGNsZWFyVGltZW91dChyZXRyeVRpbWVvdXRJZCk7XG4gICAgICBjYWxsV2l0aERlbGF5KDApO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoIXdhc1RpbWVvdXQpIHtcbiAgICAgICAgY2FuY2VsU3RhdGUgPSAxO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBjYWxsV2l0aERlbGF5KDApO1xuICBnbG9iYWxUaW1lb3V0SWQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICBoaXRUaW1lb3V0ID0gdHJ1ZTtcbiAgICBzdG9wKHRydWUpO1xuICB9LCB0aW1lb3V0KTtcbiAgcmV0dXJuIHN0b3A7XG59XG5cbi8qKlxuICogU3RvcHMgdGhlIHJldHJ5IGxvb3AgZnJvbSByZXBlYXRpbmcuXG4gKiBJZiB0aGUgZnVuY3Rpb24gaXMgY3VycmVudGx5IFwiaW4gYmV0d2VlblwiIHJldHJpZXMsIGl0IGlzIGludm9rZWQgaW1tZWRpYXRlbHlcbiAqIHdpdGggdGhlIHNlY29uZCBwYXJhbWV0ZXIgYXMgXCJ0cnVlXCIuIE90aGVyd2lzZSwgaXQgd2lsbCBiZSBpbnZva2VkIG9uY2UgbW9yZVxuICogYWZ0ZXIgdGhlIGN1cnJlbnQgaW52b2NhdGlvbiBmaW5pc2hlcyBpZmYgdGhlIGN1cnJlbnQgaW52b2NhdGlvbiB3b3VsZCBoYXZlXG4gKiB0cmlnZ2VyZWQgYW5vdGhlciByZXRyeS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHN0b3AoaWQ6IGlkKTogdm9pZCB7XG4gIGlkKGZhbHNlKTtcbn1cbiIsICIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBpbnZhbGlkQXJndW1lbnQgfSBmcm9tICcuL2Vycm9yJztcblxuZXhwb3J0IGZ1bmN0aW9uIGlzSnVzdERlZjxUPihwOiBUIHwgbnVsbCB8IHVuZGVmaW5lZCk6IHAgaXMgVCB8IG51bGwge1xuICByZXR1cm4gcCAhPT0gdm9pZCAwO1xufVxuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L2Jhbi10eXBlc1xuZXhwb3J0IGZ1bmN0aW9uIGlzRnVuY3Rpb24ocDogdW5rbm93bik6IHAgaXMgRnVuY3Rpb24ge1xuICByZXR1cm4gdHlwZW9mIHAgPT09ICdmdW5jdGlvbic7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc05vbkFycmF5T2JqZWN0KHA6IHVua25vd24pOiBib29sZWFuIHtcbiAgcmV0dXJuIHR5cGVvZiBwID09PSAnb2JqZWN0JyAmJiAhQXJyYXkuaXNBcnJheShwKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzU3RyaW5nKHA6IHVua25vd24pOiBwIGlzIHN0cmluZyB7XG4gIHJldHVybiB0eXBlb2YgcCA9PT0gJ3N0cmluZycgfHwgcCBpbnN0YW5jZW9mIFN0cmluZztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzTmF0aXZlQmxvYihwOiB1bmtub3duKTogcCBpcyBCbG9iIHtcbiAgcmV0dXJuIGlzTmF0aXZlQmxvYkRlZmluZWQoKSAmJiBwIGluc3RhbmNlb2YgQmxvYjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzTmF0aXZlQmxvYkRlZmluZWQoKTogYm9vbGVhbiB7XG4gIHJldHVybiB0eXBlb2YgQmxvYiAhPT0gJ3VuZGVmaW5lZCc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZU51bWJlcihcbiAgYXJndW1lbnQ6IHN0cmluZyxcbiAgbWluVmFsdWU6IG51bWJlcixcbiAgbWF4VmFsdWU6IG51bWJlcixcbiAgdmFsdWU6IG51bWJlclxuKTogdm9pZCB7XG4gIGlmICh2YWx1ZSA8IG1pblZhbHVlKSB7XG4gICAgdGhyb3cgaW52YWxpZEFyZ3VtZW50KFxuICAgICAgYEludmFsaWQgdmFsdWUgZm9yICcke2FyZ3VtZW50fScuIEV4cGVjdGVkICR7bWluVmFsdWV9IG9yIGdyZWF0ZXIuYFxuICAgICk7XG4gIH1cbiAgaWYgKHZhbHVlID4gbWF4VmFsdWUpIHtcbiAgICB0aHJvdyBpbnZhbGlkQXJndW1lbnQoXG4gICAgICBgSW52YWxpZCB2YWx1ZSBmb3IgJyR7YXJndW1lbnR9Jy4gRXhwZWN0ZWQgJHttYXhWYWx1ZX0gb3IgbGVzcy5gXG4gICAgKTtcbiAgfVxufVxuIiwgIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTENcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8qKlxuICogQGZpbGVvdmVydmlldyBGdW5jdGlvbnMgdG8gY3JlYXRlIGFuZCBtYW5pcHVsYXRlIFVSTHMgZm9yIHRoZSBzZXJ2ZXIgQVBJLlxuICovXG5pbXBvcnQgeyBVcmxQYXJhbXMgfSBmcm9tICcuL3JlcXVlc3RpbmZvJztcblxuZXhwb3J0IGZ1bmN0aW9uIG1ha2VVcmwoXG4gIHVybFBhcnQ6IHN0cmluZyxcbiAgaG9zdDogc3RyaW5nLFxuICBwcm90b2NvbDogc3RyaW5nXG4pOiBzdHJpbmcge1xuICBsZXQgb3JpZ2luID0gaG9zdDtcbiAgaWYgKHByb3RvY29sID09IG51bGwpIHtcbiAgICBvcmlnaW4gPSBgaHR0cHM6Ly8ke2hvc3R9YDtcbiAgfVxuICByZXR1cm4gYCR7cHJvdG9jb2x9Oi8vJHtvcmlnaW59L3YwJHt1cmxQYXJ0fWA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYWtlUXVlcnlTdHJpbmcocGFyYW1zOiBVcmxQYXJhbXMpOiBzdHJpbmcge1xuICBjb25zdCBlbmNvZGUgPSBlbmNvZGVVUklDb21wb25lbnQ7XG4gIGxldCBxdWVyeVBhcnQgPSAnPyc7XG4gIGZvciAoY29uc3Qga2V5IGluIHBhcmFtcykge1xuICAgIGlmIChwYXJhbXMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgY29uc3QgbmV4dFBhcnQgPSBlbmNvZGUoa2V5KSArICc9JyArIGVuY29kZShwYXJhbXNba2V5XSk7XG4gICAgICBxdWVyeVBhcnQgPSBxdWVyeVBhcnQgKyBuZXh0UGFydCArICcmJztcbiAgICB9XG4gIH1cblxuICAvLyBDaG9wIG9mZiB0aGUgZXh0cmEgJyYnIG9yICc/JyBvbiB0aGUgZW5kXG4gIHF1ZXJ5UGFydCA9IHF1ZXJ5UGFydC5zbGljZSgwLCAtMSk7XG4gIHJldHVybiBxdWVyeVBhcnQ7XG59XG4iLCAiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQ1xuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLyoqIE5ldHdvcmsgaGVhZGVycyAqL1xuZXhwb3J0IHR5cGUgSGVhZGVycyA9IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG5cbi8qKiBSZXNwb25zZSB0eXBlIGV4cG9zZWQgYnkgdGhlIG5ldHdvcmtpbmcgQVBJcy4gKi9cbmV4cG9ydCB0eXBlIENvbm5lY3Rpb25UeXBlID1cbiAgfCBzdHJpbmdcbiAgfCBBcnJheUJ1ZmZlclxuICB8IEJsb2JcbiAgfCBOb2RlSlMuUmVhZGFibGVTdHJlYW07XG5cbi8qKlxuICogQSBsaWdodHdlaWdodCB3cmFwcGVyIGFyb3VuZCBYTUxIdHRwUmVxdWVzdCB3aXRoIGFcbiAqIGdvb2cubmV0LlhocklvLWxpa2UgaW50ZXJmYWNlLlxuICpcbiAqIFlvdSBjYW4gY3JlYXRlIGEgbmV3IGNvbm5lY3Rpb24gYnkgaW52b2tpbmcgYG5ld1RleHRDb25uZWN0aW9uKClgLFxuICogYG5ld0J5dGVzQ29ubmVjdGlvbigpYCBvciBgbmV3U3RyZWFtQ29ubmVjdGlvbigpYC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDb25uZWN0aW9uPFQgZXh0ZW5kcyBDb25uZWN0aW9uVHlwZT4ge1xuICAvKipcbiAgICogU2VuZHMgYSByZXF1ZXN0IHRvIHRoZSBwcm92aWRlZCBVUkwuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIG5ldmVyIHJlamVjdHMgaXRzIHByb21pc2UuIEluIGNhc2Ugb2YgZW5jb3VudGVyaW5nIGFuIGVycm9yLFxuICAgKiBpdCBzZXRzIGFuIGVycm9yIGNvZGUgaW50ZXJuYWxseSB3aGljaCBjYW4gYmUgYWNjZXNzZWQgYnkgY2FsbGluZ1xuICAgKiBnZXRFcnJvckNvZGUoKSBieSBjYWxsZXJzLlxuICAgKi9cbiAgc2VuZChcbiAgICB1cmw6IHN0cmluZyxcbiAgICBtZXRob2Q6IHN0cmluZyxcbiAgICBib2R5PzogQXJyYXlCdWZmZXJWaWV3IHwgQmxvYiB8IHN0cmluZyB8IG51bGwsXG4gICAgaGVhZGVycz86IEhlYWRlcnNcbiAgKTogUHJvbWlzZTx2b2lkPjtcblxuICBnZXRFcnJvckNvZGUoKTogRXJyb3JDb2RlO1xuXG4gIGdldFN0YXR1cygpOiBudW1iZXI7XG5cbiAgZ2V0UmVzcG9uc2UoKTogVDtcblxuICBnZXRFcnJvclRleHQoKTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBYm9ydCB0aGUgcmVxdWVzdC5cbiAgICovXG4gIGFib3J0KCk6IHZvaWQ7XG5cbiAgZ2V0UmVzcG9uc2VIZWFkZXIoaGVhZGVyOiBzdHJpbmcpOiBzdHJpbmcgfCBudWxsO1xuXG4gIGFkZFVwbG9hZFByb2dyZXNzTGlzdGVuZXIobGlzdGVuZXI6IChwMTogUHJvZ3Jlc3NFdmVudCkgPT4gdm9pZCk6IHZvaWQ7XG5cbiAgcmVtb3ZlVXBsb2FkUHJvZ3Jlc3NMaXN0ZW5lcihsaXN0ZW5lcjogKHAxOiBQcm9ncmVzc0V2ZW50KSA9PiB2b2lkKTogdm9pZDtcbn1cblxuLyoqXG4gKiBFcnJvciBjb2RlcyBmb3IgcmVxdWVzdHMgbWFkZSBieSB0aGUgdGhlIFhocklvIHdyYXBwZXIuXG4gKi9cbmV4cG9ydCBlbnVtIEVycm9yQ29kZSB7XG4gIE5PX0VSUk9SID0gMCxcbiAgTkVUV09SS19FUlJPUiA9IDEsXG4gIEFCT1JUID0gMlxufVxuIiwgIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIyIEdvb2dsZSBMTENcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8qKlxuICogQ2hlY2tzIHRoZSBzdGF0dXMgY29kZSB0byBzZWUgaWYgdGhlIGFjdGlvbiBzaG91bGQgYmUgcmV0cmllZC5cbiAqXG4gKiBAcGFyYW0gc3RhdHVzIEN1cnJlbnQgSFRUUCBzdGF0dXMgY29kZSByZXR1cm5lZCBieSBzZXJ2ZXIuXG4gKiBAcGFyYW0gYWRkaXRpb25hbFJldHJ5Q29kZXMgYWRkaXRpb25hbCByZXRyeSBjb2RlcyB0byBjaGVjayBhZ2FpbnN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1JldHJ5U3RhdHVzQ29kZShcbiAgc3RhdHVzOiBudW1iZXIsXG4gIGFkZGl0aW9uYWxSZXRyeUNvZGVzOiBudW1iZXJbXVxuKTogYm9vbGVhbiB7XG4gIC8vIFRoZSBjb2RlcyBmb3Igd2hpY2ggdG8gcmV0cnkgY2FtZSBmcm9tIHRoaXMgcGFnZTpcbiAgLy8gaHR0cHM6Ly9jbG91ZC5nb29nbGUuY29tL3N0b3JhZ2UvZG9jcy9leHBvbmVudGlhbC1iYWNrb2ZmXG4gIGNvbnN0IGlzRml2ZUh1bmRyZWRDb2RlID0gc3RhdHVzID49IDUwMCAmJiBzdGF0dXMgPCA2MDA7XG4gIGNvbnN0IGV4dHJhUmV0cnlDb2RlcyA9IFtcbiAgICAvLyBSZXF1ZXN0IFRpbWVvdXQ6IHdlYiBzZXJ2ZXIgZGlkbid0IHJlY2VpdmUgZnVsbCByZXF1ZXN0IGluIHRpbWUuXG4gICAgNDA4LFxuICAgIC8vIFRvbyBNYW55IFJlcXVlc3RzOiB5b3UncmUgZ2V0dGluZyByYXRlLWxpbWl0ZWQsIGJhc2ljYWxseS5cbiAgICA0MjlcbiAgXTtcbiAgY29uc3QgaXNFeHRyYVJldHJ5Q29kZSA9IGV4dHJhUmV0cnlDb2Rlcy5pbmRleE9mKHN0YXR1cykgIT09IC0xO1xuICBjb25zdCBpc0FkZGl0aW9uYWxSZXRyeUNvZGUgPSBhZGRpdGlvbmFsUmV0cnlDb2Rlcy5pbmRleE9mKHN0YXR1cykgIT09IC0xO1xuICByZXR1cm4gaXNGaXZlSHVuZHJlZENvZGUgfHwgaXNFeHRyYVJldHJ5Q29kZSB8fCBpc0FkZGl0aW9uYWxSZXRyeUNvZGU7XG59XG4iLCAiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQ1xuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IERlZmluZXMgbWV0aG9kcyB1c2VkIHRvIGFjdHVhbGx5IHNlbmQgSFRUUCByZXF1ZXN0cyBmcm9tXG4gKiBhYnN0cmFjdCByZXByZXNlbnRhdGlvbnMuXG4gKi9cblxuaW1wb3J0IHsgaWQgYXMgYmFja29mZklkLCBzdGFydCwgc3RvcCB9IGZyb20gJy4vYmFja29mZic7XG5pbXBvcnQgeyBhcHBEZWxldGVkLCBjYW5jZWxlZCwgcmV0cnlMaW1pdEV4Y2VlZGVkLCB1bmtub3duIH0gZnJvbSAnLi9lcnJvcic7XG5pbXBvcnQgeyBFcnJvckhhbmRsZXIsIFJlcXVlc3RIYW5kbGVyLCBSZXF1ZXN0SW5mbyB9IGZyb20gJy4vcmVxdWVzdGluZm8nO1xuaW1wb3J0IHsgaXNKdXN0RGVmIH0gZnJvbSAnLi90eXBlJztcbmltcG9ydCB7IG1ha2VRdWVyeVN0cmluZyB9IGZyb20gJy4vdXJsJztcbmltcG9ydCB7IENvbm5lY3Rpb24sIEVycm9yQ29kZSwgSGVhZGVycywgQ29ubmVjdGlvblR5cGUgfSBmcm9tICcuL2Nvbm5lY3Rpb24nO1xuaW1wb3J0IHsgaXNSZXRyeVN0YXR1c0NvZGUgfSBmcm9tICcuL3V0aWxzJztcblxuZXhwb3J0IGludGVyZmFjZSBSZXF1ZXN0PFQ+IHtcbiAgZ2V0UHJvbWlzZSgpOiBQcm9taXNlPFQ+O1xuXG4gIC8qKlxuICAgKiBDYW5jZWxzIHRoZSByZXF1ZXN0LiBJTVBPUlRBTlQ6IHRoZSBwcm9taXNlIG1heSBzdGlsbCBiZSByZXNvbHZlZCB3aXRoIGFuXG4gICAqIGFwcHJvcHJpYXRlIHZhbHVlIChpZiB0aGUgcmVxdWVzdCBpcyBmaW5pc2hlZCBiZWZvcmUgeW91IGNhbGwgdGhpcyBtZXRob2QsXG4gICAqIGJ1dCB0aGUgcHJvbWlzZSBoYXMgbm90IHlldCBiZWVuIHJlc29sdmVkKSwgc28gZG9uJ3QganVzdCBhc3N1bWUgaXQgd2lsbCBiZVxuICAgKiByZWplY3RlZCBpZiB5b3UgY2FsbCB0aGlzIGZ1bmN0aW9uLlxuICAgKiBAcGFyYW0gYXBwRGVsZXRlIC0gVHJ1ZSBpZiB0aGUgY2FuY2VsYXRpb24gY2FtZSBmcm9tIHRoZSBhcHAgYmVpbmcgZGVsZXRlZC5cbiAgICovXG4gIGNhbmNlbChhcHBEZWxldGU/OiBib29sZWFuKTogdm9pZDtcbn1cblxuLyoqXG4gKiBIYW5kbGVzIG5ldHdvcmsgbG9naWMgZm9yIGFsbCBTdG9yYWdlIFJlcXVlc3RzLCBpbmNsdWRpbmcgZXJyb3IgcmVwb3J0aW5nIGFuZFxuICogcmV0cmllcyB3aXRoIGJhY2tvZmYuXG4gKlxuICogQHBhcmFtIEkgLSB0aGUgdHlwZSBvZiB0aGUgYmFja2VuZCdzIG5ldHdvcmsgcmVzcG9uc2UuXG4gKiBAcGFyYW0gLSBPIHRoZSBvdXRwdXQgdHlwZSB1c2VkIGJ5IHRoZSByZXN0IG9mIHRoZSBTREsuIFRoZSBjb252ZXJzaW9uXG4gKiBoYXBwZW5zIGluIHRoZSBzcGVjaWZpZWQgYGNhbGxiYWNrX2AuXG4gKi9cbmNsYXNzIE5ldHdvcmtSZXF1ZXN0PEkgZXh0ZW5kcyBDb25uZWN0aW9uVHlwZSwgTz4gaW1wbGVtZW50cyBSZXF1ZXN0PE8+IHtcbiAgcHJpdmF0ZSBwZW5kaW5nQ29ubmVjdGlvbl86IENvbm5lY3Rpb248ST4gfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBiYWNrb2ZmSWRfOiBiYWNrb2ZmSWQgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSByZXNvbHZlXyE6ICh2YWx1ZT86IE8gfCBQcm9taXNlTGlrZTxPPikgPT4gdm9pZDtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbiAgcHJpdmF0ZSByZWplY3RfITogKHJlYXNvbj86IGFueSkgPT4gdm9pZDtcbiAgcHJpdmF0ZSBjYW5jZWxlZF86IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHJpdmF0ZSBhcHBEZWxldGVfOiBib29sZWFuID0gZmFsc2U7XG4gIHByaXZhdGUgcHJvbWlzZV86IFByb21pc2U8Tz47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSB1cmxfOiBzdHJpbmcsXG4gICAgcHJpdmF0ZSBtZXRob2RfOiBzdHJpbmcsXG4gICAgcHJpdmF0ZSBoZWFkZXJzXzogSGVhZGVycyxcbiAgICBwcml2YXRlIGJvZHlfOiBzdHJpbmcgfCBCbG9iIHwgVWludDhBcnJheSB8IG51bGwsXG4gICAgcHJpdmF0ZSBzdWNjZXNzQ29kZXNfOiBudW1iZXJbXSxcbiAgICBwcml2YXRlIGFkZGl0aW9uYWxSZXRyeUNvZGVzXzogbnVtYmVyW10sXG4gICAgcHJpdmF0ZSBjYWxsYmFja186IFJlcXVlc3RIYW5kbGVyPEksIE8+LFxuICAgIHByaXZhdGUgZXJyb3JDYWxsYmFja186IEVycm9ySGFuZGxlciB8IG51bGwsXG4gICAgcHJpdmF0ZSB0aW1lb3V0XzogbnVtYmVyLFxuICAgIHByaXZhdGUgcHJvZ3Jlc3NDYWxsYmFja186ICgocDE6IG51bWJlciwgcDI6IG51bWJlcikgPT4gdm9pZCkgfCBudWxsLFxuICAgIHByaXZhdGUgY29ubmVjdGlvbkZhY3RvcnlfOiAoKSA9PiBDb25uZWN0aW9uPEk+LFxuICAgIHByaXZhdGUgcmV0cnkgPSB0cnVlXG4gICkge1xuICAgIHRoaXMucHJvbWlzZV8gPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLnJlc29sdmVfID0gcmVzb2x2ZSBhcyAodmFsdWU/OiBPIHwgUHJvbWlzZUxpa2U8Tz4pID0+IHZvaWQ7XG4gICAgICB0aGlzLnJlamVjdF8gPSByZWplY3Q7XG4gICAgICB0aGlzLnN0YXJ0XygpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEFjdHVhbGx5IHN0YXJ0cyB0aGUgcmV0cnkgbG9vcC5cbiAgICovXG4gIHByaXZhdGUgc3RhcnRfKCk6IHZvaWQge1xuICAgIGNvbnN0IGRvVGhlUmVxdWVzdDogKFxuICAgICAgYmFja29mZkNhbGxiYWNrOiAoc3VjY2VzczogYm9vbGVhbiwgLi4ucDI6IHVua25vd25bXSkgPT4gdm9pZCxcbiAgICAgIGNhbmNlbGVkOiBib29sZWFuXG4gICAgKSA9PiB2b2lkID0gKGJhY2tvZmZDYWxsYmFjaywgY2FuY2VsZWQpID0+IHtcbiAgICAgIGlmIChjYW5jZWxlZCkge1xuICAgICAgICBiYWNrb2ZmQ2FsbGJhY2soZmFsc2UsIG5ldyBSZXF1ZXN0RW5kU3RhdHVzKGZhbHNlLCBudWxsLCB0cnVlKSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGNvbm5lY3Rpb24gPSB0aGlzLmNvbm5lY3Rpb25GYWN0b3J5XygpO1xuICAgICAgdGhpcy5wZW5kaW5nQ29ubmVjdGlvbl8gPSBjb25uZWN0aW9uO1xuXG4gICAgICBjb25zdCBwcm9ncmVzc0xpc3RlbmVyOiAoXG4gICAgICAgIHByb2dyZXNzRXZlbnQ6IFByb2dyZXNzRXZlbnRcbiAgICAgICkgPT4gdm9pZCA9IHByb2dyZXNzRXZlbnQgPT4ge1xuICAgICAgICBjb25zdCBsb2FkZWQgPSBwcm9ncmVzc0V2ZW50LmxvYWRlZDtcbiAgICAgICAgY29uc3QgdG90YWwgPSBwcm9ncmVzc0V2ZW50Lmxlbmd0aENvbXB1dGFibGUgPyBwcm9ncmVzc0V2ZW50LnRvdGFsIDogLTE7XG4gICAgICAgIGlmICh0aGlzLnByb2dyZXNzQ2FsbGJhY2tfICE9PSBudWxsKSB7XG4gICAgICAgICAgdGhpcy5wcm9ncmVzc0NhbGxiYWNrXyhsb2FkZWQsIHRvdGFsKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGlmICh0aGlzLnByb2dyZXNzQ2FsbGJhY2tfICE9PSBudWxsKSB7XG4gICAgICAgIGNvbm5lY3Rpb24uYWRkVXBsb2FkUHJvZ3Jlc3NMaXN0ZW5lcihwcm9ncmVzc0xpc3RlbmVyKTtcbiAgICAgIH1cblxuICAgICAgLy8gY29ubmVjdGlvbi5zZW5kKCkgbmV2ZXIgcmVqZWN0cywgc28gd2UgZG9uJ3QgbmVlZCB0byBoYXZlIGEgZXJyb3IgaGFuZGxlciBvciB1c2UgY2F0Y2ggb24gdGhlIHJldHVybmVkIHByb21pc2UuXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWZsb2F0aW5nLXByb21pc2VzXG4gICAgICBjb25uZWN0aW9uXG4gICAgICAgIC5zZW5kKHRoaXMudXJsXywgdGhpcy5tZXRob2RfLCB0aGlzLmJvZHlfLCB0aGlzLmhlYWRlcnNfKVxuICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgaWYgKHRoaXMucHJvZ3Jlc3NDYWxsYmFja18gIT09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbm5lY3Rpb24ucmVtb3ZlVXBsb2FkUHJvZ3Jlc3NMaXN0ZW5lcihwcm9ncmVzc0xpc3RlbmVyKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5wZW5kaW5nQ29ubmVjdGlvbl8gPSBudWxsO1xuICAgICAgICAgIGNvbnN0IGhpdFNlcnZlciA9IGNvbm5lY3Rpb24uZ2V0RXJyb3JDb2RlKCkgPT09IEVycm9yQ29kZS5OT19FUlJPUjtcbiAgICAgICAgICBjb25zdCBzdGF0dXMgPSBjb25uZWN0aW9uLmdldFN0YXR1cygpO1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICFoaXRTZXJ2ZXIgfHxcbiAgICAgICAgICAgIChpc1JldHJ5U3RhdHVzQ29kZShzdGF0dXMsIHRoaXMuYWRkaXRpb25hbFJldHJ5Q29kZXNfKSAmJlxuICAgICAgICAgICAgICB0aGlzLnJldHJ5KVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgY29uc3Qgd2FzQ2FuY2VsZWQgPSBjb25uZWN0aW9uLmdldEVycm9yQ29kZSgpID09PSBFcnJvckNvZGUuQUJPUlQ7XG4gICAgICAgICAgICBiYWNrb2ZmQ2FsbGJhY2soXG4gICAgICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgICAgICBuZXcgUmVxdWVzdEVuZFN0YXR1cyhmYWxzZSwgbnVsbCwgd2FzQ2FuY2VsZWQpXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zdCBzdWNjZXNzQ29kZSA9IHRoaXMuc3VjY2Vzc0NvZGVzXy5pbmRleE9mKHN0YXR1cykgIT09IC0xO1xuICAgICAgICAgIGJhY2tvZmZDYWxsYmFjayh0cnVlLCBuZXcgUmVxdWVzdEVuZFN0YXR1cyhzdWNjZXNzQ29kZSwgY29ubmVjdGlvbikpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHJlcXVlc3RXZW50VGhyb3VnaCAtIFRydWUgaWYgdGhlIHJlcXVlc3QgZXZlbnR1YWxseSB3ZW50XG4gICAgICogICAgIHRocm91Z2gsIGZhbHNlIGlmIGl0IGhpdCB0aGUgcmV0cnkgbGltaXQgb3Igd2FzIGNhbmNlbGVkLlxuICAgICAqL1xuICAgIGNvbnN0IGJhY2tvZmZEb25lOiAoXG4gICAgICByZXF1ZXN0V2VudFRocm91Z2g6IGJvb2xlYW4sXG4gICAgICBzdGF0dXM6IFJlcXVlc3RFbmRTdGF0dXM8ST5cbiAgICApID0+IHZvaWQgPSAocmVxdWVzdFdlbnRUaHJvdWdoLCBzdGF0dXMpID0+IHtcbiAgICAgIGNvbnN0IHJlc29sdmUgPSB0aGlzLnJlc29sdmVfO1xuICAgICAgY29uc3QgcmVqZWN0ID0gdGhpcy5yZWplY3RfO1xuICAgICAgY29uc3QgY29ubmVjdGlvbiA9IHN0YXR1cy5jb25uZWN0aW9uIGFzIENvbm5lY3Rpb248ST47XG4gICAgICBpZiAoc3RhdHVzLndhc1N1Y2Nlc3NDb2RlKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy5jYWxsYmFja18oY29ubmVjdGlvbiwgY29ubmVjdGlvbi5nZXRSZXNwb25zZSgpKTtcbiAgICAgICAgICBpZiAoaXNKdXN0RGVmKHJlc3VsdCkpIHtcbiAgICAgICAgICAgIHJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIHJlamVjdChlKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGNvbm5lY3Rpb24gIT09IG51bGwpIHtcbiAgICAgICAgICBjb25zdCBlcnIgPSB1bmtub3duKCk7XG4gICAgICAgICAgZXJyLnNlcnZlclJlc3BvbnNlID0gY29ubmVjdGlvbi5nZXRFcnJvclRleHQoKTtcbiAgICAgICAgICBpZiAodGhpcy5lcnJvckNhbGxiYWNrXykge1xuICAgICAgICAgICAgcmVqZWN0KHRoaXMuZXJyb3JDYWxsYmFja18oY29ubmVjdGlvbiwgZXJyKSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoc3RhdHVzLmNhbmNlbGVkKSB7XG4gICAgICAgICAgICBjb25zdCBlcnIgPSB0aGlzLmFwcERlbGV0ZV8gPyBhcHBEZWxldGVkKCkgOiBjYW5jZWxlZCgpO1xuICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGVyciA9IHJldHJ5TGltaXRFeGNlZWRlZCgpO1xuICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICBpZiAodGhpcy5jYW5jZWxlZF8pIHtcbiAgICAgIGJhY2tvZmZEb25lKGZhbHNlLCBuZXcgUmVxdWVzdEVuZFN0YXR1cyhmYWxzZSwgbnVsbCwgdHJ1ZSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmJhY2tvZmZJZF8gPSBzdGFydChkb1RoZVJlcXVlc3QsIGJhY2tvZmZEb25lLCB0aGlzLnRpbWVvdXRfKTtcbiAgICB9XG4gIH1cblxuICAvKiogQGluaGVyaXREb2MgKi9cbiAgZ2V0UHJvbWlzZSgpOiBQcm9taXNlPE8+IHtcbiAgICByZXR1cm4gdGhpcy5wcm9taXNlXztcbiAgfVxuXG4gIC8qKiBAaW5oZXJpdERvYyAqL1xuICBjYW5jZWwoYXBwRGVsZXRlPzogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuY2FuY2VsZWRfID0gdHJ1ZTtcbiAgICB0aGlzLmFwcERlbGV0ZV8gPSBhcHBEZWxldGUgfHwgZmFsc2U7XG4gICAgaWYgKHRoaXMuYmFja29mZklkXyAhPT0gbnVsbCkge1xuICAgICAgc3RvcCh0aGlzLmJhY2tvZmZJZF8pO1xuICAgIH1cbiAgICBpZiAodGhpcy5wZW5kaW5nQ29ubmVjdGlvbl8gIT09IG51bGwpIHtcbiAgICAgIHRoaXMucGVuZGluZ0Nvbm5lY3Rpb25fLmFib3J0KCk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQSBjb2xsZWN0aW9uIG9mIGluZm9ybWF0aW9uIGFib3V0IHRoZSByZXN1bHQgb2YgYSBuZXR3b3JrIHJlcXVlc3QuXG4gKiBAcGFyYW0gb3B0X2NhbmNlbGVkIC0gRGVmYXVsdHMgdG8gZmFsc2UuXG4gKi9cbmV4cG9ydCBjbGFzcyBSZXF1ZXN0RW5kU3RhdHVzPEkgZXh0ZW5kcyBDb25uZWN0aW9uVHlwZT4ge1xuICAvKipcbiAgICogVHJ1ZSBpZiB0aGUgcmVxdWVzdCB3YXMgY2FuY2VsZWQuXG4gICAqL1xuICBjYW5jZWxlZDogYm9vbGVhbjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgd2FzU3VjY2Vzc0NvZGU6IGJvb2xlYW4sXG4gICAgcHVibGljIGNvbm5lY3Rpb246IENvbm5lY3Rpb248ST4gfCBudWxsLFxuICAgIGNhbmNlbGVkPzogYm9vbGVhblxuICApIHtcbiAgICB0aGlzLmNhbmNlbGVkID0gISFjYW5jZWxlZDtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYWRkQXV0aEhlYWRlcl8oXG4gIGhlYWRlcnM6IEhlYWRlcnMsXG4gIGF1dGhUb2tlbjogc3RyaW5nIHwgbnVsbFxuKTogdm9pZCB7XG4gIGlmIChhdXRoVG9rZW4gIT09IG51bGwgJiYgYXV0aFRva2VuLmxlbmd0aCA+IDApIHtcbiAgICBoZWFkZXJzWydBdXRob3JpemF0aW9uJ10gPSAnRmlyZWJhc2UgJyArIGF1dGhUb2tlbjtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYWRkVmVyc2lvbkhlYWRlcl8oXG4gIGhlYWRlcnM6IEhlYWRlcnMsXG4gIGZpcmViYXNlVmVyc2lvbj86IHN0cmluZ1xuKTogdm9pZCB7XG4gIGhlYWRlcnNbJ1gtRmlyZWJhc2UtU3RvcmFnZS1WZXJzaW9uJ10gPVxuICAgICd3ZWJqcy8nICsgKGZpcmViYXNlVmVyc2lvbiA/PyAnQXBwTWFuYWdlcicpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYWRkR21waWRIZWFkZXJfKGhlYWRlcnM6IEhlYWRlcnMsIGFwcElkOiBzdHJpbmcgfCBudWxsKTogdm9pZCB7XG4gIGlmIChhcHBJZCkge1xuICAgIGhlYWRlcnNbJ1gtRmlyZWJhc2UtR01QSUQnXSA9IGFwcElkO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRBcHBDaGVja0hlYWRlcl8oXG4gIGhlYWRlcnM6IEhlYWRlcnMsXG4gIGFwcENoZWNrVG9rZW46IHN0cmluZyB8IG51bGxcbik6IHZvaWQge1xuICBpZiAoYXBwQ2hlY2tUb2tlbiAhPT0gbnVsbCkge1xuICAgIGhlYWRlcnNbJ1gtRmlyZWJhc2UtQXBwQ2hlY2snXSA9IGFwcENoZWNrVG9rZW47XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1ha2VSZXF1ZXN0PEkgZXh0ZW5kcyBDb25uZWN0aW9uVHlwZSwgTz4oXG4gIHJlcXVlc3RJbmZvOiBSZXF1ZXN0SW5mbzxJLCBPPixcbiAgYXBwSWQ6IHN0cmluZyB8IG51bGwsXG4gIGF1dGhUb2tlbjogc3RyaW5nIHwgbnVsbCxcbiAgYXBwQ2hlY2tUb2tlbjogc3RyaW5nIHwgbnVsbCxcbiAgcmVxdWVzdEZhY3Rvcnk6ICgpID0+IENvbm5lY3Rpb248ST4sXG4gIGZpcmViYXNlVmVyc2lvbj86IHN0cmluZyxcbiAgcmV0cnkgPSB0cnVlXG4pOiBSZXF1ZXN0PE8+IHtcbiAgY29uc3QgcXVlcnlQYXJ0ID0gbWFrZVF1ZXJ5U3RyaW5nKHJlcXVlc3RJbmZvLnVybFBhcmFtcyk7XG4gIGNvbnN0IHVybCA9IHJlcXVlc3RJbmZvLnVybCArIHF1ZXJ5UGFydDtcbiAgY29uc3QgaGVhZGVycyA9IE9iamVjdC5hc3NpZ24oe30sIHJlcXVlc3RJbmZvLmhlYWRlcnMpO1xuICBhZGRHbXBpZEhlYWRlcl8oaGVhZGVycywgYXBwSWQpO1xuICBhZGRBdXRoSGVhZGVyXyhoZWFkZXJzLCBhdXRoVG9rZW4pO1xuICBhZGRWZXJzaW9uSGVhZGVyXyhoZWFkZXJzLCBmaXJlYmFzZVZlcnNpb24pO1xuICBhZGRBcHBDaGVja0hlYWRlcl8oaGVhZGVycywgYXBwQ2hlY2tUb2tlbik7XG4gIHJldHVybiBuZXcgTmV0d29ya1JlcXVlc3Q8SSwgTz4oXG4gICAgdXJsLFxuICAgIHJlcXVlc3RJbmZvLm1ldGhvZCxcbiAgICBoZWFkZXJzLFxuICAgIHJlcXVlc3RJbmZvLmJvZHksXG4gICAgcmVxdWVzdEluZm8uc3VjY2Vzc0NvZGVzLFxuICAgIHJlcXVlc3RJbmZvLmFkZGl0aW9uYWxSZXRyeUNvZGVzLFxuICAgIHJlcXVlc3RJbmZvLmhhbmRsZXIsXG4gICAgcmVxdWVzdEluZm8uZXJyb3JIYW5kbGVyLFxuICAgIHJlcXVlc3RJbmZvLnRpbWVvdXQsXG4gICAgcmVxdWVzdEluZm8ucHJvZ3Jlc3NDYWxsYmFjayxcbiAgICByZXF1ZXN0RmFjdG9yeSxcbiAgICByZXRyeVxuICApO1xufVxuIiwgIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTENcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG4vKipcbiAqIEBmaWxlb3ZlcnZpZXcgU29tZSBtZXRob2RzIGNvcGllZCBmcm9tIGdvb2cuZnMuXG4gKiBXZSBkb24ndCBpbmNsdWRlIGdvb2cuZnMgYmVjYXVzZSBpdCBwdWxscyBpbiBhIGJ1bmNoIG9mIERlZmVycmVkIGNvZGUgdGhhdFxuICogYmxvYXRzIHRoZSBzaXplIG9mIHRoZSByZWxlYXNlZCBiaW5hcnkuXG4gKi9cbmltcG9ydCB7IGlzTmF0aXZlQmxvYkRlZmluZWQgfSBmcm9tICcuL3R5cGUnO1xuaW1wb3J0IHsgU3RvcmFnZUVycm9yQ29kZSwgU3RvcmFnZUVycm9yIH0gZnJvbSAnLi9lcnJvcic7XG5cbmZ1bmN0aW9uIGdldEJsb2JCdWlsZGVyKCk6IHR5cGVvZiBJQmxvYkJ1aWxkZXIgfCB1bmRlZmluZWQge1xuICBpZiAodHlwZW9mIEJsb2JCdWlsZGVyICE9PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybiBCbG9iQnVpbGRlcjtcbiAgfSBlbHNlIGlmICh0eXBlb2YgV2ViS2l0QmxvYkJ1aWxkZXIgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIFdlYktpdEJsb2JCdWlsZGVyO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDb25jYXRlbmF0ZXMgb25lIG9yIG1vcmUgdmFsdWVzIHRvZ2V0aGVyIGFuZCBjb252ZXJ0cyB0aGVtIHRvIGEgQmxvYi5cbiAqXG4gKiBAcGFyYW0gYXJncyBUaGUgdmFsdWVzIHRoYXQgd2lsbCBtYWtlIHVwIHRoZSByZXN1bHRpbmcgYmxvYi5cbiAqIEByZXR1cm4gVGhlIGJsb2IuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRCbG9iKC4uLmFyZ3M6IEFycmF5PHN0cmluZyB8IEJsb2IgfCBBcnJheUJ1ZmZlcj4pOiBCbG9iIHtcbiAgY29uc3QgQmxvYkJ1aWxkZXIgPSBnZXRCbG9iQnVpbGRlcigpO1xuICBpZiAoQmxvYkJ1aWxkZXIgIT09IHVuZGVmaW5lZCkge1xuICAgIGNvbnN0IGJiID0gbmV3IEJsb2JCdWlsZGVyKCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBiYi5hcHBlbmQoYXJnc1tpXSk7XG4gICAgfVxuICAgIHJldHVybiBiYi5nZXRCbG9iKCk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKGlzTmF0aXZlQmxvYkRlZmluZWQoKSkge1xuICAgICAgcmV0dXJuIG5ldyBCbG9iKGFyZ3MpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgU3RvcmFnZUVycm9yKFxuICAgICAgICBTdG9yYWdlRXJyb3JDb2RlLlVOU1VQUE9SVEVEX0VOVklST05NRU5ULFxuICAgICAgICBcIlRoaXMgYnJvd3NlciBkb2Vzbid0IHNlZW0gdG8gc3VwcG9ydCBjcmVhdGluZyBCbG9ic1wiXG4gICAgICApO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFNsaWNlcyB0aGUgYmxvYi4gVGhlIHJldHVybmVkIGJsb2IgY29udGFpbnMgZGF0YSBmcm9tIHRoZSBzdGFydCBieXRlXG4gKiAoaW5jbHVzaXZlKSB0aWxsIHRoZSBlbmQgYnl0ZSAoZXhjbHVzaXZlKS4gTmVnYXRpdmUgaW5kaWNlcyBjYW5ub3QgYmUgdXNlZC5cbiAqXG4gKiBAcGFyYW0gYmxvYiBUaGUgYmxvYiB0byBiZSBzbGljZWQuXG4gKiBAcGFyYW0gc3RhcnQgSW5kZXggb2YgdGhlIHN0YXJ0aW5nIGJ5dGUuXG4gKiBAcGFyYW0gZW5kIEluZGV4IG9mIHRoZSBlbmRpbmcgYnl0ZS5cbiAqIEByZXR1cm4gVGhlIGJsb2Igc2xpY2Ugb3IgbnVsbCBpZiBub3Qgc3VwcG9ydGVkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gc2xpY2VCbG9iKGJsb2I6IEJsb2IsIHN0YXJ0OiBudW1iZXIsIGVuZDogbnVtYmVyKTogQmxvYiB8IG51bGwge1xuICBpZiAoYmxvYi53ZWJraXRTbGljZSkge1xuICAgIHJldHVybiBibG9iLndlYmtpdFNsaWNlKHN0YXJ0LCBlbmQpO1xuICB9IGVsc2UgaWYgKGJsb2IubW96U2xpY2UpIHtcbiAgICByZXR1cm4gYmxvYi5tb3pTbGljZShzdGFydCwgZW5kKTtcbiAgfSBlbHNlIGlmIChibG9iLnNsaWNlKSB7XG4gICAgcmV0dXJuIGJsb2Iuc2xpY2Uoc3RhcnQsIGVuZCk7XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG4iLCAiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjEgR29vZ2xlIExMQ1xuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgbWlzc2luZ1BvbHlGaWxsIH0gZnJvbSAnLi4vLi4vaW1wbGVtZW50YXRpb24vZXJyb3InO1xuXG4vKiogQ29udmVydHMgYSBCYXNlNjQgZW5jb2RlZCBzdHJpbmcgdG8gYSBiaW5hcnkgc3RyaW5nLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlY29kZUJhc2U2NChlbmNvZGVkOiBzdHJpbmcpOiBzdHJpbmcge1xuICBpZiAodHlwZW9mIGF0b2IgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgdGhyb3cgbWlzc2luZ1BvbHlGaWxsKCdiYXNlLTY0Jyk7XG4gIH1cbiAgcmV0dXJuIGF0b2IoZW5jb2RlZCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWNvZGVVaW50OEFycmF5KGRhdGE6IFVpbnQ4QXJyYXkpOiBzdHJpbmcge1xuICByZXR1cm4gbmV3IFRleHREZWNvZGVyKCkuZGVjb2RlKGRhdGEpO1xufVxuIiwgIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTENcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IHVua25vd24sIGludmFsaWRGb3JtYXQgfSBmcm9tICcuL2Vycm9yJztcbmltcG9ydCB7IGRlY29kZUJhc2U2NCB9IGZyb20gJy4uL3BsYXRmb3JtL2Jhc2U2NCc7XG5cbi8qKlxuICogQW4gZW51bWVyYXRpb24gb2YgdGhlIHBvc3NpYmxlIHN0cmluZyBmb3JtYXRzIGZvciB1cGxvYWQuXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCB0eXBlIFN0cmluZ0Zvcm1hdCA9ICh0eXBlb2YgU3RyaW5nRm9ybWF0KVtrZXlvZiB0eXBlb2YgU3RyaW5nRm9ybWF0XTtcbi8qKlxuICogQW4gZW51bWVyYXRpb24gb2YgdGhlIHBvc3NpYmxlIHN0cmluZyBmb3JtYXRzIGZvciB1cGxvYWQuXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCBTdHJpbmdGb3JtYXQgPSB7XG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgdGhlIHN0cmluZyBzaG91bGQgYmUgaW50ZXJwcmV0ZWQgXCJyYXdcIiwgdGhhdCBpcywgYXMgbm9ybWFsIHRleHQuXG4gICAqIFRoZSBzdHJpbmcgd2lsbCBiZSBpbnRlcnByZXRlZCBhcyBVVEYtMTYsIHRoZW4gdXBsb2FkZWQgYXMgYSBVVEYtOCBieXRlXG4gICAqIHNlcXVlbmNlLlxuICAgKiBFeGFtcGxlOiBUaGUgc3RyaW5nICdIZWxsbyEgXFxcXHVkODNkXFxcXHVkZTBhJyBiZWNvbWVzIHRoZSBieXRlIHNlcXVlbmNlXG4gICAqIDQ4IDY1IDZjIDZjIDZmIDIxIDIwIGYwIDlmIDk4IDhhXG4gICAqL1xuICBSQVc6ICdyYXcnLFxuICAvKipcbiAgICogSW5kaWNhdGVzIHRoZSBzdHJpbmcgc2hvdWxkIGJlIGludGVycHJldGVkIGFzIGJhc2U2NC1lbmNvZGVkIGRhdGEuXG4gICAqIFBhZGRpbmcgY2hhcmFjdGVycyAodHJhaWxpbmcgJz0ncykgYXJlIG9wdGlvbmFsLlxuICAgKiBFeGFtcGxlOiBUaGUgc3RyaW5nICdyV21PKytFNnQ3L3Jsdz09JyBiZWNvbWVzIHRoZSBieXRlIHNlcXVlbmNlXG4gICAqIGFkIDY5IDhlIGZiIGUxIDNhIGI3IGJmIGViIDk3XG4gICAqL1xuICBCQVNFNjQ6ICdiYXNlNjQnLFxuICAvKipcbiAgICogSW5kaWNhdGVzIHRoZSBzdHJpbmcgc2hvdWxkIGJlIGludGVycHJldGVkIGFzIGJhc2U2NHVybC1lbmNvZGVkIGRhdGEuXG4gICAqIFBhZGRpbmcgY2hhcmFjdGVycyAodHJhaWxpbmcgJz0ncykgYXJlIG9wdGlvbmFsLlxuICAgKiBFeGFtcGxlOiBUaGUgc3RyaW5nICdyV21PLS1FNnQ3X3Jsdz09JyBiZWNvbWVzIHRoZSBieXRlIHNlcXVlbmNlXG4gICAqIGFkIDY5IDhlIGZiIGUxIDNhIGI3IGJmIGViIDk3XG4gICAqL1xuICBCQVNFNjRVUkw6ICdiYXNlNjR1cmwnLFxuICAvKipcbiAgICogSW5kaWNhdGVzIHRoZSBzdHJpbmcgaXMgYSBkYXRhIFVSTCwgc3VjaCBhcyBvbmUgb2J0YWluZWQgZnJvbVxuICAgKiBjYW52YXMudG9EYXRhVVJMKCkuXG4gICAqIEV4YW1wbGU6IHRoZSBzdHJpbmcgJ2RhdGE6YXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtO2Jhc2U2NCxhYWFhJ1xuICAgKiBiZWNvbWVzIHRoZSBieXRlIHNlcXVlbmNlXG4gICAqIDY5IGE2IDlhXG4gICAqICh0aGUgY29udGVudC10eXBlIFwiYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtXCIgaXMgYWxzbyBhcHBsaWVkLCBidXQgY2FuXG4gICAqIGJlIG92ZXJyaWRkZW4gaW4gdGhlIG1ldGFkYXRhIG9iamVjdCkuXG4gICAqL1xuICBEQVRBX1VSTDogJ2RhdGFfdXJsJ1xufSBhcyBjb25zdDtcblxuZXhwb3J0IGNsYXNzIFN0cmluZ0RhdGEge1xuICBjb250ZW50VHlwZTogc3RyaW5nIHwgbnVsbDtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgZGF0YTogVWludDhBcnJheSwgY29udGVudFR5cGU/OiBzdHJpbmcgfCBudWxsKSB7XG4gICAgdGhpcy5jb250ZW50VHlwZSA9IGNvbnRlbnRUeXBlIHx8IG51bGw7XG4gIH1cbn1cblxuLyoqXG4gKiBAaW50ZXJuYWxcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRhdGFGcm9tU3RyaW5nKFxuICBmb3JtYXQ6IFN0cmluZ0Zvcm1hdCxcbiAgc3RyaW5nRGF0YTogc3RyaW5nXG4pOiBTdHJpbmdEYXRhIHtcbiAgc3dpdGNoIChmb3JtYXQpIHtcbiAgICBjYXNlIFN0cmluZ0Zvcm1hdC5SQVc6XG4gICAgICByZXR1cm4gbmV3IFN0cmluZ0RhdGEodXRmOEJ5dGVzXyhzdHJpbmdEYXRhKSk7XG4gICAgY2FzZSBTdHJpbmdGb3JtYXQuQkFTRTY0OlxuICAgIGNhc2UgU3RyaW5nRm9ybWF0LkJBU0U2NFVSTDpcbiAgICAgIHJldHVybiBuZXcgU3RyaW5nRGF0YShiYXNlNjRCeXRlc18oZm9ybWF0LCBzdHJpbmdEYXRhKSk7XG4gICAgY2FzZSBTdHJpbmdGb3JtYXQuREFUQV9VUkw6XG4gICAgICByZXR1cm4gbmV3IFN0cmluZ0RhdGEoXG4gICAgICAgIGRhdGFVUkxCeXRlc18oc3RyaW5nRGF0YSksXG4gICAgICAgIGRhdGFVUkxDb250ZW50VHlwZV8oc3RyaW5nRGF0YSlcbiAgICAgICk7XG4gICAgZGVmYXVsdDpcbiAgICAvLyBkbyBub3RoaW5nXG4gIH1cblxuICAvLyBhc3NlcnQoZmFsc2UpO1xuICB0aHJvdyB1bmtub3duKCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1dGY4Qnl0ZXNfKHZhbHVlOiBzdHJpbmcpOiBVaW50OEFycmF5IHtcbiAgY29uc3QgYjogbnVtYmVyW10gPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB2YWx1ZS5sZW5ndGg7IGkrKykge1xuICAgIGxldCBjID0gdmFsdWUuY2hhckNvZGVBdChpKTtcbiAgICBpZiAoYyA8PSAxMjcpIHtcbiAgICAgIGIucHVzaChjKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGMgPD0gMjA0Nykge1xuICAgICAgICBiLnB1c2goMTkyIHwgKGMgPj4gNiksIDEyOCB8IChjICYgNjMpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICgoYyAmIDY0NTEyKSA9PT0gNTUyOTYpIHtcbiAgICAgICAgICAvLyBUaGUgc3RhcnQgb2YgYSBzdXJyb2dhdGUgcGFpci5cbiAgICAgICAgICBjb25zdCB2YWxpZCA9XG4gICAgICAgICAgICBpIDwgdmFsdWUubGVuZ3RoIC0gMSAmJiAodmFsdWUuY2hhckNvZGVBdChpICsgMSkgJiA2NDUxMikgPT09IDU2MzIwO1xuICAgICAgICAgIGlmICghdmFsaWQpIHtcbiAgICAgICAgICAgIC8vIFRoZSBzZWNvbmQgc3Vycm9nYXRlIHdhc24ndCB0aGVyZS5cbiAgICAgICAgICAgIGIucHVzaCgyMzksIDE5MSwgMTg5KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgaGkgPSBjO1xuICAgICAgICAgICAgY29uc3QgbG8gPSB2YWx1ZS5jaGFyQ29kZUF0KCsraSk7XG4gICAgICAgICAgICBjID0gNjU1MzYgfCAoKGhpICYgMTAyMykgPDwgMTApIHwgKGxvICYgMTAyMyk7XG4gICAgICAgICAgICBiLnB1c2goXG4gICAgICAgICAgICAgIDI0MCB8IChjID4+IDE4KSxcbiAgICAgICAgICAgICAgMTI4IHwgKChjID4+IDEyKSAmIDYzKSxcbiAgICAgICAgICAgICAgMTI4IHwgKChjID4+IDYpICYgNjMpLFxuICAgICAgICAgICAgICAxMjggfCAoYyAmIDYzKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKChjICYgNjQ1MTIpID09PSA1NjMyMCkge1xuICAgICAgICAgICAgLy8gSW52YWxpZCBsb3cgc3Vycm9nYXRlLlxuICAgICAgICAgICAgYi5wdXNoKDIzOSwgMTkxLCAxODkpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBiLnB1c2goMjI0IHwgKGMgPj4gMTIpLCAxMjggfCAoKGMgPj4gNikgJiA2MyksIDEyOCB8IChjICYgNjMpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIG5ldyBVaW50OEFycmF5KGIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGVyY2VudEVuY29kZWRCeXRlc18odmFsdWU6IHN0cmluZyk6IFVpbnQ4QXJyYXkge1xuICBsZXQgZGVjb2RlZDtcbiAgdHJ5IHtcbiAgICBkZWNvZGVkID0gZGVjb2RlVVJJQ29tcG9uZW50KHZhbHVlKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHRocm93IGludmFsaWRGb3JtYXQoU3RyaW5nRm9ybWF0LkRBVEFfVVJMLCAnTWFsZm9ybWVkIGRhdGEgVVJMLicpO1xuICB9XG4gIHJldHVybiB1dGY4Qnl0ZXNfKGRlY29kZWQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYmFzZTY0Qnl0ZXNfKGZvcm1hdDogU3RyaW5nRm9ybWF0LCB2YWx1ZTogc3RyaW5nKTogVWludDhBcnJheSB7XG4gIHN3aXRjaCAoZm9ybWF0KSB7XG4gICAgY2FzZSBTdHJpbmdGb3JtYXQuQkFTRTY0OiB7XG4gICAgICBjb25zdCBoYXNNaW51cyA9IHZhbHVlLmluZGV4T2YoJy0nKSAhPT0gLTE7XG4gICAgICBjb25zdCBoYXNVbmRlciA9IHZhbHVlLmluZGV4T2YoJ18nKSAhPT0gLTE7XG4gICAgICBpZiAoaGFzTWludXMgfHwgaGFzVW5kZXIpIHtcbiAgICAgICAgY29uc3QgaW52YWxpZENoYXIgPSBoYXNNaW51cyA/ICctJyA6ICdfJztcbiAgICAgICAgdGhyb3cgaW52YWxpZEZvcm1hdChcbiAgICAgICAgICBmb3JtYXQsXG4gICAgICAgICAgXCJJbnZhbGlkIGNoYXJhY3RlciAnXCIgK1xuICAgICAgICAgICAgaW52YWxpZENoYXIgK1xuICAgICAgICAgICAgXCInIGZvdW5kOiBpcyBpdCBiYXNlNjR1cmwgZW5jb2RlZD9cIlxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNhc2UgU3RyaW5nRm9ybWF0LkJBU0U2NFVSTDoge1xuICAgICAgY29uc3QgaGFzUGx1cyA9IHZhbHVlLmluZGV4T2YoJysnKSAhPT0gLTE7XG4gICAgICBjb25zdCBoYXNTbGFzaCA9IHZhbHVlLmluZGV4T2YoJy8nKSAhPT0gLTE7XG4gICAgICBpZiAoaGFzUGx1cyB8fCBoYXNTbGFzaCkge1xuICAgICAgICBjb25zdCBpbnZhbGlkQ2hhciA9IGhhc1BsdXMgPyAnKycgOiAnLyc7XG4gICAgICAgIHRocm93IGludmFsaWRGb3JtYXQoXG4gICAgICAgICAgZm9ybWF0LFxuICAgICAgICAgIFwiSW52YWxpZCBjaGFyYWN0ZXIgJ1wiICsgaW52YWxpZENoYXIgKyBcIicgZm91bmQ6IGlzIGl0IGJhc2U2NCBlbmNvZGVkP1wiXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoLy0vZywgJysnKS5yZXBsYWNlKC9fL2csICcvJyk7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgZGVmYXVsdDpcbiAgICAvLyBkbyBub3RoaW5nXG4gIH1cbiAgbGV0IGJ5dGVzO1xuICB0cnkge1xuICAgIGJ5dGVzID0gZGVjb2RlQmFzZTY0KHZhbHVlKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGlmICgoZSBhcyBFcnJvcikubWVzc2FnZS5pbmNsdWRlcygncG9seWZpbGwnKSkge1xuICAgICAgdGhyb3cgZTtcbiAgICB9XG4gICAgdGhyb3cgaW52YWxpZEZvcm1hdChmb3JtYXQsICdJbnZhbGlkIGNoYXJhY3RlciBmb3VuZCcpO1xuICB9XG4gIGNvbnN0IGFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoYnl0ZXMubGVuZ3RoKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBieXRlcy5sZW5ndGg7IGkrKykge1xuICAgIGFycmF5W2ldID0gYnl0ZXMuY2hhckNvZGVBdChpKTtcbiAgfVxuICByZXR1cm4gYXJyYXk7XG59XG5cbmNsYXNzIERhdGFVUkxQYXJ0cyB7XG4gIGJhc2U2NDogYm9vbGVhbiA9IGZhbHNlO1xuICBjb250ZW50VHlwZTogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIHJlc3Q6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihkYXRhVVJMOiBzdHJpbmcpIHtcbiAgICBjb25zdCBtYXRjaGVzID0gZGF0YVVSTC5tYXRjaCgvXmRhdGE6KFteLF0rKT8sLyk7XG4gICAgaWYgKG1hdGNoZXMgPT09IG51bGwpIHtcbiAgICAgIHRocm93IGludmFsaWRGb3JtYXQoXG4gICAgICAgIFN0cmluZ0Zvcm1hdC5EQVRBX1VSTCxcbiAgICAgICAgXCJNdXN0IGJlIGZvcm1hdHRlZCAnZGF0YTpbPG1lZGlhdHlwZT5dWztiYXNlNjRdLDxkYXRhPlwiXG4gICAgICApO1xuICAgIH1cbiAgICBjb25zdCBtaWRkbGUgPSBtYXRjaGVzWzFdIHx8IG51bGw7XG4gICAgaWYgKG1pZGRsZSAhPSBudWxsKSB7XG4gICAgICB0aGlzLmJhc2U2NCA9IGVuZHNXaXRoKG1pZGRsZSwgJztiYXNlNjQnKTtcbiAgICAgIHRoaXMuY29udGVudFR5cGUgPSB0aGlzLmJhc2U2NFxuICAgICAgICA/IG1pZGRsZS5zdWJzdHJpbmcoMCwgbWlkZGxlLmxlbmd0aCAtICc7YmFzZTY0Jy5sZW5ndGgpXG4gICAgICAgIDogbWlkZGxlO1xuICAgIH1cbiAgICB0aGlzLnJlc3QgPSBkYXRhVVJMLnN1YnN0cmluZyhkYXRhVVJMLmluZGV4T2YoJywnKSArIDEpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkYXRhVVJMQnl0ZXNfKGRhdGFVcmw6IHN0cmluZyk6IFVpbnQ4QXJyYXkge1xuICBjb25zdCBwYXJ0cyA9IG5ldyBEYXRhVVJMUGFydHMoZGF0YVVybCk7XG4gIGlmIChwYXJ0cy5iYXNlNjQpIHtcbiAgICByZXR1cm4gYmFzZTY0Qnl0ZXNfKFN0cmluZ0Zvcm1hdC5CQVNFNjQsIHBhcnRzLnJlc3QpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBwZXJjZW50RW5jb2RlZEJ5dGVzXyhwYXJ0cy5yZXN0KTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZGF0YVVSTENvbnRlbnRUeXBlXyhkYXRhVXJsOiBzdHJpbmcpOiBzdHJpbmcgfCBudWxsIHtcbiAgY29uc3QgcGFydHMgPSBuZXcgRGF0YVVSTFBhcnRzKGRhdGFVcmwpO1xuICByZXR1cm4gcGFydHMuY29udGVudFR5cGU7XG59XG5cbmZ1bmN0aW9uIGVuZHNXaXRoKHM6IHN0cmluZywgZW5kOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgY29uc3QgbG9uZ0Vub3VnaCA9IHMubGVuZ3RoID49IGVuZC5sZW5ndGg7XG4gIGlmICghbG9uZ0Vub3VnaCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiBzLnN1YnN0cmluZyhzLmxlbmd0aCAtIGVuZC5sZW5ndGgpID09PSBlbmQ7XG59XG4iLCAiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQ1xuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLyoqXG4gKiBAZmlsZSBQcm92aWRlcyBhIEJsb2ItbGlrZSB3cmFwcGVyIGZvciB2YXJpb3VzIGJpbmFyeSB0eXBlcyAoaW5jbHVkaW5nIHRoZVxuICogbmF0aXZlIEJsb2IgdHlwZSkuIFRoaXMgbWFrZXMgaXQgcG9zc2libGUgdG8gdXBsb2FkIHR5cGVzIGxpa2UgQXJyYXlCdWZmZXJzLFxuICogbWFraW5nIHVwbG9hZHMgcG9zc2libGUgaW4gZW52aXJvbm1lbnRzIHdpdGhvdXQgdGhlIG5hdGl2ZSBCbG9iIHR5cGUuXG4gKi9cbmltcG9ydCB7IHNsaWNlQmxvYiwgZ2V0QmxvYiB9IGZyb20gJy4vZnMnO1xuaW1wb3J0IHsgU3RyaW5nRm9ybWF0LCBkYXRhRnJvbVN0cmluZyB9IGZyb20gJy4vc3RyaW5nJztcbmltcG9ydCB7IGlzTmF0aXZlQmxvYiwgaXNOYXRpdmVCbG9iRGVmaW5lZCwgaXNTdHJpbmcgfSBmcm9tICcuL3R5cGUnO1xuXG4vKipcbiAqIEBwYXJhbSBvcHRfZWxpZGVDb3B5IC0gSWYgdHJ1ZSwgZG9lc24ndCBjb3B5IG11dGFibGUgaW5wdXQgZGF0YVxuICogICAgIChlLmcuIFVpbnQ4QXJyYXlzKS4gUGFzcyB0cnVlIG9ubHkgaWYgeW91IGtub3cgdGhlIG9iamVjdHMgd2lsbCBub3QgYmVcbiAqICAgICBtb2RpZmllZCBhZnRlciB0aGlzIGJsb2IncyBjb25zdHJ1Y3Rpb24uXG4gKlxuICogQGludGVybmFsXG4gKi9cbmV4cG9ydCBjbGFzcyBGYnNCbG9iIHtcbiAgcHJpdmF0ZSBkYXRhXyE6IEJsb2IgfCBVaW50OEFycmF5O1xuICBwcml2YXRlIHNpemVfOiBudW1iZXI7XG4gIHByaXZhdGUgdHlwZV86IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihkYXRhOiBCbG9iIHwgVWludDhBcnJheSB8IEFycmF5QnVmZmVyLCBlbGlkZUNvcHk/OiBib29sZWFuKSB7XG4gICAgbGV0IHNpemU6IG51bWJlciA9IDA7XG4gICAgbGV0IGJsb2JUeXBlOiBzdHJpbmcgPSAnJztcbiAgICBpZiAoaXNOYXRpdmVCbG9iKGRhdGEpKSB7XG4gICAgICB0aGlzLmRhdGFfID0gZGF0YSBhcyBCbG9iO1xuICAgICAgc2l6ZSA9IChkYXRhIGFzIEJsb2IpLnNpemU7XG4gICAgICBibG9iVHlwZSA9IChkYXRhIGFzIEJsb2IpLnR5cGU7XG4gICAgfSBlbHNlIGlmIChkYXRhIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpIHtcbiAgICAgIGlmIChlbGlkZUNvcHkpIHtcbiAgICAgICAgdGhpcy5kYXRhXyA9IG5ldyBVaW50OEFycmF5KGRhdGEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5kYXRhXyA9IG5ldyBVaW50OEFycmF5KGRhdGEuYnl0ZUxlbmd0aCk7XG4gICAgICAgIHRoaXMuZGF0YV8uc2V0KG5ldyBVaW50OEFycmF5KGRhdGEpKTtcbiAgICAgIH1cbiAgICAgIHNpemUgPSB0aGlzLmRhdGFfLmxlbmd0aDtcbiAgICB9IGVsc2UgaWYgKGRhdGEgaW5zdGFuY2VvZiBVaW50OEFycmF5KSB7XG4gICAgICBpZiAoZWxpZGVDb3B5KSB7XG4gICAgICAgIHRoaXMuZGF0YV8gPSBkYXRhIGFzIFVpbnQ4QXJyYXk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmRhdGFfID0gbmV3IFVpbnQ4QXJyYXkoZGF0YS5sZW5ndGgpO1xuICAgICAgICB0aGlzLmRhdGFfLnNldChkYXRhIGFzIFVpbnQ4QXJyYXkpO1xuICAgICAgfVxuICAgICAgc2l6ZSA9IGRhdGEubGVuZ3RoO1xuICAgIH1cbiAgICB0aGlzLnNpemVfID0gc2l6ZTtcbiAgICB0aGlzLnR5cGVfID0gYmxvYlR5cGU7XG4gIH1cblxuICBzaXplKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuc2l6ZV87XG4gIH1cblxuICB0eXBlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMudHlwZV87XG4gIH1cblxuICBzbGljZShzdGFydEJ5dGU6IG51bWJlciwgZW5kQnl0ZTogbnVtYmVyKTogRmJzQmxvYiB8IG51bGwge1xuICAgIGlmIChpc05hdGl2ZUJsb2IodGhpcy5kYXRhXykpIHtcbiAgICAgIGNvbnN0IHJlYWxCbG9iID0gdGhpcy5kYXRhXyBhcyBCbG9iO1xuICAgICAgY29uc3Qgc2xpY2VkID0gc2xpY2VCbG9iKHJlYWxCbG9iLCBzdGFydEJ5dGUsIGVuZEJ5dGUpO1xuICAgICAgaWYgKHNsaWNlZCA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuZXcgRmJzQmxvYihzbGljZWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBzbGljZSA9IG5ldyBVaW50OEFycmF5KFxuICAgICAgICAodGhpcy5kYXRhXyBhcyBVaW50OEFycmF5KS5idWZmZXIsXG4gICAgICAgIHN0YXJ0Qnl0ZSxcbiAgICAgICAgZW5kQnl0ZSAtIHN0YXJ0Qnl0ZVxuICAgICAgKTtcbiAgICAgIHJldHVybiBuZXcgRmJzQmxvYihzbGljZSwgdHJ1ZSk7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGdldEJsb2IoLi4uYXJnczogQXJyYXk8c3RyaW5nIHwgRmJzQmxvYj4pOiBGYnNCbG9iIHwgbnVsbCB7XG4gICAgaWYgKGlzTmF0aXZlQmxvYkRlZmluZWQoKSkge1xuICAgICAgY29uc3QgYmxvYmJ5OiBBcnJheTxCbG9iIHwgVWludDhBcnJheSB8IHN0cmluZz4gPSBhcmdzLm1hcChcbiAgICAgICAgKHZhbDogc3RyaW5nIHwgRmJzQmxvYik6IEJsb2IgfCBVaW50OEFycmF5IHwgc3RyaW5nID0+IHtcbiAgICAgICAgICBpZiAodmFsIGluc3RhbmNlb2YgRmJzQmxvYikge1xuICAgICAgICAgICAgcmV0dXJuIHZhbC5kYXRhXztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHZhbDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgICByZXR1cm4gbmV3IEZic0Jsb2IoZ2V0QmxvYi5hcHBseShudWxsLCBibG9iYnkpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgdWludDhBcnJheXM6IFVpbnQ4QXJyYXlbXSA9IGFyZ3MubWFwKFxuICAgICAgICAodmFsOiBzdHJpbmcgfCBGYnNCbG9iKTogVWludDhBcnJheSA9PiB7XG4gICAgICAgICAgaWYgKGlzU3RyaW5nKHZhbCkpIHtcbiAgICAgICAgICAgIHJldHVybiBkYXRhRnJvbVN0cmluZyhTdHJpbmdGb3JtYXQuUkFXLCB2YWwgYXMgc3RyaW5nKS5kYXRhO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBCbG9icyBkb24ndCBleGlzdCwgc28gdGhpcyBoYXMgdG8gYmUgYSBVaW50OEFycmF5LlxuICAgICAgICAgICAgcmV0dXJuICh2YWwgYXMgRmJzQmxvYikuZGF0YV8gYXMgVWludDhBcnJheTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgICBsZXQgZmluYWxMZW5ndGggPSAwO1xuICAgICAgdWludDhBcnJheXMuZm9yRWFjaCgoYXJyYXk6IFVpbnQ4QXJyYXkpOiB2b2lkID0+IHtcbiAgICAgICAgZmluYWxMZW5ndGggKz0gYXJyYXkuYnl0ZUxlbmd0aDtcbiAgICAgIH0pO1xuICAgICAgY29uc3QgbWVyZ2VkID0gbmV3IFVpbnQ4QXJyYXkoZmluYWxMZW5ndGgpO1xuICAgICAgbGV0IGluZGV4ID0gMDtcbiAgICAgIHVpbnQ4QXJyYXlzLmZvckVhY2goKGFycmF5OiBVaW50OEFycmF5KSA9PiB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBtZXJnZWRbaW5kZXgrK10gPSBhcnJheVtpXTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gbmV3IEZic0Jsb2IobWVyZ2VkLCB0cnVlKTtcbiAgICB9XG4gIH1cblxuICB1cGxvYWREYXRhKCk6IEJsb2IgfCBVaW50OEFycmF5IHtcbiAgICByZXR1cm4gdGhpcy5kYXRhXztcbiAgfVxufVxuIiwgIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTENcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5pbXBvcnQgeyBpc05vbkFycmF5T2JqZWN0IH0gZnJvbSAnLi90eXBlJztcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBPYmplY3QgcmVzdWx0aW5nIGZyb20gcGFyc2luZyB0aGUgZ2l2ZW4gSlNPTiwgb3IgbnVsbCBpZiB0aGVcbiAqIGdpdmVuIHN0cmluZyBkb2VzIG5vdCByZXByZXNlbnQgYSBKU09OIG9iamVjdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGpzb25PYmplY3RPck51bGwoXG4gIHM6IHN0cmluZ1xuKTogeyBbbmFtZTogc3RyaW5nXTogdW5rbm93biB9IHwgbnVsbCB7XG4gIGxldCBvYmo7XG4gIHRyeSB7XG4gICAgb2JqID0gSlNPTi5wYXJzZShzKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIGlmIChpc05vbkFycmF5T2JqZWN0KG9iaikpIHtcbiAgICByZXR1cm4gb2JqO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG4iLCAiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQ1xuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IENvbnRhaW5zIGhlbHBlciBtZXRob2RzIGZvciBtYW5pcHVsYXRpbmcgcGF0aHMuXG4gKi9cblxuLyoqXG4gKiBAcmV0dXJuIE51bGwgaWYgdGhlIHBhdGggaXMgYWxyZWFkeSBhdCB0aGUgcm9vdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcmVudChwYXRoOiBzdHJpbmcpOiBzdHJpbmcgfCBudWxsIHtcbiAgaWYgKHBhdGgubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgY29uc3QgaW5kZXggPSBwYXRoLmxhc3RJbmRleE9mKCcvJyk7XG4gIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cbiAgY29uc3QgbmV3UGF0aCA9IHBhdGguc2xpY2UoMCwgaW5kZXgpO1xuICByZXR1cm4gbmV3UGF0aDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNoaWxkKHBhdGg6IHN0cmluZywgY2hpbGRQYXRoOiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCBjYW5vbmljYWxDaGlsZFBhdGggPSBjaGlsZFBhdGhcbiAgICAuc3BsaXQoJy8nKVxuICAgIC5maWx0ZXIoY29tcG9uZW50ID0+IGNvbXBvbmVudC5sZW5ndGggPiAwKVxuICAgIC5qb2luKCcvJyk7XG4gIGlmIChwYXRoLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBjYW5vbmljYWxDaGlsZFBhdGg7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHBhdGggKyAnLycgKyBjYW5vbmljYWxDaGlsZFBhdGg7XG4gIH1cbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBsYXN0IGNvbXBvbmVudCBvZiBhIHBhdGguXG4gKiAnL2Zvby9iYXInIC0+ICdiYXInXG4gKiAnL2Zvby9iYXIvYmF6LycgLT4gJ2Jhei8nXG4gKiAnL2EnIC0+ICdhJ1xuICovXG5leHBvcnQgZnVuY3Rpb24gbGFzdENvbXBvbmVudChwYXRoOiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCBpbmRleCA9IHBhdGgubGFzdEluZGV4T2YoJy8nLCBwYXRoLmxlbmd0aCAtIDIpO1xuICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgcmV0dXJuIHBhdGg7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHBhdGguc2xpY2UoaW5kZXggKyAxKTtcbiAgfVxufVxuIiwgIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTENcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8qKlxuICogQGZpbGVvdmVydmlldyBEb2N1bWVudGF0aW9uIGZvciB0aGUgbWV0YWRhdGEgZm9ybWF0XG4gKi9cbmltcG9ydCB7IE1ldGFkYXRhIH0gZnJvbSAnLi4vbWV0YWRhdGEnO1xuXG5pbXBvcnQgeyBqc29uT2JqZWN0T3JOdWxsIH0gZnJvbSAnLi9qc29uJztcbmltcG9ydCB7IExvY2F0aW9uIH0gZnJvbSAnLi9sb2NhdGlvbic7XG5pbXBvcnQgeyBsYXN0Q29tcG9uZW50IH0gZnJvbSAnLi9wYXRoJztcbmltcG9ydCB7IGlzU3RyaW5nIH0gZnJvbSAnLi90eXBlJztcbmltcG9ydCB7IG1ha2VVcmwsIG1ha2VRdWVyeVN0cmluZyB9IGZyb20gJy4vdXJsJztcbmltcG9ydCB7IFJlZmVyZW5jZSB9IGZyb20gJy4uL3JlZmVyZW5jZSc7XG5pbXBvcnQgeyBGaXJlYmFzZVN0b3JhZ2VJbXBsIH0gZnJvbSAnLi4vc2VydmljZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBub1hmb3JtXzxUPihtZXRhZGF0YTogTWV0YWRhdGEsIHZhbHVlOiBUKTogVCB7XG4gIHJldHVybiB2YWx1ZTtcbn1cblxuY2xhc3MgTWFwcGluZzxUPiB7XG4gIGxvY2FsOiBzdHJpbmc7XG4gIHdyaXRhYmxlOiBib29sZWFuO1xuICB4Zm9ybTogKHAxOiBNZXRhZGF0YSwgcDI/OiBUKSA9PiBUIHwgdW5kZWZpbmVkO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBzZXJ2ZXI6IHN0cmluZyxcbiAgICBsb2NhbD86IHN0cmluZyB8IG51bGwsXG4gICAgd3JpdGFibGU/OiBib29sZWFuLFxuICAgIHhmb3JtPzogKChwMTogTWV0YWRhdGEsIHAyPzogVCkgPT4gVCB8IHVuZGVmaW5lZCkgfCBudWxsXG4gICkge1xuICAgIHRoaXMubG9jYWwgPSBsb2NhbCB8fCBzZXJ2ZXI7XG4gICAgdGhpcy53cml0YWJsZSA9ICEhd3JpdGFibGU7XG4gICAgdGhpcy54Zm9ybSA9IHhmb3JtIHx8IG5vWGZvcm1fO1xuICB9XG59XG50eXBlIE1hcHBpbmdzID0gQXJyYXk8TWFwcGluZzxzdHJpbmc+IHwgTWFwcGluZzxudW1iZXI+PjtcblxuZXhwb3J0IHsgTWFwcGluZ3MgfTtcblxubGV0IG1hcHBpbmdzXzogTWFwcGluZ3MgfCBudWxsID0gbnVsbDtcblxuZXhwb3J0IGZ1bmN0aW9uIHhmb3JtUGF0aChmdWxsUGF0aDogc3RyaW5nIHwgdW5kZWZpbmVkKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgaWYgKCFpc1N0cmluZyhmdWxsUGF0aCkgfHwgZnVsbFBhdGgubGVuZ3RoIDwgMikge1xuICAgIHJldHVybiBmdWxsUGF0aDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbGFzdENvbXBvbmVudChmdWxsUGF0aCk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldE1hcHBpbmdzKCk6IE1hcHBpbmdzIHtcbiAgaWYgKG1hcHBpbmdzXykge1xuICAgIHJldHVybiBtYXBwaW5nc187XG4gIH1cbiAgY29uc3QgbWFwcGluZ3M6IE1hcHBpbmdzID0gW107XG4gIG1hcHBpbmdzLnB1c2gobmV3IE1hcHBpbmc8c3RyaW5nPignYnVja2V0JykpO1xuICBtYXBwaW5ncy5wdXNoKG5ldyBNYXBwaW5nPHN0cmluZz4oJ2dlbmVyYXRpb24nKSk7XG4gIG1hcHBpbmdzLnB1c2gobmV3IE1hcHBpbmc8c3RyaW5nPignbWV0YWdlbmVyYXRpb24nKSk7XG4gIG1hcHBpbmdzLnB1c2gobmV3IE1hcHBpbmc8c3RyaW5nPignbmFtZScsICdmdWxsUGF0aCcsIHRydWUpKTtcblxuICBmdW5jdGlvbiBtYXBwaW5nc1hmb3JtUGF0aChcbiAgICBfbWV0YWRhdGE6IE1ldGFkYXRhLFxuICAgIGZ1bGxQYXRoOiBzdHJpbmcgfCB1bmRlZmluZWRcbiAgKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4geGZvcm1QYXRoKGZ1bGxQYXRoKTtcbiAgfVxuICBjb25zdCBuYW1lTWFwcGluZyA9IG5ldyBNYXBwaW5nPHN0cmluZz4oJ25hbWUnKTtcbiAgbmFtZU1hcHBpbmcueGZvcm0gPSBtYXBwaW5nc1hmb3JtUGF0aDtcbiAgbWFwcGluZ3MucHVzaChuYW1lTWFwcGluZyk7XG5cbiAgLyoqXG4gICAqIENvZXJjZXMgdGhlIHNlY29uZCBwYXJhbSB0byBhIG51bWJlciwgaWYgaXQgaXMgZGVmaW5lZC5cbiAgICovXG4gIGZ1bmN0aW9uIHhmb3JtU2l6ZShcbiAgICBfbWV0YWRhdGE6IE1ldGFkYXRhLFxuICAgIHNpemU/OiBudW1iZXIgfCBzdHJpbmdcbiAgKTogbnVtYmVyIHwgdW5kZWZpbmVkIHtcbiAgICBpZiAoc2l6ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gTnVtYmVyKHNpemUpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gc2l6ZTtcbiAgICB9XG4gIH1cbiAgY29uc3Qgc2l6ZU1hcHBpbmcgPSBuZXcgTWFwcGluZzxudW1iZXI+KCdzaXplJyk7XG4gIHNpemVNYXBwaW5nLnhmb3JtID0geGZvcm1TaXplO1xuICBtYXBwaW5ncy5wdXNoKHNpemVNYXBwaW5nKTtcbiAgbWFwcGluZ3MucHVzaChuZXcgTWFwcGluZzxudW1iZXI+KCd0aW1lQ3JlYXRlZCcpKTtcbiAgbWFwcGluZ3MucHVzaChuZXcgTWFwcGluZzxzdHJpbmc+KCd1cGRhdGVkJykpO1xuICBtYXBwaW5ncy5wdXNoKG5ldyBNYXBwaW5nPHN0cmluZz4oJ21kNUhhc2gnLCBudWxsLCB0cnVlKSk7XG4gIG1hcHBpbmdzLnB1c2gobmV3IE1hcHBpbmc8c3RyaW5nPignY2FjaGVDb250cm9sJywgbnVsbCwgdHJ1ZSkpO1xuICBtYXBwaW5ncy5wdXNoKG5ldyBNYXBwaW5nPHN0cmluZz4oJ2NvbnRlbnREaXNwb3NpdGlvbicsIG51bGwsIHRydWUpKTtcbiAgbWFwcGluZ3MucHVzaChuZXcgTWFwcGluZzxzdHJpbmc+KCdjb250ZW50RW5jb2RpbmcnLCBudWxsLCB0cnVlKSk7XG4gIG1hcHBpbmdzLnB1c2gobmV3IE1hcHBpbmc8c3RyaW5nPignY29udGVudExhbmd1YWdlJywgbnVsbCwgdHJ1ZSkpO1xuICBtYXBwaW5ncy5wdXNoKG5ldyBNYXBwaW5nPHN0cmluZz4oJ2NvbnRlbnRUeXBlJywgbnVsbCwgdHJ1ZSkpO1xuICBtYXBwaW5ncy5wdXNoKG5ldyBNYXBwaW5nPHN0cmluZz4oJ21ldGFkYXRhJywgJ2N1c3RvbU1ldGFkYXRhJywgdHJ1ZSkpO1xuICBtYXBwaW5nc18gPSBtYXBwaW5ncztcbiAgcmV0dXJuIG1hcHBpbmdzXztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZFJlZihtZXRhZGF0YTogTWV0YWRhdGEsIHNlcnZpY2U6IEZpcmViYXNlU3RvcmFnZUltcGwpOiB2b2lkIHtcbiAgZnVuY3Rpb24gZ2VuZXJhdGVSZWYoKTogUmVmZXJlbmNlIHtcbiAgICBjb25zdCBidWNrZXQ6IHN0cmluZyA9IG1ldGFkYXRhWydidWNrZXQnXSBhcyBzdHJpbmc7XG4gICAgY29uc3QgcGF0aDogc3RyaW5nID0gbWV0YWRhdGFbJ2Z1bGxQYXRoJ10gYXMgc3RyaW5nO1xuICAgIGNvbnN0IGxvYyA9IG5ldyBMb2NhdGlvbihidWNrZXQsIHBhdGgpO1xuICAgIHJldHVybiBzZXJ2aWNlLl9tYWtlU3RvcmFnZVJlZmVyZW5jZShsb2MpO1xuICB9XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShtZXRhZGF0YSwgJ3JlZicsIHsgZ2V0OiBnZW5lcmF0ZVJlZiB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZyb21SZXNvdXJjZShcbiAgc2VydmljZTogRmlyZWJhc2VTdG9yYWdlSW1wbCxcbiAgcmVzb3VyY2U6IHsgW25hbWU6IHN0cmluZ106IHVua25vd24gfSxcbiAgbWFwcGluZ3M6IE1hcHBpbmdzXG4pOiBNZXRhZGF0YSB7XG4gIGNvbnN0IG1ldGFkYXRhOiBNZXRhZGF0YSA9IHt9IGFzIE1ldGFkYXRhO1xuICBtZXRhZGF0YVsndHlwZSddID0gJ2ZpbGUnO1xuICBjb25zdCBsZW4gPSBtYXBwaW5ncy5sZW5ndGg7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICBjb25zdCBtYXBwaW5nID0gbWFwcGluZ3NbaV07XG4gICAgbWV0YWRhdGFbbWFwcGluZy5sb2NhbF0gPSAobWFwcGluZyBhcyBNYXBwaW5nPHVua25vd24+KS54Zm9ybShcbiAgICAgIG1ldGFkYXRhLFxuICAgICAgcmVzb3VyY2VbbWFwcGluZy5zZXJ2ZXJdXG4gICAgKTtcbiAgfVxuICBhZGRSZWYobWV0YWRhdGEsIHNlcnZpY2UpO1xuICByZXR1cm4gbWV0YWRhdGE7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmcm9tUmVzb3VyY2VTdHJpbmcoXG4gIHNlcnZpY2U6IEZpcmViYXNlU3RvcmFnZUltcGwsXG4gIHJlc291cmNlU3RyaW5nOiBzdHJpbmcsXG4gIG1hcHBpbmdzOiBNYXBwaW5nc1xuKTogTWV0YWRhdGEgfCBudWxsIHtcbiAgY29uc3Qgb2JqID0ganNvbk9iamVjdE9yTnVsbChyZXNvdXJjZVN0cmluZyk7XG4gIGlmIChvYmogPT09IG51bGwpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBjb25zdCByZXNvdXJjZSA9IG9iaiBhcyBNZXRhZGF0YTtcbiAgcmV0dXJuIGZyb21SZXNvdXJjZShzZXJ2aWNlLCByZXNvdXJjZSwgbWFwcGluZ3MpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZG93bmxvYWRVcmxGcm9tUmVzb3VyY2VTdHJpbmcoXG4gIG1ldGFkYXRhOiBNZXRhZGF0YSxcbiAgcmVzb3VyY2VTdHJpbmc6IHN0cmluZyxcbiAgaG9zdDogc3RyaW5nLFxuICBwcm90b2NvbDogc3RyaW5nXG4pOiBzdHJpbmcgfCBudWxsIHtcbiAgY29uc3Qgb2JqID0ganNvbk9iamVjdE9yTnVsbChyZXNvdXJjZVN0cmluZyk7XG4gIGlmIChvYmogPT09IG51bGwpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBpZiAoIWlzU3RyaW5nKG9ialsnZG93bmxvYWRUb2tlbnMnXSkpIHtcbiAgICAvLyBUaGlzIGNhbiBoYXBwZW4gaWYgb2JqZWN0cyBhcmUgdXBsb2FkZWQgdGhyb3VnaCBHQ1MgYW5kIHJldHJpZXZlZFxuICAgIC8vIHRocm91Z2ggbGlzdCwgc28gd2UgZG9uJ3Qgd2FudCB0byB0aHJvdyBhbiBFcnJvci5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBjb25zdCB0b2tlbnM6IHN0cmluZyA9IG9ialsnZG93bmxvYWRUb2tlbnMnXSBhcyBzdHJpbmc7XG4gIGlmICh0b2tlbnMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgY29uc3QgZW5jb2RlID0gZW5jb2RlVVJJQ29tcG9uZW50O1xuICBjb25zdCB0b2tlbnNMaXN0ID0gdG9rZW5zLnNwbGl0KCcsJyk7XG4gIGNvbnN0IHVybHMgPSB0b2tlbnNMaXN0Lm1hcCgodG9rZW46IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgY29uc3QgYnVja2V0OiBzdHJpbmcgPSBtZXRhZGF0YVsnYnVja2V0J10gYXMgc3RyaW5nO1xuICAgIGNvbnN0IHBhdGg6IHN0cmluZyA9IG1ldGFkYXRhWydmdWxsUGF0aCddIGFzIHN0cmluZztcbiAgICBjb25zdCB1cmxQYXJ0ID0gJy9iLycgKyBlbmNvZGUoYnVja2V0KSArICcvby8nICsgZW5jb2RlKHBhdGgpO1xuICAgIGNvbnN0IGJhc2UgPSBtYWtlVXJsKHVybFBhcnQsIGhvc3QsIHByb3RvY29sKTtcbiAgICBjb25zdCBxdWVyeVN0cmluZyA9IG1ha2VRdWVyeVN0cmluZyh7XG4gICAgICBhbHQ6ICdtZWRpYScsXG4gICAgICB0b2tlblxuICAgIH0pO1xuICAgIHJldHVybiBiYXNlICsgcXVlcnlTdHJpbmc7XG4gIH0pO1xuICByZXR1cm4gdXJsc1swXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvUmVzb3VyY2VTdHJpbmcoXG4gIG1ldGFkYXRhOiBQYXJ0aWFsPE1ldGFkYXRhPixcbiAgbWFwcGluZ3M6IE1hcHBpbmdzXG4pOiBzdHJpbmcge1xuICBjb25zdCByZXNvdXJjZToge1xuICAgIFtwcm9wOiBzdHJpbmddOiB1bmtub3duO1xuICB9ID0ge307XG4gIGNvbnN0IGxlbiA9IG1hcHBpbmdzLmxlbmd0aDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgIGNvbnN0IG1hcHBpbmcgPSBtYXBwaW5nc1tpXTtcbiAgICBpZiAobWFwcGluZy53cml0YWJsZSkge1xuICAgICAgcmVzb3VyY2VbbWFwcGluZy5zZXJ2ZXJdID0gbWV0YWRhdGFbbWFwcGluZy5sb2NhbF07XG4gICAgfVxuICB9XG4gIHJldHVybiBKU09OLnN0cmluZ2lmeShyZXNvdXJjZSk7XG59XG4iLCAiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IERvY3VtZW50YXRpb24gZm9yIHRoZSBsaXN0T3B0aW9ucyBhbmQgbGlzdFJlc3VsdCBmb3JtYXRcbiAqL1xuaW1wb3J0IHsgTG9jYXRpb24gfSBmcm9tICcuL2xvY2F0aW9uJztcbmltcG9ydCB7IGpzb25PYmplY3RPck51bGwgfSBmcm9tICcuL2pzb24nO1xuaW1wb3J0IHsgTGlzdFJlc3VsdCB9IGZyb20gJy4uL2xpc3QnO1xuaW1wb3J0IHsgRmlyZWJhc2VTdG9yYWdlSW1wbCB9IGZyb20gJy4uL3NlcnZpY2UnO1xuXG4vKipcbiAqIFJlcHJlc2VudHMgdGhlIHNpbXBsaWZpZWQgb2JqZWN0IG1ldGFkYXRhIHJldHVybmVkIGJ5IExpc3QgQVBJLlxuICogT3RoZXIgZmllbGRzIGFyZSBmaWx0ZXJlZCBiZWNhdXNlIGxpc3QgaW4gRmlyZWJhc2UgUnVsZXMgZG9lcyBub3QgZ3JhbnRcbiAqIHRoZSBwZXJtaXNzaW9uIHRvIHJlYWQgdGhlIG1ldGFkYXRhLlxuICovXG5pbnRlcmZhY2UgTGlzdE1ldGFkYXRhUmVzcG9uc2Uge1xuICBuYW1lOiBzdHJpbmc7XG4gIGJ1Y2tldDogc3RyaW5nO1xufVxuXG4vKipcbiAqIFJlcHJlc2VudHMgdGhlIEpTT04gcmVzcG9uc2Ugb2YgTGlzdCBBUEkuXG4gKi9cbmludGVyZmFjZSBMaXN0UmVzdWx0UmVzcG9uc2Uge1xuICBwcmVmaXhlczogc3RyaW5nW107XG4gIGl0ZW1zOiBMaXN0TWV0YWRhdGFSZXNwb25zZVtdO1xuICBuZXh0UGFnZVRva2VuPzogc3RyaW5nO1xufVxuXG5jb25zdCBQUkVGSVhFU19LRVkgPSAncHJlZml4ZXMnO1xuY29uc3QgSVRFTVNfS0VZID0gJ2l0ZW1zJztcblxuZnVuY3Rpb24gZnJvbUJhY2tlbmRSZXNwb25zZShcbiAgc2VydmljZTogRmlyZWJhc2VTdG9yYWdlSW1wbCxcbiAgYnVja2V0OiBzdHJpbmcsXG4gIHJlc291cmNlOiBMaXN0UmVzdWx0UmVzcG9uc2Vcbik6IExpc3RSZXN1bHQge1xuICBjb25zdCBsaXN0UmVzdWx0OiBMaXN0UmVzdWx0ID0ge1xuICAgIHByZWZpeGVzOiBbXSxcbiAgICBpdGVtczogW10sXG4gICAgbmV4dFBhZ2VUb2tlbjogcmVzb3VyY2VbJ25leHRQYWdlVG9rZW4nXVxuICB9O1xuICBpZiAocmVzb3VyY2VbUFJFRklYRVNfS0VZXSkge1xuICAgIGZvciAoY29uc3QgcGF0aCBvZiByZXNvdXJjZVtQUkVGSVhFU19LRVldKSB7XG4gICAgICBjb25zdCBwYXRoV2l0aG91dFRyYWlsaW5nU2xhc2ggPSBwYXRoLnJlcGxhY2UoL1xcLyQvLCAnJyk7XG4gICAgICBjb25zdCByZWZlcmVuY2UgPSBzZXJ2aWNlLl9tYWtlU3RvcmFnZVJlZmVyZW5jZShcbiAgICAgICAgbmV3IExvY2F0aW9uKGJ1Y2tldCwgcGF0aFdpdGhvdXRUcmFpbGluZ1NsYXNoKVxuICAgICAgKTtcbiAgICAgIGxpc3RSZXN1bHQucHJlZml4ZXMucHVzaChyZWZlcmVuY2UpO1xuICAgIH1cbiAgfVxuXG4gIGlmIChyZXNvdXJjZVtJVEVNU19LRVldKSB7XG4gICAgZm9yIChjb25zdCBpdGVtIG9mIHJlc291cmNlW0lURU1TX0tFWV0pIHtcbiAgICAgIGNvbnN0IHJlZmVyZW5jZSA9IHNlcnZpY2UuX21ha2VTdG9yYWdlUmVmZXJlbmNlKFxuICAgICAgICBuZXcgTG9jYXRpb24oYnVja2V0LCBpdGVtWyduYW1lJ10pXG4gICAgICApO1xuICAgICAgbGlzdFJlc3VsdC5pdGVtcy5wdXNoKHJlZmVyZW5jZSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBsaXN0UmVzdWx0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZnJvbVJlc3BvbnNlU3RyaW5nKFxuICBzZXJ2aWNlOiBGaXJlYmFzZVN0b3JhZ2VJbXBsLFxuICBidWNrZXQ6IHN0cmluZyxcbiAgcmVzb3VyY2VTdHJpbmc6IHN0cmluZ1xuKTogTGlzdFJlc3VsdCB8IG51bGwge1xuICBjb25zdCBvYmogPSBqc29uT2JqZWN0T3JOdWxsKHJlc291cmNlU3RyaW5nKTtcbiAgaWYgKG9iaiA9PT0gbnVsbCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIGNvbnN0IHJlc291cmNlID0gb2JqIGFzIHVua25vd24gYXMgTGlzdFJlc3VsdFJlc3BvbnNlO1xuICByZXR1cm4gZnJvbUJhY2tlbmRSZXNwb25zZShzZXJ2aWNlLCBidWNrZXQsIHJlc291cmNlKTtcbn1cbiIsICIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuaW1wb3J0IHsgU3RvcmFnZUVycm9yIH0gZnJvbSAnLi9lcnJvcic7XG5pbXBvcnQgeyBIZWFkZXJzLCBDb25uZWN0aW9uLCBDb25uZWN0aW9uVHlwZSB9IGZyb20gJy4vY29ubmVjdGlvbic7XG5cbi8qKlxuICogVHlwZSBmb3IgdXJsIHBhcmFtcyBzdG9yZWQgaW4gUmVxdWVzdEluZm8uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVXJsUGFyYW1zIHtcbiAgW25hbWU6IHN0cmluZ106IHN0cmluZyB8IG51bWJlcjtcbn1cblxuLyoqXG4gKiBBIGZ1bmN0aW9uIHRoYXQgY29udmVydHMgYSBzZXJ2ZXIgcmVzcG9uc2UgdG8gdGhlIEFQSSB0eXBlIGV4cGVjdGVkIGJ5IHRoZVxuICogU0RLLlxuICpcbiAqIEBwYXJhbSBJIC0gdGhlIHR5cGUgb2YgdGhlIGJhY2tlbmQncyBuZXR3b3JrIHJlc3BvbnNlXG4gKiBAcGFyYW0gTyAtIHRoZSBvdXRwdXQgcmVzcG9uc2UgdHlwZSB1c2VkIGJ5IHRoZSByZXN0IG9mIHRoZSBTREsuXG4gKi9cbmV4cG9ydCB0eXBlIFJlcXVlc3RIYW5kbGVyPEkgZXh0ZW5kcyBDb25uZWN0aW9uVHlwZSwgTz4gPSAoXG4gIGNvbm5lY3Rpb246IENvbm5lY3Rpb248ST4sXG4gIHJlc3BvbnNlOiBJXG4pID0+IE87XG5cbi8qKiBBIGZ1bmN0aW9uIHRvIGhhbmRsZSBhbiBlcnJvci4gKi9cbmV4cG9ydCB0eXBlIEVycm9ySGFuZGxlciA9IChcbiAgY29ubmVjdGlvbjogQ29ubmVjdGlvbjxDb25uZWN0aW9uVHlwZT4sXG4gIHJlc3BvbnNlOiBTdG9yYWdlRXJyb3JcbikgPT4gU3RvcmFnZUVycm9yO1xuXG4vKipcbiAqIENvbnRhaW5zIGEgZnVsbHkgc3BlY2lmaWVkIHJlcXVlc3QuXG4gKlxuICogQHBhcmFtIEkgLSB0aGUgdHlwZSBvZiB0aGUgYmFja2VuZCdzIG5ldHdvcmsgcmVzcG9uc2UuXG4gKiBAcGFyYW0gTyAtIHRoZSBvdXRwdXQgcmVzcG9uc2UgdHlwZSB1c2VkIGJ5IHRoZSByZXN0IG9mIHRoZSBTREsuXG4gKi9cbmV4cG9ydCBjbGFzcyBSZXF1ZXN0SW5mbzxJIGV4dGVuZHMgQ29ubmVjdGlvblR5cGUsIE8+IHtcbiAgdXJsUGFyYW1zOiBVcmxQYXJhbXMgPSB7fTtcbiAgaGVhZGVyczogSGVhZGVycyA9IHt9O1xuICBib2R5OiBCbG9iIHwgc3RyaW5nIHwgVWludDhBcnJheSB8IG51bGwgPSBudWxsO1xuICBlcnJvckhhbmRsZXI6IEVycm9ySGFuZGxlciB8IG51bGwgPSBudWxsO1xuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2l0aCB0aGUgY3VycmVudCBudW1iZXIgb2YgYnl0ZXMgdXBsb2FkZWQgYW5kIHRvdGFsIHNpemUgKC0xIGlmIG5vdFxuICAgKiBjb21wdXRhYmxlKSBvZiB0aGUgcmVxdWVzdCBib2R5IChpLmUuIHVzZWQgdG8gcmVwb3J0IHVwbG9hZCBwcm9ncmVzcykuXG4gICAqL1xuICBwcm9ncmVzc0NhbGxiYWNrOiAoKHAxOiBudW1iZXIsIHAyOiBudW1iZXIpID0+IHZvaWQpIHwgbnVsbCA9IG51bGw7XG4gIHN1Y2Nlc3NDb2RlczogbnVtYmVyW10gPSBbMjAwXTtcbiAgYWRkaXRpb25hbFJldHJ5Q29kZXM6IG51bWJlcltdID0gW107XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIHVybDogc3RyaW5nLFxuICAgIHB1YmxpYyBtZXRob2Q6IHN0cmluZyxcbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSB2YWx1ZSB3aXRoIHdoaWNoIHRvIHJlc29sdmUgdGhlIHJlcXVlc3QncyBwcm9taXNlLiBPbmx5IGNhbGxlZFxuICAgICAqIGlmIHRoZSByZXF1ZXN0IGlzIHN1Y2Nlc3NmdWwuIFRocm93IGZyb20gdGhpcyBmdW5jdGlvbiB0byByZWplY3QgdGhlXG4gICAgICogcmV0dXJuZWQgUmVxdWVzdCdzIHByb21pc2Ugd2l0aCB0aGUgdGhyb3duIGVycm9yLlxuICAgICAqIE5vdGU6IFRoZSBYaHJJbyBwYXNzZWQgdG8gdGhpcyBmdW5jdGlvbiBtYXkgYmUgcmV1c2VkIGFmdGVyIHRoaXMgY2FsbGJhY2tcbiAgICAgKiByZXR1cm5zLiBEbyBub3Qga2VlcCBhIHJlZmVyZW5jZSB0byBpdCBpbiBhbnkgd2F5LlxuICAgICAqL1xuICAgIHB1YmxpYyBoYW5kbGVyOiBSZXF1ZXN0SGFuZGxlcjxJLCBPPixcbiAgICBwdWJsaWMgdGltZW91dDogbnVtYmVyXG4gICkge31cbn1cbiIsICIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4vKipcbiAqIEBmaWxlb3ZlcnZpZXcgRGVmaW5lcyBtZXRob2RzIGZvciBpbnRlcmFjdGluZyB3aXRoIHRoZSBuZXR3b3JrLlxuICovXG5cbmltcG9ydCB7IE1ldGFkYXRhIH0gZnJvbSAnLi4vbWV0YWRhdGEnO1xuaW1wb3J0IHsgTGlzdFJlc3VsdCB9IGZyb20gJy4uL2xpc3QnO1xuaW1wb3J0IHsgRmJzQmxvYiB9IGZyb20gJy4vYmxvYic7XG5pbXBvcnQge1xuICBTdG9yYWdlRXJyb3IsXG4gIGNhbm5vdFNsaWNlQmxvYixcbiAgdW5hdXRoZW50aWNhdGVkLFxuICBxdW90YUV4Y2VlZGVkLFxuICB1bmF1dGhvcml6ZWQsXG4gIG9iamVjdE5vdEZvdW5kLFxuICBzZXJ2ZXJGaWxlV3JvbmdTaXplLFxuICB1bmtub3duLFxuICB1bmF1dGhvcml6ZWRBcHBcbn0gZnJvbSAnLi9lcnJvcic7XG5pbXBvcnQgeyBMb2NhdGlvbiB9IGZyb20gJy4vbG9jYXRpb24nO1xuaW1wb3J0IHtcbiAgTWFwcGluZ3MsXG4gIGZyb21SZXNvdXJjZVN0cmluZyxcbiAgZG93bmxvYWRVcmxGcm9tUmVzb3VyY2VTdHJpbmcsXG4gIHRvUmVzb3VyY2VTdHJpbmdcbn0gZnJvbSAnLi9tZXRhZGF0YSc7XG5pbXBvcnQgeyBmcm9tUmVzcG9uc2VTdHJpbmcgfSBmcm9tICcuL2xpc3QnO1xuaW1wb3J0IHsgUmVxdWVzdEluZm8sIFVybFBhcmFtcyB9IGZyb20gJy4vcmVxdWVzdGluZm8nO1xuaW1wb3J0IHsgaXNTdHJpbmcgfSBmcm9tICcuL3R5cGUnO1xuaW1wb3J0IHsgbWFrZVVybCB9IGZyb20gJy4vdXJsJztcbmltcG9ydCB7IENvbm5lY3Rpb24sIENvbm5lY3Rpb25UeXBlIH0gZnJvbSAnLi9jb25uZWN0aW9uJztcbmltcG9ydCB7IEZpcmViYXNlU3RvcmFnZUltcGwgfSBmcm9tICcuLi9zZXJ2aWNlJztcblxuLyoqXG4gKiBUaHJvd3MgdGhlIFVOS05PV04gU3RvcmFnZUVycm9yIGlmIGNuZG4gaXMgZmFsc2UuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBoYW5kbGVyQ2hlY2soY25kbjogYm9vbGVhbik6IHZvaWQge1xuICBpZiAoIWNuZG4pIHtcbiAgICB0aHJvdyB1bmtub3duKCk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1ldGFkYXRhSGFuZGxlcihcbiAgc2VydmljZTogRmlyZWJhc2VTdG9yYWdlSW1wbCxcbiAgbWFwcGluZ3M6IE1hcHBpbmdzXG4pOiAocDE6IENvbm5lY3Rpb248c3RyaW5nPiwgcDI6IHN0cmluZykgPT4gTWV0YWRhdGEge1xuICBmdW5jdGlvbiBoYW5kbGVyKHhocjogQ29ubmVjdGlvbjxzdHJpbmc+LCB0ZXh0OiBzdHJpbmcpOiBNZXRhZGF0YSB7XG4gICAgY29uc3QgbWV0YWRhdGEgPSBmcm9tUmVzb3VyY2VTdHJpbmcoc2VydmljZSwgdGV4dCwgbWFwcGluZ3MpO1xuICAgIGhhbmRsZXJDaGVjayhtZXRhZGF0YSAhPT0gbnVsbCk7XG4gICAgcmV0dXJuIG1ldGFkYXRhIGFzIE1ldGFkYXRhO1xuICB9XG4gIHJldHVybiBoYW5kbGVyO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbGlzdEhhbmRsZXIoXG4gIHNlcnZpY2U6IEZpcmViYXNlU3RvcmFnZUltcGwsXG4gIGJ1Y2tldDogc3RyaW5nXG4pOiAocDE6IENvbm5lY3Rpb248c3RyaW5nPiwgcDI6IHN0cmluZykgPT4gTGlzdFJlc3VsdCB7XG4gIGZ1bmN0aW9uIGhhbmRsZXIoeGhyOiBDb25uZWN0aW9uPHN0cmluZz4sIHRleHQ6IHN0cmluZyk6IExpc3RSZXN1bHQge1xuICAgIGNvbnN0IGxpc3RSZXN1bHQgPSBmcm9tUmVzcG9uc2VTdHJpbmcoc2VydmljZSwgYnVja2V0LCB0ZXh0KTtcbiAgICBoYW5kbGVyQ2hlY2sobGlzdFJlc3VsdCAhPT0gbnVsbCk7XG4gICAgcmV0dXJuIGxpc3RSZXN1bHQgYXMgTGlzdFJlc3VsdDtcbiAgfVxuICByZXR1cm4gaGFuZGxlcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRvd25sb2FkVXJsSGFuZGxlcihcbiAgc2VydmljZTogRmlyZWJhc2VTdG9yYWdlSW1wbCxcbiAgbWFwcGluZ3M6IE1hcHBpbmdzXG4pOiAocDE6IENvbm5lY3Rpb248c3RyaW5nPiwgcDI6IHN0cmluZykgPT4gc3RyaW5nIHwgbnVsbCB7XG4gIGZ1bmN0aW9uIGhhbmRsZXIoeGhyOiBDb25uZWN0aW9uPHN0cmluZz4sIHRleHQ6IHN0cmluZyk6IHN0cmluZyB8IG51bGwge1xuICAgIGNvbnN0IG1ldGFkYXRhID0gZnJvbVJlc291cmNlU3RyaW5nKHNlcnZpY2UsIHRleHQsIG1hcHBpbmdzKTtcbiAgICBoYW5kbGVyQ2hlY2sobWV0YWRhdGEgIT09IG51bGwpO1xuICAgIHJldHVybiBkb3dubG9hZFVybEZyb21SZXNvdXJjZVN0cmluZyhcbiAgICAgIG1ldGFkYXRhIGFzIE1ldGFkYXRhLFxuICAgICAgdGV4dCxcbiAgICAgIHNlcnZpY2UuaG9zdCxcbiAgICAgIHNlcnZpY2UuX3Byb3RvY29sXG4gICAgKTtcbiAgfVxuICByZXR1cm4gaGFuZGxlcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNoYXJlZEVycm9ySGFuZGxlcihcbiAgbG9jYXRpb246IExvY2F0aW9uXG4pOiAocDE6IENvbm5lY3Rpb248Q29ubmVjdGlvblR5cGU+LCBwMjogU3RvcmFnZUVycm9yKSA9PiBTdG9yYWdlRXJyb3Ige1xuICBmdW5jdGlvbiBlcnJvckhhbmRsZXIoXG4gICAgeGhyOiBDb25uZWN0aW9uPENvbm5lY3Rpb25UeXBlPixcbiAgICBlcnI6IFN0b3JhZ2VFcnJvclxuICApOiBTdG9yYWdlRXJyb3Ige1xuICAgIGxldCBuZXdFcnI6IFN0b3JhZ2VFcnJvcjtcbiAgICBpZiAoeGhyLmdldFN0YXR1cygpID09PSA0MDEpIHtcbiAgICAgIGlmIChcbiAgICAgICAgLy8gVGhpcyBleGFjdCBtZXNzYWdlIHN0cmluZyBpcyB0aGUgb25seSBjb25zaXN0ZW50IHBhcnQgb2YgdGhlXG4gICAgICAgIC8vIHNlcnZlcidzIGVycm9yIHJlc3BvbnNlIHRoYXQgaWRlbnRpZmllcyBpdCBhcyBhbiBBcHAgQ2hlY2sgZXJyb3IuXG4gICAgICAgIHhoci5nZXRFcnJvclRleHQoKS5pbmNsdWRlcygnRmlyZWJhc2UgQXBwIENoZWNrIHRva2VuIGlzIGludmFsaWQnKVxuICAgICAgKSB7XG4gICAgICAgIG5ld0VyciA9IHVuYXV0aG9yaXplZEFwcCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmV3RXJyID0gdW5hdXRoZW50aWNhdGVkKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh4aHIuZ2V0U3RhdHVzKCkgPT09IDQwMikge1xuICAgICAgICBuZXdFcnIgPSBxdW90YUV4Y2VlZGVkKGxvY2F0aW9uLmJ1Y2tldCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoeGhyLmdldFN0YXR1cygpID09PSA0MDMpIHtcbiAgICAgICAgICBuZXdFcnIgPSB1bmF1dGhvcml6ZWQobG9jYXRpb24ucGF0aCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbmV3RXJyID0gZXJyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIG5ld0Vyci5zdGF0dXMgPSB4aHIuZ2V0U3RhdHVzKCk7XG4gICAgbmV3RXJyLnNlcnZlclJlc3BvbnNlID0gZXJyLnNlcnZlclJlc3BvbnNlO1xuICAgIHJldHVybiBuZXdFcnI7XG4gIH1cbiAgcmV0dXJuIGVycm9ySGFuZGxlcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG9iamVjdEVycm9ySGFuZGxlcihcbiAgbG9jYXRpb246IExvY2F0aW9uXG4pOiAocDE6IENvbm5lY3Rpb248Q29ubmVjdGlvblR5cGU+LCBwMjogU3RvcmFnZUVycm9yKSA9PiBTdG9yYWdlRXJyb3Ige1xuICBjb25zdCBzaGFyZWQgPSBzaGFyZWRFcnJvckhhbmRsZXIobG9jYXRpb24pO1xuXG4gIGZ1bmN0aW9uIGVycm9ySGFuZGxlcihcbiAgICB4aHI6IENvbm5lY3Rpb248Q29ubmVjdGlvblR5cGU+LFxuICAgIGVycjogU3RvcmFnZUVycm9yXG4gICk6IFN0b3JhZ2VFcnJvciB7XG4gICAgbGV0IG5ld0VyciA9IHNoYXJlZCh4aHIsIGVycik7XG4gICAgaWYgKHhoci5nZXRTdGF0dXMoKSA9PT0gNDA0KSB7XG4gICAgICBuZXdFcnIgPSBvYmplY3ROb3RGb3VuZChsb2NhdGlvbi5wYXRoKTtcbiAgICB9XG4gICAgbmV3RXJyLnNlcnZlclJlc3BvbnNlID0gZXJyLnNlcnZlclJlc3BvbnNlO1xuICAgIHJldHVybiBuZXdFcnI7XG4gIH1cbiAgcmV0dXJuIGVycm9ySGFuZGxlcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldE1ldGFkYXRhKFxuICBzZXJ2aWNlOiBGaXJlYmFzZVN0b3JhZ2VJbXBsLFxuICBsb2NhdGlvbjogTG9jYXRpb24sXG4gIG1hcHBpbmdzOiBNYXBwaW5nc1xuKTogUmVxdWVzdEluZm88c3RyaW5nLCBNZXRhZGF0YT4ge1xuICBjb25zdCB1cmxQYXJ0ID0gbG9jYXRpb24uZnVsbFNlcnZlclVybCgpO1xuICBjb25zdCB1cmwgPSBtYWtlVXJsKHVybFBhcnQsIHNlcnZpY2UuaG9zdCwgc2VydmljZS5fcHJvdG9jb2wpO1xuICBjb25zdCBtZXRob2QgPSAnR0VUJztcbiAgY29uc3QgdGltZW91dCA9IHNlcnZpY2UubWF4T3BlcmF0aW9uUmV0cnlUaW1lO1xuICBjb25zdCByZXF1ZXN0SW5mbyA9IG5ldyBSZXF1ZXN0SW5mbyhcbiAgICB1cmwsXG4gICAgbWV0aG9kLFxuICAgIG1ldGFkYXRhSGFuZGxlcihzZXJ2aWNlLCBtYXBwaW5ncyksXG4gICAgdGltZW91dFxuICApO1xuICByZXF1ZXN0SW5mby5lcnJvckhhbmRsZXIgPSBvYmplY3RFcnJvckhhbmRsZXIobG9jYXRpb24pO1xuICByZXR1cm4gcmVxdWVzdEluZm87XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsaXN0KFxuICBzZXJ2aWNlOiBGaXJlYmFzZVN0b3JhZ2VJbXBsLFxuICBsb2NhdGlvbjogTG9jYXRpb24sXG4gIGRlbGltaXRlcj86IHN0cmluZyxcbiAgcGFnZVRva2VuPzogc3RyaW5nIHwgbnVsbCxcbiAgbWF4UmVzdWx0cz86IG51bWJlciB8IG51bGxcbik6IFJlcXVlc3RJbmZvPHN0cmluZywgTGlzdFJlc3VsdD4ge1xuICBjb25zdCB1cmxQYXJhbXM6IFVybFBhcmFtcyA9IHt9O1xuICBpZiAobG9jYXRpb24uaXNSb290KSB7XG4gICAgdXJsUGFyYW1zWydwcmVmaXgnXSA9ICcnO1xuICB9IGVsc2Uge1xuICAgIHVybFBhcmFtc1sncHJlZml4J10gPSBsb2NhdGlvbi5wYXRoICsgJy8nO1xuICB9XG4gIGlmIChkZWxpbWl0ZXIgJiYgZGVsaW1pdGVyLmxlbmd0aCA+IDApIHtcbiAgICB1cmxQYXJhbXNbJ2RlbGltaXRlciddID0gZGVsaW1pdGVyO1xuICB9XG4gIGlmIChwYWdlVG9rZW4pIHtcbiAgICB1cmxQYXJhbXNbJ3BhZ2VUb2tlbiddID0gcGFnZVRva2VuO1xuICB9XG4gIGlmIChtYXhSZXN1bHRzKSB7XG4gICAgdXJsUGFyYW1zWydtYXhSZXN1bHRzJ10gPSBtYXhSZXN1bHRzO1xuICB9XG4gIGNvbnN0IHVybFBhcnQgPSBsb2NhdGlvbi5idWNrZXRPbmx5U2VydmVyVXJsKCk7XG4gIGNvbnN0IHVybCA9IG1ha2VVcmwodXJsUGFydCwgc2VydmljZS5ob3N0LCBzZXJ2aWNlLl9wcm90b2NvbCk7XG4gIGNvbnN0IG1ldGhvZCA9ICdHRVQnO1xuICBjb25zdCB0aW1lb3V0ID0gc2VydmljZS5tYXhPcGVyYXRpb25SZXRyeVRpbWU7XG4gIGNvbnN0IHJlcXVlc3RJbmZvID0gbmV3IFJlcXVlc3RJbmZvKFxuICAgIHVybCxcbiAgICBtZXRob2QsXG4gICAgbGlzdEhhbmRsZXIoc2VydmljZSwgbG9jYXRpb24uYnVja2V0KSxcbiAgICB0aW1lb3V0XG4gICk7XG4gIHJlcXVlc3RJbmZvLnVybFBhcmFtcyA9IHVybFBhcmFtcztcbiAgcmVxdWVzdEluZm8uZXJyb3JIYW5kbGVyID0gc2hhcmVkRXJyb3JIYW5kbGVyKGxvY2F0aW9uKTtcbiAgcmV0dXJuIHJlcXVlc3RJbmZvO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Qnl0ZXM8SSBleHRlbmRzIENvbm5lY3Rpb25UeXBlPihcbiAgc2VydmljZTogRmlyZWJhc2VTdG9yYWdlSW1wbCxcbiAgbG9jYXRpb246IExvY2F0aW9uLFxuICBtYXhEb3dubG9hZFNpemVCeXRlcz86IG51bWJlclxuKTogUmVxdWVzdEluZm88SSwgST4ge1xuICBjb25zdCB1cmxQYXJ0ID0gbG9jYXRpb24uZnVsbFNlcnZlclVybCgpO1xuICBjb25zdCB1cmwgPSBtYWtlVXJsKHVybFBhcnQsIHNlcnZpY2UuaG9zdCwgc2VydmljZS5fcHJvdG9jb2wpICsgJz9hbHQ9bWVkaWEnO1xuICBjb25zdCBtZXRob2QgPSAnR0VUJztcbiAgY29uc3QgdGltZW91dCA9IHNlcnZpY2UubWF4T3BlcmF0aW9uUmV0cnlUaW1lO1xuICBjb25zdCByZXF1ZXN0SW5mbyA9IG5ldyBSZXF1ZXN0SW5mbyhcbiAgICB1cmwsXG4gICAgbWV0aG9kLFxuICAgIChfOiBDb25uZWN0aW9uPEk+LCBkYXRhOiBJKSA9PiBkYXRhLFxuICAgIHRpbWVvdXRcbiAgKTtcbiAgcmVxdWVzdEluZm8uZXJyb3JIYW5kbGVyID0gb2JqZWN0RXJyb3JIYW5kbGVyKGxvY2F0aW9uKTtcbiAgaWYgKG1heERvd25sb2FkU2l6ZUJ5dGVzICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXF1ZXN0SW5mby5oZWFkZXJzWydSYW5nZSddID0gYGJ5dGVzPTAtJHttYXhEb3dubG9hZFNpemVCeXRlc31gO1xuICAgIHJlcXVlc3RJbmZvLnN1Y2Nlc3NDb2RlcyA9IFsyMDAgLyogT0sgKi8sIDIwNiAvKiBQYXJ0aWFsIENvbnRlbnQgKi9dO1xuICB9XG4gIHJldHVybiByZXF1ZXN0SW5mbztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldERvd25sb2FkVXJsKFxuICBzZXJ2aWNlOiBGaXJlYmFzZVN0b3JhZ2VJbXBsLFxuICBsb2NhdGlvbjogTG9jYXRpb24sXG4gIG1hcHBpbmdzOiBNYXBwaW5nc1xuKTogUmVxdWVzdEluZm88c3RyaW5nLCBzdHJpbmcgfCBudWxsPiB7XG4gIGNvbnN0IHVybFBhcnQgPSBsb2NhdGlvbi5mdWxsU2VydmVyVXJsKCk7XG4gIGNvbnN0IHVybCA9IG1ha2VVcmwodXJsUGFydCwgc2VydmljZS5ob3N0LCBzZXJ2aWNlLl9wcm90b2NvbCk7XG4gIGNvbnN0IG1ldGhvZCA9ICdHRVQnO1xuICBjb25zdCB0aW1lb3V0ID0gc2VydmljZS5tYXhPcGVyYXRpb25SZXRyeVRpbWU7XG4gIGNvbnN0IHJlcXVlc3RJbmZvID0gbmV3IFJlcXVlc3RJbmZvKFxuICAgIHVybCxcbiAgICBtZXRob2QsXG4gICAgZG93bmxvYWRVcmxIYW5kbGVyKHNlcnZpY2UsIG1hcHBpbmdzKSxcbiAgICB0aW1lb3V0XG4gICk7XG4gIHJlcXVlc3RJbmZvLmVycm9ySGFuZGxlciA9IG9iamVjdEVycm9ySGFuZGxlcihsb2NhdGlvbik7XG4gIHJldHVybiByZXF1ZXN0SW5mbztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZU1ldGFkYXRhKFxuICBzZXJ2aWNlOiBGaXJlYmFzZVN0b3JhZ2VJbXBsLFxuICBsb2NhdGlvbjogTG9jYXRpb24sXG4gIG1ldGFkYXRhOiBQYXJ0aWFsPE1ldGFkYXRhPixcbiAgbWFwcGluZ3M6IE1hcHBpbmdzXG4pOiBSZXF1ZXN0SW5mbzxzdHJpbmcsIE1ldGFkYXRhPiB7XG4gIGNvbnN0IHVybFBhcnQgPSBsb2NhdGlvbi5mdWxsU2VydmVyVXJsKCk7XG4gIGNvbnN0IHVybCA9IG1ha2VVcmwodXJsUGFydCwgc2VydmljZS5ob3N0LCBzZXJ2aWNlLl9wcm90b2NvbCk7XG4gIGNvbnN0IG1ldGhvZCA9ICdQQVRDSCc7XG4gIGNvbnN0IGJvZHkgPSB0b1Jlc291cmNlU3RyaW5nKG1ldGFkYXRhLCBtYXBwaW5ncyk7XG4gIGNvbnN0IGhlYWRlcnMgPSB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcgfTtcbiAgY29uc3QgdGltZW91dCA9IHNlcnZpY2UubWF4T3BlcmF0aW9uUmV0cnlUaW1lO1xuICBjb25zdCByZXF1ZXN0SW5mbyA9IG5ldyBSZXF1ZXN0SW5mbyhcbiAgICB1cmwsXG4gICAgbWV0aG9kLFxuICAgIG1ldGFkYXRhSGFuZGxlcihzZXJ2aWNlLCBtYXBwaW5ncyksXG4gICAgdGltZW91dFxuICApO1xuICByZXF1ZXN0SW5mby5oZWFkZXJzID0gaGVhZGVycztcbiAgcmVxdWVzdEluZm8uYm9keSA9IGJvZHk7XG4gIHJlcXVlc3RJbmZvLmVycm9ySGFuZGxlciA9IG9iamVjdEVycm9ySGFuZGxlcihsb2NhdGlvbik7XG4gIHJldHVybiByZXF1ZXN0SW5mbztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlbGV0ZU9iamVjdChcbiAgc2VydmljZTogRmlyZWJhc2VTdG9yYWdlSW1wbCxcbiAgbG9jYXRpb246IExvY2F0aW9uXG4pOiBSZXF1ZXN0SW5mbzxzdHJpbmcsIHZvaWQ+IHtcbiAgY29uc3QgdXJsUGFydCA9IGxvY2F0aW9uLmZ1bGxTZXJ2ZXJVcmwoKTtcbiAgY29uc3QgdXJsID0gbWFrZVVybCh1cmxQYXJ0LCBzZXJ2aWNlLmhvc3QsIHNlcnZpY2UuX3Byb3RvY29sKTtcbiAgY29uc3QgbWV0aG9kID0gJ0RFTEVURSc7XG4gIGNvbnN0IHRpbWVvdXQgPSBzZXJ2aWNlLm1heE9wZXJhdGlvblJldHJ5VGltZTtcblxuICBmdW5jdGlvbiBoYW5kbGVyKF94aHI6IENvbm5lY3Rpb248c3RyaW5nPiwgX3RleHQ6IHN0cmluZyk6IHZvaWQge31cbiAgY29uc3QgcmVxdWVzdEluZm8gPSBuZXcgUmVxdWVzdEluZm8odXJsLCBtZXRob2QsIGhhbmRsZXIsIHRpbWVvdXQpO1xuICByZXF1ZXN0SW5mby5zdWNjZXNzQ29kZXMgPSBbMjAwLCAyMDRdO1xuICByZXF1ZXN0SW5mby5lcnJvckhhbmRsZXIgPSBvYmplY3RFcnJvckhhbmRsZXIobG9jYXRpb24pO1xuICByZXR1cm4gcmVxdWVzdEluZm87XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZXRlcm1pbmVDb250ZW50VHlwZV8oXG4gIG1ldGFkYXRhOiBNZXRhZGF0YSB8IG51bGwsXG4gIGJsb2I6IEZic0Jsb2IgfCBudWxsXG4pOiBzdHJpbmcge1xuICByZXR1cm4gKFxuICAgIChtZXRhZGF0YSAmJiBtZXRhZGF0YVsnY29udGVudFR5cGUnXSkgfHxcbiAgICAoYmxvYiAmJiBibG9iLnR5cGUoKSkgfHxcbiAgICAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ1xuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWV0YWRhdGFGb3JVcGxvYWRfKFxuICBsb2NhdGlvbjogTG9jYXRpb24sXG4gIGJsb2I6IEZic0Jsb2IsXG4gIG1ldGFkYXRhPzogTWV0YWRhdGEgfCBudWxsXG4pOiBNZXRhZGF0YSB7XG4gIGNvbnN0IG1ldGFkYXRhQ2xvbmUgPSBPYmplY3QuYXNzaWduKHt9LCBtZXRhZGF0YSk7XG4gIG1ldGFkYXRhQ2xvbmVbJ2Z1bGxQYXRoJ10gPSBsb2NhdGlvbi5wYXRoO1xuICBtZXRhZGF0YUNsb25lWydzaXplJ10gPSBibG9iLnNpemUoKTtcbiAgaWYgKCFtZXRhZGF0YUNsb25lWydjb250ZW50VHlwZSddKSB7XG4gICAgbWV0YWRhdGFDbG9uZVsnY29udGVudFR5cGUnXSA9IGRldGVybWluZUNvbnRlbnRUeXBlXyhudWxsLCBibG9iKTtcbiAgfVxuICByZXR1cm4gbWV0YWRhdGFDbG9uZTtcbn1cblxuLyoqXG4gKiBQcmVwYXJlIFJlcXVlc3RJbmZvIGZvciB1cGxvYWRzIGFzIENvbnRlbnQtVHlwZTogbXVsdGlwYXJ0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gbXVsdGlwYXJ0VXBsb2FkKFxuICBzZXJ2aWNlOiBGaXJlYmFzZVN0b3JhZ2VJbXBsLFxuICBsb2NhdGlvbjogTG9jYXRpb24sXG4gIG1hcHBpbmdzOiBNYXBwaW5ncyxcbiAgYmxvYjogRmJzQmxvYixcbiAgbWV0YWRhdGE/OiBNZXRhZGF0YSB8IG51bGxcbik6IFJlcXVlc3RJbmZvPHN0cmluZywgTWV0YWRhdGE+IHtcbiAgY29uc3QgdXJsUGFydCA9IGxvY2F0aW9uLmJ1Y2tldE9ubHlTZXJ2ZXJVcmwoKTtcbiAgY29uc3QgaGVhZGVyczogeyBbcHJvcDogc3RyaW5nXTogc3RyaW5nIH0gPSB7XG4gICAgJ1gtR29vZy1VcGxvYWQtUHJvdG9jb2wnOiAnbXVsdGlwYXJ0J1xuICB9O1xuXG4gIGZ1bmN0aW9uIGdlbkJvdW5kYXJ5KCk6IHN0cmluZyB7XG4gICAgbGV0IHN0ciA9ICcnO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMjsgaSsrKSB7XG4gICAgICBzdHIgPSBzdHIgKyBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKCkuc2xpY2UoMik7XG4gICAgfVxuICAgIHJldHVybiBzdHI7XG4gIH1cbiAgY29uc3QgYm91bmRhcnkgPSBnZW5Cb3VuZGFyeSgpO1xuICBoZWFkZXJzWydDb250ZW50LVR5cGUnXSA9ICdtdWx0aXBhcnQvcmVsYXRlZDsgYm91bmRhcnk9JyArIGJvdW5kYXJ5O1xuICBjb25zdCBtZXRhZGF0YV8gPSBtZXRhZGF0YUZvclVwbG9hZF8obG9jYXRpb24sIGJsb2IsIG1ldGFkYXRhKTtcbiAgY29uc3QgbWV0YWRhdGFTdHJpbmcgPSB0b1Jlc291cmNlU3RyaW5nKG1ldGFkYXRhXywgbWFwcGluZ3MpO1xuICBjb25zdCBwcmVCbG9iUGFydCA9XG4gICAgJy0tJyArXG4gICAgYm91bmRhcnkgK1xuICAgICdcXHJcXG4nICtcbiAgICAnQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04XFxyXFxuXFxyXFxuJyArXG4gICAgbWV0YWRhdGFTdHJpbmcgK1xuICAgICdcXHJcXG4tLScgK1xuICAgIGJvdW5kYXJ5ICtcbiAgICAnXFxyXFxuJyArXG4gICAgJ0NvbnRlbnQtVHlwZTogJyArXG4gICAgbWV0YWRhdGFfWydjb250ZW50VHlwZSddICtcbiAgICAnXFxyXFxuXFxyXFxuJztcbiAgY29uc3QgcG9zdEJsb2JQYXJ0ID0gJ1xcclxcbi0tJyArIGJvdW5kYXJ5ICsgJy0tJztcbiAgY29uc3QgYm9keSA9IEZic0Jsb2IuZ2V0QmxvYihwcmVCbG9iUGFydCwgYmxvYiwgcG9zdEJsb2JQYXJ0KTtcbiAgaWYgKGJvZHkgPT09IG51bGwpIHtcbiAgICB0aHJvdyBjYW5ub3RTbGljZUJsb2IoKTtcbiAgfVxuICBjb25zdCB1cmxQYXJhbXM6IFVybFBhcmFtcyA9IHsgbmFtZTogbWV0YWRhdGFfWydmdWxsUGF0aCddISB9O1xuICBjb25zdCB1cmwgPSBtYWtlVXJsKHVybFBhcnQsIHNlcnZpY2UuaG9zdCwgc2VydmljZS5fcHJvdG9jb2wpO1xuICBjb25zdCBtZXRob2QgPSAnUE9TVCc7XG4gIGNvbnN0IHRpbWVvdXQgPSBzZXJ2aWNlLm1heFVwbG9hZFJldHJ5VGltZTtcbiAgY29uc3QgcmVxdWVzdEluZm8gPSBuZXcgUmVxdWVzdEluZm8oXG4gICAgdXJsLFxuICAgIG1ldGhvZCxcbiAgICBtZXRhZGF0YUhhbmRsZXIoc2VydmljZSwgbWFwcGluZ3MpLFxuICAgIHRpbWVvdXRcbiAgKTtcbiAgcmVxdWVzdEluZm8udXJsUGFyYW1zID0gdXJsUGFyYW1zO1xuICByZXF1ZXN0SW5mby5oZWFkZXJzID0gaGVhZGVycztcbiAgcmVxdWVzdEluZm8uYm9keSA9IGJvZHkudXBsb2FkRGF0YSgpO1xuICByZXF1ZXN0SW5mby5lcnJvckhhbmRsZXIgPSBzaGFyZWRFcnJvckhhbmRsZXIobG9jYXRpb24pO1xuICByZXR1cm4gcmVxdWVzdEluZm87XG59XG5cbi8qKlxuICogQHBhcmFtIGN1cnJlbnQgVGhlIG51bWJlciBvZiBieXRlcyB0aGF0IGhhdmUgYmVlbiB1cGxvYWRlZCBzbyBmYXIuXG4gKiBAcGFyYW0gdG90YWwgVGhlIHRvdGFsIG51bWJlciBvZiBieXRlcyBpbiB0aGUgdXBsb2FkLlxuICogQHBhcmFtIG9wdF9maW5hbGl6ZWQgVHJ1ZSBpZiB0aGUgc2VydmVyIGhhcyBmaW5pc2hlZCB0aGUgdXBsb2FkLlxuICogQHBhcmFtIG9wdF9tZXRhZGF0YSBUaGUgdXBsb2FkIG1ldGFkYXRhLCBzaG91bGRcbiAqICAgICBvbmx5IGJlIHBhc3NlZCBpZiBvcHRfZmluYWxpemVkIGlzIHRydWUuXG4gKi9cbmV4cG9ydCBjbGFzcyBSZXN1bWFibGVVcGxvYWRTdGF0dXMge1xuICBmaW5hbGl6ZWQ6IGJvb2xlYW47XG4gIG1ldGFkYXRhOiBNZXRhZGF0YSB8IG51bGw7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIGN1cnJlbnQ6IG51bWJlcixcbiAgICBwdWJsaWMgdG90YWw6IG51bWJlcixcbiAgICBmaW5hbGl6ZWQ/OiBib29sZWFuLFxuICAgIG1ldGFkYXRhPzogTWV0YWRhdGEgfCBudWxsXG4gICkge1xuICAgIHRoaXMuZmluYWxpemVkID0gISFmaW5hbGl6ZWQ7XG4gICAgdGhpcy5tZXRhZGF0YSA9IG1ldGFkYXRhIHx8IG51bGw7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNoZWNrUmVzdW1lSGVhZGVyXyhcbiAgeGhyOiBDb25uZWN0aW9uPHN0cmluZz4sXG4gIGFsbG93ZWQ/OiBzdHJpbmdbXVxuKTogc3RyaW5nIHtcbiAgbGV0IHN0YXR1czogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIHRyeSB7XG4gICAgc3RhdHVzID0geGhyLmdldFJlc3BvbnNlSGVhZGVyKCdYLUdvb2ctVXBsb2FkLVN0YXR1cycpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgaGFuZGxlckNoZWNrKGZhbHNlKTtcbiAgfVxuICBjb25zdCBhbGxvd2VkU3RhdHVzID0gYWxsb3dlZCB8fCBbJ2FjdGl2ZSddO1xuICBoYW5kbGVyQ2hlY2soISFzdGF0dXMgJiYgYWxsb3dlZFN0YXR1cy5pbmRleE9mKHN0YXR1cykgIT09IC0xKTtcbiAgcmV0dXJuIHN0YXR1cyBhcyBzdHJpbmc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVSZXN1bWFibGVVcGxvYWQoXG4gIHNlcnZpY2U6IEZpcmViYXNlU3RvcmFnZUltcGwsXG4gIGxvY2F0aW9uOiBMb2NhdGlvbixcbiAgbWFwcGluZ3M6IE1hcHBpbmdzLFxuICBibG9iOiBGYnNCbG9iLFxuICBtZXRhZGF0YT86IE1ldGFkYXRhIHwgbnVsbFxuKTogUmVxdWVzdEluZm88c3RyaW5nLCBzdHJpbmc+IHtcbiAgY29uc3QgdXJsUGFydCA9IGxvY2F0aW9uLmJ1Y2tldE9ubHlTZXJ2ZXJVcmwoKTtcbiAgY29uc3QgbWV0YWRhdGFGb3JVcGxvYWQgPSBtZXRhZGF0YUZvclVwbG9hZF8obG9jYXRpb24sIGJsb2IsIG1ldGFkYXRhKTtcbiAgY29uc3QgdXJsUGFyYW1zOiBVcmxQYXJhbXMgPSB7IG5hbWU6IG1ldGFkYXRhRm9yVXBsb2FkWydmdWxsUGF0aCddISB9O1xuICBjb25zdCB1cmwgPSBtYWtlVXJsKHVybFBhcnQsIHNlcnZpY2UuaG9zdCwgc2VydmljZS5fcHJvdG9jb2wpO1xuICBjb25zdCBtZXRob2QgPSAnUE9TVCc7XG4gIGNvbnN0IGhlYWRlcnMgPSB7XG4gICAgJ1gtR29vZy1VcGxvYWQtUHJvdG9jb2wnOiAncmVzdW1hYmxlJyxcbiAgICAnWC1Hb29nLVVwbG9hZC1Db21tYW5kJzogJ3N0YXJ0JyxcbiAgICAnWC1Hb29nLVVwbG9hZC1IZWFkZXItQ29udGVudC1MZW5ndGgnOiBgJHtibG9iLnNpemUoKX1gLFxuICAgICdYLUdvb2ctVXBsb2FkLUhlYWRlci1Db250ZW50LVR5cGUnOiBtZXRhZGF0YUZvclVwbG9hZFsnY29udGVudFR5cGUnXSEsXG4gICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04J1xuICB9O1xuICBjb25zdCBib2R5ID0gdG9SZXNvdXJjZVN0cmluZyhtZXRhZGF0YUZvclVwbG9hZCwgbWFwcGluZ3MpO1xuICBjb25zdCB0aW1lb3V0ID0gc2VydmljZS5tYXhVcGxvYWRSZXRyeVRpbWU7XG5cbiAgZnVuY3Rpb24gaGFuZGxlcih4aHI6IENvbm5lY3Rpb248c3RyaW5nPik6IHN0cmluZyB7XG4gICAgY2hlY2tSZXN1bWVIZWFkZXJfKHhocik7XG4gICAgbGV0IHVybDtcbiAgICB0cnkge1xuICAgICAgdXJsID0geGhyLmdldFJlc3BvbnNlSGVhZGVyKCdYLUdvb2ctVXBsb2FkLVVSTCcpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGhhbmRsZXJDaGVjayhmYWxzZSk7XG4gICAgfVxuICAgIGhhbmRsZXJDaGVjayhpc1N0cmluZyh1cmwpKTtcbiAgICByZXR1cm4gdXJsIGFzIHN0cmluZztcbiAgfVxuICBjb25zdCByZXF1ZXN0SW5mbyA9IG5ldyBSZXF1ZXN0SW5mbyh1cmwsIG1ldGhvZCwgaGFuZGxlciwgdGltZW91dCk7XG4gIHJlcXVlc3RJbmZvLnVybFBhcmFtcyA9IHVybFBhcmFtcztcbiAgcmVxdWVzdEluZm8uaGVhZGVycyA9IGhlYWRlcnM7XG4gIHJlcXVlc3RJbmZvLmJvZHkgPSBib2R5O1xuICByZXF1ZXN0SW5mby5lcnJvckhhbmRsZXIgPSBzaGFyZWRFcnJvckhhbmRsZXIobG9jYXRpb24pO1xuICByZXR1cm4gcmVxdWVzdEluZm87XG59XG5cbi8qKlxuICogQHBhcmFtIHVybCBGcm9tIGEgY2FsbCB0byBmYnMucmVxdWVzdHMuY3JlYXRlUmVzdW1hYmxlVXBsb2FkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0UmVzdW1hYmxlVXBsb2FkU3RhdHVzKFxuICBzZXJ2aWNlOiBGaXJlYmFzZVN0b3JhZ2VJbXBsLFxuICBsb2NhdGlvbjogTG9jYXRpb24sXG4gIHVybDogc3RyaW5nLFxuICBibG9iOiBGYnNCbG9iXG4pOiBSZXF1ZXN0SW5mbzxzdHJpbmcsIFJlc3VtYWJsZVVwbG9hZFN0YXR1cz4ge1xuICBjb25zdCBoZWFkZXJzID0geyAnWC1Hb29nLVVwbG9hZC1Db21tYW5kJzogJ3F1ZXJ5JyB9O1xuXG4gIGZ1bmN0aW9uIGhhbmRsZXIoeGhyOiBDb25uZWN0aW9uPHN0cmluZz4pOiBSZXN1bWFibGVVcGxvYWRTdGF0dXMge1xuICAgIGNvbnN0IHN0YXR1cyA9IGNoZWNrUmVzdW1lSGVhZGVyXyh4aHIsIFsnYWN0aXZlJywgJ2ZpbmFsJ10pO1xuICAgIGxldCBzaXplU3RyaW5nOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgICB0cnkge1xuICAgICAgc2l6ZVN0cmluZyA9IHhoci5nZXRSZXNwb25zZUhlYWRlcignWC1Hb29nLVVwbG9hZC1TaXplLVJlY2VpdmVkJyk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgaGFuZGxlckNoZWNrKGZhbHNlKTtcbiAgICB9XG5cbiAgICBpZiAoIXNpemVTdHJpbmcpIHtcbiAgICAgIC8vIG51bGwgb3IgZW1wdHkgc3RyaW5nXG4gICAgICBoYW5kbGVyQ2hlY2soZmFsc2UpO1xuICAgIH1cblxuICAgIGNvbnN0IHNpemUgPSBOdW1iZXIoc2l6ZVN0cmluZyk7XG4gICAgaGFuZGxlckNoZWNrKCFpc05hTihzaXplKSk7XG4gICAgcmV0dXJuIG5ldyBSZXN1bWFibGVVcGxvYWRTdGF0dXMoc2l6ZSwgYmxvYi5zaXplKCksIHN0YXR1cyA9PT0gJ2ZpbmFsJyk7XG4gIH1cbiAgY29uc3QgbWV0aG9kID0gJ1BPU1QnO1xuICBjb25zdCB0aW1lb3V0ID0gc2VydmljZS5tYXhVcGxvYWRSZXRyeVRpbWU7XG4gIGNvbnN0IHJlcXVlc3RJbmZvID0gbmV3IFJlcXVlc3RJbmZvKHVybCwgbWV0aG9kLCBoYW5kbGVyLCB0aW1lb3V0KTtcbiAgcmVxdWVzdEluZm8uaGVhZGVycyA9IGhlYWRlcnM7XG4gIHJlcXVlc3RJbmZvLmVycm9ySGFuZGxlciA9IHNoYXJlZEVycm9ySGFuZGxlcihsb2NhdGlvbik7XG4gIHJldHVybiByZXF1ZXN0SW5mbztcbn1cblxuLyoqXG4gKiBBbnkgdXBsb2FkcyB2aWEgdGhlIHJlc3VtYWJsZSB1cGxvYWQgQVBJIG11c3QgdHJhbnNmZXIgYSBudW1iZXIgb2YgYnl0ZXNcbiAqIHRoYXQgaXMgYSBtdWx0aXBsZSBvZiB0aGlzIG51bWJlci5cbiAqL1xuZXhwb3J0IGNvbnN0IFJFU1VNQUJMRV9VUExPQURfQ0hVTktfU0laRTogbnVtYmVyID0gMjU2ICogMTAyNDtcblxuLyoqXG4gKiBAcGFyYW0gdXJsIEZyb20gYSBjYWxsIHRvIGZicy5yZXF1ZXN0cy5jcmVhdGVSZXN1bWFibGVVcGxvYWQuXG4gKiBAcGFyYW0gY2h1bmtTaXplIE51bWJlciBvZiBieXRlcyB0byB1cGxvYWQuXG4gKiBAcGFyYW0gc3RhdHVzIFRoZSBwcmV2aW91cyBzdGF0dXMuXG4gKiAgICAgSWYgbm90IHBhc3NlZCBvciBudWxsLCB3ZSBzdGFydCBmcm9tIHRoZSBiZWdpbm5pbmcuXG4gKiBAdGhyb3dzIGZicy5FcnJvciBJZiB0aGUgdXBsb2FkIGlzIGFscmVhZHkgY29tcGxldGUsIHRoZSBwYXNzZWQgaW4gc3RhdHVzXG4gKiAgICAgaGFzIGEgZmluYWwgc2l6ZSBpbmNvbnNpc3RlbnQgd2l0aCB0aGUgYmxvYiwgb3IgdGhlIGJsb2IgY2Fubm90IGJlIHNsaWNlZFxuICogICAgIGZvciB1cGxvYWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb250aW51ZVJlc3VtYWJsZVVwbG9hZChcbiAgbG9jYXRpb246IExvY2F0aW9uLFxuICBzZXJ2aWNlOiBGaXJlYmFzZVN0b3JhZ2VJbXBsLFxuICB1cmw6IHN0cmluZyxcbiAgYmxvYjogRmJzQmxvYixcbiAgY2h1bmtTaXplOiBudW1iZXIsXG4gIG1hcHBpbmdzOiBNYXBwaW5ncyxcbiAgc3RhdHVzPzogUmVzdW1hYmxlVXBsb2FkU3RhdHVzIHwgbnVsbCxcbiAgcHJvZ3Jlc3NDYWxsYmFjaz86ICgocDE6IG51bWJlciwgcDI6IG51bWJlcikgPT4gdm9pZCkgfCBudWxsXG4pOiBSZXF1ZXN0SW5mbzxzdHJpbmcsIFJlc3VtYWJsZVVwbG9hZFN0YXR1cz4ge1xuICAvLyBUT0RPKGFuZHlzb3RvKTogc3RhbmRhcmRpemUgb24gaW50ZXJuYWwgYXNzZXJ0c1xuICAvLyBhc3NlcnQoIShvcHRfc3RhdHVzICYmIG9wdF9zdGF0dXMuZmluYWxpemVkKSk7XG4gIGNvbnN0IHN0YXR1c18gPSBuZXcgUmVzdW1hYmxlVXBsb2FkU3RhdHVzKDAsIDApO1xuICBpZiAoc3RhdHVzKSB7XG4gICAgc3RhdHVzXy5jdXJyZW50ID0gc3RhdHVzLmN1cnJlbnQ7XG4gICAgc3RhdHVzXy50b3RhbCA9IHN0YXR1cy50b3RhbDtcbiAgfSBlbHNlIHtcbiAgICBzdGF0dXNfLmN1cnJlbnQgPSAwO1xuICAgIHN0YXR1c18udG90YWwgPSBibG9iLnNpemUoKTtcbiAgfVxuICBpZiAoYmxvYi5zaXplKCkgIT09IHN0YXR1c18udG90YWwpIHtcbiAgICB0aHJvdyBzZXJ2ZXJGaWxlV3JvbmdTaXplKCk7XG4gIH1cbiAgY29uc3QgYnl0ZXNMZWZ0ID0gc3RhdHVzXy50b3RhbCAtIHN0YXR1c18uY3VycmVudDtcbiAgbGV0IGJ5dGVzVG9VcGxvYWQgPSBieXRlc0xlZnQ7XG4gIGlmIChjaHVua1NpemUgPiAwKSB7XG4gICAgYnl0ZXNUb1VwbG9hZCA9IE1hdGgubWluKGJ5dGVzVG9VcGxvYWQsIGNodW5rU2l6ZSk7XG4gIH1cbiAgY29uc3Qgc3RhcnRCeXRlID0gc3RhdHVzXy5jdXJyZW50O1xuICBjb25zdCBlbmRCeXRlID0gc3RhcnRCeXRlICsgYnl0ZXNUb1VwbG9hZDtcbiAgbGV0IHVwbG9hZENvbW1hbmQgPSAnJztcbiAgaWYgKGJ5dGVzVG9VcGxvYWQgPT09IDApIHtcbiAgICB1cGxvYWRDb21tYW5kID0gJ2ZpbmFsaXplJztcbiAgfSBlbHNlIGlmIChieXRlc0xlZnQgPT09IGJ5dGVzVG9VcGxvYWQpIHtcbiAgICB1cGxvYWRDb21tYW5kID0gJ3VwbG9hZCwgZmluYWxpemUnO1xuICB9IGVsc2Uge1xuICAgIHVwbG9hZENvbW1hbmQgPSAndXBsb2FkJztcbiAgfVxuICBjb25zdCBoZWFkZXJzID0ge1xuICAgICdYLUdvb2ctVXBsb2FkLUNvbW1hbmQnOiB1cGxvYWRDb21tYW5kLFxuICAgICdYLUdvb2ctVXBsb2FkLU9mZnNldCc6IGAke3N0YXR1c18uY3VycmVudH1gXG4gIH07XG4gIGNvbnN0IGJvZHkgPSBibG9iLnNsaWNlKHN0YXJ0Qnl0ZSwgZW5kQnl0ZSk7XG4gIGlmIChib2R5ID09PSBudWxsKSB7XG4gICAgdGhyb3cgY2Fubm90U2xpY2VCbG9iKCk7XG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVyKFxuICAgIHhocjogQ29ubmVjdGlvbjxzdHJpbmc+LFxuICAgIHRleHQ6IHN0cmluZ1xuICApOiBSZXN1bWFibGVVcGxvYWRTdGF0dXMge1xuICAgIC8vIFRPRE8oYW5keXNvdG8pOiBWZXJpZnkgdGhlIE1ENSBvZiBlYWNoIHVwbG9hZGVkIHJhbmdlOlxuICAgIC8vIHRoZSAneC1yYW5nZS1tZDUnIGhlYWRlciBjb21lcyBiYWNrIHdpdGggc3RhdHVzIGNvZGUgMzA4IHJlc3BvbnNlcy5cbiAgICAvLyBXZSdsbCBvbmx5IGJlIGFibGUgdG8gYmFpbCBvdXQgdGhvdWdoLCBiZWNhdXNlIHlvdSBjYW4ndCByZS11cGxvYWQgYVxuICAgIC8vIHJhbmdlIHRoYXQgeW91IHByZXZpb3VzbHkgdXBsb2FkZWQuXG4gICAgY29uc3QgdXBsb2FkU3RhdHVzID0gY2hlY2tSZXN1bWVIZWFkZXJfKHhociwgWydhY3RpdmUnLCAnZmluYWwnXSk7XG4gICAgY29uc3QgbmV3Q3VycmVudCA9IHN0YXR1c18uY3VycmVudCArIGJ5dGVzVG9VcGxvYWQ7XG4gICAgY29uc3Qgc2l6ZSA9IGJsb2Iuc2l6ZSgpO1xuICAgIGxldCBtZXRhZGF0YTtcbiAgICBpZiAodXBsb2FkU3RhdHVzID09PSAnZmluYWwnKSB7XG4gICAgICBtZXRhZGF0YSA9IG1ldGFkYXRhSGFuZGxlcihzZXJ2aWNlLCBtYXBwaW5ncykoeGhyLCB0ZXh0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgbWV0YWRhdGEgPSBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFJlc3VtYWJsZVVwbG9hZFN0YXR1cyhcbiAgICAgIG5ld0N1cnJlbnQsXG4gICAgICBzaXplLFxuICAgICAgdXBsb2FkU3RhdHVzID09PSAnZmluYWwnLFxuICAgICAgbWV0YWRhdGFcbiAgICApO1xuICB9XG4gIGNvbnN0IG1ldGhvZCA9ICdQT1NUJztcbiAgY29uc3QgdGltZW91dCA9IHNlcnZpY2UubWF4VXBsb2FkUmV0cnlUaW1lO1xuICBjb25zdCByZXF1ZXN0SW5mbyA9IG5ldyBSZXF1ZXN0SW5mbyh1cmwsIG1ldGhvZCwgaGFuZGxlciwgdGltZW91dCk7XG4gIHJlcXVlc3RJbmZvLmhlYWRlcnMgPSBoZWFkZXJzO1xuICByZXF1ZXN0SW5mby5ib2R5ID0gYm9keS51cGxvYWREYXRhKCk7XG4gIHJlcXVlc3RJbmZvLnByb2dyZXNzQ2FsbGJhY2sgPSBwcm9ncmVzc0NhbGxiYWNrIHx8IG51bGw7XG4gIHJlcXVlc3RJbmZvLmVycm9ySGFuZGxlciA9IHNoYXJlZEVycm9ySGFuZGxlcihsb2NhdGlvbik7XG4gIHJldHVybiByZXF1ZXN0SW5mbztcbn1cbiIsICIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4vKipcbiAqIEBmaWxlb3ZlcnZpZXcgRW51bWVyYXRpb25zIHVzZWQgZm9yIHVwbG9hZCB0YXNrcy5cbiAqL1xuXG4vKipcbiAqIEFuIGV2ZW50IHRoYXQgaXMgdHJpZ2dlcmVkIG9uIGEgdGFzay5cbiAqIEBpbnRlcm5hbFxuICovXG5leHBvcnQgdHlwZSBUYXNrRXZlbnQgPSBzdHJpbmc7XG5cbi8qKlxuICogQW4gZXZlbnQgdGhhdCBpcyB0cmlnZ2VyZWQgb24gYSB0YXNrLlxuICogQGludGVybmFsXG4gKi9cbmV4cG9ydCBjb25zdCBUYXNrRXZlbnQgPSB7XG4gIC8qKlxuICAgKiBGb3IgdGhpcyBldmVudCxcbiAgICogPHVsPlxuICAgKiAgIDxsaT5UaGUgYG5leHRgIGZ1bmN0aW9uIGlzIHRyaWdnZXJlZCBvbiBwcm9ncmVzcyB1cGRhdGVzIGFuZCB3aGVuIHRoZVxuICAgKiAgICAgICB0YXNrIGlzIHBhdXNlZC9yZXN1bWVkIHdpdGggYW4gYFVwbG9hZFRhc2tTbmFwc2hvdGAgYXMgdGhlIGZpcnN0XG4gICAqICAgICAgIGFyZ3VtZW50LjwvbGk+XG4gICAqICAgPGxpPlRoZSBgZXJyb3JgIGZ1bmN0aW9uIGlzIHRyaWdnZXJlZCBpZiB0aGUgdXBsb2FkIGlzIGNhbmNlbGVkIG9yIGZhaWxzXG4gICAqICAgICAgIGZvciBhbm90aGVyIHJlYXNvbi48L2xpPlxuICAgKiAgIDxsaT5UaGUgYGNvbXBsZXRlYCBmdW5jdGlvbiBpcyB0cmlnZ2VyZWQgaWYgdGhlIHVwbG9hZCBjb21wbGV0ZXNcbiAgICogICAgICAgc3VjY2Vzc2Z1bGx5LjwvbGk+XG4gICAqIDwvdWw+XG4gICAqL1xuICBTVEFURV9DSEFOR0VEOiAnc3RhdGVfY2hhbmdlZCdcbn07XG5cbi8qKlxuICogSW50ZXJuYWwgZW51bSBmb3IgdGFzayBzdGF0ZS5cbiAqL1xuZXhwb3J0IGNvbnN0IGVudW0gSW50ZXJuYWxUYXNrU3RhdGUge1xuICBSVU5OSU5HID0gJ3J1bm5pbmcnLFxuICBQQVVTSU5HID0gJ3BhdXNpbmcnLFxuICBQQVVTRUQgPSAncGF1c2VkJyxcbiAgU1VDQ0VTUyA9ICdzdWNjZXNzJyxcbiAgQ0FOQ0VMSU5HID0gJ2NhbmNlbGluZycsXG4gIENBTkNFTEVEID0gJ2NhbmNlbGVkJyxcbiAgRVJST1IgPSAnZXJyb3InXG59XG5cbi8qKlxuICogUmVwcmVzZW50cyB0aGUgY3VycmVudCBzdGF0ZSBvZiBhIHJ1bm5pbmcgdXBsb2FkLlxuICogQGludGVybmFsXG4gKi9cbmV4cG9ydCB0eXBlIFRhc2tTdGF0ZSA9ICh0eXBlb2YgVGFza1N0YXRlKVtrZXlvZiB0eXBlb2YgVGFza1N0YXRlXTtcblxuLy8gdHlwZSBrZXlzID0ga2V5b2YgVGFza1N0YXRlXG4vKipcbiAqIFJlcHJlc2VudHMgdGhlIGN1cnJlbnQgc3RhdGUgb2YgYSBydW5uaW5nIHVwbG9hZC5cbiAqIEBpbnRlcm5hbFxuICovXG5leHBvcnQgY29uc3QgVGFza1N0YXRlID0ge1xuICAvKiogVGhlIHRhc2sgaXMgY3VycmVudGx5IHRyYW5zZmVycmluZyBkYXRhLiAqL1xuICBSVU5OSU5HOiAncnVubmluZycsXG5cbiAgLyoqIFRoZSB0YXNrIHdhcyBwYXVzZWQgYnkgdGhlIHVzZXIuICovXG4gIFBBVVNFRDogJ3BhdXNlZCcsXG5cbiAgLyoqIFRoZSB0YXNrIGNvbXBsZXRlZCBzdWNjZXNzZnVsbHkuICovXG4gIFNVQ0NFU1M6ICdzdWNjZXNzJyxcblxuICAvKiogVGhlIHRhc2sgd2FzIGNhbmNlbGVkLiAqL1xuICBDQU5DRUxFRDogJ2NhbmNlbGVkJyxcblxuICAvKiogVGhlIHRhc2sgZmFpbGVkIHdpdGggYW4gZXJyb3IuICovXG4gIEVSUk9SOiAnZXJyb3InXG59IGFzIGNvbnN0O1xuXG5leHBvcnQgZnVuY3Rpb24gdGFza1N0YXRlRnJvbUludGVybmFsVGFza1N0YXRlKFxuICBzdGF0ZTogSW50ZXJuYWxUYXNrU3RhdGVcbik6IFRhc2tTdGF0ZSB7XG4gIHN3aXRjaCAoc3RhdGUpIHtcbiAgICBjYXNlIEludGVybmFsVGFza1N0YXRlLlJVTk5JTkc6XG4gICAgY2FzZSBJbnRlcm5hbFRhc2tTdGF0ZS5QQVVTSU5HOlxuICAgIGNhc2UgSW50ZXJuYWxUYXNrU3RhdGUuQ0FOQ0VMSU5HOlxuICAgICAgcmV0dXJuIFRhc2tTdGF0ZS5SVU5OSU5HO1xuICAgIGNhc2UgSW50ZXJuYWxUYXNrU3RhdGUuUEFVU0VEOlxuICAgICAgcmV0dXJuIFRhc2tTdGF0ZS5QQVVTRUQ7XG4gICAgY2FzZSBJbnRlcm5hbFRhc2tTdGF0ZS5TVUNDRVNTOlxuICAgICAgcmV0dXJuIFRhc2tTdGF0ZS5TVUNDRVNTO1xuICAgIGNhc2UgSW50ZXJuYWxUYXNrU3RhdGUuQ0FOQ0VMRUQ6XG4gICAgICByZXR1cm4gVGFza1N0YXRlLkNBTkNFTEVEO1xuICAgIGNhc2UgSW50ZXJuYWxUYXNrU3RhdGUuRVJST1I6XG4gICAgICByZXR1cm4gVGFza1N0YXRlLkVSUk9SO1xuICAgIGRlZmF1bHQ6XG4gICAgICAvLyBUT0RPKGFuZHlzb3RvKTogYXNzZXJ0KGZhbHNlKTtcbiAgICAgIHJldHVybiBUYXNrU3RhdGUuRVJST1I7XG4gIH1cbn1cbiIsICIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuaW1wb3J0IHsgaXNGdW5jdGlvbiB9IGZyb20gJy4vdHlwZSc7XG5pbXBvcnQgeyBTdG9yYWdlRXJyb3IgfSBmcm9tICcuL2Vycm9yJztcblxuLyoqXG4gKiBGdW5jdGlvbiB0aGF0IGlzIGNhbGxlZCBvbmNlIGZvciBlYWNoIHZhbHVlIGluIGEgc3RyZWFtIG9mIHZhbHVlcy5cbiAqL1xuZXhwb3J0IHR5cGUgTmV4dEZuPFQ+ID0gKHZhbHVlOiBUKSA9PiB2b2lkO1xuXG4vKipcbiAqIEEgZnVuY3Rpb24gdGhhdCBpcyBjYWxsZWQgd2l0aCBhIGBTdG9yYWdlRXJyb3JgXG4gKiBpZiB0aGUgZXZlbnQgc3RyZWFtIGVuZHMgZHVlIHRvIGFuIGVycm9yLlxuICovXG5leHBvcnQgdHlwZSBFcnJvckZuID0gKGVycm9yOiBTdG9yYWdlRXJyb3IpID0+IHZvaWQ7XG5cbi8qKlxuICogQSBmdW5jdGlvbiB0aGF0IGlzIGNhbGxlZCBpZiB0aGUgZXZlbnQgc3RyZWFtIGVuZHMgbm9ybWFsbHkuXG4gKi9cbmV4cG9ydCB0eXBlIENvbXBsZXRlRm4gPSAoKSA9PiB2b2lkO1xuXG4vKipcbiAqIFVuc3Vic2NyaWJlcyBmcm9tIGEgc3RyZWFtLlxuICovXG5leHBvcnQgdHlwZSBVbnN1YnNjcmliZSA9ICgpID0+IHZvaWQ7XG5cbi8qKlxuICogQW4gb2JzZXJ2ZXIgaWRlbnRpY2FsIHRvIHRoZSBgT2JzZXJ2ZXJgIGRlZmluZWQgaW4gcGFja2FnZXMvdXRpbCBleGNlcHQgdGhlXG4gKiBlcnJvciBwYXNzZWQgaW50byB0aGUgRXJyb3JGbiBpcyBzcGVjaWZpY2FsbHkgYSBgU3RvcmFnZUVycm9yYC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBTdG9yYWdlT2JzZXJ2ZXI8VD4ge1xuICAvKipcbiAgICogRnVuY3Rpb24gdGhhdCBpcyBjYWxsZWQgb25jZSBmb3IgZWFjaCB2YWx1ZSBpbiB0aGUgZXZlbnQgc3RyZWFtLlxuICAgKi9cbiAgbmV4dD86IE5leHRGbjxUPjtcbiAgLyoqXG4gICAqIEEgZnVuY3Rpb24gdGhhdCBpcyBjYWxsZWQgd2l0aCBhIGBTdG9yYWdlRXJyb3JgXG4gICAqIGlmIHRoZSBldmVudCBzdHJlYW0gZW5kcyBkdWUgdG8gYW4gZXJyb3IuXG4gICAqL1xuICBlcnJvcj86IEVycm9yRm47XG4gIC8qKlxuICAgKiBBIGZ1bmN0aW9uIHRoYXQgaXMgY2FsbGVkIGlmIHRoZSBldmVudCBzdHJlYW0gZW5kcyBub3JtYWxseS5cbiAgICovXG4gIGNvbXBsZXRlPzogQ29tcGxldGVGbjtcbn1cblxuLyoqXG4gKiBTdWJzY3JpYmVzIHRvIGFuIGV2ZW50IHN0cmVhbS5cbiAqL1xuZXhwb3J0IHR5cGUgU3Vic2NyaWJlPFQ+ID0gKFxuICBuZXh0PzogTmV4dEZuPFQ+IHwgU3RvcmFnZU9ic2VydmVyPFQ+LFxuICBlcnJvcj86IEVycm9yRm4sXG4gIGNvbXBsZXRlPzogQ29tcGxldGVGblxuKSA9PiBVbnN1YnNjcmliZTtcblxuZXhwb3J0IGNsYXNzIE9ic2VydmVyPFQ+IGltcGxlbWVudHMgU3RvcmFnZU9ic2VydmVyPFQ+IHtcbiAgbmV4dD86IE5leHRGbjxUPjtcbiAgZXJyb3I/OiBFcnJvckZuO1xuICBjb21wbGV0ZT86IENvbXBsZXRlRm47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgbmV4dE9yT2JzZXJ2ZXI/OiBOZXh0Rm48VD4gfCBTdG9yYWdlT2JzZXJ2ZXI8VD4sXG4gICAgZXJyb3I/OiBFcnJvckZuLFxuICAgIGNvbXBsZXRlPzogQ29tcGxldGVGblxuICApIHtcbiAgICBjb25zdCBhc0Z1bmN0aW9ucyA9XG4gICAgICBpc0Z1bmN0aW9uKG5leHRPck9ic2VydmVyKSB8fCBlcnJvciAhPSBudWxsIHx8IGNvbXBsZXRlICE9IG51bGw7XG4gICAgaWYgKGFzRnVuY3Rpb25zKSB7XG4gICAgICB0aGlzLm5leHQgPSBuZXh0T3JPYnNlcnZlciBhcyBOZXh0Rm48VD47XG4gICAgICB0aGlzLmVycm9yID0gZXJyb3IgPz8gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5jb21wbGV0ZSA9IGNvbXBsZXRlID8/IHVuZGVmaW5lZDtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXh0T3JPYnNlcnZlciBhcyB7XG4gICAgICAgIG5leHQ/OiBOZXh0Rm48VD47XG4gICAgICAgIGVycm9yPzogRXJyb3JGbjtcbiAgICAgICAgY29tcGxldGU/OiBDb21wbGV0ZUZuO1xuICAgICAgfTtcbiAgICAgIHRoaXMubmV4dCA9IG9ic2VydmVyLm5leHQ7XG4gICAgICB0aGlzLmVycm9yID0gb2JzZXJ2ZXIuZXJyb3I7XG4gICAgICB0aGlzLmNvbXBsZXRlID0gb2JzZXJ2ZXIuY29tcGxldGU7XG4gICAgfVxuICB9XG59XG4iLCAiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQ1xuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLyoqXG4gKiBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCBpbnZva2VzIGYgd2l0aCBpdHMgYXJndW1lbnRzIGFzeW5jaHJvbm91c2x5IGFzIGFcbiAqIG1pY3JvdGFzaywgaS5lLiBhcyBzb29uIGFzIHBvc3NpYmxlIGFmdGVyIHRoZSBjdXJyZW50IHNjcmlwdCByZXR1cm5zIGJhY2tcbiAqIGludG8gYnJvd3NlciBjb2RlLlxuICovXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L2Jhbi10eXBlc1xuZXhwb3J0IGZ1bmN0aW9uIGFzeW5jKGY6IEZ1bmN0aW9uKTogRnVuY3Rpb24ge1xuICByZXR1cm4gKC4uLmFyZ3NUb0ZvcndhcmQ6IHVua25vd25bXSkgPT4ge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZmxvYXRpbmctcHJvbWlzZXNcbiAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IGYoLi4uYXJnc1RvRm9yd2FyZCkpO1xuICB9O1xufVxuIiwgIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTENcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7XG4gIENvbm5lY3Rpb24sXG4gIENvbm5lY3Rpb25UeXBlLFxuICBFcnJvckNvZGUsXG4gIEhlYWRlcnNcbn0gZnJvbSAnLi4vLi4vaW1wbGVtZW50YXRpb24vY29ubmVjdGlvbic7XG5pbXBvcnQgeyBpbnRlcm5hbEVycm9yIH0gZnJvbSAnLi4vLi4vaW1wbGVtZW50YXRpb24vZXJyb3InO1xuXG4vKiogQW4gb3ZlcnJpZGUgZm9yIHRoZSB0ZXh0LWJhc2VkIENvbm5lY3Rpb24uIFVzZWQgaW4gdGVzdHMuICovXG5sZXQgdGV4dEZhY3RvcnlPdmVycmlkZTogKCgpID0+IENvbm5lY3Rpb248c3RyaW5nPikgfCBudWxsID0gbnVsbDtcblxuLyoqXG4gKiBOZXR3b3JrIGxheWVyIGZvciBicm93c2Vycy4gV2UgdXNlIHRoaXMgaW5zdGVhZCBvZiBnb29nLm5ldC5YaHJJbyBiZWNhdXNlXG4gKiBnb29nLm5ldC5YaHJJbyBpcyBoeXV1dXVnZSBhbmQgZG9lc24ndCB3b3JrIGluIFJlYWN0IE5hdGl2ZSBvbiBBbmRyb2lkLlxuICovXG5hYnN0cmFjdCBjbGFzcyBYaHJDb25uZWN0aW9uPFQgZXh0ZW5kcyBDb25uZWN0aW9uVHlwZT5cbiAgaW1wbGVtZW50cyBDb25uZWN0aW9uPFQ+XG57XG4gIHByb3RlY3RlZCB4aHJfOiBYTUxIdHRwUmVxdWVzdDtcbiAgcHJpdmF0ZSBlcnJvckNvZGVfOiBFcnJvckNvZGU7XG4gIHByaXZhdGUgc2VuZFByb21pc2VfOiBQcm9taXNlPHZvaWQ+O1xuICBwcm90ZWN0ZWQgc2VudF86IGJvb2xlYW4gPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnhocl8gPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICB0aGlzLmluaXRYaHIoKTtcbiAgICB0aGlzLmVycm9yQ29kZV8gPSBFcnJvckNvZGUuTk9fRVJST1I7XG4gICAgdGhpcy5zZW5kUHJvbWlzZV8gPSBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIHRoaXMueGhyXy5hZGRFdmVudExpc3RlbmVyKCdhYm9ydCcsICgpID0+IHtcbiAgICAgICAgdGhpcy5lcnJvckNvZGVfID0gRXJyb3JDb2RlLkFCT1JUO1xuICAgICAgICByZXNvbHZlKCk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMueGhyXy5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsICgpID0+IHtcbiAgICAgICAgdGhpcy5lcnJvckNvZGVfID0gRXJyb3JDb2RlLk5FVFdPUktfRVJST1I7XG4gICAgICAgIHJlc29sdmUoKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy54aHJfLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XG4gICAgICAgIHJlc29sdmUoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgYWJzdHJhY3QgaW5pdFhocigpOiB2b2lkO1xuXG4gIHNlbmQoXG4gICAgdXJsOiBzdHJpbmcsXG4gICAgbWV0aG9kOiBzdHJpbmcsXG4gICAgYm9keT86IEFycmF5QnVmZmVyVmlldyB8IEJsb2IgfCBzdHJpbmcsXG4gICAgaGVhZGVycz86IEhlYWRlcnNcbiAgKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKHRoaXMuc2VudF8pIHtcbiAgICAgIHRocm93IGludGVybmFsRXJyb3IoJ2Nhbm5vdCAuc2VuZCgpIG1vcmUgdGhhbiBvbmNlJyk7XG4gICAgfVxuICAgIHRoaXMuc2VudF8gPSB0cnVlO1xuICAgIHRoaXMueGhyXy5vcGVuKG1ldGhvZCwgdXJsLCB0cnVlKTtcbiAgICBpZiAoaGVhZGVycyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBmb3IgKGNvbnN0IGtleSBpbiBoZWFkZXJzKSB7XG4gICAgICAgIGlmIChoZWFkZXJzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICB0aGlzLnhocl8uc2V0UmVxdWVzdEhlYWRlcihrZXksIGhlYWRlcnNba2V5XS50b1N0cmluZygpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoYm9keSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLnhocl8uc2VuZChib2R5KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy54aHJfLnNlbmQoKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc2VuZFByb21pc2VfO1xuICB9XG5cbiAgZ2V0RXJyb3JDb2RlKCk6IEVycm9yQ29kZSB7XG4gICAgaWYgKCF0aGlzLnNlbnRfKSB7XG4gICAgICB0aHJvdyBpbnRlcm5hbEVycm9yKCdjYW5ub3QgLmdldEVycm9yQ29kZSgpIGJlZm9yZSBzZW5kaW5nJyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmVycm9yQ29kZV87XG4gIH1cblxuICBnZXRTdGF0dXMoKTogbnVtYmVyIHtcbiAgICBpZiAoIXRoaXMuc2VudF8pIHtcbiAgICAgIHRocm93IGludGVybmFsRXJyb3IoJ2Nhbm5vdCAuZ2V0U3RhdHVzKCkgYmVmb3JlIHNlbmRpbmcnKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiB0aGlzLnhocl8uc3RhdHVzO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiAtMTtcbiAgICB9XG4gIH1cblxuICBnZXRSZXNwb25zZSgpOiBUIHtcbiAgICBpZiAoIXRoaXMuc2VudF8pIHtcbiAgICAgIHRocm93IGludGVybmFsRXJyb3IoJ2Nhbm5vdCAuZ2V0UmVzcG9uc2UoKSBiZWZvcmUgc2VuZGluZycpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy54aHJfLnJlc3BvbnNlO1xuICB9XG5cbiAgZ2V0RXJyb3JUZXh0KCk6IHN0cmluZyB7XG4gICAgaWYgKCF0aGlzLnNlbnRfKSB7XG4gICAgICB0aHJvdyBpbnRlcm5hbEVycm9yKCdjYW5ub3QgLmdldEVycm9yVGV4dCgpIGJlZm9yZSBzZW5kaW5nJyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnhocl8uc3RhdHVzVGV4dDtcbiAgfVxuXG4gIC8qKiBBYm9ydHMgdGhlIHJlcXVlc3QuICovXG4gIGFib3J0KCk6IHZvaWQge1xuICAgIHRoaXMueGhyXy5hYm9ydCgpO1xuICB9XG5cbiAgZ2V0UmVzcG9uc2VIZWFkZXIoaGVhZGVyOiBzdHJpbmcpOiBzdHJpbmcgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy54aHJfLmdldFJlc3BvbnNlSGVhZGVyKGhlYWRlcik7XG4gIH1cblxuICBhZGRVcGxvYWRQcm9ncmVzc0xpc3RlbmVyKGxpc3RlbmVyOiAocDE6IFByb2dyZXNzRXZlbnQpID0+IHZvaWQpOiB2b2lkIHtcbiAgICBpZiAodGhpcy54aHJfLnVwbG9hZCAhPSBudWxsKSB7XG4gICAgICB0aGlzLnhocl8udXBsb2FkLmFkZEV2ZW50TGlzdGVuZXIoJ3Byb2dyZXNzJywgbGlzdGVuZXIpO1xuICAgIH1cbiAgfVxuXG4gIHJlbW92ZVVwbG9hZFByb2dyZXNzTGlzdGVuZXIobGlzdGVuZXI6IChwMTogUHJvZ3Jlc3NFdmVudCkgPT4gdm9pZCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnhocl8udXBsb2FkICE9IG51bGwpIHtcbiAgICAgIHRoaXMueGhyXy51cGxvYWQucmVtb3ZlRXZlbnRMaXN0ZW5lcigncHJvZ3Jlc3MnLCBsaXN0ZW5lcik7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBYaHJUZXh0Q29ubmVjdGlvbiBleHRlbmRzIFhockNvbm5lY3Rpb248c3RyaW5nPiB7XG4gIGluaXRYaHIoKTogdm9pZCB7XG4gICAgdGhpcy54aHJfLnJlc3BvbnNlVHlwZSA9ICd0ZXh0JztcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbmV3VGV4dENvbm5lY3Rpb24oKTogQ29ubmVjdGlvbjxzdHJpbmc+IHtcbiAgcmV0dXJuIHRleHRGYWN0b3J5T3ZlcnJpZGUgPyB0ZXh0RmFjdG9yeU92ZXJyaWRlKCkgOiBuZXcgWGhyVGV4dENvbm5lY3Rpb24oKTtcbn1cblxuZXhwb3J0IGNsYXNzIFhockJ5dGVzQ29ubmVjdGlvbiBleHRlbmRzIFhockNvbm5lY3Rpb248QXJyYXlCdWZmZXI+IHtcbiAgcHJpdmF0ZSBkYXRhXz86IEFycmF5QnVmZmVyO1xuXG4gIGluaXRYaHIoKTogdm9pZCB7XG4gICAgdGhpcy54aHJfLnJlc3BvbnNlVHlwZSA9ICdhcnJheWJ1ZmZlcic7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5ld0J5dGVzQ29ubmVjdGlvbigpOiBDb25uZWN0aW9uPEFycmF5QnVmZmVyPiB7XG4gIHJldHVybiBuZXcgWGhyQnl0ZXNDb25uZWN0aW9uKCk7XG59XG5cbmV4cG9ydCBjbGFzcyBYaHJCbG9iQ29ubmVjdGlvbiBleHRlbmRzIFhockNvbm5lY3Rpb248QmxvYj4ge1xuICBpbml0WGhyKCk6IHZvaWQge1xuICAgIHRoaXMueGhyXy5yZXNwb25zZVR5cGUgPSAnYmxvYic7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5ld0Jsb2JDb25uZWN0aW9uKCk6IENvbm5lY3Rpb248QmxvYj4ge1xuICByZXR1cm4gbmV3IFhockJsb2JDb25uZWN0aW9uKCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBuZXdTdHJlYW1Db25uZWN0aW9uKCk6IENvbm5lY3Rpb248Tm9kZUpTLlJlYWRhYmxlU3RyZWFtPiB7XG4gIHRocm93IG5ldyBFcnJvcignU3RyZWFtcyBhcmUgb25seSBzdXBwb3J0ZWQgb24gTm9kZScpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW5qZWN0VGVzdENvbm5lY3Rpb24oXG4gIGZhY3Rvcnk6ICgoKSA9PiBDb25uZWN0aW9uPHN0cmluZz4pIHwgbnVsbFxuKTogdm9pZCB7XG4gIHRleHRGYWN0b3J5T3ZlcnJpZGUgPSBmYWN0b3J5O1xufVxuIiwgIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTENcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG4vKipcbiAqIEBmaWxlb3ZlcnZpZXcgRGVmaW5lcyB0eXBlcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBibG9iIHRyYW5zZmVyIHRhc2tzLlxuICovXG5cbmltcG9ydCB7IEZic0Jsb2IgfSBmcm9tICcuL2ltcGxlbWVudGF0aW9uL2Jsb2InO1xuaW1wb3J0IHtcbiAgY2FuY2VsZWQsXG4gIFN0b3JhZ2VFcnJvckNvZGUsXG4gIFN0b3JhZ2VFcnJvcixcbiAgcmV0cnlMaW1pdEV4Y2VlZGVkXG59IGZyb20gJy4vaW1wbGVtZW50YXRpb24vZXJyb3InO1xuaW1wb3J0IHtcbiAgSW50ZXJuYWxUYXNrU3RhdGUsXG4gIFRhc2tFdmVudCxcbiAgVGFza1N0YXRlLFxuICB0YXNrU3RhdGVGcm9tSW50ZXJuYWxUYXNrU3RhdGVcbn0gZnJvbSAnLi9pbXBsZW1lbnRhdGlvbi90YXNrZW51bXMnO1xuaW1wb3J0IHsgTWV0YWRhdGEgfSBmcm9tICcuL21ldGFkYXRhJztcbmltcG9ydCB7XG4gIE9ic2VydmVyLFxuICBTdWJzY3JpYmUsXG4gIFVuc3Vic2NyaWJlLFxuICBTdG9yYWdlT2JzZXJ2ZXIgYXMgU3RvcmFnZU9ic2VydmVySW50ZXJuYWwsXG4gIE5leHRGblxufSBmcm9tICcuL2ltcGxlbWVudGF0aW9uL29ic2VydmVyJztcbmltcG9ydCB7IFJlcXVlc3QgfSBmcm9tICcuL2ltcGxlbWVudGF0aW9uL3JlcXVlc3QnO1xuaW1wb3J0IHsgVXBsb2FkVGFza1NuYXBzaG90LCBTdG9yYWdlT2JzZXJ2ZXIgfSBmcm9tICcuL3B1YmxpYy10eXBlcyc7XG5pbXBvcnQgeyBhc3luYyBhcyBmYnNBc3luYyB9IGZyb20gJy4vaW1wbGVtZW50YXRpb24vYXN5bmMnO1xuaW1wb3J0IHsgTWFwcGluZ3MsIGdldE1hcHBpbmdzIH0gZnJvbSAnLi9pbXBsZW1lbnRhdGlvbi9tZXRhZGF0YSc7XG5pbXBvcnQge1xuICBjcmVhdGVSZXN1bWFibGVVcGxvYWQsXG4gIGdldFJlc3VtYWJsZVVwbG9hZFN0YXR1cyxcbiAgUkVTVU1BQkxFX1VQTE9BRF9DSFVOS19TSVpFLFxuICBSZXN1bWFibGVVcGxvYWRTdGF0dXMsXG4gIGNvbnRpbnVlUmVzdW1hYmxlVXBsb2FkLFxuICBnZXRNZXRhZGF0YSxcbiAgbXVsdGlwYXJ0VXBsb2FkXG59IGZyb20gJy4vaW1wbGVtZW50YXRpb24vcmVxdWVzdHMnO1xuaW1wb3J0IHsgUmVmZXJlbmNlIH0gZnJvbSAnLi9yZWZlcmVuY2UnO1xuaW1wb3J0IHsgbmV3VGV4dENvbm5lY3Rpb24gfSBmcm9tICcuL3BsYXRmb3JtL2Nvbm5lY3Rpb24nO1xuaW1wb3J0IHsgaXNSZXRyeVN0YXR1c0NvZGUgfSBmcm9tICcuL2ltcGxlbWVudGF0aW9uL3V0aWxzJztcbmltcG9ydCB7IENvbXBsZXRlRm4gfSBmcm9tICdAZmlyZWJhc2UvdXRpbCc7XG5pbXBvcnQgeyBERUZBVUxUX01JTl9TTEVFUF9USU1FX01JTExJUyB9IGZyb20gJy4vaW1wbGVtZW50YXRpb24vY29uc3RhbnRzJztcblxuLyoqXG4gKiBSZXByZXNlbnRzIGEgYmxvYiBiZWluZyB1cGxvYWRlZC4gQ2FuIGJlIHVzZWQgdG8gcGF1c2UvcmVzdW1lL2NhbmNlbCB0aGVcbiAqIHVwbG9hZCBhbmQgbWFuYWdlIGNhbGxiYWNrcyBmb3IgdmFyaW91cyBldmVudHMuXG4gKiBAaW50ZXJuYWxcbiAqL1xuZXhwb3J0IGNsYXNzIFVwbG9hZFRhc2sge1xuICBwcml2YXRlIF9yZWY6IFJlZmVyZW5jZTtcbiAgLyoqXG4gICAqIFRoZSBkYXRhIHRvIGJlIHVwbG9hZGVkLlxuICAgKi9cbiAgX2Jsb2I6IEZic0Jsb2I7XG4gIC8qKlxuICAgKiBNZXRhZGF0YSByZWxhdGVkIHRvIHRoZSB1cGxvYWQuXG4gICAqL1xuICBfbWV0YWRhdGE6IE1ldGFkYXRhIHwgbnVsbDtcbiAgcHJpdmF0ZSBfbWFwcGluZ3M6IE1hcHBpbmdzO1xuICAvKipcbiAgICogTnVtYmVyIG9mIGJ5dGVzIHRyYW5zZmVycmVkIHNvIGZhci5cbiAgICovXG4gIF90cmFuc2ZlcnJlZDogbnVtYmVyID0gMDtcbiAgcHJpdmF0ZSBfbmVlZFRvRmV0Y2hTdGF0dXM6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHJpdmF0ZSBfbmVlZFRvRmV0Y2hNZXRhZGF0YTogYm9vbGVhbiA9IGZhbHNlO1xuICBwcml2YXRlIF9vYnNlcnZlcnM6IEFycmF5PFN0b3JhZ2VPYnNlcnZlckludGVybmFsPFVwbG9hZFRhc2tTbmFwc2hvdD4+ID0gW107XG4gIHByaXZhdGUgX3Jlc3VtYWJsZTogYm9vbGVhbjtcbiAgLyoqXG4gICAqIFVwbG9hZCBzdGF0ZS5cbiAgICovXG4gIF9zdGF0ZTogSW50ZXJuYWxUYXNrU3RhdGU7XG4gIHByaXZhdGUgX2Vycm9yPzogU3RvcmFnZUVycm9yID0gdW5kZWZpbmVkO1xuICBwcml2YXRlIF91cGxvYWRVcmw/OiBzdHJpbmcgPSB1bmRlZmluZWQ7XG4gIHByaXZhdGUgX3JlcXVlc3Q/OiBSZXF1ZXN0PHVua25vd24+ID0gdW5kZWZpbmVkO1xuICBwcml2YXRlIF9jaHVua011bHRpcGxpZXI6IG51bWJlciA9IDE7XG4gIHByaXZhdGUgX2Vycm9ySGFuZGxlcjogKHAxOiBTdG9yYWdlRXJyb3IpID0+IHZvaWQ7XG4gIHByaXZhdGUgX21ldGFkYXRhRXJyb3JIYW5kbGVyOiAocDE6IFN0b3JhZ2VFcnJvcikgPT4gdm9pZDtcbiAgcHJpdmF0ZSBfcmVzb2x2ZT86IChwMTogVXBsb2FkVGFza1NuYXBzaG90KSA9PiB2b2lkID0gdW5kZWZpbmVkO1xuICBwcml2YXRlIF9yZWplY3Q/OiAocDE6IFN0b3JhZ2VFcnJvcikgPT4gdm9pZCA9IHVuZGVmaW5lZDtcbiAgcHJpdmF0ZSBwZW5kaW5nVGltZW91dD86IFJldHVyblR5cGU8dHlwZW9mIHNldFRpbWVvdXQ+O1xuICBwcml2YXRlIF9wcm9taXNlOiBQcm9taXNlPFVwbG9hZFRhc2tTbmFwc2hvdD47XG5cbiAgcHJpdmF0ZSBzbGVlcFRpbWU6IG51bWJlcjtcblxuICBwcml2YXRlIG1heFNsZWVwVGltZTogbnVtYmVyO1xuXG4gIGlzRXhwb25lbnRpYWxCYWNrb2ZmRXhwaXJlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zbGVlcFRpbWUgPiB0aGlzLm1heFNsZWVwVGltZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0gcmVmIC0gVGhlIGZpcmViYXNlU3RvcmFnZS5SZWZlcmVuY2Ugb2JqZWN0IHRoaXMgdGFzayBjYW1lXG4gICAqICAgICBmcm9tLCB1bnR5cGVkIHRvIGF2b2lkIGN5Y2xpYyBkZXBlbmRlbmNpZXMuXG4gICAqIEBwYXJhbSBibG9iIC0gVGhlIGJsb2IgdG8gdXBsb2FkLlxuICAgKi9cbiAgY29uc3RydWN0b3IocmVmOiBSZWZlcmVuY2UsIGJsb2I6IEZic0Jsb2IsIG1ldGFkYXRhOiBNZXRhZGF0YSB8IG51bGwgPSBudWxsKSB7XG4gICAgdGhpcy5fcmVmID0gcmVmO1xuICAgIHRoaXMuX2Jsb2IgPSBibG9iO1xuICAgIHRoaXMuX21ldGFkYXRhID0gbWV0YWRhdGE7XG4gICAgdGhpcy5fbWFwcGluZ3MgPSBnZXRNYXBwaW5ncygpO1xuICAgIHRoaXMuX3Jlc3VtYWJsZSA9IHRoaXMuX3Nob3VsZERvUmVzdW1hYmxlKHRoaXMuX2Jsb2IpO1xuICAgIHRoaXMuX3N0YXRlID0gSW50ZXJuYWxUYXNrU3RhdGUuUlVOTklORztcbiAgICB0aGlzLl9lcnJvckhhbmRsZXIgPSBlcnJvciA9PiB7XG4gICAgICB0aGlzLl9yZXF1ZXN0ID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5fY2h1bmtNdWx0aXBsaWVyID0gMTtcbiAgICAgIGlmIChlcnJvci5fY29kZUVxdWFscyhTdG9yYWdlRXJyb3JDb2RlLkNBTkNFTEVEKSkge1xuICAgICAgICB0aGlzLl9uZWVkVG9GZXRjaFN0YXR1cyA9IHRydWU7XG4gICAgICAgIHRoaXMuY29tcGxldGVUcmFuc2l0aW9uc18oKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGJhY2tvZmZFeHBpcmVkID0gdGhpcy5pc0V4cG9uZW50aWFsQmFja29mZkV4cGlyZWQoKTtcbiAgICAgICAgaWYgKGlzUmV0cnlTdGF0dXNDb2RlKGVycm9yLnN0YXR1cywgW10pKSB7XG4gICAgICAgICAgaWYgKGJhY2tvZmZFeHBpcmVkKSB7XG4gICAgICAgICAgICBlcnJvciA9IHJldHJ5TGltaXRFeGNlZWRlZCgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnNsZWVwVGltZSA9IE1hdGgubWF4KFxuICAgICAgICAgICAgICB0aGlzLnNsZWVwVGltZSAqIDIsXG4gICAgICAgICAgICAgIERFRkFVTFRfTUlOX1NMRUVQX1RJTUVfTUlMTElTXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgdGhpcy5fbmVlZFRvRmV0Y2hTdGF0dXMgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5jb21wbGV0ZVRyYW5zaXRpb25zXygpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9lcnJvciA9IGVycm9yO1xuICAgICAgICB0aGlzLl90cmFuc2l0aW9uKEludGVybmFsVGFza1N0YXRlLkVSUk9SKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHRoaXMuX21ldGFkYXRhRXJyb3JIYW5kbGVyID0gZXJyb3IgPT4ge1xuICAgICAgdGhpcy5fcmVxdWVzdCA9IHVuZGVmaW5lZDtcbiAgICAgIGlmIChlcnJvci5fY29kZUVxdWFscyhTdG9yYWdlRXJyb3JDb2RlLkNBTkNFTEVEKSkge1xuICAgICAgICB0aGlzLmNvbXBsZXRlVHJhbnNpdGlvbnNfKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9lcnJvciA9IGVycm9yO1xuICAgICAgICB0aGlzLl90cmFuc2l0aW9uKEludGVybmFsVGFza1N0YXRlLkVSUk9SKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHRoaXMuc2xlZXBUaW1lID0gMDtcbiAgICB0aGlzLm1heFNsZWVwVGltZSA9IHRoaXMuX3JlZi5zdG9yYWdlLm1heFVwbG9hZFJldHJ5VGltZTtcbiAgICB0aGlzLl9wcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdGhpcy5fcmVzb2x2ZSA9IHJlc29sdmU7XG4gICAgICB0aGlzLl9yZWplY3QgPSByZWplY3Q7XG4gICAgICB0aGlzLl9zdGFydCgpO1xuICAgIH0pO1xuXG4gICAgLy8gUHJldmVudCB1bmNhdWdodCByZWplY3Rpb25zIG9uIHRoZSBpbnRlcm5hbCBwcm9taXNlIGZyb20gYnViYmxpbmcgb3V0XG4gICAgLy8gdG8gdGhlIHRvcCBsZXZlbCB3aXRoIGEgZHVtbXkgaGFuZGxlci5cbiAgICB0aGlzLl9wcm9taXNlLnRoZW4obnVsbCwgKCkgPT4ge30pO1xuICB9XG5cbiAgcHJpdmF0ZSBfbWFrZVByb2dyZXNzQ2FsbGJhY2soKTogKHAxOiBudW1iZXIsIHAyOiBudW1iZXIpID0+IHZvaWQge1xuICAgIGNvbnN0IHNpemVCZWZvcmUgPSB0aGlzLl90cmFuc2ZlcnJlZDtcbiAgICByZXR1cm4gbG9hZGVkID0+IHRoaXMuX3VwZGF0ZVByb2dyZXNzKHNpemVCZWZvcmUgKyBsb2FkZWQpO1xuICB9XG5cbiAgcHJpdmF0ZSBfc2hvdWxkRG9SZXN1bWFibGUoYmxvYjogRmJzQmxvYik6IGJvb2xlYW4ge1xuICAgIHJldHVybiBibG9iLnNpemUoKSA+IDI1NiAqIDEwMjQ7XG4gIH1cblxuICBwcml2YXRlIF9zdGFydCgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fc3RhdGUgIT09IEludGVybmFsVGFza1N0YXRlLlJVTk5JTkcpIHtcbiAgICAgIC8vIFRoaXMgY2FuIGhhcHBlbiBpZiBzb21lb25lIHBhdXNlcyB1cyBpbiBhIHJlc3VtZSBjYWxsYmFjaywgZm9yIGV4YW1wbGUuXG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0aGlzLl9yZXF1ZXN0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHRoaXMuX3Jlc3VtYWJsZSkge1xuICAgICAgaWYgKHRoaXMuX3VwbG9hZFVybCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuX2NyZWF0ZVJlc3VtYWJsZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHRoaXMuX25lZWRUb0ZldGNoU3RhdHVzKSB7XG4gICAgICAgICAgdGhpcy5fZmV0Y2hTdGF0dXMoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAodGhpcy5fbmVlZFRvRmV0Y2hNZXRhZGF0YSkge1xuICAgICAgICAgICAgLy8gSGFwcGVucyBpZiB3ZSBtaXNzIHRoZSBtZXRhZGF0YSBvbiB1cGxvYWQgY29tcGxldGlvbi5cbiAgICAgICAgICAgIHRoaXMuX2ZldGNoTWV0YWRhdGEoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wZW5kaW5nVGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLnBlbmRpbmdUaW1lb3V0ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICB0aGlzLl9jb250aW51ZVVwbG9hZCgpO1xuICAgICAgICAgICAgfSwgdGhpcy5zbGVlcFRpbWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9vbmVTaG90VXBsb2FkKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfcmVzb2x2ZVRva2VuKFxuICAgIGNhbGxiYWNrOiAoYXV0aFRva2VuOiBzdHJpbmcgfCBudWxsLCBhcHBDaGVja1Rva2VuOiBzdHJpbmcgfCBudWxsKSA9PiB2b2lkXG4gICk6IHZvaWQge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZmxvYXRpbmctcHJvbWlzZXNcbiAgICBQcm9taXNlLmFsbChbXG4gICAgICB0aGlzLl9yZWYuc3RvcmFnZS5fZ2V0QXV0aFRva2VuKCksXG4gICAgICB0aGlzLl9yZWYuc3RvcmFnZS5fZ2V0QXBwQ2hlY2tUb2tlbigpXG4gICAgXSkudGhlbigoW2F1dGhUb2tlbiwgYXBwQ2hlY2tUb2tlbl0pID0+IHtcbiAgICAgIHN3aXRjaCAodGhpcy5fc3RhdGUpIHtcbiAgICAgICAgY2FzZSBJbnRlcm5hbFRhc2tTdGF0ZS5SVU5OSU5HOlxuICAgICAgICAgIGNhbGxiYWNrKGF1dGhUb2tlbiwgYXBwQ2hlY2tUb2tlbik7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgSW50ZXJuYWxUYXNrU3RhdGUuQ0FOQ0VMSU5HOlxuICAgICAgICAgIHRoaXMuX3RyYW5zaXRpb24oSW50ZXJuYWxUYXNrU3RhdGUuQ0FOQ0VMRUQpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEludGVybmFsVGFza1N0YXRlLlBBVVNJTkc6XG4gICAgICAgICAgdGhpcy5fdHJhbnNpdGlvbihJbnRlcm5hbFRhc2tTdGF0ZS5QQVVTRUQpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLy8gVE9ETyhhbmR5c290byk6IGFzc2VydCBmYWxzZVxuXG4gIHByaXZhdGUgX2NyZWF0ZVJlc3VtYWJsZSgpOiB2b2lkIHtcbiAgICB0aGlzLl9yZXNvbHZlVG9rZW4oKGF1dGhUb2tlbiwgYXBwQ2hlY2tUb2tlbikgPT4ge1xuICAgICAgY29uc3QgcmVxdWVzdEluZm8gPSBjcmVhdGVSZXN1bWFibGVVcGxvYWQoXG4gICAgICAgIHRoaXMuX3JlZi5zdG9yYWdlLFxuICAgICAgICB0aGlzLl9yZWYuX2xvY2F0aW9uLFxuICAgICAgICB0aGlzLl9tYXBwaW5ncyxcbiAgICAgICAgdGhpcy5fYmxvYixcbiAgICAgICAgdGhpcy5fbWV0YWRhdGFcbiAgICAgICk7XG4gICAgICBjb25zdCBjcmVhdGVSZXF1ZXN0ID0gdGhpcy5fcmVmLnN0b3JhZ2UuX21ha2VSZXF1ZXN0KFxuICAgICAgICByZXF1ZXN0SW5mbyxcbiAgICAgICAgbmV3VGV4dENvbm5lY3Rpb24sXG4gICAgICAgIGF1dGhUb2tlbixcbiAgICAgICAgYXBwQ2hlY2tUb2tlblxuICAgICAgKTtcbiAgICAgIHRoaXMuX3JlcXVlc3QgPSBjcmVhdGVSZXF1ZXN0O1xuICAgICAgY3JlYXRlUmVxdWVzdC5nZXRQcm9taXNlKCkudGhlbigodXJsOiBzdHJpbmcpID0+IHtcbiAgICAgICAgdGhpcy5fcmVxdWVzdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5fdXBsb2FkVXJsID0gdXJsO1xuICAgICAgICB0aGlzLl9uZWVkVG9GZXRjaFN0YXR1cyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmNvbXBsZXRlVHJhbnNpdGlvbnNfKCk7XG4gICAgICB9LCB0aGlzLl9lcnJvckhhbmRsZXIpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfZmV0Y2hTdGF0dXMoKTogdm9pZCB7XG4gICAgLy8gVE9ETyhhbmR5c290byk6IGFzc2VydCh0aGlzLnVwbG9hZFVybF8gIT09IG51bGwpO1xuICAgIGNvbnN0IHVybCA9IHRoaXMuX3VwbG9hZFVybCBhcyBzdHJpbmc7XG4gICAgdGhpcy5fcmVzb2x2ZVRva2VuKChhdXRoVG9rZW4sIGFwcENoZWNrVG9rZW4pID0+IHtcbiAgICAgIGNvbnN0IHJlcXVlc3RJbmZvID0gZ2V0UmVzdW1hYmxlVXBsb2FkU3RhdHVzKFxuICAgICAgICB0aGlzLl9yZWYuc3RvcmFnZSxcbiAgICAgICAgdGhpcy5fcmVmLl9sb2NhdGlvbixcbiAgICAgICAgdXJsLFxuICAgICAgICB0aGlzLl9ibG9iXG4gICAgICApO1xuICAgICAgY29uc3Qgc3RhdHVzUmVxdWVzdCA9IHRoaXMuX3JlZi5zdG9yYWdlLl9tYWtlUmVxdWVzdChcbiAgICAgICAgcmVxdWVzdEluZm8sXG4gICAgICAgIG5ld1RleHRDb25uZWN0aW9uLFxuICAgICAgICBhdXRoVG9rZW4sXG4gICAgICAgIGFwcENoZWNrVG9rZW5cbiAgICAgICk7XG4gICAgICB0aGlzLl9yZXF1ZXN0ID0gc3RhdHVzUmVxdWVzdDtcbiAgICAgIHN0YXR1c1JlcXVlc3QuZ2V0UHJvbWlzZSgpLnRoZW4oc3RhdHVzID0+IHtcbiAgICAgICAgc3RhdHVzID0gc3RhdHVzIGFzIFJlc3VtYWJsZVVwbG9hZFN0YXR1cztcbiAgICAgICAgdGhpcy5fcmVxdWVzdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5fdXBkYXRlUHJvZ3Jlc3Moc3RhdHVzLmN1cnJlbnQpO1xuICAgICAgICB0aGlzLl9uZWVkVG9GZXRjaFN0YXR1cyA9IGZhbHNlO1xuICAgICAgICBpZiAoc3RhdHVzLmZpbmFsaXplZCkge1xuICAgICAgICAgIHRoaXMuX25lZWRUb0ZldGNoTWV0YWRhdGEgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY29tcGxldGVUcmFuc2l0aW9uc18oKTtcbiAgICAgIH0sIHRoaXMuX2Vycm9ySGFuZGxlcik7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF9jb250aW51ZVVwbG9hZCgpOiB2b2lkIHtcbiAgICBjb25zdCBjaHVua1NpemUgPSBSRVNVTUFCTEVfVVBMT0FEX0NIVU5LX1NJWkUgKiB0aGlzLl9jaHVua011bHRpcGxpZXI7XG4gICAgY29uc3Qgc3RhdHVzID0gbmV3IFJlc3VtYWJsZVVwbG9hZFN0YXR1cyhcbiAgICAgIHRoaXMuX3RyYW5zZmVycmVkLFxuICAgICAgdGhpcy5fYmxvYi5zaXplKClcbiAgICApO1xuXG4gICAgLy8gVE9ETyhhbmR5c290byk6IGFzc2VydCh0aGlzLnVwbG9hZFVybF8gIT09IG51bGwpO1xuICAgIGNvbnN0IHVybCA9IHRoaXMuX3VwbG9hZFVybCBhcyBzdHJpbmc7XG4gICAgdGhpcy5fcmVzb2x2ZVRva2VuKChhdXRoVG9rZW4sIGFwcENoZWNrVG9rZW4pID0+IHtcbiAgICAgIGxldCByZXF1ZXN0SW5mbztcbiAgICAgIHRyeSB7XG4gICAgICAgIHJlcXVlc3RJbmZvID0gY29udGludWVSZXN1bWFibGVVcGxvYWQoXG4gICAgICAgICAgdGhpcy5fcmVmLl9sb2NhdGlvbixcbiAgICAgICAgICB0aGlzLl9yZWYuc3RvcmFnZSxcbiAgICAgICAgICB1cmwsXG4gICAgICAgICAgdGhpcy5fYmxvYixcbiAgICAgICAgICBjaHVua1NpemUsXG4gICAgICAgICAgdGhpcy5fbWFwcGluZ3MsXG4gICAgICAgICAgc3RhdHVzLFxuICAgICAgICAgIHRoaXMuX21ha2VQcm9ncmVzc0NhbGxiYWNrKClcbiAgICAgICAgKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgdGhpcy5fZXJyb3IgPSBlIGFzIFN0b3JhZ2VFcnJvcjtcbiAgICAgICAgdGhpcy5fdHJhbnNpdGlvbihJbnRlcm5hbFRhc2tTdGF0ZS5FUlJPUik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHVwbG9hZFJlcXVlc3QgPSB0aGlzLl9yZWYuc3RvcmFnZS5fbWFrZVJlcXVlc3QoXG4gICAgICAgIHJlcXVlc3RJbmZvLFxuICAgICAgICBuZXdUZXh0Q29ubmVjdGlvbixcbiAgICAgICAgYXV0aFRva2VuLFxuICAgICAgICBhcHBDaGVja1Rva2VuLFxuICAgICAgICAvKnJldHJ5PSovIGZhbHNlIC8vIFVwbG9hZCByZXF1ZXN0cyBzaG91bGQgbm90IGJlIHJldHJpZWQgYXMgZWFjaCByZXRyeSBzaG91bGQgYmUgcHJlY2VkZWQgYnkgYW5vdGhlciBxdWVyeSByZXF1ZXN0LiBXaGljaCBpcyBoYW5kbGVkIGluIHRoaXMgZmlsZS5cbiAgICAgICk7XG4gICAgICB0aGlzLl9yZXF1ZXN0ID0gdXBsb2FkUmVxdWVzdDtcbiAgICAgIHVwbG9hZFJlcXVlc3QuZ2V0UHJvbWlzZSgpLnRoZW4oKG5ld1N0YXR1czogUmVzdW1hYmxlVXBsb2FkU3RhdHVzKSA9PiB7XG4gICAgICAgIHRoaXMuX2luY3JlYXNlTXVsdGlwbGllcigpO1xuICAgICAgICB0aGlzLl9yZXF1ZXN0ID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLl91cGRhdGVQcm9ncmVzcyhuZXdTdGF0dXMuY3VycmVudCk7XG4gICAgICAgIGlmIChuZXdTdGF0dXMuZmluYWxpemVkKSB7XG4gICAgICAgICAgdGhpcy5fbWV0YWRhdGEgPSBuZXdTdGF0dXMubWV0YWRhdGE7XG4gICAgICAgICAgdGhpcy5fdHJhbnNpdGlvbihJbnRlcm5hbFRhc2tTdGF0ZS5TVUNDRVNTKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmNvbXBsZXRlVHJhbnNpdGlvbnNfKCk7XG4gICAgICAgIH1cbiAgICAgIH0sIHRoaXMuX2Vycm9ySGFuZGxlcik7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF9pbmNyZWFzZU11bHRpcGxpZXIoKTogdm9pZCB7XG4gICAgY29uc3QgY3VycmVudFNpemUgPSBSRVNVTUFCTEVfVVBMT0FEX0NIVU5LX1NJWkUgKiB0aGlzLl9jaHVua011bHRpcGxpZXI7XG5cbiAgICAvLyBNYXggY2h1bmsgc2l6ZSBpcyAzMk0uXG4gICAgaWYgKGN1cnJlbnRTaXplICogMiA8IDMyICogMTAyNCAqIDEwMjQpIHtcbiAgICAgIHRoaXMuX2NodW5rTXVsdGlwbGllciAqPSAyO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2ZldGNoTWV0YWRhdGEoKTogdm9pZCB7XG4gICAgdGhpcy5fcmVzb2x2ZVRva2VuKChhdXRoVG9rZW4sIGFwcENoZWNrVG9rZW4pID0+IHtcbiAgICAgIGNvbnN0IHJlcXVlc3RJbmZvID0gZ2V0TWV0YWRhdGEoXG4gICAgICAgIHRoaXMuX3JlZi5zdG9yYWdlLFxuICAgICAgICB0aGlzLl9yZWYuX2xvY2F0aW9uLFxuICAgICAgICB0aGlzLl9tYXBwaW5nc1xuICAgICAgKTtcbiAgICAgIGNvbnN0IG1ldGFkYXRhUmVxdWVzdCA9IHRoaXMuX3JlZi5zdG9yYWdlLl9tYWtlUmVxdWVzdChcbiAgICAgICAgcmVxdWVzdEluZm8sXG4gICAgICAgIG5ld1RleHRDb25uZWN0aW9uLFxuICAgICAgICBhdXRoVG9rZW4sXG4gICAgICAgIGFwcENoZWNrVG9rZW5cbiAgICAgICk7XG4gICAgICB0aGlzLl9yZXF1ZXN0ID0gbWV0YWRhdGFSZXF1ZXN0O1xuICAgICAgbWV0YWRhdGFSZXF1ZXN0LmdldFByb21pc2UoKS50aGVuKG1ldGFkYXRhID0+IHtcbiAgICAgICAgdGhpcy5fcmVxdWVzdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5fbWV0YWRhdGEgPSBtZXRhZGF0YTtcbiAgICAgICAgdGhpcy5fdHJhbnNpdGlvbihJbnRlcm5hbFRhc2tTdGF0ZS5TVUNDRVNTKTtcbiAgICAgIH0sIHRoaXMuX21ldGFkYXRhRXJyb3JIYW5kbGVyKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX29uZVNob3RVcGxvYWQoKTogdm9pZCB7XG4gICAgdGhpcy5fcmVzb2x2ZVRva2VuKChhdXRoVG9rZW4sIGFwcENoZWNrVG9rZW4pID0+IHtcbiAgICAgIGNvbnN0IHJlcXVlc3RJbmZvID0gbXVsdGlwYXJ0VXBsb2FkKFxuICAgICAgICB0aGlzLl9yZWYuc3RvcmFnZSxcbiAgICAgICAgdGhpcy5fcmVmLl9sb2NhdGlvbixcbiAgICAgICAgdGhpcy5fbWFwcGluZ3MsXG4gICAgICAgIHRoaXMuX2Jsb2IsXG4gICAgICAgIHRoaXMuX21ldGFkYXRhXG4gICAgICApO1xuICAgICAgY29uc3QgbXVsdGlwYXJ0UmVxdWVzdCA9IHRoaXMuX3JlZi5zdG9yYWdlLl9tYWtlUmVxdWVzdChcbiAgICAgICAgcmVxdWVzdEluZm8sXG4gICAgICAgIG5ld1RleHRDb25uZWN0aW9uLFxuICAgICAgICBhdXRoVG9rZW4sXG4gICAgICAgIGFwcENoZWNrVG9rZW5cbiAgICAgICk7XG4gICAgICB0aGlzLl9yZXF1ZXN0ID0gbXVsdGlwYXJ0UmVxdWVzdDtcbiAgICAgIG11bHRpcGFydFJlcXVlc3QuZ2V0UHJvbWlzZSgpLnRoZW4obWV0YWRhdGEgPT4ge1xuICAgICAgICB0aGlzLl9yZXF1ZXN0ID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLl9tZXRhZGF0YSA9IG1ldGFkYXRhO1xuICAgICAgICB0aGlzLl91cGRhdGVQcm9ncmVzcyh0aGlzLl9ibG9iLnNpemUoKSk7XG4gICAgICAgIHRoaXMuX3RyYW5zaXRpb24oSW50ZXJuYWxUYXNrU3RhdGUuU1VDQ0VTUyk7XG4gICAgICB9LCB0aGlzLl9lcnJvckhhbmRsZXIpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfdXBkYXRlUHJvZ3Jlc3ModHJhbnNmZXJyZWQ6IG51bWJlcik6IHZvaWQge1xuICAgIGNvbnN0IG9sZCA9IHRoaXMuX3RyYW5zZmVycmVkO1xuICAgIHRoaXMuX3RyYW5zZmVycmVkID0gdHJhbnNmZXJyZWQ7XG5cbiAgICAvLyBBIHByb2dyZXNzIHVwZGF0ZSBjYW4gbWFrZSB0aGUgXCJ0cmFuc2ZlcnJlZFwiIHZhbHVlIHNtYWxsZXIgKGUuZy4gYVxuICAgIC8vIHBhcnRpYWwgdXBsb2FkIG5vdCBjb21wbGV0ZWQgYnkgc2VydmVyLCBhZnRlciB3aGljaCB0aGUgXCJ0cmFuc2ZlcnJlZFwiXG4gICAgLy8gdmFsdWUgbWF5IHJlc2V0IHRvIHRoZSB2YWx1ZSBhdCB0aGUgYmVnaW5uaW5nIG9mIHRoZSByZXF1ZXN0KS5cbiAgICBpZiAodGhpcy5fdHJhbnNmZXJyZWQgIT09IG9sZCkge1xuICAgICAgdGhpcy5fbm90aWZ5T2JzZXJ2ZXJzKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfdHJhbnNpdGlvbihzdGF0ZTogSW50ZXJuYWxUYXNrU3RhdGUpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fc3RhdGUgPT09IHN0YXRlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHN3aXRjaCAoc3RhdGUpIHtcbiAgICAgIGNhc2UgSW50ZXJuYWxUYXNrU3RhdGUuQ0FOQ0VMSU5HOlxuICAgICAgY2FzZSBJbnRlcm5hbFRhc2tTdGF0ZS5QQVVTSU5HOlxuICAgICAgICAvLyBUT0RPKGFuZHlzb3RvKTpcbiAgICAgICAgLy8gYXNzZXJ0KHRoaXMuc3RhdGVfID09PSBJbnRlcm5hbFRhc2tTdGF0ZS5SVU5OSU5HIHx8XG4gICAgICAgIC8vICAgICAgICB0aGlzLnN0YXRlXyA9PT0gSW50ZXJuYWxUYXNrU3RhdGUuUEFVU0lORyk7XG4gICAgICAgIHRoaXMuX3N0YXRlID0gc3RhdGU7XG4gICAgICAgIGlmICh0aGlzLl9yZXF1ZXN0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB0aGlzLl9yZXF1ZXN0LmNhbmNlbCgpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMucGVuZGluZ1RpbWVvdXQpIHtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5wZW5kaW5nVGltZW91dCk7XG4gICAgICAgICAgdGhpcy5wZW5kaW5nVGltZW91dCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICB0aGlzLmNvbXBsZXRlVHJhbnNpdGlvbnNfKCk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIEludGVybmFsVGFza1N0YXRlLlJVTk5JTkc6XG4gICAgICAgIC8vIFRPRE8oYW5keXNvdG8pOlxuICAgICAgICAvLyBhc3NlcnQodGhpcy5zdGF0ZV8gPT09IEludGVybmFsVGFza1N0YXRlLlBBVVNFRCB8fFxuICAgICAgICAvLyAgICAgICAgdGhpcy5zdGF0ZV8gPT09IEludGVybmFsVGFza1N0YXRlLlBBVVNJTkcpO1xuICAgICAgICBjb25zdCB3YXNQYXVzZWQgPSB0aGlzLl9zdGF0ZSA9PT0gSW50ZXJuYWxUYXNrU3RhdGUuUEFVU0VEO1xuICAgICAgICB0aGlzLl9zdGF0ZSA9IHN0YXRlO1xuICAgICAgICBpZiAod2FzUGF1c2VkKSB7XG4gICAgICAgICAgdGhpcy5fbm90aWZ5T2JzZXJ2ZXJzKCk7XG4gICAgICAgICAgdGhpcy5fc3RhcnQoKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgSW50ZXJuYWxUYXNrU3RhdGUuUEFVU0VEOlxuICAgICAgICAvLyBUT0RPKGFuZHlzb3RvKTpcbiAgICAgICAgLy8gYXNzZXJ0KHRoaXMuc3RhdGVfID09PSBJbnRlcm5hbFRhc2tTdGF0ZS5QQVVTSU5HKTtcbiAgICAgICAgdGhpcy5fc3RhdGUgPSBzdGF0ZTtcbiAgICAgICAgdGhpcy5fbm90aWZ5T2JzZXJ2ZXJzKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBJbnRlcm5hbFRhc2tTdGF0ZS5DQU5DRUxFRDpcbiAgICAgICAgLy8gVE9ETyhhbmR5c290byk6XG4gICAgICAgIC8vIGFzc2VydCh0aGlzLnN0YXRlXyA9PT0gSW50ZXJuYWxUYXNrU3RhdGUuUEFVU0VEIHx8XG4gICAgICAgIC8vICAgICAgICB0aGlzLnN0YXRlXyA9PT0gSW50ZXJuYWxUYXNrU3RhdGUuQ0FOQ0VMSU5HKTtcbiAgICAgICAgdGhpcy5fZXJyb3IgPSBjYW5jZWxlZCgpO1xuICAgICAgICB0aGlzLl9zdGF0ZSA9IHN0YXRlO1xuICAgICAgICB0aGlzLl9ub3RpZnlPYnNlcnZlcnMoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIEludGVybmFsVGFza1N0YXRlLkVSUk9SOlxuICAgICAgICAvLyBUT0RPKGFuZHlzb3RvKTpcbiAgICAgICAgLy8gYXNzZXJ0KHRoaXMuc3RhdGVfID09PSBJbnRlcm5hbFRhc2tTdGF0ZS5SVU5OSU5HIHx8XG4gICAgICAgIC8vICAgICAgICB0aGlzLnN0YXRlXyA9PT0gSW50ZXJuYWxUYXNrU3RhdGUuUEFVU0lORyB8fFxuICAgICAgICAvLyAgICAgICAgdGhpcy5zdGF0ZV8gPT09IEludGVybmFsVGFza1N0YXRlLkNBTkNFTElORyk7XG4gICAgICAgIHRoaXMuX3N0YXRlID0gc3RhdGU7XG4gICAgICAgIHRoaXMuX25vdGlmeU9ic2VydmVycygpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgSW50ZXJuYWxUYXNrU3RhdGUuU1VDQ0VTUzpcbiAgICAgICAgLy8gVE9ETyhhbmR5c290byk6XG4gICAgICAgIC8vIGFzc2VydCh0aGlzLnN0YXRlXyA9PT0gSW50ZXJuYWxUYXNrU3RhdGUuUlVOTklORyB8fFxuICAgICAgICAvLyAgICAgICAgdGhpcy5zdGF0ZV8gPT09IEludGVybmFsVGFza1N0YXRlLlBBVVNJTkcgfHxcbiAgICAgICAgLy8gICAgICAgIHRoaXMuc3RhdGVfID09PSBJbnRlcm5hbFRhc2tTdGF0ZS5DQU5DRUxJTkcpO1xuICAgICAgICB0aGlzLl9zdGF0ZSA9IHN0YXRlO1xuICAgICAgICB0aGlzLl9ub3RpZnlPYnNlcnZlcnMoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OiAvLyBJZ25vcmVcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNvbXBsZXRlVHJhbnNpdGlvbnNfKCk6IHZvaWQge1xuICAgIHN3aXRjaCAodGhpcy5fc3RhdGUpIHtcbiAgICAgIGNhc2UgSW50ZXJuYWxUYXNrU3RhdGUuUEFVU0lORzpcbiAgICAgICAgdGhpcy5fdHJhbnNpdGlvbihJbnRlcm5hbFRhc2tTdGF0ZS5QQVVTRUQpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgSW50ZXJuYWxUYXNrU3RhdGUuQ0FOQ0VMSU5HOlxuICAgICAgICB0aGlzLl90cmFuc2l0aW9uKEludGVybmFsVGFza1N0YXRlLkNBTkNFTEVEKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIEludGVybmFsVGFza1N0YXRlLlJVTk5JTkc6XG4gICAgICAgIHRoaXMuX3N0YXJ0KCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgLy8gVE9ETyhhbmR5c290byk6IGFzc2VydChmYWxzZSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBIHNuYXBzaG90IG9mIHRoZSBjdXJyZW50IHRhc2sgc3RhdGUuXG4gICAqL1xuICBnZXQgc25hcHNob3QoKTogVXBsb2FkVGFza1NuYXBzaG90IHtcbiAgICBjb25zdCBleHRlcm5hbFN0YXRlID0gdGFza1N0YXRlRnJvbUludGVybmFsVGFza1N0YXRlKHRoaXMuX3N0YXRlKTtcbiAgICByZXR1cm4ge1xuICAgICAgYnl0ZXNUcmFuc2ZlcnJlZDogdGhpcy5fdHJhbnNmZXJyZWQsXG4gICAgICB0b3RhbEJ5dGVzOiB0aGlzLl9ibG9iLnNpemUoKSxcbiAgICAgIHN0YXRlOiBleHRlcm5hbFN0YXRlLFxuICAgICAgbWV0YWRhdGE6IHRoaXMuX21ldGFkYXRhISxcbiAgICAgIHRhc2s6IHRoaXMsXG4gICAgICByZWY6IHRoaXMuX3JlZlxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIGNhbGxiYWNrIGZvciBhbiBldmVudC5cbiAgICogQHBhcmFtIHR5cGUgLSBUaGUgdHlwZSBvZiBldmVudCB0byBsaXN0ZW4gZm9yLlxuICAgKiBAcGFyYW0gbmV4dE9yT2JzZXJ2ZXIgLVxuICAgKiAgICAgVGhlIGBuZXh0YCBmdW5jdGlvbiwgd2hpY2ggZ2V0cyBjYWxsZWQgZm9yIGVhY2ggaXRlbSBpblxuICAgKiAgICAgdGhlIGV2ZW50IHN0cmVhbSwgb3IgYW4gb2JzZXJ2ZXIgb2JqZWN0IHdpdGggc29tZSBvciBhbGwgb2YgdGhlc2UgdGhyZWVcbiAgICogICAgIHByb3BlcnRpZXMgKGBuZXh0YCwgYGVycm9yYCwgYGNvbXBsZXRlYCkuXG4gICAqIEBwYXJhbSBlcnJvciAtIEEgZnVuY3Rpb24gdGhhdCBnZXRzIGNhbGxlZCB3aXRoIGEgYFN0b3JhZ2VFcnJvcmBcbiAgICogICAgIGlmIHRoZSBldmVudCBzdHJlYW0gZW5kcyBkdWUgdG8gYW4gZXJyb3IuXG4gICAqIEBwYXJhbSBjb21wbGV0ZWQgLSBBIGZ1bmN0aW9uIHRoYXQgZ2V0cyBjYWxsZWQgaWYgdGhlXG4gICAqICAgICBldmVudCBzdHJlYW0gZW5kcyBub3JtYWxseS5cbiAgICogQHJldHVybnNcbiAgICogICAgIElmIG9ubHkgdGhlIGV2ZW50IGFyZ3VtZW50IGlzIHBhc3NlZCwgcmV0dXJucyBhIGZ1bmN0aW9uIHlvdSBjYW4gdXNlIHRvXG4gICAqICAgICBhZGQgY2FsbGJhY2tzIChzZWUgdGhlIGV4YW1wbGVzIGFib3ZlKS4gSWYgbW9yZSB0aGFuIGp1c3QgdGhlIGV2ZW50XG4gICAqICAgICBhcmd1bWVudCBpcyBwYXNzZWQsIHJldHVybnMgYSBmdW5jdGlvbiB5b3UgY2FuIGNhbGwgdG8gdW5yZWdpc3RlciB0aGVcbiAgICogICAgIGNhbGxiYWNrcy5cbiAgICovXG4gIG9uKFxuICAgIHR5cGU6IFRhc2tFdmVudCxcbiAgICBuZXh0T3JPYnNlcnZlcj86XG4gICAgICB8IFN0b3JhZ2VPYnNlcnZlcjxVcGxvYWRUYXNrU25hcHNob3Q+XG4gICAgICB8IG51bGxcbiAgICAgIHwgKChzbmFwc2hvdDogVXBsb2FkVGFza1NuYXBzaG90KSA9PiB1bmtub3duKSxcbiAgICBlcnJvcj86ICgoYTogU3RvcmFnZUVycm9yKSA9PiB1bmtub3duKSB8IG51bGwsXG4gICAgY29tcGxldGVkPzogQ29tcGxldGVGbiB8IG51bGxcbiAgKTogVW5zdWJzY3JpYmUgfCBTdWJzY3JpYmU8VXBsb2FkVGFza1NuYXBzaG90PiB7XG4gICAgLy8gTm90ZTogYHR5cGVgIGlzbid0IGJlaW5nIHVzZWQuIEl0cyB0eXBlIGlzIGFsc28gaW5jb3JyZWN0LiBUYXNrRXZlbnQgc2hvdWxkIG5vdCBiZSBhIHN0cmluZy5cbiAgICBjb25zdCBvYnNlcnZlciA9IG5ldyBPYnNlcnZlcihcbiAgICAgIChuZXh0T3JPYnNlcnZlciBhc1xuICAgICAgICB8IFN0b3JhZ2VPYnNlcnZlckludGVybmFsPFVwbG9hZFRhc2tTbmFwc2hvdD5cbiAgICAgICAgfCBOZXh0Rm48VXBsb2FkVGFza1NuYXBzaG90PikgfHwgdW5kZWZpbmVkLFxuICAgICAgZXJyb3IgfHwgdW5kZWZpbmVkLFxuICAgICAgY29tcGxldGVkIHx8IHVuZGVmaW5lZFxuICAgICk7XG4gICAgdGhpcy5fYWRkT2JzZXJ2ZXIob2JzZXJ2ZXIpO1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICB0aGlzLl9yZW1vdmVPYnNlcnZlcihvYnNlcnZlcik7XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG9iamVjdCBiZWhhdmVzIGxpa2UgYSBQcm9taXNlLCBhbmQgcmVzb2x2ZXMgd2l0aCBpdHMgc25hcHNob3QgZGF0YVxuICAgKiB3aGVuIHRoZSB1cGxvYWQgY29tcGxldGVzLlxuICAgKiBAcGFyYW0gb25GdWxmaWxsZWQgLSBUaGUgZnVsZmlsbG1lbnQgY2FsbGJhY2suIFByb21pc2UgY2hhaW5pbmcgd29ya3MgYXMgbm9ybWFsLlxuICAgKiBAcGFyYW0gb25SZWplY3RlZCAtIFRoZSByZWplY3Rpb24gY2FsbGJhY2suXG4gICAqL1xuICB0aGVuPFU+KFxuICAgIG9uRnVsZmlsbGVkPzogKCh2YWx1ZTogVXBsb2FkVGFza1NuYXBzaG90KSA9PiBVIHwgUHJvbWlzZTxVPikgfCBudWxsLFxuICAgIG9uUmVqZWN0ZWQ/OiAoKGVycm9yOiBTdG9yYWdlRXJyb3IpID0+IFUgfCBQcm9taXNlPFU+KSB8IG51bGxcbiAgKTogUHJvbWlzZTxVPiB7XG4gICAgLy8gVGhlc2UgY2FzdHMgYXJlIG5lZWRlZCBzbyB0aGF0IFR5cGVTY3JpcHQgY2FuIGluZmVyIHRoZSB0eXBlcyBvZiB0aGVcbiAgICAvLyByZXN1bHRpbmcgUHJvbWlzZS5cbiAgICByZXR1cm4gdGhpcy5fcHJvbWlzZS50aGVuPFU+KFxuICAgICAgb25GdWxmaWxsZWQgYXMgKHZhbHVlOiBVcGxvYWRUYXNrU25hcHNob3QpID0+IFUgfCBQcm9taXNlPFU+LFxuICAgICAgb25SZWplY3RlZCBhcyAoKGVycm9yOiB1bmtub3duKSA9PiBQcm9taXNlPG5ldmVyPikgfCBudWxsXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFcXVpdmFsZW50IHRvIGNhbGxpbmcgYHRoZW4obnVsbCwgb25SZWplY3RlZClgLlxuICAgKi9cbiAgY2F0Y2g8VD4ob25SZWplY3RlZDogKHAxOiBTdG9yYWdlRXJyb3IpID0+IFQgfCBQcm9taXNlPFQ+KTogUHJvbWlzZTxUPiB7XG4gICAgcmV0dXJuIHRoaXMudGhlbihudWxsLCBvblJlamVjdGVkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIHRoZSBnaXZlbiBvYnNlcnZlci5cbiAgICovXG4gIHByaXZhdGUgX2FkZE9ic2VydmVyKG9ic2VydmVyOiBPYnNlcnZlcjxVcGxvYWRUYXNrU25hcHNob3Q+KTogdm9pZCB7XG4gICAgdGhpcy5fb2JzZXJ2ZXJzLnB1c2gob2JzZXJ2ZXIpO1xuICAgIHRoaXMuX25vdGlmeU9ic2VydmVyKG9ic2VydmVyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIHRoZSBnaXZlbiBvYnNlcnZlci5cbiAgICovXG4gIHByaXZhdGUgX3JlbW92ZU9ic2VydmVyKG9ic2VydmVyOiBPYnNlcnZlcjxVcGxvYWRUYXNrU25hcHNob3Q+KTogdm9pZCB7XG4gICAgY29uc3QgaSA9IHRoaXMuX29ic2VydmVycy5pbmRleE9mKG9ic2VydmVyKTtcbiAgICBpZiAoaSAhPT0gLTEpIHtcbiAgICAgIHRoaXMuX29ic2VydmVycy5zcGxpY2UoaSwgMSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfbm90aWZ5T2JzZXJ2ZXJzKCk6IHZvaWQge1xuICAgIHRoaXMuX2ZpbmlzaFByb21pc2UoKTtcbiAgICBjb25zdCBvYnNlcnZlcnMgPSB0aGlzLl9vYnNlcnZlcnMuc2xpY2UoKTtcbiAgICBvYnNlcnZlcnMuZm9yRWFjaChvYnNlcnZlciA9PiB7XG4gICAgICB0aGlzLl9ub3RpZnlPYnNlcnZlcihvYnNlcnZlcik7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF9maW5pc2hQcm9taXNlKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9yZXNvbHZlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGxldCB0cmlnZ2VyZWQgPSB0cnVlO1xuICAgICAgc3dpdGNoICh0YXNrU3RhdGVGcm9tSW50ZXJuYWxUYXNrU3RhdGUodGhpcy5fc3RhdGUpKSB7XG4gICAgICAgIGNhc2UgVGFza1N0YXRlLlNVQ0NFU1M6XG4gICAgICAgICAgZmJzQXN5bmModGhpcy5fcmVzb2x2ZS5iaW5kKG51bGwsIHRoaXMuc25hcHNob3QpKSgpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFRhc2tTdGF0ZS5DQU5DRUxFRDpcbiAgICAgICAgY2FzZSBUYXNrU3RhdGUuRVJST1I6XG4gICAgICAgICAgY29uc3QgdG9DYWxsID0gdGhpcy5fcmVqZWN0IGFzIChwMTogU3RvcmFnZUVycm9yKSA9PiB2b2lkO1xuICAgICAgICAgIGZic0FzeW5jKHRvQ2FsbC5iaW5kKG51bGwsIHRoaXMuX2Vycm9yIGFzIFN0b3JhZ2VFcnJvcikpKCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgdHJpZ2dlcmVkID0gZmFsc2U7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBpZiAodHJpZ2dlcmVkKSB7XG4gICAgICAgIHRoaXMuX3Jlc29sdmUgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMuX3JlamVjdCA9IHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9ub3RpZnlPYnNlcnZlcihvYnNlcnZlcjogT2JzZXJ2ZXI8VXBsb2FkVGFza1NuYXBzaG90Pik6IHZvaWQge1xuICAgIGNvbnN0IGV4dGVybmFsU3RhdGUgPSB0YXNrU3RhdGVGcm9tSW50ZXJuYWxUYXNrU3RhdGUodGhpcy5fc3RhdGUpO1xuICAgIHN3aXRjaCAoZXh0ZXJuYWxTdGF0ZSkge1xuICAgICAgY2FzZSBUYXNrU3RhdGUuUlVOTklORzpcbiAgICAgIGNhc2UgVGFza1N0YXRlLlBBVVNFRDpcbiAgICAgICAgaWYgKG9ic2VydmVyLm5leHQpIHtcbiAgICAgICAgICBmYnNBc3luYyhvYnNlcnZlci5uZXh0LmJpbmQob2JzZXJ2ZXIsIHRoaXMuc25hcHNob3QpKSgpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBUYXNrU3RhdGUuU1VDQ0VTUzpcbiAgICAgICAgaWYgKG9ic2VydmVyLmNvbXBsZXRlKSB7XG4gICAgICAgICAgZmJzQXN5bmMob2JzZXJ2ZXIuY29tcGxldGUuYmluZChvYnNlcnZlcikpKCk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFRhc2tTdGF0ZS5DQU5DRUxFRDpcbiAgICAgIGNhc2UgVGFza1N0YXRlLkVSUk9SOlxuICAgICAgICBpZiAob2JzZXJ2ZXIuZXJyb3IpIHtcbiAgICAgICAgICBmYnNBc3luYyhcbiAgICAgICAgICAgIG9ic2VydmVyLmVycm9yLmJpbmQob2JzZXJ2ZXIsIHRoaXMuX2Vycm9yIGFzIFN0b3JhZ2VFcnJvcilcbiAgICAgICAgICApKCk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICAvLyBUT0RPKGFuZHlzb3RvKTogYXNzZXJ0KGZhbHNlKTtcbiAgICAgICAgaWYgKG9ic2VydmVyLmVycm9yKSB7XG4gICAgICAgICAgZmJzQXN5bmMoXG4gICAgICAgICAgICBvYnNlcnZlci5lcnJvci5iaW5kKG9ic2VydmVyLCB0aGlzLl9lcnJvciBhcyBTdG9yYWdlRXJyb3IpXG4gICAgICAgICAgKSgpO1xuICAgICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlc3VtZXMgYSBwYXVzZWQgdGFzay4gSGFzIG5vIGVmZmVjdCBvbiBhIGN1cnJlbnRseSBydW5uaW5nIG9yIGZhaWxlZCB0YXNrLlxuICAgKiBAcmV0dXJucyBUcnVlIGlmIHRoZSBvcGVyYXRpb24gdG9vayBlZmZlY3QsIGZhbHNlIGlmIGlnbm9yZWQuXG4gICAqL1xuICByZXN1bWUoKTogYm9vbGVhbiB7XG4gICAgY29uc3QgdmFsaWQgPVxuICAgICAgdGhpcy5fc3RhdGUgPT09IEludGVybmFsVGFza1N0YXRlLlBBVVNFRCB8fFxuICAgICAgdGhpcy5fc3RhdGUgPT09IEludGVybmFsVGFza1N0YXRlLlBBVVNJTkc7XG4gICAgaWYgKHZhbGlkKSB7XG4gICAgICB0aGlzLl90cmFuc2l0aW9uKEludGVybmFsVGFza1N0YXRlLlJVTk5JTkcpO1xuICAgIH1cbiAgICByZXR1cm4gdmFsaWQ7XG4gIH1cblxuICAvKipcbiAgICogUGF1c2VzIGEgY3VycmVudGx5IHJ1bm5pbmcgdGFzay4gSGFzIG5vIGVmZmVjdCBvbiBhIHBhdXNlZCBvciBmYWlsZWQgdGFzay5cbiAgICogQHJldHVybnMgVHJ1ZSBpZiB0aGUgb3BlcmF0aW9uIHRvb2sgZWZmZWN0LCBmYWxzZSBpZiBpZ25vcmVkLlxuICAgKi9cbiAgcGF1c2UoKTogYm9vbGVhbiB7XG4gICAgY29uc3QgdmFsaWQgPSB0aGlzLl9zdGF0ZSA9PT0gSW50ZXJuYWxUYXNrU3RhdGUuUlVOTklORztcbiAgICBpZiAodmFsaWQpIHtcbiAgICAgIHRoaXMuX3RyYW5zaXRpb24oSW50ZXJuYWxUYXNrU3RhdGUuUEFVU0lORyk7XG4gICAgfVxuICAgIHJldHVybiB2YWxpZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYW5jZWxzIGEgY3VycmVudGx5IHJ1bm5pbmcgb3IgcGF1c2VkIHRhc2suIEhhcyBubyBlZmZlY3Qgb24gYSBjb21wbGV0ZSBvclxuICAgKiBmYWlsZWQgdGFzay5cbiAgICogQHJldHVybnMgVHJ1ZSBpZiB0aGUgb3BlcmF0aW9uIHRvb2sgZWZmZWN0LCBmYWxzZSBpZiBpZ25vcmVkLlxuICAgKi9cbiAgY2FuY2VsKCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHZhbGlkID1cbiAgICAgIHRoaXMuX3N0YXRlID09PSBJbnRlcm5hbFRhc2tTdGF0ZS5SVU5OSU5HIHx8XG4gICAgICB0aGlzLl9zdGF0ZSA9PT0gSW50ZXJuYWxUYXNrU3RhdGUuUEFVU0lORztcbiAgICBpZiAodmFsaWQpIHtcbiAgICAgIHRoaXMuX3RyYW5zaXRpb24oSW50ZXJuYWxUYXNrU3RhdGUuQ0FOQ0VMSU5HKTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbGlkO1xuICB9XG59XG4iLCAiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IERlZmluZXMgdGhlIEZpcmViYXNlIFN0b3JhZ2VSZWZlcmVuY2UgY2xhc3MuXG4gKi9cblxuaW1wb3J0IHsgUGFzc1Rocm91Z2gsIFRyYW5zZm9ybSwgVHJhbnNmb3JtT3B0aW9ucyB9IGZyb20gJ3N0cmVhbSc7XG5cbmltcG9ydCB7IEZic0Jsb2IgfSBmcm9tICcuL2ltcGxlbWVudGF0aW9uL2Jsb2InO1xuaW1wb3J0IHsgTG9jYXRpb24gfSBmcm9tICcuL2ltcGxlbWVudGF0aW9uL2xvY2F0aW9uJztcbmltcG9ydCB7IGdldE1hcHBpbmdzIH0gZnJvbSAnLi9pbXBsZW1lbnRhdGlvbi9tZXRhZGF0YSc7XG5pbXBvcnQgeyBjaGlsZCwgbGFzdENvbXBvbmVudCwgcGFyZW50IH0gZnJvbSAnLi9pbXBsZW1lbnRhdGlvbi9wYXRoJztcbmltcG9ydCB7XG4gIGRlbGV0ZU9iamVjdCBhcyByZXF1ZXN0c0RlbGV0ZU9iamVjdCxcbiAgZ2V0Qnl0ZXMsXG4gIGdldERvd25sb2FkVXJsIGFzIHJlcXVlc3RzR2V0RG93bmxvYWRVcmwsXG4gIGdldE1ldGFkYXRhIGFzIHJlcXVlc3RzR2V0TWV0YWRhdGEsXG4gIGxpc3QgYXMgcmVxdWVzdHNMaXN0LFxuICBtdWx0aXBhcnRVcGxvYWQsXG4gIHVwZGF0ZU1ldGFkYXRhIGFzIHJlcXVlc3RzVXBkYXRlTWV0YWRhdGFcbn0gZnJvbSAnLi9pbXBsZW1lbnRhdGlvbi9yZXF1ZXN0cyc7XG5pbXBvcnQgeyBMaXN0T3B0aW9ucywgVXBsb2FkUmVzdWx0IH0gZnJvbSAnLi9wdWJsaWMtdHlwZXMnO1xuaW1wb3J0IHsgZGF0YUZyb21TdHJpbmcsIFN0cmluZ0Zvcm1hdCB9IGZyb20gJy4vaW1wbGVtZW50YXRpb24vc3RyaW5nJztcbmltcG9ydCB7IE1ldGFkYXRhIH0gZnJvbSAnLi9tZXRhZGF0YSc7XG5pbXBvcnQgeyBGaXJlYmFzZVN0b3JhZ2VJbXBsIH0gZnJvbSAnLi9zZXJ2aWNlJztcbmltcG9ydCB7IExpc3RSZXN1bHQgfSBmcm9tICcuL2xpc3QnO1xuaW1wb3J0IHsgVXBsb2FkVGFzayB9IGZyb20gJy4vdGFzayc7XG5pbXBvcnQgeyBpbnZhbGlkUm9vdE9wZXJhdGlvbiwgbm9Eb3dubG9hZFVSTCB9IGZyb20gJy4vaW1wbGVtZW50YXRpb24vZXJyb3InO1xuaW1wb3J0IHsgdmFsaWRhdGVOdW1iZXIgfSBmcm9tICcuL2ltcGxlbWVudGF0aW9uL3R5cGUnO1xuaW1wb3J0IHtcbiAgbmV3QmxvYkNvbm5lY3Rpb24sXG4gIG5ld0J5dGVzQ29ubmVjdGlvbixcbiAgbmV3U3RyZWFtQ29ubmVjdGlvbixcbiAgbmV3VGV4dENvbm5lY3Rpb25cbn0gZnJvbSAnLi9wbGF0Zm9ybS9jb25uZWN0aW9uJztcblxuLyoqXG4gKiBQcm92aWRlcyBtZXRob2RzIHRvIGludGVyYWN0IHdpdGggYSBidWNrZXQgaW4gdGhlIEZpcmViYXNlIFN0b3JhZ2Ugc2VydmljZS5cbiAqIEBpbnRlcm5hbFxuICogQHBhcmFtIF9sb2NhdGlvbiAtIEFuIGZicy5sb2NhdGlvbiwgb3IgdGhlIFVSTCBhdFxuICogICAgIHdoaWNoIHRvIGJhc2UgdGhpcyBvYmplY3QsIGluIG9uZSBvZiB0aGUgZm9sbG93aW5nIGZvcm1zOlxuICogICAgICAgICBnczovLzxidWNrZXQ+LzxvYmplY3QtcGF0aD5cbiAqICAgICAgICAgaHR0cFtzXTovL2ZpcmViYXNlc3RvcmFnZS5nb29nbGVhcGlzLmNvbS9cbiAqICAgICAgICAgICAgICAgICAgICAgPGFwaS12ZXJzaW9uPi9iLzxidWNrZXQ+L28vPG9iamVjdC1wYXRoPlxuICogICAgIEFueSBxdWVyeSBvciBmcmFnbWVudCBzdHJpbmdzIHdpbGwgYmUgaWdub3JlZCBpbiB0aGUgaHR0cFtzXVxuICogICAgIGZvcm1hdC4gSWYgbm8gdmFsdWUgaXMgcGFzc2VkLCB0aGUgc3RvcmFnZSBvYmplY3Qgd2lsbCB1c2UgYSBVUkwgYmFzZWQgb25cbiAqICAgICB0aGUgcHJvamVjdCBJRCBvZiB0aGUgYmFzZSBmaXJlYmFzZS5BcHAgaW5zdGFuY2UuXG4gKi9cbmV4cG9ydCBjbGFzcyBSZWZlcmVuY2Uge1xuICBfbG9jYXRpb246IExvY2F0aW9uO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX3NlcnZpY2U6IEZpcmViYXNlU3RvcmFnZUltcGwsXG4gICAgbG9jYXRpb246IHN0cmluZyB8IExvY2F0aW9uXG4gICkge1xuICAgIGlmIChsb2NhdGlvbiBpbnN0YW5jZW9mIExvY2F0aW9uKSB7XG4gICAgICB0aGlzLl9sb2NhdGlvbiA9IGxvY2F0aW9uO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9sb2NhdGlvbiA9IExvY2F0aW9uLm1ha2VGcm9tVXJsKGxvY2F0aW9uLCBfc2VydmljZS5ob3N0KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgVVJMIGZvciB0aGUgYnVja2V0IGFuZCBwYXRoIHRoaXMgb2JqZWN0IHJlZmVyZW5jZXMsXG4gICAqICAgICBpbiB0aGUgZm9ybSBnczovLzxidWNrZXQ+LzxvYmplY3QtcGF0aD5cbiAgICogQG92ZXJyaWRlXG4gICAqL1xuICB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgIHJldHVybiAnZ3M6Ly8nICsgdGhpcy5fbG9jYXRpb24uYnVja2V0ICsgJy8nICsgdGhpcy5fbG9jYXRpb24ucGF0aDtcbiAgfVxuXG4gIHByb3RlY3RlZCBfbmV3UmVmKFxuICAgIHNlcnZpY2U6IEZpcmViYXNlU3RvcmFnZUltcGwsXG4gICAgbG9jYXRpb246IExvY2F0aW9uXG4gICk6IFJlZmVyZW5jZSB7XG4gICAgcmV0dXJuIG5ldyBSZWZlcmVuY2Uoc2VydmljZSwgbG9jYXRpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgcmVmZXJlbmNlIHRvIHRoZSByb290IG9mIHRoaXMgb2JqZWN0J3MgYnVja2V0LlxuICAgKi9cbiAgZ2V0IHJvb3QoKTogUmVmZXJlbmNlIHtcbiAgICBjb25zdCBsb2NhdGlvbiA9IG5ldyBMb2NhdGlvbih0aGlzLl9sb2NhdGlvbi5idWNrZXQsICcnKTtcbiAgICByZXR1cm4gdGhpcy5fbmV3UmVmKHRoaXMuX3NlcnZpY2UsIGxvY2F0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgYnVja2V0IGNvbnRhaW5pbmcgdGhpcyByZWZlcmVuY2UncyBvYmplY3QuXG4gICAqL1xuICBnZXQgYnVja2V0KCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX2xvY2F0aW9uLmJ1Y2tldDtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgZnVsbCBwYXRoIG9mIHRoaXMgb2JqZWN0LlxuICAgKi9cbiAgZ2V0IGZ1bGxQYXRoKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX2xvY2F0aW9uLnBhdGg7XG4gIH1cblxuICAvKipcbiAgICogVGhlIHNob3J0IG5hbWUgb2YgdGhpcyBvYmplY3QsIHdoaWNoIGlzIHRoZSBsYXN0IGNvbXBvbmVudCBvZiB0aGUgZnVsbCBwYXRoLlxuICAgKiBGb3IgZXhhbXBsZSwgaWYgZnVsbFBhdGggaXMgJ2Z1bGwvcGF0aC9pbWFnZS5wbmcnLCBuYW1lIGlzICdpbWFnZS5wbmcnLlxuICAgKi9cbiAgZ2V0IG5hbWUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gbGFzdENvbXBvbmVudCh0aGlzLl9sb2NhdGlvbi5wYXRoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgYFN0b3JhZ2VTZXJ2aWNlYCBpbnN0YW5jZSB0aGlzIGBTdG9yYWdlUmVmZXJlbmNlYCBpcyBhc3NvY2lhdGVkIHdpdGguXG4gICAqL1xuICBnZXQgc3RvcmFnZSgpOiBGaXJlYmFzZVN0b3JhZ2VJbXBsIHtcbiAgICByZXR1cm4gdGhpcy5fc2VydmljZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIGBTdG9yYWdlUmVmZXJlbmNlYCBwb2ludGluZyB0byB0aGUgcGFyZW50IGxvY2F0aW9uIG9mIHRoaXMgYFN0b3JhZ2VSZWZlcmVuY2VgLCBvciBudWxsIGlmXG4gICAqIHRoaXMgcmVmZXJlbmNlIGlzIHRoZSByb290LlxuICAgKi9cbiAgZ2V0IHBhcmVudCgpOiBSZWZlcmVuY2UgfCBudWxsIHtcbiAgICBjb25zdCBuZXdQYXRoID0gcGFyZW50KHRoaXMuX2xvY2F0aW9uLnBhdGgpO1xuICAgIGlmIChuZXdQYXRoID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3QgbG9jYXRpb24gPSBuZXcgTG9jYXRpb24odGhpcy5fbG9jYXRpb24uYnVja2V0LCBuZXdQYXRoKTtcbiAgICByZXR1cm4gbmV3IFJlZmVyZW5jZSh0aGlzLl9zZXJ2aWNlLCBsb2NhdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogVXRpbGl0eSBmdW5jdGlvbiB0byB0aHJvdyBhbiBlcnJvciBpbiBtZXRob2RzIHRoYXQgZG8gbm90IGFjY2VwdCBhIHJvb3QgcmVmZXJlbmNlLlxuICAgKi9cbiAgX3Rocm93SWZSb290KG5hbWU6IHN0cmluZyk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9sb2NhdGlvbi5wYXRoID09PSAnJykge1xuICAgICAgdGhyb3cgaW52YWxpZFJvb3RPcGVyYXRpb24obmFtZSk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogRG93bmxvYWQgdGhlIGJ5dGVzIGF0IHRoZSBvYmplY3QncyBsb2NhdGlvbi5cbiAqIEByZXR1cm5zIEEgUHJvbWlzZSBjb250YWluaW5nIHRoZSBkb3dubG9hZGVkIGJ5dGVzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0Qnl0ZXNJbnRlcm5hbChcbiAgcmVmOiBSZWZlcmVuY2UsXG4gIG1heERvd25sb2FkU2l6ZUJ5dGVzPzogbnVtYmVyXG4pOiBQcm9taXNlPEFycmF5QnVmZmVyPiB7XG4gIHJlZi5fdGhyb3dJZlJvb3QoJ2dldEJ5dGVzJyk7XG4gIGNvbnN0IHJlcXVlc3RJbmZvID0gZ2V0Qnl0ZXMoXG4gICAgcmVmLnN0b3JhZ2UsXG4gICAgcmVmLl9sb2NhdGlvbixcbiAgICBtYXhEb3dubG9hZFNpemVCeXRlc1xuICApO1xuICByZXR1cm4gcmVmLnN0b3JhZ2VcbiAgICAubWFrZVJlcXVlc3RXaXRoVG9rZW5zKHJlcXVlc3RJbmZvLCBuZXdCeXRlc0Nvbm5lY3Rpb24pXG4gICAgLnRoZW4oYnl0ZXMgPT5cbiAgICAgIG1heERvd25sb2FkU2l6ZUJ5dGVzICE9PSB1bmRlZmluZWRcbiAgICAgICAgPyAvLyBHQ1MgbWF5IG5vdCBob25vciB0aGUgUmFuZ2UgaGVhZGVyIGZvciBzbWFsbCBmaWxlc1xuICAgICAgICAgIChieXRlcyBhcyBBcnJheUJ1ZmZlcikuc2xpY2UoMCwgbWF4RG93bmxvYWRTaXplQnl0ZXMpXG4gICAgICAgIDogKGJ5dGVzIGFzIEFycmF5QnVmZmVyKVxuICAgICk7XG59XG5cbi8qKlxuICogRG93bmxvYWQgdGhlIGJ5dGVzIGF0IHRoZSBvYmplY3QncyBsb2NhdGlvbi5cbiAqIEByZXR1cm5zIEEgUHJvbWlzZSBjb250YWluaW5nIHRoZSBkb3dubG9hZGVkIGJsb2IuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRCbG9iSW50ZXJuYWwoXG4gIHJlZjogUmVmZXJlbmNlLFxuICBtYXhEb3dubG9hZFNpemVCeXRlcz86IG51bWJlclxuKTogUHJvbWlzZTxCbG9iPiB7XG4gIHJlZi5fdGhyb3dJZlJvb3QoJ2dldEJsb2InKTtcbiAgY29uc3QgcmVxdWVzdEluZm8gPSBnZXRCeXRlcyhcbiAgICByZWYuc3RvcmFnZSxcbiAgICByZWYuX2xvY2F0aW9uLFxuICAgIG1heERvd25sb2FkU2l6ZUJ5dGVzXG4gICk7XG4gIHJldHVybiByZWYuc3RvcmFnZVxuICAgIC5tYWtlUmVxdWVzdFdpdGhUb2tlbnMocmVxdWVzdEluZm8sIG5ld0Jsb2JDb25uZWN0aW9uKVxuICAgIC50aGVuKGJsb2IgPT5cbiAgICAgIG1heERvd25sb2FkU2l6ZUJ5dGVzICE9PSB1bmRlZmluZWRcbiAgICAgICAgPyAvLyBHQ1MgbWF5IG5vdCBob25vciB0aGUgUmFuZ2UgaGVhZGVyIGZvciBzbWFsbCBmaWxlc1xuICAgICAgICAgIChibG9iIGFzIEJsb2IpLnNsaWNlKDAsIG1heERvd25sb2FkU2l6ZUJ5dGVzKVxuICAgICAgICA6IChibG9iIGFzIEJsb2IpXG4gICAgKTtcbn1cblxuLyoqIFN0cmVhbSB0aGUgYnl0ZXMgYXQgdGhlIG9iamVjdCdzIGxvY2F0aW9uLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFN0cmVhbUludGVybmFsKFxuICByZWY6IFJlZmVyZW5jZSxcbiAgbWF4RG93bmxvYWRTaXplQnl0ZXM/OiBudW1iZXJcbik6IE5vZGVKUy5SZWFkYWJsZVN0cmVhbSB7XG4gIHJlZi5fdGhyb3dJZlJvb3QoJ2dldFN0cmVhbScpO1xuICBjb25zdCByZXF1ZXN0SW5mbyA9IGdldEJ5dGVzKFxuICAgIHJlZi5zdG9yYWdlLFxuICAgIHJlZi5fbG9jYXRpb24sXG4gICAgbWF4RG93bmxvYWRTaXplQnl0ZXNcbiAgKTtcblxuICAvKiogQSB0cmFuc2Zvcm1lciB0aGF0IHBhc3NlcyB0aHJvdWdoIHRoZSBmaXJzdCBuIGJ5dGVzLiAqL1xuICBjb25zdCBuZXdNYXhTaXplVHJhbnNmb3JtOiAobjogbnVtYmVyKSA9PiBUcmFuc2Zvcm1PcHRpb25zID0gbiA9PiB7XG4gICAgbGV0IG1pc3NpbmdCeXRlcyA9IG47XG4gICAgcmV0dXJuIHtcbiAgICAgIHRyYW5zZm9ybShjaHVuaywgZW5jb2RpbmcsIGNhbGxiYWNrKSB7XG4gICAgICAgIC8vIEdDUyBtYXkgbm90IGhvbm9yIHRoZSBSYW5nZSBoZWFkZXIgZm9yIHNtYWxsIGZpbGVzXG4gICAgICAgIGlmIChjaHVuay5sZW5ndGggPCBtaXNzaW5nQnl0ZXMpIHtcbiAgICAgICAgICB0aGlzLnB1c2goY2h1bmspO1xuICAgICAgICAgIG1pc3NpbmdCeXRlcyAtPSBjaHVuay5sZW5ndGg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5wdXNoKGNodW5rLnNsaWNlKDAsIG1pc3NpbmdCeXRlcykpO1xuICAgICAgICAgIHRoaXMuZW1pdCgnZW5kJyk7XG4gICAgICAgIH1cbiAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgIH1cbiAgICB9IGFzIFRyYW5zZm9ybU9wdGlvbnM7XG4gIH07XG5cbiAgY29uc3QgcmVzdWx0ID1cbiAgICBtYXhEb3dubG9hZFNpemVCeXRlcyAhPT0gdW5kZWZpbmVkXG4gICAgICA/IG5ldyBUcmFuc2Zvcm0obmV3TWF4U2l6ZVRyYW5zZm9ybShtYXhEb3dubG9hZFNpemVCeXRlcykpXG4gICAgICA6IG5ldyBQYXNzVGhyb3VnaCgpO1xuXG4gIHJlZi5zdG9yYWdlXG4gICAgLm1ha2VSZXF1ZXN0V2l0aFRva2VucyhyZXF1ZXN0SW5mbywgbmV3U3RyZWFtQ29ubmVjdGlvbilcbiAgICAudGhlbihzdHJlYW0gPT4gKHN0cmVhbSBhcyBOb2RlSlMuUmVhZGFibGVTdHJlYW0pLnBpcGUocmVzdWx0KSlcbiAgICAuY2F0Y2goZSA9PiByZXN1bHQuZGVzdHJveShlKSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogVXBsb2FkcyBkYXRhIHRvIHRoaXMgb2JqZWN0J3MgbG9jYXRpb24uXG4gKiBUaGUgdXBsb2FkIGlzIG5vdCByZXN1bWFibGUuXG4gKlxuICogQHBhcmFtIHJlZiAtIFN0b3JhZ2VSZWZlcmVuY2Ugd2hlcmUgZGF0YSBzaG91bGQgYmUgdXBsb2FkZWQuXG4gKiBAcGFyYW0gZGF0YSAtIFRoZSBkYXRhIHRvIHVwbG9hZC5cbiAqIEBwYXJhbSBtZXRhZGF0YSAtIE1ldGFkYXRhIGZvciB0aGUgbmV3bHkgdXBsb2FkZWQgZGF0YS5cbiAqIEByZXR1cm5zIEEgUHJvbWlzZSBjb250YWluaW5nIGFuIFVwbG9hZFJlc3VsdFxuICovXG5leHBvcnQgZnVuY3Rpb24gdXBsb2FkQnl0ZXMoXG4gIHJlZjogUmVmZXJlbmNlLFxuICBkYXRhOiBCbG9iIHwgVWludDhBcnJheSB8IEFycmF5QnVmZmVyLFxuICBtZXRhZGF0YT86IE1ldGFkYXRhXG4pOiBQcm9taXNlPFVwbG9hZFJlc3VsdD4ge1xuICByZWYuX3Rocm93SWZSb290KCd1cGxvYWRCeXRlcycpO1xuICBjb25zdCByZXF1ZXN0SW5mbyA9IG11bHRpcGFydFVwbG9hZChcbiAgICByZWYuc3RvcmFnZSxcbiAgICByZWYuX2xvY2F0aW9uLFxuICAgIGdldE1hcHBpbmdzKCksXG4gICAgbmV3IEZic0Jsb2IoZGF0YSwgdHJ1ZSksXG4gICAgbWV0YWRhdGFcbiAgKTtcbiAgcmV0dXJuIHJlZi5zdG9yYWdlXG4gICAgLm1ha2VSZXF1ZXN0V2l0aFRva2VucyhyZXF1ZXN0SW5mbywgbmV3VGV4dENvbm5lY3Rpb24pXG4gICAgLnRoZW4oZmluYWxNZXRhZGF0YSA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBtZXRhZGF0YTogZmluYWxNZXRhZGF0YSxcbiAgICAgICAgcmVmXG4gICAgICB9O1xuICAgIH0pO1xufVxuXG4vKipcbiAqIFVwbG9hZHMgZGF0YSB0byB0aGlzIG9iamVjdCdzIGxvY2F0aW9uLlxuICogVGhlIHVwbG9hZCBjYW4gYmUgcGF1c2VkIGFuZCByZXN1bWVkLCBhbmQgZXhwb3NlcyBwcm9ncmVzcyB1cGRhdGVzLlxuICogQHB1YmxpY1xuICogQHBhcmFtIHJlZiAtIFN0b3JhZ2VSZWZlcmVuY2Ugd2hlcmUgZGF0YSBzaG91bGQgYmUgdXBsb2FkZWQuXG4gKiBAcGFyYW0gZGF0YSAtIFRoZSBkYXRhIHRvIHVwbG9hZC5cbiAqIEBwYXJhbSBtZXRhZGF0YSAtIE1ldGFkYXRhIGZvciB0aGUgbmV3bHkgdXBsb2FkZWQgZGF0YS5cbiAqIEByZXR1cm5zIEFuIFVwbG9hZFRhc2tcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVwbG9hZEJ5dGVzUmVzdW1hYmxlKFxuICByZWY6IFJlZmVyZW5jZSxcbiAgZGF0YTogQmxvYiB8IFVpbnQ4QXJyYXkgfCBBcnJheUJ1ZmZlcixcbiAgbWV0YWRhdGE/OiBNZXRhZGF0YVxuKTogVXBsb2FkVGFzayB7XG4gIHJlZi5fdGhyb3dJZlJvb3QoJ3VwbG9hZEJ5dGVzUmVzdW1hYmxlJyk7XG4gIHJldHVybiBuZXcgVXBsb2FkVGFzayhyZWYsIG5ldyBGYnNCbG9iKGRhdGEpLCBtZXRhZGF0YSk7XG59XG5cbi8qKlxuICogVXBsb2FkcyBhIHN0cmluZyB0byB0aGlzIG9iamVjdCdzIGxvY2F0aW9uLlxuICogVGhlIHVwbG9hZCBpcyBub3QgcmVzdW1hYmxlLlxuICogQHB1YmxpY1xuICogQHBhcmFtIHJlZiAtIFN0b3JhZ2VSZWZlcmVuY2Ugd2hlcmUgc3RyaW5nIHNob3VsZCBiZSB1cGxvYWRlZC5cbiAqIEBwYXJhbSB2YWx1ZSAtIFRoZSBzdHJpbmcgdG8gdXBsb2FkLlxuICogQHBhcmFtIGZvcm1hdCAtIFRoZSBmb3JtYXQgb2YgdGhlIHN0cmluZyB0byB1cGxvYWQuXG4gKiBAcGFyYW0gbWV0YWRhdGEgLSBNZXRhZGF0YSBmb3IgdGhlIG5ld2x5IHVwbG9hZGVkIHN0cmluZy5cbiAqIEByZXR1cm5zIEEgUHJvbWlzZSBjb250YWluaW5nIGFuIFVwbG9hZFJlc3VsdFxuICovXG5leHBvcnQgZnVuY3Rpb24gdXBsb2FkU3RyaW5nKFxuICByZWY6IFJlZmVyZW5jZSxcbiAgdmFsdWU6IHN0cmluZyxcbiAgZm9ybWF0OiBTdHJpbmdGb3JtYXQgPSBTdHJpbmdGb3JtYXQuUkFXLFxuICBtZXRhZGF0YT86IE1ldGFkYXRhXG4pOiBQcm9taXNlPFVwbG9hZFJlc3VsdD4ge1xuICByZWYuX3Rocm93SWZSb290KCd1cGxvYWRTdHJpbmcnKTtcbiAgY29uc3QgZGF0YSA9IGRhdGFGcm9tU3RyaW5nKGZvcm1hdCwgdmFsdWUpO1xuICBjb25zdCBtZXRhZGF0YUNsb25lID0geyAuLi5tZXRhZGF0YSB9IGFzIE1ldGFkYXRhO1xuICBpZiAobWV0YWRhdGFDbG9uZVsnY29udGVudFR5cGUnXSA9PSBudWxsICYmIGRhdGEuY29udGVudFR5cGUgIT0gbnVsbCkge1xuICAgIG1ldGFkYXRhQ2xvbmVbJ2NvbnRlbnRUeXBlJ10gPSBkYXRhLmNvbnRlbnRUeXBlITtcbiAgfVxuICByZXR1cm4gdXBsb2FkQnl0ZXMocmVmLCBkYXRhLmRhdGEsIG1ldGFkYXRhQ2xvbmUpO1xufVxuXG4vKipcbiAqIExpc3QgYWxsIGl0ZW1zIChmaWxlcykgYW5kIHByZWZpeGVzIChmb2xkZXJzKSB1bmRlciB0aGlzIHN0b3JhZ2UgcmVmZXJlbmNlLlxuICpcbiAqIFRoaXMgaXMgYSBoZWxwZXIgbWV0aG9kIGZvciBjYWxsaW5nIGxpc3QoKSByZXBlYXRlZGx5IHVudGlsIHRoZXJlIGFyZVxuICogbm8gbW9yZSByZXN1bHRzLiBUaGUgZGVmYXVsdCBwYWdpbmF0aW9uIHNpemUgaXMgMTAwMC5cbiAqXG4gKiBOb3RlOiBUaGUgcmVzdWx0cyBtYXkgbm90IGJlIGNvbnNpc3RlbnQgaWYgb2JqZWN0cyBhcmUgY2hhbmdlZCB3aGlsZSB0aGlzXG4gKiBvcGVyYXRpb24gaXMgcnVubmluZy5cbiAqXG4gKiBXYXJuaW5nOiBsaXN0QWxsIG1heSBwb3RlbnRpYWxseSBjb25zdW1lIHRvbyBtYW55IHJlc291cmNlcyBpZiB0aGVyZSBhcmVcbiAqIHRvbyBtYW55IHJlc3VsdHMuXG4gKiBAcHVibGljXG4gKiBAcGFyYW0gcmVmIC0gU3RvcmFnZVJlZmVyZW5jZSB0byBnZXQgbGlzdCBmcm9tLlxuICpcbiAqIEByZXR1cm5zIEEgUHJvbWlzZSB0aGF0IHJlc29sdmVzIHdpdGggYWxsIHRoZSBpdGVtcyBhbmQgcHJlZml4ZXMgdW5kZXJcbiAqICAgICAgdGhlIGN1cnJlbnQgc3RvcmFnZSByZWZlcmVuY2UuIGBwcmVmaXhlc2AgY29udGFpbnMgcmVmZXJlbmNlcyB0b1xuICogICAgICBzdWItZGlyZWN0b3JpZXMgYW5kIGBpdGVtc2AgY29udGFpbnMgcmVmZXJlbmNlcyB0byBvYmplY3RzIGluIHRoaXNcbiAqICAgICAgZm9sZGVyLiBgbmV4dFBhZ2VUb2tlbmAgaXMgbmV2ZXIgcmV0dXJuZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsaXN0QWxsKHJlZjogUmVmZXJlbmNlKTogUHJvbWlzZTxMaXN0UmVzdWx0PiB7XG4gIGNvbnN0IGFjY3VtdWxhdG9yOiBMaXN0UmVzdWx0ID0ge1xuICAgIHByZWZpeGVzOiBbXSxcbiAgICBpdGVtczogW11cbiAgfTtcbiAgcmV0dXJuIGxpc3RBbGxIZWxwZXIocmVmLCBhY2N1bXVsYXRvcikudGhlbigoKSA9PiBhY2N1bXVsYXRvcik7XG59XG5cbi8qKlxuICogU2VwYXJhdGVkIGZyb20gbGlzdEFsbCBiZWNhdXNlIGFzeW5jIGZ1bmN0aW9ucyBjYW4ndCB1c2UgXCJhcmd1bWVudHNcIi5cbiAqIEBwYXJhbSByZWZcbiAqIEBwYXJhbSBhY2N1bXVsYXRvclxuICogQHBhcmFtIHBhZ2VUb2tlblxuICovXG5hc3luYyBmdW5jdGlvbiBsaXN0QWxsSGVscGVyKFxuICByZWY6IFJlZmVyZW5jZSxcbiAgYWNjdW11bGF0b3I6IExpc3RSZXN1bHQsXG4gIHBhZ2VUb2tlbj86IHN0cmluZ1xuKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IG9wdDogTGlzdE9wdGlvbnMgPSB7XG4gICAgLy8gbWF4UmVzdWx0cyBpcyAxMDAwIGJ5IGRlZmF1bHQuXG4gICAgcGFnZVRva2VuXG4gIH07XG4gIGNvbnN0IG5leHRQYWdlID0gYXdhaXQgbGlzdChyZWYsIG9wdCk7XG4gIGFjY3VtdWxhdG9yLnByZWZpeGVzLnB1c2goLi4ubmV4dFBhZ2UucHJlZml4ZXMpO1xuICBhY2N1bXVsYXRvci5pdGVtcy5wdXNoKC4uLm5leHRQYWdlLml0ZW1zKTtcbiAgaWYgKG5leHRQYWdlLm5leHRQYWdlVG9rZW4gIT0gbnVsbCkge1xuICAgIGF3YWl0IGxpc3RBbGxIZWxwZXIocmVmLCBhY2N1bXVsYXRvciwgbmV4dFBhZ2UubmV4dFBhZ2VUb2tlbik7XG4gIH1cbn1cblxuLyoqXG4gKiBMaXN0IGl0ZW1zIChmaWxlcykgYW5kIHByZWZpeGVzIChmb2xkZXJzKSB1bmRlciB0aGlzIHN0b3JhZ2UgcmVmZXJlbmNlLlxuICpcbiAqIExpc3QgQVBJIGlzIG9ubHkgYXZhaWxhYmxlIGZvciBGaXJlYmFzZSBSdWxlcyBWZXJzaW9uIDIuXG4gKlxuICogR0NTIGlzIGEga2V5LWJsb2Igc3RvcmUuIEZpcmViYXNlIFN0b3JhZ2UgaW1wb3NlcyB0aGUgc2VtYW50aWMgb2YgJy8nXG4gKiBkZWxpbWl0ZWQgZm9sZGVyIHN0cnVjdHVyZS5cbiAqIFJlZmVyIHRvIEdDUydzIExpc3QgQVBJIGlmIHlvdSB3YW50IHRvIGxlYXJuIG1vcmUuXG4gKlxuICogVG8gYWRoZXJlIHRvIEZpcmViYXNlIFJ1bGVzJ3MgU2VtYW50aWNzLCBGaXJlYmFzZSBTdG9yYWdlIGRvZXMgbm90XG4gKiBzdXBwb3J0IG9iamVjdHMgd2hvc2UgcGF0aHMgZW5kIHdpdGggXCIvXCIgb3IgY29udGFpbiB0d28gY29uc2VjdXRpdmVcbiAqIFwiL1wicy4gRmlyZWJhc2UgU3RvcmFnZSBMaXN0IEFQSSB3aWxsIGZpbHRlciB0aGVzZSB1bnN1cHBvcnRlZCBvYmplY3RzLlxuICogbGlzdCgpIG1heSBmYWlsIGlmIHRoZXJlIGFyZSB0b28gbWFueSB1bnN1cHBvcnRlZCBvYmplY3RzIGluIHRoZSBidWNrZXQuXG4gKiBAcHVibGljXG4gKlxuICogQHBhcmFtIHJlZiAtIFN0b3JhZ2VSZWZlcmVuY2UgdG8gZ2V0IGxpc3QgZnJvbS5cbiAqIEBwYXJhbSBvcHRpb25zIC0gU2VlIExpc3RPcHRpb25zIGZvciBkZXRhaWxzLlxuICogQHJldHVybnMgQSBQcm9taXNlIHRoYXQgcmVzb2x2ZXMgd2l0aCB0aGUgaXRlbXMgYW5kIHByZWZpeGVzLlxuICogICAgICBgcHJlZml4ZXNgIGNvbnRhaW5zIHJlZmVyZW5jZXMgdG8gc3ViLWZvbGRlcnMgYW5kIGBpdGVtc2BcbiAqICAgICAgY29udGFpbnMgcmVmZXJlbmNlcyB0byBvYmplY3RzIGluIHRoaXMgZm9sZGVyLiBgbmV4dFBhZ2VUb2tlbmBcbiAqICAgICAgY2FuIGJlIHVzZWQgdG8gZ2V0IHRoZSByZXN0IG9mIHRoZSByZXN1bHRzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbGlzdChcbiAgcmVmOiBSZWZlcmVuY2UsXG4gIG9wdGlvbnM/OiBMaXN0T3B0aW9ucyB8IG51bGxcbik6IFByb21pc2U8TGlzdFJlc3VsdD4ge1xuICBpZiAob3B0aW9ucyAhPSBudWxsKSB7XG4gICAgaWYgKHR5cGVvZiBvcHRpb25zLm1heFJlc3VsdHMgPT09ICdudW1iZXInKSB7XG4gICAgICB2YWxpZGF0ZU51bWJlcihcbiAgICAgICAgJ29wdGlvbnMubWF4UmVzdWx0cycsXG4gICAgICAgIC8qIG1pblZhbHVlPSAqLyAxLFxuICAgICAgICAvKiBtYXhWYWx1ZT0gKi8gMTAwMCxcbiAgICAgICAgb3B0aW9ucy5tYXhSZXN1bHRzXG4gICAgICApO1xuICAgIH1cbiAgfVxuICBjb25zdCBvcCA9IG9wdGlvbnMgfHwge307XG4gIGNvbnN0IHJlcXVlc3RJbmZvID0gcmVxdWVzdHNMaXN0KFxuICAgIHJlZi5zdG9yYWdlLFxuICAgIHJlZi5fbG9jYXRpb24sXG4gICAgLypkZWxpbWl0ZXI9ICovICcvJyxcbiAgICBvcC5wYWdlVG9rZW4sXG4gICAgb3AubWF4UmVzdWx0c1xuICApO1xuICByZXR1cm4gcmVmLnN0b3JhZ2UubWFrZVJlcXVlc3RXaXRoVG9rZW5zKHJlcXVlc3RJbmZvLCBuZXdUZXh0Q29ubmVjdGlvbik7XG59XG5cbi8qKlxuICogQSBgUHJvbWlzZWAgdGhhdCByZXNvbHZlcyB3aXRoIHRoZSBtZXRhZGF0YSBmb3IgdGhpcyBvYmplY3QuIElmIHRoaXNcbiAqIG9iamVjdCBkb2Vzbid0IGV4aXN0IG9yIG1ldGFkYXRhIGNhbm5vdCBiZSByZXRyZWl2ZWQsIHRoZSBwcm9taXNlIGlzXG4gKiByZWplY3RlZC5cbiAqIEBwdWJsaWNcbiAqIEBwYXJhbSByZWYgLSBTdG9yYWdlUmVmZXJlbmNlIHRvIGdldCBtZXRhZGF0YSBmcm9tLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWV0YWRhdGEocmVmOiBSZWZlcmVuY2UpOiBQcm9taXNlPE1ldGFkYXRhPiB7XG4gIHJlZi5fdGhyb3dJZlJvb3QoJ2dldE1ldGFkYXRhJyk7XG4gIGNvbnN0IHJlcXVlc3RJbmZvID0gcmVxdWVzdHNHZXRNZXRhZGF0YShcbiAgICByZWYuc3RvcmFnZSxcbiAgICByZWYuX2xvY2F0aW9uLFxuICAgIGdldE1hcHBpbmdzKClcbiAgKTtcbiAgcmV0dXJuIHJlZi5zdG9yYWdlLm1ha2VSZXF1ZXN0V2l0aFRva2VucyhyZXF1ZXN0SW5mbywgbmV3VGV4dENvbm5lY3Rpb24pO1xufVxuXG4vKipcbiAqIFVwZGF0ZXMgdGhlIG1ldGFkYXRhIGZvciB0aGlzIG9iamVjdC5cbiAqIEBwdWJsaWNcbiAqIEBwYXJhbSByZWYgLSBTdG9yYWdlUmVmZXJlbmNlIHRvIHVwZGF0ZSBtZXRhZGF0YSBmb3IuXG4gKiBAcGFyYW0gbWV0YWRhdGEgLSBUaGUgbmV3IG1ldGFkYXRhIGZvciB0aGUgb2JqZWN0LlxuICogICAgIE9ubHkgdmFsdWVzIHRoYXQgaGF2ZSBiZWVuIGV4cGxpY2l0bHkgc2V0IHdpbGwgYmUgY2hhbmdlZC4gRXhwbGljaXRseVxuICogICAgIHNldHRpbmcgYSB2YWx1ZSB0byBudWxsIHdpbGwgcmVtb3ZlIHRoZSBtZXRhZGF0YS5cbiAqIEByZXR1cm5zIEEgYFByb21pc2VgIHRoYXQgcmVzb2x2ZXNcbiAqICAgICB3aXRoIHRoZSBuZXcgbWV0YWRhdGEgZm9yIHRoaXMgb2JqZWN0LlxuICogICAgIFNlZSBgZmlyZWJhc2VTdG9yYWdlLlJlZmVyZW5jZS5wcm90b3R5cGUuZ2V0TWV0YWRhdGFgXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVNZXRhZGF0YShcbiAgcmVmOiBSZWZlcmVuY2UsXG4gIG1ldGFkYXRhOiBQYXJ0aWFsPE1ldGFkYXRhPlxuKTogUHJvbWlzZTxNZXRhZGF0YT4ge1xuICByZWYuX3Rocm93SWZSb290KCd1cGRhdGVNZXRhZGF0YScpO1xuICBjb25zdCByZXF1ZXN0SW5mbyA9IHJlcXVlc3RzVXBkYXRlTWV0YWRhdGEoXG4gICAgcmVmLnN0b3JhZ2UsXG4gICAgcmVmLl9sb2NhdGlvbixcbiAgICBtZXRhZGF0YSxcbiAgICBnZXRNYXBwaW5ncygpXG4gICk7XG4gIHJldHVybiByZWYuc3RvcmFnZS5tYWtlUmVxdWVzdFdpdGhUb2tlbnMocmVxdWVzdEluZm8sIG5ld1RleHRDb25uZWN0aW9uKTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBkb3dubG9hZCBVUkwgZm9yIHRoZSBnaXZlbiBSZWZlcmVuY2UuXG4gKiBAcHVibGljXG4gKiBAcmV0dXJucyBBIGBQcm9taXNlYCB0aGF0IHJlc29sdmVzIHdpdGggdGhlIGRvd25sb2FkXG4gKiAgICAgVVJMIGZvciB0aGlzIG9iamVjdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldERvd25sb2FkVVJMKHJlZjogUmVmZXJlbmNlKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgcmVmLl90aHJvd0lmUm9vdCgnZ2V0RG93bmxvYWRVUkwnKTtcbiAgY29uc3QgcmVxdWVzdEluZm8gPSByZXF1ZXN0c0dldERvd25sb2FkVXJsKFxuICAgIHJlZi5zdG9yYWdlLFxuICAgIHJlZi5fbG9jYXRpb24sXG4gICAgZ2V0TWFwcGluZ3MoKVxuICApO1xuICByZXR1cm4gcmVmLnN0b3JhZ2VcbiAgICAubWFrZVJlcXVlc3RXaXRoVG9rZW5zKHJlcXVlc3RJbmZvLCBuZXdUZXh0Q29ubmVjdGlvbilcbiAgICAudGhlbih1cmwgPT4ge1xuICAgICAgaWYgKHVybCA9PT0gbnVsbCkge1xuICAgICAgICB0aHJvdyBub0Rvd25sb2FkVVJMKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdXJsO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIERlbGV0ZXMgdGhlIG9iamVjdCBhdCB0aGlzIGxvY2F0aW9uLlxuICogQHB1YmxpY1xuICogQHBhcmFtIHJlZiAtIFN0b3JhZ2VSZWZlcmVuY2UgZm9yIG9iamVjdCB0byBkZWxldGUuXG4gKiBAcmV0dXJucyBBIGBQcm9taXNlYCB0aGF0IHJlc29sdmVzIGlmIHRoZSBkZWxldGlvbiBzdWNjZWVkcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlbGV0ZU9iamVjdChyZWY6IFJlZmVyZW5jZSk6IFByb21pc2U8dm9pZD4ge1xuICByZWYuX3Rocm93SWZSb290KCdkZWxldGVPYmplY3QnKTtcbiAgY29uc3QgcmVxdWVzdEluZm8gPSByZXF1ZXN0c0RlbGV0ZU9iamVjdChyZWYuc3RvcmFnZSwgcmVmLl9sb2NhdGlvbik7XG4gIHJldHVybiByZWYuc3RvcmFnZS5tYWtlUmVxdWVzdFdpdGhUb2tlbnMocmVxdWVzdEluZm8sIG5ld1RleHRDb25uZWN0aW9uKTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHJlZmVyZW5jZSBmb3Igb2JqZWN0IG9idGFpbmVkIGJ5IGFwcGVuZGluZyBgY2hpbGRQYXRoYCB0byBgcmVmYC5cbiAqXG4gKiBAcGFyYW0gcmVmIC0gU3RvcmFnZVJlZmVyZW5jZSB0byBnZXQgY2hpbGQgb2YuXG4gKiBAcGFyYW0gY2hpbGRQYXRoIC0gQ2hpbGQgcGF0aCBmcm9tIHByb3ZpZGVkIHJlZi5cbiAqIEByZXR1cm5zIEEgcmVmZXJlbmNlIHRvIHRoZSBvYmplY3Qgb2J0YWluZWQgYnlcbiAqIGFwcGVuZGluZyBjaGlsZFBhdGgsIHJlbW92aW5nIGFueSBkdXBsaWNhdGUsIGJlZ2lubmluZywgb3IgdHJhaWxpbmdcbiAqIHNsYXNoZXMuXG4gKlxuICovXG5leHBvcnQgZnVuY3Rpb24gX2dldENoaWxkKHJlZjogUmVmZXJlbmNlLCBjaGlsZFBhdGg6IHN0cmluZyk6IFJlZmVyZW5jZSB7XG4gIGNvbnN0IG5ld1BhdGggPSBjaGlsZChyZWYuX2xvY2F0aW9uLnBhdGgsIGNoaWxkUGF0aCk7XG4gIGNvbnN0IGxvY2F0aW9uID0gbmV3IExvY2F0aW9uKHJlZi5fbG9jYXRpb24uYnVja2V0LCBuZXdQYXRoKTtcbiAgcmV0dXJuIG5ldyBSZWZlcmVuY2UocmVmLnN0b3JhZ2UsIGxvY2F0aW9uKTtcbn1cbiIsICIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBMb2NhdGlvbiB9IGZyb20gJy4vaW1wbGVtZW50YXRpb24vbG9jYXRpb24nO1xuaW1wb3J0IHsgRmFpbFJlcXVlc3QgfSBmcm9tICcuL2ltcGxlbWVudGF0aW9uL2ZhaWxyZXF1ZXN0JztcbmltcG9ydCB7IFJlcXVlc3QsIG1ha2VSZXF1ZXN0IH0gZnJvbSAnLi9pbXBsZW1lbnRhdGlvbi9yZXF1ZXN0JztcbmltcG9ydCB7IFJlcXVlc3RJbmZvIH0gZnJvbSAnLi9pbXBsZW1lbnRhdGlvbi9yZXF1ZXN0aW5mbyc7XG5pbXBvcnQgeyBSZWZlcmVuY2UsIF9nZXRDaGlsZCB9IGZyb20gJy4vcmVmZXJlbmNlJztcbmltcG9ydCB7IFByb3ZpZGVyIH0gZnJvbSAnQGZpcmViYXNlL2NvbXBvbmVudCc7XG5pbXBvcnQgeyBGaXJlYmFzZUF1dGhJbnRlcm5hbE5hbWUgfSBmcm9tICdAZmlyZWJhc2UvYXV0aC1pbnRlcm9wLXR5cGVzJztcbmltcG9ydCB7IEFwcENoZWNrSW50ZXJuYWxDb21wb25lbnROYW1lIH0gZnJvbSAnQGZpcmViYXNlL2FwcC1jaGVjay1pbnRlcm9wLXR5cGVzJztcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXNcbmltcG9ydCB7IEZpcmViYXNlQXBwLCBGaXJlYmFzZU9wdGlvbnMgfSBmcm9tICdAZmlyZWJhc2UvYXBwJztcbmltcG9ydCB7XG4gIENPTkZJR19TVE9SQUdFX0JVQ0tFVF9LRVksXG4gIERFRkFVTFRfSE9TVCxcbiAgREVGQVVMVF9NQVhfT1BFUkFUSU9OX1JFVFJZX1RJTUUsXG4gIERFRkFVTFRfTUFYX1VQTE9BRF9SRVRSWV9USU1FXG59IGZyb20gJy4vaW1wbGVtZW50YXRpb24vY29uc3RhbnRzJztcbmltcG9ydCB7XG4gIGludmFsaWRBcmd1bWVudCxcbiAgYXBwRGVsZXRlZCxcbiAgbm9EZWZhdWx0QnVja2V0XG59IGZyb20gJy4vaW1wbGVtZW50YXRpb24vZXJyb3InO1xuaW1wb3J0IHsgdmFsaWRhdGVOdW1iZXIgfSBmcm9tICcuL2ltcGxlbWVudGF0aW9uL3R5cGUnO1xuaW1wb3J0IHsgRmlyZWJhc2VTdG9yYWdlIH0gZnJvbSAnLi9wdWJsaWMtdHlwZXMnO1xuaW1wb3J0IHsgY3JlYXRlTW9ja1VzZXJUb2tlbiwgRW11bGF0b3JNb2NrVG9rZW5PcHRpb25zIH0gZnJvbSAnQGZpcmViYXNlL3V0aWwnO1xuaW1wb3J0IHsgQ29ubmVjdGlvbiwgQ29ubmVjdGlvblR5cGUgfSBmcm9tICcuL2ltcGxlbWVudGF0aW9uL2Nvbm5lY3Rpb24nO1xuXG5leHBvcnQgZnVuY3Rpb24gaXNVcmwocGF0aD86IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gL15bQS1aYS16XSs6XFwvXFwvLy50ZXN0KHBhdGggYXMgc3RyaW5nKTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgZmlyZWJhc2VTdG9yYWdlLlJlZmVyZW5jZSBmb3IgdGhlIGdpdmVuIHVybC5cbiAqL1xuZnVuY3Rpb24gcmVmRnJvbVVSTChzZXJ2aWNlOiBGaXJlYmFzZVN0b3JhZ2VJbXBsLCB1cmw6IHN0cmluZyk6IFJlZmVyZW5jZSB7XG4gIHJldHVybiBuZXcgUmVmZXJlbmNlKHNlcnZpY2UsIHVybCk7XG59XG5cbi8qKlxuICogUmV0dXJucyBhIGZpcmViYXNlU3RvcmFnZS5SZWZlcmVuY2UgZm9yIHRoZSBnaXZlbiBwYXRoIGluIHRoZSBkZWZhdWx0XG4gKiBidWNrZXQuXG4gKi9cbmZ1bmN0aW9uIHJlZkZyb21QYXRoKFxuICByZWY6IEZpcmViYXNlU3RvcmFnZUltcGwgfCBSZWZlcmVuY2UsXG4gIHBhdGg/OiBzdHJpbmdcbik6IFJlZmVyZW5jZSB7XG4gIGlmIChyZWYgaW5zdGFuY2VvZiBGaXJlYmFzZVN0b3JhZ2VJbXBsKSB7XG4gICAgY29uc3Qgc2VydmljZSA9IHJlZjtcbiAgICBpZiAoc2VydmljZS5fYnVja2V0ID09IG51bGwpIHtcbiAgICAgIHRocm93IG5vRGVmYXVsdEJ1Y2tldCgpO1xuICAgIH1cbiAgICBjb25zdCByZWZlcmVuY2UgPSBuZXcgUmVmZXJlbmNlKHNlcnZpY2UsIHNlcnZpY2UuX2J1Y2tldCEpO1xuICAgIGlmIChwYXRoICE9IG51bGwpIHtcbiAgICAgIHJldHVybiByZWZGcm9tUGF0aChyZWZlcmVuY2UsIHBhdGgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcmVmZXJlbmNlO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAvLyByZWYgaXMgYSBSZWZlcmVuY2VcbiAgICBpZiAocGF0aCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gX2dldENoaWxkKHJlZiwgcGF0aCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiByZWY7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogUmV0dXJucyBhIHN0b3JhZ2UgUmVmZXJlbmNlIGZvciB0aGUgZ2l2ZW4gdXJsLlxuICogQHBhcmFtIHN0b3JhZ2UgLSBgU3RvcmFnZWAgaW5zdGFuY2UuXG4gKiBAcGFyYW0gdXJsIC0gVVJMLiBJZiBlbXB0eSwgcmV0dXJucyByb290IHJlZmVyZW5jZS5cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlZihzdG9yYWdlOiBGaXJlYmFzZVN0b3JhZ2VJbXBsLCB1cmw/OiBzdHJpbmcpOiBSZWZlcmVuY2U7XG4vKipcbiAqIFJldHVybnMgYSBzdG9yYWdlIFJlZmVyZW5jZSBmb3IgdGhlIGdpdmVuIHBhdGggaW4gdGhlXG4gKiBkZWZhdWx0IGJ1Y2tldC5cbiAqIEBwYXJhbSBzdG9yYWdlT3JSZWYgLSBgU3RvcmFnZWAgc2VydmljZSBvciBzdG9yYWdlIGBSZWZlcmVuY2VgLlxuICogQHBhcmFtIHBhdGhPclVybFN0b3JhZ2UgLSBwYXRoLiBJZiBlbXB0eSwgcmV0dXJucyByb290IHJlZmVyZW5jZSAoaWYgU3RvcmFnZVxuICogaW5zdGFuY2UgcHJvdmlkZWQpIG9yIHJldHVybnMgc2FtZSByZWZlcmVuY2UgKGlmIFJlZmVyZW5jZSBwcm92aWRlZCkuXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZWYoXG4gIHN0b3JhZ2VPclJlZjogRmlyZWJhc2VTdG9yYWdlSW1wbCB8IFJlZmVyZW5jZSxcbiAgcGF0aD86IHN0cmluZ1xuKTogUmVmZXJlbmNlO1xuZXhwb3J0IGZ1bmN0aW9uIHJlZihcbiAgc2VydmljZU9yUmVmOiBGaXJlYmFzZVN0b3JhZ2VJbXBsIHwgUmVmZXJlbmNlLFxuICBwYXRoT3JVcmw/OiBzdHJpbmdcbik6IFJlZmVyZW5jZSB8IG51bGwge1xuICBpZiAocGF0aE9yVXJsICYmIGlzVXJsKHBhdGhPclVybCkpIHtcbiAgICBpZiAoc2VydmljZU9yUmVmIGluc3RhbmNlb2YgRmlyZWJhc2VTdG9yYWdlSW1wbCkge1xuICAgICAgcmV0dXJuIHJlZkZyb21VUkwoc2VydmljZU9yUmVmLCBwYXRoT3JVcmwpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBpbnZhbGlkQXJndW1lbnQoXG4gICAgICAgICdUbyB1c2UgcmVmKHNlcnZpY2UsIHVybCksIHRoZSBmaXJzdCBhcmd1bWVudCBtdXN0IGJlIGEgU3RvcmFnZSBpbnN0YW5jZS4nXG4gICAgICApO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gcmVmRnJvbVBhdGgoc2VydmljZU9yUmVmLCBwYXRoT3JVcmwpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGV4dHJhY3RCdWNrZXQoXG4gIGhvc3Q6IHN0cmluZyxcbiAgY29uZmlnPzogRmlyZWJhc2VPcHRpb25zXG4pOiBMb2NhdGlvbiB8IG51bGwge1xuICBjb25zdCBidWNrZXRTdHJpbmcgPSBjb25maWc/LltDT05GSUdfU1RPUkFHRV9CVUNLRVRfS0VZXTtcbiAgaWYgKGJ1Y2tldFN0cmluZyA9PSBudWxsKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgcmV0dXJuIExvY2F0aW9uLm1ha2VGcm9tQnVja2V0U3BlYyhidWNrZXRTdHJpbmcsIGhvc3QpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY29ubmVjdFN0b3JhZ2VFbXVsYXRvcihcbiAgc3RvcmFnZTogRmlyZWJhc2VTdG9yYWdlSW1wbCxcbiAgaG9zdDogc3RyaW5nLFxuICBwb3J0OiBudW1iZXIsXG4gIG9wdGlvbnM6IHtcbiAgICBtb2NrVXNlclRva2VuPzogRW11bGF0b3JNb2NrVG9rZW5PcHRpb25zIHwgc3RyaW5nO1xuICB9ID0ge31cbik6IHZvaWQge1xuICBzdG9yYWdlLmhvc3QgPSBgJHtob3N0fToke3BvcnR9YDtcbiAgc3RvcmFnZS5fcHJvdG9jb2wgPSAnaHR0cCc7XG4gIGNvbnN0IHsgbW9ja1VzZXJUb2tlbiB9ID0gb3B0aW9ucztcbiAgaWYgKG1vY2tVc2VyVG9rZW4pIHtcbiAgICBzdG9yYWdlLl9vdmVycmlkZUF1dGhUb2tlbiA9XG4gICAgICB0eXBlb2YgbW9ja1VzZXJUb2tlbiA9PT0gJ3N0cmluZydcbiAgICAgICAgPyBtb2NrVXNlclRva2VuXG4gICAgICAgIDogY3JlYXRlTW9ja1VzZXJUb2tlbihtb2NrVXNlclRva2VuLCBzdG9yYWdlLmFwcC5vcHRpb25zLnByb2plY3RJZCk7XG4gIH1cbn1cblxuLyoqXG4gKiBBIHNlcnZpY2UgdGhhdCBwcm92aWRlcyBGaXJlYmFzZSBTdG9yYWdlIFJlZmVyZW5jZSBpbnN0YW5jZXMuXG4gKiBAcGFyYW0gb3B0X3VybCAtIGdzOi8vIHVybCB0byBhIGN1c3RvbSBTdG9yYWdlIEJ1Y2tldFxuICpcbiAqIEBpbnRlcm5hbFxuICovXG5leHBvcnQgY2xhc3MgRmlyZWJhc2VTdG9yYWdlSW1wbCBpbXBsZW1lbnRzIEZpcmViYXNlU3RvcmFnZSB7XG4gIF9idWNrZXQ6IExvY2F0aW9uIHwgbnVsbCA9IG51bGw7XG4gIC8qKlxuICAgKiBUaGlzIHN0cmluZyBjYW4gYmUgaW4gdGhlIGZvcm1hdHM6XG4gICAqIC0gaG9zdFxuICAgKiAtIGhvc3Q6cG9ydFxuICAgKi9cbiAgcHJpdmF0ZSBfaG9zdDogc3RyaW5nID0gREVGQVVMVF9IT1NUO1xuICBfcHJvdG9jb2w6IHN0cmluZyA9ICdodHRwcyc7XG4gIHByb3RlY3RlZCByZWFkb25seSBfYXBwSWQ6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIHJlYWRvbmx5IF9yZXF1ZXN0czogU2V0PFJlcXVlc3Q8dW5rbm93bj4+O1xuICBwcml2YXRlIF9kZWxldGVkOiBib29sZWFuID0gZmFsc2U7XG4gIHByaXZhdGUgX21heE9wZXJhdGlvblJldHJ5VGltZTogbnVtYmVyO1xuICBwcml2YXRlIF9tYXhVcGxvYWRSZXRyeVRpbWU6IG51bWJlcjtcbiAgX292ZXJyaWRlQXV0aFRva2VuPzogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIC8qKlxuICAgICAqIEZpcmViYXNlQXBwIGFzc29jaWF0ZWQgd2l0aCB0aGlzIFN0b3JhZ2VTZXJ2aWNlIGluc3RhbmNlLlxuICAgICAqL1xuICAgIHJlYWRvbmx5IGFwcDogRmlyZWJhc2VBcHAsXG4gICAgcmVhZG9ubHkgX2F1dGhQcm92aWRlcjogUHJvdmlkZXI8RmlyZWJhc2VBdXRoSW50ZXJuYWxOYW1lPixcbiAgICAvKipcbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICByZWFkb25seSBfYXBwQ2hlY2tQcm92aWRlcjogUHJvdmlkZXI8QXBwQ2hlY2tJbnRlcm5hbENvbXBvbmVudE5hbWU+LFxuICAgIC8qKlxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHJlYWRvbmx5IF91cmw/OiBzdHJpbmcsXG4gICAgcmVhZG9ubHkgX2ZpcmViYXNlVmVyc2lvbj86IHN0cmluZ1xuICApIHtcbiAgICB0aGlzLl9tYXhPcGVyYXRpb25SZXRyeVRpbWUgPSBERUZBVUxUX01BWF9PUEVSQVRJT05fUkVUUllfVElNRTtcbiAgICB0aGlzLl9tYXhVcGxvYWRSZXRyeVRpbWUgPSBERUZBVUxUX01BWF9VUExPQURfUkVUUllfVElNRTtcbiAgICB0aGlzLl9yZXF1ZXN0cyA9IG5ldyBTZXQoKTtcbiAgICBpZiAoX3VybCAhPSBudWxsKSB7XG4gICAgICB0aGlzLl9idWNrZXQgPSBMb2NhdGlvbi5tYWtlRnJvbUJ1Y2tldFNwZWMoX3VybCwgdGhpcy5faG9zdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2J1Y2tldCA9IGV4dHJhY3RCdWNrZXQodGhpcy5faG9zdCwgdGhpcy5hcHAub3B0aW9ucyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBob3N0IHN0cmluZyBmb3IgdGhpcyBzZXJ2aWNlLCBpbiB0aGUgZm9ybSBvZiBgaG9zdGAgb3JcbiAgICogYGhvc3Q6cG9ydGAuXG4gICAqL1xuICBnZXQgaG9zdCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9ob3N0O1xuICB9XG5cbiAgc2V0IGhvc3QoaG9zdDogc3RyaW5nKSB7XG4gICAgdGhpcy5faG9zdCA9IGhvc3Q7XG4gICAgaWYgKHRoaXMuX3VybCAhPSBudWxsKSB7XG4gICAgICB0aGlzLl9idWNrZXQgPSBMb2NhdGlvbi5tYWtlRnJvbUJ1Y2tldFNwZWModGhpcy5fdXJsLCBob3N0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fYnVja2V0ID0gZXh0cmFjdEJ1Y2tldChob3N0LCB0aGlzLmFwcC5vcHRpb25zKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVGhlIG1heGltdW0gdGltZSB0byByZXRyeSB1cGxvYWRzIGluIG1pbGxpc2Vjb25kcy5cbiAgICovXG4gIGdldCBtYXhVcGxvYWRSZXRyeVRpbWUoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fbWF4VXBsb2FkUmV0cnlUaW1lO1xuICB9XG5cbiAgc2V0IG1heFVwbG9hZFJldHJ5VGltZSh0aW1lOiBudW1iZXIpIHtcbiAgICB2YWxpZGF0ZU51bWJlcihcbiAgICAgICd0aW1lJyxcbiAgICAgIC8qIG1pblZhbHVlPSovIDAsXG4gICAgICAvKiBtYXhWYWx1ZT0gKi8gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZLFxuICAgICAgdGltZVxuICAgICk7XG4gICAgdGhpcy5fbWF4VXBsb2FkUmV0cnlUaW1lID0gdGltZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgbWF4aW11bSB0aW1lIHRvIHJldHJ5IG9wZXJhdGlvbnMgb3RoZXIgdGhhbiB1cGxvYWRzIG9yIGRvd25sb2FkcyBpblxuICAgKiBtaWxsaXNlY29uZHMuXG4gICAqL1xuICBnZXQgbWF4T3BlcmF0aW9uUmV0cnlUaW1lKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX21heE9wZXJhdGlvblJldHJ5VGltZTtcbiAgfVxuXG4gIHNldCBtYXhPcGVyYXRpb25SZXRyeVRpbWUodGltZTogbnVtYmVyKSB7XG4gICAgdmFsaWRhdGVOdW1iZXIoXG4gICAgICAndGltZScsXG4gICAgICAvKiBtaW5WYWx1ZT0qLyAwLFxuICAgICAgLyogbWF4VmFsdWU9ICovIE51bWJlci5QT1NJVElWRV9JTkZJTklUWSxcbiAgICAgIHRpbWVcbiAgICApO1xuICAgIHRoaXMuX21heE9wZXJhdGlvblJldHJ5VGltZSA9IHRpbWU7XG4gIH1cblxuICBhc3luYyBfZ2V0QXV0aFRva2VuKCk6IFByb21pc2U8c3RyaW5nIHwgbnVsbD4ge1xuICAgIGlmICh0aGlzLl9vdmVycmlkZUF1dGhUb2tlbikge1xuICAgICAgcmV0dXJuIHRoaXMuX292ZXJyaWRlQXV0aFRva2VuO1xuICAgIH1cbiAgICBjb25zdCBhdXRoID0gdGhpcy5fYXV0aFByb3ZpZGVyLmdldEltbWVkaWF0ZSh7IG9wdGlvbmFsOiB0cnVlIH0pO1xuICAgIGlmIChhdXRoKSB7XG4gICAgICBjb25zdCB0b2tlbkRhdGEgPSBhd2FpdCBhdXRoLmdldFRva2VuKCk7XG4gICAgICBpZiAodG9rZW5EYXRhICE9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0b2tlbkRhdGEuYWNjZXNzVG9rZW47XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgYXN5bmMgX2dldEFwcENoZWNrVG9rZW4oKTogUHJvbWlzZTxzdHJpbmcgfCBudWxsPiB7XG4gICAgY29uc3QgYXBwQ2hlY2sgPSB0aGlzLl9hcHBDaGVja1Byb3ZpZGVyLmdldEltbWVkaWF0ZSh7IG9wdGlvbmFsOiB0cnVlIH0pO1xuICAgIGlmIChhcHBDaGVjaykge1xuICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgYXBwQ2hlY2suZ2V0VG9rZW4oKTtcbiAgICAgIC8vIFRPRE86IFdoYXQgZG8gd2Ugd2FudCB0byBkbyBpZiB0aGVyZSBpcyBhbiBlcnJvciBnZXR0aW5nIHRoZSB0b2tlbj9cbiAgICAgIC8vIENvbnRleHQ6IGFwcENoZWNrLmdldFRva2VuKCkgd2lsbCBuZXZlciB0aHJvdyBldmVuIGlmIGFuIGVycm9yIGhhcHBlbmVkLiBJbiB0aGUgZXJyb3IgY2FzZSwgYSBkdW1teSB0b2tlbiB3aWxsIGJlXG4gICAgICAvLyByZXR1cm5lZCBhbG9uZyB3aXRoIGFuIGVycm9yIGZpZWxkIGRlc2NyaWJpbmcgdGhlIGVycm9yLiBJbiBnZW5lcmFsLCB3ZSBzaG91bGRuJ3QgY2FyZSBhYm91dCB0aGUgZXJyb3IgY29uZGl0aW9uIGFuZCBqdXN0IHVzZVxuICAgICAgLy8gdGhlIHRva2VuIChhY3R1YWwgb3IgZHVtbXkpIHRvIHNlbmQgcmVxdWVzdHMuXG4gICAgICByZXR1cm4gcmVzdWx0LnRva2VuO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdG9wIHJ1bm5pbmcgcmVxdWVzdHMgYW5kIHByZXZlbnQgbW9yZSBmcm9tIGJlaW5nIGNyZWF0ZWQuXG4gICAqL1xuICBfZGVsZXRlKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICghdGhpcy5fZGVsZXRlZCkge1xuICAgICAgdGhpcy5fZGVsZXRlZCA9IHRydWU7XG4gICAgICB0aGlzLl9yZXF1ZXN0cy5mb3JFYWNoKHJlcXVlc3QgPT4gcmVxdWVzdC5jYW5jZWwoKSk7XG4gICAgICB0aGlzLl9yZXF1ZXN0cy5jbGVhcigpO1xuICAgIH1cbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIG5ldyBmaXJlYmFzZVN0b3JhZ2UuUmVmZXJlbmNlIG9iamVjdCByZWZlcmVuY2luZyB0aGlzIFN0b3JhZ2VTZXJ2aWNlXG4gICAqIGF0IHRoZSBnaXZlbiBMb2NhdGlvbi5cbiAgICovXG4gIF9tYWtlU3RvcmFnZVJlZmVyZW5jZShsb2M6IExvY2F0aW9uKTogUmVmZXJlbmNlIHtcbiAgICByZXR1cm4gbmV3IFJlZmVyZW5jZSh0aGlzLCBsb2MpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSByZXF1ZXN0SW5mbyAtIEhUVFAgUmVxdWVzdEluZm8gb2JqZWN0XG4gICAqIEBwYXJhbSBhdXRoVG9rZW4gLSBGaXJlYmFzZSBhdXRoIHRva2VuXG4gICAqL1xuICBfbWFrZVJlcXVlc3Q8SSBleHRlbmRzIENvbm5lY3Rpb25UeXBlLCBPPihcbiAgICByZXF1ZXN0SW5mbzogUmVxdWVzdEluZm88SSwgTz4sXG4gICAgcmVxdWVzdEZhY3Rvcnk6ICgpID0+IENvbm5lY3Rpb248ST4sXG4gICAgYXV0aFRva2VuOiBzdHJpbmcgfCBudWxsLFxuICAgIGFwcENoZWNrVG9rZW46IHN0cmluZyB8IG51bGwsXG4gICAgcmV0cnkgPSB0cnVlXG4gICk6IFJlcXVlc3Q8Tz4ge1xuICAgIGlmICghdGhpcy5fZGVsZXRlZCkge1xuICAgICAgY29uc3QgcmVxdWVzdCA9IG1ha2VSZXF1ZXN0KFxuICAgICAgICByZXF1ZXN0SW5mbyxcbiAgICAgICAgdGhpcy5fYXBwSWQsXG4gICAgICAgIGF1dGhUb2tlbixcbiAgICAgICAgYXBwQ2hlY2tUb2tlbixcbiAgICAgICAgcmVxdWVzdEZhY3RvcnksXG4gICAgICAgIHRoaXMuX2ZpcmViYXNlVmVyc2lvbixcbiAgICAgICAgcmV0cnlcbiAgICAgICk7XG4gICAgICB0aGlzLl9yZXF1ZXN0cy5hZGQocmVxdWVzdCk7XG4gICAgICAvLyBSZXF1ZXN0IHJlbW92ZXMgaXRzZWxmIGZyb20gc2V0IHdoZW4gY29tcGxldGUuXG4gICAgICByZXF1ZXN0LmdldFByb21pc2UoKS50aGVuKFxuICAgICAgICAoKSA9PiB0aGlzLl9yZXF1ZXN0cy5kZWxldGUocmVxdWVzdCksXG4gICAgICAgICgpID0+IHRoaXMuX3JlcXVlc3RzLmRlbGV0ZShyZXF1ZXN0KVxuICAgICAgKTtcbiAgICAgIHJldHVybiByZXF1ZXN0O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbmV3IEZhaWxSZXF1ZXN0KGFwcERlbGV0ZWQoKSk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgbWFrZVJlcXVlc3RXaXRoVG9rZW5zPEkgZXh0ZW5kcyBDb25uZWN0aW9uVHlwZSwgTz4oXG4gICAgcmVxdWVzdEluZm86IFJlcXVlc3RJbmZvPEksIE8+LFxuICAgIHJlcXVlc3RGYWN0b3J5OiAoKSA9PiBDb25uZWN0aW9uPEk+XG4gICk6IFByb21pc2U8Tz4ge1xuICAgIGNvbnN0IFthdXRoVG9rZW4sIGFwcENoZWNrVG9rZW5dID0gYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgdGhpcy5fZ2V0QXV0aFRva2VuKCksXG4gICAgICB0aGlzLl9nZXRBcHBDaGVja1Rva2VuKClcbiAgICBdKTtcblxuICAgIHJldHVybiB0aGlzLl9tYWtlUmVxdWVzdChcbiAgICAgIHJlcXVlc3RJbmZvLFxuICAgICAgcmVxdWVzdEZhY3RvcnksXG4gICAgICBhdXRoVG9rZW4sXG4gICAgICBhcHBDaGVja1Rva2VuXG4gICAgKS5nZXRQcm9taXNlKCk7XG4gIH1cbn1cbiIsICIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4vKipcbiAqIFR5cGUgY29uc3RhbnQgZm9yIEZpcmViYXNlIFN0b3JhZ2UuXG4gKi9cbmV4cG9ydCBjb25zdCBTVE9SQUdFX1RZUEUgPSAnc3RvcmFnZSc7XG4iLCAiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQ1xuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cbmltcG9ydCB7IF9nZXRQcm92aWRlciwgRmlyZWJhc2VBcHAsIGdldEFwcCB9IGZyb20gJ0BmaXJlYmFzZS9hcHAnO1xuXG5pbXBvcnQge1xuICByZWYgYXMgcmVmSW50ZXJuYWwsXG4gIEZpcmViYXNlU3RvcmFnZUltcGwsXG4gIGNvbm5lY3RTdG9yYWdlRW11bGF0b3IgYXMgY29ubmVjdEVtdWxhdG9ySW50ZXJuYWxcbn0gZnJvbSAnLi9zZXJ2aWNlJztcbmltcG9ydCB7IFByb3ZpZGVyIH0gZnJvbSAnQGZpcmViYXNlL2NvbXBvbmVudCc7XG5cbmltcG9ydCB7XG4gIFN0b3JhZ2VSZWZlcmVuY2UsXG4gIEZpcmViYXNlU3RvcmFnZSxcbiAgVXBsb2FkUmVzdWx0LFxuICBMaXN0T3B0aW9ucyxcbiAgTGlzdFJlc3VsdCxcbiAgVXBsb2FkVGFzayxcbiAgU2V0dGFibGVNZXRhZGF0YSxcbiAgVXBsb2FkTWV0YWRhdGEsXG4gIEZ1bGxNZXRhZGF0YVxufSBmcm9tICcuL3B1YmxpYy10eXBlcyc7XG5pbXBvcnQgeyBNZXRhZGF0YSBhcyBNZXRhZGF0YUludGVybmFsIH0gZnJvbSAnLi9tZXRhZGF0YSc7XG5pbXBvcnQge1xuICB1cGxvYWRCeXRlcyBhcyB1cGxvYWRCeXRlc0ludGVybmFsLFxuICB1cGxvYWRCeXRlc1Jlc3VtYWJsZSBhcyB1cGxvYWRCeXRlc1Jlc3VtYWJsZUludGVybmFsLFxuICB1cGxvYWRTdHJpbmcgYXMgdXBsb2FkU3RyaW5nSW50ZXJuYWwsXG4gIGdldE1ldGFkYXRhIGFzIGdldE1ldGFkYXRhSW50ZXJuYWwsXG4gIHVwZGF0ZU1ldGFkYXRhIGFzIHVwZGF0ZU1ldGFkYXRhSW50ZXJuYWwsXG4gIGxpc3QgYXMgbGlzdEludGVybmFsLFxuICBsaXN0QWxsIGFzIGxpc3RBbGxJbnRlcm5hbCxcbiAgZ2V0RG93bmxvYWRVUkwgYXMgZ2V0RG93bmxvYWRVUkxJbnRlcm5hbCxcbiAgZGVsZXRlT2JqZWN0IGFzIGRlbGV0ZU9iamVjdEludGVybmFsLFxuICBSZWZlcmVuY2UsXG4gIF9nZXRDaGlsZCBhcyBfZ2V0Q2hpbGRJbnRlcm5hbCxcbiAgZ2V0Qnl0ZXNJbnRlcm5hbFxufSBmcm9tICcuL3JlZmVyZW5jZSc7XG5pbXBvcnQgeyBTVE9SQUdFX1RZUEUgfSBmcm9tICcuL2NvbnN0YW50cyc7XG5pbXBvcnQge1xuICBFbXVsYXRvck1vY2tUb2tlbk9wdGlvbnMsXG4gIGdldE1vZHVsYXJJbnN0YW5jZSxcbiAgZ2V0RGVmYXVsdEVtdWxhdG9ySG9zdG5hbWVBbmRQb3J0XG59IGZyb20gJ0BmaXJlYmFzZS91dGlsJztcbmltcG9ydCB7IFN0cmluZ0Zvcm1hdCB9IGZyb20gJy4vaW1wbGVtZW50YXRpb24vc3RyaW5nJztcblxuZXhwb3J0IHsgRW11bGF0b3JNb2NrVG9rZW5PcHRpb25zIH0gZnJvbSAnQGZpcmViYXNlL3V0aWwnO1xuXG5leHBvcnQgeyBTdG9yYWdlRXJyb3IsIFN0b3JhZ2VFcnJvckNvZGUgfSBmcm9tICcuL2ltcGxlbWVudGF0aW9uL2Vycm9yJztcblxuLyoqXG4gKiBQdWJsaWMgdHlwZXMuXG4gKi9cbmV4cG9ydCAqIGZyb20gJy4vcHVibGljLXR5cGVzJztcblxuZXhwb3J0IHsgTG9jYXRpb24gYXMgX0xvY2F0aW9uIH0gZnJvbSAnLi9pbXBsZW1lbnRhdGlvbi9sb2NhdGlvbic7XG5leHBvcnQgeyBVcGxvYWRUYXNrIGFzIF9VcGxvYWRUYXNrIH0gZnJvbSAnLi90YXNrJztcbmV4cG9ydCB0eXBlIHsgUmVmZXJlbmNlIGFzIF9SZWZlcmVuY2UgfSBmcm9tICcuL3JlZmVyZW5jZSc7XG5leHBvcnQgdHlwZSB7IEZpcmViYXNlU3RvcmFnZUltcGwgYXMgX0ZpcmViYXNlU3RvcmFnZUltcGwgfSBmcm9tICcuL3NlcnZpY2UnO1xuZXhwb3J0IHsgRmJzQmxvYiBhcyBfRmJzQmxvYiB9IGZyb20gJy4vaW1wbGVtZW50YXRpb24vYmxvYic7XG5leHBvcnQgeyBkYXRhRnJvbVN0cmluZyBhcyBfZGF0YUZyb21TdHJpbmcgfSBmcm9tICcuL2ltcGxlbWVudGF0aW9uL3N0cmluZyc7XG5leHBvcnQge1xuICBpbnZhbGlkUm9vdE9wZXJhdGlvbiBhcyBfaW52YWxpZFJvb3RPcGVyYXRpb24sXG4gIGludmFsaWRBcmd1bWVudCBhcyBfaW52YWxpZEFyZ3VtZW50XG59IGZyb20gJy4vaW1wbGVtZW50YXRpb24vZXJyb3InO1xuZXhwb3J0IHtcbiAgVGFza0V2ZW50IGFzIF9UYXNrRXZlbnQsXG4gIFRhc2tTdGF0ZSBhcyBfVGFza1N0YXRlXG59IGZyb20gJy4vaW1wbGVtZW50YXRpb24vdGFza2VudW1zJztcbmV4cG9ydCB7IFN0cmluZ0Zvcm1hdCB9O1xuXG4vKipcbiAqIERvd25sb2FkcyB0aGUgZGF0YSBhdCB0aGUgb2JqZWN0J3MgbG9jYXRpb24uIFJldHVybnMgYW4gZXJyb3IgaWYgdGhlIG9iamVjdFxuICogaXMgbm90IGZvdW5kLlxuICpcbiAqIFRvIHVzZSB0aGlzIGZ1bmN0aW9uYWxpdHksIHlvdSBoYXZlIHRvIHdoaXRlbGlzdCB5b3VyIGFwcCdzIG9yaWdpbiBpbiB5b3VyXG4gKiBDbG91ZCBTdG9yYWdlIGJ1Y2tldC4gU2VlIGFsc29cbiAqIGh0dHBzOi8vY2xvdWQuZ29vZ2xlLmNvbS9zdG9yYWdlL2RvY3MvY29uZmlndXJpbmctY29yc1xuICpcbiAqIEBwdWJsaWNcbiAqIEBwYXJhbSByZWYgLSBTdG9yYWdlUmVmZXJlbmNlIHdoZXJlIGRhdGEgc2hvdWxkIGJlIGRvd25sb2FkZWQuXG4gKiBAcGFyYW0gbWF4RG93bmxvYWRTaXplQnl0ZXMgLSBJZiBzZXQsIHRoZSBtYXhpbXVtIGFsbG93ZWQgc2l6ZSBpbiBieXRlcyB0b1xuICogcmV0cmlldmUuXG4gKiBAcmV0dXJucyBBIFByb21pc2UgY29udGFpbmluZyB0aGUgb2JqZWN0J3MgYnl0ZXNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEJ5dGVzKFxuICByZWY6IFN0b3JhZ2VSZWZlcmVuY2UsXG4gIG1heERvd25sb2FkU2l6ZUJ5dGVzPzogbnVtYmVyXG4pOiBQcm9taXNlPEFycmF5QnVmZmVyPiB7XG4gIHJlZiA9IGdldE1vZHVsYXJJbnN0YW5jZShyZWYpO1xuICByZXR1cm4gZ2V0Qnl0ZXNJbnRlcm5hbChyZWYgYXMgUmVmZXJlbmNlLCBtYXhEb3dubG9hZFNpemVCeXRlcyk7XG59XG5cbi8qKlxuICogVXBsb2FkcyBkYXRhIHRvIHRoaXMgb2JqZWN0J3MgbG9jYXRpb24uXG4gKiBUaGUgdXBsb2FkIGlzIG5vdCByZXN1bWFibGUuXG4gKiBAcHVibGljXG4gKiBAcGFyYW0gcmVmIC0ge0BsaW5rIFN0b3JhZ2VSZWZlcmVuY2V9IHdoZXJlIGRhdGEgc2hvdWxkIGJlIHVwbG9hZGVkLlxuICogQHBhcmFtIGRhdGEgLSBUaGUgZGF0YSB0byB1cGxvYWQuXG4gKiBAcGFyYW0gbWV0YWRhdGEgLSBNZXRhZGF0YSBmb3IgdGhlIGRhdGEgdG8gdXBsb2FkLlxuICogQHJldHVybnMgQSBQcm9taXNlIGNvbnRhaW5pbmcgYW4gVXBsb2FkUmVzdWx0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1cGxvYWRCeXRlcyhcbiAgcmVmOiBTdG9yYWdlUmVmZXJlbmNlLFxuICBkYXRhOiBCbG9iIHwgVWludDhBcnJheSB8IEFycmF5QnVmZmVyLFxuICBtZXRhZGF0YT86IFVwbG9hZE1ldGFkYXRhXG4pOiBQcm9taXNlPFVwbG9hZFJlc3VsdD4ge1xuICByZWYgPSBnZXRNb2R1bGFySW5zdGFuY2UocmVmKTtcbiAgcmV0dXJuIHVwbG9hZEJ5dGVzSW50ZXJuYWwoXG4gICAgcmVmIGFzIFJlZmVyZW5jZSxcbiAgICBkYXRhLFxuICAgIG1ldGFkYXRhIGFzIE1ldGFkYXRhSW50ZXJuYWxcbiAgKTtcbn1cblxuLyoqXG4gKiBVcGxvYWRzIGEgc3RyaW5nIHRvIHRoaXMgb2JqZWN0J3MgbG9jYXRpb24uXG4gKiBUaGUgdXBsb2FkIGlzIG5vdCByZXN1bWFibGUuXG4gKiBAcHVibGljXG4gKiBAcGFyYW0gcmVmIC0ge0BsaW5rIFN0b3JhZ2VSZWZlcmVuY2V9IHdoZXJlIHN0cmluZyBzaG91bGQgYmUgdXBsb2FkZWQuXG4gKiBAcGFyYW0gdmFsdWUgLSBUaGUgc3RyaW5nIHRvIHVwbG9hZC5cbiAqIEBwYXJhbSBmb3JtYXQgLSBUaGUgZm9ybWF0IG9mIHRoZSBzdHJpbmcgdG8gdXBsb2FkLlxuICogQHBhcmFtIG1ldGFkYXRhIC0gTWV0YWRhdGEgZm9yIHRoZSBzdHJpbmcgdG8gdXBsb2FkLlxuICogQHJldHVybnMgQSBQcm9taXNlIGNvbnRhaW5pbmcgYW4gVXBsb2FkUmVzdWx0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1cGxvYWRTdHJpbmcoXG4gIHJlZjogU3RvcmFnZVJlZmVyZW5jZSxcbiAgdmFsdWU6IHN0cmluZyxcbiAgZm9ybWF0PzogU3RyaW5nRm9ybWF0LFxuICBtZXRhZGF0YT86IFVwbG9hZE1ldGFkYXRhXG4pOiBQcm9taXNlPFVwbG9hZFJlc3VsdD4ge1xuICByZWYgPSBnZXRNb2R1bGFySW5zdGFuY2UocmVmKTtcbiAgcmV0dXJuIHVwbG9hZFN0cmluZ0ludGVybmFsKFxuICAgIHJlZiBhcyBSZWZlcmVuY2UsXG4gICAgdmFsdWUsXG4gICAgZm9ybWF0LFxuICAgIG1ldGFkYXRhIGFzIE1ldGFkYXRhSW50ZXJuYWxcbiAgKTtcbn1cblxuLyoqXG4gKiBVcGxvYWRzIGRhdGEgdG8gdGhpcyBvYmplY3QncyBsb2NhdGlvbi5cbiAqIFRoZSB1cGxvYWQgY2FuIGJlIHBhdXNlZCBhbmQgcmVzdW1lZCwgYW5kIGV4cG9zZXMgcHJvZ3Jlc3MgdXBkYXRlcy5cbiAqIEBwdWJsaWNcbiAqIEBwYXJhbSByZWYgLSB7QGxpbmsgU3RvcmFnZVJlZmVyZW5jZX0gd2hlcmUgZGF0YSBzaG91bGQgYmUgdXBsb2FkZWQuXG4gKiBAcGFyYW0gZGF0YSAtIFRoZSBkYXRhIHRvIHVwbG9hZC5cbiAqIEBwYXJhbSBtZXRhZGF0YSAtIE1ldGFkYXRhIGZvciB0aGUgZGF0YSB0byB1cGxvYWQuXG4gKiBAcmV0dXJucyBBbiBVcGxvYWRUYXNrXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1cGxvYWRCeXRlc1Jlc3VtYWJsZShcbiAgcmVmOiBTdG9yYWdlUmVmZXJlbmNlLFxuICBkYXRhOiBCbG9iIHwgVWludDhBcnJheSB8IEFycmF5QnVmZmVyLFxuICBtZXRhZGF0YT86IFVwbG9hZE1ldGFkYXRhXG4pOiBVcGxvYWRUYXNrIHtcbiAgcmVmID0gZ2V0TW9kdWxhckluc3RhbmNlKHJlZik7XG4gIHJldHVybiB1cGxvYWRCeXRlc1Jlc3VtYWJsZUludGVybmFsKFxuICAgIHJlZiBhcyBSZWZlcmVuY2UsXG4gICAgZGF0YSxcbiAgICBtZXRhZGF0YSBhcyBNZXRhZGF0YUludGVybmFsXG4gICkgYXMgVXBsb2FkVGFzaztcbn1cblxuLyoqXG4gKiBBIGBQcm9taXNlYCB0aGF0IHJlc29sdmVzIHdpdGggdGhlIG1ldGFkYXRhIGZvciB0aGlzIG9iamVjdC4gSWYgdGhpc1xuICogb2JqZWN0IGRvZXNuJ3QgZXhpc3Qgb3IgbWV0YWRhdGEgY2Fubm90IGJlIHJldHJlaXZlZCwgdGhlIHByb21pc2UgaXNcbiAqIHJlamVjdGVkLlxuICogQHB1YmxpY1xuICogQHBhcmFtIHJlZiAtIHtAbGluayBTdG9yYWdlUmVmZXJlbmNlfSB0byBnZXQgbWV0YWRhdGEgZnJvbS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE1ldGFkYXRhKHJlZjogU3RvcmFnZVJlZmVyZW5jZSk6IFByb21pc2U8RnVsbE1ldGFkYXRhPiB7XG4gIHJlZiA9IGdldE1vZHVsYXJJbnN0YW5jZShyZWYpO1xuICByZXR1cm4gZ2V0TWV0YWRhdGFJbnRlcm5hbChyZWYgYXMgUmVmZXJlbmNlKSBhcyBQcm9taXNlPEZ1bGxNZXRhZGF0YT47XG59XG5cbi8qKlxuICogVXBkYXRlcyB0aGUgbWV0YWRhdGEgZm9yIHRoaXMgb2JqZWN0LlxuICogQHB1YmxpY1xuICogQHBhcmFtIHJlZiAtIHtAbGluayBTdG9yYWdlUmVmZXJlbmNlfSB0byB1cGRhdGUgbWV0YWRhdGEgZm9yLlxuICogQHBhcmFtIG1ldGFkYXRhIC0gVGhlIG5ldyBtZXRhZGF0YSBmb3IgdGhlIG9iamVjdC5cbiAqICAgICBPbmx5IHZhbHVlcyB0aGF0IGhhdmUgYmVlbiBleHBsaWNpdGx5IHNldCB3aWxsIGJlIGNoYW5nZWQuIEV4cGxpY2l0bHlcbiAqICAgICBzZXR0aW5nIGEgdmFsdWUgdG8gbnVsbCB3aWxsIHJlbW92ZSB0aGUgbWV0YWRhdGEuXG4gKiBAcmV0dXJucyBBIGBQcm9taXNlYCB0aGF0IHJlc29sdmVzIHdpdGggdGhlIG5ldyBtZXRhZGF0YSBmb3IgdGhpcyBvYmplY3QuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVNZXRhZGF0YShcbiAgcmVmOiBTdG9yYWdlUmVmZXJlbmNlLFxuICBtZXRhZGF0YTogU2V0dGFibGVNZXRhZGF0YVxuKTogUHJvbWlzZTxGdWxsTWV0YWRhdGE+IHtcbiAgcmVmID0gZ2V0TW9kdWxhckluc3RhbmNlKHJlZik7XG4gIHJldHVybiB1cGRhdGVNZXRhZGF0YUludGVybmFsKFxuICAgIHJlZiBhcyBSZWZlcmVuY2UsXG4gICAgbWV0YWRhdGEgYXMgUGFydGlhbDxNZXRhZGF0YUludGVybmFsPlxuICApIGFzIFByb21pc2U8RnVsbE1ldGFkYXRhPjtcbn1cblxuLyoqXG4gKiBMaXN0IGl0ZW1zIChmaWxlcykgYW5kIHByZWZpeGVzIChmb2xkZXJzKSB1bmRlciB0aGlzIHN0b3JhZ2UgcmVmZXJlbmNlLlxuICpcbiAqIExpc3QgQVBJIGlzIG9ubHkgYXZhaWxhYmxlIGZvciBGaXJlYmFzZSBSdWxlcyBWZXJzaW9uIDIuXG4gKlxuICogR0NTIGlzIGEga2V5LWJsb2Igc3RvcmUuIEZpcmViYXNlIFN0b3JhZ2UgaW1wb3NlcyB0aGUgc2VtYW50aWMgb2YgJy8nXG4gKiBkZWxpbWl0ZWQgZm9sZGVyIHN0cnVjdHVyZS5cbiAqIFJlZmVyIHRvIEdDUydzIExpc3QgQVBJIGlmIHlvdSB3YW50IHRvIGxlYXJuIG1vcmUuXG4gKlxuICogVG8gYWRoZXJlIHRvIEZpcmViYXNlIFJ1bGVzJ3MgU2VtYW50aWNzLCBGaXJlYmFzZSBTdG9yYWdlIGRvZXMgbm90XG4gKiBzdXBwb3J0IG9iamVjdHMgd2hvc2UgcGF0aHMgZW5kIHdpdGggXCIvXCIgb3IgY29udGFpbiB0d28gY29uc2VjdXRpdmVcbiAqIFwiL1wicy4gRmlyZWJhc2UgU3RvcmFnZSBMaXN0IEFQSSB3aWxsIGZpbHRlciB0aGVzZSB1bnN1cHBvcnRlZCBvYmplY3RzLlxuICogbGlzdCgpIG1heSBmYWlsIGlmIHRoZXJlIGFyZSB0b28gbWFueSB1bnN1cHBvcnRlZCBvYmplY3RzIGluIHRoZSBidWNrZXQuXG4gKiBAcHVibGljXG4gKlxuICogQHBhcmFtIHJlZiAtIHtAbGluayBTdG9yYWdlUmVmZXJlbmNlfSB0byBnZXQgbGlzdCBmcm9tLlxuICogQHBhcmFtIG9wdGlvbnMgLSBTZWUge0BsaW5rIExpc3RPcHRpb25zfSBmb3IgZGV0YWlscy5cbiAqIEByZXR1cm5zIEEgYFByb21pc2VgIHRoYXQgcmVzb2x2ZXMgd2l0aCB0aGUgaXRlbXMgYW5kIHByZWZpeGVzLlxuICogICAgICBgcHJlZml4ZXNgIGNvbnRhaW5zIHJlZmVyZW5jZXMgdG8gc3ViLWZvbGRlcnMgYW5kIGBpdGVtc2BcbiAqICAgICAgY29udGFpbnMgcmVmZXJlbmNlcyB0byBvYmplY3RzIGluIHRoaXMgZm9sZGVyLiBgbmV4dFBhZ2VUb2tlbmBcbiAqICAgICAgY2FuIGJlIHVzZWQgdG8gZ2V0IHRoZSByZXN0IG9mIHRoZSByZXN1bHRzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbGlzdChcbiAgcmVmOiBTdG9yYWdlUmVmZXJlbmNlLFxuICBvcHRpb25zPzogTGlzdE9wdGlvbnNcbik6IFByb21pc2U8TGlzdFJlc3VsdD4ge1xuICByZWYgPSBnZXRNb2R1bGFySW5zdGFuY2UocmVmKTtcbiAgcmV0dXJuIGxpc3RJbnRlcm5hbChyZWYgYXMgUmVmZXJlbmNlLCBvcHRpb25zKTtcbn1cblxuLyoqXG4gKiBMaXN0IGFsbCBpdGVtcyAoZmlsZXMpIGFuZCBwcmVmaXhlcyAoZm9sZGVycykgdW5kZXIgdGhpcyBzdG9yYWdlIHJlZmVyZW5jZS5cbiAqXG4gKiBUaGlzIGlzIGEgaGVscGVyIG1ldGhvZCBmb3IgY2FsbGluZyBsaXN0KCkgcmVwZWF0ZWRseSB1bnRpbCB0aGVyZSBhcmVcbiAqIG5vIG1vcmUgcmVzdWx0cy4gVGhlIGRlZmF1bHQgcGFnaW5hdGlvbiBzaXplIGlzIDEwMDAuXG4gKlxuICogTm90ZTogVGhlIHJlc3VsdHMgbWF5IG5vdCBiZSBjb25zaXN0ZW50IGlmIG9iamVjdHMgYXJlIGNoYW5nZWQgd2hpbGUgdGhpc1xuICogb3BlcmF0aW9uIGlzIHJ1bm5pbmcuXG4gKlxuICogV2FybmluZzogYGxpc3RBbGxgIG1heSBwb3RlbnRpYWxseSBjb25zdW1lIHRvbyBtYW55IHJlc291cmNlcyBpZiB0aGVyZSBhcmVcbiAqIHRvbyBtYW55IHJlc3VsdHMuXG4gKiBAcHVibGljXG4gKiBAcGFyYW0gcmVmIC0ge0BsaW5rIFN0b3JhZ2VSZWZlcmVuY2V9IHRvIGdldCBsaXN0IGZyb20uXG4gKlxuICogQHJldHVybnMgQSBgUHJvbWlzZWAgdGhhdCByZXNvbHZlcyB3aXRoIGFsbCB0aGUgaXRlbXMgYW5kIHByZWZpeGVzIHVuZGVyXG4gKiAgICAgIHRoZSBjdXJyZW50IHN0b3JhZ2UgcmVmZXJlbmNlLiBgcHJlZml4ZXNgIGNvbnRhaW5zIHJlZmVyZW5jZXMgdG9cbiAqICAgICAgc3ViLWRpcmVjdG9yaWVzIGFuZCBgaXRlbXNgIGNvbnRhaW5zIHJlZmVyZW5jZXMgdG8gb2JqZWN0cyBpbiB0aGlzXG4gKiAgICAgIGZvbGRlci4gYG5leHRQYWdlVG9rZW5gIGlzIG5ldmVyIHJldHVybmVkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbGlzdEFsbChyZWY6IFN0b3JhZ2VSZWZlcmVuY2UpOiBQcm9taXNlPExpc3RSZXN1bHQ+IHtcbiAgcmVmID0gZ2V0TW9kdWxhckluc3RhbmNlKHJlZik7XG4gIHJldHVybiBsaXN0QWxsSW50ZXJuYWwocmVmIGFzIFJlZmVyZW5jZSk7XG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgZG93bmxvYWQgVVJMIGZvciB0aGUgZ2l2ZW4ge0BsaW5rIFN0b3JhZ2VSZWZlcmVuY2V9LlxuICogQHB1YmxpY1xuICogQHBhcmFtIHJlZiAtIHtAbGluayBTdG9yYWdlUmVmZXJlbmNlfSB0byBnZXQgdGhlIGRvd25sb2FkIFVSTCBmb3IuXG4gKiBAcmV0dXJucyBBIGBQcm9taXNlYCB0aGF0IHJlc29sdmVzIHdpdGggdGhlIGRvd25sb2FkXG4gKiAgICAgVVJMIGZvciB0aGlzIG9iamVjdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldERvd25sb2FkVVJMKHJlZjogU3RvcmFnZVJlZmVyZW5jZSk6IFByb21pc2U8c3RyaW5nPiB7XG4gIHJlZiA9IGdldE1vZHVsYXJJbnN0YW5jZShyZWYpO1xuICByZXR1cm4gZ2V0RG93bmxvYWRVUkxJbnRlcm5hbChyZWYgYXMgUmVmZXJlbmNlKTtcbn1cblxuLyoqXG4gKiBEZWxldGVzIHRoZSBvYmplY3QgYXQgdGhpcyBsb2NhdGlvbi5cbiAqIEBwdWJsaWNcbiAqIEBwYXJhbSByZWYgLSB7QGxpbmsgU3RvcmFnZVJlZmVyZW5jZX0gZm9yIG9iamVjdCB0byBkZWxldGUuXG4gKiBAcmV0dXJucyBBIGBQcm9taXNlYCB0aGF0IHJlc29sdmVzIGlmIHRoZSBkZWxldGlvbiBzdWNjZWVkcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlbGV0ZU9iamVjdChyZWY6IFN0b3JhZ2VSZWZlcmVuY2UpOiBQcm9taXNlPHZvaWQ+IHtcbiAgcmVmID0gZ2V0TW9kdWxhckluc3RhbmNlKHJlZik7XG4gIHJldHVybiBkZWxldGVPYmplY3RJbnRlcm5hbChyZWYgYXMgUmVmZXJlbmNlKTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEge0BsaW5rIFN0b3JhZ2VSZWZlcmVuY2V9IGZvciB0aGUgZ2l2ZW4gdXJsLlxuICogQHBhcmFtIHN0b3JhZ2UgLSB7QGxpbmsgRmlyZWJhc2VTdG9yYWdlfSBpbnN0YW5jZS5cbiAqIEBwYXJhbSB1cmwgLSBVUkwuIElmIGVtcHR5LCByZXR1cm5zIHJvb3QgcmVmZXJlbmNlLlxuICogQHB1YmxpY1xuICovXG5leHBvcnQgZnVuY3Rpb24gcmVmKHN0b3JhZ2U6IEZpcmViYXNlU3RvcmFnZSwgdXJsPzogc3RyaW5nKTogU3RvcmFnZVJlZmVyZW5jZTtcbi8qKlxuICogUmV0dXJucyBhIHtAbGluayBTdG9yYWdlUmVmZXJlbmNlfSBmb3IgdGhlIGdpdmVuIHBhdGggaW4gdGhlXG4gKiBkZWZhdWx0IGJ1Y2tldC5cbiAqIEBwYXJhbSBzdG9yYWdlT3JSZWYgLSB7QGxpbmsgRmlyZWJhc2VTdG9yYWdlfSBvciB7QGxpbmsgU3RvcmFnZVJlZmVyZW5jZX0uXG4gKiBAcGFyYW0gcGF0aE9yVXJsU3RvcmFnZSAtIHBhdGguIElmIGVtcHR5LCByZXR1cm5zIHJvb3QgcmVmZXJlbmNlIChpZiB7QGxpbmsgRmlyZWJhc2VTdG9yYWdlfVxuICogaW5zdGFuY2UgcHJvdmlkZWQpIG9yIHJldHVybnMgc2FtZSByZWZlcmVuY2UgKGlmIHtAbGluayBTdG9yYWdlUmVmZXJlbmNlfSBwcm92aWRlZCkuXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZWYoXG4gIHN0b3JhZ2VPclJlZjogRmlyZWJhc2VTdG9yYWdlIHwgU3RvcmFnZVJlZmVyZW5jZSxcbiAgcGF0aD86IHN0cmluZ1xuKTogU3RvcmFnZVJlZmVyZW5jZTtcbmV4cG9ydCBmdW5jdGlvbiByZWYoXG4gIHNlcnZpY2VPclJlZjogRmlyZWJhc2VTdG9yYWdlIHwgU3RvcmFnZVJlZmVyZW5jZSxcbiAgcGF0aE9yVXJsPzogc3RyaW5nXG4pOiBTdG9yYWdlUmVmZXJlbmNlIHwgbnVsbCB7XG4gIHNlcnZpY2VPclJlZiA9IGdldE1vZHVsYXJJbnN0YW5jZShzZXJ2aWNlT3JSZWYpO1xuICByZXR1cm4gcmVmSW50ZXJuYWwoXG4gICAgc2VydmljZU9yUmVmIGFzIEZpcmViYXNlU3RvcmFnZUltcGwgfCBSZWZlcmVuY2UsXG4gICAgcGF0aE9yVXJsXG4gICk7XG59XG5cbi8qKlxuICogQGludGVybmFsXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBfZ2V0Q2hpbGQocmVmOiBTdG9yYWdlUmVmZXJlbmNlLCBjaGlsZFBhdGg6IHN0cmluZyk6IFJlZmVyZW5jZSB7XG4gIHJldHVybiBfZ2V0Q2hpbGRJbnRlcm5hbChyZWYgYXMgUmVmZXJlbmNlLCBjaGlsZFBhdGgpO1xufVxuXG4vKipcbiAqIEdldHMgYSB7QGxpbmsgRmlyZWJhc2VTdG9yYWdlfSBpbnN0YW5jZSBmb3IgdGhlIGdpdmVuIEZpcmViYXNlIGFwcC5cbiAqIEBwdWJsaWNcbiAqIEBwYXJhbSBhcHAgLSBGaXJlYmFzZSBhcHAgdG8gZ2V0IHtAbGluayBGaXJlYmFzZVN0b3JhZ2V9IGluc3RhbmNlIGZvci5cbiAqIEBwYXJhbSBidWNrZXRVcmwgLSBUaGUgZ3M6Ly8gdXJsIHRvIHlvdXIgRmlyZWJhc2UgU3RvcmFnZSBCdWNrZXQuXG4gKiBJZiBub3QgcGFzc2VkLCB1c2VzIHRoZSBhcHAncyBkZWZhdWx0IFN0b3JhZ2UgQnVja2V0LlxuICogQHJldHVybnMgQSB7QGxpbmsgRmlyZWJhc2VTdG9yYWdlfSBpbnN0YW5jZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFN0b3JhZ2UoXG4gIGFwcDogRmlyZWJhc2VBcHAgPSBnZXRBcHAoKSxcbiAgYnVja2V0VXJsPzogc3RyaW5nXG4pOiBGaXJlYmFzZVN0b3JhZ2Uge1xuICBhcHAgPSBnZXRNb2R1bGFySW5zdGFuY2UoYXBwKTtcbiAgY29uc3Qgc3RvcmFnZVByb3ZpZGVyOiBQcm92aWRlcjwnc3RvcmFnZSc+ID0gX2dldFByb3ZpZGVyKGFwcCwgU1RPUkFHRV9UWVBFKTtcbiAgY29uc3Qgc3RvcmFnZUluc3RhbmNlID0gc3RvcmFnZVByb3ZpZGVyLmdldEltbWVkaWF0ZSh7XG4gICAgaWRlbnRpZmllcjogYnVja2V0VXJsXG4gIH0pO1xuICBjb25zdCBlbXVsYXRvciA9IGdldERlZmF1bHRFbXVsYXRvckhvc3RuYW1lQW5kUG9ydCgnc3RvcmFnZScpO1xuICBpZiAoZW11bGF0b3IpIHtcbiAgICBjb25uZWN0U3RvcmFnZUVtdWxhdG9yKHN0b3JhZ2VJbnN0YW5jZSwgLi4uZW11bGF0b3IpO1xuICB9XG4gIHJldHVybiBzdG9yYWdlSW5zdGFuY2U7XG59XG5cbi8qKlxuICogTW9kaWZ5IHRoaXMge0BsaW5rIEZpcmViYXNlU3RvcmFnZX0gaW5zdGFuY2UgdG8gY29tbXVuaWNhdGUgd2l0aCB0aGUgQ2xvdWQgU3RvcmFnZSBlbXVsYXRvci5cbiAqXG4gKiBAcGFyYW0gc3RvcmFnZSAtIFRoZSB7QGxpbmsgRmlyZWJhc2VTdG9yYWdlfSBpbnN0YW5jZVxuICogQHBhcmFtIGhvc3QgLSBUaGUgZW11bGF0b3IgaG9zdCAoZXg6IGxvY2FsaG9zdClcbiAqIEBwYXJhbSBwb3J0IC0gVGhlIGVtdWxhdG9yIHBvcnQgKGV4OiA1MDAxKVxuICogQHBhcmFtIG9wdGlvbnMgLSBFbXVsYXRvciBvcHRpb25zLiBgb3B0aW9ucy5tb2NrVXNlclRva2VuYCBpcyB0aGUgbW9jayBhdXRoXG4gKiB0b2tlbiB0byB1c2UgZm9yIHVuaXQgdGVzdGluZyBTZWN1cml0eSBSdWxlcy5cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbm5lY3RTdG9yYWdlRW11bGF0b3IoXG4gIHN0b3JhZ2U6IEZpcmViYXNlU3RvcmFnZSxcbiAgaG9zdDogc3RyaW5nLFxuICBwb3J0OiBudW1iZXIsXG4gIG9wdGlvbnM6IHtcbiAgICBtb2NrVXNlclRva2VuPzogRW11bGF0b3JNb2NrVG9rZW5PcHRpb25zIHwgc3RyaW5nO1xuICB9ID0ge31cbik6IHZvaWQge1xuICBjb25uZWN0RW11bGF0b3JJbnRlcm5hbChzdG9yYWdlIGFzIEZpcmViYXNlU3RvcmFnZUltcGwsIGhvc3QsIHBvcnQsIG9wdGlvbnMpO1xufVxuIiwgIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIxIEdvb2dsZSBMTENcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IFN0b3JhZ2VSZWZlcmVuY2UgfSBmcm9tICcuL3B1YmxpYy10eXBlcyc7XG5pbXBvcnQgeyBSZWZlcmVuY2UsIGdldEJsb2JJbnRlcm5hbCB9IGZyb20gJy4vcmVmZXJlbmNlJztcbmltcG9ydCB7IGdldE1vZHVsYXJJbnN0YW5jZSB9IGZyb20gJ0BmaXJlYmFzZS91dGlsJztcblxuLyoqXG4gKiBEb3dubG9hZHMgdGhlIGRhdGEgYXQgdGhlIG9iamVjdCdzIGxvY2F0aW9uLiBSZXR1cm5zIGFuIGVycm9yIGlmIHRoZSBvYmplY3RcbiAqIGlzIG5vdCBmb3VuZC5cbiAqXG4gKiBUbyB1c2UgdGhpcyBmdW5jdGlvbmFsaXR5LCB5b3UgaGF2ZSB0byB3aGl0ZWxpc3QgeW91ciBhcHAncyBvcmlnaW4gaW4geW91clxuICogQ2xvdWQgU3RvcmFnZSBidWNrZXQuIFNlZSBhbHNvXG4gKiBodHRwczovL2Nsb3VkLmdvb2dsZS5jb20vc3RvcmFnZS9kb2NzL2NvbmZpZ3VyaW5nLWNvcnNcbiAqXG4gKiBUaGlzIEFQSSBpcyBub3QgYXZhaWxhYmxlIGluIE5vZGUuXG4gKlxuICogQHB1YmxpY1xuICogQHBhcmFtIHJlZiAtIFN0b3JhZ2VSZWZlcmVuY2Ugd2hlcmUgZGF0YSBzaG91bGQgYmUgZG93bmxvYWRlZC5cbiAqIEBwYXJhbSBtYXhEb3dubG9hZFNpemVCeXRlcyAtIElmIHNldCwgdGhlIG1heGltdW0gYWxsb3dlZCBzaXplIGluIGJ5dGVzIHRvXG4gKiByZXRyaWV2ZS5cbiAqIEByZXR1cm5zIEEgUHJvbWlzZSB0aGF0IHJlc29sdmVzIHdpdGggYSBCbG9iIGNvbnRhaW5pbmcgdGhlIG9iamVjdCdzIGJ5dGVzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRCbG9iKFxuICByZWY6IFN0b3JhZ2VSZWZlcmVuY2UsXG4gIG1heERvd25sb2FkU2l6ZUJ5dGVzPzogbnVtYmVyXG4pOiBQcm9taXNlPEJsb2I+IHtcbiAgcmVmID0gZ2V0TW9kdWxhckluc3RhbmNlKHJlZik7XG4gIHJldHVybiBnZXRCbG9iSW50ZXJuYWwocmVmIGFzIFJlZmVyZW5jZSwgbWF4RG93bmxvYWRTaXplQnl0ZXMpO1xufVxuXG4vKipcbiAqIERvd25sb2FkcyB0aGUgZGF0YSBhdCB0aGUgb2JqZWN0J3MgbG9jYXRpb24uIFJhaXNlcyBhbiBlcnJvciBldmVudCBpZiB0aGVcbiAqIG9iamVjdCBpcyBub3QgZm91bmQuXG4gKlxuICogVGhpcyBBUEkgaXMgb25seSBhdmFpbGFibGUgaW4gTm9kZS5cbiAqXG4gKiBAcHVibGljXG4gKiBAcGFyYW0gcmVmIC0gU3RvcmFnZVJlZmVyZW5jZSB3aGVyZSBkYXRhIHNob3VsZCBiZSBkb3dubG9hZGVkLlxuICogQHBhcmFtIG1heERvd25sb2FkU2l6ZUJ5dGVzIC0gSWYgc2V0LCB0aGUgbWF4aW11bSBhbGxvd2VkIHNpemUgaW4gYnl0ZXMgdG9cbiAqIHJldHJpZXZlLlxuICogQHJldHVybnMgQSBzdHJlYW0gd2l0aCB0aGUgb2JqZWN0J3MgZGF0YSBhcyBieXRlc1xuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0U3RyZWFtKFxuICByZWY6IFN0b3JhZ2VSZWZlcmVuY2UsXG4gIG1heERvd25sb2FkU2l6ZUJ5dGVzPzogbnVtYmVyXG4pOiBOb2RlSlMuUmVhZGFibGVTdHJlYW0ge1xuICB0aHJvdyBuZXcgRXJyb3IoJ2dldFN0cmVhbSgpIGlzIG9ubHkgc3VwcG9ydGVkIGJ5IE5vZGVKUyBidWlsZHMnKTtcbn1cbiIsICIvKipcbiAqIENsb3VkIFN0b3JhZ2UgZm9yIEZpcmViYXNlXG4gKlxuICogQHBhY2thZ2VEb2N1bWVudGF0aW9uXG4gKi9cblxuLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQ1xuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXNcbmltcG9ydCB7XG4gIF9yZWdpc3RlckNvbXBvbmVudCxcbiAgcmVnaXN0ZXJWZXJzaW9uLFxuICBTREtfVkVSU0lPTlxufSBmcm9tICdAZmlyZWJhc2UvYXBwJztcblxuaW1wb3J0IHsgRmlyZWJhc2VTdG9yYWdlSW1wbCB9IGZyb20gJy4uL3NyYy9zZXJ2aWNlJztcbmltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgQ29tcG9uZW50VHlwZSxcbiAgQ29tcG9uZW50Q29udGFpbmVyLFxuICBJbnN0YW5jZUZhY3RvcnlPcHRpb25zXG59IGZyb20gJ0BmaXJlYmFzZS9jb21wb25lbnQnO1xuXG5pbXBvcnQgeyBuYW1lLCB2ZXJzaW9uIH0gZnJvbSAnLi4vcGFja2FnZS5qc29uJztcblxuaW1wb3J0IHsgRmlyZWJhc2VTdG9yYWdlIH0gZnJvbSAnLi9wdWJsaWMtdHlwZXMnO1xuaW1wb3J0IHsgU1RPUkFHRV9UWVBFIH0gZnJvbSAnLi9jb25zdGFudHMnO1xuXG5leHBvcnQgKiBmcm9tICcuL2FwaSc7XG5leHBvcnQgKiBmcm9tICcuL2FwaS5icm93c2VyJztcblxuZnVuY3Rpb24gZmFjdG9yeShcbiAgY29udGFpbmVyOiBDb21wb25lbnRDb250YWluZXIsXG4gIHsgaW5zdGFuY2VJZGVudGlmaWVyOiB1cmwgfTogSW5zdGFuY2VGYWN0b3J5T3B0aW9uc1xuKTogRmlyZWJhc2VTdG9yYWdlIHtcbiAgY29uc3QgYXBwID0gY29udGFpbmVyLmdldFByb3ZpZGVyKCdhcHAnKS5nZXRJbW1lZGlhdGUoKTtcbiAgY29uc3QgYXV0aFByb3ZpZGVyID0gY29udGFpbmVyLmdldFByb3ZpZGVyKCdhdXRoLWludGVybmFsJyk7XG4gIGNvbnN0IGFwcENoZWNrUHJvdmlkZXIgPSBjb250YWluZXIuZ2V0UHJvdmlkZXIoJ2FwcC1jaGVjay1pbnRlcm5hbCcpO1xuXG4gIHJldHVybiBuZXcgRmlyZWJhc2VTdG9yYWdlSW1wbChcbiAgICBhcHAsXG4gICAgYXV0aFByb3ZpZGVyLFxuICAgIGFwcENoZWNrUHJvdmlkZXIsXG4gICAgdXJsLFxuICAgIFNES19WRVJTSU9OXG4gICk7XG59XG5cbmZ1bmN0aW9uIHJlZ2lzdGVyU3RvcmFnZSgpOiB2b2lkIHtcbiAgX3JlZ2lzdGVyQ29tcG9uZW50KFxuICAgIG5ldyBDb21wb25lbnQoXG4gICAgICBTVE9SQUdFX1RZUEUsXG4gICAgICBmYWN0b3J5LFxuICAgICAgQ29tcG9uZW50VHlwZS5QVUJMSUNcbiAgICApLnNldE11bHRpcGxlSW5zdGFuY2VzKHRydWUpXG4gICk7XG4gIC8vUlVOVElNRV9FTlYgd2lsbCBiZSByZXBsYWNlZCBkdXJpbmcgdGhlIGNvbXBpbGF0aW9uIHRvIFwibm9kZVwiIGZvciBub2RlanMgYW5kIGFuIGVtcHR5IHN0cmluZyBmb3IgYnJvd3NlclxuICByZWdpc3RlclZlcnNpb24obmFtZSwgdmVyc2lvbiwgJ19fUlVOVElNRV9FTlZfXycpO1xuICAvLyBCVUlMRF9UQVJHRVQgd2lsbCBiZSByZXBsYWNlZCBieSB2YWx1ZXMgbGlrZSBlc201LCBlc20yMDE3LCBjanM1LCBldGMgZHVyaW5nIHRoZSBjb21waWxhdGlvblxuICByZWdpc3RlclZlcnNpb24obmFtZSwgdmVyc2lvbiwgJ19fQlVJTERfVEFSR0VUX18nKTtcbn1cblxucmVnaXN0ZXJTdG9yYWdlKCk7XG4iLCAiLyoqXG4gKiBGdXNlLmpzIHY3LjAuMCAtIExpZ2h0d2VpZ2h0IGZ1enp5LXNlYXJjaCAoaHR0cDovL2Z1c2Vqcy5pbylcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMjMgS2lybyBSaXNrIChodHRwOi8va2lyby5tZSlcbiAqIEFsbCBSaWdodHMgUmVzZXJ2ZWQuIEFwYWNoZSBTb2Z0d2FyZSBMaWNlbnNlIDIuMFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICovXG5cbmZ1bmN0aW9uIGlzQXJyYXkodmFsdWUpIHtcbiAgcmV0dXJuICFBcnJheS5pc0FycmF5XG4gICAgPyBnZXRUYWcodmFsdWUpID09PSAnW29iamVjdCBBcnJheV0nXG4gICAgOiBBcnJheS5pc0FycmF5KHZhbHVlKVxufVxuXG4vLyBBZGFwdGVkIGZyb206IGh0dHBzOi8vZ2l0aHViLmNvbS9sb2Rhc2gvbG9kYXNoL2Jsb2IvbWFzdGVyLy5pbnRlcm5hbC9iYXNlVG9TdHJpbmcuanNcbmNvbnN0IElORklOSVRZID0gMSAvIDA7XG5mdW5jdGlvbiBiYXNlVG9TdHJpbmcodmFsdWUpIHtcbiAgLy8gRXhpdCBlYXJseSBmb3Igc3RyaW5ncyB0byBhdm9pZCBhIHBlcmZvcm1hbmNlIGhpdCBpbiBzb21lIGVudmlyb25tZW50cy5cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnc3RyaW5nJykge1xuICAgIHJldHVybiB2YWx1ZVxuICB9XG4gIGxldCByZXN1bHQgPSB2YWx1ZSArICcnO1xuICByZXR1cm4gcmVzdWx0ID09ICcwJyAmJiAxIC8gdmFsdWUgPT0gLUlORklOSVRZID8gJy0wJyA6IHJlc3VsdFxufVxuXG5mdW5jdGlvbiB0b1N0cmluZyh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgPT0gbnVsbCA/ICcnIDogYmFzZVRvU3RyaW5nKHZhbHVlKVxufVxuXG5mdW5jdGlvbiBpc1N0cmluZyh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJ1xufVxuXG5mdW5jdGlvbiBpc051bWJlcih2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJ1xufVxuXG4vLyBBZGFwdGVkIGZyb206IGh0dHBzOi8vZ2l0aHViLmNvbS9sb2Rhc2gvbG9kYXNoL2Jsb2IvbWFzdGVyL2lzQm9vbGVhbi5qc1xuZnVuY3Rpb24gaXNCb29sZWFuKHZhbHVlKSB7XG4gIHJldHVybiAoXG4gICAgdmFsdWUgPT09IHRydWUgfHxcbiAgICB2YWx1ZSA9PT0gZmFsc2UgfHxcbiAgICAoaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBnZXRUYWcodmFsdWUpID09ICdbb2JqZWN0IEJvb2xlYW5dJylcbiAgKVxufVxuXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0J1xufVxuXG4vLyBDaGVja3MgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZS5cbmZ1bmN0aW9uIGlzT2JqZWN0TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3QodmFsdWUpICYmIHZhbHVlICE9PSBudWxsXG59XG5cbmZ1bmN0aW9uIGlzRGVmaW5lZCh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbFxufVxuXG5mdW5jdGlvbiBpc0JsYW5rKHZhbHVlKSB7XG4gIHJldHVybiAhdmFsdWUudHJpbSgpLmxlbmd0aFxufVxuXG4vLyBHZXRzIHRoZSBgdG9TdHJpbmdUYWdgIG9mIGB2YWx1ZWAuXG4vLyBBZGFwdGVkIGZyb206IGh0dHBzOi8vZ2l0aHViLmNvbS9sb2Rhc2gvbG9kYXNoL2Jsb2IvbWFzdGVyLy5pbnRlcm5hbC9nZXRUYWcuanNcbmZ1bmN0aW9uIGdldFRhZyh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgPT0gbnVsbFxuICAgID8gdmFsdWUgPT09IHVuZGVmaW5lZFxuICAgICAgPyAnW29iamVjdCBVbmRlZmluZWRdJ1xuICAgICAgOiAnW29iamVjdCBOdWxsXSdcbiAgICA6IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSlcbn1cblxuY29uc3QgRVhURU5ERURfU0VBUkNIX1VOQVZBSUxBQkxFID0gJ0V4dGVuZGVkIHNlYXJjaCBpcyBub3QgYXZhaWxhYmxlJztcblxuY29uc3QgSU5DT1JSRUNUX0lOREVYX1RZUEUgPSBcIkluY29ycmVjdCAnaW5kZXgnIHR5cGVcIjtcblxuY29uc3QgTE9HSUNBTF9TRUFSQ0hfSU5WQUxJRF9RVUVSWV9GT1JfS0VZID0gKGtleSkgPT5cbiAgYEludmFsaWQgdmFsdWUgZm9yIGtleSAke2tleX1gO1xuXG5jb25zdCBQQVRURVJOX0xFTkdUSF9UT09fTEFSR0UgPSAobWF4KSA9PlxuICBgUGF0dGVybiBsZW5ndGggZXhjZWVkcyBtYXggb2YgJHttYXh9LmA7XG5cbmNvbnN0IE1JU1NJTkdfS0VZX1BST1BFUlRZID0gKG5hbWUpID0+IGBNaXNzaW5nICR7bmFtZX0gcHJvcGVydHkgaW4ga2V5YDtcblxuY29uc3QgSU5WQUxJRF9LRVlfV0VJR0hUX1ZBTFVFID0gKGtleSkgPT5cbiAgYFByb3BlcnR5ICd3ZWlnaHQnIGluIGtleSAnJHtrZXl9JyBtdXN0IGJlIGEgcG9zaXRpdmUgaW50ZWdlcmA7XG5cbmNvbnN0IGhhc093biA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5cbmNsYXNzIEtleVN0b3JlIHtcbiAgY29uc3RydWN0b3Ioa2V5cykge1xuICAgIHRoaXMuX2tleXMgPSBbXTtcbiAgICB0aGlzLl9rZXlNYXAgPSB7fTtcblxuICAgIGxldCB0b3RhbFdlaWdodCA9IDA7XG5cbiAgICBrZXlzLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgbGV0IG9iaiA9IGNyZWF0ZUtleShrZXkpO1xuXG4gICAgICB0aGlzLl9rZXlzLnB1c2gob2JqKTtcbiAgICAgIHRoaXMuX2tleU1hcFtvYmouaWRdID0gb2JqO1xuXG4gICAgICB0b3RhbFdlaWdodCArPSBvYmoud2VpZ2h0O1xuICAgIH0pO1xuXG4gICAgLy8gTm9ybWFsaXplIHdlaWdodHMgc28gdGhhdCB0aGVpciBzdW0gaXMgZXF1YWwgdG8gMVxuICAgIHRoaXMuX2tleXMuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICBrZXkud2VpZ2h0IC89IHRvdGFsV2VpZ2h0O1xuICAgIH0pO1xuICB9XG4gIGdldChrZXlJZCkge1xuICAgIHJldHVybiB0aGlzLl9rZXlNYXBba2V5SWRdXG4gIH1cbiAga2V5cygpIHtcbiAgICByZXR1cm4gdGhpcy5fa2V5c1xuICB9XG4gIHRvSlNPTigpIHtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodGhpcy5fa2V5cylcbiAgfVxufVxuXG5mdW5jdGlvbiBjcmVhdGVLZXkoa2V5KSB7XG4gIGxldCBwYXRoID0gbnVsbDtcbiAgbGV0IGlkID0gbnVsbDtcbiAgbGV0IHNyYyA9IG51bGw7XG4gIGxldCB3ZWlnaHQgPSAxO1xuICBsZXQgZ2V0Rm4gPSBudWxsO1xuXG4gIGlmIChpc1N0cmluZyhrZXkpIHx8IGlzQXJyYXkoa2V5KSkge1xuICAgIHNyYyA9IGtleTtcbiAgICBwYXRoID0gY3JlYXRlS2V5UGF0aChrZXkpO1xuICAgIGlkID0gY3JlYXRlS2V5SWQoa2V5KTtcbiAgfSBlbHNlIHtcbiAgICBpZiAoIWhhc093bi5jYWxsKGtleSwgJ25hbWUnKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKE1JU1NJTkdfS0VZX1BST1BFUlRZKCduYW1lJykpXG4gICAgfVxuXG4gICAgY29uc3QgbmFtZSA9IGtleS5uYW1lO1xuICAgIHNyYyA9IG5hbWU7XG5cbiAgICBpZiAoaGFzT3duLmNhbGwoa2V5LCAnd2VpZ2h0JykpIHtcbiAgICAgIHdlaWdodCA9IGtleS53ZWlnaHQ7XG5cbiAgICAgIGlmICh3ZWlnaHQgPD0gMCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoSU5WQUxJRF9LRVlfV0VJR0hUX1ZBTFVFKG5hbWUpKVxuICAgICAgfVxuICAgIH1cblxuICAgIHBhdGggPSBjcmVhdGVLZXlQYXRoKG5hbWUpO1xuICAgIGlkID0gY3JlYXRlS2V5SWQobmFtZSk7XG4gICAgZ2V0Rm4gPSBrZXkuZ2V0Rm47XG4gIH1cblxuICByZXR1cm4geyBwYXRoLCBpZCwgd2VpZ2h0LCBzcmMsIGdldEZuIH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlS2V5UGF0aChrZXkpIHtcbiAgcmV0dXJuIGlzQXJyYXkoa2V5KSA/IGtleSA6IGtleS5zcGxpdCgnLicpXG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUtleUlkKGtleSkge1xuICByZXR1cm4gaXNBcnJheShrZXkpID8ga2V5LmpvaW4oJy4nKSA6IGtleVxufVxuXG5mdW5jdGlvbiBnZXQob2JqLCBwYXRoKSB7XG4gIGxldCBsaXN0ID0gW107XG4gIGxldCBhcnIgPSBmYWxzZTtcblxuICBjb25zdCBkZWVwR2V0ID0gKG9iaiwgcGF0aCwgaW5kZXgpID0+IHtcbiAgICBpZiAoIWlzRGVmaW5lZChvYmopKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgaWYgKCFwYXRoW2luZGV4XSkge1xuICAgICAgLy8gSWYgdGhlcmUncyBubyBwYXRoIGxlZnQsIHdlJ3ZlIGFycml2ZWQgYXQgdGhlIG9iamVjdCB3ZSBjYXJlIGFib3V0LlxuICAgICAgbGlzdC5wdXNoKG9iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBrZXkgPSBwYXRoW2luZGV4XTtcblxuICAgICAgY29uc3QgdmFsdWUgPSBvYmpba2V5XTtcblxuICAgICAgaWYgKCFpc0RlZmluZWQodmFsdWUpKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICAvLyBJZiB3ZSdyZSBhdCB0aGUgbGFzdCB2YWx1ZSBpbiB0aGUgcGF0aCwgYW5kIGlmIGl0J3MgYSBzdHJpbmcvbnVtYmVyL2Jvb2wsXG4gICAgICAvLyBhZGQgaXQgdG8gdGhlIGxpc3RcbiAgICAgIGlmIChcbiAgICAgICAgaW5kZXggPT09IHBhdGgubGVuZ3RoIC0gMSAmJlxuICAgICAgICAoaXNTdHJpbmcodmFsdWUpIHx8IGlzTnVtYmVyKHZhbHVlKSB8fCBpc0Jvb2xlYW4odmFsdWUpKVxuICAgICAgKSB7XG4gICAgICAgIGxpc3QucHVzaCh0b1N0cmluZyh2YWx1ZSkpO1xuICAgICAgfSBlbHNlIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgICAgICBhcnIgPSB0cnVlO1xuICAgICAgICAvLyBTZWFyY2ggZWFjaCBpdGVtIGluIHRoZSBhcnJheS5cbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHZhbHVlLmxlbmd0aDsgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgICAgICAgZGVlcEdldCh2YWx1ZVtpXSwgcGF0aCwgaW5kZXggKyAxKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChwYXRoLmxlbmd0aCkge1xuICAgICAgICAvLyBBbiBvYmplY3QuIFJlY3Vyc2UgZnVydGhlci5cbiAgICAgICAgZGVlcEdldCh2YWx1ZSwgcGF0aCwgaW5kZXggKyAxKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgLy8gQmFja3dhcmRzIGNvbXBhdGliaWxpdHkgKHNpbmNlIHBhdGggdXNlZCB0byBiZSBhIHN0cmluZylcbiAgZGVlcEdldChvYmosIGlzU3RyaW5nKHBhdGgpID8gcGF0aC5zcGxpdCgnLicpIDogcGF0aCwgMCk7XG5cbiAgcmV0dXJuIGFyciA/IGxpc3QgOiBsaXN0WzBdXG59XG5cbmNvbnN0IE1hdGNoT3B0aW9ucyA9IHtcbiAgLy8gV2hldGhlciB0aGUgbWF0Y2hlcyBzaG91bGQgYmUgaW5jbHVkZWQgaW4gdGhlIHJlc3VsdCBzZXQuIFdoZW4gYHRydWVgLCBlYWNoIHJlY29yZCBpbiB0aGUgcmVzdWx0XG4gIC8vIHNldCB3aWxsIGluY2x1ZGUgdGhlIGluZGljZXMgb2YgdGhlIG1hdGNoZWQgY2hhcmFjdGVycy5cbiAgLy8gVGhlc2UgY2FuIGNvbnNlcXVlbnRseSBiZSB1c2VkIGZvciBoaWdobGlnaHRpbmcgcHVycG9zZXMuXG4gIGluY2x1ZGVNYXRjaGVzOiBmYWxzZSxcbiAgLy8gV2hlbiBgdHJ1ZWAsIHRoZSBtYXRjaGluZyBmdW5jdGlvbiB3aWxsIGNvbnRpbnVlIHRvIHRoZSBlbmQgb2YgYSBzZWFyY2ggcGF0dGVybiBldmVuIGlmXG4gIC8vIGEgcGVyZmVjdCBtYXRjaCBoYXMgYWxyZWFkeSBiZWVuIGxvY2F0ZWQgaW4gdGhlIHN0cmluZy5cbiAgZmluZEFsbE1hdGNoZXM6IGZhbHNlLFxuICAvLyBNaW5pbXVtIG51bWJlciBvZiBjaGFyYWN0ZXJzIHRoYXQgbXVzdCBiZSBtYXRjaGVkIGJlZm9yZSBhIHJlc3VsdCBpcyBjb25zaWRlcmVkIGEgbWF0Y2hcbiAgbWluTWF0Y2hDaGFyTGVuZ3RoOiAxXG59O1xuXG5jb25zdCBCYXNpY09wdGlvbnMgPSB7XG4gIC8vIFdoZW4gYHRydWVgLCB0aGUgYWxnb3JpdGhtIGNvbnRpbnVlcyBzZWFyY2hpbmcgdG8gdGhlIGVuZCBvZiB0aGUgaW5wdXQgZXZlbiBpZiBhIHBlcmZlY3RcbiAgLy8gbWF0Y2ggaXMgZm91bmQgYmVmb3JlIHRoZSBlbmQgb2YgdGhlIHNhbWUgaW5wdXQuXG4gIGlzQ2FzZVNlbnNpdGl2ZTogZmFsc2UsXG4gIC8vIFdoZW4gdHJ1ZSwgdGhlIG1hdGNoaW5nIGZ1bmN0aW9uIHdpbGwgY29udGludWUgdG8gdGhlIGVuZCBvZiBhIHNlYXJjaCBwYXR0ZXJuIGV2ZW4gaWZcbiAgaW5jbHVkZVNjb3JlOiBmYWxzZSxcbiAgLy8gTGlzdCBvZiBwcm9wZXJ0aWVzIHRoYXQgd2lsbCBiZSBzZWFyY2hlZC4gVGhpcyBhbHNvIHN1cHBvcnRzIG5lc3RlZCBwcm9wZXJ0aWVzLlxuICBrZXlzOiBbXSxcbiAgLy8gV2hldGhlciB0byBzb3J0IHRoZSByZXN1bHQgbGlzdCwgYnkgc2NvcmVcbiAgc2hvdWxkU29ydDogdHJ1ZSxcbiAgLy8gRGVmYXVsdCBzb3J0IGZ1bmN0aW9uOiBzb3J0IGJ5IGFzY2VuZGluZyBzY29yZSwgYXNjZW5kaW5nIGluZGV4XG4gIHNvcnRGbjogKGEsIGIpID0+XG4gICAgYS5zY29yZSA9PT0gYi5zY29yZSA/IChhLmlkeCA8IGIuaWR4ID8gLTEgOiAxKSA6IGEuc2NvcmUgPCBiLnNjb3JlID8gLTEgOiAxXG59O1xuXG5jb25zdCBGdXp6eU9wdGlvbnMgPSB7XG4gIC8vIEFwcHJveGltYXRlbHkgd2hlcmUgaW4gdGhlIHRleHQgaXMgdGhlIHBhdHRlcm4gZXhwZWN0ZWQgdG8gYmUgZm91bmQ/XG4gIGxvY2F0aW9uOiAwLFxuICAvLyBBdCB3aGF0IHBvaW50IGRvZXMgdGhlIG1hdGNoIGFsZ29yaXRobSBnaXZlIHVwLiBBIHRocmVzaG9sZCBvZiAnMC4wJyByZXF1aXJlcyBhIHBlcmZlY3QgbWF0Y2hcbiAgLy8gKG9mIGJvdGggbGV0dGVycyBhbmQgbG9jYXRpb24pLCBhIHRocmVzaG9sZCBvZiAnMS4wJyB3b3VsZCBtYXRjaCBhbnl0aGluZy5cbiAgdGhyZXNob2xkOiAwLjYsXG4gIC8vIERldGVybWluZXMgaG93IGNsb3NlIHRoZSBtYXRjaCBtdXN0IGJlIHRvIHRoZSBmdXp6eSBsb2NhdGlvbiAoc3BlY2lmaWVkIGFib3ZlKS5cbiAgLy8gQW4gZXhhY3QgbGV0dGVyIG1hdGNoIHdoaWNoIGlzICdkaXN0YW5jZScgY2hhcmFjdGVycyBhd2F5IGZyb20gdGhlIGZ1enp5IGxvY2F0aW9uXG4gIC8vIHdvdWxkIHNjb3JlIGFzIGEgY29tcGxldGUgbWlzbWF0Y2guIEEgZGlzdGFuY2Ugb2YgJzAnIHJlcXVpcmVzIHRoZSBtYXRjaCBiZSBhdFxuICAvLyB0aGUgZXhhY3QgbG9jYXRpb24gc3BlY2lmaWVkLCBhIHRocmVzaG9sZCBvZiAnMTAwMCcgd291bGQgcmVxdWlyZSBhIHBlcmZlY3QgbWF0Y2hcbiAgLy8gdG8gYmUgd2l0aGluIDgwMCBjaGFyYWN0ZXJzIG9mIHRoZSBmdXp6eSBsb2NhdGlvbiB0byBiZSBmb3VuZCB1c2luZyBhIDAuOCB0aHJlc2hvbGQuXG4gIGRpc3RhbmNlOiAxMDBcbn07XG5cbmNvbnN0IEFkdmFuY2VkT3B0aW9ucyA9IHtcbiAgLy8gV2hlbiBgdHJ1ZWAsIGl0IGVuYWJsZXMgdGhlIHVzZSBvZiB1bml4LWxpa2Ugc2VhcmNoIGNvbW1hbmRzXG4gIHVzZUV4dGVuZGVkU2VhcmNoOiBmYWxzZSxcbiAgLy8gVGhlIGdldCBmdW5jdGlvbiB0byB1c2Ugd2hlbiBmZXRjaGluZyBhbiBvYmplY3QncyBwcm9wZXJ0aWVzLlxuICAvLyBUaGUgZGVmYXVsdCB3aWxsIHNlYXJjaCBuZXN0ZWQgcGF0aHMgKmllIGZvby5iYXIuYmF6KlxuICBnZXRGbjogZ2V0LFxuICAvLyBXaGVuIGB0cnVlYCwgc2VhcmNoIHdpbGwgaWdub3JlIGBsb2NhdGlvbmAgYW5kIGBkaXN0YW5jZWAsIHNvIGl0IHdvbid0IG1hdHRlclxuICAvLyB3aGVyZSBpbiB0aGUgc3RyaW5nIHRoZSBwYXR0ZXJuIGFwcGVhcnMuXG4gIC8vIE1vcmUgaW5mbzogaHR0cHM6Ly9mdXNlanMuaW8vY29uY2VwdHMvc2NvcmluZy10aGVvcnkuaHRtbCNmdXp6aW5lc3Mtc2NvcmVcbiAgaWdub3JlTG9jYXRpb246IGZhbHNlLFxuICAvLyBXaGVuIGB0cnVlYCwgdGhlIGNhbGN1bGF0aW9uIGZvciB0aGUgcmVsZXZhbmNlIHNjb3JlICh1c2VkIGZvciBzb3J0aW5nKSB3aWxsXG4gIC8vIGlnbm9yZSB0aGUgZmllbGQtbGVuZ3RoIG5vcm0uXG4gIC8vIE1vcmUgaW5mbzogaHR0cHM6Ly9mdXNlanMuaW8vY29uY2VwdHMvc2NvcmluZy10aGVvcnkuaHRtbCNmaWVsZC1sZW5ndGgtbm9ybVxuICBpZ25vcmVGaWVsZE5vcm06IGZhbHNlLFxuICAvLyBUaGUgd2VpZ2h0IHRvIGRldGVybWluZSBob3cgbXVjaCBmaWVsZCBsZW5ndGggbm9ybSBlZmZlY3RzIHNjb3JpbmcuXG4gIGZpZWxkTm9ybVdlaWdodDogMVxufTtcblxudmFyIENvbmZpZyA9IHtcbiAgLi4uQmFzaWNPcHRpb25zLFxuICAuLi5NYXRjaE9wdGlvbnMsXG4gIC4uLkZ1enp5T3B0aW9ucyxcbiAgLi4uQWR2YW5jZWRPcHRpb25zXG59O1xuXG5jb25zdCBTUEFDRSA9IC9bXiBdKy9nO1xuXG4vLyBGaWVsZC1sZW5ndGggbm9ybTogdGhlIHNob3J0ZXIgdGhlIGZpZWxkLCB0aGUgaGlnaGVyIHRoZSB3ZWlnaHQuXG4vLyBTZXQgdG8gMyBkZWNpbWFscyB0byByZWR1Y2UgaW5kZXggc2l6ZS5cbmZ1bmN0aW9uIG5vcm0od2VpZ2h0ID0gMSwgbWFudGlzc2EgPSAzKSB7XG4gIGNvbnN0IGNhY2hlID0gbmV3IE1hcCgpO1xuICBjb25zdCBtID0gTWF0aC5wb3coMTAsIG1hbnRpc3NhKTtcblxuICByZXR1cm4ge1xuICAgIGdldCh2YWx1ZSkge1xuICAgICAgY29uc3QgbnVtVG9rZW5zID0gdmFsdWUubWF0Y2goU1BBQ0UpLmxlbmd0aDtcblxuICAgICAgaWYgKGNhY2hlLmhhcyhudW1Ub2tlbnMpKSB7XG4gICAgICAgIHJldHVybiBjYWNoZS5nZXQobnVtVG9rZW5zKVxuICAgICAgfVxuXG4gICAgICAvLyBEZWZhdWx0IGZ1bmN0aW9uIGlzIDEvc3FydCh4KSwgd2VpZ2h0IG1ha2VzIHRoYXQgdmFyaWFibGVcbiAgICAgIGNvbnN0IG5vcm0gPSAxIC8gTWF0aC5wb3cobnVtVG9rZW5zLCAwLjUgKiB3ZWlnaHQpO1xuXG4gICAgICAvLyBJbiBwbGFjZSBvZiBgdG9GaXhlZChtYW50aXNzYSlgLCBmb3IgZmFzdGVyIGNvbXB1dGF0aW9uXG4gICAgICBjb25zdCBuID0gcGFyc2VGbG9hdChNYXRoLnJvdW5kKG5vcm0gKiBtKSAvIG0pO1xuXG4gICAgICBjYWNoZS5zZXQobnVtVG9rZW5zLCBuKTtcblxuICAgICAgcmV0dXJuIG5cbiAgICB9LFxuICAgIGNsZWFyKCkge1xuICAgICAgY2FjaGUuY2xlYXIoKTtcbiAgICB9XG4gIH1cbn1cblxuY2xhc3MgRnVzZUluZGV4IHtcbiAgY29uc3RydWN0b3Ioe1xuICAgIGdldEZuID0gQ29uZmlnLmdldEZuLFxuICAgIGZpZWxkTm9ybVdlaWdodCA9IENvbmZpZy5maWVsZE5vcm1XZWlnaHRcbiAgfSA9IHt9KSB7XG4gICAgdGhpcy5ub3JtID0gbm9ybShmaWVsZE5vcm1XZWlnaHQsIDMpO1xuICAgIHRoaXMuZ2V0Rm4gPSBnZXRGbjtcbiAgICB0aGlzLmlzQ3JlYXRlZCA9IGZhbHNlO1xuXG4gICAgdGhpcy5zZXRJbmRleFJlY29yZHMoKTtcbiAgfVxuICBzZXRTb3VyY2VzKGRvY3MgPSBbXSkge1xuICAgIHRoaXMuZG9jcyA9IGRvY3M7XG4gIH1cbiAgc2V0SW5kZXhSZWNvcmRzKHJlY29yZHMgPSBbXSkge1xuICAgIHRoaXMucmVjb3JkcyA9IHJlY29yZHM7XG4gIH1cbiAgc2V0S2V5cyhrZXlzID0gW10pIHtcbiAgICB0aGlzLmtleXMgPSBrZXlzO1xuICAgIHRoaXMuX2tleXNNYXAgPSB7fTtcbiAgICBrZXlzLmZvckVhY2goKGtleSwgaWR4KSA9PiB7XG4gICAgICB0aGlzLl9rZXlzTWFwW2tleS5pZF0gPSBpZHg7XG4gICAgfSk7XG4gIH1cbiAgY3JlYXRlKCkge1xuICAgIGlmICh0aGlzLmlzQ3JlYXRlZCB8fCAhdGhpcy5kb2NzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgdGhpcy5pc0NyZWF0ZWQgPSB0cnVlO1xuXG4gICAgLy8gTGlzdCBpcyBBcnJheTxTdHJpbmc+XG4gICAgaWYgKGlzU3RyaW5nKHRoaXMuZG9jc1swXSkpIHtcbiAgICAgIHRoaXMuZG9jcy5mb3JFYWNoKChkb2MsIGRvY0luZGV4KSA9PiB7XG4gICAgICAgIHRoaXMuX2FkZFN0cmluZyhkb2MsIGRvY0luZGV4KTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBMaXN0IGlzIEFycmF5PE9iamVjdD5cbiAgICAgIHRoaXMuZG9jcy5mb3JFYWNoKChkb2MsIGRvY0luZGV4KSA9PiB7XG4gICAgICAgIHRoaXMuX2FkZE9iamVjdChkb2MsIGRvY0luZGV4KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMubm9ybS5jbGVhcigpO1xuICB9XG4gIC8vIEFkZHMgYSBkb2MgdG8gdGhlIGVuZCBvZiB0aGUgaW5kZXhcbiAgYWRkKGRvYykge1xuICAgIGNvbnN0IGlkeCA9IHRoaXMuc2l6ZSgpO1xuXG4gICAgaWYgKGlzU3RyaW5nKGRvYykpIHtcbiAgICAgIHRoaXMuX2FkZFN0cmluZyhkb2MsIGlkeCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2FkZE9iamVjdChkb2MsIGlkeCk7XG4gICAgfVxuICB9XG4gIC8vIFJlbW92ZXMgdGhlIGRvYyBhdCB0aGUgc3BlY2lmaWVkIGluZGV4IG9mIHRoZSBpbmRleFxuICByZW1vdmVBdChpZHgpIHtcbiAgICB0aGlzLnJlY29yZHMuc3BsaWNlKGlkeCwgMSk7XG5cbiAgICAvLyBDaGFuZ2UgcmVmIGluZGV4IG9mIGV2ZXJ5IHN1YnNxdWVudCBkb2NcbiAgICBmb3IgKGxldCBpID0gaWR4LCBsZW4gPSB0aGlzLnNpemUoKTsgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgICB0aGlzLnJlY29yZHNbaV0uaSAtPSAxO1xuICAgIH1cbiAgfVxuICBnZXRWYWx1ZUZvckl0ZW1BdEtleUlkKGl0ZW0sIGtleUlkKSB7XG4gICAgcmV0dXJuIGl0ZW1bdGhpcy5fa2V5c01hcFtrZXlJZF1dXG4gIH1cbiAgc2l6ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5yZWNvcmRzLmxlbmd0aFxuICB9XG4gIF9hZGRTdHJpbmcoZG9jLCBkb2NJbmRleCkge1xuICAgIGlmICghaXNEZWZpbmVkKGRvYykgfHwgaXNCbGFuayhkb2MpKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBsZXQgcmVjb3JkID0ge1xuICAgICAgdjogZG9jLFxuICAgICAgaTogZG9jSW5kZXgsXG4gICAgICBuOiB0aGlzLm5vcm0uZ2V0KGRvYylcbiAgICB9O1xuXG4gICAgdGhpcy5yZWNvcmRzLnB1c2gocmVjb3JkKTtcbiAgfVxuICBfYWRkT2JqZWN0KGRvYywgZG9jSW5kZXgpIHtcbiAgICBsZXQgcmVjb3JkID0geyBpOiBkb2NJbmRleCwgJDoge30gfTtcblxuICAgIC8vIEl0ZXJhdGUgb3ZlciBldmVyeSBrZXkgKGkuZSwgcGF0aCksIGFuZCBmZXRjaCB0aGUgdmFsdWUgYXQgdGhhdCBrZXlcbiAgICB0aGlzLmtleXMuZm9yRWFjaCgoa2V5LCBrZXlJbmRleCkgPT4ge1xuICAgICAgbGV0IHZhbHVlID0ga2V5LmdldEZuID8ga2V5LmdldEZuKGRvYykgOiB0aGlzLmdldEZuKGRvYywga2V5LnBhdGgpO1xuXG4gICAgICBpZiAoIWlzRGVmaW5lZCh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgICAgICBsZXQgc3ViUmVjb3JkcyA9IFtdO1xuICAgICAgICBjb25zdCBzdGFjayA9IFt7IG5lc3RlZEFyckluZGV4OiAtMSwgdmFsdWUgfV07XG5cbiAgICAgICAgd2hpbGUgKHN0YWNrLmxlbmd0aCkge1xuICAgICAgICAgIGNvbnN0IHsgbmVzdGVkQXJySW5kZXgsIHZhbHVlIH0gPSBzdGFjay5wb3AoKTtcblxuICAgICAgICAgIGlmICghaXNEZWZpbmVkKHZhbHVlKSkge1xuICAgICAgICAgICAgY29udGludWVcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoaXNTdHJpbmcodmFsdWUpICYmICFpc0JsYW5rKHZhbHVlKSkge1xuICAgICAgICAgICAgbGV0IHN1YlJlY29yZCA9IHtcbiAgICAgICAgICAgICAgdjogdmFsdWUsXG4gICAgICAgICAgICAgIGk6IG5lc3RlZEFyckluZGV4LFxuICAgICAgICAgICAgICBuOiB0aGlzLm5vcm0uZ2V0KHZhbHVlKVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgc3ViUmVjb3Jkcy5wdXNoKHN1YlJlY29yZCk7XG4gICAgICAgICAgfSBlbHNlIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgICAgdmFsdWUuZm9yRWFjaCgoaXRlbSwgaykgPT4ge1xuICAgICAgICAgICAgICBzdGFjay5wdXNoKHtcbiAgICAgICAgICAgICAgICBuZXN0ZWRBcnJJbmRleDogayxcbiAgICAgICAgICAgICAgICB2YWx1ZTogaXRlbVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSA7XG4gICAgICAgIH1cbiAgICAgICAgcmVjb3JkLiRba2V5SW5kZXhdID0gc3ViUmVjb3JkcztcbiAgICAgIH0gZWxzZSBpZiAoaXNTdHJpbmcodmFsdWUpICYmICFpc0JsYW5rKHZhbHVlKSkge1xuICAgICAgICBsZXQgc3ViUmVjb3JkID0ge1xuICAgICAgICAgIHY6IHZhbHVlLFxuICAgICAgICAgIG46IHRoaXMubm9ybS5nZXQodmFsdWUpXG4gICAgICAgIH07XG5cbiAgICAgICAgcmVjb3JkLiRba2V5SW5kZXhdID0gc3ViUmVjb3JkO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5yZWNvcmRzLnB1c2gocmVjb3JkKTtcbiAgfVxuICB0b0pTT04oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGtleXM6IHRoaXMua2V5cyxcbiAgICAgIHJlY29yZHM6IHRoaXMucmVjb3Jkc1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBjcmVhdGVJbmRleChcbiAga2V5cyxcbiAgZG9jcyxcbiAgeyBnZXRGbiA9IENvbmZpZy5nZXRGbiwgZmllbGROb3JtV2VpZ2h0ID0gQ29uZmlnLmZpZWxkTm9ybVdlaWdodCB9ID0ge31cbikge1xuICBjb25zdCBteUluZGV4ID0gbmV3IEZ1c2VJbmRleCh7IGdldEZuLCBmaWVsZE5vcm1XZWlnaHQgfSk7XG4gIG15SW5kZXguc2V0S2V5cyhrZXlzLm1hcChjcmVhdGVLZXkpKTtcbiAgbXlJbmRleC5zZXRTb3VyY2VzKGRvY3MpO1xuICBteUluZGV4LmNyZWF0ZSgpO1xuICByZXR1cm4gbXlJbmRleFxufVxuXG5mdW5jdGlvbiBwYXJzZUluZGV4KFxuICBkYXRhLFxuICB7IGdldEZuID0gQ29uZmlnLmdldEZuLCBmaWVsZE5vcm1XZWlnaHQgPSBDb25maWcuZmllbGROb3JtV2VpZ2h0IH0gPSB7fVxuKSB7XG4gIGNvbnN0IHsga2V5cywgcmVjb3JkcyB9ID0gZGF0YTtcbiAgY29uc3QgbXlJbmRleCA9IG5ldyBGdXNlSW5kZXgoeyBnZXRGbiwgZmllbGROb3JtV2VpZ2h0IH0pO1xuICBteUluZGV4LnNldEtleXMoa2V5cyk7XG4gIG15SW5kZXguc2V0SW5kZXhSZWNvcmRzKHJlY29yZHMpO1xuICByZXR1cm4gbXlJbmRleFxufVxuXG5mdW5jdGlvbiBjb21wdXRlU2NvcmUkMShcbiAgcGF0dGVybixcbiAge1xuICAgIGVycm9ycyA9IDAsXG4gICAgY3VycmVudExvY2F0aW9uID0gMCxcbiAgICBleHBlY3RlZExvY2F0aW9uID0gMCxcbiAgICBkaXN0YW5jZSA9IENvbmZpZy5kaXN0YW5jZSxcbiAgICBpZ25vcmVMb2NhdGlvbiA9IENvbmZpZy5pZ25vcmVMb2NhdGlvblxuICB9ID0ge31cbikge1xuICBjb25zdCBhY2N1cmFjeSA9IGVycm9ycyAvIHBhdHRlcm4ubGVuZ3RoO1xuXG4gIGlmIChpZ25vcmVMb2NhdGlvbikge1xuICAgIHJldHVybiBhY2N1cmFjeVxuICB9XG5cbiAgY29uc3QgcHJveGltaXR5ID0gTWF0aC5hYnMoZXhwZWN0ZWRMb2NhdGlvbiAtIGN1cnJlbnRMb2NhdGlvbik7XG5cbiAgaWYgKCFkaXN0YW5jZSkge1xuICAgIC8vIERvZGdlIGRpdmlkZSBieSB6ZXJvIGVycm9yLlxuICAgIHJldHVybiBwcm94aW1pdHkgPyAxLjAgOiBhY2N1cmFjeVxuICB9XG5cbiAgcmV0dXJuIGFjY3VyYWN5ICsgcHJveGltaXR5IC8gZGlzdGFuY2Vcbn1cblxuZnVuY3Rpb24gY29udmVydE1hc2tUb0luZGljZXMoXG4gIG1hdGNobWFzayA9IFtdLFxuICBtaW5NYXRjaENoYXJMZW5ndGggPSBDb25maWcubWluTWF0Y2hDaGFyTGVuZ3RoXG4pIHtcbiAgbGV0IGluZGljZXMgPSBbXTtcbiAgbGV0IHN0YXJ0ID0gLTE7XG4gIGxldCBlbmQgPSAtMTtcbiAgbGV0IGkgPSAwO1xuXG4gIGZvciAobGV0IGxlbiA9IG1hdGNobWFzay5sZW5ndGg7IGkgPCBsZW47IGkgKz0gMSkge1xuICAgIGxldCBtYXRjaCA9IG1hdGNobWFza1tpXTtcbiAgICBpZiAobWF0Y2ggJiYgc3RhcnQgPT09IC0xKSB7XG4gICAgICBzdGFydCA9IGk7XG4gICAgfSBlbHNlIGlmICghbWF0Y2ggJiYgc3RhcnQgIT09IC0xKSB7XG4gICAgICBlbmQgPSBpIC0gMTtcbiAgICAgIGlmIChlbmQgLSBzdGFydCArIDEgPj0gbWluTWF0Y2hDaGFyTGVuZ3RoKSB7XG4gICAgICAgIGluZGljZXMucHVzaChbc3RhcnQsIGVuZF0pO1xuICAgICAgfVxuICAgICAgc3RhcnQgPSAtMTtcbiAgICB9XG4gIH1cblxuICAvLyAoaS0xIC0gc3RhcnQpICsgMSA9PiBpIC0gc3RhcnRcbiAgaWYgKG1hdGNobWFza1tpIC0gMV0gJiYgaSAtIHN0YXJ0ID49IG1pbk1hdGNoQ2hhckxlbmd0aCkge1xuICAgIGluZGljZXMucHVzaChbc3RhcnQsIGkgLSAxXSk7XG4gIH1cblxuICByZXR1cm4gaW5kaWNlc1xufVxuXG4vLyBNYWNoaW5lIHdvcmQgc2l6ZVxuY29uc3QgTUFYX0JJVFMgPSAzMjtcblxuZnVuY3Rpb24gc2VhcmNoKFxuICB0ZXh0LFxuICBwYXR0ZXJuLFxuICBwYXR0ZXJuQWxwaGFiZXQsXG4gIHtcbiAgICBsb2NhdGlvbiA9IENvbmZpZy5sb2NhdGlvbixcbiAgICBkaXN0YW5jZSA9IENvbmZpZy5kaXN0YW5jZSxcbiAgICB0aHJlc2hvbGQgPSBDb25maWcudGhyZXNob2xkLFxuICAgIGZpbmRBbGxNYXRjaGVzID0gQ29uZmlnLmZpbmRBbGxNYXRjaGVzLFxuICAgIG1pbk1hdGNoQ2hhckxlbmd0aCA9IENvbmZpZy5taW5NYXRjaENoYXJMZW5ndGgsXG4gICAgaW5jbHVkZU1hdGNoZXMgPSBDb25maWcuaW5jbHVkZU1hdGNoZXMsXG4gICAgaWdub3JlTG9jYXRpb24gPSBDb25maWcuaWdub3JlTG9jYXRpb25cbiAgfSA9IHt9XG4pIHtcbiAgaWYgKHBhdHRlcm4ubGVuZ3RoID4gTUFYX0JJVFMpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoUEFUVEVSTl9MRU5HVEhfVE9PX0xBUkdFKE1BWF9CSVRTKSlcbiAgfVxuXG4gIGNvbnN0IHBhdHRlcm5MZW4gPSBwYXR0ZXJuLmxlbmd0aDtcbiAgLy8gU2V0IHN0YXJ0aW5nIGxvY2F0aW9uIGF0IGJlZ2lubmluZyB0ZXh0IGFuZCBpbml0aWFsaXplIHRoZSBhbHBoYWJldC5cbiAgY29uc3QgdGV4dExlbiA9IHRleHQubGVuZ3RoO1xuICAvLyBIYW5kbGUgdGhlIGNhc2Ugd2hlbiBsb2NhdGlvbiA+IHRleHQubGVuZ3RoXG4gIGNvbnN0IGV4cGVjdGVkTG9jYXRpb24gPSBNYXRoLm1heCgwLCBNYXRoLm1pbihsb2NhdGlvbiwgdGV4dExlbikpO1xuICAvLyBIaWdoZXN0IHNjb3JlIGJleW9uZCB3aGljaCB3ZSBnaXZlIHVwLlxuICBsZXQgY3VycmVudFRocmVzaG9sZCA9IHRocmVzaG9sZDtcbiAgLy8gSXMgdGhlcmUgYSBuZWFyYnkgZXhhY3QgbWF0Y2g/IChzcGVlZHVwKVxuICBsZXQgYmVzdExvY2F0aW9uID0gZXhwZWN0ZWRMb2NhdGlvbjtcblxuICAvLyBQZXJmb3JtYW5jZTogb25seSBjb21wdXRlciBtYXRjaGVzIHdoZW4gdGhlIG1pbk1hdGNoQ2hhckxlbmd0aCA+IDFcbiAgLy8gT1IgaWYgYGluY2x1ZGVNYXRjaGVzYCBpcyB0cnVlLlxuICBjb25zdCBjb21wdXRlTWF0Y2hlcyA9IG1pbk1hdGNoQ2hhckxlbmd0aCA+IDEgfHwgaW5jbHVkZU1hdGNoZXM7XG4gIC8vIEEgbWFzayBvZiB0aGUgbWF0Y2hlcywgdXNlZCBmb3IgYnVpbGRpbmcgdGhlIGluZGljZXNcbiAgY29uc3QgbWF0Y2hNYXNrID0gY29tcHV0ZU1hdGNoZXMgPyBBcnJheSh0ZXh0TGVuKSA6IFtdO1xuXG4gIGxldCBpbmRleDtcblxuICAvLyBHZXQgYWxsIGV4YWN0IG1hdGNoZXMsIGhlcmUgZm9yIHNwZWVkIHVwXG4gIHdoaWxlICgoaW5kZXggPSB0ZXh0LmluZGV4T2YocGF0dGVybiwgYmVzdExvY2F0aW9uKSkgPiAtMSkge1xuICAgIGxldCBzY29yZSA9IGNvbXB1dGVTY29yZSQxKHBhdHRlcm4sIHtcbiAgICAgIGN1cnJlbnRMb2NhdGlvbjogaW5kZXgsXG4gICAgICBleHBlY3RlZExvY2F0aW9uLFxuICAgICAgZGlzdGFuY2UsXG4gICAgICBpZ25vcmVMb2NhdGlvblxuICAgIH0pO1xuXG4gICAgY3VycmVudFRocmVzaG9sZCA9IE1hdGgubWluKHNjb3JlLCBjdXJyZW50VGhyZXNob2xkKTtcbiAgICBiZXN0TG9jYXRpb24gPSBpbmRleCArIHBhdHRlcm5MZW47XG5cbiAgICBpZiAoY29tcHV0ZU1hdGNoZXMpIHtcbiAgICAgIGxldCBpID0gMDtcbiAgICAgIHdoaWxlIChpIDwgcGF0dGVybkxlbikge1xuICAgICAgICBtYXRjaE1hc2tbaW5kZXggKyBpXSA9IDE7XG4gICAgICAgIGkgKz0gMTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBSZXNldCB0aGUgYmVzdCBsb2NhdGlvblxuICBiZXN0TG9jYXRpb24gPSAtMTtcblxuICBsZXQgbGFzdEJpdEFyciA9IFtdO1xuICBsZXQgZmluYWxTY29yZSA9IDE7XG4gIGxldCBiaW5NYXggPSBwYXR0ZXJuTGVuICsgdGV4dExlbjtcblxuICBjb25zdCBtYXNrID0gMSA8PCAocGF0dGVybkxlbiAtIDEpO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcGF0dGVybkxlbjsgaSArPSAxKSB7XG4gICAgLy8gU2NhbiBmb3IgdGhlIGJlc3QgbWF0Y2g7IGVhY2ggaXRlcmF0aW9uIGFsbG93cyBmb3Igb25lIG1vcmUgZXJyb3IuXG4gICAgLy8gUnVuIGEgYmluYXJ5IHNlYXJjaCB0byBkZXRlcm1pbmUgaG93IGZhciBmcm9tIHRoZSBtYXRjaCBsb2NhdGlvbiB3ZSBjYW4gc3RyYXlcbiAgICAvLyBhdCB0aGlzIGVycm9yIGxldmVsLlxuICAgIGxldCBiaW5NaW4gPSAwO1xuICAgIGxldCBiaW5NaWQgPSBiaW5NYXg7XG5cbiAgICB3aGlsZSAoYmluTWluIDwgYmluTWlkKSB7XG4gICAgICBjb25zdCBzY29yZSA9IGNvbXB1dGVTY29yZSQxKHBhdHRlcm4sIHtcbiAgICAgICAgZXJyb3JzOiBpLFxuICAgICAgICBjdXJyZW50TG9jYXRpb246IGV4cGVjdGVkTG9jYXRpb24gKyBiaW5NaWQsXG4gICAgICAgIGV4cGVjdGVkTG9jYXRpb24sXG4gICAgICAgIGRpc3RhbmNlLFxuICAgICAgICBpZ25vcmVMb2NhdGlvblxuICAgICAgfSk7XG5cbiAgICAgIGlmIChzY29yZSA8PSBjdXJyZW50VGhyZXNob2xkKSB7XG4gICAgICAgIGJpbk1pbiA9IGJpbk1pZDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJpbk1heCA9IGJpbk1pZDtcbiAgICAgIH1cblxuICAgICAgYmluTWlkID0gTWF0aC5mbG9vcigoYmluTWF4IC0gYmluTWluKSAvIDIgKyBiaW5NaW4pO1xuICAgIH1cblxuICAgIC8vIFVzZSB0aGUgcmVzdWx0IGZyb20gdGhpcyBpdGVyYXRpb24gYXMgdGhlIG1heGltdW0gZm9yIHRoZSBuZXh0LlxuICAgIGJpbk1heCA9IGJpbk1pZDtcblxuICAgIGxldCBzdGFydCA9IE1hdGgubWF4KDEsIGV4cGVjdGVkTG9jYXRpb24gLSBiaW5NaWQgKyAxKTtcbiAgICBsZXQgZmluaXNoID0gZmluZEFsbE1hdGNoZXNcbiAgICAgID8gdGV4dExlblxuICAgICAgOiBNYXRoLm1pbihleHBlY3RlZExvY2F0aW9uICsgYmluTWlkLCB0ZXh0TGVuKSArIHBhdHRlcm5MZW47XG5cbiAgICAvLyBJbml0aWFsaXplIHRoZSBiaXQgYXJyYXlcbiAgICBsZXQgYml0QXJyID0gQXJyYXkoZmluaXNoICsgMik7XG5cbiAgICBiaXRBcnJbZmluaXNoICsgMV0gPSAoMSA8PCBpKSAtIDE7XG5cbiAgICBmb3IgKGxldCBqID0gZmluaXNoOyBqID49IHN0YXJ0OyBqIC09IDEpIHtcbiAgICAgIGxldCBjdXJyZW50TG9jYXRpb24gPSBqIC0gMTtcbiAgICAgIGxldCBjaGFyTWF0Y2ggPSBwYXR0ZXJuQWxwaGFiZXRbdGV4dC5jaGFyQXQoY3VycmVudExvY2F0aW9uKV07XG5cbiAgICAgIGlmIChjb21wdXRlTWF0Y2hlcykge1xuICAgICAgICAvLyBTcGVlZCB1cDogcXVpY2sgYm9vbCB0byBpbnQgY29udmVyc2lvbiAoaS5lLCBgY2hhck1hdGNoID8gMSA6IDBgKVxuICAgICAgICBtYXRjaE1hc2tbY3VycmVudExvY2F0aW9uXSA9ICshIWNoYXJNYXRjaDtcbiAgICAgIH1cblxuICAgICAgLy8gRmlyc3QgcGFzczogZXhhY3QgbWF0Y2hcbiAgICAgIGJpdEFycltqXSA9ICgoYml0QXJyW2ogKyAxXSA8PCAxKSB8IDEpICYgY2hhck1hdGNoO1xuXG4gICAgICAvLyBTdWJzZXF1ZW50IHBhc3NlczogZnV6enkgbWF0Y2hcbiAgICAgIGlmIChpKSB7XG4gICAgICAgIGJpdEFycltqXSB8PVxuICAgICAgICAgICgobGFzdEJpdEFycltqICsgMV0gfCBsYXN0Qml0QXJyW2pdKSA8PCAxKSB8IDEgfCBsYXN0Qml0QXJyW2ogKyAxXTtcbiAgICAgIH1cblxuICAgICAgaWYgKGJpdEFycltqXSAmIG1hc2spIHtcbiAgICAgICAgZmluYWxTY29yZSA9IGNvbXB1dGVTY29yZSQxKHBhdHRlcm4sIHtcbiAgICAgICAgICBlcnJvcnM6IGksXG4gICAgICAgICAgY3VycmVudExvY2F0aW9uLFxuICAgICAgICAgIGV4cGVjdGVkTG9jYXRpb24sXG4gICAgICAgICAgZGlzdGFuY2UsXG4gICAgICAgICAgaWdub3JlTG9jYXRpb25cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gVGhpcyBtYXRjaCB3aWxsIGFsbW9zdCBjZXJ0YWlubHkgYmUgYmV0dGVyIHRoYW4gYW55IGV4aXN0aW5nIG1hdGNoLlxuICAgICAgICAvLyBCdXQgY2hlY2sgYW55d2F5LlxuICAgICAgICBpZiAoZmluYWxTY29yZSA8PSBjdXJyZW50VGhyZXNob2xkKSB7XG4gICAgICAgICAgLy8gSW5kZWVkIGl0IGlzXG4gICAgICAgICAgY3VycmVudFRocmVzaG9sZCA9IGZpbmFsU2NvcmU7XG4gICAgICAgICAgYmVzdExvY2F0aW9uID0gY3VycmVudExvY2F0aW9uO1xuXG4gICAgICAgICAgLy8gQWxyZWFkeSBwYXNzZWQgYGxvY2AsIGRvd25oaWxsIGZyb20gaGVyZSBvbiBpbi5cbiAgICAgICAgICBpZiAoYmVzdExvY2F0aW9uIDw9IGV4cGVjdGVkTG9jYXRpb24pIHtcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gV2hlbiBwYXNzaW5nIGBiZXN0TG9jYXRpb25gLCBkb24ndCBleGNlZWQgb3VyIGN1cnJlbnQgZGlzdGFuY2UgZnJvbSBgZXhwZWN0ZWRMb2NhdGlvbmAuXG4gICAgICAgICAgc3RhcnQgPSBNYXRoLm1heCgxLCAyICogZXhwZWN0ZWRMb2NhdGlvbiAtIGJlc3RMb2NhdGlvbik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBObyBob3BlIGZvciBhIChiZXR0ZXIpIG1hdGNoIGF0IGdyZWF0ZXIgZXJyb3IgbGV2ZWxzLlxuICAgIGNvbnN0IHNjb3JlID0gY29tcHV0ZVNjb3JlJDEocGF0dGVybiwge1xuICAgICAgZXJyb3JzOiBpICsgMSxcbiAgICAgIGN1cnJlbnRMb2NhdGlvbjogZXhwZWN0ZWRMb2NhdGlvbixcbiAgICAgIGV4cGVjdGVkTG9jYXRpb24sXG4gICAgICBkaXN0YW5jZSxcbiAgICAgIGlnbm9yZUxvY2F0aW9uXG4gICAgfSk7XG5cbiAgICBpZiAoc2NvcmUgPiBjdXJyZW50VGhyZXNob2xkKSB7XG4gICAgICBicmVha1xuICAgIH1cblxuICAgIGxhc3RCaXRBcnIgPSBiaXRBcnI7XG4gIH1cblxuICBjb25zdCByZXN1bHQgPSB7XG4gICAgaXNNYXRjaDogYmVzdExvY2F0aW9uID49IDAsXG4gICAgLy8gQ291bnQgZXhhY3QgbWF0Y2hlcyAodGhvc2Ugd2l0aCBhIHNjb3JlIG9mIDApIHRvIGJlIFwiYWxtb3N0XCIgZXhhY3RcbiAgICBzY29yZTogTWF0aC5tYXgoMC4wMDEsIGZpbmFsU2NvcmUpXG4gIH07XG5cbiAgaWYgKGNvbXB1dGVNYXRjaGVzKSB7XG4gICAgY29uc3QgaW5kaWNlcyA9IGNvbnZlcnRNYXNrVG9JbmRpY2VzKG1hdGNoTWFzaywgbWluTWF0Y2hDaGFyTGVuZ3RoKTtcbiAgICBpZiAoIWluZGljZXMubGVuZ3RoKSB7XG4gICAgICByZXN1bHQuaXNNYXRjaCA9IGZhbHNlO1xuICAgIH0gZWxzZSBpZiAoaW5jbHVkZU1hdGNoZXMpIHtcbiAgICAgIHJlc3VsdC5pbmRpY2VzID0gaW5kaWNlcztcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVzdWx0XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVBhdHRlcm5BbHBoYWJldChwYXR0ZXJuKSB7XG4gIGxldCBtYXNrID0ge307XG5cbiAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHBhdHRlcm4ubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDEpIHtcbiAgICBjb25zdCBjaGFyID0gcGF0dGVybi5jaGFyQXQoaSk7XG4gICAgbWFza1tjaGFyXSA9IChtYXNrW2NoYXJdIHx8IDApIHwgKDEgPDwgKGxlbiAtIGkgLSAxKSk7XG4gIH1cblxuICByZXR1cm4gbWFza1xufVxuXG5jbGFzcyBCaXRhcFNlYXJjaCB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHBhdHRlcm4sXG4gICAge1xuICAgICAgbG9jYXRpb24gPSBDb25maWcubG9jYXRpb24sXG4gICAgICB0aHJlc2hvbGQgPSBDb25maWcudGhyZXNob2xkLFxuICAgICAgZGlzdGFuY2UgPSBDb25maWcuZGlzdGFuY2UsXG4gICAgICBpbmNsdWRlTWF0Y2hlcyA9IENvbmZpZy5pbmNsdWRlTWF0Y2hlcyxcbiAgICAgIGZpbmRBbGxNYXRjaGVzID0gQ29uZmlnLmZpbmRBbGxNYXRjaGVzLFxuICAgICAgbWluTWF0Y2hDaGFyTGVuZ3RoID0gQ29uZmlnLm1pbk1hdGNoQ2hhckxlbmd0aCxcbiAgICAgIGlzQ2FzZVNlbnNpdGl2ZSA9IENvbmZpZy5pc0Nhc2VTZW5zaXRpdmUsXG4gICAgICBpZ25vcmVMb2NhdGlvbiA9IENvbmZpZy5pZ25vcmVMb2NhdGlvblxuICAgIH0gPSB7fVxuICApIHtcbiAgICB0aGlzLm9wdGlvbnMgPSB7XG4gICAgICBsb2NhdGlvbixcbiAgICAgIHRocmVzaG9sZCxcbiAgICAgIGRpc3RhbmNlLFxuICAgICAgaW5jbHVkZU1hdGNoZXMsXG4gICAgICBmaW5kQWxsTWF0Y2hlcyxcbiAgICAgIG1pbk1hdGNoQ2hhckxlbmd0aCxcbiAgICAgIGlzQ2FzZVNlbnNpdGl2ZSxcbiAgICAgIGlnbm9yZUxvY2F0aW9uXG4gICAgfTtcblxuICAgIHRoaXMucGF0dGVybiA9IGlzQ2FzZVNlbnNpdGl2ZSA/IHBhdHRlcm4gOiBwYXR0ZXJuLnRvTG93ZXJDYXNlKCk7XG5cbiAgICB0aGlzLmNodW5rcyA9IFtdO1xuXG4gICAgaWYgKCF0aGlzLnBhdHRlcm4ubGVuZ3RoKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjb25zdCBhZGRDaHVuayA9IChwYXR0ZXJuLCBzdGFydEluZGV4KSA9PiB7XG4gICAgICB0aGlzLmNodW5rcy5wdXNoKHtcbiAgICAgICAgcGF0dGVybixcbiAgICAgICAgYWxwaGFiZXQ6IGNyZWF0ZVBhdHRlcm5BbHBoYWJldChwYXR0ZXJuKSxcbiAgICAgICAgc3RhcnRJbmRleFxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIGNvbnN0IGxlbiA9IHRoaXMucGF0dGVybi5sZW5ndGg7XG5cbiAgICBpZiAobGVuID4gTUFYX0JJVFMpIHtcbiAgICAgIGxldCBpID0gMDtcbiAgICAgIGNvbnN0IHJlbWFpbmRlciA9IGxlbiAlIE1BWF9CSVRTO1xuICAgICAgY29uc3QgZW5kID0gbGVuIC0gcmVtYWluZGVyO1xuXG4gICAgICB3aGlsZSAoaSA8IGVuZCkge1xuICAgICAgICBhZGRDaHVuayh0aGlzLnBhdHRlcm4uc3Vic3RyKGksIE1BWF9CSVRTKSwgaSk7XG4gICAgICAgIGkgKz0gTUFYX0JJVFM7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZW1haW5kZXIpIHtcbiAgICAgICAgY29uc3Qgc3RhcnRJbmRleCA9IGxlbiAtIE1BWF9CSVRTO1xuICAgICAgICBhZGRDaHVuayh0aGlzLnBhdHRlcm4uc3Vic3RyKHN0YXJ0SW5kZXgpLCBzdGFydEluZGV4KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgYWRkQ2h1bmsodGhpcy5wYXR0ZXJuLCAwKTtcbiAgICB9XG4gIH1cblxuICBzZWFyY2hJbih0ZXh0KSB7XG4gICAgY29uc3QgeyBpc0Nhc2VTZW5zaXRpdmUsIGluY2x1ZGVNYXRjaGVzIH0gPSB0aGlzLm9wdGlvbnM7XG5cbiAgICBpZiAoIWlzQ2FzZVNlbnNpdGl2ZSkge1xuICAgICAgdGV4dCA9IHRleHQudG9Mb3dlckNhc2UoKTtcbiAgICB9XG5cbiAgICAvLyBFeGFjdCBtYXRjaFxuICAgIGlmICh0aGlzLnBhdHRlcm4gPT09IHRleHQpIHtcbiAgICAgIGxldCByZXN1bHQgPSB7XG4gICAgICAgIGlzTWF0Y2g6IHRydWUsXG4gICAgICAgIHNjb3JlOiAwXG4gICAgICB9O1xuXG4gICAgICBpZiAoaW5jbHVkZU1hdGNoZXMpIHtcbiAgICAgICAgcmVzdWx0LmluZGljZXMgPSBbWzAsIHRleHQubGVuZ3RoIC0gMV1dO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0XG4gICAgfVxuXG4gICAgLy8gT3RoZXJ3aXNlLCB1c2UgQml0YXAgYWxnb3JpdGhtXG4gICAgY29uc3Qge1xuICAgICAgbG9jYXRpb24sXG4gICAgICBkaXN0YW5jZSxcbiAgICAgIHRocmVzaG9sZCxcbiAgICAgIGZpbmRBbGxNYXRjaGVzLFxuICAgICAgbWluTWF0Y2hDaGFyTGVuZ3RoLFxuICAgICAgaWdub3JlTG9jYXRpb25cbiAgICB9ID0gdGhpcy5vcHRpb25zO1xuXG4gICAgbGV0IGFsbEluZGljZXMgPSBbXTtcbiAgICBsZXQgdG90YWxTY29yZSA9IDA7XG4gICAgbGV0IGhhc01hdGNoZXMgPSBmYWxzZTtcblxuICAgIHRoaXMuY2h1bmtzLmZvckVhY2goKHsgcGF0dGVybiwgYWxwaGFiZXQsIHN0YXJ0SW5kZXggfSkgPT4ge1xuICAgICAgY29uc3QgeyBpc01hdGNoLCBzY29yZSwgaW5kaWNlcyB9ID0gc2VhcmNoKHRleHQsIHBhdHRlcm4sIGFscGhhYmV0LCB7XG4gICAgICAgIGxvY2F0aW9uOiBsb2NhdGlvbiArIHN0YXJ0SW5kZXgsXG4gICAgICAgIGRpc3RhbmNlLFxuICAgICAgICB0aHJlc2hvbGQsXG4gICAgICAgIGZpbmRBbGxNYXRjaGVzLFxuICAgICAgICBtaW5NYXRjaENoYXJMZW5ndGgsXG4gICAgICAgIGluY2x1ZGVNYXRjaGVzLFxuICAgICAgICBpZ25vcmVMb2NhdGlvblxuICAgICAgfSk7XG5cbiAgICAgIGlmIChpc01hdGNoKSB7XG4gICAgICAgIGhhc01hdGNoZXMgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICB0b3RhbFNjb3JlICs9IHNjb3JlO1xuXG4gICAgICBpZiAoaXNNYXRjaCAmJiBpbmRpY2VzKSB7XG4gICAgICAgIGFsbEluZGljZXMgPSBbLi4uYWxsSW5kaWNlcywgLi4uaW5kaWNlc107XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBsZXQgcmVzdWx0ID0ge1xuICAgICAgaXNNYXRjaDogaGFzTWF0Y2hlcyxcbiAgICAgIHNjb3JlOiBoYXNNYXRjaGVzID8gdG90YWxTY29yZSAvIHRoaXMuY2h1bmtzLmxlbmd0aCA6IDFcbiAgICB9O1xuXG4gICAgaWYgKGhhc01hdGNoZXMgJiYgaW5jbHVkZU1hdGNoZXMpIHtcbiAgICAgIHJlc3VsdC5pbmRpY2VzID0gYWxsSW5kaWNlcztcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0XG4gIH1cbn1cblxuY2xhc3MgQmFzZU1hdGNoIHtcbiAgY29uc3RydWN0b3IocGF0dGVybikge1xuICAgIHRoaXMucGF0dGVybiA9IHBhdHRlcm47XG4gIH1cbiAgc3RhdGljIGlzTXVsdGlNYXRjaChwYXR0ZXJuKSB7XG4gICAgcmV0dXJuIGdldE1hdGNoKHBhdHRlcm4sIHRoaXMubXVsdGlSZWdleClcbiAgfVxuICBzdGF0aWMgaXNTaW5nbGVNYXRjaChwYXR0ZXJuKSB7XG4gICAgcmV0dXJuIGdldE1hdGNoKHBhdHRlcm4sIHRoaXMuc2luZ2xlUmVnZXgpXG4gIH1cbiAgc2VhcmNoKC8qdGV4dCovKSB7fVxufVxuXG5mdW5jdGlvbiBnZXRNYXRjaChwYXR0ZXJuLCBleHApIHtcbiAgY29uc3QgbWF0Y2hlcyA9IHBhdHRlcm4ubWF0Y2goZXhwKTtcbiAgcmV0dXJuIG1hdGNoZXMgPyBtYXRjaGVzWzFdIDogbnVsbFxufVxuXG4vLyBUb2tlbjogJ2ZpbGVcblxuY2xhc3MgRXhhY3RNYXRjaCBleHRlbmRzIEJhc2VNYXRjaCB7XG4gIGNvbnN0cnVjdG9yKHBhdHRlcm4pIHtcbiAgICBzdXBlcihwYXR0ZXJuKTtcbiAgfVxuICBzdGF0aWMgZ2V0IHR5cGUoKSB7XG4gICAgcmV0dXJuICdleGFjdCdcbiAgfVxuICBzdGF0aWMgZ2V0IG11bHRpUmVnZXgoKSB7XG4gICAgcmV0dXJuIC9ePVwiKC4qKVwiJC9cbiAgfVxuICBzdGF0aWMgZ2V0IHNpbmdsZVJlZ2V4KCkge1xuICAgIHJldHVybiAvXj0oLiopJC9cbiAgfVxuICBzZWFyY2godGV4dCkge1xuICAgIGNvbnN0IGlzTWF0Y2ggPSB0ZXh0ID09PSB0aGlzLnBhdHRlcm47XG5cbiAgICByZXR1cm4ge1xuICAgICAgaXNNYXRjaCxcbiAgICAgIHNjb3JlOiBpc01hdGNoID8gMCA6IDEsXG4gICAgICBpbmRpY2VzOiBbMCwgdGhpcy5wYXR0ZXJuLmxlbmd0aCAtIDFdXG4gICAgfVxuICB9XG59XG5cbi8vIFRva2VuOiAhZmlyZVxuXG5jbGFzcyBJbnZlcnNlRXhhY3RNYXRjaCBleHRlbmRzIEJhc2VNYXRjaCB7XG4gIGNvbnN0cnVjdG9yKHBhdHRlcm4pIHtcbiAgICBzdXBlcihwYXR0ZXJuKTtcbiAgfVxuICBzdGF0aWMgZ2V0IHR5cGUoKSB7XG4gICAgcmV0dXJuICdpbnZlcnNlLWV4YWN0J1xuICB9XG4gIHN0YXRpYyBnZXQgbXVsdGlSZWdleCgpIHtcbiAgICByZXR1cm4gL14hXCIoLiopXCIkL1xuICB9XG4gIHN0YXRpYyBnZXQgc2luZ2xlUmVnZXgoKSB7XG4gICAgcmV0dXJuIC9eISguKikkL1xuICB9XG4gIHNlYXJjaCh0ZXh0KSB7XG4gICAgY29uc3QgaW5kZXggPSB0ZXh0LmluZGV4T2YodGhpcy5wYXR0ZXJuKTtcbiAgICBjb25zdCBpc01hdGNoID0gaW5kZXggPT09IC0xO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGlzTWF0Y2gsXG4gICAgICBzY29yZTogaXNNYXRjaCA/IDAgOiAxLFxuICAgICAgaW5kaWNlczogWzAsIHRleHQubGVuZ3RoIC0gMV1cbiAgICB9XG4gIH1cbn1cblxuLy8gVG9rZW46IF5maWxlXG5cbmNsYXNzIFByZWZpeEV4YWN0TWF0Y2ggZXh0ZW5kcyBCYXNlTWF0Y2gge1xuICBjb25zdHJ1Y3RvcihwYXR0ZXJuKSB7XG4gICAgc3VwZXIocGF0dGVybik7XG4gIH1cbiAgc3RhdGljIGdldCB0eXBlKCkge1xuICAgIHJldHVybiAncHJlZml4LWV4YWN0J1xuICB9XG4gIHN0YXRpYyBnZXQgbXVsdGlSZWdleCgpIHtcbiAgICByZXR1cm4gL15cXF5cIiguKilcIiQvXG4gIH1cbiAgc3RhdGljIGdldCBzaW5nbGVSZWdleCgpIHtcbiAgICByZXR1cm4gL15cXF4oLiopJC9cbiAgfVxuICBzZWFyY2godGV4dCkge1xuICAgIGNvbnN0IGlzTWF0Y2ggPSB0ZXh0LnN0YXJ0c1dpdGgodGhpcy5wYXR0ZXJuKTtcblxuICAgIHJldHVybiB7XG4gICAgICBpc01hdGNoLFxuICAgICAgc2NvcmU6IGlzTWF0Y2ggPyAwIDogMSxcbiAgICAgIGluZGljZXM6IFswLCB0aGlzLnBhdHRlcm4ubGVuZ3RoIC0gMV1cbiAgICB9XG4gIH1cbn1cblxuLy8gVG9rZW46ICFeZmlyZVxuXG5jbGFzcyBJbnZlcnNlUHJlZml4RXhhY3RNYXRjaCBleHRlbmRzIEJhc2VNYXRjaCB7XG4gIGNvbnN0cnVjdG9yKHBhdHRlcm4pIHtcbiAgICBzdXBlcihwYXR0ZXJuKTtcbiAgfVxuICBzdGF0aWMgZ2V0IHR5cGUoKSB7XG4gICAgcmV0dXJuICdpbnZlcnNlLXByZWZpeC1leGFjdCdcbiAgfVxuICBzdGF0aWMgZ2V0IG11bHRpUmVnZXgoKSB7XG4gICAgcmV0dXJuIC9eIVxcXlwiKC4qKVwiJC9cbiAgfVxuICBzdGF0aWMgZ2V0IHNpbmdsZVJlZ2V4KCkge1xuICAgIHJldHVybiAvXiFcXF4oLiopJC9cbiAgfVxuICBzZWFyY2godGV4dCkge1xuICAgIGNvbnN0IGlzTWF0Y2ggPSAhdGV4dC5zdGFydHNXaXRoKHRoaXMucGF0dGVybik7XG5cbiAgICByZXR1cm4ge1xuICAgICAgaXNNYXRjaCxcbiAgICAgIHNjb3JlOiBpc01hdGNoID8gMCA6IDEsXG4gICAgICBpbmRpY2VzOiBbMCwgdGV4dC5sZW5ndGggLSAxXVxuICAgIH1cbiAgfVxufVxuXG4vLyBUb2tlbjogLmZpbGUkXG5cbmNsYXNzIFN1ZmZpeEV4YWN0TWF0Y2ggZXh0ZW5kcyBCYXNlTWF0Y2gge1xuICBjb25zdHJ1Y3RvcihwYXR0ZXJuKSB7XG4gICAgc3VwZXIocGF0dGVybik7XG4gIH1cbiAgc3RhdGljIGdldCB0eXBlKCkge1xuICAgIHJldHVybiAnc3VmZml4LWV4YWN0J1xuICB9XG4gIHN0YXRpYyBnZXQgbXVsdGlSZWdleCgpIHtcbiAgICByZXR1cm4gL15cIiguKilcIlxcJCQvXG4gIH1cbiAgc3RhdGljIGdldCBzaW5nbGVSZWdleCgpIHtcbiAgICByZXR1cm4gL14oLiopXFwkJC9cbiAgfVxuICBzZWFyY2godGV4dCkge1xuICAgIGNvbnN0IGlzTWF0Y2ggPSB0ZXh0LmVuZHNXaXRoKHRoaXMucGF0dGVybik7XG5cbiAgICByZXR1cm4ge1xuICAgICAgaXNNYXRjaCxcbiAgICAgIHNjb3JlOiBpc01hdGNoID8gMCA6IDEsXG4gICAgICBpbmRpY2VzOiBbdGV4dC5sZW5ndGggLSB0aGlzLnBhdHRlcm4ubGVuZ3RoLCB0ZXh0Lmxlbmd0aCAtIDFdXG4gICAgfVxuICB9XG59XG5cbi8vIFRva2VuOiAhLmZpbGUkXG5cbmNsYXNzIEludmVyc2VTdWZmaXhFeGFjdE1hdGNoIGV4dGVuZHMgQmFzZU1hdGNoIHtcbiAgY29uc3RydWN0b3IocGF0dGVybikge1xuICAgIHN1cGVyKHBhdHRlcm4pO1xuICB9XG4gIHN0YXRpYyBnZXQgdHlwZSgpIHtcbiAgICByZXR1cm4gJ2ludmVyc2Utc3VmZml4LWV4YWN0J1xuICB9XG4gIHN0YXRpYyBnZXQgbXVsdGlSZWdleCgpIHtcbiAgICByZXR1cm4gL14hXCIoLiopXCJcXCQkL1xuICB9XG4gIHN0YXRpYyBnZXQgc2luZ2xlUmVnZXgoKSB7XG4gICAgcmV0dXJuIC9eISguKilcXCQkL1xuICB9XG4gIHNlYXJjaCh0ZXh0KSB7XG4gICAgY29uc3QgaXNNYXRjaCA9ICF0ZXh0LmVuZHNXaXRoKHRoaXMucGF0dGVybik7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlzTWF0Y2gsXG4gICAgICBzY29yZTogaXNNYXRjaCA/IDAgOiAxLFxuICAgICAgaW5kaWNlczogWzAsIHRleHQubGVuZ3RoIC0gMV1cbiAgICB9XG4gIH1cbn1cblxuY2xhc3MgRnV6enlNYXRjaCBleHRlbmRzIEJhc2VNYXRjaCB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHBhdHRlcm4sXG4gICAge1xuICAgICAgbG9jYXRpb24gPSBDb25maWcubG9jYXRpb24sXG4gICAgICB0aHJlc2hvbGQgPSBDb25maWcudGhyZXNob2xkLFxuICAgICAgZGlzdGFuY2UgPSBDb25maWcuZGlzdGFuY2UsXG4gICAgICBpbmNsdWRlTWF0Y2hlcyA9IENvbmZpZy5pbmNsdWRlTWF0Y2hlcyxcbiAgICAgIGZpbmRBbGxNYXRjaGVzID0gQ29uZmlnLmZpbmRBbGxNYXRjaGVzLFxuICAgICAgbWluTWF0Y2hDaGFyTGVuZ3RoID0gQ29uZmlnLm1pbk1hdGNoQ2hhckxlbmd0aCxcbiAgICAgIGlzQ2FzZVNlbnNpdGl2ZSA9IENvbmZpZy5pc0Nhc2VTZW5zaXRpdmUsXG4gICAgICBpZ25vcmVMb2NhdGlvbiA9IENvbmZpZy5pZ25vcmVMb2NhdGlvblxuICAgIH0gPSB7fVxuICApIHtcbiAgICBzdXBlcihwYXR0ZXJuKTtcbiAgICB0aGlzLl9iaXRhcFNlYXJjaCA9IG5ldyBCaXRhcFNlYXJjaChwYXR0ZXJuLCB7XG4gICAgICBsb2NhdGlvbixcbiAgICAgIHRocmVzaG9sZCxcbiAgICAgIGRpc3RhbmNlLFxuICAgICAgaW5jbHVkZU1hdGNoZXMsXG4gICAgICBmaW5kQWxsTWF0Y2hlcyxcbiAgICAgIG1pbk1hdGNoQ2hhckxlbmd0aCxcbiAgICAgIGlzQ2FzZVNlbnNpdGl2ZSxcbiAgICAgIGlnbm9yZUxvY2F0aW9uXG4gICAgfSk7XG4gIH1cbiAgc3RhdGljIGdldCB0eXBlKCkge1xuICAgIHJldHVybiAnZnV6enknXG4gIH1cbiAgc3RhdGljIGdldCBtdWx0aVJlZ2V4KCkge1xuICAgIHJldHVybiAvXlwiKC4qKVwiJC9cbiAgfVxuICBzdGF0aWMgZ2V0IHNpbmdsZVJlZ2V4KCkge1xuICAgIHJldHVybiAvXiguKikkL1xuICB9XG4gIHNlYXJjaCh0ZXh0KSB7XG4gICAgcmV0dXJuIHRoaXMuX2JpdGFwU2VhcmNoLnNlYXJjaEluKHRleHQpXG4gIH1cbn1cblxuLy8gVG9rZW46ICdmaWxlXG5cbmNsYXNzIEluY2x1ZGVNYXRjaCBleHRlbmRzIEJhc2VNYXRjaCB7XG4gIGNvbnN0cnVjdG9yKHBhdHRlcm4pIHtcbiAgICBzdXBlcihwYXR0ZXJuKTtcbiAgfVxuICBzdGF0aWMgZ2V0IHR5cGUoKSB7XG4gICAgcmV0dXJuICdpbmNsdWRlJ1xuICB9XG4gIHN0YXRpYyBnZXQgbXVsdGlSZWdleCgpIHtcbiAgICByZXR1cm4gL14nXCIoLiopXCIkL1xuICB9XG4gIHN0YXRpYyBnZXQgc2luZ2xlUmVnZXgoKSB7XG4gICAgcmV0dXJuIC9eJyguKikkL1xuICB9XG4gIHNlYXJjaCh0ZXh0KSB7XG4gICAgbGV0IGxvY2F0aW9uID0gMDtcbiAgICBsZXQgaW5kZXg7XG5cbiAgICBjb25zdCBpbmRpY2VzID0gW107XG4gICAgY29uc3QgcGF0dGVybkxlbiA9IHRoaXMucGF0dGVybi5sZW5ndGg7XG5cbiAgICAvLyBHZXQgYWxsIGV4YWN0IG1hdGNoZXNcbiAgICB3aGlsZSAoKGluZGV4ID0gdGV4dC5pbmRleE9mKHRoaXMucGF0dGVybiwgbG9jYXRpb24pKSA+IC0xKSB7XG4gICAgICBsb2NhdGlvbiA9IGluZGV4ICsgcGF0dGVybkxlbjtcbiAgICAgIGluZGljZXMucHVzaChbaW5kZXgsIGxvY2F0aW9uIC0gMV0pO1xuICAgIH1cblxuICAgIGNvbnN0IGlzTWF0Y2ggPSAhIWluZGljZXMubGVuZ3RoO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGlzTWF0Y2gsXG4gICAgICBzY29yZTogaXNNYXRjaCA/IDAgOiAxLFxuICAgICAgaW5kaWNlc1xuICAgIH1cbiAgfVxufVxuXG4vLyBcdTI3NTdPcmRlciBpcyBpbXBvcnRhbnQuIERPIE5PVCBDSEFOR0UuXG5jb25zdCBzZWFyY2hlcnMgPSBbXG4gIEV4YWN0TWF0Y2gsXG4gIEluY2x1ZGVNYXRjaCxcbiAgUHJlZml4RXhhY3RNYXRjaCxcbiAgSW52ZXJzZVByZWZpeEV4YWN0TWF0Y2gsXG4gIEludmVyc2VTdWZmaXhFeGFjdE1hdGNoLFxuICBTdWZmaXhFeGFjdE1hdGNoLFxuICBJbnZlcnNlRXhhY3RNYXRjaCxcbiAgRnV6enlNYXRjaFxuXTtcblxuY29uc3Qgc2VhcmNoZXJzTGVuID0gc2VhcmNoZXJzLmxlbmd0aDtcblxuLy8gUmVnZXggdG8gc3BsaXQgYnkgc3BhY2VzLCBidXQga2VlcCBhbnl0aGluZyBpbiBxdW90ZXMgdG9nZXRoZXJcbmNvbnN0IFNQQUNFX1JFID0gLyArKD89KD86W15cXFwiXSpcXFwiW15cXFwiXSpcXFwiKSpbXlxcXCJdKiQpLztcbmNvbnN0IE9SX1RPS0VOID0gJ3wnO1xuXG4vLyBSZXR1cm4gYSAyRCBhcnJheSByZXByZXNlbnRhdGlvbiBvZiB0aGUgcXVlcnksIGZvciBzaW1wbGVyIHBhcnNpbmcuXG4vLyBFeGFtcGxlOlxuLy8gXCJeY29yZSBnbyQgfCByYiQgfCBweSQgeHkkXCIgPT4gW1tcIl5jb3JlXCIsIFwiZ28kXCJdLCBbXCJyYiRcIl0sIFtcInB5JFwiLCBcInh5JFwiXV1cbmZ1bmN0aW9uIHBhcnNlUXVlcnkocGF0dGVybiwgb3B0aW9ucyA9IHt9KSB7XG4gIHJldHVybiBwYXR0ZXJuLnNwbGl0KE9SX1RPS0VOKS5tYXAoKGl0ZW0pID0+IHtcbiAgICBsZXQgcXVlcnkgPSBpdGVtXG4gICAgICAudHJpbSgpXG4gICAgICAuc3BsaXQoU1BBQ0VfUkUpXG4gICAgICAuZmlsdGVyKChpdGVtKSA9PiBpdGVtICYmICEhaXRlbS50cmltKCkpO1xuXG4gICAgbGV0IHJlc3VsdHMgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gcXVlcnkubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDEpIHtcbiAgICAgIGNvbnN0IHF1ZXJ5SXRlbSA9IHF1ZXJ5W2ldO1xuXG4gICAgICAvLyAxLiBIYW5kbGUgbXVsdGlwbGUgcXVlcnkgbWF0Y2ggKGkuZSwgb25jZSB0aGF0IGFyZSBxdW90ZWQsIGxpa2UgYFwiaGVsbG8gd29ybGRcImApXG4gICAgICBsZXQgZm91bmQgPSBmYWxzZTtcbiAgICAgIGxldCBpZHggPSAtMTtcbiAgICAgIHdoaWxlICghZm91bmQgJiYgKytpZHggPCBzZWFyY2hlcnNMZW4pIHtcbiAgICAgICAgY29uc3Qgc2VhcmNoZXIgPSBzZWFyY2hlcnNbaWR4XTtcbiAgICAgICAgbGV0IHRva2VuID0gc2VhcmNoZXIuaXNNdWx0aU1hdGNoKHF1ZXJ5SXRlbSk7XG4gICAgICAgIGlmICh0b2tlbikge1xuICAgICAgICAgIHJlc3VsdHMucHVzaChuZXcgc2VhcmNoZXIodG9rZW4sIG9wdGlvbnMpKTtcbiAgICAgICAgICBmb3VuZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGZvdW5kKSB7XG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIC8vIDIuIEhhbmRsZSBzaW5nbGUgcXVlcnkgbWF0Y2hlcyAoaS5lLCBvbmNlIHRoYXQgYXJlICpub3QqIHF1b3RlZClcbiAgICAgIGlkeCA9IC0xO1xuICAgICAgd2hpbGUgKCsraWR4IDwgc2VhcmNoZXJzTGVuKSB7XG4gICAgICAgIGNvbnN0IHNlYXJjaGVyID0gc2VhcmNoZXJzW2lkeF07XG4gICAgICAgIGxldCB0b2tlbiA9IHNlYXJjaGVyLmlzU2luZ2xlTWF0Y2gocXVlcnlJdGVtKTtcbiAgICAgICAgaWYgKHRva2VuKSB7XG4gICAgICAgICAgcmVzdWx0cy5wdXNoKG5ldyBzZWFyY2hlcih0b2tlbiwgb3B0aW9ucykpO1xuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0c1xuICB9KVxufVxuXG4vLyBUaGVzZSBleHRlbmRlZCBtYXRjaGVycyBjYW4gcmV0dXJuIGFuIGFycmF5IG9mIG1hdGNoZXMsIGFzIG9wcG9zZWRcbi8vIHRvIGEgc2luZ2wgbWF0Y2hcbmNvbnN0IE11bHRpTWF0Y2hTZXQgPSBuZXcgU2V0KFtGdXp6eU1hdGNoLnR5cGUsIEluY2x1ZGVNYXRjaC50eXBlXSk7XG5cbi8qKlxuICogQ29tbWFuZC1saWtlIHNlYXJjaGluZ1xuICogPT09PT09PT09PT09PT09PT09PT09PVxuICpcbiAqIEdpdmVuIG11bHRpcGxlIHNlYXJjaCB0ZXJtcyBkZWxpbWl0ZWQgYnkgc3BhY2VzLmUuZy4gYF5qc2NyaXB0IC5weXRob24kIHJ1YnkgIWphdmFgLFxuICogc2VhcmNoIGluIGEgZ2l2ZW4gdGV4dC5cbiAqXG4gKiBTZWFyY2ggc3ludGF4OlxuICpcbiAqIHwgVG9rZW4gICAgICAgfCBNYXRjaCB0eXBlICAgICAgICAgICAgICAgICB8IERlc2NyaXB0aW9uICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAqIHwgLS0tLS0tLS0tLS0gfCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSB8IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIHxcbiAqIHwgYGpzY3JpcHRgICAgfCBmdXp6eS1tYXRjaCAgICAgICAgICAgICAgICB8IEl0ZW1zIHRoYXQgZnV6enkgbWF0Y2ggYGpzY3JpcHRgICAgICAgIHxcbiAqIHwgYD1zY2hlbWVgICAgfCBleGFjdC1tYXRjaCAgICAgICAgICAgICAgICB8IEl0ZW1zIHRoYXQgYXJlIGBzY2hlbWVgICAgICAgICAgICAgICAgIHxcbiAqIHwgYCdweXRob25gICAgfCBpbmNsdWRlLW1hdGNoICAgICAgICAgICAgICB8IEl0ZW1zIHRoYXQgaW5jbHVkZSBgcHl0aG9uYCAgICAgICAgICAgIHxcbiAqIHwgYCFydWJ5YCAgICAgfCBpbnZlcnNlLWV4YWN0LW1hdGNoICAgICAgICB8IEl0ZW1zIHRoYXQgZG8gbm90IGluY2x1ZGUgYHJ1YnlgICAgICAgIHxcbiAqIHwgYF5qYXZhYCAgICAgfCBwcmVmaXgtZXhhY3QtbWF0Y2ggICAgICAgICB8IEl0ZW1zIHRoYXQgc3RhcnQgd2l0aCBgamF2YWAgICAgICAgICAgIHxcbiAqIHwgYCFeZWFybGFuZ2AgfCBpbnZlcnNlLXByZWZpeC1leGFjdC1tYXRjaCB8IEl0ZW1zIHRoYXQgZG8gbm90IHN0YXJ0IHdpdGggYGVhcmxhbmdgIHxcbiAqIHwgYC5qcyRgICAgICAgfCBzdWZmaXgtZXhhY3QtbWF0Y2ggICAgICAgICB8IEl0ZW1zIHRoYXQgZW5kIHdpdGggYC5qc2AgICAgICAgICAgICAgIHxcbiAqIHwgYCEuZ28kYCAgICAgfCBpbnZlcnNlLXN1ZmZpeC1leGFjdC1tYXRjaCB8IEl0ZW1zIHRoYXQgZG8gbm90IGVuZCB3aXRoIGAuZ29gICAgICAgIHxcbiAqXG4gKiBBIHNpbmdsZSBwaXBlIGNoYXJhY3RlciBhY3RzIGFzIGFuIE9SIG9wZXJhdG9yLiBGb3IgZXhhbXBsZSwgdGhlIGZvbGxvd2luZ1xuICogcXVlcnkgbWF0Y2hlcyBlbnRyaWVzIHRoYXQgc3RhcnQgd2l0aCBgY29yZWAgYW5kIGVuZCB3aXRoIGVpdGhlcmBnb2AsIGByYmAsXG4gKiBvcmBweWAuXG4gKlxuICogYGBgXG4gKiBeY29yZSBnbyQgfCByYiQgfCBweSRcbiAqIGBgYFxuICovXG5jbGFzcyBFeHRlbmRlZFNlYXJjaCB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHBhdHRlcm4sXG4gICAge1xuICAgICAgaXNDYXNlU2Vuc2l0aXZlID0gQ29uZmlnLmlzQ2FzZVNlbnNpdGl2ZSxcbiAgICAgIGluY2x1ZGVNYXRjaGVzID0gQ29uZmlnLmluY2x1ZGVNYXRjaGVzLFxuICAgICAgbWluTWF0Y2hDaGFyTGVuZ3RoID0gQ29uZmlnLm1pbk1hdGNoQ2hhckxlbmd0aCxcbiAgICAgIGlnbm9yZUxvY2F0aW9uID0gQ29uZmlnLmlnbm9yZUxvY2F0aW9uLFxuICAgICAgZmluZEFsbE1hdGNoZXMgPSBDb25maWcuZmluZEFsbE1hdGNoZXMsXG4gICAgICBsb2NhdGlvbiA9IENvbmZpZy5sb2NhdGlvbixcbiAgICAgIHRocmVzaG9sZCA9IENvbmZpZy50aHJlc2hvbGQsXG4gICAgICBkaXN0YW5jZSA9IENvbmZpZy5kaXN0YW5jZVxuICAgIH0gPSB7fVxuICApIHtcbiAgICB0aGlzLnF1ZXJ5ID0gbnVsbDtcbiAgICB0aGlzLm9wdGlvbnMgPSB7XG4gICAgICBpc0Nhc2VTZW5zaXRpdmUsXG4gICAgICBpbmNsdWRlTWF0Y2hlcyxcbiAgICAgIG1pbk1hdGNoQ2hhckxlbmd0aCxcbiAgICAgIGZpbmRBbGxNYXRjaGVzLFxuICAgICAgaWdub3JlTG9jYXRpb24sXG4gICAgICBsb2NhdGlvbixcbiAgICAgIHRocmVzaG9sZCxcbiAgICAgIGRpc3RhbmNlXG4gICAgfTtcblxuICAgIHRoaXMucGF0dGVybiA9IGlzQ2FzZVNlbnNpdGl2ZSA/IHBhdHRlcm4gOiBwYXR0ZXJuLnRvTG93ZXJDYXNlKCk7XG4gICAgdGhpcy5xdWVyeSA9IHBhcnNlUXVlcnkodGhpcy5wYXR0ZXJuLCB0aGlzLm9wdGlvbnMpO1xuICB9XG5cbiAgc3RhdGljIGNvbmRpdGlvbihfLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIG9wdGlvbnMudXNlRXh0ZW5kZWRTZWFyY2hcbiAgfVxuXG4gIHNlYXJjaEluKHRleHQpIHtcbiAgICBjb25zdCBxdWVyeSA9IHRoaXMucXVlcnk7XG5cbiAgICBpZiAoIXF1ZXJ5KSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpc01hdGNoOiBmYWxzZSxcbiAgICAgICAgc2NvcmU6IDFcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCB7IGluY2x1ZGVNYXRjaGVzLCBpc0Nhc2VTZW5zaXRpdmUgfSA9IHRoaXMub3B0aW9ucztcblxuICAgIHRleHQgPSBpc0Nhc2VTZW5zaXRpdmUgPyB0ZXh0IDogdGV4dC50b0xvd2VyQ2FzZSgpO1xuXG4gICAgbGV0IG51bU1hdGNoZXMgPSAwO1xuICAgIGxldCBhbGxJbmRpY2VzID0gW107XG4gICAgbGV0IHRvdGFsU2NvcmUgPSAwO1xuXG4gICAgLy8gT1JzXG4gICAgZm9yIChsZXQgaSA9IDAsIHFMZW4gPSBxdWVyeS5sZW5ndGg7IGkgPCBxTGVuOyBpICs9IDEpIHtcbiAgICAgIGNvbnN0IHNlYXJjaGVycyA9IHF1ZXJ5W2ldO1xuXG4gICAgICAvLyBSZXNldCBpbmRpY2VzXG4gICAgICBhbGxJbmRpY2VzLmxlbmd0aCA9IDA7XG4gICAgICBudW1NYXRjaGVzID0gMDtcblxuICAgICAgLy8gQU5Ec1xuICAgICAgZm9yIChsZXQgaiA9IDAsIHBMZW4gPSBzZWFyY2hlcnMubGVuZ3RoOyBqIDwgcExlbjsgaiArPSAxKSB7XG4gICAgICAgIGNvbnN0IHNlYXJjaGVyID0gc2VhcmNoZXJzW2pdO1xuICAgICAgICBjb25zdCB7IGlzTWF0Y2gsIGluZGljZXMsIHNjb3JlIH0gPSBzZWFyY2hlci5zZWFyY2godGV4dCk7XG5cbiAgICAgICAgaWYgKGlzTWF0Y2gpIHtcbiAgICAgICAgICBudW1NYXRjaGVzICs9IDE7XG4gICAgICAgICAgdG90YWxTY29yZSArPSBzY29yZTtcbiAgICAgICAgICBpZiAoaW5jbHVkZU1hdGNoZXMpIHtcbiAgICAgICAgICAgIGNvbnN0IHR5cGUgPSBzZWFyY2hlci5jb25zdHJ1Y3Rvci50eXBlO1xuICAgICAgICAgICAgaWYgKE11bHRpTWF0Y2hTZXQuaGFzKHR5cGUpKSB7XG4gICAgICAgICAgICAgIGFsbEluZGljZXMgPSBbLi4uYWxsSW5kaWNlcywgLi4uaW5kaWNlc107XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBhbGxJbmRpY2VzLnB1c2goaW5kaWNlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRvdGFsU2NvcmUgPSAwO1xuICAgICAgICAgIG51bU1hdGNoZXMgPSAwO1xuICAgICAgICAgIGFsbEluZGljZXMubGVuZ3RoID0gMDtcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIE9SIGNvbmRpdGlvbiwgc28gaWYgVFJVRSwgcmV0dXJuXG4gICAgICBpZiAobnVtTWF0Y2hlcykge1xuICAgICAgICBsZXQgcmVzdWx0ID0ge1xuICAgICAgICAgIGlzTWF0Y2g6IHRydWUsXG4gICAgICAgICAgc2NvcmU6IHRvdGFsU2NvcmUgLyBudW1NYXRjaGVzXG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKGluY2x1ZGVNYXRjaGVzKSB7XG4gICAgICAgICAgcmVzdWx0LmluZGljZXMgPSBhbGxJbmRpY2VzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIE5vdGhpbmcgd2FzIG1hdGNoZWRcbiAgICByZXR1cm4ge1xuICAgICAgaXNNYXRjaDogZmFsc2UsXG4gICAgICBzY29yZTogMVxuICAgIH1cbiAgfVxufVxuXG5jb25zdCByZWdpc3RlcmVkU2VhcmNoZXJzID0gW107XG5cbmZ1bmN0aW9uIHJlZ2lzdGVyKC4uLmFyZ3MpIHtcbiAgcmVnaXN0ZXJlZFNlYXJjaGVycy5wdXNoKC4uLmFyZ3MpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVTZWFyY2hlcihwYXR0ZXJuLCBvcHRpb25zKSB7XG4gIGZvciAobGV0IGkgPSAwLCBsZW4gPSByZWdpc3RlcmVkU2VhcmNoZXJzLmxlbmd0aDsgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgbGV0IHNlYXJjaGVyQ2xhc3MgPSByZWdpc3RlcmVkU2VhcmNoZXJzW2ldO1xuICAgIGlmIChzZWFyY2hlckNsYXNzLmNvbmRpdGlvbihwYXR0ZXJuLCBvcHRpb25zKSkge1xuICAgICAgcmV0dXJuIG5ldyBzZWFyY2hlckNsYXNzKHBhdHRlcm4sIG9wdGlvbnMpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5ldyBCaXRhcFNlYXJjaChwYXR0ZXJuLCBvcHRpb25zKVxufVxuXG5jb25zdCBMb2dpY2FsT3BlcmF0b3IgPSB7XG4gIEFORDogJyRhbmQnLFxuICBPUjogJyRvcidcbn07XG5cbmNvbnN0IEtleVR5cGUgPSB7XG4gIFBBVEg6ICckcGF0aCcsXG4gIFBBVFRFUk46ICckdmFsJ1xufTtcblxuY29uc3QgaXNFeHByZXNzaW9uID0gKHF1ZXJ5KSA9PlxuICAhIShxdWVyeVtMb2dpY2FsT3BlcmF0b3IuQU5EXSB8fCBxdWVyeVtMb2dpY2FsT3BlcmF0b3IuT1JdKTtcblxuY29uc3QgaXNQYXRoID0gKHF1ZXJ5KSA9PiAhIXF1ZXJ5W0tleVR5cGUuUEFUSF07XG5cbmNvbnN0IGlzTGVhZiA9IChxdWVyeSkgPT5cbiAgIWlzQXJyYXkocXVlcnkpICYmIGlzT2JqZWN0KHF1ZXJ5KSAmJiAhaXNFeHByZXNzaW9uKHF1ZXJ5KTtcblxuY29uc3QgY29udmVydFRvRXhwbGljaXQgPSAocXVlcnkpID0+ICh7XG4gIFtMb2dpY2FsT3BlcmF0b3IuQU5EXTogT2JqZWN0LmtleXMocXVlcnkpLm1hcCgoa2V5KSA9PiAoe1xuICAgIFtrZXldOiBxdWVyeVtrZXldXG4gIH0pKVxufSk7XG5cbi8vIFdoZW4gYGF1dG9gIGlzIGB0cnVlYCwgdGhlIHBhcnNlIGZ1bmN0aW9uIHdpbGwgaW5mZXIgYW5kIGluaXRpYWxpemUgYW5kIGFkZFxuLy8gdGhlIGFwcHJvcHJpYXRlIGBTZWFyY2hlcmAgaW5zdGFuY2VcbmZ1bmN0aW9uIHBhcnNlKHF1ZXJ5LCBvcHRpb25zLCB7IGF1dG8gPSB0cnVlIH0gPSB7fSkge1xuICBjb25zdCBuZXh0ID0gKHF1ZXJ5KSA9PiB7XG4gICAgbGV0IGtleXMgPSBPYmplY3Qua2V5cyhxdWVyeSk7XG5cbiAgICBjb25zdCBpc1F1ZXJ5UGF0aCA9IGlzUGF0aChxdWVyeSk7XG5cbiAgICBpZiAoIWlzUXVlcnlQYXRoICYmIGtleXMubGVuZ3RoID4gMSAmJiAhaXNFeHByZXNzaW9uKHF1ZXJ5KSkge1xuICAgICAgcmV0dXJuIG5leHQoY29udmVydFRvRXhwbGljaXQocXVlcnkpKVxuICAgIH1cblxuICAgIGlmIChpc0xlYWYocXVlcnkpKSB7XG4gICAgICBjb25zdCBrZXkgPSBpc1F1ZXJ5UGF0aCA/IHF1ZXJ5W0tleVR5cGUuUEFUSF0gOiBrZXlzWzBdO1xuXG4gICAgICBjb25zdCBwYXR0ZXJuID0gaXNRdWVyeVBhdGggPyBxdWVyeVtLZXlUeXBlLlBBVFRFUk5dIDogcXVlcnlba2V5XTtcblxuICAgICAgaWYgKCFpc1N0cmluZyhwYXR0ZXJuKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoTE9HSUNBTF9TRUFSQ0hfSU5WQUxJRF9RVUVSWV9GT1JfS0VZKGtleSkpXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG9iaiA9IHtcbiAgICAgICAga2V5SWQ6IGNyZWF0ZUtleUlkKGtleSksXG4gICAgICAgIHBhdHRlcm5cbiAgICAgIH07XG5cbiAgICAgIGlmIChhdXRvKSB7XG4gICAgICAgIG9iai5zZWFyY2hlciA9IGNyZWF0ZVNlYXJjaGVyKHBhdHRlcm4sIG9wdGlvbnMpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gb2JqXG4gICAgfVxuXG4gICAgbGV0IG5vZGUgPSB7XG4gICAgICBjaGlsZHJlbjogW10sXG4gICAgICBvcGVyYXRvcjoga2V5c1swXVxuICAgIH07XG5cbiAgICBrZXlzLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgY29uc3QgdmFsdWUgPSBxdWVyeVtrZXldO1xuXG4gICAgICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgdmFsdWUuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICAgIG5vZGUuY2hpbGRyZW4ucHVzaChuZXh0KGl0ZW0pKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gbm9kZVxuICB9O1xuXG4gIGlmICghaXNFeHByZXNzaW9uKHF1ZXJ5KSkge1xuICAgIHF1ZXJ5ID0gY29udmVydFRvRXhwbGljaXQocXVlcnkpO1xuICB9XG5cbiAgcmV0dXJuIG5leHQocXVlcnkpXG59XG5cbi8vIFByYWN0aWNhbCBzY29yaW5nIGZ1bmN0aW9uXG5mdW5jdGlvbiBjb21wdXRlU2NvcmUoXG4gIHJlc3VsdHMsXG4gIHsgaWdub3JlRmllbGROb3JtID0gQ29uZmlnLmlnbm9yZUZpZWxkTm9ybSB9XG4pIHtcbiAgcmVzdWx0cy5mb3JFYWNoKChyZXN1bHQpID0+IHtcbiAgICBsZXQgdG90YWxTY29yZSA9IDE7XG5cbiAgICByZXN1bHQubWF0Y2hlcy5mb3JFYWNoKCh7IGtleSwgbm9ybSwgc2NvcmUgfSkgPT4ge1xuICAgICAgY29uc3Qgd2VpZ2h0ID0ga2V5ID8ga2V5LndlaWdodCA6IG51bGw7XG5cbiAgICAgIHRvdGFsU2NvcmUgKj0gTWF0aC5wb3coXG4gICAgICAgIHNjb3JlID09PSAwICYmIHdlaWdodCA/IE51bWJlci5FUFNJTE9OIDogc2NvcmUsXG4gICAgICAgICh3ZWlnaHQgfHwgMSkgKiAoaWdub3JlRmllbGROb3JtID8gMSA6IG5vcm0pXG4gICAgICApO1xuICAgIH0pO1xuXG4gICAgcmVzdWx0LnNjb3JlID0gdG90YWxTY29yZTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHRyYW5zZm9ybU1hdGNoZXMocmVzdWx0LCBkYXRhKSB7XG4gIGNvbnN0IG1hdGNoZXMgPSByZXN1bHQubWF0Y2hlcztcbiAgZGF0YS5tYXRjaGVzID0gW107XG5cbiAgaWYgKCFpc0RlZmluZWQobWF0Y2hlcykpIHtcbiAgICByZXR1cm5cbiAgfVxuXG4gIG1hdGNoZXMuZm9yRWFjaCgobWF0Y2gpID0+IHtcbiAgICBpZiAoIWlzRGVmaW5lZChtYXRjaC5pbmRpY2VzKSB8fCAhbWF0Y2guaW5kaWNlcy5sZW5ndGgpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvbnN0IHsgaW5kaWNlcywgdmFsdWUgfSA9IG1hdGNoO1xuXG4gICAgbGV0IG9iaiA9IHtcbiAgICAgIGluZGljZXMsXG4gICAgICB2YWx1ZVxuICAgIH07XG5cbiAgICBpZiAobWF0Y2gua2V5KSB7XG4gICAgICBvYmoua2V5ID0gbWF0Y2gua2V5LnNyYztcbiAgICB9XG5cbiAgICBpZiAobWF0Y2guaWR4ID4gLTEpIHtcbiAgICAgIG9iai5yZWZJbmRleCA9IG1hdGNoLmlkeDtcbiAgICB9XG5cbiAgICBkYXRhLm1hdGNoZXMucHVzaChvYmopO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gdHJhbnNmb3JtU2NvcmUocmVzdWx0LCBkYXRhKSB7XG4gIGRhdGEuc2NvcmUgPSByZXN1bHQuc2NvcmU7XG59XG5cbmZ1bmN0aW9uIGZvcm1hdChcbiAgcmVzdWx0cyxcbiAgZG9jcyxcbiAge1xuICAgIGluY2x1ZGVNYXRjaGVzID0gQ29uZmlnLmluY2x1ZGVNYXRjaGVzLFxuICAgIGluY2x1ZGVTY29yZSA9IENvbmZpZy5pbmNsdWRlU2NvcmVcbiAgfSA9IHt9XG4pIHtcbiAgY29uc3QgdHJhbnNmb3JtZXJzID0gW107XG5cbiAgaWYgKGluY2x1ZGVNYXRjaGVzKSB0cmFuc2Zvcm1lcnMucHVzaCh0cmFuc2Zvcm1NYXRjaGVzKTtcbiAgaWYgKGluY2x1ZGVTY29yZSkgdHJhbnNmb3JtZXJzLnB1c2godHJhbnNmb3JtU2NvcmUpO1xuXG4gIHJldHVybiByZXN1bHRzLm1hcCgocmVzdWx0KSA9PiB7XG4gICAgY29uc3QgeyBpZHggfSA9IHJlc3VsdDtcblxuICAgIGNvbnN0IGRhdGEgPSB7XG4gICAgICBpdGVtOiBkb2NzW2lkeF0sXG4gICAgICByZWZJbmRleDogaWR4XG4gICAgfTtcblxuICAgIGlmICh0cmFuc2Zvcm1lcnMubGVuZ3RoKSB7XG4gICAgICB0cmFuc2Zvcm1lcnMuZm9yRWFjaCgodHJhbnNmb3JtZXIpID0+IHtcbiAgICAgICAgdHJhbnNmb3JtZXIocmVzdWx0LCBkYXRhKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBkYXRhXG4gIH0pXG59XG5cbmNsYXNzIEZ1c2Uge1xuICBjb25zdHJ1Y3Rvcihkb2NzLCBvcHRpb25zID0ge30sIGluZGV4KSB7XG4gICAgdGhpcy5vcHRpb25zID0geyAuLi5Db25maWcsIC4uLm9wdGlvbnMgfTtcblxuICAgIGlmIChcbiAgICAgIHRoaXMub3B0aW9ucy51c2VFeHRlbmRlZFNlYXJjaCAmJlxuICAgICAgIXRydWVcbiAgICApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihFWFRFTkRFRF9TRUFSQ0hfVU5BVkFJTEFCTEUpXG4gICAgfVxuXG4gICAgdGhpcy5fa2V5U3RvcmUgPSBuZXcgS2V5U3RvcmUodGhpcy5vcHRpb25zLmtleXMpO1xuXG4gICAgdGhpcy5zZXRDb2xsZWN0aW9uKGRvY3MsIGluZGV4KTtcbiAgfVxuXG4gIHNldENvbGxlY3Rpb24oZG9jcywgaW5kZXgpIHtcbiAgICB0aGlzLl9kb2NzID0gZG9jcztcblxuICAgIGlmIChpbmRleCAmJiAhKGluZGV4IGluc3RhbmNlb2YgRnVzZUluZGV4KSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKElOQ09SUkVDVF9JTkRFWF9UWVBFKVxuICAgIH1cblxuICAgIHRoaXMuX215SW5kZXggPVxuICAgICAgaW5kZXggfHxcbiAgICAgIGNyZWF0ZUluZGV4KHRoaXMub3B0aW9ucy5rZXlzLCB0aGlzLl9kb2NzLCB7XG4gICAgICAgIGdldEZuOiB0aGlzLm9wdGlvbnMuZ2V0Rm4sXG4gICAgICAgIGZpZWxkTm9ybVdlaWdodDogdGhpcy5vcHRpb25zLmZpZWxkTm9ybVdlaWdodFxuICAgICAgfSk7XG4gIH1cblxuICBhZGQoZG9jKSB7XG4gICAgaWYgKCFpc0RlZmluZWQoZG9jKSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgdGhpcy5fZG9jcy5wdXNoKGRvYyk7XG4gICAgdGhpcy5fbXlJbmRleC5hZGQoZG9jKTtcbiAgfVxuXG4gIHJlbW92ZShwcmVkaWNhdGUgPSAoLyogZG9jLCBpZHggKi8pID0+IGZhbHNlKSB7XG4gICAgY29uc3QgcmVzdWx0cyA9IFtdO1xuXG4gICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHRoaXMuX2RvY3MubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDEpIHtcbiAgICAgIGNvbnN0IGRvYyA9IHRoaXMuX2RvY3NbaV07XG4gICAgICBpZiAocHJlZGljYXRlKGRvYywgaSkpIHtcbiAgICAgICAgdGhpcy5yZW1vdmVBdChpKTtcbiAgICAgICAgaSAtPSAxO1xuICAgICAgICBsZW4gLT0gMTtcblxuICAgICAgICByZXN1bHRzLnB1c2goZG9jKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0c1xuICB9XG5cbiAgcmVtb3ZlQXQoaWR4KSB7XG4gICAgdGhpcy5fZG9jcy5zcGxpY2UoaWR4LCAxKTtcbiAgICB0aGlzLl9teUluZGV4LnJlbW92ZUF0KGlkeCk7XG4gIH1cblxuICBnZXRJbmRleCgpIHtcbiAgICByZXR1cm4gdGhpcy5fbXlJbmRleFxuICB9XG5cbiAgc2VhcmNoKHF1ZXJ5LCB7IGxpbWl0ID0gLTEgfSA9IHt9KSB7XG4gICAgY29uc3Qge1xuICAgICAgaW5jbHVkZU1hdGNoZXMsXG4gICAgICBpbmNsdWRlU2NvcmUsXG4gICAgICBzaG91bGRTb3J0LFxuICAgICAgc29ydEZuLFxuICAgICAgaWdub3JlRmllbGROb3JtXG4gICAgfSA9IHRoaXMub3B0aW9ucztcblxuICAgIGxldCByZXN1bHRzID0gaXNTdHJpbmcocXVlcnkpXG4gICAgICA/IGlzU3RyaW5nKHRoaXMuX2RvY3NbMF0pXG4gICAgICAgID8gdGhpcy5fc2VhcmNoU3RyaW5nTGlzdChxdWVyeSlcbiAgICAgICAgOiB0aGlzLl9zZWFyY2hPYmplY3RMaXN0KHF1ZXJ5KVxuICAgICAgOiB0aGlzLl9zZWFyY2hMb2dpY2FsKHF1ZXJ5KTtcblxuICAgIGNvbXB1dGVTY29yZShyZXN1bHRzLCB7IGlnbm9yZUZpZWxkTm9ybSB9KTtcblxuICAgIGlmIChzaG91bGRTb3J0KSB7XG4gICAgICByZXN1bHRzLnNvcnQoc29ydEZuKTtcbiAgICB9XG5cbiAgICBpZiAoaXNOdW1iZXIobGltaXQpICYmIGxpbWl0ID4gLTEpIHtcbiAgICAgIHJlc3VsdHMgPSByZXN1bHRzLnNsaWNlKDAsIGxpbWl0KTtcbiAgICB9XG5cbiAgICByZXR1cm4gZm9ybWF0KHJlc3VsdHMsIHRoaXMuX2RvY3MsIHtcbiAgICAgIGluY2x1ZGVNYXRjaGVzLFxuICAgICAgaW5jbHVkZVNjb3JlXG4gICAgfSlcbiAgfVxuXG4gIF9zZWFyY2hTdHJpbmdMaXN0KHF1ZXJ5KSB7XG4gICAgY29uc3Qgc2VhcmNoZXIgPSBjcmVhdGVTZWFyY2hlcihxdWVyeSwgdGhpcy5vcHRpb25zKTtcbiAgICBjb25zdCB7IHJlY29yZHMgfSA9IHRoaXMuX215SW5kZXg7XG4gICAgY29uc3QgcmVzdWx0cyA9IFtdO1xuXG4gICAgLy8gSXRlcmF0ZSBvdmVyIGV2ZXJ5IHN0cmluZyBpbiB0aGUgaW5kZXhcbiAgICByZWNvcmRzLmZvckVhY2goKHsgdjogdGV4dCwgaTogaWR4LCBuOiBub3JtIH0pID0+IHtcbiAgICAgIGlmICghaXNEZWZpbmVkKHRleHQpKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBjb25zdCB7IGlzTWF0Y2gsIHNjb3JlLCBpbmRpY2VzIH0gPSBzZWFyY2hlci5zZWFyY2hJbih0ZXh0KTtcblxuICAgICAgaWYgKGlzTWF0Y2gpIHtcbiAgICAgICAgcmVzdWx0cy5wdXNoKHtcbiAgICAgICAgICBpdGVtOiB0ZXh0LFxuICAgICAgICAgIGlkeCxcbiAgICAgICAgICBtYXRjaGVzOiBbeyBzY29yZSwgdmFsdWU6IHRleHQsIG5vcm0sIGluZGljZXMgfV1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVzdWx0c1xuICB9XG5cbiAgX3NlYXJjaExvZ2ljYWwocXVlcnkpIHtcblxuICAgIGNvbnN0IGV4cHJlc3Npb24gPSBwYXJzZShxdWVyeSwgdGhpcy5vcHRpb25zKTtcblxuICAgIGNvbnN0IGV2YWx1YXRlID0gKG5vZGUsIGl0ZW0sIGlkeCkgPT4ge1xuICAgICAgaWYgKCFub2RlLmNoaWxkcmVuKSB7XG4gICAgICAgIGNvbnN0IHsga2V5SWQsIHNlYXJjaGVyIH0gPSBub2RlO1xuXG4gICAgICAgIGNvbnN0IG1hdGNoZXMgPSB0aGlzLl9maW5kTWF0Y2hlcyh7XG4gICAgICAgICAga2V5OiB0aGlzLl9rZXlTdG9yZS5nZXQoa2V5SWQpLFxuICAgICAgICAgIHZhbHVlOiB0aGlzLl9teUluZGV4LmdldFZhbHVlRm9ySXRlbUF0S2V5SWQoaXRlbSwga2V5SWQpLFxuICAgICAgICAgIHNlYXJjaGVyXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChtYXRjaGVzICYmIG1hdGNoZXMubGVuZ3RoKSB7XG4gICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgaWR4LFxuICAgICAgICAgICAgICBpdGVtLFxuICAgICAgICAgICAgICBtYXRjaGVzXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFtdXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJlcyA9IFtdO1xuICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IG5vZGUuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDEpIHtcbiAgICAgICAgY29uc3QgY2hpbGQgPSBub2RlLmNoaWxkcmVuW2ldO1xuICAgICAgICBjb25zdCByZXN1bHQgPSBldmFsdWF0ZShjaGlsZCwgaXRlbSwgaWR4KTtcbiAgICAgICAgaWYgKHJlc3VsdC5sZW5ndGgpIHtcbiAgICAgICAgICByZXMucHVzaCguLi5yZXN1bHQpO1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGUub3BlcmF0b3IgPT09IExvZ2ljYWxPcGVyYXRvci5BTkQpIHtcbiAgICAgICAgICByZXR1cm4gW11cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc1xuICAgIH07XG5cbiAgICBjb25zdCByZWNvcmRzID0gdGhpcy5fbXlJbmRleC5yZWNvcmRzO1xuICAgIGNvbnN0IHJlc3VsdE1hcCA9IHt9O1xuICAgIGNvbnN0IHJlc3VsdHMgPSBbXTtcblxuICAgIHJlY29yZHMuZm9yRWFjaCgoeyAkOiBpdGVtLCBpOiBpZHggfSkgPT4ge1xuICAgICAgaWYgKGlzRGVmaW5lZChpdGVtKSkge1xuICAgICAgICBsZXQgZXhwUmVzdWx0cyA9IGV2YWx1YXRlKGV4cHJlc3Npb24sIGl0ZW0sIGlkeCk7XG5cbiAgICAgICAgaWYgKGV4cFJlc3VsdHMubGVuZ3RoKSB7XG4gICAgICAgICAgLy8gRGVkdXBlIHdoZW4gYWRkaW5nXG4gICAgICAgICAgaWYgKCFyZXN1bHRNYXBbaWR4XSkge1xuICAgICAgICAgICAgcmVzdWx0TWFwW2lkeF0gPSB7IGlkeCwgaXRlbSwgbWF0Y2hlczogW10gfTtcbiAgICAgICAgICAgIHJlc3VsdHMucHVzaChyZXN1bHRNYXBbaWR4XSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGV4cFJlc3VsdHMuZm9yRWFjaCgoeyBtYXRjaGVzIH0pID0+IHtcbiAgICAgICAgICAgIHJlc3VsdE1hcFtpZHhdLm1hdGNoZXMucHVzaCguLi5tYXRjaGVzKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlc3VsdHNcbiAgfVxuXG4gIF9zZWFyY2hPYmplY3RMaXN0KHF1ZXJ5KSB7XG4gICAgY29uc3Qgc2VhcmNoZXIgPSBjcmVhdGVTZWFyY2hlcihxdWVyeSwgdGhpcy5vcHRpb25zKTtcbiAgICBjb25zdCB7IGtleXMsIHJlY29yZHMgfSA9IHRoaXMuX215SW5kZXg7XG4gICAgY29uc3QgcmVzdWx0cyA9IFtdO1xuXG4gICAgLy8gTGlzdCBpcyBBcnJheTxPYmplY3Q+XG4gICAgcmVjb3Jkcy5mb3JFYWNoKCh7ICQ6IGl0ZW0sIGk6IGlkeCB9KSA9PiB7XG4gICAgICBpZiAoIWlzRGVmaW5lZChpdGVtKSkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgbGV0IG1hdGNoZXMgPSBbXTtcblxuICAgICAgLy8gSXRlcmF0ZSBvdmVyIGV2ZXJ5IGtleSAoaS5lLCBwYXRoKSwgYW5kIGZldGNoIHRoZSB2YWx1ZSBhdCB0aGF0IGtleVxuICAgICAga2V5cy5mb3JFYWNoKChrZXksIGtleUluZGV4KSA9PiB7XG4gICAgICAgIG1hdGNoZXMucHVzaChcbiAgICAgICAgICAuLi50aGlzLl9maW5kTWF0Y2hlcyh7XG4gICAgICAgICAgICBrZXksXG4gICAgICAgICAgICB2YWx1ZTogaXRlbVtrZXlJbmRleF0sXG4gICAgICAgICAgICBzZWFyY2hlclxuICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgICB9KTtcblxuICAgICAgaWYgKG1hdGNoZXMubGVuZ3RoKSB7XG4gICAgICAgIHJlc3VsdHMucHVzaCh7XG4gICAgICAgICAgaWR4LFxuICAgICAgICAgIGl0ZW0sXG4gICAgICAgICAgbWF0Y2hlc1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiByZXN1bHRzXG4gIH1cbiAgX2ZpbmRNYXRjaGVzKHsga2V5LCB2YWx1ZSwgc2VhcmNoZXIgfSkge1xuICAgIGlmICghaXNEZWZpbmVkKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIFtdXG4gICAgfVxuXG4gICAgbGV0IG1hdGNoZXMgPSBbXTtcblxuICAgIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgICAgdmFsdWUuZm9yRWFjaCgoeyB2OiB0ZXh0LCBpOiBpZHgsIG46IG5vcm0gfSkgPT4ge1xuICAgICAgICBpZiAoIWlzRGVmaW5lZCh0ZXh0KSkge1xuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgeyBpc01hdGNoLCBzY29yZSwgaW5kaWNlcyB9ID0gc2VhcmNoZXIuc2VhcmNoSW4odGV4dCk7XG5cbiAgICAgICAgaWYgKGlzTWF0Y2gpIHtcbiAgICAgICAgICBtYXRjaGVzLnB1c2goe1xuICAgICAgICAgICAgc2NvcmUsXG4gICAgICAgICAgICBrZXksXG4gICAgICAgICAgICB2YWx1ZTogdGV4dCxcbiAgICAgICAgICAgIGlkeCxcbiAgICAgICAgICAgIG5vcm0sXG4gICAgICAgICAgICBpbmRpY2VzXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCB7IHY6IHRleHQsIG46IG5vcm0gfSA9IHZhbHVlO1xuXG4gICAgICBjb25zdCB7IGlzTWF0Y2gsIHNjb3JlLCBpbmRpY2VzIH0gPSBzZWFyY2hlci5zZWFyY2hJbih0ZXh0KTtcblxuICAgICAgaWYgKGlzTWF0Y2gpIHtcbiAgICAgICAgbWF0Y2hlcy5wdXNoKHsgc2NvcmUsIGtleSwgdmFsdWU6IHRleHQsIG5vcm0sIGluZGljZXMgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG1hdGNoZXNcbiAgfVxufVxuXG5GdXNlLnZlcnNpb24gPSAnNy4wLjAnO1xuRnVzZS5jcmVhdGVJbmRleCA9IGNyZWF0ZUluZGV4O1xuRnVzZS5wYXJzZUluZGV4ID0gcGFyc2VJbmRleDtcbkZ1c2UuY29uZmlnID0gQ29uZmlnO1xuXG57XG4gIEZ1c2UucGFyc2VRdWVyeSA9IHBhcnNlO1xufVxuXG57XG4gIHJlZ2lzdGVyKEV4dGVuZGVkU2VhcmNoKTtcbn1cblxuZXhwb3J0IHsgRnVzZSBhcyBkZWZhdWx0IH07XG4iLCAiaW1wb3J0IHsgaW5pdGlhbGl6ZUFwcCB9IGZyb20gXCJmaXJlYmFzZS9hcHBcIjtcclxuaW1wb3J0IHsgZ2V0U3RvcmFnZSwgcmVmLCBnZXREb3dubG9hZFVSTCB9IGZyb20gXCJmaXJlYmFzZS9zdG9yYWdlXCI7XHJcbmltcG9ydCBGdXNlIGZyb20gJ2Z1c2UuanMnO1xyXG5cclxuZnVuY3Rpb24gY29uZmlnKCkge1xyXG4gICAgY29uc3QgZmlyZWJhc2VDb25maWcgPSB7XHJcbiAgICAgICAgYXBpS2V5OiBcIkFJemFTeUE3N0hZdFZkc0pEX1Nkd0RnZFZXdkdEZURBMUlJcXVLWVwiLFxyXG4gICAgICAgIGF1dGhEb21haW46IFwic2Z4LXJvY2tzLmZpcmViYXNlYXBwLmNvbVwiLFxyXG4gICAgICAgIHByb2plY3RJZDogXCJzZngtcm9ja3NcIixcclxuICAgICAgICBzdG9yYWdlQnVja2V0OiBcInNmeC1yb2Nrcy5hcHBzcG90LmNvbVwiLFxyXG4gICAgICAgIG1lc3NhZ2luZ1NlbmRlcklkOiBcIjIyMTMyMDI2OTkyMFwiLFxyXG4gICAgICAgIGFwcElkOiBcIjE6MjIxMzIwMjY5OTIwOndlYjowODA0ZWQ5ZGZlMDhjNDY2Njc3MzA1XCIsXHJcbiAgICAgICAgbWVhc3VyZW1lbnRJZDogXCJHLVY1MDZIS1MzTkVcIlxyXG4gICAgfTtcclxuXHJcbiAgICBpbml0aWFsaXplQXBwKGZpcmViYXNlQ29uZmlnKTtcclxufVxyXG5cclxuY29uZmlnKCk7XHJcblxyXG5mdW5jdGlvbiBnb2pvZGV2KCkge1xyXG4gICAgbGV0IGVtbWFudWVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnb2pvZGV2XCIpO1xyXG4gICAgbGV0IGluZGV4ID0gMTtcclxuICAgIHNldEludGVydmFsKCgpID0+IHtcclxuXHJcbiAgICAgICAgZW1tYW51ZWwuY2xhc3NMaXN0LnJlbW92ZShcImZhZGVJblwiKTtcclxuICAgICAgICBlbW1hbnVlbC5vZmZzZXRXaWR0aDtcclxuICAgICAgICBlbW1hbnVlbC5jbGFzc0xpc3QuYWRkKFwiZmFkZUluXCIpO1xyXG5cclxuICAgICAgICBpZiAoaW5kZXggPT0gMCkge1xyXG4gICAgICAgICAgICBlbW1hbnVlbC5zcmMgPSBcImltYWdlcy9nb2pvZGV2LndlYnBcIjtcclxuICAgICAgICAgICAgaW5kZXggPSAxO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgZW1tYW51ZWwuc3JjID0gXCJpbWFnZXMvbG9nby53ZWJwXCI7XHJcbiAgICAgICAgICAgIGluZGV4ID0gMDtcclxuICAgICAgICB9XHJcbiAgICB9LCAzNTAwKVxyXG59XHJcblxyXG5nb2pvZGV2KClcclxuXHJcblxyXG5jb25zdCBzdG9yYWdlID0gZ2V0U3RvcmFnZSgpOyAvLyAhIGdsb2JhbFxyXG5hc3luYyBmdW5jdGlvbiBnZXRSZWZfanNvbihyZWZJdGVtKSB7XHJcbiAgICBjb25zdCB1cmwgPSBhd2FpdCBnZXREb3dubG9hZFVSTChyZWZJdGVtKTtcclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsLCB7IG1vZGU6ICdjb3JzJyB9KTtcclxuICAgIGxldCBkYXRhID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xyXG4gICAgZGF0YSA9IEpTT04ucGFyc2UoZGF0YSk7XHJcbiAgICByZXR1cm4gZGF0YTtcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gZ2V0UmVmX3RleHQocmVmSXRlbSkge1xyXG4gICAgY29uc3QgdXJsID0gYXdhaXQgZ2V0RG93bmxvYWRVUkwocmVmSXRlbSk7XHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVybCwgeyBtb2RlOiAnY29ycycgfSk7XHJcbiAgICBsZXQgZGF0YSA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKTtcclxuICAgIHJldHVybiBkYXRhO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzaG93TG9hZEVycm9yKCkge1xyXG4gICAgY29uc3QgaGVhZGVyX2NvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYXRfaGVhZGVyX2NvbnRhaW5lcicpO1xyXG4gICAgaGVhZGVyX2NvbnRhaW5lci50ZXh0Q29udGVudCA9ICcnO1xyXG4gICAgY29uc3QgbWVzc2FnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgbWVzc2FnZS5jbGFzc0xpc3QuYWRkKCdjYXQtaGVhZGVyJywgJ2JsYWNrLWJnJywgJ3doaXRlJywgJ2JveC1zaGFkb3cnKTtcclxuICAgIG1lc3NhZ2UudGV4dENvbnRlbnQgPSBcIkNvdWxkbid0IGxvYWQgc291bmRzIHJpZ2h0IG5vdy4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlci5cIjtcclxuICAgIGhlYWRlcl9jb250YWluZXIuYXBwZW5kQ2hpbGQobWVzc2FnZSk7XHJcblxyXG4gICAgY29uc3Qgc2VhcmNoSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFyZ2V0X3RleHQnKTtcclxuICAgIGlmIChzZWFyY2hJbnB1dCkgc2VhcmNoSW5wdXQuZGlzYWJsZWQgPSB0cnVlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzZXR1cFNlYXJjaChzZWFyY2hJbmRleCwgY2F0ZWdvcnlFbnRyaWVzKSB7XHJcbiAgICBjb25zdCBzZWFyY2hJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YXJnZXRfdGV4dCcpO1xyXG4gICAgY29uc3Qgbm9SZXN1bHRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25vLXJlc3VsdHMnKTtcclxuICAgIGNvbnN0IGhlYWRlckNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYXRfaGVhZGVyX2NvbnRhaW5lcicpO1xyXG4gICAgaWYgKCFzZWFyY2hJbnB1dCB8fCAhaGVhZGVyQ29udGFpbmVyKSByZXR1cm47XHJcblxyXG4gICAgLy8gZGVkaWNhdGVkIGNvbnRhaW5lciBmb3Igc2VhcmNoIHJlc3VsdHMsIHJlbmRlcmVkIGluIHJlbGV2YW5jZSBvcmRlclxyXG4gICAgLy8gKG5hbWUgbWF0Y2hlcyByYW5rZWQgYWhlYWQgb2YgZXZlcnl0aGluZyBlbHNlLCBpbmRlcGVuZGVudCBvZiBjYXRlZ29yeSlcclxuICAgIGNvbnN0IHJlc3VsdHNDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIHJlc3VsdHNDb250YWluZXIuY2xhc3NMaXN0LmFkZCgnYmxhY2stYmcnLCAnd2hpdGUnLCAnYm94LXNoYWRvdycsICdpdGVtLWNvbnRhaW5lcicpO1xyXG4gICAgcmVzdWx0c0NvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgaGVhZGVyQ29udGFpbmVyLmluc2VydEJlZm9yZShyZXN1bHRzQ29udGFpbmVyLCBoZWFkZXJDb250YWluZXIuZmlyc3RDaGlsZCk7XHJcblxyXG4gICAgY29uc3QgZnVzZSA9IG5ldyBGdXNlKHNlYXJjaEluZGV4LCB7XHJcbiAgICAgICAga2V5czogWyduYW1lJ10sXHJcbiAgICAgICAgdGhyZXNob2xkOiAwLjIsXHJcbiAgICAgICAgaWdub3JlTG9jYXRpb246IHRydWUsXHJcbiAgICAgICAgbWluTWF0Y2hDaGFyTGVuZ3RoOiAzLFxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gUmFua3MgbmFtZSBtYXRjaGVzIGFoZWFkIG9mIGZ1enp5IG5vaXNlOiBhbiBleGFjdCB3b3JkIG1hdGNoIChlLmcuIFwiY2FyXCJcclxuICAgIC8vIG1hdGNoaW5nIFwiR29vZnkgQ2FyIEhvcm5cIikgb3V0cmFua3MgYSB3b3JkIG1lcmVseSBzdGFydGluZyB3aXRoIHRoZSBxdWVyeVxyXG4gICAgLy8gKGUuZy4gXCJDYXJtZW5cIiksIHdoaWNoIG91dHJhbmtzIGEgcGxhaW4gc3Vic3RyaW5nIG1hdGNoLCB3aGljaCBvdXRyYW5rcyBhXHJcbiAgICAvLyBmdXp6eS90eXBvLXRvbGVyYW50IGZhbGxiYWNrIGZvciBhbnl0aGluZyBub3QgY2F1Z2h0IGJ5IHRoZSBhYm92ZS5cclxuICAgIGZ1bmN0aW9uIHJhbmtSZXN1bHRzKHJhd1F1ZXJ5KSB7XHJcbiAgICAgICAgY29uc3QgcXVlcnkgPSByYXdRdWVyeS50cmltKCkudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICBjb25zdCBleGFjdFdvcmQgPSBbXTtcclxuICAgICAgICBjb25zdCB3b3JkU3RhcnRzID0gW107XHJcbiAgICAgICAgY29uc3Qgc3Vic3RyaW5nID0gW107XHJcbiAgICAgICAgY29uc3QgbWF0Y2hlZCA9IG5ldyBTZXQoKTtcclxuXHJcbiAgICAgICAgc2VhcmNoSW5kZXguZm9yRWFjaCgoZW50cnkpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgbG93ZXJOYW1lID0gZW50cnkubmFtZS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgICAgICBjb25zdCB3b3JkcyA9IGxvd2VyTmFtZS5zcGxpdCgvXFxzKy8pO1xyXG5cclxuICAgICAgICAgICAgaWYgKHdvcmRzLmluY2x1ZGVzKHF1ZXJ5KSkge1xyXG4gICAgICAgICAgICAgICAgZXhhY3RXb3JkLnB1c2goZW50cnkpO1xyXG4gICAgICAgICAgICAgICAgbWF0Y2hlZC5hZGQoZW50cnkpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHdvcmRzLnNvbWUoKHcpID0+IHcuc3RhcnRzV2l0aChxdWVyeSkpKSB7XHJcbiAgICAgICAgICAgICAgICB3b3JkU3RhcnRzLnB1c2goZW50cnkpO1xyXG4gICAgICAgICAgICAgICAgbWF0Y2hlZC5hZGQoZW50cnkpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGxvd2VyTmFtZS5pbmNsdWRlcyhxdWVyeSkpIHtcclxuICAgICAgICAgICAgICAgIHN1YnN0cmluZy5wdXNoKGVudHJ5KTtcclxuICAgICAgICAgICAgICAgIG1hdGNoZWQuYWRkKGVudHJ5KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zdCBmdXp6eSA9IGZ1c2Uuc2VhcmNoKHJhd1F1ZXJ5KVxyXG4gICAgICAgICAgICAubWFwKChyZXN1bHQpID0+IHJlc3VsdC5pdGVtKVxyXG4gICAgICAgICAgICAuZmlsdGVyKChlbnRyeSkgPT4gIW1hdGNoZWQuaGFzKGVudHJ5KSk7XHJcblxyXG4gICAgICAgIHJldHVybiBbLi4uZXhhY3RXb3JkLCAuLi53b3JkU3RhcnRzLCAuLi5zdWJzdHJpbmcsIC4uLmZ1enp5XTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBzaG93Q2F0ZWdvcml6ZWRWaWV3KCkge1xyXG4gICAgICAgIC8vIHJlcGxheSBvcmlnaW5hbCBhcHBlbmQgb3JkZXIgdG8gcmVzdG9yZSBlYWNoIGNhdGVnb3J5J3MgaXRlbSBzZXF1ZW5jZVxyXG4gICAgICAgIHNlYXJjaEluZGV4LmZvckVhY2goKHsgaXRlbUVsLCBjb250YWluZXJFbCB9KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnRhaW5lckVsLmFwcGVuZENoaWxkKGl0ZW1FbCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgY2F0ZWdvcnlFbnRyaWVzLmZvckVhY2goKHsgaGVhZGVyRWwsIGNvbnRhaW5lckVsIH0pID0+IHtcclxuICAgICAgICAgICAgaGVhZGVyRWwuc3R5bGUuZGlzcGxheSA9ICcnO1xyXG4gICAgICAgICAgICBjb250YWluZXJFbC5zdHlsZS5kaXNwbGF5ID0gJyc7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmVzdWx0c0NvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICAgIG5vUmVzdWx0cy5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHNob3dSZXN1bHRzKHF1ZXJ5KSB7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0cyA9IHJhbmtSZXN1bHRzKHF1ZXJ5KTtcclxuXHJcbiAgICAgICAgY2F0ZWdvcnlFbnRyaWVzLmZvckVhY2goKHsgaGVhZGVyRWwsIGNvbnRhaW5lckVsIH0pID0+IHtcclxuICAgICAgICAgICAgaGVhZGVyRWwuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICAgICAgY29udGFpbmVyRWwuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKHJlc3VsdHMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdHNDb250YWluZXIuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICAgICAgbm9SZXN1bHRzLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBub1Jlc3VsdHMuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICByZXN1bHRzQ29udGFpbmVyLnJlcGxhY2VDaGlsZHJlbigpO1xyXG4gICAgICAgIHJlc3VsdHMuZm9yRWFjaCgoZW50cnkpID0+IHtcclxuICAgICAgICAgICAgcmVzdWx0c0NvbnRhaW5lci5hcHBlbmRDaGlsZChlbnRyeS5pdGVtRWwpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJlc3VsdHNDb250YWluZXIuc3R5bGUuZGlzcGxheSA9ICdmbGV4JztcclxuICAgIH1cclxuXHJcbiAgICBzZWFyY2hJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIChlKSA9PiB7XHJcbiAgICAgICAgY29uc3QgcXVlcnkgPSBlLnRhcmdldC52YWx1ZS50cmltKCk7XHJcbiAgICAgICAgaWYgKCFxdWVyeSkge1xyXG4gICAgICAgICAgICBzaG93Q2F0ZWdvcml6ZWRWaWV3KCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgc2hvd1Jlc3VsdHMocXVlcnkpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzZXR1cEhvbWVMaW5rU2Nyb2xsKCkge1xyXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnYVtocmVmPVwiaW5kZXguaHRtbFwiXScpLmZvckVhY2goKGxpbmspID0+IHtcclxuICAgICAgICBsaW5rLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB3aW5kb3cuc2Nyb2xsVG8oeyB0b3A6IDAsIGJlaGF2aW9yOiAnc21vb3RoJyB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59XHJcblxyXG4vLyB3aWxsIGJlIHVzZWQgdG8gZmlsbCB1cCB0aGUgRE9NXHJcbmFzeW5jIGZ1bmN0aW9uIGxvYWRJbmZvKCkge1xyXG4gICAgY29uc3Qgc291bmRzUmVmID0gcmVmKHN0b3JhZ2UsICdzb3VuZHMuanNvbicpO1xyXG4gICAgY29uc3QgY2F0QXJyUmVmID0gcmVmKHN0b3JhZ2UsICdjYXRlZ29yeV9hcnJheS50eHQnKTsgLy8gYXJyYXkgb2YgY2F0ZWdvcnkgbmFtZXNcclxuXHJcbiAgICBjb25zdCBbY2F0QXJyUmVzdWx0LCBzb3VuZHNKc29uUmVzdWx0XSA9IGF3YWl0IFByb21pc2UuYWxsU2V0dGxlZChbZ2V0UmVmX3RleHQoY2F0QXJyUmVmKSwgZ2V0UmVmX2pzb24oc291bmRzUmVmKV0pO1xyXG5cclxuICAgIGlmIChjYXRBcnJSZXN1bHQuc3RhdHVzICE9PSAnZnVsZmlsbGVkJyB8fCBzb3VuZHNKc29uUmVzdWx0LnN0YXR1cyAhPT0gJ2Z1bGZpbGxlZCcpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gbG9hZCBzb3VuZCBkYXRhOicsIGNhdEFyclJlc3VsdC5yZWFzb24sIHNvdW5kc0pzb25SZXN1bHQucmVhc29uKTtcclxuICAgICAgICBzaG93TG9hZEVycm9yKCk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBjYXRBcnIgPSBjYXRBcnJSZXN1bHQudmFsdWUuc3BsaXQoJywnKTtcclxuICAgIHZhciBzb3VuZHNKc29uID0gc291bmRzSnNvblJlc3VsdC52YWx1ZTtcclxuXHJcbiAgICB2YXIgbmFtZTtcclxuICAgIHZhciBpZDtcclxuICAgIHZhciBjYXRlZ29yeTtcclxuICAgIHZhciBpbWdfdXJsO1xyXG4gICAgdmFyIHNvdW5kX3VybDtcclxuXHJcbiAgICB2YXIgaGVhZGVyX2NvbnRhaW5lclxyXG4gICAgdmFyIGl0ZW1zX2NvbnRhaW5lcjtcclxuICAgIGNvbnN0IHNlYXJjaEluZGV4ID0gW107XHJcbiAgICBjb25zdCBjYXRlZ29yeUVudHJpZXMgPSBbXTtcclxuICAgIGZvciAoY29uc3QgY2F0X2tleSBpbiBzb3VuZHNKc29uKSB7XHJcbiAgICAgICAgbGV0IGNhdCA9IHNvdW5kc0pzb25bY2F0X2tleV07XHJcbiAgICAgICAgY29uc3QgZGl2X2hlYWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgY29uc3QgZGl2X25vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjYXRfa2V5KTtcclxuICAgICAgICBkaXZfaGVhZGVyLmFwcGVuZENoaWxkKGRpdl9ub2RlKTtcclxuXHJcbiAgICAgICAgZGl2X2hlYWRlci5jbGFzc0xpc3QuYWRkKCdjYXQtaGVhZGVyJywgJ2JsYWNrLWJnJywgJ3doaXRlJywgJ2JveC1zaGFkb3cnKVxyXG4gICAgICAgIGhlYWRlcl9jb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2F0X2hlYWRlcl9jb250YWluZXInKTtcclxuICAgICAgICBoZWFkZXJfY29udGFpbmVyLmFwcGVuZENoaWxkKGRpdl9oZWFkZXIpO1xyXG5cclxuICAgICAgICBpdGVtc19jb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIGl0ZW1zX2NvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdibGFjay1iZycsICd3aGl0ZScsICdib3gtc2hhZG93JywgJ2l0ZW0tY29udGFpbmVyJyk7XHJcbiAgICAgICAgY2F0ZWdvcnlFbnRyaWVzLnB1c2goeyBoZWFkZXJFbDogZGl2X2hlYWRlciwgY29udGFpbmVyRWw6IGl0ZW1zX2NvbnRhaW5lciB9KTtcclxuXHJcbiAgICAgICAgZm9yIChjb25zdCBpdGVtX2tleSBpbiBjYXQpIHtcclxuICAgICAgICAgICAgbmFtZSA9IGNhdFtpdGVtX2tleV0ubmFtZTtcclxuICAgICAgICAgICAgaWQgPSBjYXRbaXRlbV9rZXldLmlkO1xyXG4gICAgICAgICAgICBjYXRlZ29yeSA9IGNhdFtpdGVtX2tleV0uY2F0ZWdvcnk7XHJcbiAgICAgICAgICAgIGltZ191cmwgPSBjYXRbaXRlbV9rZXldLmltZ191cmw7XHJcbiAgICAgICAgICAgIC8vID8gZHVubm8gd2h5IHRoaXMgaXMgb25seSB0aGUgbGFzdCBvbmVcclxuICAgICAgICAgICAgc291bmRfdXJsID0gY2F0W2l0ZW1fa2V5XS5zb3VuZF91cmw7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBpdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICAgICAgICAgIGl0ZW0uY2xhc3NMaXN0LnRvZ2dsZSgnaXRlbScpO1xyXG4gICAgICAgICAgICBjb25zdCBpbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xyXG4gICAgICAgICAgICBpbWcuY2xhc3NMaXN0LmFkZCgnaW1nLXN0eWxlJyk7XHJcbiAgICAgICAgICAgIGltZy5zcmMgPSBpbWdfdXJsO1xyXG4gICAgICAgICAgICBpbWcuaWQgPSBpZDtcclxuICAgICAgICAgICAgaXRlbS5hcHBlbmRDaGlsZChpbWcpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgaW1nX2Rlc2MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMycpO1xyXG4gICAgICAgICAgICBjb25zdCBpbWdfZGVzY19ub2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUobmFtZSk7XHJcbiAgICAgICAgICAgIGltZ19kZXNjLmFwcGVuZENoaWxkKGltZ19kZXNjX25vZGUpO1xyXG4gICAgICAgICAgICBpdGVtLmFwcGVuZENoaWxkKGltZ19kZXNjKTtcclxuXHJcbiAgICAgICAgICAgIGltZy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIHRoZSBzb3VuZF91cmwgdmFyaWFibGUgd2Fzbid0IHdvcmtpbmcgZm9yIHNvbWUgcmVhc29uXHJcbiAgICAgICAgICAgICAgICB2YXIgYXVkaW8gPSBuZXcgQXVkaW8oYCR7Y2F0W2l0ZW1fa2V5XS5zb3VuZF91cmx9YCk7XHJcbiAgICAgICAgICAgICAgICBhdWRpby5wbGF5KCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaXRlbXNfY29udGFpbmVyLmFwcGVuZENoaWxkKGl0ZW0pO1xyXG4gICAgICAgICAgICBzZWFyY2hJbmRleC5wdXNoKHsgbmFtZSwgaXRlbUVsOiBpdGVtLCBjb250YWluZXJFbDogaXRlbXNfY29udGFpbmVyIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBoZWFkZXJfY29udGFpbmVyLmFwcGVuZENoaWxkKGl0ZW1zX2NvbnRhaW5lcik7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0dXBTZWFyY2goc2VhcmNoSW5kZXgsIGNhdGVnb3J5RW50cmllcyk7XHJcbn1cclxuXHJcbnNldHVwSG9tZUxpbmtTY3JvbGwoKTtcclxuXHJcbmxvYWRJbmZvKCkuY2F0Y2goKGVycikgPT4ge1xyXG4gICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIGxvYWQgc291bmQgZGF0YTonLCBlcnIpO1xyXG4gICAgc2hvd0xvYWRFcnJvcigpO1xyXG59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QUFBLElBQ2hEO0FBRUEsZ0JBQVksYUFBYSxlQUFlO0FBQUEsRUFDNUM7QUFFQSxzQkFBb0I7QUFFcEIsV0FBUyxFQUFFLE1BQU0sQ0FBQyxRQUFRO0FBQ3RCLFlBQVEsTUFBTSw4QkFBOEIsR0FBRztBQUMvQyxrQkFBYztBQUFBLEVBQ2xCLENBQUM7IiwKICAibmFtZXMiOiBbInN0cmluZ1RvQnl0ZUFycmF5IiwgIm5hbWUiLCAiTG9nTGV2ZWwiLCAibmFtZSIsICJuYW1lIiwgInZlcnNpb24iLCAidGFyZ2V0IiwgIkRFRkFVTFRfRU5UUllfTkFNRSIsICJhcHBOYW1lIiwgImFwcENvbXBhdE5hbWUiLCAiYW5hbHl0aWNzTmFtZSIsICJhbmFseXRpY3NDb21wYXROYW1lIiwgImFwcENoZWNrTmFtZSIsICJhcHBDaGVja0NvbXBhdE5hbWUiLCAiYXV0aE5hbWUiLCAiYXV0aENvbXBhdE5hbWUiLCAiZGF0YWJhc2VOYW1lIiwgImRhdGFiYXNlQ29tcGF0TmFtZSIsICJmdW5jdGlvbnNOYW1lIiwgImZ1bmN0aW9uc0NvbXBhdE5hbWUiLCAiaW5zdGFsbGF0aW9uc05hbWUiLCAiaW5zdGFsbGF0aW9uc0NvbXBhdE5hbWUiLCAibWVzc2FnaW5nTmFtZSIsICJtZXNzYWdpbmdDb21wYXROYW1lIiwgInBlcmZvcm1hbmNlTmFtZSIsICJwZXJmb3JtYW5jZUNvbXBhdE5hbWUiLCAicmVtb3RlQ29uZmlnTmFtZSIsICJyZW1vdGVDb25maWdDb21wYXROYW1lIiwgInN0b3JhZ2VOYW1lIiwgInN0b3JhZ2VDb21wYXROYW1lIiwgImZpcmVzdG9yZU5hbWUiLCAiZmlyZXN0b3JlQ29tcGF0TmFtZSIsICJ2ZXJ0ZXhOYW1lIiwgInBhY2thZ2VOYW1lIiwgIm5hbWUiLCAiY29uZmlnIiwgIm5hbWUiLCAiY29uZmlnIiwgIkRFRkFVTFRfRU5UUllfTkFNRSIsICJuYW1lIiwgIkRFRkFVTFRfRU5UUllfTkFNRSIsICJ2ZXJzaW9uIiwgIm5hbWUiLCAidmVyc2lvbiIsICJuYW1lIiwgInZlcnNpb24iLCAiU3RvcmFnZUVycm9yQ29kZSIsICJuYW1lIiwgInZlcnNpb24iLCAiY2FuY2VsZWQiLCAic3RvcCIsICJFcnJvckNvZGUiLCAiY2FuY2VsZWQiLCAibmFtZSIsICJnZXREb3dubG9hZFVSTCIsICJyZWYiLCAicmVxdWVzdHNHZXREb3dubG9hZFVybCIsICJfZ2V0Q2hpbGQiLCAicmVmIiwgImNvbmZpZyIsICJjb25uZWN0U3RvcmFnZUVtdWxhdG9yIiwgInN0b3JhZ2UiLCAicmVmIiwgImdldERvd25sb2FkVVJMSW50ZXJuYWwiLCAicmVmSW50ZXJuYWwiLCAic3RvcmFnZSIsICJjb25uZWN0RW11bGF0b3JJbnRlcm5hbCIsICJuYW1lIiwgInZlcnNpb24iLCAiaXNTdHJpbmciLCAiaXNPYmplY3QiLCAibmFtZSIsICJpc1N0cmluZyIsICJvYmoiLCAicGF0aCIsICJub3JtIiwgInZhbHVlIiwgInN0YXJ0IiwgInNjb3JlIiwgInBhdHRlcm4iLCAicmVzdWx0IiwgIml0ZW0iLCAic2VhcmNoZXJzIiwgImlzT2JqZWN0IiwgInF1ZXJ5IiwgImNoaWxkIiwgIm5hbWUiXQp9Cg==
