import React from "react";
import { message, Form, Input, Button, Select } from "antd";

import request from "@/utils/request";

class Uadd extends React.Component {
  state = {
    currenauthority: "",
    initialValues: {
      authority: "ordinary",
    },
  };
  onFinish = async (values) => {
    if (!this.state.currenauthority) {
      values.authority = "ordinary";
    } else {
      values.authority = this.state.currenauthority;
    }

    const { data } = await request.post("/user", values);

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
        >
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
            rules={[{ required: true, message: "请输入用户密码" }]}
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
                添加
              </Button>
          </Form.Item>
        </Form>
      </>
    );
  }
}
export default Uadd;
