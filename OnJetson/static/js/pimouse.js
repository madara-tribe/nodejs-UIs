$(function() {
    var socket = io.connect();
    socket.on("s2c_LS_DATA",      function(data){AppendLsLog(data.value)});

    $("form").submit(function(e){
        console.log("submit");
        var message = $("#msgForm").val();
        $("#msgForm").val('');
        socket.emit("client_to_server", {value : message});
        e.preventDefault();
    });
 
    $("button#ledOn").on('click', function() {
        console.log("LED ON");
        socket.emit("c2s_LED_ON", null);
    });
 
    $("button#ledOff").on('click', function() {
        console.log("LED OFF");
        socket.emit("c2s_LED_OFF", null);
    });

    $("button#lightSensorSingle").on('click', function() {
        socket.emit("c2s_LS_SINGLE", null);
    });
 
    $("button#lightSensorSeqBegin").on('click', function() {
        socket.emit("c2s_LS_SEQ_BEGIN", null);
    });
 
    $("button#lightSensorSeqEnd").on('click', function() {
        socket.emit("c2s_LS_SEQ_END", null);
    });
});

function AppendLsLog(text) {
    console.log(text);
    $("#lightSensorLogs").append("<p>" + text + "</p>");
}

