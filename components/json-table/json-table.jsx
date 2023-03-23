import React from 'react';
import styles from './json-table.module.css';

const JsonTable = ({ data: rawData }) => {
  const data = JSON.parse(rawData);
  if (data.length === 0) {
    return <p>No data available.</p>;
  }

  const uniqueKeys = new Set();
  data.forEach(item => {
    Object.keys(item).forEach(key => uniqueKeys.add(key));
  });

  const headers = Array.from(uniqueKeys);

  const renderCell = (cellData) => {
    if (Array.isArray(cellData)) {
      return (
        <ul className={styles.list}>
          {cellData.map((item, index) => (
            <li key={index}>{JSON.stringify(item)}</li>
          ))}
        </ul>
      );
    } else if (typeof cellData === 'object') {
      return JSON.stringify(cellData);
    } else {
      return cellData;
    }
  };

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th className={styles.tableHeader} key={index}>
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {headers.map((header, cellIndex) => (
              <td className={styles.tableCell} key={cellIndex}>
                {row.hasOwnProperty(header) ? renderCell(row[header]) : ''}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default JsonTable;