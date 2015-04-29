(function() {
    var slice = Array.prototype.slice,
        toString = Object.prototype.toString,
        argument_error = 'arguments invalid, you should specify a function as callback!';

    function iEvents(task, fn) {
        if (toString.call(task) !== '[object Array]') {
            task = slice.call(arguments, 0);
            fn = task.pop();
        }
        if (typeof fn !== 'function') {
            throw argument_error;
        }
        return {
            _args: {},
            _on: [],
            _emited: {},
            _onFail: null,
            off: off,
            once: once,
            on: on,
            onFail: onFail,
            fail: fail,
            end: end,
            pub: pub,
            emit: pub
        }.on(task, function() {
            this.end();
            fn.apply(this, arguments);
        });
    }

    function off(task, fn) {
        if (toString.call(task) !== '[object Array]') {
            task = slice.call(arguments, 0);
            fn = task.pop();
        }
        if (typeof fn !== 'function') {
            throw argument_error;
        }
        this._on.forEach(function(item, index, _on) {
            if (undefined === item || item.tasks.length != task.length || fn !== item.callback) {
                return;
            }
            if (item.tasks.every(function(t, indx) {
                    return task[indx] === t;
                })) {
                _on[index] = undefined;
            }
        })
        return this;
    }

    function once() {
        var args = slice.call(arguments, 0);
        args.push(true);
        on.apply(this, args);
        return this;
    }

    function on(task, fn, once) {
        if (toString.call(task) !== '[object Array]') {
            task = slice.call(arguments, 0);
            if (typeof task[task.length - 1] == 'function') {
                once = false;
            } else {
                once = task.pop();
            }
            fn = task.pop();
        }
        if (typeof fn !== 'function') {
            throw argument_error;
        }
        this._on.push({
            tasks: task,
            callback: fn,
            once: once,
            emited: 0
        });
        return this;
    }

    function onFail(fn) {
        this._onFail = fn;
        return this;
    }

    function fail() {
        if (this._onFail) {
            this._onFail.apply(this, arguments);
        }
        this.end();
        return this;
    }

    function end() {
        this._on.length = 0;
        this._args = {};
        this._emited = {};
        this._onFail = null;
        return this;
    }

    function every(task) {
        return this._emited[task] === true;
    }

    function map(task) {
        return this._args[task];
    }

    function pub(event, args) {
        this._args[event] = args;
        this._emited[event] = true;
        this._on.forEach(function(item, index) {
            if (undefined !== item &&
                item.tasks.indexOf(event) >= 0 &&
                item.tasks.every(every, this)
            ) {

                item.once && (this._on[index] = undefined);
                item.emited++;
                item.callback.apply(this, item.tasks.map(map, this));
            }
        }, this);
        return this;
    }

    if (typeof module === 'object' && module.exports) {
        module.exports = iEvents;
    } else {
        this.iEvents = iEvents;
    }
})();