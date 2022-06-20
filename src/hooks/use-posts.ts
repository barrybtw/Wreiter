import { trpc } from "../utils/trpc";

export default async function usePosts() {
  const posts = trpc.useQuery(["get-posts"]);

  return posts;
}
