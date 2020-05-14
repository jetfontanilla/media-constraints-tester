
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.22.2' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev("SvelteDOMSetProperty", { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src\App.svelte generated by Svelte v3.22.2 */

    const { console: console_1 } = globals;
    const file = "src\\App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[14] = list[i].label;
    	child_ctx[15] = list[i].deviceId;
    	child_ctx[16] = list[i].kind;
    	return child_ctx;
    }

    // (124:4) {:else}
    function create_else_block_1(ctx) {
    	let h2;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "getUserMedia or MediaRecording API are not supported by your browser";
    			add_location(h2, file, 124, 8, 3889);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(124:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (97:4) {#if isMediaRecorderSupported && isMediaDevicesSupported}
    function create_if_block(ctx) {
    	let div0;
    	let label;
    	let span;
    	let t1;
    	let select;
    	let t2;
    	let div1;
    	let dispose;
    	let each_value = /*availableOutputDevices*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	function select_block_type_1(ctx, dirty) {
    		if (/*isRecording*/ ctx[3]) return create_if_block_1;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			label = element("label");
    			span = element("span");
    			span.textContent = "Select Microphone";
    			t1 = space();
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			div1 = element("div");
    			if_block.c();
    			attr_dev(span, "class", "text-label mr-5");
    			add_location(span, file, 100, 16, 3001);
    			attr_dev(select, "class", "voices");
    			if (/*selectedDeviceId*/ ctx[1] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[13].call(select));
    			add_location(select, file, 101, 16, 3073);
    			add_location(label, file, 99, 12, 2976);
    			attr_dev(div0, "class", "section");
    			add_location(div0, file, 98, 8, 2941);
    			attr_dev(div1, "class", "section justify-content-center confirm");
    			add_location(div1, file, 111, 8, 3456);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, label);
    			append_dev(label, span);
    			append_dev(label, t1);
    			append_dev(label, select);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, /*selectedDeviceId*/ ctx[1]);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div1, anchor);
    			if_block.m(div1, null);
    			if (remount) dispose();
    			dispose = listen_dev(select, "change", /*select_change_handler*/ ctx[13]);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*availableOutputDevices*/ 4) {
    				each_value = /*availableOutputDevices*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*selectedDeviceId*/ 2) {
    				select_option(select, /*selectedDeviceId*/ ctx[1]);
    			}

    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div1, null);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div1);
    			if_block.d();
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(97:4) {#if isMediaRecorderSupported && isMediaDevicesSupported}",
    		ctx
    	});

    	return block;
    }

    // (103:20) {#each availableOutputDevices as {label, deviceId, kind}}
    function create_each_block(ctx) {
    	let option;
    	let t0_value = /*label*/ ctx[14] + "";
    	let t0;
    	let t1;
    	let t2_value = /*kind*/ ctx[16] + "";
    	let t2;
    	let t3;
    	let t4_value = /*deviceId*/ ctx[15] + "";
    	let t4;
    	let t5;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t0 = text(t0_value);
    			t1 = text(" - ");
    			t2 = text(t2_value);
    			t3 = text(" - ");
    			t4 = text(t4_value);
    			t5 = space();
    			option.__value = option_value_value = /*deviceId*/ ctx[15];
    			option.value = option.__value;
    			add_location(option, file, 103, 24, 3231);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t0);
    			append_dev(option, t1);
    			append_dev(option, t2);
    			append_dev(option, t3);
    			append_dev(option, t4);
    			append_dev(option, t5);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*availableOutputDevices*/ 4 && t0_value !== (t0_value = /*label*/ ctx[14] + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*availableOutputDevices*/ 4 && t2_value !== (t2_value = /*kind*/ ctx[16] + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*availableOutputDevices*/ 4 && t4_value !== (t4_value = /*deviceId*/ ctx[15] + "")) set_data_dev(t4, t4_value);

    			if (dirty & /*availableOutputDevices*/ 4 && option_value_value !== (option_value_value = /*deviceId*/ ctx[15])) {
    				prop_dev(option, "__value", option_value_value);
    			}

    			option.value = option.__value;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(103:20) {#each availableOutputDevices as {label, deviceId, kind}}",
    		ctx
    	});

    	return block;
    }

    // (117:12) {:else}
    function create_else_block(ctx) {
    	let button;
    	let span;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			span = element("span");
    			span.textContent = "Record";
    			add_location(span, file, 118, 20, 3783);
    			attr_dev(button, "class", "primary");
    			add_location(button, file, 117, 16, 3711);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, button, anchor);
    			append_dev(button, span);
    			if (remount) dispose();
    			dispose = listen_dev(button, "click", /*startRecording*/ ctx[5], false, false, false);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(117:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (113:12) {#if isRecording}
    function create_if_block_1(ctx) {
    	let button;
    	let span;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			span = element("span");
    			span.textContent = "Stop";
    			add_location(span, file, 114, 20, 3628);
    			attr_dev(button, "class", "primary");
    			add_location(button, file, 113, 16, 3557);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, button, anchor);
    			append_dev(button, span);
    			if (remount) dispose();
    			dispose = listen_dev(button, "click", /*stopRecording*/ ctx[6], false, false, false);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(113:12) {#if isRecording}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let div;

    	function select_block_type(ctx, dirty) {
    		if (/*isMediaRecorderSupported*/ ctx[4] && /*isMediaDevicesSupported*/ ctx[0]) return create_if_block;
    		return create_else_block_1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			attr_dev(div, "class", "container");
    			add_location(div, file, 95, 0, 2843);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_block.m(div, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div, null);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const BASE_PITCH = 1;
    const BASE_RATE = 1;

    function instance($$self, $$props, $$invalidate) {
    	let isMediaRecorderSupported = "MediaRecorder" in window;
    	let isMediaDevicesSupported = navigator.mediaDevices && navigator.mediaDevices.enumerateDevices;
    	let fileCounter = 0;
    	let selectedDeviceId = "";
    	let availableOutputDevices = [];
    	let fileExt = "webm";
    	let mimeType = "audio/webm; codecs=opus";
    	let mediaRecorder;
    	let isRecording = false;

    	async function initialize() {
    		if (!isMediaRecorderSupported || !isMediaDevicesSupported) {
    			return;
    		}

    		if (!MediaRecorder.isTypeSupported("audio/webm; codecs=opus")) {
    			fileExt = "ogg";
    			mimeType = "audio/ogg; codecs=opus";
    		}

    		await navigator.mediaDevices.getUserMedia({ audio: true });
    		let devices = await navigator.mediaDevices.enumerateDevices();
    		$$invalidate(2, availableOutputDevices = devices.filter(device => device.kind === "audioinput"));

    		if (!availableOutputDevices || availableOutputDevices.length === 0) {
    			$$invalidate(0, isMediaDevicesSupported = false);
    			return;
    		}

    		$$invalidate(1, selectedDeviceId = availableOutputDevices[0].deviceId);
    	}

    	initialize();

    	async function startRecording() {
    		if (!selectedDeviceId) {
    			isOutputStreamNotSupported = true;
    		}

    		let chunks = [];

    		const constraints = {
    			audio: { deviceId: { exact: selectedDeviceId } }
    		};

    		let stream = await navigator.mediaDevices.getUserMedia(constraints);
    		mediaRecorder = new MediaRecorder(stream, { mimeType, bitsPerSecond: 256 * 8 * 1024 });

    		mediaRecorder.ondataavailable = event => {
    			if (event.data.size > 0) {
    				chunks.push(event.data);
    			}
    		};

    		mediaRecorder.onstop = () => {
    			let blob = new Blob(chunks, { type: mimeType });
    			$$invalidate(3, isRecording = false);
    			stream.getAudioTracks().forEach(track => track.stop());
    			saveData(blob);
    		};

    		mediaRecorder.onerror = error => {
    			console.log(error);
    		};

    		mediaRecorder.start();
    		$$invalidate(3, isRecording = true);
    	}

    	function stopRecording() {
    		if (mediaRecorder.state === "recording") {
    			mediaRecorder.stop();
    		}
    	}

    	function saveData(blob) {
    		let fileName = `audio_${fileCounter}.${fileExt}`;
    		let blobUrl = URL.createObjectURL(blob);
    		let a = document.createElement("a");
    		document.body.appendChild(a);
    		a.style = "display: none";
    		a.href = blobUrl;
    		a.download = fileName;
    		a.click();
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("App", $$slots, []);

    	function select_change_handler() {
    		selectedDeviceId = select_value(this);
    		$$invalidate(1, selectedDeviceId);
    		$$invalidate(2, availableOutputDevices);
    	}

    	$$self.$capture_state = () => ({
    		BASE_PITCH,
    		BASE_RATE,
    		isMediaRecorderSupported,
    		isMediaDevicesSupported,
    		fileCounter,
    		selectedDeviceId,
    		availableOutputDevices,
    		fileExt,
    		mimeType,
    		mediaRecorder,
    		isRecording,
    		initialize,
    		startRecording,
    		stopRecording,
    		saveData
    	});

    	$$self.$inject_state = $$props => {
    		if ("isMediaRecorderSupported" in $$props) $$invalidate(4, isMediaRecorderSupported = $$props.isMediaRecorderSupported);
    		if ("isMediaDevicesSupported" in $$props) $$invalidate(0, isMediaDevicesSupported = $$props.isMediaDevicesSupported);
    		if ("fileCounter" in $$props) fileCounter = $$props.fileCounter;
    		if ("selectedDeviceId" in $$props) $$invalidate(1, selectedDeviceId = $$props.selectedDeviceId);
    		if ("availableOutputDevices" in $$props) $$invalidate(2, availableOutputDevices = $$props.availableOutputDevices);
    		if ("fileExt" in $$props) fileExt = $$props.fileExt;
    		if ("mimeType" in $$props) mimeType = $$props.mimeType;
    		if ("mediaRecorder" in $$props) mediaRecorder = $$props.mediaRecorder;
    		if ("isRecording" in $$props) $$invalidate(3, isRecording = $$props.isRecording);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		isMediaDevicesSupported,
    		selectedDeviceId,
    		availableOutputDevices,
    		isRecording,
    		isMediaRecorderSupported,
    		startRecording,
    		stopRecording,
    		fileExt,
    		mimeType,
    		mediaRecorder,
    		fileCounter,
    		initialize,
    		saveData,
    		select_change_handler
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    var app = new App({
    	target: document.body
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
