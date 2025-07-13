import { type NextRequest } from 'next/server';

interface Params<T> {
  params: T;
}

export type TMiddleware = (req: NextRequest) => Promise<Response>;

export type TMiddlewareWParams<T> = (req: NextRequest, params: Promise<Params<T>>) => void;
