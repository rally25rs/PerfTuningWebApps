window.Switch = (function($, undefined) {
    var CHANGE = "change",
        SWITCHON = "km-switch-on",
        SWITCHOFF = "km-switch-off",
        MARGINLEFT = "margin-left",
        TRANSFORMSTYLE = "-webkit-transform",
        proxy = $.proxy;

    function limitValue(value, minLimit, maxLimit) {
        return Math.max(minLimit, Math.min(maxLimit, value));
    }

    var Switch = function(element) {
        var that = this, checked;
        this.element = element;

        that._wrapper();
        that._drag();
        that._background();
        that.origin = parseInt(that.background.css(MARGINLEFT), 10);
        that._handle();

        that.constrain = 0;

        element = that.element[0];
        element.type = "checkbox";
        that._animateBackground = true;

        checked = that.options.checked;

        if (checked === null) {
            checked = element.checked;
        }

        that.check(checked);
        that.refresh();
    };

    Switch.prototype.refresh = function() {
        var that = this;

        that.width = that.wrapper.width();
        that.handleWidth = that.handle.outerWidth(true);

        that.constrain = that.width - that.handleWidth;

        if (typeof that.origin != "number") {
            that.origin = parseInt(that.background.css(MARGINLEFT), 10);
        }

        that.background.data("origin", that.origin);

        that.check(that.element[0].checked);
    };

    Switch.prototype.events = [
        CHANGE
    ];

    Switch.prototype.options = {
        onLabel: "Yes",
        offLabel: "No",
        checked: null
    };

    Switch.prototype.check = function(check) {
        var that = this,
            element = that.element[0];

        if (check === undefined) {
            return element.checked;
        }

        that._position(check ? that.constrain : 0);
        element.checked = check;
        that.wrapper
            .toggleClass(SWITCHON, check)
            .toggleClass(SWITCHOFF, !check);
    };

    Switch.prototype.toggle = function() {
        var that = this;

        that.check(!that.element[0].checked);
    };

    Switch.prototype._resize = function() {
        this.refresh();
    };

    Switch.prototype._move = function(e) {
        var that = this;
        e.preventDefault();
        that._position(limitValue(that.position + e.x.delta, 0, that.width - that.handle.outerWidth(true)));
    };

    Switch.prototype._position = function(position) {
        var that = this;

        that.position = position;
        that.handle.css(TRANSFORMSTYLE, "translatex(" + position + "px)");

        if (that._animateBackground) {
            that.background.css(MARGINLEFT, that.origin + position);
        }
    };

    Switch.prototype._toggle = function (checked) {
        var that = this,
            handle = that.handle,
            element = that.element[0];

        that.wrapper
            .toggleClass(SWITCHON, checked)
            .toggleClass(SWITCHOFF, !checked);

        that.position = checked * that.constrain;
        that.handle.css(TRANSFORMSTYLE, "translatex(" + that.position + "px)");
        element.checked = checked;
    };

    Switch.prototype._background = function() {
        var that = this,
            background;

        background = $("<span class='km-switch-wrapper'><span class='km-switch-background'></span></span>")
                        .appendTo(that.wrapper)
                        .children(".km-switch-background");

        that.background = background;
    };

    Switch.prototype._handle = function() {
        var that = this,
            options = that.options;

        that.handle = $("<span class='km-switch-container'><span class='km-switch-handle' /></span>")
                        .appendTo(that.wrapper)
                        .children(".km-switch-handle");

        that.handle.append('<span class="km-switch-label-on">' + options.onLabel + '</span><span class="km-switch-label-off">' + options.offLabel + '</span>');
    };

    Switch.prototype._wrapper = function() {
        var that = this,
            element = that.element,
            wrapper = element.parent("span.km-switch");

        if (!wrapper[0]) {
            wrapper = element.wrap('<span class="km-switch"/>').parent();
        }

        that.wrapper = wrapper.addClass("km-widget");
    };

    Switch.prototype._drag = function() {
        var that = this;

        this.wrapper.on("click", function() {
            that._toggle(!that.element[0].checked);
        });
    };

    return Switch;
})(window.jQuery);
