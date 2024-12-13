BattleManager.makeRewards = function() {
    this._rewards = {};
    this._rewards.gold = $gameTroop.goldTotal();
    if ($gameSwitches.value(38)) {
        this._rewards.exp = Math.floor($gameTroop.expTotal() * 1.2);
    } else {
        this._rewards.exp = $gameTroop.expTotal();
    }
    if ($gameSwitches.value(39)) {
        this._rewards.exp = 0;
    }
    this._rewards.items = $gameTroop.makeDropItems();
};

/*:ja
 * @target MV MZ
 * @plugindesc （自作）経験値の倍率をスイッチで変更させる。
 * @author 
 * 
 * @help ■ 使い方
 * スイッチ38で経験値1.2倍。
 * スイッチ39で経験値が手に入らなくなる。。
 * 
 */