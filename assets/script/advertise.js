cc.Class({
    extends: cc.Component,

    properties: {
        score:cc.Label,
    },

    onLoad () {
        this.score.string = G.score
    },

    start () {

    },

    onClick(){
        G.score = 0
        cc.director.loadScene('play_scene');
    },
});
