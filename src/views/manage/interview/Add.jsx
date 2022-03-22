import React from "react";
import request from "@/utils/request";
import { message, Form, Input, Button } from "antd";

class Add extends React.Component {
  state = {
    initialValues: {
      title: "",
      level: 1,
      company: "",
      department: "",
      job: "",
    },
  };
  onFinish = async (values) => {
    const { data } = await request.post("/question/add", values);
    if (data.code == 200) {
      message.success("添加成功");
      this.props.history.push("/manage/interview/list");
    } else if (data.code == 401) {
      message.warning("token不存在或已过期");
    }
  };

  render() {
    return (
      <div>
        <Form
          name="basic"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          onFinish={this.onFinish}
          initialValues={this.state.initialValues}
          autoComplete="off"
        >
          <Form.Item
            label="题目名称"
            name="title"
            rules={[{ required: true, message: "请输入题目名称" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="难度系数" name="level">
            <Input type="Number" />
          </Form.Item>

          <Form.Item
            label="所属公司"
            name="company"
            rules={[{ required: true, message: "请输入所属公司" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="所属部门"
            name="department"
            rules={[{ required: true, message: "请输入所属部门" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="所属岗位"
            name="job"
            rules={[{ required: true, message: "请输入所属岗位" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 4, span: 14 }}>
              <Button type="primary" htmlType="submit">
                添加
              </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default Add;
