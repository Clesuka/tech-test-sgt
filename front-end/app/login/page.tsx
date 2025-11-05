'use client';

import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase/firebase';
import { useRouter } from 'next/navigation';
import { Card, Form, Input, Button, message, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      setLoading(true);
      if (!auth) {
        message.error('Firebase is not configured. Check .env.local');
        setLoading(false);
        return;
      }
      await signInWithEmailAndPassword(auth as any, values.email, values.password);
      message.success('Login successful');
      router.push('/products');
    } catch (err: any) {
      console.error('Login error', err);
      message.error(err?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <div className="text-center mb-4">
          <Title level={3}>Sign in to your account</Title>
        </div>
        <Form name="login" layout="vertical" onFinish={onFinish}>
          <Form.Item name="email" rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'Please enter a valid email!' }]}>
            <Input prefix={<UserOutlined />} placeholder="Email" size="large" />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Sign in
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
