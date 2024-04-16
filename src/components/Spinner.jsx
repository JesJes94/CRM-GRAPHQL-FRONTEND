import '../../styles/spinner.css'

export default function Spinner() {
  return (
    <div className=' flex flex-col items-center'>
      <p className='text-xl text-gray-800 uppercase font-bold mb-5'>Cargando</p>
      <div className="sk-chase">
          <div className="sk-chase-dot"></div>
          <div className="sk-chase-dot"></div>
          <div className="sk-chase-dot"></div>
          <div className="sk-chase-dot"></div>
          <div className="sk-chase-dot"></div>
          <div className="sk-chase-dot"></div>
      </div>
    </div>
    
  )
}