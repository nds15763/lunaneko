cc.Class({
    extends: cc.Component,

    properties: {
        feibiao: cc.Node,
        cat:cc.Node,
        // caorenPrefab: cc.Prefab,
        // caorenArea: cc.Node,
        //飞行用背景
        bgPrefab: cc.Prefab,
        bgArea: cc.Node,
    },

    onLoad() {
        cc.director.getPhysicsManager().enabled = true
        this.startPos = new cc.Vec2(0, 0)
        this.endPos = new cc.Vec2(0, 0)
        //y为飞镖上下移动速度
        this.speedy = -1200
        //x为屏幕移动速度，需要递减
        this.speedx = -1200
        //最后成绩
        this.score = 0
        //是否已经投掷
        this.start = 0

        this.bgInit()
        this.feibiaoInit()
    },

    update(dt) {
        if (this.start) {

            this.cat.x += this.speedx * dt
            for (let bgNode of this.bgArr) {
                bgNode.x += this.speedx * dt
                if (bgNode.x < -cc.winSize.width) {
                    bgNode.x = this.getLastPos() + cc.winSize.width
                }
            }
        }
        if (this.feibiao.y < -cc.winSize.height / 2) {
            this.toGround()
        }
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
        let rigidbody = this.feibiao.getComponent(cc.RigidBody)

        this.feibiao.once(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.feibiao.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);
        //this.feibiao.once(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
    },

    //初始化背景
    bgInit() {
        this.cat.zIndex = 2
        this.lastbgPos = 0
        this.bgArr = []
        for (let i = 0; i < 3; i++) {
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

        console.log('startPos', this.startPos)
    },

    //飞镖点击事件
    touchMove(event) {
        let pos = new cc.Vec2(event.getLocationX(), event.getLocationY());
        //转换为UI坐标
        pos = this.node.convertToNodeSpaceAR(pos);
        //给要移动的物体赋值
        this.feibiao.position = pos
        console.log('touchMove', this.feibiao.position)
        if(pos.x >= -50){
            this.endPos = pos

            this.hashya()
        }

    },

    // //飞镖点击事件
    // touchEnd(event) {
        
    //     this.hashya()
    // },

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



        let rigidbody = this.feibiao.getComponent(cc.RigidBody)
        rigidbody.applyForceToCenter(cc.v2(0, (this.endPos.y+200)*100));
    },

    //碰撞天空和地面
    toSky() {
        //扔过头的动画
    },

    toGround() {
        //碰触地面的动画可以和发射时判断的初速度联合起来做一个动画
        console.log('游戏结束')
    },

    //碰撞假人
    toJiaRen() {

    },

    //计算分数
    getScore() {

    },

});
