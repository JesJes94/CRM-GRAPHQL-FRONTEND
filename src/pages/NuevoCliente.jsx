import { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMutation, gql } from '@apollo/client'


const NUEVO_CLIENTE = gql`
  mutation nuevoCliente($input: ClienteInput) {
    nuevoCliente(input: $input) {
      id
      nombre 
      apellido
      empresa
      email
      telefono
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

const NuevoCliente = () => {

  const [alerta, setAlerta] = useState('');

  const navigate = useNavigate();

  const {pathname} = useLocation();
  localStorage.setItem('lastpath', pathname);

  const [ nuevoCliente ] = useMutation(NUEVO_CLIENTE, {
    update(cache, { data: {nuevoCliente}}) {
      //Obtener el objeto de cacha que hay que actualizar
      
      const { obtenerClientesVendedor } = cache.readQuery({ query: OBTENER_CLIENTES_USUARIO})

      cache.writeQuery({
        query: OBTENER_CLIENTES_USUARIO,
        data: {
          obtenerClientesVendedor: [...obtenerClientesVendedor, nuevoCliente]
        }
      })

    }
  })

  const formik = useFormik({
    initialValues: {
      nombre:'',
      apellido:'',
      empresa:'',
      email:'',
      telefono:''
    },

    validationSchema: Yup.object({
      nombre: Yup.string()
                .required('El nombre del cliente es obligatorio'),
      apellido: Yup.string()
                .required('El apellido del cliente es obligatorio'),
      empresa: Yup.string()
                .required('La empresa del cliente es obligatoria'),
      email: Yup.string()
                .email('EL email no es válido')
                .required('El email es obligatorio')          
    }),

    onSubmit: async valores => {
      const {nombre, apellido, empresa, email, telefono} = valores

      try {
        const {data} = await nuevoCliente({
          variables: {
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
          title: 'Agregado',
          text: 'El cliente se agrego correctamente',
          icon: 'success'
        })

        navigate('/usuario/clientes');
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
        <div className='bg-white w-full max-w-md py-2 px-3 my-10 rounded-sm mx-auto'>
            <p className='text-center text-gray-800 text-sm uppercase font-bold'>{alerta}</p>
        </div>
    )
}

  return (
    <>
      <h1 className=' text-gray-800 text-2xl'>Nuevo Cliente</h1>

      {alerta && mostrarMensaje()}

      <div className='flex justify-center mt-5'>
        <div className=' w-full max-w-lg'>
          <form className=' bg-white shadow-md p-8 mb-4'
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
                    placeholder='Nombre Cliente'
                    value={formik.values.nombre}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
            </div>

            {formik.touched.nombre && formik.errors.nombre ? (
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
                    placeholder='Apellido Cliente'
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
                    htmlFor='empresa'
                >
                    Empresa:
                </label>

                <input 
                    id='empresa'
                    className=' shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                    type='text'
                    placeholder='Empresa Cliente'
                    value={formik.values.empresa}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
            </div>

            {formik.touched.empresa && formik.errors.empresa ? (
                <div className='mt-2 mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                    <p className=' font-bold'>Error</p>
                    <p>{formik.errors.empresa}</p>
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
                    htmlFor='telefono'
                >
                    Telefono:
                </label>

                <input 
                    id='telefono'
                    className=' shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                    type='tel'
                    placeholder='Telefono Cliente'
                    value={formik.values.telefono}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
            </div>

            <input 
              type='submit'
              className=' bg-gray-800 w-full mt-5 py-2 px-4 text-white uppercase font-bold hover:bg-gray-900 transition-colors rounded-sm'
              value='Registrar cliente'
            />
          </form>
        </div>
      </div>
    </>
  )
}

export default NuevoCliente
