/**
 * @author NZQ
 * @date 2018/12/11
 * @Description : 主要的程序
 * @Param : elem 初始化的元素
 * @Param : LWidth 边线宽度
 * @Param : LWidth 边线宽度的一半
 * @Param : PWidth 棋子的宽度
 * @Param : SHWidth 单个格子的宽度的一半
 * @param : SWidth 单个格子的宽度
 */
function chess ({
                  vue,
                  elem = vue.$refs.canvas,
                  SWidth=50,
                  LWidth=4,
                  width = SWidth*8,
                  height = SWidth*9,
                  LHWidth = Math.round(LWidth/2),
                  PWidth = Math.round(SWidth*6/7),
                  PHWidth = Math.round(PWidth/2),
                  refs = vue.$refs
                }) {

  // 整个象棋的状态
  const chess = {
    map: [[],[],[],[],[],[],[],[],[]], // 对应棋盘坐标  const map = new Array(9).fill(new Array(10));
    room: vue.room,
    ownName: vue.room.ownSide.userName,
    otherSide: "",
    bJiang: "",
    rJiang: "",
    ownSide: "",
    turnSide: "red", // 第一个走棋莫默认是"red"
    goChessData: { // socket传输的数据用户下棋的相关数据
      po: null, // 记录对应棋子在对方走之前的坐标
      nextPo: null, // 记录对应棋子在对方走之后的坐标
      winSide: "",           // 记录赢的一方
      from: vue.room.ownSide.userName,
      to: vue.room.otherSide.userName,
    },
    transData() { // 通过socket 给对方传输数据

    },
    changeTurnSide() { // 当当前用户下万一步棋后
      let winSide = this.checkWin();
      this.goChessData.winSide = winSide;
      vue.$socket.socketIo.emit("goChess", this.goChessData)
      this.goChessData.po= null
      this.goChessData.nextPo= null
      this.turnSide = this.otherSide;
      if (winSide !== "") {
        console.log(winSide);
        vue.$notify({
          title: '用户提示',
          message: vue.$createElement('i', { style: 'color: teal'}, `${winSide === this.ownName ? "你" : "对方"}已获胜，即将返回游戏大厅`)
        });
        setTimeout(() => {
          vue.$router.push("/hall")
        }, 5000)
      }
    },
    mainHandle() {
      let that = this;
      refs.chess.onclick = (event) => {
        if (that.turnSide===that.ownSide) {
          let tag = event.target
            ,classList = tag.classList
            ,tagPo = util.getClickPoByTag(tag) // 只用于记录tag处是棋子（不管是对方还是自己的）时的坐标
            ,goChessData = that.goChessData;

          if (classList.contains("piece") && !classList.contains("ban")) { // 点击自身棋子，选择作为移动的目标棋子
            console.log("点击自己的棋子", tagPo);
            goChessData.po = tagPo;
          } else if (goChessData) { // 没有点击自身棋子是默认是选择下一步，如果没有选择作为移动的目标棋子，就不进入
            let piece = that.map[goChessData.po.x][goChessData.po.y];

            if (classList.contains('ban')) { // 点击对方棋子
              console.log("点击对方的棋子", tagPo)
              piece.nextPo = tagPo;
              if (piece.canDel()) {
                goChessData.nextPo = tagPo;
                piece.del(); // 删除目标棋子
                piece.move(); // 删除之后移动
                chess.changeTurnSide();
              }
            }else {
              if (classList.contains('chess')) { // chess棋盘上面，点击没有棋子的位置
                piece.nextPo =  util.getClickPoByRange({x: event.offsetX - 40, y: event.offsetY -40});
              }else { // 棋盘上面
                piece.nextPo =  util.getClickPoByRange({x: event.offsetX, y: event.offsetY});
              }
              console.log("点击没有棋子的位置", piece.nextPo);
              if (piece.canMove()) {
                goChessData.nextPo = piece.nextPo;
                piece.move();
                chess.changeTurnSide();
              }
            }
          }
        }else {
        }
      }
    },
    checkWin() {
      let ry = this.rJiang.po.y
        ,rx = this.rJiang.po.x
        ,by = this.bJiang.po.y
        ,bx = this.bJiang.po.x;
      console.log(this.bJiang, this.rJiang);

      if (bx === rx) {
        console.log("1")
        let [min, max] = [Math.min(ry, by), Math.max(ry, by)];
        for (let i = min + 1; i < max; i++) {
          if (chess.map[bx][i]) {
            return "";
          }
        }
        return this.room.otherSide.userName
      }else if(!this.bJiang) {
        console.log("2")
        if (this.ownSide === 'red') {
          return this.ownName
        }else {
          return this.room.otherSide.userName
        }
      }else if(!this.rJiang) {
        console.log("3")
        if (this.ownSide === 'red') {
          return this.room.otherSide.userName
        }else {
          return this.ownName
        }
      }else {
        return ""
      }
    }
  }


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

    // 通过像素得到棋子具体的数学坐标 （和 coordinateTrans 相反）
    getClickPoByTag(tag) {
      let x = tag.style.left.replace("px", "")
        ,y = tag.style.top.replace("px", "");
      return {x: (x-LHWidth+PHWidth)/SWidth, y: (y-LHWidth+PHWidth)/SWidth}
    },

    // 通过在棋盘上面的点击按范围估计用户预想的棋子的下一步位置
    getClickPoByRange({x, y}) {
      let x1 = Math.round(x/SWidth)
        ,y1 = Math.round(y/SWidth);
      
      if (x1 < 0) {x1 = 0}else if(x1 > 8) {x1 = 8}
      if (y1 < 0) {y1 = 0}else if(y1 > 9) {y1 = 9}
      
      return {x: x1,y: y1}
    },

    // 判断数学坐标是否在行范围
    inRowRange(x) {
      return x>=0 && x<=8
    },

    // 判断数学坐标是否在上半区范围
    inUpColRange(y) {
      return y>=0 && y<=4
    },

    // 判断数学坐标是否在下半区范围
    inDownColRange(y) {
      return y>=5 && y<=9
    },

    // 判断数学坐标是否在列范围
    inColRange(y) {
      return this.inUpColRange(y) || this.inDownColRange(y);
    },

    // 判断数学坐标是否在范围
    inRange(x, y) {
      return this.inRowRange(x) && this.inColRange(y)
    },

    // 是否在九宫格
    inNineGird(x, y) {
      return x>=3 && x<=5 && y>=7 && y<=9
    },

    // 检查炮和车
    checkPaoAndChe(nextX, nextY, curX, curY) {
      console.log(nextX, nextY, curX, curY)
      let mark = -1;
      let min, max;
      if (curY === nextY && curX !== nextX) { // 横向走
        mark = 0;
        [min, max] = [Math.min(curX, nextX), Math.max(curX, nextX)];
        for (let i = min + 1; i < max; i++) {
          if (chess.map[i][nextY]) {mark++}
        }
      }
      else if (curX === nextX && curY !== nextY) { // 竖向走
        mark = 0;
        [min, max] = [Math.min(curY, nextY), Math.max(curY, nextY)];
        for (let i = min + 1; i < max; i++) {
          if (chess.map[nextX][i]) {mark++}
        }
      }
      console.log(mark);
      return mark;
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
                   delRule = () => {
                     return moveRule();
                   },
                 }) {
      this.type = type;
      // 归属方
      this.moveRule = moveRule; // 棋子的移动规则
      this.delRule = delRule; // 棋子吃掉对方棋子的规则
      this.po = po;
      this.nextPo = nextPo;
      this.belong = belong;
      this.elem = null;
    }
    get po () {
      return this._po
    }

    set po (value) {
      chess.map[value.x][value.y] = this;
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
    canMove() { // 当nextPo上面没有棋子时判断是否可以移动
      return this.moveRule();
    }

    canDel() { // 当nextPo上面有棋子的时候，判断是否可以删除
      return this.delRule();
    }

    move() { // 移动棋子
      chess.map[this.po.x][this.po.y] = undefined;
      this.po = this.nextPo;
      let {x, y} = util.coordinateTrans({x: this.po.x, y:this.po.y});
      this.elem.style.top = y + "px";
      this.elem.style.left= x + "px";
    }

    // 将当前棋子的 下一个位置上的棋子删除后才能移动
    del() { // 删除棋子
      let piece = chess.map[this.nextPo.x][this.nextPo.y];
      piece.elem.remove();
      piece = null;
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
                       let curX = this.po.x
                         ,curY = this.po.y
                         ,nextX = this.nextPo.x
                         ,nextY = this.nextPo.y;
                       return util.inNineGird(nextX, nextY)
                         && (Math.abs(curX -nextX) === 1 && curY === nextY)
                         || (curX === nextX && Math.abs(curY -nextY) === 1)
                     }
                   }){
        super({po, nextPo, type, belong, moveRule,});
      }
    },
    Shi: class extends Piece {
      constructor ({
                     po,
                     nextPo,
                     type = "shi",
                     belong,
                     moveRule = () => {
                       let curX = this.po.x
                         ,curY = this.po.y
                         ,nextX = this.nextPo.x
                         ,nextY = this.nextPo.y;
                       return util.inNineGird(nextX, nextY)
                         && Math.abs(curX -nextX) === 1
                         && Math.abs(curY -nextY) === 1
                     },
                   }){
        super({po, nextPo, type, belong, moveRule,});
      }
    },
    Xiang: class extends Piece {
      constructor ({
                     po,
                     nextPo,
                     type = "xiang",
                     belong,
                     moveRule = () => {
                       let curX = this.po.x
                         ,curY = this.po.y
                         ,nextX = this.nextPo.x
                         ,nextY = this.nextPo.y;
                       console.log(util.inRowRange(nextX)
                         ,util.inDownColRange(nextY)
                         ,Math.abs(curX -nextX) === 2
                         ,Math.abs(curY -nextY) === 2
                         ,!chess.map[(nextX + curX)/2][(nextY + curY)/2])
                       return util.inDownColRange(nextY)
                         && Math.abs(curX -nextX) === 2
                         && Math.abs(curY -nextY) === 2
                         && !chess.map[(nextX + curX)/2][(nextY + curY)/2]
                     },
                   }){
        super({po, nextPo, type, belong, moveRule,});
      }
    },
    Che: class extends Piece {
      constructor ({
                     po,
                     nextPo,
                     type = "che",
                     belong,
                     moveRule = () => {
                       let curX = this.po.x
                         ,curY = this.po.y
                         ,nextX = this.nextPo.x
                         ,nextY = this.nextPo.y;
                       return util.checkPaoAndChe(nextX, nextY, curX, curY) === 0
                     },
                   }){
        super({po, nextPo, type, belong, moveRule,});
      }
    },
    Pao: class extends Piece {
      constructor ({
                     po,
                     nextPo,
                     type = "pao",
                     belong,
                     moveRule = () => {
                       let curX = this.po.x
                         ,curY = this.po.y
                         ,nextX = this.nextPo.x
                         ,nextY = this.nextPo.y;
                       return util.checkPaoAndChe(nextX, nextY, curX, curY) === 0
                     },
                     delRule = () => {
                       let curX = this.po.x
                         ,curY = this.po.y
                         ,nextX = this.nextPo.x
                         ,nextY = this.nextPo.y
                       return util.checkPaoAndChe(nextX, nextY, curX, curY) === 1
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
                       let curX = this.po.x
                         ,curY = this.po.y
                         ,nextX = this.nextPo.x
                         ,nextY = this.nextPo.y
                         ,midX = nextX > curX ? curX + 1 : curX - 1
                         ,midY = nextY > curY ? curY + 1 : curY - 1
                       return (Math.abs(curX - nextX) === 2 && curY - nextY === 1 && !chess.map[midX][curY]
                           || curY - nextY === 2 && curX - nextX === 1 && !chess.map[midY][curX])
                     },
                   }){
        super({po, nextPo, type, belong, moveRule,})
      }
    },
    Bing: class extends Piece {
      constructor ({
                     po,
                     nextPo,
                     type = "bing",
                     belong,
                     moveRule = () => {
                       let curX = this.po.x
                         ,curY = this.po.y
                         ,nextX = this.nextPo.x
                         ,nextY = this.nextPo.y;
                       return ((util.inDownColRange(curY) && nextY - curY === -1)
                           || (util.inUpColRange(curY) && (Math.abs(nextX - curX)===1 && nextY - curY === 0 || nextY - curY ===-1 && nextX - curX === 0)))
                     },
                   }){
        super({po, nextPo, type, belong, moveRule,})
      }
    }
  }


  /**
   * @author NZQ
   * @date 2018/12/20
   * @Description : 初始化所有的棋子
   */
  function initAllPiece () {
    let black = {
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

        if (cur.type === 'jiang') {
          chess[cur.belong[0]+"Jiang"] = cur;
        }
        cur.belong === chess.ownSide ? pieceDiv.classList.add(chess.ownSide, "piece") : pieceDiv.classList.add("ban", "piece");
        style.backgroundImage = "url(" + require(`@/assets/img/piece/${cur.belong}/${cur.belong[0] + cur.type}.png`) + ")";
        style.width = PWidth + "px";
        style.height = PWidth + "px";
        style.top = coord.y + "px";
        style.left = coord.x + "px";
        cur.elem = pieceDiv;
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
      // 红色方
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

    chess.ownSide !== "red" && ([black, red] = [red, black]);
    __initAllPiece({black, red})
  }

  chessboard.init();
  vue.listenMakeBelong().then((ownSide) => {
    chess.ownSide = ownSide;
    chess.otherSide = ownSide === "red" ? "black" : "red";

    vue.$socket.socketIo.on("goChess", (goChessData) => {
      console.log("对方已经走棋")
      if (goChessData.winSide !== '') {
        console.log(goChessData.winSide);
        vue.$notify({
          title: '用户提示',
          message: vue.$createElement('i', { style: 'color: teal'}, `${goChessData.winSide === chess.ownName ? "你" : "对方"}已获胜，即将返回游戏大厅`)
        });
        setTimeout(() => {
          vue.$router.push("/hall")
        }, 5000)
      } else {
        let piece = chess.map[goChessData.po.x][goChessData.po.y];
        piece.nextPo = goChessData.nextPo;
        if (chess.map[goChessData.nextPo.x][goChessData.nextPo.y]) {
          piece.del();
          piece.move();
        }else {
          piece.move();
        }
        chess.turnSide = chess.ownSide;
      }
    })
    // 初始化所有棋子
    initAllPiece();
    // 象棋的主要控制
    chess.mainHandle();
  })
}

export default chess