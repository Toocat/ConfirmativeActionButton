/* 
 * @author ecivic / https://github.com/Toocat
 */

(function ($) {

    var CLICK_SPEED = 100;
    var oldCaption = [];
    var confirmationTimeouts = [];

    var methods = {
        guid: function () {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                        .toString(16)
                        .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                    s4() + '-' + s4() + s4() + s4();
        },
        
        confirmativeActionButton: function (settings) {
            var id = settings.id;
            var caption = settings.caption;
            var confirmationCaption = settings.confirmationCaption;
            var actionHandler = settings.actionHandler;
            var cssNormalClass = settings.cssNormalClass;
            var cssWaitingClass = settings.cssWaitingClass;
            var cssActivatedClass = settings.cssActivatedClass;
            var waitingTime = settings.waitingTime;
            
            this.append(this.getConfirmativeActionButtonHTMLTemplate(id, caption, cssNormalClass));
            
            var cmp = $("#" + id);
            cmp.click(function (e) {
                var targetId = e.target.id;
                var toConfirm = cmp.prop('toConfirm');
                if (toConfirm) {
                    cmp.prop('toConfirm', false);
                    cmp.addClass(cssNormalClass)
                        .removeClass(cssActivatedClass)
                        .removeClass(cssWaitingClass);
                    cmp.val(oldCaption[targetId]);
                    oldCaption[targetId] = "";
                    if (actionHandler !== null) {
                        actionHandler(cmp);
                    }
                    clearTimeout(confirmationTimeouts[targetId]);
                } else {
                    cmp.prop('toConfirm', true);
                    oldCaption[targetId] = cmp.val();
                    cmp.val(confirmationCaption);
                    cmp.removeClass().addClass(cssWaitingClass);
                    confirmationTimeouts[targetId] = window.setTimeout(function () {
                        if ($("#" + targetId).prop('toConfirm')) {
                            $("#" + targetId).prop('toConfirm', false);
                            $("#" + targetId).addClass(cssNormalClass)
                                    .removeClass(cssActivatedClass)
                                    .removeClass(cssWaitingClass);
                            $("#" + targetId).val(oldCaption[targetId]);
                            oldCaption[targetId] = "";
                        }
                    }, waitingTime);
                }
            });
            
            cmp.mouseup(function (e) {
                cmp.onConfirmativeActionButtonMouseUp(e, cssNormalClass, cssActivatedClass);
            });
            cmp.mouseleave(function (e) {
                cmp.onConfirmativeActionButtonMouseUp(e, cssNormalClass, cssActivatedClass);
            });
            cmp.mousedown(function (e) {
                cmp.onConfirmativeActionButtonMouseDown(e, cssNormalClass, cssActivatedClass);
            });
        }
    };
    
    $.fn.removeConfirmativeActionButton = function() {
        this.off();
        this.remove();
    };

    $.fn.onConfirmativeActionButtonMouseUp = function (e, cssNormalClass, cssActivatedClass) {
        window.setTimeout(function () {
            $("#" + e.target.id).removeClass(cssActivatedClass);
            if (!$("#" + e.target.id).prop('toConfirm')) {
                $("#" + e.target.id).addClass(cssNormalClass);
            }
        }, CLICK_SPEED);
    };

    $.fn.onConfirmativeActionButtonMouseDown = function (e, cssNormalClass, cssActivatedClass) {
        $("#" + e.target.id).removeClass(cssNormalClass).addClass(cssActivatedClass);
    };

    $.fn.getConfirmativeActionButtonHTMLTemplate = function (id, caption, cssNormalClass) {
        return '<input id="' + id + '" name="' + id + '" type="button" value="' + caption + '" class="' + cssNormalClass + '"/>';
    };

    $.fn.confirmativeActionButton = function (options) {
        var settings = $.extend({
            // These are the defaults.
            id: methods.guid.apply(this),
            caption: "Confirmative Action Button",
            confirmationCaption: "Click to confirm",
            actionHandler: null,
            cssNormalClass: "confirmativeActionButton",
            cssWaitingClass: "confirmativeActionButtonWaitingForConfirmation",
            cssActivatedClass: "confirmativeActionButtonConfirmed",
            waitingTime: 3000
        }, options);

        methods.confirmativeActionButton.apply(this, [settings]);
        return this;
    };


})(jQuery);