var gameLayer = cc.Layer.extend({
    guy: null,
    bus01: null,
    bus02: null,
    bus03: null,
    sideWalkL1: null,
    sideWalkL2: null,
    sideWalkR1: null,
    sideWalkR2: null,
    flowerL: null,
    flowerR: null,
    lineL: null,
    lineR: null,
    speed: null,
    rndm: null,
    rndmf: null,
    time: null,
    column: null,
    space: null,
    body: null,
    ctor: function() {
        //////////////////////////////
        // 1. super init first
        this._super();
        this.initPhysics();
        var ctx = document.getElementById('gameCanvas').getContext("2d");
        ctx.imageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.mozImageSmoothingEnabled = false;

        this._debugNode = new cc.PhysicsDebugNode(this.space);
        this._debugNode.setVisible(true);
        // Parallax ratio and offset
        this.addChild(this._debugNode, 10);

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;
        this.speed = 2;
        this.time = true;
        this.column = 2;

        var bg = new cc.LayerColor(cc.color(225, 85, 85, 255), size.width, size.height);
        bg.setPosition(0, 0);
        this.addChild(bg);
        cc.spriteFrameCache.addSpriteFrames(res.spriteSheet_plist);

        var guyAnimFrames = [];
        guyAnimFrames.push(cc.spriteFrameCache.getSpriteFrame("bike01.png"));
        guyAnimFrames.push(cc.spriteFrameCache.getSpriteFrame("bike02.png"));
        var animationGuy = new cc.Animation(guyAnimFrames, 0.1);
        this.runningAction = new cc.RepeatForever(new cc.Animate(animationGuy));


        /*this.guy = new cc.PhysicsSprite("#bike01.png");
        this.guy.attr({
            scale: 8,
            anchorX: 0.5,
            anchorY: 0
        });
        this.guy.runAction(this.runningAction);

        var contentSize = this.guy.getContentSize();
        var body = new cp.Body(1, cp.momentForBox(1, contentSize.width, contentSize.height));
        body.p = cc.p(size.width / 2, 100);
        body.applyImpulse(cp.v(0, -700), cp.v(0, 0)); //run speed
        this.space.addBody(body);
        var shape = new cp.BoxShape(body, contentSize.width, contentSize.height);
        shape.setCollisionType(1);
        shape.setSensor(true);
        this.space.addShape(shape);
        this.guy.setBody(body);
        this.guy.setTag(1);

        this.addChild(this.guy, 0);*/

        this.sideWalkL1 = cc.Node.create();
        this.sideWalkL2 = cc.Node.create();
        this.sideWalkR1 = cc.Node.create();
        this.sideWalkR2 = cc.Node.create();

        this.addChild(this.sideWalkL1);
        this.addChild(this.sideWalkL2);
        this.addChild(this.sideWalkR1);
        this.addChild(this.sideWalkR2);


        var busRedAnimFrames = [];
        busRedAnimFrames.push(cc.spriteFrameCache.getSpriteFrame("RedBus01.png"));
        busRedAnimFrames.push(cc.spriteFrameCache.getSpriteFrame("RedBus02.png"));
        var animationRedBus = new cc.Animation(busRedAnimFrames, 0.1);
        this.bus01Action = new cc.RepeatForever(new cc.Animate(animationRedBus));

        var busBlueAnimFrames = [];
        busBlueAnimFrames.push(cc.spriteFrameCache.getSpriteFrame("BlueBus01.png"));
        busBlueAnimFrames.push(cc.spriteFrameCache.getSpriteFrame("BlueBus02.png"));
        var animationBlueBus = new cc.Animation(busBlueAnimFrames, 0.1);
        this.bus02Action = new cc.RepeatForever(new cc.Animate(animationBlueBus));

        var busGreenAnimFrames = [];
        busGreenAnimFrames.push(cc.spriteFrameCache.getSpriteFrame("GreenBus01.png"));
        busGreenAnimFrames.push(cc.spriteFrameCache.getSpriteFrame("GreenBus02.png"));
        var animationGreenBus = new cc.Animation(busGreenAnimFrames, 0.1);
        this.bus03Action = new cc.RepeatForever(new cc.Animate(animationGreenBus));

        for (i = 8 - 1; i >= 0; i--) {
            this.sideWalkL1.addChild(this.createSideWalkL(0, size.height - ((i - 5) * 380)));
            this.sideWalkR1.addChild(this.createSideWalkR(size.width, size.height - ((i - 5) * 380)));
            this.sideWalkL2.addChild(this.createSideWalkL(0, size.height - 1000));
            this.sideWalkR2.addChild(this.createSideWalkR(size.width, size.height - 1000));
        }
        var that = this;

        if (cc.sys.capabilities.hasOwnProperty('keyboard')) {
            cc.eventManager.addListener({
                event: cc.EventListener.KEYBOARD,

                onKeyPressed: function(key, event) {
                    cc.log("Key Pressed: " + key.toString());
                    if (key === 39) { //right
                        that.moveRight();
                    } else if (key === 37) { //left
                        that.moveLeft();
                    }
                    /*cc.LoaderScene.preload(g_resources, function() {
                        cc.director.runScene(new menuScene());
                    }, this);*/
                }
            }, this);
        }
        if (cc.sys.capabilities.hasOwnProperty('touches')) {
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,

                onTouchBegan: function(touch, event) {
                    if (touch.getLocationX() > size.width / 2) {
                        that.moveRight();
                    } else {
                        that.moveLeft();
                    }
                    return true;
                }
            }, this);
        }

        //this.schedule(this.createGuy, 0.1);
        this.schedule(this.createTruck, 0.9);
        this.schedule(this.createSideWalk, 5.98);
        this.schedule(this.createFlower, 1);
        this.schedule(this.createLines, 1);
        //this.schedule(this.manageSpeed, 2);

        return true;
    },
    onEnter: function() {
        this._super();
        this.initPhysics();
        this.scheduleUpdate();
        this.createGuy();
    },

    update: function(dt) {
        // chipmunk step
        this.space.step(dt);
    },
    initPhysics: function() {
        //1. new space object 
        this.space = new cp.Space();
        //2. setup the  Gravity
        this.space.addCollisionHandler(1, 2, this.collisionTruckGuy.bind(this), null, null, null);
    },
    collisionTruckGuy: function(arbiter, guy) {
        cc.director.runScene(new gameOverScene());
    },
    manageSpeed: function() {
        if (this.speed > 0.5) {
            this.speed -= 0.1;
        }
    },
    moveLeft: function() {
        var size = cc.winSize;
        switch (this.column) {
            case 1:
                //this.guy.setPosition(0,0);
                break;
            case 2:
                this.guy.body.p = cc.p(size.width / 3.3, 100);
                //this.guy.setPosition(size.width / 3.3, 100);
                this.column = 1;
                break;
            case 3:
                this.guy.body.p = cc.p(size.width / 2, 100);
                //this.guy.setPosition(size.width / 2, 100);
                this.column = 2;
                break;
        }
    },
    moveRight: function() {
        var size = cc.winSize;
        switch (this.column) {
            case 1:
                this.guy.body.p = cc.p(size.width / 2, 100);
                //this.guy.setPosition(size.width / 2, 100);
                this.column = 2;
                break;
            case 2:
                this.guy.body.p = cc.p(size.width / 1.4, 100);
                //this.guy.setPosition(size.width / 1.4, 100);
                this.column = 3;
                break;
            case 3:
                break;
        }
    },
    createGuy: function() {
        var size = cc.winSize;
        var contentSize = null;
        var body = null;
        var shape = null;
        this.guy = new cc.PhysicsSprite("#bike01.png");
        this.guy.attr({
            scale: 8,
            anchorX: 0.5,
            anchorY: 0
        });
        this.guy.runAction(this.runningAction);

        contentSize = this.guy.getContentSize();
        body = new cp.Body(1, cp.momentForBox(1, contentSize.width, contentSize.height));
        body.p = cc.p(size.width / 2, 100);
        //body.applyImpulse(cp.v(0, -700), cp.v(0, 0)); //run speed
        this.space.addBody(body);
        shape = new cp.BoxShape(body, contentSize.width, contentSize.height);
        shape.setCollisionType(1);
        shape.setSensor(true);
        this.space.addShape(shape);
        this.guy.setBody(body);
        this.guy.setTag(1);

        this.addChild(this.guy, 0);
    },
    createLines: function() {
        var moveAction = new cc.moveBy(2.5, cc.p(0, -800));
        var moveAction2 = new cc.moveBy(2.5, cc.p(0, -800));
        var size = cc.winSize;
        var repeat = new cc.RepeatForever(moveAction);
        var repeat2 = new cc.RepeatForever(moveAction2);
        this.lineR = new cc.Sprite("#line.png");
        this.lineR.attr({
            x: size.width / 2.5,
            y: size.height,
            scale: 8,
            rotation: 0,
            anchorX: 0.5,
            anchorY: 0
        });
        this.lineR.runAction(repeat);
        this.addChild(this.lineR);

        this.lineL = new cc.Sprite("#line.png");
        this.lineL.attr({
            x: size.width / 1.7,
            y: size.height,
            scale: 8,
            rotation: 0,
            anchorX: 0.5,
            anchorY: 0
        });
        this.lineL.runAction(repeat2);
        this.addChild(this.lineL);

    },
    createFlower: function() {
        var RNDM = Math.floor((Math.random() * 2) + 1);
        do {
            RNDM = Math.floor((Math.random() * 2) + 1);
        } while (this.rndmf === RNDM);
        this.rndmf = RNDM;
        var size = cc.winSize;
        var flowerAnimFrames = [];
        flowerAnimFrames.push(cc.spriteFrameCache.getSpriteFrame("flower01.png"));
        flowerAnimFrames.push(cc.spriteFrameCache.getSpriteFrame("flower02.png"));
        var animationFlower = new cc.Animation(flowerAnimFrames, 1.0);
        var flowerAction = new cc.RepeatForever(new cc.Animate(animationFlower));
        var moveAction = new cc.moveBy(2.5, cc.p(0, -800));
        var repeat = new cc.RepeatForever(moveAction);

        if (this.rndmf === 1) {
            this.flowerL = new cc.Sprite("#flower01.png");
            this.flowerL.attr({
                x: 8,
                y: size.height,
                scale: 8,
                rotation: 0,
                anchorX: 0,
                anchorY: 0
            });
            this.flowerL.runAction(flowerAction);
            this.flowerL.runAction(
                cc.spawn(
                    repeat
                )
            );
            this.addChild(this.flowerL);
        } else {
            this.flowerR = new cc.Sprite("#flower01.png");
            this.flowerR.attr({
                x: size.width - 8,
                y: size.height,
                scale: 8,
                rotation: 0,
                anchorX: 1,
                anchorY: 0
            });
            this.flowerR.runAction(flowerAction);
            this.flowerR.runAction(
                cc.spawn(
                    repeat
                )
            );
            this.addChild(this.flowerR);
        }
    },
    createSideWalkL: function(X, Y) {
        var moveAction = new cc.moveBy(2.5, cc.p(0, -800));
        var sideWalk = new cc.Sprite("#sideWalk.png");
        var repeat = new cc.RepeatForever(moveAction);
        sideWalk.attr({
            x: X,
            y: Y,
            scale: 8,
            rotation: 0,
            anchorX: 0,
            anchorY: 1
        });
        sideWalk.runAction(
            cc.spawn(
                repeat
            )
        );
        return sideWalk;
    },
    createSideWalkR: function(X, Y) {
        var moveAction = new cc.moveBy(2.5, cc.p(0, -800));
        var sideWalk = new cc.Sprite("#sideWalk.png");
        var repeat = new cc.RepeatForever(moveAction);
        sideWalk.attr({
            x: X,
            y: Y,
            scale: 8,
            rotation: 0,
            anchorX: 0,
            anchorY: 1
        });
        sideWalk.setScaleX(-8);
        sideWalk.runAction(
            cc.spawn(
                repeat
            )
        );
        return sideWalk;
    },
    createTruck: function() {
        var RNDM = Math.floor((Math.random() * 3) + 1);
        do {
            RNDM = Math.floor((Math.random() * 3) + 1);
        } while (this.rndm === RNDM);
        this.rndm = RNDM;
        var size = cc.winSize;
        var contentSize = null;
        var body = null;
        var shape = null;

        switch (this.rndm) {
            case 1:
                this.bus01 = new cc.PhysicsSprite("#RedBus01.png");
                this.bus01.attr({
                    scale: 8,
                    anchorX: 0.5,
                    anchorY: 0
                });
                this.bus01.runAction(this.bus01Action);

                contentSize = this.bus01.getContentSize();
                body = new cp.Body(1, cp.momentForBox(1, contentSize.width, contentSize.height));
                body.p = cc.p(size.width / 3.5, size.height);
                body.applyImpulse(cp.v(0, -700), cp.v(0, 0)); //run speed
                this.space.addBody(body);
                shape = new cp.BoxShape(body, contentSize.width, contentSize.height);
                shape.setCollisionType(2);
                shape.setSensor(true);
                this.space.addShape(shape);
                this.bus01.setBody(body);
                this.bus01.setTag(2);

                this.addChild(this.bus01, 0);
                break;
            case 2:
                this.bus02 = new cc.PhysicsSprite("#BlueBus01.png");
                this.bus02.attr({
                    scale: 8,
                    anchorX: 0.5,
                    anchorY: 0
                });
                this.bus02.runAction(this.bus02Action);

                contentSize = this.bus02.getContentSize();
                body = new cp.Body(1, cp.momentForBox(1, contentSize.width, contentSize.height));
                body.p = cc.p(size.width / 2, size.height);
                body.applyImpulse(cp.v(0, -700), cp.v(0, 0)); //run speed
                this.space.addBody(body);
                shape = new cp.BoxShape(body, contentSize.width, contentSize.height);
                shape.setCollisionType(2);
                shape.setSensor(true);
                this.space.addShape(shape);
                this.bus02.setBody(body);
                this.bus02.setTag(2);

                this.addChild(this.bus02, 0);
                break;
            case 3:
                this.bus03 = new cc.PhysicsSprite("#GreenBus01.png");
                this.bus03.attr({
                    scale: 8,
                    anchorX: 0.5,
                    anchorY: 0
                });
                this.bus03.runAction(this.bus03Action);

                contentSize = this.bus03.getContentSize();
                body = new cp.Body(1, cp.momentForBox(1, contentSize.width, contentSize.height));
                body.p = cc.p(size.width / 1.4, size.height);
                body.applyImpulse(cp.v(0, -700), cp.v(0, 0)); //run speed
                this.space.addBody(body);
                shape = new cp.BoxShape(body, contentSize.width, contentSize.height);
                shape.setCollisionType(2);
                shape.setSensor(true);
                this.space.addShape(shape);
                this.bus03.setBody(body);
                this.bus03.setTag(2);

                this.addChild(this.bus03, 0);
                break;
        }
    },
    createSideWalk: function() {
        var size = cc.winSize;
        var i = 0;
        var allChildrenL = null;
        var allChildrenR = null;
        if (this.time) {
            //this.sideWalkL2.removeAllChildrenWithCleanup();
            //this.sideWalkR2.removeAllChildrenWithCleanup();
            allChildrenL = this.sideWalkL2.getChildren();
            allChildrenR = this.sideWalkR2.getChildren();
            for (i = 0; i < allChildrenL.length; i++) {
                allChildrenL[i].setPosition(0, size.height - ((i - 5) * 380));
                allChildrenR[i].setPosition(size.width, size.height - ((i - 5) * 380));
            }
            /*for (i = 5 - 1; i >= 0; i--) {
                this.sideWalkL2.addChild(this.createSideWalkL(0, size.height - ((i - 5) * 380)));
                this.sideWalkR2.addChild(this.createSideWalkR(size.width, size.height - ((i - 5) * 380)));
            }*/
        } else {
            allChildrenL = this.sideWalkL1.getChildren();
            allChildrenR = this.sideWalkR1.getChildren();
            for (i = 0; i < allChildrenL.length; i++) {
                allChildrenL[i].setPosition(0, size.height - ((i - 5) * 380));
                allChildrenR[i].setPosition(size.width, size.height - ((i - 5) * 380));
            }
        }
        this.flowerNode = new cc.Node();
        this.addChild(this.flowerNode);
        for (i = 10 - 1; i >= 0; i--) {
            //this.flowersL1.addChild(this.createFlower(size.width / 14, size.height + ((i - 5) * 380)));
        }
        this.time = !this.time;

    }
});

var gameScene = cc.Scene.extend({
    onEnter: function() {
        this._super();
        var layer = new gameLayer();
        this.addChild(layer);
    }
});