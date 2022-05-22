/***
 * author:cummins
 * version:1.0.0
 * 😳🤗🤔😅🥰🥵🤨🧐🥥🍉
 * windows和linux系统都可以用 只要你有node
 * 
 * 看看就行了 代码是要重构的 目测3天后重构完成 暂时先用最初版的 也就是这个版本🥰
 * 不支持青龙面板任务 要玩下个node玩去 想后台运行强烈推荐使用pm2任务管理器🥰
 * 暂时只支持pushplus推送 后续版本会上线企业微信推送 关于问什么要上线企业微信推送 应为企业微信推送听着就有逼格🥰🥵
 * 
 * 使用方法🤔:
 * 首先新建一个文件夹 然后把main.js和package.json放在新建文件夹里
 * 然后打开终端 cd到main.js文件夹目录下执行 npm i 这个命令
 * 安装好包之后 node main.js就能愉快玩耍了🥰🥰🥰
 * 当然关了终端就结束程序了 想后台运行参考pm2使用方法
 * 
 * mytoken填写你pushplus的token 字符串类型变量 单双引号都可以🥰
 * mycookie填写你的快手cookie 字符串类型变量 单双引号都可以
 * 这里的快手cookie我用的是电脑端网页版cookie 不知道手机cookie能不能用🤗🤗🤗🍉
 * 有问题 bug 或好的想法和建议可以随时@我🥰🥰🥰🥵
 * 
 * 当然快手可能会无规则抽疯 也就是程序莫名其妙停止 这个暂时没找到解决方法😅
 */


const fetch = require('node-fetch');

const mytoken = '';
const mycookie = ''

// pushplus配置: 
const pushplusurl = 'http://www.pushplus.plus/send';

const body = {
    "token": mytoken,
    "title": ``,
    "content": ``
}
const pushplusopts = {
    method: 'POST',
    headers: {
        "Content-Type": "application/json"
    },
    body: ``
}

// 快手配置: 
const url = 'https://www.kuaishou.com/graphql';
// 用户信息POST配置
const useropts = {
    method: 'POST',
    headers: {
        "cookie": mycookie,
        "content-type": "application/json"
    },
    body: JSON.stringify({
        "operationName": "visionProfile",
        "variables": {
            "userId": "3x2636q42sw7cc4"
        },
        "query": "query visionProfile($userId: String) {\n  visionProfile(userId: $userId) {\n    result\n    hostName\n    userProfile {\n      ownerCount {\n        fan\n        photo\n        follow\n        photo_public\n        __typename\n      }\n      profile {\n        gender\n        user_name\n        user_id\n        headurl\n        user_text\n        user_profile_bg_url\n        __typename\n      }\n      isFollowing\n      __typename\n    }\n    __typename\n  }\n}\n"
    })
}

// 粉丝POST请求配置
const fansopts = {
    method: 'POST',
    headers: {
        "cookie": mycookie,
        "content-type": "application/json"
    },
    body: JSON.stringify({
        "operationName": "visionProfileUserList",
        "variables": {
            "ftype": 2
        },
        "query": "query visionProfileUserList($pcursor: String, $ftype: Int) {\n  visionProfileUserList(pcursor: $pcursor, ftype: $ftype) {\n    result\n    fols {\n      user_name\n      headurl\n      user_text\n      isFollowing\n      user_id\n      __typename\n    }\n    hostName\n    pcursor\n    __typename\n  }\n}\n"
    })
}

// 初始化配置
let flage = true;
// 旧数组
let fansArr = [];

