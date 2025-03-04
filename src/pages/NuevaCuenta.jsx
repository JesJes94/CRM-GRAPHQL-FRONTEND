import { useState } from 'react'
import {useFormik} from 'formik'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import { useMutation, gql } from '@apollo/client'

const NUEVA_CUENTA = gql`
        mutation nuevoUsuario($input: UsuarioInput){
            nuevoUsuario(input: $input){
                id
                nombre
                apellido
                email
            }
        }    
    `

const NuevaCuenta = () => {

    const [alerta, setAlerta] = useState('');

    const navigate = useNavigate();

    const [nuevoUsuario] = useMutation(NUEVA_CUENTA)

    const formik = useFormik({
        initialValues: {
            nombre: '',
            apellido: '',
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            nombre: Yup.string()
                        .required('El nombre es obligatorio'),
            apellido: Yup.string()
                        .required('El apellido es obligatorio'),
            email: Yup.string()
                        .email('El email no es válido')
                        .required('El email es obligatorio'),
            password: Yup.string()
                        .required('El password no puede ir vació')
                        .min(6, 'El password debe tener mínimo 6 carácteres')
        }),

        onSubmit: async valores => {

            const {nombre, apellido, email, password} = valores

            try {
                const {data} = await nuevoUsuario({
                    variables: {
                        input: {
                            nombre,
                            apellido,
                            email,
                            password
                        }
                    }
                });

                setAlerta(`El usuario ${data.nuevoUsuario.nombre}  se creo correctamente`);

                setTimeout(() => {
                    setAlerta('');
                    navigate('/login');
                }, 3000);


            } catch (error) {
                setAlerta(error.message.replace('GraphQL error: ', ''))

                setTimeout(() => {
                    setAlerta('');
                }, 3000);
            }
        }
    })

    const mostrarMensaje = () => {
        return (
            <div className='bg-white w-full max-w-md py-2 px-3 mb-10 rounded-sm mx-auto'>
                <p className='text-center text-gray-800 text-sm uppercase font-bold'>{alerta}</p>
            </div>
        )
    }

  return (
    <div>

        {alerta && mostrarMensaje()}

        <h1 className='text-center text-white text-2xl'>
            Crea una Nueva Cuenta
        </h1>

        <div className=' flex justify-center mt-10'>
            <div className='w-full max-w-md'>
                <form className=' bg-white rounded-md shadow-md px-10 py-8'
                    onSubmit={formik.handleSubmit}
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
                            placeholder='Nombre Usuario'
                            value={formik.values.nombre}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </div>

                    {formik.touched.nombre && formik.errors.nombre  ? (
                        <div className='mt-2 mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                            <p className=' font-bold'>Error</p>
                            <p>{formik.errors.nombre}</p>
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
                            placeholder='Apellido Usuario'
                            value={formik.values.apellido}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </div>

                    {formik.touched.apellido && formik.errors.apellido ? (
                        <div className='mt-2 mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                            <p className=' font-bold'>Error</p>
                            <p>{formik.errors.apellido}</p>
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
                            placeholder='Email Usuario'
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </div>

                    {formik.touched.email && formik.errors.email ? (
                        <div className='mt-2 mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                            <p className=' font-bold'>Error</p>
                            <p>{formik.errors.email}</p>
                        </div>
                    ) : null}

                    <div className='mb-5'>
                        <label className=' block text-gray-700 text-sm font-bold mb-2'
                            htmlFor='password'
                        >
                            Password:
                        </label>

                        <input 
                            id='password'
                            className=' shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                            type='password'
                            placeholder='Password Usuario'
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </div>

                    {formik.touched.password && formik.errors.password ? (
                        <div className='mt-2 mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                            <p className=' font-bold'>Error</p>
                            <p>{formik.errors.password}</p>
                        </div>
                    ) : null}

                    <input 
                        type='submit'
                        className='bg-gray-800 w-full px-3 py-2 text-white uppercase hover:bg-gray-900 transition-colors'
                        value='Crear Cuenta'
                    />
                </form>
            </div>
        </div>
    </div>
  )
}

export default NuevaCuenta
