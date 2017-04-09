import React,{Component} from 'react';
class ReactDomLayout extends Component {
    static defaultProps = {
        components : {}, //{type: xxx}
        state: {}, //// {id: {children: [cid,cid],props: {},type: 'text'}
        props: {

        }, //定义添加组件共享数据或方法
        rootId: 'Root',
        listens: {}
    };
    get propsState (){
        return this.props.state || {}
    }
    get listens (){
        return this.props.listens || {};
    }
    fire(type,...props){
        const types = this.listens[type];
        if(types){
            if(this.isFunction(types)){
                types.apply(this,props)
            }else if(this.isArray(types)){
                types.forEach((item)=>{
                    if(item && this.isFunction(item)){
                        item.apply(this,props)
                    }
                })
            }
        }else{
            console.log(`fire: ${type} not found,please add Engine listens`)
        }
    }
    extend(target = {}, target2 = {}) {
        for (const i in target2) {
            target[i] = target2[i]
        }
        return target;
    }
    isFunction(fn){
        return typeof fn === 'function';
    }

    isArray(obj){
        return Object.prototype.toString.call(obj) === '[object Array]';
    }

    render() {
        this.share = this.extend({fire: this.props.fire || this.fire.bind(this)},this.props.props);
        return this.renderItem(this.props.rootId,this.props.rootId);
    }
    getItemProps (obj = {},isCom){
        if(this.props.getItemProps) return this.props.getItemProps(obj,isCom);
        let props = {
            key: obj['data-id']
        };
        const share  = this.share || {};
        for(const key in obj){
            if(key && key !== 'type' && key !== 'children'){
                const type = obj[key];
                if(type && /^on[A-Z]/g.test(key)){
                    //使用fire模式
                    if(typeof type === 'string'){
                        props[key] = (...env)=>{
                            share.fire && share.fire(type,...env);
                        }
                    }else{
                        props[key] = type;
                    }
                }else if(!this.props.regPropsIgnore || !this.props.regPropsIgnore.test(key)){
                    props[key] = obj[key]
                }
            }
        }
        return props;
    }
    get components(){
        return this.props.components || {}
    }
    renderItem(id,pid) {
        const state = this.propsState || {};
        const obj = state[id];
        if(!obj) {
            console.log(`id:${id}  not found in`,state);
            return null;
        }
        let args = [];
        const type = obj.type;
        obj['data-id'] = id;
        obj['data-pid'] = pid;
        if(type){
            const typeItem = this.components[type];
            let props = this.getItemProps(obj,typeItem);
            if(typeItem){
                let share = this.extend({},this.share);
                args.push(typeItem, this.extend(share,props));
            }else if(type === 'text'){
                return obj.children;
            }else if(/^[a-z]+$/g) {
                args.push(type, props);
            }else{
                console.log(`type: ${obj.type} not found, please add Engine components`,obj);
                return null;
            }
            if (this.isArray(obj.children)) {
                obj.children.forEach((item)=> {
                    const itemRender = this.renderItem(item,id);
                    (itemRender !== null) && args.push(itemRender);
                })
            }else if(['string', 'number', 'boolean'].indexOf(typeof obj.children) !== -1){
                args.push(obj.children);
            }
            return React.createElement.apply(React, args);
        }else{
            console.log('type not exist',obj);
            return null
        }
    }
}

export default ReactDomLayout;

