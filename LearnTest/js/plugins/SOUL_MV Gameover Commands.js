/*:
* @plugindesc v1.0 Creates simple Gameover Commands to change gameplay.
* @author Soulpour777 - soulxregalia.wordpress.com
*
* @help

SOUL_MV Gameover Commands
Author: Soulpour777

This plugin changes your boring gameover with commands to either
continue a saved file, retry the battle by going back to the scene
or going back to the title screen.

Place all your images under the img / systems folder.

Your images should be named

gcommand_0
gcommand_0B

for Continue Option,

gcommand_1
gcommand_1B

for Retry Scene Option

and

gcommand_2
gcommand_2B

for Go to Title Option.

* @param Use Command Window
* @desc Would you like to use command windows instead of graphics? (true / false)
* @default false
*
* @param Continue Image X
* @desc X axis of the Continue image. (When Use Command Window is not used)
* @default 510
*
* @param Continue Image Y
* @desc Y axis of the Continue image. (When Use Command Window is not used)
* @default 400
*
* @param Retry Image X
* @desc X axis of the Retry image. (When Use Command Window is not used)
* @default 510
*
* @param Retry Image Y
* @desc Y axis of the Retry image. (When Use Command Window is not used)
* @default 450
*
* @param Title Image X
* @desc X axis of the Go Back to Title image. (When Use Command Window is not used)
* @default 510
*
* @param Title Image Y
* @desc Y axis of the Title image. (When Use Command Window is not used)
* @default 500
*
*/

