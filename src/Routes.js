import React from 'react';
import { Route, Router, Routes } from 'react-router-dom';
import Ayman from './pages/Ayman';
import Landing from './pages/Landing';
import Sidebar from './Sidebar';
import { Layout } from 'antd';

const { Sider, Content } = Layout; 

const siderStyle = {
  overflow: 'auto',
  height: '100vh',
  position: 'sticky',
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: 'thin',
  scrollbarColor: 'unset',
  display: 'flex'
};

function App() {
  return (
    <Layout>
      <Sider style={siderStyle}>
        <Sidebar />
      </Sider>
      <Content style={{
        margin: '24px 16px 0',
        overflow: 'initial',
      }}>
        <Routes>
          <Route path="/Ayman" element={<Ayman/>}/>
          <Route path="/" element={<Landing/>}/>
        </Routes>
      </Content>
    </Layout>
  );
}

export default App;
