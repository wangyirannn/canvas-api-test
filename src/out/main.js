window.onload = function () {
    var canvas = document.getElementById("app");
    var context2D = canvas.getContext("2d");
    /*context2D.setTransform(1, 0, 0, 1, 50, 50);//设置坐标，1,0,0,1表示矩阵
    //1   0   50
    //0   1   50
    //0   0   1   2D中永远是001所以忽略

    //画一个形状（fillrect）
    context2D.fillStyle = "#FF0000";
    context2D.strokeStyle = "#00FF00";

    context2D.moveTo(10, 10);

    context2D.lineTo(150, 50);
    context2D.lineTo(10, 50);

    context2D.rect(0, 0, 100, 100);

    context2D.fill();//填充
    context2D.stroke();//描边

    //写文字
    context2D.fillText("Hello,World", 0, 0);
    context2D.measureText("111").width//测量一行文字的宽


*/
    //处理图片
    var image = document.createElement("img"); //创建空壳
    image.src = "38330591_p0.png"; //指定图片
    context2D.drawImage(image, 0, 0); //未加载完成，无法显示图片
    image.onload = function () {
        var X = -500;
        var tf1 = new TextField();
        tf1.text = "Hello";
        tf1.x = 0;
        var tf2 = new TextField();
        tf2.text = "World";
        tf2.x = 100;
        var bitmap1 = new Bitmap();
        bitmap1.image = image;
        var stage = new DisplayObjectContainer();
        var array = [];
        bitmap1.image = image;
        stage.addChild(bitmap1);
        stage.addChild(tf1);
        stage.addChild(tf2);
        setInterval(function () {
            context2D.clearRect(0, 0, canvas.width, canvas.height); //在显示图片之前先清屏，将之前帧的图片去掉,清屏范围最好设置成画布的宽与高
            for (var _i = 0, array_1 = array; _i < array_1.length; _i++) {
                var drawable = array_1[_i];
                drawable.draw(context2D);
            }
        }, 30); //每30毫秒刷新一次
        //局部渲染：仅渲染整个场景中改变的一部分，但是需要更大的内存空间来计算
    };
    var Stage = (function () {
        function Stage() {
        }
        Stage.prototype.draw = function (context2D) {
        };
        return Stage;
    }());
    var TextField = (function () {
        function TextField() {
            this.x = 0;
            this.text = "";
        }
        TextField.prototype.draw = function (context2D) {
            context2D.fillText(this.text, this.x, 0);
        };
        return TextField;
    }());
    var Bitmap = (function () {
        function Bitmap() {
            this.x = 0;
        }
        Bitmap.prototype.draw = function (context2D) {
            context2D.drawImage(this.image, this.x, 0);
        };
        return Bitmap;
    }());
    var DisplayObjectContainer = (function () {
        function DisplayObjectContainer() {
        }
        DisplayObjectContainer.prototype.addChild = function (context2D) {
            this.array.push(context2D);
        };
        DisplayObjectContainer.prototype.draw = function (context2D) {
            for (var _i = 0, _a = this.array; _i < _a.length; _i++) {
                var drawable = _a[_i];
                drawable.draw(context2D);
            }
        };
        return DisplayObjectContainer;
    }());
};
//# sourceMappingURL=main.js.map