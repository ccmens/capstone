import { Button, Result } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

export default function ErrorPage403() {
  return (
    <Result
      status="403"
      title="403"
      subTitle="Sorry, you don't have access to this page."
      extra={
        <Link to="/login">
          <Button type="primary">
            Login
          </Button>
        </Link>
      }
    />
  );
}