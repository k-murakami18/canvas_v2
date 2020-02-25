$(function () {
  var canvas = new fabric.Canvas('canvas');

  canvas.isDrawingMode = true;
  canvas.freeDrawingBrush.color = "blue";
  canvas.freeDrawingBrush.width = 3;

  var group;
  var data;
  var tmpList = $("#tmpList");
  var prefix = "12345678";
  $("#draw").css("background-color", "#c7c5c7");

  document.getElementById('file').addEventListener("change", function (e) {
    var file = e.target.files[0];
    var reader = new FileReader();
    reader.onload = function (f) {
      //var ctx = canvas.get(0).getContext("2d");
      //ctx.clearRect(0, 0, 800, 600);
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
        canvas.add(oImg).renderAll();
      });
    };
    reader.readAsDataURL(file);
  });

  //ボタンをクリックしたら背景色変更//
  $(".btn-box").click(function () {
    $(".btn-box").css("background-color", "");
    $(this).css("background-color", "#c7c5c7");
  });

  document.getElementById('select').addEventListener("click", function () {
    canvas.isDrawingMode = false
  }, false);

  document.getElementById('draw').addEventListener("click", function () {
    canvas.isDrawingMode = true
  }, false);

  document.getElementById('toSVG').addEventListener("click", function () {
    //グループ化
    group = canvas.getActiveObject().toGroup();
    //保存
    data = group.toDataURL();
    //グループ化解除
    canvas.getActiveObject().toActiveSelection();

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

  document.getElementById('deleteBtn').addEventListener("click", function deleteBtn() {
    //選択されているオブジェクトを削除する
    if (canvas.getActiveObjects() != null) {
      canvas.getActiveObjects().forEach(obj => {
        //対象オブジェクトを削除
        canvas.remove(obj);
        //矩形のIDとcanvas.item紐づけ用配列も削除する。
        let arrIndex = arrayRect.indexOf(obj.id);
        arrayRect.splice(arrIndex, 1);
      });
    }
  }, false);

  document.getElementById('historyDlt').addEventListener("click", function deleteBtn() {
    window.localStorage.clear();
  }, false);

  //履歴表示
  var loadTmpList = function () {
    tmpList.get(0).innerHTML = "";
    var timer = null;
    if (window.localStorage) {
      for (var i = 1; i <= 100; i++) {
        var data = window.localStorage.getItem(prefix + "tmpData" + i);
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
          image.onmousedown = function () {
            var img = this;
            timer = setTimeout(function () {
              if (confirm("削除しますか？")) {
                window.localStorage.removeItem(prefix + "tmpData" + img.index);
                for (var i = (img.index + 1); i <= 100; i++) {
                  var data = window.localStorage.getItem(prefix + "tmpData" + i);
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
          image.onmouseup = function () {
            clearTimeout(timer);
            var ctx = canvas.getContext('2d');
            ctx.drawImage(this, 0, 0);
          }
        }
      }
    }
  }
  loadTmpList();

  document.getElementById('loadSVG').addEventListener("click", function loadSVG() {
    fabric.loadSVGFromString(data, function (objects, options) {
      var obj = fabric.util.groupSVGElements(objects, options);
      canvas.add(obj).renderAll();
    });
  }, false);

  //tmpListのスクロール化
  document.getElementById('myElement'), {
    autoHide: false
  };

});
