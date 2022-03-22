import React from 'react'
import request from '@/utils/request'

import {
  Table, Button, Row, Col, Popconfirm, message, Space,
  Input,
  Select,
  Rate
} from 'antd'
import {DeleteOutlined, } from '@ant-design/icons'

class List extends React.Component {
  state = {
    columns: [{}],
    data: [],
    total: 0,
    page: 1,
    size: 10,
    selectIds: [],
    companys: [],
    department: [],
    jobs: [],
    overallCompany: '',
    overallJob: '',
    overDepartment: '',
    searchStatus: false,
    searchData:[],
    keyword:'',
  }

  getData = async () => {
    const { page, size } = this.state
    const { data } = await request.get('/question', {
      params: {
        page,
        size,
        company:this.state.overallCompany,
        department:this.state.overDepartment,
        job:this.state.overallJob,
      }
    })
    this.setState({
      data: data.data,
      total: data.total,
      searchStatus:false
    })
  }
  goto = (url) => {
    this.props.history.push({
      pathname: url,
      search: 'page=1&size=10',
      state: { c: 10, d: 20 },

    })
  }
  removeItems = async () => {
    let { selectIds } = this.state;
    if (selectIds.length == 0) {
      message.warning('请求选择要删除的数据')
      return;
    }
    selectIds = JSON.stringify(selectIds)
    const { data } = await request.delete('/question', {
      data: {
        id: selectIds
      }
    })
    if (data.code === 200) {
      message.success('删除成功')
      this.getData();
    }else if (data.code == 401) {
      message.warning("token不存在或已过期");
    }
  }
  removeItem = async (id) => {
    const { data } = await request.delete(`/question`, {
      data: {
        id
      }
    })
    if (data.code === 200) {
      message.success('删除成功')
      this.getData();
    }else if (data.code == 401) {
      message.warning("token不存在或已过期");
    }


  }
  getCompanyDate = async () => {
    const { data } = await request.get('/question/category')
    this.setState({
      companys: data.data
    })
  }
  componentDidMount() {
    this.getData();
    this.getCompanyDate()
  }

