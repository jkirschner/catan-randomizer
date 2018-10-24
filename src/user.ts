export async function preSignUp(ev: any, context: any, callback: any) {
  console.log(JSON.stringify(ev));
  context.callbackWaitsForEmptyEventLoop = false;
  ev.response.autoConfirmUser = true;
  return context.done(undefined, ev);
}
