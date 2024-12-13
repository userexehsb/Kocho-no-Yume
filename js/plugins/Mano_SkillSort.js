/*:
 * @author しぐれん
 * @plugindesc スキルをID順にソートします。
*/
(function(){
    'use strict'

const Window_SkillList_makeItemList=Window_SkillList.prototype.makeItemList;
Window_SkillList.prototype.makeItemList =function(){
    Window_SkillList_makeItemList.call(this);
    this._data.sort(function(a,b){
        return a.id-b.id;
    });
};

})()
