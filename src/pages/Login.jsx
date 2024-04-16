import { useState, useEffect } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useMutation, gql } from '@apollo/client'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const AUTENTICAR_USUARIO = gql`
    mutation autenticarUsuario($input: AutenticarInput) {
        autenticarUsuario(input: $input) {
            token
        }
    }    

`

const Login = () => {

    const [alerta, setAlerta] = useState('');
    const { handleSetAutenticado } = useAuth();

    const navigate = useNavigate();

    useEffect( () => {
        const path = localStorage.getItem('lastpath') ?? '/'
        const token = localStorage.getItem('token');

        if(token) {
            handleSetAutenticado();
            navigate(path);
        }

    }, [])

    const [ autenticarUsuario ] = useMutation(AUTENTICAR_USUARIO);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string()
                    .email('El email no es válido')
                    .required('El email es obligatorio'),
            password: Yup.string()
                    .required('El password es obligatorio')
        }),
        onSubmit: async valores => {
            const {email, password} = valores;

            try {
                const {data} = await autenticarUsuario({
                    variables: {
                        input: {
                            email,
                            password
                        }
                    }
                })

                setAlerta('Autenticando...')

                const { token } = data.autenticarUsuario;
                localStorage.setItem('token', token);

                setTimeout(() => {
                    setAlerta('');
                    handleSetAutenticado();
                    navigate('/usuario/clientes');
                }, 2000);

            } catch (error) {
                setAlerta(error.message.replace('GraphQL error: ', ''))

                setTimeout(() => {
                    setAlerta('');
                }, 3000);
            }
        }
    });

    const mostrarMensaje = () => {
        return (
            <div className='bg-white w-full max-w-md py-2 px-3 mb-10 rounded-sm mx-auto'>
                <p className='text-center text-gray-800 text-sm uppercase font-bold'>{alerta}</p>
            </div>
        )
    }

  return (
    <>
        {alerta && mostrarMensaje()}

        <h1 className='text-center text-white text-2xl'>
            Iniciar Sesión
        </h1>

        <div className=' flex justify-center mt-10'>
            <div className='w-full max-w-md'>
                <form className=' bg-white rounded-md shadow-md px-10 py-8'
                    onSubmit={formik.handleSubmit}
                >

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
                        value='Iniciar Sesión'
                    />
                </form>
            </div>
        </div>
    </>
  )
}

export default Login
