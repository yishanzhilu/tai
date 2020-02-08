/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import * as React from 'react';

interface IProps {
  fallback: React.ReactElement;
}

interface IState {
  hasError: boolean;
  error?: Error;
}

export class TaiErrorBoundary extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error('TaiErrorBoundary componentDidCatch', error, errorInfo);
  }

  render() {
    const { hasError, error } = this.state;
    const { fallback, children } = this.props;

    if (hasError) {
      const fallbackWithError = React.cloneElement(fallback, {
        message: error.message,
      });
      return fallbackWithError;
    }
    return children;
  }
}
