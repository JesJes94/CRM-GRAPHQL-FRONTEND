import { useLocation, useNavigate } from 'react-router-dom';
import { useMutation, gql } from '@apollo/client';
import Swal from 'sweetalert2'

import { useFormik } from 'formik'
import * as Yup from 'yup'

const NUEVO_PRODUCTO = gql`
  mutation nuevoProducto($input: ProductoInput) {
    nuevoProducto(input: $input) {
      id
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

const NuevoProducto = () => {

    const navigate = useNavigate();

    const {pathname} = useLocation();
    localStorage.setItem('lastpath', pathname);

    const [nuevoProducto] = useMutation(NUEVO_PRODUCTO, {
      update(cache, { data: {nuevoProducto}}) {

        const { obtenerProductos } = cache.readQuery({ query: OBTENER_PRODUCTOS})

        cache.writeQuery({
          query: OBTENER_PRODUCTOS,
          data: {
            obtenerProductos: [...obtenerProductos, nuevoProducto]
          }
        })
      }});

    const formik = useFormik({
      initialValues: {
        nombre: '',
        cantidad: '',
        precio: ''
      },

      validationSchema: Yup.object({
        nombre: Yup.string()
          .required('El nombre del producto es obligatorio'),
        cantidad: Yup.number().
          required('Agrega una cantidad disponible').
          positive('No se aceptan valores negativos').integer('La cantidad deben ser numeros enteros'),
        precio: Yup.number()
          .required('El precio del producto es obligatorio')
          .positive('No se aceptan números negativos')
      }),

      onSubmit: async valores => {

        const {nombre, cantidad, precio} = valores

        try {
          const {data} = await nuevoProducto({
            variables: { 
              input: {
                nombre,
                cantidad,
                precio
              }
            }
          })

          Swal.fire({
            title: 'Creado',
            text: 'El producto se agrego correctamente',
            icon: 'success'
          })

          navigate('/usuario/productos')

        } catch (error) {
          console.log(error)
        }
      }
    })


  return (
    <>
      <h1 className='text-2xl text-gray-800'>Nuevo Producto</h1>

      <div className=' flex justify-center mt-5'>
        <div className='w-full max-w-lg'>
          <form className=' bg-white shadow-md p-8 mt-4'
            onSubmit={formik.handleSubmit}
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
                value={formik.values.cantidad}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            {formik.touched.cantidad && formik.errors.cantidad ? (
                <div className='mt-2 mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                    <p className=' font-bold'>Error</p>
                    <p>{formik.errors.cantidad}</p>
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
                value={formik.values.precio}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            {formik.touched.precio && formik.errors.precio ? (
                <div className='mt-2 mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                    <p className=' font-bold'>Error</p>
                    <p>{formik.errors.precio}</p>
                </div>
            ) : null}

            <input 
              type='submit'
              className=' bg-gray-800 w-full mt-5 py-2 px-4 text-white uppercase font-bold hover:bg-gray-900 transition-colors rounded-sm'
              value=' Agregar Producto'
            />
          </form>
        </div>
      </div>
    </>
  )
}

export default NuevoProducto
