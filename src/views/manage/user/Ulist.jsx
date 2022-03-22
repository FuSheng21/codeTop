import React from "react";
import request from "@/utils/request";

import { Table, Button, Popconfirm, Space, Image,message } from "antd";

class Ulist extends React.Component {
  state = {
    selectKeys:[],
    txurl:'',
    currenItem:'',
    data: [],
    page: 1,
    size: 10,
  };
  formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };
  getData = async () => {
    const { data } = await request.get("/user", {
      params: {
        page: this.state.page,
        size: this.state.size,
      },
    });
    const userlist = data.data.data;
    this.setState({ data: userlist });
  };
  removeItem =(id) => {
    request
      .delete("/user", {
        data: {
          id: id,
        },
      })
      .then(({ data }) => {
        if (data.code == 200) {
          message.success("删除成功");
          this.getData();
        } else if (data.code == 401) {
          message.warning("token不存在或已过期");
        }
      });
  };
  onSelectChange = (selectedRowKeys) => {
    this.setState((this.state.selectKeys = selectedRowKeys));
  };
  componentDidMount() {
    this.getData();
  }
  goto = (url) => {
    this.props.history.push(url);
    location.reload()
  };
  removMore=async()=>{
    const ids=this.state.selectKeys
    if(ids.length==0){
      message.warning("请勾选需要删除的用户");
      return
    }
    const id=JSON.stringify(ids)
    const {data}=await request.delete('/user',{
      data:{
        id:id
      }
    })
    if (data.code == 200) {
      message.success("删除成功");
      this.getData();
    } else if (data.code == 401) {
      message.warning("token不存在或已过期");
    }
  }
  render() {
    const rowSelection = {
      selectedRowKeys: this.state.selectKeys,
      onChange: this.onSelectChange,
    };

    const columns = [
      {
        title: "#",
        width: 50,
        render: (value, row, index) => {
          return index + 1;
        },
      },
      {
        title: "头像",
        key: "touxiang",
        dataIndex: "touxiang",
        render: (value,row) => (
          <Image
            width={50}
            src={row.touxiang?this.state.txurl+row.touxiang:"https://img2.baidu.com/it/u=3981336570,1599304571&fm=26&fmt=auto"}
          />
        ),
      },
      {
        title: "用户名",
        key: "username",
        dataIndex: "username",
      },
      
      {
        title: "用户身份",
        key: "authority",
        dataIndex: "authority",
        render: (row) => {
          switch (row) {
            case "ordinary":
              return "普通用户";
              break;
            case "vip":
              return "贵宾用户";
              break;
            case "super":
              return "超级管理员";
              break;
          }
        },
      },

      {
        title: "注册时间",
        key: "addtime",
        dataIndex: "addtime",
        render: (row) => {
          return this.formatDate(row);
        },
      },
      {
        title: "操作",
        key: "action",
        dataIndex: "action",
        render: (value, row) => (
          <Space size="middle">
            <Button type="primary" size="small" onClick={()=>this.goto('/manage/user/edit/'+row.id)}>
              编辑
            </Button>
            <Popconfirm
              title="确认删除？"
              okText="确认"
              cancelText="取消"
              onConfirm={() => this.removeItem(row.id)}
            >
              <Button danger size="small">
                删除
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ];

    return (
      <>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:'20px'}}>
      <Button type="primary" onClick={() => this.goto("/manage/user/add")}>
          添加
        </Button>
        <Popconfirm
              title="确认删除？"
              okText="确认"
              cancelText="取消"
              onConfirm={()=>this.removMore()}
            >
              <Button danger>
              批量删除
              </Button>
            </Popconfirm>
     
      </div>
    
        <Table rowKey="id" columns={columns} dataSource={this.state.data} rowSelection={rowSelection}/>
      </>
    );
  }
}
export default Ulist;
