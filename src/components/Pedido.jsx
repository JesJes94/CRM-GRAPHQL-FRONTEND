import { useState, useEffect } from 'react'
import { useMutation, gql } from '@apollo/client'

import Swal from 'sweetalert2'

const ACTUALIZAR_ESTADO = gql`
    mutation actualizarEstado($id: ID!, $input: PedidoInput) {
        actualizarEstado(id: $id, input: $input) {
            estado
        }
    }
`

const ELIMINAR_PEDIDO = gql`
    mutation eliminarPedido($id: ID!, $cancelado: Boolean) {
        eliminarPedido(id: $id, cancelado: $cancelado) 
    }
`

const OBTENER_PEDIDOS = gql`
    query obtenerPedidosVendedor {
        obtenerPedidosVendedor {
            id
        }
    }
`

const Pedido = ({pedido}) => {

    const {id, cliente: {nombre, apellido, email, telefono}, total, estado, cliente} = pedido

    const [actualizarEstado] = useMutation(ACTUALIZAR_ESTADO);

    const [eliminarPedido] = useMutation(ELIMINAR_PEDIDO, {
        update(cache) {
            const { obtenerPedidosVendedor } = cache.readQuery({ query: OBTENER_PEDIDOS })

            cache.writeQuery({
                query: OBTENER_PEDIDOS,
                data: {
                    obtenerPedidosVendedor: obtenerPedidosVendedor.filter(pedido => pedido.id !== id)
                }
            })
        }
    });

    const [estadoPedido, setEstadoPedido] = useState(estado)
    const [clase, setClase] = useState('')

    useEffect( () => {
        if(estadoPedido) {
            setEstadoPedido(estadoPedido);
        }
        clasePedido();

    }, [estadoPedido])

    const clasePedido = () => {
        switch(estadoPedido) {
            case 'Pendiente': 
                setClase('border-yellow-500');
                break;
            case 'Completado':
                setClase('border-green-500');
                break;
            default:
                setClase('border-red-800')
        }
    }

    const cambiarEstadoPedido = async estado => {
        try {
            const {data} = await actualizarEstado({
                variables: {
                    id,
                    input: {
                        cliente: cliente.id,
                        estado
                    }
                }
            })
            setEstadoPedido(data.actualizarEstado.estado)
        } catch (error) {
            console.log(error);
        }
    }

    const confirmarEliminarPedido = () => {
        Swal.fire({
            title: "¿Estás seguro de eliminar el pedido?",
            text: "La acción no se puede deshacer",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#075985",
            cancelButtonColor: "#991b1b",
            confirmButtonText: "Eliminar",
            cancelButtonText: 'Cancelar'
          }).then(async (result) => {
            if (result.isConfirmed) {

                try {

                    if(estadoPedido === 'Cancelado') {
                        const {data} = await eliminarPedido({
                            variables: {
                                id,
                                cancelado: true
                            }
                        })

                        Swal.fire({
                            title: "Correcto",
                            text: data.eliminarPedido,
                            icon: "success"
                          });

                    } else {
                        const {data} = await eliminarPedido({
                            variables: {
                                id
                            }
                        })

                        Swal.fire({
                            title: "Correcto",
                            text: data.eliminarPedido,
                            icon: "success"
                          });
                    }

                } catch (error) {
                    console.log(error)
                }
            }
          });
    }

  return (
    <div className= {`mt-5 bg-white rounded p-6 md:grid md:grid-cols-2 md:gap-4 shadow-lg border-l-8 ${clase}`}>
      <div>
        <p className=' font-bold text-gray-800'>Cliente: {nombre} {apellido}</p>

        <p className='flex gap-2 items-center my-2'>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
        </svg>

            {email}
        </p>

        {telefono && 
            <p className='flex gap-2 items-center my-2'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                </svg>

                {telefono}
            </p>
        }

        <h2 className=' text-gray-800 font-bold mt-10'>Estado Pedido: </h2>

        <select
            className='mt-2 appearance-none bg-blue-600 border border-blue-600 text-white p-2 text-center rounded leading-tight focus:outline-none focus:bg-blue-500 focus:border-blue-600 uppercase text-sm font-bold'
            value={estadoPedido}
            onChange={e => cambiarEstadoPedido(e.target.value)}
        >
            <option value='Completado'>Completado</option>
            <option value='Pendiente'>Pendiente</option>
            <option value='Cancelado'>Cancelado</option>
        </select>
      </div>

      <div>
        <h2 className='font-bold text-gray-800'>
            Resumen del pedido
        </h2>

        {pedido.pedido.map(articulo => (
            <div key={articulo.id} className=' mt-5'>
                <p className=' text-sm text-gray-600'>Producto: {articulo.nombre}</p>
                <p className=' text-sm text-gray-600'>Cantidad: {articulo.cantidad}</p>
            </div>
        ))}

        <p className=' text-gray-800 mt-3 font-bold'>Total a pagar: {''} 
            <span className='font-light'>${total}</span>
        </p>

        <button
            className={`flex gap-2 items-center py-2 px-4 text-white bg-red-800 rounded-md font-bold uppercase text-xs mt-3 ${estadoPedido === 'Pendiente' ? ' cursor-not-allowed opacity-50' : ''}`}
            onClick={() => confirmarEliminarPedido()}
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>

            Eliminar Pedido
        </button>
      </div>  
    </div>
  )
}

export default Pedido
