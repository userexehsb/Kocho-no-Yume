//=============================================================================
// State_huyasu.js
// ----------------------------------------------------------------------------

/*:
 * 
 *  このプラグインはもう私のものです。
 *  自作でステート増やしましょう！
 */
 
(function() {
    'use strict';

    Window_Base.prototype.drawActorIcons = function(actor, x, y, width) {
        width = width || 144;
        var icons = actor.allIcons().slice(0,5);
        for (var i = 0; i < icons.length; i++) {
            this.drawIcon(icons[i], x + Window_Base._iconWidth * i, y + 2);
        }
    };
})();


(()=>{
    'use strict'
   
    Window_BattleStatus.prototype.basicAreaRect = function(index) {
        var rect = this.itemRectForText(index);
        rect.width -= this.gaugeAreaWidth() + 8;
        return rect;
    };

    Window_BattleStatus.prototype.gaugeAreaWidth = function() {
        return 325;
    };

    Window_BattleStatus.prototype.drawBasicArea = function(rect, actor) {
        this.drawActorName(actor, rect.x + 0, rect.y, 90);
        this.drawActorIcons(actor, rect.x + 90, rect.y, 128);
    };

})();
