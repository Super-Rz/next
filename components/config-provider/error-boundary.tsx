import * as React from 'react';
import { Component, ErrorInfo, ReactNode, ReactElement } from 'react';
import * as PropTypes from 'prop-types';
import { ErrorBoundaryConfig } from './types';

function DefaultUI() {
    // fixme: string is not a valid react component return type
    return '' as unknown as ReactElement;
}

DefaultUI.propTypes = {
    error: PropTypes.object,
    errorInfo: PropTypes.object,
};

export interface ErrorBoundaryProps extends ErrorBoundaryConfig {
    children?: ReactNode;
}

interface ErrorBoundaryState {
    error?: Error | null;
    errorInfo?: ErrorInfo | null;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    static propTypes = {
        children: PropTypes.element,
        /**
         * 捕获错误后的自定义处理, 比如埋点上传
         * @param {Object} error 错误
         * @param {Object} errorInfo 错误详细信息
         */
        afterCatch: PropTypes.func,
        /**
         * 捕获错误后的展现 自定义组件
         * @param {Object} error 错误
         * @param {Object} errorInfo 错误详细信息
         * @returns {Element} 捕获错误后的处理
         */
        fallbackUI: PropTypes.func,
    };

    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { error: null, errorInfo: null };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo,
        });

        const { afterCatch } = this.props;

        if (typeof afterCatch === 'function') {
            afterCatch(error, errorInfo);
        }
    }

    render() {
        const { fallbackUI: FallbackUI = DefaultUI } = this.props;

        if (this.state.errorInfo) {
            return <FallbackUI error={this.state.error!} errorInfo={this.state.errorInfo} />;
        }
        // Normally, just render children
        return this.props.children;
    }
}