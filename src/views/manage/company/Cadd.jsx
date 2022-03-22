import React from "react";
import request from "@/utils/request";
import { Input, Form, Button, message } from 'antd';
class Cadd extends React.Component {
  state = {
    departments: [],
    jobs: [],
    depinputVisible: false,
    jobinputVisible: false,
    department: '',
    job: '',
  };
  showdepInput = () => {
    this.setState({ depinputVisible: true });
  };
  depInputChange = e => {
    this.setState({ department: e.target.value });
  };
  depInputConfirm = () => {
    const { department } = this.state;
    let { departments } = this.state;
    if (department && departments.indexOf(department) === -1) {
      departments = [...departments, department];
    }
    this.setState({
      departments,
      depinputVisible: false,
      department: ''
    });
  };
  showjobInput = () => {
    this.setState({ jobinputVisible: true });
  };
  jobInputChange = e => {
    this.setState({ job: e.target.value });
  };
  jobInputConfirm = () => {
    const { job } = this.state;
    let { jobs } = this.state;
    if (job && jobs.indexOf(job) === -1) {
      jobs = [...jobs, job];
    }
    this.setState({
      jobs,
      jobinputVisible: false,
      job: ''
    });
  };
  onFinish = async (values) => {
    const { departments, jobs } = this.state
    if (departments.length == 0 || jobs.length == 0) {
      message.warning('有遗漏项')
      return
    }

    values.department = JSON.stringify(departments)
    values.job = JSON.stringify(jobs)

    const { data } = await request.post("/company", values);

    if (data.code == 200) {
      message.success("添加成功!");
      this.props.history.push("/manage/company/list");
    } else if (data.code == 401) {
      message.warning("token不存在或已过期");
    }
  };
  render() {
    const { departments, depinputVisible, department, jobs, jobinputVisible, job } = this.state;
    return (
      <>
        <Form
          name="basic"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          onFinish={this.onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="企业名称"
            name="company"
            rules={[{ required: true, message: "请输入企业名称" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="企业部门"
          >
            {
              departments.length > 0 ? departments.map(item => {
                return <span key={item} style={{ marginRight: '10px' }}>{item}</span>
              }) : '请添加企业部门    '
            }
            {
              depinputVisible && (
                <Input
                  type="text"
                  size="small"
                  className="tag-input"
                  value={department}
                  onChange={this.depInputChange}
                  onBlur={this.depInputConfirm}
                  onPressEnter={this.depInputConfirm}
                />
              )
            }
            {
              !depinputVisible && (
                <Button type="link" onClick={this.showdepInput}>
                  添加部门
                </Button>
              )
            }

          </Form.Item>
          <Form.Item
            label="企业岗位"
          >
            {
              jobs.length > 0 ? jobs.map(item => {
                return <span key={item} style={{ marginRight: '10px' }}>{item}</span>
              }) : '请添加企业岗位    '
            }
            {
              jobinputVisible && (
                <Input
                  type="text"
                  size="small"
                  className="tag-input"
                  value={job}
                  onChange={this.jobInputChange}
                  onBlur={this.jobInputConfirm}
                  onPressEnter={this.jobInputConfirm}
                />
              )
            }
            {
              !jobinputVisible && (
                <Button type="link" onClick={this.showjobInput}>
                  添加岗位
                </Button>
              )
            }

          </Form.Item>

          <Form.Item wrapperCol={{ offset: 4, span: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button type="primary" htmlType="submit">
                添加
              </Button>
            </div>
          </Form.Item>
        </Form>

      </>
    );
  }
}

export default Cadd