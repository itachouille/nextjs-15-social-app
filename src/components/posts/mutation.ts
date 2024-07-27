import { useToast } from "../ui/use-toast";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { deletePost } from "./action";
import { PostsPage } from "@/lib/types";

export function useDeletePostMutation() {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const router = useRouter();
  const pathname = usePathname();

  const mutation = useMutation({
    mutationFn: deletePost,
    onSuccess: async (deletePost) => {
      const queryFilter: QueryFilters = { queryKey: ["post-feed"] };

      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        queryFilter,
        (oldData) => {
          if (!oldData) return;

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              nextCursor: page.nextCursor,
              posts: page.posts.filter((p) => p.id !== deletePost.id),
            })),
          };
        },
      );

      toast({
        description: "Post deleted",
      });

      if (pathname === `/posts/${deletePost.id}`) {
        router.push(`/users/${deletePost.user.username}`);
      }
    },
    onError(error) {
      console.log(error),
        toast({
          variant: "destructive",
          description: "Failed to delete post. Please trty again.",
        });
    },
  });

  return mutation;
}
