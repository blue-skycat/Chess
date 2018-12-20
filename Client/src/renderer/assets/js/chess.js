/**
 * @author NZQ
 * @date 2018/12/11
 * @Description : 主要的程序
 * @Param : elem 初始化的元素
 * @Param : side 标志当前是哪一方
 * @Param : LWidth 边线宽度
 * @Param : LWidth 边线宽度的一半
 * @Param : PWidth 棋子的宽度
 * @Param : SHWidth 单个格子的宽度的一半
 * @param : SWidth 单个格子的宽度
*/
function chess ({
                  vue,
                  elem = vue.$refs.canvas,
                  side,
                  SWidth=70,
                  LWidth=4,
                  width = SWidth*8,
                  height = SWidth*9,
                }) {

  // 格子和相关涉及的一下相关的长度
  const LHWidth = Math.round(LWidth/2)
    ,PWidth = Math.round(SWidth*5/7)
    ,PHWidth = Math.round(PWidth/2)
    ,refs = vue.$refs;

  // 对应棋盘坐标
  // const map = new Array(9).fill(new Array(10));
  const map = [[],[],[],[],[],[],[],[],[]]

  /**
   * @author NZQ
   * @date 2018/12/20
   * @Description : 工具对象
   */
  const util = {
    // 数学坐标转具体像素
    coordinateTrans({x, y}) {
      return {x: x * SWidth - PHWidth + LHWidth, y: y * SWidth - PHWidth + LHWidth};
    },
    // 判断数学坐标是否在行范围
    inRowRange(curX, nextX) {
      return nextX>=0 && nextX<=8
    },
    // 判断数学坐标是否在上半区范围
    inUpColRange(curY, nextY) {
      return nextY>=0 && nextY<=4
    },
    // 判断数学坐标是否在下半区范围
    inDownColRange(curY, nextY) {
      return nextY>=5 && nextY<=9
    },
    // 判断数学坐标是否在列范围
    inColRange(curY, nextY) {
      return this.inUpColRange(curY, nextY) || this.inDownColRange(curY, nextY);
    },
    // 判断数学坐标是否在列范围
    inRange(curX, nextX, curY, nextY) {
      return this.inRowRange(curX, nextX) && this.inColRange(curY, nextY)
    }
  }

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
    },

    // 棋盘上面的点击事件处理函数
    boardClickHandle() {
      refs.chessWrap.onclick = (event) => {
        let tag = event.target
          ,tagName = tag.tagName.toUpperCase();

        if (tagName === 'DIV' && tag.classList.contains("piece")) { // 点击棋子时，选中当前棋子（事件委托）

        }
        else if (tagName === "CANVAS") {  // 点击棋盘时，检测在棋盘上面的点击是否点击的交叉处

        }
      }

    }
  };

  /**
   * @author NZQ
   * @date 2018/12/12
   * @Description : 棋子构造函数
  */
  class Piece {
    constructor ({
                   po,
                   nextPo,
                   type,
                   belong,
                   moveRule,
                   delRule,
                 }) {
      this.type = type;
      // 归属方
      this.moveRule = moveRule; // 棋子的移动规则
      this.delRule = delRule; // 棋子吃掉对方棋子的规则
      this.po = po;
      this.nextPo = nextPo;
      this.belong = belong
    }
    get po () {
      return this._po
    }

    set po (value) {
      map[value.x][value.y] = this;
      this._po = value
    }

    get nextPo () {
      return this._nextPo
    }

    set nextPo (value) {
      this._nextPo = value
    }

    get belong () {
      return this._belong
    }

    set belong (value) {
      this._belong = value
    }

    ////////////////////////// 棋子对应的方法
    canMove() { // 是否可以移动到指定的位置
      return this.moveRule();
    }

    canDel() { // 对方的棋子的对象
      return this.delRule();
    }

    move() { // 移动棋子

    }

    del() { // 删除棋子

    }
  }

  /**
   * @author NZQ
   * @date 2018/12/12
   * @Description : 7种棋子(棋子的不同类实例)
  */
  const pieceInst = {
    Jiang: class extends Piece {
      constructor ({
                     po,
                     nextPo,
                     type = "jiang",
                     belong,
                     moveRule = () => {// {x, y} 下一个位置
                       let {curX, curY} = this.po
                         ,{nextX, nextY} = this.nextPo;
                       if ((Math.abs(curX -nextX) === 1 && curY === nextY) || (curX === nextX && Math.abs(curY -nextY) === 1)) {
                         return nextX>=3 && nextX<=5 && nextY>=7 && nextY<=9;     //return this.belong === "red" && (nextX>=3 && nextX<=5) ? (nextY>=7 && nextY<=9) : (nextY>=0 && nextY<=2);
                       }
                     },
                     delRule = (pieceObj) => {
                       return !!pieceObj
                     },
                   }){
        super({po, nextPo, type, belong, moveRule, delRule,});
      }
    },
    Shi: class extends Piece {
      constructor ({
                     po,
                     nextPo,
                     type = "shi",
                     belong,
                     moveRule = () => {
                       let {curX, curY} = this.po
                         ,{nextX, nextY} = this.nextPo;
                       if (Math.abs(curX -nextX) === 1 && Math.abs(curY -nextY) === 1) {
                         return nextX>=3 && nextX<=5 && nextY>=7 && nextY<=9; // return this.belong === "red" && (nextX>=3 && nextX<=5) ? (nextY>=7 && nextY<=9) : (nextY>=0 && nextY<=2);
                       }
                     },
                     delRule = (pieceObj) => {
                       return !!pieceObj
                     },
                   }){
        super({po, nextPo, type, belong, moveRule, delRule,});
      }
    },
    Xiang: class extends Piece {
      constructor ({
                     po,
                     nextPo,
                     type = "xiang",
                     belong,
                     moveRule = () => {
                       let {curX, curY} = this.po
                         ,{nextX, nextY} = this.nextPo;
                       if (Math.abs(curX -nextX) === 2 && Math.abs(curY -nextY) === 2 && map[(nextX + curX)/2][(nextY + curY)/2]) {
                         return util.inRowRange(curX, nextX) && util.inDownColRange(curY, nextY);
                       }
                     },
                     delRule = (pieceObj) => {
                       return !!pieceObj
                     },
                   }){
        super({po, nextPo, type, belong, moveRule, delRule,});
      }
    },
    Che: class extends Piece {
      constructor ({
                     po,
                     nextPo,
                     type = "che",
                     belong,
                     moveRule = () => {
                       let {curX, curY} = this.po
                         ,{nextX, nextY} = this.nextPo;
                       if (util.inRowRange(curX, nextX) && nextY>=0 && nextY<=9 && !map[nextX][nextY]) {
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
    Pao: class extends Piece {
      constructor ({
                     po,
                     nextPo,
                     type = "pao",
                     belong,
                     moveRule = () => {
                       let {curX, curY} = this.po
                         ,{nextX, nextY} = this.nextPo;
                       if (util.inRange(curX, nextX, curY, nextY) && !map[nextX][nextY]) {
                         let [min, max] = [Math.min(curY, nextY), Math.max(curY, nextY)],mark = true;
                         if (curY === nextY && curX !== nextX) {
                           for (let i = min + 1; i < max; i++) {
                             if (!!map[i][nextY]) {return false}
                           }
                           return mark;
                         } else if (curX === nextX && curY !== nextY) {
                           for (let i = min + 1; i < max; i++) {
                             if (!!map[nextX][i]) {return false}
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
    Ma: class extends Piece {
      constructor ({
                     po,
                     nextPo,
                     type = "ma",
                     belong,
                     moveRule = () => {
                       let {curX, curY} = this.po
                         ,{nextX, nextY} = this.nextPo;
                       if (util.inRange(curX, nextX, curY, nextY) && !map[nextX][nextY]) {
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
    Bing: class extends Piece {
      constructor ({
                     po,
                     nextPo,
                     type = "bing",
                     belong,
                     moveRule = () => {
                       let {curX, curY} = this.po,{nextX, nextY} = this.nextPo;

                       if (util.inRange(curX, nextX, curY, nextY) && !map[nextX][nextY]) {
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

  /**
   * @author NZQ
   * @date 2018/12/20
   * @Description : 初始化所有的棋子
  */
  function initAllPiece () {
    /**
     * @author NZQ
     * @date 2018/12/20
     * @Param : 传入对应名字的棋子的坐标
    */
    let __initAllPiece = ({black={}, red={}}) => {
      let frag = document.createDocumentFragment();
      function createPiece (cur) {
        let pieceDiv = document.createElement("div")
          ,style = pieceDiv.style
          ,coord = util.coordinateTrans(cur.po); // 具体的像素坐标

        cur.belong === side ? pieceDiv.classList.add(side, "piece") : pieceDiv.classList.add("ban", "piece");
        style.backgroundImage = "url(" + require(`@/assets/img/piece/${cur.belong}/${cur.belong[0] + cur.type}.png`) + ")";
        style.width = PWidth + "px";
        style.height = PWidth + "px";
        style.top = coord.y + "px";
        style.left = coord.x + "px";
        frag.appendChild(pieceDiv)
      }
      // 黑方
      for (let index in black) {
        createPiece(
          new pieceInst[index.substr(1,index.length-2)]({
            belong: "black",
            po: black[index],
          })
        )
      }
      // 黑方
      for (let index in red) {
        createPiece(
          new pieceInst[index.substr(1,index.length-2)]({
            belong: "red",
            po: red[index],
          })
        )
      }

      elem.parentNode.appendChild(frag);
    }
      ,black = {
      bChe1   : {x: 0, y: 0},
      bMa1    : {x: 1, y: 0},
      bXiang1 : {x: 2, y: 0},
      bShi1   : {x: 3, y: 0},
      bJiang1 : {x: 4, y: 0},
      bShi2   : {x: 5, y: 0},
      bXiang2 : {x: 6, y: 0},
      bMa2    : {x: 7, y: 0},
      bChe2   : {x: 8, y: 0},
      bPao1   : {x: 1, y: 2},
      bPao2   : {x: 7, y: 2},
      bBing1  : {x: 0, y: 3},
      bBing2  : {x: 2, y: 3},
      bBing3  : {x: 4, y: 3},
      bBing4  : {x: 6, y: 3},
      bBing5  : {x: 8, y: 3},
    }
      ,red = {
        rChe1   : {x: 0, y: 9},
        rMa1    : {x: 1, y: 9},
        rXiang1 : {x: 2, y: 9},
        rShi1   : {x: 3, y: 9},
        rJiang1 : {x: 4, y: 9},
        rShi2   : {x: 5, y: 9},
        rXiang2 : {x: 6, y: 9},
        rMa2    : {x: 7, y: 9},
        rChe2   : {x: 8, y: 9},
        rPao1   : {x: 1, y: 7},
        rPao2   : {x: 7, y: 7},
        rBing1  : {x: 0, y: 6},
        rBing2  : {x: 2, y: 6},
        rBing3  : {x: 4, y: 6},
        rBing4  : {x: 6, y: 6},
        rBing5  : {x: 8, y: 6},
      };

    side !== "red" && ([black, red] = [red, black]);
    __initAllPiece({black, red})
  }

  chessboard.init();
  initAllPiece();
}

export default chess