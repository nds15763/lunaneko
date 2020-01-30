cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad () {
        
    },

    start () {

    },

    onClick(){
        cc.director.loadScene('play_scene');
    },
});
window.G = {
    score: 0,
};

