//=============================================================================
// DamageSoundEffect.js
// ----------------------------------------------------------------------------
// (C) 2018 astral
//
// ---------------------------------------//-------------------------------------
// Version
// 0.1.2 2018/12/17 ダメージポップアップの制御方法を変更
// 0.1.1 2018/12/16 YEP_BattleEngineCore.jsのポップアップも非表示にする
//                  吸収時のダメージSE再生条件を変更
//                  ダメージレートのヘルプ記述を修正
// 0.1.0 2018/12/15 初版
/*:
 * 
 * @plugindesc ダメージのシステム効果音を条件によって変化させる
 * @author astral
 *
 * 
 * @param enemyRateVariable
 * @text 敵レート変数
 * @desc 基準となるダメージレートの100％時の格納変数です。
 * @type variable
 * @default 0
 * 
 * @param playEnemySe
 * @text 敵ダメージSE
 * @desc 敵キャラがダメージを受けた場合のSE設定です。
 * @type struct<playDamage>[]
 * @default []
 * 
 * @param actorRateVariable
 * @text 味方レート変数
 * @desc 基準となるダメージレートの100％時の格納変数です。
 * @type variable
 * @default 0
 *
 * @param playActorSe
 * @text 味方ダメージSE
 * @desc 味方がダメージを受けた場合のSE設定です。
 * @type struct<playDamage>[]
 * @default []
 * 
 * @param isCustomMessage
 * @text メッセージの変更
 * @desc システムメッセージ
 * @type boolean
 * @default false
 * 
 * @param messageActorDamage
 * @text 味方ダメージ
 * @desc 数値を隠す場合のシステムメッセージです。
 * @type string
 * @default %1はダメージを受けた！
 * 
 * @param messageEnemyDamage
 * @text 敵ダメージ
 * @desc 数値を隠す場合のシステムメッセージです。
 * @type string
 * @default %1にダメージを与えた！
 * 
 * @param messageActorDrain
 * @text 味方ポイント吸収
 * @desc 数値を隠す場合のシステムメッセージです。
 * @type string
 * @default %1は%2を奪われた！
 * 
 * @param messageEnemyDrain
 * @text 敵ポイント吸収
 * @desc 数値を隠す場合のシステムメッセージです。
 * @type string
 * @default %1の%2を奪った！
 * 
 * @param messageActorRecovery
 * @text 味方回復
 * @desc 数値を隠す場合のシステムメッセージです。
 * @type string
 * @default %1の%2が回復した！
 * 
 * @param messageEnemyRecovery
 * @text 敵回復
 * @desc 数値を隠す場合のシステムメッセージです。
 * @type string
 * @default %1の%2が回復した！
 * 
 * @param isPopupDamage
 * @text 数値ポップアップ表示
 * @desc ダメージ数値のポップアップ表示を切り替えます。
 * @type boolean
 * @default false
 * 
 * @param isDrainDamageSe
 * @text 吸収時のSE再生
 * @desc HP吸収時もダメージSEを再生するようにします。
 * @type boolean
 * @default false
 * 
 * @help
 * 
 * YEP_BattleEngineCore.js
 * などのプラグインと併用する場合は、
 * このプラグインを上になるようプラグイン登録してください。
 * 
 * 攻撃時のダメージを数値ではなくSEで判別できるようにします。
 * 
 * パラメーターの味方ダメージSE・敵ダメージSEで、再生するSEと条件を設定します。
 * 
 * 1から順番に、一致するものを再生条件として判定します。
 * 各条件の、0やfalse以外の条件を満たした場合に、指定したSEを再生します。
 * 
 * 最小ダメージの固定値は、1以上の数値が設定可能です。
 * ダメージの実数を閾値として、判定されます。
 * 最大HP以上のオーバーキルされた場合も、ダメージ数値が判定対象です。
 * 
 * レート変数に1000の値が設定されていた場合、
 * 最小ダメージレートの10は、ダメージが100以上（レート変数の10%）として判定されます。
 * 101%以上も対応しています。
 * 
 * 最小ダメージ固定値とレートは、両方使わないことも、両方条件とすることも出来ます。
 * 
 * 説明は、わかりやすい様にメモするためだけのものです。
 * 
 * 再生条件を一つも設定していない場合は、次の条件を判定します。
 * 
 * 
 */
