import React from 'react'

import request from '../../utils/request'

import * as echarts from 'echarts';


class Home extends React.Component {
    state ={
        companys:[],
        data:[]
    }

    getCompany= async()=>{
        const { data } = await request.get('/question/sum')
        
        let comp = data.data.map(item =>{
            return {
                value:item.total,
                name:item.company
            }
        })
        this.setState({
           data:data.data,
           companys:comp
        })
    }
    componentDidMount() {
        this.getCompany()
      
    }
    componentDidUpdate(){
          let myChart = echarts.init(this.div);
          myChart.setOption({
            title: {
                text: 'Company',
                subtext: 'questionTotal',
                left: 'center'
              },
              tooltip: {
                trigger: 'item'
              },
              legend: {
                orient: 'vertical',
                left: 'left'
              },
              series: [
                {
                  name: 'Access From',
                  type: 'pie',
                  radius: '50%',
                  data: this.state.companys,
                  emphasis: {
                    itemStyle: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                  }
                }
              ]
          })
        }
    render() {
        return (
            <div ref={(el) => this.div = el}
            style={{width:'100%',height:'600px',fontSize:'16px'}}
            >
            </div>
        )
    }
}



export default Home;
