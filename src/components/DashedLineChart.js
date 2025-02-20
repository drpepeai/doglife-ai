import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import './dashedLineChart.css';

const DashedLineChart = ({ balance }) => {
  const dummyData = [
    { name: "03.25", balance: 0 },
    { name: "10:25", balance: balance  }, 
  ];

  return (

    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={dummyData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        <CartesianGrid strokeDasharray="1 1" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="balance" stroke="#8884d8" strokeDasharray="5 5" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default DashedLineChart;
