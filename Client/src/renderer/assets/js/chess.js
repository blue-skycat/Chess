/**
 * @author NZQ
 * @date 2018/12/11
 * @Description : 主要的程序
 * @Param : elem 初始化的元素
 * @Param : LWidth 边线宽度
 * @Param : LWidth 边线宽度的一半
 * @param : SWidth 单个格子的长度
*/
function chess ({
                  elem,
                  SWidth=70,
                  LWidth=4,
                  LHWidth = Math.round(LWidth/2),
                  width = SWidth*8,
                  height = SWidth*9,
                }) {

  // 对应棋盘坐标
  const map = new Array(9).fill(new Array(10));
  /**
   * @author NZQ
   * @date 2018/12/12
   * @Description : 棋盘对象
  */
  const chessboard = {
    init(){
      elem.width = width + LWidth;
      elem.height = height + LWidth;
      this.ctx = elem.getContext("2d");
      this.ctx.lineWidth = LWidth;
      this.ctx.strokeStyle = "brown";
      //棋盘外框 , 后面的width, height 实际上在 width + LHWidth处
      this.ctx.strokeRect(LHWidth, LHWidth+1, width, height);

      // 绘制行
      this.drawRow();
      // 绘制列
      this.drawCols();
      // 绘制中间的  “楚河汉界”
      this.drawFont();
      // 绘制棋盘上面的交叉处的4和角
      this.drawCenter();
      this.drawSlant();
    },
    //此方法用来画棋盘线
    drawLine(mx, my, lx, ly){
      this.ctx.beginPath();
      this.ctx.moveTo(mx, my);
      this.ctx.lineTo(lx, ly);
      this.ctx.stroke();
    },
    //棋盘行
    drawRow(){
      for(let i = SWidth; i <= width; i += SWidth) {
        this.drawLine(0, i+LHWidth, width, i+LHWidth)
      }
    },
    //棋盘列
    drawCols(){
      let __height = height + LHWidth;
      for(let i = SWidth, total = 7 * SWidth; i <= total; i += SWidth) {
        this.drawLine(i+LHWidth, LHWidth, i+LHWidth, __height)
      }
      //清除指定的矩形区域
      this.ctx.clearRect(LWidth, 4 * SWidth + LWidth, width-LWidth, SWidth-LWidth);
    },
    drawFont(){
      let ctx = this.ctx
        ,fontSize = SWidth*3/5;
      ctx.LWidth = 1;
      //绘制文字
      ctx.font =  fontSize + "px microsoft yahei";
      ctx.save(); //保存点
      //将坐标中心作为起启点
      ctx.translate(width, 4 * SWidth + LWidth);
      ctx.rotate(Math.PI / 2); // 旋转画布绘制刻度，  // 弧度制 Math.PI=π
      //填充

      ctx.fillText("楚", SWidth/5-LHWidth, fontSize * 2);
      ctx.fillText("河", SWidth/5-LHWidth, fontSize * 4);
      ctx.restore(); //恢复到保存点
      ctx.save();
      //将坐标中心作为起启点
      ctx.translate(LWidth, 5 * SWidth - LHWidth);
      ctx.rotate(Math.PI / -2);
      /* ctx.fillText("汉", 0, fontSize * 2);
       ctx.fillText("界", 0, fontSize * 4);*/
      ctx.fillText("汉", SWidth/5-LWidth, fontSize * 2);
      ctx.fillText("界", SWidth/5-LWidth, fontSize * 4);
      ctx.restore();
    },
    //坐标的中心点
    drawCenter(){
      let drawLine = this.drawLine.bind(this)
        ,__LHWidth = LHWidth/2;
      this.ctx.lineWidth = LHWidth
      function __center (x, y) {
        //左上
        drawLine(x - LWidth, y - 4 * LWidth, x - LWidth, y - LWidth);
        drawLine(x - LWidth + __LHWidth, y - LWidth, x - 4 * LWidth, y - LWidth);
        //右上
        drawLine(x + 2 * LWidth, y - 4 * LWidth, x + 2*LWidth, y - LWidth);
        drawLine(x + 2 * LWidth - __LHWidth, y - LWidth, x + 5 * LWidth, y - LWidth);
        //左下
        drawLine(x - LWidth, y + 5 * LWidth, x - LWidth, y + LWidth + LHWidth + __LHWidth);
        drawLine(x - LHWidth - __LHWidth, y + 2 *  LWidth, x - 4 * LWidth, y + 2 * LWidth);
        //右下
        drawLine(x + 2 * LWidth, y + 5 * LWidth, x + 2 * LWidth, y + 2 * LWidth); // 竖
        drawLine(x + 2 * LWidth - __LHWidth, y + 2 * LWidth, x + 5 * LWidth, y + 2 * LWidth);     // 横
      }

      __center(1 * SWidth, 2 * SWidth);
      __center(7 * SWidth, 2 * SWidth);
      __center(0, 3 * SWidth);
      __center(2 * SWidth, 3 * SWidth);
      __center(4 * SWidth, 3 * SWidth);
      __center(6 * SWidth, 3 * SWidth);
      __center(8 * SWidth, 3 * SWidth);
      __center(8 * SWidth, 6 * SWidth);
      __center(6 * SWidth, 6 * SWidth);
      __center(4 * SWidth, 6 * SWidth);
      __center(2 * SWidth, 6 * SWidth);
      __center(0, 6 * SWidth);
      __center(7 * SWidth, 7 * SWidth);
      __center(1 * SWidth, 7 * SWidth);
      this.ctx.lineWidth = LWidth;
    },
    drawSlant(){
      //斜线
      this.drawLine(3 * SWidth + LHWidth, LHWidth, 5 * SWidth, 2 * SWidth);
      this.drawLine(3 * SWidth, 7 * SWidth, 5 * SWidth + LHWidth, 9 * SWidth + LHWidth);
      //反斜线
      this.drawLine(5 * SWidth + LHWidth, LHWidth, 3 * SWidth + LHWidth, 2 * SWidth + LHWidth);
      this.drawLine(5 * SWidth + LWidth, 7 * SWidth, 3 * SWidth + LHWidth, 9 * SWidth + LHWidth);
    }
  };

  /**
   * @author NZQ
   * @date 2018/12/12
   * @Description : 棋子构造函数
  */
  class PieceCtrl {
    constructor ({
                   po,
                   nextPo,
                   type,
                   belong,
                   moveRule,
                   delRule,
                 }) {
      this.type = type;
      this.belong = belong; // 归属方
      this.moveRule = moveRule; // 棋子的移动规则
      this.delRule = delRule;
      this._po = po
      this._nextPo = nextPo
// 棋子吃掉对方棋子的规则
    }
    /**
     * @author NZQ
     * @date 2018/12/12
     * @Description : 是否可以移动
     * @Param : {x， y} 下一个位置
    */
    canMove() { // 是否可以移动到指定的位置
      return this.moveRule();
    }
    canDel() { // 对方的棋子的对象
      return this.delRule();
    }

    get po () {
      return this._po
    }

    set po ({x, y}) {
      map[x][y] = this;
      this._po = {x, y}
    }

    get nextPo () {
      return this._nextPo
    }

    set nextPo (value) {
      this._nextPo = value
    }
  }

  /**
   * @author NZQ
   * @date 2018/12/12
   * @Description : 7种棋子
  */
  const piece = {
    Shuai: class extends PieceCtrl {
      constructor ({
                     po,
                     nextPo,
                     type = "Shuai",
                     belong,
                     moveRule = () => {// {x, y} 下一个位置
                       let {curX, curY} = this.po
                         ,{nextX, nextY} = this.nextPo;
                       if ((Math.abs(curX -nextX) === 1 && curY === nextY) || (curX === nextX && Math.abs(curY -nextY) === 1)) {
                         return this.belong === "red" && (nextX>=3 && nextX<=5) ? (nextY>=7 && nextY<=9) : (nextY>=0 && nextY<=2);
                       }
                     },
                     delRule = (pieceObj) => {
                       return !!pieceObj
                     },
                   }){
        super({po, nextPo, type, belong, moveRule, delRule,});
      }
    },
    Shi: class extends PieceCtrl {
      constructor ({
                     po,
                     nextPo,
                     type = "Shi",
                     belong,
                     moveRule = () => {
                       let {curX, curY} = this.po
                         ,{nextX, nextY} = this.nextPo;
                       if (Math.abs(curX -nextX) === 1 && Math.abs(curY -nextY) === 1) {
                         return this.belong === "red" && (nextX>=3 && nextX<=5) ? (nextY>=7 && nextY<=9) : (nextY>=0 && nextY<=2);
                       }
                     },
                     delRule = (pieceObj) => {
                       return !!pieceObj
                     },
                   }){
        super({po, nextPo, type, belong, moveRule, delRule,});
      }
    },
    Xiang: class extends PieceCtrl {
      constructor ({
                     po,
                     nextPo,
                     type = "Xiang",
                     belong,
                     moveRule = () => {
                       let {curX, curY} = this.po
                         ,{nextX, nextY} = this.nextPo;
                       if (Math.abs(curX -nextX) === 2 && Math.abs(curY -nextY) === 2 && map[(nextX + curX)/2][(nextY + curY)/2]) {
                         return this.belong === "red" && (nextX>=0 && nextX<=8) ? (nextY>=5 && nextY<=9) : (nextY>=0 && nextY<=4);
                       }
                     },
                     delRule = (pieceObj) => {
                       return !!pieceObj
                     },
                   }){
        super({po, nextPo, type, belong, moveRule, delRule,});
      }
    },
    Che: class extends PieceCtrl {
      constructor ({
                     po,
                     nextPo,
                     type = "Che",
                     belong,
                     moveRule = () => {
                       let {curX, curY} = this.po
                         ,{nextX, nextY} = this.nextPo;
                       if (nextX>=0 && nextX<=8 && nextY>=0 && nextY<=9 && !map[nextX][nextY]) {
                         if (curY === nextY && curX !== nextX) {
                           let [min, max] = [Math.min(curX, nextX), Math.max(curX, nextX)]
                             ,mark = true;
                           for (let i = min + 1; i < max; i++) {
                             if (!!map[i][nextY]) {
                               mark = false;
                               break;
                             }
                           }
                           return mark;
                         } else if (curX === nextX && curY !== nextY) {
                           let [min, max] = [Math.min(curY, nextY), Math.max(curY, nextY)]
                             ,mark = true;
                           for (let i = min + 1; i < max; i++) {
                             if (!!map[nextX][i]) {
                               mark = false;
                               break;
                             }
                           }
                           return mark;
                         }
                       }
                     },
                     delRule = (pieceObj) => {
                       return !!pieceObj
                     },
                   }){
        super({po, nextPo, type, belong, moveRule, delRule,});
      }
    },
    Pao: class extends PieceCtrl {
      constructor ({
                     po,
                     nextPo,
                     type = "Pao",
                     belong,
                     moveRule = () => {
                       let {curX, curY} = this.po
                         ,{nextX, nextY} = this.nextPo;
                       if (nextX>=0 && nextX<=8 && nextY>=0 && nextY<=9 && !map[nextX][nextY]) {
                         if (curY === nextY && curX !== nextX) {
                           let [min, max] = [Math.min(curX, nextX), Math.max(curX, nextX)]
                             ,mark = true;
                           for (let i = min + 1; i < max; i++) {
                             if (!!map[i][nextY]) {
                               mark = false;
                               break;
                             }
                           }
                           return mark;
                         } else if (curX === nextX && curY !== nextY) {
                           let [min, max] = [Math.min(curY, nextY), Math.max(curY, nextY)]
                             ,mark = true;
                           for (let i = min + 1; i < max; i++) {
                             if (!!map[nextX][i]) {
                               mark = false;
                               break;
                             }
                           }
                           return mark;
                         }
                       }
                     },
                     delRule = (pieceObj) => {
                       return !!pieceObj
                     },
                   }){
        super({po, nextPo, type, belong, moveRule, delRule,});
      }
    },
    Ma: class extends PieceCtrl {
      constructor ({
                     po,
                     nextPo,
                     type = "Ma",
                     belong,
                     moveRule = () => {
                       let {curX, curY} = this.po
                         ,{nextX, nextY} = this.nextPo;
                       if (nextX>=0 && nextX<=8 && nextY>=0 && nextY<=9  && !map[nextX][nextY]) {
                         if (Math.abs(curX - nextX) === 2 && Math.abs(curY - nextY) === 1) {
                           return !map[(nextX + curX)/2][nextY];
                         } else if (Math.abs(curY - nextY) === 2 && Math.abs(curX - nextX) === 1) {
                           return !map[(nextY + curY)/2][nextX];
                         } 
                       }
                     },
                     delRule = (pieceObj) => {
                       return !!pieceObj
                     },
                   }){
        super({po, nextPo, type, belong, moveRule, delRule,})
      }
    },
    Bing: class extends PieceCtrl {
      constructor ({
                     po,
                     nextPo,
                     type = "Bing",
                     belong,
                     moveRule = () => {
                       let {curX, curY} = this.po
                         ,{nextX, nextY} = this.nextPo;
                       if (nextX>=0 && nextX<=8 && nextY>=0 && nextY<=9  && !map[nextX][nextY]) {
                         if (Math.abs(curX - nextX) === 2 && Math.abs(curY - nextY) === 1) {
                           return !map[(nextX + curX)/2][nextY];
                         } else if (Math.abs(curY - nextY) === 2 && Math.abs(curX - nextX) === 1) {
                           return !map[(nextY + curY)/2][nextX];
                         }
                       }
                     },
                     delRule = (pieceObj) => {
                       return !!pieceObj
                     },
                   }){
        super({po, nextPo, type, belong, moveRule, delRule,})
      }
    }
  }

  let rBing = new piece.Bing({po: {x: 1, y: 2,}, belong: "red",});
  rBing.po = {
    x: 4,
    y: 10,
  }
  console.log(rBing === map[4][10]);
  chessboard.init();
}

export default chess