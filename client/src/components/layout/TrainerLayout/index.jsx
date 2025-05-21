import React from 'react';
import { Outlet } from 'react-router-dom';
import TrainerSidebar from '../TrainerSidebar';
import TrainerHeader from '../TrainerHeader';
import styles from './TrainerLayout.module.css';

const TrainerLayout = () => {
  return (
    <>
      <TrainerSidebar />
      <TrainerHeader />
      <div className={styles.content}>
        <Outlet />
      </div>
    </>
  );
};

export default TrainerLayout;