import type { PluginAPI, PluginThread } from '@ampcode/plugin';

export const description = 'Starts the guided blog publishing workflow.';

export default function (amp: PluginAPI) {
  amp.registerCommand(
    'publish-blog-post',
    {
      title: 'Publish an article',
      category: 'Blog',
      description: 'Ask for an article in chat, then build, deploy, and publish it unchanged.',
    },
    async (ctx) => {
      let thread: PluginThread;
      if (ctx.thread) {
        thread = ctx.thread;
      } else {
        thread = await amp.getBuiltinAgent('medium').createThread({ show: true });
      }

      await thread.appendUserMessage({
        type: 'user-message',
        content: `Load and follow the publishing-blog-post skill. I want to publish a new article. Ask me to paste the final article into this chat before doing anything else. Do not read from the clipboard.`,
      });

      await ctx.ui.notify('Paste the final article in the chat to continue.');
    },
  );
}
