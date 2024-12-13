(function () {
    'use strict';

    var _Sprite_Enemy_createStateIconSprite = Sprite_Enemy.prototype.createStateIconSprite;
    Sprite_Enemy.prototype.createStateIconSprite = function() {
        _Sprite_Enemy_createStateIconSprite.apply(this, arguments);
        this._stateIconSprite.visible = false;
    };

})();