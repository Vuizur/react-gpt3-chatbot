// An antd input form with editable fields for the following:
// - Api key
// - Starting prompt

import React, { useState } from 'react';
import './App.css';
import { Button, Form, Input, Layout, Menu, MenuProps } from 'antd';
import Cookies from 'js-cookie';


const defaultOptions = {
    apiKey: '',
    startingPrompt: 'A conversation between a man and a woman.'
}

const getStartingPrompt = () => {
    const prompt = Cookies.get('startingPrompt')
    console.log(prompt)
    if (prompt == null){
        return defaultOptions.startingPrompt
    } else{
        return prompt
    }
}

const Options = () => {


    //Starting prompt hook
    const [startingPrompt, setStartingPrompt] = useState(getStartingPrompt());

    //Api key hook
    const [apiKey, setApiKey] = useState(Cookies.get("apiKey") || "")


    const onFinish = (values: any) => {
        setStartingPrompt(values.startingPrompt)
        Cookies.set("startingPrompt", values.startingPrompt)
        setApiKey(values.apiKey)
        Cookies.set("apiKey", values.apiKey)
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{startingPrompt: startingPrompt}}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            <Form.Item
                label="Starting prompt"
                name="startingPrompt"
                rules={[{ message: 'Please input the starting prompt!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="OpenAI Api key"
                name="apiKey"
                rules={[{ required: true, message: 'Please input your API key!' }]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
};

export default Options;