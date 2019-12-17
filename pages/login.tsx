/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import React, { useEffect, useReducer } from 'react';
import {
  FormGroup,
  InputGroup,
  Card,
  Elevation,
  Button,
  Classes,
} from '@yishanzhilu/blueprint-core';
import Link from 'next/link';
import cookie from 'js-cookie';
import { useLocalStore, useObserver } from 'mobx-react-lite';
import Validator from 'validatorjs';
import { axios } from '@/src/api';
import { redirect } from '@/src/utils/funcs';

interface ISendMottoButtonState {
  seconds: number;
  buttonStatus: 'ready' | 'sending' | 'countdown';
}

type ISendMottoButtonActions = {
  type: 'countdown' | 'sendEmail' | 'countdownEnd';
};

const countdownTotal = 60;

function sendMottoReducer(
  state: ISendMottoButtonState,
  action: ISendMottoButtonActions
) {
  switch (action.type) {
    case 'countdown':
      if (state.buttonStatus !== 'countdown') {
        // 首次触发倒计时，不减一
        return { seconds: state.seconds, buttonStatus: 'countdown' };
      }
      return { seconds: state.seconds - 1, buttonStatus: 'countdown' };
    case 'sendEmail':
      return { seconds: state.seconds, buttonStatus: 'sending' };
    case 'countdownEnd':
      return { seconds: countdownTotal, buttonStatus: 'ready' };
    default:
      throw new Error();
  }
}

function SendMottoButton({ email: { error, value: email } }) {
  const [state, dispatch] = useReducer(sendMottoReducer, {
    seconds: countdownTotal,
    buttonStatus: 'ready',
  });
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (state.buttonStatus === 'sending') {
      (async () => {
        try {
          await axios.post('/users/login', {
            email,
          });
          dispatch({ type: 'countdown' });
        } catch (err) {
          console.error(err);
          dispatch({ type: 'countdownEnd' });
        }
      })();
    } else if (state.buttonStatus === 'countdown') {
      if (state.seconds >= 0) {
        clearTimeout(interval);
        interval = setTimeout(() => {
          dispatch({ type: 'countdown' });
        }, 1000);
      } else {
        dispatch({ type: 'countdownEnd' });
      }
    }
    return () => {
      clearTimeout(interval);
    };
  }, [state]);

  return (
    <Button
      minimal
      intent="primary"
      onClick={() => {
        if (state.buttonStatus === 'ready' && !error)
          dispatch({ type: 'sendEmail' });
      }}
      disabled={state.buttonStatus !== 'ready' || error || !email}
      loading={state.buttonStatus === 'sending'}
    >
      {state.buttonStatus === 'countdown'
        ? `${state.seconds} 秒`
        : '获取验证格言'}
    </Button>
  );
}

function FormHeader() {
  return (
    <header>
      <Link href="/">
        <a>
          <img
            className={Classes.ELEVATION_2}
            src="/static/apple-touch-icon.png"
            alt="logo"
          />
        </a>
      </Link>
      <h1>移山</h1>
      <h2>规划工作学习的伙伴</h2>
      <style jsx>{`
        header {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 15px;
        }
        img {
          width: 64px;
          height: 64px;
          border-radius: 5px;
        }
        h1 {
          font-size: 32px;
          margin: 0;
          margin-top: 20px;
          line-height: 1.2;
          color: #262626;
          font-weight: 500;
        }
        h2 {
          color: #595959;
          margin: 0;
          margin-top: 18px;
          text-align: center;
          font-size: 16px;
          font-weight: 500;
        }
      `}</style>
    </header>
  );
}

const Login = (): React.ReactElement => {
  const login = useLocalStore(() => ({
    fields: {
      email: {
        value: '',
        error: false,
        rule: 'required|email',
      },
      motto: {
        value: '',
        error: false,
        rule: 'required',
      },
    },
    meta: {
      isValid: false,
      error: null,
    },
    handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      const field = e.target.id;
      login.fields[field].value = e.target.value;
    },
    handleBlur(e: React.FocusEvent<HTMLInputElement>) {
      const field = e.target.id;
      const { email, motto } = login.fields;
      const validation = new Validator(
        { email: email.value, motto: motto.value },
        { email: email.rule, motto: motto.rule }
      );
      validation.setAttributeNames({ email: '邮箱', motto: '邮箱' });
      login.meta.isValid = validation.passes() || false;
      login.fields[field].error = validation.errors.first(field);
    },
    async handelFormSubmit(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();
      if (!login.meta.isValid) {
        return;
      }
      try {
        const res = await axios.post<{ token: string; refreshToken: string }>(
          '/users/verify-motto',
          {
            email: login.fields.email.value,
            motto: login.fields.motto.value,
          }
        );
        localStorage.setItem(
          'everestRefreshToken',
          JSON.stringify(res.data.refreshToken)
        );
        cookie.set('everestToken', res.data.token, { expires: 30 });
        redirect('/workspace');
      } catch (error) {
        console.error(error);
      }
    },
  }));
  return useObserver(() => (
    <main>
      <div className="card-container">
        <Card elevation={Elevation.TWO} className="card">
          <form onSubmit={login.handelFormSubmit}>
            <FormHeader />
            <FormGroup labelFor="email" helperText={login.fields.email.error}>
              <InputGroup
                id="email"
                name="tai-email"
                placeholder="邮箱"
                leftIcon="envelope"
                autoComplete="tai-email"
                value={login.fields.email.value}
                onChange={login.handleChange}
                onBlur={login.handleBlur}
              />
            </FormGroup>
            <FormGroup labelFor="motto">
              <InputGroup
                id="motto"
                placeholder="验证格言"
                leftIcon="draw"
                autoComplete="off"
                rightElement={<SendMottoButton email={login.fields.email} />}
                value={login.fields.motto.value}
                onBlur={login.handleBlur}
                onChange={login.handleChange}
              />
            </FormGroup>
            <Button fill intent="primary" type="submit">
              登录
            </Button>
          </form>
        </Card>
      </div>
      <style jsx>
        {`
          main {
            background: #fafafa;
            padding-top: 100px;
            height: 100vh;
          }
          .card-container {
            width: 430px;
            margin: 0 auto;
          }
          form {
            margin: auto;
            padding: 20px 40px;
          }
        `}
      </style>
    </main>
  ));
};

export default Login;
