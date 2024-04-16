import React from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2' 
import { useQuery, useMutation, gql } from '@apollo/client';
import { Formik } from 'formik'
import * as Yup from 'yup'

import Spinner from '../components/Spinner';

const OBTENER_CLIENTE = gql`
    query obtenerCliente($id: ID!) {
        obtenerCliente(id: $id) {
            nombre,
            apellido,
            email,
            empresa,
            telefono
        }
    }
`

const ACTUALIZAR_CLIENTE = gql`
    mutation actualizarCliente($id: ID!, $input: ClienteInput) {
        actualizarCliente(id: $id, input: $input) {
            nombre
            email
        }
    }
`

const OBTENER_CLIENTES_USUARIO = gql`
  query obtenerClientesVendedor {
    obtenerClientesVendedor {
      nombre
      apellido
      empresa
      email
    }
  }   
`

const EditarCliente = () => {

    const {id} = useParams();

    const navigate = useNavigate();

    const {pathname} = useLocation();
    localStorage.setItem('lastpath', pathname);

    const schemaValidation = Yup.object({
        nombre: Yup.string()
                .required('El nombre del cliente es obligatorio'),
        apellido: Yup.string()
                    .required('El apellido del cliente es obligatorio'),
        empresa: Yup.string()
                    .required('La empresa del cliente es obligatoria'),
        email: Yup.string()
                    .email('EL email no es válido')
                    .required('El email es obligatorio')   
    })

    const {data, loading, error} = useQuery(OBTENER_CLIENTE, {
        variables: {
            id
        }
    });

    const [actualizarCliente] = useMutation(ACTUALIZAR_CLIENTE, {
        update(cache, {data: {actualizarCliente}}) {

        const { obtenerClientesVendedor } = cache.readQuery({query: OBTENER_CLIENTES_USUARIO})

        cache.writeQuery({
            query: OBTENER_CLIENTES_USUARIO,
            data: {
                obtenerClientesVendedor: obtenerClientesVendedor.map(clienteState => 
                    clienteState.id === id ? actualizarCliente : clienteState  
                )
            }
        })

        cache.writeQuery({
            query: OBTENER_CLIENTE,
            variables: {id},
            data: {
                obtenerCliente: actualizarCliente
            }
        })

        }}
    )

    if(loading) return <Spinner />

    const {obtenerCliente} = data;

    const modificarCliente = async valores => {

        const {nombre, apellido, email, empresa, telefono} = valores

        try {
            const {data} = await actualizarCliente({
                variables: {
                    id,
                    input: {
                        nombre,
                        apellido,
                        email,
                        empresa,
                        telefono
                    }
                }
            })

            Swal.fire({
                title: "Actualizado",
                text: "El cliente se actualizo correctamente",
                icon: "success"
            })


            navigate('/usuario/clientes')
            
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <>
        <h1 className='text-gray-800 text-2xl'>Editar Cliente</h1>

        <div className='flex justify-center mt-5'>
            <div className=' w-full max-w-lg'>

            <Formik
                validationSchema={schemaValidation}
                enableReinitialize
                initialValues={obtenerCliente}
                onSubmit={(valores) => {
                    modificarCliente(valores);
                }}
            >

                {props => {

                    return (

                        <form className=' bg-white shadow-md p-8 mb-4'
                            onSubmit={props.handleSubmit}
                        >
                            <div className='mb-5'>
                                <label className=' block text-gray-700 text-sm font-bold mb-2'
                                    htmlFor='nombre'
                                >
                                    Nombre:
                                </label>

                                <input 
                                    id='nombre'
                                    className=' shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                    type='text'
                                    placeholder='Nombre Cliente'
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

                            <div className='mb-5'>
                                <label className=' block text-gray-700 text-sm font-bold mb-2'
                                    htmlFor='apellido'
                                >
                                    Apellido:
                                </label>

                                <input 
                                    id='apellido'
                                    className=' shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                    type='text'
                                    placeholder='Apellido Cliente'
                                    value={props.values.apellido}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                />
                            </div>

                            {props.touched.apellido && props.errors.apellido ? (
                                <div className='mt-2 mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                    <p className=' font-bold'>Error</p>
                                    <p>{props.errors.apellido}</p>
                                </div>
                            ) : null}

                            <div className='mb-5'>
                                <label className=' block text-gray-700 text-sm font-bold mb-2'
                                    htmlFor='empresa'
                                >
                                    Empresa:
                                </label>

                                <input 
                                    id='empresa'
                                    className=' shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                    type='text'
                                    placeholder='Empresa Cliente'
                                    value={props.values.empresa}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                />
                            </div>

                            {props.touched.empresa && props.errors.empresa ? (
                                <div className='mt-2 mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                    <p className=' font-bold'>Error</p>
                                    <p>{props.errors.empresa}</p>
                                </div>
                            ) : null}

                            <div className='mb-5'>
                                <label className=' block text-gray-700 text-sm font-bold mb-2'
                                    htmlFor='email'
                                >
                                    Email:
                                </label>

                                <input 
                                    id='email'
                                    className=' shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                    type='email'
                                    placeholder='Email Cliente'
                                    value={props.values.email}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                />
                            </div>

                            {props.touched.email && props.errors.email ? (
                                <div className='mt-2 mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                    <p className=' font-bold'>Error</p>
                                    <p>{props.errors.email}</p>
                                </div>
                            ) : null}

                            <div className='mb-5'>
                                <label className=' block text-gray-700 text-sm font-bold mb-2'
                                    htmlFor='telefono'
                                >
                                    Telefono:
                                </label>

                                <input 
                                    id='telefono'
                                    className=' shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                    type='tel'
                                    placeholder='Telefono Cliente'
                                    value={props.values.telefono}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                />
                            </div>

                            <input 
                            type='submit'
                            className=' bg-gray-800 w-full mt-5 py-2 px-4 text-white uppercase font-bold hover:bg-gray-900 transition-colors rounded-sm'
                            value='Editar cliente'
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

export default EditarCliente
