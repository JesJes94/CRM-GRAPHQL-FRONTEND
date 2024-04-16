import React from 'react'
import { useLocation, Link } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client'

import Spinner from '../components/Spinner';
import Pedido from '../components/Pedido';

const OBTENER_PEDIDOS_VENDEDOR = gql`
  query obtenerPedidosVendedor {
    obtenerPedidosVendedor {
      id
      pedido {
        cantidad
        nombre
      }
      total
      cliente {
        id 
        nombre
        apellido
        email
        telefono
      }
      estado
    }
  }
`

const Pedidos = () => {

  const {pathname} = useLocation();
  localStorage.setItem('lastpath', pathname);

  const {data, loading, error} = useQuery(OBTENER_PEDIDOS_VENDEDOR);

  if(loading) return <Spinner />

  const { obtenerPedidosVendedor } = data;

  return (
    <div>
      <h2 className=' text-gray-800 text-2xl'>Desde Pedidos</h2>

      <Link to='/usuario/nuevopedido'
        className='bg-sky-800 py-2 px-5 mt-3 inline-block text-white text-xs font-bold rounded-md hover:bg-gray-800 transition-colors'
      >
        Nuevo Pedido
      </Link>

      {obtenerPedidosVendedor.length > 0 ? 
       (
        obtenerPedidosVendedor.map(pedido => (
          <Pedido 
            pedido={pedido}
            key={pedido.id}
          />
        ))
       ) : (
        <p className='mt-5 text-center text-2xl'>Aún no hay pedidos</p>
       )
      }
    </div>
  )
}

export default Pedidos
