var file = null; // 選択ファイルが格納される変数
var blob = null; // 画像(BLOBデータ)が格納される変数
const THUMBNAIL_MAX_WIDTH = 350; // 画像がヨコ長の場合、横サイズがこの値になるように縮小される
const THUMBNAIL_MAX_HEIGHT = 350; // 画像がタテ長の場合、縦サイズがこの値になるように縮小される
var num = null;
var jsons = {
		"left": "",
		"right": ""
}
var RVlength = null;
var RHlength = null;
var LVlength = null;
var LHlength = null;
$(function () {
		$("#test2").click(function () {
				$("#file2").click();
				num = 'L'
		});
		$("#test1").click(function () {
				$("#file1").click();
				num = 'R'
		});
		// ファイルが選択されたら実行される関数
		$('input[type=file]').change(function () {
				// ファイルを取得する
				file = $(this).prop('files')[0];
				// 画像をリサイズする
				var image = new Image();
				var reader = new FileReader();
				reader.onload = function (e) {
						image.onload = function () {
								// 縮小後のサイズを計算する
								var width, height;
								width = THUMBNAIL_MAX_WIDTH;
								height = THUMBNAIL_MAX_WIDTH;
								// 縮小画像を描画するcanvasのサイズを上で算出した値に変更する
								var canvas = $("#canvas" + num).attr('width', width).attr('height', height);
								var ctx = canvas[0].getContext('2d');
								// canvasに既に描画されている画像があればそれを消す
								ctx.clearRect(0, 0, width, height);　　
								// canvasに縮小画像を描画する
								ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, width, height);
								// canvasから画像をbase64として取得する
								var base64 = canvas.get(0).toDataURL('image/jpeg');
								if (num === "R") {
										jsons.right = base64.split('base64,')[1];
								} else {
										jsons.left = base64.split('base64,')[1];
								}
								// base64から画像データを作成する
								var barr, bin, i, len;
								bin = atob(base64.split('base64,')[1]);
								len = bin.length;
								barr = new Uint8Array(len);
								i = 0;
								while (i < len) {
										barr[i] = bin.charCodeAt(i);
										i++;
								}
								blob = new Blob([barr], {
										type: 'image/jpeg'
								});　
						}
						image.src = e.target.result;
				}
				reader.readAsDataURL(file);
		});
		// 解析ボタンがクリックされたら実行される関数
		$("#predict-button").click(function () {
				let html_str = document.getElementById('div_string')
				html_str.innerText = "計測中..."
				console.log(jsons)
				// ajax でアップロード
				$.ajax({
						type: 'POST', // 使用するHTTPメソッド (GET/ POST)
						url: "https://******.ap-northeast-1.amazonaws.com/****", // 通信先のURL
						data: JSON.stringify(jsons),
						contentType: "application/json"
				}).done(function (response, textStatus, jqXHR) {
						// 通信に成功した時に実行される
						console.log("成功:" + jqXHR.status);
						if (response.completed == 1) {
								LHlength = Math.round(response.result_left * 100) / 100;
								RHlength = Math.round(response.result_right * 100) / 100;
								Vlength = Math.round(response.vertical * 100) / 100;
								if (LHlength == null) {
										LHlength = "長さなし"
								} else {
										LHlength = String(LHlength) + "cm"
								};
								if (RHlength == null) {
										RHlength = "長さなし"
								} else {
										RHlength = String(RHlength) + "cm"
								};
								if (Vlength == null) {
										Vlength = "長さなし"
								} else {
										Vlength = String(Vlength) + "cm"
								};
								html_str.innerText = "左 : " + LHlength + "\n右 : " + RHlength + "\n縦 : " + Vlength
						} else if (response.completed == 0) {
								alert('サーバーの内部エラーのため登録が失敗しました。');
						}
						// 通信に失敗した時に実行される
				}).fail(function (jqXHR, textStatus, errorThrown) {
						alert("失敗:" + jqXHR.status);
						console.log("失敗:" + jqXHR.status);
				});
				// 送信失敗
		});
});

function reset() {
		$("#file2")[0].value = "";
		$("#file1")[0].value = "";
		var fs = document.getElementById('file1')
		console.log(fs);
		document.getElementById('div_string').innerText = ' '
		var ctx1 = document.getElementById('canvasR').getContext('2d');
		ctx1.clearRect(0, 0, THUMBNAIL_MAX_WIDTH, THUMBNAIL_MAX_HEIGHT);
		var ctx2 = document.getElementById('canvasL').getContext('2d');
		ctx2.clearRect(0, 0, THUMBNAIL_MAX_WIDTH, THUMBNAIL_MAX_HEIGHT);
		jsons.right = ""
		jsons.left = ""
}
