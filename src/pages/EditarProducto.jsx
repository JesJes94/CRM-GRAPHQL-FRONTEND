import React from 'react'

import { useParams, useLocation, useNavigate } from 'react-router-dom'

import { useQuery, useMutation, gql } from '@apollo/client';
import { Formik } from 'formik';
import * as Yup from 'yup'

import Swal from 'sweetalert2'
import Spinner from '../components/Spinner';

const OBTENER_PRODUCTO = gql`
    query obtenerProducto($id: ID!) {
        obtenerProducto(id: $id) {
            nombre
            cantidad
            precio
        }
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
const ACTUALIZAR_PRODUCTO = gql`
    mutation actualizarProducto($id: ID!, $input: ProductoInput) {
        actualizarProducto(id: $id, input: $input) {
            nombre
            cantidad
            precio
        }
    }
`

const EditarProducto = () => {

    const navigate = useNavigate();

    const {id} = useParams();

    const {pathname} = useLocation();
    localStorage.setItem('lastpath', pathname)

    const schemaValidation = Yup.object({
        nombre: Yup.string()
          .required('El nombre del producto es obligatorio'),
        cantidad: Yup.number().
          required('Agrega una cantidad disponible').
          positive('No se aceptan valores negativos').integer('La cantidad deben ser numeros enteros'),
        precio: Yup.number()
          .required('El precio del producto es obligatorio')
          .positive('No se aceptan números negativos')
    })

    const {data, loading, error} = useQuery(OBTENER_PRODUCTO, {
        variables: {
            id
        }
    });

    const [ actualizarProducto ] = useMutation(ACTUALIZAR_PRODUCTO, {
        update(cache, {data: {actualizarProducto}}) {

            const {obtenerProductos} = cache.readQuery({ query: OBTENER_PRODUCTOS })

            cache.writeQuery({
                query: OBTENER_PRODUCTOS,
                data: {
                    obtenerProductos: obtenerProductos.map(productoState => 
                        productoState.id === id ? actualizarProducto : productoState
                    )
                }
            })

            cache.writeQuery({
                query: OBTENER_PRODUCTO,
                variables: {id},
                data: {
                    obtenerProducto: actualizarProducto
                }
            })
        } 
    })

    if(loading) return <Spinner />

    const { obtenerProducto } = data;

    const modificarProducto = async valores => {
        
        const {nombre, cantidad, precio} = valores

        try {
            await actualizarProducto({
                variables: {
                    id,
                    input: {
                        nombre,
                        cantidad,
                        precio
                    }
                }
            })

            Swal.fire({
                title: "Actualizado",
                text: "El producto se actualizo correctamente",
                icon: "success"
            })

            navigate('/usuario/productos')
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <>
      <h1 className=' text-gray-800 text-2xl'>Editar Producto</h1>

      <div className=' flex justify-center mt-5'>
        <div className='w-full max-w-lg'>

            <Formik
                validationSchema={schemaValidation}
                enableReinitialize
                initialValues={obtenerProducto}
                onSubmit={valores => {
                    modificarProducto(valores);
                }}
            >
                { props => {
                    return (
                        <form className=' bg-white shadow-md p-8 mt-4'
                            onSubmit={props.handleSubmit}
                        >
                            <div className=' mb-5'>
                            <label className=' block text-gray-700 text-sm font-bold mb-4'
                                htmlFor="nombre">
                                Nombre
                            </label>
                            <input
                                id='nombre'
                                className=' shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                type='text'
                                placeholder='Nombre Producto'
                                value={props.values.nombre}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                            />
                            </div>

                            {props.touched.nombre && props.errors.nombre ? (
                                <div className='mt-2 mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                    <p className=' font-bold'>Error</p>
                                    <p>{props.errors.nombre}</p>
                                </div>
                            ) : null}

                            <div className=' mb-5'>
                            <label className=' block text-gray-700 text-sm font-bold mb-4'
                                htmlFor="cantidad">
                                Cantidad
                            </label>
                            <input
                                id='cantidad'
                                className=' shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                type='number'
                                placeholder='Cantidad Producto'
                                value={props.values.cantidad}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                            />
                            </div>

                            {props.touched.cantidad && props.errors.cantidad ? (
                                <div className='mt-2 mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                    <p className=' font-bold'>Error</p>
                                    <p>{props.errors.cantidad}</p>
                                </div>
                            ) : null}

                            <div className=' mb-5'>
                            <label className=' block text-gray-700 text-sm font-bold mb-4'
                                htmlFor="precio">
                                Precio
                            </label>
                            <input
                                id='precio'
                                className=' shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                type='number'
                                placeholder='Precio Producto'
                                value={props.values.precio}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                            />
                            </div>

                            {props.touched.precio && props.errors.precio ? (
                                <div className='mt-2 mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                    <p className=' font-bold'>Error</p>
                                    <p>{props.errors.precio}</p>
                                </div>
                            ) : null}

                            <input 
                            type='submit'
                            className=' bg-gray-800 w-full mt-5 py-2 px-4 text-white uppercase font-bold hover:bg-gray-900 transition-colors rounded-sm'
                            value=' Editar Producto'
                            />
                        </form>
                    )
                }}
            </Formik>
        </div>
      </div>
    </>
  )
}

export default EditarProducto
