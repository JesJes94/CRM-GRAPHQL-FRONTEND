import {useQuery, gql} from '@apollo/client'
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

import Cliente from '../components/Cliente';

import Spinner from '../components/Spinner';

const OBTENER_CLIENTES_USUARIO = gql`
  query obtenerClientesVendedor {
    obtenerClientesVendedor {
      id
      nombre
      apellido
      empresa
      email
    }
  }   
`

const Clientes = () => {

  const {data, loading, error} = useQuery(OBTENER_CLIENTES_USUARIO);

  const {pathname} = useLocation();
  localStorage.setItem('lastpath', pathname);

  return (
    <>
      {loading ? 
        
        <Spinner /> 
      
      : (
        <>
          <h1 className=' text-gray-800 text-2xl'>Clientes</h1>

          <Link to='/usuario/nuevocliente'
            className='bg-sky-800 py-2 px-5 mt-3 inline-block text-white text-xs font-bold rounded-md hover:bg-gray-800 transition-colors'
          >
            Nuevo Cliente
          </Link>

          <table className='table-auto shadow-md mt-10 w-full w-lg'>
              <thead className=' bg-gray-800'>
                  <tr className='text-white'>
                  <th className=' w-1/5 py-2'>Nombre</th>
                  <th className=' w-1/5 py-2'>Empresa</th>
                  <th className=' w-1/5 py-2'>Email</th>
                  <th className=' w-1/5 py-2'>Opciones</th>
                  </tr>
              </thead>

              <tbody className='bg-white'>
                  {data.obtenerClientesVendedor.map((cliente) => (
                      <Cliente 
                        cliente={cliente}
                        key={cliente.id}
                      />
                  ))}
              </tbody>
          </table>
        </>
      )}
    </>
  )
}

export default Clientes
