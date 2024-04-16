import React from 'react'
import { useMutation, gql } from '@apollo/client'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

const ELIMINAR_PRODUCTO = gql`
    mutation eliminarProducto($id: ID!) {
        eliminarProducto(id: $id)
    }
`

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

const Producto = ({producto}) => {

    const navigate = useNavigate();

    const {nombre, cantidad, precio, id} = producto

    const [eliminarProducto] = useMutation(ELIMINAR_PRODUCTO, {
        update(cache) {

            const {obtenerProductos} = cache.readQuery({ query: OBTENER_PRODUCTOS})

            cache.writeQuery({
                query: OBTENER_PRODUCTOS,
                data: {
                    obtenerProductos: obtenerProductos.filter(productoState => productoState.id !== id)
                }
            })

        }
    })

    const confirmarEliminarProducto = id => {
        Swal.fire({
            title: "¿Estás seguro de eliminar el producto?",
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

                    const { data } = await eliminarProducto({
                        variables: {
                            id
                        }
                    })

                    Swal.fire({
                        title: "Correcto",
                        text: data.eliminarProducto,
                        icon: "success"
                      });
                } catch (error) {
                    console.log(error)   
                }
            }
          });
    }

    const editarProducto = id => {
        navigate(`/usuario/editarproducto/${id}`)
    }

  return (
    <>
        <tr>
            <td className='border px-4 py-2'>{nombre}</td>
            <td className='border px-4 py-2'>{cantidad}</td>
            <td className='border px-4 py-2'>{precio}</td>
            <td className='border px-4 py-2 flex justify-between'>
                <button
                    type='button'
                    className='flex gap-2 items-center py-2 px-4 text-white bg-red-800 rounded-md font-bold uppercase text-xs'
                    onClick={() => confirmarEliminarProducto(id)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>

                    Eliminar
                </button>

                <button
                    type='button'
                    className='flex gap-2 items-center py-2 px-4 text-white bg-green-600 rounded-md font-bold uppercase text-xs'
                    onClick={() => editarProducto(id)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                    </svg>

                    Editar
                </button>
            </td>
        </tr>
    </>
  )
}

export default Producto