(function(){
    var SOUL_MV = SOUL_MV || {};
    SOUL_MV.GameoverCommands = {};

    SOUL_MV.GameoverCommands.useWindow = PluginManager.parameters('SOUL_MV Gameover Commands')['Use Command Window'] === "true" ? true : false;
    SOUL_MV.GameoverCommands.continueX = Number(PluginManager.parameters('SOUL_MV Gameover Commands')['Continue Image X'] || 510);
    SOUL_MV.GameoverCommands.retryX = Number(PluginManager.parameters('SOUL_MV Gameover Commands')['Retry Image X'] || 510);
    SOUL_MV.GameoverCommands.titleX = Number(PluginManager.parameters('SOUL_MV Gameover Commands')['Title Image X'] || 510);
    SOUL_MV.GameoverCommands.continueY = Number(PluginManager.parameters('SOUL_MV Gameover Commands')['Continue Image Y'] || 400);
    SOUL_MV.GameoverCommands.retryY = Number(PluginManager.parameters('SOUL_MV Gameover Commands')['Retry Image Y'] || 450);
    SOUL_MV.GameoverCommands.titleY = Number(PluginManager.parameters('SOUL_MV Gameover Commands')['Title Image Y'] || 500);
    function Window_GameoverCommands() {
        this.initialize.apply(this, arguments);
    }

    Window_GameoverCommands.prototype = Object.create(Window_Command.prototype);
    Window_GameoverCommands.prototype.constructor = Window_GameoverCommands;

    Window_GameoverCommands.prototype.initialize = function() {
        Window_Command.prototype.initialize.call(this, 0, 0);
        this.updatePlacement();
        this.openness = 0;
        this.selectLast();
    };

    Window_GameoverCommands._lastCommandSymbol = null;

    Window_GameoverCommands.initCommandPosition = function() {
        this._lastCommandSymbol = null;
    };

    Window_GameoverCommands.prototype.windowWidth = function() {
        return 240;
    };

    Window_GameoverCommands.prototype.updatePlacement = function() {
        this.x = (Graphics.boxWidth - this.width) / 2;
        this.y = Graphics.boxHeight - this.height - 96;
    };

    Window_GameoverCommands.prototype.makeCommandList = function() {
        this.addCommand('Continue',   'continue');
        this.addCommand('Retry Scene',   'retryscene');
        this.addCommand('Go to Title',   'gototitle');
    };

    Window_GameoverCommands.prototype.isContinueEnabled = function() {
        return DataManager.isAnySavefileExists();
    };

    Window_GameoverCommands.prototype.processOk = function() {
        Window_GameoverCommands._lastCommandSymbol = this.currentSymbol();
        Window_Command.prototype.processOk.call(this);
    };

    Window_GameoverCommands.prototype.selectLast = function() {
        if (Window_GameoverCommands._lastCommandSymbol) {
            this.selectSymbol(Window_GameoverCommands._lastCommandSymbol);
        }
    };    

    Scene_Gameover.prototype.create = function() {
        Scene_Base.prototype.create.call(this);
        this.playGameoverMusic();
        this.createBackground();
        this.createCommands();
        this.createGameoverCommands();
        preload();
    };    

    Scene_Gameover.prototype.createCommands = function() {
        this._continueSprite = new Sprite_Button();
        this._continueSprite.x = SOUL_MV.GameoverCommands.continueX;
        this._continueSprite.y = SOUL_MV.GameoverCommands.continueY;
        this._continueSprite.setClickHandler(this.commandContinue.bind(this));
        this._retrySprite = new Sprite_Button();
        this._retrySprite.x = SOUL_MV.GameoverCommands.retryX;
        this._retrySprite.y = SOUL_MV.GameoverCommands.retryY;
        this._retrySprite.setClickHandler(this.commandRetryContinue.bind(this));
        this._gotoTitleSprite = new Sprite_Button();
        this._gotoTitleSprite.x = SOUL_MV.GameoverCommands.titleX;
        this._gotoTitleSprite.y = SOUL_MV.GameoverCommands.titleY;
        this._gotoTitleSprite.setClickHandler(this.commandGoToTitle.bind(this));
        this.addChild(this._continueSprite);
        this.addChild(this._retrySprite);
        this.addChild(this._gotoTitleSprite);
    }

    Scene_Gameover.prototype.createGameoverCommands = function() {
        this._gameovercommand = new Window_GameoverCommands();
        this._gameovercommand.setHandler('continue',  this.commandContinue.bind(this));
        this._gameovercommand.setHandler('retryscene',  this.commandRetryContinue.bind(this));
        this._gameovercommand.setHandler('gototitle',  this.commandGoToTitle.bind(this));
        if (SOUL_MV.GameoverCommands.useWindow) {
            this._gameovercommand.open();
        } else {
            this._gameovercommand.visible = false;
            this._gameovercommand.open();
            this._gameovercommand.x = Graphics.boxWidth;
            this._gameovercommand.y = Graphics.boxHeight;
        }
        this._gameovercommand.open();
        this.addChildAt(this._gameovercommand, 1);
    }

    Scene_Gameover.prototype.commandContinue = function() {
        SceneManager.push(Scene_Load);
    }

    Scene_Gameover.prototype.commandRetryContinue = function() {
        SceneManager.goto(Scene_Map);
    }

    Scene_Gameover.prototype.commandGoToTitle = function() {
        SceneManager.push(Scene_Title);
    }    

    Scene_Gameover.prototype.update = function() {
        Scene_Base.prototype.update.call(this);
        if (this._gameovercommand._index === 0) {
            this._continueSprite.bitmap = ImageManager.loadSystem('gcommand_'+this._gameovercommand._index+'B');
            this._retrySprite.bitmap = ImageManager.loadSystem('gcommand_'+Number(this._gameovercommand._index+1));
            this._gotoTitleSprite.bitmap = ImageManager.loadSystem('gcommand_'+ Number(this._gameovercommand._index+2));
        }
        if (this._gameovercommand._index === 1) {
            this._continueSprite.bitmap = ImageManager.loadSystem('gcommand_'+Number(this._gameovercommand._index-1));
            this._retrySprite.bitmap = ImageManager.loadSystem('gcommand_'+ this._gameovercommand._index +'B');
            this._gotoTitleSprite.bitmap = ImageManager.loadSystem('gcommand_'+ Number(this._gameovercommand._index+1));
        } 
        if (this._gameovercommand._index === 2) {
            this._continueSprite.bitmap = ImageManager.loadSystem('gcommand_'+Number(this._gameovercommand._index-2));
            this._retrySprite.bitmap = ImageManager.loadSystem('gcommand_'+Number(this._gameovercommand._index-1));
            this._gotoTitleSprite.bitmap = ImageManager.loadSystem('gcommand_' + Number(this._gameovercommand._index) + 'B');
        }        
    };

    function preload() {
        ImageManager.loadSystem(this._continueSprite);
        ImageManager.loadSystem(this._retrySprite);
        ImageManager.loadSystem(this._gotoTitleSprite);
    }

})();