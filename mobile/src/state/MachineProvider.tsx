import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from 'react';
import { initial, reducer, type Action, type Machine } from './machine';

const Ctx = createContext<[Machine, Dispatch<Action>] | null>(null);

export function MachineProvider({ children }: { children: ReactNode }) {
  return <Ctx.Provider value={useReducer(reducer, initial)}>{children}</Ctx.Provider>;
}

export function useMachine() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useMachine fuera de MachineProvider');
  return ctx;
}
