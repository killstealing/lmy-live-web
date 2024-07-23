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
        userId: -1,
        isLogin: false,
        wsServer: '',
        imToken: '',
        initInfo: {},
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
        this.anchorConfigUrl();
    },

    beforeDestroy() {
        this.timer = null;
    },

    methods: {

        anchorConfigUrl: function () {
            let data = new FormData();
			data.append("roomId",getQueryStr("roomId"));
            var that = this;
            httpPost(anchorConfigUrl, data)
                .then(resp => {
                    if (isSuccess(resp)) {
                        if(resp.data.roomId>0) {
                            that.initInfo = resp.data;
                        } else {
                            this.$message.error('直播间已不存在');
                        }
                    }
                });
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
            let msgBodyStr = {"senderId": this.userId, "livingRoomId": this.roomId, "source": 1, "content": this.form.review};
            let msgBody = {"code": 1, "body": JSON.stringify(msgBodyStr)};
            let sendMsgPkg = {"bizCode": 0, "type": 1, "token": this.imToken, "userId": this.userId, "content": msgBody};
            let sendMsgStr = JSON.stringify(sendMsgPkg);
            let sendMsgPkgInfo = {'contentLength': sendMsgStr.length, 'body': sendMsgStr};

            let sendMsg = {"content": this.form.review, "senderName": this.initInfo.nickname, "senderImg": this.initInfo.avatar};
            let msgWrapper = {"msgType": 1, "msg": sendMsg};
            this.chatList.push(msgWrapper);
            this.form.review = '';
            this.$nextTick(() => {
                var div = document.getElementById('talk-content-box')
                div.scrollTop = div.scrollHeight
            })
        },

     
    }

});