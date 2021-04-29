import React, { Component } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './Graph.css'

class Graph extends Component {
    constructor(props) {
        super(props);
        this.state = { 
        };
    }
    render() { 
        return ( 
        <div className="graph">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                width={500}
                height={400}
                data={this.props.data}
                margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                }}
                >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                
                <Area type="monotone" dataKey="deaths" stackId="1" stroke="#000000" fill="#434343" />
                <Area type="monotone" dataKey="recovered" stackId="1" stroke="#56ab2f" fill="#a8e063" />
                <Area type="monotone" dataKey="cases" stackId="1" stroke="#ff4b1f" fill="#ff9068" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
         );
    }
}
 
export default Graph;