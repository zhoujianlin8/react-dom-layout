
## react-dom-layout 模块
```
npm install react-dom-layout --save
```
* react-dom-layout  render json(one leaf) to dom 

* if you want json as children tree you can use react-dom-json
## 使用

````
let init = {
    Root: {
        type: 'div',
        className: 'aaa',
        children: ['id1','id2'],
    },
    id1: {
        type: 'div',
        children: 'hello world',
    },
    id2: {
        type: 'div',
        children: ['id3'],
    },
    id3: {
        type: 'div',
        children: '2121',
    }
};
//define compoents
const compoents = {
    Group
};
// listens fire
const listens = {
    goBack: function (goBack) {
        console.log('goBack',goBack)
    },
    changeInput: (res)=>{
        console.log('changeInput',res)

    },
    up: function () {
        
    }
    
};
ReactDOM.render(<Demo state = {init} compoents={compoents} listens = {listens} rootId = 'Root'/>, document.getElementById('container'));

````


＊ 详细使用请看demo



