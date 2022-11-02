// An antd input form with editable fields for the following:
// - Api key
// - Starting prompt

import React, { useState } from 'react';
import './App.css';
import { Button, Checkbox, Form, Input, Layout, Menu, MenuProps } from 'antd';
import Cookies from 'js-cookie';
import defaultSettings from './characters';


const defaultOptions = {
    apiKey: '',
    startingPrompt: 'A conversation between a man and a woman.'
}

const getStartingPrompt = () => {
    const prompt = Cookies.get('startingPrompt')
    console.log(prompt)
    if (prompt == null) {
        return defaultOptions.startingPrompt
    } else {
        return prompt
    }
}

const Options = () => {


    //Starting prompt hook
    const [startingPrompt, setStartingPrompt] = useState(getStartingPrompt());

    //Api key hook
    const [apiKey, setApiKey] = useState(Cookies.get("apiKey") || "")

    const [userPrefix, setUserPrefix] = useState(Cookies.get("userPrefix") || defaultSettings.USER_PREFIX)
    const [AIPrefix, setAIPrefix] = useState(Cookies.get("AIPrefix") || defaultSettings.AI_PREFIX)
    const [language, setLanguage] = useState(Cookies.get("language") || defaultSettings.LANGUAGE)
    const [correctErrors, setCorrectErrors] = useState(JSON.parse(Cookies.get("correctErrors") || "false"))

    console.log("User prefix", Cookies.get("userPrefix"))
    const onFinish = (values: any) => {
        setStartingPrompt(values.startingPrompt)
        Cookies.set("startingPrompt", values.startingPrompt, {expires: 365})
        setApiKey(values.apiKey)
        Cookies.set("apiKey", values.apiKey, {expires: 365})
        setUserPrefix(values.userPrefix)
        Cookies.set("userPrefix", values.userPrefix, {expires: 365})
        setAIPrefix(values.AIPrefix)
        Cookies.set("AIPrefix", values.AIPrefix, {expires: 365})
        setLanguage(values.language)
        Cookies.set("language", values.language, {expires: 365})
        setCorrectErrors(values.correctErrors)
        Cookies.set("correctErrors", values.correctErrors, {expires: 365})
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
            initialValues={{ startingPrompt: startingPrompt, apiKey: apiKey, userPrefix: userPrefix, AIPrefix: AIPrefix, correctErrors: correctErrors, language: language }}
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
                label="User prefix"
                name="userPrefix"
                rules={[{ message: 'Please input the user prefix!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="AI prefix"
                name="AIPrefix"
                rules={[{ message: 'Please input the AI prefix!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Language"
                name="language"
                rules={[{ message: 'Please input language' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item name="correctErrors" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
                <Checkbox checked={correctErrors}>Correct errors in the user's writing</Checkbox>
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