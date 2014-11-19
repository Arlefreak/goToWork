var gameOverLayer = cc.Layer.extend({
    sprite: null,
    ctor: function() {
        //////////////////////////////
        // 1. super init first
        this._super();
        var ctx = document.getElementById('gameCanvas').getContext("2d");
        ctx.imageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.mozImageSmoothingEnabled = false;

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;

        var bg = new cc.LayerColor(cc.color(225, 85, 85, 255), size.width, size.height);
        bg.setPosition(0, 0);
        var actionColor = cc.TintTo.create(0.1, 255, 255, 255, 255);
        var actionColor2 = cc.TintTo.create(0.1, 225, 85, 85, 255);
        var colorSequence = cc.Sequence.create(actionColor, actionColor2);
        var repeat = cc.RepeatForever.create(colorSequence);
        bg.runAction(repeat);
        this.addChild(bg);

        this.sprite = new cc.Sprite(res.gameOver_png);
        var rotateAction = cc.rotateTo(1, 20);
        var rotateAction2 = cc.rotateTo(1, -20);
        var rotateSequence = cc.Sequence.create(rotateAction, rotateAction2);
        var repeatRotate = cc.RepeatForever.create(rotateSequence);
        this.sprite.runAction(repeatRotate);
        this.sprite.attr({
            x: size.width / 2,
            y: size.height / 2,
            scale: 10,
            rotation: 0
        });
        this.addChild(this.sprite, 0);

        var title = new cc.Sprite();

        if (cc.sys.capabilities.hasOwnProperty('keyboard')) {
            cc.eventManager.addListener({
                event: cc.EventListener.KEYBOARD,

                onKeyPressed: function(key, event) {
                    cc.LoaderScene.preload(g_resources, function() {
                        cc.log("Key Pressed: " + key.toString());
                        cc.director.runScene(new menuScene());
                    }, this);
                }
            }, this);
        }

        return true;
    }
});

var gameOverScene = cc.Scene.extend({
    onEnter: function() {
        this._super();
        var layer = new gameOverLayer();
        this.addChild(layer);
    }
});