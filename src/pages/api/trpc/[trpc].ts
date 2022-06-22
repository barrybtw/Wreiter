import * as trpcNext from "@trpc/server/adapters/next";
import superjson from "superjson";
import { prisma } from "../../../server/db";
import { z } from "zod";
import { createContext } from "../../../server/context";
import { createRouter } from "../../../server/create-router";
import { resolve } from "path";

export const appRouter = createRouter()
  .transformer(superjson)
  .query("get-posts", {
    async resolve() {
      const posts = await prisma.post.findMany();
      return posts;
    },
  })
  .mutation("create-post", {
    input: z.object({
      title: z.string(),
      content: z.string(),
      published: z.boolean(),
      authorId: z.string(),
    }),
    resolve({ input }) {
      prisma.post.create({
        data: {
          title: input.title,
          content: input.content,
          published: input.published,
          authorId: input.authorId,
        },
      });
    },
  });

// export type definition of API
export type AppRouter = typeof appRouter;

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: createContext,
});
