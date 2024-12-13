//=============================================================================
// TP_cond.js
// ----------------------------------------------------------------------------
// Copyright (c) 2017-2017 Sigureya
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/Sigureya/
// [github]:https://github.com/Sigureya/RPGmakerMV
//=============================================================================

/*:ja
 * @plugindesc スキルやアイテムの発動条件に、TPが一定以上であることを追加します。
 * 
 * @author しぐれん（魔のささやき）
 *
 * @help
 * スキル側にデータを設定します。
 * <TP_less:10>   TPが10以下の時のみ発動可能
 * <TP_great:10>  TPが10以上の時のみ発動可能
 * 英語で厳密にやれば、less thenですが、短く書けるようにするためにthenは省略。
 * var 1.0(2017/6/4) 公開
 */

(function () {
    'use strict';
	var zz_TP_cond_Game_BattlerBase_canUse=Game_BattlerBase.prototype.canUse;
	Game_BattlerBase.prototype.canUse = function(item){

		var tpCond = true;
		if(item)
		{
			if(item.meta.TP_great){
				tpCond = item.meta.TP_great <= this.tp;
			}
			if(item.meta.TP_less){
				tpCond = item.meta.TP_less >= this.tp;
			}
		}
		return  tpCond && zz_TP_cond_Game_BattlerBase_canUse.apply(this,arguments);
	}
})();
