import React from 'react';
import JsonTable from '../json-table/json-table';
import Card from '../card/card';
import Chart from '../chart/chart';
import styles from './message-content.module.css';

const MessageContent = ({ type, content }) => {
  switch (type) {
    case 'table':
      return <JsonTable data={content} />;
    case 'card':
      return <Card content={content} />;
    case 'chart':
      return <div className={ styles.chart }><Chart data={content} /></div>;
    default:
      return (
        <div className={styles.messageContent}>
          <pre className={ styles.messageText }>{content}</pre>
        </div>
      );
  }
};

export default MessageContent;
