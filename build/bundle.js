
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
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
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
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
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { stylesheet } = info;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                info.rules = {};
            });
            managed_styles.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function beforeUpdate(fn) {
        get_current_component().$$.before_update.push(fn);
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
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
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
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
        seen_callbacks.clear();
        set_current_component(saved_component);
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

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = (program.b - t);
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
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
        }
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
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
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
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
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
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
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
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.2' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
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
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    let rawData = [{
        "id":1,
        "name":"Huawei Smart Phone",
        "price":1500.00,
        "seller":"Huawei", 
        "category":"Electronic",
        "img":"https://picsum.photos/200"
    },
    {
        "id":2,
        "name":"Xiaomi TWS Earphone",
        "price":99.00,
        "seller":"Xiaomi",
        "category":"Electronic",
        "img":"https://picsum.photos/200"
    },
    {
        "id":3,
        "name":"Xiaomi Smart Sensor",
        "price":50.00,
        "seller":"Xiaomi",
        "category":"Electronic",
        "img":"https://picsum.photos/200"
    },
    {
        "id":4,
        "name":"Black Hoodie",
        "price":89.00,
        "seller":"UNIQLO",
        "category":"Clothing",
        "img":"https://picsum.photos/200"
    },
    {
        "id":5,
        "name":"Kacang Putih",
        "price":10.00,
        "seller":"Signature Market",
        "category":"Food",
        "img":"https://picsum.photos/200"
    },
    {
        "id":6,
        "name":"Kacang Hitam",
        "price":8.00,
        "seller":"Signature Market",
        "category":"Food",
        "img":"https://picsum.photos/200"
    },
    {
        "id":7,
        "name":"Kacang Hijau",
        "price":12.00,
        "seller":"Signature Market",
        "category":"Food",
        "img":"https://picsum.photos/200"
    }];
    //test 
    let products = writable(rawData);

    let searched_products = writable(rawData);
    let filtered_products = writable(rawData);
    let cart_items = writable(new Map());

    /* src\components\Card.svelte generated by Svelte v3.46.2 */

    const { console: console_1$3 } = globals;
    const file$a = "src\\components\\Card.svelte";

    function create_fragment$a(ctx) {
    	let div3;
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let t0;
    	let div1;
    	let div0;
    	let h5;
    	let t1;
    	let t2;
    	let h4;
    	let sup;
    	let t4;
    	let t5;
    	let t6;
    	let div2;
    	let button0;
    	let t7;
    	let span0;
    	let t8;
    	let button1;
    	let t9;
    	let span1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			img = element("img");
    			t0 = space();
    			div1 = element("div");
    			div0 = element("div");
    			h5 = element("h5");
    			t1 = text(/*productName*/ ctx[0]);
    			t2 = space();
    			h4 = element("h4");
    			sup = element("sup");
    			sup.textContent = "RM";
    			t4 = space();
    			t5 = text(/*productPrice*/ ctx[1]);
    			t6 = space();
    			div2 = element("div");
    			button0 = element("button");
    			t7 = text("Add To Cart ");
    			span0 = element("span");
    			t8 = space();
    			button1 = element("button");
    			t9 = text("Delete ");
    			span1 = element("span");
    			attr_dev(img, "class", "card-img-top svelte-8z2zd9");
    			if (!src_url_equal(img.src, img_src_value = /*productImg*/ ctx[2])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = "Product Image for " + /*productName*/ ctx[0]);
    			add_location(img, file$a, 53, 4, 1329);
    			attr_dev(h5, "class", "card-title");
    			set_style(h5, "font-size", "14px");
    			add_location(h5, file$a, 56, 12, 1481);
    			set_style(sup, "font-size", "small");
    			add_location(sup, file$a, 57, 41, 1588);
    			attr_dev(h4, "class", "fw-bold text-end");
    			add_location(h4, file$a, 57, 12, 1559);
    			attr_dev(div0, "class", "row");
    			add_location(div0, file$a, 55, 8, 1450);
    			attr_dev(div1, "class", "card-body");
    			add_location(div1, file$a, 54, 4, 1417);
    			attr_dev(span0, "class", "fas fa-plus icon");
    			add_location(span0, file$a, 61, 77, 1821);
    			attr_dev(button0, "class", "btn btn-primary m-1 svelte-8z2zd9");
    			add_location(button0, file$a, 61, 8, 1752);
    			attr_dev(span1, "class", "fas fa-trash icon");
    			add_location(span1, file$a, 62, 75, 1948);
    			attr_dev(button1, "class", "btn btn-danger m-1 svelte-8z2zd9");
    			add_location(button1, file$a, 62, 8, 1881);
    			attr_dev(div2, "class", "card-footer text-center button svelte-8z2zd9");
    			add_location(div2, file$a, 60, 4, 1698);
    			attr_dev(div3, "class", "card m-auto my-1 shadow svelte-8z2zd9");
    			add_location(div3, file$a, 52, 0, 1286);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, img);
    			append_dev(div3, t0);
    			append_dev(div3, div1);
    			append_dev(div1, div0);
    			append_dev(div0, h5);
    			append_dev(h5, t1);
    			append_dev(div0, t2);
    			append_dev(div0, h4);
    			append_dev(h4, sup);
    			append_dev(h4, t4);
    			append_dev(h4, t5);
    			append_dev(div3, t6);
    			append_dev(div3, div2);
    			append_dev(div2, button0);
    			append_dev(button0, t7);
    			append_dev(button0, span0);
    			append_dev(div2, t8);
    			append_dev(div2, button1);
    			append_dev(button1, t9);
    			append_dev(button1, span1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*addToCart*/ ctx[3], false, false, false),
    					listen_dev(button1, "click", /*deleteProduct*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*productImg*/ 4 && !src_url_equal(img.src, img_src_value = /*productImg*/ ctx[2])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*productName*/ 1 && img_alt_value !== (img_alt_value = "Product Image for " + /*productName*/ ctx[0])) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (dirty & /*productName*/ 1) set_data_dev(t1, /*productName*/ ctx[0]);
    			if (dirty & /*productPrice*/ 2) set_data_dev(t5, /*productPrice*/ ctx[1]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let $cart_items;
    	let $products;
    	validate_store(cart_items, 'cart_items');
    	component_subscribe($$self, cart_items, $$value => $$invalidate(7, $cart_items = $$value));
    	validate_store(products, 'products');
    	component_subscribe($$self, products, $$value => $$invalidate(8, $products = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Card', slots, []);
    	let { productId } = $$props;
    	let { productName } = $$props;
    	let { productPrice } = $$props;
    	let { productImg } = $$props;
    	let isFocus = false;

    	function addToCart() {
    		let cartList = $cart_items;

    		if (cartList.has(productId)) {
    			let quantity = cartList.get(productId);
    			quantity += 1;
    			cartList.set(productId, quantity);
    		} else {
    			cartList.set(productId, 1);
    		}

    		cart_items.set(cartList);
    		console.log(Array.from($cart_items));
    	}

    	function deleteProduct() {
    		let product_list = $products;

    		product_list = product_list.filter(p => {
    			return p.id !== productId;
    		});

    		products.set(product_list);
    		alert(`${productName} has been deleted.`);
    		let cart_list = $cart_items;

    		if (cart_list.has(productId)) {
    			if (cart_list.delete(productId)) {
    				cart_items.set(cart_list);
    			}
    		}

    		console.log(cart_list);
    	}

    	function onHover(e) {
    		isFocus = true;
    	}

    	function leaveHover(e) {
    		isFocus = false;
    	}

    	const writable_props = ['productId', 'productName', 'productPrice', 'productImg'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$3.warn(`<Card> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('productId' in $$props) $$invalidate(5, productId = $$props.productId);
    		if ('productName' in $$props) $$invalidate(0, productName = $$props.productName);
    		if ('productPrice' in $$props) $$invalidate(1, productPrice = $$props.productPrice);
    		if ('productImg' in $$props) $$invalidate(2, productImg = $$props.productImg);
    	};

    	$$self.$capture_state = () => ({
    		cart_items,
    		products,
    		productId,
    		productName,
    		productPrice,
    		productImg,
    		isFocus,
    		addToCart,
    		deleteProduct,
    		onHover,
    		leaveHover,
    		$cart_items,
    		$products
    	});

    	$$self.$inject_state = $$props => {
    		if ('productId' in $$props) $$invalidate(5, productId = $$props.productId);
    		if ('productName' in $$props) $$invalidate(0, productName = $$props.productName);
    		if ('productPrice' in $$props) $$invalidate(1, productPrice = $$props.productPrice);
    		if ('productImg' in $$props) $$invalidate(2, productImg = $$props.productImg);
    		if ('isFocus' in $$props) isFocus = $$props.isFocus;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [productName, productPrice, productImg, addToCart, deleteProduct, productId];
    }

    class Card extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {
    			productId: 5,
    			productName: 0,
    			productPrice: 1,
    			productImg: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Card",
    			options,
    			id: create_fragment$a.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*productId*/ ctx[5] === undefined && !('productId' in props)) {
    			console_1$3.warn("<Card> was created without expected prop 'productId'");
    		}

    		if (/*productName*/ ctx[0] === undefined && !('productName' in props)) {
    			console_1$3.warn("<Card> was created without expected prop 'productName'");
    		}

    		if (/*productPrice*/ ctx[1] === undefined && !('productPrice' in props)) {
    			console_1$3.warn("<Card> was created without expected prop 'productPrice'");
    		}

    		if (/*productImg*/ ctx[2] === undefined && !('productImg' in props)) {
    			console_1$3.warn("<Card> was created without expected prop 'productImg'");
    		}
    	}

    	get productId() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set productId(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get productName() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set productName(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get productPrice() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set productPrice(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get productImg() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set productImg(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\List.svelte generated by Svelte v3.46.2 */
    const file$9 = "src\\components\\List.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (13:8) {:else}
    function create_else_block$1(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "No product available.";
    			attr_dev(p, "class", "text-center");
    			add_location(p, file$9, 13, 12, 489);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(13:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (9:8) {#if $filtered_products.length}
    function create_if_block$2(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*$filtered_products*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$filtered_products*/ 1) {
    				each_value = /*$filtered_products*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(9:8) {#if $filtered_products.length}",
    		ctx
    	});

    	return block;
    }

    // (10:12) {#each $filtered_products as product }
    function create_each_block$4(ctx) {
    	let card;
    	let current;

    	card = new Card({
    			props: {
    				productId: /*product*/ ctx[1].id,
    				productName: /*product*/ ctx[1].name,
    				productPrice: /*product*/ ctx[1].price,
    				productImg: /*product*/ ctx[1].img
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(card.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(card, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const card_changes = {};
    			if (dirty & /*$filtered_products*/ 1) card_changes.productId = /*product*/ ctx[1].id;
    			if (dirty & /*$filtered_products*/ 1) card_changes.productName = /*product*/ ctx[1].name;
    			if (dirty & /*$filtered_products*/ 1) card_changes.productPrice = /*product*/ ctx[1].price;
    			if (dirty & /*$filtered_products*/ 1) card_changes.productImg = /*product*/ ctx[1].img;
    			card.$set(card_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(card, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(10:12) {#each $filtered_products as product }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let div1;
    	let div0;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$2, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$filtered_products*/ ctx[0].length) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			if_block.c();
    			attr_dev(div0, "class", "card-group justify-content-center");
    			add_location(div0, file$9, 7, 4, 168);
    			attr_dev(div1, "class", "container");
    			add_location(div1, file$9, 6, 0, 139);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			if_blocks[current_block_type_index].m(div0, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div0, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let $filtered_products;
    	validate_store(filtered_products, 'filtered_products');
    	component_subscribe($$self, filtered_products, $$value => $$invalidate(0, $filtered_products = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('List', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<List> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Card,
    		products,
    		searched_products,
    		filtered_products,
    		$filtered_products
    	});

    	return [$filtered_products];
    }

    class List extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "List",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    function filter_by_search(list,searchTerm){

        let searchTermRegExp = new RegExp(searchTerm,'i'); 
        let searchResult = list.filter((obj) => {
            let keys = Object.keys(obj);
            for(let key of keys){
                if(searchTermRegExp.test(obj[key])){
                    return true;
                }
            }
        });
        return searchResult;
    }

    /* src\components\Search.svelte generated by Svelte v3.46.2 */
    const file$8 = "src\\components\\Search.svelte";

    function create_fragment$8(ctx) {
    	let div;
    	let input;
    	let t;
    	let button;
    	let span;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			input = element("input");
    			t = space();
    			button = element("button");
    			span = element("span");
    			attr_dev(input, "type", "search");
    			attr_dev(input, "class", "form-control");
    			attr_dev(input, "placeholder", "Search Something...");
    			add_location(input, file$8, 21, 4, 546);
    			attr_dev(span, "class", "fas fa-filter");
    			add_location(span, file$8, 22, 64, 716);
    			attr_dev(button, "class", "btn btn-secondary");
    			add_location(button, file$8, 22, 4, 656);
    			attr_dev(div, "class", "input-group");
    			add_location(div, file$8, 20, 0, 515);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, input);
    			set_input_value(input, /*search_phrase*/ ctx[1]);
    			append_dev(div, t);
    			append_dev(div, button);
    			append_dev(button, span);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[3]),
    					listen_dev(
    						button,
    						"click",
    						function () {
    							if (is_function(/*toggleFunction*/ ctx[0])) /*toggleFunction*/ ctx[0].apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (dirty & /*search_phrase*/ 2) {
    				set_input_value(input, /*search_phrase*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let $products;
    	validate_store(products, 'products');
    	component_subscribe($$self, products, $$value => $$invalidate(2, $products = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Search', slots, []);
    	let search_phrase;
    	let { toggleFunction } = $$props;

    	function search_product(search_ph, products) {
    		if (search_ph) {
    			let results = filter_by_search(products, search_ph);
    			searched_products.set(results);
    		} else {
    			searched_products.set(products);
    		}
    	}

    	const writable_props = ['toggleFunction'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Search> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		search_phrase = this.value;
    		$$invalidate(1, search_phrase);
    	}

    	$$self.$$set = $$props => {
    		if ('toggleFunction' in $$props) $$invalidate(0, toggleFunction = $$props.toggleFunction);
    	};

    	$$self.$capture_state = () => ({
    		filter_by_search,
    		searched_products,
    		products,
    		search_phrase,
    		toggleFunction,
    		search_product,
    		$products
    	});

    	$$self.$inject_state = $$props => {
    		if ('search_phrase' in $$props) $$invalidate(1, search_phrase = $$props.search_phrase);
    		if ('toggleFunction' in $$props) $$invalidate(0, toggleFunction = $$props.toggleFunction);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*search_phrase, $products*/ 6) {
    			search_product(search_phrase, $products);
    		}
    	};

    	return [toggleFunction, search_phrase, $products, input_input_handler];
    }

    class Search extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { toggleFunction: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Search",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*toggleFunction*/ ctx[0] === undefined && !('toggleFunction' in props)) {
    			console.warn("<Search> was created without expected prop 'toggleFunction'");
    		}
    	}

    	get toggleFunction() {
    		throw new Error("<Search>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set toggleFunction(value) {
    		throw new Error("<Search>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Form.svelte generated by Svelte v3.46.2 */
    const file$7 = "src\\components\\Form.svelte";

    function create_fragment$7(ctx) {
    	let form;
    	let div0;
    	let h5;
    	let t1;
    	let button0;
    	let t2;
    	let div5;
    	let div1;
    	let input0;
    	let t3;
    	let label0;
    	let t5;
    	let div2;
    	let input1;
    	let t6;
    	let label1;
    	let t8;
    	let div3;
    	let input2;
    	let t9;
    	let label2;
    	let t11;
    	let div4;
    	let input3;
    	let t12;
    	let label3;
    	let t14;
    	let div6;
    	let button1;
    	let t16;
    	let button2;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			form = element("form");
    			div0 = element("div");
    			h5 = element("h5");
    			h5.textContent = "New Product";
    			t1 = space();
    			button0 = element("button");
    			t2 = space();
    			div5 = element("div");
    			div1 = element("div");
    			input0 = element("input");
    			t3 = space();
    			label0 = element("label");
    			label0.textContent = "Product Name";
    			t5 = space();
    			div2 = element("div");
    			input1 = element("input");
    			t6 = space();
    			label1 = element("label");
    			label1.textContent = "Price (RM)";
    			t8 = space();
    			div3 = element("div");
    			input2 = element("input");
    			t9 = space();
    			label2 = element("label");
    			label2.textContent = "Seller";
    			t11 = space();
    			div4 = element("div");
    			input3 = element("input");
    			t12 = space();
    			label3 = element("label");
    			label3.textContent = "Category";
    			t14 = space();
    			div6 = element("div");
    			button1 = element("button");
    			button1.textContent = "Close";
    			t16 = space();
    			button2 = element("button");
    			button2.textContent = "Create";
    			attr_dev(h5, "class", "modal-title");
    			add_location(h5, file$7, 45, 8, 1110);
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "btn-close");
    			attr_dev(button0, "data-bs-dismiss", "modal");
    			attr_dev(button0, "aria-label", "Close");
    			add_location(button0, file$7, 46, 5, 1157);
    			attr_dev(div0, "class", "modal-header");
    			add_location(div0, file$7, 44, 4, 1074);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "id", "product_name");
    			attr_dev(input0, "class", "form-control");
    			attr_dev(input0, "placeholder", "Product Name");
    			input0.required = true;
    			add_location(input0, file$7, 50, 12, 1359);
    			attr_dev(label0, "for", "product_name");
    			add_location(label0, file$7, 51, 12, 1486);
    			attr_dev(div1, "class", "form-floating mb-3");
    			add_location(div1, file$7, 49, 8, 1313);
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "step", "0.01");
    			attr_dev(input1, "id", "product_price");
    			attr_dev(input1, "class", "form-control");
    			attr_dev(input1, "placeholder", "Product Price");
    			input1.required = true;
    			add_location(input1, file$7, 55, 12, 1614);
    			attr_dev(label1, "for", "product_price");
    			add_location(label1, file$7, 56, 12, 1758);
    			attr_dev(div2, "class", "form-floating mb-3");
    			add_location(div2, file$7, 54, 8, 1568);
    			attr_dev(input2, "type", "text");
    			attr_dev(input2, "id", "seller");
    			attr_dev(input2, "class", "form-control");
    			attr_dev(input2, "placeholder", "Seller");
    			input2.required = true;
    			add_location(input2, file$7, 60, 12, 1889);
    			attr_dev(label2, "for", "seller");
    			add_location(label2, file$7, 61, 12, 2006);
    			attr_dev(div3, "class", "form-floating mb-3");
    			add_location(div3, file$7, 59, 8, 1843);
    			attr_dev(input3, "type", "text");
    			attr_dev(input3, "id", "product_category");
    			attr_dev(input3, "class", "form-control");
    			attr_dev(input3, "placeholder", "Product Category");
    			input3.required = true;
    			add_location(input3, file$7, 65, 12, 2126);
    			attr_dev(label3, "for", "product_category");
    			add_location(label3, file$7, 66, 12, 2265);
    			attr_dev(div4, "class", "form-floating mb-3");
    			add_location(div4, file$7, 64, 8, 2080);
    			attr_dev(div5, "class", "modal-body");
    			add_location(div5, file$7, 48, 4, 1267);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "btn btn-secondary");
    			attr_dev(button1, "data-bs-dismiss", "modal");
    			add_location(button1, file$7, 71, 8, 2383);
    			attr_dev(button2, "type", "submit");
    			attr_dev(button2, "class", "btn btn-primary");
    			add_location(button2, file$7, 72, 8, 2479);
    			attr_dev(div6, "class", "modal-footer");
    			add_location(div6, file$7, 70, 4, 2347);
    			add_location(form, file$7, 43, 0, 1024);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form, anchor);
    			append_dev(form, div0);
    			append_dev(div0, h5);
    			append_dev(div0, t1);
    			append_dev(div0, button0);
    			append_dev(form, t2);
    			append_dev(form, div5);
    			append_dev(div5, div1);
    			append_dev(div1, input0);
    			set_input_value(input0, /*name*/ ctx[0]);
    			append_dev(div1, t3);
    			append_dev(div1, label0);
    			append_dev(div5, t5);
    			append_dev(div5, div2);
    			append_dev(div2, input1);
    			set_input_value(input1, /*price*/ ctx[1]);
    			append_dev(div2, t6);
    			append_dev(div2, label1);
    			append_dev(div5, t8);
    			append_dev(div5, div3);
    			append_dev(div3, input2);
    			set_input_value(input2, /*seller*/ ctx[3]);
    			append_dev(div3, t9);
    			append_dev(div3, label2);
    			append_dev(div5, t11);
    			append_dev(div5, div4);
    			append_dev(div4, input3);
    			set_input_value(input3, /*category*/ ctx[2]);
    			append_dev(div4, t12);
    			append_dev(div4, label3);
    			append_dev(form, t14);
    			append_dev(form, div6);
    			append_dev(div6, button1);
    			append_dev(div6, t16);
    			append_dev(div6, button2);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[5]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[6]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[7]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[8]),
    					listen_dev(form, "submit", prevent_default(/*addProduct*/ ctx[4]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*name*/ 1 && input0.value !== /*name*/ ctx[0]) {
    				set_input_value(input0, /*name*/ ctx[0]);
    			}

    			if (dirty & /*price*/ 2 && to_number(input1.value) !== /*price*/ ctx[1]) {
    				set_input_value(input1, /*price*/ ctx[1]);
    			}

    			if (dirty & /*seller*/ 8 && input2.value !== /*seller*/ ctx[3]) {
    				set_input_value(input2, /*seller*/ ctx[3]);
    			}

    			if (dirty & /*category*/ 4 && input3.value !== /*category*/ ctx[2]) {
    				set_input_value(input3, /*category*/ ctx[2]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let $products;
    	validate_store(products, 'products');
    	component_subscribe($$self, products, $$value => $$invalidate(9, $products = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Form', slots, []);
    	let name;
    	let price;
    	let category;
    	let seller;

    	function addProduct() {
    		let productId = $products.length;

    		let newProd = {
    			'id': productId,
    			name,
    			price,
    			seller,
    			category
    		};

    		let existingProd = $products;
    		existingProd.push(newProd);
    		products.set(existingProd);
    		resetValue();
    		bootstrap.Modal.getInstance(document.getElementById("addProductModal")).hide();
    		alert("Product created.");
    	}

    	function resetValue() {
    		$$invalidate(0, name = null);
    		$$invalidate(1, price = null);
    		$$invalidate(2, category = null);
    		$$invalidate(3, seller = null);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Form> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		name = this.value;
    		$$invalidate(0, name);
    	}

    	function input1_input_handler() {
    		price = to_number(this.value);
    		$$invalidate(1, price);
    	}

    	function input2_input_handler() {
    		seller = this.value;
    		$$invalidate(3, seller);
    	}

    	function input3_input_handler() {
    		category = this.value;
    		$$invalidate(2, category);
    	}

    	$$self.$capture_state = () => ({
    		products,
    		name,
    		price,
    		category,
    		seller,
    		addProduct,
    		resetValue,
    		$products
    	});

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('price' in $$props) $$invalidate(1, price = $$props.price);
    		if ('category' in $$props) $$invalidate(2, category = $$props.category);
    		if ('seller' in $$props) $$invalidate(3, seller = $$props.seller);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		name,
    		price,
    		category,
    		seller,
    		addProduct,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler
    	];
    }

    class Form extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Form",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src\components\Filter_Button.svelte generated by Svelte v3.46.2 */

    const { Object: Object_1$1 } = globals;
    const file$6 = "src\\components\\Filter_Button.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	child_ctx[9] = list;
    	child_ctx[10] = i;
    	return child_ctx;
    }

    // (43:0) {#each filter_criteria as criteria}
    function create_each_block$3(ctx) {
    	let input;
    	let input_id_value;
    	let t0;
    	let label;
    	let t1_value = /*criteria*/ ctx[8] + "";
    	let t1;
    	let label_for_value;
    	let mounted;
    	let dispose;

    	function input_change_handler() {
    		/*input_change_handler*/ ctx[5].call(input, /*criteria*/ ctx[8]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			t0 = space();
    			label = element("label");
    			t1 = text(t1_value);
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "class", "btn-check");
    			attr_dev(input, "name", "btnradio");
    			attr_dev(input, "id", input_id_value = /*criteria*/ ctx[8]);
    			attr_dev(input, "autocomplete", "off");
    			add_location(input, file$6, 43, 4, 1387);
    			attr_dev(label, "class", "btn btn-outline-primary");
    			attr_dev(label, "for", label_for_value = /*criteria*/ ctx[8]);
    			add_location(label, file$6, 44, 4, 1528);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			input.checked = /*selected_filters*/ ctx[1][/*criteria*/ ctx[8]];
    			insert_dev(target, t0, anchor);
    			insert_dev(target, label, anchor);
    			append_dev(label, t1);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", input_change_handler);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*filter_criteria*/ 4 && input_id_value !== (input_id_value = /*criteria*/ ctx[8])) {
    				attr_dev(input, "id", input_id_value);
    			}

    			if (dirty & /*selected_filters, filter_criteria*/ 6) {
    				input.checked = /*selected_filters*/ ctx[1][/*criteria*/ ctx[8]];
    			}

    			if (dirty & /*filter_criteria*/ 4 && t1_value !== (t1_value = /*criteria*/ ctx[8] + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*filter_criteria*/ 4 && label_for_value !== (label_for_value = /*criteria*/ ctx[8])) {
    				attr_dev(label, "for", label_for_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(label);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(43:0) {#each filter_criteria as criteria}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let p;
    	let t0;
    	let t1;
    	let div;
    	let each_value = /*filter_criteria*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text(/*title*/ ctx[0]);
    			t1 = space();
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(p, file$6, 40, 0, 1292);
    			attr_dev(div, "class", "btn-group");
    			attr_dev(div, "role", "group");
    			add_location(div, file$6, 41, 0, 1308);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*title*/ 1) set_data_dev(t0, /*title*/ ctx[0]);

    			if (dirty & /*filter_criteria, selected_filters*/ 6) {
    				each_value = /*filter_criteria*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Filter_Button', slots, []);
    	let { title } = $$props;
    	let { pre_filter_list } = $$props;
    	let { filter_property } = $$props;
    	let selected_filters = {};

    	let filter_criteria = [
    		...new Set(pre_filter_list.map(a => {
    				a.category;
    			}))
    	];

    	function updateFilterCriteria(products, property) {
    		$$invalidate(2, filter_criteria = [...new Set(products.map(a => a[property]))]);
    	}

    	function filter_list(searched_list, selected_filters, filter_key) {
    		let selected_filter_keys = Object.keys(selected_filters).filter(function (k) {
    			return selected_filters[k] !== false;
    		});

    		let filter_results;

    		if (selected_filter_keys.length) {
    			filter_results = searched_list.filter(obj => {
    				for (let key of selected_filter_keys) {
    					if (obj[filter_key] === key) {
    						return true;
    					}
    				}

    				return false;
    			});
    		} else {
    			filter_results = searched_list;
    		}

    		filtered_products.set(filter_results);
    	}

    	const writable_props = ['title', 'pre_filter_list', 'filter_property'];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Filter_Button> was created with unknown prop '${key}'`);
    	});

    	function input_change_handler(criteria) {
    		selected_filters[criteria] = this.checked;
    		$$invalidate(1, selected_filters);
    	}

    	$$self.$$set = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('pre_filter_list' in $$props) $$invalidate(3, pre_filter_list = $$props.pre_filter_list);
    		if ('filter_property' in $$props) $$invalidate(4, filter_property = $$props.filter_property);
    	};

    	$$self.$capture_state = () => ({
    		filtered_products,
    		products,
    		title,
    		pre_filter_list,
    		filter_property,
    		selected_filters,
    		filter_criteria,
    		updateFilterCriteria,
    		filter_list
    	});

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('pre_filter_list' in $$props) $$invalidate(3, pre_filter_list = $$props.pre_filter_list);
    		if ('filter_property' in $$props) $$invalidate(4, filter_property = $$props.filter_property);
    		if ('selected_filters' in $$props) $$invalidate(1, selected_filters = $$props.selected_filters);
    		if ('filter_criteria' in $$props) $$invalidate(2, filter_criteria = $$props.filter_criteria);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*pre_filter_list, selected_filters, filter_property*/ 26) {
    			filter_list(pre_filter_list, selected_filters, filter_property);
    		}

    		if ($$self.$$.dirty & /*pre_filter_list, filter_property*/ 24) {
    			updateFilterCriteria(pre_filter_list, filter_property);
    		}
    	};

    	return [
    		title,
    		selected_filters,
    		filter_criteria,
    		pre_filter_list,
    		filter_property,
    		input_change_handler
    	];
    }

    class Filter_Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {
    			title: 0,
    			pre_filter_list: 3,
    			filter_property: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Filter_Button",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*title*/ ctx[0] === undefined && !('title' in props)) {
    			console.warn("<Filter_Button> was created without expected prop 'title'");
    		}

    		if (/*pre_filter_list*/ ctx[3] === undefined && !('pre_filter_list' in props)) {
    			console.warn("<Filter_Button> was created without expected prop 'pre_filter_list'");
    		}

    		if (/*filter_property*/ ctx[4] === undefined && !('filter_property' in props)) {
    			console.warn("<Filter_Button> was created without expected prop 'filter_property'");
    		}
    	}

    	get title() {
    		throw new Error("<Filter_Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Filter_Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pre_filter_list() {
    		throw new Error("<Filter_Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pre_filter_list(value) {
    		throw new Error("<Filter_Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get filter_property() {
    		throw new Error("<Filter_Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set filter_property(value) {
    		throw new Error("<Filter_Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Filter.svelte generated by Svelte v3.46.2 */

    const { Object: Object_1 } = globals;
    const file$5 = "src\\components\\Filter.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[17] = list[i];
    	child_ctx[18] = list;
    	child_ctx[19] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[20] = list[i];
    	child_ctx[21] = list;
    	child_ctx[22] = i;
    	return child_ctx;
    }

    // (82:12) {#each filter_criteria as criteria}
    function create_each_block_1(ctx) {
    	let input;
    	let input_id_value;
    	let t0;
    	let label;
    	let t1_value = /*criteria*/ ctx[20] + "";
    	let t1;
    	let label_for_value;
    	let mounted;
    	let dispose;

    	function input_change_handler() {
    		/*input_change_handler*/ ctx[9].call(input, /*criteria*/ ctx[20]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			t0 = space();
    			label = element("label");
    			t1 = text(t1_value);
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "class", "btn-check");
    			attr_dev(input, "name", "btnradio");
    			attr_dev(input, "id", input_id_value = /*criteria*/ ctx[20]);
    			attr_dev(input, "autocomplete", "off");
    			add_location(input, file$5, 82, 16, 2911);
    			attr_dev(label, "class", "btn btn-outline-primary");
    			attr_dev(label, "for", label_for_value = /*criteria*/ ctx[20]);
    			add_location(label, file$5, 83, 16, 3064);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			input.checked = /*selected_filters*/ ctx[0][/*criteria*/ ctx[20]];
    			insert_dev(target, t0, anchor);
    			insert_dev(target, label, anchor);
    			append_dev(label, t1);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", input_change_handler);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*filter_criteria*/ 16 && input_id_value !== (input_id_value = /*criteria*/ ctx[20])) {
    				attr_dev(input, "id", input_id_value);
    			}

    			if (dirty & /*selected_filters, filter_criteria*/ 17) {
    				input.checked = /*selected_filters*/ ctx[0][/*criteria*/ ctx[20]];
    			}

    			if (dirty & /*filter_criteria*/ 16 && t1_value !== (t1_value = /*criteria*/ ctx[20] + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*filter_criteria*/ 16 && label_for_value !== (label_for_value = /*criteria*/ ctx[20])) {
    				attr_dev(label, "for", label_for_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(label);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(82:12) {#each filter_criteria as criteria}",
    		ctx
    	});

    	return block;
    }

    // (93:16) {#each filter_seller as seller}
    function create_each_block$2(ctx) {
    	let input;
    	let input_id_value;
    	let t0;
    	let label;
    	let t1_value = /*seller*/ ctx[17] + "";
    	let t1;
    	let label_for_value;
    	let mounted;
    	let dispose;

    	function input_change_handler_1() {
    		/*input_change_handler_1*/ ctx[10].call(input, /*seller*/ ctx[17]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			t0 = space();
    			label = element("label");
    			t1 = text(t1_value);
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "class", "btn-check");
    			attr_dev(input, "name", "btnradio");
    			attr_dev(input, "id", input_id_value = /*seller*/ ctx[17]);
    			attr_dev(input, "autocomplete", "off");
    			add_location(input, file$5, 93, 20, 3517);
    			attr_dev(label, "class", "btn btn-outline-primary");
    			attr_dev(label, "for", label_for_value = /*seller*/ ctx[17]);
    			add_location(label, file$5, 94, 20, 3669);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			input.checked = /*selected_seller*/ ctx[1][/*seller*/ ctx[17]];
    			insert_dev(target, t0, anchor);
    			insert_dev(target, label, anchor);
    			append_dev(label, t1);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", input_change_handler_1);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*filter_seller*/ 32 && input_id_value !== (input_id_value = /*seller*/ ctx[17])) {
    				attr_dev(input, "id", input_id_value);
    			}

    			if (dirty & /*selected_seller, filter_seller*/ 34) {
    				input.checked = /*selected_seller*/ ctx[1][/*seller*/ ctx[17]];
    			}

    			if (dirty & /*filter_seller*/ 32 && t1_value !== (t1_value = /*seller*/ ctx[17] + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*filter_seller*/ 32 && label_for_value !== (label_for_value = /*seller*/ ctx[17])) {
    				attr_dev(label, "for", label_for_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(label);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(93:16) {#each filter_seller as seller}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div7;
    	let div6;
    	let div1;
    	let p0;
    	let t1;
    	let div0;
    	let t2;
    	let div3;
    	let p1;
    	let t4;
    	let div2;
    	let t5;
    	let div5;
    	let p2;
    	let t7;
    	let div4;
    	let t8;
    	let input0;
    	let t9;
    	let input1;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*filter_criteria*/ ctx[4];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let each_value = /*filter_seller*/ ctx[5];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div7 = element("div");
    			div6 = element("div");
    			div1 = element("div");
    			p0 = element("p");
    			p0.textContent = "Filtered By Category:";
    			t1 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t2 = space();
    			div3 = element("div");
    			p1 = element("p");
    			p1.textContent = "Filtered By Seller:";
    			t4 = space();
    			div2 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t5 = space();
    			div5 = element("div");
    			p2 = element("p");
    			p2.textContent = "Filtered By Price Range:";
    			t7 = space();
    			div4 = element("div");
    			t8 = space();
    			input0 = element("input");
    			t9 = space();
    			input1 = element("input");
    			add_location(p0, file$5, 79, 12, 2765);
    			attr_dev(div0, "class", "btn-group");
    			attr_dev(div0, "role", "group");
    			add_location(div0, file$5, 80, 12, 2808);
    			attr_dev(div1, "class", "mb-2");
    			add_location(div1, file$5, 77, 8, 2599);
    			add_location(p1, file$5, 90, 12, 3369);
    			attr_dev(div2, "class", "btn-group");
    			attr_dev(div2, "role", "group");
    			add_location(div2, file$5, 91, 12, 3410);
    			attr_dev(div3, "class", "mb-2");
    			add_location(div3, file$5, 88, 8, 3207);
    			add_location(p2, file$5, 100, 12, 3844);
    			attr_dev(div4, "class", "col-auto");
    			add_location(div4, file$5, 101, 12, 3890);
    			attr_dev(input0, "type", "number");
    			attr_dev(input0, "class", "form-control");
    			attr_dev(input0, "id", "min");
    			attr_dev(input0, "placeholder", "Min (RM)");
    			add_location(input0, file$5, 102, 12, 3932);
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "class", "form-control");
    			attr_dev(input1, "id", "max");
    			attr_dev(input1, "placeholder", "Max (RM)");
    			add_location(input1, file$5, 103, 12, 4043);
    			attr_dev(div5, "class", "mb-2");
    			add_location(div5, file$5, 99, 8, 3812);
    			add_location(div6, file$5, 76, 4, 2584);
    			add_location(div7, file$5, 75, 0, 2573);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div7, anchor);
    			append_dev(div7, div6);
    			append_dev(div6, div1);
    			append_dev(div1, p0);
    			append_dev(div1, t1);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div0, null);
    			}

    			append_dev(div6, t2);
    			append_dev(div6, div3);
    			append_dev(div3, p1);
    			append_dev(div3, t4);
    			append_dev(div3, div2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div2, null);
    			}

    			append_dev(div6, t5);
    			append_dev(div6, div5);
    			append_dev(div5, p2);
    			append_dev(div5, t7);
    			append_dev(div5, div4);
    			append_dev(div5, t8);
    			append_dev(div5, input0);
    			set_input_value(input0, /*minPrice*/ ctx[2]);
    			append_dev(div5, t9);
    			append_dev(div5, input1);
    			set_input_value(input1, /*maxPrice*/ ctx[3]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[11]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[12])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*filter_criteria, selected_filters*/ 17) {
    				each_value_1 = /*filter_criteria*/ ctx[4];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*filter_seller, selected_seller*/ 34) {
    				each_value = /*filter_seller*/ ctx[5];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div2, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*minPrice*/ 4 && to_number(input0.value) !== /*minPrice*/ ctx[2]) {
    				set_input_value(input0, /*minPrice*/ ctx[2]);
    			}

    			if (dirty & /*maxPrice*/ 8 && to_number(input1.value) !== /*maxPrice*/ ctx[3]) {
    				set_input_value(input1, /*maxPrice*/ ctx[3]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div7);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let $filtered_products;
    	let $searched_products;
    	let $products;
    	validate_store(filtered_products, 'filtered_products');
    	component_subscribe($$self, filtered_products, $$value => $$invalidate(6, $filtered_products = $$value));
    	validate_store(searched_products, 'searched_products');
    	component_subscribe($$self, searched_products, $$value => $$invalidate(7, $searched_products = $$value));
    	validate_store(products, 'products');
    	component_subscribe($$self, products, $$value => $$invalidate(8, $products = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Filter', slots, []);

    	let filter_criteria = [
    		...new Set($searched_products.map(a => {
    				a.category;
    			}))
    	].sort();

    	let filter_seller = [
    		...new Set($filtered_products.map(a => {
    				a.seller;
    			}))
    	].sort();

    	function updateFilterCriteria(products) {
    		$$invalidate(4, filter_criteria = [...new Set(products.map(a => a.category))].sort());
    	}

    	function updateFilterSeller(products) {
    		$$invalidate(5, filter_seller = [...new Set(products.map(a => a.seller))].sort());
    	}

    	let selected_filters = {};
    	let selected_seller = {};

    	function filter_list(searched_list, selected_filters, filter_key) {
    		let selected_filter_keys = Object.keys(selected_filters).filter(function (k) {
    			return selected_filters[k] !== false;
    		});

    		let filter_results;

    		if (selected_filter_keys.length) {
    			filter_results = searched_list.filter(obj => {
    				for (let key of selected_filter_keys) {
    					if (obj[filter_key] === key) {
    						return true;
    					}
    				}

    				return false;
    			});
    		} else {
    			filter_results = searched_list;
    		}

    		filtered_products.set(filter_results);
    	}

    	let minPrice;
    	let maxPrice;

    	function filterByPriceRange(searched_list, min, max) {
    		let filter_result;

    		if (minPrice && maxPrice) {
    			filter_result = $filtered_products.filter(obj => {
    				return obj.price >= minPrice && obj.price <= maxPrice;
    			});
    		} else if (minPrice) {
    			filter_result = $filtered_products.filter(obj => {
    				return obj.price >= minPrice;
    			});
    		} else if (maxPrice) {
    			filter_result = $filtered_products.filter(obj => {
    				return obj.price <= maxPrice;
    			});
    		} else {
    			filter_result = $filtered_products;
    		}

    		filtered_products.set(filter_result);
    	}

    	const writable_props = [];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Filter> was created with unknown prop '${key}'`);
    	});

    	function input_change_handler(criteria) {
    		selected_filters[criteria] = this.checked;
    		$$invalidate(0, selected_filters);
    	}

    	function input_change_handler_1(seller) {
    		selected_seller[seller] = this.checked;
    		$$invalidate(1, selected_seller);
    	}

    	function input0_input_handler() {
    		minPrice = to_number(this.value);
    		$$invalidate(2, minPrice);
    	}

    	function input1_input_handler() {
    		maxPrice = to_number(this.value);
    		$$invalidate(3, maxPrice);
    	}

    	$$self.$capture_state = () => ({
    		onMount,
    		searched_products,
    		filtered_products,
    		products,
    		Filter_Button,
    		filter_criteria,
    		filter_seller,
    		updateFilterCriteria,
    		updateFilterSeller,
    		selected_filters,
    		selected_seller,
    		filter_list,
    		minPrice,
    		maxPrice,
    		filterByPriceRange,
    		$filtered_products,
    		$searched_products,
    		$products
    	});

    	$$self.$inject_state = $$props => {
    		if ('filter_criteria' in $$props) $$invalidate(4, filter_criteria = $$props.filter_criteria);
    		if ('filter_seller' in $$props) $$invalidate(5, filter_seller = $$props.filter_seller);
    		if ('selected_filters' in $$props) $$invalidate(0, selected_filters = $$props.selected_filters);
    		if ('selected_seller' in $$props) $$invalidate(1, selected_seller = $$props.selected_seller);
    		if ('minPrice' in $$props) $$invalidate(2, minPrice = $$props.minPrice);
    		if ('maxPrice' in $$props) $$invalidate(3, maxPrice = $$props.maxPrice);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$searched_products, selected_filters, $products, selected_seller, minPrice, maxPrice*/ 399) {
    			filter_list($searched_products, selected_filters, "category");
    		}

    		if ($$self.$$.dirty & /*$searched_products*/ 128) {
    			updateFilterCriteria($searched_products);
    		}

    		if ($$self.$$.dirty & /*$filtered_products*/ 64) {
    			updateFilterSeller($filtered_products);
    		}

    		if ($$self.$$.dirty & /*$filtered_products, selected_seller*/ 66) {
    			filter_list($filtered_products, selected_seller, "seller");
    		}

    		if ($$self.$$.dirty & /*$filtered_products, minPrice, maxPrice*/ 76) {
    			filterByPriceRange();
    		}
    	};

    	return [
    		selected_filters,
    		selected_seller,
    		minPrice,
    		maxPrice,
    		filter_criteria,
    		filter_seller,
    		$filtered_products,
    		$searched_products,
    		$products,
    		input_change_handler,
    		input_change_handler_1,
    		input0_input_handler,
    		input1_input_handler
    	];
    }

    class Filter extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Filter",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src\components\Cart_Item.svelte generated by Svelte v3.46.2 */

    const { console: console_1$2 } = globals;
    const file$4 = "src\\components\\Cart_Item.svelte";

    function create_fragment$4(ctx) {
    	let div3;
    	let div0;
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let t0;
    	let div1;
    	let p0;
    	let t1_value = /*product*/ ctx[1].name + "";
    	let t1;
    	let t2;
    	let p1;
    	let t3;
    	let t4;
    	let t5;
    	let p2;
    	let t6;
    	let span;
    	let t7_value = /*product*/ ctx[1].price * /*quantity*/ ctx[0] + "";
    	let t7;
    	let t8;
    	let div2;
    	let button;
    	let t9;
    	let hr;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			div1 = element("div");
    			p0 = element("p");
    			t1 = text(t1_value);
    			t2 = space();
    			p1 = element("p");
    			t3 = text("Quantity : ");
    			t4 = text(/*quantity*/ ctx[0]);
    			t5 = space();
    			p2 = element("p");
    			t6 = text("Total Price: RM ");
    			span = element("span");
    			t7 = text(t7_value);
    			t8 = space();
    			div2 = element("div");
    			button = element("button");
    			t9 = space();
    			hr = element("hr");
    			if (!src_url_equal(img.src, img_src_value = /*product*/ ctx[1].img)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = "Product Image for " + /*product*/ ctx[1].name);
    			attr_dev(img, "class", "img-fluid svelte-twvdg9");
    			add_location(img, file$4, 35, 8, 896);
    			attr_dev(div0, "class", "col-md-4");
    			add_location(div0, file$4, 34, 4, 864);
    			attr_dev(p0, "class", "fw-bold");
    			add_location(p0, file$4, 38, 8, 1027);
    			add_location(p1, file$4, 39, 8, 1074);
    			attr_dev(span, "class", "fw-bolder fs-5");
    			add_location(span, file$4, 40, 27, 1131);
    			add_location(p2, file$4, 40, 8, 1112);
    			attr_dev(div1, "class", "col-md-6");
    			add_location(div1, file$4, 37, 4, 995);
    			attr_dev(button, "class", "btn btn-close btn-small");
    			add_location(button, file$4, 43, 8, 1257);
    			attr_dev(div2, "class", "col-md-2 text-end");
    			add_location(div2, file$4, 42, 4, 1215);
    			attr_dev(div3, "class", "row svelte-twvdg9");
    			add_location(div3, file$4, 33, 0, 841);
    			attr_dev(hr, "class", "divider svelte-twvdg9");
    			add_location(hr, file$4, 47, 0, 1363);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			append_dev(div0, img);
    			append_dev(div3, t0);
    			append_dev(div3, div1);
    			append_dev(div1, p0);
    			append_dev(p0, t1);
    			append_dev(div1, t2);
    			append_dev(div1, p1);
    			append_dev(p1, t3);
    			append_dev(p1, t4);
    			append_dev(div1, t5);
    			append_dev(div1, p2);
    			append_dev(p2, t6);
    			append_dev(p2, span);
    			append_dev(span, t7);
    			append_dev(div3, t8);
    			append_dev(div3, div2);
    			append_dev(div2, button);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, hr, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*removeCartItem*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*product*/ 2 && !src_url_equal(img.src, img_src_value = /*product*/ ctx[1].img)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*product*/ 2 && img_alt_value !== (img_alt_value = "Product Image for " + /*product*/ ctx[1].name)) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (dirty & /*product*/ 2 && t1_value !== (t1_value = /*product*/ ctx[1].name + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*quantity*/ 1) set_data_dev(t4, /*quantity*/ ctx[0]);
    			if (dirty & /*product, quantity*/ 3 && t7_value !== (t7_value = /*product*/ ctx[1].price * /*quantity*/ ctx[0] + "")) set_data_dev(t7, t7_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(hr);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let $cart_items;
    	let $products;
    	validate_store(cart_items, 'cart_items');
    	component_subscribe($$self, cart_items, $$value => $$invalidate(4, $cart_items = $$value));
    	validate_store(products, 'products');
    	component_subscribe($$self, products, $$value => $$invalidate(5, $products = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Cart_Item', slots, []);
    	let { productId } = $$props;
    	let { quantity } = $$props;

    	let product = $products.find(x => {
    		return x.id === productId;
    	});

    	afterUpdate(() => {
    		$$invalidate(1, product = null);

    		$$invalidate(1, product = $products.find(x => {
    			return x.id === productId;
    		}));
    	});

    	function removeCartItem() {
    		let cartList = $cart_items;
    		console.log("Attempt to delete " + productId);

    		if (cartList.has(productId)) {
    			console.log("Item Delete: " + cartList.delete(productId));
    		}

    		console.log(Array.from($cart_items));
    		cart_items.set(cartList);
    		console.log($cart_items);
    	}

    	const writable_props = ['productId', 'quantity'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<Cart_Item> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('productId' in $$props) $$invalidate(3, productId = $$props.productId);
    		if ('quantity' in $$props) $$invalidate(0, quantity = $$props.quantity);
    	};

    	$$self.$capture_state = () => ({
    		afterUpdate,
    		beforeUpdate,
    		onMount,
    		products,
    		cart_items,
    		productId,
    		quantity,
    		product,
    		removeCartItem,
    		$cart_items,
    		$products
    	});

    	$$self.$inject_state = $$props => {
    		if ('productId' in $$props) $$invalidate(3, productId = $$props.productId);
    		if ('quantity' in $$props) $$invalidate(0, quantity = $$props.quantity);
    		if ('product' in $$props) $$invalidate(1, product = $$props.product);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [quantity, product, removeCartItem, productId];
    }

    class Cart_Item extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { productId: 3, quantity: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Cart_Item",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*productId*/ ctx[3] === undefined && !('productId' in props)) {
    			console_1$2.warn("<Cart_Item> was created without expected prop 'productId'");
    		}

    		if (/*quantity*/ ctx[0] === undefined && !('quantity' in props)) {
    			console_1$2.warn("<Cart_Item> was created without expected prop 'quantity'");
    		}
    	}

    	get productId() {
    		throw new Error("<Cart_Item>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set productId(value) {
    		throw new Error("<Cart_Item>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get quantity() {
    		throw new Error("<Cart_Item>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set quantity(value) {
    		throw new Error("<Cart_Item>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Cart.svelte generated by Svelte v3.46.2 */
    const file$3 = "src\\components\\Cart.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i][0];
    	child_ctx[3] = list[i][1];
    	return child_ctx;
    }

    // (31:4) {:else}
    function create_else_block(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "No Product added to cart.";
    			attr_dev(p, "class", "text-center");
    			add_location(p, file$3, 31, 8, 981);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(31:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (25:4) {#if $cart_items.size}
    function create_if_block_1(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = Array.from(/*$cart_items*/ ctx[0]);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*Array, $cart_items*/ 1) {
    				each_value = Array.from(/*$cart_items*/ ctx[0]);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(25:4) {#if $cart_items.size}",
    		ctx
    	});

    	return block;
    }

    // (26:8) {#each Array.from($cart_items) as [key,value]}
    function create_each_block$1(ctx) {
    	let cart_item;
    	let current;

    	cart_item = new Cart_Item({
    			props: {
    				productId: /*key*/ ctx[2],
    				quantity: /*value*/ ctx[3]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(cart_item.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(cart_item, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const cart_item_changes = {};
    			if (dirty & /*$cart_items*/ 1) cart_item_changes.productId = /*key*/ ctx[2];
    			if (dirty & /*$cart_items*/ 1) cart_item_changes.quantity = /*value*/ ctx[3];
    			cart_item.$set(cart_item_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cart_item.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cart_item.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(cart_item, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(26:8) {#each Array.from($cart_items) as [key,value]}",
    		ctx
    	});

    	return block;
    }

    // (36:4) {#if $cart_items.size}
    function create_if_block$1(ctx) {
    	let button;
    	let t;
    	let span;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text("Clear All Cart Item ");
    			span = element("span");
    			attr_dev(span, "class", "fas fa-trash");
    			add_location(span, file$3, 36, 87, 1197);
    			attr_dev(button, "class", "btn btn-danger");
    			add_location(button, file$3, 36, 8, 1118);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);
    			append_dev(button, span);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*clearAllCartItem*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(36:4) {#if $cart_items.size}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div0;
    	let h5;
    	let t1;
    	let div1;
    	let current_block_type_index;
    	let if_block0;
    	let t2;
    	let div2;
    	let t3;
    	let button;
    	let current;
    	const if_block_creators = [create_if_block_1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$cart_items*/ ctx[0].size) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let if_block1 = /*$cart_items*/ ctx[0].size && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			h5 = element("h5");
    			h5.textContent = "My Cart";
    			t1 = space();
    			div1 = element("div");
    			if_block0.c();
    			t2 = space();
    			div2 = element("div");
    			if (if_block1) if_block1.c();
    			t3 = space();
    			button = element("button");
    			button.textContent = "Close";
    			attr_dev(h5, "class", "modal-title");
    			add_location(h5, file$3, 20, 4, 513);
    			attr_dev(div0, "class", "modal-header");
    			add_location(div0, file$3, 19, 0, 481);
    			attr_dev(div1, "class", "modal-body");
    			add_location(div1, file$3, 23, 0, 666);
    			attr_dev(button, "class", "btn btn-secondary");
    			attr_dev(button, "data-bs-dismiss", "modal");
    			add_location(button, file$3, 38, 4, 1257);
    			attr_dev(div2, "class", "modal-footer");
    			add_location(div2, file$3, 34, 0, 1054);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, h5);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			if_blocks[current_block_type_index].m(div1, null);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div2, anchor);
    			if (if_block1) if_block1.m(div2, null);
    			append_dev(div2, t3);
    			append_dev(div2, button);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block0 = if_blocks[current_block_type_index];

    				if (!if_block0) {
    					if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block0.c();
    				} else {
    					if_block0.p(ctx, dirty);
    				}

    				transition_in(if_block0, 1);
    				if_block0.m(div1, null);
    			}

    			if (/*$cart_items*/ ctx[0].size) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$1(ctx);
    					if_block1.c();
    					if_block1.m(div2, t3);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    			if_blocks[current_block_type_index].d();
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div2);
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let $cart_items;
    	validate_store(cart_items, 'cart_items');
    	component_subscribe($$self, cart_items, $$value => $$invalidate(0, $cart_items = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Cart', slots, []);

    	function clearAllCartItem() {
    		cart_items.set(new Map());
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Cart> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		cart_items,
    		Cart_Item,
    		onMount,
    		clearAllCartItem,
    		$cart_items
    	});

    	return [$cart_items, clearAllCartItem];
    }

    class Cart extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Cart",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\components\Modal.svelte generated by Svelte v3.46.2 */

    const file$2 = "src\\components\\Modal.svelte";

    function create_fragment$2(ctx) {
    	let div2;
    	let div1;
    	let div0;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div0, "class", "modal-content");
    			add_location(div0, file$2, 9, 8, 311);
    			attr_dev(div1, "class", "modal-dialog " + /*sizeClass*/ ctx[1]);
    			add_location(div1, file$2, 8, 4, 263);
    			attr_dev(div2, "class", "modal fade");
    			attr_dev(div2, "tabindex", "-1");
    			attr_dev(div2, "role", "dialog");
    			attr_dev(div2, "id", /*modalId*/ ctx[0]);
    			attr_dev(div2, "aria-labelledby", /*modalId*/ ctx[0]);
    			attr_dev(div2, "aria-hidden", "true");
    			add_location(div2, file$2, 7, 0, 143);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, div0);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[3],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*modalId*/ 1) {
    				attr_dev(div2, "id", /*modalId*/ ctx[0]);
    			}

    			if (!current || dirty & /*modalId*/ 1) {
    				attr_dev(div2, "aria-labelledby", /*modalId*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Modal', slots, ['default']);
    	let { size } = $$props;
    	let { modalId } = $$props;
    	let sizeClass = size >= 1 ? "modal-lg" : size < 0 ? "modal-sm" : "";
    	const writable_props = ['size', 'modalId'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Modal> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('size' in $$props) $$invalidate(2, size = $$props.size);
    		if ('modalId' in $$props) $$invalidate(0, modalId = $$props.modalId);
    		if ('$$scope' in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ size, modalId, sizeClass });

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(2, size = $$props.size);
    		if ('modalId' in $$props) $$invalidate(0, modalId = $$props.modalId);
    		if ('sizeClass' in $$props) $$invalidate(1, sizeClass = $$props.sizeClass);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [modalId, sizeClass, size, $$scope, slots];
    }

    class Modal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { size: 2, modalId: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Modal",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*size*/ ctx[2] === undefined && !('size' in props)) {
    			console.warn("<Modal> was created without expected prop 'size'");
    		}

    		if (/*modalId*/ ctx[0] === undefined && !('modalId' in props)) {
    			console.warn("<Modal> was created without expected prop 'modalId'");
    		}
    	}

    	get size() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get modalId() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set modalId(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }
    function slide(node, { delay = 0, duration = 400, easing = cubicOut } = {}) {
        const style = getComputedStyle(node);
        const opacity = +style.opacity;
        const height = parseFloat(style.height);
        const padding_top = parseFloat(style.paddingTop);
        const padding_bottom = parseFloat(style.paddingBottom);
        const margin_top = parseFloat(style.marginTop);
        const margin_bottom = parseFloat(style.marginBottom);
        const border_top_width = parseFloat(style.borderTopWidth);
        const border_bottom_width = parseFloat(style.borderBottomWidth);
        return {
            delay,
            duration,
            easing,
            css: t => 'overflow: hidden;' +
                `opacity: ${Math.min(t * 20, 1) * opacity};` +
                `height: ${t * height}px;` +
                `padding-top: ${t * padding_top}px;` +
                `padding-bottom: ${t * padding_bottom}px;` +
                `margin-top: ${t * margin_top}px;` +
                `margin-bottom: ${t * margin_bottom}px;` +
                `border-top-width: ${t * border_top_width}px;` +
                `border-bottom-width: ${t * border_bottom_width}px;`
        };
    }

    /* src\components\Sort.svelte generated by Svelte v3.46.2 */

    const { console: console_1$1 } = globals;
    const file$1 = "src\\components\\Sort.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    // (56:8) {#each options as option}
    function create_each_block(ctx) {
    	let input;
    	let t0;
    	let label;
    	let t1_value = /*option*/ ctx[9].name + "";
    	let t1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			t0 = space();
    			label = element("label");
    			t1 = text(t1_value);
    			attr_dev(input, "type", "radio");
    			attr_dev(input, "class", "btn-check");
    			attr_dev(input, "id", /*option*/ ctx[9].name);
    			attr_dev(input, "autocomplete", "off");
    			attr_dev(input, "name", "option");
    			input.__value = /*option*/ ctx[9].property;
    			input.value = input.__value;
    			/*$$binding_groups*/ ctx[6][0].push(input);
    			add_location(input, file$1, 56, 12, 1433);
    			attr_dev(label, "class", "btn btn-outline-secondary");
    			attr_dev(label, "for", /*option*/ ctx[9].name);
    			add_location(label, file$1, 57, 12, 1588);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			input.checked = input.__value === /*selectedOption*/ ctx[0];
    			insert_dev(target, t0, anchor);
    			insert_dev(target, label, anchor);
    			append_dev(label, t1);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*input_change_handler*/ ctx[5]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*selectedOption*/ 1) {
    				input.checked = input.__value === /*selectedOption*/ ctx[0];
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			/*$$binding_groups*/ ctx[6][0].splice(/*$$binding_groups*/ ctx[6][0].indexOf(input), 1);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(label);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(56:8) {#each options as option}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div1;
    	let p;
    	let t0;
    	let span;
    	let span_class_value;
    	let span_transition;
    	let t1;
    	let div0;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*options*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			p = element("p");
    			t0 = text("Sort By: ");
    			span = element("span");
    			t1 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(span, "class", span_class_value = "btn fas " + /*iconClass*/ ctx[1] + " svelte-1ri3fd5");
    			attr_dev(span, "id", "sort_icon");
    			add_location(span, file$1, 53, 25, 1243);
    			attr_dev(p, "class", "");
    			add_location(p, file$1, 53, 4, 1222);
    			attr_dev(div0, "class", "btn-group");
    			attr_dev(div0, "role", "group");
    			add_location(div0, file$1, 54, 4, 1348);
    			attr_dev(div1, "class", "mb-2 text-end svelte-1ri3fd5");
    			add_location(div1, file$1, 51, 0, 1067);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, p);
    			append_dev(p, t0);
    			append_dev(p, span);
    			append_dev(div1, t1);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(span, "click", /*toggleOrder*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*iconClass*/ 2 && span_class_value !== (span_class_value = "btn fas " + /*iconClass*/ ctx[1] + " svelte-1ri3fd5")) {
    				attr_dev(span, "class", span_class_value);
    			}

    			if (dirty & /*options, selectedOption*/ 5) {
    				each_value = /*options*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!span_transition) span_transition = create_bidirectional_transition(span, fade, {}, true);
    				span_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!span_transition) span_transition = create_bidirectional_transition(span, fade, {}, false);
    			span_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (detaching && span_transition) span_transition.end();
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $filtered_products;
    	validate_store(filtered_products, 'filtered_products');
    	component_subscribe($$self, filtered_products, $$value => $$invalidate(7, $filtered_products = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Sort', slots, []);

    	let options = [
    		{ "name": "Name", "property": "name" },
    		{ "name": "Seller", "property": "seller" },
    		{
    			"name": "Category",
    			"property": "category"
    		},
    		{ "name": "Price", "property": "price" }
    	];

    	let selectedOption = null;

    	function sortList(option) {
    		if (option != null) {
    			let list = $filtered_products;
    			console.log(option);

    			list = list.sort((a, b) => {
    				if (isAscending) {
    					return b[option] < a[option] ? 1 : -1;
    				} else {
    					return a[option] < b[option] ? 1 : -1;
    				}
    			});

    			filtered_products.set(list);
    		}
    	}

    	let isAscending = false;
    	let iconClass = "fa-sort-alpha-up";

    	function toggleOrder() {
    		$$invalidate(4, isAscending = !isAscending);
    		$$invalidate(1, iconClass = isAscending ? "fa-sort-alpha-down" : "fa-sort-alpha-up");
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<Sort> was created with unknown prop '${key}'`);
    	});

    	const $$binding_groups = [[]];

    	function input_change_handler() {
    		selectedOption = this.__value;
    		$$invalidate(0, selectedOption);
    	}

    	$$self.$capture_state = () => ({
    		afterUpdate,
    		fade,
    		filtered_products,
    		options,
    		selectedOption,
    		sortList,
    		isAscending,
    		iconClass,
    		toggleOrder,
    		$filtered_products
    	});

    	$$self.$inject_state = $$props => {
    		if ('options' in $$props) $$invalidate(2, options = $$props.options);
    		if ('selectedOption' in $$props) $$invalidate(0, selectedOption = $$props.selectedOption);
    		if ('isAscending' in $$props) $$invalidate(4, isAscending = $$props.isAscending);
    		if ('iconClass' in $$props) $$invalidate(1, iconClass = $$props.iconClass);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*selectedOption, isAscending*/ 17) {
    			sortList(selectedOption);
    		}
    	};

    	return [
    		selectedOption,
    		iconClass,
    		options,
    		toggleOrder,
    		isAscending,
    		input_change_handler,
    		$$binding_groups
    	];
    }

    class Sort extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Sort",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.46.2 */

    const { console: console_1 } = globals;

    const file = "src\\App.svelte";

    // (55:2) {#if isFilterShow}
    function create_if_block(ctx) {
    	let div2;
    	let div0;
    	let filter;
    	let t;
    	let div1;
    	let sort;
    	let div2_transition;
    	let current;
    	filter = new Filter({ $$inline: true });
    	sort = new Sort({ $$inline: true });

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			create_component(filter.$$.fragment);
    			t = space();
    			div1 = element("div");
    			create_component(sort.$$.fragment);
    			attr_dev(div0, "class", "col mb-3 svelte-sqk6zg");
    			add_location(div0, file, 56, 4, 1960);
    			attr_dev(div1, "class", "col mb-3 svelte-sqk6zg");
    			add_location(div1, file, 59, 4, 2018);
    			attr_dev(div2, "class", "row");
    			add_location(div2, file, 55, 3, 1893);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			mount_component(filter, div0, null);
    			append_dev(div2, t);
    			append_dev(div2, div1);
    			mount_component(sort, div1, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(filter.$$.fragment, local);
    			transition_in(sort.$$.fragment, local);

    			add_render_callback(() => {
    				if (!div2_transition) div2_transition = create_bidirectional_transition(div2, slide, { delay: 0, duration: 300 }, true);
    				div2_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(filter.$$.fragment, local);
    			transition_out(sort.$$.fragment, local);
    			if (!div2_transition) div2_transition = create_bidirectional_transition(div2, slide, { delay: 0, duration: 300 }, false);
    			div2_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_component(filter);
    			destroy_component(sort);
    			if (detaching && div2_transition) div2_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(55:2) {#if isFilterShow}",
    		ctx
    	});

    	return block;
    }

    // (74:1) <Modal modalId=addProductModal>
    function create_default_slot_1(ctx) {
    	let form;
    	let current;
    	form = new Form({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(form.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(form, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(form.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(form.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(form, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(74:1) <Modal modalId=addProductModal>",
    		ctx
    	});

    	return block;
    }

    // (78:1) <Modal modalId=cartModal size=1>
    function create_default_slot(ctx) {
    	let cart;
    	let current;
    	cart = new Cart({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(cart.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(cart, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cart.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cart.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(cart, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(78:1) <Modal modalId=cartModal size=1>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let div6;
    	let h2;
    	let t1;
    	let button0;
    	let t3;
    	let button1;
    	let t5;
    	let div3;
    	let div0;
    	let search;
    	let t6;
    	let div2;
    	let div1;
    	let button2;
    	let t7;
    	let span0;
    	let t8;
    	let button3;
    	let t9;
    	let span1;
    	let t10;
    	let t11;
    	let div4;
    	let list;
    	let t12;
    	let div5;
    	let label;
    	let t14;
    	let input;
    	let t15;
    	let modal0;
    	let t16;
    	let modal1;
    	let current;
    	let mounted;
    	let dispose;

    	search = new Search({
    			props: { toggleFunction: /*toggleFilter*/ ctx[1] },
    			$$inline: true
    		});

    	let if_block = /*isFilterShow*/ ctx[0] && create_if_block(ctx);
    	list = new List({ $$inline: true });

    	modal0 = new Modal({
    			props: {
    				modalId: "addProductModal",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	modal1 = new Modal({
    			props: {
    				modalId: "cartModal",
    				size: "1",
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			div6 = element("div");
    			h2 = element("h2");
    			h2.textContent = "Product Available";
    			t1 = space();
    			button0 = element("button");
    			button0.textContent = "Push Notification";
    			t3 = space();
    			button1 = element("button");
    			button1.textContent = "Request Notification Permission";
    			t5 = space();
    			div3 = element("div");
    			div0 = element("div");
    			create_component(search.$$.fragment);
    			t6 = space();
    			div2 = element("div");
    			div1 = element("div");
    			button2 = element("button");
    			t7 = text("Create New Product ");
    			span0 = element("span");
    			t8 = space();
    			button3 = element("button");
    			t9 = text("View Cart ");
    			span1 = element("span");
    			t10 = space();
    			if (if_block) if_block.c();
    			t11 = space();
    			div4 = element("div");
    			create_component(list.$$.fragment);
    			t12 = space();
    			div5 = element("div");
    			label = element("label");
    			label.textContent = "Upload a photo";
    			t14 = space();
    			input = element("input");
    			t15 = space();
    			create_component(modal0.$$.fragment);
    			t16 = space();
    			create_component(modal1.$$.fragment);
    			add_location(h2, file, 40, 2, 1141);
    			attr_dev(button0, "class", "btn btn-primary svelte-sqk6zg");
    			add_location(button0, file, 41, 2, 1171);
    			attr_dev(button1, "class", "btn btn-primary svelte-sqk6zg");
    			add_location(button1, file, 42, 2, 1264);
    			attr_dev(div0, "class", "col svelte-sqk6zg");
    			add_location(div0, file, 44, 3, 1396);
    			attr_dev(span0, "class", "fas fa-plus");
    			add_location(span0, file, 49, 113, 1635);
    			attr_dev(button2, "class", "btn btn-primary svelte-sqk6zg");
    			attr_dev(button2, "data-bs-toggle", "modal");
    			attr_dev(button2, "data-bs-target", "#addProductModal");
    			add_location(button2, file, 49, 5, 1527);
    			attr_dev(span1, "class", "fas fa-shopping-cart");
    			add_location(span1, file, 50, 100, 1779);
    			attr_dev(button3, "class", "btn btn-secondary svelte-sqk6zg");
    			attr_dev(button3, "data-bs-toggle", "modal");
    			attr_dev(button3, "data-bs-target", "#cartModal");
    			add_location(button3, file, 50, 5, 1684);
    			attr_dev(div1, "class", "float-end svelte-sqk6zg");
    			add_location(div1, file, 48, 4, 1497);
    			attr_dev(div2, "class", "col svelte-sqk6zg");
    			add_location(div2, file, 47, 3, 1474);
    			attr_dev(div3, "class", "row mb-3");
    			add_location(div3, file, 43, 2, 1369);
    			attr_dev(div4, "class", "row");
    			add_location(div4, file, 64, 2, 2091);
    			attr_dev(label, "for", "imageFile");
    			attr_dev(label, "class", "fs-3");
    			add_location(label, file, 68, 3, 2160);
    			attr_dev(input, "type", "file");
    			attr_dev(input, "id", "imageFile");
    			attr_dev(input, "capture", "user");
    			attr_dev(input, "accept", "image/*");
    			attr_dev(input, "class", "form-control");
    			input.multiple = true;
    			add_location(input, file, 69, 3, 2223);
    			attr_dev(div5, "class", "row");
    			add_location(div5, file, 67, 2, 2135);
    			attr_dev(div6, "class", "container p-2");
    			add_location(div6, file, 39, 1, 1110);
    			add_location(main, file, 38, 0, 1101);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div6);
    			append_dev(div6, h2);
    			append_dev(div6, t1);
    			append_dev(div6, button0);
    			append_dev(div6, t3);
    			append_dev(div6, button1);
    			append_dev(div6, t5);
    			append_dev(div6, div3);
    			append_dev(div3, div0);
    			mount_component(search, div0, null);
    			append_dev(div3, t6);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, button2);
    			append_dev(button2, t7);
    			append_dev(button2, span0);
    			append_dev(div1, t8);
    			append_dev(div1, button3);
    			append_dev(button3, t9);
    			append_dev(button3, span1);
    			append_dev(div6, t10);
    			if (if_block) if_block.m(div6, null);
    			append_dev(div6, t11);
    			append_dev(div6, div4);
    			mount_component(list, div4, null);
    			append_dev(div6, t12);
    			append_dev(div6, div5);
    			append_dev(div5, label);
    			append_dev(div5, t14);
    			append_dev(div5, input);
    			append_dev(main, t15);
    			mount_component(modal0, main, null);
    			append_dev(main, t16);
    			mount_component(modal1, main, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", displayNotification, false, false, false),
    					listen_dev(button1, "click", requestPermission, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*isFilterShow*/ ctx[0]) {
    				if (if_block) {
    					if (dirty & /*isFilterShow*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div6, t11);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			const modal0_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				modal0_changes.$$scope = { dirty, ctx };
    			}

    			modal0.$set(modal0_changes);
    			const modal1_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				modal1_changes.$$scope = { dirty, ctx };
    			}

    			modal1.$set(modal1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(search.$$.fragment, local);
    			transition_in(if_block);
    			transition_in(list.$$.fragment, local);
    			transition_in(modal0.$$.fragment, local);
    			transition_in(modal1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(search.$$.fragment, local);
    			transition_out(if_block);
    			transition_out(list.$$.fragment, local);
    			transition_out(modal0.$$.fragment, local);
    			transition_out(modal1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(search);
    			if (if_block) if_block.d();
    			destroy_component(list);
    			destroy_component(modal0);
    			destroy_component(modal1);
    			mounted = false;
    			run_all(dispose);
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

    function displayNotification() {
    	if (Notification.permission == 'granted') {
    		navigator.serviceWorker.getRegistration().then(function (reg) {
    			reg.showNotification("Testing");
    		});
    	} else {
    		console.log("Permission not granted.");
    	}
    }

    function requestPermission() {
    	Notification.requestPermission(function (status) {
    		console.log('Notification permission status:', status);
    	});
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let isFilterShow = false;

    	function toggleFilter() {
    		$$invalidate(0, isFilterShow = !isFilterShow);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		products,
    		List,
    		Search,
    		Form,
    		Filter,
    		Cart,
    		Modal,
    		Sort,
    		slide,
    		onMount,
    		isFilterShow,
    		toggleFilter,
    		displayNotification,
    		requestPermission
    	});

    	$$self.$inject_state = $$props => {
    		if ('isFilterShow' in $$props) $$invalidate(0, isFilterShow = $$props.isFilterShow);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [isFilterShow, toggleFilter];
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

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    if ('serviceWorker' in navigator) {
    	window.addEventListener('load', function() {
    	  navigator.serviceWorker.register("/sw.js").then(function(registration) {
    		// Registration was successful
    		console.log('ServiceWorker registration successful with scope: ', registration.scope);
    		//displayNotification("Service Worker Activated.");
    		registration.pushManager.getSubscription().then(function(sub) {
    			if (sub === null) {
    			  // Update UI to ask user to register for Push
    			  subscribeUser();
    			  //displayNotification("Not subscribe");
    			  console.log('Not subscribed to push service!');
    			} else {
    			  // We have a subscription, update the database
    			  console.log('Subscription object: ', sub);
    			}
    		  });
    	  }, function(err) {
    		// registration failed :(
    		console.log('ServiceWorker registration failed: ', err);
    	  });
    	});
      }

      function subscribeUser() {
    	if ('serviceWorker' in navigator) {
    	  navigator.serviceWorker.ready.then(function(reg) {
      
    		// reg.pushManager.subscribe({
    		//   userVisibleOnly: true
    		// }).then(function(sub) {
    		//   console.log('Endpoint URL: ', sub.endpoint);
    		// }).catch(function(e) {
    		//   if (Notification.permission === 'denied') {
    		// 	console.warn('Permission for notifications was denied');
    		//   } else {
    		// 	console.error('Unable to subscribe to push', e);
    		//   }
    		// });
    	  });
    	}
      }

    return app;

})();
//# sourceMappingURL=bundle.js.map
