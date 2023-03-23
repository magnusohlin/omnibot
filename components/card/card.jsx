import React from 'react';
import styles from './Card.module.css';

const Card = ({ content }) => {
  const entries = Object.entries(content);

  return (
    <div className={styles.card}>
      {entries.map(([key, value], index) => {
        const isTitle = index === 0;
        const className = isTitle ? styles.title : styles.content;

        return (
          <div key={key} className={className}>
            {isTitle ? (
              <span>{value}</span>
            ) : (
              <>
                <span className={styles.key}>{key}:</span>
                <span className={styles.value}>{value}</span>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Card;
