import React,{Suspense, lazy } from 'react'
import {Route} from 'react-router-dom'
import {withLogin,} from '../utils/hoc'

import { Layout, Menu,  Row, Col, Button } from 'antd';
import {HomeOutlined, PicLeftOutlined ,GithubOutlined} from '@ant-design/icons';
import {connect} from 'react-redux';
import userAction from '../store/actions/user'

import style from './Manage.module.scss'


// import Home from './manage/Home'
// import User from './manage/User'
// import Interview from './manage/Interview'
// import Company from './manage/Company'


const Home = lazy(() => import("./manage/Home"));
const User = lazy(() => import("./manage/User"));
const Interview = lazy(() => import("./manage/Interview"));
const Company = lazy(() => import("./manage/Company"));

const { SubMenu } = Menu;
const { Header, Content,  Sider } = Layout;

const mapStateToProps = function(state){
    return {
        userInfo:state.user.userInfo,
    }
}
const mapDispatchToProps = function(dispatch){
    return {
       logout(){
            dispatch(userAction.logout())
       },
    }
}

@connect(mapStateToProps,mapDispatchToProps)
@withLogin
class Manage extends React.Component {
    state = {
        menu: [
            {
                path: '/home',
                text: '首页',
                icon: <HomeOutlined />
            },
            {
                path: '/interview',
                text: '题目管理',
                icon: <PicLeftOutlined />,
                children: [
                    {
                        path: '/list',
                        text: '题目列表'
                    },
                    {
                        path: '/add',
                        text: '添加题目'
                    },
                ]
            },
            {
                path: '/user',
                text: '用户管理',
                icon: <PicLeftOutlined />,
                children: [
                    {
                        path: '/list',
                        text: '用户列表'
                    },
                    {
                        path: '/add',
                        text: '添加用户'
                    },
                ]
            },
            {
                path: '/company',
                text: '企业管理',
                icon: <PicLeftOutlined />,
                children: [
                    {
                        path: '/list',
                        text: '企业列表'
                    },
                    {
                        path: '/add',
                        text: '添加企业'
                    },
                ]
            },
        ],
    }
    changeMenu = ({ item, key, keyPath, domEvent })=>{
        this.props.history.push(key)
    }
    render() {
        const {match,userInfo,logout,location} = this.props;
        const { menu } = this.state;
        return (
            <Layout style={{ height: '100vh' }}>
                <Header className={style.header}>
                    <Row>
                        <Col span={12}>
                            <div className={style.logo}>
                                <GithubOutlined className={style.icon}/>
                                企业题库后台管理系统
                            </div>
                        </Col>
                        <Col span={12} className="text-right">
                            {userInfo.username} <Button type="link" onClick={logout}>退出</Button>
                        </Col>
                    </Row>

                </Header>
                <Layout>
                    <Sider width={200} className="site-layout-background">
                        <Menu
                            mode="inline"
                            defaultSelectedKeys={[location.pathname]}
                            defaultOpenKeys={[match.path + '/interview',match.path + '/user']}
                            style={{ height: '100%', borderRight: 0 }}
                            onClick={this.changeMenu}
                        >
                            {
                                menu.map(item => {
                                    if (item.children) {
                                        return <SubMenu key={match.path + item.path} icon={item.icon} title={item.text}>
                                            {
                                                item.children.map(it=>{
                                                    return <Menu.Item key={match.path + item.path + it.path}>{it.text}</Menu.Item>
                                                })
                                            }
                                        </SubMenu>
                                    }else{
                                        
                                        return <Menu.Item key={match.path + item.path} icon={item.icon}>{item.text}</Menu.Item>
                                    }
                                })
                            }

                        </Menu>
                    </Sider>
                    <div style={{overflowY: 'scroll',width: '100%'}}>

                    <Layout style={{ padding: '0 24px 24px' }}>
                        <Content
                            className="site-layout-background"
                            style={{
                                padding: 24,
                                margin: 0,
                                minHeight: 280,
                            }}
                        >
                        <Suspense fallback={<div>loading...</div>}>
                            <Route path={match.path + "/interview"} component={Interview} />
                            <Route path={match.path + "/home"} component={Home} />
                            <Route path={match.path + "/user"} component={User} />
                            <Route path={match.path + "/company"} component={Company} />

                        </Suspense>
                        
                        </Content>
                    </Layout>
                    </div>
                </Layout>
            </Layout>
        )
    }
}


export default Manage