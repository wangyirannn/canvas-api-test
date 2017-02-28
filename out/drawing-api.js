var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DisplayObject = (function () {
    function DisplayObject() {
        this.alpha = 1;
        this.globalAlpha = 1;
        this.scaleX = 1;
        this.scaleY = 1;
        this.x = 0;
        this.y = 0;
        this.rotation = 0;
        // hasBeenCalculated = false;
        this.localMatrix = new math.Matrix();
        this.globalMatrix = new math.Matrix();
        this.listeners = [];
        this.width = 1;
        this.height = 1;
    }
    DisplayObject.prototype.draw = function (context2D) {
        this.localMatrix.updateFromDisplayObject(this.x, this.y, this.scaleX, this.scaleY, this.rotation);
        if (this.parent) {
            this.globalAlpha = this.parent.globalAlpha * this.alpha;
            this.globalMatrix = math.matrixAppendMatrix(this.localMatrix, this.parent.globalMatrix);
        }
        if (this.parent == null) {
            this.globalAlpha = this.alpha;
            this.globalMatrix = this.localMatrix;
        }
        context2D.globalAlpha = this.globalAlpha;
        context2D.setTransform(this.globalMatrix.a, this.globalMatrix.b, this.globalMatrix.c, this.globalMatrix.d, this.globalMatrix.tx, this.globalMatrix.ty);
        //context2D.transform(this.globalMatrix.a,this.globalMatrix.b,this.globalMatrix.c,this.globalMatrix.d,this.globalMatrix.tx,this.globalMatrix.ty);
        //console.log(this.globalAlpha);
        this.render(context2D);
    };
    DisplayObject.prototype.addEventListener = function (type, touchFunction, object, ifCapture, priority) {
        var touchEvent = new TouchEvents(type, touchFunction, object, ifCapture, priority);
        this.listeners.push(touchEvent);
    };
    return DisplayObject;
}());
var DisplayObjectContainer = (function (_super) {
    __extends(DisplayObjectContainer, _super);
    function DisplayObjectContainer() {
        _super.apply(this, arguments);
        this.childArray = [];
    }
    DisplayObjectContainer.prototype.addChild = function (child) {
        this.childArray.push(child);
        child.parent = this;
    };
    DisplayObjectContainer.prototype.render = function (context2D) {
        for (var _i = 0, _a = this.childArray; _i < _a.length; _i++) {
            var displayObject = _a[_i];
            displayObject.draw(context2D);
        }
    };
    DisplayObjectContainer.prototype.hitTest = function (x, y) {
        // console.log(x);
        // console.log(y);
        var rect = new math.Rectangle();
        rect.x = rect.y = 0;
        rect.width = this.width;
        rect.height = this.height;
        var result = null;
        if (rect.isPointInRectangle(x, y)) {
            // for(var listener of this.listeners){
            //     if(listener.type == TouchEventService.currentType && listener.capture){
            //         //TouchEventService.getInstance().addPerformer(listener.func());   //捕获
            //         //listener.func();
            //         // TouchEventService.getInstance().addPerformer(this);
            //     }
            // }
            result = this;
            TouchEventService.getInstance().addPerformer(this); //从父到子把相关对象存入数组
            for (var i = this.childArray.length - 1; i >= 0; i--) {
                var child = this.childArray[i];
                var point = new math.Point(x, y);
                var invertChildenLocalMatirx = math.invertMatrix(child.localMatrix);
                var pointBasedOnChild = math.pointAppendMatrix(point, invertChildenLocalMatirx);
                var hitTestResult = child.hitTest(pointBasedOnChild.x, pointBasedOnChild.y);
                //console.log(hitTestResult);
                if (hitTestResult) {
                    result = hitTestResult;
                    break;
                }
            }
            // for(var listener of this.listeners){
            //     if(listener.type == TouchEventService.currentType){
            //         //listener.func();
            //         TouchEventService.getInstance().addPerformer(this);
            //     }
            // }
            //TouchEventService.getInstance().addPerformer(this);
            return result;
        }
        return null;
    };
    return DisplayObjectContainer;
}(DisplayObject));
var TestField = (function (_super) {
    __extends(TestField, _super);
    function TestField() {
        _super.call(this);
        this.text = "";
        this.textColor = "#000000";
        this.size = 18;
        this.typeFace = "Arial";
        this.textType = "18px Arial";
    }
    TestField.prototype.render = function (context2D) {
        context2D.fillStyle = this.textColor;
        context2D.font = this.textType;
        context2D.fillText(this.text, 0, 0 + this.size);
        //console.log("textAlpha:" + context2D.globalAlpha);
    };
    TestField.prototype.hitTest = function (x, y) {
        // console.log("text" + x);
        // console.log("text" + y);
        var rect = new math.Rectangle();
        rect.x = rect.y = 0;
        rect.width = this.size * this.text.length;
        rect.height = this.size;
        if (rect.isPointInRectangle(x, y)) {
            // for(var listener of this.listeners){
            //     if(listener.type == TouchEventService.currentType){
            //         listener.func();
            //     }
            // }
            TouchEventService.getInstance().addPerformer(this);
            return this;
        }
        else {
            return null;
        }
    };
    TestField.prototype.setText = function (text) {
        this.text = text;
    };
    TestField.prototype.setX = function (x) {
        this.x = x;
    };
    TestField.prototype.setY = function (y) {
        this.y = y;
    };
    TestField.prototype.setTextColor = function (color) {
        this.textColor = color;
    };
    TestField.prototype.setSize = function (size) {
        this.size = size;
        this.textType = this.size.toString() + "px " + this.typeFace;
    };
    TestField.prototype.setTypeFace = function (typeFace) {
        this.typeFace = typeFace;
        this.textType = this.size.toString() + "px " + this.typeFace;
    };
    return TestField;
}(DisplayObject));
var Bitmap = (function (_super) {
    __extends(Bitmap, _super);
    function Bitmap(id) {
        var _this = this;
        _super.call(this);
        this.imageID = "";
        this.imageID = id;
        this.image = new Image();
        this.image.src = this.imageID;
        this.image.onload = function () {
            _this.width = _this.image.width;
            _this.height = _this.image.height;
        };
    }
    Bitmap.prototype.render = function (context2D) {
        var _this = this;
        // var imageTemp = new Image();
        // imageTemp.src = this.imageID;
        // this.imageCache = this.image;
        if (this.image) {
            context2D.drawImage(this.image, 0, 0);
        }
        else {
            this.image.onload = function () {
                context2D.drawImage(_this.image, 0, 0);
            };
        }
        //console.log("imageAlpha:" + context2D.globalAlpha);
    };
    Bitmap.prototype.hitTest = function (x, y) {
        // console.log("image" + x);
        // console.log("image" + y);
        var rect = new math.Rectangle();
        rect.x = rect.y = 0;
        rect.width = this.image.width;
        rect.height = this.image.height;
        if (rect.isPointInRectangle(x, y)) {
            // for(var listener of this.listeners){
            //     if(listener.type == type){
            //         listener.func();
            //     }
            // }
            TouchEventService.getInstance().addPerformer(this);
            return this;
        }
        else {
            return null;
        }
    };
    Bitmap.prototype.setImage = function (text) {
        this.imageID = text;
    };
    Bitmap.prototype.setX = function (x) {
        this.x = x;
    };
    Bitmap.prototype.setY = function (y) {
        this.y = y;
    };
    return Bitmap;
}(DisplayObject));
var Shape = (function (_super) {
    __extends(Shape, _super);
    function Shape() {
        _super.apply(this, arguments);
        this.graphics = new Graphics();
    }
    return Shape;
}(DisplayObjectContainer));
var Graphics = (function (_super) {
    __extends(Graphics, _super);
    function Graphics() {
        _super.apply(this, arguments);
        this.fillColor = "#000000";
        this.alpha = 1;
        this.globalAlpha = 1;
        this.strokeColor = "#000000";
        this.lineWidth = 1;
        this.lineColor = "#000000";
    }
    Graphics.prototype.beginFill = function (color, alpha) {
        this.fillColor = color;
        this.alpha = alpha;
    };
    Graphics.prototype.endFill = function () {
        this.fillColor = "#000000";
        this.alpha = 1;
    };
    Graphics.prototype.drawRect = function (x1, y1, x2, y2, context2D) {
        context2D.globalAlpha = this.alpha;
        context2D.fillStyle = this.fillColor;
        context2D.fillRect(x1, y1, x2, y2);
        context2D.fill();
    };
    Graphics.prototype.drawCircle = function (x, y, rad, context2D) {
        context2D.fillStyle = this.fillColor;
        context2D.globalAlpha = this.alpha;
        context2D.beginPath();
        context2D.arc(x, y, rad, 0, Math.PI * 2, true);
        context2D.closePath();
        context2D.fill();
    };
    Graphics.prototype.drawArc = function (x, y, rad, beginAngle, endAngle, context2D) {
        context2D.strokeStyle = this.strokeColor;
        context2D.globalAlpha = this.alpha;
        context2D.beginPath();
        context2D.arc(x, y, rad, beginAngle, endAngle, true);
        context2D.closePath();
        context2D.stroke();
    };
    return Graphics;
}(DisplayObjectContainer));
//# sourceMappingURL=drawing-api.js.map