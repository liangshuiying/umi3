export async function dispatchWrap<R = void>(dispatch: Function, type: string, payload: any = {}): Promise<R> {
  const p = dispatch as Dispatch;
  return await p({ type, payload });
}
