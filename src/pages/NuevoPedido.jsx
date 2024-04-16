import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import usePedidos from "../hooks/usePedidos";
import { useMutation, useQuery, gql } from "@apollo/client";
import Swal from 'sweetalert2'

import AsignarCliente from "../components/pedidos/AsignarCliente"
import AsignarProductos from "../components/pedidos/AsignarProductos";
import ResumenPedido from "../components/pedidos/ResumenPedido";
import Total from '../components/pedidos/Total'

const NUEVO_PEDIDO = gql`
  mutation nuevoPedido($input: PedidoInput) {
    nuevoPedido(input: $input) {
      id
      pedido {
        nombre
        cantidad
      }
      total
      cliente {
        nombre
        apellido
        email
        telefono
      }
      vendedor
      estado
    }
  }
`
const OBTENER_PEDIDOS = gql`
  query obtenerPedidosVendedor {
    obtenerPedidosVendedor {
      id
      pedido {
        nombre
        cantidad
      }
      total
      cliente {
        nombre
        apellido
        email
        telefono
      }
      vendedor
      estado
    }
  }
`

const NuevoPedido = () => {

  const [alerta, setAlerta] = useState('')

  const navigate = useNavigate();

  const {pedido: {productos, cliente, total}} = usePedidos();

  const {pathname} = useLocation();
  localStorage.setItem('lastpath', pathname);

  const [nuevoPedido] = useMutation(NUEVO_PEDIDO, {
    update(cache, {data: {nuevoPedido}}) {

      const { obtenerPedidosVendedor } = cache.readQuery({query: OBTENER_PEDIDOS});

      cache.writeQuery({
        query: OBTENER_PEDIDOS,
        data: {
          obtenerPedidosVendedor: [...obtenerPedidosVendedor, nuevoPedido]
        }
      })
    }
  });

  const validarPedido = () => {
    return !productos.every(producto => producto.cantidad > 0) || total === 0 || !cliente?.id ? 'opacity-50 cursor-not-allowed' : ''
  }

  const pedido = productos.map(({__typename, ...producto }) => producto)

  const crearNuevoPedido = async () => {

    try {
      const {data} = await nuevoPedido({
        variables: {
          input: {
            cliente: cliente.id,
            pedido,
            total
          }
        }
      })

      Swal.fire({
        title: 'Correcto',
        text: 'El pedido se registro correctamente',
        icon: 'success'
      })

      navigate('/usuario/pedidos')

    } catch (error) {
      setAlerta(error.message.replace('GraphQL error: ', ''))

      setTimeout(() => {
        setAlerta('')
      }, 3000);
    }
  }

  const mostrarMensaje = () => {
    return (
      <div className="bg-white py-2 px-3 max-w-sm text-center mx-auto mt-5">
        <p className='text-center text-gray-800 text-sm uppercase font-bold'>{alerta}</p>
      </div>
    )
  }

  const {data, loading, error} = useQuery(OBTENER_PEDIDOS);

  if(loading) return ''

  return (
    <div>
      <h2 className='text-2xl text-gray-800'>Crear Nuevo Pedido</h2>

      {alerta && mostrarMensaje()}

      <div className=" flex justify-center">
        <div className="w-full max-w-lg mt-10">
          <AsignarCliente />
          <AsignarProductos />
          <ResumenPedido />
          <Total />

          <div className=" flex justify-center">
            <button
              type="button"
              className={`bg-gray-800 w-full max-w-lg mt-10 p-2 text-white uppercase font-bold hover:bg-gray-900 ${validarPedido()}`}
              onClick={() => crearNuevoPedido()}
            >
              Registrar Pedido
            </button>
          </div>
        </div>
      </div>
      
    </div>
  )
}

export default NuevoPedido
