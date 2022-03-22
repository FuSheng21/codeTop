
import React, { useState } from "react";
import request from "@/utils/request";
import {
  Table, Button, Popconfirm, message, Modal, Menu
} from 'antd'
class Clist extends React.Component {
  state = {
    data: [],
    page: 1,
    size: 10,
  }
  getDate = async () => {
    const { page, size } = this.state
    const { data } = await request.get('question/category', {
      params: {
        page,
        size
      }
    })
    this.setState({
      data: data.data
    })
  }
  removeItem = async (id) => {
    const { data } = await request.delete('/company/' + id)
    if (data.code == 200) {
      message.success("删除成功！");
      this.getDate()
    } else if (data.code == 401) {
      message.warning("token不存在或已过期");
    }
  }
  goto = (url) => {
    this.props.history.push(url);
  };
  componentDidMount() {
    this.getDate()
  }
  render() {
    const columns = [
      {
        title: '#',
        width: 50,
        render(value, row, index) {
          return index + 1;
        }
      },
      {
        title: '企业',
        key: 'company',
        dataIndex: 'company',
      },
      {
        title: '部门',
        key: 'department',
        dataIndex: 'department',
        render: (row) => {
          const [isModalVisible, setIsModalVisible] = useState(false);
          const showModal = () => {
            setIsModalVisible(true);
          };
          const handleOk = () => {
            setIsModalVisible(false);
          };

          const handleCancel = () => {
            setIsModalVisible(false);
          };
          return (
            <>
              <Button type="primary" onClick={showModal}>
                点击查看
              </Button>
              <Modal okText="确定" cancelText="关闭" title="部门" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}
                footer={[

                  <Button
                    key="link"
                    type="primary"
                    onClick={handleOk}
                  >
                    关闭
                  </Button>,
                ]}
              >
                <Menu selectable={false}>
                  {
                    row.map(item => {
                      return <Menu.Item key={item}>{item}</Menu.Item>
                    })
                  }
                </Menu>
              </Modal>
            </>
          )
        }
      },
      {
        title: '岗位',
        key: 'job',
        dataIndex: 'job',
        render: (row) => {
          const [isModalVisible, setIsModalVisible] = useState(false);
          const showModal = () => {
            setIsModalVisible(true);
          };
          const handleOk = () => {
            setIsModalVisible(false);
          };

          const handleCancel = () => {
            setIsModalVisible(false);
          };
          return (
            <>
              <Button type="primary" onClick={showModal}>
                点击查看
              </Button>
              <Modal okText="确定" cancelText="关闭" title="岗位" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}
                footer={[

                  <Button
                    key="link"
                    type="primary"
                    onClick={handleOk}
                  >
                    关闭
                  </Button>,
                ]}
              >
                <Menu selectable={false} >
                  {
                    row.map(item => {
                      return <Menu.Item key={item}>{item}</Menu.Item>
                    })
                  }
                </Menu>
              </Modal>
            </>
          )
        }
      },
      {
        title: '操作',
        render: (row) => {
          return <>
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
          </>
        }
      },

    ]
    return <>
      <Button type="primary" style={{ marginBottom: '20px' }} onClick={() => this.goto("/manage/company/add")}>
        添加
      </Button>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={this.state.data}
      />
    </>
  }
}
export default Clist