  getCompany = async (value) => {
    let [departDate] = this.state.companys.filter(item => item.company == value)
    this.setState({
      department: departDate.department,
      overallCompany: value
    })
    const { size } = this.state
    const { data } = await request.get('/question', {
      params: {
        page:1,
        size,
        company: value
      }
    })
    this.setState({
      data: data.data,
      total: data.total,
      searchStatus:false
    })
  }
  getDepartment = async (value) => {
    const { size } = this.state
    const { data } = await request.get('/question', {
      params: {
        page:1,
        size,
        company: this.state.overallCompany,
        department: value
      }
    })
    this.setState({
      data: data.data,
      total: data.total,
      overDepartment: value,
      searchStatus:false
    })
  }
  getJob = async (value) => {
    const { size } = this.state
    const { data } = await request.get('/question', {
      params: {
        page:1,
        size,
        company: this.state.overallCompany,
        department: this.state.overDepartment,
        job: value

      }
    })
    this.setState({
      data: data.data,
      total: data.total,
      overallJob: value,
      searchStatus:false
    })
  }
  getSearchData=async()=>{
    const { page,size,keyword } = this.state
    const { data } = await request.get('/question/search', {
      params: {
        page,
        size,
        keyword,
      }
    })
    this.setState({
      searchData: data.data,
      total: data.total,
      searchStatus: true,
    })
  }
  getSearch =(value) => {
    this.setState({
      keyword:value
    })
    setTimeout(() => {
      this.getSearchData()
    }, 50);
    
  }
  updateStar = async (id, value) => {
    const { data } = await request.put('/question/star', {
      star: value,
      qid: id
    })
    if (data.code == 200) {
      message.success("设置成功！");
      this.getData();
    }else if (data.code == 401) {
      message.warning("token不存在或已过期");
    }
    

  }
  render() {
    let objob = this.state.companys[0] || {}
    const { data, total, size,searchData,searchStatus,overallCompany,overDepartment,overallJob } = this.state;
    const pagination = {
      size: "small",
      total,
      showTotal: (total) => {
        return `共${total}条记录`
      },
      pageSize: size,
      showSizeChanger: true,
      onChange: (page, size) => {
        this.setState({
          page,
          size
        }, () => {
          searchStatus?this.getSearchData():this.getData()
        })
      }
    }
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectIds: selectedRowKeys
        })
      }
    }
    const { Option } = Select;
    const columns = [
      {
        title: '#',
        width: 50,
        render(value, row, index) {
          return index + 1;
        }
      },
      {
        title: '面试题',
        dataIndex: 'question',
        render(value, row) {
          return <>
            <h5>{row.title}</h5>
          </>
        }
      },
      {
        title: '难度',
        render(value, row) {
          return <>
            {
              row.level == 1 ?
                <Button type="primary" size="small">容易</Button>
                :
                row.level == 2 ?
                  <Button type="success" size="small" >中等</Button>
                  :
                  <Button type="danger" size="small" >困难</Button>
            }

          </>
        }
      },
      {
        title: '最近考察时间',
        render(value, row) {
          return <>
            <h5>{row.time}</h5>
          </>
        }
      },
      {
        title: '频度',
        render(value, row) {
          return <>
            <h5>{row.hot}</h5>
          </>
        }
      },
      {
        title: '掌握程度',
        render: (values, row) => {
          return <>
            <Rate onChange={this.updateStar.bind(this, row.qid)} value={row.star} />
          </>
        }
      },
      {
        title: '操作',
        width: 160,
        render: (row) => {
          return <>
            <Button type="primary" size="small" ghost onClick={this.goto.bind(this, `/manage/interview/edit/${row.qid}`)}>编辑</Button>
            <Popconfirm title="确认删除" cancelText="取消" okText="确认" onConfirm={this.removeItem.bind(this, row.qid)}>
              <Button size="small" danger >删除</Button>
            </Popconfirm>
          </>
        }
      }
    ]

    const App = () => (
      <div className="site-input-group-wrapper">
        <Row>
          <Col span={6}>
            <Select defaultValue={overallCompany!=''?overallCompany:'企业'} onChange={this.getCompany} style={{ width: '200px' }}>
              {
                this.state.companys.map(Item => {
                  return <Option value={Item.company} key={Item.id}>{Item.company}</Option>
                })
              }
            </Select>
          </Col>
          <Col span={6}>
            <Select defaultValue={overDepartment!=''?overDepartment:'部门'} style={{ width: '200px' }} onChange={this.getDepartment}>
              {
                this.state.department.map(item => {
                  return <Option value={item} key={item}>{item}</Option>
                })
              }
            </Select>
          </Col>
          <Col span={6}>
            <Select defaultValue={overallJob!=''?overallJob:'岗位'} style={{ width: '200px' }} onChange={this.getJob}>
              {
                objob.job ?
                  objob.job.map(item => {
                    return <Option value={item} key={item}>{item}</Option>
                  })
                  :
                  ''
              }
            </Select>
          </Col>
        </Row>

      </div>
    );
    const { Search } = Input;
    return (
      <div>
        <App />
        <Space direction="vertical" style={{ width: '100%', marginTop: '15px', marginBottom: '15px' }} >
          <Search placeholder="搜索题目名称或编号" onSearch={this.getSearch} enterButton size="large" />
        </Space>
        <Row >
          <Col span={24} className="text-right">
            <Popconfirm title="确认删除" cancelText="取消" okText="确认" onConfirm={this.removeItems}>
              <Button type="primary" icon={<DeleteOutlined />} danger>批量删除</Button>
            </Popconfirm>
          </Col>
        </Row>
        {
          searchStatus?<Table
          rowKey="qid"
          columns={columns}
          dataSource={searchData}
          rowSelection={rowSelection}
          pagination={pagination}
        />:<Table
          rowKey="qid"
          columns={columns}
          dataSource={data}
          rowSelection={rowSelection}
          pagination={pagination}
        />
        }
      </div>
    )
  }

}


export default List;
