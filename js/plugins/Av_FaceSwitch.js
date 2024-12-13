/*============================================================================
 Av_FaceSwitch.js
 ---------------------------------------------------------------------------
 (C)2020 アーヴェル
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
 ---------------------------------------------------------------------------
  Version
  1.0.0 2020/4/4 初版
  1.0.1 2020/4/5 対応パラメータを二倍にしました。
 ---------------------------------------------------------------------------
 [Blog]   : URL
 [Twitter]: https://twitter.com/LF71_S
============================================================================*/
/*:
 *@plugindesc 指定したスイッチがオンの時に、該当キャラクターの参照フェイス画像を変更する。
 *@author アーヴェル
 *
 * @param FSadd
 * @type boolean
 * @desc FSaddがONであればD～Fを使用し、OFFであれば使用しない。
 * @on D～Fを使用する
 * @off D～Fを使用しない
 * @default false
 *
 * @param FSwitchA
 * @desc スイッチがオンの時に文章の表示のフェイス画像を変更する。対応パラメータ/BeforeFaceA/AfterFaceA
 * @default 0
 * @type switch
 *
 * @param FSwitchB
 * @desc スイッチがオンの時に文章の表示のフェイス画像を変更する。対応パラメータ/BeforeFaceB/AfterFaceB
 * @default 0
 * @type switch
 *
 * @param FSwitchC
 * @desc スイッチがオンの時に文章の表示のフェイス画像を変更する。対応パラメータ/BeforeFaceC/AfterFaceC　　
 * @default 0
 * @type switch
 *
 * @param FSwitchD
 * @desc パラメータＤ～Ｆを使用する場合はプラグインパラメータ一番上のFSaddをonにしてください。
 * @default 0
 * @type switch
 *
 * @param FSwitchE
 * @desc パラメータＤ～Ｆを使用する場合はプラグインパラメータ一番上のFSaddをonにしてください。
 * @default 0
 * @type switch
 *
 * @param FSwitchF
 * @desc パラメータＤ～Ｆを使用する場合はプラグインパラメータ一番上のFSaddをonにしてください。
 * @default 0
 * @type switch
 *
 * @param BeforeFaceA
 * @desc 指定されたファイル名を参照する場合、FSwithAで指定したスイッチがオンであれば、AfterFaceAの参照へ切り替える。
 * @default Actor1
 * @type string
 *
 * @param BeforeFaceB
 * @desc 指定されたファイル名を参照する場合、FSwithBで指定したスイッチがオンであれば、AfterFaceBの参照へ切り替える。
 * @default Actor1
 * @type string
 *
 * @param BeforeFaceC
 * @desc 指定されたファイル名を参照する場合、FSwithCで指定したスイッチがオンであれば、AfterFaceCの参照へ切り替える。
 * @default Actor1
 * @type string
 *
 * @param BeforeFaceD
 * @desc パラメータＤ～Ｆを使用する場合はプラグインパラメータ一番上のFSaddをonにしてください。
 * @default Actor1
 * @type string
 *
 * @param BeforeFaceE
 * @desc パラメータＤ～Ｆを使用する場合はプラグインパラメータ一番上のFSaddをonにしてください。
 * @default Actor1
 * @type string
 *
 * @param BeforeFaceF
 * @desc パラメータＤ～Ｆを使用する場合はプラグインパラメータ一番上のFSaddをonにしてください。
 * @default Actor1
 * @type string
 *
 * @param AfterFaceA
 * @desc BeforeFaceAで指定されたファイル名をここで指定されたファイル名をに切り替える。
 * @default Actor2
 * @type string
 *
 * @param AfterFaceB
 * @desc BeforeFaceBで指定されたファイル名をここで指定されたファイル名をに切り替える。
 * @default Actor2
 * @type string
 *
 * @param AfterFaceC
 * @desc BeforeFaceCで指定されたファイル名をここで指定されたファイル名をに切り替える。
 * @default Actor2
 * @type string
 * 
 * @param AfterFaceD
 * @desc パラメータＤ～Ｆを使用する場合はプラグインパラメータ一番上のFSaddをonにしてください。
 * @default Actor2
 * @type string
 *
 * @param AfterFaceE
 * @desc パラメータＤ～Ｆを使用する場合はプラグインパラメータ一番上のFSaddをonにしてください。
 * @default Actor2
 * @type string
 *
 * @param AfterFaceF
 * @desc パラメータＤ～Ｆを使用する場合はプラグインパラメータ一番上のFSaddをonにしてください。
 * @default Actor2
 * @type string
 * 
 * @help 元々自分用に作ったプラグインを勉強の為に、手直ししたものです。
 * 作者に知識がないのでサポートは期待しないようお願いします。
 *
 * facesファイルの画像は上段４つ、下段４つの合計８つのブロックに分かれています。
 * 左上から０,１,２,３,下段左からに行って４,５,６,７となります。
 * 文章の表示で画像指定をした後に、
 * 実行内容を見るとActor1(2)等で括弧内に数字が書かれていますが、それが番号です。
 * 
 * このプラグインは、同一画像ファイル内ではなく、
 * スイッチの状況により、参照する画像ファイルそのものを変更するものです。
 * 
 * その為、表情差分を作り、一人一枚の画像を割り当てている方向けのものとなります。
 * 加えて、メッセージ表示の際に指定する番号は変動しないため、
 * 変更前の画像と変更後の画像で、
 * 表情差分の喜怒哀楽等が同じ番号に入っている必要があります。
 *
 * 適切な画像順ならば、例えばストーリー分岐で女の子から好みの髪型を聞かれ、
 * 以後、選んだ髪型としたいような場合、表情差分の番号さえ合わせておけば、
 * 髪型だけ変更した会話を用意する必要もありません。
 *
 * 変更されるのは文章の表示だけなので、ステータス画面やSVアクター等は、
 * 以下のようなスクリプトで変更すると良いかもしれません。
 * $gameActors.actor(1)はデータベースのアクター番号　１番を指定（元々はハロルド）
 * 後は指定したアクターの情報を指定した画像へ変更しています。
 *
 * $gameActors.actor(1).setCharacterImage("Actor2", 1)
 * $gameActors.actor(1).setFaceImage("Actor2", 1)
 * $gameActors.actor(1).setBattlerImage("Actor2")
 * $gamePlayer.refresh()
 *
 * 
 * 使い方は、プラグインパラメータのFSwitchで差分変更用のスイッチを決め、
 * BeforeFaceで変更前の画像名を指定します。（スイッチＯＦＦではそのまま表示）
 * ゲーム内で指定した番号のスイッチがｏｎであれば、BeforeFaceの画像がAfterFace
 * に差し替えられます。FSwitch BeforeFace AfterFace のパラメータは３つありますが、
 * 同じ用途のものが単に３つはいっているだけです。
 * 末尾がA～Cで、FSwitchAなら、BeforeFaceAとAfterFaceAに対応しています。
 * 
 * D～Fを追加しました。プラグインパラメータのFSaddから使用可否を選択できます。
 * A～Cと同様に、D～Fも末尾が同じパラメータにそれぞれ対応しています。
 * 
 */

