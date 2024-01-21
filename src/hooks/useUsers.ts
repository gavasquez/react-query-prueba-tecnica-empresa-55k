import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { fecthUser } from '../services/userService';
import { type User } from '../types.d';

export const useUsers = () => {
    const { isLoading, isError, data, hasNextPage, refetch, fetchNextPage,  } = useInfiniteQuery<{ nextCursor?: number, users: User[] }>({
        queryKey: ['users'],
        queryFn: ({ pageParam }) => fecthUser({ pageParam }),
        initialPageParam: 1,
        getNextPageParam: (lasPage) => lasPage.nextCursor,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5
    });

    const deleteUser =async (id: string) => {
        return await data?.pages[0].users.filter((user) => {
            if(id !== user.login.uuid){
                return user;
            }
        })
    }


    return {
        isLoading,
        isError,
        //* flatMap sirve para aplanar o concatenar un array
        users: data?.pages.flatMap(page => page.users) ?? [],
        hasNextPage,
        refetch,
        fetchNextPage,
        deleteUser
    }
}
