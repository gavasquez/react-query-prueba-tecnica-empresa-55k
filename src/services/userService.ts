
export const fecthUser = async ({ pageParam = 1 }: { pageParam: number | undefined | unknown }) => {
    return await fetch(`https://randomuser.me/api?results=10&seed=midudev&page=${pageParam}`)
        .then(async resp => {
            if (!resp.ok) throw new Error('Error');
            return await resp.json()
        })
        .then(resp => {
            const currrentPage = Number(resp.info.page);
            const nextCursor = currrentPage > 3 ? undefined : currrentPage + 1;
            return {
                users: resp.results,
                currrentPage,
                nextCursor,
            }
        });
}