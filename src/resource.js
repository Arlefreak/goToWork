var res = {
    HelloWorld_png : "res/HelloWorld.png",
    CloseNormal_png : "res/CloseNormal.png",
    CloseSelected_png : "res/CloseSelected.png",
    spriteSheet_png : "res/sprites.png",
    spriteSheet_plist : "res/sprites.plist",
    title_png : "res/title.png",
    gameOver_png : "res/gameover.png",

};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}