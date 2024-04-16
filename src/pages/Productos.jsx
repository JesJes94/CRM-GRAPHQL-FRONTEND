import React from 'react'
import { useQuery, gql } from '@apollo/client';
import { useLocation, Link } from 'react-router-dom';

import Spinner from '../components/Spinner';
import Producto from '../components/Producto';

const OBTENER_PRODUCTOS = gql`
    query obtenerProductos {
      obtenerProductos {
        id
        nombre
        cantidad
        precio
      }
    }
`

const Productos = () => {

  const {pathname} = useLocation();
  localStorage.setItem('lastpath', pathname);

  const {data, loading, error} = useQuery(OBTENER_PRODUCTOS);

  if(loading) return <Spinner />

  return (
    <div>
      <h1 className='  text-gray-800 text-2xl'>Productos</h1>

      <Link to='/usuario/nuevoproducto'
        className='bg-sky-800 py-2 px-5 mt-3 inline-block text-white text-xs font-bold rounded-md hover:bg-gray-800 transition-colors'
      >
        Nuevo Producto
      </Link>

      <table className=' table-auto shadow-md mt-10 w-full w-lg'>
        <thead className=' bg-gray-800'>
          <tr className=' text-white'>
            <th className='w-1/5 py-2'>Nombre</th>
            <th className='w-1/5 py-2'>Cantidad</th>
            <th className='w-1/5 py-2'>Precio</th>
            <th className='w-1/5 py-2'>Opciones</th>
          </tr>
        </thead>

        <tbody className=' bg-white'>
          {data.obtenerProductos.map(producto => (
            <Producto 
              producto={producto}
              key={producto.id}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Productos
