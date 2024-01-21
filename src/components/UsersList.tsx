import { SortBy, type User } from '../types.d'

interface Props {
    users: User[],
    showColors: boolean,
    deleteUser: (id: string) => void,
    hanldeChangeSort: (sort: SortBy) => void,
}

export const UsersList = ({ users, showColors, deleteUser, hanldeChangeSort }: Props) => {
    return (
        <table width='100%'>
            <thead>
                <tr>
                    <th>Foto</th>
                    <th className='pointer' onClick={() => hanldeChangeSort(SortBy.NAME)}>Nombre</th>
                    <th className='pointer' onClick={() => hanldeChangeSort(SortBy.LAST)}>Apellido</th>
                    <th className='pointer' onClick={() => hanldeChangeSort(SortBy.COUNTRY)}>País</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody className={showColors ? 'table--showColors' : 'table'}>
                {
                    users.map((user,) => {
                        //* 1 Forma de hacer
                        /* const backgroundColor = index % 2 === 0 ? '#333' : '#555';
                        const color = showColors ? backgroundColor : 'transparent'; */
                        {/* <tr key={user.login.uuid} style={{ backgroundColor: color }}> */ }
                        return (
                            <tr key={user.login.uuid}>
                                <td>
                                    <img src={user.picture.thumbnail} />
                                </td>
                                <td>{user.name.first}</td>
                                <td>{user.name.last}</td>
                                <td>{user.location.country}</td>
                                <td>
                                    <button onClick={() => deleteUser(user.login.uuid)}>Eliminar</button>
                                </td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
    )
}
