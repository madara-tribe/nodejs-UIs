var http     = require('http');
var socketio = require('socket.io');
var path     = require('path');
var fs       = require('fs');
var mime     = {
    ".html": "text/html",
    ".js"  : "application/javascript",
    ".css" : "text/css",
    // 読み取りたいMIMEタイプはここに追記
};

var server = http.createServer(function(req, res) {
    if (req.url == '/') {
        filePath = '/pimouse.html';         // 仮
    } else {
        filePath = req.url;
    }

    var fullPath = __dirname + filePath;
    console.log('fullPath : ' + fullPath);

    res.writeHead(200, {"Content-Type": mime[path.extname(fullPath)] || "text/plain"});
    fs.readFile(fullPath, function(err, data) {
        if (err) {
            // エラー時の応答
        } else {
            res.end(data, 'UTF-8');
        }
    });
}).listen(3000);
console.log('Server running at http://localhost:3000/');
 

var io = socketio.listen(server);
io.sockets.on('connection', function(socket) {
    // タイマー変数の初期化
    var timer_lt = {
        id : null,
        is_on : 0,
    }

    socket.on('client_to_server', function(data) {
        io.sockets.emit('server_to_client', {value : data.value});
    });

    socket.on('c2s_LED_ON', function(data) {
        OnLed();
    });
 
    socket.on('c2s_LED_OFF', function(data) {
        OffLed();
    });
 
    socket.on('c2s_LS_SINGLE', function(data) {
        SendLtValue();
    });

    socket.on('c2s_LS_SEQ_BEGIN', function(data) {
        if (timer_lt.is_on == 0) {
            timer_lt.id = setInterval(SendLtValue, 500);
        }
        timer_lt.is_on = 1;
    });
    socket.on('c2s_LS_SEQ_END', function(data) {
        if (timer_lt.is_on == 1) {
            clearInterval(timer_lt.id);
        }
        timer_lt.is_on = 0;
    });
 
    socket.on('disconnect', function() {
        if (timer_lt.is_on == 1) {
            clearInterval(timer_lt.id);
        }
        OffLed();
    });
});


// LED ON
function OnLed() {
    // shell実行（非同期）
    // http://tkybpp.hatenablog.com/entry/2016/04/25/163246
    const exec = require('child_process').exec;
    exec('echo 1 > /dev/rtled1', (err, stdout, stderr) => {
        // if (err) { console.log(err); }
        // console.log(stdout);
    });
    console.log("LED ON");
}

// LED OFF
function OffLed() {
    // shell実行（非同期）
    // http://tkybpp.hatenablog.com/entry/2016/04/25/163246
    const exec = require('child_process').exec;
    exec('echo 0 > /dev/rtled1', (err, stdout, stderr) => {
        // if (err) { console.log(err); }
        // console.log(stdout);
    });
    console.log("LED OFF");
}

// 光センサの値を読み取って返す
function SendLtValue() {
    var ret = {
        value : null,
    };
    // shell実行（同期）
    // http://tkybpp.hatenablog.com/entry/2016/04/25/163246
    const execSync = require('child_process').execSync;
    const result =  execSync('cat /dev/rtlightsensor0').toString();
    console.log(result);
    ret.value = result;
    // console.log(ret.value);
    io.sockets.emit('s2c_LS_DATA', {value : ret.value});
}

