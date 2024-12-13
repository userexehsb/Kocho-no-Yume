var _updateEffect = Sprite_Enemy.prototype.updateEffect;
Sprite_Enemy.prototype.updateEffect = function() {
    if (this._enemy.isStateAffected(69)){//「透明化」ステートがついている場合は不透明度を下げる
        this.opacity = 0;
    } else if (this._appeared) {
        this.opacity = 255;
    }
    _updateEffect.call(this);
};