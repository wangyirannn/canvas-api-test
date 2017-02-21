var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
    //context2D.drawImage(image, 0, 0);//未加载完成，无法显示图片
    var stage = new DisplayObjectContainer();
    setInterval(function () {
        context2D.clearRect(0, 0, canvas.width, canvas.height); //在显示图片之前先清屏，将之前帧的图片去掉,清屏范围最好设置成画布的宽与高
        stage.draw(context2D);
    }, 30); //每30毫秒刷新一次
    //局部渲染：仅渲染整个场景中改变的一部分，但是需要更大的内存空间来计算
    var tf1 = new TextField();
    tf1.text = "THIS IS";
    tf1.x = 80;
    tf1.y = 20;
    tf1.size = 20;
    var tf2 = new TextField();
    tf2.text = "BIGBANG";
    tf2.x = 130;
    tf2.y = 20;
    tf2.size = 20;
    var image = document.createElement("img"); //创建空壳
    image.src = "IMG_0515.JPG"; //指定图片
    var bitmap = new Bitmap();
    bitmap.image = image;
    bitmap.width = 300;
    bitmap.height = 270;
    bitmap.y = 40;
    bitmap.x = 50;
    bitmap.alpha = 0.4;
    image.onload = function () {
        stage.addChild(tf1);
        stage.addChild(tf2);
        stage.addChild(bitmap);
        //stage.removeChild(tf1);
    };
};
var DisplayObject = (function () {
    function DisplayObject() {
        this.matrix = null;
        this.globalMatrix = null;
        this.x = 0;
        this.y = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.rotation = 0;
        this.alpha = 1; //默认相对alpha
        this.globalAlpha = 1; //默认全局alpha                             
        this.parent = null;
        this.matrix = new math.Matrix();
        this.globalMatrix = new math.Matrix();
    }
    DisplayObject.prototype.remove = function () { };
    ;
    DisplayObject.prototype.draw = function (context2D) {
        this.matrix.updateFromDisplayObject(this.x, this.y, this.scaleX, this.scaleY, this.rotation); //初始化矩阵
        //计算全局Alpha值
        if (this.parent) {
            this.globalAlpha = this.parent.globalAlpha * this.alpha;
            this.globalMatrix = math.matrixAppendMatrix(this.matrix, this.parent.globalMatrix);
        }
        else {
            this.globalAlpha = this.alpha;
            this.globalMatrix = this.matrix;
        }
        context2D.globalAlpha = this.globalAlpha;
        /*
        变换
        1.任何一个显示对象需要两个矩阵（全局与相对）
        2.把显示对象的属性转换为自己的相对矩阵
        3.把现实对象的相对矩阵与父对象的全局矩阵相乘，得到显示对象的全局矩阵
        4.对渲染上下文设置显示对象的全局矩阵
        5.根容器的相对矩阵就是全局矩阵
        */
        context2D.setTransform(this.globalMatrix.a, this.globalMatrix.b, this.globalMatrix.c, this.globalMatrix.d, this.globalMatrix.tx, this.globalMatrix.ty);
        this.render(context2D);
    };
    DisplayObject.prototype.render = function (context2D) {
    };
    return DisplayObject;
}());
var TextField = (function (_super) {
    __extends(TextField, _super);
    function TextField() {
        _super.apply(this, arguments);
        this.text = "";
        this.size = 15;
        this.font = "Arial";
        this.color = "";
    }
    TextField.prototype.render = function (context2D) {
        context2D.font = this.size + "px" + " " + this.font;
        context2D.fillText(this.text, this.x, this.y);
        context2D.fillStyle = this.color;
    };
    return TextField;
}(DisplayObject));
var Bitmap = (function (_super) {
    __extends(Bitmap, _super);
    function Bitmap() {
        _super.apply(this, arguments);
    }
    Bitmap.prototype.render = function (context2D) {
        context2D.drawImage(this.image, this.x, this.y, this.width, this.height);
    };
    return Bitmap;
}(DisplayObject));
var DisplayObjectContainer = (function (_super) {
    __extends(DisplayObjectContainer, _super);
    function DisplayObjectContainer() {
        _super.apply(this, arguments);
        this.array = [];
    }
    DisplayObjectContainer.prototype.addChild = function (displayObject) {
        this.removeChild(displayObject);
        this.array.push(displayObject);
        displayObject.parent = this;
    };
    DisplayObjectContainer.prototype.draw = function (context2D) {
        for (var _i = 0, _a = this.array; _i < _a.length; _i++) {
            var drawable = _a[_i];
            drawable.draw(context2D);
        }
    };
    DisplayObjectContainer.prototype.removeChild = function (child) {
        //By 杨帆 ， 先复制出临时数组，遍历数组中子元素，找到与需要删除的名称相同的子元素并删除。
        var tempArrlist = this.array.concat();
        for (var _i = 0, tempArrlist_1 = tempArrlist; _i < tempArrlist_1.length; _i++) {
            var each = tempArrlist_1[_i];
            if (each == child) {
                var index = this.array.indexOf(child);
                tempArrlist.splice(index, 1);
                this.array = tempArrlist;
                child.remove();
                break;
            }
        }
    };
    return DisplayObjectContainer;
}(DisplayObject));
var math;
(function (math) {
    var Point = (function () {
        function Point(x, y) {
            this.x = x;
            this.y = y;
        }
        return Point;
    }());
    math.Point = Point;
    function pointAppendMatrix(point, m) {
        var x = m.a * point.x + m.c * point.y + m.tx;
        var y = m.b * point.x + m.d * point.y + m.ty;
        return new Point(x, y);
    }
    math.pointAppendMatrix = pointAppendMatrix;
    /**
     * 使用伴随矩阵法求逆矩阵
     * http://wenku.baidu.com/view/b0a9fed8ce2f0066f53322a9
     */
    function invertMatrix(m) {
        var a = m.a;
        var b = m.b;
        var c = m.c;
        var d = m.d;
        var tx = m.tx;
        var ty = m.ty;
        var determinant = a * d - b * c;
        var result = new Matrix(1, 0, 0, 1, 0, 0);
        if (determinant == 0) {
            throw new Error("no invert");
        }
        determinant = 1 / determinant;
        var k = result.a = d * determinant;
        b = result.b = -b * determinant;
        c = result.c = -c * determinant;
        d = result.d = a * determinant;
        result.tx = -(k * tx + c * ty);
        result.ty = -(b * tx + d * ty);
        return result;
    }
    math.invertMatrix = invertMatrix;
    function matrixAppendMatrix(m1, m2) {
        var result = new Matrix();
        result.a = m1.a * m2.a + m1.b * m2.c;
        result.b = m1.a * m2.b + m1.b * m2.d;
        result.c = m2.a * m1.c + m2.c * m1.d;
        result.d = m2.b * m1.c + m1.d * m2.d;
        result.tx = m2.a * m1.tx + m2.c * m1.ty + m2.tx;
        result.ty = m2.b * m1.tx + m2.d * m1.ty + m2.ty;
        return result;
    }
    math.matrixAppendMatrix = matrixAppendMatrix;
    var PI = Math.PI;
    var HalfPI = PI / 2;
    var PacPI = PI + HalfPI;
    var TwoPI = PI * 2;
    var DEG_TO_RAD = Math.PI / 180;
    var Matrix = (function () {
        function Matrix(a, b, c, d, tx, ty) {
            if (a === void 0) { a = 1; }
            if (b === void 0) { b = 0; }
            if (c === void 0) { c = 0; }
            if (d === void 0) { d = 1; }
            if (tx === void 0) { tx = 0; }
            if (ty === void 0) { ty = 0; }
            this.a = a;
            this.b = b;
            this.c = c;
            this.d = d;
            this.tx = tx;
            this.ty = ty;
        }
        Matrix.prototype.toString = function () {
            return "(a=" + this.a + ", b=" + this.b + ", c=" + this.c + ", d=" + this.d + ", tx=" + this.tx + ", ty=" + this.ty + ")";
        };
        Matrix.prototype.updateFromDisplayObject = function (x, y, scaleX, scaleY, rotation) {
            this.tx = x;
            this.ty = y;
            var skewX, skewY;
            skewX = skewY = rotation / 180 * Math.PI;
            var u = Math.cos(skewX);
            var v = Math.sin(skewX);
            this.a = Math.cos(skewY) * scaleX;
            this.b = Math.sin(skewY) * scaleX;
            this.c = -v * scaleY;
            this.d = u * scaleY;
        };
        return Matrix;
    }());
    math.Matrix = Matrix;
})(math || (math = {}));
//# sourceMappingURL=main.js.map