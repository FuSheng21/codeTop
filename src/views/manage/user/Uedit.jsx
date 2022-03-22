import React from "react";
import { message, Form, Input, Button, Select,Image} from "antd";

import request from "@/utils/request";


class Uedit extends React.Component {
  state = {
    currenauthority: "",
    initialValues: {
      authority: "ordinary",
    },
  };
  onFinish = async (values) => {
    const { id } = this.props.match.params;
    const { data } = await request.patch("/user/"+id, values);

    if (data.code == 200) {
      message.success("添加成功！");
      this.props.history.push("/manage/user/list");
    }else if (data.code == 401) {
      message.warning("token不存在或已过期");
    }
  };

  onChange = (value) => {

    this.setState({
      currenauthority: value,
    });
  };
  getData=async()=>{
    const { id } = this.props.match.params;
    const { data } = await request.get('/user/' + id)
    this.form.setFieldsValue(data.data)
  }
  componentDidMount(){
    this.getData()
  }
  render() {
    const { Option } = Select;
    return (
      <>
        <Form
          name="basic"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          onFinish={this.onFinish}
          initialValues={this.state.initialValues}
          autoComplete="off"
          ref={(e)=>this.form=e}
        >

          <Form.Item
            label="头像"
            name="touxiang"
          >
            <Image
            width={100}
            src="https://img2.baidu.com/it/u=3981336570,1599304571&fm=26&fmt=auto"
          />
          </Form.Item>

          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: "请输入用户名" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="用户密码"
            name="password"
          >
            <Input />
          </Form.Item>
          <Form.Item label="用户身份" name="authority">
            <Select onChange={this.onChange} allowClear>
              <Option value="ordinary">普通用户</Option>
              <Option value="vip">贵宾用户</Option>
              <Option value="super">超级管理员</Option>
            </Select>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 4, span: 14 }}>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
          </Form.Item>
        </Form>
      </>
    );
  }
}
export default Uedit;
