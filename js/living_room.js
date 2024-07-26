new Vue({
    el: '#app',
    data: {
        form: {
            review: ""
        },
        chatList: [],
        giftList: [],
        canvas: {},
        player: {},
        parser: {},
        websock: null,
        roomId: -1,
        anchorId: -1,
        isLogin: false,
        wsServer: '',
        initInfo: {},
        imServerConfig: {},
        showGiftRank: false,
        rankList: [],
        accountInfo: {},
        showBankInfo: false,
        lastPayBtnId: -1,
        payProducts: [],
        qrCode: '',
        dlProgress: 10,
        closeLivingRoomDialog: false,
        livingRoomHasCloseDialog: false,
        timer: null
    },

    mounted() {
        this.roomId = getQueryStr("roomId");
        this.anchorConfigUrl();
    },

    beforeDestroy() {
        this.timer = null;
    },

    methods: {
        //直播间初始化配置加载时候调用
        anchorConfigUrl: function () {
            let data = new FormData();
			data.append("roomId",getQueryStr("roomId"));
            var that = this;
            httpPost(anchorConfigUrl, data)
                .then(resp => {
                    if (isSuccess(resp)) {
                        if(resp.data.roomId>0) {
                            that.initInfo = resp.data;
                            that.connectImServer();
                        } else {
                            this.$message.error('直播间已不存在');
                        }
                    }
                });
        },
        

        connectImServer: function() {
            let that = this;
            httpPost(getImConfigUrl, {})
            .then(resp => {
                if (isSuccess(resp)) {
                    that.imServerConfig = resp.data;
                    let url = "ws://"+that.imServerConfig.wsImServerAddress+"/token=" + that.imServerConfig.token+"&userId=45601";
                    console.log(url);
                    that.websock = new WebSocket(url);
                    that.websock.onmessage = that.websocketOnMessage;
                    that.websock.onopen = that.websocketOnOpen;
                    that.websock.onerror = that.websocketOnError;
                    that.websock.onclose = that.websocketClose;
                    console.log('初始化ws服务器');
                }
            });
        },

        websocketOnOpen: function() {
            console.log('初始化连接建立');
        },

        websocketOnError: function() {
            console.error('出现异常');
        },

        websocketOnMessage: function(e) { //数据接收
            let wsData = JSON.parse(e.data);
            if(wsData.code == 1001) {
                this.startHeartBeatJob();
            }
        },

        websocketSend:function (data) {//数据发送
            this.websock.send(data);
        },

        websocketClose: function(e) {  //关闭
            console.log('断开连接', e);
        },

        startHeartBeatJob: function() {
            console.log('首次登录成功');
            let that = this;
            //发送一个心跳包给到服务端
            let jsonStr = {"userId": this.initInfo.userId, "appId": 10001};
            let bodyStr = JSON.stringify(jsonStr);
            let heartBeatJsonStr = {"magic": 19231, "code": 1004, "len": bodyStr.length, "body": bodyStr};
            setInterval(function () {
                that.websocketSend(JSON.stringify(heartBeatJsonStr));
            }, 3000);
        },

        closeLivingRoom: function() {
            let data = new FormData();
			data.append("roomId",getQueryStr("roomId"));
            httpPost(closeLiving, data)
            .then(resp => {
                if (isSuccess(resp)) {
                    window.location.href='./living_room_list.html';
                }
            });
        },

        sendReview: function () {
            if (this.form.review == '') {
                this.$message({
                    message: "评论不能为空",
                    type: 'warning'
                });
                return;
            }
            let sendMsg = {"content": this.form.review, "senderName": this.initInfo.nickname, "senderImg": this.initInfo.avatar};
            let msgWrapper = {"msgType": 1, "msg": sendMsg};
            this.chatList.push(msgWrapper);
            //发送评论消息给到im服务器
            
            this.form.review = '';
            this.$nextTick(() => {
                var div = document.getElementById('talk-content-box')
                div.scrollTop = div.scrollHeight
            })
        
        }

     
    }

});