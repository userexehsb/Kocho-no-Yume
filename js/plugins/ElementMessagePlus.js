//=============================================================================
// ElementMessagePlus.js
// ver1.10 2017/10/14
//=============================================================================

/*:
* @plugindesc 属性メッセージ追加プラグイン
* @author KPoal
*
* @param WeakRate
* @type number
* @min 1.0
* @decimals 2
* @desc 弱点とみなす最小の属性有効度です。これ以上の倍率のとき弱点メッセージを表示します。
* @default 2.0
*
* @param ResistRate
* @type number
* @max 1.0
* @decimals 2
* @desc 耐性があるとみなす最大の属性有効度です。これ以下の倍率のとき耐性メッセージを表示します。
* @default 0.5
*
* @param WeakEffect
* @type boolean
* @desc 弱点属性のダメージでダメージポップを赤くフラッシュさせるかどうかです。
* @default true
*
* @param ResistEffect
* @type boolean
* @desc 耐性属性のダメージでダメージポップを青くフラッシュさせるかどうかです。
* @default true
*
* @param GuardEffect
* @type boolean
* @desc 無効化属性のダメージでダメージポップを黒くフラッシュさせるかどうかです。
* @default true
*
* @param ActorWeak
* @desc アクターが弱点を突かれたときのメッセージです。
* @default %1は大ダメージを受けた！
*
* @param EnemyWeak
* @desc 敵の弱点を突いた時のメッセージです。
* @default %1に大ダメージだ！
*
* @param ActorResist
* @desc アクターが敵の攻撃属性に耐性を持っていたときのメッセージです。
* @default %1にはあまり効いていない！
*
* @param EnemyResist
* @desc 敵がこちらの攻撃属性に耐性を持っていたときのメッセージです。
* @default %1にはあまり効いていない！
*
* @param ActorGuard
* @desc アクターが敵の攻撃属性を受け付けないときのメッセージです。
* @default %1はダメージを受けない！
*
* @param EnemyGuard
* @desc 敵がこちらの攻撃属性を受け付けないときのメッセージです。
* @default %1にはぜんぜん効いていない！
*
* @param ActorImpartial
* @desc アクターが敵の攻撃を等倍で受けたときのメッセージです。
* @default
*
* @param EnemyImpartial
* @desc 敵がこちらの攻撃を等倍で受けたときのメッセージです。
* @default
*
* @help
* 属性攻撃を受けた際に、その属性有効度によって
* 追加メッセージを表示させることができます。
*
* %1と書き込むと、その部分は対象者の名前に置き換えられます。
* また、メッセージを表示させる必要がない場合は
* 該当するパラメータを空欄に設定して下さい。
*
* ver 1.10追加 2017/10/14
* 属性有効度によって、表示されるダメージポップの色を
* 変えられるようになる機能を追加。
*
*/


(function() {


var parameters = PluginManager.parameters('ElementMessagePlus');
var aWeak   = String(parameters['ActorWeak'] || '');
var eWeak   = String(parameters['EnemyWeak'] || '');
var aresist = String(parameters['ActorResist']|| '');
var eresist = String(parameters['EnemyResist']|| '');
var aguard  = String(parameters['ActorGuard']|| '');
var eguard  = String(parameters['EnemyGuard']|| '');
var aimp    = String(parameters['ActorImpartial']|| '');
var eimp    = String(parameters['EnemyImpartial']|| '');
var WeakEf  = String(parameters['WeakEffect']|| 'false');
var ResistEf= String(parameters['ResistEffect']|| 'false');
var GuardEf = String(parameters['GuardEffect']|| 'false');
var elemRateForMess = 0;

var Game_Action_prototype_makeDamageValue = Game_Action.prototype.makeDamageValue;
Game_Action.prototype.makeDamageValue = function(target, critical) {
    elemRateForMess = this.calcElementRate(target);
return Game_Action_prototype_makeDamageValue.call(this,target,critical);
};

Window_BattleLog.prototype.makeElementDamageText = function(target) {
    var result = target.result();
    var damage = result.hpDamage;
    var isActor = target.isActor();
    var fmt;
    if (elemRateForMess >= Number(parameters.WeakRate) && damage >= 0) {
        fmt = isActor ? aWeak : eWeak;
        return fmt.format(target.name());
    } else if (elemRateForMess <= 0.0 && damage >= 0) {
        fmt = isActor ? aguard : eguard;
        return fmt.format(target.name());
    } else if (elemRateForMess <= Number(parameters.ResistRate) && damage >= 0) {
        fmt = isActor ? aresist : eresist;
        return fmt.format(target.name());
    } else {
        fmt = isActor ? aimp : eimp;
        return fmt.format(target.name());   
    }
};

Window_BattleLog.prototype.displayHpDamage = function(target) {
    if (target.result().hpAffected) {
        if (target.result().hpDamage > 0 && !target.result().drain) {
            this.push('performDamage', target);
        }
        if (target.result().hpDamage < 0) {
            this.push('performRecovery', target);
        } 
        if (this.makeElementDamageText(target) !== "") {
            this.push('addText', this.makeElementDamageText(target));
        }
        this.push('addText', this.makeHpDamageText(target));
    }
};



Sprite_Damage.prototype.setupWeakPEffect = function() {
    this._flashColor = [255, 0, 0, 160];
    this._flashDuration = 60;
};
Sprite_Damage.prototype.setupResistPEffect = function() {
    this._flashColor = [0, 0, 255, 160];
    this._flashDuration = 60;
};
Sprite_Damage.prototype.setupGuardPEffect = function() {
    this._flashColor = [0, 0, 0, 255];
    this._flashDuration = 60;
};

var _Sprite_Damage_prototype_setup = Sprite_Damage.prototype.setup;
Sprite_Damage.prototype.setup = function(target) {
    _Sprite_Damage_prototype_setup.call(this,target);
    var result = target.result();
    if (!result.missed && !result.evaded && result.hpDamage >= 0) {
        if (elemRateForMess>= Number(parameters.WeakRate) && eval(WeakEf)){
            this.setupWeakPEffect();
        } else if (elemRateForMess<= 0 && eval(GuardEf)){
            this.setupGuardPEffect();
        } else if (elemRateForMess <= Number(parameters.ResistRate) && eval(ResistEf)){
           this.setupResistPEffect();
        }
    }
};

})();