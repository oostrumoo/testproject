//MooTools More, <http://mootools.net/more>. Copyright (c) 2006-2008 Valerio Proietti, <http://mad4milk.net>, MIT Style License.
Fx.Slide = new Class(
{
    Extends : Fx, options : {
        mode : "vertical"
    },
    initialize : function (B, A)
    {
        this.addEvent("complete", function ()
        {
            this.open = (this.wrapper["offset" + this.layout.capitalize()] != 0);
            if (this.open && Browser.Engine.webkit419) {
                this.element.dispose().inject(this.wrapper);
            }
        }, true);
        this.element = this.subject = $(B);
        this.parent(A);
        var C = this.element.retrieve("wrapper");
        this.wrapper = C || new Element("div", {
            styles : $extend(this.element.getStyles("margin", "position"), {
                overflow : "hidden"
            })
        }).wraps(this.element);
        this.element.store("wrapper", this.wrapper).setStyle("margin", 0);
        this.now = [];
        this.open = true;
    },
    vertical : function ()
    {
        this.margin = "margin-top";
        this.layout = "height";
        this.offset = this.element.offsetHeight;
    },
    horizontal : function ()
    {
        this.margin = "margin-left";
        this.layout = "width";
        this.offset = this.element.offsetWidth;
    },
    set : function (A)
    {
        this.element.setStyle(this.margin, A[0]);
        this.wrapper.setStyle(this.layout, A[1]);
        return this;
    },
    compute : function (E, D, C)
    {
        var B = [];
        var A = 2;
        A.times(function (F)
        {
            B[F] = Fx.compute(E[F], D[F], C);
        });
        return B;
    },
    start : function (B, E)
    {
        if (!this.check(arguments.callee, B, E)) {
            return this;
        }
        this [E || this.options.mode]();
        var D = this.element.getStyle(this.margin).toInt();
        var C = this.wrapper.getStyle(this.layout).toInt();
        var A = [[D, C], [0, this.offset]];
        var G = [[D, C], [ - this.offset, 0]];
        var F;
        switch (B)
        {
            case "in":
                F = A;
                break;
            case "out":
                F = G;
                break;
            case "toggle":
                F = (this.wrapper["offset" + this.layout.capitalize()] == 0) ? A : G;
        }
        return this.parent(F[0], F[1]);
    },
    slideIn : function (A)
    {
        return this.start("in", A);
    },
    slideOut : function (A)
    {
        return this.start("out", A);
    },
    hide : function (A)
    {
        this [A || this.options.mode]();
        this.open = false;
        return this.set([ - this.offset, 0]);
    },
    show : function (A)
    {
        this [A || this.options.mode]();
        this.open = true;
        return this.set([0, this.offset]);
    },
    toggle : function (A)
    {
        return this.start("toggle", A);
    }
});
Element.Properties.slide = 
{
    set : function (B)
    {
        var A = this.retrieve("slide");
        if (A) {
            A.cancel();
        }
        return this.eliminate("slide").store("slide:options", $extend(
        {
            link : "cancel"
        }, B));
    },
    get : function (A)
    {
        if (A || !this.retrieve("slide"))
        {
            if (A || !this.retrieve("slide:options")) {
                this.set("slide", A);
            }
            this.store("slide", new Fx.Slide(this, this.retrieve("slide:options")));
        }
        return this.retrieve("slide");
    }
};
Element.implement(
{
    slide : function (D, E)
    {
        D = D || "toggle";
        var B = this.get("slide"), A;
        switch (D)
        {
            case "hide":
                B.hide(E);
                break;
            case "show":
                B.show(E);
                break;
            case "toggle":
                var C = this.retrieve("slide:flag", B.open);
                B[(C) ? "slideOut" : "slideIn"](E);
                this.store("slide:flag", !C);
                A = true;
                break;
            default:
                B.start(D, E);
        }
        if (!A) {
            this.eliminate("slide:flag");
        }
        return this;
    }
});
Fx.Scroll = new Class(
{
    Extends : Fx, options : {
        offset : {
            x : 0, y : 0
        },
        wheelStops : true
    },
    initialize : function (B, A)
    {
        this.element = this.subject = $(B);
        this.parent(A);
        var D = this.cancel.bind(this, false);
        if ($type(this.element) != "element") {
            this.element = $(this.element.getDocument().body);
        }
        var C = this.element;
        if (this.options.wheelStops)
        {
            this.addEvent("start", function ()
            {
                C.addEvent("mousewheel", D);
            }, true);
            this.addEvent("complete", function ()
            {
                C.removeEvent("mousewheel", D);
            }, true);
        }
    },
    set : function ()
    {
        var A = Array.flatten(arguments);
        this.element.scrollTo(A[0], A[1]);
    },
    compute : function (E, D, C)
    {
        var B = [];
        var A = 2;
        A.times(function (F)
        {
            B.push(Fx.compute(E[F], D[F], C));
        });
        return B;
    },
    start : function (C, H)
    {
        if (!this.check(arguments.callee, C, H)) {
            return this;
        }
        var E = this.element.getSize(), F = this.element.getScrollSize();
        var B = this.element.getScroll(), D = {
            x : C, y : H
        };
        for (var G in D)
        {
            var A = F[G] - E[G];
            if ($chk(D[G])) {
                D[G] = ($type(D[G]) == "number") ? D[G].limit(0, A) : A;
            }
            else {
                D[G] = B[G];
            }
            D[G] += this.options.offset[G];
        }
        return this.parent([B.x, B.y], [D.x, D.y]);
    },
    toTop : function ()
    {
        return this.start(false, 0);
    },
    toLeft : function ()
    {
        return this.start(0, false);
    },
    toRight : function ()
    {
        return this.start("right", false);
    },
    toBottom : function ()
    {
        return this.start(false, "bottom");
    },
    toElement : function (B)
    {
        var A = $(B).getPosition(this.element);
        return this.start(A.x, A.y);
    }
});
var Observer = new Class(
{
    Implements : [Options, Events], options : {
        periodical : false, delay : 1000
    },
    initialize : function (C, A, B)
    {
        this.setOptions(B);
        this.addEvent("onFired", A);
        this.element = $(C) || $$(C);
        this.value = this.element.get("value");
        if (this.options.periodical) {
            this.timer = this.changed.periodical(this.options.periodical, this)
        }
        else {
            this.element.addEvent("keyup", this.changed.bind(this))
        }
    },
    changed : function ()
    {
        var A = this.element.get("value");
        if ($equals(this.value, A)) {
            return 
        }
        this.clear();
        this.value = A;
        this.timeout = this.onFired.delay(this.options.delay, this);
    },
    setValue : function (A)
    {
        this.value = A;
        this.element.set("value", A);
        return this.clear();
    },
    onFired : function ()
    {
        this.fireEvent("onFired", [this.value, this.element])
    },
    clear : function ()
    {
        $clear(this.timeout || null);
        return this;
    }
});
var $equals = function (B, A)
{
    return (B == A || JSON.encode(B) == JSON.encode(A));
};
var Autocompleter = {};
Autocompleter.Base = new Class(
{
    options : 
    {
        minLength : 1, markQuery : true, width : "inherit", maxChoices : 10, injectChoice : null, customChoices : null, 
        className : "autocompleter-choices", zIndex : 42, delay : 400, observerOptions : {},
        fxOptions : {}, onOver : $empty, onSelect : $empty, onSelection : $empty, onShow : $empty, onHide : $empty, 
        onBlur : $empty, onFocus : $empty, autoSubmit : false, overflow : false, overflowMargin : 25, 
        selectFirst : false, filter : null, filterCase : false, filterSubset : false, forceSelect : false, 
        selectMode : true, choicesMatch : null, multiple : false, separator : ", ", separatorSplit : /\s*[,;]\s*/, 
        autoTrim : true, allowDupes : false, cache : true, relative : false
    },
    initialize : function (B, A)
    {
        this.element = $(B);
        this.setOptions(A);
        this.build();
        this.observer = new Observer(this.element, this.prefetch.bind(this), $merge({
            delay : this.options.delay
        },
        this.options.observerOptions));
        this.queryValue = null;
        if (this.options.filter) {
            this.filter = this.options.filter.bind(this)
        }
        var C = this.options.selectMode;
        this.typeAhead = (C == "type-ahead");
        this.selectMode = (C === true) ? "selection" : C;
        this.cached = [];
    },
    build : function ()
    {
        if ($(this.options.customChoices)) {
            this.choices = this.options.customChoices
        }
        else
        {
            this.choices = new Element("ul", {
                "class" : this.options.className, styles : {
                    zIndex : this.options.zIndex
                }
            }).inject(document.body);
            this.relative = false;
            if (this.options.relative)
            {
                this.choices.inject(this.element, "after");
                this.relative = this.element.getOffsetParent()
            }
            this.fix = new OverlayFix(this.choices)
        }
        if (!this.options.separator.test(this.options.separatorSplit)) {
            this.options.separatorSplit = this.options.separator
        }
        this.fx = (!this.options.fxOptions) ? null : new Fx.Tween(this.choices, $merge({
            property : "opacity", link : "cancel", duration : 200
        },
        this.options.fxOptions)).addEvent("onStart", Chain.prototype.clearChain).set(0);
        this.element.setProperty("autocomplete", "off").addEvent((Browser.Engine.trident || Browser.Engine.webkit) ? "keydown" : "keypress", 
        this.onCommand.bind(this)).addEvent("click", this.onCommand.bind(this, [false])).addEvent("focus", 
        this.toggleFocus.create({
            bind : this, arguments : true, delay : 100
        })).addEvent("blur", this.toggleFocus.create({
            bind : this, arguments : false, delay : 100
        }))
    },
    destroy : function ()
    {
        if (this.fix) {
            this.fix.destroy()
        }
        this.choices = this.selected = this.choices.destroy();
    },
    toggleFocus : function (A)
    {
        this.focussed = A;
        if (!A) {
            this.hideChoices(true)
        }
        this.fireEvent((A) ? "onFocus" : "onBlur", [this.element])
    },
    onCommand : function (B)
    {
        if (!B && this.focussed) {
            return this.prefetch()
        }
        if (B && B.key && !B.shift)
        {
            switch (B.key)
            {
                case "enter":
                    if (this.element.value != this.opted) {
                        return true
                    }
                    if (this.selected && this.visible) {
                        this.choiceSelect(this.selected);
                        return !!(this.options.autoSubmit)
                    }
                    break;
                case "up":
                case "down":
                    if (!this.prefetch() && this.queryValue !== null)
                    {
                        var A = (B.key == "up");
                        this.choiceOver((this.selected || this.choices)[(this.selected) ? ((A) ? "getPrevious" : "getNext") : ((A) ? "getLast" : "getFirst")](this.options.choicesMatch), 
                        true)
                    }
                    return false;
                case "esc":
                case "tab":
                    this.hideChoices(true);
                    break
            }
        }
        return true;
    },
    setSelection : function (G)
    {
        var H = this.selected.inputValue, I = H;
        var B = this.queryValue.length, D = H.length;
        if (H.substr(0, B).toLowerCase() != this.queryValue.toLowerCase()) {
            B = 0
        }
        if (this.options.multiple)
        {
            var F = this.options.separatorSplit;
            I = this.element.value;
            B += this.queryIndex;
            D += this.queryIndex;
            var C = I.substr(this.queryIndex).split(F, 1)[0];
            I = I.substr(0, this.queryIndex) + H + I.substr(this.queryIndex + C.length);
            if (G)
            {
                var A = /[^\s,]+/;
                var E = I.split(this.options.separatorSplit).filter(A.test, A);
                if (!this.options.allowDupes) {
                    E = [].combine(E)
                }
                var J = this.options.separator;
                I = E.join(J) + J;
                D = I.length;
            }
        }
        this.observer.setValue(I);
        this.opted = I;
        if (G || this.selectMode == "pick") {
            B = D
        }
        this.element.selectRange(B, D);
        this.fireEvent("onSelection", [this.element, this.selected, I, H])
    },
    showChoices : function ()
    {
        var C = this.options.choicesMatch, G = this.choices.getFirst(C);
        this.selected = this.selectedValue = null;
        if (this.fix)
        {
            var H = this.element.getCoordinates(this.relative), D = this.options.width || "auto";
            this.choices.setStyles({
                left : H.left, top : H.bottom, width : (D === true || D == "inherit") ? H.width : D
            })
        }
        if (!G) {
            return 
        }
        if (!this.visible)
        {
            this.visible = true;
            this.choices.setStyle("display", "");
            if (this.fx) {
                this.fx.start(1)
            }
            this.fireEvent("onShow", [this.element, this.choices])
        }
        if (this.options.selectFirst || this.typeAhead || G.inputValue == this.queryValue) {
            this.choiceOver(G, this.typeAhead)
        }
        var B = this.choices.getChildren(C), A = this.options.maxChoices;
        var F = {
            overflowY : "hidden", height : ""
        };
        this.overflown = false;
        if (B.length > A)
        {
            var E = B[A - 1];
            F.overflowY = "scroll";
            F.height = E.getCoordinates(this.choices).bottom;
            this.overflown = true
        }
        this.choices.setStyles(F);
        this.fix.show()
    },
    hideChoices : function (A)
    {
        if (A)
        {
            var C = this.element.value;
            if (this.options.forceSelect) {
                C = this.opted
            }
            if (this.options.autoTrim)
            {
                C = C.split(this.options.separatorSplit).filter($arguments(0)).join(this.options.separator)
            }
            this.observer.setValue(C)
        }
        if (!this.visible) {
            return 
        }
        this.visible = false;
        this.observer.clear();
        var B = function ()
        {
            this.choices.setStyle("display", "none");
            this.fix.hide()
        }
        .bind(this);
        if (this.fx) {
            this.fx.start(0).chain(B)
        }
        else {
            B()
        }
        this.fireEvent("onHide", [this.element, this.choices])
    },
    prefetch : function ()
    {
        var F = this.element.value, E = F;
        if (this.options.multiple)
        {
            var C = this.options.separatorSplit;
            var A = F.split(C);
            var B = this.element.getCaretPosition();
            var G = F.substr(0, B).split(C);
            var D = G.length - 1;
            B -= G[D].length;
            E = A[D]
        }
        if (E.length < this.options.minLength) {
            this.hideChoices()
        }
        else
        {
            if (E === this.queryValue || (this.visible && E == this.selectedValue)) {
                if (this.visible) {
                    return false
                }
                this.showChoices()
            }
            else {
                this.queryValue = E;
                this.queryIndex = B;
                if (!this.fetchCached()) {
                    this.query()
                }
            }
        }
        return true;
    },
    fetchCached : function ()
    {
        return false;
        if (!this.options.cache || !this.cached || !this.cached.length || this.cached.length >= this.options.maxChoices || this.queryValue) {
            return false
        }
        this.update(this.filter(this.cached));
        return true;
    },
    update : function (A)
    {
        this.choices.empty();
        this.cached = A;
        if (!A || !A.length) {
            this.hideChoices()
        }
        else
        {
            if (this.options.maxChoices < A.length && !this.options.overflow) {
                A.length = this.options.maxChoices
            }
            A.each(this.options.injectChoice || function (C)
            {
                var B = new Element("li", {
                    html : this.markQueryValue(C)
                });
                B.inputValue = C;
                this.addChoiceEvents(B).inject(this.choices)
            }, this);
            this.showChoices()
        }
    },
    choiceOver : function (C, D)
    {
        if (!C || C == this.selected) {
            return 
        }
        if (this.selected) {
            this.selected.removeClass("autocompleter-selected")
        }
        this.selected = C.addClass("autocompleter-selected");
        this.fireEvent("onSelect", [this.element, this.selected, D]);
        if (!D) {
            return 
        }
        this.selectedValue = this.selected.inputValue;
        if (this.overflown)
        {
            var F = this.selected.getCoordinates(this.choices), E = this.options.overflowMargin, G = this.choices.scrollTop, 
            A = this.choices.offsetHeight, B = G + A;
            if (F.top - E < G && G) {
                this.choices.scrollTop = Math.max(F.top - E, 0)
            }
            else {
                if (F.bottom + E > B) {
                    this.choices.scrollTop = Math.min(F.bottom - A + E, B);
                }
            }
        }
        if (this.selectMode) {
            this.setSelection()
        }
    },
    choiceSelect : function (A)
    {
        if (A) {
            this.choiceOver(A)
        }
        this.setSelection(true);
        this.queryValue = false;
        this.hideChoices()
    },
    filter : function (B)
    {
        var A = new RegExp(((this.options.filterSubset) ? "" : "^") + this.queryValue.escapeRegExp(), 
        (this.options.filterCase) ? "" : "i");
        return (B || this.tokens).filter(A.test, A);
    },
    markQueryValue : function (A)
    {
        return (!this.options.markQuery || !this.queryValue) ? A : A.replace(new RegExp("(" + ((this.options.filterSubset) ? "" : "^") + this.queryValue.escapeRegExp() + ")", 
        (this.options.filterCase) ? "" : "i"), '<span class="autocompleter-queried">$1</span>')
    },
    addChoiceEvents : function (A)
    {
        return A.addEvents(
        {
            mouseover : this.choiceOver.bind(this, [A]), click : this.choiceSelect.bind(this, [A])
        })
    }
});
Autocompleter.Base.implement(new Events);
Autocompleter.Base.implement(new Options);
Autocompleter.Local = new Class(
{
    Extends : Autocompleter.Base, options : {
        minLength : 0, delay : 200
    },
    initialize : function (B, C, A)
    {
        this.parent(B, A);
        this.tokens = C;
    },
    query : function ()
    {
        this.update(this.filter())
    }
});
Autocompleter.Ajax = {};
Autocompleter.Ajax.Base = new Class(
{
    Extends : Autocompleter.Base, options : {
        postVar : "value", postData : {}, ajaxOptions : {}, onRequest : $empty, onComplete : $empty
    },
    initialize : function (C, B)
    {
        this.parent(C, B);
        var A = $(this.options.indicator);
        if (A) {
            this.addEvents({
                onRequest : A.show.bind(A), onComplete : A.hide.bind(A)
            }, true)
        }
    },
    query : function ()
    {
        var A = $unlink(this.options.postData);
        A[this.options.postVar] = this.queryValue;
        this.fireEvent("onRequest", [this.element, this.request, A, this.queryValue]);
        this.request.send({
            data : A
        })
    },
    queryResponse : function ()
    {
        this.fireEvent("onComplete", [this.element, this.request, this.response])
    }
});
Autocompleter.Ajax.Json = new Class(
{
    Extends : Autocompleter.Ajax.Base,
    initialize : function (C, B, A)
    {
        this.parent(C, A);
        this.request = new Request.JSON($merge({
            url : B, link : "cancel"
        },
        this.options.ajaxOptions)).addEvent("onComplete", this.queryResponse.bind(this))
    },
    queryResponse : function (A)
    {
        this.parent();
        this.update(A)
    }
});
Autocompleter.Ajax.Xhtml = new Class(
{
    Extends : Autocompleter.Ajax.Base,
    initialize : function (C, B, A)
    {
        this.parent(C, A);
        this.request = new Request.HTML($merge({
            url : B, link : "cancel", update : this.choices
        },
        this.options.ajaxOptions)).addEvent("onComplete", this.queryResponse.bind(this))
    },
    queryResponse : function (A, B)
    {
        this.parent();
        if (!B || !B.length) {
            this.hideChoices()
        }
        else
        {
            this.choices.getChildren(this.options.choicesMatch).each(this.options.injectChoice || function (C)
            {
                var D = C.innerHTML;
                C.inputValue = D;
                this.addChoiceEvents(C.set("html", this.markQueryValue(D)))
            }, this);
            this.showChoices()
        }
    }
});
var OverlayFix = new Class(
{
    initialize : function (A)
    {
        if (Browser.Engine.trident)
        {
            this.element = $(A);
            this.relative = this.element.getOffsetParent();
            this.fix = new Element("iframe", 
            {
                frameborder : "0", scrolling : "no", src : "javascript:false;", styles : 
                {
                    position : "absolute", border : "none", display : "none", filter : "progid:DXImageTransform.Microsoft.Alpha(opacity=0)"
                }
            }).inject(this.element, "after")
        }
    },
    show : function ()
    {
        if (this.fix)
        {
            var A = this.element.getCoordinates(this.relative);
            delete A.right;
            delete A.bottom;
            this.fix.setStyles($extend(A, {
                display : "", zIndex : (this.element.getStyle("zIndex") || 1) - 1
            }))
        }
        return this;
    },
    hide : function ()
    {
        if (this.fix) {
            this.fix.setStyle("display", "none")
        }
        return this;
    },
    destroy : function ()
    {
        this.fix = this.fix.destroy();
    }
});
Element.implement(
{
    getOffsetParent : function ()
    {
        var A = this.getDocument().body;
        if (this == A) {
            return null
        }
        if (!Browser.Engine.trident) {
            return $(this.offsetParent)
        }
        var B = this;
        while ((B = B.parentNode)) {
            if (B == A || Element.getComputedStyle(B, "position") != "static") {
                return $(B);
            }
        }
        return null;
    },
    getCaretPosition : function ()
    {
        if (!Browser.Engine.trident) {
            return this.selectionStart
        }
        this.focus();
        var A = document.selection.createRange();
        var B = this.createTextRange();
        A.setEndPoint("StartToStart", B);
        return A.text.length;
    },
    selectRange : function (C, A)
    {
        if (Browser.Engine.trident)
        {
            var B = this.createTextRange();
            B.collapse(true);
            B.moveEnd("character", A);
            B.moveStart("character", C);
            B.select()
        }
        else {
            this.focus();
            this.setSelectionRange(C, A)
        }
        return this;
    }
});
var EditInPlace = new Class(
{
    options : 
    {
        url : false, data : "", valuekey : "value", type : "input", maxlength : false, select_items : false, 
        hover_css_class : "hover", tip : "inplace editable, CLICK for edit"
    },
    initialize : function (A, B)
    {
        this.setOptions(B);
        this.elemns = A;
        this.elemns.each(function (C)
        {
            C.identifier = this.options.url && C.className.indexOf("id:") > -1 ? C.className.replace(/^.+:/, 
            "").replace(/ .+$/, "") : false;
            C.addEvents(
            {
                click : function ()
                {
                    if (C.getProperty("original")) {
                        return 
                    }
                    C.setProperty("original", C.innerHTML.trim().replace(/\n/g, " ")).empty();
                    var D = new Element(this.options.type, 
                    {
                        events : 
                        {
                            blur : function ()
                            {
                                var G = D.getProperty("value").trim().replace(/\n/g, " ").replace(/(<([^>]+)>)/ig, 
                                "");
                                var E = C.getProperty("original");
                                if (this.options.url && G != E)
                                {
                                    var H = C.identifier ? "&id=" + C.identifier : "";
                                    var F = this.options.data + H + "&" + this.options.valuekey + "=" + G.replace(/&/g, 
                                    "%26").replace(/ /g, "%20");
                                    new Request({
                                        url : this.options.url, method : "get", data : F
                                    }).send()
                                }
                                C.removeProperty("original").set("html", G)
                            }
                            .bind(this),
                            keydown : function (F)
                            {
                                var E = new Event(F);
                                if (E.key == "enter" || E.key == "tab" || E.key == "esc") {
                                    this.blur();
                                    return ;
                                }
                            }
                        }
                    });
                    if (this.options.maxlength) {
                        D.setProperty("maxlength", this.options.maxlength)
                    }
                    if (this.options.select_items)
                    {
                        this.options.select_items.each(function (F)
                        {
                            var E = new Element("option").set("html", F.text).inject(D);
                            if (F.value) {
                                E.setProperty("value", F.value)
                            }
                            else {
                                E.setProperty("value", F.text)
                            }
                        })
                    }
                    D.setProperty("value", C.getProperty("original")).inject(C).focus()
                }
                .bind(this)
            });
            if (this.options.hover_css_class)
            {
                C.addEvents(
                {
                    mouseenter : function ()
                    {
                        C.addClass(this.options.hover_css_class)
                    }
                    .bind(this),
                    mouseleave : function ()
                    {
                        C.removeClass(this.options.hover_css_class)
                    }
                    .bind(this)
                })
            }
            if (this.options.tip) {
                C.setProperty("title", this.options.tip)
            }
        }, this);
        if (this.options.tip) {
            new Tips(this.elemns)
        }
    }
});
EditInPlace.implement(new Options);
shortcut = 
{
    all_shortcuts : {},
    add : function (B, H, D)
    {
        var G = 
        {
            type : "keydown", propagate : false, disable_in_input : false, target : document, keycode : false
        };
        if (!D) {
            D = G
        }
        else {
            for (var A in G) {
                if (typeof D[A] == "undefined") {
                    D[A] = G[A];
                }
            }
        }
        var F = D.target;
        if (typeof D.target == "string") {
            F = document.getElementById(D.target)
        }
        var C = this;
        B = B.toLowerCase();
        var E = function (M)
        {
            M = M || window.event;
            if (D.disable_in_input)
            {
                var J;
                if (M.target) {
                    J = M.target
                }
                else {
                    if (M.srcElement) {
                        J = M.srcElement;
                    }
                }
                if (J.nodeType == 3) {
                    J = J.parentNode
                }
                if (J.tagName == "INPUT" || J.tagName == "TEXTAREA") {
                    return ;
                }
            }
            if (M.keyCode) {
                code = M.keyCode
            }
            else {
                if (M.which) {
                    code = M.which;
                }
            }
            var L = String.fromCharCode(code);
            if (code == 188) {
                L = ","
            }
            if (code == 190) {
                L = "."
            }
            var Q = B.split("+");
            var P = 0;
            var N = 
            {
                "`" : "~", "1" : "!", "2" : "@", "3" : "#", "4" : "$", "5" : "%", "6" : "^", "7" : "&", 
                "8" : "*", "9" : "(", "0" : ")", "-" : "_", "=" : "+", ";" : ":", "'" : '"', "," : "<", 
                "." : ">", "default.htm" : "?", "\\" : "|"
            };
            var K = 
            {
                esc : 27, escape : 27, tab : 9, space : 32, "return" : 13, enter : 13, backspace : 8, 
                scrolllock : 145, scroll_lock : 145, scroll : 145, capslock : 20, caps_lock : 20, caps : 20, 
                numlock : 144, num_lock : 144, num : 144, pause : 19, "break" : 19, insert : 45, home : 36, 
                "delete" : 46, end : 35, pageup : 33, page_up : 33, pu : 33, pagedown : 34, page_down : 34, 
                pd : 34, left : 37, up : 38, right : 39, down : 40, f1 : 112, f2 : 113, f3 : 114, f4 : 115, 
                f5 : 116, f6 : 117, f7 : 118, f8 : 119, f9 : 120, f10 : 121, f11 : 122, f12 : 123
            };
            var O = 
            {
                shift : {
                    wanted : false, pressed : false
                },
                ctrl : {
                    wanted : false, pressed : false
                },
                alt : {
                    wanted : false, pressed : false
                },
                meta : {
                    wanted : false, pressed : false
                }
            };
            if (M.ctrlKey) {
                O.ctrl.pressed = true
            }
            if (M.shiftKey) {
                O.shift.pressed = true
            }
            if (M.altKey) {
                O.alt.pressed = true
            }
            if (M.metaKey) {
                O.meta.pressed = true
            }
            for (var I = 0; k = Q[I], I < Q.length; I++)
            {
                if (k == "ctrl" || k == "control") {
                    P++;
                    O.ctrl.wanted = true
                }
                else
                {
                    if (k == "shift") {
                        P++;
                        O.shift.wanted = true
                    }
                    else
                    {
                        if (k == "alt") {
                            P++;
                            O.alt.wanted = true
                        }
                        else
                        {
                            if (k == "meta") {
                                P++;
                                O.meta.wanted = true
                            }
                            else
                            {
                                if (k.length > 1) {
                                    if (K[k] == code) {
                                        P++
                                    }
                                }
                                else
                                {
                                    if (D.keycode) {
                                        if (D.keycode == code) {
                                            P++
                                        }
                                    }
                                    else
                                    {
                                        if (L.toLowerCase() == k.toLowerCase()) {
                                            P++
                                        }
                                        else {
                                            if (N[L] && M.shiftKey) {
                                                L = N[L];
                                                if (L == k) {
                                                    P++
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (P == Q.length && O.ctrl.pressed == O.ctrl.wanted && O.shift.pressed == O.shift.wanted && O.alt.pressed == O.alt.wanted && O.meta.pressed == O.meta.wanted)
            {
                H(M);
                if (!D.propagate)
                {
                    M.cancelBubble = true;
                    M.returnValue = false;
                    if (M.stopPropagation) {
                        M.stopPropagation();
                        M.preventDefault()
                    }
                    return false;
                }
            }
        };
        this.all_shortcuts[B] = {
            callback : E, target : F, event : D.type
        };
        if (F.addEventListener) {
            F.addEventListener(D.type, E, false)
        }
        else {
            if (F.attachEvent) {
                F.attachEvent("on" + D.type, E)
            }
            else {
                F["on" + D.type] = E;
            }
        }
    },
    remove : function (A)
    {
        A = A.toLowerCase();
        var D = this.all_shortcuts[A];
        delete (this.all_shortcuts[A]);
        if (!D) {
            return 
        }
        var B = D.event;
        var C = D.target;
        var E = D.callback;
        if (C.detachEvent) {
            C.detachEvent("on" + B, E)
        }
        else {
            if (C.removeEventListener) {
                C.removeEventListener(B, E, false)
            }
            else {
                C["on" + B] = false;
            }
        }
    }
};
