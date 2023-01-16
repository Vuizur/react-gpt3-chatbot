import React, { useState } from 'react';
import './App.css';
import '@chatui/core/dist/index.css';
import { Layout, Menu, MenuProps } from 'antd';
import ChatArea from './ChatArea';
import Options from './Options';
import Info from './Info';

const App = () => {
  const [current, setCurrent] = useState('chat');

  //items for custom menu
  const items: MenuProps["items"] = [
    {
      label: "Chat",
      key: "chat"
    },
    {
      label: "Settings",
      key: "settings"
    },
    {
      label: "Info",
      key: "info"
    }
  ];

  const onClick: MenuProps['onClick'] = e => {
    //console.log('click ', e);
    setCurrent(e.key);
  };

  return (

    // A horizontal antd menu with three items: "Chat", "Options" and "Info"
    // The chat window should be the default view

    <div className="App">

          <Menu
            items={items}
            onClick={onClick}
            selectedKeys={[current]}
            mode="horizontal"
          />
          {current === "chat" && <ChatArea setCurrent={setCurrent} />}
          {current === "settings" && <Options />}
          {current === "info" && <Info />}
    </div>
    /*
    <div className='App' >
    <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
    {current === 'chat' ? <ChatArea/>: <Options/>}
    </div>
    */
  );
};

export default App;
