//=============================================================================
// Plugin_Name : RX_T_Change_BattleBack(in_Battle)
// File_Name   : RX_T_Change_BattleBack(in_Battle).js
// Version     : 1.02
// Copylight   : 2015 TYPE74RX-T
//=============================================================================


//=============================================================================
/*:
 * @plugindesc イベントコマンド「戦闘背景の変更」を戦闘中でも行えるようになります。
 * @author TYPE74RX-T
 * @help 戦闘背景の変更EX
 * ============================================================================
 * * 戦闘背景の変更EX・ヘルプ
 * ============================================================================
 * イベントコマンド「戦闘背景の変更」を戦闘中でも行えるようになります。
 * ============================================================================
 * * 更新履歴
 * ============================================================================
 * 2016/10/11(Ver 1.02)
 * ・Canvasモードでの動作において戦闘背景の変更コマンドが発動しない不具合を修正
 * 2015/10/29(Ver 1.01)
 * ・一部不要な変数の定義をしていたのを削除。
 * ・競合を軽減するため一部変数名を変更。
 * ============================================================================
 * * 使い方
 * ============================================================================
 * プラグインを導入すれば、あとはバトルイベントで
 * イベントコマンド「戦闘背景の変更」を選択して
 * 変更したい背景に変更すればOKです。
 * ============================================================================
 * * ドキュメント終了 
 * ============================================================================
*/
(function() {
    
    //Game_Temp

    var rx_t_gtp151026_initialize = Game_Temp.prototype.initialize;
    Game_Temp.prototype.initialize = function() {
        rx_t_gtp151026_initialize.call(this);
        this._rx_changeBatBack_in_battle = false;
    };

    //Game_Map

    var rx_t_gmpp151026_changeBattleback = Game_Map.prototype.changeBattleback;
    Game_Map.prototype.changeBattleback = function(battleback1Name, battleback2Name) {
        rx_t_gmpp151026_changeBattleback.call(this, battleback1Name, battleback2Name);
        if (BattleManager.isBattleTest()) {
            $dataSystem.battleback1Name = battleback1Name
            $dataSystem.battleback2Name = battleback2Name
        }
        if ($gameParty.inBattle() && !$gameTemp._rx_changeBatBack_in_battle) {
            $gameTemp._rx_changeBatBack_in_battle = true;
        }
    };

    //Spriteset_battle

    var rx_t_spbp151026_updateBattleback = Spriteset_Battle.prototype.updateBattleback;
    Spriteset_Battle.prototype.updateBattleback = function() {
        rx_t_spbp151026_updateBattleback.call(this);
        if ($gameParty.inBattle() && $gameTemp._rx_changeBatBack_in_battle){
            if (this.battleback1Bitmap().isReady() && this.battleback2Bitmap().isReady()) {
                $gameTemp._rx_changeBatBack_in_battle = false;
                if ((this._back1Sprite.bitmap || this._back2Sprite.bitmap) && Graphics.isWebGL() != true) {
                    this._canvasReAddBattleback();
                } else {
                    this._back1Sprite.bitmap = this.battleback1Bitmap();
                    this._back2Sprite.bitmap = this.battleback2Bitmap();
                }
            }
        }
    };

    Spriteset_Battle.prototype._canvasReAddBattleback = function() {
        var margin = 32;
        var x = -this._battleField.x - margin;
        var y = -this._battleField.y - margin;
        var width = Graphics.width + margin * 2;
        var height = Graphics.height + margin * 2;
        var index = this._battleField.children.indexOf(this._back1Sprite);
        this._battleField.removeChild(this._back1Sprite);
        this._back1Sprite = null;
        this._back1Sprite = new TilingSprite();
        this._back1Sprite.move(x, y, width, height);
        this._back1Sprite.bitmap = this.battleback1Bitmap();
        this._battleField.addChildAt(this._back1Sprite, index);
        index = this._battleField.children.indexOf(this._back2Sprite);
        this._battleField.removeChild(this._back2Sprite);
        this._back2Sprite = null;
        this._back2Sprite = new TilingSprite();
        this._back2Sprite.move(x, y, width, height);
        this._back2Sprite.bitmap = this.battleback2Bitmap();
        this._battleField.addChildAt(this._back2Sprite, index);
        this.locateBattleback();
    };
})();