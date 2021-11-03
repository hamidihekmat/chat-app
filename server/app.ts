import { Application, Router } from 'https://deno.land/x/oak/mod.ts';
import { chatConnection } from './ws/chatRoom.ts';

const router = new Router();
export const messages: string[] = [];

router.get('/', async (ctx) => {
  ctx.response.body = await { message: 'Welcome', status: 'Running!' };
});

router.get('/messages', (ctx) => {
  ctx.response.body = messages;
});

router.post('/messages', async (ctx) => {
  const message = await ctx.request.body().value;
  messages.push(message);
});

router.get('/ws', async (ctx) => {
  const socket = await ctx.upgrade();
  chatConnection(socket);
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());
await app.listen({ port: 8000 });
