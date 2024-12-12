const Module = (() => {
    let _scriptDir = import.meta.url;

    return (
        async function (moduleArg = {}) {

            let Module = moduleArg;
            let readyPromiseResolve, readyPromiseReject;
            let readyPromise = new Promise((resolve, reject) => {
                readyPromiseResolve = resolve;
                readyPromiseReject = reject;
            });
            let moduleOverrides = Object.assign({}, Module);
            let arguments_ = [];
            let thisProgram = "./this.program";
            let quit_ = (_status, toThrow) => {
                throw toThrow;
            };
            let ENVIRONMENT_IS_WEB = typeof window == "object";
            let ENVIRONMENT_IS_WORKER = typeof importScripts == "function";
            let ENVIRONMENT_IS_NODE = typeof process == "object" && typeof process.versions == "object" && typeof process.versions.node == "string";
            let scriptDirectory = "";

            function locateFile(path) {
                if (Module["locateFile"]) {
                    return Module["locateFile"](path, scriptDirectory);
                }
                return scriptDirectory + path;
            }

            let read_, readAsync, readBinary;
            if (ENVIRONMENT_IS_NODE) {
                const {createRequire: createRequire} = await import("module");
                let require = createRequire(import.meta.url);
                let fs = require("fs");
                let nodePath = require("path");
                if (ENVIRONMENT_IS_WORKER) {
                    scriptDirectory = nodePath.dirname(scriptDirectory) + "/";
                } else {
                    scriptDirectory = require("url").fileURLToPath(new URL("./", import.meta.url));
                }
                read_ = (filename, binary) => {
                    filename = isFileURI(filename) ? new URL(filename) : nodePath.normalize(filename);
                    return fs.readFileSync(filename, binary ? undefined : "utf8");
                };
                readBinary = filename => {
                    let ret = read_(filename, true);
                    if (!ret.buffer) {
                        ret = new Uint8Array(ret);
                    }
                    return ret;
                };
                readAsync = (filename, onload, onerror, binary = true) => {
                    filename = isFileURI(filename) ? new URL(filename) : nodePath.normalize(filename);
                    fs.readFile(filename, binary ? undefined : "utf8", (err, data) => {
                        if (err) onerror(err); else onload(binary ? data.buffer : data);
                    });
                };
                if (!Module["thisProgram"] && process.argv.length > 1) {
                    thisProgram = process.argv[1].replace(/\\/g, "/");
                }
                arguments_ = process.argv.slice(2);
                quit_ = (status, toThrow) => {
                    process.exitCode = status;
                    throw toThrow;
                };
            } else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
                if (ENVIRONMENT_IS_WORKER) {
                    scriptDirectory = self.location.href;
                } else if (typeof document != "undefined" && document.currentScript) {
                    scriptDirectory = document.currentScript.src;
                }
                if (_scriptDir) {
                    scriptDirectory = _scriptDir;
                }
                if (scriptDirectory.startsWith("blob:")) {
                    scriptDirectory = "";
                } else {
                    scriptDirectory = scriptDirectory.substr(0, scriptDirectory.replace(/[?#].*/, "").lastIndexOf("/") + 1);
                }
                {
                    read_ = url => {
                        let xhr = new XMLHttpRequest;
                        xhr.open("GET", url, false);
                        xhr.send(null);
                        return xhr.responseText;
                    };
                    if (ENVIRONMENT_IS_WORKER) {
                        readBinary = url => {
                            let xhr = new XMLHttpRequest;
                            xhr.open("GET", url, false);
                            xhr.responseType = "arraybuffer";
                            xhr.send(null);
                            return new Uint8Array(xhr.response);
                        };
                    }
                    readAsync = (url, onload, onerror) => {
                        let xhr = new XMLHttpRequest;
                        xhr.open("GET", url, true);
                        xhr.responseType = "arraybuffer";
                        xhr.onload = () => {
                            if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
                                onload(xhr.response);
                                return;
                            }
                            onerror();
                        };
                        xhr.onerror = onerror;
                        xhr.send(null);
                    };
                }
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            let out = Module["print"] || console.log.bind(console);
            let err = Module["printErr"] || console.error.bind(console);
            Object.assign(Module, moduleOverrides);
            moduleOverrides = null;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            if (Module["arguments"]) arguments_ = Module["arguments"];
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            if (Module["thisProgram"]) thisProgram = Module["thisProgram"];
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            if (Module["quit"]) quit_ = Module["quit"];
            let wasmBinary;
            if (Module["wasmBinary"]) wasmBinary = Module["wasmBinary"];
            let wasmMemory;
            let ABORT = false;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            let EXITSTATUS;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            let HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;

            function updateMemoryViews() {
                let b = wasmMemory.buffer;
                Module["HEAP8"] = HEAP8 = new Int8Array(b);
                Module["HEAP16"] = HEAP16 = new Int16Array(b);
                Module["HEAPU8"] = HEAPU8 = new Uint8Array(b);
                Module["HEAPU16"] = HEAPU16 = new Uint16Array(b);
                Module["HEAP32"] = HEAP32 = new Int32Array(b);
                Module["HEAPU32"] = HEAPU32 = new Uint32Array(b);
                Module["HEAPF32"] = HEAPF32 = new Float32Array(b);
                Module["HEAPF64"] = HEAPF64 = new Float64Array(b);
            }

            let __ATPRERUN__ = [];
            let __ATINIT__ = [];
            let __ATPOSTRUN__ = [];
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            let runtimeInitialized = false;

            function preRun() {
                if (Module["preRun"]) {
                    if (typeof Module["preRun"] == "function") Module["preRun"] = [Module["preRun"]];
                    while (Module["preRun"].length) {
                        addOnPreRun(Module["preRun"].shift());
                    }
                }
                callRuntimeCallbacks(__ATPRERUN__);
            }

            function initRuntime() {
                runtimeInitialized = true;
                callRuntimeCallbacks(__ATINIT__);
            }

            function postRun() {
                if (Module["postRun"]) {
                    if (typeof Module["postRun"] == "function") Module["postRun"] = [Module["postRun"]];
                    while (Module["postRun"].length) {
                        addOnPostRun(Module["postRun"].shift());
                    }
                }
                callRuntimeCallbacks(__ATPOSTRUN__);
            }

            function addOnPreRun(cb) {
                __ATPRERUN__.unshift(cb);
            }

            function addOnInit(cb) {
                __ATINIT__.unshift(cb);
            }

            function addOnPostRun(cb) {
                __ATPOSTRUN__.unshift(cb);
            }

            let runDependencies = 0;
            let runDependencyWatcher = null;
            let dependenciesFulfilled = null;

            function addRunDependency(_id) {
                runDependencies++;
                Module["monitorRunDependencies"]?.(runDependencies);
            }

            function removeRunDependency(_id) {
                runDependencies--;
                Module["monitorRunDependencies"]?.(runDependencies);
                if (runDependencies == 0) {
                    if (runDependencyWatcher !== null) {
                        clearInterval(runDependencyWatcher);
                        runDependencyWatcher = null;
                    }
                    if (dependenciesFulfilled) {
                        let callback = dependenciesFulfilled;
                        dependenciesFulfilled = null;
                        callback();
                    }
                }
            }

            function abort(what) {
                Module["onAbort"]?.(what);
                what = "Aborted(" + what + ")";
                err(what);
                ABORT = true;
                EXITSTATUS = 1;
                what += ". Build with -sASSERTIONS for more info.";
                let e = new WebAssembly.RuntimeError(what);
                readyPromiseReject(e);
                throw e;
            }

            let dataURIPrefix = "data:application/octet-stream;base64,";
            let isDataURI = filename => filename.startsWith(dataURIPrefix);
            let isFileURI = filename => filename.startsWith("file://");
            let wasmBinaryFile;
            if (Module["locateFile"]) {
                wasmBinaryFile = "imghelper.wasm";
                if (!isDataURI(wasmBinaryFile)) {
                    wasmBinaryFile = locateFile(wasmBinaryFile);
                }
            } else {
                wasmBinaryFile = new URL("imghelper.wasm", import.meta.url).href;
            }

            function getBinarySync(file) {
                if (file === wasmBinaryFile && wasmBinary) {
                    return new Uint8Array(wasmBinary);
                }
                if (readBinary) {
                    return readBinary(file);
                }
                throw "both async and sync fetching of the wasm failed";
            }

            function getBinaryPromise(binaryFile) {
                if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER)) {
                    if (typeof fetch == "function" && !isFileURI(binaryFile)) {
                        return fetch(binaryFile, {credentials: "same-origin"}).then(response => {
                            if (!response["ok"]) {
                                throw `failed to load wasm binary file at '${binaryFile}'`;
                            }
                            return response["arrayBuffer"]();
                        }).catch(() => getBinarySync(binaryFile));
                    } else if (readAsync) {
                        return new Promise((resolve, reject) => {
                            readAsync(binaryFile, response => resolve(new Uint8Array(response)), reject);
                        });
                    }
                }
                return Promise.resolve().then(() => getBinarySync(binaryFile));
            }

            function instantiateArrayBuffer(binaryFile, imports, receiver) {
                return getBinaryPromise(binaryFile).then(binary => WebAssembly.instantiate(binary, imports)).then(receiver, reason => {
                    err(`failed to asynchronously prepare wasm: ${reason}`);
                    abort(reason);
                });
            }

            function instantiateAsync(binary, binaryFile, imports, callback) {
                if (!binary && typeof WebAssembly.instantiateStreaming == "function" && !isDataURI(binaryFile) && !isFileURI(binaryFile) && !ENVIRONMENT_IS_NODE && typeof fetch == "function") {
                    return fetch(binaryFile, {credentials: "same-origin"}).then(response => {
                        let result = WebAssembly.instantiateStreaming(response, imports);
                        return result.then(callback, function (reason) {
                            err(`wasm streaming compile failed: ${reason}`);
                            err("falling back to ArrayBuffer instantiation");
                            return instantiateArrayBuffer(binaryFile, imports, callback);
                        });
                    });
                }
                return instantiateArrayBuffer(binaryFile, imports, callback);
            }

            function createWasm() {
                let info = {"env": wasmImports, "wasi_snapshot_preview1": wasmImports};

                function receiveInstance(instance, _module) {
                    wasmExports = instance.exports;
                    wasmMemory = wasmExports["memory"];
                    updateMemoryViews();
                    addOnInit(wasmExports["__wasm_call_ctors"]);
                    removeRunDependency("wasm-instantiate");
                    return wasmExports;
                }

                addRunDependency("wasm-instantiate");

                function receiveInstantiationResult(result) {
                    receiveInstance(result["instance"]);
                }

                if (Module["instantiateWasm"]) {
                    try {
                        return Module["instantiateWasm"](info, receiveInstance);
                    } catch (e) {
                        err(`Module.instantiateWasm callback failed with error: ${e}`);
                        readyPromiseReject(e);
                    }
                }
                instantiateAsync(wasmBinary, wasmBinaryFile, info, receiveInstantiationResult).catch(readyPromiseReject);
                return {};
            }

            let callRuntimeCallbacks = callbacks => {
                while (callbacks.length > 0) {
                    callbacks.shift()(Module);
                }
            };
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            let noExitRuntime = Module["noExitRuntime"] || true;
            let stackRestore = val => __emscripten_stack_restore(val);
            let stackSave = () => _emscripten_stack_get_current();
            let getHeapMax = () => 2147483648;
            let growMemory = size => {
                let b = wasmMemory.buffer;
                let pages = (size - b.byteLength + 65535) / 65536;
                try {
                    wasmMemory.grow(pages);
                    updateMemoryViews();
                    return 1;
                } catch (_e) { /* empty */
                }
            };
            let _emscripten_resize_heap = requestedSize => {
                let oldSize = HEAPU8.length;
                requestedSize >>>= 0;
                let maxHeapSize = getHeapMax();
                if (requestedSize > maxHeapSize) {
                    return false;
                }
                let alignUp = (x, multiple) => x + (multiple - x % multiple) % multiple;
                for (let cutDown = 1; cutDown <= 4; cutDown *= 2) {
                    let overGrownHeapSize = oldSize * (1 + .2 / cutDown);
                    overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
                    let newSize = Math.min(maxHeapSize, alignUp(Math.max(requestedSize, overGrownHeapSize), 65536));
                    let replacement = growMemory(newSize);
                    if (replacement) {
                        return true;
                    }
                }
                return false;
            };
            let getCFunc = ident => {
                let func = Module["_" + ident];
                return func;
            };
            let writeArrayToMemory = (array, buffer) => {
                HEAP8.set(array, buffer);
            };
            let lengthBytesUTF8 = str => {
                let len = 0;
                for (let i = 0; i < str.length; ++i) {
                    let c = str.charCodeAt(i);
                    if (c <= 127) {
                        len++;
                    } else if (c <= 2047) {
                        len += 2;
                    } else if (c >= 55296 && c <= 57343) {
                        len += 4;
                        ++i;
                    } else {
                        len += 3;
                    }
                }
                return len;
            };
            let stringToUTF8Array = (str, heap, outIdx, maxBytesToWrite) => {
                if (!(maxBytesToWrite > 0)) return 0;
                let startIdx = outIdx;
                let endIdx = outIdx + maxBytesToWrite - 1;
                for (let i = 0; i < str.length; ++i) {
                    let u = str.charCodeAt(i);
                    if (u >= 55296 && u <= 57343) {
                        let u1 = str.charCodeAt(++i);
                        u = 65536 + ((u & 1023) << 10) | u1 & 1023;
                    }
                    if (u <= 127) {
                        if (outIdx >= endIdx) break;
                        heap[outIdx++] = u;
                    } else if (u <= 2047) {
                        if (outIdx + 1 >= endIdx) break;
                        heap[outIdx++] = 192 | u >> 6;
                        heap[outIdx++] = 128 | u & 63;
                    } else if (u <= 65535) {
                        if (outIdx + 2 >= endIdx) break;
                        heap[outIdx++] = 224 | u >> 12;
                        heap[outIdx++] = 128 | u >> 6 & 63;
                        heap[outIdx++] = 128 | u & 63;
                    } else {
                        if (outIdx + 3 >= endIdx) break;
                        heap[outIdx++] = 240 | u >> 18;
                        heap[outIdx++] = 128 | u >> 12 & 63;
                        heap[outIdx++] = 128 | u >> 6 & 63;
                        heap[outIdx++] = 128 | u & 63;
                    }
                }
                heap[outIdx] = 0;
                return outIdx - startIdx;
            };
            let stringToUTF8 = (str, outPtr, maxBytesToWrite) => stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
            let stackAlloc = sz => __emscripten_stack_alloc(sz);
            let stringToUTF8OnStack = str => {
                let size = lengthBytesUTF8(str) + 1;
                let ret = stackAlloc(size);
                stringToUTF8(str, ret, size);
                return ret;
            };
            let UTF8Decoder = typeof TextDecoder != "undefined" ? new TextDecoder("utf8") : undefined;
            let UTF8ArrayToString = (heapOrArray, idx, maxBytesToRead) => {
                let endIdx = idx + maxBytesToRead;
                let endPtr = idx;
                while (heapOrArray[endPtr] && !(endPtr >= endIdx)) ++endPtr;
                if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
                    return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr));
                }
                let str = "";
                while (idx < endPtr) {
                    let u0 = heapOrArray[idx++];
                    if (!(u0 & 128)) {
                        str += String.fromCharCode(u0);
                        continue;
                    }
                    let u1 = heapOrArray[idx++] & 63;
                    if ((u0 & 224) == 192) {
                        str += String.fromCharCode((u0 & 31) << 6 | u1);
                        continue;
                    }
                    let u2 = heapOrArray[idx++] & 63;
                    if ((u0 & 240) == 224) {
                        u0 = (u0 & 15) << 12 | u1 << 6 | u2;
                    } else {
                        u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | heapOrArray[idx++] & 63;
                    }
                    if (u0 < 65536) {
                        str += String.fromCharCode(u0);
                    } else {
                        let ch = u0 - 65536;
                        str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
                    }
                }
                return str;
            };
            let UTF8ToString = (ptr, maxBytesToRead) => ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : "";
            let ccall = (ident, returnType, argTypes, args, _opts) => {
                let toC = {
                    "string": str => {
                        let ret = 0;
                        if (str !== null && str !== undefined && str !== 0) {
                            ret = stringToUTF8OnStack(str);
                        }
                        return ret;
                    }, "array": arr => {
                        let ret = stackAlloc(arr.length);
                        writeArrayToMemory(arr, ret);
                        return ret;
                    }
                };

                function convertReturnValue(ret) {
                    if (returnType === "string") {
                        return UTF8ToString(ret);
                    }
                    if (returnType === "boolean") return Boolean(ret);
                    return ret;
                }

                let func = getCFunc(ident);
                let cArgs = [];
                let stack = 0;
                if (args) {
                    for (let i = 0; i < args.length; i++) {
                        let converter = toC[argTypes[i]];
                        if (converter) {
                            if (stack === 0) stack = stackSave();
                            cArgs[i] = converter(args[i]);
                        } else {
                            cArgs[i] = args[i];
                        }
                    }
                }
                let ret = func(...cArgs);

                function onDone(ret) {
                    if (stack !== 0) stackRestore(stack);
                    return convertReturnValue(ret);
                }

                ret = onDone(ret);
                return ret;
            };
            let cwrap = (ident, returnType, argTypes, opts) => {
                let numericArgs = !argTypes || argTypes.every(type => type === "number" || type === "boolean");
                let numericRet = returnType !== "string";
                if (numericRet && numericArgs && !opts) {
                    return getCFunc(ident);
                }
                return (...args) => ccall(ident, returnType, argTypes, args, opts);
            };
            let wasmImports = {emscripten_resize_heap: _emscripten_resize_heap};
            let wasmExports = createWasm();
            let ___wasm_call_ctors = () => (___wasm_call_ctors = wasmExports["__wasm_call_ctors"])();
            let _check_alpha = Module["_check_alpha"] = (a0, a1) => (_check_alpha = Module["_check_alpha"] = wasmExports["check_alpha"])(a0, a1);
            let _copy_alpha_to_rgb = Module["_copy_alpha_to_rgb"] = (a0, a1, a2) => (_copy_alpha_to_rgb = Module["_copy_alpha_to_rgb"] = wasmExports["copy_alpha_to_rgb"])(a0, a1, a2);
            let _copy_alpha_channel = Module["_copy_alpha_channel"] = (a0, a1, a2) => (_copy_alpha_channel = Module["_copy_alpha_channel"] = wasmExports["copy_alpha_channel"])(a0, a1, a2);
            let _malloc = Module["_malloc"] = a0 => (_malloc = Module["_malloc"] = wasmExports["malloc"])(a0);
            let _free = Module["_free"] = a0 => (_free = Module["_free"] = wasmExports["free"])(a0);
            let __emscripten_stack_restore = a0 => (__emscripten_stack_restore = wasmExports["_emscripten_stack_restore"])(a0);
            let __emscripten_stack_alloc = a0 => (__emscripten_stack_alloc = wasmExports["_emscripten_stack_alloc"])(a0);
            let _emscripten_stack_get_current = () => (_emscripten_stack_get_current = wasmExports["emscripten_stack_get_current"])();
            Module["ccall"] = ccall;
            Module["cwrap"] = cwrap;
            let calledRun;
            dependenciesFulfilled = function runCaller() {
                if (!calledRun) run();
                if (!calledRun) dependenciesFulfilled = runCaller;
            };

            function run() {
                if (runDependencies > 0) {
                    return;
                }
                preRun();
                if (runDependencies > 0) {
                    return;
                }

                function doRun() {
                    if (calledRun) return;
                    calledRun = true;
                    Module["calledRun"] = true;
                    if (ABORT) return;
                    initRuntime();
                    readyPromiseResolve(Module);
                    if (Module["onRuntimeInitialized"]) Module["onRuntimeInitialized"]();
                    postRun();
                }

                if (Module["setStatus"]) {
                    Module["setStatus"]("Running...");
                    setTimeout(function () {
                        setTimeout(function () {
                            Module["setStatus"]("");
                        }, 1);
                        doRun();
                    }, 1);
                } else {
                    doRun();
                }
            }

            if (Module["preInit"]) {
                if (typeof Module["preInit"] == "function") Module["preInit"] = [Module["preInit"]];
                while (Module["preInit"].length > 0) {
                    Module["preInit"].pop()();
                }
            }
            run();


            return readyPromise;
        }
    );
})();
export default Module;
