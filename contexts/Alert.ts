import React from 'react';
import { NotifyProps } from '../components/Notify';

export type Action =
    | {
          type: 'open';
          payload: NotifyProps;
      }
    | { type: 'close' };

export function reducer(state: NotifyProps, action: Action): NotifyProps {
    switch (action.type) {
        case 'open':
            return action.payload;
        case 'close':
            return { ...state, message: '' };
        default:
            // @ts-ignore
            throw new Error('Unsupported action.type = ' + action.type);
    }
}

const AlertContext = React.createContext<React.Dispatch<Action>>(() => {});

export default AlertContext;
