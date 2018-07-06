const MESSAGE_SUBSCRIPTION = 'message_subscription';
const MESSAGES_SUBSCRIPTION = 'messages_subscription';

export default pubsub => ({
  Query: {
    messages(obj, args, context) {
      return context.Chat.getMessages();
    },
    message(obj, { id }, context) {
      return context.Chat.message(id);
    }
  },
  Mutation: {
    async addMessage(obj, { input }, context) {
      const userId = context.user ? context.user.id : null;
      const [id] = await context.Chat.addMessage({ ...input, userId });
      const message = await context.Chat.message(id);
      // publish for message list
      pubsub.publish(MESSAGES_SUBSCRIPTION, {
        messagesUpdated: {
          mutation: 'CREATED',
          id,
          node: message
        }
      });
      return message;
    },
    async deleteMessage(obj, { id }, context) {
      const message = await context.Chat.message(id);
      const isDeleted = await context.Chat.deleteMessage(id);
      if (isDeleted) {
        // publish for message list
        pubsub.publish(MESSAGES_SUBSCRIPTION, {
          messagesUpdated: {
            mutation: 'DELETED',
            id,
            node: message
          }
        });
        return { id: message.id };
      } else {
        return { id: null };
      }
    },
    async editMessage(obj, { input }, context) {
      await context.Chat.editMessage(input);
      const message = await context.Chat.message(input.id);
      // publish for post list
      pubsub.publish(MESSAGES_SUBSCRIPTION, {
        messagesUpdated: {
          mutation: 'UPDATED',
          id: message.id,
          node: message
        }
      });

      // publish for edit post page
      pubsub.publish(MESSAGE_SUBSCRIPTION, { messagesUpdated: message });
      return message;
    }
  },
  Subscription: {
    messagesUpdated: {
      subscribe: () => pubsub.asyncIterator(MESSAGES_SUBSCRIPTION)
    }
  }
});