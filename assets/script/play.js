cc.Class({
    extends: cc.Component,

    properties: {
        feibiao: cc.Node,
        cat:cc.Node,
        ground:cc.Node,
        //飞行用背景
        bgPrefab: cc.Prefab,
        bgArea: cc.Node,
        score:cc.Label,
    },

    onLoad() {
        cc.director.getPhysicsManager().enabled = true
        cc.director.getPhysicsManager().gravity = cc.v2(0, -9.8*40);
        this.startPos = new cc.Vec2(0, 0)
        this.endPos = new cc.Vec2(0, 0)
        //x为屏幕移动速度，需要递减
        this.speedx = -1200
        //最后成绩
        this.point = 0
        //是否已经投掷
        this.start = 0

        this.posArr = []

        this.fbRigidbody = this.feibiao.getComponent(cc.RigidBody)

        this.bgInit()
        this.feibiaoInit()
    },

    update(dt) {
        if (this.start) {
            //因为有衰减，所以实时更新x轴速度
            this.speedx -= 0.001*this.speedx
            
            this.ground.x += this.speedx * dt
            this.cat.x += this.speedx * dt
            for (let bgNode of this.bgArr) {
                bgNode.x += this.speedx * dt
                if (bgNode.x < -cc.winSize.width) {
                    this.updateScore()
                    bgNode.x = this.getLastPos() + cc.winSize.width
                }
            }
        }
        if (this.feibiao.y < -cc.winSize.height / 2) {
            this.toGround()
        }
        if (this.feibiao.y > cc.winSize.height / 2) {
            this.toGround()
        }
    },

    updateScore(){
        this.point += 1
        this.score.string = this.point
    },

    getLastPos() {
        let posX = 0
        for (let bgNode of this.bgArr) {
            if (bgNode.x > posX) {
                posX = bgNode.x - 30 //我也不知道为什么要减20，但是减去20以后没有缝隙
            }
        }
        return posX
    },

    feibiaoInit() {
        this.feibiao.zIndex = 2
        this.cat.zIndex = 1

        //先给一个初始的力，设置重力并让他滚到猫的脚边
        //拖动的时候只记录点，然后设置动画让猫把球踢走或者打走
        this.scheduleOnce(function() {
            //设置线速度衰减
            this.fbRigidbody.linearDamping = 0
            this.fbRigidbody.linearVelocity = cc.v2(0,0)
            //把角速度设置为0--------------------------------------防止强制停止之后还旋转
            this.fbRigidbody.angularVelocity = 0
            //取消重力
            cc.director.getPhysicsManager().gravity = cc.v2(0, 0);
        }, 2);

        this.feibiao.once(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.feibiao.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);
    },

    //初始化背景
    bgInit() {
        this.cat.zIndex = 2
        this.lastbgPos = 0
        this.bgArr = []
        for (let i = 0; i < 100; i++) {
            let bgNode = cc.instantiate(this.bgPrefab)
            bgNode.y = this.node.y
            bgNode.x = this.lastbgPos
            bgNode.zIndex = 0
            //bgNode.opacity = 100
            this.bgArea.addChild(bgNode)
            this.bgArr.push(bgNode)
            this.lastbgPos += cc.winSize.width
        }
    },

    //飞镖点击事件
    touchStart(event) {
        var pos = new cc.Vec2(event.getLocationX(), event.getLocationY());
        //转换为UI坐标
        this.startPos = this.node.convertToNodeSpaceAR(pos);
        console.log('touchStart',this.startPos)
    },

    //飞镖点击事件
    touchMove(event) {
        let pos = new cc.Vec2(event.getLocationX(), event.getLocationY());
        //转换为UI坐标
        pos = this.node.convertToNodeSpaceAR(pos);
        //给要移动的物体赋值
        //this.feibiao.position = pos
        console.log('touchMove', pos)
        this.endPos = pos

        this.callback = function () {
            this.unschedule(this.callback);
            this.hashya()
        }
        this.scheduleOnce(this.callback,1)
    },

    //发射
    hashya() {

        //可以通过计算改变speed-----------------------------------------
        let speed = this.speed
        //-------------------------------------------------------------
        this.start = 1

        console.log('发射')
        //可以做一下判断，速度不够的话给一个掉到地上的动画
        if (speed < 1200) {
            console.log('掉到地面')
        }

        //差一个锚点的问题，所以不得不在y轴+220的像素点
        //半个屏幕360,地毯140,360-140=220
    
        //只施加一个y轴的力
        let Y = Math.abs(this.endPos.y - this.startPos.y)
        let X = Math.abs(this.endPos.x - this.startPos.x)
        console.log('x：',X)
        console.log('y：',Y)
        this.speedx = X*-4
        this.fbRigidbody.applyForceToCenter(cc.v2(0, Y*100));
    },

    toGround() {
        console.log('游戏结束')
        //不重新设置重力的话在点restart的时候会有bug
        G.score = this.point
        this.schedule(function() {
            //cc.director.resume()
            cc.director.loadScene('ad_scene')
        }, 2);
        //cc.director.pause()
    },

    //碰撞假人
    toJiaRen() {

    },

});