//=============================================================================
//rpg_objects.js　内のメッセージの表示に関する記述部分
//=============================================================================

Game_Interpreter.prototype.command101 = function() {

//プラグインパラメータを読み込めるように当該ファイル名を指定
    var parameters = PluginManager.parameters('Av_FaceSwitch');

//Av_FaceSwitchのプラグインパラメータから関数に数値を代入


    var FSadd = parameters['FSadd'];

    var FSwitchA = Number(parameters['FSwitchA'] || 0);
    var FSwitchB = Number(parameters['FSwitchB'] || 0);
    var FSwitchC = Number(parameters['FSwitchC'] || 0);
    var FSwitchD = Number(parameters['FSwitchD'] || 0);
    var FSwitchE = Number(parameters['FSwitchE'] || 0);
    var FSwitchF = Number(parameters['FSwitchF'] || 0);
  　var BeforeFaceA = parameters['BeforeFaceA'];
  　var BeforeFaceB = parameters['BeforeFaceB'];
  　var BeforeFaceC = parameters['BeforeFaceC'];
  　var BeforeFaceD = parameters['BeforeFaceD'];
  　var BeforeFaceE = parameters['BeforeFaceE'];
  　var BeforeFaceF = parameters['BeforeFaceF'];
    var AfterFaceA = parameters['AfterFaceA'];
    var AfterFaceB = parameters['AfterFaceB'];
    var AfterFaceC = parameters['AfterFaceC'];
    var AfterFaceD = parameters['AfterFaceD'];
    var AfterFaceE = parameters['AfterFaceE'];
    var AfterFaceF = parameters['AfterFaceF'];

//多分メッセージの表示という命令がされた時
    if (!$gameMessage.isBusy()) {

//追加記述部分（例　A）
//もし、FSwitchAで指定したゲームスイッチ番号がｏｎである場合
//もし、This._params[0]の中がBeforeFaceAで指定したファイル名と同じであれば、This._params[0]の中身をAfterFaceAに変更する

//↓ここからA～Cの動作部分です

if($gameSwitches.value(FSwitchA)){
if (this._params[0] == BeforeFaceA) this._params[0] = AfterFaceA;
}       

if($gameSwitches.value(FSwitchB)){
if (this._params[0] == BeforeFaceB) this._params[0] = AfterFaceB;
}

if($gameSwitches.value(FSwitchC)){
if (this._params[0] == BeforeFaceC) this._params[0] = AfterFaceC;
}

//↑ここまでA～Cの動作部分です


//↓ここからD～Fの追加分です。

if(FSadd === 'true') {

if($gameSwitches.value(FSwitchD)){
if (this._params[0] == BeforeFaceD) this._params[0] = AfterFaceD;
}       

if($gameSwitches.value(FSwitchE)){
if (this._params[0] == BeforeFaceE) this._params[0] = AfterFaceE;
}

if($gameSwitches.value(FSwitchF)){
if (this._params[0] == BeforeFaceF) this._params[0] = AfterFaceF;
}

}

//↑ここまでD～Fの追加分です。



//ここから元々のrpg_objects.jsで記述されているメッセージ表示の記述部分
//元々メッセージの表示で指定されている画像を読み込んだ後にここで出力処理をしている
//出力処理の前に割り込み処理で参照ファイル変更を行っている

        $gameMessage.setFaceImage(this._params[0], this._params[1]);
        $gameMessage.setBackground(this._params[2]);
        $gameMessage.setPositionType(this._params[3]);
        while (this.nextEventCode() === 401) {  // Text data
            this._index++;
            $gameMessage.add(this.currentCommand().parameters[0]);
        }
        switch (this.nextEventCode()) {
        case 102:  // Show Choices
            this._index++;
            this.setupChoices(this.currentCommand().parameters);
            break;
        case 103:  // Input Number
            this._index++;
            this.setupNumInput(this.currentCommand().parameters);
            break;
        case 104:  // Select Item
            this._index++;
            this.setupItemChoice(this.currentCommand().parameters);
            break;
        }
        this._index++;
        this.setWaitMode('message');
    }
    return false;
};