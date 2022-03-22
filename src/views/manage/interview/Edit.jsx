import React from 'react'
import request from '@/utils/request'
import MyForm from './Form'

class Edit extends React.Component {
    state = {
        data: [],
    }
    getData = async () => {
        const { id } = this.props.match.params;
        const { data } = await request.get('/question/' + id)
        this.setState({
            data: data.data
        })
    }
    componentDidMount() {
        this.getData()
    }
    render() {
        return (
            <div>
                <MyForm data={this.state.data} />
            </div>
        )
    }

}


export default Edit;
