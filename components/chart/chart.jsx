// components/Chart/Chart.js
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const prepareChartData = (data) => {
  return JSON.parse(data).map((author) => {
    const authorName = author.name;
    const bookCount = author.books ? author.books.length : 0;

    return { name: authorName, books: bookCount };
  });
};

const Chart = ({ data }) => {
  const chartData = prepareChartData(data);
  const xAxisKey = 'name';
  const yAxisKey = 'books';

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxisKey} interval={0} textAnchor="end" sclaeToFit="true" verticalAnchor="start" angle="-40" height={140}/>
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey={yAxisKey} fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Chart;
