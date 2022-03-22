import React from 'react'
import { Redirect, useHistory,withRouter } from 'react-router'
import store from '../redux'
import request from './request'

// @高阶组件应用：属性代理
// 获取用户数据
export function withUser(InnerComponent) {
    return function OuterComponent(props) {
        let userInfo = localStorage.getItem('userInfo')
        try {
            userInfo = JSON.parse(userInfo) || {}
        } catch (err) {
            userInfo = {}
        }
        return (
            <InnerComponent userInfo={userInfo} {...props}></InnerComponent>
        )
    }
}

// 可以获取任意本地存储数据
export function withStorage(key) {
    return function HOC(InnerComponent) {
        return function OuterComponent(props) {
            let value = localStorage.getItem(key)
            try {
                value = JSON.parse(value)
            } catch (err) {
                value = value
            }

            const data = {}
            data[key] = value;

            return (
                <InnerComponent {...props} {...data}></InnerComponent>
            )
        }
    }
}

// 增强版withStorage
export function withStorages(...keys) {
    return function HOC(InnerComponent) {
        return function OuterComponent({ children, ...props }) {
            // 用户存放本地存储数据
            const data = {}
            keys.forEach(key => {
                let value = localStorage.getItem(key)
                try {
                    value = JSON.parse(value)
                } catch (err) {
                    value = value
                }

                // 每一个数据写入data对象
                data[key] = value;
            })


            return (
                <InnerComponent {...props} {...data}>{children}</InnerComponent>
            )
        }
    }
}


// @高阶组件应用：提取公共代码
// 利用高阶组件withLogin实现页面登录访问权限
export function withLogin(InnerComponent) {
    function OuterComponent(props) {
        const history = useHistory()
        const isLogin = !!props.userInfo.Authorization;

        // 发起ajax请求，校验token
        request.get('/user/verify').then(({ data }) => {
            if (data.status === 401) {
                history.push('/login')
            }
        })

        if (isLogin) {
            return <InnerComponent {...props}></InnerComponent>
        } else {
            return <Redirect to="/login" />
        }
    }

    OuterComponent = withUser(OuterComponent)

    return OuterComponent
}

// @高阶组件应用：反向继承（只适用于类组件）
// 利用高阶组件withAuth实现页面登录访问权限
export function withAuth(InnerComponent) {
    @withUser
    @withRouter
    class OuterComponent extends InnerComponent {
        state = {
            isLogin: !!this.props.userInfo.Authorization
        }
        componentDidMount() {
            const { history } = this.props;
            const {isLogin} = this.state;
            if (isLogin) {
                request.get('/user/verify').then(({ data }) => {
                    if (data.status === 401) {
                        history.push('/login')
                    }
                })
            }
            super.componentDidMount()
        }
        render() {
            const { isLogin } = this.state;
            if (isLogin) {
                return super.render()
            } else {
                return <Redirect to="/login" />
            }
        }
    }


    return OuterComponent
}



// @属性代理：通过高阶组件实现给目标组件传递redux数据
export function withRedux(InnerComponent){
    return class OuterComponent extends React.Component{
        state = {
            reduxData:{}
        }
        componentDidMount(){
            const reduxData = store.getState();
            this.setState({
                reduxData
            })

            store.subscribe(()=>{
                const reduxData = store.getState();
                this.setState({
                    reduxData
                })
            })
        }
        render(){
            return <InnerComponent {...this.props} {...this.state.reduxData} dispatch={store.dispatch}></InnerComponent>
        }
    }
}

// withRedux(Manage)

// 按需传入redux数据到目标组件
export function withStore(mapStateToProps,mapDispatchToProps){
    return function HOC(InnerComponent){
        class OuterComponent extends React.Component{
            state = {
                reduxData:{},
                reduxMethod:{}
            }
            getData = ()=>{
                const state = store.getState();
                const reduxData = typeof mapStateToprops=== 'function' ? mapStateToProps(state,this.props) : {}
                this.setState({
                    reduxData
                })

            }
            componentDidMount(){
                this.getData();
                // 监听redux数据修改，刷新组件
                this.cancel = store.subscribe(()=>{
                    this.getData();
                })

                let reduxMethod;
                if(typeof mapDispatchToProps === 'function'){
                    reduxMethod = mapDispatchToProps(store.dispatch,this.props)
                }else{
                    reduxMethod = {
                        dispatch:store.dispatch
                    }
                }
                this.setState({
                    reduxMethod
                })
            }
            componentWillUnmount(){
                this.cancel();
            }
            render(){
                return (
                    <InnerComponent {...this.props} {...this.state.reduxData} {...this.state.reduxMethod}></InnerComponent>
                )
            }
        }

        return OuterComponent;
    }
}

// withStore(function(state){
//     return {
//         userInfo:state.userInfo,
//         collapse:state.collapse,
//         a:100
//     }
// })(Manage)