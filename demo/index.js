import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import Demo from '../src/index';
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

const compoents = {

};

const listens = {
    goBack: function (goBack) {
        console.log('goBack',goBack)
    },
    changeInput: (res)=>{
        console.log('changeInput',res)
    },
    up: function () {}
};

ReactDOM.render(<Demo state = {init} compoents={compoents} listens = {listens}/>, document.getElementById('container'));

