import React,{useEffect} from 'react'
import request from '@/utils/request'
import { Form, Input,  Button, Rate, Switch, InputNumber, message } from 'antd'
import { useHistory } from 'react-router'

function InterviewForm({data}) {
    const history = useHistory()
    const [myform] = Form.useForm();
    const initialValues = {
        level: 2,
        hot: 100
    }
    const onFinish = async ({ qid, ...values }) => {
        let data
        if (qid) {
            data = await request.put('/question/' + qid, values)
        } else {
            data = await request.post('/question/add', values)
        }
        if (data.data.code === 200) {
            message.success((qid ? '修改' : '添加') + '成功')
            history.push('/manage/interview/list')
        }
    }
    useEffect(()=>{
        myform.setFieldsValue(data)
    },[data])
    return (
        <Form
            name="basic"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 14 }}
            initialValues={initialValues}
            onFinish={onFinish}
            autoComplete="off"
            form={myform}
        >
            <Form.Item
                name="qid"
                hidden
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="面试题"
                name="title"
                rules={[{ required: true, message: '请填写面试题' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="难度"
                name="level"
            >
                <Rate />
            </Form.Item>
            <Form.Item
                label="热度"
                name="hot"
            >
                <InputNumber style={{ width: 100 }} />
            </Form.Item>

            <Form.Item label="审核" name="checked" valuePropName="checked">
                <Switch />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 4, span: 14 }}>
                <Button size="large" type="primary" htmlType="submit">
                    确认
                </Button>
            </Form.Item>
        </Form>
    )
}

export default InterviewForm