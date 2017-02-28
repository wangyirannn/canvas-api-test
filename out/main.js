var _this = this;
window.onload = function () {
    var currentTarget; //鼠标点击时当前的对象
    var startTarget; //mouseDown时的对象
    var isMouseDown = false;
    var startPoint = new math.Point(-1, -1);
    var movingPoint = new math.Point(0, 0);
    var canvas = document.getElementById("test");
    var context2D = canvas.getContext("2d");
    // context2D.fillStyle = "#FF0000";
    // context2D.rect(0,0,100,100);
    // context2D.fill();
    // context2D.stroke();
    //var image = new Image();
    //image.src = "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1487731042&di=12ec67a86c85dfebde95dc3104ce8974&imgtype=jpg&er=1&src=http%3A%2F%2Fi1.hdslb.com%2Fbfs%2Fface%2F280f1ffb730da4a954c2a5d1d928e1497148ac9e.jpg";
    // image.src = "src/timg.jpg";
    // context2D.drawImage(image,0,0);
    // image.onload = () =>{
    // context2D.clearRect(0,0,canvas.width,canvas.height);
    // context2D.drawImage(image,0,0);
    // }
    var stage = new DisplayObjectContainer();
    stage.width = 600;
    stage.height = 600;
    var container = new DisplayObjectContainer();
    container.width = 600;
    container.height = 600;
    // var textField01 = new TestField();
    // textField01.setText("Hello world");
    // textField01.setTextColor("#00FF00");
    // textField01.setSize(30);
    var list = new Bitmap("src/renwumianbanbeijing.png");
    var button = new Bitmap("src/wancheng.png");
    container.addChild(list);
    container.addChild(button);
    stage.addChild(container);
    // stage.addChild(list);
    // stage.addChild(button);
    // stage.alpha = 0.8;
    // image01.alpha = 0.4;
    button.x = 77;
    button.y = 230;
    // image01.scaleY = 2;
    // image01.rotation = 30;
    // textField01.alpha = 0.8;
    // textField01.scaleX = 3;
    stage.addEventListener(TouchEventsType.MOUSEDOWN, function () {
        console.log("stage");
    }, _this);
    container.addEventListener(TouchEventsType.MOUSEMOVE, function () {
        // console.log("container");
    }, _this);
    list.addEventListener(TouchEventsType.MOUSEMOVE, function () {
        if (currentTarget == startTarget) {
            container.x += (TouchEventService.stageX - movingPoint.x);
            container.y += (TouchEventService.stageY - movingPoint.y);
            console.log("list");
        }
    }, _this);
    button.addEventListener(TouchEventsType.CLICK, function () {
        alert("OnClick!!!");
        console.log("button");
    }, _this);
    window.onmousedown = function (e) {
        var x = e.offsetX - 3;
        var y = e.offsetY - 3;
        TouchEventService.stageX = x;
        TouchEventService.stageY = y;
        startPoint.x = x;
        startPoint.y = y;
        movingPoint.x = x;
        movingPoint.y = y;
        TouchEventService.currentType = TouchEventsType.MOUSEDOWN;
        currentTarget = stage.hitTest(x, y);
        startTarget = currentTarget;
        TouchEventService.getInstance().toDo();
        //console.log(stage.globalMatrix);
        //console.log(currentTarget);
        //TouchEventService.getInstance().clearList();
        isMouseDown = true;
        //console.log(TouchEventService.currentType);
    };
    window.onmouseup = function (e) {
        var x = e.offsetX - 3;
        var y = e.offsetY - 3;
        TouchEventService.stageX = x;
        TouchEventService.stageY = y;
        var target = stage.hitTest(x, y);
        //console.log(target);
        if (target == currentTarget) {
            TouchEventService.currentType = TouchEventsType.CLICK;
        }
        else {
            TouchEventService.currentType = TouchEventsType.MOUSEUP;
        }
        TouchEventService.getInstance().toDo();
        //TouchEventService.getInstance().clearList();
        //console.log(TouchEventService.currentType);
        currentTarget = null;
        isMouseDown = false;
    };
    window.onmousemove = function (e) {
        if (isMouseDown) {
            var x = e.offsetX - 3;
            var y = e.offsetY - 3;
            TouchEventService.stageX = x;
            TouchEventService.stageY = y;
            TouchEventService.currentType = TouchEventsType.MOUSEMOVE;
            //console.log(TouchEventService.currentType);
            currentTarget = stage.hitTest(x, y);
            TouchEventService.getInstance().toDo();
            movingPoint.x = x;
            movingPoint.y = y;
        }
    };
    setInterval(function () {
        context2D.save();
        context2D.clearRect(0, 0, canvas.width, canvas.height);
        stage.draw(context2D);
        context2D.restore();
        // var rect = new Shape();
        // rect.graphics.beginFill("#FF0000",1);
        // rect.graphics.drawRect(0,300,100,100,context2D);
        // rect.graphics.endFill();
        // var circle = new Shape();
        // circle.graphics.beginFill("#00FF00",1);
        // circle.graphics.drawCircle(100,100,30,context2D);
        // circle.graphics.endFill();
        // var arc = new Shape();
        // arc.graphics.beginFill("#0000FF",1);
        // arc.graphics.drawArc(100,200,20,0,Math.PI,context2D);
        // arc.graphics.endFill();
    }, 100);
};
//# sourceMappingURL=main.js.map