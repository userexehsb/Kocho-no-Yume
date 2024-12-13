//=============================================================================
// Manosasayaki_ItemThrow.js
// ----------------------------------------------------------------------------
// Copyright (c) 2017-2017 Sigureya
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/Sigureya/
// [github]:https://github.com/Sigureya/RPGmakerMV
//=============================================================================

/*:
 * @plugindesc 武器などを投げるスキルを作成します。
 * 
 * @author しぐれん（魔のささやき）
 * 
 * @param changeEquiptMessage
 * @desc 装備切り替え特技を使った際のメッセージです
 * @default %1は%2を装備した！
 *
 * @help
 * メモ欄に<ThrowSKill>と書くことで投げるスキルとして使えるようになります。
 * ダメージ式に以下の内容を書いてください。
 * this.throwingWeaponAtk()
 * これで、投げた武器の攻撃力分のダメージを与えます。
 * 
 * ■戦闘中に装備を切り替えるスキル
 * <ChangeEquip:2>
 * 防具の種類の番号を指定して、引数に入れてください。
 * 上記の場合、防具が候補として表示されます。
 * 数字を指定しない、または1の場合、武器が変更されます。
 * 
 * var 2.0.0(2017/10/23) 装備を変更するスキルを作れるように
 * var 1.2.0(2017/09/20)投げた武器の追加効果や属性が反映できるように＋バグ修正
 * var 1.0.1(2017/6/24)アイテム消費の実装。
 * コマンドが間違って表示されていたのを修正。
 * var 1.0.0(2017/6/23) 公開
 */
/*~struct~Kisekae:
 * @param skill
 * @desc 関連付けるためのキー文字列
 * @type armor
 */