// main
const fanschange = async () => {
    try {
        // 获取粉丝
        const data = await fetch(url, fansopts)
        // 这里要把获取来的data转换成json格式 而且要加await 如果不转或不加await直接打印输出会显示:Promise { <pending> }
        const _data = await data.json();
        // 粉丝数组
        const newfansArr = _data.data.visionProfileUserList.fols;
        // 数组长度
        const newArrlength = newfansArr.length;

        // 初始化
        if (flage) {
            flage = false;
            let msg = '';
            // 个人信息 仅初始化使用
            const userdata_ = await fetch(url, useropts);
            const userdata = await userdata_.json();
            console.log('-----------------');
            // 用户名
            const username = userdata.data.visionProfile.userProfile.profile.user_name;
            // 个人简介
            const user_text = userdata.data.visionProfile.userProfile.profile.user_text;
            // 关注数
            const follow = userdata.data.visionProfile.userProfile.ownerCount.follow;
            // 消息模板
            console.log('初始化用户');
            msg += `登录成功!✅\n`
            msg += `用户名: ${username}\n`
            msg += `个人简介: ${user_text}\n`
            msg += `共关注了${follow}人\n`
            msg += `共${newArrlength}个粉丝🍉\n`
            msg += `所有粉丝详情:\n\n`
            // 遍历粉丝 仅初始化使用
            newfansArr.forEach(e => {
                msg += `用户名: ${e.user_name}\n`
                msg += `简介: ${e.user_text}\n\n`
            })
            body.title = '初始化用户'
            body.content = `${msg}`;
            console.log(123);
            // fansArr = _data.data.visionProfileUserList.fols;
            fansArr = newfansArr;
            // 重新赋值body
            console.log(msg);
            pushplusopts.body = JSON.stringify(body)
            return fetch(pushplusurl, pushplusopts)
        }
        // 增减粉
        // nwe.inclues(fansArr);
        // fansArr.inclues(new);

        // 旧粉丝

        const fansArrlength = fansArr.length;

        let msg = ``;
        // 增
        const increase = [];
        // 背叛
        const reduce = [];
        // 新
        const newfansArr_ = newfansArr.map(e => e.user_name)
        // 原
        const fansArr_ = fansArr.map(e => e.user_name)
        // increase
        newfansArr.forEach((e, index) => {
            const flg = fansArr_.includes(newfansArr[index].user_name)
            if (!flg) {
                increase.push(e);
            }
        })
        // reduce
        fansArr.forEach((e, index) => {
            const flg = newfansArr_.includes(fansArr[index].user_name)
            if (!flg) {
                reduce.push(e)
            }
        })
        const infans = increase.length;
        const refans = reduce.length;
        if (infans > refans) {
            body.title = `涨粉啦🔥🔥🔥`
            msg += `关注用户信息: \n`
            increase.forEach(e => {
                msg += `用户名: ${e.user_name}\n`;
                msg += `个人简介: ${e.user_text}\n\n`;
            })
            if (refans) {
                msg += `虽然涨粉了🥰但是又掉了几个😅\n`;
                msg += `取关人信息: \n`;
                reduce.forEach(e => {
                    msg += `用户名: ${reduce.user_name}\n`;
                    msg += `个人简介: ${reduce.user_text}\n\n`
                })
                msg += `净涨粉${infans - refans}个🥰\n`;
                msg += `净掉粉${refans}个😅\n`
            }
            msg += `🔥🔥🔥涨粉${infans}个!`
            fansArr = newfansArr;
            body.content = msg;
            pushplusopts.body = JSON.stringify(body)
            return fetch(pushplusurl, pushplusopts);
        }

        if (refans > infans) {
            body.title = `掉粉了😅😅😅`
            reduce.forEach(e => {
                msg += `取关用户信息: \n`
                msg += `用户名: ${e.user_name}\n`
                msg += `个人简介: ${e.user_text}\n\n`
            })
            if (infans) {
                msg += `掉粉了😅但是又有人关注了🥰🥰🥰\n`
                msg += `关注粉丝信息: \n`
                increase.forEach(e => {
                    msg += `用户名: ${e.user_name}\n`
                    msg += `个人简介: ${e.user_text}\n\n`
                })
                msg += `净掉粉${refans - infans}个`
                msg += `新增粉丝${infans}个`
            }
            msg += `掉粉${refans}个`
            fansArr = newfansArr;
            body.content = msg;
            pushplusopts.body = JSON.stringify(body);
            return fetch(pushplusurl, pushplusopts)
        }

        if (infans > 0 && refans > 0) {
            body.title = `涨粉了🥰但又没完全涨🤔掉粉了😅但又没完全掉😳`;
            increase.forEach(e => {
                msg += `关注粉丝信息: \n`
                msg += `用户名: ${e.user_name}\n`
                msg += `个人简介: ${e.user_text}\n\n`
            })
            reduce.forEach(e => {
                msg += `取关用户个人信息: \n`
                msg += `用户名: ${e.user_name}\n`
                msg += `个人简介: ${e.user_text}\n\n`
            })
            msg += `涨粉: ${infans}\n`;
            msg += `掉粉: ${refans}\n`;
            msg += `涨粉了🥰但又没完全涨🤔掉粉了😅但又没完全掉😳`
        }
        fansArr = newfansArr;
        body.content = msg;
        pushplusopts.body = JSON.stringify(body);
        return fetch(pushplusurl, pushplusopts);
    } catch (error) {
        console.log(error);
    }

}
setInterval(fanschange, 15000);