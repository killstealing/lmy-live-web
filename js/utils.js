function addCookie(name, value, days, path) {
    /**添加设置cookie**/
    var name = escape(name);
    var value = escape(value);
    var expires = new Date();
    expires.setTime(expires.getTime() + days * 3600000 * 24);
    //path=/，表示cookie能在整个网站下使用
    path = path == "" ? "" : ";path=" + path;
    //GMT(Greenwich Mean Time)是格林尼治平时，现在的标准时间，协调世界时是UTC
    //参数days只能是数字型
    var _expires = (typeof days) == "string" ? "" : ";expires=" + expires.toUTCString();
    document.cookie = name + "=" + value + _expires + path;
}

function hasCookie(name) {
    return document.cookie.indexOf(name) > 0;
}

function deleteCookie(name, path) {
    /**根据cookie的键，删除cookie，其实就是设置其失效**/
    var name = escape(name);
    var expires = new Date(0);
    path = path == "" ? "" : ";path=" + path;
    document.cookie = name + "=" + ";expires=" + expires.toUTCString() + path;
}

function logout() {
    deleteCookie("ztscrip", "/");
    window.location.href = '../common/admin_login.html';
}

const axiosReq = axios.create({
    timeout: 5000, // 请求超时时间
    withCredentials: true,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
})

function httpPost(url, params) {
    let result = axiosReq.post(url,params).then(function(response){
        return response.data;
    },function(error) {
        //定义一个统一的错误对象返回
        var errorObj = new Object();
        errorObj.code=500;
        errorObj.msg = '亲，系统出小差了';
        return errorObj;
    })
    return result;
}





function getQueryStr(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}

function isSuccess(resp) {
    return resp != "error" && resp.code == 200;
}

