$(function () {

  var canvas = new fabric.Canvas('canvas');
  canvas.isDrawingMode = true;
  canvas.freeDrawingBrush.color = "#ed514e";
  canvas.freeDrawingBrush.width = 3;

  $("#draw").css("background-color", "#c7c5c7");  //起動時に描画モードの背景を変える
  $(".red").css("border-width", "2px");           //起動時にペンの色の赤の枠線を変える

  var group;
  var data;
  var link;
  var strokeStyle = "#ed514e";
  var bookmark_tmpList = $("#bookmark_tmpList");
  var normal_tmpList = $("#normal_tmpList");
  var prefix = "12345678";
  var canvas_save = document.getElementById('canvas');
  var downloadLink = document.getElementById('download_link');
  var filename = 'download.png';

  var doc = new jsPDF();
  doc.text("This is some normal sized text underneath.", 20, 80);

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
        // oImg.set({
        //   selectable: false    // 選択させない
        // });
        canvas.clear();
        canvas.add(oImg).renderAll();
      });
    };
    reader.readAsDataURL(file);
  });

  function applyFilter(index, filter) {
    var obj = canvas.getActiveObject();
    obj.filters[index] = filter;
    obj.applyFilters(canvas.renderAll.bind(canvas));
  }
  var f = fabric.Image.filters;
  document.getElementById('contrast').onchange = function () {
    applyFilter(0, new f.Contrast({
      contrast: parseInt(document.getElementById('contrast').value, 10)
    }));
  };

  //選択モード
  document.getElementById('select').addEventListener("click", function () {
    canvas.isDrawingMode = false
  }, false);

  //描画モード
  document.getElementById('draw').addEventListener("click", function () {
    canvas.isDrawingMode = true
  }, false);

  //テキストボックス
  document.getElementById('textbox').addEventListener("click", function () {
    canvas.isDrawingMode = false;
    $(".btn-box").css("background-color", "");
    $("#select").css("background-color", "#c7c5c7");
    canvas.add(new fabric.IText('クリックして編集', {
      left: 0,
      top: 0,
      fontFamily: 'MS Gothic',
      fill: strokeStyle,
      fontSize: 20
    }, false));
  });

  //円
  document.getElementById('circle').addEventListener("click", function () {
    canvas.isDrawingMode = false;
    $(".btn-box").css("background-color", "");
    $("#select").css("background-color", "#c7c5c7");
    canvas.add(new fabric.Circle({
      left: 0,
      top: 0,
      stroke: strokeStyle,
      strokeWidth: 2,
      radius: 50,
      fill: 'rgba(0,0,0,0)'
    }, false));
  });

  //直線
  document.getElementById('line').addEventListener("click", function () {
    canvas.isDrawingMode = false;
    $(".btn-box").css("background-color", "");
    $("#select").css("background-color", "#c7c5c7");
    canvas.add(new fabric.Line([50, 100, 150, 200], {
      left: 0,
      top: 0,
      strokeWidth: 2,
      stroke: strokeStyle
    }, false));
  });

  //ハイパーリンク
  document.getElementById('hyper_link').addEventListener("click", function () {
    canvas.isDrawingMode = false;
    $(".btn-box").css("background-color", "");
    $("#select").css("background-color", "#c7c5c7");
    canvas.add(new fabric.IText('クリックして編集', {
      left: 0,
      top: 0,
      fontFamily: 'MS Gothic',
      fill: strokeStyle,
      fontSize: 20
    }, false));
  });

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
    NormalloadTmpList();

    canvas.requestRenderAll();
  }, false);

  //履歴表示
  var NormalloadTmpList = function () {
    normal_tmpList.get(0).innerHTML = "";
    var timer = null;
    if (window.localStorage) {
      for (var i = 1; i <= 100; i++) {
        data = window.localStorage.getItem(prefix + "tmpData" + i);
        if (data) {
          var image = new Image();
          image.src = data;
          image.index = i;
          image.onload = function () {
            this.width = 71;//85
            this.height = 46;//60
            this.className = "tmpImage";
            normal_tmpList.get(0).prepend(this);
          };
          //履歴を1秒以上クリックした時に削除
          // image.onclick = function () {
          //   var img = this;
          //   timer = setTimeout(function () {
          //     if (confirm("削除しますか？")) {
          //       window.localStorage.removeItem(prefix + "tmpData" + img.index);
          //       for (var i = (img.index + 1); i <= 100; i++) {
          //         data = window.localStorage.getItem(prefix + "tmpData" + i);
          //         window.localStorage.removeItem(prefix + "tmpData" + i);
          //         if (!data) {
          //           break;
          //         }
          //         window.localStorage.setItem(prefix + "tmpData" + (i - 1), data);
          //       }
          //       NormalloadTmpList();
          //     }
          //   }, 2000);
          // }
          $("#normal_viewpane; img").click(function () {
            $("normal_tmpList", this).css("border-width", "1px");
          });
          //履歴をクリックした時キャンバスに描画
          image.ondblclick = function () {
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
  NormalloadTmpList();

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
      NormalloadTmpList();
    }
  }, false);

  //キャンバスクリア
  document.getElementById('canvas_dlt').addEventListener("click", function () {
    canvas.clear();
  }, false);

  //キャンバス全体を保存
  document.getElementById('canvas_save').addEventListener('click', function () {
    var dataURI = canvas.toDataURL("image/jpeg");
    var pdf = new jsPDF();
    var width = pdf.internal.pageSize.width;
    pdf.addImage(dataURI, 'JPEG', 0, 0, width, 0);
    pdf.rotate(90 / 180);
    pdf.save('test.pdf')
  });

  //ペンの色・枠線変更
  $(".setColor").click(function () {
    canvas.freeDrawingBrush.color = $(this).css('background-color');
    strokeStyle = $(this).css('background-color');
    $(".setColor").css("border-width", "");
    $(this).css("border-width", "2px");
    canvas.isDrawingMode = true;
    $(".btn-box").css("background-color", "");
    $("#draw").css("background-color", "#c7c5c7");
  });

  //選択・描画ボタンの背景色変更
  $(".btn-box").click(function () {
    $(".btn-box").css("background-color", "");
    $(this).css("background-color", "#c7c5c7");
  });

  //tmpListのスクロール化
  document.getElementById('myElement'), {
    autoHide: false
  };
});