/*~struct~playDamage:
 *
 *
 * @param description
 * @text 説明
 * @desc 任意の説明を設定出来ます。パラメータをわかりやすくする以外の影響はありません。
 * @type string
 * @default 
 * 
 * @param damageRate
 * @text 最小ダメージレート
 * @desc 指定された変数の値を基準として、xx%以上の場合 1以上の数値（101%以上可）
 * @min 0
 * @type number
 * @default 0
 * 
 * @param minDamage
 * @text 最小ダメージ固定値
 * @desc 最小ダメージ閾値（実数）以上の場合（最大HP以上のオーバーキル含む）
 * @min 0
 * @type number
 * @default 0
 * 
 * @param critical
 * @text クリティカル時
 * @desc クリティカル攻撃された場合
 * @type boolean
 * @default false
 * 
 * @param physical
 * @text 物理時
 * @desc 物理攻撃（命中タイプ）した場合
 * @type boolean
 * @default false
 * 
 * @param magical
 * @text 魔法時
 * @desc 魔法攻撃（命中タイプ）した場合
 * @type boolean
 * @default false
 * 
 * @param drain
 * @text 吸収時
 * @desc 吸収（ドレイン）された場合
 * @type boolean
 * @default false
 * 
 * @param skillId
 * @text スキルID
 * @desc 指定したスキルIDで攻撃した場合
 * @type skill
 * @default 0
 * 
 * @param stypeId
 * @text スキルタイプID
 * @desc 指定したスキルタイプIDで攻撃した場合
 * @min 0
 * @type number
 * @default 0
 * 
 * @param elementId
 * @text スキル属性ID
 * @desc 指定したスキル属性IDで攻撃した場合
 * @min 0
 * @type number
 * @default 0
 * 
 * @param itemId
 * @text アイテムID
 * @desc 指定したアイテムIDで攻撃した場合
 * @type item
 * @default 0
 * 
 * @param stateId
 * @text ステートID
 * @desc 指定したステートIDが付与されている場合（攻撃時追加含む）
 * @type state
 * @default 0
 * 
 * @param addStateId
 * @text ステートID追加時
 * @desc 攻撃と同時に指定したステートIDが付与された場合のみ判定
 * @type state
 * @default 0
 * 
 * @param SE------------
 * @text SE------------
 * @desc 
 * @type string
 * @default 
 * 
 * @param seName
 * @text SEファイル名
 * @desc 
 * @type file
 * @dir audio/se/
 * @require 1
 * @default 
 * 
 * @param seVolume
 * @text SE音量
 * @desc 
 * @type number
 * @min 0
 * @max 100
 * @default 100
 * 
 * @param sePitch
 * @text SEピッチ
 * @desc 
 * @type number
 * @min 50
 * @max 150
 * @default 100
 * 
 * @param sePan
 * @text SE位相
 * @desc 
 * @type number
 * @min -100
 * @max 100
 * @default 0
 * 
 * 
 */

var Imported = Imported || {};
Imported.DamageSoundEffect = true;

