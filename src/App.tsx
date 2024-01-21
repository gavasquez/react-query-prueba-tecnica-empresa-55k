import { useMemo, useState } from 'react'
import './App.css'
import { SortBy, User } from './types.d';
import { UsersList } from './components/UsersList';
import { useUsers } from './hooks/useUsers';
import { Results } from './components/Results';
import { useMutation, useQueryClient } from '@tanstack/react-query';

function App() {

  const { isLoading, isError, refetch, hasNextPage, users, fetchNextPage, deleteUser } = useUsers();

  const [showColors, setShowColors] = useState(false);

  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE);

  const [filterCountry, setFilterCountry] = useState<string | null>(null);

  const queryClient = useQueryClient();


  const filteredUser = useMemo(() => {
    return typeof filterCountry === 'string' && filterCountry.length > 0
      ? users.filter((user) => {
        return user.location.country.toLowerCase().includes(filterCountry.toLowerCase());
      }) : users;
  }, [users, filterCountry]);


  const mutation = useMutation({
    mutationFn: deleteUser,
    onSuccess:async (newUsers) => {
      console.log(newUsers);
      await queryClient.setQueryData(['users'], (oldUser: User[]) => {
        return newUsers;
      })
    }
  });


  const sortedUsers = useMemo(() => {

    if (sorting === SortBy.COUNTRY) return filteredUser.toSorted((a, b) => a.location.country.localeCompare(b.location.country));

    if (sorting === SortBy.NAME) return filteredUser.toSorted((a, b) => a.name.first.toLowerCase().localeCompare(b.name.first.toLowerCase()));

    if (sorting === SortBy.LAST) return filteredUser.toSorted((a, b) => a.name.last.toLowerCase().localeCompare(b.name.last.toLowerCase()))

    return filteredUser;
  }, [filteredUser, sorting])

  const toogleShowColors = () => {
    setShowColors(!showColors);
  }

  const toogleSortByCountry = () => {
    const newSort = sorting == SortBy.NONE ? SortBy.COUNTRY : SortBy.NONE;
    setSorting(newSort);
  }

  const hanldeChangeSort = (sort: SortBy) => {
    setSorting(sort);
  }

  const handleDelete = (id: string) => {
    mutation.mutate(id);
  }

  const handleReset = async () => {
    await refetch();
  }

  return (
    <>
      <div>
        <h1>Prueba Tecnica</h1>
        <Results />
        <header>
          <button onClick={toogleShowColors}>Colorear Filas</button>
          <button onClick={toogleSortByCountry}>
            {
              sorting === SortBy.COUNTRY ? 'No Ordenar por País' : 'Ordenar por País'
            }
          </button>
          <button onClick={handleReset}>
            Resetear Estado
          </button>
          <input placeholder='Filtrar por País' onChange={(e) => {
            setFilterCountry(e.target.value);
          }} />
        </header>

        <main>
          {
            users.length > 0
            && <UsersList
              users={sortedUsers}
              showColors={showColors}
              deleteUser={handleDelete}
              hanldeChangeSort={hanldeChangeSort}
            />
          }
          {
            isLoading && <p>Cargando...</p>
          }
          {
            isError && <p>Hubo un error</p>
          }
          {
            !isLoading && !isError && users.length === 0 && <p>No hay Usuarios</p>
          }
          {
            !isLoading && !isError && hasNextPage && <button onClick={() => fetchNextPage()}>Cargar mas resultados</button>
          }

          {
            !isLoading && !isError && !hasNextPage && <p>No hay mas resultados</p>
          }


        </main>

      </div>
    </>
  )
}

export default App