(function () {
    'use strict';
function createSetting(){
    const params = PluginManager.parameters('Mano_ItemThrow');
    return {
        symbolThrow:'throw',
        skillThrow :Number(params.skill),
        changeEquiptMessage :String(params.changeEquiptMessage),
    };
}
const setting= createSetting();
class ThrowTrait{
    /**
     * 
     * @param {RPG.Skill} skill 
     */
    constructor(skill){
        this.originalAnimationId = skill.animationId;        
        this.inheritEffects =false;
        skill.itemThrow_MA =this;
        this.elementMode =0;
    }
}

function eachSkill(){
    var skill=null
    for (var i = 1; i < $dataSkills.length; i++) {
        var skill = $dataSkills[i];
        if(skill.meta.ChangeEquip===true){
            skill.meta.ChangeEquip=1;
        }else if(skill.meta.ChangeEquip!==undefined){
            skill.meta.ChangeEquip =Number(skill.meta.ChangeEquip);
        }
        // if(skill.meta.ChangeWeapon===true){
        //     skill.meta.ChangeWeapon=0;
        // }else if(skill.meta.ChangeWeapon!==undefined){
        //     skill.meta.ChangeWeapon =Number(skill.meta.ChangeWeapon);
        // }
    }
}

function baseAnimationSave(){

    for (var index = 1; index < $dataSkills.length; index++) {
        var skill = $dataSkills[index];
        if(isThrowSkill(skill)){
            skill._baseAnimationId = skill.animationId;
        }
    }
}
const Scene_Boot_start=Scene_Boot.prototype.start;
Scene_Boot.prototype.start =function(){
    Scene_Boot_start.call(this);
    eachSkill();
//    baseAnimationSave();
};
/**
 * @return {ThrowTrait}
 * @param {RPG.Skill} skill 
 */
function getThorwTrait(skill){
    return skill.itemThrow_MA;
}

/**
 * @param {RPG.Skill} skill 
 */
function isThrowSkill(skill){
    if(skill){
        return !!skill.meta.ThrowSKill;
    }
    return false; skill ;
}

function canThrow(item){
    return item&& !item.meta.notThrow;
}


function Window_ThrowItemSelect (){
    this.initialize.apply(this,arguments);
}
Window_ThrowItemSelect.CATEGORY_WEAPON ='weapon';
Window_ThrowItemSelect.CATEGORY_ARMOR ='armor';
Window_ThrowItemSelect.MODE_THROW =1;
Window_ThrowItemSelect.MODE_CHANGE_EQUIP=2;
Window_ThrowItemSelect.MODE_ARMOR=3;
Window_ThrowItemSelect.prototype = Object.create(Window_ItemList.prototype);
Window_ThrowItemSelect.prototype.constructor = Window_ThrowItemSelect;
Window_ThrowItemSelect.prototype.initialize=function(){
    Window_ItemList.prototype.initialize.apply(this,arguments);
    this._actor=null;
    this._mode =0;
    this._equipType =0;
};
/**
 * @param {RPG.EquipItem} item
 */
Window_ThrowItemSelect.prototype.canChangeEquip =function(item){
    return this._actor.canEquip(item);
};
Window_ThrowItemSelect.prototype.canThrow =function(item){
    return !item.meta.notThrow;
};

/**
 * @param {Game_Actor} actor
 * @param {RPG.Skill} skill
 */
Window_ThrowItemSelect.prototype.setup =function(actor, skill){
    this._actor = actor;
    this._skill =skill;
    if(skill.meta.ThrowSKill){
        this._mode = Window_ThrowItemSelect.MODE_THROW;
        return true;
    }
    
    if(skill.meta.ChangeEquip !==undefined ){
        this._mode = Window_ThrowItemSelect.MODE_CHANGE_EQUIP;
        this._actor = actor;
        this._skill =skill;
        return true;
    }
    return false;

};

Window_ThrowItemSelect.prototype.makeItemList =function(){
    if(this._mode ===Window_ThrowItemSelect.MODE_THROW){
        this._data =$gameParty.weapons();
        return;
    }
    if(this._mode ===Window_ThrowItemSelect.MODE_CHANGE_EQUIP){
        const slotId = this._skill.meta.ChangeEquip;
        if(slotId ===1 ){
            this._data =$gameParty.weapons().filter( this.canChangeEquip.bind(this) );
        }else{
            const xxx = this;
            this._data= $gameParty.armors().filter( function(armor){
                return armor.etypeId ===slotId && xxx.canChangeEquip(armor);
            }  );
        }
        return;
    }
    // if(this._mode ===Window_ThrowItemSelect.MODE_ARMOR){
    //     this._data =$gameParty.armors().filter( this.canChangeEquip.bind(this) );
    //     return;
    // }
    this._data=[];
};
Window_ThrowItemSelect.prototype.isEnabled =function(item){
    if(!!item){
        if(this._mode ===Window_ThrowItemSelect.MODE_THROW){
            return canThrow(item);
        }else{
            return this.canChangeEquip(item);
        }

    }
    return false;


    return !!item && this._enabledFunc(item);
};
Window_ThrowItemSelect.prototype.show =function(){
    this.showHelpWindow();
    Window_ItemList.prototype.show.call(this);
};
Window_ThrowItemSelect.prototype.hide =function(){
    Window_ItemList.prototype.hide.call(this);
};
//Window_ThrowItemSelect.prototype.set


const zz_Scene_Battle_createAllWindows=Scene_Battle.prototype.createAllWindows;
Scene_Battle.prototype.createAllWindows =function(){
    zz_Scene_Battle_createAllWindows.call(this);
    this.createItemThrowWindow();
};

// Window_ActorCommand.prototype.addThrowCommand =function(){
//     this.addCommand('なげる', 'throw',true);
// };
// const zz_Window_ActorCommand_makeCommandList=Window_ActorCommand.prototype.makeCommandList;
// Window_ActorCommand.prototype.makeCommandList =function(){
//     zz_Window_ActorCommand_makeCommandList.call(this);
//     if(this._actor){
//         this.addThrowCommand();
//     }

// };
// const zz_createActorCommandWindow=Scene_Battle.prototype.createActorCommandWindow;
// Scene_Battle.prototype.createActorCommandWindow =function(){
//     zz_createActorCommandWindow.call(this);
//     this._actorCommandWindow.setHandler('throw',this.commandThrow.bind(this));
// };

const zz_sv_iaiwa= Scene_Battle.prototype.isAnyInputWindowActive;
Scene_Battle.prototype.isAnyInputWindowActive =function(){
    return zz_sv_iaiwa.call(this) || this._itemThrowWindow.active;
};
/**
 * @param {RPG.Skill} skill
 */
function fetchEquipmentType(skill){


}

/**
 * @param {RPG.Skill} skill
 */
Scene_Battle.prototype.commandThrow =function(skill){
    const  actor = BattleManager.actor();



    this._enemyWindow.active=false;
    this._enemyWindow.hide();

    this._itemThrowWindow.setup(actor,skill);
    this._itemThrowWindow.refresh();
    this._itemThrowWindow.show();
    this._itemThrowWindow.showHelpWindow();
    this._itemThrowWindow.activate();
};
Game_Action.prototype.throwingWeapon =function(){
    return this._throwItem;
};
Game_Action.prototype.throwingWeaponAtk=function(){
    if(isThrowSkill(  this.item())){
        return this.throwingWeapon().params[2];
    }
    return 0;
};
/**
 * 
 * @param {Game_Actor} actor 
 * @param {RPG.EquipItem} equip
 * 
 */
function e_change(actor,equip){
    if(actor.canEquip(equip)){

        if(equip.wtypeId !==undefined){
            actor.changeEquip( 0, equip);            
        }else{
            actor.changeEquip( equip.etypeId-1, equip);
        }
    }
}

const Game_Action_applyGlobal =Game_Action.prototype.applyGlobal;
Game_Action.prototype.applyGlobal =function(){
    Game_Action_applyGlobal.call(this);
    const item = this.item();
    if(this._throwItem && item.meta.ChangeEquip!==undefined){
        const actor = this.subject();
        if(actor.isActor()){
            e_change(actor,this._throwItem);
        }
    }
};
/**
 * 
 * @param {Game_Actor} actor 
 * @param {number} slotId 
 */
function createChangeEquipMessange(actor,slotId){
    const equip = actor.equips()[slotId];
    return setting.changeEquiptMessage .format(actor.name(),equip.name);
}
const Window_BattleLog_displayAction = Window_BattleLog.prototype.displayAction;
/**
 * @param {Game_Actor} subject
 */
Window_BattleLog.prototype.displayAction =function(subject, item){
    const etypeId = item.meta.ChangeEquip;

    if(etypeId !==undefined){
        const e = subject.equips();
        this.push('addText',createChangeEquipMessange(subject,etypeId-1));
    }
    Window_BattleLog_displayAction.call(this,subject, item);



};

Game_Action.prototype.consumeThrowItem=function(){
    if(isThrowSkill(  this.item())){
        $gameParty.loseItem( $dataWeapons[ this._throwItem.id],1 );
    }
};
const Game_Action_applyItemUserEffect =Game_Action.prototype.applyItemUserEffect;
Game_Action.prototype.applyItemUserEffect =function(target){

    this.applyThrowEffektAll(target);
    Game_Action_applyItemUserEffect.call(this,target);
};
const Game_Action_calcElementRate=Game_Action.prototype.calcElementRate;
Game_Action.prototype.calcElementRate = function(target){
    const throwElements = this.throwElements();
    if(throwElements.length >0){
        return this.elementsMaxRate(target,throwElements);
    }
    return Game_Action_calcElementRate.call(this,target);
};

Game_Action.prototype.throwElements =function(){
    const weapon = this._throwItem;
    if(weapon){
        return weapon.traits.reduce(function(r, trait) {
            return r.concat(trait.dataId);
        }, [])
    }
    return [];
};

Game_Action.prototype.applyThrowEffektAll =function(target){
    const weapon = this._throwItem;
    if(weapon){
        weapon.traits.forEach(this.applyThrowEffekt.bind(this,target));
    }
};
 Game_Action.prototype.applyThrowEffekt =function(target,trait){

     if(trait.code===Game_BattlerBase.TRAIT_ATTACK_STATE) {
         const dummyCode ={
            code :Game_Action.EFFECT_ADD_STATE,
            dataId:trait.dataId,
            value1:trait.value
        };
        this.applyItemEffect(target,dummyCode);
     }
 };


const zz_MA_itemthrwo_BattleManager_startAction=BattleManager.startAction;
BattleManager.startAction =function(){
    zz_MA_itemthrwo_BattleManager_startAction.call(this);
    this._action.consumeThrowItem();
//    this._action.thorwAnimationHack();
};


Scene_Battle.prototype. onThrowSkillOk =function(){
    const action = BattleManager.inputtingAction();
    action.setItemObject(this._skillWindow.item());
    action._throwItem = this._itemThrowWindow.item();
    this._skillWindow.deselect();

    this._itemThrowWindow.hide();
    this._itemThrowWindow.deactivate();
    this.onSelectAction();
};

Scene_Battle.prototype.onThrowSkillCancel =function(){
    this._itemThrowWindow.hide();

    this._skillWindow.show();
    this._skillWindow.activate();
};
const Scene_Battle_onEnemyCancel =Scene_Battle.prototype.onEnemyCancel;
Scene_Battle.prototype.onEnemyCancel =function(){
    const skill = this._skillWindow.item();
    if(isThrowSkill(skill)){
        this._itemThrowWindow.show();
        this._itemThrowWindow.activate();
        this._enemyWindow.hide();
        
    }else{
        Scene_Battle_onEnemyCancel.call(this);
    }
};
Scene_Battle.prototype.createItemThrowWindow =function(){
    var wy = this._helpWindow.y + this._helpWindow.height;
    var wh = this._statusWindow.y - wy;
    const tw = new Window_ThrowItemSelect (0, wy, Graphics.boxWidth, wh);
    this._itemThrowWindow =tw;
    tw.setHelpWindow(this._helpWindow);
    tw.setHandler('ok',this.onThrowSkillOk.bind(this));
    tw.setHandler('cancel',this.onThrowSkillCancel.bind(this));
    tw.selectLast(0);
    tw.hide();
    this.addWindow(tw);
};

const zz_onSelectAction =Scene_Battle.prototype.onSelectAction;
Scene_Battle.prototype.onSelectAction =function(){
    if(!this._itemThrowWindow.active){
        zz_onSelectAction.call(this);
    }
};

const zz_onSkillOk=Scene_Battle.prototype.onSkillOk;
Scene_Battle.prototype.onSkillOk =function(){
    var skill = this._skillWindow.item();
    if(  this._itemThrowWindow.setup(BattleManager.actor(),skill)){
        this.commandThrow(skill);
    }
    zz_onSkillOk.call(this);
};

})();