(function () {
    'use strict';

    var pluginName = 'DamageSoundEffect';

	var parameters = PluginManager.parameters(pluginName);

	var originalParam = JSON.parse(JSON.stringify(parameters, function(key, value) {
    	try {
    	    return JSON.parse(value);
    	} catch (e) {
    	    try {
    	        return eval(value);
    	    } catch (e) {
   	         return value;
  	      }
  	  }
    }));

    function getCustomParam () {
        
    }

    getCustomParam.numRange = {
        volume: [100, 0, 100],
        pitch: [100, 50, 150],
        pan: [0, -100, 100],
    }

    getCustomParam.list = function(list, callback) {
        if (!Array.isArray(list)) return [];
        var array = [];
        list.forEach(function(se) {
            var obj = callback.call(this, se);
            if (obj) array.push(obj);
        }, this);
        return array;
    };

    getCustomParam.getSeList = function(list) {
        return getCustomParam.list(list , this.getParamSeFile);
    };

    getCustomParam.getParamSeFile = function(se) {
        if (!se) return null;
        var obj = {};
        obj.name = se.seName ? toString(se.seName) : '';
        obj.volume = toNumRange(se.seVolume, this.numRange.volume);
        obj.pitch = toNumRange(se.sePitch, this.numRange.pitch);
        obj.pan = toNumRange(se.sePan, this.numRange.pan);
        return obj;
    }

    getCustomParam.getConditions = function(list) {
        return getCustomParam.list(list , this.getParamConditions);
    };

    getCustomParam.getParamConditions = function(list) {
        if (!list) return null;
        var paramList = Object.keys(isSoundSkip);
        if (!paramList || !paramList.length) return null;
        var obj = {};
        paramList.forEach(function(key) {
            if (list[key]) {
                if (key !== 'description') obj[key] = list[key];
            }
        });
        return obj;
    }

    var getDamageRate = function(isActor) {
        var result = 0;
        if (isActor) {
            result = $gameVariables.value(param.variable.actorRate);
            return result > 0 ? result : 0;
        } else {
            result = $gameVariables.value(param.variable.enemyRate);
            return result > 0 ? result : 0;
        }
    };
    

    var getResultDataItem = function(item) {
        var itemId = item._itemId;
        if (itemId <= 0) return;
        if (item._dataClass === 'item') return $dataItems[itemId];
    };

    var getResultDataSkill = function(item) {
        var itemId = item._itemId;
        if (itemId <= 0) return;
        if (item._dataClass === 'skill') return $dataSkills[itemId];
    };

    var isSkipSoundBoolean = function(type, obj) {
        if (!obj[type]) return;
        var result = this.result();
        if (obj[type] && !result[type]) {
            return true;
        }
    };

    var isSkipSoundUseItem = function(type, obj, callback) {
        if (obj[type] <= 0) return;
        var result = this.result();
        var useItem = result.useItem;
        var item = callback(useItem);
        if (!item || obj[type] !== useItem._itemId) {
            return true;
        }
    };

    var isSoundSkip = {
        minDamage: function(obj) {
            var type = 'minDamage';
            var minDamage = obj[type];
            if (minDamage <= 0) return;
            var result = this.result();
            var damage = result.hpDamage;
            if (damage < minDamage) {
                return true;
            }
        },
        damageRate: function(obj) {
            var type = 'damageRate';
            if (obj[type] <= 0) return;
            var damageRate = this._damageRate;
            var result = this.result();
            var damage = result.hpDamage;
            
            if (damageRate <= 0 || damage <= 0) {
                return true;
            }
            var value = Math.ceil((damage / damageRate) * 100);
            if (value < obj[type]) {
                return true;
            }
        },
        critical: function(obj) {
            var type = 'critical';
            return isSkipSoundBoolean.call(this, type, obj);
        },
        physical: function(obj) {
            var type = 'physical';
            if (!obj[type]) return;
            return isSkipSoundBoolean.call(this, type, obj);
        },
        magical: function(obj) {
            var type = 'magical';
            return isSkipSoundBoolean.call(this, type, obj);
        },
        drain: function(obj) {
            var type = 'drain';
            return isSkipSoundBoolean.call(this, type, obj);
        },
        stypeId: function(obj) {
            var type = 'stypeId';
            if (obj[type] <= 0) return;
            var result = this.result();
            var useItem = result.useItem;
            var item = getResultDataSkill(useItem);
            if (!item || obj[type] !== item[type]) {
                return true;
            }
        },
        elementId: function(obj) {
            var type = 'elementId';
            if (obj[type] <= 0) return;
            var result = this.result();
            var useItem = result.useItem;
            var item = getResultDataSkill(useItem);
            if (!item || obj[type] !== item.damage[type]) {
                return true;
            }
        },
        skillId: function(obj) {
            var type = 'skillId';
            return isSkipSoundUseItem.call(this, type, obj, getResultDataSkill);
        },
        itemId: function(obj) {
            var type = 'itemId';
            return isSkipSoundUseItem.call(this, type, obj, getResultDataItem);
        },
        stateId: function(obj) {
            var type = 'stateId';
            if (obj[type] <= 0) return;
            if (!this.isStateAffected(obj[type])) {
                return true;
            }
        },
        addStateId: function(obj) {
            var type = 'addStateId';
            if (obj[type] <= 0) return;
            var result = this.result();
            if (result.addedStates.indexOf(obj[type]) < 0) {
                return true;
            }
        },
    }

    var param = (function() {

        var playEnemySeArray = getCustomParam.getSeList(originalParam.playEnemySe);
        var playActorSeArray = getCustomParam.getSeList(originalParam.playActorSe);
    
        var playEnemyConditions = getCustomParam.getConditions(originalParam.playEnemySe);
        var playActorConditions = getCustomParam.getConditions(originalParam.playActorSe);

        var messageEnemyDamage = getParamString(originalParam.messageEnemyDamage);
        var messageActorDamage = getParamString(originalParam.messageActorDamage);
        var messageEnemyDrain = getParamString(originalParam.messageEnemyDrain);
        var messageActorDrain = getParamString(originalParam.messageActorDrain);
        var messageEnemyRecovery = getParamString(originalParam.messageEnemyRecovery);
        var messageActorRecovery = getParamString(originalParam.messageActorRecovery);
        
        var msg = {
            enemyDamage: messageEnemyDamage || '%1にダメージを与えた！',
            actorDamage: messageActorDamage || '%1はダメージを受けた！',
            enemyDrain: messageEnemyDrain || '%1の%2を奪った！',
            actorDrain: messageActorDrain || '%1は%2を奪われた！',
            enemyRecovery: messageEnemyRecovery || '%1の%2が回復した！',
            actorRecovery: messageActorRecovery || '%1の%2が回復した！',
        }
        var isPopupDamage = !!originalParam.isPopupDamage;
        var isDrainDamageSe = !!originalParam.isDrainDamageSe;
        var isCustomMessage = !!originalParam.isCustomMessage;

        var actorRateVariable = getParamNumber(originalParam.actorRateVariable);
        var enemyRateVariable = getParamNumber(originalParam.enemyRateVariable);

        var variable = {
            actorRate: actorRateVariable,
            enemyRate: enemyRateVariable
        }

        return {
            playEnemySe: playEnemySeArray,
            playActorSe: playActorSeArray,
            enemyConditions: playEnemyConditions,
            actorConditions: playActorConditions,
            msg: msg,
            isPopupDamage: isPopupDamage,
            isDrainDamageSe: isDrainDamageSe,
            isCustomMessage: isCustomMessage,
            variable: variable
        }

    })();

    /** 
     * Game_Action
     * 
     */

    var _Game_Action_apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function(target) {
        _Game_Action_apply.apply(this, arguments);
        var result = target.result();
        if (result.hpAffected) target.setPlayDamageSound();
    }

    var _Game_Action_executeHpDamage = Game_Action.prototype.executeHpDamage;
    Game_Action.prototype.executeHpDamage = function(target, value) {
        if (this.isDrain()) {
            value = Math.min(target.hp, value);
        }
        _Game_Action_executeHpDamage.apply(this, arguments);

        var result = target.result();
        result.magical = this.isMagical();
        result.useItem = this._item;
    };

    /** 
     * Game_Battler
     * 
     */
    var _Game_Battler_gainHp = Game_Battler.prototype.gainHp;
    Game_Battler.prototype.gainHp = function(value) {
        _Game_Battler_gainHp.apply(this, arguments);
    };

    Game_Battler.prototype.playDamageSound = function(array) {
        this._damageRate = getDamageRate(this.isActor());
        var len = array.length;
        for (var i = 0; i < len; i++) {
            if (!array[i]) continue;
            if (this.isSkipDamageSound(array[i])) continue;
            return i;
        }
        return -1;
    };

    Game_Battler.prototype.isSkipDamageSound = function(soundParam) {
        if (!soundParam) return false;
        var array = Object.keys(soundParam);
        if (!array.length) return true;
        for (var key of array) {
            if (!soundParam[key]) continue;
            var isSkip = isSoundSkip[key];
            if (isFunction(isSkip)) {
                if (isSkip.call(this, soundParam)) return true;
            }
        }
        return false;
    };

    /** ダメージのポップアップを制御 */
    var _Game_Battler_startDamagePopup = Game_Battler.prototype.startDamagePopup;
    Game_Battler.prototype.startDamagePopup = function() {
        if (param.isPopupDamage) _Game_Battler_startDamagePopup.apply(this, arguments);
    };

    /** 
     * Game_Actor
     * 
     */
    Game_Actor.prototype.setPlayDamageSound = function() {
        var id = this.playDamageSound(param.actorConditions);
        SoundManager.setActorDamage(id);
    };

    /** 吸収時のダメージSE再生を追加 */
    Game_Enemy.prototype.performDrain = function() {
        var result = this.result();
        if (result.hpDamage > 0) SoundManager.playActorDamage();
    };

    /** 
     * Game_Enemy
     * 
     */
    Game_Enemy.prototype.setPlayDamageSound = function() {
        var id = this.playDamageSound(param.enemyConditions);
        SoundManager.setEnemyDamage(id);
    };

    /** 吸収時のダメージSE再生を追加 */
    Game_Enemy.prototype.performDrain = function() {
        var result = this.result();
        if (result.hpDamage > 0) SoundManager.playEnemyDamage();
    };

    /** 
     * SoundManager
     * 
     */
    var _SoundManager_playEnemyDamage = SoundManager.playEnemyDamage;
    SoundManager.playEnemyDamage = function() {
        var se = this._playEnemyDamage;
        if (se) {
            if (se.name) AudioManager.playStaticSe(se);
            se = null;
        } else {
            _SoundManager_playEnemyDamage.apply(this, arguments);
        }
    };

    var _SoundManager_playActorDamage = SoundManager.playActorDamage;
    SoundManager.playActorDamage = function() {
        var se = this._playActorDamage;
        if (se) {
            if (se.name) AudioManager.playStaticSe(se);
            se = null;
        } else {
            _SoundManager_playActorDamage.apply(this, arguments);
        }
    };

    SoundManager.setEnemyDamage = function(id) {
        if (id >= 0) {
            this._playEnemyDamage = param.playEnemySe[id] || null;
        } else {
            this._playEnemyDamage = null;
        }
    };

    SoundManager.setActorDamage = function(id) {
        if (id >= 0) {
            this._playActorDamage = param.playActorSe[id] || null;
        } else {
            this._playActorDamage = null;
        }
    };

    /** 
     * Window_BattleLog
     * 
     */

    /** 吸収時もダメージSEを流すように追加 */
    var _Window_BattleLog_displayHpDamage = Window_BattleLog.prototype.displayHpDamage;
    Window_BattleLog.prototype.displayHpDamage = function(target) {
        if (param.isDrainDamageSe) {
            if (target.result().hpAffected) {
                if (target.result().hpDamage > 0 && target.result().drain) {
                    target.performDrain();
                }
            }
        }
        _Window_BattleLog_displayHpDamage.apply(this, arguments);
    }

    /** ダメージ用メッセージを追加 */
    var _Window_BattleLog_makeHpDamageText = Window_BattleLog.prototype.makeHpDamageText;
    Window_BattleLog.prototype.makeHpDamageText = function(target) {
        var result = target.result();
        var damage = result.hpDamage;
        var isActor = target.isActor();
        var fmt;
        if (damage > 0 && result.drain) {
            fmt = isActor ? param.msg.actorDrain : param.msg.enemyDrain;
            return fmt.format(target.name(), TextManager.hp, damage);
        } else if (damage > 0) {
            fmt = isActor ? param.msg.actorDamage : param.msg.enemyDamage;
            return fmt.format(target.name(), damage);
        } else if (damage < 0) {
            fmt = isActor ? param.msg.actorRecovery : param.msg.enemyRecovery;
            return fmt.format(target.name(), TextManager.hp, -damage);
        } else {
            fmt = isActor ? TextManager.actorNoDamage : TextManager.enemyNoDamage;
            return fmt.format(target.name());
        }
    };

    /** ダメージのポップアップを制御 */
    var _Sprite_Battler_updateDamagePopup = Sprite_Battler.prototype.updateDamagePopup;
    Sprite_Battler.prototype.updateDamagePopup = function() {
        if (!param.isPopupDamage) this._damages.length = 0;
        _Sprite_Battler_updateDamagePopup.apply(this, arguments);
    };

    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command.toLowerCase() === 'damagese') {
            switch (args[0].toLowerCase()) {
                case "set":
                    
                    break;
                default:
                    break;
            }
        }
    }

    var convertEscapeVariable = function(text) {
        if (typeof text !== 'string') return text;
        text = text.replace(/\\/g, '\x1b');
        text = text.replace(/\x1b\x1b/g, '\\');
        text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
            return $gameVariables.value(parseInt(arguments[1]));
        }.bind(this));
        text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
            return $gameVariables.value(parseInt(arguments[1]));
        }.bind(this));
        return text;
    };

    var convertEVtoLC  = function(text) {
        if (typeof text !== 'string') return text;
        text = convertEscapeVariable(text);
        text = text.toLowerCase();
        return text;
    };

    function isUndefined(val) {return typeof val === 'undefined';}
    function isNumber(val) {return typeof val === 'number';}
    function isString(val) {return typeof val === 'string';}
    function isFunction(val) {return typeof val === 'function';}
    function isObject(val) {
        return val !== null && typeof val === 'object';
    }

    function isArray(arr) {
        return Array.isArray(arr) || arr instanceof Array;
    }

    function getParamString(val) {
        return toString(val);
    }

    function getParamNumber(val) {
        var n = toNumber(val);
        return isNumber(n) ? n : 0;
    }

    function isEqual(a, b) {
        if (a === b) return true;
    }

    function toString(val) {
      return val == null || isUndefined(val)
        ? ''
        : typeof val === 'object'
          ? JSON.stringify(val, null, 2)
          : String(val)
    }

    function toNumber (val) {
        var n = parseInt(val);
        return isNaN(n) ? val : n
    }

    function toNumRange(val, arr) {
        /* 0 default 1 min 2 max*/
        val = parseInt(val);
        if (isNaN(val)) val = parseInt(arr[0]) || 0;
        if (val < arr[1]) val = arr[1];
        if (val > arr[2]) val = arr[2];
        return val;
    }

})();