$(function () {
  var canvas = new fabric.Canvas('canvas');
  canvas.isDrawingMode = true;
  canvas.freeDrawingBrush.color = "red";
  canvas.freeDrawingBrush.width = 3;

  var group;
  var data;
  var tmpList = $("#tmpList");
  var prefix = "12345678";
  var canvas_save = document.getElementById('canvas');
  var downloadLink = document.getElementById('download_link');
  var filename = 'download.png';

  //背景表示
  document.getElementById('file').addEventListener("change", function (e) {
    var file = e.target.files[0];
    var reader = new FileReader();
    reader.onload = function (f) {
      var data = f.target.result;
      fabric.Image.fromURL(data, function (img) {
        var oImg = img.set({ left: 0, top: 0, angle: 00 }).scale(1);
        img.scaleToWidth(canvas.width);
        img.scaleToHeight(canvas.height);
        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
          left: (canvas.width - img.width * img.scaleX) / 2
        });
        oImg.set({
          selectable: false    // 選択させない
        });
        canvas.clear();
        canvas.add(oImg).renderAll();
      });
    };
    reader.readAsDataURL(file);
  });

  //各ボタンの背景色変更//
  $("#draw").css("background-color", "#c7c5c7");
  $(".btn-box").click(function () {
    $(".btn-box").css("background-color", "");
    $(this).css("background-color", "#c7c5c7");
  });

  //選択モード
  document.getElementById('select').addEventListener("click", function () {
    canvas.isDrawingMode = false
    console.log(getActiveObject.width)
  }, false);

  //描画モード
  document.getElementById('draw').addEventListener("click", function () {
    canvas.isDrawingMode = true
  }, false);

  //選択箇所保存
  document.getElementById('draw_save').addEventListener("click", function () {
    group = canvas.getActiveObject()
    data = group.toDataURL();
    //canvas.getActiveObject().toActiveSelection();

    for (var i = 1; i <= 100; i++) {
      if (!window.localStorage.getItem(prefix + "tmpData" + i)) {
        break;
      }
    }
    if (i > 100) {
      alert("一時保存領域が一杯です。");
      return;
    }
    window.localStorage.setItem("12345678tmpData" + i, data);
    loadTmpList();

    canvas.requestRenderAll();
  }, false);

  //履歴表示
  var loadTmpList = function () {
    tmpList.get(0).innerHTML = "";
    var timer = null;
    if (window.localStorage) {
      for (var i = 1; i <= 100; i++) {
        data = window.localStorage.getItem(prefix + "tmpData" + i);
        if (data) {
          var image = new Image();
          image.src = data;
          image.index = i;
          image.onload = function () {
            this.width = 130;
            this.height = 97.5;
            this.className = "tmpImage";
            tmpList.get(0).appendChild(this);
          };
          //履歴を1秒クリックした時選択した履歴を削除
          image.onpointerdown = function () {
            var img = this;
            timer = setTimeout(function () {
              if (confirm("削除しますか？")) {
                window.localStorage.removeItem(prefix + "tmpData" + img.index);
                for (var i = (img.index + 1); i <= 100; i++) {
                  data = window.localStorage.getItem(prefix + "tmpData" + i);
                  window.localStorage.removeItem(prefix + "tmpData" + i);
                  if (!data) {
                    break;
                  }
                  window.localStorage.setItem(prefix + "tmpData" + (i - 1), data);
                }
                loadTmpList();
              }
            }, 1000);
          }
          //履歴をクリックした時キャンバスに描画
          image.onpointerup = function () {
            var img = this.src;
            clearTimeout(timer);
            fabric.Image.fromURL(img, function (oImg) {
              oImg.scale(1);
              canvas.add(oImg);
              i = i + 100;
            });
          }
        }
      }
    }
  }
  loadTmpList();

  //選択箇所削除
  document.getElementById('draw_dlt').addEventListener("click", function deleteBtn() {
    var activeObjects = canvas.getActiveObjects();
    canvas.discardActiveObject()
    if (activeObjects.length) {
      canvas.remove.apply(canvas, activeObjects);
    }
  }, false);

  //履歴削除
  document.getElementById('history_dlt').addEventListener("click", function deleteBtn() {
    if (confirm("保存履歴を削除しますか？")) {
      window.localStorage.clear();
      loadTmpList();
    }
  }, false);

  //キャンバスクリア
  document.getElementById('canvas_dlt').addEventListener("click", function () {
    canvas.clear();
  }, false);

  //キャンバス全体を保存
  document.getElementById('canvas_save').addEventListener('click', function () {
    if (canvas_save.msToBlob) {
      var blob = canvas_save.msToBlob();
      window.navigator.msSaveBlob(blob, filename);
    } else {
      downloadLink.href = canvas_save.toDataURL('image/png');
      downloadLink.download = filename;
      downloadLink.click();
    }
  });

  //色の変更
  document.getElementByClassName('setColor').addEventListener('click', function () {
    canvas.freeDrawingBrush.color = $(this).css('background-color');
    $(".setColor").css("border-width", "");
    $(this).css("border-width", "3px");
  });


  //tmpListのスクロール化
  document.getElementById('myElement'), {
    autoHide: false
  };
});
